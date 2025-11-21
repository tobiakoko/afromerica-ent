interface PageHeroProps {
  badge?: string;
  title: string | React.ReactNode;
  description?: string;
}

export function PageHero({ badge, title, description }: PageHeroProps) {
  return (
    <section className="relative py-20 md:py-28 lg:py-32 overflow-hidden">
      {/* Apple-style gradient background */}
      <div className="absolute inset-0 bg-linear-to-b from-gray-50 via-white to-transparent dark:from-gray-900/50 dark:via-gray-950 dark:to-transparent" />

      <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 text-center">
        {/* Badge with glassmorphism */}
        {badge && (
          <div className="inline-block mb-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <span className="px-4 py-2 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-md text-gray-900 dark:text-white rounded-full text-sm font-medium shadow-sm border border-gray-200/60 dark:border-gray-700/60">
              {badge}
            </span>
          </div>
        )}

        {/* Large, bold headline with tight tracking */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-3 duration-700 delay-100">
          {title}
        </h1>

        {/* Light, large description text */}
        {description && (
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed font-light animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
