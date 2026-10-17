// 大夏·学术浮生 — Original fictional setting and narrative.
// Credits: JF_Li@FD & Sol. Money values are fictional gameplay values in 万元.
export const cities = [
  { id: 'gaohu', name: '高沪市', university: '高沪海岳大学', tagline: '天际线很高，住房合同更高', description: '临海的巨型都市。共享平台与国际会议密集，招聘启事里的住房支持往往需要翻到第七页。', costOfLiving: 1.6, salaryMultiplier: 1.35, researchBonus: 1.18, networkBonus: 1.2, color: '#f1b27d', specialty: '前沿交叉、精密仪器', landmark: '海岳双塔' },
  { id: 'dajiang', name: '大江市', university: '澄江大学', tagline: '江水向东，申请书向上', description: '老牌大学聚集的江畔城市。生活与研究相对均衡，院系传统深厚，茶水间的消息有时比公文早一周。', costOfLiving: 1.0, salaryMultiplier: 1.0, researchBonus: 1.05, networkBonus: 1.05, color: '#6bbca8', specialty: '基础科学、传统强系', landmark: '澄江钟楼' },
  { id: 'shenhe', name: '深河市', university: '深河新知科技大学', tagline: '今天的原型，明天的赛道', description: '新建实验楼与孵化器长得一样。企业合作机会多，合同交付和学术发表常常争夺同一个周末。', costOfLiving: 1.4, salaryMultiplier: 1.3, researchBonus: 1.1, networkBonus: 1.15, color: '#7daee9', specialty: '智能系统、成果转化', landmark: '新知创研港' },
  { id: 'qinglan', name: '青岚市', university: '青岚山海大学', tagline: '山风吹散焦虑，吹不来经费', description: '山海之间的慢城市。生活成本低，生态样地近在校门外，大型仪器却往往需要跨城排队。', costOfLiving: 0.72, salaryMultiplier: 0.86, researchBonus: 0.92, networkBonus: 0.88, color: '#a8b782', specialty: '生态、野外观测', landmark: '岚山观测台' },
  { id: 'beicheng', name: '北辰市', university: '北辰国立理工大学', tagline: '指南在这里发布，咖啡在这里变凉', description: '大夏自然基金委与科技署所在地。大型装置和政策讨论丰富，出席各种论证会也是一份看不见的工作。', costOfLiving: 1.35, salaryMultiplier: 1.15, researchBonus: 1.15, networkBonus: 1.25, color: '#c5a7d8', specialty: '大型装置、国家任务', landmark: '群星科学宫' },
  { id: 'yunling', name: '云岭市', university: '云岭师范与科学大学', tagline: '星空很近，排行榜很远', description: '高原大学城。重视教学与区域问题，小团队靠共享设备和彼此补位成长；想做小众研究，需要学会解释它为何重要。', costOfLiving: 0.64, salaryMultiplier: 0.8, researchBonus: 0.9, networkBonus: 0.82, color: '#d7b77d', specialty: '天文、教育、区域科学', landmark: '云岭星台' },
];

export const fields = [
  { id: 'materials', name: '凝聚态与材料', tagline: '在不完美的晶格里寻找新秩序', description: '实验、模拟与共享仪器并重。容易获得产业关注，也容易遇到昂贵设备和排队问题。', bonuses: { knowledge: 5, insight: 3, funding: 3 } },
  { id: 'computation', name: '计算与智能科学', tagline: '代码会报错，故事未必', description: '复现、算力与方法创新的拉锯。小团队能够起步，热门赛道也格外拥挤。', bonuses: { writing: 4, insight: 5, knowledge: 2 } },
  { id: 'life', name: '生命与复杂系统', tagline: '每一次重复，都可能推翻上一次', description: '研究周期长，样本与方法决定结果可靠性。合作网络重要，统计把关同样重要。', bonuses: { knowledge: 6, integrity: 3, network: 2 } },
  { id: 'ecology', name: '生态与地球环境', tagline: '从一条河开始，理解整片土地', description: '野外观测与长期数据相伴。区域需求真实，短期论文指标却未必等待季节。', bonuses: { health: 5, insight: 4, integrity: 3 } },
  { id: 'mathematics', name: '数学与理论物理', tagline: '一块黑板，一整个宇宙', description: '设备花费较少，思考需要漫长的无人打扰。真正的突破很难按季度排期。', bonuses: { insight: 7, knowledge: 5, money: 1 } },
];

export const backgrounds = [
  { id: 'firstgen', name: '小城第一代大学生', tagline: '地图是自己一站站画出来的', description: '家里没有人能解释学术规则。你习惯认真做事，起步的人脉与积蓄较少。', bonuses: { knowledge: 6, integrity: 7, money: 1, network: -3 } },
  { id: 'workshop', name: '工坊家庭的实践派', tagline: '先看它能否运转，再问论文投哪', description: '从修理台和生产线学到的问题意识，让你擅长与技术人员沟通。', bonuses: { insight: 7, knowledge: 4, network: 2, money: 2 } },
  { id: 'bookish', name: '书香家庭的观察者', tagline: '熟悉规则，也想重新解释规则', description: '你早早认识大学生活，知道推荐信如何写，却仍需证明自己能独立提出问题。', bonuses: { writing: 6, network: 5, money: 4, insight: -2 } },
  { id: 'scholarship', name: '一路奖学金的竞赛生', tagline: '从标准答案走向没有答案', description: '擅长考试、竞赛与表达。研究要你第一次面对：努力可能暂时没有排名。', bonuses: { knowledge: 8, writing: 5, stress: 4, money: 2 } },
  { id: 'latebloomer', name: '转行入场的探索者', tagline: '绕路带来了别处的地图', description: '有过校园之外的生活，积蓄稍多、心态稳健，部分理论基础还需要补课。', bonuses: { money: 6, health: 5, insight: 5, knowledge: -3 } },
];

export const departments = [
  { id: 'physics', name: '物理与材料学院', shortName: '物材院', dean: '韩朔', focus: '装置、凝聚态、功能材料', description: '仪器平台与理论茶会并存。设备机时、研究生名额和空间分配是院务会的常驻议题。', teachingLoad: '专业课与实验课并重', policy: '代表作试点，仍保留年度论文统计' },
  { id: 'information', name: '计算与信息学院', shortName: '计信院', dean: '梁弈', focus: '智能计算、算法、系统', description: '节奏很快，学生实习机会多。会议论文、开源软件与横向项目之间需要分清价值。', teachingLoad: '大班基础课与项目课', policy: '认可顶级会议和开源贡献' },
  { id: 'life', name: '生命与环境学院', shortName: '生环院', dean: '顾遥', focus: '生命过程、生态、复杂系统', description: '实验与野外团队共享楼宇。样本、长期数据与安全培训比漂亮效果图更需要耐心。', teachingLoad: '实验安全与野外实习', policy: '强调数据留存与伦理审查' },
  { id: 'basic', name: '基础科学学部', shortName: '基础学部', dean: '沈知微', focus: '数学、理论、交叉基础', description: '研究可以很安静，公共课从不安静。改革派希望为慢研究争取稳定的时间。', teachingLoad: '全校公共课承担较多', policy: '长周期考核与教学贡献试点' },
];

export const admin = [
  { id: 'research', name: '科研处', role: '项目、成果与科研合同', npc: 'lin', description: '形式审查、项目申报、合同审阅与科研合规。把问题尽早说清，往往比截止前找关系有效。', routes: ['申请书形式预审', '研究数据与伦理咨询', '横向合同审查'] },
  { id: 'personnel', name: '人事处', role: '聘任、考核与待遇', npc: 'qiao', description: '岗位、职称与人才项目分属不同表格。纸上的支持要确认发放条件、期限与考核口径。', routes: ['聘期目标确认', '职称材料与代表作', '休假与家庭支持'] },
  { id: 'academic', name: '教务处', role: '课程、排课与教学评价', npc: 'zhou', description: '从教学大纲到课程评估，学生的反馈在这里变成材料。好的课程需要时间，也需要让制度看见。', routes: ['课程建设', '教学工作量认定', '课程冲突与助教支持'] },
  { id: 'finance', name: '财务处', role: '预算、报销与采购', npc: 'gao', description: '个人积蓄和项目经费是两本账。预算调整、设备采购与差旅报销都有各自的依据。', routes: ['预算调整咨询', '采购流程', '差旅与劳务审核'] },
  { id: 'graduate', name: '研究生院', role: '招生、培养与学位', npc: 'su', description: '名额是资源，培养是责任。学位标准、延期安排与学生权益都需要明确规则。', routes: ['培养计划', '学位与延期咨询', '研究生支持'] },
  { id: 'facilities', name: '公共平台与资产处', role: '仪器、空间与安全', npc: 'wei', description: '设备不会因为申请书写得漂亮而自动校准。技术人员的工作决定了一半实验能否开展。', routes: ['共享机时', '实验室空间', '设备维护与安全'] },
];

export const npcs = [
  { id: 'shen', name: '沈知微', title: '教授 · 基础学部', role: '导师 / 教授', influence: 68, archetype: '慢研究的守夜人', description: '有一篇十年前的工作仍被反复讨论。她会批你的推导，也会替年轻人争取不被打断的一个学期。', quote: '先说你不懂什么。这个比汇报你懂什么难。', values: '问题质量、可靠性、独立性', city: 'dajiang', relationship: 34 },
  { id: 'han', name: '韩朔', title: '院长 · 物材院', role: '院长 / 院系领导', influence: 86, archetype: '资源的分配者', description: '既要向上争取预算，又要向下解释名额。他不总是公平，也不总是有选择。', quote: '指标我也不喜欢，但今年的楼要先保下来。', values: '院系排名、团队稳定、可见成果', city: 'dajiang', relationship: 16 },
  { id: 'tang', name: '唐砚', title: '青年副教授 · 计信院', role: '同事 / 竞争者', archetype: '与你并肩冲线的人', description: '和你竞争一个名额，也愿意共享一段关键代码。竞争与合作，在同一个人身上同时成立。', quote: '名额只剩一个，不代表数据就不能互相核对。', values: '效率、公开规则、同行认可', city: 'shenhe', relationship: 24 },
  { id: 'xu', name: '许未央', title: '讲师 · 通识中心', role: '同事 / 讲师 / 教学伙伴', influence: 38, archetype: '教室里的建设者', description: '做出了全校口碑最好的基础课，却常在科研统计里排在最后。她正在争取课程贡献进入考核。', quote: '学生不是用来替我们的忙碌买单的。', values: '教学、公平、具体的人', city: 'yunling', relationship: 28 },
  { id: 'wei', name: '魏鸣', title: '高级工程师 · 公共平台', role: '同事 / 技术伙伴', influence: 43, archetype: '知道机器脾气的人', description: '不在论文末尾也能做出关键贡献。他知道噪声从哪里来，也知道谁总在夜里乱动仪器。', quote: '仪器不认帽子，校准记录可认日期。', values: '安全、方法、贡献署名', city: 'gaohu', relationship: 20 },
  { id: 'su', name: '苏禾', title: '博士生 · 生环院', role: '学生代表', archetype: '还愿意追问的人', description: '擅长实验记录，也敢问一句“为什么”。她关心署名，更关心几年后还能否喜欢自己的研究。', quote: '这个异常值，能不能先别删？', values: '培养质量、数据、边界', city: 'dajiang', relationship: 18 },
  { id: 'lin', name: '林谨', title: '项目主管 · 科研处', role: '校内行政', archetype: '把规则讲明白的人', description: '处理过太多截止前一小时的求助。她愿意帮你做预审，但不会替你补一个不存在的伦理批件。', quote: '今天十分钟能讲清，别等到最后十分钟。', values: '程序透明、材料准确', city: 'beicheng', relationship: 15 },
  { id: 'qiao', name: '乔澜', title: '聘任专员 · 人事处', role: '校内行政', archetype: '合同的逐字阅读者', description: '对“原则上”“视情况”保持职业警惕。她既执行考核，也知道文字含混会怎样伤害人。', quote: '把支持写进附件，把考核口径写进正文。', values: '可执行的承诺、明确边界', city: 'dajiang', relationship: 15 },
  { id: 'zhou', name: '周洵', title: '课程主管 · 教务处', role: '校内行政', archetype: '课表的协调者', description: '每天调和几十个时间冲突。愿意试点课程改革，但需要你把学生受益说成可验证的改变。', quote: '少写一点“全面提升”，多说一次学生具体会做什么。', values: '学生体验、稳定排课、证据', city: 'yunling', relationship: 15 },
  { id: 'gao', name: '高珂', title: '会计师 · 财务处', role: '校内行政', archetype: '两本账的看守者', description: '她不是预算的敌人。她反对用个人垫付来掩盖项目管理问题，也反对把公款当成个人奖励。', quote: '经费可以调整，研究记录不能补造。', values: '真实、凭据、预算边界', city: 'dajiang', relationship: 15 },
  { id: 'liang', name: '梁弈', title: '教授 · 学术委员会', role: '教授 / 同行评议者', influence: 73, archetype: '不肯只看数字的人', description: '曾追过热门方向，也为一次轻率背书后悔。如今倾向读完代表作，再开口评价。', quote: '你说三篇，我先看最重要的那一篇。', values: '代表作、学术自治、纠错', city: 'beicheng', relationship: 12 },
  { id: 'gu', name: '顾遥', title: '企业研发主管 · 星桥科技', role: '产业伙伴', archetype: '想把成果真正做出来的人', description: '愿意为长期验证付钱，也必须对交付负责。她尊重学术自由，但不接受把演示视频当成产品。', quote: '允许失败，不过要告诉我失败究竟意味着什么。', values: '可重复、交付、清晰合同', city: 'shenhe', relationship: 12 },
];

export const conferences = [
  { id: 'river', name: '澄江青年科学论坛', city: 'dajiang', tier: 1, minRank: 0, cost: 0.15, theme: '第一次把自己的问题讲给同行听', description: '小规模、低门槛，海报前的认真讨论常比主会场的热闹更有价值。', effects: { knowledge: 3, network: 4, writing: 2, stress: 2 } },
  { id: 'gaohu', name: '高沪前沿交叉大会', city: 'gaohu', tier: 2, minRank: 1, cost: 0.6, theme: '大报告之后，真正的交流在走廊', description: '热点齐聚，也有昂贵的注册费。能遇到新合作者，亦可能只带回一袋材料。', effects: { insight: 4, network: 6, reputation: 2, stress: 4 } },
  { id: 'methods', name: '青岚可重复研究工作坊', city: 'qinglan', tier: 1, minRank: 0, cost: 0.25, theme: '拿出方法，接受检查', description: '不比引用，比谁能让另一张桌子的人把结果重现出来。', effects: { knowledge: 5, integrity: 4, writing: 2 } },
  { id: 'industry', name: '深河产学研连接周', city: 'shenhe', tier: 2, minRank: 2, cost: 0.5, theme: '模型与原型，谁来承担中间那一步', description: '企业、学校与地方科技署坐在一起。清晰的边界能带来真正的合作。', effects: { network: 6, insight: 3, reputation: 2, stress: 3 } },
  { id: 'summit', name: '北辰科学战略圆桌', city: 'beicheng', tier: 3, minRank: 4, cost: 0.8, theme: '决定什么问题值得十年', description: '有机会提出长期研究议程。也要警惕把漂亮口号当作科学问题。', effects: { reputation: 5, network: 7, insight: 3, stress: 5 } },
  { id: 'teaching', name: '云岭大学教学与育人年会', city: 'yunling', tier: 1, minRank: 1, cost: 0.2, theme: '把课堂里真实的变化带出来', description: '课程设计、助教支持与学生发展。这里的掌声属于能被别的老师复用的方法。', effects: { writing: 3, network: 4, reputation: 2, integrity: 2 } },
];

export const handbook = [
  { id: 'start', title: '你在大夏的第一天', category: '玩法', text: '每一回合是一季，行动消耗时间并改变研究、生活与关系。读完事件的代价再选择：论文、健康、同事与存款都需要维护。毕业、晋升、项目与人才称号各有条件，城市决定生活成本和机会。没有任何一项数值能代替其他全部数值。' },
  { id: 'career', title: '学位、岗位与帽子', category: '职业', text: '本科生 → 硕士研究生 → 博士研究生 → 博士后，是游戏简化的学习和研究阶段。助教、讲师、副教授、教授是岗位阶梯；现实并非每个人必须逐级经过。初级职称的助教、课程里的研究生助教和部分高校的助理教授，含义也不同。优青、杰青是独立的人才项目轨道，院士是学术荣誉轨道。教授可能没有帽子，有帽子也不等于自动完成岗位考核。' },
  { id: 'money', title: '个人钱包与项目经费', category: '资源', text: '金额单位为万元，所有薪资、补贴、住房和经费数值均为架空游戏平衡。个人钱包用于生活、差旅垫付与迁居；项目经费用于研究。经费不是个人工资，不能直接拿来填个人钱包。城市的高薪可能同时伴随高住房成本。' },
  { id: 'hats', title: '优青、杰青与院士的差别', category: '制度', text: '大夏保留优青、杰青的民间叫法：前者提高早期独立研究支持，后者偏向领军研究与团队资源，院士增加声望与公共责任。现实参照中，国家自然科学基金原优青、杰青已分别更名为青年科学基金 B 类、A 类；项目资助不等于固定个人年薪。高校支持可能包含岗位薪酬、科研启动、住房和团队，因单位和合同而异。院士是最高学术称号和终身荣誉，并非普通行政级别。' },
  { id: 'fouronly', title: '四唯与代表作', category: '制度', text: '唯论文、唯职称、唯学历、唯奖项，是把复杂学术劳动压成四张表的冲动。游戏里它们会影响机会，但基础积累、可靠方法、育人与健康也影响长期发展。破除四唯不等于没有评价：好的替代需要明确标准、同行阅读与申诉渠道。' },
  { id: 'teaching', title: '教学不是背景任务', category: '教学', text: '备课、答疑、课程建设和指导学生，都要花真实的时间。高质量教学能带来声誉与学生成长，临时堆课也会挤占研究。遇到排课与考核问题，可通过院系和教务处协调；把贡献记录下来，才有机会让它进入正式评价。' },
  { id: 'departments', title: '院系是一群人组成的制度', category: '院系', text: '院系分配空间、机时、研究生名额与部分教学任务。同事既是合作者也是竞争者；资源有限时，不是每个冲突都能双赢。参与公开规则、互相审稿、共享设备或争取教学认定，都可能改变局部环境。关系不能替代规则，规则也需要人维护。' },
  { id: 'admin', title: '找对行政部门', category: '行政', text: '科研处负责项目与科研合同；人事处负责聘任、职称与待遇；教务处负责课程和工作量；财务处负责预算与凭据；研究生院负责培养和学位；平台与资产处负责仪器、空间与安全。提前沟通会有成本，也会减少返工。行政人员有自己的职责与限制。' },
  { id: 'network', title: '合作、人情与权学交易', category: '人际', text: '正常的学术交流、分工与推荐能节省很多重复劳动。没有贡献的署名、互换评价、隐瞒利益冲突与私下承诺名额，会积累诚信损失和风险。短期收益可能真实存在，后来承担后果的人也未必只有做选择的你。' },
  { id: 'research', title: '让研究变成可检验的成果', category: '科研', text: '知识提供基础，洞见帮助提出问题，写作把证据变成同行能读的工作。发表需要耐心：抢热点容易更快，做复现可能较慢，但研究可靠性会影响项目、声誉与长期结局。负结果并非没有价值，关键是回答了什么。' },
  { id: 'health', title: '可持续的研究生活', category: '生活', text: '压力高时，休息、与同事交流、调整课题规模都有价值。健康不是用完就会自动刷新的一次性资源；一条很陡的上升曲线，不一定能维持到下一个学期。退出某次竞争，也可能是为了继续研究。' },
  { id: 'fiction', title: '架空说明与制作署名', category: '关于', text: '本作由 JF_Li@FD & Sol 创作。大夏、城市、学校、机构、人物与事件均为虚构；讽刺面向激励与制度，不对应具体个人或单位。现实制度只用于帮助区分岗位、项目与荣誉，数值不构成现实待遇承诺。制度参照见随附 SOURCES.md。' },
];

const choice = (label, text, effects) => ({ label, text, result: text, effects });
const event = (id, title, text, category, minRank, maxRank, options, weight = 1) => ({
  id, title, text, category, minRank, maxRank, weight,
  options: options.map((option, index) => ({ id: `${id}_${index}`, ...option })),
});

export const events = [
  event('first_lab', '实验室的第一把钥匙', '导师递来门禁卡，师兄递来一摞没有目录的旧笔记。你今晚准备从哪里开始？', '学业', 0, 1, [
    choice('先整理方法与安全记录', '你没有立刻做出结果，却弄清了哪些步骤不能省。魏鸣开始记住这个会先问安全规则的新面孔。', { knowledge: 6, integrity: 3, network: 1, stress: 1 }),
    choice('跟着师兄尽快上手', '你摸清了一条能产出结果的路径，也记下几处暂时说不清的假设。', { knowledge: 4, writing: 2, network: 3, stress: 2 }),
    choice('先读懂课题的问题', '几篇难读的论文占满整晚。进度看起来慢，但你第一次知道这套实验究竟想回答什么。', { insight: 6, knowledge: 3, stress: 3 }),
  ], 2),
  event('scholarship', '奖学金只差一分', '奖学金排序把论文、竞赛、活动折成一张表。你在候补线下一位，辅导员说还有一项材料可以补。', '四唯', 0, 2, [
    choice('核对真实材料并申诉', '一次遗漏的志愿教学被补计。结果未必翻转，但你的贡献留下了准确记录。', { writing: 2, integrity: 3, stress: 2, reputation: 2 }),
    choice('参加短期竞赛补强履历', '你拿到了一个可计分的成果，也放下了半个月没有明确终点的研究。', { reputation: 4, writing: 3, insight: -2, stress: 5 }),
    choice('接受结果，申请助研岗位', '钱包得到一点缓解，时间也更紧了。实验室里有人愿意带你做一项扎实的小工作。', { money: 0.2, knowledge: 3, network: 2, stress: 3 }),
  ]),
  event('admission', '保研推荐信', '推荐名额有限。老师愿意写推荐信，但希望你先承担一项与自己课题关系不大的整理工作。', '学业', 0, 1, [
    choice('明确工时与贡献再答应', '谈清边界花了些勇气。你得到一次合作机会，自己的学习计划也有了保护。', { network: 4, writing: 3, integrity: 2, stress: 2 }),
    choice('全力承担，争取信任', '材料完成得漂亮，老师的推荐更具体了。只是自己的研究问题又往后排了一格。', { network: 6, reputation: 3, insight: -2, stress: 6 }),
    choice('请真正了解自己的人推荐', '这封信的抬头不显赫，却把你的独立思考写得很清楚。', { integrity: 3, insight: 3, writing: 2, network: -1 }),
  ]),
  event('topic_fork', '两个题目，一条时间线', '一个题目能复用现成方法，另一个可能失败却让你睡前一直想着。导师说：选择之后，也要承担进度。', '科研', 0, 3, [
    choice('从稳妥问题开始', '你学会把一个小问题做完整。它不是惊人的开场，但让下一步有了站稳的地方。', { knowledge: 5, writing: 4, insight: 1, stress: -2 }),
    choice('给高风险问题一个学期', '不确定性变成了每天的同伴。几个失败之后，你终于排除了一个被所有人默认的解释。', { insight: 8, knowledge: 3, stress: 7 }),
    choice('拆成一个可验证的子问题', '你缩小了豪言，也缩短了反馈周期。导师在白板上划掉了申请书里三个过大的词。', { insight: 5, writing: 4, knowledge: 3, stress: 2 }),
  ], 2),
  event('late_night', '凌晨两点的亮灯', '隔壁实验室又亮了一整夜。群里有人发出仪器屏幕的照片，你已经关上电脑，却突然觉得自己落后了。', '生活', 0, 7, [
    choice('按计划睡觉', '第二天的问题并没有因为你睡了觉而变简单，但你终于有力气把它想完。', { health: 7, stress: -6, insight: 2 }),
    choice('再补一个分析', '你赶出了几页图，也错过了身体发出的信号。进度条增长得比睡眠时间快。', { knowledge: 3, writing: 4, health: -5, stress: 5 }),
    choice('约同事核对真实进度', '对方昨夜是在修坏掉的泵。一次坦白交流让彼此都松了口气，也分享了一个处理方法。', { network: 4, knowledge: 2, stress: -4 }),
  ], 2),
  event('negative_result', '漂亮假说没有成立', '重复实验三次，结果始终不支持原来的解释。截止日期在逼近，幻灯片还停留在那个最漂亮的假说。', '科研', 0, 7, [
    choice('整理负结果与适用边界', '故事变小了，证据变硬了。这项工作暂时没有耀眼标题，却替后来者省下一条弯路。', { integrity: 6, knowledge: 6, writing: 2, stress: 3 }),
    choice('改换有希望的参数继续', '你没有否认失败，也不打算现在结束。新的探索增加了机会，同时需要更多时间。', { insight: 5, knowledge: 3, stress: 6, funding: -0.5 }),
    choice('把不支持的结果藏进附录', '正文的故事顺畅了许多。你知道读者可能会误解证据，审稿时也更怕遇到那个关键问题。', { writing: 6, reputation: 2, integrity: -7, risk: 7, stress: 4 }),
  ], 2),
  event('first_seminar', '第一次组会主讲', '你准备了四十页幻灯片。沈知微只问：“如果只能保留三页，你要说哪三页？”', '学业', 0, 2, [
    choice('重写成问题、证据、边界', '删掉大半内容比写出来更难，但这一次，大家终于知道应该讨论什么。', { writing: 6, insight: 4, reputation: 2, stress: 2 }),
    choice('保留细节，证明做了很多', '工作量被看见了，真正的问题仍藏在第十八页。你下次还需要把主线讲清。', { knowledge: 3, writing: 2, stress: 3 }),
    choice('承认卡住，请大家找漏洞', '短暂的安静之后，同学指出了一个变量。你失去了一次完美表演，获得了一个能做的下一步。', { insight: 5, network: 4, integrity: 2, stress: -2 }),
  ]),
  event('supervisor_trip', '导师的行李与海报', '去高沪参会前，导师问你能否帮忙整理会务材料。你也有一张海报要准备，两件事恰好占满同一个晚上。', '人际', 1, 3, [
    choice('协商分工，留出海报时间', '师兄接走了一半会务工作。你欠下一句谢谢，也守住了自己上台交流的机会。', { network: 3, writing: 4, stress: 2 }),
    choice('先把导师的事办妥', '行程没有出错，导师记住了你的可靠。海报上的小字却多到连自己也读不完。', { network: 5, reputation: 1, writing: -2, stress: 6 }),
    choice('解释冲突，专注自己的报告', '导师并不高兴，但一场扎实的讨论证明你并非只是推脱。关系需要以后慢慢修复。', { insight: 4, writing: 5, network: -3, stress: 3 }),
  ]),
  event('author_order', '作者顺序的括号', '稿件快完成了，两个人都认为自己应是第一作者。贡献记录比回忆更零散。', '合作', 1, 7, [
    choice('按记录重新梳理贡献', '一次不舒服的会议把工作说清了。排序仍有人不满意，但以后大家会更早讨论分工。', { integrity: 5, network: 2, writing: 2, stress: 5 }),
    choice('协商共同一作及具体说明', '双方接受了可核查的贡献说明。下一轮合作从一张明确的分工表开始。', { network: 5, integrity: 3, writing: 3, stress: 2 }),
    choice('让职位最高的人决定', '争论迅速结束了，真正的贡献没有被完整讨论。便利有时只是把矛盾推给下一篇论文。', { network: 2, reputation: 3, integrity: -4, risk: 3, stress: 2 }),
  ], 2),
  event('data_backup', '坏掉的移动硬盘', '一块旧硬盘开始发出不祥的声音。你有些原始记录只留在里面，眼前却还有一份催得很急的报告。', '科研', 0, 7, [
    choice('立刻备份并完善数据索引', '报告晚了一点，数据保住了。几个看似重复的文件也终于有了清楚的版本号。', { integrity: 4, knowledge: 3, stress: -2, money: -0.08 }),
    choice('先赶报告，随后处理', '报告按时交了。你把硬盘问题写进待办清单，它也继续占据着心里一个角落。', { writing: 4, stress: 4, risk: 3 }),
    choice('找平台技术员共同恢复', '魏鸣教你建立了共享备份流程。你花掉一点经费，团队少了许多重复劳动。', { network: 3, knowledge: 4, integrity: 3, funding: -0.2 }),
  ]),
  event('graduate_delay', '论文还差最后一块证据', '学位论文接近完成，一项关键验证却没有通过。延期意味着新的生活支出，勉强提交意味着更多不确定。', '学业', 1, 2, [
    choice('申请短期延期与支持', '研究生院说明了可用的支持。日历被改写，你也终于不用再把每个失败解释成成功的前奏。', { knowledge: 5, integrity: 5, money: -0.2, stress: 4 }),
    choice('缩小结论，按真实工作答辩', '论文标题变得克制，论证反而清楚了。你需要接受：完整不等于宏大。', { writing: 6, integrity: 4, reputation: 1, stress: -2 }),
    choice('用未经充分验证的图顶上', '材料暂时齐了，证据却没有随排版自动补全。未来每次有人索取原始数据，你都会紧张。', { writing: 4, reputation: 2, integrity: -10, risk: 12, stress: 6 }),
  ]),
  event('postdoc_offer', '两份博后邀请', '一边是名字响亮但分工模糊的大团队，一边是资源有限、愿意支持独立问题的新组。朋友说两条路都有人走通。', '职业', 2, 3, [
    choice('谈清独立课题与署名边界', '几封邮件换来一份更明确的计划。你没有消除不确定，只是知道该向谁争取什么。', { writing: 3, network: 4, integrity: 2, stress: 2 }),
    choice('借大平台学习协作', '你接触到过去够不到的仪器与同行。独立性需要额外争取，但学习机会是真实的。', { knowledge: 6, network: 5, insight: -1, stress: 5 }),
    choice('用小团队换独立空间', '预算和机时都要精打细算。属于自己的问题终于有了连续几个月的安静时间。', { insight: 7, knowledge: 3, funding: -0.5, stress: 3 }),
  ]),
  event('reviewer_two', '审稿人二号的长信', '一位审稿人要求增加五组实验，其中两组与你的问题关系不大。编辑给了四周。', '发表', 1, 7, [
    choice('逐条回应并解释研究边界', '你补上关键验证，对无关要求提出证据充分的说明。回信不再像辩解，而像一次严肃讨论。', { writing: 7, knowledge: 3, stress: 4 }),
    choice('尽量全部补齐', '结果更充分了，经费和体力也被榨掉一层。你获得了一套可复用的方法。', { knowledge: 6, writing: 4, funding: -0.8, health: -3, stress: 6 }),
    choice('转投更适合的期刊', '你接受重新等待。目标读者更准确，重新组织论文也暴露了真正没讲明白的地方。', { writing: 4, insight: 3, stress: 2, reputation: -1 }),
  ], 2),
  event('preprint', '预印本的时间戳', '隔壁团队也在做相近问题。你的工作已基本完整，但一处统计检验还没核查。', '发表', 1, 7, [
    choice('核查后公开预印本与材料', '时间戳来得稍晚，工作却经得起外部检查。一位远方同行发来了一条有用的反馈。', { integrity: 4, writing: 4, network: 3, stress: 3 }),
    choice('明确标注局限，先公开讨论', '你没有假装工作已经定稿。开放讨论带来建议，也要求你持续维护版本和回应问题。', { writing: 3, network: 5, integrity: 2, stress: 4 }),
    choice('抢先放出夸张结论', '关注度一下子上来了。很快也有人盯住那处未经核实的检验，你需要付出更多解释。', { reputation: 6, network: 2, integrity: -8, risk: 9, stress: 6 }),
  ]),
  event('hot_topic', '所有申请书都出现的新词', '热门方向突然出现在每一场报告里。你的老问题可以沾一点边，也可能被包装得面目全非。', '四唯', 1, 7, [
    choice('只保留真实的交叉部分', '标题没有最热闹，科学问题却经得起追问。一位同行看到了你能提供的独特视角。', { insight: 4, writing: 3, integrity: 3, network: 2 }),
    choice('投入时间系统转向', '你重新做起了读书笔记。短期产出放慢，新的问题空间也确实出现了。', { knowledge: 7, insight: 4, writing: -2, stress: 5 }),
    choice('换包装，保持内容不变', '标题很像风口，方法仍是旧方法。有人感兴趣，也有人追问你究竟解决了哪一项新问题。', { reputation: 3, writing: 4, integrity: -5, risk: 5 }),
  ]),
  event('replication', '复现不了的明星结果', '你们照着一篇著名论文重复了很久。结果始终不一致，对方终于回复：可能是设备条件不同。', '科研', 1, 7, [
    choice('共享完整协议，邀请联合核查', '双方发现一个没有写进方法的小步骤。合作没有制造戏剧性胜利，却补上了别人也会踩的坑。', { knowledge: 7, network: 4, integrity: 3, funding: -0.3 }),
    choice('发表克制的复现研究', '你把适用条件和不确定性写得清楚。它未必成为热点，但会成为后来实验者认真阅读的材料。', { writing: 5, integrity: 5, reputation: 3, stress: 4 }),
    choice('停止追查，回到更易发表的题', '你保住了一些时间。未解决的问题留在笔记里，等有条件时再回来。', { stress: -3, writing: 3, insight: -1 }),
  ]),
  event('travel_receipt', '丢失的车票与差旅截止', '参会回来，一项真实支出的凭据不符合报销要求。财务处说可以先咨询补充说明，月底很快就到。', '行政', 0, 7, [
    choice('咨询真实支出的补充流程', '高珂列清了需要的材料。多花了一个下午，你也学会下次出发前确认差旅规则。', { money: 0.05, integrity: 3, adminBurden: 2, network: 1 }),
    choice('自己承担，及时复盘', '损失不大，却让你明白每次垫付都要留下记录。下次团队出差有了共同清单。', { money: -0.08, integrity: 2, adminBurden: -2, knowledge: 1 }),
    choice('借不相干的凭据凑齐', '金额看似很小，记录却从此不再真实。便利没有改变这笔支出的性质。', { money: 0.08, integrity: -7, risk: 9, stress: 3 }),
  ]),
  event('conference_corridor', '报告厅外的十分钟', '你正准备听一场相关报告，一位前辈说愿意带你认识项目专家，但只有现在有空。', '会议', 0, 7, [
    choice('简短介绍，约后续学术交流', '你没有把十分钟变成申请推销。对方记住了一个具体问题，也给出了一篇值得读的文献。', { network: 5, insight: 2, integrity: 1 }),
    choice('留下听报告，认真提问', '一个方法细节解决了卡住多日的问题。报告人会后愿意再多聊几句。', { knowledge: 5, insight: 4, network: 2 }),
    choice('全程随行，扩大熟人圈', '手机里多了许多联系人。你还需要通过扎实的工作，让名字变成下一次真正的对话。', { network: 7, reputation: 2, knowledge: -1, stress: 3 }),
  ], 2),
  event('poster_edge', '海报区最边上的位置', '你的海报被安排在消防通道旁。走过的人很多，停下的人很少，一名学生却认真读到了最后。', '会议', 0, 7, [
    choice('和这名学生深入讨论', '她的问题指出了你忽略的一种解释。一个不起眼的位置，带来了一次值得记住的讨论。', { insight: 5, knowledge: 3, network: 2 }),
    choice('主动邀请相关同行过来', '开口的第一句有点生涩，后面的讨论却越来越具体。你学会用两分钟说明工作。', { writing: 5, network: 5, stress: 2 }),
    choice('拍照留档，去听其他报告', '你没有勉强这场展示。别人的报告也带来新线索，海报下次还可以改得更清楚。', { knowledge: 4, writing: 2, stress: -2 }),
  ]),
  event('family_call', '家里问你何时稳定', '电话那头问：“都读这么久了，什么时候有个正式工作？”你看着桌上的稿件，不知从哪一项解释起。', '生活', 0, 5, [
    choice('讲清阶段、风险与备选路', '没有人突然完全理解学术，但你们开始讨论具体的期限和支持。把话说清也帮你看见自己的边界。', { stress: -5, health: 3, writing: 1 }),
    choice('只说一切顺利', '这通电话很快结束。你暂时省掉解释，却继续独自承担那份不确定。', { stress: 4, reputation: 1 }),
    choice('周末回去，先一起吃顿饭', '车票花掉一点积蓄。饭桌没有解决聘任问题，却提醒你生活并不只剩下聘任问题。', { money: -0.1, health: 6, stress: -7, network: 1 }),
  ]),
  event('open_source', '那段没人给学分的代码', '你写的小工具已经被不少人使用。维护问题不断增加，考核表里却没有它对应的一格。', '四唯', 1, 7, [
    choice('补文档、测试与引用说明', '工具更容易复用，贡献也更容易被准确记录。过程很花时间，却留下了实实在在的基础设施。', { knowledge: 5, reputation: 4, integrity: 3, stress: 3 }),
    choice('联合用户写一篇方法论文', '你把共同问题整理成可检验的方法。一次合作让维护劳动有了正式的学术表达。', { writing: 6, network: 4, insight: 2 }),
    choice('冻结维护，优先完成考核', '你清楚说明了支持范围。用户会失望，但无限制的义务也无法一直由一个人承担。', { writing: 3, stress: -5, reputation: -1 }),
  ]),
  event('shared_failure', '唐砚也被拒稿了', '与你竞争名额的同事，在茶水间说起刚收到的拒稿信。你突然发现，对方的日程表也并不总是胜利。', '同事', 2, 7, [
    choice('互相读稿，交换具体意见', '你们仍然竞争同一个机会，也确实帮助彼此把工作做得更好。', { network: 6, writing: 4, stress: -3 }),
    choice('听他聊完，守住私人边界', '一次没有建议的倾听也有价值。下午回到桌前时，两个人都没那么孤立了。', { network: 4, health: 2, stress: -4 }),
    choice('趁机加速自己的申请', '机会仍然有限，你决定继续冲刺。多写的几页材料没有让那个茶水间变得更轻松。', { writing: 5, reputation: 2, stress: 4, network: -2 }),
  ]),
  event('rent_renewal', '房东的新合同', '房租续约上涨，学校的人才公寓还在排队。迁居更远意味着更长的通勤。', '生活', 3, 7, [
    choice('调整预算，保持住处稳定', '你用积蓄买下少一点折腾的时间。稳定有价格，能否长期承担仍需盘算。', { money: -0.4, stress: -3, health: 2 }),
    choice('搬远一些，保护现金流', '存款缓了一口气，通勤却吞掉了几个原本可以散步的傍晚。', { money: 0.15, health: -3, stress: 4 }),
    choice('向人事处核实住房支持', '承诺中的支持有明确的等待条件。乔澜帮你核对材料，你也留出一个不依赖补贴的预算。', { money: 0.1, network: 2, adminBurden: 2, stress: -1 }),
  ]),
  event('quiet_walk', '江边没有待办清单', '你难得早一点离开实验室。江边有人跑步，有人牵狗，手机里还有三条未读消息。', '生活', 0, 7, [
    choice('把手机放进口袋', '没有立刻出现灵感，只有呼吸慢下来。第二天你能更清楚地区分急事和噪声。', { health: 7, stress: -7 }),
    choice('边走边理清一个问题', '走到第二座桥时，你发现卡住自己的不是方程，而是一个从没检查的假设。', { insight: 5, health: 3, stress: -3 }),
    choice('叫上同事一起走', '一路从课题聊到食堂。几句没目的的话，让下一次合作少了些客气。', { network: 5, health: 4, stress: -4 }),
  ], 2),
];

events.push(
  event('first_course', '第一门独立主讲的课', '教务处把一门基础课交给了你。去年学生评价两极分化，距离开课只有三周。', '教学', 4, 7, [
    choice('围绕学习目标重做课程', '你删去堆砌的章节，增加了练习与反馈。准备很耗时，课堂里却开始出现真正的提问。', { teachingQuality: 8, studentSatisfaction: 5, writing: 2, stress: 5 }),
    choice('与许未央共备一部分', '你带来前沿案例，她帮你安排学习节奏。第一份教学设计从来不是一个人的天赋。', { teachingQuality: 6, network: 5, studentSatisfaction: 4, stress: 2 }),
    choice('先沿用旧讲义，逐周改进', '课程按时启动，旧材料的漏洞在课堂上陆续暴露。你决定每周至少修正一个具体问题。', { teachingQuality: 3, studentSatisfaction: 1, writing: 3, stress: 1 }),
  ], 2),
  event('ta_overload', '助教的工作量超了', '课程助教苏禾已经连续两周在凌晨回复学生消息。她的课题也需要推进，但大班课程离不开这份支持。', '教学', 1, 7, [
    choice('设答疑时段，缩减无效作业', '学生仍能获得帮助，助教终于知道什么时候可以下线。你也花时间重做了评价方案。', { teachingQuality: 5, studentSatisfaction: 4, integrity: 3, stress: 3 }),
    choice('向院系申请更多助教工时', '申请需要说明真实负担。公开的数据让问题从个人忍耐变成院系应当讨论的资源。', { deptSupport: 4, teachingQuality: 3, adminBurden: 3, network: 2 }),
    choice('暂时自己接手答疑', '学生和助教都松了一口气，你的晚间研究时间却迅速减少。这个办法还需要一个结束日期。', { studentSatisfaction: 7, integrity: 2, stress: 6, health: -3, teachingQuality: 3 }),
  ]),
  event('course_conflict', '课表撞上了项目答辩', '教务处发来的排课表，恰好撞上基金答辩。两件事都不允许临时缺席。', '行政', 4, 7, [
    choice('提前协调调课并补足支持', '周洵帮忙找到空教室。学生及时收到安排，你也学会把重要日期更早报备。', { adminBurden: 2, teachingCredits: 2, studentSatisfaction: 3, network: 1 }),
    choice('请同事代课，之后换班', '许未央接下一节课。互助让两件事都能完成，未来你也需要认真偿还这份时间。', { network: 5, teachingCredits: 1, stress: 2 }),
    choice('保住课堂，申请远程答辩', '答辩组织方未必喜欢这个安排，但你没有让学生在教室等一位不会出现的老师。', { studentSatisfaction: 5, integrity: 2, reputation: -1, stress: 4 }),
  ]),
  event('student_review', '匿名评价里的刺', '一份课程评价写道：“老师讲得很深，可我们不知道怎样开始。”另有几条评论只是抱怨给分不够高。', '教学', 4, 7, [
    choice('分类分析反馈，增加入门支架', '你保留标准，补上例题和反馈。评价不再只是一个让人害怕的分数。', { teachingQuality: 7, studentSatisfaction: 5, insight: 2, stress: 2 }),
    choice('与学生代表开一次小会', '几位沉默的学生说出了不同困难。你无法满足所有人，但下一次调整有了更具体的依据。', { teachingQuality: 5, studentSatisfaction: 6, network: 2, stress: 2 }),
    choice('放宽评分换一个好看均分', '争论暂时少了，课程难点却没有消失。下一届学生仍会在同一处卡住。', { studentSatisfaction: 5, reputation: 2, teachingQuality: -4, integrity: -4 }),
  ]),
  event('plagiarism_class', '两份几乎一样的作业', '两位学生的代码包含相同的罕见错误。一位平时认真，另一位刚经历家庭变故。课程规则写得很清楚。', '教学', 3, 7, [
    choice('分别沟通，按规则处理并给补学路', '你既核实事实，也提供重新学习的机会。纪律与支持没有必要只选一个。', { integrity: 5, teachingQuality: 5, studentSatisfaction: 2, stress: 4 }),
    choice('组织全班学术规范练习', '你处理了个案，也承认先前教学没有把引用与协作边界讲清。', { teachingQuality: 6, integrity: 3, teachingCredits: 2, stress: 3 }),
    choice('私下提醒，避免任何记录', '这次风波轻轻过去。认真完成作业的学生却可能永远不知道规则是否对每个人一样。', { studentSatisfaction: 1, stress: -2, integrity: -5, risk: 4 }),
  ]),
  event('teaching_award', '教学奖的材料季', '许未央做了三年课程改革，想申请教学奖。她需要有人帮忙把真实变化整理成证据。', '同事', 3, 7, [
    choice('用学生作品与前后数据做支撑', '材料没有夸张口号，变化却看得见。你也学到如何评价一门课有没有教会人。', { teachingQuality: 5, writing: 4, network: 5, stress: 2 }),
    choice('帮她争取共同课程建设时间', '院系愿意给一次试点。真正的支持不是多一块牌子，而是下一学期少一些挤占。', { deptSupport: 5, network: 5, adminBurden: 2, teachingCredits: 3 }),
    choice('婉拒材料工作，但共享已有资源', '你守住了自己的时间，也给出能够兑现的帮助。合作的边界比勉强答应更清楚。', { network: 2, teachingQuality: 2, stress: -2 }),
  ]),
  event('course_accreditation', '课程认证的材料山', '学院要做课程认证。通知附件有十九个模板，最急的一份甚至没有注明负责人。', '教学', 4, 7, [
    choice('先确认标准与责任分工', '几轮沟通砍掉了重复填报。材料量仍不少，但至少每项证据有了对应的目的。', { adminBurden: -4, deptSupport: 4, teachingQuality: 2, stress: 2 }),
    choice('借机整理课程证据库', '这一次准备很累，之后的课程改进和申报却有了共同底座。', { adminBurden: 3, teachingQuality: 6, writing: 3, stress: 4 }),
    choice('优先把所有表格填满', '页面迅速齐整起来，部分表格却没能描述实际教学。下次抽查还会回来找你。', { writing: 3, adminBurden: 5, integrity: -3, risk: 3, stress: 3 }),
  ]),
  event('student_discovery', '学生问了一个“笨问题”', '本科生在课后问：“为什么这个边界条件一定是零？”你正想给出标准答案，忽然发现例题中没有解释。', '教学', 4, 7, [
    choice('一起检查假设，允许自己暂停', '你在下一节课带来了修正。学生记住的不只是答案，还有老师也会认真纠错。', { insight: 6, teachingQuality: 5, studentSatisfaction: 3, integrity: 2 }),
    choice('把问题改成课堂探索任务', '几组学生给出不同条件下的结果。一个疑问变成了一堂更有结构的课。', { teachingQuality: 7, studentSatisfaction: 4, insight: 3, stress: 2 }),
    choice('先按教材讲，课后自己核查', '课堂节奏保持了下来。你在笔记里留下一枚醒目的问号，提醒自己下次给出完整解释。', { knowledge: 3, teachingQuality: 2, integrity: 1 }),
  ]),
  event('counselling', '学生说自己做不下去了', '一名研究生很久没有进展，终于承认自己害怕走进实验室。组会之外，需要有一次更认真也更尊重边界的谈话。', '育人', 3, 7, [
    choice('调整近期目标，联系专业支持', '你们把任务拆小，并确认可获得的支持渠道。论文没有立刻增加，学生不再独自面对问题。', { integrity: 5, teachingQuality: 4, studentSatisfaction: 7, stress: 2 }),
    choice('共同考虑休整或转方向', '未来的路需要学生参与决定。你承担了一些进度损失，也让选择重新回到当事人手里。', { insight: 2, integrity: 5, studentSatisfaction: 5, projectProgress: -3, stress: 2 }),
    choice('减少施压，约定定期短沟通', '不再追问每天做了多少，改为每周讨论卡在哪里。问题仍在，但对话开始恢复。', { teachingQuality: 3, network: 2, studentSatisfaction: 4, stress: -1 }),
  ]),
  event('dept_space', '实验室少了二十平方米', '新引进团队需要空间，学院准备从多个老实验室匀出面积。你的设备搬动一次就可能需要重新校准。', '院系', 4, 7, [
    choice('提交使用数据与最低需求', '你同意共享非关键空间，也说明搬迁的真实代价。方案不完美，却比按嗓门分配更可讨论。', { deptSupport: 5, integrity: 2, adminBurden: 3, stress: 3 }),
    choice('与新团队共建共享区', '双方拿出一部分资源。空间依然拥挤，但新的合作降低了几项重复采购。', { network: 6, knowledge: 3, funding: 0.5, deptSupport: 3, stress: 3 }),
    choice('据理争取原空间不变', '你保住一部分关键区域，也更清楚地感到其他团队同样在等待。院务会还会继续。', { deptSupport: -2, reputation: 2, stress: 4, adminBurden: 3 }),
  ]),
  event('dept_quota', '唯一的博士招生名额', '本年度院系只多出一个博士名额。你和唐砚都有合适的候选人，分配标准却还停留在口头说法。', '院系', 5, 7, [
    choice('提议公开培养能力与资源标准', '讨论不再轻松，但名额有了可解释的依据。你未必获胜，之后的申请却更有预期。', { integrity: 5, deptSupport: 4, adminBurden: 3, reputation: 2 }),
    choice('协商联合培养并写清责任', '名额没有凭空变成两个。共同培养让一位学生获得双方支持，也要求你们持续协调。', { network: 7, teachingQuality: 4, stress: 3 }),
    choice('强调自己的指标更急', '你的申请更有存在感。其他同事听见的却是：谁接近截止，谁就该优先。', { reputation: 3, deptSupport: -2, network: -3, stress: 3 }),
  ]),
  event('dept_meeting', '院务会的最后一项', '院长提议按论文总数分下一年的公共预算。大家都很疲倦，这条规则很容易在沉默中通过。', '四唯', 4, 7, [
    choice('提出代表作与教学贡献的试点', '你拿出一个可执行的小方案，没有要求一夜之间重建全部制度。会议因此多开了二十分钟。', { integrity: 4, deptSupport: 5, reputation: 2, adminBurden: 3, stress: 2 }),
    choice('支持简明规则，要求年度复评', '短期方案通过了，你把复评日期写进纪要。一个清楚但粗糙的标准，至少有了被修改的机会。', { deptSupport: 3, writing: 2, integrity: 1, stress: 1 }),
    choice('保持沉默，回去赶自己的稿', '你保住了今晚的时间。新规则也将在明年影响你的选择，无论你是否参与制定。', { writing: 4, stress: -1, deptSupport: -2 }),
  ]),
  event('colleague_service', '同事们都说“你年轻”', '迎新、网站、会议接待与三个统计表，接连落到你身上。每一件都不大，合起来却占满了周三。', '同事', 3, 6, [
    choice('列出总量，协商轮值机制', '你没有否认公共服务的必要。可见的工时让分担开始变得具体。', { adminBurden: -5, deptSupport: 4, network: 1, stress: 2 }),
    choice('完成一部分，清楚拒绝其余', '有人觉得你不够热心，也有人第一次看见可以这样划边界。', { adminBurden: -3, stress: -3, network: -1, reputation: 1 }),
    choice('全部接下，积累院系信任', '你的可靠有目共睹，日程却越来越碎。支持积累了，持续工作的时间减少了。', { deptSupport: 7, network: 4, adminBurden: 8, stress: 5, health: -2 }),
  ]),
  event('colleague_idea', '讨论会后，相似的题目', '一位同事的申请书使用了你在内部讨论中提过的角度。也可能是独立想到，你手里没有足够证据。', '同事', 3, 7, [
    choice('私下确认时间线与合作可能', '对话有些紧绷，你们至少弄清了哪些内容重叠。下一次分享会先约定保密与贡献。', { network: 2, integrity: 3, insight: 2, stress: 3 }),
    choice('整理自己的记录，专注差异化', '你把真正属于自己的证据与问题梳理清楚。竞争没有消失，研究方向却更鲜明。', { writing: 5, insight: 4, stress: 3 }),
    choice('向院系咨询正式沟通渠道', '你用事实而非猜测陈述情况。程序需要时间，也保护被质疑的人有回应机会。', { integrity: 4, adminBurden: 4, stress: 4, deptSupport: 1 }),
  ]),
  event('staff_credit', '仪器工程师在致谢里', '魏鸣提出的校正方法解决了主要误差。投稿前，有人建议“技术支持放致谢就够了”。', '合作', 1, 7, [
    choice('按实际贡献讨论署名', '你们依贡献标准重新确认作者与说明。一次技术工作被当作智力贡献认真评估。', { integrity: 5, network: 5, knowledge: 2, stress: 2 }),
    choice('共同撰写方法说明', '魏鸣把隐含经验写成了可复用的流程。后来的人不必再依赖一句“师傅说这样调”。', { knowledge: 6, writing: 4, network: 4 }),
    choice('按旧惯例仅写笼统致谢', '稿件少了一次讨论，关系却多了一层隔阂。下次遇到难题时，对方可能只做岗位要求的部分。', { writing: 2, integrity: -4, network: -5, risk: 2 }),
  ]),
  event('grant_precheck', '科研处的红色批注', '林谨返回了申请书：预算、伦理说明、合作分工各有一处不一致。正式截止还剩两天。', '行政', 3, 7, [
    choice('逐项核实，修改后再提交', '几处红色批注消失了，原本模糊的分工也被说清。形式审查替你挡住了后面的麻烦。', { writing: 5, integrity: 3, adminBurden: 2, stress: 3 }),
    choice('约一次简短预审说明会', '你不仅改完这一份，也学会如何在下一次提交前自查。', { knowledge: 3, network: 3, adminBurden: -2, writing: 3 }),
    choice('先提交，等退回再改', '截止时间被赶上了，侥幸却没让问题消失。一次形式问题可能浪费整个申请季。', { stress: 4, adminBurden: 5, reputation: -2, risk: 3 }),
  ]),
  event('budget_adjust', '研究变了，预算还没变', '实验结果指向新路径，原预算中的一项材料已不再需要。新方法则要增加测试支出。', '行政', 3, 7, [
    choice('按真实研究需要申请调整', '高珂指出了可用流程。你把科学上的改变，也写成能被审计理解的改变。', { writing: 3, integrity: 4, adminBurden: 2, projectProgress: 4 }),
    choice('先与合作方共享测试资源', '你们用已有条件验证了初步想法。节省预算的同时，需要更清楚地约定数据归属。', { network: 5, knowledge: 3, funding: 0.3, stress: 2 }),
    choice('保持原科目，模糊处理用途', '账面看起来没有变化，研究与记录却分了叉。未来解释这笔支出会更困难。', { projectProgress: 5, integrity: -7, risk: 9, adminBurden: 3 }),
  ]),
  event('procurement', '便宜的设备，贵的维护', '两家设备报价相近，一家演示漂亮却不提供长期维护细节。采购截止正在逼近。', '行政', 3, 7, [
    choice('组织真实样品测试与维护评估', '速度慢了一点，你却看见演示之外的性能。技术人员参与让采购不再只比较首页参数。', { knowledge: 5, integrity: 3, adminBurden: 3, funding: -0.2 }),
    choice('先用共享平台，小规模验证', '你没有立刻获得专属设备，却避免了在不了解需求时锁死一大笔预算。', { funding: 0.4, network: 3, insight: 2, stress: 2 }),
    choice('按最亮眼的展示快速选择', '设备准时进了楼，后续调试又占去不少时间。演示成功与日常可用是两件不同的事。', { reputation: 2, stress: 5, adminBurden: 4, funding: -0.5 }),
  ]),
  event('contract_words', '“所有成果”四个字', '企业合同要求合作期内“所有成果”归对方所有。顾遥说模板一直如此，修改也许可以谈。', '行政', 3, 7, [
    choice('请科研处审查并明确边界', '几轮修改区分了背景成果、合作成果与发表期限。清楚的合同反而让双方更敢投入。', { integrity: 3, network: 4, writing: 4, adminBurden: 3, funding: 0.5 }),
    choice('缩小项目范围再签约', '合同金额小了一些，承担的义务也更可控。你为真正能完成的部分负责。', { funding: 0.3, stress: -2, insight: 2, integrity: 3 }),
    choice('先签再说，尽快拿到合作', '经费到账快了，下一篇论文的发表权却可能成为争议。模板不会替你承担后果。', { funding: 1.2, network: 2, risk: 7, adminBurden: 5, stress: 3 }),
  ]),
  event('hr_offer', '聘任附件里的小字', '人事处发来续聘附件：待遇写得清楚，考核却有一句“学校认定的高水平成果”。你还不知道由谁认定。', '职业', 3, 6, [
    choice('请书面明确认定范围与程序', '乔澜补充了口径与申诉渠道。谈判花了时间，未来至少有可以共同核对的文本。', { integrity: 2, writing: 3, adminBurden: 2, stress: -3 }),
    choice('比较资源、负担与备选岗位', '你把年薪、住房、启动经费与教学任务放在同一张纸上。数字终于不再只剩最大的一项。', { knowledge: 3, insight: 3, stress: -2, money: 0.1 }),
    choice('先接受，集中冲刺指标', '岗位有了着落，模糊的目标也一起进入日历。你需要更快做出能被看见的工作。', { reputation: 3, writing: 4, stress: 6, adminBurden: 3 }),
  ]),
  event('promotion_review', '职称评审前的代表作', '晋升材料允许提交三项代表成果。你可以选三篇最容易计分的论文，也可以把课程与共享方法纳入说明。', '四唯', 4, 6, [
    choice('选择有证据支撑的完整贡献', '你解释研究、教学与方法之间的关联。评委需要多读几页，价值也不再只是一列数字。', { writing: 5, integrity: 3, reputation: 4, teachingCredits: 2, stress: 3 }),
    choice('按公布标准突出最强论文', '你没有义务独自改变整套评价。材料清晰，也提醒你未来要为其他贡献争取正式认定。', { writing: 6, reputation: 4, stress: 2 }),
    choice('夸大个人主导程度', '材料里的你比真实的你忙得多。共同作者若被问起，故事可能会出现不同版本。', { reputation: 6, writing: 3, integrity: -8, risk: 10, stress: 3 }),
  ]),
  event('ethics_review', '先采数据，还是先审方案', '新合作涉及参与者信息。合作者说只是做个探索，“流程可以以后再补”。', '科研', 1, 7, [
    choice('先完善方案并提交伦理审查', '研究启动晚了一些，参与者权益与数据边界却被认真考虑。', { integrity: 6, knowledge: 3, adminBurden: 3, stress: 2 }),
    choice('先用合规公开数据做预研究', '你验证了方法可行性，也为正式申请准备了更具体的风险说明。', { knowledge: 5, insight: 3, integrity: 3, stress: 2 }),
    choice('默许先采集再解释', '数据来得很快，研究也背上了本不必承担的风险。事后的文件无法替代事前的保护。', { projectProgress: 6, integrity: -10, risk: 13, stress: 4 }),
  ]),
  event('safety_stop', '平台按下了暂停键', '一项测试被平台发现安全隐患，魏鸣暂停了机时。对方说不是针对你的课题，可截止日期确实不等人。', '行政', 1, 7, [
    choice('共同修订流程，完成安全复核', '一项被忽视的步骤得到修正。你少了一晚数据，多了一份之后可以放心复用的操作规程。', { knowledge: 5, integrity: 4, network: 3, stress: 3 }),
    choice('调整近期目标，先分析已有数据', '暂停没有让你停下全部工作。对旧数据的重新检查还带来一个新问题。', { insight: 4, writing: 3, stress: 1 }),
    choice('向领导施压要求优先恢复', '有人帮忙加快了沟通，却没有让隐患自动消失。平台团队对这次合作更谨慎了。', { reputation: 2, network: -4, integrity: -4, risk: 6, stress: 4 }),
  ]),
  event('funding_audit', '结题之前的两本账', '项目接近结题，财务账与研究记录有几处对应不清。高珂建议现在逐项核对，不要等到审计来问。', '行政', 3, 7, [
    choice('核对真实记录，说明偏差', '你修正了分类与说明，也发现此前多报了一项重复支出。问题在还能处理时被摊开。', { integrity: 5, risk: -6, adminBurden: 3, stress: 3 }),
    choice('邀请团队共同做一次归档', '这不再是负责人独自背着的文件堆。大家理解了哪些记录必须在研究发生时留下。', { network: 3, integrity: 4, adminBurden: -2, knowledge: 2 }),
    choice('把精力放在成果，记录以后再补', '报告的封面更漂亮了，几个旧问题却继续向后滚。你知道它们迟早需要解释。', { writing: 4, risk: 6, adminBurden: 5, stress: 4 }),
  ]),
  event('leave_request', '想休假的人不止你一个', '你准备申请一段照护假。课程、组会与项目都需要有人接手，而另一位同事刚提出相似需求。', '院系', 4, 7, [
    choice('明确交接，争取制度性安排', '院系建立了轮值与紧急联系人。支持不是没有代价，但开始不再完全依靠私人情面。', { deptSupport: 4, integrity: 3, health: 5, stress: -4, adminBurden: 2 }),
    choice('与同事互换不同时间段', '你们各让出一部分便利，获得更可行的支持。安排需要维护，也值得记在正式工作量里。', { network: 6, health: 4, stress: -3 }),
    choice('缩短假期，减少协调', '眼前冲突少了一些，你也知道自己并没有因此少一项生活责任。', { deptSupport: 2, stress: 4, health: -3, writing: 2 }),
  ]),
);

events.push(
  event('fund_bottleneck', '大夏自然基金委的意见书', '项目未获资助。两位专家认为问题重要，另一位认为可行性不足。你很想知道那个分数背后的具体理由。', '基金', 3, 7, [
    choice('整理意见，补关键预实验', '你无法改变这一轮结果，但能把抽象批评转成可验证的下一步。', { knowledge: 5, writing: 5, insight: 3, stress: 3 }),
    choice('请不同方向同行做模拟评审', '他们听不懂的地方，恰好也是申请书写得最自信的地方。你重新检查了问题的表达。', { writing: 7, network: 4, insight: 2, stress: 2 }),
    choice('先维持小规模，降低依赖', '研究速度放慢，日常开支也更可控。没有大项目的一年，仍能回答一个小而真实的问题。', { funding: 0.3, stress: -4, insight: 3, reputation: -1 }),
  ]),
  event('tech_bureau', '科技署要一张路线图', '大夏科技署征集重点任务建议。你擅长的是一个基础问题，模板却要求写出五年后能交付的技术指标。', '科技署', 4, 7, [
    choice('区分基础问题与技术里程碑', '你把不确定性写清，也给出可以检验的阶段目标。路线图少了一点光泽，多了执行的可能。', { writing: 5, insight: 4, integrity: 3, reputation: 2 }),
    choice('与工程团队联合设计', '对方指出了你没考虑的接口与成本。合作需要协调，也让基础问题找到真实约束。', { network: 6, knowledge: 4, funding: 0.4, stress: 3 }),
    choice('承诺一个过度乐观的交付', '建议书更容易让人兴奋。若真获支持，未来的你就要为今天的漂亮数字负责。', { reputation: 5, funding: 1, integrity: -6, risk: 7, stress: 5 }),
  ]),
  event('young_cap', '优青答辩前，名字之外', '你被邀请参加青年人才经验交流。有人建议开头先放履历与合影，梁弈则问：“三分钟后，听众能记住哪个问题？”', '人才', 4, 7, [
    choice('先讲代表性问题与独立贡献', '你把合作中的位置说得具体，也承认尚未解决的边界。报告不再像一份奖项清单。', { writing: 6, reputation: 4, integrity: 3, insight: 2 }),
    choice('平衡研究故事与成长背景', '资源从哪里来、问题如何形成，终于连接成一条能够理解的线。', { writing: 5, network: 3, reputation: 3 }),
    choice('重点展示显赫合作者', '熟悉的名字吸引了注意，也带来一个更尖锐的问题：其中哪一部分离开你就不会发生？', { reputation: 4, network: 4, insight: -2, stress: 3 }),
  ]),
  event('distinguished_team', '杰青之外，还有整个团队', '一场人才项目准备会后，团队问你：如果下一阶段支持没有拿到，现有学生和平台怎么办？', '人才', 6, 7, [
    choice('先做不依赖单次入选的计划', '你降低扩张速度，为现有承诺留出缓冲。团队听见了一个没有口号、却能一起执行的方案。', { integrity: 4, deptSupport: 4, network: 3, stress: -3, funding: -0.4 }),
    choice('集中资源打磨最强代表作', '团队更聚焦了，也暂时放下若干支线。你明确哪些等待是暂时的，哪些应当结束。', { insight: 5, writing: 6, reputation: 3, stress: 4 }),
    choice('继续扩张，用更多成果冲线', '团队的日程更满，机会也更大。新增承诺会在结果出来之前就开始消耗资源。', { reputation: 5, network: 4, funding: -1, stress: 7, adminBurden: 4 }),
  ]),
  event('honor_invitation', '院士候选人的日程表', '一位资深同行邀请你参与学科咨询。议程包含年轻人发展、长期装置与区域科学，远比一场个人报告复杂。', '学术共同体', 6, 7, [
    choice('调查不同群体的真实需要', '你带来一些不够华丽的数据，也带来了平时很少进入会场的声音。', { integrity: 4, reputation: 4, deptSupport: 3, insight: 3, stress: 3 }),
    choice('聚焦自己最熟悉的科学问题', '你没有对所有问题表态。准确说明自己知道什么、尚不知道什么，也是一种公共责任。', { reputation: 4, knowledge: 3, writing: 3, integrity: 2 }),
    choice('接受更多邀请，扩大影响', '名字出现得更频繁了，连续研究的时间却更碎。影响力逐渐变成一项需要管理的工作。', { network: 7, reputation: 5, adminBurden: 6, stress: 4 }),
  ]),
  event('famous_author', '不参与研究的那位大人物', '合作方建议为论文增加一个声望很高的名字，说这样“投稿和项目都方便”。对方尚未参与研究。', '权学交易', 2, 7, [
    choice('请对方先做实质性贡献', '你保留了合作的门，也保留了贡献标准。工作讨论比客套邀请慢得多，但更站得住。', { integrity: 4, knowledge: 3, network: 2, stress: 3 }),
    choice('婉拒挂名，自己承担后续', '你少了一条看起来快捷的路，也免去解释一个并不存在的贡献。短期关系有些冷了。', { integrity: 6, network: -3, reputation: -1, stress: 3 }),
    choice('默认增加，换取关系支持', '稿件迅速多了一个熟悉的名字。你也默认了一种之后很难再拒绝的交换。', { network: 8, reputation: 5, integrity: -11, risk: 12, flags: { honoraryAuthor: true } }),
  ]),
  event('reciprocal_review', '互相照应的暗示', '一个熟人含糊地说，今年他会评你们方向的材料，明年也许轮到你。“大家都不容易。”', '权学交易', 4, 7, [
    choice('说明利益冲突，保持评议独立', '对方不再继续话题。你失去一点便利，也让未来的自己保留了说真话的位置。', { integrity: 6, network: -3, stress: 2, risk: -2 }),
    choice('转回公开的学术讨论', '你没有承诺任何评议结果。一次具体的方法交流让双方仍有正常合作的可能。', { integrity: 3, knowledge: 3, network: 2 }),
    choice('接受默契，等以后回报', '事情暂时更顺了。那句没有写下来的承诺，开始比正式日历更难推迟。', { network: 8, reputation: 5, integrity: -12, risk: 13, flags: { reciprocalPromise: true } }),
  ]),
  event('banquet_list', '晚宴名单没有你的学生', '会议晚宴座次按头衔安排。真正完成关键实验的学生被分到另一桌，有人请你去主桌敬酒。', '会议', 2, 7, [
    choice('简短交流后回去陪团队', '你完成必要的礼节，也让学生知道：被看见的贡献不应只停在报告的致谢页。', { network: 3, integrity: 3, studentSatisfaction: 4, stress: 1 }),
    choice('介绍学生与同行讨论工作', '起初有些尴尬，谈到具体结果之后，桌上的人终于开始问学生真正做了什么。', { network: 5, reputation: 2, teachingQuality: 3, studentSatisfaction: 5 }),
    choice('抓住主桌机会，专注建立关系', '你认识了几位能打开机会的人。学生并非不会理解，只是也在观察何种劳动最容易被看见。', { network: 7, reputation: 3, studentSatisfaction: -4, stress: 2 }),
  ]),
  event('paid_exposure', '一封“重磅荣誉”邀请', '一个陌生机构说你已被列为“年度创新领军候选人”，只需缴纳一笔宣传服务费用。邮件没有清楚的评选办法。', '声誉', 1, 7, [
    choice('核实主办与评选规则后拒绝', '你没有把不清楚的宣传当成同行认可。以后也有了一份识别相似邀约的检查要点。', { integrity: 3, knowledge: 2, risk: -1 }),
    choice('转给科研处共同核查', '林谨确认这不是校方认可的科研奖励，并提醒团队不要将宣传费用混入项目预算。', { network: 2, integrity: 3, adminBurden: 1 }),
    choice('自费购买一份曝光', '头像出现在网页首页，却没有增加任何可核查的科研贡献。短暂关注有了明确的价格。', { money: -0.35, reputation: 2, integrity: -3, risk: 4 }),
  ]),
  event('citation_deal', '可以互相“支持”的参考文献', '同行提出，在各自下一篇文章里多引用对方一些作品。相关的有两篇，其余与问题关系不大。', '权学交易', 1, 7, [
    choice('只引用确有关系的工作', '你给出两篇作品应被引用的具体理由。学术交流继续，数字上的默契没有成立。', { integrity: 4, knowledge: 2, network: 1 }),
    choice('认真读完，再讨论交叉问题', '其中一篇无关的论文意外启发了一个新问题。它不是互换引用，却可能变成真正的合作。', { insight: 5, network: 4, knowledge: 3 }),
    choice('照单加入，快速积累引用', '参考文献更长，关系也更近。文献表开始承担它不该承担的交换功能。', { reputation: 4, network: 5, integrity: -7, risk: 7 }),
  ]),
  event('review_conflict', '匿名评审里熟悉的题目', '一份待评申请书与你的竞争者方向高度重合。虽未写名字，你从研究经历猜到了是谁。', '评议', 4, 7, [
    choice('说明可能的利益冲突并申请回避', '你放下了一次能影响结果的位置。评审机构有了重新分配的依据。', { integrity: 6, reputation: 2, stress: -2, risk: -2 }),
    choice('咨询后，依据公开标准独立评议', '你保留了完整评价依据。对申请人的熟悉没有变成替代证据的猜测。', { integrity: 4, writing: 3, stress: 3 }),
    choice('借机会压低竞争者评价', '一段看似专业的意见掩盖了真正动机。你知道自己以后也会把正常批评看成类似的算计。', { reputation: 3, integrity: -12, risk: 14, stress: 5 }),
  ]),
  event('local_need', '青岚的河，排行榜的河', '地方团队邀请你研究河流的季节性变化。数据有价值，却很难承诺会出现热门方向需要的惊人结论。', '科学与社会', 2, 7, [
    choice('把区域问题凝练为可推广的方法', '你没有抹去地方需要，而是寻找别人也能使用的解释。真实问题与基础研究开始连接。', { insight: 6, knowledge: 4, network: 3, stress: 2 }),
    choice('做扎实的长期观测与公开数据', '贡献未必马上出现在排行榜里，但一份可靠数据会被许多后来工作反复使用。', { integrity: 5, knowledge: 5, reputation: 2, funding: -0.4 }),
    choice('说明能力边界，推荐更适合的团队', '你拒绝了一项自己无法负责任完成的承诺，也帮助合作方找到能长期陪伴的人。', { integrity: 3, network: 4, stress: -2 }),
  ]),
  event('city_recruitment', '另一座城市的高薪海报', '深河一所新大学发来招聘介绍。年薪很亮眼，启动经费的分批条件、招生名额与住房期限还没写全。', '职业', 3, 7, [
    choice('逐项核实资源和合同条件', '你把迁居成本与家人安排也纳入比较。这个决定终于有了完整的价格。', { knowledge: 3, writing: 3, stress: -2, adminBurden: 2 }),
    choice('访问团队，听现任教师讲生活', '海报没有说的日常被补齐了。你认识了未来可能合作的人，也看见他们面对的限制。', { network: 6, insight: 2, money: -0.2, stress: 1 }),
    choice('留下发展，先谈现有支持', '你没有因为一张海报立刻移动。与院系的具体沟通，让原本习惯的处境也有了被重新讨论的可能。', { deptSupport: 4, network: 2, stress: -2 }),
  ]),
  event('slow_breakthrough', '五年前的笔记有了回声', '一位年轻研究者来信，说你早年一项不起眼的方法帮助他们解释了新现象。那篇文章从未成为热点。', '学术共同体', 3, 7, [
    choice('一起检查新解释是否成立', '学术价值有时比考核周期走得慢。你又坐回那块旧白板，开始下一次可检验的讨论。', { insight: 7, knowledge: 4, network: 4, reputation: 3 }),
    choice('邀请对方做开放报告', '更多人看见了方法如何被重新使用。你把旧工作的故事，讲成后来者能够接续的线索。', { reputation: 5, network: 5, teachingQuality: 2, stress: 1 }),
    choice('把时间留给对方，给予有限支持', '你提供关键记录，也尊重新工作的独立性。一次恰到好处的帮助胜过无限制地加入。', { integrity: 4, reputation: 3, stress: -3 }),
  ]),
  event('honor_responsibility', '名片印不下的头衔', '讲座海报将你的头衔排成了五行，研究问题只剩最底下一句。主办方说这是尊重。', '人才', 4, 7, [
    choice('压缩头衔，把问题放在前面', '海报看起来简单了。来听的人更清楚自己会听见什么。', { integrity: 3, writing: 3, reputation: 2 }),
    choice('保留介绍，用报告交付内容', '你不再与每一张海报较劲，而是把精力留给证据、讨论与认真提问的人。', { writing: 4, knowledge: 2, stress: -1 }),
    choice('享受关注，接下更多邀约', '掌声与日程同步增长。你需要留心，自己的话是否还由研究支撑。', { reputation: 5, network: 4, adminBurden: 4, stress: 3 }),
  ]),
  { ...event('promise_collected', '那句“以后互相帮忙”回来了', '曾经给过便利的人要求你回报：一份没有足够依据的高评价。过去含糊的默契，现在有了具体价格。', '后果', 4, 7, [
    choice('拒绝交换，说明冲突并退出评议', '关系迅速冷却。你承担了结束默契的代价，也停止把下一次选择继续押进去。', { network: -8, reputation: -2, integrity: 7, risk: -5, stress: 6, flags: { reciprocalPromise: false } }),
    choice('如实评议，接受关系破裂', '你把依据写完整，独立完成评价。承诺的人并不满意，真实的判断却终于回到纸上。', { integrity: 6, network: -6, risk: -3, stress: 5, flags: { reciprocalPromise: false } }),
    choice('照应一次，继续维持默契', '这一次债还了，新的债也建立了。你们拥有更多彼此知道的事情。', { network: 6, reputation: 3, integrity: -12, risk: 17, stress: 5 }),
  ], 5), condition: { flag: 'reciprocalPromise' } },
  { ...event('author_question', '编辑询问那位作者的贡献', '编辑要求每位作者确认贡献。一位从未参与研究的署名者，不知道该如何描述自己的工作。', '后果', 2, 7, [
    choice('说明真实情况，修正作者与贡献', '对方很不高兴，稿件也需要重新处理。你终止了一个错误，代价开始具体落在关系和进度上。', { integrity: 7, network: -7, reputation: -3, risk: -5, stress: 6, flags: { honoraryAuthor: false } }),
    choice('请求编辑给出正式处理路径', '程序把问题从私下人情带回公开标准。过程艰难，至少不必再用新的不实解释旧的不实。', { integrity: 5, risk: -4, adminBurden: 5, stress: 5, flags: { honoraryAuthor: false } }),
    choice('替对方编一段贡献说明', '材料变完整了，事实没有。下一次核查可能要依赖更多人的沉默。', { writing: 3, integrity: -13, risk: 18, stress: 6 }),
  ], 5), condition: { flag: 'honoraryAuthor' } },
  { ...event('trust_erosion', '合作方要求更严格的数据核查', '近期几项争议让合作方变得谨慎。他们要求重审原始数据与分工记录，研究进度将受到影响。', '后果', 1, 7, [
    choice('配合核查，主动纠正问题', '核查花掉了时间，也让不确定的地方逐渐清楚。信任只能靠之后持续的可靠工作一点点恢复。', { integrity: 5, risk: -7, reputation: -2, stress: 5, projectProgress: -3 }),
    choice('邀请独立同行一起检查', '多一双眼睛不等于立刻洗清所有疑问，但结果有了双方能共同接受的依据。', { integrity: 4, risk: -6, network: 2, funding: -0.5, stress: 4 }),
    choice('指责对方不信任，拒绝提供', '你省下一些整理时间，合作的门却更难打开。声誉问题开始改变真实的研究条件。', { risk: 8, network: -7, reputation: -6, stress: 5 }),
  ], 3), condition: { minRisk: 24 } },
);

export const DATA = { title: '大夏·学术浮生', subtitle: '在指标与星空之间，写下你自己的学术生涯', credits: 'JF_Li@FD & Sol', cities, fields, backgrounds, departments, admin, npcs, conferences, events, handbook };
export default DATA;
