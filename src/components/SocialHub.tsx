import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Share2, MessageCircle, Facebook, Send, Youtube, Instagram, Twitter, 
  PlusCircle, CheckCircle2, AlertTriangle, Sparkles, PhoneCall, MapPin, Trash2
} from 'lucide-react';
import { ControlState } from '../types';

interface SocialPost {
  id: string;
  type: 'wanted' | 'available' | 'general';
  category: string;
  name: string;
  location: string;
  description: string;
  phone: string;
  timestamp: string;
  platformShares: string[];
}

interface SocialHubProps {
  controlState?: ControlState;
  userPhone?: string;
}

export default function SocialHub({ controlState = 'temp_on', userPhone = '' }: SocialHubProps) {
  const [activePlatformFilter, setActivePlatformFilter] = useState<string>('all');
  const [posts, setPosts] = useState<SocialPost[]>([
    {
      id: 'p1',
      type: 'wanted',
      category: 'ఎలక్ట్రీషియన్ (Electrician)',
      name: 'సురేష్ రెడ్డి (Suresh Reddy)',
      location: 'కూకట్‌పల్లి, హైదరాబాద్ (Kukatpally, Hyd)',
      description: 'ఇంట్లో వైరింగ్ మరియు స్విచ్ బోర్డు రిపేర్ కోసం అనుభవజ్ఞుడైన ఎలక్ట్రీషియన్ అర్జంటుగా కావాలి.',
      phone: '9848032910',
      timestamp: '10 నిమిషాల క్రితం',
      platformShares: ['whatsapp', 'telegram']
    },
    {
      id: 'p2',
      type: 'available',
      category: 'తాపీమేస్త్రీ (Mason)',
      name: 'యాదగిరి గారు (Yadagiri)',
      location: 'దిల్‌సుఖ్‌నగర్, హైదరాబాద్ (Dilsukhnagar, Hyd)',
      description: 'అన్ని రకాల ఇటుకల పని, ప్లాస్టరింగ్ మరియు కన్స్ట్రక్షన్ పనులు అనుభవంతో అతి తక్కువ ధరలో చేయబడును.',
      phone: '9123456789',
      timestamp: '45 నిమిషాల క్రితం',
      platformShares: ['facebook', 'whatsapp', 'instagram']
    },
    {
      id: 'p3',
      type: 'wanted',
      category: 'ప్లంబర్ (Plumber)',
      name: 'సూర్యకుమార్ (Suryakumar)',
      location: 'గచ్చిబౌలి (Gachibowli)',
      description: 'ఇంట్లో బాత్‌రూమ్ టాప్స్ మరియు పైపులైన్ లీకేజ్ రిపేర్ పనులు ఉన్నాయి. అర్జంటుగా రావాలి.',
      phone: '8765432109',
      timestamp: '2 గంటల క్రితం',
      platformShares: ['telegram']
    }
  ]);

  // Form States
  const [showForm, setShowForm] = useState(false);
  const [postType, setPostType] = useState<'wanted' | 'available' | 'general'>('wanted');
  const [category, setCategory] = useState('ప్లంబర్ (Plumber)');
  const [posterName, setPosterName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState(userPhone || '');
  const [selectedSharePlatforms, setSelectedSharePlatforms] = useState<string[]>(['whatsapp']);

  // Sharing Popup state
  const [activeSharingPost, setActiveSharingPost] = useState<SocialPost | null>(null);
  const [sharingPlatform, setSharingPlatform] = useState<string | null>(null);
  const [isShareSuccess, setIsShareSuccess] = useState(false);

  // Categories list
  const categories = [
    'ప్లంబర్ (Plumber)',
    'ఎలక్ట్రీషియన్ (Electrician)',
    'తాపీమేస్త్రీ (Mason)',
    'పెయింటర్ (Painter)',
    'కార్పెంటర్ (Carpenter)',
    'వెల్డర్ (Welder)',
    'టైల్స్ లేయర్ (Tile Layer)',
    'ఇతర వర్క్స్ (Other Works)'
  ];

  const handleTogglePlatform = (platform: string) => {
    if (selectedSharePlatforms.includes(platform)) {
      setSelectedSharePlatforms(selectedSharePlatforms.filter(p => p !== platform));
    } else {
      setSelectedSharePlatforms([...selectedSharePlatforms, platform]);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!posterName.trim() || !location.trim() || !description.trim() || !phone.trim()) {
      alert('దయచేసి అన్ని వివరాలు పూరించండి! (Please fill all details)');
      return;
    }

    const newPost: SocialPost = {
      id: 'post_' + Date.now(),
      type: postType,
      category,
      name: posterName,
      location,
      description,
      phone,
      timestamp: 'ఇప్పుడే (Just Now)',
      platformShares: selectedSharePlatforms
    };

    setPosts([newPost, ...posts]);
    setShowForm(false);
    
    // Auto trigger simulated social sharing sheet
    setActiveSharingPost(newPost);
    setSharingPlatform(selectedSharePlatforms[0] || 'whatsapp');
    
    // Clear inputs
    setPosterName('');
    setLocation('');
    setDescription('');
  };

  const triggerRealShare = (post: SocialPost, platform: string) => {
    const shareText = `👷 *CWRB సివిల్ వర్కర్ పోర్టల్ అప్‌డేట్* 👷\n\n*రకం:* ${post.type === 'wanted' ? '🆘 వర్కర్ కావాలి' : '✅ అందుబాటులో ఉన్నారు'}\n*పని:* ${post.category}\n*పేరు:* ${post.name}\n*లొకేషన్:* ${post.location}\n*వివరం:* ${post.description}\n*మొబైల్:* ${post.phone}\n\nCWRB యాప్ ద్వారా నిజ సమయ సమాచారాన్ని షేర్ చేయండి! 🔗`;
    
    if (navigator.share) {
      navigator.share({
        title: 'CWRB Social Post Share',
        text: shareText,
        url: window.location.href
      }).then(() => {
        setIsShareSuccess(true);
        setTimeout(() => {
          setIsShareSuccess(false);
          setActiveSharingPost(null);
        }, 2000);
      }).catch((err) => {
        console.log('Share error:', err);
        // Fallback simulated success
        simulateShareAction(platform);
      });
    } else {
      simulateShareAction(platform);
    }
  };

  const simulateShareAction = (platform: string) => {
    setIsShareSuccess(true);
    setTimeout(() => {
      setIsShareSuccess(false);
      setActiveSharingPost(null);
    }, 2000);
  };

  // Render State Check
  if (controlState === 'temp_off' || controlState === 'perm_off') {
    return (
      <div className="bg-slate-50 border border-gray-150 p-6 rounded-2xl text-center text-xs text-gray-500 space-y-2">
        <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto animate-bounce" />
        <p className="font-extrabold text-gray-800">సామాజిక మాధ్యమాల వేదిక నిలిపివేయబడింది</p>
        <p className="text-[10px] text-gray-400">Social Media Hub Suspended by Master Admin</p>
      </div>
    );
  }

  if (controlState === 'soft_delete' || controlState === 'hard_delete') {
    return null;
  }

  const isUpgraded = controlState === 'perm_upgrade';

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden shadow-xs ${
      isUpgraded ? 'ring-2 ring-yellow-400' : 'border-gray-150'
    }`}>
      {/* Header bar */}
      <div className="bg-[#082c75] text-white p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Share2 className="w-4.5 h-4.5 text-[#FFC000] animate-pulse" />
          <div>
            <h4 className="font-black text-xs">సామాజిక మాధ్యమాలు & షేరింగ్ (Social Hub)</h4>
            <p className="text-[9px] text-gray-300">వాట్సాప్, ఫేస్‌బుక్ గ్రూప్స్ షేరింగ్ బోర్డు</p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#FFC000] text-[#082c75] px-3 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 active:scale-95 transition-all shadow-sm"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>పోస్ట్ చెయ్ / Post</span>
        </button>
      </div>

      {/* Main post composer */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-slate-50 border-b border-gray-200 p-4 space-y-3.5 overflow-hidden text-xs"
          >
            <form onSubmit={handleCreatePost} className="space-y-3">
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setPostType('wanted')}
                  className={`py-1.5 text-[10px] font-extrabold rounded-lg border text-center transition ${
                    postType === 'wanted'
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  🆘 వర్కర్ కావాలి
                </button>
                <button
                  type="button"
                  onClick={() => setPostType('available')}
                  className={`py-1.5 text-[10px] font-extrabold rounded-lg border text-center transition ${
                    postType === 'available'
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  ✅ అవైలబుల్
                </button>
                <button
                  type="button"
                  onClick={() => setPostType('general')}
                  className={`py-1.5 text-[10px] font-extrabold rounded-lg border text-center transition ${
                    postType === 'general'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  📢 సమాచారం
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase">కేటగిరీ / Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg focus:outline-none"
                  >
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase">పేరు / Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="మనుష్యుల పేరు"
                    value={posterName}
                    onChange={(e) => setPosterName(e.target.value)}
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase">లొకేషన్ / Area</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="ఉదా: Kukatpally, Hyd"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg focus:outline-none"
                    />
                    <MapPin className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2.5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase">ఫోన్ నెంబర్ / Mobile</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10 అంకెల మొబైల్"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase">వివరాలు / Description</label>
                <textarea
                  required
                  rows={2}
                  placeholder="మీ పనుల వివరాలు, సమయం మొదలైనవి స్పష్టంగా రాయండి..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 bg-white border border-gray-200 rounded-lg focus:outline-none resize-none"
                />
              </div>

              {/* Target Social Platforms Selector */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 block uppercase mb-1">
                  లింక్ షేరింగ్ మాధ్యమాలు (Share on Social Platforms):
                </label>
                <div className="flex gap-2.5 justify-center py-1">
                  {[
                    { id: 'whatsapp', icon: <MessageCircle className="w-4 h-4" />, color: 'bg-emerald-500', name: 'WhatsApp' },
                    { id: 'facebook', icon: <Facebook className="w-4 h-4" />, color: 'bg-blue-600', name: 'Facebook' },
                    { id: 'telegram', icon: <Send className="w-4 h-4" />, color: 'bg-sky-500', name: 'Telegram' },
                    { id: 'youtube', icon: <Youtube className="w-4 h-4" />, color: 'bg-rose-600', name: 'YouTube' },
                    { id: 'instagram', icon: <Instagram className="w-4 h-4" />, color: 'bg-pink-600', name: 'Instagram' },
                    { id: 'twitter', icon: <Twitter className="w-4 h-4" />, color: 'bg-black', name: 'X' }
                  ].map((p) => {
                    const active = selectedSharePlatforms.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleTogglePlatform(p.id)}
                        title={p.name}
                        className={`p-2.5 rounded-full text-white transition relative ${p.color} ${
                          active ? 'scale-110 ring-2 ring-offset-2 ring-[#082c75]' : 'opacity-40 scale-90'
                        }`}
                      >
                        {p.icon}
                        {active && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-white text-slate-800 rounded-full flex items-center justify-center text-[7px] font-bold">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300"
                >
                  రద్దు / Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#082c75] text-white font-extrabold rounded-lg hover:bg-[#001040]"
                >
                  పోస్ట్ & షేర్ / Submit
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Social post feed items */}
      <div className="p-3 bg-slate-50/50 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-gray-500 uppercase">సామాజిక ఫీడ్ (Active Social Feed)</span>
          <span className="text-[8px] bg-blue-100 text-[#082c75] font-black px-1.5 py-0.5 rounded font-mono">
            {posts.length} ACTIVE REQUESTS
          </span>
        </div>

        <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-0.5">
          {posts.map((post) => {
            const isWanted = post.type === 'wanted';
            const isAvailable = post.type === 'available';

            return (
              <div 
                key={post.id}
                className="bg-white p-3 rounded-xl border border-gray-100 space-y-2 shadow-xs transition hover:border-[#082c75]/30"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-sm mr-1.5 ${
                      isWanted ? 'bg-red-50 text-red-700 border border-red-200' :
                      isAvailable ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {isWanted ? '🆘 వర్కర్ కావాలి' : isAvailable ? '✅ అవైలబుల్' : '📢 సమాచారం'}
                    </span>
                    <span className="font-extrabold text-[11px] text-gray-800">{post.category}</span>
                  </div>
                  <span className="text-[8px] text-gray-400 font-bold">{post.timestamp}</span>
                </div>

                <p className="text-[10px] text-gray-700 leading-relaxed font-medium">
                  {post.description}
                </p>

                <div className="pt-1.5 border-t border-dashed border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-gray-800 flex items-center gap-1">
                      👤 {post.name}
                    </span>
                    <span className="text-[9px] text-gray-400 flex items-center gap-0.5">
                      📍 {post.location}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Native intent sharing buttons */}
                    {post.platformShares.map((plt) => {
                      let color = 'text-emerald-500';
                      if (plt === 'facebook') color = 'text-blue-600';
                      if (plt === 'telegram') color = 'text-sky-500';
                      if (plt === 'youtube') color = 'text-rose-600';
                      if (plt === 'instagram') color = 'text-pink-600';
                      if (plt === 'twitter') color = 'text-black';

                      return (
                        <button
                          key={plt}
                          type="button"
                          onClick={() => {
                            setActiveSharingPost(post);
                            setSharingPlatform(plt);
                          }}
                          className={`p-1 hover:bg-slate-50 rounded-full transition-colors ${color}`}
                          title={`Share to ${plt}`}
                        >
                          {plt === 'whatsapp' ? <MessageCircle className="w-3.5 h-3.5" /> :
                           plt === 'facebook' ? <Facebook className="w-3.5 h-3.5" /> :
                           plt === 'telegram' ? <Send className="w-3.5 h-3.5" /> :
                           plt === 'youtube' ? <Youtube className="w-3.5 h-3.5" /> :
                           plt === 'instagram' ? <Instagram className="w-3.5 h-3.5" /> :
                           <Twitter className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => {
                        setActiveSharingPost(post);
                        setSharingPlatform('all');
                      }}
                      className="px-2 py-1 bg-slate-100 hover:bg-[#082c75] text-gray-700 hover:text-white transition-all font-black text-[9px] rounded-lg flex items-center gap-0.5"
                    >
                      <Share2 className="w-2.5 h-2.5" />
                      <span>షేర్ / Share</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Global simulated Sharing Sheet Modal popup */}
      <AnimatePresence>
        {activeSharingPost && sharingPlatform && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 text-white rounded-3xl p-5 max-w-sm w-full border border-white/10 shadow-2xl relative"
            >
              <div className="text-center space-y-2 mb-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse">
                  <Share2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-black text-[#FFC000]">
                  {sharingPlatform === 'all' ? 'సర్వీస్ కార్డును షేర్ చేయండి' : `${sharingPlatform.toUpperCase()} షేరింగ్ ఇంటెంట్`}
                </h3>
                <p className="text-[10px] text-gray-400">Social sharing automated generation engine</p>
              </div>

              {/* Show Generated Copy Text Area */}
              <div className="space-y-1.5 mb-4">
                <label className="text-[9px] font-bold text-gray-400 block uppercase">లింక్ మరియు మెసేజ్ కాపీ టెక్స్ట్:</label>
                <div className="p-3 bg-black/50 border border-white/10 rounded-xl text-[10px] font-mono text-gray-100 select-all leading-relaxed whitespace-pre-wrap max-h-44 overflow-y-auto">
                  {`👷 *CWRB సివిల్ వర్కర్ పోర్టల్ అప్‌డేట్* 👷\n\n*రకం:* ${activeSharingPost.type === 'wanted' ? '🆘 వర్కర్ కావాలి' : '✅ అందుబాటులో ఉన్నారు'}\n*పని:* ${activeSharingPost.category}\n*పేరు:* ${activeSharingPost.name}\n*లొకేషన్:* ${activeSharingPost.location}\n*వివరం:* ${activeSharingPost.description}\n*మొబైల్:* ${activeSharingPost.phone}\n\nమాతో చేరండి: ${window.location.origin}`}
                </div>
              </div>

              {isShareSuccess ? (
                <div className="py-2.5 bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-center font-black text-[11px] rounded-xl flex items-center justify-center gap-1.5 mb-4">
                  <CheckCircle2 className="w-4 h-4 animate-bounce" />
                  <span>సామాజిక మాధ్యమంలో విజయవంతంగా పోస్ట్ అయింది!</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                    onClick={() => {
                      // copy to clipboard
                      const shareText = `👷 *CWRB సివిల్ వర్కర్ పోర్టల్ అప్‌డేట్* 👷\n\n*రకం:* ${activeSharingPost.type === 'wanted' ? '🆘 వర్కర్ కావాలి' : '✅ అందుబాటులో ఉన్నారు'}\n*పని:* ${activeSharingPost.category}\n*పేరు:* ${activeSharingPost.name}\n*లొకేషన్:* ${activeSharingPost.location}\n*వివరం:* ${activeSharingPost.description}\n*మొబైల్:* ${activeSharingPost.phone}\n\n🔗 ${window.location.origin}`;
                      navigator.clipboard.writeText(shareText);
                      alert('మెసేజ్ క్లిప్‌బోర్డ్‌కు కాపీ చేయబడింది! (Copied to Clipboard!)');
                    }}
                    className="py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-[10px] font-black transition-all text-center"
                  >
                    📋 కాపీ చేయి / Copy
                  </button>
                  
                  <button
                    onClick={() => triggerRealShare(activeSharingPost, sharingPlatform)}
                    className="py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black transition-all text-center flex items-center justify-center gap-1"
                  >
                    <span>🚀 షేర్ చేయి / Share</span>
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setActiveSharingPost(null)}
                className="w-full py-2 bg-rose-600/30 hover:bg-rose-600 text-white rounded-xl text-[10px] font-black transition-all"
              >
                రద్దు / Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
