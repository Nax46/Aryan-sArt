const items = "Handcrafted Objects · 3D Printed in India · Earthy Design Language · Limited Collections · Home That Breathes · ";

const MarqueeStrip = () => (
  <div className="bg-primary text-primary-foreground py-3 overflow-hidden">
    <div className="flex whitespace-nowrap animate-marquee">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="text-sm font-body tracking-[0.15em] uppercase mx-0">
          {items}
        </span>
      ))}
    </div>
  </div>
);

export default MarqueeStrip;
