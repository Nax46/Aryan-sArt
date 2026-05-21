import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Palette, Upload } from "lucide-react";

const PersonalizedBanner = () => (
  <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative rounded-3xl overflow-hidden min-h-[320px] sm:min-h-[380px] flex items-center"
      >
        <img
          src="https://images.unsplash.com/photo-1452860606248-08befadbe6f8?auto=format&fit=crop&w=1400&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2a1810]/95 via-[#4a2511]/80 to-[#7E1E1E]/50" />
        <div className="relative z-10 px-8 sm:px-14 py-12 sm:py-16 max-w-2xl">
          <p className="text-xs tracking-[0.3em] uppercase text-[#E8D5C4]/70 font-body mb-3">Bespoke Craftsmanship</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white italic mb-4 leading-tight">
            Create Your Own Wooden Story
          </h2>
          <p className="text-white/80 font-body text-sm sm:text-base leading-relaxed mb-8 max-w-md">
            Upload your design or work with our artisans for personalized art, frames, lamps, and name boards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/custom-design/upload-custom-design"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-[#7E1E1E] font-body font-semibold text-sm rounded-xl hover:bg-[#F9F7F5] transition-all hover:-translate-y-0.5 shadow-lg"
            >
              <Upload className="w-4 h-4" /> Upload Design
            </Link>
            <Link
              to="/custom-design"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/50 text-white font-body font-semibold text-sm rounded-xl hover:bg-white/10 transition-all hover:-translate-y-0.5"
            >
              <Palette className="w-4 h-4" /> Customize Now
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default PersonalizedBanner;
