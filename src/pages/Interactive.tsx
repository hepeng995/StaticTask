import { motion, AnimatePresence, useAnimation } from 'motion/react';
import { Heart, Sparkles, Zap, Shield, Coffee, Ghost, Flame, Smile, UserCircle, StickyNote, RotateCcw, Target, Terminal, Skull, Crosshair, Gift, Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, FormEvent } from 'react';

interface StickyNoteData {
  id: number;
  text: string;
  sender: string;
  color: string;
  x: number;
  y: number;
  rotation: number;
  isSpecial?: boolean;
}

const INITIAL_BOUNTIES = [
  { id: 1, title: '修复 IE11 的 flexbox 兼容问题', reward: '冰美式一杯', status: 'open', difficulty: 'S', issuer: '产品组' },
  { id: 2, title: '帮忙拉库跑一下那个祖传 Java 项目', reward: '烧烤一顿', status: 'taken', difficulty: 'A', issuer: '前端组' },
  { id: 3, title: '把文案里的“登陆”全部改成“登录”', reward: '棒棒糖', status: 'open', difficulty: 'C', issuer: '测试组' },
];

export function Interactive() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [senderName, setSenderName] = useState('访客_');
  const [notes, setNotes] = useState<StickyNoteData[]>([]);
  const [energy, setEnergy] = useState(85);
  const containerRef = useRef<HTMLDivElement>(null);

  // Confessional States
  const [confession, setConfession] = useState('');
  const [confessions, setConfessions] = useState([
    "我不小心把测试库当生产库清空了，但我没说。",
    "那个祖传的 NullPointerException 是我为了赶进度直接 try-catch 吞掉的。",
  ]);
  const [scapegoat, setScapegoat] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const teamMembers = ['何祥鹏', '余佳', '张凯峰', '牛青峰', '段利利', '袁丹琴'];

  // Bounty Board States
  const [bounties, setBounties] = useState(INITIAL_BOUNTIES);


  // Initial mock notes
  useEffect(() => {
    const initialNotes: StickyNoteData[] = [
      { id: 1, text: '祥鹏又在带薪拉屎了！！！！', sender: '系统', color: 'bg-neon-blue', x: 2000 - 150, y: 2000 - 100, rotation: -3 },
      { id: 2, text: '哈哈哈哈哈哈这段笑死我了', sender: '余佳', color: 'bg-neon-pink', x: 2000 + 100, y: 2000 - 150, rotation: 2 },
      { id: 3, text: '前排兜售瓜子可乐 🍿', sender: '张凯峰', color: 'bg-neon-green', x: 2000 - 50, y: 2000 + 50, rotation: -1 },
      { id: 4, text: 'Saturday Team 永远滴神！', sender: '核心成员', color: 'bg-accent-color', x: 2000 + 150, y: 2000 + 100, rotation: 4, isSpecial: true },
    ];
    setNotes(initialNotes);
  }, []);

  const [scale, setScale] = useState(1);

  // Handle Wheel Zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomSensitivity = 0.002;
      const delta = -e.deltaY * zoomSensitivity;
      setScale(s => Math.min(Math.max(0.2, s + delta), 4));
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  const handleMoyuClick = () => {
    navigate('/members#map');
  };

  const controls = useAnimation();

  const handleRecenter = () => {
    setScale(1);
    controls.start({ x: 0, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } });
  };

  const sendNote = () => {
    if (!inputText.trim()) return;
    
    const name = senderName.trim() || '匿踪黑客';
    const isSpecial = ['何祥鹏', '余佳', '张凯峰', '牛青峰', '段利利', '袁丹琴', 'Admin'].some(k => name.toLowerCase().includes(k.toLowerCase()));
    
    const colors = isSpecial 
      ? ['bg-yellow-400'] 
      : ['bg-neon-blue', 'bg-neon-pink', 'bg-neon-green', 'bg-accent-color', 'bg-white'];

    const newNote: StickyNoteData = {
      id: Date.now(),
      text: inputText,
      sender: name,
      color: colors[Math.floor(Math.random() * colors.length)],
      x: 2000 + (Math.random() - 0.5) * 500,
      y: 2000 + (Math.random() - 0.5) * 400,
      rotation: (Math.random() - 0.5) * 15,
      isSpecial: isSpecial
    };
    
    setNotes(prev => [...prev, newNote]);
    setInputText('');
    
    // Keep internal "wall" clean by limiting count
    if (notes.length > 50) {
      setNotes(prev => prev.slice(1));
    }
  };

  const clearBoard = () => {
    setNotes([]);
  };

  const handleConfess = (e: FormEvent) => {
    e.preventDefault();
    if (!confession.trim()) return;
    setConfessions([confession, ...confessions]);
    setConfession('');
  };

  const spinScapegoat = () => {
    setIsSpinning(true);
    let spins = 0;
    const interval = setInterval(() => {
      setScapegoat(teamMembers[Math.floor(Math.random() * teamMembers.length)]);
      spins++;
      if (spins > 20) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 100);
  };

  const takeBounty = (id: number) => {
    setBounties(bounties.map(b => b.id === id ? { ...b, status: 'taken' } : b));
  };


  return (
    <div className="space-y-24 animate-[fadeIn_0.5s_ease-out]">
      {/* 头部装饰 */}
      <div className="flex justify-center">
        <div className="bg-black text-white dark:bg-white dark:text-black px-6 py-2 font-black border-4 border-black dark:border-white shadow-[4px_4px_0_var(--color-ink)] flex items-center gap-2 uppercase tracking-[0.2em] skew-x-[-12deg]">
          <Zap className="w-5 h-5 fill-current" /> 互动体验终端
        </div>
      </div>

      <section className="relative">
        <div className="flex justify-between items-end mb-6 font-sans">
          <div className="border-l-8 border-accent-color pl-4 font-sans">
             <h2 className="text-4xl font-black uppercase flex items-center gap-2 font-sans">
               贴纸留言板 <StickyNote className="text-accent-color" />
             </h2>
             <p className="opacity-60 font-mono text-xs mt-1 uppercase">Saturday Team Memo Wall</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={clearBoard}
              className="flex items-center gap-2 px-3 py-1 bg-black/5 dark:bg-white/5 border-2 border-dashed border-black/30 dark:border-white/30 text-[10px] font-bold uppercase hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> 清空显示板
            </button>
            <div className="hidden md:flex items-center gap-4 bg-black/5 dark:bg-white/5 border-2 border-black dark:border-white p-2 text-black dark:text-white">
              <span className="text-[10px] font-bold font-mono opacity-50 uppercase">Identity:</span>
              <span className="text-accent-color text-xs font-black uppercase tracking-tighter mix-blend-difference">
                 {senderName || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div 
          className="relative h-[70vh] glass-card !rounded-none overflow-hidden border-4 border-black dark:border-white bg-[#e0dfd5] dark:bg-[#1a1a1a] shadow-[inset_0_0_100px_rgba(0,0,0,0.1)] group flex items-center justify-center cursor-grab active:cursor-grabbing" 
          ref={containerRef}
        >
          {/* Zoom Controls Overlay */}
          <div className="absolute top-4 right-4 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-2 border-black dark:border-white flex flex-col pointer-events-auto shadow-[4px_4px_0_var(--color-ink)]">
            <button onClick={() => setScale(s => Math.min(4, s + 0.2))} className="p-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-mono font-bold leading-none">+</button>
            <div className="text-[10px] font-mono font-black text-center border-y-2 border-black dark:border-white py-1">{Math.round(scale * 100)}%</div>
            <button onClick={() => setScale(s => Math.max(0.2, s - 0.2))} className="p-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-mono font-bold leading-none">-</button>
            <button onClick={handleRecenter} title="回到中心点" className="p-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border-t-2 border-black dark:border-white flex justify-center items-center">
               <Target className="w-4 h-4" />
            </button>
          </div>

          <motion.div
            drag
            dragConstraints={{ top: -1500, left: -1500, right: 1500, bottom: 1500 }}
            style={{ scale }}
            animate={controls}
            className="absolute w-[4000px] h-[4000px] top-1/2 left-1/2 -ml-[2000px] -mt-[2000px]"
          >
            {/* 背景纹理：网格跟随缩放 */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '40px 40px', backgroundPosition: 'center' }} />
            
            {/* 实时贴纸层 */}
            <AnimatePresence>
               {notes.map(note => (
                 <motion.div 
                   key={note.id}
                   initial={{ scale: 2, opacity: 0, rotate: 40 }}
                   animate={{ scale: 1, opacity: 1, rotate: note.rotation }}
                   exit={{ scale: 0, opacity: 0 }}
                   drag
                   dragMomentum={false}
                   onPointerDown={(e: any) => e.stopPropagation()} // Prevent board drag when interacting with note
                   whileDrag={{ scale: 1.05, zIndex: 100 }}
                   className={`absolute w-40 md:w-52 p-4 border-2 border-black shadow-[4px_4px_0_#000] cursor-grab active:cursor-grabbing select-none ${note.color} ${note.isSpecial ? 'ring-4 ring-yellow-400 ring-offset-2 dark:ring-offset-black' : ''}`}
                   style={{ 
                     left: note.x, 
                     top: note.y,
                   }}
                 >
                   {/* 贴纸条饰 */}
                   <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-white/50 border border-black/10 backdrop-blur-sm -rotate-2" />
                   
                   <div className="flex justify-between items-start mb-2 border-b border-black/20 pb-1">
                     <span className={`text-[9px] font-mono uppercase font-black px-1 ${note.isSpecial ? 'bg-black text-yellow-400' : 'bg-black/10 text-black'}`}>
                       SENDER: {note.sender}
                     </span>
                     <span className="text-[8px] font-mono opacity-40 text-black">#{note.id.toString().slice(-4)}</span>
                   </div>
                   
                   <p className="text-sm font-bold text-black leading-tight break-words py-2 font-mono">
                     {note.text}
                   </p>
                   
                   {note.isSpecial && (
                     <div className="absolute bottom-1 right-1">
                       <Flame className="w-4 h-4 text-black fill-yellow-400" />
                     </div>
                   )}
                 </motion.div>
               ))}
             </AnimatePresence>
          </motion.div>

          {/* 若为空板提示 */}
          {notes.length === 0 && (
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center select-none text-black/40 dark:text-white/40 pointer-events-none mix-blend-difference">
               <StickyNote className="w-24 h-24 mx-auto mb-4" />
               <p className="font-black text-2xl uppercase tracking-[0.4em]">Empty Board</p>
               <p className="font-mono text-xs">Waiting for tactical memos...</p>
            </div>
          )}
        </div>

        {/* 交互输入区 */}
        <div className="flex justify-center -mt-8 relative z-20">
          <div className="w-[95%] max-w-3xl bg-white dark:bg-[#111] border-4 border-black dark:border-white p-3 shadow-[12px_12px_0_var(--color-ink)] flex flex-col md:flex-row gap-3 items-stretch md:items-center text-black dark:text-white">
            <div className="flex gap-2 min-w-[150px]">
              <div className="bg-black text-white dark:bg-white dark:text-black p-2 flex items-center border border-black dark:border-white">
                <UserCircle className="w-5 h-5 text-accent-color" />
              </div>
              <input 
                type="text" 
                value={senderName}
                onChange={e => setSenderName(e.target.value)}
                placeholder="署名..." 
                maxLength={10}
                className="w-full bg-black/5 dark:bg-white/5 px-2 outline-none font-bold text-xs uppercase border border-black/20 dark:border-white/20 dark:placeholder:text-white/50 text-black dark:text-white"
              />
            </div>

            <div className="hidden md:block w-0.5 h-8 bg-black/10 dark:bg-white/10" />

            <div className="flex-1 flex gap-2 items-center">
              <input 
                type="text" 
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendNote()}
                placeholder="撰写你的贴纸留言..." 
                className="flex-1 bg-transparent px-2 py-2 outline-none dark:placeholder:text-white/30 font-bold tracking-widest text-lg text-black dark:text-white"
              />
              <button 
                onClick={sendNote}
                className="bg-accent-color text-black h-12 px-6 font-black uppercase tracking-widest flex items-center gap-2 hover:bg-neutral-800 hover:text-white transition-all border-2 border-black dark:border-white shadow-[4px_4px_0_var(--color-ink)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:scale-95 shrink-0"
              >
                <StickyNote className="w-5 h-5" /> 粘贴 (POST)
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Vibe Meter */}
        <div className="lg:col-span-1 space-y-6">
          <div className="border-l-8 border-neon-pink pl-4">
             <h3 className="text-2xl font-black uppercase flex items-center gap-2">
               小队能量电站 <Flame className="text-neon-pink" />
             </h3>
             <p className="opacity-60 font-mono text-xs mt-1 uppercase">Energy Level Analysis</p>
          </div>
          
          <div className="glass-card p-6 !rounded-none border-4 border-black dark:border-white shadow-[8px_8px_0_var(--color-ink)]">
             <div className="flex justify-between mb-4 font-mono font-black italic">
               <span>STATUS: OVERLOAD</span>
               <span className="text-neon-pink">{energy}%</span>
             </div>
             <div className="h-8 border-4 border-black dark:border-white bg-black/10 flex p-1">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${energy}%` }}
                  className="h-full bg-gradient-to-r from-neon-pink to-accent-color relative"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-50 overflow-hidden">
                    <div className="w-full h-full animate-[marquee_2s_linear_infinite]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.2) 10px, rgba(255,255,255,0.2) 20px)' }} />
                  </div>
                </motion.div>
             </div>
             <div className="grid grid-cols-5 gap-2 mt-6">
               {[Coffee, Heart, Zap, Ghost, Smile].map((Icon, i) => (
                 <button 
                   key={i}
                   onClick={() => setEnergy(prev => Math.min(100, prev + 2))}
                   className="aspect-square bg-white dark:bg-black border-2 border-black dark:border-white flex items-center justify-center hover:bg-accent-color hover:text-black transition-all shadow-[2px_2px_0_var(--color-ink)] hover:translate-y-0.5 hover:shadow-none font-sans text-black dark:text-white"
                 >
                   <Icon className="w-5 h-5" />
                 </button>
               ))}
             </div>
          </div>
        </div>

        {/* Action Grid */}
        <div className="lg:col-span-2 space-y-6">
           <div className="border-l-8 border-neon-green pl-4 font-sans">
             <h3 className="text-2xl font-black uppercase flex items-center gap-2 font-sans">
               快速指令集 <Sparkles className="text-neon-green" />
             </h3>
             <p className="opacity-60 font-mono text-xs mt-1 uppercase">Tactical Operations Hub</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: '好运祝福', icon: <Sparkles className="w-8 h-8 text-yellow-500" />, onClick: () => console.log('好运 +999') },
              { label: '摸鱼打卡', icon: <Heart className="w-8 h-8 text-red-500" />, onClick: handleMoyuClick },
              { label: '需求警告', icon: <Shield className="w-8 h-8 text-neutral-500" />, onClick: () => console.log('需求退散！') },
              { label: '在线续命', icon: <Coffee className="w-8 h-8 text-amber-600" />, onClick: () => setEnergy(prev => Math.min(100, prev + 5)) }
            ].map((btn, i) => (
              <motion.div 
                whileTap={{ scale: 0.95 }}
                key={i}
                onClick={btn.onClick}
                className="group aspect-square glass-card !rounded-none border-4 border-black dark:border-white shadow-[8px_8px_0_var(--color-ink)] flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
              >
                <div className="group-hover:scale-125 transition-transform duration-300">
                  {btn.icon}
                </div>
                <span className="mt-4 font-black uppercase tracking-widest text-xs group-hover:text-amber-300 transition-colors">{btn.label}</span>
                <div className="mt-1 text-[8px] font-mono opacity-40 group-hover:opacity-100 flex items-center gap-1">
                  <div className="w-1 h-1 bg-current rounded-full" /> CMD:EXEC_0{i+1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Integration: Cyber Confessional & Bug Wall --- */}
      <div className="pt-16 border-t-8 border-dashed border-black/10 dark:border-white/10 text-black dark:text-white">
        <div className="mb-12 border-l-8 border-black dark:border-white pl-4 font-sans">
          <h2 className="text-4xl font-black uppercase flex items-center gap-2 tracking-tighter">
            赛博忏悔室 & BUG 耻辱柱
          </h2>
          <p className="opacity-60 font-mono text-sm tracking-widest uppercase mt-2">
            CYBER CONFESSIONAL & WALL OF SHAME
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 匿名提交终端 */}
          <div className="glass-card border-4 border-black dark:border-white shadow-[8px_8px_0_var(--color-ink)] !rounded-none p-6 md:p-8 flex flex-col bg-[#111] text-neon-green font-mono">
            <div className="flex items-center gap-2 border-b-2 border-neon-green/30 pb-4 mb-4">
              <Terminal className="w-6 h-6" />
              <h3 className="text-xl font-bold uppercase tracking-widest">匿名提交终端 v1.0</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto max-h-64 space-y-4 mb-6 pr-2 scrollbar-thin scrollbar-thumb-neon-green scrollbar-track-transparent">
              {confessions.map((c, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  className="border-l-2 border-neon-green pl-3 py-1 text-xs leading-relaxed"
                >
                  <span className="text-neon-pink">[{new Date().toLocaleTimeString()}] ANON: </span>
                  {c}
                </motion.div>
              ))}
            </div>

            <form onSubmit={handleConfess} className="mt-auto flex items-center gap-3 bg-black border-2 border-neon-green/50 focus-within:border-neon-green p-2 shadow-inner transition-colors">
              <span className="text-neon-pink font-black pl-2 animate-pulse">{">_"}</span>
              <input 
                type="text" 
                value={confession}
                onChange={(e) => setConfession(e.target.value)}
                placeholder="匿名输入你的罪行 (按 ENTR 提交) ..."
                className="flex-1 bg-transparent text-neon-green focus:outline-none py-1 placeholder:text-neon-green/40 text-sm font-bold tracking-widest"
              />
            </form>
          </div>

          <div className="space-y-8 flex flex-col">
            {/* 损失估值排行榜 */}
            <div className="glass-card border-4 border-black dark:border-white p-6 !rounded-none shadow-[8px_8px_0_var(--color-ink)] flex-1 bg-white dark:bg-[#222]">
              <h3 className="text-xl font-black mb-6 uppercase flex items-center gap-2 border-b-4 border-black dark:border-white pb-2 w-max">
                <Skull className="w-6 h-6 text-red-500" /> 损失估值排行榜
              </h3>
              <div className="space-y-6">
                {[
                  { name: '何祥鹏', loss: '¥ 12,500', bar: '90%', incident: '误删核心索引' },
                  { name: '张凯峰', loss: '¥ 8,300', bar: '65%', incident: '死循环打爆计费API' },
                  { name: '牛青峰', loss: '¥ 1,200', bar: '15%', incident: '键盘砸坏了一个' },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between font-bold text-sm uppercase">
                      <span className="flex gap-2">
                        <span className="text-red-500">#{i+1}</span> {item.name}
                      </span>
                      <span className="font-mono text-red-500">{item.loss}</span>
                    </div>
                    <div className="h-4 w-full bg-black/5 dark:bg-white/10 border-2 border-black dark:border-white relative overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: item.bar }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="absolute inset-y-0 left-0 bg-red-500"
                      />
                    </div>
                    <div className="text-[10px] font-mono opacity-60 text-right">
                      重大事故: {item.incident}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 推锅大转盘 */}
            <div className="glass-card border-4 border-black dark:border-white p-6 !rounded-none shadow-[8px_8px_0_var(--color-ink)] bg-accent-color text-black text-center flex flex-col items-center justify-center relative overflow-hidden">
              <h3 className="text-2xl font-black uppercase mb-2 flex items-center gap-2">
                <Crosshair className="w-6 h-6" /> 祖传报错·推锅转盘
              </h3>
              <p className="text-xs font-mono font-bold opacity-80 mb-6">"这代码谁写的？看 Git Blame 居然是我自己？"</p>
              
              <div className="text-3xl md:text-5xl font-black bg-white border-4 border-black px-8 py-6 shadow-[8px_8px_0_#000] mb-6 min-w-[250px] transform -rotate-2">
                {scapegoat || "点击抽取背锅侠"}
              </div>

              <button 
                onClick={spinScapegoat}
                disabled={isSpinning}
                className="bg-black text-white font-black uppercase px-8 py-4 border-2 border-transparent hover:bg-white hover:text-black hover:border-black transition-colors shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-none disabled:opacity-50"
              >
                一键随机 (SPIN)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Integration: Bounty Board --- */}
      <div className="pt-16 border-t-8 border-dashed border-black/10 dark:border-white/10 text-black dark:text-white pb-12">
        <div className="mb-12 border-l-8 border-red-500 pl-4 font-sans">
          <h2 className="text-4xl font-black uppercase flex items-center gap-2 tracking-tighter text-red-500">
            黑市 & 悬赏大厅
          </h2>
          <p className="opacity-60 font-mono text-sm tracking-widest uppercase mt-2">
            BOUNTY BOARD & BLACK MARKET
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 悬赏布告栏 */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl md:text-2xl font-black flex items-center gap-2 uppercase tracking-widest bg-black text-white dark:bg-white dark:text-black py-2 px-4 shadow-[6px_6px_0_var(--color-ink)] w-max border-2 border-transparent">
              <Target className="w-6 h-6 text-red-500" /> 悬赏布告栏
            </h3>
            <p className="opacity-70 font-mono text-sm">
              遇到解不开的 Bug 或不想做的脏活累活？发布悬赏！重赏之下必有勇夫。
            </p>

            <div className="space-y-4">
              <AnimatePresence>
                {bounties.map((bounty) => (
                  <motion.div 
                    key={bounty.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`glass-card border-4 border-black dark:border-white !rounded-none p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[6px_6px_0_var(--color-ink)] transition-colors ${bounty.status === 'taken' ? 'opacity-50 grayscale' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
                  >
                    <div className="flex-1">
                      <div className="flex gap-2 mb-2">
                        <span className={`text-[10px] font-black px-2 py-1 uppercase border-2 border-black dark:border-white ${bounty.difficulty === 'S' ? 'bg-red-500 text-white' : 'bg-accent-color text-black'}`}>
                          RANK {bounty.difficulty}
                        </span>
                        <span className="text-[10px] font-mono opacity-60 border-2 border-dashed border-current px-2 py-1">发行方: {bounty.issuer}</span>
                      </div>
                      <h4 className="font-black text-lg text-black dark:text-white uppercase leading-tight">{bounty.title}</h4>
                      <p className="font-mono text-sm mt-2 text-neon-pink font-bold">🎯 赏金: {bounty.reward}</p>
                    </div>

                    <div className="shrink-0 flex items-center">
                      {bounty.status === 'open' ? (
                        <button 
                          onClick={() => takeBounty(bounty.id)}
                          className="w-full md:w-auto px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-black uppercase text-sm border-2 border-transparent hover:bg-accent-color hover:text-black transition-colors shadow-[4px_4px_0_var(--color-accent)] active:translate-y-1 active:shadow-none"
                        >
                          揭榜接取
                        </button>
                      ) : (
                        <div className="px-6 py-3 bg-transparent border-4 border-black dark:border-white font-black uppercase text-sm border-dashed">
                          猎人已接取
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* 摸鱼积分商城 */}
          <div className="lg:col-span-1 border-4 border-black dark:border-white bg-accent-color text-black p-6 shadow-[8px_8px_0_var(--color-ink)] relative flex flex-col">
            <div className="absolute top-0 right-0 bg-black text-white px-3 py-1 font-mono font-bold text-xs uppercase border-b-2 border-l-2 border-black">
              BLACK MARKET
            </div>
            <h3 className="text-2xl font-black mb-6 flex items-center gap-2 uppercase tracking-widest mt-4">
              <Gift className="w-6 h-6" /> 摸鱼商城
            </h3>
            
            <div className="bg-white border-4 border-black p-4 mb-6 text-center shadow-[4px_4px_0_#000]">
              <p className="text-xs font-mono font-bold uppercase opacity-80 mb-1">你的代币余额</p>
              <p className="text-4xl font-black tracking-tighter">1,250 <span className="text-sm font-bold opacity-60">MPT</span></p>
            </div>

            <div className="space-y-4 flex-1">
              {[
                { name: '免死金牌', desc: '免受打扰一小时', cost: 500, icon: Shield },
                { name: '霸王条款', desc: '将 Bug 转为特性', cost: 1000, icon: Receipt },
              ].map((item, i) => (
                <div key={i} className="bg-white/50 border-2 border-black p-4 hover:bg-white transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-black uppercase flex items-center gap-1"><item.icon className="w-4 h-4" /> {item.name}</h4>
                    <span className="font-mono text-xs font-bold bg-black text-white px-2 py-0.5">{item.cost} MPT</span>
                  </div>
                  <p className="text-xs font-mono opacity-80">{item.desc}</p>
                  <button className="w-full mt-3 py-1.5 border-2 border-black font-bold text-xs uppercase hover:bg-black hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                    兑换 (REDEEM)
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
