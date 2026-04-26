import { motion } from 'motion/react';
import { Mail, Github, BookOpen, GitCommit, LinkIcon, ArrowLeft, Trophy } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

const POST_COVERS = [
  './日常.jpeg', './日常.jpg', './日常照.jpeg', encodeURI('./日常 (2).jpeg'),
  encodeURI('./日常 (2).jpg'), encodeURI('./日常 (3).jpg'), encodeURI('./日常 (4).jpg'),
  encodeURI('./日常 (5).jpg'), encodeURI('./日常 (6).jpg'), encodeURI('./日常 (7).jpeg'),
  './大合照.jpeg', './大合照2.jpeg',
];

const MEMBERS_DATA: Record<string, any> = {
  '1': {
    name: '何祥鹏',
    role: '后端开发',
    tag: '核心主导',
    desc: '不仅生产代码，还在制造混乱。擅长在没有任何文档的情况下重构核心功能。',
    avatar: './何祥鹏.png',
    stats: [
      { label: '代码行数', value: '14,204', percent: '80%', color: 'bg-accent-color' },
      { label: '修复BUG数', value: '89', percent: '45%', color: 'bg-neon-blue' },
      { label: '喝掉的咖啡杯数', value: '9,001', percent: '100%', color: 'bg-neon-pink' },
    ],
    posts: [
      { id: 1, title: '如何优雅地写出一个无法维护的组件', desc: '在这篇文章里，我将向你展示如何利用嵌套三元表达式和神秘的useEffect依赖打造一个只有上帝能看懂的代码片段。', cover: POST_COVERS[0] },
      { id: 2, title: '服务器架构：从入门到删库跑路', desc: '深入探讨微服务引发的连环爆炸，以及为什么你永远不应该给实习生生产环境和 root 权限。', cover: POST_COVERS[1] }
    ]
  },
  '2': {
    name: '余佳',
    role: '视频剪辑',
    tag: '视角叙事',
    desc: '每一帧都在燃烧显卡，熟练掌握PR/AE及各类花式转场，能把极其无聊的开会视频剪成大片。',
    avatar: './余佳.png',
    stats: [
      { label: '渲染输出 (TB)', value: '12.4', percent: '90%', color: 'bg-accent-color' },
      { label: '死机次数', value: '312', percent: '65%', color: 'bg-neon-blue' },
      { label: '掉头发根数', value: 'MAX', percent: '100%', color: 'bg-neon-pink' },
    ],
    posts: [
      { id: 1, title: '当你的素材只有1080p时如何伪造8K全景', desc: '利用AI放大引擎和噪点填充技术，让老板以为我们高价雇了摄影团队。', cover: POST_COVERS[2] },
      { id: 2, title: '卡点狂魔：听觉与视觉的同步艺术', desc: '通过对波形的精确切割，让每一个鼓点都砸在观众的视网膜上。', cover: POST_COVERS[3] }
    ]
  },
  '3': {
    name: '张凯峰',
    role: '3D建模',
    tag: '维度构建',
    desc: '在三维坐标系中创造神迹，Blender 快捷键比呼吸还要熟练，但是拒绝给人物模型绑骨骼。',
    avatar: './张凯峰.png',
    stats: [
      { label: '构建多边形', value: '8.4M', percent: '95%', color: 'bg-accent-color' },
      { label: '材质节点数', value: '450+', percent: '75%', color: 'bg-neon-blue' },
      { label: '光追开启率', value: '99%', percent: '99%', color: 'bg-neon-pink' },
    ],
    posts: [
      { id: 1, title: '不用插件手搓赛博朋克城市群', desc: '只依靠置换贴图和无限克隆阵列，搞懂了就能瞬间拉满场景逼格。', cover: POST_COVERS[4] },
      { id: 2, title: '别再问我为什么模型不带贴图了', desc: '白模就是最高级的艺术。如果不好看，那说明你的打光不够高级。', cover: POST_COVERS[5] }
    ]
  },
  '4': {
    name: '牛青峰',
    role: '声乐高手',
    tag: '声波共振',
    desc: '团队的精神核动力源。开着修音软件依然能唱出重金属赛博音效，用歌声掩护后端重启服务器。',
    avatar: encodeURI('./牛青峰 (2).png'),
    stats: [
      { label: '高音突破 (Hz)', value: '1200', percent: '88%', color: 'bg-accent-color' },
      { label: '忘词频率', value: '日常', percent: '80%', color: 'bg-neon-blue' },
      { label: '麦克风耐久度', value: '12%', percent: '12%', color: 'bg-neon-pink' },
    ],
    posts: [
      { id: 1, title: '摸鱼之歌：如何在老板眼皮下唱歌', desc: '掌握混音技巧，把清唱的干音完美融入机械键盘的敲击声中。', cover: POST_COVERS[6] },
      { id: 2, title: '当 Auto-Tune 参数拉到极致', desc: '这不是走音，这是前卫艺术。让我们了解T-Pain赋予这个时代的宝贵遗产。', cover: POST_COVERS[7] }
    ]
  },
  '5': {
    name: '段利利',
    role: '运营',
    tag: '幕后推手',
    desc: '熟练掌握各类话术，能够把简单的修Bug包装成”系统底层架构的革命性飞跃”。',
    avatar: './段利利.jpeg',
    stats: [
      { label: '写出的黑话', value: '8.4k', percent: '90%', color: 'bg-accent-color' },
      { label: '画的大饼数', value: '99+', percent: '85%', color: 'bg-neon-blue' },
      { label: '甩出去的锅', value: '0', percent: '100%', color: 'bg-neon-pink' },
    ],
    posts: [
      { id: 1, title: '赋能：底层逻辑与顶层设计的抓手', desc: '一套可以套用在任何项目总结报告上的万能公式模板。', cover: POST_COVERS[8] }
    ]
  },
  '6': {
    name: '袁丹琴',
    role: '数据分析',
    tag: '真相洞察',
    desc: '从一堆杂乱无章的日志中提取出致命证据，总能用图表证明开发又在摸鱼了。',
    avatar: './袁丹琴.png',
    stats: [
      { label: '导出的表格', value: '3,200', percent: '90%', color: 'bg-accent-color' },
      { label: '崩溃的Pivot', value: '45', percent: '20%', color: 'bg-neon-blue' },
      { label: 'SQL执行量', value: '1M+', percent: '99%', color: 'bg-neon-pink' },
    ],
    posts: [
      { id: 1, title: '不要相信直觉，相信数据', desc: '当业务说销量上升时，我默默地甩出了退货率的漏斗图。', cover: POST_COVERS[9] }
    ]
  }
};

const DEFAULT_MEMBER = {
    name: '未知骇客',
    role: '隐秘行者',
    tag: '神秘档案',
    desc: '资料被高度加密，无法从中央服务器中提取有效的识别特征。',
    avatar: '',
    stats: [
      { label: '数据碎片', value: 'N/A', percent: '0%', color: 'bg-accent-color' },
      { label: '系统日志', value: 'N/A', percent: '0%', color: 'bg-neon-blue' },
      { label: '存在感', value: '0', percent: '0%', color: 'bg-neon-pink' },
    ],
    posts: [
      { id: 1, title: 'ERR_NO_DATA', desc: '记录已被清除。' }
    ]
};

export function Profile() {
  const { id } = useParams();

  // Mock data based on id
  const memberId = id || '1';
  const memberData = MEMBERS_DATA[memberId] || DEFAULT_MEMBER;
  
  return (
    <div className="space-y-12 animate-[fadeIn_0.5s_ease-out]">
      <Link to="/members" className="inline-flex items-center gap-2 font-bold hover:text-accent-color transition-colors uppercase tracking-widest text-sm border-2 border-black dark:border-white px-4 py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black">
        <ArrowLeft className="w-4 h-4" /> 返回成员阵地
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Profile Sidebar */}
        <div className="col-span-1 space-y-8 md:sticky md:top-24">
          <div className="border-4 border-black dark:border-white shadow-[8px_8px_0_var(--color-ink)] p-1 relative overflow-hidden bg-white dark:bg-[#111]">
            <img
              src={memberData.avatar}
              className="w-full aspect-square object-cover filter grayscale contrast-125 hover:grayscale-0 hover:scale-105 transition-all duration-500"
              alt="Hacker Avatar"
            />
            <div className="absolute inset-0 bg-accent-color/20 mix-blend-color pointer-events-none" />
            <div className="p-6">
              <h1 className="text-3xl font-black uppercase tracking-widest mb-1">{memberData.name}</h1>
              <p className="text-accent-color font-bold font-mono text-sm mb-4">@hacker_0{memberId}_x</p>
              
              <p className="opacity-80 text-sm font-mono mb-6 line-clamp-4 leading-relaxed">
                {memberData.desc}
              </p>

              <div className="flex gap-4 mb-6">
                <button className="p-3 border-2 border-black dark:border-white hover:bg-neon-pink hover:text-white transition-colors"><Github className="w-5 h-5" /></button>
                <button className="p-3 border-2 border-black dark:border-white hover:bg-neon-blue hover:text-white transition-colors"><Mail className="w-5 h-5" /></button>
                <button className="p-3 border-2 border-black dark:border-white hover:bg-neon-green hover:text-black transition-colors"><LinkIcon className="w-5 h-5" /></button>
              </div>

              <div className="space-y-3 pt-6 border-t-2 border-black dark:border-white border-dashed">
                <div className="flex justify-between items-center text-sm font-mono">
                  <span className="opacity-60">职级:</span>
                  <span className="font-bold">{memberData.role}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-mono">
                  <span className="opacity-60">特长:</span>
                  <span className="font-bold">{memberData.tag}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-2 border-black dark:border-white p-6 shadow-[4px_4px_0_var(--color-ink)] bg-white dark:bg-[#111]">
            <h3 className="font-black text-xl mb-4 flex items-center gap-2 uppercase"><GitCommit className="text-neon-pink"/> 专项统计</h3>
            <div className="space-y-4 font-mono text-sm">
              {memberData.stats.map((stat: any, index: number) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="opacity-70">{stat.label}</span>
                    <span className="font-bold">{stat.value}</span>
                  </div>
                  <div className="h-2 bg-black/10 dark:bg-white/10 w-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      whileInView={{ width: stat.percent }} 
                      viewport={{ once: true }} 
                      transition={{ duration: 1, ease: 'easeOut', delay: index * 0.2 }}
                      className={`h-full ${stat.color}`} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="col-span-1 md:col-span-2 space-y-8">
          {/* 专属日记与档案 */}
          <div>
            <h2 className="text-3xl font-black uppercase mb-6 flex items-center gap-3 border-b-4 border-black dark:border-white pb-2 inline-flex">
              <BookOpen className="w-8 h-8 text-accent-color" /> 专属日记与档案
            </h2>
            
            <div className="space-y-6">
              {memberData.posts.map((item: any, index: number) => (
                <motion.div 
                  key={item.id}
                  whileHover={{ x: 10 }}
                  className="border-2 border-black dark:border-white p-6 relative group bg-white dark:bg-[#111] shadow-[6px_6px_0_var(--color-ink)] hover:shadow-none hover:translate-y-[6px] hover:translate-x-[6px] transition-all grid grid-cols-1 md:grid-cols-4 gap-6 cursor-pointer"
                >
                  <div className="md:col-span-1 border-2 border-black dark:border-white overflow-hidden aspect-video relative">
                    <div className="absolute inset-0 bg-accent-color/30 mix-blend-color z-10 group-hover:opacity-0 transition-opacity" />
                    <img 
                      src={item.cover || POST_COVERS[(parseInt(memberId) + item.id) % POST_COVERS.length]}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt="post"
                    />
                  </div>
                  <div className="md:col-span-3 flex flex-col justify-center">
                    <span className="text-[10px] font-mono bg-black text-white dark:bg-white dark:text-black px-2 py-1 inline-block w-max mb-2 font-bold tracking-widest">2026.04.1{index + 1}</span>
                    <h3 className="text-xl font-bold uppercase mb-2 group-hover:text-accent-color transition-colors">{item.title}</h3>
                    <p className="opacity-70 text-sm font-mono line-clamp-2 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 私人成就勋章 */}
          <div>
            <h2 className="text-3xl font-black uppercase mb-6 flex items-center gap-3 border-b-4 border-black dark:border-white pb-2 inline-flex mt-2">
               <Trophy className="w-8 h-8 text-accent-color" /> 私人成就勋章
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['终极背锅侠', 'PPT大师', '凌晨三点打卡', '无情干饭机器'].map((badge, i) => (
                <div key={i} className="glass-card text-black dark:text-white p-4 !rounded-none flex flex-col items-center text-center border-2 border-black dark:border-white shadow-[4px_4px_0_var(--color-ink)] hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-accent)] transition-all group overflow-hidden relative cursor-pointer">
                   <div className="absolute top-0 right-0 w-8 h-8 bg-black/5 dark:bg-white/5 transform rotate-45 translate-x-4 -translate-y-4 group-hover:scale-[15] transition-transform duration-700 ease-out z-0" />
                   
                   <div className="w-16 h-16 !rounded-none bg-black/5 dark:bg-white/10 mb-4 flex items-center justify-center border-2 border-accent-color shadow-[2px_2px_0_var(--color-ink)] relative z-10 group-hover:border-black dark:group-hover:border-white transition-colors">
                     <div className="absolute -inset-1 border border-dashed border-black/20 dark:border-white/20 group-hover:rotate-12 transition-transform duration-500"></div>
                     <span className="text-2xl group-hover:scale-125 transition-transform duration-300">🏅</span>
                   </div>
                   <h4 className="font-bold text-sm tracking-wider z-10 group-hover:text-accent-color transition-colors">{badge}</h4>
                   <p className="text-[10px] opacity-60 mt-2 font-mono z-10 bg-black/5 px-2 py-0.5 border border-black/10 dark:border-white/10 uppercase font-bold">任务已完结</p>
                </div>
              ))}
            </div>
          </div>

          <div>
             <h2 className="text-3xl font-black uppercase mb-6 flex items-center gap-3 border-b-4 border-black dark:border-white pb-2 inline-flex mt-2">
               活跃度热力图
            </h2>
            
            <div className="mb-6">
              <div className="flex justify-between text-sm font-mono mb-2">
                <span className="font-bold opacity-70">年度完成度</span>
                <span className="font-bold text-neon-green">85%</span>
              </div>
              <div className="h-4 w-full bg-black/10 dark:bg-white/10 border-2 border-black dark:border-white p-[2px]">
                 <motion.div 
                   initial={{ width: 0 }} 
                   whileInView={{ width: "85%" }} 
                   viewport={{ once: true, margin: "-50px" }} 
                   transition={{ duration: 1.5, ease: "circOut" }} 
                   className="h-full bg-neon-green" 
                 />
              </div>
            </div>

            <div className="border-4 border-black dark:border-white p-6 shadow-[8px_8px_0_var(--color-ink)] bg-white dark:bg-[#111]">
               <div className="grid grid-cols-[repeat(52,1fr)] gap-1">
                  {/* Generate mock heatmap dots */}
                  {Array.from({ length: 52 * 7 }).map((_, i) => {
                    const intensity = Math.random();
                    let colorClass = 'bg-black/5 dark:bg-white/5';
                    if (intensity > 0.8) colorClass = 'bg-accent-color';
                    else if (intensity > 0.6) colorClass = 'bg-neon-green';
                    else if (intensity > 0.4) colorClass = 'bg-neon-blue';
                    
                    return (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "50px" }}
                        transition={{ delay: i * 0.002 }}
                        className={`w-full aspect-square ${colorClass} hover:border hover:border-black dark:hover:border-white cursor-crosshair`} 
                        title={`Contribution: ${Math.floor(intensity * 10)}`} 
                      />
                    );
                  })}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
