interface PageHeroProps {
  badge?: string;
  title: string | React.ReactNode;
  description?: string;
}

export function PageHero({ badge, title, description }: PageHeroProps) {
  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-muted/50 to-background">
      <div className="container-wide text-center">
        {badge && (
          <div className="inline-block mb-4">
            <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
              {badge}
            </span>
          </div>
        )}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{title}</h1>
        {description && (
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{description}</p>
        )}
      </div>
    </section>
  );
}
