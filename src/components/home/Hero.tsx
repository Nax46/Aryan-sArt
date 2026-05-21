import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const Hero = () => (
  <section className="relative min-h-[88vh] sm:min-h-[92vh] flex items-center overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0 z-0">
      <img
        src="/hero-bg.jfif"
        alt=""
        className="w-full h-full object-cover scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#2a1810]/85 via-[#4a2511]/70 to-[#7E1E1E]/40" />
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(180,120,80,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(126,30,30,0.3) 0%, transparent 40%)",
          backgroundSize: "200% 200%",
        }}
      />
    </div>

    {/* Floating decor */}
    <motion.div
      className="absolute top-[18%] left-[8%] w-16 h-16 sm:w-24 sm:h-24 rounded-full border border-[#F9F7F5]/20 backdrop-blur-sm hidden sm:block"
      animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute bottom-[25%] right-[10%] w-12 h-12 sm:w-20 sm:h-20 rounded-2xl bg-[#7E1E1E]/20 border border-white/10 backdrop-blur-md"
      animate={{ y: [0, 10, 0], rotate: [0, -8, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    />
    <motion.div
      className="absolute top-[40%] right-[20%] text-[#F9F7F5]/15"
      animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.1, 1] }}
      transition={{ duration: 4, repeat: Infinity }}
    >
      <Sparkles className="w-8 h-8 sm:w-12 sm:h-12" />
    </motion.div>

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
      <div className="max-w-3xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-[#F9F7F5]/70 font-body mb-4"
        >
          Premium Handcrafted Wooden Art
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.08] mb-6"
        >
          Crafted With Wood,
          <br />
          <span className="italic text-[#E8D5C4]">Designed With Emotion</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-lg text-white/85 font-body leading-relaxed max-w-xl mb-10"
        >
          Transform your space with premium handcrafted wooden art and decor.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/home/featured-products"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-[#7E1E1E] text-white font-body text-sm font-semibold tracking-wider uppercase rounded-xl hover:bg-[#6a1a1a] shadow-[0_12px_40px_rgba(126,30,30,0.4)] hover:shadow-[0_16px_48px_rgba(126,30,30,0.5)] hover:-translate-y-0.5 transition-all duration-300"
          >
            Shop Now
          </Link>
          <Link
            to="/collections"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-white/10 text-white font-body text-sm font-semibold tracking-wider uppercase rounded-xl border border-white/40 backdrop-blur-md hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300"
          >
            Explore Collections
          </Link>
        </motion.div>
      </div>
    </div>

    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
  </section>
);

export default Hero;
