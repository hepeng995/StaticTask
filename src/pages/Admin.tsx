import { ShieldAlert, KeyRound, Users, UserPlus, Trash2, X, CheckSquare, Settings2, Music, Link as LinkIcon, Upload } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect, useRef } from 'react';
import { set, del } from 'idb-keyval';

type Role = 'admin' | 'editor' | 'viewer' | 'guest';

interface MemberRole {
  id: string;
  email: string;
  name: string;
  role: Role;
}

const INITIAL_MEMBERS: MemberRole[] = [
  { id: '1', email: 'admin@group.com', name: '何祥鹏', role: 'admin' },
  { id: '2', email: 'li@group.com', name: '袁丹琴', role: 'editor' },
  { id: '3', email: 'wang@group.com', name: '张凯峰', role: 'viewer' },
  { id: '4', email: 'guest@group.com', name: '牛青峰', role: 'guest' },
];

const DEFAULT_TRACKS = [
  { id: 1, title: "搞笑音乐·听完笑到打鸣", artist: "《小组摸鱼之歌》", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "深夜肝代码专属", artist: "无情干饭机器", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "赛博朋克 2077 Vibe", artist: "夜之城节奏", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

export function Management() {
  const { user, isLoading } = useAuth();
  
  // Role Management State
  const [members, setMembers] = useState<MemberRole[]>(INITIAL_MEMBERS);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<Role>('viewer');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkRole, setBulkRole] = useState<Role>('viewer');

  // Music Management State
  const [customTitle, setCustomTitle] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [tracks, setTracks] = useState(DEFAULT_TRACKS);

  useEffect(() => {
    try {
      const savedTracks = localStorage.getItem('team_music_tracks');
      if (savedTracks) {
        setTracks(JSON.parse(savedTracks));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const addCustomTrack = () => {
    if (!customTitle.trim() || !customUrl.trim()) return;
    
    const newTrack = {
      id: Date.now(),
      title: customTitle,
      artist: "自定义网络源",
      url: customUrl
    };
    
    const newTracks = [...tracks, newTrack];
    setTracks(newTracks);
    localStorage.setItem('team_music_tracks', JSON.stringify(newTracks));
    window.dispatchEvent(new Event('sync_music_tracks'));
    
    setCustomTitle('');
    setCustomUrl('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileId = `local_audio_${Date.now()}`;
      await set(fileId, file);
      
      const newTrack = {
        id: Date.now(),
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: "本地上传",
        url: URL.createObjectURL(file), // Provide immediate usable Blob URL
        fileId: fileId // Pointer for the layout player to reconstruct it
      };
      
      const newTracks = [...tracks, newTrack];
      setTracks(newTracks);
      localStorage.setItem('team_music_tracks', JSON.stringify(newTracks));
      window.dispatchEvent(new Event('sync_music_tracks'));
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      alert('已成功将本地音频刻录至网关！');
    } catch (err) {
      console.error('File save error:', err);
      alert('存储文件失败，请确保浏览器允许离线存储。');
    }
  };

  const removeCustomTrack = async (id: number) => {
    const target = tracks.find(t => t.id === id);
    if (target && (target as any).fileId) {
       await del((target as any).fileId);
       if(target.url && target.url.startsWith('blob:')) {
           URL.revokeObjectURL(target.url);
       }
    }
    
    const newTracks = tracks.filter(t => t.id !== id);
    setTracks(newTracks);
    localStorage.setItem('team_music_tracks', JSON.stringify(newTracks));
    window.dispatchEvent(new Event('sync_music_tracks'));
  };

  const handleRoleChange = (id: string, newRole: Role) => {
    setMembers(members.map(m => m.id === id ? { ...m, role: newRole } : m));
  };

  const handleDeleteMember = (id: string) => {
    if(window.confirm('确认要删除该成员的权限吗？')) {
      setMembers(members.filter(m => m.id !== id));
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;
    
    const newMember: MemberRole = {
      id: Date.now().toString(),
      name: newUserName,
      email: newUserEmail,
      role: newUserRole
    };
    
    setMembers([...members, newMember]);
    setIsAddUserOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('viewer');
  };

  const handleToggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(members.map(m => m.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`确认要删除选中的 ${selectedIds.length} 个成员吗？`)) {
      setMembers(members.filter(m => !selectedIds.includes(m.id)));
      setSelectedIds([]);
    }
  };

  const handleBulkRoleChange = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`确认将选中的 ${selectedIds.length} 个成员的权限一键修改为 ${bulkRole.toUpperCase()} 吗？`)) {
      setMembers(members.map(m => selectedIds.includes(m.id) ? { ...m, role: bulkRole } : m));
      setSelectedIds([]);
    }
  };

  if (isLoading) {
    return <div className="h-[50vh] flex items-center justify-center font-mono">正在验证凭证...</div>;
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
         <motion.div 
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="border-8 border-neon-pink bg-black max-w-xl w-full p-8 text-center shadow-[16px_16px_0_var(--color-ink)] relative overflow-hidden"
         >
           <div className="absolute inset-0 bg-neon-pink/10 mix-blend-color animate-[neon-pulse_2s_infinite]" />
           <ShieldAlert className="w-24 h-24 text-neon-pink mx-auto mb-6 relative z-10" />
           <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-widest mb-4 relative z-10">
             访问被拒绝
           </h1>
           <div className="bg-neon-pink text-black font-bold font-mono py-2 px-4 inline-block mb-6 relative z-10">
             错误：权限不足 
           </div>
           <p className="text-white/70 font-mono text-sm leading-relaxed mb-8 relative z-10">
             您需要最高管理员权限才能访问管理界面。
             如果您是管理员，请使用指定的安全通道重新登录。
           </p>
           
           <div className="flex justify-center relative z-10">
             <div className="flex items-center gap-2 border-2 border-white/20 px-4 py-2 font-mono text-xs text-white/50">
               <KeyRound className="w-4 h-4" /> 需要安全登录：admin@group.com
             </div>
           </div>
         </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-[fadeIn_0.5s_ease-out]">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black mb-4">后台管理系统</h2>
        <div className="inline-flex items-center gap-2 bg-accent-color text-black px-3 py-1 border border-black dark:border-white shadow-[2px_2px_0_var(--color-ink)] mb-4 font-bold font-mono uppercase text-sm">
           <ShieldAlert className="w-4 h-4" /> 管理员已授权
        </div>
        <p className="opacity-60">团队事务 / 权限分发 / 绝密档案库</p>
      </div>

      <section className="mt-16 pt-16 border-t-4 border-black dark:border-white border-dashed">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold flex items-center gap-2"><Users /> 成员权限分配</h3>
          <button onClick={() => setIsAddUserOpen(true)} className="bg-neon-green text-black px-4 py-2 border-2 border-black dark:border-white font-bold text-sm flex items-center gap-1 shadow-[4px_4px_0_var(--color-ink)] hover:translate-y-1 hover:shadow-none transition-all">
            <UserPlus className="w-4 h-4" /> 新增成员
          </button>
        </div>

        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-accent-color/20 border-2 border-accent-color p-4 mb-4 flex flex-col md:flex-row items-center justify-between gap-4 font-mono shadow-[4px_4px_0_var(--color-ink)] transition-colors"
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckSquare className="w-5 h-5 text-accent-color" />
              已选择 {selectedIds.length} 个成员
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-2 border-2 border-black dark:border-white bg-white dark:bg-black px-2 py-1 w-full md:w-auto">
                <Settings2 className="w-4 h-4 opacity-50" />
                <select 
                  value={bulkRole}
                  onChange={e => setBulkRole(e.target.value as Role)}
                  className="bg-transparent font-bold outline-none cursor-pointer flex-1 text-sm text-black dark:text-white"
                >
                  <option value="admin" className="text-black bg-white">ADMIN</option>
                  <option value="editor" className="text-black bg-white">EDITOR</option>
                  <option value="viewer" className="text-black bg-white">VIEWER</option>
                  <option value="guest" className="text-black bg-white">GUEST</option>
                </select>
                <button onClick={handleBulkRoleChange} className="bg-black text-white dark:bg-white dark:text-black px-3 py-1 font-bold text-xs uppercase hover:bg-neon-green hover:text-black dark:hover:bg-neon-green dark:hover:text-black transition-colors">
                  批量应用
                </button>
              </div>
              <button onClick={handleBulkDelete} className="bg-neon-pink text-white border-2 border-black dark:border-white px-4 py-2 font-bold text-sm flex items-center gap-1 hover:bg-black w-full md:w-auto justify-center transition-colors shadow-[2px_2px_0_var(--color-ink)] hover:translate-y-1 hover:shadow-none">
                <Trash2 className="w-4 h-4" /> 批量删除
              </button>
            </div>
          </motion.div>
        )}

        <div className="border-4 border-black dark:border-white bg-white dark:bg-[#111] shadow-[8px_8px_0_var(--color-ink)] overflow-x-auto">
          <table className="w-full text-left font-mono whitespace-nowrap">
            <thead className="bg-black/5 dark:bg-white/5 border-b-4 border-black dark:border-white">
              <tr>
                <th className="p-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={members.length > 0 && selectedIds.length === members.length}
                    onChange={handleToggleSelectAll}
                    className="w-4 h-4 accent-accent-color cursor-pointer transform scale-125 border-2 border-black"
                  />
                </th>
                <th className="p-4 uppercase tracking-widest text-sm">代号</th>
                <th className="p-4 uppercase tracking-widest text-sm">安全邮箱</th>
                <th className="p-4 uppercase tracking-widest text-sm">系统权限 (ROLE)</th>
                <th className="p-4 uppercase tracking-widest text-center text-sm">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-dashed divide-black/20 dark:divide-white/20">
              {members.map(member => (
                <tr key={member.id} className={`transition-colors ${selectedIds.includes(member.id) ? 'bg-accent-color/10' : 'hover:bg-accent-color/5'}`}>
                  <td className="p-4 text-center">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(member.id)}
                      onChange={() => handleToggleSelect(member.id)}
                      className="w-4 h-4 accent-accent-color cursor-pointer transform scale-125 border-2 border-black"
                    />
                  </td>
                  <td className="p-4 font-bold">{member.name}</td>
                  <td className="p-4 opacity-80">{member.email}</td>
                  <td className="p-4">
                    <select 
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value as Role)}
                      className="bg-transparent border-2 border-black dark:border-white p-1 font-bold outline-none cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 focus:bg-white dark:focus:bg-black text-black dark:text-white"
                    >
                      <option value="admin" className="text-black bg-white">ADMIN (超管)</option>
                      <option value="editor" className="text-black bg-white">EDITOR (编辑)</option>
                      <option value="viewer" className="text-black bg-white">VIEWER (只读)</option>
                      <option value="guest" className="text-black bg-white">GUEST (访客)</option>
                    </select>
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <button onClick={() => handleDeleteMember(member.id)} className="p-2 border-2 border-black dark:border-white hover:bg-neon-pink hover:text-white transition-colors" title="移除该成员">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add User Modal */}
      <AnimatePresence>
        {isAddUserOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsAddUserOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-black border-4 border-black dark:border-white shadow-[12px_12px_0_var(--color-ink)] p-8 max-w-md w-full relative z-10"
            >
              <button 
                type="button"
                onClick={() => setIsAddUserOpen(false)}
                className="absolute top-4 right-4 hover:text-neon-pink transition-colors outline-none"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-2xl font-black uppercase flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-accent-color" />
                新增系统授权
              </h2>
              
              <div className="bg-black/5 dark:bg-white/5 border-l-4 border-accent-color p-3 mb-6 mt-4 text-xs font-mono opacity-80 leading-relaxed text-black dark:text-white">
                <p className="font-bold mb-1 opacity-100 flex items-center gap-1">权限层级说明 [ 继承机制 ]：</p>
                <ul className="space-y-1">
                  <li><strong className="text-accent-color">ADMIN:</strong> 绝对控制权。可管理系统配置与人员。</li>
                  <li><strong>EDITOR:</strong> 数据操作权。可新增与修改加密档案及备忘录。</li>
                  <li><strong>VIEWER:</strong> 内部人员。仅具备所有系统记录的查阅权限。</li>
                  <li><strong>GUEST:</strong> 外部实体。权限极度受限，仅可访问公开页面。</li>
                </ul>
              </div>
              
              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="block font-bold text-sm uppercase tracking-widest mb-1">操作员代号</label>
                  <input 
                    type="text" 
                    required
                    value={newUserName}
                    onChange={e => setNewUserName(e.target.value)}
                    className="w-full bg-transparent border-2 border-black dark:border-white p-2 font-mono font-bold outline-none focus:border-accent-color shadow-[4px_4px_0_var(--color-ink)]"
                    placeholder="例如：何祥鹏"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm uppercase tracking-widest mb-1">安全邮箱</label>
                  <input 
                    type="email" 
                    required
                    value={newUserEmail}
                    onChange={e => setNewUserEmail(e.target.value)}
                    className="w-full bg-transparent border-2 border-black dark:border-white p-2 font-mono font-bold outline-none focus:border-accent-color shadow-[4px_4px_0_var(--color-ink)]"
                    placeholder="hacker@group.com"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm uppercase tracking-widest mb-1">初始权限</label>
                  <select 
                    value={newUserRole}
                    onChange={e => setNewUserRole(e.target.value as Role)}
                    className="w-full bg-transparent border-2 border-black dark:border-white p-2 font-mono font-bold outline-none focus:border-accent-color cursor-pointer bg-white dark:bg-black text-black dark:text-white shadow-[4px_4px_0_var(--color-ink)]"
                  >
                    <option value="admin" className="text-black bg-white">ADMIN (最高控制权)</option>
                    <option value="editor" className="text-black bg-white">EDITOR (可编辑文档)</option>
                    <option value="viewer" className="text-black bg-white">VIEWER (只读权限)</option>
                    <option value="guest" className="text-black bg-white">GUEST (外部访客)</option>
                  </select>
                </div>
                
                <button type="submit" className="w-full py-4 bg-neon-green text-black font-black text-lg uppercase tracking-widest border-2 border-black mt-4 hover:bg-black hover:text-neon-green transition-colors shadow-[6px_6px_0_var(--color-ink)] hover:translate-y-1 hover:shadow-none">
                  分配访问权限
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <section className="mt-16 pt-16 border-t-4 border-black dark:border-white border-dashed">
        <div className="flex justify-between items-end mb-8 relative">
          <div>
            <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
              <Music className="w-8 h-8 text-neon-pink" /> 终端音源网关控制面板
            </h2>
            <p className="opacity-60">在这里统一配置全局漂浮播放器的所有可访问数据流 (所有设置实时同步至前台)</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div className="glass-card p-6 !rounded-none border-4 border-black dark:border-white shadow-[8px_8px_0_var(--color-ink)] bg-white/50 dark:bg-black/50 flex flex-col h-full">
            <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2 border-b-2 border-black/10 dark:border-white/10 pb-4 shrink-0">
              <LinkIcon className="w-5 h-5 text-neon-blue" /> 自定义数据流注入
            </h3>
            
            <div className="space-y-4 shrink-0">
              <div>
                <label className="block text-xs font-bold uppercase mb-2">轨道呈现标识 (显示名称)</label>
                <input 
                  type="text" 
                  placeholder="如: 服务器宕机专属 BGM" 
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-white dark:bg-[#1a1a1a] border-2 border-black dark:border-white p-3 text-sm font-bold outline-none focus:border-neon-blue transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase mb-2">底层传输协议 (直连 URL)</label>
                <input 
                  type="text" 
                  placeholder="如: https://example.com/audio.mp3" 
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="w-full bg-white dark:bg-[#1a1a1a] border-2 border-black dark:border-white p-3 text-sm font-bold outline-none focus:border-neon-blue transition-colors"
                />
              </div>
              
              <button 
                onClick={addCustomTrack}
                disabled={!customTitle.trim() || !customUrl.trim()}
                className="w-full py-4 mt-2 bg-accent-color text-black font-black uppercase tracking-widest text-sm disabled:opacity-50 border-4 border-black shadow-[4px_4px_0_var(--color-ink)] disabled:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                授权注入全局网络链接
              </button>
            </div>
            
            <div className="mt-8 border-t-2 border-black/10 dark:border-white/10 pt-6 flex-1 flex flex-col justify-end">
              <div>
                <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-neon-green" /> 本地离线文件上传 (无需联网)
                </h3>
                <p className="text-xs opacity-60 font-mono mb-4">通过本地浏览器 IndexedDB 安全缓存局域文件流，突破外链限制。</p>
                
                <label className="flex items-center justify-center w-full min-h-[100px] border-2 border-dashed border-black dark:border-white bg-black/5 dark:bg-white/5 hover:bg-neon-green/20 dark:hover:bg-neon-green/20 cursor-pointer transition-colors relative group">
                  <input 
                    type="file" 
                    accept="audio/mp3, audio/wav, audio/ogg, audio/mp4" 
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <div className="text-center p-4">
                    <Upload className="w-6 h-6 mx-auto mb-2 text-neon-green group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-sm uppercase">选择音频文件 (.mp3/wav)</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 !rounded-none border-4 border-black dark:border-white shadow-[8px_8px_0_var(--color-ink)] bg-white/50 dark:bg-black/50 flex flex-col h-full">
            <h3 className="text-xl font-black uppercase mb-6 shrink-0 border-b-2 border-black/10 dark:border-white/10 pb-4">
              当前授权音轨清单 ({tracks.length})
            </h3>
            
            <div className="flex-1 min-h-0 space-y-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-black dark:scrollbar-thumb-white scrollbar-track-transparent">
              {tracks.map((track) => (
                <div key={track.id} className="flex justify-between items-center p-4 bg-white dark:bg-[#1a1a1a] border-2 border-black dark:border-white group hover:border-neon-pink transition-colors cursor-default">
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="font-bold text-sm truncate uppercase">{track.title}</div>
                    <div className="text-[10px] opacity-60 font-mono truncate mt-1 text-neon-blue">{track.artist}</div>
                    {track.id > 3 && <div className="text-[8px] opacity-40 font-mono truncate mt-1">{track.url}</div>}
                  </div>
                  
                  {track.id > 3 ? (
                    <button 
                      onClick={() => removeCustomTrack(track.id)} 
                      className="p-2 border-2 border-black dark:border-white hover:bg-neon-pink hover:text-white shrink-0 shadow-[2px_2px_0_var(--color-ink)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold bg-black/10 dark:bg-white/10 px-2 py-1 shrink-0 uppercase tracking-widest border border-black/20 dark:border-white/20">System</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
