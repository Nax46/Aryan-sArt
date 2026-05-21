import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { getPageMeta } from "@/config/pageRegistry";
import CustomDesignForm from "@/components/custom-design/CustomDesignForm";

const meta = getPageMeta("/custom-design");

const CustomDesignPage = () => (
  <PageLayout meta={meta}>
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-[#7E1E1E]/12 bg-gradient-to-br from-[#FFFCFA] via-white to-[#F3EDE8] p-6 sm:p-10 mb-8 shadow-[0_16px_48px_rgba(62,24,24,0.06)]"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#7E1E1E]/10 flex items-center justify-center shrink-0">
          <Sparkles className="w-6 h-6 text-[#7E1E1E]" />
        </div>
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#7E1E1E] italic mb-2">
            Bespoke Wooden Creations
          </h2>
          <p className="text-sm text-[#4A2511]/65 font-body leading-relaxed max-w-2xl">
            Share your ideas, references, and preferences. Our craftsmen in Bundi will bring your
            custom lamp, name board, art piece, or photo frame to life with precision CNC and
            hand-finished detail.
          </p>
        </div>
      </div>
    </motion.div>
    <CustomDesignForm />
  </PageLayout>
);

export default CustomDesignPage;
