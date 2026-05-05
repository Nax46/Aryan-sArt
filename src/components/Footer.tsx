import { MessageCircle } from "lucide-react";

const Footer = () => (
  <footer className="bg-ink text-parchment pt-16 pb-8 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-5 gap-10 mb-12">
        {/* Brand */}
        <div className="md:col-span-2">
          <img 
            src="/ON_CANVAS_FULL_Logo-removebg-preview.png" 
            alt="Canvas Logo" 
            className="h-24 sm:h-32 w-auto object-contain mb-4 filter brightness-0 invert"
          />
          <p className="font-body text-sm text-sand/50 leading-relaxed max-w-xs mb-4">
            Precision CNC & laser-cut temples and customized interior decor items like lamps. Crafted in Bundi, Rajasthan. Delivered across India.
          </p>
          <a
            href="https://wa.me/919413087970"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-body text-sm text-parchment border border-parchment/30 px-4 py-2 hover:bg-parchment/10 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Chat on WhatsApp
          </a>
        </div>

        {/* Links */}
        {[
          { title: "Shop", links: ["Lamps", "Planters", "Decor", "New Arrivals"] },
          { title: "About", links: ["Process", "Sustainability"] },
          { title: "Help", links: ["Shipping", "Returns", "FAQs", "Contact"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="font-body text-xs tracking-[0.2em] uppercase text-sand/60 mb-4">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="font-body text-sm text-sand/70 hover:text-parchment transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-parchment/10 pt-6">
        <p className="font-body text-xs text-sand/40 text-center">
          © 2026 OnCanvas by Sunil Jangid. All rights reserved. Made with precision in Bundi, Rajasthan.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
