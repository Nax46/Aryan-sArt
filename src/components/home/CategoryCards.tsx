import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    title: "Wooden Wall Art",
    description: "Statement pieces that bring nature and soul to your walls.",
    path: "/categories/wooden-wall-art",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Wooden Lamps",
    description: "Ambient lighting sculpted from warm, hand-finished timber.",
    path: "/categories/wooden-lamps",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Home Decor",
    description: "Shelving, mirrors, and accents for refined living spaces.",
    path: "/categories/home-decor",
    image: "https://images.unsplash.com/photo-1616486338812-3d58e0e9e0c3?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Office Decor",
    description: "Desk organizers, name plates, and professional wooden flair.",
    path: "/categories/office-decor",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Wooden Clocks",
    description: "Modern, vintage, and minimal timepieces in solid wood.",
    path: "/categories/wooden-clocks",
    image: "https://images.unsplash.com/photo-1563861826100-9cb518e86a24?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Personalized Gifts",
    description: "Bespoke creations for birthdays, couples, and corporate gifting.",
    path: "/categories/personalized-gifts",
    image: "https://images.unsplash.com/photo-1518199266791-5375a575a556?auto=format&fit=crop&w=600&q=80",
  },
];

const CategoryCards = () => (
  <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-[#7E1E1E]/50 font-body mb-2">Shop by Style</p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#7E1E1E] italic">Explore Categories</h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.path}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <Link
              to={cat.path}
              className="group block relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#7E1E1E]/10 shadow-[0_12px_40px_rgba(62,24,24,0.08)] hover:shadow-[0_24px_56px_rgba(62,24,24,0.15)] transition-all duration-500"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a1810]/90 via-[#2a1810]/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-white italic mb-1">
                      {cat.title}
                    </h3>
                    <p className="text-sm text-white/75 font-body line-clamp-2 max-w-[90%]">{cat.description}</p>
                  </div>
                  <span className="w-10 h-10 rounded-full bg-white/15 backdrop-blur flex items-center justify-center text-white group-hover:bg-[#7E1E1E] group-hover:scale-110 transition-all duration-300 shrink-0">
                    <ArrowUpRight className="w-5 h-5" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CategoryCards;
