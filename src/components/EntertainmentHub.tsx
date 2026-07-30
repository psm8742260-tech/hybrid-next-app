import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Youtube, MessageCircle, Facebook, Heart, MessageSquare, Share2, 
  Sparkles, Flame, Users, Plus, Star, Volume2, Video, Trophy, ThumbsUp, Music, Pause, SkipBack, SkipForward, Wifi, Bluetooth, List
} from 'lucide-react';
import { ControlState } from '../types';

interface VideoItem {
  id: string;
  titleTe: string;
  titleEn: string;
  creator: string;
  url: string;
  embedId: string;
  views: string;
  likes: number;
}

interface MemeItem {
  id: string;
  user: string;
  role: string;
  avatar: string;
  captionTe: string;
  captionEn: string;
  imageUrl: string;
  likes: number;
  commentsCount: number;
  hasLiked?: boolean;
}

interface WhatsAppGroup {
  id: string;
  nameTe: string;
  nameEn: string;
  members: string;
  link: string;
  tag: string;
}

interface Song {
  id: string;
  title: string;
  artist: string;
}

interface EntertainmentHubProps {
  controlState?: ControlState;
}

export default function EntertainmentHub({ controlState = 'temp_on' }: EntertainmentHubProps) {
  const [activeTab, setActiveTab] = useState<'youtube' | 'whatsapp' | 'facebook' | 'reels' | 'music'>('youtube');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [wifiOn, setWifiOn] = useState(true);
  const [bluetoothOn, setBluetoothOn] = useState(true);
  
  const songs: Song[] = [
    { id: 's1', title: 'Construction Beat 1', artist: 'Worker DJ' },
    { id: 's2', title: 'Site Vibes', artist: 'Local Band' },
    { id: 's3', title: 'Peaceful Evening', artist: 'Acoustic Man' }
  ];

  const toggleFavorite = (songId: string) => {
    setFavorites(prev => prev.includes(songId) ? prev.filter(id => id !== songId) : [...prev, songId]);
  };
  
  // YouTube Videos List
  const [videos, setVideos] = useState<VideoItem[]>([
    {
      id: 'v1',
      titleTe: 'మేస్త్రీ మరియు కస్టమర్ల కామెడీ పంచులు! 😂',
      titleEn: 'Worker vs Customer Comedy Scene',
      creator: 'సివిల్ థియేటర్స్ (Civil Theatres)',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      embedId: 'dQw4w9WgXcQ',
      views: '45K',
      likes: 1240
    },
    {
      id: 'v2',
      titleTe: 'ఈజీగా గోడ ప్లాస్టరింగ్ చేయడం ఎలా? 👷',
      titleEn: 'Easy Wall Plastering Hacks & Tips',
      creator: 'నాయుడు సివిల్ అకాడమీ (Naidu Academy)',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      embedId: 'dQw4w9WgXcQ',
      views: '120K',
      likes: 5430
    },
    {
      id: 'v3',
      titleTe: 'మోడరన్ హౌస్ పెయింటింగ్ కలర్స్ అండ్ డిజైన్స్ 🎨',
      titleEn: 'Modern Painting Color Schemes',
      creator: 'పెయింటర్ రాజు వ్లాగ్స్ (Painter Raju)',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      embedId: 'dQw4w9WgXcQ',
      views: '89K',
      likes: 3110
    }
  ]);

  // Selected YouTube video to play in simulation
  const [playingVideo, setPlayingVideo] = useState<VideoItem | null>(null);

  // Facebook Local Memes & Stories
  const [memes, setMemes] = useState<MemeItem[]>([
    {
      id: 'm1',
      user: 'రాము - మేస్త్రీ',
      role: 'Mason Master',
      avatar: '👷',
      captionTe: 'లంచ్ బెల్ మోగక ముందే సైట్ లో వర్కర్ల హడావిడి ఇలా ఉంటుంది! 😂🍜',
      captionEn: 'Labor rush 1 minute before lunch break!',
      imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&auto=format&fit=crop&q=60',
      likes: 245,
      commentsCount: 34,
      hasLiked: false
    },
    {
      id: 'm2',
      user: 'పవన్ - పెయింటర్',
      role: 'Creative Artist',
      avatar: '🎨',
      captionTe: 'కస్టమర్ వచ్చి "లాస్ట్ లో ఒక చిన్న టచ్-అప్ ఉంది సార్" అన్నప్పుడు మా రియాక్షన్! 😭',
      captionEn: 'When custom asks for "just one tiny touch-up" at end!',
      imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&auto=format&fit=crop&q=60',
      likes: 189,
      commentsCount: 15,
      hasLiked: false
    }
  ]);

  // WhatsApp helper groups
  const whatsappGroups: WhatsAppGroup[] = [
    {
      id: 'wg1',
      nameTe: 'తెలంగాణ సివిల్ వర్కర్ల మహాసభ ✊',
      nameEn: 'Telangana Civil Welfare Group',
      members: '5,000+ సభ్యులు',
      link: 'https://chat.whatsapp.com/invite/civilworkers',
      tag: 'వెల్ఫేర్ (Welfare)'
    },
    {
      id: 'wg2',
      nameTe: 'హైదరాబాద్ పెయింటింగ్ కాంట్రాక్టర్స్ 🎨',
      nameEn: 'Hyd Painting Contractors Group',
      members: '1,200+ సభ్యులు',
      link: 'https://chat.whatsapp.com/invite/painters',
      tag: 'బిజినెస్ (Leads)'
    },
    {
      id: 'wg3',
      nameTe: 'CWRB కస్టమర్ కేర్ సపోర్ట్ గ్రూప్ 💬',
      nameEn: 'CWRB Helpdesk Direct Support',
      members: '24/7 అందుబాటు',
      link: 'https://wa.me/919999999999?text=Hi%20CWRB%20Support',
      tag: 'అడ్మిన్ సపోర్ట్'
    }
  ];

  // Reels Vertical Simulator
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const reels = [
    {
      id: 'r1',
      titleTe: 'సెకనులో పైప్ రిపేర్ చేసే టెక్నిక్! 🤯💧',
      titleEn: 'Superfast Pipe Repair hack',
      likes: 980,
      avatar: '🔧',
      author: 'కిరణ్ ప్లంబర్ (Kiran Plumber)',
      videoPlaceholder: 'https://images.unsplash.com/photo-1542013936693-8848e5744a9b?w=400&auto=format&fit=crop&q=60'
    },
    {
      id: 'r2',
      titleTe: 'సిమెంట్ ఇటుకలు ఈజీగా తయారు చేయడం 🧱',
      titleEn: 'Making custom bricks instantly',
      likes: 1210,
      avatar: '🧱',
      author: 'మధు మేస్త్రీ (Madhu Mason)',
      videoPlaceholder: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=400&auto=format&fit=crop&q=60'
    }
  ];

  const handleLikeMeme = (id: string) => {
    setMemes(memes.map(m => {
      if (m.id === id) {
        return {
          ...m,
          likes: m.hasLiked ? m.likes - 1 : m.likes + 1,
          hasLiked: !m.hasLiked
        };
      }
      return m;
    }));
  };

  const handleShareSimulate = (platform: string, title: string) => {
    const shareText = `👷 *CWRB బోర్-కొట్టని లోకల్ జోన్!* 👷\n\nయాప్ లోనే నేరుగా యూట్యూబ్, వాట్సాప్ మరియు వర్కర్ల మీమ్స్ చూడండి: \n\n*ట్రెండింగ్:* ${title}\n\n👉 CWRB లో జాయిన్ అవ్వండి: ${window.location.origin}`;
    if (navigator.share) {
      navigator.share({
        title: 'CWRB Entertainment',
        text: shareText,
        url: window.location.href
      }).catch(err => console.log(err));
    } else {
      alert(`${platform} కి ఈ క్రింది పోస్ట్ కాపీ అయింది!\n\n${shareText}`);
    }
  };

  if (controlState === 'temp_off' || controlState === 'perm_off' || controlState === 'soft_delete' || controlState === 'hard_delete') {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-xs mt-4">
      {/* Dynamic Entertaining Gradient Header */}
      <div className="bg-gradient-to-r from-[#082c75] via-[#051c47] to-[#0d1524] text-white p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#FFC000] text-[#082c75] flex items-center justify-center animate-bounce shadow-md">
            <Flame className="w-4 h-4 fill-current text-rose-600" />
          </div>
          <div>
            <h4 className="font-black text-xs text-[#FFC000] flex items-center gap-1">
              <span>సభ్యుల వినోద వేదిక (Social Zone)</span>
              <Sparkles className="w-3 h-3 text-emerald-400 fill-current" />
            </h4>
            <p className="text-[9px] text-gray-300">కస్టమర్లు & వర్కర్ల టైమ్-పాస్ వినోద కేంద్రం</p>
          </div>
        </div>

        {/* Connectivity Toggles */}
        <div className="flex items-center gap-2">
            <button onClick={() => setWifiOn(!wifiOn)} className={`p-1.5 rounded-full ${wifiOn ? 'bg-white text-[#082c75]' : 'bg-white/20 text-white'}`}>
                <Wifi className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setBluetoothOn(!bluetoothOn)} className={`p-1.5 rounded-full ${bluetoothOn ? 'bg-white text-[#082c75]' : 'bg-white/20 text-white'}`}>
                <Bluetooth className="w-3.5 h-3.5" />
            </button>
        </div>
      </div>

      {/* Segmented Top Menu Navigation bar */}
      <div className="flex border-b border-gray-200 bg-slate-50 p-1 gap-1 overflow-x-auto">
        {[
          { id: 'youtube', labelTe: '📺 యూట్యూబ్', labelEn: 'YouTube', icon: <Youtube className="w-3.5 h-3.5 text-rose-500" /> },
          { id: 'whatsapp', labelTe: '💬 వాట్సాప్', labelEn: 'WhatsApp', icon: <MessageCircle className="w-3.5 h-3.5 text-emerald-500" /> },
          { id: 'facebook', labelTe: '👥 మీమ్స్', labelEn: 'Memes', icon: <Facebook className="w-3.5 h-3.5 text-blue-600" /> },
          { id: 'reels', labelTe: '🎬 రీల్స్', labelEn: 'Reels', icon: <Video className="w-3.5 h-3.5 text-amber-500" /> },
          { id: 'music', labelTe: '🎵 మ్యూజిక్', labelEn: 'Music', icon: <Music className="w-3.5 h-3.5 text-indigo-500" /> }
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setPlayingVideo(null); // clear simulated players
              }}
              className={`flex-none py-1.5 px-3 rounded-lg text-[10px] font-black flex items-center justify-center gap-1 transition active:scale-95 ${
                active 
                  ? 'bg-white text-[#082c75] shadow-xs border border-gray-200/60' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab.icon}
              <span>{tab.labelTe}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Screen Content */}
      <div className="p-3 bg-slate-50/40">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: YOUTUBE VIDEO MANAGER */}
          {activeTab === 'youtube' && (
            <motion.div
              key="yt-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-extrabold text-gray-500 uppercase">ట్రెండింగ్ సివిల్ వీడియోలు</span>
                <span className="text-[9px] text-rose-600 font-bold flex items-center gap-0.5">
                  <Flame className="w-3 h-3 fill-current" /> Live Feed
                </span>
              </div>

              {/* Simulated Interactive Video Player */}
              {playingVideo ? (
                <div className="bg-black rounded-xl overflow-hidden shadow-md text-xs relative">
                  <div className="relative aspect-video bg-zinc-950 flex flex-col items-center justify-center">
                    {/* Simulated visual progress bar */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 p-3.5 flex flex-col justify-between z-10">
                      <div className="flex justify-between items-center">
                        <span className="bg-rose-600 text-white text-[8px] px-2 py-0.5 rounded-sm font-black flex items-center gap-1">
                          <Trophy className="w-3 h-3 text-yellow-300" /> LIVE STREAM
                        </span>
                        <button 
                          onClick={() => setPlayingVideo(null)}
                          className="bg-white/10 hover:bg-white/20 text-white rounded-full p-1 font-black text-[9px] transition-all"
                        >
                          ✕ మూసివేయి
                        </button>
                      </div>

                      <div className="space-y-1">
                        <h5 className="font-black text-white text-[11px] leading-tight drop-shadow-sm">{playingVideo.titleTe}</h5>
                        <p className="text-[9px] text-gray-300 font-bold flex items-center gap-1">
                          <span>👤 {playingVideo.creator}</span>
                          <span>•</span>
                          <span>{playingVideo.views} వ్యూస్</span>
                        </p>
                      </div>
                    </div>

                    {/* Animated simulation screen indicator */}
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-14 h-14 rounded-full bg-rose-600 flex items-center justify-center text-white animate-pulse">
                        <Play className="w-6 h-6 fill-current translate-x-0.5" />
                      </div>
                      <span className="text-[10px] text-rose-500 font-black tracking-wide animate-bounce">
                        వీడియో ప్లే అవుతోంది / STREAMING NOW
                      </span>
                    </div>

                    {/* Interactive YouTube Direct Launch Link */}
                    <a
                      href={playingVideo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-12 right-3 z-20 px-3 py-1.5 bg-[#FFC000] text-[#082c75] rounded-lg text-[9px] font-black shadow-md flex items-center gap-1"
                    >
                      <Youtube className="w-3.5 h-3.5 text-rose-600" />
                      <span>యూట్యూబ్‌లో ఓపెన్ చెయ్ (Open YouTube)</span>
                    </a>
                  </div>
                </div>
              ) : null}

              {/* Video List */}
              <div className="space-y-2 max-h-[260px] overflow-y-auto">
                {videos.map((vid) => (
                  <div
                    key={vid.id}
                    onClick={() => setPlayingVideo(vid)}
                    className="bg-white p-2.5 rounded-xl border border-gray-100 flex gap-2.5 cursor-pointer hover:border-rose-300 transition-all active:scale-[0.99]"
                  >
                    {/* Video thumbnail simulation */}
                    <div className="w-20 h-14 rounded-lg bg-slate-900 flex items-center justify-center relative shrink-0 overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-tr from-rose-600/30 to-black/20 z-10" />
                      <Play className="w-4 h-4 text-white fill-current drop-shadow-md z-20 group-hover:scale-110 transition" />
                      <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[7px] px-1 font-mono rounded">
                        14:15
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between text-xs">
                      <div>
                        <h5 className="font-extrabold text-gray-800 text-[10.5px] truncate leading-tight">
                          {vid.titleTe}
                        </h5>
                        <p className="text-[9px] text-gray-500 font-bold truncate mt-0.5">{vid.creator}</p>
                      </div>

                      <div className="flex items-center justify-between text-[8px] text-gray-400 font-mono mt-1">
                        <span>🔥 {vid.views} Views</span>
                        <span className="bg-rose-50 text-rose-700 font-black px-1.5 py-0.5 rounded-sm">
                          PLAY NOW
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 2: WHATSAPP COMMUNITY */}
          {activeTab === 'whatsapp' && (
            <motion.div
              key="wa-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <div className="bg-emerald-50 border border-emerald-200/50 p-2.5 rounded-xl flex items-center gap-2.5 text-xs">
                <MessageCircle className="w-8 h-8 text-emerald-600 shrink-0 animate-bounce" />
                <div>
                  <h5 className="font-extrabold text-emerald-950">కస్టమర్లు & వర్కర్ల వాట్సాప్ కమ్యూనిటీ!</h5>
                  <p className="text-[9.5px] text-emerald-800 leading-tight">
                    మా లోకల్ టౌన్ గ్రూపులలో జాయిన్ అయ్యి రోజువారీ మేస్త్రీ లీడ్స్, కాంట్రాక్ట్ బడ్జెట్ మరియు పేమెంట్ అప్‌డేట్లు పొందండి.
                  </p>
                </div>
              </div>

              {/* WhatsApp lists */}
              <div className="space-y-2">
                {whatsappGroups.map((grp) => (
                  <div
                    key={grp.id}
                    className="bg-white p-3 rounded-xl border border-gray-100 flex items-center justify-between shadow-xs"
                  >
                    <div className="space-y-1">
                      <span className="bg-emerald-100 text-emerald-800 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase">
                        {grp.tag}
                      </span>
                      <h5 className="font-extrabold text-xs text-gray-800 mt-1">{grp.nameTe}</h5>
                      <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                        <Users className="w-3 h-3 text-gray-400" />
                        <span>{grp.members}</span>
                      </p>
                    </div>

                    <a
                      href={grp.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        // simulate click
                        alert('కస్టమర్ వాట్సాప్ గ్రూపునకు పంపబడుతున్నారు! / Redirecting to WhatsApp Group.');
                      }}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] rounded-lg transition shadow-sm active:scale-95 text-center shrink-0"
                    >
                      చేరండి / Join
                    </a>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3: FACEBOOK MEMES & SITE JOKES */}
          {activeTab === 'facebook' && (
            <motion.div
              key="fb-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-extrabold text-gray-500 uppercase">సివిల్ సైట్ కామెడీ జోన్స్</span>
                <span className="text-[8px] bg-blue-100 text-blue-700 font-black px-1.5 py-0.5 rounded">
                  FACEBOOK MEMES
                </span>
              </div>

              {/* Meme Post Feed */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-0.5">
                {memes.map((meme) => (
                  <div
                    key={meme.id}
                    className="bg-white rounded-xl border border-gray-150 overflow-hidden shadow-xs space-y-2 p-3 text-xs"
                  >
                    {/* Header profile row */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-sm shadow-xs">
                          {meme.avatar}
                        </div>
                        <div>
                          <h6 className="font-extrabold text-gray-800 text-[10.5px]">{meme.user}</h6>
                          <p className="text-[8px] text-gray-400 font-bold">{meme.role}</p>
                        </div>
                      </div>
                      <span className="text-[8px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">
                        ★ LOCAL STAR
                      </span>
                    </div>

                    {/* Captions */}
                    <p className="text-[10px] text-gray-800 font-bold leading-relaxed">
                      {meme.captionTe}
                    </p>

                    {/* Image Meme box */}
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900 border border-gray-100 flex items-center justify-center">
                      <img loading="lazy" decoding="async"
                        src={meme.imageUrl}
                        alt="Labor meme card"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Likes and Interacts action row */}
                    <div className="pt-2 border-t border-dashed border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
                      <button
                        onClick={() => handleLikeMeme(meme.id)}
                        className={`flex items-center gap-1 py-1 px-2 rounded-lg transition ${
                          meme.hasLiked ? 'text-rose-600 bg-rose-50 font-black' : 'hover:bg-slate-50'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${meme.hasLiked ? 'fill-current text-rose-600' : ''}`} />
                        <span>{meme.likes} లైక్స్</span>
                      </button>

                      <button
                        onClick={() => {
                          alert('కామెంట్ చేరింది! (Comment added under local cache database)');
                        }}
                        className="flex items-center gap-1 hover:bg-slate-50 py-1 px-2 rounded-lg transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                        <span>{meme.commentsCount} వ్యాఖ్యలు</span>
                      </button>

                      <button
                        onClick={() => handleShareSimulate('Facebook', meme.captionTe)}
                        className="flex items-center gap-1 hover:bg-slate-50 py-1 px-2 rounded-lg transition text-blue-600"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>షేర్ / Share</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 4: MOBILE REELS SWIPER */}
          {activeTab === 'reels' && (
            <motion.div
              key="reels-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {/* Reels Vertical Simulation player */}
              <div className="relative bg-zinc-950 rounded-2xl aspect-[9/14] max-w-xs mx-auto overflow-hidden shadow-lg border border-white/10 text-white flex flex-col justify-between">
                
                {/* Background image preview representing the video */}
                <div className="absolute inset-0 z-0">
                  <img loading="lazy" decoding="async"
                    src={reels[activeReelIndex].videoPlaceholder}
                    alt="Reel background"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />
                </div>

                {/* Header bar */}
                <div className="p-3 flex justify-between items-center z-10">
                  <span className="bg-rose-600 text-white text-[8px] px-2 py-0.5 rounded-full font-black animate-pulse flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-current" /> REEL {activeReelIndex + 1}/{reels.length}
                  </span>
                  
                  <span className="text-[10px] font-bold text-[#FFC000] flex items-center gap-0.5 bg-black/40 px-2 py-0.5 rounded-full">
                    <Video className="w-3.5 h-3.5 animate-pulse" />
                    <span>సివిల్ రీల్స్</span>
                  </span>
                </div>

                {/* Swipe Overlay action button helper */}
                <div className="flex flex-col items-center justify-center gap-2 z-10 self-center">
                  <button 
                    onClick={() => {
                      alert('రీల్ వీడియో లోడ్ అవుతోంది... ప్లే ఆప్షన్ ఆక్టివేట్ అయింది!');
                    }}
                    className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-xs transition active:scale-95"
                  >
                    <Play className="w-5 h-5 fill-current translate-x-0.5" />
                  </button>
                  <span className="text-[8px] text-gray-200 font-bold bg-black/60 px-2 py-1 rounded-full">
                    స్క్రోల్ చెయ్ / Next Reel
                  </span>
                </div>

                {/* Bottom detail and interactive bar */}
                <div className="p-3.5 space-y-2 z-10">
                  {/* Author and title metadata */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{reels[activeReelIndex].avatar}</span>
                      <span className="text-[10px] font-black text-[#FFC000]">{reels[activeReelIndex].author}</span>
                    </div>
                    <p className="text-[11px] font-extrabold leading-tight text-white drop-shadow-md">
                      {reels[activeReelIndex].titleTe}
                    </p>
                    <p className="text-[8px] text-gray-300 font-semibold">{reels[activeReelIndex].titleEn}</p>
                  </div>

                  {/* Interacts layout */}
                  <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px]">
                    <div className="flex gap-3">
                      <button 
                        onClick={() => alert('లైక్ చేయబడింది! (Liked Reel)')}
                        className="flex items-center gap-1 hover:text-rose-400 transition"
                      >
                        <Heart className="w-4 h-4 text-rose-500 fill-current" />
                        <span className="font-bold">{reels[activeReelIndex].likes} Likes</span>
                      </button>

                      <button 
                        onClick={() => handleShareSimulate('Reels', reels[activeReelIndex].titleTe)}
                        className="flex items-center gap-1 hover:text-blue-400 transition"
                      >
                        <Share2 className="w-4 h-4 text-blue-400" />
                        <span>షేర్ / Share</span>
                      </button>
                    </div>

                    {/* Next button */}
                    <button
                      onClick={() => {
                        const nextIdx = (activeReelIndex + 1) % reels.length;
                        setActiveReelIndex(nextIdx);
                      }}
                      className="px-2.5 py-1 bg-white text-slate-900 rounded-lg text-[9px] font-black hover:bg-gray-100 transition"
                    >
                      తదుపరి / Next ➔
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          )}


          {/* TAB 5: MUSIC PLAYER */}
          {activeTab === 'music' && (
            <motion.div
              key="music-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl text-center space-y-2">
                <Music className="w-10 h-10 text-indigo-600 mx-auto" />
                <h5 className="font-bold text-indigo-900">
                  {currentSong ? currentSong.title : 'ఏ పాట ప్లే అవ్వడం లేదు'}
                </h5>
                <p className="text-xs text-indigo-700">{currentSong ? currentSong.artist : 'పాటను ఎంచుకోండి'}</p>
                <div className="flex justify-center gap-4 pt-2">
                  <button><SkipBack className="w-6 h-6 text-indigo-600" /></button>
                  <button onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? <Pause className="w-8 h-8 text-indigo-600 fill-current" /> : <Play className="w-8 h-8 text-indigo-600 fill-current" />}
                  </button>
                  <button><SkipForward className="w-6 h-6 text-indigo-600" /></button>
                </div>
              </div>

              <div className="space-y-2">
                <h6 className="text-xs font-bold text-gray-500 uppercase">పాటల జాబితా / Song List</h6>
                {songs.map(song => (
                  <div key={song.id} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100">
                    <div onClick={() => { setCurrentSong(song); setIsPlaying(true); }} className="cursor-pointer">
                      <p className="text-xs font-bold text-gray-800">{song.title}</p>
                      <p className="text-[10px] text-gray-500">{song.artist}</p>
                    </div>
                    <button onClick={() => toggleFavorite(song.id)} className={favorites.includes(song.id) ? 'text-rose-500' : 'text-gray-300'}>
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Interactive Footer banner */}
      <div className="bg-slate-50 border-t border-gray-150 p-2.5 text-center text-[9px] text-gray-500 font-bold leading-tight flex items-center justify-center gap-1">
        <span>📢</span>
        <span>సభ్యులకు సరికొత్త వినోదం! రోజువారీ లోకల్ మీమ్స్ & నవ్వులు.</span>
      </div>
    </div>
  );
}
