import React, { useState } from 'react';
import { ShoppingCart, Star, Search, Plus, Minus, CreditCard, ChevronLeft } from 'lucide-react';
import { Product, CartItem } from '../types';

// Mock Products
const mockProducts: Product[] = [
  {
    id: 'p1',
    vendorId: 'v1',
    name: 'Safety Helmet - High Impact',
    description: 'Industrial grade safety helmet for construction workers. ISI certified.',
    price: 450,
    originalPrice: 600,
    discountPercentage: 25,
    images: ['https://images.unsplash.com/photo-1590432326759-90d40237e19b?w=400&q=80'],
    sizes: ['Free Size'],
    colors: [{ name: 'Yellow', hex: '#FFD700' }, { name: 'White', hex: '#FFFFFF' }],
    stock: 50,
    category: 'Safety',
    rating: 4.5,
    reviewsCount: 128
  },
  {
    id: 'p2',
    vendorId: 'v1',
    name: 'Reflective Safety Vest',
    description: 'High visibility reflective jacket for night time work and road safety.',
    price: 250,
    originalPrice: 350,
    discountPercentage: 28,
    images: ['https://images.unsplash.com/photo-1621213032502-36fb88607dcb?w=400&q=80'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Orange', hex: '#FF8C00' }, { name: 'Green', hex: '#32CD32' }],
    stock: 200,
    category: 'Safety',
    rating: 4.8,
    reviewsCount: 450
  },
  {
    id: 'p3',
    vendorId: 'v2',
    name: 'Heavy Duty Work Boots',
    description: 'Steel toe work boots, water resistant and anti-slip sole.',
    price: 1200,
    originalPrice: 1500,
    discountPercentage: 20,
    images: ['https://images.unsplash.com/photo-1549439602-43ebca2327af?w=400&q=80'],
    sizes: ['7', '8', '9', '10', '11'],
    colors: [{ name: 'Black', hex: '#000000' }, { name: 'Brown', hex: '#8B4513' }],
    stock: 30,
    category: 'Footwear',
    rating: 4.7,
    reviewsCount: 89
  },
  {
    id: 'p4',
    vendorId: 'v3',
    name: 'Cement Mixer Machine (Mini)',
    description: 'Portable cement mixer 200L capacity. Ideal for small construction sites.',
    price: 15500,
    originalPrice: 18000,
    discountPercentage: 14,
    images: ['https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80'],
    sizes: ['Standard'],
    colors: [{ name: 'Orange', hex: '#FF8C00' }],
    stock: 5,
    category: 'Machinery',
    rating: 4.2,
    reviewsCount: 15
  }
];

interface EcommerceCustomerViewProps { onBack: () => void; }

export default function EcommerceCustomerView({ onBack }: EcommerceCustomerViewProps) {
  const [activeView, setActiveView] = useState<'list' | 'detail' | 'cart'>('list');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = mockProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes[0] || '');
    setSelectedColor(product.colors[0]?.name || '');
    setActiveView('detail');
  };

  const addToCart = () => {
    if (!selectedProduct) return;
    
    setCart(prev => {
      const existing = prev.find(item => item.product.id === selectedProduct.id && item.selectedSize === selectedSize && item.selectedColor === selectedColor);
      if (existing) {
        return prev.map(item => item === existing ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product: selectedProduct, quantity: 1, selectedSize, selectedColor }];
    });
    alert('కార్ట్‌కి జోడించబడింది! (Added to cart)');
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('కార్ట్ ఖాళీగా ఉంది.');
      return;
    }
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    alert(`₹${total} కి ఆర్డర్ సిద్ధమవుతోంది... Instant Split Payment గేట్‌వే కి కనెక్ట్ అవుతోంది.`);
    setCart([]);
    setActiveView('list');
  };

  const renderList = () => (
    <div className="space-y-4 animate-fade-in pb-20">
      <div className="bg-[#082c75] -mx-4 -mt-4 p-4 pb-6 shadow-md rounded-b-3xl">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack} className="p-1.5 bg-white/10 rounded-full border border-white/20 text-white">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-white font-black text-lg">లోకల్ మార్ట్ (Local Mart)</h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder="వస్తువులను వెతకండి (Search tools, safety gear...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white rounded-xl py-2.5 pl-9 pr-4 text-sm font-bold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFC000]"
          />
        </div>
      </div>

      <div className="flex justify-between items-center px-1">
        <h3 className="font-extrabold text-gray-800">పాపులర్ వస్తువులు (Popular)</h3>
        <button onClick={() => setActiveView('cart')} className="relative bg-white p-2 rounded-full shadow-sm border border-gray-200">
          <ShoppingCart className="w-5 h-5 text-[#082c75]" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {filteredProducts.map(product => (
          <div key={product.id} onClick={() => handleProductClick(product)} className="bg-white rounded-2xl p-2.5 shadow-sm border border-gray-100 flex flex-col active:scale-95 transition-transform">
            <div className="aspect-square bg-gray-50 rounded-xl mb-2 overflow-hidden relative">
              <img loading="lazy" decoding="async" src={product.images[0]} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
              {product.discountPercentage && (
                <span className="absolute top-1 left-1 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-lg">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>
            <h4 className="font-bold text-xs text-gray-800 line-clamp-2 leading-snug">{product.name}</h4>
            <div className="flex items-center gap-1 mt-1 mb-2">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span className="text-[10px] font-bold text-gray-600">{product.rating} <span className="text-gray-400">({product.reviewsCount})</span></span>
            </div>
            <div className="mt-auto flex items-end justify-between">
              <div>
                <span className="font-black text-sm text-[#082c75]">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-[10px] text-gray-400 line-through ml-1 block -mt-1">₹{product.originalPrice}</span>
                )}
              </div>
              <button className="bg-[#FFC000] text-[#082c75] p-1.5 rounded-lg shadow-sm">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDetail = () => {
    if (!selectedProduct) return null;
    return (
      <div className="space-y-4 animate-fade-in pb-24">
        <button onClick={() => setActiveView('list')} className="flex items-center gap-1 text-gray-500 font-bold text-xs bg-white py-1.5 px-3 rounded-full border shadow-sm w-max">
          <ChevronLeft className="w-4 h-4" /> వెనుకకు
        </button>
        
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
          <div className="aspect-square bg-gray-50 rounded-2xl mb-4 overflow-hidden">
            <img loading="lazy" decoding="async" src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-full h-full object-cover mix-blend-multiply" />
          </div>
          
          <div className="flex justify-between items-start mb-2">
            <h2 className="font-black text-lg text-gray-800 leading-tight flex-1 pr-2">{selectedProduct.name}</h2>
            <div className="bg-amber-100 text-amber-700 px-2 py-1 rounded-lg flex items-center gap-1 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="font-bold text-xs">{selectedProduct.rating}</span>
            </div>
          </div>
          
          <div className="flex items-baseline gap-2 mb-4">
            <span className="font-black text-2xl text-[#082c75]">₹{selectedProduct.price}</span>
            {selectedProduct.originalPrice && (
              <>
                <span className="text-sm font-bold text-gray-400 line-through">₹{selectedProduct.originalPrice}</span>
                <span className="text-xs font-black text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">{selectedProduct.discountPercentage}% OFF</span>
              </>
            )}
          </div>
          
          <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">
            {selectedProduct.description}
          </p>
          
          {selectedProduct.sizes.length > 0 && (
            <div className="mb-5">
              <h4 className="font-extrabold text-xs text-gray-800 mb-2 uppercase tracking-wide">సైజు ఎంచుకోండి (Size)</h4>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.sizes.map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs border transition-colors ${selectedSize === size ? 'bg-[#082c75] text-white border-[#082c75]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {selectedProduct.colors.length > 0 && (
            <div className="mb-5">
              <h4 className="font-extrabold text-xs text-gray-800 mb-2 uppercase tracking-wide">కలర్ ఎంచుకోండి (Color)</h4>
              <div className="flex flex-wrap gap-3">
                {selectedProduct.colors.map(color => (
                  <button 
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform ${selectedColor === color.name ? 'scale-110 border-[#082c75]' : 'border-gray-200'}`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-40 sm:max-w-md sm:mx-auto">
          <div className="flex gap-3">
            <button 
              onClick={addToCart}
              className="flex-1 py-3.5 bg-sky-50 text-sky-700 font-black text-sm rounded-xl border border-sky-200 active:scale-95 transition-transform"
            >
              కార్ట్‌కి కలపండి
            </button>
            <button 
              onClick={() => { addToCart(); setActiveView('cart'); }}
              className="flex-1 py-3.5 bg-[#FFC000] text-[#082c75] font-black text-sm rounded-xl shadow-md active:scale-95 transition-transform"
            >
              కొనండి (Buy Now)
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCart = () => (
    <div className="space-y-4 animate-fade-in pb-24">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => setActiveView('list')} className="p-2 bg-white rounded-full border shadow-sm">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="font-black text-lg text-gray-800">మీ కార్ట్ (Cart)</h2>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl text-center shadow-sm border border-gray-100">
          <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-bold">కార్ట్ ఖాళీగా ఉంది.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {cart.map((item, idx) => (
              <div key={idx} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-3">
                <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                  <img loading="lazy" decoding="async" src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover mix-blend-multiply" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-xs text-gray-800 mb-1 leading-snug">{item.product.name}</h4>
                  <div className="text-[9px] text-gray-500 mb-2">
                    {item.selectedSize && <span className="mr-2">Size: {item.selectedSize}</span>}
                    {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="font-black text-sm text-[#082c75]">₹{item.product.price * item.quantity}</span>
                    <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded-lg border">
                      <button 
                        className="p-0.5 text-gray-500"
                        onClick={() => {
                          setCart(prev => {
                            const updated = [...prev];
                            if (updated[idx].quantity > 1) {
                              updated[idx].quantity -= 1;
                            } else {
                              updated.splice(idx, 1);
                            }
                            return updated;
                          });
                        }}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-xs w-3 text-center">{item.quantity}</span>
                      <button 
                        className="p-0.5 text-[#082c75]"
                        onClick={() => {
                          setCart(prev => {
                            const updated = [...prev];
                            updated[idx].quantity += 1;
                            return updated;
                          });
                        }}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-2">
            <h4 className="font-black text-sm text-gray-800 mb-3 border-b pb-2">బిల్ వివరాలు (Bill Details)</h4>
            <div className="flex justify-between text-xs text-gray-600 font-bold">
              <span>మొత్తం వస్తువులు (Item Total)</span>
              <span>₹{cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)}</span>
            </div>
            <div className="flex justify-between text-xs text-emerald-600 font-bold">
              <span>డెలివరీ ఛార్జీ (Delivery)</span>
              <span>ఉచితం (FREE)</span>
            </div>
            <div className="flex justify-between text-sm font-black text-[#082c75] border-t pt-2 mt-2">
              <span>మొత్తం (Grand Total)</span>
              <span>₹{cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)}</span>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-40 sm:max-w-md sm:mx-auto">
            <button 
              onClick={handleCheckout}
              className="w-full py-3.5 bg-emerald-600 text-white font-black text-sm rounded-xl shadow-lg active:scale-95 transition-transform flex justify-center items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>చెల్లించండి (Pay ₹{cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)})</span>
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="p-4 w-full">
      {activeView === 'list' && renderList()}
      {activeView === 'detail' && renderDetail()}
      {activeView === 'cart' && renderCart()}
    </div>
  );
}
