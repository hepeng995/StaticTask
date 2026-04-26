import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Code, Music, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="flex flex-col items-center justify-center pt-20">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 !rounded-none glass-card mb-8 text-sm font-bold border-2 border-black dark:border-white shadow-[4px_4px_0_var(--color-ink)]">
          <Sparkles className="w-4 h-4 text-accent-color" />
          <span>全新上线・搞笑与实力并存</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
          <span className="block">SATURDAY</span>
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-pink">
            TEAM
          </span>
        </h1>
        
        <p className="text-lg md:text-xl opacity-70 max-w-2xl mx-auto mb-10 font-bold tracking-widest">
          记录我们的搞笑瞬间、团建名场面、成员糗事与回忆碎片。
          这是一个充满BUG与欢笑的神秘组织阵地。
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/core"
            className="group relative px-8 py-4 bg-black dark:bg-white text-white dark:text-black !rounded-none font-black overflow-hidden flex items-center gap-2 border-2 border-black dark:border-white shadow-[8px_8px_0_var(--color-ink)] hover:translate-y-1 hover:shadow-[4px_4px_0_var(--color-ink)] transition-all uppercase tracking-widest"
          >
            <span className="relative z-10">开启回忆集锦</span>
            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-neon-blue opacity-0 group-hover:opacity-100 transition-opacity z-0" />
          </Link>
          <Link
            to="/interactive"
            className="px-8 py-4 glass-card text-black dark:text-white !rounded-none font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors border-2 border-black dark:border-white shadow-[8px_8px_0_var(--color-ink)] hover:translate-y-1 hover:shadow-[4px_4px_0_var(--color-ink)] tracking-widest"
          >
            摸鱼弹幕墙
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full">
        <FeatureCard
          icon={<Users className="w-6 h-6 text-blue-500" />}
          title="全员卡片"
          desc="查看6人小组详细能力雷达图与隐藏摸鱼技能。"
          link="/members"
        />
        <FeatureCard
          icon={<Code className="w-6 h-6 text-purple-500" />}
          title="成果与搞笑并存"
          desc="不仅要发作品集，还要偷偷记录成员的糗事合集。"
          link="/core"
        />
        <FeatureCard
          icon={<Music className="w-6 h-6 text-pink-500" />}
          title="极简音乐电台"
          desc="自带反差萌的播放器，可能刷到唱跑调但好听的Demo。"
          link="/interactive"
        />
      </div>

      <div className="mt-24 w-full">
        <h2 className="text-3xl font-black mb-8 text-center uppercase tracking-widest">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-pink">团队瞬间</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden border-4 border-black dark:border-white shadow-[8px_8px_0_var(--color-ink)] group"
          >
            <img src="./大合照.jpeg" className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-700" alt="大合照" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden border-4 border-black dark:border-white shadow-[8px_8px_0_var(--color-ink)] group"
          >
            <img src="./大合照2.jpeg" className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-700" alt="大合照2" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, link }: { icon: ReactNode, title: string, desc: string, link: string }) {
  return (
    <Link to={link} className="glass-card p-6 !rounded-none group">
      <div className="w-12 h-12 border-2 border-black dark:border-white bg-black/5 dark:bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="opacity-60 text-sm">{desc}</p>
    </Link>
  );
}
