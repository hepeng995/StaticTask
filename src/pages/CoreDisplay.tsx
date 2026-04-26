import { motion, AnimatePresence } from 'motion/react';
import { Play, Award, Star, Coffee, Moon, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Define the shape of our video data for the simulated database
interface VideoData {
  id: number;
  title: string;
  duration: string;
  likes: string;
  comments: number;
  tag: string;
  src: string;
  poster: string;
}

const VIDEO_RESOURCES = [
  { src: './视频.mp4', poster: './日常.jpeg' },
  { src: './视频2.mp4', poster: './日常.jpg' },
  { src: './视频3.mp4', poster: './日常照.jpeg' },
  { src: encodeURI('./视频4 .mp4'), poster: encodeURI('./日常 (2).jpeg') },
];

const SUMMARY_COVERS = [
  encodeURI('./日常 (7).jpg'),
  './大合照.jpeg',
  './大合照2.jpeg',
];

const INITIAL_VIDEOS: VideoData[] = [
  { id: 1, title: '开局写个BUG压压惊，祥鹏又在摸鱼了', duration: '00:00:15', likes: '8.2k', comments: 102, tag: '搞笑瞬间', ...VIDEO_RESOURCES[0] },
  { id: 2, title: '产品经理说这个需求很简单，我反手一个键盘', duration: '00:01:23', likes: '1.2w', comments: 890, tag: '地狱级需求', ...VIDEO_RESOURCES[1] },
  { id: 3, title: '昨晚加班到三点，看到代码自己运行了，差点招魂', duration: '00:00:45', likes: '4.5k', comments: 56, tag: '午夜传说', ...VIDEO_RESOURCES[2] },
  { id: 4, title: '如何在服务器里用命令行看《甄嬛传》', duration: '00:02:10', likes: '2.1w', comments: 4000, tag: '高阶摸鱼', ...VIDEO_RESOURCES[3] },
];

export function CoreDisplay() {
  const [videos, setVideos] = useState<VideoData[]>(INITIAL_VIDEOS);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Simulate real-time polling or WebSockets pushing a new video
    const timer = setTimeout(() => {
      setIsUpdating(true);
      
      const newVideo: VideoData = {
        id: Date.now(), // Generate a unique ID
        title: '终于把这段代码重构完了，现在能运行但不知道为什么',
        duration: '00:00:59',
        likes: '0',
        comments: 0,
        tag: '玄学编程',
        ...VIDEO_RESOURCES[Math.floor(Math.random() * VIDEO_RESOURCES.length)]
      };

      setVideos(prev => [newVideo, ...prev.slice(0, 3)]); // Prepend new video, keep grid at 4 items
      
      setTimeout(() => setIsUpdating(false), 800); // Visual cue duration
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-24">
      <section>
        <div className="flex justify-between items-end mb-8 relative">
          <div>
            <h2 className="text-4xl font-black mb-2 flex items-center gap-3">
              同步抖音视频
              <AnimatePresence>
                {isUpdating && (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] font-mono tracking-widest bg-neon-green text-black px-2 py-1 uppercase font-bold border-2 border-black"
                  >
                    SYNCING DB...
                  </motion.span>
                )}
              </AnimatePresence>
            </h2>
            <p className="opacity-60">搞笑糗事·笑不活了</p>
          </div>
          <button className="px-4 py-2 glass-card !rounded-none border-2 border-black dark:border-white text-sm font-bold flex items-center gap-2 hover:bg-accent-color hover:text-black transition-colors shadow-[4px_4px_0_var(--color-ink)]">
            <Play className="w-4 h-4" /> 一键重温
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {videos.map((video) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                key={video.id}
                whileHover={{ y: -5 }}
                className="group relative aspect-[9/16] bg-black/5 dark:bg-white/5 border-2 border-black dark:border-white overflow-hidden cursor-pointer shadow-[4px_4px_0_var(--color-ink)] flex flex-col"
              >
                {/* Dynamic Video Thumbnail using Picsum Photos */}
                <div className="absolute inset-0 bg-accent-color/30 mix-blend-color z-10 group-hover:opacity-0 transition-opacity duration-300" />
                <img 
                  src={video.poster}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 saturate-[0.8] contrast-125" 
                  alt={`Video Thumbnail ${video.id}`} 
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay and Text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-4 flex flex-col justify-end text-white z-20">
                  <div className="flex justify-between items-start mb-auto pt-2">
                    <span className="text-xs bg-red-500 text-white px-2 py-1 flex items-center gap-1 font-bold uppercase border-2 border-black shadow-[2px_2px_0_#000]">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" /> LIVE
                    </span>
                    <div className="bg-black/80 backdrop-blur border border-white/20 text-white text-[10px] font-mono px-2 py-1">
                      {video.duration}
                    </div>
                  </div>

                  <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-xs bg-accent-color text-black px-2 py-1 inline-block w-max mb-2 font-bold uppercase border-2 border-black shadow-[2px_2px_0_#000]">{video.tag}</span>
                    <h3 className="font-black leading-tight group-hover:text-amber-300 transition-colors line-clamp-2">{video.title}</h3>
                    <div className="mt-2 text-xs opacity-80 flex justify-between font-mono items-center">
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1">👍 {video.likes}</span>
                        <span className="flex items-center gap-1">💬 {video.comments}</span>
                      </div>
                    </div>
                    <Link 
                      to={`/video/${video.id}`} 
                      className="mt-4 flex items-center justify-center w-full py-2 bg-black/50 hover:bg-neon-pink border border-white/20 text-white text-xs font-bold uppercase tracking-widest transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100"
                    >
                      查看详情 - EXPLORE
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      <section>
        <div className="mb-8">
          <h2 className="text-4xl font-black mb-2">优秀周总结</h2>
          <p className="opacity-60">本周最佳总结·在线批注互动</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id: "1", title: "第 42 周总结：重构总结", author: "何祥鹏", tag: "架构", snippet: "这周真的是...太刺激了，我们把上个月那个用胶水粘起来的代码全推翻重写了。" },
            { id: "2", title: "高请求并发下的限流", author: "余佳", tag: "干货", snippet: "本周针对上周的大面积无响应做完了限流和负载..." },
            { id: "3", title: "如何在代码里藏甄嬛传", author: "牛青峰", tag: "绝活", snippet: "如何在满屏幕的代码和黑客帝国面板中，偷偷看点东西..." }
          ].map(summary => (
            <div key={summary.id} className="glass-card p-6 !rounded-none relative overflow-hidden group shadow-[4px_4px_0_var(--color-ink)] border-2 border-black dark:border-white flex flex-col h-full">
              <div className="absolute top-0 right-0 bg-accent-color text-black text-xs font-bold px-3 py-1 font-mono z-10 border-b-2 border-l-2 border-black dark:border-white shadow-[-2px_2px_0_var(--color-ink)]">{summary.tag}</div>
              <div className="w-full h-40 mb-4 border-2 border-black dark:border-white overflow-hidden relative shrink-0">
                <div className="absolute inset-0 bg-accent-color/20 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors duration-500" />
                <img 
                  src={SUMMARY_COVERS[parseInt(summary.id) - 1] || SUMMARY_COVERS[0]}
                  alt="Article Thumbnail" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="font-bold text-xl mb-4 uppercase tracking-wider group-hover:text-accent-color transition-colors line-clamp-1">{summary.title}</h3>
              <p className="text-sm opacity-80 mb-4 bg-black/5 dark:bg-white/10 p-3 border-l-4 border-accent-color font-mono line-clamp-2 flex-1">
                {summary.snippet}
              </p>
              <div className="flex gap-2 shrink-0">
                <Link to={`/summary/${summary.id}`} className="flex-1 py-2 text-center bg-black/5 dark:bg-white/10 text-sm font-bold uppercase tracking-widest transition-all border-2 border-black dark:border-white hover:bg-accent-color hover:text-black hover:scale-105 hover:shadow-[0_0_15px_var(--color-accent)]">
                  🔥 在线批注审阅
                </Link>
                <button className="px-4 py-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 transition-colors border-2 border-black dark:border-white hover:bg-accent-color hover:text-black">👍</button>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <section className="border-4 border-black dark:border-white p-8 bg-[#fdfdfd] dark:bg-[#111] text-black dark:text-white shadow-[12px_12px_0_var(--color-ink)] relative overflow-hidden mt-16">
        <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none text-black dark:text-white">
          <Award className="w-96 h-96" />
        </div>
        <div className="relative z-10">
          <div className="mb-12 border-b-4 border-black dark:border-white pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-4xl font-black mb-2 flex items-center gap-3 tracking-tight font-sans uppercase text-black dark:text-white">
                <Star className="w-8 h-8 text-accent-color fill-current" /> 
                荣誉勋章墙
              </h2>
              <p className="opacity-60 font-mono tracking-widest text-xs uppercase font-bold text-accent-color bg-accent-color/10 inline-block px-2 py-1 mt-2 border border-accent-color">
                HALL_OF_FAME / TACTICAL_ACHIEVEMENTS
              </p>
            </div>
            <div className="font-mono text-xs font-bold px-4 py-3 bg-black text-white dark:bg-white dark:text-black border-2 border-transparent w-max shadow-[4px_4px_0_var(--color-accent)]">
              ACHIEVEMENT_UNLOCKED: 3
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-20">
            {[
              { title: '最佳摸鱼团队', desc: '年度系统崩溃存活大赏', type: 'LEGENDARY', icon: Coffee },
              { title: '年度熬夜冠军', desc: '累计见证凌晨三点的北京365次', type: 'EPIC', icon: Moon },
              { title: '一行代码跑通', desc: '重构没有引入任何新增故障', type: 'MYTHIC', icon: ShieldCheck }
            ].map((medal, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white dark:bg-[#222] text-black dark:text-white border-4 border-black dark:border-white p-6 shadow-[8px_8px_0_var(--color-ink)] flex flex-col items-center text-center group cursor-pointer relative"
              >
                {/* 悬浮光标效果 */}
                <div className="absolute top-2 left-2 w-2 h-2 bg-black dark:bg-white animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-50 group-hover:opacity-100" />
                <div className="absolute top-2 right-2 text-[10px] font-black font-mono tracking-tighter text-accent-color border border-accent-color px-2 py-0.5">
                  {medal.type}
                </div>
                
                <div className="w-24 h-24 mt-4 mb-6 bg-black/5 dark:bg-white/5 border-2 border-dashed border-black/50 dark:border-white/50 flex items-center justify-center group-hover:border-solid group-hover:border-black dark:group-hover:border-white group-hover:bg-accent-color group-hover:text-black transition-all duration-300 relative rounded-tl-xl rounded-br-xl">
                  <div className="absolute inset-0 border-2 border-black/20 dark:border-white/20 scale-[1.15] opacity-0 group-hover:opacity-100 transition-opacity rounded-tl-xl rounded-br-xl" />
                  <medal.icon className="w-10 h-10 group-hover:scale-125 transition-transform duration-300" />
                </div>
                
                <h3 className="text-xl font-black mb-2 uppercase tracking-wide group-hover:text-accent-color transition-colors">{medal.title}</h3>
                <p className="text-xs font-mono opacity-70 leading-relaxed px-2 break-words">
                  {medal.desc}
                </p>
                
                <div className="mt-8 w-full pt-4 border-t-2 border-dashed border-black/20 dark:border-white/20 font-mono text-[9px] font-bold text-black/40 dark:text-white/40 group-hover:text-black dark:group-hover:text-white transition-colors text-center uppercase tracking-widest">
                  [ ACQUIRED \ 2026.04 ]
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
