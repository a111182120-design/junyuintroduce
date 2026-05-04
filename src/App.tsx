import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
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
  MessageSquare,
  FileText,
  X,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Maximize,
  Play
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
  gallery?: { url: string; desc: string; type?: 'video' | 'image' | 'pdf'; }[];
}

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  link: string;
  github: string;
  tags: string[];
  imageUrl: string;
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
  name: "卓同學 (Zhuo)",
  age: 19,
  gender: "男性",
  personality: "專注且富有耐心，在學習中磨練心志，在技術學習中追求極致。是一位熱愛解決問題的學習者。",
  career: "學習手操技術員，專研精密設備操作與維護流程，致力於提升操作精準度與穩定性。",
  interests: "沉浸式垂釣、設備拆解研究、戶外露營、數據監控。",
  health: "體力充沛，經常參與戶外活動與耐力訓練，保持極佳的注意力和手部穩定性。",
  contact: {
    email: "zhuo.cheater@guymail.com",
    phone: "+886 987-131-996",
    ig: "@zhuo_guy"
  },
  // 使用上傳的圖片作為頭像
  photo: "/1000002926.jpg"
};

const DETAIL_ITEMS: DetailItem[] = [
  {
    id: '1',
    category: 'interests',
    title: '享受生活',
    content: '在靜謐中尋找平穩與契機',
    icon: <Anchor className="w-5 h-5" />,
    color: 'bg-blue-100 text-blue-600',
    gallery: [
      { url: '/video1.mp4', desc: 'Establishing Shot 1', type: 'video' },
      { url: '/video2.mp4', desc: 'Establishing Shot 2', type: 'video' },
      { url: '/video3.mp4', desc: 'Establishing Shot 3', type: 'video' },
      { url: '/video4.mp4', desc: 'Sunrise at Taroko', type: 'video' }
    ]
  },
  {
    id: '2',
    category: 'career',
    title: '工作經歷',
    content: '年貨大街包裝年貨',
    icon: <Settings className="w-5 h-5" />,
    color: 'bg-slate-100 text-slate-600'
  },
  {
    id: '3',
    category: 'interests',
    title: '戶外探險',
    content: '享受自然的呼吸與挑戰',
    icon: <MapPin className="w-5 h-5" />,
    color: 'bg-emerald-100 text-emerald-600',
    gallery: [
      { url: '/file1.pdf', desc: '4天3夜自由行攻略', type: 'pdf' },
      { url: '/file2.pdf', desc: '清明連假的靜心手札・宜蘭與花蓮', type: 'pdf' },
      { url: '/file3.pdf', desc: '東海岸山海避世之旅', type: 'pdf' },
      { url: '/file4.pdf', desc: '清明連假旅遊 宜蘭 · 花蓮', type: 'pdf' }
    ]
  },
  {
    id: '4',
    category: 'career',
    title: '就讀',
    content: '高科大航運技術系五專部四年級',
    icon: <Briefcase className="w-5 h-5" />,
    color: 'bg-indigo-100 text-indigo-600'
  }
];

const PORTFOLIO: PortfolioItem[] = [
  {
    id: 'p1',
    title: 'AI生成3D公仔',
    description: '去屏東吃冰淇淋',
    link: 'https://studio.tripo3d.ai/3d-model/757f2a93-f942-4df3-a1bf-898d128d8584?invite_code=8ESPND',
    github: 'https://github.com',
    tags: ['Python', 'Automation'],
    imageUrl: '/20260125_133158.jpg'
  },
  {
    id: 'p2',
    title: '精密操作維護手冊',
    description: '整理並設計了針對特定型號設備的數位化維護流程，結合圖文說明提升教學效率。',
    link: '#',
    github: 'https://github.com',
    tags: ['Technical Writing', 'Design'],
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop'
  }
];

function PdfViewer({ url }: { url: string }) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setPageNumber(1);
  }

  return (
    <div className="flex flex-col items-center">
      <Document 
        file={url} 
        onLoadSuccess={onDocumentLoadSuccess} 
        className="shadow-2xl rounded-lg overflow-hidden bg-white max-h-[75vh] overflow-y-auto"
        loading={<div className="text-white/70 p-8">載入 PDF 中...</div>}
        error={<div className="text-rose-400 p-8">載入失敗，請確認檔案路徑。</div>}
      >
        <Page 
           pageNumber={pageNumber} 
           width={Math.min(window.innerWidth * 0.85, 1000)} 
           renderTextLayer={false}
           renderAnnotationLayer={false}
        />
      </Document>
      {numPages && numPages > 1 && (
        <div className="flex items-center gap-4 mt-4 bg-black/60 px-6 py-2 rounded-full backdrop-blur-md text-white z-10">
          <button 
            disabled={pageNumber <= 1} 
            onClick={(e) => { e.stopPropagation(); setPageNumber(p => p - 1); }}
            className="disabled:opacity-50 hover:text-orange-400 font-bold px-2 py-1"
          >
            上一頁
          </button>
          <span className="font-mono text-sm">{pageNumber} / {numPages}</span>
          <button 
            disabled={pageNumber >= numPages} 
            onClick={(e) => { e.stopPropagation(); setPageNumber(p => p + 1); }}
            className="disabled:opacity-50 hover:text-orange-400 font-bold px-2 py-1"
          >
            下一頁
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [profile, setProfile] = useState(PROFILE);
  const [details, setDetails] = useState(DETAIL_ITEMS);
  const [portfolio, setPortfolio] = useState(PORTFOLIO);

  const [filter, setFilter] = useState<Category>('all');
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [formData, setFormData] = useState({ name: '', email: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);

  const [editModal, setEditModal] = useState<{
    open: boolean;
    url: string;
    onSave: (url: string) => void;
  }>({ open: false, url: '', onSave: () => {} });

  const [presentation, setPresentation] = useState<{
    open: boolean;
    images: { url: string; desc: string; type?: 'video' | 'image' | 'pdf' }[];
    currentIndex: number;
  }>({ open: false, images: [], currentIndex: 0 });

  useEffect(() => {
    const savedMessages = localStorage.getItem('guest_messages');
    if (savedMessages) setMessages(JSON.parse(savedMessages));
  }, []);

  const filteredItems = filter === 'all' 
    ? details 
    : details.filter(item => item.category === filter);

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
            <div className="relative mb-6 inline-block group/profile">
              <div className="absolute inset-0 rounded-full bg-orange-100 blur-2xl opacity-40 animate-pulse" />
              <img 
                src={profile.photo} 
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className="absolute inset-0 rounded-full bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover/profile:opacity-100 transition-opacity gap-2 z-10">
                <button 
                  onClick={() => setPresentation({ open: true, images: [{ url: profile.photo, desc: profile.name }], currentIndex: 0 })}
                  className="p-1.5 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors"
                  title="檢視圖片"
                >
                  <Maximize className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setEditModal({ 
                    open: true, 
                    url: profile.photo, 
                    onSave: (url) => setProfile({ ...profile, photo: url }) 
                  })}
                  className="p-1.5 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors"
                  title="編輯圖片"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 bg-orange-500 text-white p-2 rounded-full shadow-lg border-[3px] border-white z-20">
                <Anchor className="w-5 h-5" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{profile.name}</h1>
            
            <div className="flex gap-2 mb-4 justify-center">
              <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-bold uppercase tracking-wider">
                {profile.age} 歲
              </span>
              <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-bold uppercase tracking-wider">
                {profile.gender}
              </span>
            </div>
            
            <p className="text-gray-500 text-sm leading-relaxed mb-6 px-2">
              {profile.personality}
            </p>

            <div className="w-full border-t border-orange-50 pt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600 truncate">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" /> {profile.contact.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" /> {profile.contact.phone}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Instagram className="w-4 h-4 text-orange-400 shrink-0" /> {profile.contact.ig}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-6 card-shadow border border-orange-50">
            <h3 className="text-gray-400 text-[10px] uppercase tracking-widest mb-4 font-bold">學習進度</h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>多益模擬測驗600分</span>
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
          {/* Autobiography Section */}
          <section className="bg-white rounded-[40px] p-8 md:p-10 border border-orange-50 card-shadow relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-8 text-orange-500 uppercase tracking-widest text-xs font-black">
              <span className="w-1.5 h-6 bg-orange-500 rounded-full inline-block"></span>
              自傳 / Autobiography
            </div>
            
            <div className="space-y-6 text-gray-600 text-sm md:text-base leading-8 font-medium">
              <p>我是卓納宇，高雄人，每當面臨挑戰時我便會勉勵自己「沒有盡力而為，只有竭盡全力。」我積極與他人互動並建立良好關係，因父母皆是公務員，從小便要求我應盡到學生應盡的責任，進而養成良好的溫書習慣；我的興趣是瀏覽社群媒體，瞭解最新的潮流趨勢，也會順道和好友互傳訊息交流。</p>
              <p>在小學時代的我很活潑、很好動，在課業上表現平平，但課外表現不錯，擔任過排長打掃同學座位保持教室整潔，參加過打擊樂社團培養課外才藝，另外還曾獲選校慶運動會選手參加大隊接力賽和同學爭取班級榮譽。小學畢業後，進入了一所中山大學附設國中，因為校規嚴格，使原本好動的我變得較為文靜，不過在那裡我學會了許多應有的禮節與待人處世的道理。</p>
              <p>因為想到世界各地看看，會考以高科大航技系為第一志願並獲錄取，經過近一年的學習，海事英文課讓我獲益良多且更加深了我對海員的興趣和憧憬。為了增進英文能力，也參加這學期的多益課程，課前測驗600分，希望正式考試能提升成績。課業之餘也不忘適度地放鬆心情，加入高科大獨木舟在揮灑汗水的同時將高雄港的美景盡收眼底。</p>
              <p>我平常便特別重視自身的狀態，以利在面臨挑戰時能冷靜的分析處理以確保每個環節都能完整的發揮作用；我相信良好的關係是合作的基石，在盡到自身的責任時，也不忘幫助他人，和他人一起合作達成目標，未來也希望能進到貴公司和前輩學習，成為更優秀的海事人才。</p>
            </div>
          </section>

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
                  className={`bg-white p-8 rounded-[32px] border border-orange-50 card-shadow group hover:border-orange-200 transition-colors flex flex-col ${item.gallery && item.gallery.length > 0 ? 'sm:col-span-2' : ''}`}
                >
                  <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                    {item.icon}
                  </div>
                  <div className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">{item.title}</div>
                  <p className="text-xl font-bold text-gray-800 flex-grow">{item.content}</p>
                  
                  {item.gallery && item.gallery.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                      {item.gallery.map((img, idx) => (
                        <div 
                          key={idx} 
                          className="relative group/img rounded-2xl overflow-hidden aspect-square border-2 border-orange-50 shadow-sm block bg-black"
                        >
                           {img.type === 'video' ? (
                             <video 
                               src={img.url} 
                               className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                               autoPlay 
                               loop 
                               muted 
                               playsInline
                             />
                           ) : img.type === 'pdf' ? (
                             <div className="w-full h-full flex items-center justify-center bg-gray-100 group-hover/img:scale-105 transition-transform duration-500">
                               <FileText className="w-12 h-12 text-gray-300" />
                             </div>
                           ) : (
                             <img src={img.url} alt={img.desc} className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" />
                           )}

                           <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3 opacity-0 group-hover/img:opacity-100 transition-opacity z-10">
                             <button 
                               onClick={() => setPresentation({ open: true, images: item.gallery as {url: string, desc: string, type?: 'video'|'image'|'pdf'}[], currentIndex: idx })}
                               className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors backdrop-blur-sm shadow-xl"
                               title="檢視簡報"
                             >
                               <Play className="w-4 h-4" fill="currentColor" />
                             </button>
                             <button 
                               onClick={() => setEditModal({ 
                                 open: true, 
                                 url: img.url, 
                                 onSave: (newUrl) => {
                                   const newDetails = [...details];
                                   const dItemIndex = newDetails.findIndex(d => d.id === item.id);
                                   if (dItemIndex > -1 && newDetails[dItemIndex].gallery) {
                                      newDetails[dItemIndex].gallery![idx].url = newUrl;
                                      setDetails(newDetails);
                                   }
                                 }
                               })}
                               className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors backdrop-blur-sm shadow-xl"
                               title="編輯圖片"
                             >
                               <Edit2 className="w-4 h-4" />
                             </button>
                           </div>

                           <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8 transition-opacity pointer-events-none">
                              <p className="text-white text-xs font-bold tracking-wider">{img.desc}</p>
                           </div>
                        </div>
                      ))}
                    </div>
                  )}
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
              {portfolio.map((project) => (
                <div key={project.id} className="bg-white rounded-[32px] overflow-hidden border border-orange-50 card-shadow flex flex-col h-full group">
                  <div className="h-48 w-full overflow-hidden relative group/portimg bg-black/5">
                    <img 
                      src={project.imageUrl} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover/portimg:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3 opacity-0 group-hover/portimg:opacity-100 transition-opacity z-10">
                      <button 
                        onClick={() => setPresentation({ open: true, images: [{ url: project.imageUrl, desc: project.title }], currentIndex: 0 })}
                        className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors backdrop-blur-sm"
                        title="檢視圖片"
                      >
                        <Maximize className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setEditModal({ 
                          open: true, 
                          url: project.imageUrl, 
                          onSave: (newUrl) => {
                            const newPort = [...portfolio];
                            const pIdx = newPort.findIndex(p => p.id === project.id);
                            if (pIdx > -1) {
                               newPort[pIdx].imageUrl = newUrl;
                               setPortfolio(newPort);
                            }
                          }
                        })}
                        className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors backdrop-blur-sm"
                        title="編輯圖片"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
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
                </div>
              ))}
            </div>
          </section>

          {/* Career & Health Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[32px] p-8 border border-orange-50 card-shadow">
              <div className="text-orange-500 font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                <Briefcase className="w-5 h-5" /> 證照
              </div>
              <p className="text-gray-600 text-sm leading-relaxed font-bold flex flex-col gap-2">
                <span>• 基本安全訓練</span>
                <span>• 滅火訓練</span>
                <span>• 救生艇與救難艇操縱</span>
                <span>• 人員求生</span>
              </p>
            </div>
            <div className="bg-rose-50 rounded-[32px] p-8 border border-rose-100">
               <div className="text-rose-600 font-bold mb-4 uppercase text-[10px] tracking-widest">
                  Health Status 健康狀況
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-gray-800 text-sm font-bold italic tracking-tight leading-relaxed">
                    {profile.health}
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
              <a href={`mailto:${profile.contact.email}`} className="w-10 h-10 rounded-full bg-white border border-orange-50 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:border-orange-200 transition-all card-shadow">
                <Mail className="w-4 h-4" />
              </a>
            </div>
            <div className="text-gray-400 text-[10px] font-bold tracking-widest uppercase md:text-right">
              &copy; {new Date().getFullYear()} {profile.name} . Handcrafted with Soul.
            </div>
          </div>
        </motion.div>
      </main>

      {/* -- Modals -- */}
      <AnimatePresence>
        {editModal.open && (
          <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[24px] p-6 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">編輯圖片</h3>
              <input 
                type="text" 
                value={editModal.url}
                onChange={(e) => setEditModal({ ...editModal, url: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:border-orange-400"
                placeholder="請輸入圖片網址 (URL)"
              />
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setEditModal({ ...editModal, open: false })}
                  className="px-5 py-2 rounded-xl text-gray-500 font-bold hover:bg-gray-100 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    editModal.onSave(editModal.url);
                    setEditModal({ ...editModal, open: false });
                  }}
                  className="px-5 py-2 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all"
                >
                  儲存
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {presentation.open && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center"
          >
            <button 
              onClick={() => setPresentation({ ...presentation, open: false })}
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2 transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div className="flex-1 w-full flex items-center justify-center p-4 md:p-8 relative">
               <div className="absolute left-2 md:left-6 z-10">
                 <button 
                   onClick={() => setPresentation({ ...presentation, currentIndex: Math.max(0, presentation.currentIndex - 1) })}
                   disabled={presentation.currentIndex === 0}
                   className="text-white/70 hover:text-white p-2 md:p-4 disabled:opacity-30 transition-all"
                 >
                    <ChevronLeft className="w-10 h-10" />
                 </button>
               </div>
               
               <div className="max-w-5xl w-full h-full flex flex-col items-center justify-center relative">
                  {presentation.images[presentation.currentIndex]?.type === 'video' ? (
                    <video 
                      src={presentation.images[presentation.currentIndex]?.url} 
                      controls
                      autoPlay
                      className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
                    />
                  ) : presentation.images[presentation.currentIndex]?.type === 'pdf' ? (
                    <PdfViewer url={presentation.images[presentation.currentIndex]?.url} />
                  ) : (
                    <img 
                      src={presentation.images[presentation.currentIndex]?.url} 
                      alt={presentation.images[presentation.currentIndex]?.desc}
                      className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
                    />
                  )}
                  {presentation.images[presentation.currentIndex]?.desc && (
                    <p className="text-white/90 mt-6 text-lg font-bold tracking-widest bg-black/60 px-8 py-3 rounded-full backdrop-blur-md">
                      {presentation.images[presentation.currentIndex].desc}
                    </p>
                  )}
               </div>

               <div className="absolute right-2 md:right-6 z-10">
                 <button 
                   onClick={() => setPresentation({ ...presentation, currentIndex: Math.min(presentation.images.length - 1, presentation.currentIndex + 1) })}
                   disabled={presentation.currentIndex === presentation.images.length - 1}
                   className="text-white/70 hover:text-white p-2 md:p-4 disabled:opacity-30 transition-all"
                 >
                    <ChevronRight className="w-10 h-10" />
                 </button>
               </div>
            </div>
            
            <div className="h-20 w-full flex items-center justify-center pb-6">
              <div className="flex gap-3">
                {presentation.images.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setPresentation({ ...presentation, currentIndex: idx })}
                    className={`h-2 rounded-full transition-all ${idx === presentation.currentIndex ? 'bg-orange-500 w-8' : 'bg-white/30 hover:bg-white/50 w-2'}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

