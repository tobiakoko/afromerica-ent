import type { CTASectionProps } from '@/types';

export function CTASection({ title, description, buttonText, buttonHref }: CTASectionProps) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-lime-400 to-lime-500 p-16 text-center">
          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              {title}
            </h2>
            <p className="text-black/80 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              {description}
            </p>
            <a
              href={buttonHref}
              className="inline-block px-8 py-4 bg-black text-white font-semibold rounded-lg hover:bg-black/90 transition-colors duration-200"
            >
              {buttonText}
            </a>
          </div>

          {/* Decorative Blurs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </section>
  );
}