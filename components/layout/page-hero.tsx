import type { PageHeroProps } from '@/types';

export function PageHero({ badge, title, description, centered = true }: PageHeroProps) {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-lime-400/5 via-transparent to-transparent"></div>
      
      <div className="container mx-auto px-8 relative z-10">
        <div className={`max-w-4xl ${centered ? 'mx-auto text-center' : ''}`}>
          {/* Badge */}
          {badge && (
            <div className={`${centered ? 'inline-block' : ''} mb-6`}>
              <span className="inline-flex items-center px-4 py-2 bg-lime-400/10 text-lime-400 text-xs font-bold uppercase tracking-wider rounded-full border border-lime-400/20">
                {badge}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="mb-6 font-light text-6xl md:text-8xl text-white leading-tight">
            {title}
          </h1>

          {/* Description */}
          <p className={`text-xl text-white/70 leading-relaxed ${centered ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}>
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}