import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, MapPin, ExternalLink, Zap, Trophy } from 'lucide-react';

const radarData = [
  { skill: '代码逻辑', '陈大佬': 90, '李同学': 70, fullMark: 100, desc: '谁的IF和FOR套得更深。' },
  { skill: 'UI审美', '陈大佬': 85, '李同学': 90, fullMark: 100, desc: '控制像素，掌控全场。' },
  { skill: '沟通背锅', '陈大佬': 100, '李同学': 60, fullMark: 100, desc: '甩锅与接锅的高度融合。' },
  { skill: '准时下班', '陈大佬': 20, '李同学': 100, fullMark: 100, desc: '只要跑得够快，需求就追不上我。' },
  { skill: '写PPT', '陈大佬': 70, '李同学': 85, fullMark: 100, desc: '花言巧语的能力展现。' },
  { skill: '带薪摸鱼', '陈大佬': 95, '李同学': 50, fullMark: 100, desc: '老板眼皮底下的艺术。' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataObj = payload[0].payload;
    return (
      <div className="bg-black/90 dark:bg-white/90 text-white dark:text-black border-2 border-accent-color p-4 shadow-[4px_4px_0_var(--color-ink)] pointer-events-none z-50">
        <p className="font-bold uppercase tracking-widest text-accent-color border-b-2 border-dashed border-white/20 dark:border-black/20 pb-2 mb-2 flex items-center justify-between gap-4">
          <span>{label}</span>
          <span className="font-mono text-xs opacity-60">SKILL DATA</span>
        </p>
        <p className="text-xs opacity-80 mb-3 max-w-[200px] leading-relaxed">
          {dataObj.desc}
        </p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between font-mono text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2" style={{ backgroundColor: entry.color }} />
                <span className="font-bold">{entry.name}</span>
              </div>
              <div>
                <span className="font-black ml-4" style={{ color: entry.color }}>{entry.value}</span>
                <span className="opacity-50 text-xs"> / 100</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const TIMELINE_IMAGES = [
  encodeURI('/日常 (2).jpg'),
  encodeURI('/日常 (3).jpg'),
  encodeURI('/日常 (4).jpg'),
  encodeURI('/日常 (5).jpg'),
  encodeURI('/日常 (6).jpg'),
];

const TIMELINE_EVENTS = [
  {
    id: 1,
    year: '2024.01',
    name: '小组成立决议',
    type: '起航',
    location: '会议室 404',
    desc: '几个人因为不想和不熟的人组队，被迫抱团取暖。并在黑板上写下了极其远大且不切实际的目标。',
    imgSeed: 'meeting',
    image: TIMELINE_IMAGES[0]
  },
  {
    id: 2,
    year: '2024.03',
    name: '第一次团建翻车',
    type: '搞笑',
    location: '城郊烂尾楼探险',
    desc: '原本是去网红打卡地，结果导航导到了荒郊野外，还下起了大雨。大家只能在车里啃干面包。',
    imgSeed: 'camping',
    image: TIMELINE_IMAGES[1]
  },
  {
    id: 3,
    year: '2024.07',
    name: '项目V1上线',
    type: '里程碑',
    location: '凌晨的办公室',
    desc: '经过了一周的极限赶工，伴随着无数的报错和测试同学的哀嚎，V1.0 终于在凌晨 3 点打包成功。',
    imgSeed: 'server',
    image: TIMELINE_IMAGES[2]
  },
  {
    id: 4,
    year: '2024.11',
    name: '集体熬夜修BUG',
    type: '渡劫',
    location: '线上语音频道',
    desc: '一个线上的 P0 级灾难 Bug，所有人深夜被拉起。排查到最后发现是因为一个全角逗号。',
    imgSeed: 'bug',
    image: TIMELINE_IMAGES[3]
  },
  {
    id: 5,
    year: '2025.04',
    name: '版本重构完成',
    type: '新生',
    location: '咖啡馆',
    desc: '历史债务终于还清，删除了高达 30% 的冗余代码，重构后的代码干净得让人不敢碰。',
    imgSeed: 'cafe',
    image: TIMELINE_IMAGES[4]
  },
];

export function DataViz() {
  const [selectedEvent, setSelectedEvent] = useState<typeof TIMELINE_EVENTS[0] | null>(null);
  const [showLogs, setShowLogs] = useState(false);

  // Generate generic pseudo-logs based on event seed
  const generateLogs = (event: typeof TIMELINE_EVENTS[0]) => {
    return [
      `[SYS]: Initializing chronological extraction...`,
      `[SYS]: Target hash: 0x${Math.abs(event.name.split('').reduce((a, b) => {a = ((a << 5) - a) + b.charCodeAt(0); return a & a}, 0)).toString(16).toUpperCase()}`,
      `[OK]: Decoding temporal matrix... SUCCESS`,
      `[INFO]: Establishing secure tunnel to node: ${event.location}`,
      `[CMD]: cat /var/log/${event.imgSeed}_event.log`,
      `================================================`,
      `TIMESTAMP: ${event.year}`,
      `RECORD_NAME: ${event.name}`,
      `TYPE_CLASSIFICATION: ${event.type}`,
      `================================================`,
      `[DECRYPTING ENVELOPE...]`,
      `> WARNING: Fragmented memory detected.`,
      `> ${event.desc}`,
      `> Personnel involved logged...`,
      `> Emotional state variance: HIGH`,
      `[SYS]: Log extraction completed without fatal errors.`,
      `[SYS]: Connection closing...`
    ];
  };

  return (
    <div className="space-y-12 pb-12">
      <div className="mb-6 text-center">
        <h2 className="text-4xl font-black mb-2 tracking-tighter uppercase font-sans">数据展示中心</h2>
        <p className="opacity-60 max-w-xl mx-auto font-mono text-xs uppercase tracking-widest">Digital footprint and temporal extraction log.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-black dark:text-white">
        <div className="glass-card p-4 md:p-6 !rounded-none flex flex-col h-full shadow-[6px_6px_0_var(--color-ink)] border-2 border-black dark:border-white">
          <h3 className="text-xl font-black mb-4 font-mono uppercase tracking-widest bg-black text-white dark:bg-white dark:text-black px-2 py-1 flex items-center gap-2">
            <Zap className="w-4 h-4" /> // 核心能力矩阵
          </h3>
          <div className="h-[380px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="rgba(150,150,150,0.3)" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: 'currentColor', fontSize: 10, opacity: 0.8 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.1)' }} />
                <Radar name="陈大佬" dataKey="陈大佬" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Radar name="李同学" dataKey="李同学" stroke="#ec4899" fill="#ec4899" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-4 md:p-6 flex flex-col border-2 border-black dark:border-white !rounded-none shadow-[6px_6px_0_var(--color-ink)] h-full">
          <h3 className="text-xl font-black mb-4 flex justify-between items-center font-mono uppercase tracking-widest bg-black text-white dark:bg-white dark:text-black px-2 py-1">
            <span className="flex items-center gap-2"><Trophy className="w-4 h-4" /> 学习时长榜</span>
            <span className="text-[10px] bg-accent-color/20 text-accent-color px-2 py-0.5 border border-current font-black">LEADERBOARD</span>
          </h3>
          <div className="flex-1 flex flex-col gap-1.5">
            {[
              { name: '王卷卷', time: '1240 min', title: '学习战神' },
              { name: '张三三', time: '980 min', title: '修仙达人' },
              { name: '李同学', time: '820 min', title: '普通打工人' },
              { name: '陈大佬', time: '600 min', title: '劳逸结合' },
              { name: '路人甲', time: '240 min', title: '潜力度假者' },
              { name: '摸鱼王', time: '50 min', title: '重在参与' },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-3 border-b border-dashed border-black/10 dark:border-white/10 p-2.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <div className="font-mono text-lg w-6 text-center opacity-50 font-bold text-accent-color">0{i + 1}</div>
                <div className="w-8 h-8 bg-black dark:bg-white border-2 border-accent-color shrink-0 shadow-[2px_2px_0_var(--color-accent)]" />
                <div className="flex-1">
                  <div className="font-black uppercase tracking-wide text-xs">{p.name}</div>
                  <div className="text-[9px] opacity-60 text-accent-color uppercase tracking-widest">{p.title}</div>
                </div>
                <div className="font-mono font-black text-base text-neon-blue">{p.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="glass-card p-6 md:p-8 !rounded-none overflow-hidden relative border-4 border-black dark:border-white shadow-[6px_6px_0_var(--color-ink)] text-black dark:text-white">
        <h3 className="text-xl font-black mb-4 text-center uppercase tracking-[0.3em] bg-black text-white dark:bg-white dark:text-black py-1 font-sans">小组成员关键词</h3>
        <div className="h-[200px] flex items-center justify-center relative">
           <motion.div animate={{ rotate: 360 }} transition={{ duration: 100, repeat: Infinity, ease: 'linear' }} className="absolute w-[300px] h-[300px] opacity-10 blur-xl bg-gradient-to-r from-neon-blue to-neon-pink rounded-full" />
           <div className="relative z-10 flex flex-wrap justify-center gap-3 max-w-xl mx-auto items-center">
             <span className="text-2xl font-black text-accent-color transform -rotate-3 border-2 border-black dark:border-white px-2 py-1 bg-white dark:bg-black">又崩了</span>
             <span className="text-lg font-bold opacity-80 transform rotate-6 text-neon-pink underline decoration-wavy decoration-neon-blue">摸鱼</span>
             <span className="text-3xl font-black text-neon-blue transform rotate-2 drop-shadow-[1px_1px_0_#000]">删库跑路</span>
             <span className="text-sm font-bold transform -rotate-6 bg-neon-green text-black px-1.5 py-0.5 border border-black">测试通过了！</span>
             <span className="text-xl font-black text-yellow-500 transform rotate-3 border-b-2 border-dashed border-current">显眼包</span>
             <span className="text-4xl font-black transform -rotate-2 text-red-500 line-through decoration-2">点外卖</span>
             <span className="text-lg font-bold opacity-70 transform rotate-12 text-white bg-black px-1.5 py-0.5">React</span>
             <span className="text-xs font-black opacity-50 transform -rotate-6 border border-black dark:border-white px-1 capitalize">Overload</span>
           </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-black mb-4 flex items-center gap-2 uppercase tracking-widest font-sans underline decoration-4 decoration-accent-color underline-offset-4">沉浸式时间轴</h3>
        <p className="opacity-60 mb-4 font-mono text-[10px] max-w-xl uppercase tracking-widest">
          Scroll horizontally to extract encrypted temporal nodes.
        </p>
        <div className="glass-card pt-12 pb-32 px-6 !rounded-none overflow-x-auto relative border-4 border-black dark:border-white shadow-[6px_6px_0_var(--color-ink)] bg-[#fdfdfd] dark:bg-[#111]">
          {/* Main Line: pt-12 (48px) + image (96px) + margin (24px) + dot center (16px) = 184px */}
          <div className="absolute top-[184px] left-0 right-0 h-1.5 bg-black/10 dark:bg-white/10 -translate-y-1/2">
            <div className="h-full bg-accent-color w-[85%] animate-pulse" />
          </div>
          
          <div className="flex gap-20 relative z-10 w-max px-8 items-start">
             {TIMELINE_EVENTS.map((event, i) => (
               <div 
                 key={event.id} 
                 className="relative flex flex-col items-center group cursor-pointer w-40"
                 onClick={() => setSelectedEvent(event)}
               >
                 {/* Top Image Thumbnail */}
                 <div className="mb-6 w-36 h-24 border-2 border-black dark:border-white bg-black dark:bg-[#111] p-1 shadow-[4px_4px_0_var(--color-ink)] group-hover:-translate-y-2 transition-transform duration-500 relative overflow-hidden group-hover:border-accent-color">
                    <img 
                      src={event.image}
                      className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500" 
                      alt={event.name} 
                    />
                    <div className="absolute inset-0 bg-accent-color/20 mix-blend-color z-10 group-hover:opacity-0 transition-opacity duration-500" />
                    
                    {/* Hover text overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-black/80 text-accent-color text-[10px] font-mono tracking-widest text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity font-bold z-20">
                      [ 解密影像 ]
                    </div>
                 </div>

                 {/* Dot on line */}
                 <div className="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center border-4 border-white dark:border-black shadow-[4px_4px_0_var(--color-ink)] z-10 group-hover:scale-125 transition-all group-hover:bg-accent-color group-hover:border-black relative outline outline-2 outline-transparent group-hover:outline-accent-color">
                   <div className="w-2 h-2 rounded-full border border-white dark:border-black" />
                 </div>

                 {/* Connecting vertical line helper for aesthetics */}
                 <div className="absolute top-[110px] w-0.5 h-6 bg-black/20 dark:bg-white/20 -z-10 group-hover:bg-accent-color transition-colors" />

                 {/* Info below */}
                 <div className="absolute top-[160px] flex flex-col items-center text-center w-full text-black dark:text-white">
                   <div className="text-xs font-bold text-accent-color mb-1 font-mono tracking-widest bg-accent-color/10 px-2 border border-accent-color">{event.year}</div>
                   <div className="font-black whitespace-nowrap uppercase text-sm mt-1 leading-tight">{event.name}</div>
                   <div className="text-[10px] opacity-70 mt-2 px-2 py-0.5 border border-black dark:border-white uppercase font-bold text-black dark:text-white group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">{event.type}</div>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Timeline Event Modal */}
      {createPortal(
        <AnimatePresence>
          {selectedEvent && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setSelectedEvent(null);
                  setShowLogs(false);
                }}
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
              />
              
              <motion.div
                initial={{ opacity: 0, y: 100, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[95%] max-w-2xl"
              >
                <div className="bg-white dark:bg-black text-black dark:text-white !rounded-none relative border-4 border-black dark:border-white shadow-[16px_16px_0_var(--color-ink)] grid grid-cols-1 md:grid-cols-2 overflow-hidden">
                  <button 
                    onClick={() => {
                      setSelectedEvent(null);
                      setShowLogs(false);
                    }}
                    className="absolute top-4 right-4 w-10 h-10 border-2 border-black bg-white dark:bg-black text-black dark:text-white flex items-center justify-center hover:bg-neon-pink hover:text-white hover:border-black z-30 transition-colors shadow-[4px_4px_0_var(--color-ink)]"
                    title="Close Modal"
                  >
                    <X className="w-6 h-6 font-black" />
                  </button>
  
                  <div className="h-48 md:h-full relative border-b-4 md:border-b-0 md:border-r-4 border-black dark:border-white">
                    <div className="absolute inset-0 bg-accent-color/40 mix-blend-color z-10" />
                    <img 
                      src={selectedEvent.image}
                      alt="Event Record"
                      className="w-full h-full object-cover saturate-[0.8] contrast-125"
                    />
                    <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-1 bg-black text-white uppercase border border-white tracking-widest">
                        档案: {selectedEvent.imgSeed}.DAT
                      </span>
                    </div>
                  </div>
  
                  <div className="p-8 flex flex-col justify-center">
                    <div className="inline-block mb-4">
                      <span className="text-xs font-mono font-bold bg-accent-color text-black px-2 py-1 uppercase tracking-widest border border-black shadow-[2px_2px_0_var(--color-ink)]">
                        {selectedEvent.year} • {selectedEvent.type}
                      </span>
                    </div>
                    <h3 className="text-3xl font-black uppercase mb-4 leading-tight">{selectedEvent.name}</h3>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-start gap-2 opacity-80 text-sm font-mono">
                        <MapPin className="w-4 h-4 mt-0.5 text-accent-color flex-shrink-0" />
                        <span>{selectedEvent.location}</span>
                      </div>
                      <div className="flex items-start gap-2 opacity-80 text-sm font-mono">
                        <Calendar className="w-4 h-4 mt-0.5 text-accent-color flex-shrink-0" />
                        <p className="leading-relaxed">{selectedEvent.desc}</p>
                      </div>
                    </div>
  
                    <div className="mt-auto border-t-2 border-black dark:border-white border-dashed pt-6 flex gap-4">
                      <button 
                        onClick={() => setShowLogs(true)}
                        className="flex-1 py-3 bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white uppercase font-black text-sm tracking-widest hover:bg-neon-blue hover:text-black dark:hover:bg-neon-blue transition-colors flex justify-center items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" /> 详情日志
                      </button>
                    </div>
                  </div>

                  {/* Sub-interface: Terminal Logs Overlay */}
                  <AnimatePresence>
                    {showLogs && (
                      <motion.div 
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="absolute inset-0 z-40 bg-black text-neon-green font-mono p-8 flex flex-col"
                      >
                        <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-neon-green/30">
                          <div className="font-bold tracking-widest uppercase">
                            <span className="text-white">终端直连:</span> //_{selectedEvent.imgSeed.toUpperCase()}
                          </div>
                          <button 
                            onClick={() => setShowLogs(false)} 
                            className="text-neon-pink hover:text-white transition-colors flex items-center gap-1 uppercase text-xs border border-transparent hover:border-white p-1"
                          >
                            <X className="w-4 h-4" /> 断开连接
                          </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto space-y-2 text-sm pr-4">
                          {generateLogs(selectedEvent).map((line, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className={`${line.startsWith('>') ? 'text-white ml-4' : ''} ${line.includes('WARNING') ? 'text-neon-pink' : ''} ${line.includes('SUCCESS') ? 'text-neon-blue' : ''}`}
                            >
                              {line}
                            </motion.div>
                          ))}
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: generateLogs(selectedEvent).length * 0.1, repeat: Infinity, duration: 1 }}
                            className="w-3 h-5 bg-neon-green inline-block ml-1 align-middle mt-2"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
