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
    image: "/download.jfif",
    description: "Compact and beautiful wall mounted mandir ideal for apartments."
  },
  { 
    id: 8, 
    name: "Designer CNC Shrine", 
    price: 22500, 
    category: "Temples", 
    color: "hsl(14, 50%, 50%)", 
    image: "/modern temple Design.jfif",
    description: "Premium designer shrine with custom CNC patterns and rich finish."
  },
];
