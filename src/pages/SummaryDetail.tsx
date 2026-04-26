import { motion, AnimatePresence } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Flame, Trash2, Edit2, Send, ThumbsUp } from 'lucide-react';
import { useState } from 'react';

const MOCK_SUMMARIES = [
  {
    id: "1",
    title: "第七周工作总结 — 前端基石与团队磨砺",
    author: "何祥鹏",
    date: "2026.04.19",
    content: `踏入双体啻阳四部的第七周，宛如一场在技术代码与职场风浪中交织前行的壮丽航程。本周，作为第六小组的一员，并在Java学习方向上不断探索的我，不仅迎来了前端基础与数据库核心技术的深度洗礼，更在多项职场实战活动中淬炼了自身的团队协作与领导能力。

本周关键词：前端基石、MySQL核心、网页部署实战、干部例会、危机响应、徒步团队磨砺。

一、软件技术方面

深入探究前端样式基石CSS。从基础的选择器到复杂的盒模型机制，系统学习了如何通过CSS控制网页元素的精确布局、色彩搭配、字体排版与响应式断点设置。全面解析JavaScript动态交互，系统学习了JS的基本语法、核心数据类型以及DOM树的操作逻辑。

系统攻克MySQL数据库核心语言。按模块拆解并学习了SQL四大核心分支：DDL（数据定义语言）、DML（数据操作语言）、DQL（数据查询语言）、DCL（数据控制语言）。

技术实战：设计并部署个人专属网页。将本周所学的前端知识融会贯通，从零开始规划网页主题、设计UI界面、编写HTML/CSS代码，并最终探索云端服务器或静态托管平台的部署流程。

二、职场关键能力方面

算力无界活动：在"虾探未知·算力无界"主题活动中，我作为核心工作人员负责了关键的技术部署与环境调试工作。然而现场状况频出——运行环境配置迟迟没有生效，核心体验项目的交互系统甚至出现了回复乱码的严重致命问题。紧急排查后发现是底层字符编码设置错误。这次经历给我上了生动的一课：做事必须做好万全的准备。

团队磨砺徒步：周五的团队磨砺活动中，我担任了三队的组长，带领队员进行极具挑战的校园徒步。作为全队的核心主心骨，我学到了如何在压力与疲惫交加的极端环境中，精准平衡"目标导向"与"人文关怀"。真正的胜利从来不是某一个英雄跑得多快，而是保证每一位队员都能安全、体面地到达终点。

三、结语

回望第七周这波澜壮阔的点点滴滴，技术代码的深耕细作与职场风浪的摸爬滚打在此交相辉映。CSS与JS的紧密交织让我初次触碰到了前端工程的绚丽多姿，人生第一个网页的成功云端部署，更是为我的技术信仰注入了一剂强心针。道阻且长，行则将至，行而不辍，未来可期！`,
    likes: 42,
    comments: []
  },
  {
    id: "2",
    title: "第七周工作总结 — AI剪辑与团队燃炸时刻",
    author: "余佳",
    date: "2026.04.19",
    content: `"聚是一团火，散是满天星。"加入啻阳四部第七周，我在软件技术学习上深耕细研、笃行不怠，在团队协作与职场实践中锤炼本领、突破自我。

一、软件技术方面

系统学习MySQL数据库四大核心语句：DDL（数据定义语言）、DML（数据操作语言）、DQL（数据查询语言）、DCL（数据控制语言）。能够熟练运用DDL语句构建数据库架构，利用DML语句高效维护数据，编写复杂的DQL语句满足业务需求。

二、职场关键能力方面

爆肝剪辑遇AI卡壳？全靠队友在线兜底！收到益姐发来的压缩包后，我便全身心投入到职场小课堂视频的剪辑工作中。从下午两点到傍晚六点，全程专注于AI形象生成与3分钟视频脚本的完善，最终敲定皮克斯3D动画风格。当我的AI生成额度耗尽时，张凯峰和袁丹琴毫不犹豫伸出援手，组长何祥鹏巧用方法破解难题。

组长一句"我想当主管"，全组直接燃成"特种兵"！何祥鹏在小组群里发出五个字："报名，计管。"这五个字就像一颗深水炸弹，瞬间让沉寂的群聊炸开锅。"为小组荣誉而战！""没有任何一个人可以小瞧我们组。"——我们栓Q六组从来都不口嗨，全员出击、主动报名！

徒步变"渡劫"？拔河赢麻，双腿已废！部门拔河PK中我们简直是"传奇耐火王"——一直打持久战，在所有拔河比赛里坚持得最久。徒步过程中，何祥鹏和张凯峰像脱缰的野马蹿出去，我只能在后面拼命喊"慢点，跟不上啦"。虽然过程艰辛，但那些一起挥洒的汗水、一起呐喊的瞬间，都变成了彼此之间心照不宣的默契。

三、结语

本周的工作充实而有意义，是技术深耕、能力提升、情谊升温的一周。我们组的氛围真的顶呱呱，不管最后能否竞选成功，敢于迈出这一步、勇于挑战自我的每一个人，都是最勇敢的追光者！`,
    likes: 88,
    comments: [
      { id: Date.now(), author: "何祥鹏", text: "余佳剪辑真的太厉害了！", time: "1小时前" }
    ]
  },
  {
    id: "3",
    title: "第七周工作总结 — 破茧成蝶",
    author: "张凯峰",
    date: "2026.04.19",
    content: `"路虽远，行则将至；事虽难，做则必成。"本周是专业能力与综合素养同步提升的关键一周，技术上聚焦CSS、JavaScript前端核心与MySQL全模块操作，职场上参与企业宣讲、岗位面试、团队磨砺及软约赛事观摩。

一、技术方向学习与实践

前端核心学习CSS：系统学习基础语法、选择器、文本与背景样式、盒模型、浮动及定位布局。JavaScript：学习基础语法、变量、数据类型、运算符、流程控制、函数及事件驱动。MySQL数据库：完整学习DDL、DML、DQL、DCL四大核心语句。

二、职场方向学习与实践

企业宣讲与面试：参加星橙宣讲会，深入了解海外直播及运营岗位业务模式。团队磨砺活动：拔河中学习团队节奏配合，徒步中强化集体意识、互助精神与意志力锻炼。软约月赛观摩：学习公众演讲逻辑、语言表达、气场把控。

个人成长：小组成员团结一致的精神给予我强烈鼓励，我突破了以往犹豫、内敛的性格短板，主动参与基地总经理与部门人事主管竞选。通过线上课程自主学习ZB人物模型雕刻，已形成清晰的制作思路。

三、结语

本周技术学习与职场实践同步推进，CSS、JS与MySQL夯实了技术基础，宣讲、面试、团队活动、赛事观摩及自主成长全面提升综合素养。后续我将针对性强化练习、深化学习、优化表达、提升落地能力，稳步提升个人综合竞争力。`,
    likes: 56,
    comments: []
  },
  {
    id: "4",
    title: "第七周工作总结 — 踏实前行，团队同行",
    author: "段利利",
    date: "2026.04.18",
    content: `本周我始终以"夯实技术基础、锤炼职场能力、突破自我边界"为核心目标，在软件技术学习与团队实践中稳步推进。

一、软件技术方面

CSS模块：系统复习了基础选择器、盒模型、浮动与定位的核心原理，重点学习了Flex弹性布局与Grid网格布局。JavaScript模块：重点学习了DOM元素获取、属性修改、事件绑定的核心方法。MySQL模块：完整学习了数据库四大核心语句DDL、DML、DQL、DCL。

二、职场关键能力方面

拔河比赛让我明白，职场中每个角色都不可或缺。3.5公里徒步让我体会到职场工作中"合理分配体力"的重要性——一开始盲目冲刺只会导致中途体力透支，只有调整呼吸、稳步前进，才能顺利完成全程。

自己的提升：过去我常以"旁观者"的心态参与团队活动，而这次拔河比赛中，我主动加入啦啦队，全程为队员加油助威，深刻体会到了"融入团队"的快乐。面对3.5公里徒步的体力挑战，我没有中途放弃，而是在同伴的鼓励下咬牙坚持走完了全程。

三、结语

回顾本周，无论是软件技术知识的钻研，还是职场团队活动的体验，都让我收获满满。技术学习层面，我系统巩固了CSS、JavaScript以及MySQL各类语句的基础内容。团队协作方面，周五的户外磨砺活动意义深刻，让我切身领悟团队协作、互帮互助与集体凝聚的重要意义。后续我会保持踏实认真的学习态度，稳步前行，在不断积累中完善自我。`,
    likes: 35,
    comments: [
      { id: Date.now() - 500, author: "余佳", text: "利利加油！团队因你而更温暖！", time: "3小时前" }
    ]
  },
  {
    id: "5",
    title: "第七周工作总结 — 破茧之旅",
    author: "牛青峰",
    date: "2026.04.19",
    content: `步入啻阳四部第七周，如果用一个词来形容这段时光，那便是"破茧"。技术学习上，我们从基础的Java逻辑跨越到了前端世界与深邃的数据底层。职场能力上，从宣讲会的行业初探，到1v1谈话的拨云见日，再到团队徒步的意志磨炼，每一项活动都像是一把刻刀，在我的职场人格上雕琢出更清晰的轮廓。

一、软件技术方面

CSS的深度构建：深入理解了"盒子模型"的精髓，学习了多种定位方式以及Flex布局。JavaScript交互逻辑：重点掌握了DOM的操作技巧，学会了如何通过JS监听用户事件并动态修改页面元素。MySQL数据库全语言体系：全方位深度学习DDL、DML、DQL、DCL。个人网页设计与云端部署：将CSS布局、JS交互与后台逻辑进行初步融合，成功将项目通过Git上传至服务器。

二、职场关键能力方面

1v1谈话：益姐指引的"导航图"。这次对话让我明白了就业方向的选择不是一次性任务，而是不断修正的动态过程。

"虾"探未知活动中我担任后台工作人员，负责OpenClaw的安装与环境调试。每一个微小的配置错误都可能导致活动现场的技术事故，这次经历让我学会了在压力环境下保持冷静。

团队磨砺：周五的团队磨砺活动印象极为深刻。拔河环节中，当全组人为了一个目标齐声呐喊、重心后移时，那种汗水汇聚在一起的力量感，让我彻底明白了什么是团队凝聚力。那一刻，我们不是独立的个体，而是一个紧握的拳头。

三、结语

第七周是一场关于"寻找"的旅程：在代码的逻辑中寻找艺术的平衡，在职场的迷雾中寻找前行的灯塔，在团队的呐喊中寻找自我的归属。接下来的日子里，我将以更饱满的热情投入到技术冲刺中，向着更优秀的自己坚定地"行走"下去！`,
    likes: 233,
    comments: [
      { id: Date.now() - 1000, author: "何祥鹏", text: "明天来我办公室一趟", time: "10分钟前" }
    ]
  },
  {
    id: "6",
    title: "第七周工作总结 — 追风赶月，春山在望",
    author: "袁丹琴",
    date: "2026.04.19",
    content: `"追风赶月莫停留，平芜尽处是春山。"步入啻阳四部第七周，我以扎实为基、以精进为向，在MySQL数据库学习中系统深耕、逐项突破，完成从理论认知到实操落地的能力提升。

一、软件技术方面

系统学习MySQL基础认知，深入明晰数据库、数据表、字段、记录的核心概念。深入学习DDL数据定义语言，重点掌握数据库与数据表的创建、删除、修改、查看等核心操作。全面掌握DML数据操纵语言，精通数据插入、更新、删除、基础查询的语法规则。重点攻克DQL数据查询语言，深入钻研多表联查的核心逻辑，包括内连接、左连接、右连接的区别与应用场景。

二、职场关键能力方面

参与星橙巨星线下宣讲会，深入了解该企业的行业布局、用人标准及岗位核心技能要求，顺利通过企业初次面试。

主动报名人事主管换任竞选，认真学习人事主管岗位的核心职责与工作流程，主动跳出舒适区，尝试挑战管理类岗位。

与职场老师、技术老师共同就餐交流，倾听老师们分享职场深耕经验、技术成长路径、求职过程中的避坑要点。

参与团队徒步活动，与团队成员相互配合、彼此鼓励，共同完成3.5公里徒步任务，在活动中学习团队协作的方法、高效沟通的技巧。

三、结语

回望本周的学习与工作，每一天都充实且富有成长。技术上深耕MySQL四大核心语法，职场上参与宣讲、直面面试、竞选岗位、交流学习、团队徒步，实现求职能力、沟通能力、担当意识的全面突破。后续我将以更严谨的态度投入学习，精修面试技巧，优化简历内容，主动与老师深度交流，持续提升综合职场竞争力！`,
    likes: 67,
    comments: []
  }
];

export function SummaryDetail() {
  const { id } = useParams();
  const summary = MOCK_SUMMARIES.find(s => s.id === id) || MOCK_SUMMARIES[0];

  const [comments, setComments] = useState(summary.comments);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(summary.likes);
  const [hasLiked, setHasLiked] = useState(false);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments([...comments, { id: Date.now(), author: "当前用户", text: newComment, time: "刚刚" }]);
    setNewComment("");
  };

  const handleLike = () => {
    if (hasLiked) {
       setLikes(l => l - 1);
       setHasLiked(false);
    } else {
       setLikes(l => l + 1);
       setHasLiked(true);
    }
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      <div className="mb-4">
        <Link to="/core" className="inline-flex items-center gap-2 font-bold hover:text-neon-pink transition-colors font-mono uppercase bg-black text-white dark:bg-white dark:text-black py-2 px-4 shadow-[4px_4px_0_var(--color-ink)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
          <ArrowLeft className="w-5 h-5" /> 终止审阅 (Return)
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Document Content */}
        <div className="lg:col-span-2 glass-card text-black dark:text-white border-4 border-black dark:border-white p-8 md:p-12 !rounded-none shadow-[16px_16px_0_var(--color-ink)] bg-white/80 dark:bg-[#111] relative">
          <div className="absolute top-0 right-0 bg-accent-color text-black font-black uppercase font-mono px-4 py-2 border-b-4 border-l-4 border-black dark:border-white shadow-[-4px_4px_0_var(--color-ink)]">
            Classified Document
          </div>

          <div className="mb-12 border-b-4 border-black dark:border-white border-dashed pb-8 mt-4">
            <h1 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-widest leading-tight">
              {summary.title}
            </h1>
            <div className="flex flex-wrap gap-4 font-mono text-sm opacity-80 uppercase font-bold">
              <span className="bg-black text-white dark:bg-white dark:text-black px-2 py-1">Author: {summary.author}</span>
              <span className="border-2 border-current px-2 py-1">Date: {summary.date}</span>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none font-mono">
             {summary.content.split('\n\n').map((paragraph, i) => {
               if (paragraph.startsWith('>')) {
                 return (
                   <blockquote key={i} className="border-l-8 border-accent-color bg-black/5 dark:bg-white/5 p-4 my-6 font-bold font-sans italic">
                     {paragraph.replace('>', '').trim()}
                   </blockquote>
                 );
               }
               return <p key={i} className="my-4 leading-relaxed">{paragraph}</p>;
             })}
          </div>

          <div className="mt-16 pt-8 border-t-4 border-black dark:border-white flex justify-between items-center">
             <button
               onClick={handleLike}
               className={`flex items-center gap-2 px-6 py-3 font-black text-lg uppercase transition-all shadow-[4px_4px_0_var(--color-ink)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none border-4 border-black dark:border-white ${hasLiked ? 'bg-neon-green text-black' : 'bg-transparent hover:bg-black/5 dark:hover:bg-white/5'}`}
             >
               <Flame className={`w-6 h-6 ${hasLiked ? 'fill-black' : ''}`} />
               {likes} 认可 (Acknowledge)
             </button>

             <div className="flex gap-4">
               <button className="p-3 border-4 border-black dark:border-white bg-white dark:bg-black shadow-[4px_4px_0_var(--color-ink)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none ring-2 ring-white/30 hover:ring-white transition-all text-black dark:text-white" title="修改文档">
                 <Edit2 className="w-5 h-5" />
               </button>
               <button className="p-3 border-4 border-black dark:border-white bg-white dark:bg-black shadow-[4px_4px_0_var(--color-ink)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none ring-2 ring-white/30 hover:ring-neon-pink transition-all text-black dark:text-white" title="删除文档">
                 <Trash2 className="w-5 h-5" />
               </button>
             </div>
          </div>
        </div>

        {/* Annotations / Comments Sidebar */}
        <div className="lg:col-span-1 border-4 border-black dark:border-white shadow-[8px_8px_0_var(--color-ink)] bg-white dark:bg-[#111] text-black dark:text-white flex flex-col h-[600px] lg:h-full sticky top-24">
          <div className="p-4 border-b-4 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black shrink-0">
            <h3 className="text-xl font-black uppercase flex items-center gap-2 tracking-widest">
              <MessageSquare className="w-5 h-5" />
              在线批注 ({comments.length})
            </h3>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-black dark:scrollbar-thumb-white scrollbar-track-transparent">
             <AnimatePresence>
                {comments.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center opacity-50 font-mono text-sm py-8 text-black dark:text-white">
                     暂无批注数据...
                  </motion.div>
                ) : (
                  comments.map(c => (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="border-2 border-black dark:border-white p-3 bg-black/5 dark:bg-white/5 relative group text-black dark:text-white"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-sm bg-accent-color text-black px-1 leading-none">{c.author}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono opacity-50">{c.time}</span>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-accent-color cursor-pointer">
                            <ThumbsUp className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm font-mono leading-relaxed">{c.text}</p>
                    </motion.div>
                  ))
                )}
             </AnimatePresence>
          </div>

          <div className="p-4 border-t-4 border-black dark:border-white bg-black/5 dark:bg-white/5 shrink-0">
             <div className="relative">
               <textarea
                 value={newComment}
                 onChange={e => setNewComment(e.target.value)}
                 onKeyDown={e => {
                   if (e.key === 'Enter' && !e.shiftKey) {
                     e.preventDefault();
                     handleAddComment();
                   }
                 }}
                 placeholder="输入批注 (Enter 提交)..."
                 className="w-full bg-white dark:bg-black text-black dark:text-white dark:placeholder:text-white/50 border-2 border-black dark:border-white p-3 pr-12 text-sm font-mono outline-none focus:border-accent-color resize-none h-24"
               />
               <button
                 onClick={handleAddComment}
                 disabled={!newComment.trim()}
                 className="absolute bottom-3 right-3 p-2 bg-black text-white dark:bg-white dark:text-black disabled:opacity-50 hover:bg-accent-color hover:text-black dark:hover:bg-accent-color dark:hover:text-black transition-colors"
               >
                 <Send className="w-4 h-4" />
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
