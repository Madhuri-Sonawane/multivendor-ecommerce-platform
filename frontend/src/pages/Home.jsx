import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const CATEGORIES = [
  { name: "Top Offers", link: "/products", icon: "Trending" },
  { name: "Mobiles", link: "/products?category=Mobiles & Gadgets", icon: "Flagships" },
  { name: "Electronics", link: "/products?category=Electronics", icon: "Audio" },
  { name: "Fashion", link: "/products?category=Fashion", icon: "Apparel" },
  { name: "Beauty", link: "/products?category=Beauty", icon: "Grooming" },
  { name: "Home", link: "/products?category=Home", icon: "Living" },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products
    api.get("/products")
      .then((res) => {
        setFeaturedProducts(res.data.slice(0, 5));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white min-h-screen font-sans">
      
      {/* Editorial Category Bar */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-8 overflow-x-auto hide-scrollbar justify-start sm:justify-center items-center">
          {CATEGORIES.map((cat, idx) => (
            <Link 
              key={idx} 
              to={cat.link} 
              className="flex flex-col items-center gap-1.5 group cursor-pointer shrink-0"
            >
              <span className="text-xs uppercase tracking-[0.15em] font-medium text-gray-500 group-hover:text-black transition-colors whitespace-nowrap">
                {cat.icon}
              </span>
              <div className="h-[1px] w-0 bg-black group-hover:w-full transition-all duration-300"></div>
            </Link>
          ))}
          </div>
        </div>
      </div>

      {/* Hero Header - Minimalist */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl sm:text-6xl font-light text-black tracking-tight mb-4">
            Curated <span className="italic font-serif">Essentials</span>.
          </h1>
          <p className="text-gray-500 text-lg max-w-xl font-light mb-10">
            A meticulous selection of premium technology and timeless goods. Designed to elevate your everyday.
          </p>
          <Link to="/products" className="bg-black text-white px-8 py-3 text-sm tracking-widest uppercase hover:bg-gray-800 transition-colors">
            Explore Collection
          </Link>
        </div>
      </div>

      {/* Horizontal Carousel Section (Like Apple / Native Store) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-end mb-8 border-b border-black pb-4">
          <div>
            <h2 className="text-2xl font-light text-black tracking-wide">The Featured Edit</h2>
            <p className="text-sm text-gray-500 mt-1">Our latest arrivals and signature pieces.</p>
          </div>
          <Link to="/products" className="text-sm font-medium uppercase tracking-wider text-black hover:text-gray-500 transition-colors shrink-0">
            View All →
          </Link>
        </div>
        
        {loading ? (
           <div className="flex gap-6 overflow-hidden">
             {[1,2,3,4].map(n => (
               <div key={n} className="w-[280px] h-[380px] bg-gray-50 animate-pulse shrink-0 rounded-sm"></div>
             ))}
           </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-8 snap-x">
            {featuredProducts.map(product => (
              <Link key={product._id} to={`/product/${product._id}`} className="group w-[280px] shrink-0 border border-gray-100 snap-start flex flex-col bg-white hover:border-black transition-colors duration-300">
                <div className="w-full h-[300px] bg-white p-6 relative flex items-center justify-center overflow-hidden">
                  {product.images?.length > 0 ? (
                    <img 
                      src={`http://localhost:5000/uploads/${product.images[0]}`} 
                      className="object-contain w-full h-full group-hover:scale-[1.03] transition-transform duration-500" 
                      alt={product.title} 
                    />
                  ) : (
                    <div className="text-gray-200">No Image</div>
                  )}
                  {product.mrp && product.mrp > product.dynamicPrice && (
                    <span className="absolute top-4 left-4 text-[10px] font-bold tracking-widest uppercase bg-black text-white px-2 py-1">
                      Sale
                    </span>
                  )}
                </div>
                <div className="p-5 border-t border-gray-100 flex-1 flex flex-col">
                  <p className="text-[10px] tracking-widest text-gray-400 uppercase mb-1">{product.brand}</p>
                  <h3 className="text-sm text-gray-900 font-normal line-clamp-1 mb-3 group-hover:underline">{product.title}</h3>
                  <div className="mt-auto flex items-center gap-2">
                    <span className="text-sm font-medium text-black">₹{product.dynamicPrice.toLocaleString()}</span>
                    {product.mrp && product.mrp > product.dynamicPrice && (
                       <span className="text-xs text-gray-400 line-through">₹{product.mrp.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Modern Split Promo Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 h-[400px] flex items-center justify-center p-10 flex-col text-center border border-gray-100 hover:border-gray-200 transition-colors">
            <h3 className="text-3xl font-light mb-3">Audio Fidelity</h3>
            <p className="text-sm text-gray-500 font-light mb-6">Experience uncompromised sound with our new ANC lineup.</p>
            <Link to="/products?subCategory=Earbuds" className="text-xs font-semibold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600 transition-colors">Shop Audio</Link>
          </div>
          <div className="bg-black text-white h-[400px] flex items-center justify-center p-10 flex-col text-center">
            <h3 className="text-3xl font-light mb-3">Titanium Frame</h3>
            <p className="text-sm text-gray-400 font-light mb-6">The strongest, lightest iteration of modern mobile technology yet.</p>
            <Link to="/products?category=Mobiles & Gadgets" className="text-xs font-semibold uppercase tracking-widest border-b border-white pb-1 hover:text-gray-300 transition-colors">Shop Flagships</Link>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

    </div>
  );
}
