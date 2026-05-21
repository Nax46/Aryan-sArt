import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
}

const SectionHeader = ({ eyebrow, title, subtitle, href, linkLabel = "View all" }: SectionHeaderProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-12"
  >
    <div>
      <p className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#7E1E1E]/50 font-body mb-2">
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#7E1E1E] italic leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 max-w-lg text-sm text-[#4A2511]/65 font-body leading-relaxed">{subtitle}</p>
      )}
    </div>
    {href && (
      <Link
        to={href}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#7E1E1E] font-body hover:gap-3 transition-all group"
      >
        {linkLabel}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    )}
  </motion.div>
);

export default SectionHeader;
