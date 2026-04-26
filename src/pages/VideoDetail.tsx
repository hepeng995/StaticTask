import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, SkipForward, Maximize, Minimize, Heart, MessageSquare, Share2, MoreHorizontal, Settings, Send } from 'lucide-react';
import React, { useState, useEffect, useRef, useCallback } from 'react';

const INITIAL_COMMENTS = [
  { id: 1, user: 'User_4021', text: '这个 BUG 我熟，上次导致整个微服务群炸了。真实记录。💀', time: '12 MINS AGO', seed: 4021 },
  { id: 2, user: 'User_8922', text: '求开局同款键盘，听声音像是青轴', time: '15 MINS AGO', seed: 8922 },
  { id: 3, user: 'User_1093', text: '怎么做到边写bug边心电图这么平稳的？', time: '1 HOUR AGO', seed: 1093 },
];

const VIDEO_RESOURCES: Record<string, { src: string; poster: string; title: string }> = {
  '1': { src: './视频.mp4', poster: './日常.jpeg', title: '开局写个BUG压压惊，祥鹏又在摸鱼了' },
  '2': { src: './视频2.mp4', poster: './日常.jpg', title: '产品经理说这个需求很简单，我反手一个键盘' },
  '3': { src: './视频3.mp4', poster: './日常照.jpeg', title: '昨晚加班到三点，看到代码自己运行了，差点招魂' },
  '4': { src: encodeURI('./视频4 .mp4'), poster: encodeURI('./日常 (2).jpeg'), title: '如何在服务器里用命令行看《甄嬛传》' },
};

export function VideoDetail() {
  const { id } = useParams();
  const videoInfo = VIDEO_RESOURCES[id || '1'] || VIDEO_RESOURCES['1'];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const videoRef = useRef<HTMLVideoElement>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const commentsContainerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showVolumeIndicator, setShowVolumeIndicator] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [newComment, setNewComment] = useState('');

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const triggerVolumeIndicator = useCallback(() => {
    setShowVolumeIndicator(true);
    setTimeout(() => setShowVolumeIndicator(false), 1000);
  }, []);

  // Sync video state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress(video.duration ? video.currentTime / video.duration : 0);
    };
    const onLoadedMetadata = () => setDuration(video.duration);
    const onEnded = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('ended', onEnded);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
    };
  }, [id]);

  // Sync volume & speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.loop = isLooping;
    }
  }, [isLooping]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.ended) {
      videoRef.current.currentTime = 0;
    }
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, []);

  // Scroll comments
  useEffect(() => {
    if (commentsContainerRef.current) {
      commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight;
    }
  }, [comments]);

  // Simulate incoming comments
  useEffect(() => {
    const timer = setInterval(() => {
      const randomId = Math.floor(Math.random() * 9000);
      const texts = [
        "哈哈哈哈笑爆了",
        "太真实了兄弟",
        "这代码我看着眼熟，该不会是从我这copy的吧",
        "+1 楼主牛的",
        "这操作可以，学废了",
        "有没有源码提供一下兄弟们"
      ];
      const randomText = texts[Math.floor(Math.random() * texts.length)];
      setComments(prev => [...prev, {
        id: Date.now(),
        user: `User_${randomId}`,
        text: randomText,
        time: "JUST NOW",
        seed: randomId
      }]);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Fullscreen
  useEffect(() => {
    const handle = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handle);
    return () => document.removeEventListener('fullscreenchange', handle);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen();
    }
  };

  // Close settings on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };
    if (showSettings) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSettings]);

  // Progress seeking
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressContainerRef.current || !videoRef.current) return;
    const rect = progressContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const newProgress = x / rect.width;
    videoRef.current.currentTime = newProgress * videoRef.current.duration;
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        setVolume(v => Math.min(1, v + 0.1));
        triggerVolumeIndicator();
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        setVolume(v => Math.max(0, v - 0.1));
        triggerVolumeIndicator();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, triggerVolumeIndicator]);

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      <Link
        to="/core"
        className="inline-flex items-center gap-2 border-2 border-black dark:border-white px-4 py-2 font-bold font-mono text-sm hover:bg-accent-color hover:text-black transition-colors shadow-[4px_4px_0_var(--color-ink)] hover:translate-y-1 hover:shadow-none bg-white dark:bg-black text-black dark:text-white"
      >
        <ArrowLeft className="w-4 h-4" /> 返回主面板 [ RETURN ]
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Real Video Player */}
          <div
            ref={videoContainerRef}
            className={`border-4 border-black dark:border-white bg-black relative group aspect-video shadow-[12px_12px_0_var(--color-ink)] overflow-hidden ${isFullscreen ? 'border-none shadow-none aspect-auto h-screen' : ''}`}
          >
            <video
              ref={videoRef}
              src={videoInfo.src}
              poster={videoInfo.poster}
              className="w-full h-full object-cover"
              playsInline
              preload="metadata"
            />

            {/* Play Overlay (when paused) */}
            {!isPlaying && (
              <div
                className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm cursor-pointer z-10"
                onClick={togglePlay}
              >
                <button className="w-20 h-20 bg-neon-green text-black border-4 border-black shadow-[8px_8px_0_#000] flex items-center justify-center hover:bg-neon-pink hover:text-white hover:scale-110 transition-all">
                  <Play className="w-10 h-10 ml-2" />
                </button>
              </div>
            )}

            {/* Volume Indicator Overlay */}
            <AnimatePresence>
              {showVolumeIndicator && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-20 pointer-events-none"
                >
                   <div className="bg-black text-white p-4 font-black text-xl border-4 border-white flex flex-col items-center gap-2">
                     {volume === 0 ? <VolumeX className="w-8 h-8" /> : <Volume2 className="w-8 h-8" />}
                     <span>{Math.round(volume * 100)}%</span>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Controls */}
            <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent flex flex-col gap-2 transform transition-transform duration-300 z-20 ${isPlaying ? 'translate-y-full group-hover:translate-y-0' : ''}`}>
              <div
                className="h-2 bg-white/20 w-full cursor-pointer relative group/progress transition-all hover:h-4"
                ref={progressContainerRef}
                onClick={handleSeek}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 bg-neon-pink transition-all duration-100 ease-linear flex items-center justify-end"
                  style={{ width: `${progress * 100}%` }}
                >
                  <div className="w-3 h-3 bg-white border-2 border-black opacity-0 group-hover/progress:opacity-100 transform translate-x-1.5 shadow-[2px_2px_0_#000]" />
                </div>
              </div>
              <div className="flex justify-between items-center text-white mt-2">
                <div className="flex items-center gap-4">
                  <button onClick={togglePlay} className="hover:text-neon-green transition-colors">
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  <button className="hover:text-neon-blue transition-colors"><SkipForward className="w-5 h-5" /></button>
                  <div className="group/vol flex items-center gap-2">
                    <button
                      className="hover:text-amber-400 transition-colors"
                      onClick={() => setVolume(v => v === 0 ? 1 : 0)}
                    >
                      {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <div className="w-16 h-1 bg-white/20 hidden group-hover/vol:block relative cursor-pointer" onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setVolume(Math.max(0, Math.min((e.clientX - rect.left) / rect.width, 1)));
                    }}>
                      <div className="absolute left-0 top-0 bottom-0 bg-amber-400" style={{ width: `${volume * 100}%` }} />
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold tracking-widest pl-2 border-l border-white/20">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
                <div className="flex items-center gap-4 relative" ref={settingsRef}>
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={`hover:text-accent-color transition-colors ${showSettings ? 'text-accent-color' : ''}`}
                  >
                    <Settings className="w-5 h-5" />
                  </button>

                  <AnimatePresence>
                    {showSettings && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-10 right-0 w-48 bg-black/90 backdrop-blur-md border-2 border-white/20 p-2 shadow-2xl flex flex-col gap-2 z-30"
                      >
                        <div className="text-xs font-bold uppercase tracking-widest text-white/50 border-b border-white/20 pb-2 mb-1 px-2">播放设置</div>

                        <div className="px-2">
                          <label className="flex items-center justify-between text-xs font-bold cursor-pointer hover:text-accent-color transition-colors group">
                            <span className="uppercase">循环播放</span>
                            <div className={`w-8 h-4 border-2 flex items-center p-0.5 transition-colors ${isLooping ? 'bg-accent-color border-accent-color' : 'bg-transparent border-white/50'}`}>
                              <div className={`w-2 h-2 bg-white transition-transform ${isLooping ? 'translate-x-4 bg-black' : ''}`} />
                            </div>
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={isLooping}
                              onChange={(e) => setIsLooping(e.target.checked)}
                            />
                          </label>
                        </div>

                        <div className="border-t border-white/20 my-1" />

                        <div className="px-2 space-y-1">
                          <div className="text-[10px] uppercase text-white/50 mb-2 mt-1">播放速度</div>
                          {[0.5, 1, 1.5, 2].map((speed) => (
                            <button
                              key={speed}
                              onClick={() => setPlaybackSpeed(speed)}
                              className={`w-full text-left px-2 py-1 text-xs font-mono font-bold transition-colors ${playbackSpeed === speed ? 'bg-accent-color text-black' : 'hover:bg-white/10'}`}
                            >
                              {speed.toFixed(1)}x
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button onClick={toggleFullscreen} className="hover:text-accent-color transition-colors">
                    {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Video Info Data */}
          <div className="p-6 border-4 border-black dark:border-white bg-white dark:bg-[#111] text-black dark:text-white shadow-[8px_8px_0_var(--color-ink)]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="bg-accent-color text-black px-2 py-1 text-xs font-bold font-mono tracking-widest uppercase border-2 border-black inline-block mb-3 shadow-[2px_2px_0_#000]">
                  SYS/VID_RECORD_#{id}
                </span>
                <h1 className="text-3xl font-black mb-2">{videoInfo.title}</h1>
                <p className="font-mono text-sm opacity-60">UPLOADED: 2026-04-18 / AUTHOR: SATURDAY_TEAM</p>
              </div>
              <button className="bg-white dark:bg-black p-2 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors shadow-[4px_4px_0_var(--color-ink)] text-black dark:text-white">
                <MoreHorizontal className="w-6 h-6" />
              </button>
            </div>

            <p className="text-sm leading-relaxed mb-6 bg-black/5 dark:bg-white/5 p-4 border-l-4 border-black dark:border-white font-mono opacity-90">
              [SYSTEM_LOG]: 该视频记录了研发部日常发癫的高光瞬间。代码可以不跑，但是姿势一定要帅。
              警告：画面可能包含令人不安的代码缩进及报错。
            </p>

            <div className="flex flex-wrap gap-4 pt-4 border-t-2 border-dashed border-black/20 dark:border-white/20">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-black dark:border-white font-bold hover:bg-neon-pink hover:text-white transition-colors uppercase tracking-widest shadow-[4px_4px_0_var(--color-ink)] hover:translate-y-1 hover:shadow-none bg-white dark:bg-black text-black dark:text-white">
                <Heart className="w-5 h-5" /> 8.2k 喜欢
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-black dark:border-white font-bold hover:bg-neon-blue hover:text-white transition-colors uppercase tracking-widest shadow-[4px_4px_0_var(--color-ink)] hover:translate-y-1 hover:shadow-none bg-white dark:bg-black text-black dark:text-white">
                <Share2 className="w-5 h-5" /> 分享节点
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar / Comments */}
        <div className="lg:col-span-1 flex flex-col space-y-6">
          {/* Uploader Profile */}
          <div className="p-6 border-4 border-black dark:border-white bg-accent-color text-black shadow-[8px_8px_0_var(--color-ink)] shrink-0">
            <h3 className="font-black uppercase tracking-widest border-b-2 border-black pb-2 mb-4 text-sm flex justify-between">
              <span>资料提供人</span>
              <span className="font-mono">RANK: S</span>
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-black border-2 border-black rotate-3 overflow-hidden shadow-[4px_4px_0_#fff] shrink-0">
                <img src={videoInfo.poster} alt="Avatar" className="w-full h-full object-cover saturate-0 contrast-150" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-black text-lg uppercase tracking-wider truncate">SATURDAY_TEAM</div>
                <div className="font-mono text-xs font-bold truncate">终端记录：128 条</div>
              </div>
            </div>
            <button className="w-full mt-6 py-2 bg-black text-white dark:bg-white dark:text-black font-bold tracking-widest uppercase hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white hover:border-black dark:hover:border-white border-2 border-transparent transition-colors">
              + 关注此节点
            </button>
          </div>

          {/* Comments Section */}
          <div className="border-4 border-black dark:border-white bg-white dark:bg-[#111] text-black dark:text-white shadow-[8px_8px_0_var(--color-ink)] flex flex-col flex-1 min-h-[400px]">
            <div className="p-4 border-b-4 border-black dark:border-white shrink-0 bg-black text-white dark:bg-white dark:text-black">
              <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> 实时终端通讯 ({comments.length + 99})
              </h3>
            </div>

            <div
              ref={commentsContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 pr-3 scrollbar-thin scrollbar-thumb-black dark:scrollbar-thumb-white scrollbar-track-transparent"
            >
              <AnimatePresence initial={false}>
                {comments.map((comment, index) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, x: 20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    className="flex gap-3 relative group"
                  >
                    <div className="w-8 h-8 rounded-full border-2 border-black dark:border-white overflow-hidden shrink-0 shadow-[2px_2px_0_var(--color-ink)]">
                       <img src={`https://picsum.photos/seed/${comment.seed}/50/50`} alt={comment.user} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1">
                      <div className="p-3 border-2 border-black dark:border-white bg-black/5 dark:bg-white/5 relative group-hover:border-neon-pink transition-colors text-black dark:text-white">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-[10px] uppercase text-neon-blue">{comment.user}</span>
                          <span className="text-[9px] opacity-40 font-mono tracking-tighter">{comment.time}</span>
                        </div>
                        <p className="text-xs leading-relaxed break-words">{comment.text}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="p-4 pt-3 border-t-4 border-dashed border-black dark:border-white bg-black/5 dark:bg-white/5 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newComment.trim()) return;
                  setComments(prev => [...prev, {
                    id: Date.now(),
                    user: "YOU_USER",
                    text: newComment,
                    time: "JUST NOW",
                    seed: 9999
                  }]);
                  setNewComment('');
                }}
                className="flex gap-2 relative"
              >
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="输入加密通讯内容..."
                  className="flex-1 bg-white dark:bg-[#222] text-black dark:text-white dark:placeholder:text-white/50 border-2 border-black dark:border-white pl-3 pr-10 py-3 font-mono text-xs outline-none focus:border-accent-color font-bold focus:ring-2 focus:ring-accent-color/20 transition-all"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-black text-white dark:bg-white dark:text-black font-bold disabled:opacity-50 hover:bg-accent-color hover:text-black dark:hover:bg-accent-color dark:hover:text-black transition-colors"
                >
                  <Send className="w-4 h-4 ml-[-2px]" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
