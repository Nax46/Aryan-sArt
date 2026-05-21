import { Link } from "react-router-dom";
import { Facebook, Instagram, MessageCircle, Twitter, Youtube } from "lucide-react";

const companyLinks = [
  { label: "About", href: "/contact/contact-us" },
  { label: "Careers", href: "/contact/contact-us" },
  { label: "Privacy", href: "/contact/contact-us" },
  { label: "Terms", href: "/contact/contact-us" },
];

const supportLinks = [
  { label: "Contact", href: "/contact/contact-us" },
  { label: "FAQ", href: "/contact/faq" },
  { label: "Shipping", href: "/contact/support" },
];

const social = [
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

const HomeFooter = () => (
  <footer className="bg-ink text-parchment pt-16 pb-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
        <div className="lg:col-span-2">
          <img
            src="/ON_CANVAS_FULL_Logo-removebg-preview.png"
            alt="OnCanvas"
            className="h-20 sm:h-28 w-auto object-contain mb-4 filter brightness-0 invert"
          />
          <p className="font-body text-sm text-sand/50 leading-relaxed max-w-sm mb-6">
            Premium handcrafted wooden art and decor. CNC precision meets traditional artistry from Bundi,
            Rajasthan — delivered across India.
          </p>
          <a
            href="https://wa.me/919413087970"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-body text-sm text-parchment border border-parchment/30 px-4 py-2.5 rounded-lg hover:bg-parchment/10 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Chat on WhatsApp
          </a>
        </div>

        <div>
          <h4 className="font-body text-xs tracking-[0.2em] uppercase text-sand/60 mb-4">Company</h4>
          <ul className="space-y-2.5">
            {companyLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.href} className="font-body text-sm text-sand/70 hover:text-parchment transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-body text-xs tracking-[0.2em] uppercase text-sand/60 mb-4">Customer Support</h4>
          <ul className="space-y-2.5">
            {supportLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.href} className="font-body text-sm text-sand/70 hover:text-parchment transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-body text-xs tracking-[0.2em] uppercase text-sand/60 mb-4">Follow Us</h4>
          <div className="flex gap-3">
            {social.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 rounded-full border border-parchment/25 flex items-center justify-center text-sand/70 hover:bg-parchment/10 hover:text-parchment transition-all"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-parchment/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-body text-xs text-sand/40 text-center sm:text-left">
          © {new Date().getFullYear()} OnCanvas by Aryans Art. All rights reserved. Crafted in Bundi, Rajasthan.
        </p>
        <p className="font-body text-[10px] text-sand/35 tracking-wider uppercase">
          Wood · Emotion · Precision
        </p>
      </div>
    </div>
  </footer>
);

export default HomeFooter;
