const Hero = () => (
  <section className="relative overflow-hidden min-h-[80vh] flex items-center justify-center px-4">
    {/* Background Image Layer */}
    <div className="absolute inset-0 z-0">
      <img
        src="/hero-bg.jfif"
        alt="Hero Background"
        className="w-full h-full object-cover blur-sm scale-105"
      />
      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />
    </div>

    <div className="relative z-10 max-w-4xl mx-auto text-center">
      <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-light leading-[1.1] text-white mb-6 animate-fade-up">
        Hand-crafted CNC Temples
        <br />
        <span className="italic text-primary font-medium">&amp;</span> Wooden Interiors
      </h2>
      <p className="text-base sm:text-lg text-white/90 font-body max-w-xl mx-auto mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: '0.2s' }}>
        Made in Bundi, Rajasthan. Everyday objects crafted through traditional artistry and modern precision machinery to breathe life into your spaces.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.4s' }}>
        <a
          href="#arrivals"
          className="px-8 py-3 bg-primary text-primary-foreground font-body text-sm tracking-wider uppercase hover:bg-primary/90 transition-transform hover:scale-105 active:scale-95 duration-300"
        >
          Explore Collection
        </a>
        <a
          href="#custom-order"
          className="px-8 py-3 bg-secondary text-secondary-foreground font-body text-sm tracking-wider uppercase hover:bg-secondary/90 transition-transform hover:scale-105 active:scale-95 duration-300 border border-secondary"
        >
          Custom Order
        </a>

      </div>
    </div>
  </section>
);

export default Hero;
