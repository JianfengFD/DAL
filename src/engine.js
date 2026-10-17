import DATA from './content.js';

/** 大夏·学术浮生 — deterministic, DOM-free quarterly simulation.
 * All money is measured in 万元. Salaries in rule tables are annual;
 * research funding and personal wealth are separate ledgers.
 */
const clamp = (v, min = 0, max = 100) => Math.min(max, Math.max(min, Number(v) || 0));
const round = n => Math.round(n * 100) / 100;
const copy = x => JSON.parse(JSON.stringify(x));
const list = x => Array.isArray(x) ? x : x && typeof x === 'object' ? Object.entries(x).map(([id, v]) => ({ id, ...v })) : [];
const BASE_CITIES = [
  { id: 'dajiang', name: '大江市', university: '澄江大学', costOfLiving: 1.05, salaryMultiplier: 1, researchBonus: 1, networkBonus: 1, relocationCost: 1.5 },
  { id: 'gaohu', name: '高沪市', university: '浦光大学', costOfLiving: 1.85, salaryMultiplier: 1.3, researchBonus: 1.12, networkBonus: 1.2, relocationCost: 3 },
  { id: 'shenhe', name: '深河市', university: '深河科技大学', costOfLiving: 1.65, salaryMultiplier: 1.4, researchBonus: 1.15, networkBonus: 1.08, relocationCost: 2.8 },
  { id: 'qinglan', name: '青岚市', university: '青岚师范大学', costOfLiving: 0.75, salaryMultiplier: 0.9, researchBonus: 0.96, networkBonus: 0.9, relocationCost: 1.2 },
  { id: 'beicheng', name: '北宸市', university: '北宸大学', costOfLiving: 1.75, salaryMultiplier: 1.22, researchBonus: 1.08, networkBonus: 1.3, relocationCost: 3 },
  { id: 'yunling', name: '云岭市', university: '云岭大学', costOfLiving: 0.62, salaryMultiplier: 0.85, researchBonus: 0.92, networkBonus: 0.82, relocationCost: 1 },
];
const CITIES = BASE_CITIES.map(c => ({ ...c, ...(list(DATA.cities).find(d => d.id === c.id) || {}),
  costOfLiving: c.costOfLiving, salaryMultiplier: c.salaryMultiplier, researchBonus: c.researchBonus, networkBonus: c.networkBonus, relocationCost: c.relocationCost }));
const CAREERS = [
  { id: 'undergraduate', name: '本科生', rank: 0, salary: 2.4, minQuarters: 16, description: '打下学识基础，完成课程，探索研究方向。' },
  { id: 'master', name: '硕士研究生', rank: 1, salary: 4.8, minQuarters: 12, description: '接受研究训练，完成学位论文。' },
  { id: 'phd', name: '博士研究生', rank: 2, salary: 7.2, minQuarters: 16, description: '独立提出问题，以原创成果完成博士学位。' },
  { id: 'postdoc', name: '博士后', rank: 3, salary: 18, minQuarters: 8, description: '在有限的聘期内建立独立研究方向。' },
  { id: 'assistant', name: '助教', rank: 4, salary: 16, minQuarters: 8, description: '承担课程与基础研究，积累教学经验。' },
  { id: 'lecturer', name: '讲师', rank: 5, salary: 22, minQuarters: 12, description: '独立承担教学科研，面对聘期考核。' },
  { id: 'associate', name: '副教授', rank: 6, salary: 32, minQuarters: 16, description: '建设研究团队，同时承担培养与学术服务。' },
  { id: 'professor', name: '教授', rank: 7, salary: 46, minQuarters: 0, description: '主持长期研究，培养后继者，参与学科治理。' },
];
const HATS = [
  { id: 'none', name: '尚无人才称号', allowance: 0, funding: 0 },
  { id: 'provincial', name: '省域青拔', allowance: 3, funding: 20, maxAge: 38, duration: 8, description: '省域青年拔尖支持，帮助初入独立研究阶段的学者起步。' },
  { id: 'young', name: '优青', allowance: 6, funding: 80, maxAge: 40, duration: 12, description: '青年人才支持。津贴是个人收入；项目支持进入科研经费。' },
  { id: 'river', name: '长河学者', allowance: 10, funding: 100, maxAge: 50, duration: 16, description: '大学与省域共同支持的学科人才岗位，重视代表作与育人。' },
  { id: 'distinguished', name: '杰青', allowance: 15, funding: 180, maxAge: 48, duration: 20, description: '杰出青年人才支持，更强的独立性，也有更高的结题期待。' },
  { id: 'leader', name: '科技署领军', allowance: 18, funding: 220, maxAge: 58, duration: 20, description: '面向重大任务的科技领军支持，需要原创成果与团队组织能力。' },
  { id: 'academician', name: '院士', allowance: 24, funding: 200, description: '荣誉与学术责任，来自代表性贡献与同行认可。' },
];
const JOURNALS = [
  { id: 'campus', name: '《大夏学术札记》', tier: '学术期刊', score: 1.5, threshold: 26, duration: 1, fee: 0.05, reputation: 1.8 },
  { id: 'specialist', name: '《格物研究》', tier: '学科核心', score: 3.5, threshold: 43, duration: 2, fee: 0.12, reputation: 3.5 },
  { id: 'frontier', name: '《科学前沿》', tier: '领域一流', score: 7, threshold: 63, duration: 3, fee: 0.25, reputation: 6 },
  { id: 'summit', name: '《寰宇科学》', tier: '顶尖综合', score: 12, threshold: 82, duration: 4, fee: 0.45, reputation: 10 },
];
const GRANTS = [
  { id: 'student', name: '大夏大学生创新训练', agency: '教务处', amount: 3, duration: 8, minRank: 0, maxRank: 1, threshold: 18, cooldown: 8, description: '学生也能从一个小问题开始。结题要求完成一个研究课题。' },
  { id: 'seed', name: '校级探索种子基金', agency: '科研处', amount: 12, duration: 8, minRank: 2, threshold: 27, cooldown: 8, description: '支持初步想法与可行性验证。' },
  { id: 'youth', name: '大夏自然基金委·青年项目', agency: '大夏自然基金委', amount: 30, duration: 12, minRank: 3, maxAge: 40, threshold: 44, cooldown: 12, description: '面向青年学者的独立研究。要求结题时新增成果积分 5。' },
  { id: 'general', name: '大夏自然基金委·面上项目', agency: '大夏自然基金委', amount: 60, duration: 16, minRank: 4, threshold: 57, cooldown: 12, description: '围绕独立方向开展持续研究。要求新增成果积分 9。' },
  { id: 'key', name: '大夏科技署·重点攻关', agency: '大夏科技署', amount: 180, duration: 20, minRank: 6, threshold: 77, cooldown: 20, description: '组织团队解决复杂问题。要求新增成果积分 18 与培养学生。' },
];
const BASE_DEPARTMENTS = [
  { id: 'science', name: '格物科学学院', focus: '科研与教学并重', description: '重视扎实问题，也希望每一间教室里都有好老师。' },
  { id: 'engineering', name: '天工学院', focus: '成果转化与团队合作', description: '产学研往来频繁，设备充足，项目节奏也更快。' },
  { id: 'humanities', name: '人文与社会学部', focus: '代表作与公共教学', description: '重视长期积累、课堂讨论与学术共同体。' },
];
const OFFICES = [
  { id: 'research', name: '科研处', description: '基金申报、合同、结题与学术诚信。', actions: ['grant', 'admin'] },
  { id: 'personnel', name: '人事处', description: '岗位聘任、职称晋升与人才计划。', actions: ['job', 'hat', 'admin'] },
  { id: 'education', name: '教务处', description: '课程、学时、教学评估与培养方案。', actions: ['teach', 'admin'] },
  { id: 'finance', name: '财务处', description: '预算、采购与报销，公私账目分别核算。', actions: ['equipment', 'admin'] },
];
const STATS = ['knowledge', 'insight', 'writing', 'network', 'reputation', 'integrity', 'stress', 'health', 'risk'];
const SEASONS = ['春', '夏', '秋', '冬'];
const TOPICS = {
  standard: ['可重复实验中的微小偏差', '复杂网络的稳健性边界', '材料界面的缓慢演化', '地方知识与组织记忆', '城市创新的隐性结构'],
  frontier: ['跨尺度现象的统一解释', '长期被忽略的反常结果', '低成本测量的新原理', '知识生产的路径依赖', '无序系统中的新规律'],
  hot: ['大模型驱动的跨学科探索', '量子启发的智能框架', '新一代功能材料平台', '低碳转型的协同机制', '数据密集型科学的新范式'],
};
const FIELD_TOPICS = {
  materials: {
    standard: ['薄膜界面的缺陷迁移', '多孔材料中的离子扩散', '层状材料的结构稳定性', '纳米晶界的应力松弛'],
    frontier: ['无序孔道中的反常输运', '多尺度耦合的新物理机制', '界面涨落驱动的相变', '极端条件下的新量子态'],
    hot: ['智能逆向设计功能材料', '低维量子材料的可控制备', '固态储能界面的新结构', '生成模型辅助材料发现'],
  },
  computation: {
    standard: ['稀疏图算法的稳定性边界', '分布式系统中的可靠调度', '小样本学习的误差结构', '开源模型的可重复基准'],
    frontier: ['学习动力学的统一解释', '可验证智能系统的新架构', '复杂推理中的计算边界', '非平衡网络的信息传播'],
    hot: ['多模态大模型的协同推理', '科学智能体的长期规划', '基础模型的高效适配', '可信生成系统的新范式'],
  },
  life: {
    standard: ['细胞群体中的随机波动', '蛋白相互作用的稳健性', '微生物群落的代谢互作', '生物网络的多尺度调控'],
    frontier: ['生命系统的涌现规律', '细胞命运转换的新机制', '无序分子体系中的集体行为', '从单细胞到组织的跨尺度解释'],
    hot: ['生成模型辅助蛋白设计', '空间组学中的细胞通讯', '智能显微成像的机制发现', '合成生命系统的可控构建'],
  },
  ecology: {
    standard: ['河流生态系统的季节波动', '土壤微生物与碳循环', '城市热岛的多尺度结构', '高原样地的长期变化'],
    frontier: ['生态系统临界转变的先兆', '气候扰动下的群落新稳态', '跨流域生态过程的统一模型', '生物多样性与系统韧性的机制'],
    hot: ['智能遥感中的生态监测', '碳中和情景下的区域协同', '数字孪生流域的预测框架', '大模型辅助环境风险识别'],
  },
  mathematics: {
    standard: ['非线性方程的边界条件', '随机过程的极限定理', '拓扑结构中的稳定不变量', '多体模型的精确近似'],
    frontier: ['离散结构与连续几何的桥梁', '非平衡体系中的新守恒律', '复杂空间上的统一谱理论', '长期悬而未决的存在性问题'],
    hot: ['神经网络逼近的数学边界', '量子计算的复杂性结构', '几何方法解释学习动力学', '人工智能辅助形式化证明'],
  },
};
const BASE_NPCS = [
  { id: 'mentor', name: '沈闻山', role: '导师', influence: 65 },
  { id: 'peer', name: '许清禾', role: '同事·讲师', influence: 38 },
  { id: 'rival', name: '周砚', role: '同事·副教授', influence: 55 },
  { id: 'dean', name: '贺明章', role: '院长', influence: 85 },
];
export const ENGINE_DATA = {
  version: 1, careers: CAREERS, hats: HATS, cities: CITIES, grants: GRANTS, journals: JOURNALS,
  departments: list(DATA.departments).length ? list(DATA.departments) : BASE_DEPARTMENTS,
  offices: OFFICES, npcs: list(DATA.npcs).length ? list(DATA.npcs) : BASE_NPCS,
  fields: list(DATA.fields), backgrounds: list(DATA.backgrounds),
  scenarios: [{ id: 'undergrad', name: '初入校园', age: 18 }, { id: 'phd', name: '博士围城', age: 25 }, { id: 'young_pi', name: '青椒当家', age: 32 }],
};

function seedNumber(seed) {
  if (typeof seed === 'number' && Number.isFinite(seed)) return (seed >>> 0) || 0x6d2b79f5;
  let h = 2166136261;
  for (const ch of String(seed ?? 'daxia')) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return (h >>> 0) || 0x6d2b79f5;
}

export class Game {
  constructor(options = {}) {
    const scenario = ['undergrad', 'phd', 'young_pi'].includes(options.scenario) ? options.scenario : 'undergrad';
    const difficulty = ['easy', 'normal', 'hard'].includes(options.difficulty) ? options.difficulty : 'normal';
    const q = scenario === 'undergrad' ? 0 : scenario === 'phd' ? 28 : 56;
    const fieldId = options.fieldId || options.field || list(DATA.fields)[0]?.id || 'physics';
    const backgroundId = options.backgroundId || options.background || list(DATA.backgrounds)[0]?.id || 'ordinary';
    const departmentId = { materials: 'physics', computation: 'information', life: 'life', ecology: 'life', mathematics: 'basic' }[fieldId];
    const department = copy(ENGINE_DATA.departments.find(d => d.id === departmentId) || ENGINE_DATA.departments[0] || BASE_DEPARTMENTS[0]);
    this.state = {
      version: 1, seed: options.seed ?? 20261016, rng: seedNumber(options.seed ?? 20261016), name: String(options.name || '林知远').trim().slice(0, 24) || '林知远',
      scenario, difficulty, quarter: q, startQuarter: q, year: 2026 + Math.floor(q / 4), season: SEASONS[q % 4], age: 18 + q / 4,
      ap: 4, maxAp: 4, career: scenario === 'undergrad' ? 'undergraduate' : scenario === 'phd' ? 'phd' : 'lecturer',
      careerSince: scenario === 'phd' ? 24 : q, hat: 'none', hatSince: null, cityId: CITIES.some(c => c.id === options.cityId) ? options.cityId : 'dajiang',
      fieldId, backgroundId, money: scenario === 'undergrad' ? 2.6 : scenario === 'phd' ? 5 : 15, funding: scenario === 'young_pi' ? 20 : scenario === 'phd' ? 3 : 0,
      stats: { knowledge: 24, insight: 20, writing: 20, network: 15, reputation: 4, integrity: 88, stress: 15, health: 90, risk: 0 },
      projects: [], papers: [], submissions: [], grants: [], activeProjectId: null,
      degreeProgress: scenario === 'phd' ? 22 : 0, equipment: 0,
      department: { ...department, climate: 65, support: 50, rivalry: 25, evaluation: department.focus || '科研与教学并重' },
      teaching: { courses: [], hours: 0, quality: 50, satisfaction: 65, reputation: 0, credits: 0, load: 0, students: 0, quarterHours: 0, yearHours: 0 },
      administration: { research: 45, personnel: 45, education: 45, finance: 45, burden: 0, pending: [] },
      colleagues: [], relationships: {}, students: [],
      metrics: { citations: 0, paperScore: 0, papersPublished: 0, grantsWon: 0, grantsCompleted: 0, breakthroughs: 0, studentsMentored: 0, teachingScore: 0, rejected: 0, retractions: 0, audits: 0, income: 0, spent: 0, conferenceCount: 0, quartersPlayed: 0, annualResearch: 0, annualTeaching: 0, honestReplications: 0 },
      flags: { seenEvents: [], cooldowns: {}, degrees: ['school'], probationStrikes: 0, ownedHome: false, family: false, pension: false, researchThisQuarter: false, taughtThisQuarter: false, adminPrepared: false, annualActions: {}, hatAttempts: {} },
      logs: [], history: [], pendingEvent: null, ended: false, ending: null, lastResult: null,
    };
    if (scenario === 'phd') Object.assign(this.state.stats, { knowledge: 49, insight: 38, writing: 41, network: 25, reputation: 12, stress: 35 });
    if (scenario === 'young_pi') {
      Object.assign(this.state.stats, { knowledge: 62, insight: 52, writing: 56, network: 37, reputation: 25, stress: 34 });
      this.state.flags.degrees.push('bachelor', 'master', 'doctor');
      this.state.teaching.load = 32;
      this.state.teaching.reputation = 18;
      this.state.flags.tenureDeadline = q + 24;
      this.state.metrics.grantsWon = 1;
      this.state.grants.push({ id: 'grant_initial', type: 'seed', name: '入职科研启动经费', amount: 20, remaining: 20, startsQuarter: q, endsQuarter: q + 20, startScore: 0, target: 6, status: '执行中' });
      for (let i = 0; i < 3; i++) this._seedPaper(i, 3.5, 65);
      this.state.grants[0].startScore = this.paperScore;
      this.state.grants[0].startStudents = 0;
    }
    if (scenario === 'phd') { this.state.flags.degrees.push('bachelor', 'master'); this._seedPaper(0, 1.5, 47); }
    const diff = difficulty === 'easy' ? 1.5 : difficulty === 'hard' ? 0.72 : 1;
    this.state.money = round(this.state.money * diff);
    this.state.funding = round(this.state.funding * diff);
    if (difficulty === 'easy') this.state.stats.stress -= 6;
    for (const npc of ENGINE_DATA.npcs) {
      const initialTrust = npc.relationship ?? (/导师/.test(npc.role || '') ? 38 : 12);
      this.state.relationships[npc.id] = { trust: initialTrust, affinity: initialTrust, favors: 0, lastContact: q };
      if (/同事|副教授|讲师|教授|院长|系主任/.test(`${npc.role || ''} ${npc.title || ''}`)) this.state.colleagues.push({ id: npc.id, name: npc.name, role: npc.role, relation: initialTrust, trust: initialTrust, influence: npc.influence || 50, rivalry: /竞争|对手/.test(npc.role || '') ? 40 : 10 });
    }
    const background = list(DATA.backgrounds).find(x => x.id === backgroundId);
    const field = list(DATA.fields).find(x => x.id === fieldId);
    if (background?.bonuses) this._effects(background.bonuses);
    if (field?.bonuses) this._effects(field.bonuses);
    this._sync();
    this._log(`夏历${this.state.year}年，你以${this.career.name}的身份来到${this.city.name}。四格时间，留给研究、课堂、关系，也留给生活。`, 'milestone');
    if (scenario === 'young_pi') this._log('六年聘期已经开始：在24个季度内晋升副教授，或凭优秀教学争取续聘。教学、论文与院系支持都会写进人事处的档案。', 'warning');
  }

  get career() { return CAREERS.find(c => c.id === this.state.career) || CAREERS[0]; }
  get city() { return CITIES.find(c => c.id === this.state.cityId) || CITIES[0]; }
  get paperScore() { return round(this.state.papers.filter(p => p.status !== '撤稿').reduce((a, p) => a + (p.score || 0), 0)); }
  get activeProject() { return this.state.projects.find(p => p.id === this.state.activeProjectId && ['在研', '写作中', '待投稿'].includes(p.status)) || this.state.projects.find(p => ['在研', '写作中', '待投稿'].includes(p.status)); }

  _random() {
    let x = this.state.rng >>> 0;
    x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
    this.state.rng = x >>> 0;
    return this.state.rng / 4294967296;
  }
  _range(lo, hi) { return lo + (hi - lo) * this._random(); }
  _id(prefix) { this.state.flags.idCounter = (this.state.flags.idCounter || 0) + 1; return `${prefix}_${this.state.flags.idCounter}`; }
  _seedPaper(index, score, quality) {
    this.state.papers.push({ id: `prior_${index}`, title: ['早期研究：边界条件与稳健性', '合作研究：复杂体系的新线索', '博士论文：从现象到机制'][index] || '早期研究', tier: score > 2 ? '学科核心' : '学术期刊', venue: score > 2 ? 'specialist' : 'campus', journal: score > 2 ? '《格物研究》' : '《大夏学术札记》', score, quality, citations: index * 3 + 2, status: '已发表', publishedQuarter: this.state.quarter - 4 + index, quarter: this.state.quarter - 4 + index, year: this.state.year - 1, risk: 0 });
  }
  _log(message, type = 'info') {
    const s = this.state;
    s.logs.push({ id: `${s.quarter}_${s.logs.length}_${s.flags.idCounter || 0}`, quarter: s.quarter, year: s.year, season: s.season, date: `${s.year}年${s.season}`, message, text: message, type });
    if (s.logs.length > 500) s.logs.splice(0, s.logs.length - 500);
  }
  _sync() {
    const s = this.state;
    s.age = 18 + s.quarter / 4; s.year = 2026 + Math.floor(s.quarter / 4); s.season = SEASONS[s.quarter % 4];
    for (const stat of STATS) s.stats[stat] = round(clamp(s.stats[stat]));
    s.money = round(Math.max(-20, Number(s.money) || 0)); s.funding = round(Math.max(0, Number(s.funding) || 0));
    s.ap = clamp(s.ap, 0, s.maxAp); s.degreeProgress = round(clamp(s.degreeProgress));
    for (const key of ['quality', 'satisfaction', 'reputation']) s.teaching[key] = round(clamp(s.teaching[key]));
    for (const key of ['climate', 'support', 'rivalry']) s.department[key] = round(clamp(s.department[key]));
    for (const key of ['research', 'personnel', 'education', 'finance', 'burden']) s.administration[key] = round(clamp(s.administration[key]));
    s.metrics.paperScore = this.paperScore;
    s.metrics.citations = Math.round(s.papers.reduce((a, p) => a + (p.citations || 0), 0));
    s.metrics.teachingScore = round(s.teaching.reputation); s.auditRisk = s.stats.risk;
    for (const colleague of s.colleagues) if (s.relationships[colleague.id]) colleague.trust = s.relationships[colleague.id].trust;
    s.administration.pending = s.grants.filter(g => g.status === '执行中').map(g => ({ id: g.id, office: 'research', title: `${g.name}结题`, dueQuarter: g.endsQuarter, remaining: Math.max(0, g.endsQuarter - s.quarter), description: `新增成果积分目标${g.target}，目前${round(this.paperScore - (g.startScore || 0))}。` }));
    if (this.career.rank >= 4) s.administration.pending.push({ id: 'annual_teaching', office: 'education', title: '年度教学工作量', dueQuarter: s.quarter + (4 - s.quarter % 4), remaining: 4 - s.quarter % 4, description: `本年已完成${s.teaching.yearHours}/${s.teaching.load}学时。` });
    if (s.flags.tenureDeadline) s.administration.pending.push({ id: 'tenure', office: 'personnel', title: '聘期晋升考核', dueQuarter: s.flags.tenureDeadline, remaining: Math.max(0, s.flags.tenureDeadline - s.quarter), description: '晋升副教授，或通过优秀教学争取稳定岗位。' });
  }
  _effects(effects = {}) {
    const s = this.state;
    const aliases = { prestige: 'reputation', rigor: 'integrity', energy: 'health', auditRisk: 'risk' };
    for (let [key, value] of Object.entries(effects)) {
      if (key === 'stats' && value && typeof value === 'object') { this._effects(value); continue; }
      key = aliases[key] || key;
      if (STATS.includes(key) && Number.isFinite(value)) s.stats[key] += value;
      else if (['money', 'funding', 'degreeProgress'].includes(key) && Number.isFinite(value)) s[key] += value;
      else if (['departmentSupport', 'deptSupport', 'support'].includes(key)) s.department.support += Number(value) || 0;
      else if (key === 'teachingQuality') s.teaching.quality += Number(value) || 0;
      else if (key === 'studentSatisfaction') s.teaching.satisfaction += Number(value) || 0;
      else if (['teaching', 'teachingReputation'].includes(key)) s.teaching.reputation += Number(value) || 0;
      else if (key === 'teachingCredits') s.teaching.credits += Number(value) || 0;
      else if (key === 'adminBurden') s.administration.burden += Number(value) || 0;
      else if (key === 'projectProgress' && this.activeProject) this.activeProject.progress = clamp(this.activeProject.progress + value);
      else if (key === 'flags' && value && typeof value === 'object') Object.assign(s.flags, value);
    }
  }
  _result(ok, message, events = [], extra = {}) {
    if (!ok) return { ok: false, message, events, ...extra };
    this._sync();
    const result = { ok, message, events, ...extra };
    this.state.lastResult = { ok, message };
    return result;
  }
  _cost(amount, fundingAllowed = false) {
    const s = this.state; amount = Math.max(0, amount);
    if (fundingAllowed) { const funded = Math.min(s.funding, amount); s.funding -= funded; amount -= funded; }
    s.money -= amount; s.metrics.spent += amount;
  }
  _canPay(amount, fundingAllowed = false) { return (fundingAllowed ? this.state.funding + Math.max(0, this.state.money) : this.state.money) >= amount; }
  _efficiency() { const s = this.state; return (s.stats.health < 35 ? 0.72 : 1) * (s.stats.stress > 75 ? 0.75 : 1) * (s.difficulty === 'easy' ? 1.12 : s.difficulty === 'hard' ? 0.91 : 1); }
  _cooldown(id) { return Math.max(0, (this.state.flags.cooldowns[id] || 0) - this.state.quarter); }
  _choice(id, label, description, available = true, reason = '', more = {}) { return { id, label, name: label, description, available, disabled: !available, reason: available ? '' : reason, ...more }; }
  _action(id, label, description, category, choices, cost = 1, available = true, reason = '') {
    const s = this.state;
    choices = choices.map(c => {
      const choiceCost = c.cost ?? cost, enoughTime = choiceCost <= s.ap;
      return { ...c, cost: choiceCost, available: c.available !== false && enoughTime, disabled: c.available === false || !enoughTime, reason: c.available !== false && !enoughTime ? `需要${choiceCost}格时间，本季剩余${s.ap}格。` : c.reason };
    });
    const globalReason = s.ended ? '这段人生已落下帷幕。' : s.pendingEvent ? '先回应本季来信。' : '';
    if (!available || globalReason || !choices.some(c => c.available !== false && (c.cost ?? cost) <= s.ap)) {
      return { id, label, name: label, description, category, cost, available: false, disabled: true, reason: globalReason || (!available ? reason : '') || (s.ap < cost ? '本季时间不足，请结束本季。' : '') || choices.find(c => c.reason)?.reason || reason || '当前条件不足。', choices };
    }
    return { id, label, name: label, description, category, cost, available: true, disabled: false, reason: '', choices };
  }

  getEconomy() {
    const s = this.state, student = this.career.rank <= 2, hat = HATS.find(h => h.id === s.hat) || HATS[0];
    const annualSalary = this.career.salary * this.city.salaryMultiplier * (s.flags.teachingTrack ? 0.92 : 1) + hat.allowance + (s.flags.adminAppointment ? 6 : 0);
    const quarterSalary = annualSalary / 4;
    const quarterExpenses = this.city.costOfLiving * (student ? 0.33 : 1) * (s.flags.ownedHome ? 0.62 : 1) + (s.flags.family ? 0.55 : 0) + s.students.filter(x => !x.graduated).length * 0.03;
    return { annualSalary: round(annualSalary), quarterSalary: round(quarterSalary), quarterExpenses: round(quarterExpenses), netQuarter: round(quarterSalary - quarterExpenses), stipend: student, bonus: hat.allowance, moneyUnit: '万元', annualFunding: 0 };
  }

  getActions() {
    const s = this.state, rank = this.career.rank, p = this.activeProject, eff = this._efficiency(), paper = this.paperScore;
    const a = (id, label, description, category, choices, cost = 1, available = true, reason = '') => this._action(id, label, description, category, choices, cost, available, reason);
    const c = (...args) => this._choice(...args);
    const pay = (amount, funded = false) => this._canPay(amount, funded);
    const readyPaper = p && p.progress >= 100 && p.writing >= 100;
    const research = [
      c('experiment', '稳步实验与采证', p ? `推进「${p.name}」。消耗0.25万科研经费或存款，质量与进度同时增加。` : '先建立一个课题，再推进证据。', !!p && p.progress < 100 && pay(0.25, true), !p ? '请先选择下方课题立项。' : p.progress >= 100 ? '研究已完成，可以整理写作。' : '需要0.25万元可用经费。'),
      c('explore', '追问反常结果', '进度稍慢，洞察与原创性上升；有机会出现突破。费用0.35万。', !!p && p.progress < 100 && pay(0.35, true), !p ? '请先立项。' : '研究已完成或经费不足。'),
      c('replicate', '复核与开放数据', '进度较少，严谨性显著增加，并降低未来核查风险。费用0.15万。', !!p && pay(0.15, true), '需要在研课题与0.15万元。'),
      c('shortcut', '赶进度：跳过负结果', '快速推进，但严谨性下降、操守受损，稿件留下隐患。', !!p && p.progress < 100, '需要未完成的课题。'),
      ...[['standard', '稳健的基础问题', '可行性高，预算低，适合积累第一项成果。'], ['frontier', '高风险的原创问题', '研究较慢，但原创性高，有更多突破与顶刊机会。'], ['hot', '追逐学界热点', '进度快、容易申报，也更容易陷入同质化竞争。']].map(([id, label, desc]) => c(`new_${id}`, `新立项：${label}`, desc, s.projects.filter(x => ['在研', '写作中', '待投稿'].includes(x.status)).length < 3, '最多同时推进3个课题。')),
    ];
    for (const other of s.projects.filter(x => ['在研', '写作中', '待投稿'].includes(x.status) && x.id !== p?.id)) research.push(c(`focus_${other.id}`, `切换：${other.name}`, '将这个课题设为当前重点。本次切换不消耗时间。', true, '', { cost: 0 }));
    const grants = GRANTS.map(g => {
      const reason = rank < g.minRank ? `至少需要${CAREERS[g.minRank].name}身份。` : g.maxRank !== undefined && rank > g.maxRank ? '已超过本项目的培养阶段。' : g.maxAge && s.age > g.maxAge ? '已超过申报年龄窗口。' : this._cooldown(`grant_${g.id}`) ? `距离下次申报还需${this._cooldown(`grant_${g.id}`)}季。` : '';
      const score = this._grantScore(g);
      const chance = clamp(0.3 + (score - g.threshold) / 100, 0.08, 0.88);
      return c(g.id, `${g.name} · ${g.amount}万`, `${g.description} 评审看重问题、代表作、前期积累与材料完整度。`, !reason, reason, { chance });
    });
    const npcs = ENGINE_DATA.npcs.filter(n => n.id).slice(0, 12).map(n => c(n.id, `约谈${n.name}`, `${n.role || '学界同行'}。认真交流提升互信；重复拜访的边际收益会下降。`, true, '', { npcId: n.id }));
    const conferenceChoices = [
      c('local', '院系沙龙 · 0.08万', '小范围讨论一个具体问题。洞察、人脉与同事互信增加。', pay(0.08, true), '需要0.08万元。'),
      c('national', '大夏学术年会 · 0.55万', '做报告，见同行。更适合已有成果后扩大影响。', pay(0.55, true), '需要0.55万元。'),
      c('international', '寰宇前沿大会 · 1.6万', '带着代表作进入更大共同体。声誉与合作机会更多。', pay(1.6, true) && s.stats.writing >= 35, '需要写作35与1.6万元。'),
      c('organize', '筹办青年学者论坛', '消耗2格时间与0.8万。提高院系支持与组织影响，科研时间会被挤占。', rank >= 3 && pay(0.8, true), '需要博士后及以上身份、0.8万元。', { cost: 2 }),
      ...list(DATA.conferences).filter(conf => conf.id && !['local', 'national', 'international', 'organize'].includes(conf.id)).map(conf => c(conf.id, `${conf.name} · ${conf.cost ?? conf.fee ?? 0.2}万`, `${conf.description || conf.theme || ''} 地点：${CITIES.find(city => city.id === (conf.cityId || conf.city))?.name || conf.city || '大夏'}。`, rank >= (conf.minRank || 0) && pay(conf.cost ?? conf.fee ?? 0.2, true), rank < (conf.minRank || 0) ? `至少需要${CAREERS[conf.minRank]?.name || '更多研究经验'}。` : '可用经费不足。')),
    ];
    const careerChoices = this.getCareerOptions().map(x => c(x.id, x.label, x.description, x.available, x.reason, { requirements: x.requirements }));
    const hatChoices = HATS.filter(h => h.id !== 'none').map(h => {
      const req = this._hatRequirements(h.id), reason = req.filter(r => !r.met).map(r => `${r.label}${r.current}/${r.target}`).join('；');
      const waiting = this._cooldown(`hat_${h.id}`);
      const already = HATS.findIndex(x => x.id === s.hat) >= HATS.findIndex(x => x.id === h.id);
      return c(h.id, `申报${h.name}`, `获得后：年津贴${h.allowance}万，新增科研支持${h.funding}万。称号与职称分别计算。`, !reason && !waiting && !already, already ? '已获得同级或更高称号。' : waiting ? `尚需等待${waiting}季。` : reason, { chance: this._hatChance(h.id), requirements: req });
    });
    const actions = [
      a('study', '读书与训练', '知识的积累，也会变成你提出问题的能力。', 'growth', [
        c('course', rank <= 2 ? '完成课程与学位训练' : '系统学习新领域', rank <= 2 ? '学识+5、学业进度+11、写作+2，压力+3。' : '学识+4、洞察+2、压力+2。'),
        c('deep', '精读经典与前沿', '洞察+5、学识+3、压力+4。慢一点，也可能读出新的问题。'),
        c('methods', '方法与学术写作', '写作+6、学识+2，学业进度+5。'),
      ]),
      a('research', '推进课题', p ? `当前重点：${p.name}。研究效率${Math.round(eff * 100)}%。` : '选择问题、建立课题，再收集可信的证据。', 'research', research),
      a('write', '整理与写作', '研究完成后，将证据写成清楚、可检验的论文。', 'research', [
        c('draft', '认真撰写稿件', '稿件进度提升约30%，写作能力提高，压力+4。', !!p && p.progress >= 70 && p.writing < 100, !p ? '尚无课题。' : '研究进度达到70%后可开始写作。'),
        c('polish', '打磨论证与图表', '稿件进度稍慢，证据表达与质量提升。', !!p && p.progress >= 70, '需要研究进度至少70%的课题。'),
        c('proposal', '打磨基金申请书', '下次基金评审材料加分，写作+3；最多累计3次。'),
      ]),
      a('submit', '论文投稿', '高水平期刊要求更强的证据与原创性。审稿需要等待，拒稿后可继续修改。', 'research', JOURNALS.map(j => c(j.id, `${j.name} · ${j.tier}`, `成果积分${j.score}，约${j.duration}季返回意见。质量参考线${j.threshold}；投稿费${j.fee}万。`, !!readyPaper && pay(j.fee, true), !readyPaper ? '需要一个研究与写作均达到100%的课题。' : '经费不足。', { chance: p ? this._acceptance(p, j) : 0 }))),
      a('grant', '申请科研资助', '科研处组织受理，大夏自然基金委与科技署评审。经费进入课题账户。', 'administration', grants),
      a('conference', '参加学术会议', '讲台、茶歇与晚餐，带来不同的相遇。', 'network', conferenceChoices),
      a('network', '同行与合作', '合作靠长期互信，也要选择值得投入的关系。', 'network', [c('collaborate', '与同事开放合作', '交换方法，互相复核。洞察、院系支持和共同体氛围提高。'), c('peer', '青年同事互助小组', '讨论教案与研究困境。减压，提高教学与团队互信。'), ...npcs.filter(n => n.id !== 'peer')]),
      a('teach', '教学与课程', '教学有独立的评价与回报。每年需要完成学时，晋升也看课堂表现。', 'teaching', [
        c('prepare', rank <= 2 ? '担任助教，准备习题课' : '备课与更新讲义', '提高课程质量、教学口碑与满意度；完成8学时准备工作。'),
        c('lecture', rank <= 2 ? '协助课堂与答疑' : '认真讲授一门课', '完成16学时，提升教学口碑与院系支持。备课充分时反馈更好。'),
        c('curriculum', '建设新课程', '投入2格时间，建立可持续的课程资源，显著提高教学声望。', rank >= 4, '正式教师可主持课程建设。', { cost: 2 }),
        c('minimum', '照本宣科完成任务', '快速完成24学时，但学生满意度与课程质量下降。'),
      ], 1, rank >= 1, '硕士阶段起，可以承担助教与课堂工作。'),
      a('mentor', '学生与课题组', '好团队能增长研究能力。学生需要时间、经费和尊重。', 'teaching', [
        c('recruit', '招收一名研究生', '个人每季额外支持0.03万，科研经费每季0.2万；学生积累后协助研究。', rank >= 5 && s.students.filter(x => !x.graduated).length < (rank >= 7 ? 8 : rank >= 6 ? 5 : 3) && s.funding >= 1, '需要讲师以上、有1万科研经费并且有招生名额。'),
        c('guide', '认真指导与共同讨论', '提升学生成长、满意度与团队产出，也增加教学口碑。', s.students.some(x => !x.graduated), '先招收一名研究生。'),
        c('push', '要求团队赶进度', '课题进度较快，学生满意度下降，增加团队风险。', s.students.some(x => !x.graduated) && !!p, '需要学生与在研课题。'),
        c('help', '公益答疑与朋辈辅导', '任何阶段都能帮助后来者。教学口碑、声誉与操守增加。'),
      ]),
      a('rest', '好好生活', '你的健康与兴趣，值得占据日程的一部分。', 'life', [
        c('walk', '散步、运动、好好睡觉', '压力-15、健康+8，不花钱。'),
        c('holiday', '给自己一次短假', '消耗0.35万，压力-25、健康+14、洞察+2。', pay(0.35), '存款至少0.35万。'),
        c('work', rank <= 2 ? '助研、兼职与勤工助学' : '公开咨询与科普兼职', '增加个人存款，压力+6。教师兼职须按规定登记。'),
        c('family', s.flags.family ? '留时间陪伴家人' : '经营亲密关系与生活', '减压并提高健康。长期有陪伴，生活也多一份责任。'),
        c('home', s.flags.ownedHome ? '改善居住环境' : '购置一套小公寓', s.flags.ownedHome ? '花费3万改善生活，压力-15。' : `花费${this._homePrice()}万，未来居住支出下降。`, pay(s.flags.ownedHome ? 3 : this._homePrice()), '存款尚不足以承担这项支出。'),
      ]),
      a('admin', '办理校内事务', '找对部门、准备完整材料，能减少科研与教学中的流程摩擦。', 'administration', [
        c('research', '科研处：申报预审与结题材料', '申报材料完善，科研处熟悉度+12，下一次基金评审加分。'),
        c('personnel', '人事处：整理聘期与晋升档案', '人事处熟悉度+12，院系支持+4；减少考核中的程序障碍。'),
        c('education', '教务处：确认课表与培养任务', '教务处熟悉度+12，教学质量+3，本年教学需求略减。'),
        c('finance', '财务处：报销与合规培训', '财务处熟悉度+12，流程负担与核查风险下降；有科研项目时获得合规补助。'),
        c('service', '参加院系治理与公共服务', '院系支持+9、同事关系改善、声誉+2；行政负担+5。'),
      ]),
      a('evaluate', '院系考核与职责', '评价标准影响时间分配。科研、教学与公共服务都有价值。', 'administration', [
        c('balanced', '争取科研教学并重评价', '需要院系支持55，改善共同体氛围与教学认同。', s.department.support >= 55, '院系支持至少55。'),
        c('representative', '推动代表作与开放科学', '需要学术声誉30与操守75，减少四唯压力；同事间也可能有争论。', s.stats.reputation >= 30 && s.stats.integrity >= 75, '声誉至少30、操守至少75。'),
        c('numbers', '接受论文与帽子指标', '立即获得院系支持，但教学被弱化，长期压力更大。'),
        c('chair', '竞聘系主任', '需要副教授、院系支持70、人脉50。年津贴+6万，每季增加行政压力。', rank >= 6 && s.department.support >= 70 && s.stats.network >= 50 && !s.flags.adminAppointment, '需要副教授、支持70、人脉50，且尚无行政职务。'),
      ], 1, rank >= 4, '正式教师可参与院系制度与治理。'),
      a('job', '学位与岗位', '学位、岗位、教学能力与代表作共同决定下一步。', 'career', careerChoices),
      a('hat', '人才称号与荣誉', '优青、杰青和院士分别提供不同支持，也带来更高期待。', 'career', hatChoices),
      a('relocate', '寻找另一座城市', '城市改变薪资、生活成本、合作密度与研究条件。搬迁消耗时间与存款。', 'career', CITIES.map(city => c(city.id, `${city.name} · ${city.university}`, `生活支出系数${city.costOfLiving}，薪资系数${city.salaryMultiplier}，搬迁${city.relocationCost}万。`, city.id !== s.cityId && pay(city.relocationCost), city.id === s.cityId ? '你已经在这座城市。' : '存款不足以搬迁。'))),
      a('equipment', '平台与设备', '仪器与共享平台可以提高效率，采购走科研经费。', 'research', [
        c('shared', '申请共享平台机时', '花费1.5万，设备水平+1，最多5级；研究效率略有提高。', s.equipment < 5 && pay(1.5, true), '设备已达5级或经费不足。'),
        c('purchase', '采购并维护实验设备', '花费8万，设备水平+2，需熟悉财务流程。', s.equipment < 5 && pay(8, true) && s.administration.finance >= 55, '需要8万与财务处熟悉度55。'),
      ]),
      a('deal', '权力、人情与边界', '有些捷径留下看不见的欠条。选项会明确显示操守与核查风险的代价。', 'network', [
        c('decline', '坚持公开合作，婉拒利益交换', '操守+4，风险-4，慢慢积累可信的关系。'),
        c('patron', '攀附强势学术山头', '人脉+10、院系支持+8；操守-9、核查风险+12，可能被卷入派系争夺。', rank >= 2, '博士阶段开始才接近这些圈子。'),
        c('authorship', '接受交换署名的邀约', '获得一篇低质量论文与人情；操守-16、核查风险+23。未来可能撤稿。', rank >= 2, '需要博士及以上身份。'),
        c('embezzle', '把科研支出转入私人账目', '科研经费-5万、存款+3万；操守-25、核查风险+36。审计可能追缴并停职。', s.funding >= 5 && rank >= 4, '需要正式教职与5万科研经费。'),
        c('report', '实名报告程序问题', '操守+6、风险-5，可能改善院系，也可能遭遇关系压力。', s.stats.integrity >= 55, '操守至少55。'),
      ]),
    ];
    return actions;
  }

  _require(label, current, target, compare = '>=') { return { label, current: round(current), target, met: compare === '<=' ? current <= target : current >= target }; }
  getCareerOptions() {
    const s = this.state, rank = this.career.rank, t = s.quarter - s.careerSince, score = this.paperScore;
    const req = [], add = (label, current, target) => req.push(this._require(label, current, target));
    let next = CAREERS[rank + 1];
    if (next) {
      add('现阶段季度', t, this.career.minQuarters);
      if (rank <= 2) { add('学业进度', s.degreeProgress, 100); add('学识', s.stats.knowledge, [38, 50, 62][rank]); }
      if (rank === 1) add('成果积分', score, 1.5);
      if (rank === 2) { add('成果积分', score, 8); add('洞察', s.stats.insight, 40); }
      if (rank === 3) { add('成果积分', score, 12); add('学术声誉', s.stats.reputation, 18); }
      if (rank === 4) { add('成果积分', score, s.flags.teachingTrack ? 8 : 14); add('教学口碑', s.teaching.reputation, s.flags.teachingTrack ? 30 : 15); add('院系支持', s.department.support, 42); }
      if (rank === 5) { add('成果积分', score, s.flags.teachingTrack ? 12 : 24); add('学术声誉', s.stats.reputation, s.flags.teachingTrack ? 25 : 35); add('教学口碑', s.teaching.reputation, s.flags.teachingTrack ? 65 : 28); if (!s.flags.teachingTrack) add('获批项目', s.metrics.grantsWon, 2); else add('培养学生', s.metrics.studentsMentored, 2); add('院系支持', s.department.support, 48); }
      if (rank === 6) { add('成果积分', score, s.flags.teachingTrack ? 24 : 50); add('学术声誉', s.stats.reputation, s.flags.teachingTrack ? 40 : 55); add('教学口碑', s.teaching.reputation, s.flags.teachingTrack ? 85 : 42); add('培养学生', s.metrics.studentsMentored, s.flags.teachingTrack ? 6 : 2); add('院系支持', s.department.support, 55); }
      if (rank >= 3) add('学术操守', s.stats.integrity, 42);
    }
    const options = [];
    if (next) {
      const waiting = this._cooldown('job');
      const failed = req.filter(r => !r.met);
      options.push({ id: 'advance', label: `申请${next.name}`, name: next.name, description: `前往${rank <= 2 ? '研究生院' : '人事处'}递交申请。达到明确门槛后，通过正式考核进入下一阶段。`, available: !failed.length && !waiting, reason: waiting ? `人事处复核材料尚需${waiting}季。` : failed.map(r => `${r.label} ${r.current}/${r.target}`).join('；'), requirements: req, careerId: next.id });
    }
    if (rank === 3) {
      const directReq = [this._require('博士后季度', t, 8), this._require('成果积分', score, 20), this._require('学术声誉', s.stats.reputation, 28), this._require('教学口碑', s.teaching.reputation, 10)];
      options.push({ id: 'direct_lecturer', label: '竞聘讲师岗位', name: '讲师', description: '成果与教学准备充足时，可从博士后直接竞聘讲师。', available: directReq.every(r => r.met), reason: directReq.filter(r => !r.met).map(r => `${r.label} ${r.current}/${r.target}`).join('；'), requirements: directReq, careerId: 'lecturer' });
    }
    if (rank >= 2) options.push({ id: 'industry', label: '转向企业研发，结束此卷', name: '企业研发', description: '把研究训练带到另一种职业生活。选择后进入人生结局。', available: true, requirements: [] });
    if (rank >= 4) options.push({ id: 'teaching_track', label: '转入教学为主岗位', name: '教学岗', description: '科研门槛降低，晋升更看重课堂与育人；工资略降，聘期压力缓解。', available: !s.flags.teachingTrack, reason: s.flags.teachingTrack ? '已经选择教学为主岗位。' : '', requirements: [] });
    if (s.age >= 55) options.push({ id: 'retire', label: '申请退休，整理这一生', name: '退休', description: '在自选的时刻结束学术职业，看看留下了什么。', available: true, requirements: [] });
    return options;
  }
  _hatRequirements(id) {
    const s = this.state, rank = this.career.rank, r = (label, current, target, op) => this._require(label, current, target, op);
    if (id === 'provincial') return [r('年龄上限', s.age, 38, '<='), r('岗位等级', rank, 3), r('成果积分', this.paperScore, 12), r('学术声誉', s.stats.reputation, 22), r('获批项目', s.metrics.grantsWon, 1), r('学术操守', s.stats.integrity, 60)];
    if (id === 'young') return [r('年龄上限', s.age, 40, '<='), r('岗位等级', rank, 5), r('成果积分', this.paperScore, 28), r('学术声誉', s.stats.reputation, 40), r('获批项目', s.metrics.grantsWon, 2), r('学术操守', s.stats.integrity, 65)];
    if (id === 'river') return [r('年龄上限', s.age, 50, '<='), r('岗位等级', rank, 6), r('成果积分', this.paperScore, 45), r('学术声誉', s.stats.reputation, 58), r('获批项目', s.metrics.grantsWon, 3), r('教学口碑', s.teaching.reputation, 40), r('学术操守', s.stats.integrity, 65)];
    if (id === 'distinguished') return [r('年龄上限', s.age, 48, '<='), r('岗位等级', rank, 6), r('成果积分', this.paperScore, 65), r('学术声誉', s.stats.reputation, 67), r('获批项目', s.metrics.grantsWon, 4), r('原创突破', s.metrics.breakthroughs, 1), r('学术操守', s.stats.integrity, 68)];
    if (id === 'leader') return [r('年龄上限', s.age, 58, '<='), r('岗位等级', rank, 6), r('成果积分', this.paperScore, 85), r('学术声誉', s.stats.reputation, 75), r('获批项目', s.metrics.grantsWon, 5), r('原创突破', s.metrics.breakthroughs, 2), r('培养学生', s.metrics.studentsMentored, 3), r('学术操守', s.stats.integrity, 70)];
    return [r('年龄', s.age, 45), r('岗位等级', rank, 7), r('成果积分', this.paperScore, 115), r('学术声誉', s.stats.reputation, 87), r('原创突破', s.metrics.breakthroughs, 3), r('培养学生', s.metrics.studentsMentored, 5), r('学术操守', s.stats.integrity, 78)];
  }
  _hatChance(id) { const s = this.state; return clamp(0.25 + s.stats.network / 350 + s.department.support / 500 + (s.stats.reputation - 50) / 350 + (s.difficulty === 'easy' ? 0.1 : s.difficulty === 'hard' ? -0.08 : 0), 0.12, id === 'academician' ? 0.72 : 0.85); }
  _grantScore(g) { const s = this.state; return s.stats.knowledge * 0.2 + s.stats.insight * 0.25 + s.stats.writing * 0.2 + Math.min(this.paperScore, 100) * 0.2 + s.stats.reputation * 0.1 + s.stats.network * 0.05 + (s.flags.proposalDrafts || 0) * 4 + (s.flags.adminPrepared ? 5 : 0) + (s.administration.research - 45) / 10 + (s.difficulty === 'easy' ? 7 : s.difficulty === 'hard' ? -7 : 0); }
  _acceptance(p, j) { return clamp(0.65 + (p.quality - j.threshold) / 70 + (p.novelty - 50) / 250, 0.08, 0.95); }
  _homePrice() { return round(26 * this.city.costOfLiving); }

  act(actionId, payload = {}) {
    if (actionId === 'career' || actionId === 'promotion') actionId = 'job';
    const action = this.getActions().find(a => a.id === actionId);
    if (!action) return this._result(false, '没有这项行动。');
    if (!action.available) return this._result(false, action.reason);
    const choiceId = payload.choiceId ?? payload.choice ?? action.choices.find(c => c.available && c.cost <= this.state.ap)?.id;
    const choice = action.choices.find(c => c.id === choiceId);
    if (!choice) return this._result(false, '请选择一个有效的行动方案。');
    if (!choice.available) return this._result(false, choice.reason || '当前条件不足。');
    const cost = choice.cost ?? action.cost;
    if (this.state.ap < cost) return this._result(false, '本季剩余时间不足。');
    const logStart = this.state.logs.length;
    this.state.ap -= cost;
    const message = this._execute(actionId, choiceId, payload);
    this.state.flags.annualActions[actionId] = (this.state.flags.annualActions[actionId] || 0) + cost;
    this._sync();
    this._log(message, ['job', 'hat'].includes(actionId) ? 'milestone' : 'action');
    this._checkHealth();
    return this._result(true, message, this.state.logs.slice(logStart));
  }

  _execute(id, choice, payload) {
    const s = this.state, rank = this.career.rank, eff = this._efficiency(), p = this.activeProject;
    if (id === 'study') {
      if (choice === 'course') { this._effects({ knowledge: (rank <= 2 ? 5 : 4) * eff, writing: rank <= 2 ? 2 : 0, insight: rank > 2 ? 2 : 0, degreeProgress: rank <= 2 ? 11 * eff : 0, stress: 3 }); return rank <= 2 ? '你认真完成课程、作业与学位训练。看似普通的一堂课，也在为独立研究铺路。' : '你系统学习了一个新领域。知识的边界，又往外扩了一点。'; }
      if (choice === 'deep') { this._effects({ knowledge: 3 * eff, insight: 5 * eff, degreeProgress: rank <= 2 ? 4 : 0, stress: 4 }); return '你精读经典，又顺着参考文献走到前沿。一个脚注里的问题，让你想了很久。'; }
      this._effects({ writing: 6 * eff, knowledge: 2, degreeProgress: rank <= 2 ? 5 : 0, stress: 2 }); return '你练习方法与学术表达。把一句话写清楚，往往也让自己的想法清楚了一些。';
    }
    if (id === 'research') {
      if (choice.startsWith('focus_')) { s.activeProjectId = choice.slice(6); return `你将重点转向「${this.activeProject.name}」。`; }
      if (choice.startsWith('new_')) {
        const type = choice.slice(4), topics = FIELD_TOPICS[s.fieldId]?.[type] || TOPICS[type], name = topics[Math.floor(this._random() * topics.length)];
        const project = { id: this._id('project'), name, topic: name, description: `${list(DATA.fields).find(f => f.id === s.fieldId)?.name || '跨学科'}方向的${type === 'frontier' ? '原创探索' : type === 'hot' ? '热点研究' : '基础课题'}。`, field: list(DATA.fields).find(f => f.id === s.fieldId)?.name || '基础研究', fieldId: s.fieldId, type, progress: 0, writing: 0, quality: 22 + s.stats.knowledge * 0.35, rigor: 45 + s.stats.integrity * 0.25, novelty: type === 'frontier' ? 78 : type === 'hot' ? 42 : 52, status: '在研', startedQuarter: s.quarter, cost: 0, risk: 0, breakthroughs: 0 };
        s.projects.push(project); s.activeProjectId = project.id; this._effects({ insight: 2, stress: 2 });
        return `新课题「${name}」立项。${type === 'frontier' ? '这条路不保证成功，却可能回答一个别人没有认真问过的问题。' : type === 'hot' ? '同一赛道上已经有不少团队，速度与辨识度都很重要。' : '先把可行的问题做扎实。'}`;
      }
      const team = Math.min(0.4, s.students.filter(st => !st.graduated).reduce((a, st) => a + st.progress / 1500, 0));
      const base = (18 + s.stats.knowledge * 0.12 + s.equipment * 1.5) * eff * this.city.researchBonus * (1 + team) * (p.type === 'frontier' ? 0.8 : p.type === 'hot' ? 1.15 : 1);
      let note = '';
      if (choice === 'experiment') { this._cost(0.25, true); p.progress = clamp(p.progress + base); p.quality = clamp(p.quality + 4 * eff); p.rigor = clamp(p.rigor + 2); this._effects({ knowledge: 1.6, insight: 1.2, stress: 5 }); }
      if (choice === 'explore') {
        this._cost(0.35, true); p.progress = clamp(p.progress + base * 0.72); p.novelty = clamp(p.novelty + 6); p.quality = clamp(p.quality + 4.5 * eff); this._effects({ insight: 3, stress: 5 });
        if (this._random() < (0.06 + s.stats.insight / 650 + (p.type === 'frontier' ? 0.08 : 0))) { p.breakthroughs++; s.metrics.breakthroughs++; p.quality = clamp(p.quality + 9); p.novelty = clamp(p.novelty + 10); this._effects({ reputation: 3, insight: 3 }); note = ' 你从一个反常结果里找到了新的机制，记下了一次原创突破。'; }
      }
      if (choice === 'replicate') { this._cost(0.15, true); p.progress = clamp(p.progress + base * 0.38); p.rigor = clamp(p.rigor + 14); p.quality = clamp(p.quality + 5); p.risk = Math.max(0, p.risk - 8); s.metrics.honestReplications++; this._effects({ integrity: 2, risk: -3, stress: 2 }); }
      if (choice === 'shortcut') { p.progress = clamp(p.progress + base * 1.8); p.rigor = clamp(p.rigor - 14); p.quality = clamp(p.quality - 3); p.risk += 15; this._effects({ integrity: -7, risk: 9, stress: 7 }); note = ' 有几条不合预期的数据被你留在了草稿箱里。'; }
      p.cost = round(p.cost + (choice === 'explore' ? 0.35 : choice === 'replicate' ? 0.15 : choice === 'experiment' ? 0.25 : 0));
      s.flags.researchThisQuarter = true; s.metrics.annualResearch++;
      if (p.progress >= 100) p.status = p.writing >= 100 ? '待投稿' : '写作中';
      return `「${p.name}」研究进度${round(p.progress)}%，证据质量${round(p.quality)}，严谨性${round(p.rigor)}。${p.progress >= 100 ? '研究告一段落，接下来需要把成果写清楚。' : ''}${note}`;
    }
    if (id === 'write') {
      if (choice === 'proposal') { s.flags.proposalDrafts = Math.min(3, (s.flags.proposalDrafts || 0) + 1); this._effects({ writing: 3, stress: 3 }); return `你打磨了问题、技术路线与预算。下一份基金申请的材料准备达到${s.flags.proposalDrafts}/3级。`; }
      const gain = (choice === 'polish' ? 20 : 27) + s.stats.writing * 0.14;
      p.writing = clamp(p.writing + gain * eff); p.quality = clamp(p.quality + (choice === 'polish' ? 5 : 1.5));
      if (choice === 'polish') p.rigor = clamp(p.rigor + 3);
      this._effects({ writing: choice === 'polish' ? 2.5 : 2, stress: 4, degreeProgress: rank <= 2 ? 3 : 0 });
      if (p.progress >= 100 && p.writing >= 100) p.status = '待投稿';
      return `你${choice === 'polish' ? '重新梳理论证、打磨图表' : '把实验记录写成连贯的稿件'}。「${p.name}」写作进度${round(p.writing)}%。${p.writing >= 100 && p.progress >= 100 ? '可以选择合适的期刊投稿了。' : ''}`;
    }
    if (id === 'submit') {
      const j = JOURNALS.find(x => x.id === choice); this._cost(j.fee, true);
      p.status = '审稿中'; p.journalId = j.id;
      const sub = { id: this._id('submission'), projectId: p.id, title: p.name, journal: j.name, journalId: j.id, tier: j.tier, submittedQuarter: s.quarter, dueQuarter: s.quarter + j.duration, chance: this._acceptance(p, j), status: '外审中' };
      s.submissions.push(sub); s.activeProjectId = s.projects.find(x => x.status === '在研')?.id || null;
      this._effects({ stress: 2 }); return `「${p.name}」已投往${j.name}。预计${j.duration}季后收到意见。投稿不保证录用，可信的证据会在长期得到回报。`;
    }
    if (id === 'grant') {
      const g = GRANTS.find(x => x.id === choice), score = this._grantScore(g), chance = clamp(0.3 + (score - g.threshold) / 100, 0.08, 0.88), won = this._random() < chance;
      s.flags.cooldowns[`grant_${g.id}`] = s.quarter + (won ? g.cooldown : 4); s.flags.proposalDrafts = 0; s.flags.adminPrepared = false; this._effects({ writing: 2, stress: 6 });
      if (!won) { this._effects({ stress: 3, insight: 1 }); return `${g.name}未获资助。意见认为${score < g.threshold ? '前期积累与问题论证仍需加强' : '方案有价值，但本轮竞争激烈'}。你保留了申请经验，4季后可再试。`; }
      s.funding += g.amount; s.metrics.grantsWon++; this._effects({ reputation: g.id === 'key' ? 7 : g.id === 'general' ? 4 : 2, departmentSupport: 3 });
      s.grants.push({ id: this._id('grant'), type: g.id, name: g.name, agency: g.agency, amount: g.amount, remaining: g.duration, duration: g.duration, startsQuarter: s.quarter, endsQuarter: s.quarter + g.duration, startScore: this.paperScore, startStudents: s.metrics.studentsMentored, target: g.id === 'key' ? 18 : g.id === 'general' ? 9 : g.id === 'youth' ? 5 : g.id === 'student' ? 1.5 : 3.5, status: '执行中' });
      return `${g.name}获批，${g.amount}万元进入科研账户，执行${g.duration}季。${g.agency}提醒你：按期完成研究，注意结题材料与公私账目。`;
    }
    if (id === 'conference') {
      const meeting = list(DATA.conferences).find(conf => conf.id === choice);
      if (meeting) {
        this._cost(meeting.cost ?? meeting.fee ?? 0.2, true); this._effects(meeting.effects || { network: 3, insight: 2 }); s.metrics.conferenceCount++;
        if (choice === 'teaching') { s.teaching.reputation += 4; s.teaching.quality += 3; }
        if (choice === 'methods' && p) { p.rigor = clamp(p.rigor + 6); p.quality = clamp(p.quality + 2); }
        if (choice === 'industry') s.department.support += 3;
        return `你参加了${meeting.name}。${meeting.theme || '几场认真讨论，让你带着新问题回到校园。'}${choice === 'methods' ? '复现训练也让当前课题的证据更可靠。' : choice === 'teaching' ? '你带回了可用于课堂的案例与教案。' : ''}`;
      }
      const cfg = { local: [0.08, 3, 2, 1], national: [0.55, 6, 3, 2], international: [1.6, 8, 5, 4], organize: [0.8, 8, 2, 4] }[choice];
      this._cost(cfg[0], true); this._effects({ network: cfg[1] * this.city.networkBonus, insight: cfg[2], reputation: cfg[3] + (this.paperScore >= 15 ? 1 : 0), stress: choice === 'organize' ? 9 : 2 }); s.metrics.conferenceCount++;
      if (choice === 'organize') { s.department.support += 8; s.administration.burden += 5; }
      if (p && this._random() < 0.35) { p.novelty = clamp(p.novelty + 3); p.quality = clamp(p.quality + 2); }
      return { local: '院系沙龙上，你被问到了一个尖锐却有帮助的问题。散会后，同行留下了继续讨论的联系方式。', national: '你在大夏学术年会作了报告。茶歇里聊起的新思路，比名片上的头衔更让你记得住。', international: '寰宇前沿大会让你看到了更大的问题版图。认真回应质疑，也让别人记住了你的工作。', organize: '论坛顺利结束。你认识了很多人，也处理了很多接机、报销与临时变动。院系记住了你的付出。' }[choice];
    }
    if (id === 'network') {
      if (choice === 'collaborate') { this._effects({ insight: 3, network: 3, integrity: 1, departmentSupport: 4, stress: 1 }); s.department.climate += 3; if (p) { p.quality = clamp(p.quality + 3); p.rigor = clamp(p.rigor + 3); } for (const col of s.colleagues) { const rel = s.relationships[col.id]; if (rel) { rel.trust = clamp(rel.trust + 4); rel.affinity = rel.trust; rel.lastContact = s.quarter; col.trust = rel.trust; col.relation = rel.trust; } } return '你与同事交换方法、共享记录，把合作条件与署名原则说在前面。共同体的互信，也是一种研究资源。'; }
      if (choice === 'peer') { this._effects({ network: 3, stress: -7, teachingQuality: 3 }); s.department.climate += 4; return '几位青年同事围在一起，聊研究、教案和那些没写进考核表的疲惫。你带着两条建议和一点轻松离开。'; }
      const npc = ENGINE_DATA.npcs.find(n => n.id === choice), rel = s.relationships[choice] || { trust: 0, favors: 0 };
      const repeat = rel.lastContact === s.quarter ? 0.45 : 1;
      rel.trust = clamp(rel.trust + 9 * repeat); rel.affinity = rel.trust; rel.lastContact = s.quarter; s.relationships[choice] = rel;
      this._effects({ network: 4 * repeat, insight: /导师|教授|研究/.test(npc?.role || '') ? 2 : 1, stress: 1 });
      if (/院长|主任|行政|人事/.test(npc?.role || '')) s.department.support += 3 * repeat;
      const colleague = s.colleagues.find(n => n.id === choice); if (colleague) { colleague.trust = rel.trust; colleague.relation = clamp(colleague.relation + 8 * repeat); }
      return `你与${npc?.name || '同行'}认真交流了一次。互信达到${round(rel.trust)}。${repeat < 1 ? '本季已经见过，关系需要时间沉淀。' : '长期往来，往往从一次真诚的讨论开始。'}`;
    }
    if (id === 'teach') {
      let hours = choice === 'lecture' ? 16 : choice === 'minimum' ? 24 : choice === 'curriculum' ? 24 : 8;
      if (choice === 'prepare') { this._effects({ teachingQuality: 7, studentSatisfaction: 3, teachingReputation: 3, knowledge: 1, stress: 3 }); s.flags.preparedLecture = true; }
      if (choice === 'lecture') { const good = s.flags.preparedLecture || s.teaching.quality >= 70; this._effects({ teachingReputation: good ? 6 : 3.5, studentSatisfaction: good ? 5 : -1, departmentSupport: 4, stress: 5, knowledge: 1 }); s.flags.preparedLecture = false; }
      if (choice === 'curriculum') { this._effects({ teachingQuality: 10, teachingReputation: 9, studentSatisfaction: 6, departmentSupport: 6, stress: 7 }); const course = { id: this._id('course'), name: `${list(DATA.fields).find(f => f.id === s.fieldId)?.name || '科学'}专题：从问题到证据`, quality: round(s.teaching.quality), students: 25 + Math.floor(this._random() * 25), hours: 32, description: '结合真实研究案例的新课程，教材与习题持续开放更新。' }; s.teaching.courses.push(course); }
      if (choice === 'minimum') { this._effects({ teachingQuality: -7, teachingReputation: -2, studentSatisfaction: -10, stress: 2 }); }
      if (!s.teaching.courses.length && choice === 'lecture') s.teaching.courses.push({ id: this._id('course'), name: rank <= 2 ? '基础课程习题与答疑' : '研究方法导论', quality: round(s.teaching.quality), students: 32, hours, description: '每次课，都会遇到新的提问。' });
      s.teaching.hours += hours; s.teaching.quarterHours += hours; s.teaching.yearHours += hours; s.teaching.credits += hours / 8; s.metrics.annualTeaching += hours; s.flags.taughtThisQuarter = true;
      s.department.support += choice === 'minimum' ? -2 : 2;
      return `${choice === 'minimum' ? '你按时完成了课表上的任务，学生却觉得课堂少了些什么。' : choice === 'curriculum' ? '你把研究中的案例变成了一门新课。课程资源会在未来继续发挥作用。' : choice === 'prepare' ? '你重写讲义、试做习题，也提前想了学生最可能卡住的地方。' : '讲台上的一个追问，提醒你：让别人理解，才是真正理解的考验。'} 本年累计教学${s.teaching.yearHours}学时，教学口碑${round(s.teaching.reputation)}。`;
    }
    if (id === 'mentor') {
      if (choice === 'recruit') { const names = ['陈星野', '姚书宁', '苏问舟', '林未迟', '顾知夏', '江明澈', '唐见微', '叶望舒']; const student = { id: this._id('student'), name: names[s.students.length % names.length], progress: 0, satisfaction: 72, joinedQuarter: s.quarter, degree: '硕士', graduated: false }; s.students.push(student); s.teaching.students = s.students.length; this._effects({ stress: 3, reputation: 1 }); return `${student.name}加入课题组。学生会协助长期研究，也需要你投入指导、经费和关心。`; }
      if (choice === 'help') { this._effects({ teachingReputation: 3, integrity: 1.5, reputation: 1.2, stress: 1 }); return '你耐心回答了几个看起来很基础的问题。有些问题，自己当年也希望有人认真回答。'; }
      if (choice === 'guide') { for (const st of s.students.filter(x => !x.graduated)) { st.progress = clamp(st.progress + 18); st.satisfaction = clamp(st.satisfaction + 7); } this._effects({ teachingReputation: 4, studentSatisfaction: 4, insight: 2, stress: 3 }); if (p) p.progress = clamp(p.progress + 8); return '组会上，你认真听完了学生的推理，再一起拆解问题。学生的成长，也让团队多了一种看法。'; }
      for (const st of s.students.filter(x => !x.graduated)) { st.progress = clamp(st.progress + 10); st.satisfaction = clamp(st.satisfaction - 13); }
      p.progress = clamp(p.progress + 22); this._effects({ teachingReputation: -3, studentSatisfaction: -8, risk: 5, stress: 4 }); return '团队在催促下赶出了进度。学生的沉默与疲惫，也写在了组会记录之外。';
    }
    if (id === 'rest') {
      if (choice === 'walk') { this._effects({ stress: -15, health: 8 }); return '你关上电脑，去校园里走了一圈，晚上早一点睡。明天的问题，留给明天的自己。'; }
      if (choice === 'holiday') { this._cost(0.35); this._effects({ stress: -25, health: 14, insight: 2 }); return '你给生活放了一个短假。远离邮箱之后，一个想不通的问题反倒有了轮廓。'; }
      if (choice === 'work') { const gain = rank <= 2 ? 0.65 + s.stats.knowledge / 160 : 1.1 + s.stats.reputation / 70; s.money += gain; this._effects({ stress: 6, network: 1 }); return `你完成了${rank <= 2 ? '助研与勤工助学' : '合规登记的公开咨询与科普工作'}，获得${round(gain)}万元个人收入。`; }
      if (choice === 'family') { s.flags.familyVisits = (s.flags.familyVisits || 0) + 1; if (s.flags.familyVisits >= 5) s.flags.family = true; this._effects({ stress: -16, health: 6, reputation: 0.3 }); return s.flags.family ? '你留出时间陪伴家人。生活有更多责任，也有了可以慢慢说话的人。' : '你给朋友、爱人与家人留出了时间。学术履历之外，日子也在认真地过。'; }
      this._cost(s.flags.ownedHome ? 3 : this._homePrice()); s.flags.ownedHome = true; this._effects({ stress: -15, health: 4 }); return '你终于有了一处更安稳的住处。未来生活支出会下降，书架也有了自己的位置。';
    }
    if (id === 'admin') {
      if (choice === 'service') { s.department.support += 9; s.department.climate += 2; s.administration.burden += 5; this._effects({ reputation: 2, stress: 4, network: 2 }); return '你参加招生、公共平台与院系治理。那些不直接变成论文的工作，也让校园继续运转。'; }
      s.administration[choice] += 12; s.administration.burden -= 8; this._effects({ stress: 2 });
      if (choice === 'research') { s.flags.adminPrepared = true; this._effects({ writing: 1 }); }
      if (choice === 'personnel') { s.department.support += 4; s.flags.personnelPrepared = true; }
      if (choice === 'education') { s.flags.educationPreparedYear = s.year; s.teaching.quality += 3; }
      if (choice === 'finance') { this._effects({ risk: -5, integrity: 1 }); if (s.grants.some(g => g.status === '执行中')) s.funding += 0.8; }
      return { research: '科研处预审了你的技术路线与预算。你补齐附件，下一次申报会少一些程序上的遗憾。', personnel: '人事处核对了你的聘期、教学与代表作档案。下一步需要什么，现在更清楚了。', education: '你与教务处确认了课表、培养任务和调课规则。本年度的教学安排更从容了一点。', finance: '你整理发票、核对预算，学会了报销与采购规则。合规管理降低了未来核查风险。' }[choice];
    }
    if (id === 'evaluate') {
      if (choice === 'balanced') { s.department.evaluation = '科研与教学并重'; s.department.climate += 8; this._effects({ stress: -4, teachingReputation: 3 }); return '你推动院系同时看待科研、课堂与公共服务。制度改变很慢，但这次例会上多了一些不同的声音。'; }
      if (choice === 'representative') { s.department.evaluation = '代表作与开放科学'; s.department.climate += 12; s.department.rivalry -= 5; this._effects({ integrity: 3, stress: -5, reputation: 3 }); return '院系开始用代表作、开放记录与长期贡献讨论学术。四唯的惯性仍在，至少考核表多了一扇窗。'; }
      if (choice === 'numbers') { s.department.evaluation = '论文、项目、帽子指标'; s.department.support += 10; this._effects({ stress: 7, integrity: -2 }); return '你承诺按论文、项目与人才帽子的指标完成任务。资源暂时更近，时间也被切得更细。'; }
      s.flags.adminAppointment = true; s.administration.burden += 20; s.stats.network += 8; s.department.support += 8; return '你当选系主任。年津贴增加6万元，公共事务与协调责任也进入了每一个季度。';
    }
    if (id === 'job') {
      if (choice === 'industry') { this._finish('industry'); return '你决定把研究训练带到企业研发。熟悉的问题之外，还有另一种生活的可能。'; }
      if (choice === 'retire') { this._finish('retire'); return '你提交了退休申请，开始整理这一生的课程、数据与手稿。'; }
      if (choice === 'teaching_track') { s.flags.teachingTrack = true; s.flags.tenureDeadline = null; s.department.evaluation = '教学与学生培养'; this._effects({ stress: -12, teachingReputation: 5 }); return '你选择教学为主岗位。接下来，课堂、课程建设与学生成长会成为更重要的晋升依据。'; }
      const old = this.career, next = choice === 'direct_lecturer' ? CAREERS[5] : CAREERS[old.rank + 1];
      s.career = next.id; s.careerSince = s.quarter; s.degreeProgress = 0; s.flags.cooldowns.job = s.quarter + 1;
      if (old.rank <= 2) { const degree = ['bachelor', 'master', 'doctor'][old.rank]; if (!s.flags.degrees.includes(degree)) s.flags.degrees.push(degree); }
      if (next.rank >= 4) s.teaching.load = next.rank === 4 ? 24 : 32;
      if (next.id === 'lecturer') { s.flags.tenureDeadline = s.quarter + 24; s.funding += 12; }
      if (next.rank >= 6) { s.flags.tenureDeadline = null; s.flags.probationStrikes = 0; }
      this._effects({ reputation: next.rank <= 3 ? 3 : 5, stress: -6, departmentSupport: 4 });
      s.history.push({ quarter: s.quarter, type: 'career', from: old.id, to: next.id, text: `成为${next.name}` });
      return `考核通过！你从${old.name}进入${next.name}阶段。${next.rank <= 2 ? '新的课程、研究与同行，正在前面等你。' : next.id === 'lecturer' ? '12万元启动经费到账，六年聘期考核开始。' : '职责增加，收入与研究空间也随之变化。'}`;
    }
    if (id === 'hat') {
      const h = HATS.find(x => x.id === choice), won = this._random() < this._hatChance(choice);
      s.flags.cooldowns[`hat_${choice}`] = s.quarter + (choice === 'academician' ? 8 : 4); this._effects({ stress: 8 });
      if (!won) { this._effects({ reputation: 1, stress: 3 }); return `${h.name}评审未入选。材料获得了一些肯定，也有同行认为代表作还需时间证明。${choice === 'academician' ? '8' : '4'}季后可以再议。`; }
      s.hat = h.id; s.hatSince = s.quarter; s.funding += h.funding; this._effects({ reputation: choice === 'academician' ? 8 : 6, departmentSupport: 10 });
      s.history.push({ quarter: s.quarter, type: 'hat', hat: h.id, text: `获得${h.name}` });
      return `你入选${h.name}！年津贴增加到${h.allowance}万元，${h.funding}万元研究支持进入科研账户。称号没有替你回答问题，它给了你继续追问的时间。`;
    }
    if (id === 'relocate') {
      const target = CITIES.find(x => x.id === choice); this._cost(target.relocationCost); s.cityId = target.id; this._effects({ stress: 8, network: -4 }); s.department.support = Math.max(35, s.department.support - 10); s.history.push({ quarter: s.quarter, type: 'relocate', cityId: target.id, text: `迁往${target.name}` });
      return `你搬到${target.name}，加入${target.university}。生活成本、薪资与研究环境都发生了变化，一些关系也需要重新建立。`;
    }
    if (id === 'equipment') { const purchase = choice === 'purchase'; this._cost(purchase ? 8 : 1.5, true); s.equipment = Math.min(5, s.equipment + (purchase ? 2 : 1)); this._effects({ stress: 2 }); return `你${purchase ? '完成采购并建立维护记录' : '获得共享平台机时'}。研究平台达到${s.equipment}/5级，今后的实验效率会提高。`; }
    if (id === 'deal') {
      if (choice === 'decline') { this._effects({ integrity: 4, risk: -4, network: 1 }); return '你婉拒利益交换，提出把合作内容与贡献公开说明。有人觉得你不够圆滑，也有人记住了你的底线。'; }
      if (choice === 'patron') { this._effects({ network: 10, departmentSupport: 8, integrity: -9, risk: 12, stress: 5 }); s.department.rivalry += 8; s.flags.patronDebt = (s.flags.patronDebt || 0) + 1; return '强势学术山头把你纳入圈子。资源与邀约多了，派系的人情债也多了一笔。'; }
      if (choice === 'authorship') { this._effects({ network: 4, reputation: 2, integrity: -16, risk: 23 }); s.papers.push({ id: this._id('paper'), title: '署名交换：多团队联合研究', tier: '学科核心', venue: 'specialist', journal: '《格物研究》', score: 3.5, quality: 34, citations: 0, status: '已发表', publishedQuarter: s.quarter, quarter: s.quarter, year: s.year, risk: 45, fraudulent: true }); s.metrics.papersPublished++; return '你的名字出现在一篇未真正参与研究的论文上。履历多了一行，也多了一项可能被追问的责任。'; }
      if (choice === 'embezzle') { s.funding -= 5; s.money += 3; s.flags.embezzled = (s.flags.embezzled || 0) + 3; this._effects({ integrity: -25, risk: 36, stress: 8 }); return '5万元科研支出被做成了3万元私人收益。账面一时平静，审计记录却会留下痕迹。'; }
      this._effects({ integrity: 6, risk: -5, stress: 5 });
      if (this._random() < 0.5) { s.department.climate += 10; s.department.support += 5; this._effects({ reputation: 3 }); return '程序问题获得调查，院系修订了流程。有人感谢你把话说了出来。'; }
      this._effects({ network: -6, departmentSupport: -5 }); return '你提交了实名材料，调查仍在继续。几段关系暂时冷了下来，事情还没有简单的答案。';
    }
    return '你完成了这项安排。';
  }

  endQuarter() {
    const s = this.state;
    if (s.ended) return this._result(false, '这段人生已结束。');
    if (s.pendingEvent) return this._result(false, '请先回应本季来信。');
    const start = s.logs.length, economy = this.getEconomy();
    let income = economy.quarterSalary;
    s.money += income - economy.quarterExpenses; s.metrics.income += income;
    s.quarter++; s.metrics.quartersPlayed++; this._sync();
    this._log(`本季收入${round(income)}万，生活支出${economy.quarterExpenses}万，存款${round(s.money)}万。`, 'economy');
    if (this.career.rank <= 2) s.degreeProgress += s.flags.researchThisQuarter ? 3 : 1.5;
    this._effects({ stress: this.career.rank >= 4 ? 3 : 1, risk: -1.2 });
    if (s.flags.adminAppointment) this._effects({ stress: 3, network: 0.8 });
    if (s.department.evaluation === '论文、项目、帽子指标') this._effects({ stress: 2 });
    if (s.stats.stress >= 70) this._effects({ health: -(s.stats.stress - 60) / 8 });
    else if (s.stats.stress < 35) this._effects({ health: 1.5 });
    if (s.money < 0) this._effects({ stress: 3 + Math.min(8, -s.money / 2) });
    if (s.money <= -18) { s.money = -12; this._effects({ reputation: -3, stress: 8, departmentSupport: -4 }); this._log('生活借款接近上限，你申请了困难周转支持。短期得以缓解，也需要安排收入与支出。', 'warning'); }
    this._reviewSubmissions(); this._tickStudents(); this._tickGrants(); this._tickAdministration(); this._audit();
    for (const paper of s.papers.filter(x => x.status !== '撤稿')) {
      if (s.quarter > paper.publishedQuarter) paper.citations += Math.floor(this._random() * (1 + paper.score * 0.6) * (paper.quality / 80));
    }
    if (s.quarter % 4 === 0) this._annualEvaluation();
    if (s.flags.tenureDeadline && s.quarter >= s.flags.tenureDeadline && this.career.rank < 6) this._tenureReview();
    if (this.career.rank === 3 && s.quarter - s.careerSince >= 24 && !s.flags.postdocWarned) { s.flags.postdocWarned = true; this._effects({ stress: 10 }); this._log('博士后聘期已延长到第六年。人事处提醒你尽快寻找稳定岗位，继续等待也有机会成本。', 'warning'); }
    for (const rel of Object.values(s.relationships)) if (s.quarter - (rel.lastContact || 0) > 8) rel.trust = clamp(rel.trust - 0.4);
    s.administration.burden += this.career.rank >= 4 ? 2 : 0.5;
    if (s.administration.burden > 70) this._effects({ stress: 2 });
    s.flags.researchThisQuarter = false; s.flags.taughtThisQuarter = false; s.teaching.quarterHours = 0;
    s.ap = s.maxAp;
    this._checkHealth();
    if (!s.ended && s.age >= 65) this._finish('retire');
    if (!s.ended) this._rollEvent();
    this._sync();
    return this._result(true, `${s.year}年${s.season}季开始了。${this.state.pendingEvent ? '一封新来信正在等你。' : '四格时间，再安排一次自己的生活。'}`, s.logs.slice(start));
  }

  _reviewSubmissions() {
    const s = this.state;
    for (const sub of s.submissions.filter(x => x.dueQuarter <= s.quarter)) {
      const p = s.projects.find(x => x.id === sub.projectId), j = JOURNALS.find(x => x.id === sub.journalId);
      if (!p || !j) continue;
      if (this._random() <= sub.chance) {
        p.status = '已发表';
        const quality = round((p.quality * 0.65 + p.rigor * 0.2 + p.novelty * 0.15));
        s.papers.push({ id: this._id('paper'), projectId: p.id, title: p.name, venue: j.id, journal: j.name, journalName: j.name, tier: j.tier, score: j.score, impact: j.score, quality, novelty: p.novelty, rigor: p.rigor, citations: 0, status: '已发表', publishedQuarter: s.quarter, quarter: s.quarter, year: s.year, risk: p.risk, fraudulent: p.risk >= 20 });
        s.metrics.papersPublished++; this._effects({ reputation: j.reputation, stress: -4, degreeProgress: this.career.rank <= 2 ? 8 : 0, departmentSupport: 2 });
        if (j.id === 'summit' && p.novelty >= 80 && p.rigor >= 75 && !p.breakthroughs) { s.metrics.breakthroughs++; p.breakthroughs++; }
        this._log(`${j.name}录用「${p.name}」！获得成果积分${j.score}，声誉提升。${p.risk > 10 ? '其中的记录隐患仍需要你面对。' : '可信的证据，为履历留下一行扎实记录。'}`, 'milestone');
      } else {
        p.status = '写作中'; p.writing = Math.max(60, p.writing - 18); s.activeProjectId = p.id; s.metrics.rejected++; this._effects({ stress: 5, writing: 1.5 });
        p.quality = clamp(p.quality + 2);
        this._log(`${j.name}退回「${p.name}」。审稿人建议${p.quality < j.threshold ? '加强证据与论证' : '进一步明确贡献与读者定位'}。修改后可以再次投稿。`, 'warning');
      }
    }
    s.submissions = s.submissions.filter(x => x.dueQuarter > s.quarter);
  }
  _tickStudents() {
    const s = this.state;
    for (const student of s.students.filter(x => !x.graduated)) {
      if (s.funding >= 0.2) { s.funding -= 0.2; student.progress = clamp(student.progress + 2.5); }
      else { student.satisfaction = clamp(student.satisfaction - 4); this._effects({ stress: 1 }); }
      if (student.progress >= 100 && s.quarter - student.joinedQuarter >= 8) {
        student.graduated = true; s.metrics.studentsMentored++; s.teaching.reputation += 4; this._effects({ reputation: 2, stress: -3 });
        this._log(`${student.name}完成学位，走向自己的下一站。你培养的学生已有${s.metrics.studentsMentored}人。`, 'milestone');
        continue;
      }
      if (student.satisfaction < 25 && this._random() < 0.2) { student.graduated = true; student.left = true; this._effects({ reputation: -4, risk: 4 }); this._log(`${student.name}申请转组。长期积累的不满，终于到了必须面对的时候。`, 'warning'); }
    }
    s.teaching.students = s.students.filter(x => !x.graduated).length;
  }
  _tickGrants() {
    const s = this.state;
    for (const g of s.grants.filter(x => x.status === '执行中')) {
      g.remaining = Math.max(0, g.endsQuarter - s.quarter);
      if (!g.remaining) {
        const delta = this.paperScore - (g.startScore || 0), target = g.target || 3;
        const trained = g.type !== 'key' || s.metrics.studentsMentored > (g.startStudents || 0);
        const studentProject = g.type === 'student' && s.projects.some(p => p.progress >= 100 && p.startedQuarter >= g.startsQuarter);
        if ((delta >= target || studentProject) && trained) { g.status = '顺利结题'; s.metrics.grantsCompleted++; this._effects({ reputation: 3, departmentSupport: 3, stress: -3 }); this._log(`${g.name}顺利结题，同行肯定了你的研究积累。`, 'milestone'); }
        else if (!g.extended) { g.extended = true; g.endsQuarter += 4; g.remaining = 4; this._effects({ stress: 6 }); this._log(`${g.name}成果积分新增${round(delta)}/${target}${!trained ? '，尚未完成新增学生培养要求' : ''}，获准延期4季。请安排研究与结题材料。`, 'warning'); }
        else { g.status = '结题未通过'; this._effects({ reputation: -5, departmentSupport: -5, stress: 8 }); s.flags.cooldowns[`grant_${g.type}`] = s.quarter + 8; this._log(`${g.name}结题未通过，同类申请暂停8季。失败也会留下一份需要认真总结的记录。`, 'warning'); }
      }
    }
  }
  _tickAdministration() {
    const s = this.state;
    if (s.administration.burden > 80 && s.submissions.length && this._random() < 0.15) {
      s.submissions[0].dueQuarter++; s.administration.burden -= 10; this._log('附件与流程问题让一份稿件的校内手续延迟了一季。熟悉流程、及时办理可以减少这种摩擦。', 'warning');
    }
  }
  _annualEvaluation() {
    const s = this.state, rank = this.career.rank;
    if (rank >= 4) {
      const needed = Math.max(16, s.teaching.load - (s.flags.educationPreparedYear === s.year - 1 ? 8 : 0));
      if (s.teaching.yearHours >= needed && s.teaching.satisfaction >= 45) { this._effects({ departmentSupport: 5, teachingReputation: 2, stress: -2 }); this._log(`年度教学考核通过：${s.teaching.yearHours}/${needed}学时，学生满意度${round(s.teaching.satisfaction)}。课堂工作得到了院系认可。`, 'evaluation'); }
      else { this._effects({ departmentSupport: -8, teachingReputation: -3, stress: 7 }); this._log(`年度教学考核提醒：${s.teaching.yearHours}/${needed}学时，满意度${round(s.teaching.satisfaction)}。下一年需要为备课与授课安排时间。`, 'warning'); }
      if (s.metrics.annualResearch >= 4 || s.flags.teachingTrack && s.teaching.reputation >= 50) { this._effects({ departmentSupport: 2 }); }
      else { this._effects({ departmentSupport: -3, stress: 3 }); }
      if (s.department.evaluation === '论文、项目、帽子指标' && s.metrics.annualResearch < 8) this._effects({ stress: 5, departmentSupport: -3 });
    }
    s.history.push({ quarter: s.quarter, type: 'annual', age: s.age, career: s.career, hat: s.hat, paperScore: this.paperScore, teaching: round(s.teaching.reputation), money: round(s.money), text: `${s.year - 1}年度回顾` });
    s.teaching.yearHours = 0; s.metrics.annualResearch = 0; s.metrics.annualTeaching = 0; s.flags.annualActions = {};
  }
  _tenureReview() {
    const s = this.state;
    if (s.flags.teachingTrack || s.teaching.reputation >= 65 && s.department.support >= 55) { s.flags.tenureDeadline = null; s.flags.teachingTrack = true; this._effects({ stress: -10 }); this._log('聘期评议认可了你的课堂与培养贡献，你转入稳定的教学为主岗位。学术人生也可以由学生来证明。', 'milestone'); }
    else if ((s.flags.probationStrikes || 0) === 0) { s.flags.probationStrikes = 1; s.flags.tenureDeadline = s.quarter + 12; this._effects({ stress: 15, departmentSupport: -8 }); this._log('六年聘期考核暂未达到晋升要求。院系给予3年延长期：可以继续冲刺，也可以选择教学为主岗位。', 'warning'); }
    else { s.flags.tenureDeadline = null; s.flags.probationStrikes = 2; s.career = 'assistant'; s.careerSince = s.quarter; this._effects({ stress: 12, reputation: -5 }); this._log('延长期结束，原岗位未续聘。你接受了助教岗位以继续留在大学，也可以另寻机会。这段路还可以继续。', 'warning'); }
  }
  _audit() {
    const s = this.state;
    if (s.stats.risk < 12) return;
    const chance = clamp((s.stats.risk - 8) / 250, 0.02, 0.45);
    if (this._random() > chance) return;
    s.metrics.audits++; const risky = s.papers.filter(p => p.status !== '撤稿' && (p.risk > 15 || p.fraudulent));
    if (risky.length) { const p = risky[Math.floor(this._random() * risky.length)]; p.status = '撤稿'; p.score = 0; s.metrics.retractions++; this._effects({ reputation: -18, departmentSupport: -12, stress: 15 }); this._log(`学术核查发现「${p.title}」存在贡献或数据问题，论文撤稿。过去走过的捷径，在此刻回到了档案里。`, 'danger'); }
    if (s.flags.embezzled > 0) { const owed = s.flags.embezzled * 1.5; s.money -= owed; s.flags.embezzled = 0; s.funding = Math.max(0, s.funding - 3); this._effects({ reputation: -20, departmentSupport: -18, stress: 20 }); this._log(`财务审计发现违规支出，追缴${round(owed)}万元并暂停部分经费。`, 'danger'); }
    else if (!risky.length) { this._effects({ reputation: -4, stress: 8 }); this._log('你接受了一次学术与财务核查。虽未直接处分，整理材料和说明问题仍耗费了精力。', 'warning'); }
    s.stats.risk = Math.max(0, s.stats.risk - 24); s.flags.cooldowns.hat_young = Math.max(s.flags.cooldowns.hat_young || 0, s.quarter + 8); s.flags.cooldowns.hat_distinguished = Math.max(s.flags.cooldowns.hat_distinguished || 0, s.quarter + 8);
    if (s.metrics.retractions >= 3 || s.stats.reputation <= 2 && s.stats.integrity < 25 && s.metrics.audits >= 2) this._finish('disgrace');
  }
  _checkHealth() {
    const s = this.state;
    if (s.ended) return;
    if (s.stats.health <= 8) { s.ap = 0; s.stats.health = 28; s.stats.stress = Math.max(25, s.stats.stress - 20); s.money -= 1.2; s.flags.healthCrises = (s.flags.healthCrises || 0) + 1; this._log('身体发出了最后的警报。你接受治疗，本季剩余安排取消，支出1.2万元。之后需要认真安排休息。', 'danger'); if (s.flags.healthCrises >= 4) this._finish('health'); }
  }

  _eventEligible(e) {
    const s = this.state, rank = this.career.rank, cond = e.condition || {};
    const minRank = e.minRank ?? cond.minRank ?? cond.minStage, maxRank = e.maxRank ?? cond.maxRank ?? cond.maxStage;
    if (minRank !== undefined && rank < minRank || maxRank !== undefined && rank > maxRank) return false;
    if (e.minAge !== undefined && s.age < e.minAge || e.maxAge !== undefined && s.age > e.maxAge) return false;
    if (cond.minIntegrity !== undefined && s.stats.integrity < cond.minIntegrity || cond.maxIntegrity !== undefined && s.stats.integrity > cond.maxIntegrity) return false;
    if (cond.minRisk !== undefined && s.stats.risk < cond.minRisk || cond.maxRisk !== undefined && s.stats.risk > cond.maxRisk) return false;
    if (cond.hasHat && s.hat === 'none' || cond.flag && !s.flags[cond.flag]) return false;
    if (e.once !== false && s.flags.seenEvents.includes(e.id)) return false;
    return true;
  }
  _rollEvent() {
    const s = this.state;
    if (this._random() > 0.54) return;
    const events = list(DATA.events).filter(e => e.id && (e.options || e.choices)?.length && this._eventEligible(e));
    if (!events.length) return;
    let pick = this._random() * events.reduce((a, e) => a + (e.weight || 1), 0), event = events[events.length - 1];
    for (const e of events) { pick -= e.weight || 1; if (pick <= 0) { event = e; break; } }
    s.pendingEvent = { ...copy(event), text: event.text || event.description, quarter: s.quarter, options: copy(event.options || event.choices).map((o, i) => ({ ...o, id: o.id ?? `option_${i}`, text: o.text || o.description || '' })) };
  }
  getPendingEvent() { return this.state.pendingEvent; }
  chooseEvent(choiceId) {
    const s = this.state, event = s.pendingEvent;
    if (!event) return this._result(false, '当前没有待回应的来信。');
    const choice = event.options.find((o, i) => String(o.id) === String(choiceId) || String(i) === String(choiceId));
    if (!choice) return this._result(false, '请选择一个有效回应。');
    this._effects(choice.effects || {});
    let text = choice.result || choice.outcome || choice.text || `你选择：${choice.label}。`;
    if (choice.chance !== undefined && choice.successEffects) {
      const success = this._random() < (choice.chance > 1 ? choice.chance / 100 : choice.chance);
      this._effects(success ? choice.successEffects : choice.failureEffects || {}); text += success ? choice.successText || '事情进展顺利。' : choice.failureText || '事情没有如预期发展。';
    }
    s.flags.seenEvents.push(event.id); if (s.flags.seenEvents.length > 150) s.flags.seenEvents.shift();
    s.pendingEvent = null; this._log(`「${event.title}」${choice.label}。${text}`, 'event'); this._checkHealth();
    return this._result(true, text);
  }
  _finish(reason = 'retire') {
    const s = this.state; s.ended = true; s.pendingEvent = null;
    let ending;
    if (reason === 'disgrace') ending = { title: '被撤回的名字', description: '那些曾经替你加速的交易，最终耗尽了同行的信任。学术共同体记住的不只是论文数量，还有研究发生的方式。' };
    else if (reason === 'health') ending = { title: '先把自己找回来', description: '你在一再透支之后离开了高压岗位。研究可以交给后来者，身体与生活需要你重新照顾。' };
    else if (reason === 'industry') ending = { title: '把问题带到另一处', description: '你带着研究训练走向企业研发。实验室之外，新的团队、产品与真实问题，打开了另一条路。' };
    else if (s.hat === 'academician') ending = { title: '山高，来者自有路', description: '院士的称号写进履历，真正留下的却是你回答过的问题、培养过的人，以及别人能沿着继续走的路。' };
    else if (s.metrics.studentsMentored >= 8 || s.teaching.reputation >= 85) ending = { title: '桃李不言', description: '你或许没有站在每一场大会的主台，但很多学生在回忆重要的老师时，会说起你的名字。' };
    else if (s.metrics.breakthroughs >= 3 && s.stats.integrity >= 70) ending = { title: '为一个问题停留', description: '追逐热点的人换了几代，你仍在自己的问题上留下了可信的推进。后来者翻开文献，会在某一页与你相遇。' };
    else if (this.career.rank >= 7 && s.stats.integrity >= 65) ending = { title: '留一盏实验室的灯', description: '从课堂到研究，你走到了教授岗位。复杂的制度、人情与竞争没有让你完全忘记，最初为什么想做这件事。' };
    else if (s.money >= 100 && s.stats.health >= 60) ending = { title: '把日子过成自己的样子', description: '你在学术与生活之间找到了可持续的节奏。有一份履历，也有健康、积蓄与能慢慢度过的夜晚。' };
    else ending = { title: '一位普通学者的手记', description: '这不是一段只由头衔定义的人生。课程、会议、失败的实验与认真写过的段落，都构成了你留在大夏的痕迹。' };
    s.ending = { ...ending, reason, score: Math.round(this.paperScore * 2 + s.metrics.studentsMentored * 8 + s.teaching.reputation + s.stats.integrity + s.stats.health + Math.min(100, s.money) + (s.hat === 'academician' ? 150 : s.hat === 'distinguished' ? 80 : s.hat === 'young' ? 40 : 0)), epilogue: `${s.name}，${this.career.name}。${s.papers.filter(p => p.status !== '撤稿').length}篇有效论文，${s.metrics.studentsMentored}位毕业学生，${s.metrics.breakthroughs}次原创突破。学术的衡量方式，从来不只有一种。` };
    this._log(`此卷终章：${s.ending.title}。`, 'milestone');
  }
  serialize() { this._sync(); return JSON.stringify({ format: 'daxia-academic-life', version: 1, state: this.state }); }
  static deserialize(json) {
    let saved;
    try { saved = typeof json === 'string' ? JSON.parse(json) : copy(json); } catch { throw new Error('存档不是有效的JSON文件。'); }
    if (!saved || saved.format !== 'daxia-academic-life' || saved.version !== 1 || !saved.state) throw new Error('这不是受支持的大夏学术浮生存档。');
    const s = saved.state;
    if (!CAREERS.some(c => c.id === s.career) || !CITIES.some(c => c.id === s.cityId) || !Number.isInteger(s.quarter) || s.quarter < 0 || s.quarter > 400 || !s.stats || !Number.isFinite(s.money) || !Number.isFinite(s.funding) || !Number.isInteger(s.rng)) throw new Error('存档关键数据不完整或超出范围。');
    for (const stat of STATS) if (!Number.isFinite(s.stats[stat])) throw new Error('存档中的角色状态无效。');
    for (const key of ['projects', 'papers', 'submissions', 'grants', 'logs', 'students', 'history', 'colleagues']) if (!Array.isArray(s[key]) || s[key].length > 5000) throw new Error(`存档中的${key}数据无效。`);
    if (!s.flags || !s.relationships || !s.teaching || !s.department || !s.administration || !s.metrics || !Number.isFinite(s.ap) || !Number.isFinite(s.maxAp) || s.maxAp !== 4) throw new Error('存档缺少必要档案。');
    if (!Array.isArray(s.flags.seenEvents) || !s.flags.cooldowns || !s.flags.annualActions || !Array.isArray(s.flags.degrees)) throw new Error('存档中的进度标记无效。');
    if (s.pendingEvent && (!Array.isArray(s.pendingEvent.options) || !s.pendingEvent.options.length)) throw new Error('存档中的待办事件无效。');
    const game = Object.create(Game.prototype); game.state = copy(s); game._sync(); return game;
  }
}

export default Game;
