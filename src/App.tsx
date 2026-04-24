import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  MapPin, 
  Briefcase, 
  User, 
  Smile, 
  Activity, 
  Mail, 
  Phone, 
  Instagram, 
  ChevronDown,
  Anchor,
  Settings,
  Send,
  Github,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

// --- Types ---
type Category = 'all' | 'interests' | 'career' | 'portfolio';

interface DetailItem {
  id: string;
  category: Category;
  title: string;
  content: string;
  icon: React.ReactNode;
  color: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  link: string;
  github: string;
  tags: string[];
}

interface GuestMessage {
  id: string;
  name: string;
  email: string;
  content: string;
  timestamp: string;
}

// --- Mock Data ---
const PROFILE = {
  name: "卓同學 (Pczhuo)",
  age: 19,
  gender: "男性",
  personality: "專注且富有耐心，在遊戲中磨練心志，在技術學習中追求極致。是一位熱愛解決問題的學習者。",
  career: "學習手操技術員，專研精密設備操作與維護流程，致力於提升操作精準度與穩定性。",
  interests: "沉浸式突圍、設備拆解研究、戶外露營、數據監控。",
  health: "體力充沛，經常參與戶外活動與耐力訓練，保持極佳的注意力和手部穩定性。",
  contact: {
    email: "pczhuo.cheater@guymail.com",
    phone: "+886 987-131-142",
    ig: "@pczhuo_guy"
  },
  // 使用男生插畫頭像作為占位，直到圖片生成額度恢復
  photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=ffdfbf"
};

const DETAIL_ITEMS: DetailItem[] = [
  {
    id: '1',
    category: 'interests',
    title: '遊戲生活',
    content: '在靜謐中尋找平穩與契機',
    icon: <Anchor className="w-5 h-5" />,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: '2',
    category: 'career',
    title: '核心技能',
    content: '精密設備操作與參數調整',
    icon: <Settings className="w-5 h-5" />,
    color: 'bg-slate-100 text-slate-600'
  },
  {
    id: '3',
    category: 'interests',
    title: '戶外探險',
    content: '享受自然的呼吸與挑戰',
    icon: <MapPin className="w-5 h-5" />,
    color: 'bg-emerald-100 text-emerald-600'
  },
  {
    id: '4',
    category: 'career',
    title: '學習目標',
    content: '成為頂尖手操技術專家',
    icon: <Briefcase className="w-5 h-5" />,
    color: 'bg-indigo-100 text-indigo-600'
  }
];

const PORTFOLIO: PortfolioItem[] = [
  {
    id: 'p1',
    title: '設備自動化腳本',
    description: '使用 Python 撰寫的輔助工具，用於自動記錄設備運行的即時參數，大幅減少人工誤差。',
    link: '#',
    github: 'https://github.com',
    tags: ['Python', 'Automation']
  },
  {
    id: 'p2',
    title: '精密操作維護手冊',
    description: '整理並設計了針對特定型號設備的數位化維護流程，結合圖文說明提升教學效率。',
    link: '#',
    github: 'https://github.com',
    tags: ['Technical Writing', 'Design']
  }
];

export default function App() {
  const [filter, setFilter] = useState<Category>('all');
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [formData, setFormData] = useState({ name: '', email: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem('guest_messages');
    if (savedMessages) setMessages(JSON.parse(savedMessages));
  }, []);

  const filteredItems = filter === 'all' 
    ? DETAIL_ITEMS 
    : DETAIL_ITEMS.filter(item => item.category === filter);

  const scrollToDetail = () => {
    setIsExpanded(true);
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.content) return;
    
    setIsSubmitting(true);
    const newMessage: GuestMessage = {
      id: Date.now().toString(),
      ...formData,
      timestamp: new Date().toLocaleDateString()
    };
    
    const updated = [newMessage, ...messages];
    setMessages(updated);
    localStorage.setItem('guest_messages', JSON.stringify(updated));
    setFormData({ name: '', email: '', content: '' });
    
    setTimeout(() => {
      setIsSubmitting(false);
      alert('留言已成功送出！');
    }, 800);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden pt-12 pb-0 px-4 md:px-8">
      {/* --- Background Decorations --- */}
      <div className="blob bg-[#FFD1B3] w-[400px] h-[400px] -top-20 -right-20 animate-pulse" />
      <div className="blob bg-[#FFE8D6] w-[350px] h-[350px] top-1/2 -left-20 animate-pulse" style={{ animationDelay: '1.5s' }} />

      <main className="z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* --- Left Column: Profile Card --- */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-8"
        >
          <div className="bg-white rounded-[40px] p-8 card-shadow border border-orange-50 flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-orange-100 blur-2xl opacity-40 animate-pulse" />
              <img 
                src={PROFILE.photo} 
                alt={PROFILE.name}
                referrerPolicy="no-referrer"
                className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
              />
              <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white p-2 rounded-xl shadow-lg">
                <Anchor className="w-5 h-5" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{PROFILE.name}</h1>
            
            <div className="flex gap-2 mb-4 justify-center">
              <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-bold uppercase tracking-wider">
                {PROFILE.age} 歲
              </span>
              <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-bold uppercase tracking-wider">
                {PROFILE.gender}
              </span>
            </div>
            
            <p className="text-gray-500 text-sm leading-relaxed mb-6 px-2">
              {PROFILE.personality}
            </p>

            <div className="w-full border-t border-orange-50 pt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600 truncate">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" /> {PROFILE.contact.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" /> {PROFILE.contact.phone}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Instagram className="w-4 h-4 text-orange-400 shrink-0" /> {PROFILE.contact.ig}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-6 card-shadow border border-orange-50">
            <h3 className="text-gray-400 text-[10px] uppercase tracking-widest mb-4 font-bold">學習進度</h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>手操技術熟練度</span>
                  <span className="text-orange-500">75%</span>
                </div>
                <div className="h-2 w-full bg-orange-50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '75%' }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="h-full bg-orange-500 rounded-full" 
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- Right Column: Sections --- */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-8 flex flex-col gap-8 pb-20"
        >
          {/* Action Bar */}
          <div className="bg-white/60 backdrop-blur-md rounded-[24px] p-3 border border-white/80 card-shadow flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-1 p-1 bg-gray-50 rounded-xl">
              {(['all', 'interests', 'career'] as Category[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`
                    px-5 py-2 rounded-lg text-sm font-bold transition-all
                    ${filter === cat 
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-100' 
                      : 'text-gray-500 hover:bg-white'}
                  `}
                >
                  {cat === 'all' ? '全部' : cat === 'interests' ? '興趣' : '事業'}
                </button>
              ))}
            </div>
            <button 
              onClick={scrollToDetail}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all flex items-center gap-2 group"
            >
              了解更多 <ChevronDown className="w-4 h-4 text-orange-400 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white p-8 rounded-[32px] border border-orange-50 card-shadow group hover:border-orange-200 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                    {item.icon}
                  </div>
                  <div className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">{item.title}</div>
                  <p className="text-xl font-bold text-gray-800">{item.content}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Portfolio Section */}
          <section id="portfolio" ref={detailRef} className="space-y-6 pt-6 scroll-mt-20">
            <div className="flex items-center gap-3 mb-2 px-2 text-orange-500 uppercase tracking-widest text-xs font-black">
              <Briefcase className="w-5 h-5" /> 精選作品 / Portfolio
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PORTFOLIO.map((project) => (
                <div key={project.id} className="bg-white rounded-[32px] p-8 border border-orange-50 card-shadow flex flex-col h-full group">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors">{project.title}</h3>
                    <div className="flex gap-2">
                       <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"><Github className="w-4 h-4" /></a>
                       <a href={project.link} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"><ExternalLink className="w-4 h-4" /></a>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-gray-50 text-[10px] font-bold text-gray-400 rounded-md uppercase tracking-wider">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Career & Health Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[32px] p-8 border border-orange-50 card-shadow">
              <div className="text-orange-500 font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                <Briefcase className="w-5 h-5" /> 事業描述
              </div>
              <p className="text-gray-600 text-sm leading-relaxed font-bold">
                {PROFILE.career}
              </p>
            </div>
            <div className="bg-rose-50 rounded-[32px] p-8 border border-rose-100">
               <div className="text-rose-600 font-bold mb-4 uppercase text-[10px] tracking-widest">
                  Health Status 健康狀況
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-gray-800 text-sm font-bold italic tracking-tight leading-relaxed">
                    {PROFILE.health}
                  </span>
               </div>
            </div>
          </div>

          {/* Guestbook Section */}
          <section className="bg-white rounded-[40px] p-8 border border-orange-50 card-shadow space-y-8">
            <div className="flex items-center gap-3 text-orange-500 uppercase tracking-widest text-xs font-black">
              <MessageSquare className="w-5 h-5" /> 訪客留言 / Guestbook
            </div>

            <form onSubmit={handleMessageSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 px-1">姓名 / Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-200 focus:bg-white outline-none transition-all text-sm"
                  placeholder="您的姓名"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 px-1">信箱 / Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-200 focus:bg-white outline-none transition-all text-sm"
                  placeholder="you@email.com"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 px-1">留言內容 / Message</label>
                <textarea 
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:border-orange-200 focus:bg-white outline-none transition-all text-sm resize-none"
                  placeholder="想對我說的話..."
                  required
                />
              </div>
              <div className="md:col-span-2 pt-2 text-right">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-10 py-3 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-100 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? '傳送中...' : <><Send className="w-4 h-4" /> 送出留言</>}
                </button>
              </div>
            </form>

            <div className="pt-6 border-t border-gray-50 space-y-6">
              <AnimatePresence>
                {messages.length > 0 ? (
                  messages.map((msg) => (
                    <motion.div 
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4 p-4 rounded-3xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 shrink-0 uppercase font-black text-xs">
                        {msg.name[0]}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-800 text-sm">{msg.name}</span>
                          <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed font-medium">{msg.content}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-400 text-sm italic">
                    尚無留言，成為第一個打招呼的人吧！
                  </div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* Social / Contact Footer Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center px-4">
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-orange-50 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:border-orange-200 transition-all card-shadow">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={`mailto:${PROFILE.contact.email}`} className="w-10 h-10 rounded-full bg-white border border-orange-50 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:border-orange-200 transition-all card-shadow">
                <Mail className="w-4 h-4" />
              </a>
            </div>
            <div className="text-gray-400 text-[10px] font-bold tracking-widest uppercase md:text-right">
              &copy; {new Date().getFullYear()} {PROFILE.name} . Handcrafted with Soul.
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

