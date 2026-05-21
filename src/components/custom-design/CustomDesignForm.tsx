import { useState } from "react";
import { motion } from "framer-motion";
import { Lamp, Frame, Palette, ImageIcon, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ImageUploadZone, { type UploadedImage } from "./ImageUploadZone";
import { cn } from "@/lib/utils";

const DESIGN_TYPES = [
  { id: "custom-lamp", label: "Custom Lamp", icon: Lamp },
  { id: "custom-name-board", label: "Custom Name Board", icon: Frame },
  { id: "personalized-art", label: "Personalized Wooden Art", icon: Palette },
  { id: "photo-frame", label: "Photo To Wooden Frame", icon: ImageIcon },
] as const;

const DIMENSIONS = ["Small (12×12 in)", "Medium (18×24 in)", "Large (24×36 in)", "Custom Size"];
const MATERIALS = ["Teak", "Sheesham", "MDF Premium", "Plywood Grade A"];
const COLORS = ["Natural Wood", "Walnut Stain", "Honey Oak", "Ebony", "Whitewash"];

const CustomDesignForm = () => {
  const [designType, setDesignType] = useState<string>(DESIGN_TYPES[0].id);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [notes, setNotes] = useState("");
  const [dimension, setDimension] = useState(DIMENSIONS[1]);
  const [material, setMaterial] = useState(MATERIALS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error("Please upload at least one reference image");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    toast.success("Design request submitted!", {
      description: "Our artisans will review your files and contact you within 48 hours.",
    });
    setImages([]);
    setNotes("");
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      <section>
        <h2 className="font-display text-xl font-bold text-[#7E1E1E] italic mb-4">
          What would you like to create?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DESIGN_TYPES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setDesignType(id)}
              className={cn(
                "flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-300",
                designType === id
                  ? "border-[#7E1E1E] bg-[#7E1E1E]/8 shadow-[0_8px_24px_rgba(126,30,30,0.12)]"
                  : "border-[#7E1E1E]/12 bg-white hover:border-[#7E1E1E]/25 hover:bg-[#FFFCFA]",
              )}
            >
              <div
                className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
                  designType === id ? "bg-[#7E1E1E] text-white" : "bg-[#7E1E1E]/8 text-[#7E1E1E]",
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="font-body font-semibold text-sm text-[#4A2511]">{label}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-bold text-[#7E1E1E] italic mb-4">
          Upload your reference
        </h2>
        <ImageUploadZone images={images} onChange={setImages} maxFiles={5} />
      </section>

      <section className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#7E1E1E]/50 font-body mb-2">
            Dimensions
          </label>
          <select
            value={dimension}
            onChange={(e) => setDimension(e.target.value)}
            className="w-full h-11 px-3 rounded-xl border border-[#7E1E1E]/15 bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#7E1E1E]/20"
          >
            {DIMENSIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#7E1E1E]/50 font-body mb-2">
            Material
          </label>
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="w-full h-11 px-3 rounded-xl border border-[#7E1E1E]/15 bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#7E1E1E]/20"
          >
            {MATERIALS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#7E1E1E]/50 font-body mb-2">
            Finish / Color
          </label>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-11 px-3 rounded-xl border border-[#7E1E1E]/15 bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#7E1E1E]/20"
          >
            {COLORS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section>
        <label className="block text-xs uppercase tracking-wider text-[#7E1E1E]/50 font-body mb-2">
          Additional notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Describe your vision, text to engrave, placement, or special instructions..."
          className="w-full px-4 py-3 rounded-xl border border-[#7E1E1E]/15 bg-white font-body text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#7E1E1E]/20 placeholder:text-[#7E1E1E]/35"
        />
      </section>

      <motion.button
        type="submit"
        disabled={submitting}
        whileHover={{ scale: submitting ? 1 : 1.02 }}
        whileTap={{ scale: submitting ? 1 : 0.98 }}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-[#7E1E1E] text-white font-body font-semibold text-sm hover:bg-[#6a1a1a] disabled:opacity-70 shadow-[0_12px_40px_rgba(126,30,30,0.25)] transition-colors"
      >
        {submitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" /> Submit Design Request
          </>
        )}
      </motion.button>
    </motion.form>
  );
};

export default CustomDesignForm;
