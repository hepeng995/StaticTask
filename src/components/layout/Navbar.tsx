import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../ThemeProvider';
import { Sun, Moon, LogIn, LogOut, Menu, UserCircle, ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState, useRef, useEffect } from 'react';
import { LoginModal } from '../LoginModal';
import { useAuth } from '../../lib/AuthContext';

const LINKS = [
  { name: '首页', path: '/' },
  { name: '核心展示', path: '/core' },
  { name: '互动体验', path: '/interactive' },
  { name: '数据可视化', path: '/data' },
  { name: '成员阵地', path: '/members' },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <>
      <nav className="fixed top-0 z-50 w-full glass-card border-t-0 !rounded-none text-black dark:text-white bg-white/70 dark:bg-black/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-accent-color text-black flex items-center justify-center font-bold text-xl group-hover:rotate-12 transition-transform">
                ST
              </div>
              <span className={cn("font-bold text-xl", theme === 'night' && 'neon-text-blue')}>
                Saturday Team
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-1 items-center">
              {LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative px-4 py-2 text-sm font-medium rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-accent-color/10 dark:bg-accent-color/20 rounded-full"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors relative"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: theme === 'night' ? 180 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {theme === 'day' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-neon-blue" />}
                </motion.div>
              </button>
              
              {user ? (
                <div className="hidden md:flex items-center gap-4">
                  {user.role === 'admin' && (
                    <Link to="/admin" className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black hover:bg-accent-color hover:text-black dark:hover:bg-accent-color dark:hover:text-black transition-colors text-sm font-bold shadow-[2px_2px_0_var(--color-ink)]">
                      <ShieldAlert className="w-4 h-4" />
                      管理后台
                    </Link>
                  )}
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-accent-color bg-black/5 dark:bg-white/5 text-black dark:text-white transition-colors">
                     <Link to="/me" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                       <UserCircle className="w-4 h-4 text-accent-color" />
                       <span className="text-sm font-bold max-w-[100px] truncate" title={user.email}>{user.email.split('@')[0]}</span>
                     </Link>
                     <button onClick={logout} title="Logout" className="ml-2 hover:text-neon-pink transition-colors"><LogOut className="w-4 h-4" /></button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsLoginOpen(true)}
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black hover:bg-accent-color hover:text-black dark:hover:bg-accent-color dark:hover:text-black transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="text-sm font-bold">登录</span>
                </button>
              )}
              
              <button 
                className="md:hidden p-2"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Nav */}
        <motion.div 
          initial={false}
          animate={{ height: mobileOpen ? 'auto' : 0, opacity: mobileOpen ? 1 : 0 }}
          className="md:hidden overflow-hidden bg-white/95 dark:bg-[#111]/95 backdrop-blur-xl text-black dark:text-white overflow-y-auto max-h-[80vh] border-b-4 border-black dark:border-white"
        >
          <div className="px-4 py-4 flex flex-col gap-2">
            <div className="text-[10px] font-mono font-bold opacity-60 px-4 uppercase tracking-widest mb-1">主菜单 (MAIN)</div>
            {LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-none border-l-4 transition-colors font-bold",
                  location.pathname === link.path ? 'bg-accent-color/20 border-accent-color text-accent-color dark:text-accent-color' : 'border-transparent hover:bg-black/5 dark:hover:bg-white/10'
                )}
              >
                {link.name}
              </Link>
            ))}

            <div className="border-t-2 border-black/10 dark:border-white/10 my-2" />

            {user ? (
               <>
                 {user.role === 'admin' && (
                   <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black hover:bg-accent-color hover:text-black dark:hover:bg-accent-color dark:hover:text-black transition-colors font-bold shadow-[2px_2px_0_var(--color-ink)]">
                     <ShieldAlert className="w-4 h-4" />
                     <span>管理后台</span>
                   </Link>
                 )}
                 <div className="flex items-center justify-between px-4 py-3 border-2 border-accent-color bg-black/5 dark:bg-white/5 mb-4">
                   <Link to="/me" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 flex-1 hover:opacity-80">
                     <UserCircle className="w-4 h-4 text-accent-color" />
                     <span className="text-sm font-bold truncate">{user.email.split('@')[0]}</span>
                   </Link>
                   <button onClick={() => { logout(); setMobileOpen(false); }} className="hover:text-neon-pink transition-colors px-2 ml-4 border-l border-current">
                     <LogOut className="w-4 h-4" />
                   </button>
                 </div>
               </>
            ) : (
              <button 
                onClick={() => {
                  setIsLoginOpen(true);
                  setMobileOpen(false);
                }}
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black hover:bg-accent-color hover:text-black dark:hover:bg-accent-color dark:hover:text-black mb-4 transition-colors font-bold"
              >
                <LogIn className="w-4 h-4" />
                <span>登录</span>
              </button>
            )}
          </div>
        </motion.div>
      </nav>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
