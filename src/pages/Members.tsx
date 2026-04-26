import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Mail, Github, Trophy, ListTodo, Plus, MoreVertical, X, Trash2, Edit2, FolderOpen, FileText } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { BrutalistAmap } from '../components/AmapContainer';
import React, { useEffect, useState } from 'react';

const MEMBERS = [
  { id: 1, name: '何祥鹏', role: '后端开发', tag: '核心主导', avatar: './何祥鹏.png' },
  { id: 2, name: '余佳', role: '视频剪辑', tag: '视觉叙事', avatar: './余佳.png' },
  { id: 3, name: '张凯峰', role: '3D建模', tag: '维度构建', avatar: './张凯峰.png' },
  { id: 4, name: '牛青峰', role: '声乐高手', tag: '声波共振', avatar: encodeURI('./牛青峰 (2).png') },
  { id: 5, name: '段利利', role: '运营', tag: '幕后推手', avatar: './段利利.jpeg' },
  { id: 6, name: '袁丹琴', role: '数据分析', tag: '真相洞察', avatar: './袁丹琴.png' },
];

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'doing' | 'done';
  tag: string;
  deadline: string;
}

const DEFAULT_TASKS: Task[] = [
  { id: '1', title: '重构博客首页并添加炫酷特效', status: 'todo', tag: 'Frontend', deadline: '4月15日' },
  { id: '2', title: '修复鉴权服务的内存泄漏问题', status: 'doing', tag: 'Backend', deadline: '4月18日' },
  { id: '3', title: '录制全员出镜测试VLOG', status: 'done', tag: 'Video', deadline: '4月10日' }
];

const COLUMNS = [
  { id: 'todo', label: '待处理 😅' },
  { id: 'doing', label: '进行中 🏃' },
  { id: 'done', label: '已完成 🎉' }
];

const ARCHIVE_DOCS = [
  { id: "1", title: "第 42 周总结：重构火葬场生存指南", author: "何祥鹏", date: "2026.04.18" },
  { id: "2", title: "高请求并发下的限流", author: "袁丹琴", date: "2026.04.15" },
  { id: "3", title: "如何优雅地在服务器里摸鱼看甄嬛传", author: "牛青峰", date: "2026.04.10" }
];

export function Members() {
  const location = useLocation();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskTag, setTaskTag] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [taskStatus, setTaskStatus] = useState<'todo' | 'doing' | 'done'>('todo');

  const [selectedArchive, setSelectedArchive] = useState<string | null>(null);

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Load Tasks
  useEffect(() => {
    const saved = localStorage.getItem('team_tasks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        setTasks(DEFAULT_TASKS);
      }
    } else {
      setTasks(DEFAULT_TASKS);
    }
  }, []);

  // Save Tasks
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('team_tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  useEffect(() => {
    if (location.hash === '#map') {
      const element = document.getElementById('map');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const openNewTaskModal = (defaultStatus: 'todo' | 'doing' | 'done' = 'todo') => {
    setEditingTask(null);
    setTaskTitle('');
    setTaskTag('UI/UX');
    setTaskDeadline('TBD');
    setTaskStatus(defaultStatus);
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskTag(task.tag);
    setTaskDeadline(task.deadline);
    setTaskStatus(task.status);
    setIsTaskModalOpen(true);
  };

  const saveTask = () => {
    if (!taskTitle.trim()) return;

    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? {
        ...t, title: taskTitle, tag: taskTag, deadline: taskDeadline, status: taskStatus
      } : t));
    } else {
      setTasks([...tasks, {
        id: Math.random().toString(36).substr(2, 9),
        title: taskTitle,
        tag: taskTag,
        deadline: taskDeadline,
        status: taskStatus
      }]);
    }
    setIsTaskModalOpen(false);
  };

  const deleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.effectAllowed = 'move';
    // Small delay to allow the drag ghost to show the original element
    setTimeout(() => {
      const el = document.getElementById(`task-${id}`);
      if (el) el.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(null);
    const el = document.getElementById(`task-${id}`);
    if (el) el.style.opacity = '1';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetStatus: 'todo' | 'doing' | 'done') => {
    e.preventDefault();
    if (draggedTaskId) {
      setTasks(tasks.map(t => t.id === draggedTaskId ? { ...t, status: targetStatus } : t));
    }
  };

  return (
    <div className="space-y-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black mb-4">成员阵地</h2>
        <p className="opacity-60">神秘6人组档案（电脑端一行，手机端两行）</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {MEMBERS.map(member => (
          <Link to={`/profile/${member.id}`} key={member.id}>
            <motion.div 
              whileHover={{ y: -10, scale: 1.05 }}
              className="glass-card aspect-[3/4] !rounded-none relative overflow-hidden group cursor-pointer border-2 border-black dark:border-white h-full"
            >
              <img src={member.avatar} className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125 transition-all group-hover:grayscale-0 group-hover:scale-105 duration-500" alt={member.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity" />
              <div className="absolute inset-0 bg-accent-color/30 mix-blend-color opacity-100 group-hover:opacity-0 transition-opacity duration-500" />
              
              <div className="absolute bottom-4 left-0 w-full px-4 text-white text-center z-10">
                <h3 className="font-bold text-lg uppercase tracking-wider group-hover:text-accent-color transition-colors">{member.name}</h3>
                <div className="mt-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold bg-white text-black px-1.5 py-0.5 uppercase tracking-widest">{member.role}</span>
                  <p className="text-[9px] opacity-80 font-mono underline decoration-dashed">{member.tag}</p>
                </div>
              </div>
              
              {/* Hover Resume Popup */}
              <div className="absolute inset-0 bg-black/90 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center border-4 border-accent-color m-2 z-20">
                <h4 className="font-bold mb-2 uppercase text-accent-color text-center leading-tight">{member.role}<br/><span className="text-xs text-white opacity-60 font-mono tracking-widest">{member.tag}</span></h4>
                <p className="text-[10px] opacity-80 mb-4 font-mono text-center leading-relaxed border-y border-white/20 py-2">
                  访问授权。<br/>
                  正在解密技能点...
                </p>
                <div className="flex justify-center gap-2 mt-auto relative z-30">
                  <button 
                    onClick={(e) => { e.preventDefault(); /* Handle Github link click */ }} 
                    className="p-2 bg-white/20 !rounded-none border border-white hover:bg-neon-pink transition-colors cursor-pointer block relative z-30"
                  >
                    <Github className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.preventDefault(); /* Handle Mail link click */ }} 
                    className="p-2 bg-white/20 !rounded-none border border-white hover:bg-neon-blue transition-colors cursor-pointer block relative z-30"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      <section id="map" className="scroll-mt-24">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 uppercase tracking-widest bg-black text-white dark:bg-white dark:text-black py-2 px-4 shadow-[4px_4px_0_var(--color-ink)]"><MapPin className="text-accent-color"/> 小组地图打卡</h3>
        <BrutalistAmap />
      </section>

      <section className="mt-16 pt-16 border-t-4 border-black dark:border-white border-dashed relative z-40">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold flex items-center gap-2"><ListTodo /> 小组共享备忘录</h3>
          <button 
            onClick={() => openNewTaskModal('todo')}
            className="bg-accent-color text-black px-4 py-2 border-2 border-black dark:border-white font-bold text-sm flex items-center gap-1 shadow-[4px_4px_0_var(--color-ink)] hover:translate-y-1 hover:shadow-none transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> 新增任务
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
          {COLUMNS.map((col) => (
            <div 
              key={col.id} 
              className={`min-w-[300px] flex-1 glass-card p-4 !rounded-none border-4 border-black dark:border-white shadow-[8px_8px_0_var(--color-ink)] snap-center bg-black/5 dark:bg-white/5 transition-colors ${draggedTaskId ? 'border-dashed border-accent-color bg-accent-color/5' : ''}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id as any)}
            >
              <h4 className="font-bold mb-4 px-2 uppercase tracking-widest text-black dark:text-white">{col.label}</h4>
              <div className="space-y-4 min-h-[150px]">
                <AnimatePresence>
                  {tasks.filter(t => t.status === col.id).map(task => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      id={`task-${task.id}`}
                      draggable
                      onDragStart={(e: any) => handleDragStart(e, task.id)}
                      onDragEnd={(e: any) => handleDragEnd(e, task.id)}
                      key={task.id} 
                      className="bg-white dark:bg-[#111] text-black dark:text-white p-4 !rounded-none border-2 border-black dark:border-white shadow-[4px_4px_0_var(--color-ink)] relative group cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-transform"
                    >
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                         <button onClick={(e) => { e.stopPropagation(); openEditTaskModal(task); }} className="p-1.5 bg-neon-blue border border-black dark:border-white text-white hover:scale-110 transition-transform">
                           <Edit2 className="w-3 h-3" />
                         </button>
                         <button onClick={(e) => deleteTask(task.id, e)} className="p-1.5 bg-neon-pink border border-black dark:border-white text-white hover:scale-110 transition-transform">
                           <Trash2 className="w-3 h-3" />
                         </button>
                      </div>

                      <div className="text-xs font-bold bg-accent-color text-black px-2 py-1 inline-block mb-3 uppercase border border-black">{task.tag}</div>
                      <p className="font-bold text-sm mb-6 pr-8">{task.title}</p>
                      
                      <div className="flex justify-between items-center mt-auto border-t-2 border-dashed border-black/10 dark:border-white/10 pt-3">
                        <div className="flex gap-1">
                          <div className="w-5 h-5 bg-neon-blue border-[1.5px] border-black dark:border-white" />
                          <div className="w-5 h-5 bg-neon-pink border-[1.5px] border-black dark:border-white" />
                        </div>
                        <span className="text-[10px] opacity-70 font-mono tracking-widest">{task.deadline} 截止</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {tasks.filter(t => t.status === col.id).length === 0 && (
                  <div className="text-center p-8 opacity-40 text-xs font-mono border-2 border-dashed border-black dark:border-white pointer-events-none text-black dark:text-white">
                    [ 空白区域，可拖拽至此 ]
                  </div>
                )}
              </div>
              <button 
                onClick={() => openNewTaskModal(col.id as any)}
                className="w-full py-3 mt-4 text-sm font-bold border-2 border-dashed border-black/50 dark:border-white/50 hover:border-solid text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all cursor-pointer"
              >
                + 添加卡片
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-[#111] text-black dark:text-white border-4 border-black dark:border-white shadow-[8px_8px_0_var(--color-accent)] w-full max-w-md p-6 relative"
          >
            <button 
              onClick={() => setIsTaskModalOpen(false)}
              className="absolute top-2 right-2 p-2 hover:bg-neon-pink hover:text-white transition-colors border-2 border-transparent hover:border-black dark:hover:border-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
              <ListTodo className="text-accent-color"/> 
              {editingTask ? '终端指令修改' : '下达新指令'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1 uppercase tracking-widest opacity-80">任务简述</label>
                <input 
                  type="text" 
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  className="w-full bg-black/5 dark:bg-black/50 border-2 border-black dark:border-white p-3 font-mono text-sm outline-none focus:border-accent-color transition-colors text-black dark:text-white dark:placeholder:text-white/50"
                  placeholder="e.g. 修复那个昨天惹出的祸"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1 uppercase tracking-widest opacity-80">业务分类标签</label>
                  <input 
                    type="text" 
                    value={taskTag}
                    onChange={e => setTaskTag(e.target.value)}
                    className="w-full bg-black/5 dark:bg-black/50 border-2 border-black dark:border-white p-3 font-mono text-sm outline-none focus:border-accent-color transition-colors text-black dark:text-white"
                  />
                </div>
                <div>
                   <label className="block text-xs font-bold mb-1 uppercase tracking-widest opacity-80">状态通道</label>
                   <select 
                     value={taskStatus}
                     onChange={(e: any) => setTaskStatus(e.target.value)}
                     className="w-full bg-black/5 dark:bg-black/50 border-2 border-black dark:border-white p-3 font-mono text-sm outline-none focus:border-accent-color transition-colors appearance-none cursor-pointer text-black dark:text-white"
                   >
                     <option value="todo">待处理 (TODO)</option>
                     <option value="doing">执行中 (DOING)</option>
                     <option value="done">已完成 (DONE)</option>
                   </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 uppercase tracking-widest opacity-80">终止时间标量</label>
                <input 
                  type="text" 
                  value={taskDeadline}
                  onChange={e => setTaskDeadline(e.target.value)}
                  className="w-full bg-black/5 dark:bg-black/50 border-2 border-black dark:border-white p-3 font-mono text-sm outline-none focus:border-accent-color transition-colors text-black dark:text-white dark:placeholder:text-white/50"
                  placeholder="e.g. 4月20日"
                />
              </div>

              <button 
                onClick={saveTask}
                className="w-full mt-4 bg-accent-color text-black font-black uppercase tracking-widest py-4 border-2 border-black dark:border-white shadow-[4px_4px_0_var(--color-ink)] hover:translate-y-1 hover:shadow-none transition-all cursor-pointer"
              >
                [ 录入 / 覆盖 内存 ]
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <section className="mt-16">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">周总结存档库</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['2026年4月', '2026年3月', '2026年2月'].map((folder, i) => (
            <div 
              key={i} 
              onClick={() => setSelectedArchive(folder)}
              className="glass-card p-6 !rounded-none hover:-translate-y-1 transition-transform cursor-pointer flex items-center justify-between border-2 border-black dark:border-white shadow-[4px_4px_0_var(--color-ink)] hover:shadow-[8px_8px_0_var(--color-accent)] text-black dark:text-white"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl filter grayscale contrast-125">📁</div>
                <div>
                  <h4 className="font-black text-xl tracking-widest uppercase">{folder}</h4>
                  <p className="text-xs opacity-80 font-mono">
                    {i === 0 ? ARCHIVE_DOCS.length : Math.floor(Math.random() * 5) + 8} 份文档
                  </p>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedArchive(folder); }}
                className="p-2 bg-black/5 dark:bg-white/10 hover:bg-accent-color hover:text-white transition-colors border-2 border-transparent hover:border-black dark:hover:border-white relative z-10"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {selectedArchive && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white dark:bg-[#111] text-black dark:text-white border-4 border-black dark:border-white shadow-[8px_8px_0_var(--color-accent)] w-full max-w-2xl p-6 relative flex flex-col max-h-[80vh]"
            >
              <button 
                onClick={() => setSelectedArchive(null)} 
                className="absolute top-4 right-4 p-2 hover:bg-neon-pink hover:text-white transition-colors outline-none z-50 border-2 border-transparent hover:border-black dark:hover:border-white"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-2 border-b-4 border-black dark:border-white pb-4 pr-12">
                <FolderOpen className="text-accent-color w-8 h-8" /> {selectedArchive} 归档记录
              </h3>
              
              <div className="flex-1 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-black dark:scrollbar-thumb-white scrollbar-track-transparent pr-2">
                {selectedArchive === '2026年4月' ? ARCHIVE_DOCS.map(doc => (
                  <Link 
                    key={doc.id} 
                    to={`/summary/${doc.id}`} 
                    className="block border-2 border-black dark:border-white p-4 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors group cursor-pointer relative overflow-hidden shadow-[4px_4px_0_var(--color-ink)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none bg-white dark:bg-[#111]"
                  >
                    <div className="absolute top-0 right-0 w-8 h-8 bg-accent-color/20 rotate-45 translate-x-4 -translate-y-4 group-hover:scale-[10] transition-transform duration-500 ease-out z-0" />
                    
                    <div className="relative z-10 flex justify-between items-start gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <FileText className="w-5 h-5 mt-1 shrink-0 group-hover:text-accent-color transition-colors" />
                        <div>
                           <h4 className="font-bold text-lg leading-tight mb-2">{doc.title}</h4>
                           <div className="flex items-center gap-3">
                             <span className="text-xs font-mono opacity-80 uppercase tracking-widest bg-black text-white dark:bg-white dark:text-black px-2 py-0.5 shadow-sm group-hover:bg-accent-color group-hover:text-black transition-colors">By: {doc.author}</span>
                           </div>
                        </div>
                      </div>
                      <span className="font-mono text-sm opacity-60 shrink-0">{doc.date}</span>
                    </div>
                  </Link>
                )) : (
                  <div className="p-12 text-center text-sm font-mono opacity-50 flex items-center justify-center border-4 border-dashed border-black/20 dark:border-white/20">
                    ERR_ARCHIVE_LOCKED: 数据权限不足或已封存，请联系管理员。
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
