import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/axios";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Parse filters from URL
  const categoryParam = searchParams.get("category");
  const subCategoryParam = searchParams.get("subCategory");
  const brandParam = searchParams.get("brand");
  const minDiscountParam = searchParams.get("minDiscount");
  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");

  useEffect(() => {
    setLoading(true);
    // Construct query 
    const query = new URLSearchParams();
    if (categoryParam) query.append("category", categoryParam);
    if (subCategoryParam) query.append("subCategory", subCategoryParam);
    if (brandParam) query.append("brand", brandParam);
    if (minDiscountParam) query.append("minDiscount", minDiscountParam);
    if (minPriceParam) query.append("minPrice", minPriceParam);
    if (maxPriceParam) query.append("maxPrice", maxPriceParam);

    api.get(`/products?${query.toString()}`)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [categoryParam, subCategoryParam, brandParam, minDiscountParam, minPriceParam, maxPriceParam]);

  // Derived filters (Brands available in current general category context)
  const uniqueBrands = useMemo(() => {
    const brands = new Set(products.map(p => p.brand).filter(Boolean));
    return brands.size > 0 ? Array.from(brands) : ["Apple", "Samsung", "OnePlus"];
  }, [products]);

  // Handlers for Filters
  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value === null || value === "") {
      newParams.delete(key);
    } else {
      if (key === "brand") {
        // Toggle brand in comma-separated list
        let currentBrands = newParams.get("brand") ? newParams.get("brand").split(",") : [];
        if (currentBrands.includes(value)) {
          currentBrands = currentBrands.filter(b => b !== value);
        } else {
          currentBrands.push(value);
        }
        
        if (currentBrands.length > 0) newParams.set("brand", currentBrands.join(","));
        else newParams.delete("brand");
      } else {
        newParams.set(key, value);
      }
    }
    
    setSearchParams(newParams);
  };

  const currentBrandsArr = brandParam ? brandParam.split(",") : [];

  return (
    <div className="bg-white min-h-screen pt-10 font-sans border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-12">
        
        {/* EDITORIAL SIDEBAR FILTERS */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="flex justify-between items-end mb-6 border-b border-black pb-3">
            <h2 className="text-xl font-light text-black tracking-widest uppercase">Filters</h2>
            {(categoryParam || subCategoryParam || brandParam || minDiscountParam || minPriceParam) && (
              <button 
                onClick={() => setSearchParams({})} 
                className="text-[10px] text-gray-500 font-medium uppercase tracking-[0.15em] hover:text-black transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          
          {/* Price Filter */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-black mb-4 uppercase tracking-[0.1em]">Price Focus</h3>
            <div className="space-y-4">
               {[
                 { label: "Essential (Under ₹10k)", min: "", max: "10000" },
                 { label: "Standard (₹10k - ₹30k)", min: "10000", max: "30000" },
                 { label: "Premium (₹30k - ₹50k)", min: "30000", max: "50000" },
                 { label: "Flagship (Over ₹50k)", min: "50000", max: "" }
               ].map((range, i) => {
                 const isChecked = minPriceParam === range.min && maxPriceParam === range.max;
                 return (
                   <label key={i} className="flex items-center gap-3 cursor-pointer group">
                     <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${isChecked ? 'border-black' : 'border-gray-300 group-hover:border-gray-500'}`}>
                       {isChecked && <div className="w-1.5 h-1.5 bg-black rounded-full"></div>}
                     </div>
                     <input 
                        type="radio" 
                        name="priceRange" 
                        className="hidden"
                        checked={isChecked}
                        onChange={() => {
                          const p = new URLSearchParams(searchParams);
                          if (range.min) p.set("minPrice", range.min); else p.delete("minPrice");
                          if (range.max) p.set("maxPrice", range.max); else p.delete("maxPrice");
                          setSearchParams(p);
                        }}
                      />
                     <span className={`text-sm tracking-wide transition-colors ${isChecked ? 'text-black font-medium' : 'text-gray-500 group-hover:text-black font-light'}`}>
                        {range.label}
                     </span>
                   </label>
                 );
               })}
            </div>
          </div>

          {/* Brand Filter */}
          {uniqueBrands.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-black mb-4 uppercase tracking-[0.1em]">Designer / Brand</h3>
              <div className="space-y-4">
                {uniqueBrands.map((brand, i) => {
                  const isChecked = currentBrandsArr.includes(brand);
                  return (
                    <label key={i} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-3.5 h-3.5 border flex items-center justify-center transition-colors ${isChecked ? 'border-black bg-black' : 'border-gray-300 group-hover:border-gray-500 bg-transparent'}`}>
                        {isChecked && <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      </div>
                      <input 
                        type="checkbox" 
                        className="hidden"
                        checked={isChecked}
                        onChange={() => handleFilterChange("brand", brand)}
                      />
                      <span className={`text-sm tracking-wide transition-colors ${isChecked ? 'text-black font-medium' : 'text-gray-500 group-hover:text-black font-light'}`}>
                        {brand}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Discount Filter */}
          <div>
            <h3 className="text-xs font-semibold text-black mb-4 uppercase tracking-[0.1em]">Archive / Sale</h3>
            <div className="space-y-4">
               {[10, 20, 30, 40, 50].map((disc, i) => {
                 const isChecked = minDiscountParam === String(disc);
                 return (
                   <label key={i} className="flex items-center gap-3 cursor-pointer group">
                     <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${isChecked ? 'border-black' : 'border-gray-300 group-hover:border-gray-500'}`}>
                       {isChecked && <div className="w-1.5 h-1.5 bg-black rounded-full"></div>}
                     </div>
                     <input 
                        type="radio" 
                        name="discount" 
                        className="hidden"
                        checked={isChecked}
                        onChange={() => handleFilterChange("minDiscount", String(disc))}
                      />
                     <span className={`text-sm tracking-wide transition-colors ${isChecked ? 'text-black font-medium' : 'text-gray-500 group-hover:text-black font-light'}`}>
                        {disc}% Or More
                     </span>
                   </label>
                 );
               })}
            </div>
          </div>
        </div>

        {/* MAIN PRODUCT GRID */}
        <div className="flex-1 min-h-[500px]">
          
          {/* Breadcrumbs / Title */}
          <div className="pb-8 mb-8">
            <h1 className="text-3xl sm:text-5xl font-light text-black tracking-tight capitalize mb-6">
              {categoryParam ? `${categoryParam}` : 'The Collection'}
              <span className="block text-sm font-light tracking-widest text-gray-400 mt-2 uppercase">
                [{products.length} Select Pieces]
              </span>
            </h1>
            
            {/* SubCategory Pills (Editorial style) */}
            {(!categoryParam || categoryParam === "Mobiles & Gadgets") && (
              <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                 <button 
                    onClick={() => handleFilterChange("subCategory", null)}
                    className={`px-5 py-2 text-xs tracking-widest uppercase transition-all whitespace-nowrap ${!subCategoryParam ? 'bg-black text-white' : 'border border-gray-200 text-gray-500 hover:border-black hover:text-black'}`}
                  >
                    All Types
                  </button>
                 {["Mobiles", "Chargers", "Earbuds", "Wearables"].map(sub => (
                   <button 
                    key={sub}
                    onClick={() => handleFilterChange("subCategory", sub)}
                    className={`px-5 py-2 text-xs tracking-widest uppercase transition-all whitespace-nowrap ${subCategoryParam === sub ? 'bg-black text-white' : 'border border-gray-200 text-gray-500 hover:border-black hover:text-black'}`}
                  >
                    {sub}
                  </button>
                 ))}
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-10 h-10 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-32 flex flex-col items-center border border-gray-100 bg-gray-50/30">
              <span className="text-gray-300 text-4xl mb-4 font-serif italic">Empty</span>
              <p className="mt-2 text-sm text-gray-500 tracking-wide font-light">The requested collection could not be sourced.</p>
              <button onClick={() => setSearchParams({})} className="mt-6 border-b border-black text-xs uppercase tracking-widest pb-1 hover:text-gray-500 transition-colors">Clear Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-16">
              {products.map((product) => (
                <Link key={product._id} to={`/product/${product._id}`} className="group flex flex-col relative cursor-pointer">
                  
                  <div className="w-full aspect-[4/5] bg-gray-50/50 p-8 relative flex items-center justify-center overflow-hidden transition-colors duration-500 group-hover:bg-gray-100">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={`http://localhost:5000/uploads/${product.images[0]}`}
                        alt={product.title}
                        className="object-contain w-full h-full group-hover:scale-[1.03] transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] mix-blend-multiply"
                      />
                    ) : (
                      <span className="text-gray-300 font-light tracking-widest uppercase text-xs">No Image</span>
                    )}

                    {/* Stock indicator minimalist */}
                    {product.stock <= 5 && product.stock > 0 && (
                      <div className="absolute top-4 left-4">
                        <span className="text-[10px] tracking-widest uppercase text-red-700 font-semibold bg-red-50/80 backdrop-blur px-2 py-1">Rare • {product.stock} Left</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                       <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em]">
                          {product.brand}
                       </p>
                    </div>
                    <h3 className="font-light text-black text-base line-clamp-1 group-hover:underline underline-offset-4 decoration-gray-300 mb-2">{product.title}</h3>
                    
                    <div className="mt-auto flex items-baseline gap-3">
                      <span className="text-sm font-medium tracking-wide text-black">₹{(product.dynamicPrice ?? product.price).toLocaleString('en-IN')}</span>
                      {product.mrp && product.mrp > product.dynamicPrice && (
                         <span className="text-xs text-gray-400 line-through tracking-wide">₹{product.mrp.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
