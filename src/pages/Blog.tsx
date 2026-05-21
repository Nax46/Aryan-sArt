import { usePageTitle } from "@/components/layout/usePageTitle";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

const blogPosts = [
  {
    id: 1,
    title: "The Renaissance of Canvas Art in Modern Interiors",
    excerpt: "Discover how traditional canvas paintings are making a spectacular comeback in contemporary home design, bringing warmth and character to minimalist spaces.",
    date: "May 15, 2026",
    category: "Interior Design",
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "Choosing the Perfect Frame for Your Masterpiece",
    excerpt: "A guide to selecting frames that complement rather than overpower your artwork. Learn about materials, colors, and styles that elevate your canvas.",
    date: "May 02, 2026",
    category: "Art Curation",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80",
    readTime: "4 min read"
  },
  {
    id: 3,
    title: "Behind the Brush: Aryans Art Studio Tour",
    excerpt: "Take an exclusive look inside our creative sanctuary. See where the magic happens and how our artists bring blank canvases to life with passion.",
    date: "April 18, 2026",
    category: "Behind the Scenes",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80",
    readTime: "7 min read"
  },
  {
    id: 4,
    title: "Understanding Color Psychology in Paintings",
    excerpt: "How the colors in your artwork affect your mood and the atmosphere of your room. Dive deep into the emotional impact of different color palettes.",
    date: "April 05, 2026",
    category: "Art Theory",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80",
    readTime: "6 min read"
  }
];

const Blog = () => {
  usePageTitle("Blog | OnCanvas");

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-10 sm:-mt-14 lg:-mt-16">
      <div className="px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        <Breadcrumbs
          items={[
            { label: "Home", path: "/" },
            { label: "Blog" },
          ]}
        />
      </div>
      <main className="pb-20">
        {/* Blog Hero Section */}
        <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80" 
              alt="Blog Hero" 
              className="w-full h-full object-cover brightness-[0.4]"
            />
          </div>
          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto mt-8">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-both">
              The Art Journal
            </h1>
            <p className="font-body text-white/80 text-lg md:text-xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 fill-mode-both">
              Stories, insights, and inspiration from the world of canvas and creativity.
            </p>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
            {blogPosts.map((post, index) => (
              <article 
                key={post.id}
                className="group cursor-pointer flex flex-col h-full animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl mb-6 shadow-md">
                  <div className="absolute inset-0 bg-[#7E1E1E]/20 mix-blend-multiply z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="font-display text-xs font-bold text-[#7E1E1E] uppercase tracking-wider">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-3 text-xs font-body text-[#7E1E1E]/60 mb-3 uppercase tracking-widest">
                    <span>{post.date}</span>
                    <span className="w-1 h-1 rounded-full bg-[#7E1E1E]/30" />
                    <span>{post.readTime}</span>
                  </div>
                  
                  <h3 className="font-display text-2xl font-bold text-[#2C1810] mb-3 group-hover:text-[#7E1E1E] transition-colors leading-tight">
                    {post.title}
                  </h3>
                  
                  <p className="font-body text-[#7E1E1E]/70 leading-relaxed mb-6 flex-1">
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-auto">
                    <span className="inline-flex items-center font-body text-sm font-semibold text-[#7E1E1E] group-hover:text-[#5D1616] transition-colors">
                      Read Article 
                      <svg className="w-4 h-4 ml-2 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          <div className="mt-20 flex justify-center">
            <button className="px-8 py-3 border border-[#7E1E1E]/20 text-[#7E1E1E] font-body font-medium rounded-full hover:bg-[#7E1E1E] hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#7E1E1E]/50 focus:ring-offset-2">
              Load More Articles
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Blog;
