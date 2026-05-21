import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Loader2,
  ChevronDown,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import PageLayout from "@/components/layout/PageLayout";
import { getPageMeta } from "@/config/pageRegistry";
import { cn } from "@/lib/utils";

const meta = getPageMeta("/contact");

const FAQ_ITEMS = [
  {
    q: "How long does custom design take?",
    a: "Most custom pieces are crafted within 7–14 business days after design approval. Complex projects may take up to 3 weeks.",
  },
  {
    q: "Do you ship across India?",
    a: "Yes. We deliver pan-India from our workshop in Bundi, Rajasthan. Free shipping on orders above ₹5,000.",
  },
  {
    q: "What wood types do you use?",
    a: "We work with teak, sheesham, premium MDF, and grade-A plywood — selected based on your project needs.",
  },
  {
    q: "Can I visit your workshop?",
    a: "Studio visits are welcome by appointment. Contact us on WhatsApp to schedule a tour.",
  },
];

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    toast.success("Message sent!", {
      description: "We'll get back to you within 24 hours.",
    });
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <PageLayout meta={meta}>
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {[
          {
            icon: Phone,
            title: "Call Us",
            line: "+91 94130 87970",
            sub: "Mon–Sat, 10am–7pm",
          },
          {
            icon: Mail,
            title: "Email",
            line: "hello@oncanvas.art",
            sub: "We reply within 24h",
          },
          {
            icon: MapPin,
            title: "Workshop",
            line: "Bundi, Rajasthan",
            sub: "India",
          },
        ].map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-[#7E1E1E]/10 bg-white p-6 hover:shadow-[0_12px_32px_rgba(62,24,24,0.08)] transition-shadow"
          >
            <div className="w-11 h-11 rounded-xl bg-[#7E1E1E]/10 flex items-center justify-center mb-4">
              <card.icon className="w-5 h-5 text-[#7E1E1E]" />
            </div>
            <h3 className="font-body font-semibold text-[#4A2511]">{card.title}</h3>
            <p className="font-display text-lg font-bold text-[#7E1E1E] mt-1">{card.line}</p>
            <p className="text-xs text-[#7E1E1E]/50 font-body mt-1">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-10 mb-12">
        <motion.form
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#7E1E1E]/10 bg-white p-6 sm:p-8 space-y-4 shadow-[0_12px_40px_rgba(62,24,24,0.06)]"
        >
          <h2 className="font-display text-2xl font-bold text-[#7E1E1E] italic mb-2">Send a message</h2>
          {[
            { key: "name", label: "Name", type: "text" },
            { key: "email", label: "Email", type: "email" },
            { key: "phone", label: "Phone", type: "tel" },
            { key: "subject", label: "Subject", type: "text" },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-xs uppercase tracking-wider text-[#7E1E1E]/50 font-body mb-1.5">
                {label}
              </label>
              <input
                type={type}
                required={key !== "phone"}
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-[#7E1E1E]/15 font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#7E1E1E]/20"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#7E1E1E]/50 font-body mb-1.5">
              Message
            </label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#7E1E1E]/15 font-body text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#7E1E1E]/20"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#7E1E1E] text-white font-body font-semibold text-sm hover:bg-[#6a1a1a] disabled:opacity-70"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Submit
          </button>
        </motion.form>

        <div className="space-y-6">
          <div className="rounded-2xl border border-[#7E1E1E]/10 bg-gradient-to-br from-[#2a1810] to-[#4a2511] p-6 text-[#F9F7F5]">
            <Clock className="w-8 h-8 text-[#E8D5C4] mb-3" />
            <h3 className="font-display text-xl font-bold italic mb-2">Working Hours</h3>
            <ul className="space-y-2 text-sm font-body text-[#F9F7F5]/85">
              <li>Monday – Friday: 10:00 AM – 7:00 PM</li>
              <li>Saturday: 10:00 AM – 5:00 PM</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>
          <a
            href="https://wa.me/919413087970"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl border border-[#7E1E1E]/15 bg-white p-5 hover:bg-[#7E1E1E]/5 transition-colors"
          >
            <MessageCircle className="w-6 h-6 text-[#7E1E1E]" />
            <span className="font-body font-semibold text-[#7E1E1E]">Chat on WhatsApp</span>
          </a>
          <div className="rounded-2xl border border-[#7E1E1E]/10 overflow-hidden aspect-[16/10] bg-[#F3EDE8] relative">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
              alt=""
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-[#2a1810]/30">
              <p className="font-body text-sm text-white/90 px-4 text-center">
                Map placeholder — Bundi, Rajasthan
              </p>
            </div>
          </div>
        </div>
      </div>

      <section>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#7E1E1E] italic mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={item.q}
              className="rounded-xl border border-[#7E1E1E]/10 bg-white overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left font-body font-semibold text-[#4A2511] hover:bg-[#7E1E1E]/3 transition-colors"
              >
                {item.q}
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-[#7E1E1E]/40 transition-transform",
                    openFaq === i && "rotate-180",
                  )}
                />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="px-5 pb-4 text-sm text-[#4A2511]/70 font-body leading-relaxed">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
};

export default ContactPage;
