export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  color: string;
  image?: string;
  description?: string;
}

export const products: Product[] = [
  // TEMPLES (IDs 1-8)
  { 
    id: 1, 
    name: "Premium Corian Backlit Temple", 
    price: 25000, 
    category: "Temples", 
    color: "hsl(36, 30%, 72%)", 
    image: "/temples/1.jpeg",
    description: "A stunning premium corian temple featuring intricate backlit designs. Perfect for modern homes looking for a blend of tradition and contemporary style."
  },
  { 
    id: 2, 
    name: "Modern CNC Wooden Mandir", 
    price: 18500, 
    category: "Temples", 
    color: "hsl(105, 21%, 45%)", 
    image: "/temples/2.jpeg",
    description: "Crafted with precision CNC machining, this wooden mandir brings warmth and devotion to your living space."
  },
  { 
    id: 3, 
    name: "Intricate Laser Cut Shrine", 
    price: 15000, 
    category: "Temples", 
    color: "hsl(14, 40%, 60%)", 
    image: "/temples/3.jpeg",
    description: "Beautifully detailed laser-cut shrine that creates mesmerizing shadow patterns when lit from within."
  },
  { 
    id: 4, 
    name: "Classic Wall Mounted Temple", 
    price: 8500, 
    category: "Temples", 
    color: "hsl(37, 40%, 60%)", 
    image: "/temples/4.jpeg",
    description: "Space-saving wall mounted temple design that doesn't compromise on aesthetic appeal."
  },
  { 
    id: 5, 
    name: "Elegant Corian Mandir", 
    price: 12500, 
    category: "Temples", 
    color: "hsl(0, 30%, 50%)", 
    image: "/temples/5.jpeg",
    description: "Simple yet elegant corian mandir with smooth finishes and durable construction."
  },
  { 
    id: 6, 
    name: "Decorative Wooden Temple", 
    price: 21000, 
    category: "Temples", 
    color: "hsl(105, 25%, 38%)", 
    image: "/temples/6.jpeg",
    description: "Traditional design elements meet modern craftsmanship in this decorative wooden temple."
  },
  { 
    id: 7, 
    name: "Wall Mounted Mandir", 
    price: 17500, 
    category: "Temples", 
    color: "hsl(36, 25%, 65%)", 
    image: "/temples/7.jpeg",
    description: "Compact and beautiful wall mounted mandir ideal for apartments."
  },
  { 
    id: 8, 
    name: "Designer CNC Shrine", 
    price: 22500, 
    category: "Temples", 
    color: "hsl(14, 50%, 50%)", 
    image: "/temples/8.jpeg",
    description: "Premium designer shrine with custom CNC patterns and rich finish."
  },

  // LAMPS (IDs 101-106)
  {
    id: 101,
    name: "Voronoi Wood Table Lamp",
    price: 4500,
    category: "Lamps",
    color: "hsl(30, 40%, 40%)",
    image: "/lamps/Voronoi_Wood_Table_Lamp.jfif",
    description: "Experience the mesmerizing play of light and shadow with our Voronoi Wood Table Lamp. Precision-cut patterns create an organic, nature-inspired glow in any room."
  },
  {
    id: 102,
    name: "Luminarium Design Lamp",
    price: 3800,
    category: "Lamps",
    color: "hsl(40, 50%, 45%)",
    image: "/lamps/LuminariumDesigns_Etsy_Canada.jfif",
    description: "A masterpiece of geometric precision, this Luminarium lamp serves as both a functional light source and a sophisticated piece of art."
  },
  {
    id: 103,
    name: "Artistic Laser-Cut Lamp",
    price: 3200,
    category: "Lamps",
    color: "hsl(25, 35%, 50%)",
    image: "/lamps/Cricut_Ideeën.jfif",
    description: "Infuse your space with creativity. This artistic lamp features intricate laser-cut designs that transform light into a visual narrative."
  },
  {
    id: 104,
    name: "Parametric 3D Design Lamp",
    price: 5500,
    category: "Lamps",
    color: "hsl(20, 45%, 35%)",
    image: "/lamps/Parametric_3D_Models_Design_Explore_Options__BeeGraphy_Market.jfif",
    description: "Futuristic and bold, our Parametric 3D Design Lamp pushes the boundaries of modern decor with its complex, flowing structures."
  },
  {
    id: 105,
    name: "Modern Accent Lamp",
    price: 2900,
    category: "Lamps",
    color: "hsl(35, 30%, 55%)",
    image: "/lamps/lamps.jfif",
    description: "The perfect finishing touch for your side table. This modern accent lamp provides a warm, inviting ambience for cozy evenings."
  },
  {
    id: 106,
    name: "DIY Styled Decor Lamp",
    price: 2500,
    category: "Lamps",
    color: "hsl(45, 40%, 60%)",
    image: "/lamps/10_Stylish_Cardboard_DIY_Room_Decor_Ideas_for_Teens.jfif",
    description: "Youthful and vibrant, this lamp brings a stylish DIY aesthetic to your bedroom or workspace without compromising on quality."
  },

  // DECOR & OBJECTS (IDs 201-206)
  {
    id: 201,
    name: "Monkey D. Luffy Silhouette Art",
    price: 1800,
    category: "Decor & Objects",
    color: "hsl(0, 70%, 40%)",
    image: "/Decor_and_Objects/Monkey_D_Luffy_One_Piece_Silhouette_2D.jfif",
    description: "Celebrate your love for anime with this premium 2D silhouette of Monkey D. Luffy. A perfect statement piece for any fan's room."
  },
  {
    id: 202,
    name: "Geometric Precision Wall Art",
    price: 4200,
    category: "Decor & Objects",
    color: "hsl(210, 20%, 30%)",
    image: "/Decor_and_Objects/Unique_Wall_Art_Ideas_–_Instantly_Upgrade_Your_Home_Decor_USA.jfif",
    description: "Upgrade your walls with geometric elegance. This precision-crafted wall art adds depth and modern sophistication to your home office or living room."
  },
  {
    id: 203,
    name: "Handcrafted Leaf Coasters (Set of 6)",
    price: 1200,
    category: "Decor & Objects",
    color: "hsl(120, 30%, 40%)",
    image: "/Decor_and_Objects/Handcrafted_Leaf_Design_Wooden_Set_Of_6_Tabletop_Coasters_For_Tea_coffee_Cup.jfif",
    description: "Protect your surfaces with style. This set of 6 leaf-designed wooden coasters brings a touch of nature to your dining experience."
  },
  {
    id: 204,
    name: "360 Art Solution Sculpture",
    price: 5800,
    category: "Decor & Objects",
    color: "hsl(280, 15%, 45%)",
    image: "/Decor_and_Objects/Three_Sixty_Art_Solutions.jfif",
    description: "A comprehensive artistic statement. This 360-degree sculpture is designed to be admired from every angle, showcasing master craftsmanship."
  },
  {
    id: 205,
    name: "Laser-Cut Storage & Jewelry Box",
    price: 3500,
    category: "Decor & Objects",
    color: "hsl(340, 25%, 50%)",
    image: "/Decor_and_Objects/Archivos_Únicos_de_Corte_Láser_para_Almacenaje_DIY_y_Cajas_de_Joyas.jfif",
    description: "Elegant and functional. This laser-cut box is perfect for storing your jewelry or small keepsakes while adding beauty to your vanity."
  },
  {
    id: 206,
    name: "Artistic Minimalist Decor",
    price: 2400,
    category: "Decor & Objects",
    color: "hsl(180, 20%, 60%)",
    image: "/Decor_and_Objects/download.jfif",
    description: "Less is more. This minimalist decor piece speaks volumes with its clean lines and artistic silhouette."
  },
  // PAINTING (IDs 301-303)
  {
    id: 301,
    name: "Modern Abstract Canvas",
    price: 3500,
    category: "Painting",
    color: "hsl(200, 30%, 50%)",
    image: "/painting.jfif",
    description: "A vibrant abstract painting that brings life and color to any wall. Hand-painted with premium acrylics."
  },
  {
    id: 302,
    name: "Traditional Rajasthani Art",
    price: 4800,
    category: "Painting",
    color: "hsl(30, 60%, 40%)",
    image: "/painting.jfif",
    description: "Exquisite traditional art from the heart of Rajasthan, showcasing rich heritage and intricate details."
  },
  {
    id: 303,
    name: "Contemporary Nature Scene",
    price: 2900,
    category: "Painting",
    color: "hsl(140, 20%, 40%)",
    image: "/painting.jfif",
    description: "Bring the outdoors in with this contemporary nature scene, perfect for creating a calming atmosphere."
  }
];
