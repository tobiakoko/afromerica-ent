// Read-only captures of the live production website. Run only from the audit workflow.
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
const toolRoot = process.env.AUDIT_TOOLS;
if (!toolRoot) throw new Error('AUDIT_TOOLS must point to isolated audit dependencies');
const req = createRequire(path.join(toolRoot, 'audit-entry.cjs'));
const { chromium } = req('playwright');
const sharp = req('sharp');
const baseUrl = process.env.AUDIT_SITE_URL;
const routes = JSON.parse(process.env.AUDIT_ROUTES_JSON || '[["home","/"]]');
const brand = process.env.AUDIT_BRAND || 'Website';
const accent = process.env.AUDIT_ACCENT || '#D8B56A';
const dark = process.env.AUDIT_BACKGROUND || '#132039';
const sectionsEnabled = process.env.AUDIT_CAPTURE_SECTIONS === 'true';
const outDir = 'artifacts/site-captures';
const profiles = [
  { name: 'desktop', width: 1440, height: 900, mobile: false },
  { name: 'mobile', width: 390, height: 844, mobile: true }
];
await fs.mkdir(outDir, { recursive: true });
const result = { source: 'actual production browser rendering', origin: baseUrl, brand, capturedAt: new Date().toISOString(), pages: [], composites: [] };
const browser = await chromium.launch({headless: true});
try {
  for (const profile of profiles) {
    const context = await browser.newContext({
      viewport: {width: profile.width, height: profile.height},
      deviceScaleFactor: 2, isMobile: profile.mobile, hasTouch: profile.mobile,
      locale: 'en-US', colorScheme: 'light', reducedMotion: 'reduce'
    });
    for (const [name, route] of routes) {
      const url = new URL(route, baseUrl).toString();
      const item = {name, profile:profile.name, url, status:null, ok:false, title:null, sectionFiles:[], consoleErrors:[]};
      const page = await context.newPage();
      page.on('pageerror', e => {if(item.consoleErrors.length<12)item.consoleErrors.push(String(e));});
      try {
        const response = await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
        item.status = response?.status() ?? null;
        if(!response || item.status >= 400)throw new Error('HTTP '+item.status);
        await page.waitForLoadState('networkidle',{timeout:9000}).catch(()=>{});
        await page.evaluate(async () => {
          await document.fonts.ready;
          await Promise.race([
            Promise.all(Array.from(document.images).map(img => img.complete ? Promise.resolve() :
              new Promise(resolve => {img.addEventListener('load',resolve,{once:true});img.addEventListener('error',resolve,{once:true});})
            )),
            new Promise(resolve => setTimeout(resolve,8000))
          ]);
        });
        await page.waitForTimeout(850);
        const maxHeight = Math.min(20000, await page.evaluate(()=>document.documentElement.scrollHeight));
        for(let y=0; y<maxHeight; y+=Math.floor(profile.height*0.85)){
          await page.evaluate(v=>window.scrollTo(0,v),y);
          await page.waitForTimeout(100);
        }
        await page.evaluate(()=>window.scrollTo(0,0));
        await page.waitForTimeout(500);
        item.title = await page.title();
        item.scrollHeight = maxHeight;
        item.horizontalOverflow = await page.evaluate(()=>document.documentElement.scrollWidth > innerWidth + 1);
        const stem = path.join(outDir,name+'-'+profile.name);
        await page.screenshot({path:stem+'-viewport.png',animations:'disabled',caret:'hide',scale:'device'});
        await page.screenshot({path:stem+'-full.png',fullPage:true,animations:'disabled',caret:'hide',scale:'css'});
        item.ok = true;
        if(sectionsEnabled && route === '/'){
          const sectionList = page.locator('main section');
          const sections = (await sectionList.count()) ? sectionList : page.locator('section');
          const n = Math.min(9, await sections.count());
          let collected = 0;
          for(let i=0;i<n && collected<5;i++){
            const node = sections.nth(i);
            try {
              const rect=await node.boundingBox();
              if(!rect || rect.height<120 || rect.height>2700 || rect.width<260)continue;
              const file=stem+'-section-'+String(i+1).padStart(2,'0')+'.png';
              await node.screenshot({path:file,animations:'disabled',caret:'hide',timeout:13000,scale:'css'});
              item.sectionFiles.push(file);
              collected++;
            }catch(e){item.sectionFiles.push('Section '+(i+1)+' unavailable: '+String(e).slice(0,100));}
          }
        }
      } catch(e) {item.error=String(e);}
      result.pages.push(item);
      console.log(JSON.stringify(item));
      await page.close();
    }
    await context.close();
  }
}finally{await browser.close();}
function xmlEscape(s){return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&apos;');}
for(const [name] of routes){
  const desktop = path.join(outDir,name+'-desktop-viewport.png');
  const mobile = path.join(outDir,name+'-mobile-viewport.png');
  try{
    await Promise.all([fs.access(desktop),fs.access(mobile)]);
    const d = await sharp(desktop).resize(1432,895,{fit:'fill'}).png().toBuffer();
    const m = await sharp(mobile).resize(310,670,{fit:'fill'}).png().toBuffer();
    const bg = '<svg width="1920" height="1220" viewBox="0 0 1920 1220" xmlns="http://www.w3.org/2000/svg">'+
      '<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+dark+'"/><stop offset="1" stop-color="#070C17"/></linearGradient>'+
      '<filter id="shadow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="24"/></filter></defs>'+
      '<rect width="1920" height="1220" fill="url(#bg)"/>'+
      '<circle cx="1740" cy="70" r="455" fill="'+accent+'" opacity=".065"/>'+
      '<circle cx="100" cy="1150" r="390" fill="'+accent+'" opacity=".055"/>'+
      '<rect x="126" y="189" width="1448" height="955" rx="24" fill="#000" opacity=".55" filter="url(#shadow)"/>'+
      '<rect x="110" y="167" width="1460" height="979" rx="21" fill="#EAEFF4"/>'+
      '<rect x="110" y="167" width="1460" height="55" rx="21" fill="#F2F4F7"/>'+
      '<rect x="110" y="201" width="1460" height="21" fill="#F2F4F7"/>'+
      '<circle cx="138" cy="194" r="6" fill="#FB6B65"/><circle cx="159" cy="194" r="6" fill="#F6C453"/><circle cx="180" cy="194" r="6" fill="#5FC899"/>'+
      '<rect x="720" y="180" width="260" height="28" rx="14" fill="#E4E8EE"/>'+
      '<rect x="1490" y="295" width="333" height="765" rx="50" fill="#000" opacity=".6" filter="url(#shadow)"/>'+
      '<rect x="1480" y="280" width="340" height="790" rx="50" fill="#11151D" stroke="#667084" stroke-width="5"/>'+
      '<rect x="1490" y="328" width="320" height="678" rx="10" fill="#F8FAFC"/>'+
      '<rect x="1590" y="302" width="120" height="8" rx="4" fill="#404854"/>'+
      '<rect x="1580" y="1034" width="140" height="5" rx="3" fill="#737A84"/>'+
      '<text x="110" y="91" font-size="28" letter-spacing="3" font-family="Arial,sans-serif" font-weight="700" fill="#F4F6FA">'+xmlEscape(brand.toUpperCase())+'</text>'+
      '<rect x="111" y="112" width="58" height="5" rx="3" fill="'+accent+'"/>'+
      '<text x="185" y="122" font-size="17" font-family="Arial,sans-serif" fill="#CBD4E4">PRODUCTION WEBSITE  /  '+xmlEscape(name.toUpperCase())+'</text>'+
      '<text x="115" y="1180" font-size="15" letter-spacing="2" font-family="Arial,sans-serif" fill="#AEBACB">AUTHENTIC BROWSER CAPTURE</text>'+
      '<text x="1742" y="1180" text-anchor="end" font-size="15" font-family="Arial,sans-serif" fill="#AEBACB">DESKTOP + MOBILE</text>'+
      '</svg>';
    const output=path.join(outDir,name+'-portfolio-composite.png');
    await sharp(Buffer.from(bg)).composite([{input:d,top:222,left:124},{input:m,top:332,left:1495}]).png({compressionLevel:9}).toFile(output);
    result.composites.push(output);
    console.log('Portfolio composite created: '+output);
  }catch(e){console.error('Portfolio composite unavailable for '+name+': '+e);}
}
await fs.writeFile(path.join(outDir,'capture-metadata.json'),JSON.stringify(result,null,2));
if(!result.pages.some(p=>p.ok))process.exitCode=1;
