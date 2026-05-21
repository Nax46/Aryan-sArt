import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import PageLayout from "./PageLayout";
import type { PageMeta } from "@/config/pageRegistry";

interface PlaceholderPageProps {
  meta: PageMeta;
}

const PlaceholderPage = ({ meta }: PlaceholderPageProps) => (
  <PageLayout meta={meta}>
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      className="rounded-2xl border border-[#7E1E1E]/12 bg-gradient-to-br from-[#F9F7F5] via-white to-[#F3EDE8] p-8 sm:p-12 shadow-[0_20px_60px_rgba(62,24,24,0.06)]"
    >
      <div className="flex flex-col items-center text-center max-w-md mx-auto gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[#7E1E1E]/8 flex items-center justify-center">
          <Sparkles className="w-7 h-7 text-[#7E1E1E]/60" />
        </div>
        <p className="font-body text-sm text-[#7E1E1E]/55 leading-relaxed">
          This page is ready for content. Products and catalog data will appear here soon.
        </p>
        <p className="text-[10px] tracking-widest uppercase text-[#7E1E1E]/35 font-body">
          {meta.path}
        </p>
      </div>
    </motion.div>
  </PageLayout>
);

export default PlaceholderPage;
