import './style.css';
import { Game, ENGINE_DATA } from './engine.js';
import { DATA } from './content.js';
import { icon, hydrateIcons } from './icons.js';
import { CampusWorld } from './world.js';
import { CampusAudio } from './audio.js';
import { renderPanel, cityById, careerById, cityLabel, degreeLabel, safe, collection, fmt, effectSummary } from './panels.js';

const $ = s => document.querySelector(s);
const SAVE_KEY='daxia-academic-life-v1';
const UI_KEY='daxia-academic-ui-v1';
const SEASONS=['春','夏','秋','冬'];
const SAVE_VERSION=1;
let game=new Game({scenario:'undergrad',name:'林知远',seed:20261016});
let activeView='campus',activePanelTab='',agendaTab='agenda',selectedBuilding='academy';
let world,modalCloseHandler=null,lastFocus=null,lastEventId=null,currentScenario='undergrad',currentDifficulty='normal';
let booted=false,busy=false;
const sound=new CampusAudio();
const BUILDINGS={
 academy:{name:'明理教学楼',eyebrow:'FACULTY & TEACHING',description:'课堂、院系与同事都在这里。讲台上的付出，也会写进你的履历。',actions:['teach','mentor'],view:'affairs',tab:'teaching',quote:'讲清楚一个问题，\n也是重新理解它的过程。',scene:'classroom'},
 lab:{name:'格物实验楼',eyebrow:'RESEARCH LABORATORY',description:'让猜想接受数据的检验。好问题通常需要比预想更多的时间。',actions:['research','write','submit'],view:'research',quote:'仪器不关心你的头衔，\n数据也不会替你说谎。',scene:'laboratory'},
 foundation:{name:'大夏自然基金委',eyebrow:'RESEARCH FUNDING',description:'青年、面上与重点项目各有门槛。项目经费只用于科研，不能直接变成个人存款。',actions:['grant'],view:'affairs',tab:'funding',quote:'一份好的申请书，\n先要有一个值得问的问题。'},
 library:{name:'知微图书馆',eyebrow:'LEARNING & IDEAS',description:'旧问题的缝隙里，也许藏着你的新方向。读书、思考与写作都算正事。',actions:['study','write'],view:'research',quote:'书架上有很多答案，\n留给你的仍是问题。'},
 conference:{name:'群贤会议中心',eyebrow:'CONFERENCES & EXCHANGE',description:'报告厅里有新思想，茶歇处有人情。选好会议，也选好自己想成为的人。',actions:['conference','network'],view:'network',tab:'conferences',quote:'有人记住你的名字，\n也有人记住你的问题。',scene:'conference'},
 dorm:{name:'青年学者公寓',eyebrow:'LIFE BETWEEN PAPERS',description:'房租、家人、身体与一顿热饭。休息会恢复健康，也让接下来的工作更有效。',actions:['rest'],view:'career',quote:'今天按时睡觉，\n不算辜负科学。'},
 cafe:{name:'未名咖啡',eyebrow:'PEOPLE & POSSIBILITIES',description:'在一杯咖啡的时间里，遇见合作者、同事或竞争者。关系需要时间，也需要边界。',actions:['network','deal'],view:'network',quote:'学术圈不大，\n人心却各有坐标。'},
 admin:{name:'校务行政楼',eyebrow:'UNIVERSITY ADMINISTRATION',description:'人事处管聘任，教务处管课程，科研处管项目，财务处管报销。流程也需要理解。',actions:['admin','job'],view:'affairs',tab:'administration',quote:'章盖在纸上，\n事情落在人身上。'}
};

hydrateIcons();
world=new CampusWorld($('#scene-container'),id=>selectBuilding(id));
window.__DAXIA__={get game(){return game;},get world(){return world;},get data(){return {DATA,ENGINE_DATA};},version:SAVE_VERSION};

function getCareer(){return careerById(game.state.career,ENGINE_DATA);}
function getCity(){return cityById(game.state.cityId,DATA,ENGINE_DATA);}
function setText(selector,value){const el=$(selector);if(el)el.textContent=value;}
function getYear(s=game.state){return s.year??2026+Math.floor(s.quarter/4);}
function getSeason(s=game.state){return typeof s.season==='number'?SEASONS[s.season%4]:String(s.season||SEASONS[s.quarter%4]).replace(/季.*/,'').replace(/[0-9]/g,'')||SEASONS[s.quarter%4];}
function scholarTag(){const s=game.state;const field=collection(DATA.fields||ENGINE_DATA.fields).find(x=>x.id===s.fieldId||x.id===s.field)||{};return field.name||field.label||s.fieldName||'基础科学';}
function render(){
 const s=game.state,c=getCareer(),city=getCity(),economy=game.getEconomy?.()||{};
 setText('#calendar-era',`夏历 ${getYear()} 年`);
 $('#calendar-season').innerHTML=`${safe(getSeason())}季 <span>第${['一','二','三','四'][s.quarter%4]}季度</span>`;
 setText('#season-icon',['✳','☀','❋','❄'][s.quarter%4]);
 $('#rep-spark').innerHTML=icon('laurel');
 setText('#stat-money',fmt(s.money,2));setText('#stat-funding',fmt(s.funding,2));setText('#stat-reputation',fmt(s.stats.reputation,0));
 $('#stat-papers').innerHTML=`${s.papers.length} <em>篇</em>`;
 setText('#paper-hint',s.papers.length?`代表作 ${s.papers.filter(p=>p.tier==='top'||p.quality>=70||p.impact>=8).length} 篇`:'从第一个问题开始');
 setText('#money-flow',economy.annualSalary?`年收入 ${fmt(economy.annualSalary)} 万 · 游戏值`:c.salary?`年薪 ${fmt(c.salary)} 万 · 游戏值`:'生活与科研，是两本账');
 const ap=Math.max(0,s.ap),max=s.maxAp||4;
 $('#ap-dots').innerHTML=Array.from({length:max},(_,i)=>`<i class="${i>=ap?'used':''}"></i>`).join('');
 setText('#ap-number',`${ap} / ${max}`);
 setText('#btn-mobile-profile',`本季 ${ap} / ${max} 格 · 状态 ↗`);
 setText('#career-badge',c.name||degreeLabel(s.career));
 $('#scholar-name').innerHTML=`${safe(s.name)} <span>${Math.floor(s.age)} 岁</span>`;
 setText('#scholar-location',cityLabel(city));
 $('#scholar-tags').innerHTML=`<span>${safe(scholarTag())}</span><span${s.hat&&s.hat!=='none'?' class="hat"':''}>${safe(s.hat&&s.hat!=='none'?hatName(s.hat):c.rank>=4?'独立研究者':'初入学界')}</span>`;
 ['health','stress','integrity'].forEach(id=>{setText(`#${id}-number`,fmt(s.stats[id],0));$(`#${id}-bar`).style.width=`${Math.max(0,Math.min(100,s.stats[id]))}%`;});
 $('#skill-grid').innerHTML=[['knowledge','学识'],['insight','洞察'],['writing','写作'],['network','人脉']].map(([id,name])=>`<div class="skill-item"><span>${name}</span><strong>${fmt(s.stats[id],0)}</strong></div>`).join('');
 setText('#world-location',cityLabel(city));
 setText('#world-weather',['春和景明，宜做研究','蝉鸣渐起，截稿将近','银杏叶黄，考核在即','灯火未熄，年终将至'][s.quarter%4]);
 setText('#brief-quarter',String(s.quarter+1).padStart(2,'0'));
 setText('#journal-count',s.logs.length);
 const pending=game.getPendingEvent?.()||s.pendingEvent;
 $('#btn-next').innerHTML=`${icon(pending?'notebook':'hourglass')}<span>${pending?'处理本季来信':s.ended?'查看人生结语':s.ap<=0?'迎接下一季':'结束本季'}</span><span class="advance-arrow">→</span>`;
 setText('#quarter-tip',s.ended?'每一条走过的路，都有自己的意义。':pending?'一封来信正在等待答复。请先做出选择。':s.ap<=0?'本季时间已用尽。休整后，新的故事将继续。':`还剩 ${ap} 格时间。选择，也意味着放下。`);
 renderAgenda();renderDock();if(activeView!=='campus')renderOverlay();world?.setSeason(s.quarter%4);
 document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===activeView));
}
function hatName(id){if(typeof id==='object')return id.name||id.label||'';const hats=collection(ENGINE_DATA.hats||DATA.hats);return hats.find(h=>h.id===id)?.name||({youqing:'优青',jieqing:'杰青',academician:'院士',excellent:'优青',distinguished:'杰青'})[id]||id;}
function goalForStage(){const s=game.state,c=getCareer();if(c.rank<=2)return{title:'把基础打牢',text:'在图书馆积累学识，完成研究训练。学历与毕业要求可在生涯中查看。',current:s.degreeProgress||0,total:100,action:'study'};if(!game.activeProject)return{title:'提出自己的问题',text:'开启一项课题，逐步研究、写作与投稿。成果不会在一夜之间出现。',current:0,total:100,action:'research'};const project=game.activeProject;return{title:project.name||project.title||'推进手头的课题',text:'研究积累进度，写作整理证据。完成后，选择合适的期刊投稿。',current:project.progress||0,total:100,action:'research'};}
function renderAgenda(){
 const s=game.state,el=$('#agenda-content');
 document.querySelectorAll('[data-agenda]').forEach(b=>b.classList.toggle('active',b.dataset.agenda===agendaTab));
 if(agendaTab==='journal'){el.innerHTML=s.logs.length?s.logs.slice(-25).reverse().map(l=>`<div class="journal-item ${l.type==='success'||l.important?'important':''}"><small>${safe(l.date||l.time||`第 ${(l.quarter??s.quarter)+1} 季`)}</small><p>${safe(typeof l==='string'?l:l.message||l.text)}</p></div>`).join(''):'<div class="empty-note">本季的手记，<br>从你的第一个决定开始。</div>';return;}
 const b=BUILDINGS[selectedBuilding],goal=goalForStage(),actions=game.getActions();
 const locActions=b.actions.map(id=>actions.find(a=>a.id===id)).filter(Boolean);
 const pending=game.getPendingEvent?.()||s.pendingEvent;
 const dept=typeof s.department==='object'?s.department:null;
 el.innerHTML=`<div class="location-card"><span class="eyebrow">${b.eyebrow}</span><h3>${b.name}</h3><p>${b.description}</p><div class="location-actions">${locActions.slice(0,3).map(a=>`<button class="small-button" data-action="${a.id}" ${a.available===false||a.disabled?'disabled':''} title="${safe(a.reason||a.description||'')}">${safe(a.label||a.name)}</button>`).join('')}<button class="small-button" data-view="${b.view}" data-tab="${b.tab||''}">查看事务 ↗</button>${b.scene?`<button class="small-button" data-scene="${b.scene}">进入室内</button>`:''}</div></div>
 ${s.administration?.pending?.length?`<div class="deadline-brief"><span class="brief-section-label">${icon('flag')} 近期提醒</span>${s.administration.pending.slice().sort((a,b)=>a.remaining-b.remaining).slice(0,2).map(p=>`<button data-view="affairs" data-tab="administration"><span>${safe(p.title)}</span><b>${p.remaining} 季</b></button>`).join('')}</div>`:''}
 <div class="brief-section-label">近期目标 <span>TAKE YOUR TIME</span></div>
 <div class="goal-card"><span class="goal-number">01</span><div style="flex:1"><h4>${safe(goal.title)}</h4><p>${goal.text}</p><div class="progress-track"><i style="width:${Math.min(100,goal.current/goal.total*100)}%"></i></div><div class="progress-meta"><span>当前进度</span><span>${fmt(goal.current,0)} / ${goal.total}</span></div></div></div>
 <div class="goal-card"><span class="goal-number">02</span><div><h4>${dept?'兼顾院系与课堂':'留意毕业与考核'}</h4><p>${dept?`${safe(dept.name||'所在院系')}的支持会影响资源分配。教学与科研都需要安排。`:'不要只盯着论文。课程、知识储备与健康同样影响下一步。'}</p></div></div>
 <div class="news-card"><span class="news-tag">${pending?'新来信':'学界一角'}</span><h4>${safe(pending?.title||['大夏科技署：基础研究重在积累','院系例会：课程安排开始征询','青年学者沙龙本季开放报名','年终考核：代表作与教学并看'][s.quarter%4])}</h4><p>${pending?'一件事情需要你的决定。':safe(['有人冲向热点，也有人还在打磨一个旧问题。','会议室的灯亮了，新的分工还没定下来。','报告结束之后，愿你找到值得继续的对话。','记得翻看本年的记录：论文之外，你还做了什么？'][s.quarter%4])}</p>${pending?'<button class="text-link" data-event="open">拆开来信 ↗</button>':''}</div>`;
}
function renderDock(){
 const actions=game.getActions(),s=game.state;
 const defs=[['study','book','积累学识'],['research','flask','推进课题'],['write','pen','整理成果'],['teach','teach','走上讲台'],['conference','mic','学术交流'],['rest','coffee','好好生活']];
 $('#action-cards').innerHTML=defs.map(([id,ic,desc])=>{const a=actions.find(a=>a.id===id);return`<button class="action-card" data-action="${id}" ${!a||a.available===false||a.disabled||s.ended?'disabled':''} title="${safe(a?.reason||a?.description||desc)}"><span>${icon(ic)}</span><div><h3>${safe(a?.label||a?.name||desc)}</h3><p>${desc}</p></div><span class="ap-cost">${a?.cost??1} 格</span></button>`;}).join('');
}
function selectBuilding(id){if(!BUILDINGS[id])return;selectedBuilding=id;world?.select(id);if(activeView!=='campus')setView('campus');setText('#world-title',BUILDINGS[id].name);setText('#world-subtitle',BUILDINGS[id].description.split('。')[0]+'。');$('#scholar-quote').innerHTML=safe(BUILDINGS[id].quote).replaceAll('\n','<br>');agendaTab='agenda';renderAgenda();}
function setView(view,tab=''){if(!['campus','research','affairs','network','career','world','handbook'].includes(view))return;activeView=view;activePanelTab=tab;const overlay=$('#view-overlay');if(view==='campus'){overlay.hidden=true;world?.setLabelsVisible(true);if(world?.mode!=='campus'){world?.switchScene('campus');setText('#world-title',BUILDINGS[selectedBuilding].name);setText('#world-subtitle',BUILDINGS[selectedBuilding].description.split('。')[0]+'。');}}else{world?.setLabelsVisible(false);overlay.hidden=false;renderOverlay();}document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===view));}
function renderOverlay(){const el=$('#view-overlay');el.innerHTML=renderPanel(activeView,{game,DATA,E:ENGINE_DATA,tab:activePanelTab});hydrateIcons(el);}
function toast(message,error=false){const existing=$('#toast-region');existing.innerHTML='';const t=document.createElement('div');t.className=`toast ${error?'error':''}`;t.innerHTML=icon(error?'alert':'check')+`<span>${safe(message)}</span>`;existing.append(t);setTimeout(()=>{t.classList.add('leaving');setTimeout(()=>t.remove(),300);},error?6500:4500);}
function openModal({title='',eyebrow='DAXIA · ACADEMIC LIFE',subtitle='',body='',footer='',wide=false,closable=true,className='',onClose=null}){
 lastFocus=document.activeElement;modalCloseHandler=onClose;
 $('#modal-root').innerHTML=`<div class="modal-backdrop"><section class="modal ${wide?'wide':''} ${className}" role="dialog" aria-modal="true" aria-label="${safe(title)}" tabindex="-1"><div class="modal-header"><span class="eyebrow">${eyebrow}</span><h2>${safe(title)}</h2>${subtitle?`<p>${safe(subtitle)}</p>`:''}${closable?`<button class="modal-close" data-close-modal aria-label="关闭">${icon('close')}</button>`:''}</div><div class="modal-body">${body}</div>${footer?`<div class="modal-footer">${footer}</div>`:''}</section></div>`;
 const backdrop=$('.modal-backdrop');if(closable)backdrop.addEventListener('click',e=>{if(e.target===backdrop)closeModal();});$('.modal')?.focus();
}
function closeModal(){const fn=modalCloseHandler;modalCloseHandler=null;$('#modal-root').innerHTML='';lastFocus?.focus?.();fn?.();}
function saveGame(quiet=true){if(!booted)return;try{localStorage.setItem(SAVE_KEY,game.serialize());localStorage.setItem(UI_KEY,JSON.stringify({selectedBuilding,sound:sound.on}));setText('#save-status',`已保存 · ${getYear()}年${getSeason()}季 · ${game.state.name}的学术人生`);if(!quiet)toast('此刻的选择，已经写进存档。');}catch{setText('#save-status','浏览器存储不可用，请导出存档。');if(!quiet)toast('当前浏览器无法保存，请使用导出存档。',true);}}
function savedGame(){try{return localStorage.getItem(SAVE_KEY);}catch{return null;}}
function afterMutation(result,{detail=false}={}){if(!result?.ok){toast(result?.message||'暂时无法进行这项行动。',true);sound.tick(false);return false;}sound.tick();render();saveGame();const text=result.message||'这一季，又向前了一步。';if(detail||text.length>160){openModal({title:result.title||'此事有了回音',eyebrow:'A NOTE IN YOUR STORY',body:`<div class="result-body">${safe(text)}</div>`,footer:'<button class="primary-button" data-close-modal>记下这一笔 →</button>',onClose:()=>{if(game.state.ended)showEnding();else showPendingEvent();}});}else{toast(text);if(game.state.ended)showEnding();else showPendingEvent();}return true;}
function runAction(id,choiceId){if(busy||game.state.ended)return;if(game.getPendingEvent?.()||game.state.pendingEvent){showPendingEvent();return;}const action=game.getActions().find(a=>a.id===id);if(!action){toast('这个事务暂时还没有开放。',true);return;}if(action.available===false||action.disabled){toast(action.reason||'当前条件尚不满足。',true);return;}if(choiceId!==undefined){closeModal();const result=game.act(id,{choiceId});afterMutation(result,{detail:['submit','grant','job','deal','relocate','promotion','hat'].includes(id)});return;}
 const choices=action.choices||[];
 if(choices.length){openModal({title:action.label||action.name,eyebrow:action.category?.toUpperCase?.()||'MAKE A CHOICE',subtitle:action.description,body:`<div class="choice-list">${choices.map(c=>`<button class="choice-button" data-action="${id}" data-choice="${safe(c.id)}" ${c.available===false||c.disabled?'disabled':''}><strong>${safe(c.label||c.name||c.id)}</strong><span class="choice-cost">${c.cost??action.cost??1} 格时间</span><p>${safe(c.description||c.text||'')}${c.reason?`<br>${safe(c.reason)}`:''}</p>${c.chance!==undefined?`<div class="event-effects">预计成功率 ${fmt(c.chance>1?c.chance:c.chance*100,0)}%</div>`:''}</button>`).join('')}</div>`});return;}
 afterMutation(game.act(id),{detail:['submit','grant','job','deal','relocate'].includes(id)});
}
function showPendingEvent(){const event=game.getPendingEvent?.()||game.state.pendingEvent;if(!event||game.state.ended)return false;lastEventId=event.id;const options=event.options||event.choices||[];
 openModal({title:event.title,eyebrow:'一封来信 · AN ACADEMIC DILEMMA',closable:false,className:'event-modal',body:`<p class="event-text">${safe(event.text||event.description)}</p><div class="choice-list">${options.map((o,i)=>`<button class="choice-button" data-event-choice="${safe(o.id??String(i))}" ${o.available===false||o.disabled?'disabled':''}><strong>${safe(o.label||o.name)}</strong><p>${safe(o.text||o.description||'')}</p><div class="event-effects">${effectSummary(o.effects)}</div></button>`).join('')}</div><p class="fine-print footnote-rule">你可以看见眼前的得失，有些回响会在之后的季度出现。</p>`});return true;
}
function endQuarter(){if(busy)return;if(game.state.ended){showEnding();return;}if(showPendingEvent())return;const ap=game.state.ap;if(ap>0){openModal({title:'让这一季翻篇？',eyebrow:'TIME IS A CHOICE',body:`<p class="result-body">本季还剩 ${ap} 格时间。结束本季会结算收入、生活支出、教学与项目进展，然后进入下一季度。</p><p class="fine-print footnote-rule">如果暂时没有合适的事务，可以先休息，照顾一下健康。</p>`,footer:`<button class="secondary-button" data-close-modal>再安排一下</button><button class="primary-button" id="confirm-end-quarter">结束本季 →</button>`});}else advanceQuarter();}
function advanceQuarter(){closeModal();busy=true;const oldQ=game.state.quarter;const result=game.endQuarter();if(!result?.ok){busy=false;afterMutation(result);return;}render();saveGame();const transition=document.createElement('div');transition.className='quarter-transition';transition.innerHTML=`<span>夏历 ${getYear()} 年</span><strong>${safe(getSeason())}季</strong><small>${safe(['新的问题，等待新的答案。','窗外蝉鸣，研究还在继续。','叶落之前，愿你有所收获。','留一盏灯，也记得回家。'][game.state.quarter%4])}</small>`;document.body.append(transition);setTimeout(()=>{transition.remove();busy=false;if(game.state.ended)showEnding();else if(!showPendingEvent())toast(result.message||'新的一季开始了。');},950);}
function showEnding(){const s=game.state,e=s.ending||{};openModal({title:'学术人生 · 此卷终章',eyebrow:'EVERY LIFE LEAVES A TRACE',wide:true,body:`<div class="ending-name">${safe(e.title||e.name||'把问题留给下一代')}</div><p class="result-body">${safe(e.description||e.text||`${s.name}在大夏的学术旅程走到了一个句点。职位、论文与头衔之外，那些被认真回答的问题，也留了下来。`)}</p><div class="ending-stats"><div><strong>${s.papers.length}</strong><span>篇论文</span></div><div><strong>${fmt(s.stats.reputation,0)}</strong><span>学术声誉</span></div><div><strong>${fmt(s.stats.integrity,0)}</strong><span>学术操守</span></div><div><strong>${Math.floor(s.quarter/4)}</strong><span>年学术时光</span></div><div><strong>${fmt(s.metrics.studentsMentored||s.metrics.students||0,0)}</strong><span>学生与传承</span></div><div><strong>${safe(getCareer().name||s.career)}</strong><span>最后的职位</span></div></div><div class="fine-print">${safe(e.epilogue||'你可以导出这份履历，也可以在新的起点重新出发。每一次重来，都可以试试另一种活法。')}</div>`,footer:'<button class="secondary-button" data-export>导出存档</button><button class="primary-button" data-new-game>再写一段人生 →</button>'});}
function showAllActions(){const actions=game.getActions();openModal({title:'本季可以做些什么',eyebrow:`TIME BUDGET · ${game.state.ap} / ${game.state.maxAp||4}`,wide:true,subtitle:'每一格时间都值得好好安排。带有条件的行动会显示所需准备。',body:`<div class="info-grid">${actions.map(a=>`<button class="choice-button" data-action="${a.id}" ${a.available===false||a.disabled?'disabled':''}><strong>${safe(a.label||a.name)}</strong><span class="choice-cost">${a.cost??1} 格</span><p>${safe(a.reason||a.description||'')}</p></button>`).join('')}</div>`});}
function exportSave(){try{const blob=new Blob([game.serialize()],{type:'application/json'});const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download=`大夏学术浮生-${game.state.name}-${getYear()}-${getSeason()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);toast('存档已导出，可以带到另一台设备继续。');}catch{toast('导出失败，请重试。',true);}}
function showProfile(){const s=game.state;openModal({title:`${s.name} · 学者档案`,eyebrow:'A PERSON BEHIND THE PAPERS',body:`<div class="info-card warm"><h3>${safe(getCareer().name)} · ${fmt(s.age,1)} 岁</h3><p>${safe(cityLabel(getCity()))}</p>${[['health','身心健康'],['stress','考核压力'],['integrity','学术操守'],['knowledge','学识'],['insight','洞察'],['writing','写作'],['network','人脉']].map(([k,label])=>`<div class="stat-pair"><span>${label}</span><strong>${fmt(s.stats[k],0)} / 100</strong></div>`).join('')}</div><p class="fine-print">本季剩余 ${s.ap} 格时间。高压力会拖累长期表现，记得安排休息。</p>`,footer:'<button class="secondary-button" data-view="career">查看生涯 ↗</button><button class="primary-button" data-close-modal>回到校园</button>'});}
function showSettings(){openModal({title:'把这一刻存下来',eyebrow:'SAVE & SETTINGS',body:`<div class="settings-section"><h3>当前人生</h3><p>${safe(game.state.name)} · ${safe(getCareer().name)} · ${getYear()}年${safe(getSeason())}季<br>每次行动与换季均自动保存。存档保存在当前浏览器中。</p><div class="settings-row"><button class="small-button primary" id="manual-save">${icon('notebook')} 手动保存</button><button class="small-button" data-export>${icon('download')} 导出存档</button><button class="small-button" id="import-button">${icon('upload')} 导入存档</button></div><details style="margin-top:14px"><summary>下载受限时，查看可复制的存档文本</summary><p class="fine-print">将完整文本保存为 .json 文件，即可通过导入存档继续人生。</p><textarea id="save-text-backup" aria-label="完整存档文本" readonly style="width:100%;height:140px;font-size:11px;margin-top:8px">${safe(game.serialize())}</textarea></details></div><div class="settings-section"><h3>校园声景</h3><p>合成器生成的轻音乐与风声，可随时关闭。</p><button class="small-button" id="settings-sound">${sound.on?'关闭':'开启'}环境音乐</button></div><div class="settings-section"><h3>重新出发</h3><p>新开局会覆盖本机自动存档。可以先导出当前人生。</p><button class="small-button danger" data-new-game>开始新的学术人生</button></div><div class="fine-print footnote-rule">所有人物、院校与事件均为虚构。游戏数值不代表真实待遇。Blender 原创场景 · 本地单机存档 · v1.0<br>by JF_Li@FD &amp; Sol</div>`});}
function showOnboarding(){closeModal();const hasSave=!!savedGame();currentScenario='undergrad';currentDifficulty='normal';
 const fields=collection(DATA.fields||ENGINE_DATA.fields);const backgrounds=collection(DATA.backgrounds||ENGINE_DATA.backgrounds);
 $('#modal-root').innerHTML=`<div class="modal-backdrop onboarding-backdrop"><section class="modal onboarding" role="dialog" aria-modal="true" aria-label="开始大夏学术浮生"><div class="intro-art"><span class="intro-brand">大夏 · 学术浮生</span><span class="intro-seal">第一卷</span><h2>把名字<br>写进学界。</h2><p class="intro-tagline">在论文、理想与人情之间，<br>寻找属于你的学术人生。</p><svg class="intro-illustration" viewBox="0 0 280 205" fill="none" aria-hidden="true"><path d="m12 141 126-65 131 65-127 64z" stroke="#a3b593"/><path d="m44 126 96-48 96 48v33l-95 46-97-45z" fill="#446353" stroke="#91a58b"/><path d="m44 126 96 47 96-47m-96 47v32" stroke="#9fb18e"/><path d="m65 113 76-39 74 39-75 38z" fill="#789075"/><path d="M65 113V79l76-38 74 38v34l-75 38z" fill="#35564b" stroke="#95a588"/><path d="m65 79 76 36 74-36M141 115v36" stroke="#9aad8f"/><path d="m58 80 82-41 83 40-83 42z" fill="#a8986a" stroke="#c2b17b"/><path d="m82 87 58-30 59 29-59 29z" fill="#6a7d5d"/><path d="M94 127v-17m18 26v-17m45 18v-17m19 8v-17m18 9v-17" stroke="#a5b599" stroke-width="6"/><path d="m133 59 7-45 8 45" stroke="#a9b692"/><path d="m140 14 28 8-28 7" fill="#c3a067"/><circle cx="31" cy="137" r="12" fill="#7e8c5c"/><path d="M31 147v17" stroke="#b4a070"/><circle cx="242" cy="147" r="12" fill="#aa945c"/><path d="M242 156v17" stroke="#b4a070"/></svg><p class="intro-bottom">A LIFE IN ACADEMIA<br>有限的时间 · 不止一种答案<br><br>场景由 Blender 原创生成<br><br>by JF_Li@FD &amp; Sol</p></div><form class="intro-form" id="new-game-form"><span class="eyebrow">YOUR STORY STARTS HERE</span><h3>从一个问题开始。</h3><p class="form-subtitle">有人为一顶帽子奔走，有人为一个问题停留。<br>在大夏，接下来的人生由你来写。</p><label class="form-label" for="player-name">学者姓名 <small>会出现在你的论文与履历中</small></label><input type="text" id="player-name" value="林知远" maxlength="12" required autocomplete="off" /><div class="form-label">选择人生的起点 <small>三个阶段，三种处境</small></div><div class="scenario-choices"><button type="button" class="scenario-card selected" data-scenario="undergrad"><span class="scenario-icon">${icon('book')}</span><strong>初入校园</strong><small>18 岁 · 本科新生<br>从第一堂课慢慢开始</small></button><button type="button" class="scenario-card" data-scenario="phd"><span class="scenario-icon">${icon('flask')}</span><strong>博士围城</strong><small>25 岁 · 在读博士<br>论文、毕业与下一站</small></button><button type="button" class="scenario-card" data-scenario="young_pi"><span class="scenario-icon">${icon('teach')}</span><strong>青椒当家</strong><small>32 岁 · 青年教师<br>科研、教学与聘期考核</small></button></div><div class="two-fields"><div><label class="form-label" for="field-choice">研究方向</label><select id="field-choice">${fields.length?fields.map(f=>`<option value="${safe(f.id)}">${safe(f.name||f.label)}</option>`).join(''):'<option value="physics">物理与材料</option>'}</select></div><div><label class="form-label" for="background-choice">成长背景</label><select id="background-choice">${backgrounds.length?backgrounds.map(f=>`<option value="${safe(f.id)}">${safe(f.name||f.label)}</option>`).join(''):'<option value="ordinary">普通家庭</option>'}</select></div></div><div class="form-label">学界风向 <small>影响竞争强度与初始资源</small></div><div class="difficulty-options"><button type="button" data-difficulty="easy">从容 · 容错较多</button><button type="button" class="selected" data-difficulty="normal">寻常 · 冷暖自知</button><button type="button" data-difficulty="hard">内卷 · 步步为营</button></div><button class="primary-button" type="submit">开启我的学术人生 ${icon('arrow')}</button>${hasSave?'<button type="button" class="continue-button" id="continue-game">继续上次的人生 →</button>':''}<div class="onboard-rules"><span>${icon('hourglass')}每季 4 格时间</span><span>${icon('notebook')}自动保存进度</span><span>${icon('compass')}点击建筑办理事务</span><span>${icon('heart')}记得照顾自己</span></div><p class="intro-note">本作为架空学界策略游戏。大夏的机构、人物与事件均为虚构，待遇与评审数值为游戏设定。职称、人才称号、科研经费和个人收入分别计算。<br><span class="intro-credit">by JF_Li@FD &amp; Sol</span></p></form></section></div>`;
 $('#new-game-form').addEventListener('submit',e=>{e.preventDefault();const name=$('#player-name').value.trim()||'林知远';const fieldId=$('#field-choice').value;const backgroundId=$('#background-choice').value;game=new Game({name,scenario:currentScenario,difficulty:currentDifficulty,seed:Math.floor(Date.now()%2147483647),fieldId,field:fieldId,backgroundId,background:backgroundId});booted=true;closeModal();selectedBuilding='academy';activeView='campus';setView('campus');render();selectBuilding('academy');saveGame();toast('欢迎来到大夏。你的第一季，开始了。');showPendingEvent();});
}
function loadSaved(){try{const raw=savedGame();if(!raw)throw new Error('no-save');const loaded=Game.deserialize(raw);game=loaded;booted=true;closeModal();let ui={};try{ui=JSON.parse(localStorage.getItem(UI_KEY)||'{}');}catch{}selectedBuilding=BUILDINGS[ui.selectedBuilding]?ui.selectedBuilding:'academy';setView('campus');render();selectBuilding(selectedBuilding);toast('欢迎回来。你的学术人生继续。');if(game.state.ended)showEnding();else showPendingEvent();}catch{toast('这份存档暂时无法读取。可以导入备份或重新开始。',true);}}

// One delegated handler keeps every dynamically rendered panel interactive.
document.addEventListener('click',async e=>{
 const target=e.target.closest('button,a');if(!target)return;
 if(target.matches('[data-atlas-city]')){const city=cityById(target.dataset.atlasCity,DATA,ENGINE_DATA);if(game.state.cityId===city.id){toast(`你已在${city.name}。`);return;}const action=game.getActions().find(a=>a.id==='relocate'),choice=action?.choices?.find(c=>c.id===city.id||c.cityId===city.id);openModal({title:`前往${city.name}？`,eyebrow:'ANOTHER CITY, ANOTHER CHAPTER',subtitle:city.university,body:`<p class="result-body">${safe(city.description)}</p><div class="info-card" style="margin-top:18px"><p>${safe(choice?.description||'城市会改变收入、生活成本与研究条件。')}</p>${choice?.reason?`<p class="tooltip-note">${safe(choice.reason)}</p>`:''}</div>`,footer:`<button class="secondary-button" data-close-modal>继续看看</button><button class="primary-button" data-action="relocate" data-choice="${safe(city.id)}" ${!action?.available||!choice?.available?'disabled':''}>迁往${safe(city.name)} →</button>`});return;}
 if(target.matches('[data-close-modal]')){closeModal();return;}
 if(target.matches('[data-action]')){runAction(target.dataset.action,target.hasAttribute('data-choice')?target.dataset.choice:undefined);return;}
 if(target.matches('[data-view]')){e.preventDefault();closeModal();setView(target.dataset.view,target.dataset.tab||'');return;}
 if(target.matches('[data-panel-tab]')){activePanelTab=target.dataset.panelTab;renderOverlay();return;}
 if(target.matches('[data-agenda]')){agendaTab=target.dataset.agenda;renderAgenda();return;}
 if(target.matches('[data-event]')){showPendingEvent();return;}
 if(target.matches('[data-event-choice]')){const id=target.dataset.eventChoice;closeModal();lastEventId=null;afterMutation(game.chooseEvent(id),{detail:false});return;}
 if(target.matches('[data-scene]')){const mode=target.dataset.scene;const ok=await world?.switchScene(mode);if(ok){setText('#world-title',mode==='laboratory'?'格物实验室':mode==='classroom'?'明理课堂':'群贤报告厅');setText('#world-subtitle','拖动旋转查看室内 · 点击复位按钮返回校园');}else toast('室内场景暂时没有载入，请稍后再试。',true);return;}
 if(target.matches('[data-export]')){exportSave();return;}
 if(target.matches('[data-new-game]')){openModal({title:'再写一段新的人生？',eyebrow:'A NEW CHAPTER',body:'<p class="result-body">新开局会覆盖本机自动存档。你可以先导出当前人生，之后再通过导入继续。</p>',footer:'<button class="secondary-button" data-export>先导出当前存档</button><button class="primary-button" id="confirm-new-game">进入新开局 →</button>'});return;}
 if(target.matches('[data-scenario]')){currentScenario=target.dataset.scenario;document.querySelectorAll('[data-scenario]').forEach(b=>b.classList.toggle('selected',b===target));return;}
 if(target.matches('[data-difficulty]')){currentDifficulty=target.dataset.difficulty;document.querySelectorAll('[data-difficulty]').forEach(b=>b.classList.toggle('selected',b===target));return;}
 if(target.matches('[data-handbook]')){setView('handbook',target.dataset.handbook);closeModal();return;}
 switch(target.id){
  case 'brand-home':e.preventDefault();setView('campus');break;
  case 'btn-next':endQuarter();break;
  case 'confirm-end-quarter':advanceQuarter();break;
  case 'btn-all-actions':showAllActions();break;
  case 'btn-profile':setView('career');break;
  case 'btn-mobile-profile':showProfile();break;
  case 'btn-city':setView('world');break;
  case 'btn-help':setView('handbook');break;
  case 'btn-save':showSettings();break;
  case 'manual-save':saveGame(false);break;
  case 'import-button':$('#import-save').click();break;
  case 'btn-sound':case 'settings-sound':{const on=await sound.toggle();$('#btn-sound').innerHTML=icon(on?'sound':'mute');$('#btn-sound').classList.toggle('on',on);$('#btn-sound').title=on?'关闭环境音乐':'开启环境音乐';$('#btn-sound').setAttribute('aria-label',on?'关闭环境音乐':'开启环境音乐');if(target.id==='settings-sound')target.textContent=on?'关闭环境音乐':'开启环境音乐';toast(on?'校园声景已开启。':'校园声景已关闭。');break;}
  case 'btn-rotate-left':world?.rotate(-1);break;
  case 'btn-rotate-right':world?.rotate(1);break;
  case 'btn-reset-camera':world?.reset();setText('#world-title','此间，尚有无数可能。');setText('#world-subtitle','点击建筑，开始本季的故事。');break;
  case 'continue-game':loadSaved();break;
  case 'confirm-new-game':showOnboarding();break;
 }
});
$('#import-save').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{if(file.size>2e6)throw new Error('large');const imported=Game.deserialize(await file.text());openModal({title:'继续这份人生？',eyebrow:'IMPORT A SAVED LIFE',body:`<p class="result-body">${safe(imported.state.name)} · ${safe(careerById(imported.state.career,ENGINE_DATA).name||imported.state.career)}<br>夏历 ${getYear(imported.state)} 年 · 第 ${imported.state.quarter+1} 季<br><br>确认后将替换当前自动存档。</p>`,footer:'<button class="secondary-button" data-close-modal>取消</button><button class="primary-button" id="confirm-import">继续这份人生 →</button>'});$('#confirm-import').addEventListener('click',()=>{game=imported;booted=true;closeModal();render();saveGame();setView('campus');toast('存档导入成功。');if(game.state.ended)showEnding();else showPendingEvent();});}catch{toast('存档格式无效或版本不兼容，当前进度已保留。',true);}finally{e.target.value='';}});
document.addEventListener('keydown',e=>{const modal=$('.modal');if(e.key==='Tab'&&modal){const focusable=[...modal.querySelectorAll('button:not(:disabled),input,select,a[href],[tabindex="0"]')];if(focusable.length){const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&(document.activeElement===first||document.activeElement===modal)){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}}if(e.key==='Escape'){if(modal?.querySelector('[data-close-modal]'))closeModal();else if(!modal&&activeView!=='campus')setView('campus');}});
window.addEventListener('beforeunload',()=>saveGame());
render();showOnboarding();
