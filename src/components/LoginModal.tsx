import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Key, Sparkles, LogIn, Send, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [mode, setMode] = useState<'login' | 'forgot_password'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setMode('login');
        setEmail('');
        setPassword('');
        setStatusMsg(null);
        setShowPassword(false);
      }, 300);
    }
  }, [isOpen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsSubmitting(true);
    try {
      await login(email, password);
      
      const username = email.split('@')[0];
      const isAdmin = email === 'admin@group.com';
      const customWelcome = isAdmin 
        ? `[权限确认] 最高司令官 ${username}，系统核心已完全解锁。` 
        : `[访问授权] 操作员 ${username}，系统已为您开放。`;

      setStatusMsg({ type: 'success', text: customWelcome });
      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
      }, 1500);
    } catch (err) {
      setStatusMsg({ type: 'error', text: '访问被拒绝。凭据无效。' });
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatusMsg({ type: 'success', text: `重置链接已发送至：${email}` });
    setTimeout(() => setMode('login'), 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90%] max-w-md"
          >
            <div className="bg-white dark:bg-[#222222] text-black dark:text-white !rounded-none p-8 relative border-4 border-black dark:border-white shadow-[12px_12px_0_var(--shadow-color)] animate-[neon-pulse_3s_infinite_alternate]">
              {/* Close Button breaking out of the box */}
              <button 
                onClick={onClose}
                className="absolute -top-4 -right-4 w-10 h-10 bg-accent-color text-black border-2 border-black dark:border-white shadow-[4px_4px_0_var(--shadow-color)] flex items-center justify-center hover:bg-neon-pink hover:text-white transition-colors"
                title="Close"
              >
                <X className="w-6 h-6 font-black" />
              </button>

              <div className="mb-8 text-center mt-2">
                <h2 className="text-4xl font-black uppercase tracking-widest flex justify-center items-center gap-2">
                   {mode === 'login' ? (
                     <>系统登录</>
                   ) : (
                     <>重置密码</>
                   )}
                </h2>
                <div className="inline-block mt-3 border-2 border-black dark:border-white shadow-[2px_2px_0_var(--shadow-color)]">
                  <p className="opacity-80 text-xs font-bold uppercase tracking-widest bg-black dark:bg-white text-white dark:text-black py-1 px-4">
                    {mode === 'login' ? '欢迎回来，黑客。' : '终端访问权限恢复...'}
                  </p>
                </div>
              </div>

              {statusMsg && (
                <div className={`mb-6 p-3 border-2 border-black dark:border-white font-mono text-sm font-bold shadow-[4px_4px_0_var(--shadow-color)] uppercase tracking-wider text-center ${statusMsg.type === 'success' ? 'bg-neon-green text-black' : 'bg-neon-pink text-white'}`}>
                  {statusMsg.text}
                </div>
              )}

              <form onSubmit={mode === 'login' ? handleLogin : handleResetPassword} className="space-y-6">
                <div>
                  <label className="font-bold text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-accent-color" /> 邮箱
                  </label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setStatusMsg(null); }}
                    placeholder="hacker@group.com"
                    className="w-full bg-transparent border-2 border-black dark:border-white p-3 font-mono font-bold focus:outline-none focus:border-accent-color focus:bg-accent-color/10 transition-colors shadow-[4px_4px_0_var(--shadow-color)] placeholder:opacity-30 !rounded-none"
                  />
                </div>

                <AnimatePresence mode="wait">
                  {mode === 'login' && (
                    <motion.div 
                      key="password-field"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <label className="font-bold text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Key className="w-4 h-4 text-accent-color" /> 密码
                      </label>
                      <div className="relative">
                        <input 
                          type={showPassword ? 'text' : 'password'} 
                          required
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); setStatusMsg(null); }}
                          placeholder="••••••••"
                          className="w-full bg-transparent border-2 border-black dark:border-white p-3 pr-12 font-mono font-bold focus:outline-none focus:border-accent-color focus:bg-accent-color/10 transition-colors shadow-[4px_4px_0_var(--shadow-color)] placeholder:opacity-30 !rounded-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 hover:text-accent-color transition-colors outline-none"
                          title={showPassword ? "隐藏密码" : "显示密码"}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <div className="mt-3 text-right">
                        <button 
                          type="button" 
                          className="text-xs font-bold text-accent-color hover:text-neon-pink hover:underline uppercase tracking-widest inline-flex items-center gap-1 transition-colors"
                          onClick={() => { setMode('forgot_password'); setStatusMsg(null); }}
                        >
                          忘记密码? <Sparkles className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white shadow-[6px_6px_0_var(--shadow-color)] hover:translate-y-1 hover:shadow-[2px_2px_0_var(--shadow-color)] hover:bg-accent-color dark:hover:bg-accent-color hover:text-black transition-all font-black text-xl uppercase tracking-widest flex items-center justify-center gap-2 !rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {mode === 'login' ? (
                      isSubmitting ? <><span>处理中...</span> <Sparkles className="w-5 h-5 animate-spin" /></> : <><span>进入阵地</span> <LogIn className="w-5 h-5" /></>
                    ) : (
                      <><span>发送重置邮件</span> <Send className="w-5 h-5" /></>
                    )}
                  </button>

                  {mode === 'forgot_password' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 text-center"
                    >
                      <button
                        type="button"
                        onClick={() => { setMode('login'); setStatusMsg(null); }}
                        className="text-xs font-bold opacity-60 hover:opacity-100 hover:text-accent-color uppercase tracking-widest underline transition-all"
                      >
                        [ 取消 ]
                      </button>
                    </motion.div>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
