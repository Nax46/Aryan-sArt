import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";

const Philosophy = () => {
  const ref = useScrollFadeIn();

  return (
    <section id="philosophy" className="bg-ink text-parchment py-20 sm:py-32 px-4" ref={ref}>
      <div className="max-w-4xl mx-auto text-center">
        <blockquote className="text-2xl sm:text-4xl md:text-5xl font-display italic font-light leading-snug mb-8">
          "We don't just craft decor. We shape the quiet corners of your home, where light rests and stories settle."
        </blockquote>
        <p className="font-body text-sm sm:text-base text-sand/70 max-w-2xl mx-auto leading-relaxed">
          Canvas is born from the belief that everyday objects should carry meaning. Each piece is designed in our Bundi studio, 
          precision CNC and laser cut with care, and finished by artisan hands — merging modern precision with tradition, form with feeling.
        </p>
      </div>
    </section>
  );
};

export default Philosophy;
