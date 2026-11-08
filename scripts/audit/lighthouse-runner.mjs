// Lighthouse lab measurements; unlike CrUX, these are not field Core Web Vitals.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const toolRoot=process.env.AUDIT_TOOLS;
const base=process.env.AUDIT_SITE_URL;
const routes=JSON.parse(process.env.AUDIT_ROUTES_JSON || '[["home","/"]]');
const dir='artifacts/lighthouse';
fs.mkdirSync(dir,{recursive:true});
const summary=[];
const bin=path.join(toolRoot,'node_modules','.bin','lighthouse');
for(const [name,route] of routes){
 for(const device of ['mobile','desktop']){
  const url=new URL(route,base).toString();
  const prefix=path.join(dir,name+'-'+device);
  const args=[url,'--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage',
    '--output=json','--output=html','--output-path='+prefix,'--quiet'];
  args.push(device==='desktop'?'--preset=desktop':'--form-factor=mobile');
  const run=spawnSync(bin,args,{encoding:'utf8',timeout:210000,maxBuffer:1024*1024});
  const entry={page:name,device,url,exitCode:run.status,report:null,error:null};
  const filename=prefix+'.report.json';
  try{
    const d=JSON.parse(fs.readFileSync(filename,'utf8'));
    const score=k=>d.categories?.[k]?.score == null?null:Math.round(d.categories[k].score*100);
    const metric=k=>d.audits?.[k]?.numericValue??null;
    Object.assign(entry,{report:filename,capturedAt:d.fetchTime,finalUrl:d.finalDisplayedUrl,
      performance:score('performance'),accessibility:score('accessibility'),
      bestPractices:score('best-practices'),seo:score('seo'),
      lcpMs:metric('largest-contentful-paint'),fcpMs:metric('first-contentful-paint'),
      cls:metric('cumulative-layout-shift'),tbtMs:metric('total-blocking-time'),speedIndexMs:metric('speed-index')});
  }catch(e){entry.error=(String(e)+'; '+(run.stderr||'')).slice(0,700);}
  summary.push(entry);
  console.log(JSON.stringify(entry));
 }
}
fs.writeFileSync(path.join(dir,'summary.json'),JSON.stringify({
 note:'Single Lighthouse lab observations, not real-user Core Web Vitals; Lighthouse cannot report field INP.',
 measuredAt:new Date().toISOString(),results:summary
},null,2));
if(summary.every(r=>!r.report))process.exitCode=1;
