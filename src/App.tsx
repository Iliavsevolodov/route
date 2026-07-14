import { useMemo, useState } from 'react';
import { ArrowRight, RotateCcw, Target, Users, WalletCards, Gift, Route, Sparkles } from 'lucide-react';

type SalesMode='sales'|'mixed'|'team';
type Plan={rank:string;lgo:number;branches:string[];pro:'none'|'L'|'M';active:number;strategy:string;note:string};

const ranks=['Новичок','S1','S2','L','L1','L2','L3','M','M1','M2','GM'];
const planSteps:{max:number;plan:Plan}[]=[
 {max:15000,plan:{rank:'S1',lgo:750,branches:['S1'],pro:'none',active:2,strategy:'Клиентская',note:'Личный объём, первые клиенты и первая активная ветвь.'}},
 {max:25000,plan:{rank:'S2',lgo:1500,branches:['S1','S1'],pro:'none',active:3,strategy:'Клиентско-командная',note:'Клиенты дают быстрый доход, две ветви создают рост.'}},
 {max:40000,plan:{rank:'L',lgo:3000,branches:['S2','S1','S1'],pro:'none',active:4,strategy:'Смешанная',note:'ЛГО 3000 PV и развитие нескольких самостоятельных направлений.'}},
 {max:60000,plan:{rank:'L1',lgo:2000,branches:['L','S2','S1'],pro:'none',active:5,strategy:'Лидерская',note:'Первая лидерская ветвь плюс резервные направления.'}},
 {max:85000,plan:{rank:'L PRO',lgo:5000,branches:['L','S2','S1','S1','S1'],pro:'L',active:5,strategy:'PRO-модель',note:'Пять активных первой линии, ЛГО 5000 PV три периода подряд.'}},
 {max:125000,plan:{rank:'M PRO',lgo:3000,branches:['L','L','L','L','L'],pro:'M',active:5,strategy:'Системная',note:'Пять лидерских ветвей, ЛГО 3000 PV и квартальные PRO-выплаты.'}},
 {max:175000,plan:{rank:'M1 PRO',lgo:3000,branches:['M','L','L','L','L'],pro:'M',active:5,strategy:'Масштабируемая',note:'Мастерская ветвь, четыре лидерские ветви и глубина.'}},
 {max:250000,plan:{rank:'M2 PRO',lgo:3000,branches:['M','M','L','L','L'],pro:'M',active:5,strategy:'Лидерская система',note:'Две мастерские ветви, три лидерские и устойчивый резерв.'}},
 {max:350000,plan:{rank:'GM PRO',lgo:3000,branches:['M','M','M','M','M'],pro:'M',active:5,strategy:'Гранд-мастерская',note:'Пять мастерских ветвей, СГО от 150 000 PV и глубокая лидерская структура.'}},
 {max:500000,plan:{rank:'GM1 PRO',lgo:3000,branches:['GM','M2','M','M','M'],pro:'M',active:5,strategy:'Бриллиантовая',note:'Гранд-мастерская ветвь, мастерские направления и доступ к Diamond Team при выполнении СГО.'}}
];
const rub=(n:number)=>new Intl.NumberFormat('ru-RU').format(Math.round(n))+' ₽';
const clamp=(n:number,min:number,max:number)=>Math.min(max,Math.max(min,n));

function App(){
 const [step,setStep]=useState(1),[goal,setGoal]=useState(70000),[sales,setSales]=useState<SalesMode|null>(null),[pv,setPv]=useState(200),[rank,setRank]=useState<string|null>(null),[done,setDone]=useState(false);
 const plan=useMemo(()=>planSteps.find(x=>goal<=x.max)?.plan ?? planSteps[planSteps.length-1].plan,[goal]);
 const canNext=step===1?goal>=1000&&goal<=500000:step===2?!!sales:step===3?pv>=50:step===4?!!rank:true;
 const next=()=>{if(!canNext)return;if(step<4)setStep(step+1);else setDone(true)};
 const reset=()=>{setDone(false);setStep(1)};
 const lPro=plan.lgo*.03*90*3;
 const gift=pv>=500?pv*.2*90+450:pv>=200?pv*.1*90+450:pv>=50?450:0;
 const personal=pv>50?(pv-50)*.2*90:0;
 const modeText=sales==='sales'?'Клиенты и личный товарооборот':sales==='mixed'?'Баланс клиентов и команды':'Команда и развитие лидеров';
 return <div className="app">
  <header><b>HERO ROUTE 2.1</b><span>КОМАНДА «СУПЕРГЕРОИ» · GREENWAY 4.0</span></header>
  <main>
   {!done&&<>
    <section className="hero"><div><small>ПЕРСОНАЛЬНЫЙ БИЗНЕС-НАВИГАТОР</small><h1>МАРШРУТ<br/><mark>К ДОХОДУ</mark></h1><p>Введи желаемый доход и личный объём — система соберёт квалификацию, ветви, выплаты и детальный маршрут.</p></div><div className="orbit"><div className="core">ТЫ</div>{['ЦЕЛЬ','ВЕТВИ','PRO'].map((x,i)=><div key={x} className={'sat s'+i}>{x}</div>)}</div></section>
    <section className="wizard"><div className="progress"><i style={{width:`${step*25}%`}}/></div><div className="step-label">ШАГ {step} ИЗ 4</div>
     {step===1&&<><h2>Какой доход ты хочешь получать в месяц?</h2><div className="custom-input-card"><label>Введи сумму до 500 000 ₽</label><div className="money-input"><input type="number" inputMode="numeric" min="1000" max="500000" step="1000" value={goal} onChange={e=>setGoal(clamp(Number(e.target.value)||0,0,500000))}/><span>₽</span></div><input type="range" min="10000" max="500000" step="5000" value={clamp(goal,10000,500000)} onChange={e=>setGoal(+e.target.value)}/><div className="range-labels"><span>10 000 ₽</span><span>250 000 ₽</span><span>500 000 ₽</span></div></div></>}
     {step===2&&<><h2>Как ты относишься к личным продажам?</h2><div className="stack">{[['sales','Люблю продавать','Основной упор на клиентов и повторные заказы.'],['mixed','Готов совмещать','Личные продажи плюс развитие ветвей.'],['team','Не люблю продавать','Фокус на партнёрах и лидерских квалификациях.']].map(([id,t,d])=><button className={sales===id?'active':''} onClick={()=>setSales(id as SalesMode)} key={id}><b>{t}</b><span>{d}</span></button>)}</div></>}
     {step===3&&<><h2>Какой личный объём ты готов делать?</h2><div className="custom-input-card"><label>Введи свой ЛО</label><div className="money-input pv-input"><input type="number" inputMode="numeric" min="50" max="10000" step="50" value={pv} onChange={e=>setPv(clamp(Number(e.target.value)||0,0,10000))}/><span>PV</span></div><input type="range" min="50" max="5000" step="50" value={clamp(pv,50,5000)} onChange={e=>setPv(+e.target.value)}/><div className="range-labels"><span>50 PV</span><span>2 500 PV</span><span>5 000 PV</span></div><p className="input-note">Можно ввести вручную значение до 10 000 PV.</p></div></>}
     {step===4&&<><h2>Какая у тебя квалификация сейчас?</h2><div className="grid ranks">{ranks.map(x=><button className={rank===x?'active':''} onClick={()=>setRank(x)} key={x}>{x}</button>)}</div></>}
     <div className="actions"><button disabled={step===1} onClick={()=>setStep(step-1)}>← НАЗАД</button><button className="primary" disabled={!canNext} onClick={next}>{step===4?'ПОСТРОИТЬ МАРШРУТ':'ДАЛЬШЕ'} <ArrowRight size={17}/></button></div>
    </section>
   </>}
   {done&&<section className="results">
    <div className="result-title"><div><small>ПЕРСОНАЛЬНЫЙ МАРШРУТ</small><h2>{rub(goal)} В МЕСЯЦ</h2></div><button onClick={reset}><RotateCcw size={16}/> ИЗМЕНИТЬ</button></div>
    <div className="metrics"><article className="yellow"><Target/><small>ЦЕЛЕВАЯ ТОЧКА</small><strong>{plan.rank}</strong><p>{plan.note}</p></article><article><Users/><small>ЦЕЛЕВОЙ ЛГО</small><strong>{plan.lgo} PV</strong><p>Боковой объём без ветвей L и выше.</p></article><article><Route/><small>СТРАТЕГИЯ</small><strong>{plan.strategy}</strong><p>{modeText}</p></article></div>
    <Panel title="КАРТА ЦЕЛЕВОЙ СТРУКТУРЫ"><div className="tree"><div className="you">ТЫ<br/><b>{plan.rank}</b></div><div className="arrow">↓</div><div className="nodes">{plan.branches.map((b,i)=><div className={i<Math.ceil(plan.branches.length*.6)?'node key':'node reserve'} key={i}>{b}<small>ветвь {i+1}</small></div>)}</div></div></Panel>
    <div className="columns"><Panel title="ВЫПЛАТЫ В РУБЛЯХ"><Pay icon={<WalletCards/>} name="Валютный счёт" value={rub(personal)} text="Личный бонус: 20% от объёма свыше 50 PV, пересчитано в рубли."/><Pay icon={<Gift/>} name="Подарочный счёт" value={rub(gift)} text={pv>=500?'20% от ЛО в рублях + 450 ₽.':pv>=200?'10% от ЛО в рублях + 450 ₽.':'При ЛО от 50 PV — 450 ₽.'}/><Pay icon={<Sparkles/>} name="Квартальная часть" value={plan.pro==='L'?rub(lPro):plan.pro==='M'?'≈ 450–500 тыс. ₽':'—'} text={plan.pro==='M'?'Ориентир Master Pool, не фиксированная выплата.':plan.pro==='L'?'3% от ЛГО за три периода, всё показано в рублях.':'PRO подключается с уровня L.'}/></Panel>
    <Panel title="PRO-КВАРТАЛ"><div className="flow">{(plan.pro==='M'?['5+ активных','ЛГО 3000 PV','5 лидерских ветвей','3 периода','L PRO + Master Pool']:plan.pro==='L'?['5+ активных',`ЛГО ${plan.lgo} PV`,'Квалификация L+','3 периода',`≈ ${rub(lPro)}`]:['Закрыть квалификацию','Создать резерв','Подготовить 5 активных']).map((x,i)=><div key={x}><b>{i+1}</b><span>{x}</span>{i<4&&<em>→</em>}</div>)}</div></Panel></div>
    <Panel title="ДЕТАЛЬНАЯ СТРАТЕГИЯ"><div className="strategy">{[['01','ЛИЧНЫЙ ФУНДАМЕНТ',[`ЛО ${pv} PV каждый период`,sales==='sales'?'15–25 активных клиентов':'5–12 активных клиентов','Повторные заказы и рекомендации']],['02','ПЕРВАЯ ЛИНИЯ',[`${plan.active}+ активных партнёров`,'2–3 новых запуска ежемесячно','Первые 2 активации — подарочный счёт']],['03','ВЕТВИ',[plan.branches.join(' · '),'Каждому лидеру отдельный маршрут','Не складывать объём в одну ветвь']],['04','РИТМ',[sales==='team'?'30–35 диалогов в неделю':'20–25 диалогов в неделю','6–10 презентаций в неделю','Еженедельный контроль цифр']]].map(([n,t,list])=><article key={n as string}><b>{n as string}</b><h3>{t as string}</h3><ul>{(list as string[]).map(x=><li key={x}>{x}</li>)}</ul></article>)}</div></Panel>
    <Panel title="МАРШРУТ НА 90 ДНЕЙ"><div className="roadmap">{[['МЕСЯЦ 1','ОСНОВА',[`ЛО ${pv} PV`,`${Math.max(2,Math.ceil(plan.active/2))} активных партнёра`,'Выбрать 2–3 потенциальных лидеров']],['МЕСЯЦ 2','ВЕТВИ',['Вывести первые ветви на S1/S2','Закрыть 70% целевого ЛГО','Еженедельный план каждой ветви']],['МЕСЯЦ 3','ФИКСАЦИЯ',[`Закрыть ${plan.rank}`,'Создать запас 10–15%','Проверить PRO до начала периода']]].map(([m,t,list],i)=><article key={m as string}><span>{m as string}</span><h3>{t as string}</h3><ul>{(list as string[]).map(x=><li key={x}>{x}</li>)}</ul>{i<2&&<div className="next">→</div>}</article>)}</div></Panel>
   </section>}
  </main><footer>HERO ROUTE 2.1 <span>Все выплаты отображаются в рублях</span></footer>
 </div>
}
function Panel({title,children}:{title:string,children:any}){return <section className="panel"><h2>{title}</h2>{children}</section>}
function Pay({icon,name,value,text}:{icon:any,name:string,value:string,text:string}){return <div className="pay"><i>{icon}</i><div><b>{name}</b><p>{text}</p></div><strong>{value}</strong></div>}
export default App;