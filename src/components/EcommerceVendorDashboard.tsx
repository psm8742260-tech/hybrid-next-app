import React, { useState } from 'react';
import { Store, Plus, Package, CreditCard, ChevronRight, Edit, Trash2, ArrowUpRight, TrendingUp, X } from 'lucide-react';
import { Product } from '../types';

export default function EcommerceVendorDashboard() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'finance'>('products');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [products, setProducts] = useState([
    { id: 1, name: 'Safety Helmet - High Impact', stock: 50, price: 450, image: 'https://images.unsplash.com/photo-1590432326759-90d40237e19b?w=400&q=80' },
    { id: 2, name: 'Reflective Safety Vest', stock: 200, price: 250, image: 'https://images.unsplash.com/photo-1621213032502-36fb88607dcb?w=400&q=80' }
  ]);

  const [newProdName, setNewProdName] = useState('');
  const [newProdStock, setNewProdStock] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdStock || !newProdPrice) {
      alert("దయచేసి వివరాలన్నీ నింపండి!");
      return;
    }
    const newProduct = {
      id: Date.now(),
      name: newProdName,
      stock: parseInt(newProdStock),
      price: parseInt(newProdPrice),
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80' // default generic product image
    };
    setProducts([newProduct, ...products]);
    setShowAddModal(false);
    setNewProdName('');
    setNewProdStock('');
    setNewProdPrice('');
    alert("కొత్త వస్తువు విజయవంతంగా యాడ్ చేయబడింది!");
  };

  const handleDeleteProduct = (id: number) => {
    if (window.confirm("ఈ వస్తువును తొలగించాలనుకుంటున్నారా?")) {
      setProducts(products.filter(p => p.id !== id));
      alert("వస్తువు తొలగించబడింది.");
    }
  };
  
  // Mock Vendor Data
  const vendorData = {
    name: 'Sri Venkateshwara Hardware & Safety',
    totalSales: 45000,
    commissionPaid: 4500, // 10%
    pendingSettlement: 1250,
    recentOrders: [
      { id: 'ORD-2024-001', amount: 1200, commission: 120, status: 'delivered', date: '2026-07-20' },
      { id: 'ORD-2024-002', amount: 800, commission: 80, status: 'shipped', date: '2026-07-19' },
    ]
  };

  const renderProducts = () => (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-black text-gray-800 text-lg">మీ వస్తువులు (Products)</h3>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#082c75] text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md hover:bg-blue-900 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          క్రొత్తది చేర్చండి
        </button>
      </div>

      <div className="space-y-3">
        {products.length === 0 ? (
          <div className="text-center p-6 bg-white rounded-2xl border border-gray-100 text-gray-400 text-xs">
            ప్రస్తుతం వస్తువులు ఏవీ లేవు. క్రొత్తది చేర్చండి!
          </div>
        ) : (
          products.map(product => (
            <div key={product.id} className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex gap-3 items-center">
              <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                <img loading="lazy" decoding="async" src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-xs text-gray-800 line-clamp-1">{product.name}</h4>
                <div className="text-[10px] text-gray-500 mt-0.5">Stock: <span className="font-bold text-emerald-600">{product.stock}</span> | Price: ₹{product.price}</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button 
                  onClick={() => alert("ఎడిట్ ఫీచర్ త్వరలో వస్తుంది!")}
                  className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteProduct(product.id)}
                  className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="bg-[#082c75] p-4 text-white flex justify-between items-center">
              <h3 className="font-black text-sm flex items-center gap-2">
                <Package className="w-4 h-4" />
                కొత్త వస్తువు యాడ్ చేయండి
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="p-4 space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">వస్తువు పేరు / Product Name</label>
                <input 
                  type="text" 
                  value={newProdName}
                  onChange={e => setNewProdName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold focus:ring-1 focus:ring-[#082c75] focus:outline-none" 
                  placeholder="ఉదా: Safety Gloves" 
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">స్టాక్ / Stock</label>
                  <input 
                    type="number" 
                    value={newProdStock}
                    onChange={e => setNewProdStock(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-mono font-bold focus:ring-1 focus:ring-[#082c75] focus:outline-none" 
                    placeholder="0" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">ధర / Price (₹)</label>
                  <input 
                    type="number" 
                    value={newProdPrice}
                    onChange={e => setNewProdPrice(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-mono font-bold focus:ring-1 focus:ring-[#082c75] focus:outline-none" 
                    placeholder="0" 
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] rounded-xl transition-all active:scale-95"
              >
                వస్తువు యాడ్ చేయి / Save Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderFinance = () => (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-3xl">
          <p className="text-[10px] font-bold text-emerald-600 mb-1 uppercase">మొత్తం అమ్మకాలు</p>
          <p className="text-xl font-black text-emerald-800">₹{vendorData.totalSales.toLocaleString()}</p>
        </div>
        <div className="bg-rose-50 border border-rose-100 p-4 rounded-3xl">
          <p className="text-[10px] font-bold text-rose-600 mb-1 uppercase">చెల్లించిన కమీషన్</p>
          <p className="text-xl font-black text-rose-800">₹{vendorData.commissionPaid.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="bg-[#082c75] p-5 rounded-3xl text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <TrendingUp className="w-24 h-24" />
        </div>
        <h4 className="font-bold text-xs text-white/70 uppercase tracking-wider mb-1">తదుపరి సెటిల్మెంట్</h4>
        <div className="text-3xl font-black mb-1">₹{vendorData.pendingSettlement}</div>
        <p className="text-[10px] text-[#FFC000]">Instant Split Payment ద్వారా నేరుగా మీ ఖాతాకు వస్తుంది.</p>
      </div>

      <div className="mt-6">
        <h3 className="font-black text-gray-800 text-sm mb-3">ఇటీవలి ఆర్డర్లు (Recent Orders)</h3>
        <div className="space-y-3">
          {vendorData.recentOrders.map(order => (
            <div key={order.id} className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
              <div>
                <p className="font-bold text-xs text-gray-800">{order.id}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{order.date}</p>
              </div>
              <div className="text-right">
                <p className="font-black text-sm text-[#082c75]">₹{order.amount}</p>
                <p className="text-[9px] text-rose-500 font-bold">కమీషన్: ₹{order.commission}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 w-full">
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-5 flex items-center gap-3">
        <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center shrink-0">
          <Store className="w-6 h-6 text-sky-600" />
        </div>
        <div>
          <h2 className="font-black text-gray-800 leading-tight">{vendorData.name}</h2>
          <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Verified Vendor</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl mb-5">
        <button 
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${activeTab === 'products' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Package className="w-4 h-4" /> Products
        </button>
        <button 
          onClick={() => setActiveTab('finance')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${activeTab === 'finance' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <CreditCard className="w-4 h-4" /> Finance
        </button>
      </div>

      {activeTab === 'products' ? renderProducts() : renderFinance()}
    </div>
  );
}
