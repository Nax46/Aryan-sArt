import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Jaipur, Rajasthan",
    rating: 5,
    review:
      "The wooden mountain wall art exceeded every expectation. Grain detail is stunning and packaging felt as premium as the piece itself.",
    initials: "PS",
  },
  {
    name: "Rahul Mehta",
    location: "Mumbai, Maharashtra",
    rating: 5,
    review:
      "Ordered a custom name plate for our studio. OnCanvas delivered precise engraving and a finish that looks luxury, not mass-produced.",
    initials: "RM",
  },
  {
    name: "Ananya Reddy",
    location: "Hyderabad, Telangana",
    rating: 5,
    review:
      "LED moon lamp is the centerpiece of our bedroom. Warm light, beautiful wood base — guests always ask where it's from.",
    initials: "AR",
  },
  {
    name: "Vikram Singh",
    location: "Delhi NCR",
    rating: 4,
    review:
      "Desk organizer and wall clock matched perfectly for my home office. Craftsmanship reflects real Bundi artistry.",
    initials: "VS",
  },
];

const Testimonials = () => (
  <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#F9F7F5]/60">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-[#7E1E1E]/50 font-body mb-2">Trusted by Homes Across India</p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#7E1E1E] italic">Customer Stories</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative rounded-2xl border border-[#7E1E1E]/10 bg-white p-6 sm:p-8 shadow-[0_12px_40px_rgba(62,24,24,0.06)] hover:shadow-[0_20px_50px_rgba(62,24,24,0.1)] transition-shadow duration-400"
          >
            <Quote className="w-8 h-8 text-[#7E1E1E]/15 absolute top-6 right-6" />
            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-amber-500 text-amber-500" />
              ))}
            </div>
            <p className="font-body text-[#4A2511]/80 leading-relaxed mb-6 text-sm sm:text-base">{t.review}</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7E1E1E] to-[#4A2511] flex items-center justify-center text-white font-display font-bold text-sm">
                {t.initials}
              </div>
              <div>
                <p className="font-body font-semibold text-[#4A2511]">{t.name}</p>
                <p className="text-xs text-[#7E1E1E]/50 font-body">{t.location}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
