import { useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { toast } from "sonner";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    toast.success("Welcome to the OnCanvas family!", {
      description: "You'll hear from us with new collections and offers.",
    });
    setEmail("");
  };

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-[#7E1E1E]/12 bg-gradient-to-br from-[#FFFCFA] via-white to-[#F3EDE8] p-8 sm:p-12 text-center shadow-[0_20px_60px_rgba(62,24,24,0.08)]"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#7E1E1E]/10 flex items-center justify-center mx-auto mb-5">
            <Mail className="w-7 h-7 text-[#7E1E1E]" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#7E1E1E] italic mb-2">
            Join Our Newsletter
          </h2>
          <p className="text-sm text-[#4A2511]/65 font-body mb-8 max-w-md mx-auto">
            Be first to discover new wooden collections, festival drops, and exclusive maker stories.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 h-12 px-4 rounded-xl border border-[#7E1E1E]/20 bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#7E1E1E]/25 placeholder:text-[#7E1E1E]/35"
            />
            <button
              type="submit"
              className="h-12 px-8 rounded-xl bg-[#7E1E1E] text-white font-body font-semibold text-sm hover:bg-[#6a1a1a] transition-colors shrink-0"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
