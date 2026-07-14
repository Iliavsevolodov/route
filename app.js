const goals=[10000,20000,35000,50000,70000,100000,150000,200000];
const salesModes=[
 {id:'sales',title:'Люблю продавать',text:'Основной упор на клиентов, личный объём и повторные заказы.'},
 {id:'mixed',title:'Готов совмещать',text:'Личные продажи плюс развитие нескольких самостоятельных ветвей.'},
 {id:'team',title:'Не люблю продавать',text:'Основной упор на запуск партнёров, ветви и лидерские квалификации.'}
];
const ranks=['Новичок','S1','S2','L','L1','L2','L3','M','M1','M2','GM'];
const state={step:1,goal:null,sales:null,pv:200,rank:null};

const $=s=>document.querySelector(s);
const goalGrid=$('#goalGrid'),salesOptions=$('#salesOptions'),rankGrid=$('#rankGrid');

goals.forEach(v=>{const b=document.createElement('button');b.className='choice';b.textContent=v.toLocaleString('ru-RU')+' ₽';b.onclick=()=>selectChoice(goalGrid,b,()=>state.goal=v);goalGrid.appendChild(b)});
salesModes.forEach((o,i)=>{const b=document.createElement('div');b.className='option-card';b.innerHTML=`<div class="option-index">0${i+1}</div><div><strong>${o.title}</strong><span>${o.text}</span></div>`;b.onclick=()=>selectChoice(salesOptions,b,()=>state.sales=o.id);salesOptions.appendChild(b)});
ranks.forEach(v=>{const b=document.createElement('button');b.className='choice';b.textContent=v;b.onclick=()=>selectChoice(rankGrid,b,()=>state.rank=v);rankGrid.appendChild(b)});

function selectChoice(parent,node,cb){[...parent.children].forEach(x=>x.classList.remove('selected'));node.classList.add('selected');cb()}
$('#pvRange').oninput=e=>{state.pv=+e.target.value;$('#pvValue').textContent=state.pv};

function valid(){if(state.step===1)return !!state.goal;if(state.step===2)return !!state.sales;if(state.step===4)return !!state.rank;return true}
function updateStep(){document.querySelectorAll('.step').forEach(s=>s.classList.toggle('active',+s.dataset.step===state.step));$('#stepLabel').textContent=`ШАГ ${state.step} ИЗ 4`;$('#progressPercent').textContent=`${state.step*25}%`;$('#progressBar').style.width=`${state.step*25}%`;$('#backBtn').disabled=state.step===1;$('#nextBtn').textContent=state.step===4?'ПОСТРОИТЬ МАРШРУТ →':'ДАЛЬШЕ →'}
$('#nextBtn').onclick=()=>{if(!valid()){alert('Выбери один из вариантов, чтобы продолжить.');return}if(state.step<4){state.step++;updateStep();return}buildResults()};
$('#backBtn').onclick=()=>{if(state.step>1){state.step--;updateStep()}};
$('#restartBtn').onclick=()=>{$('#results').classList.add('hidden');$('#wizard').classList.remove('hidden');window.scrollTo({top:$('#wizard').offsetTop-20,behavior:'smooth'})};

const plans=[
 {max:10000,rank:'S1',branches:1,branchRanks:['S1'],base:'КЛИЕНТСКАЯ',note:'Высокая доля личного объёма и первые активные партнёры.',income:[55,30,15]},
 {max:20000,rank:'S2',branches:2,branchRanks:['S1','S1'],base:'КЛИЕНТСКО-КОМАНДНАЯ',note:'Клиенты дают быстрый денежный поток, ветви создают рост.',income:[45,35,20]},
 {max:35000,rank:'L',branches:3,branchRanks:['S2','S1','S1'],base:'СМЕШАННАЯ',note:'Сочетание стабильного ЛО и развития трёх ветвей.',income:[30,50,20]},
 {max:50000,rank:'L1',branches:3,branchRanks:['L','S2','S1'],base:'ЛИДЕРСКАЯ',note:'Фокус на первой лидерской ветви и резервных направлениях.',income:[22,53,25]},
 {max:70000,rank:'L2 PRO',branches:4,branchRanks:['L','L','S2','S1'],base:'ЛИДЕРСКАЯ PRO',note:'Несколько сильных ветвей, ЛГО и выполнение PRO-условий.',income:[17,55,28]},
 {max:100000,rank:'M PRO',branches:5,branchRanks:['L','L','L','L','L'],base:'СИСТЕМНАЯ',note:'Пять активных направлений и дубликация лидерской модели.',income:[12,58,30]},
 {max:150000,rank:'M1 PRO',branches:5,branchRanks:['M','L','L','L','L'],base:'МАСШТАБИРУЕМАЯ',note:'Мастерская ветвь, четыре лидерские ветви и глубина.',income:[10,57,33]},
 {max:Infinity,rank:'M2 PRO',branches:5,branchRanks:['M','M','L','L','L'],base:'ЛИДЕРСКАЯ СИСТЕМА',note:'Две мастерские ветви, лидерская глубина и квартальные бонусы.',income:[8,57,35]}
];

function pickPlan(goal){return plans.find(p=>goal<=p.max)}
function adjusted(plan){const p=JSON.parse(JSON.stringify(plan));if(state.sales==='sales'){p.base='КЛИЕНТСКАЯ + КОМАНДА';p.note='Ты готов компенсировать часть командного дохода личными продажами.';p.income=[Math.min(65,p.income[0]+18),Math.max(20,p.income[1]-10),Math.max(15,p.income[2]-8)]}if(state.sales==='team'){p.base='КОМАНДНО-ЛИДЕРСКАЯ';p.note='Продажи сведены к необходимому личному объёму, основной рост дают партнёры.';p.income=[Math.max(5,p.income[0]-8),p.income[1]+3,p.income[2]+5]}if(state.pv>=500&&['S1','S2','L'].includes(p.rank)){p.note+=' ЛО '+state.pv+' PV ускоряет достижение цели.'}return p}

function buildResults(){const p=adjusted(pickPlan(state.goal));$('#wizard').classList.add('hidden');$('#results').classList.remove('hidden');$('#resultTitle').textContent=`ЦЕЛЬ: ${state.goal.toLocaleString('ru-RU')} ₽ В МЕСЯЦ`;$('#targetRank').textContent=p.rank;$('#branchesCount').textContent=p.branches===1?'1':`${Math.max(2,p.branches-1)}–${p.branches}`;$('#strategyName').textContent=p.base;$('#strategyNote').textContent=p.note;
 const pro=p.rank.includes('PRO');$('#rankNote').textContent=pro?'Квартальные PRO-бонусы считаются отдельно и требуют выполнения условий три периода подряд.':'Переходная квалификация для выбранной финансовой цели.';
 renderBranches(p);renderIncome(p);renderRequirements(p);renderRoadmap(p);window.scrollTo({top:$('#results').offsetTop-10,behavior:'smooth'})}

function renderBranches(p){const el=$('#branchMap');el.innerHTML='';p.branchRanks.forEach((r,i)=>{const d=document.createElement('div');d.className='branch';d.innerHTML=`<div class="branch-no">ВЕТВЬ 0${i+1}</div><div class="branch-rank">${r}</div><div class="branch-desc">${r==='L'||r==='M'?'Ключевая самостоятельная ветвь':'Развивающаяся или резервная ветвь'}</div>`;el.appendChild(d)})}
function renderIncome(p){const [personal,group,lead]=p.income;const vals=[Math.round(state.goal*personal/100),Math.round(state.goal*group/100),state.goal-Math.round(state.goal*personal/100)-Math.round(state.goal*group/100)];const labels=['Личный и клиентский результат','Групповой бонус','Лидерские и PRO-бонусы'];$('#incomeBreakdown').innerHTML=labels.map((l,i)=>`<div class="break-row"><span>${l}</span><strong>≈ ${vals[i].toLocaleString('ru-RU')} ₽</strong></div>`).join('')+'<div class="break-row"><span><b>Ориентир всего</b></span><strong>'+state.goal.toLocaleString('ru-RU')+' ₽</strong></div>'}
function renderRequirements(p){const pro=p.rank.includes('PRO');const req=[`Поддерживать личный объём не ниже ${state.pv} PV.`,`Создать ${p.branches} активных направлений первой линии.`,`Довести ключевые ветви до целевых квалификаций: ${p.branchRanks.join(', ')}.`,`Контролировать ЛГО и распределение объёма, а не только общий товарооборот.`];if(pro)req.push('Иметь минимум 5 активных партнёров первой линии и выполнять PRO-условия каждый период квартала.');$('#requirements').innerHTML=req.map((x,i)=>`<div class="req"><i>${i+1}</i><span>${x}</span></div>`).join('')}
function renderRoadmap(p){const months=[{h:'МЕСЯЦ 1 — ФУНДАМЕНТ',t:'Закрепить личный объём, сформировать список кандидатов и открыть первые направления.',u:['ЛО '+state.pv+' PV','20–40 новых диалогов','Первые 1–2 активных партнёра']},{h:'МЕСЯЦ 2 — ВЕТВИ',t:'Определить потенциальных лидеров и запустить дубликацию простых действий.',u:['Усилить '+Math.min(3,p.branches)+' ветви','Вывести партнёров на S1/S2','Проводить еженедельные разборы']},{h:'МЕСЯЦ 3 — КВАЛИФИКАЦИЯ',t:'Закрыть дефицит объёма, усилить слабую ветвь и сформировать резерв.',u:['Цель: '+p.rank,'Проверить требования по ветвям','Создать запас 10–15% объёма']}];$('#roadmap').innerHTML=months.map(m=>`<div class="month"><h3>${m.h}</h3><p>${m.t}</p><ul>${m.u.map(x=>`<li>${x}</li>`).join('')}</ul></div>`).join('')}
updateStep();
