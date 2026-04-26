import { useAuth } from '../lib/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, UserCircle, Fingerprint, Terminal, Settings, Activity, Clock, ShieldCheck, Key, X, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';

export function UserCenter() {
  const { user, isLoading } = useAuth();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (isLoading) {
    return <div className="h-[50vh] flex items-center justify-center font-mono animate-pulse">正在读取身份矩阵...</div>;
  }

  if (!user) {
     return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
         <motion.div 
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="border-8 border-neon-pink bg-black max-w-xl w-full p-8 text-center shadow-[16px_16px_0_var(--color-ink)] relative overflow-hidden"
         >
           <div className="absolute inset-0 bg-neon-pink/10 mix-blend-color animate-[neon-pulse_2s_infinite]" />
           <ShieldAlert className="w-24 h-24 text-neon-pink mx-auto mb-6 relative z-10" />
           <h1 className="text-4xl md:text-4xl font-black text-white uppercase tracking-widest mb-4 relative z-10">
             身份未知
           </h1>
           <div className="bg-neon-pink text-black font-bold font-mono py-2 px-4 inline-block mb-6 relative z-10">
             错误：无活动会话 
           </div>
           <div className="text-white/70 font-mono text-sm leading-relaxed relative z-10">
             在访问个人指挥中心之前，您需要建立安全连接。请先在右上角登录。
           </div>
         </motion.div>
      </div>
    );
  }

  const handleAction = (actionName: string) => {
    setActiveModal(actionName);
    setSavedSuccess(false);
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => {
        setActiveModal(null);
      }, 1500);
    }, 1200);
  };

  const modalContent = (
    <AnimatePresence>
      {activeModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-md bg-white dark:bg-black border-4 border-black dark:border-white shadow-[16px_16px_0_var(--color-ink)] p-8 relative"
          >
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 hover:bg-neon-pink hover:text-white transition-colors border-2 border-transparent hover:border-black dark:hover:border-white"
            >
              <X className="w-6 h-6" />
            </button>
            
            {activeModal === '编辑资料' && (
              <div>
                <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-3"><Settings className="w-8 h-8 text-neon-green" /> 编辑资料</h3>
                <div className="space-y-4 font-mono">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-2">代号绑定</label>
                    <input type="text" defaultValue={user.email.split('@')[0]} className="w-full bg-black/5 dark:bg-white/5 border-2 border-black dark:border-white p-3 outline-none focus:border-neon-green" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-2">通讯密钥 (Email)</label>
                    <input type="email" disabled defaultValue={user.email} className="w-full bg-black/10 dark:bg-white/10 opacity-50 border-2 border-black dark:border-white p-3 cursor-not-allowed" />
                  </div>
                  <button 
                    onClick={handleSaveProfile} 
                    disabled={isSaving || savedSuccess}
                    className={`w-full mt-4 py-3 font-black uppercase tracking-widest border-2 border-black shadow-[4px_4px_0_black] transition-all
                      ${isSaving ? 'bg-black text-neon-green cursor-wait animate-pulse' : 
                        savedSuccess ? 'bg-black text-white cursor-default shadow-none translate-y-1' : 
                        'bg-neon-green text-black hover:translate-y-1 hover:shadow-none'}`}
                  >
                    {isSaving ? '正在同步数据链路...' : savedSuccess ? '变更已加密保存 [OK]' : '保存变更 (SAVE)'}
                  </button>
                </div>
              </div>
            )}

            {activeModal === '更新密钥' && (
              <div>
                <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-3"><Key className="w-8 h-8 text-neon-pink" /> 密钥中心</h3>
                <div className="bg-neon-pink/10 border-2 border-neon-pink p-4 mb-6 text-sm font-mono text-neon-pink flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>检测到您目前使用 OAUTH 联合登录介入，无法在此终端重置主通讯密钥。请前往原始授权中心执行轮换。</p>
                </div>
                <button onClick={() => setActiveModal(null)} className="w-full py-3 bg-white dark:bg-black border-2 border-black dark:border-white font-black uppercase tracking-widest hover:bg-neon-pink hover:text-white transition-colors">确认 (ACKNOWLEDGE)</button>
              </div>
            )}

            {activeModal === '活动日志' && (
              <div>
                <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-3"><Activity className="w-8 h-8 text-neon-blue" /> 威胁侦测日志</h3>
                <div className="h-48 bg-black dark:bg-[#111] border-2 border-black dark:border-white p-4 font-mono text-xs overflow-y-auto space-y-2 text-neon-blue">
                  <p>[SYS] 08:24 - Connection established from 192.168.1.104</p>
                  <p>[SYS] 08:25 - Identity verified via Matrix Protocol</p>
                  <p className="text-neon-pink">[WARN] 08:27 - Unauthorized root attempt blocked</p>
                  <p>[SYS] 08:28 - UI Render cycle completed</p>
                  <p className="animate-pulse">_ Waiting for incoming packets...</p>
                </div>
              </div>
            )}

            {activeModal === '授权凭证' && (
              <div>
                <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-3"><Fingerprint className="w-8 h-8 text-accent-color" /> 访问许可</h3>
                <div className="flex justify-center my-8">
                  <div className="w-32 h-32 border-4 border-black dark:border-white flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-accent-color opacity-20 group-hover:opacity-40 transition-opacity" />
                    <Fingerprint className="w-20 h-20 text-accent-color" />
                    <div className="absolute top-0 w-full h-1 bg-neon-green shadow-[0_0_10px_#0f0] animate-[scan_2s_ease-in-out_infinite]" />
                  </div>
                </div>
                <div className="text-center font-mono text-sm uppercase font-bold tracking-widest break-all bg-black/5 dark:bg-white/5 p-2">
                  {user.id.toUpperCase()}
                </div>
              </div>
            )}

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="space-y-12 animate-[fadeIn_0.5s_ease-out]">
      {createPortal(modalContent, document.body)}

      <div className="mb-8 border-l-8 border-accent-color pl-6">
        <h2 className="text-4xl font-black mb-2 uppercase tracking-widest flex items-center gap-3">
          <Terminal className="w-8 h-8" /> 指挥中心
        </h2>
        <p className="opacity-60 font-mono uppercase">系统操作员个人界面</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Identity Card */}
        <div className="col-span-1 space-y-8">
          <div className="border-4 border-black dark:border-white shadow-[8px_8px_0_var(--color-ink)] p-6 bg-white dark:bg-[#111] relative overflow-hidden">
             {/* Security Watermark */}
             <div className="absolute -right-16 -top-16 opacity-5 rotate-12">
               <Fingerprint className="w-64 h-64" />
             </div>
             
             <div className="flex items-start justify-between mb-8 relative z-10">
               <div className="w-20 h-20 bg-black dark:bg-white flex items-center justify-center border-4 border-accent-color shadow-[4px_4px_0_var(--color-ink)]">
                  <UserCircle className="w-12 h-12 text-white dark:text-black" />
               </div>
               <div className={`px-2 py-1 font-mono text-xs font-bold uppercase border-2 shadow-[2px_2px_0_var(--color-ink)] ${user.role === 'admin' ? 'bg-neon-pink text-black border-black' : 'bg-neon-blue text-black border-black'}`}>
                 {user.role} 权限通行
               </div>
             </div>

             <div className="space-y-4 relative z-10 font-mono">
               <div>
                 <p className="text-xs opacity-50 uppercase tracking-widest mb-1">操作员代号</p>
                 <p className="font-bold text-lg">{user.email.split('@')[0]}</p>
               </div>
               <div>
                 <p className="text-xs opacity-50 uppercase tracking-widest mb-1">安全邮箱</p>
                 <p className="font-bold">{user.email}</p>
               </div>
               <div>
                 <p className="text-xs opacity-50 uppercase tracking-widest mb-1">系统识别码 (UID)</p>
                 <p className="font-bold opacity-80">{user.id}</p>
               </div>
               <div>
                 <p className="text-xs opacity-50 uppercase tracking-widest mb-1">连接状态</p>
                 <div className="font-bold text-neon-green flex items-center gap-2">
                   <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" /> 已加密且活跃
                 </div>
               </div>
             </div>
          </div>

          <div className="border-2 border-black dark:border-white bg-accent-color text-black p-6 font-mono text-sm shadow-[4px_4px_0_var(--color-ink)]">
             <div className="flex items-center gap-2 font-bold mb-2">
               <ShieldCheck className="w-5 h-5" /> 安全级别状态
             </div>
             <p className="opacity-80 leading-relaxed">您的连接已通过 3 层代理节点路由。目前双重身份验证 (2FA) 未开启。建议尽早绑定物理安全验证器。</p>
          </div>
        </div>

        {/* Dashboard Panels */}
        <div className="col-span-1 md:col-span-2 space-y-8">
           
           {/* Quick Actions */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { name: '编辑资料', icon: Settings, color: 'hover:bg-neon-green hover:text-black' },
               { name: '更新密钥', icon: Key, color: 'hover:bg-neon-pink hover:text-white' },
               { name: '活动日志', icon: Activity, color: 'hover:bg-neon-blue hover:text-black' },
               { name: '授权凭证', icon: Fingerprint, color: 'hover:bg-accent-color hover:text-black' },
             ].map((action, i) => (
               <button 
                 key={i} 
                 onClick={() => handleAction(action.name)}
                 className={`flex flex-col items-center justify-center p-6 bg-white dark:bg-[#111] border-2 border-black dark:border-white shadow-[4px_4px_0_var(--color-ink)] transition-all hover:-translate-y-1 hover:shadow-none ${action.color} group gap-3`}
               >
                 <action.icon className="w-8 h-8" />
                 <span className="font-bold font-mono text-xs text-center">{action.name}</span>
               </button>
             ))}
           </div>

           {/* Access Logs */}
           <div className="border-4 border-black dark:border-white bg-white dark:bg-[#111] shadow-[8px_8px_0_var(--color-ink)] overflow-hidden">
             <div className="bg-black text-white dark:bg-white dark:text-black px-6 py-4 flex items-center justify-between border-b-4 border-black dark:border-white">
               <h3 className="font-bold flex items-center gap-2 uppercase tracking-widest"><Clock className="w-5 h-5" /> 访问矩阵日志</h3>
               <span className="font-mono text-xs opacity-70">过去 24 小时</span>
             </div>
             
             <div className="overflow-x-auto">
               <table className="w-full text-left font-mono text-sm whitespace-nowrap">
                 <thead className="bg-black/5 dark:bg-white/5 opacity-70">
                   <tr>
                     <th className="p-4 uppercase">时间戳</th>
                     <th className="p-4 uppercase">IP 地址</th>
                     <th className="p-4 uppercase">网关</th>
                     <th className="p-4 uppercase">状态</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y-2 divide-dashed divide-black/20 dark:divide-white/20">
                   {[
                     { time: '刚刚', ip: '192.168.1.104', gw: 'BETA_SERVER_01', status: 'SUCCESS' },
                     { time: '2 小时前', ip: '10.0.0.52', gw: 'MAIN_RELAY', status: 'SUCCESS' },
                     { time: '5 小时前', ip: '172.16.254.1', gw: 'UNKNOWN', status: 'DENIED', isWarn: true },
                     { time: '1 天前', ip: '192.168.1.104', gw: 'BETA_SERVER_01', status: 'SUCCESS' },
                   ].map((log, i) => (
                     <tr key={i} className="hover:bg-accent-color/20 transition-colors">
                       <td className="p-4 opacity-80">{log.time}</td>
                       <td className="p-4 font-bold">{log.ip}</td>
                       <td className="p-4">{log.gw}</td>
                       <td className="p-4">
                         <span className={`px-2 py-1 text-xs font-bold border ${log.isWarn ? 'bg-neon-pink text-white border-black' : 'bg-neon-green/20 text-green-700 dark:text-green-400 border-green-500'}`}>
                           {log.status}
                         </span>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>

        </div>
      </div>
    </div>
  );
}
