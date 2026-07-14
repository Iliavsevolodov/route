import { useMemo, useState } from 'react';
import { ArrowRight, RotateCcw, Target, Users, WalletCards, Gift, Route, Sparkles } from 'lucide-react';

type SalesMode='sales'|'mixed'|'team';
type Plan={rank:string;lgo:number;branches:string[];pro:'none'|'L'|'M';active:number;strategy:string;note:string};

const goals=[10000,20000,35000,50000,70000,100000,150000,200000];
const ranks=['Новичок','S1','S2','L','L1','L2','L3','M','M1','M2','GM'];
const plans:Record<number,Plan>={
10000:{rank:'S1',lgo:750,branches:['S1'],pro:'none',active:2,strategy:'Клиентская',note:'Личный объём, первые клиенты и первая активная ветвь.'},
20000:{rank:'S2',lgo:1500,branches:['S1','S1'],pro:'none',active:3,strategy:'Клиентско-командная',note:'Клиенты дают быстрый доход, две ветви создают рост.'},
35000:{rank:'L',lgo:3000,branches:['S2','S1','S1'],pro:'none',active:4,strategy:'Смешанная',note:'ЛГО 3000 PV и развитие нескольких самостоятельных направлений.'},
50000:{rank:'L1',lgo:2000,branches:['L','S2','S1'],pro:'none',active:5,strategy:'Лидерская',note:'Первая лидерская ветвь плюс резервные направления.'},
70000:{rank:'L PRO',lgo:5000,branches:['L','S2','S1','S1','S1'],pro:'L',active:5,strategy:'PRO-модель',note:'Пять активных первой линии, ЛГО 5000 PV три периода подряд.'},
100000:{rank:'M PRO',lgo:3000,branches:['L','L','L','L','L'],pro:'M',active:5,strategy:'Системная',note:'Пять лидерских ветвей, ЛГО 3000 PV и квартальные PRO-выплаты.'},
150000:{rank:'M1 PRO',lgo:3000,branches:['M','L','L','L','L'],pro:'M',active:5,strategy:'Масштабируемая',note:'Мастерская ветвь, четыре лидерские ветви и глубина.'},
200000:{rank:'M2 PRO',lgo:3000,branches:['M','M','L','L','L'],pro:'M',active:5,strategy:'Лидерская система',note:'Две мастерские ветви, три лидерские и устойчивый резерв.'}
};
const rub=(n:number)=>new Intl.NumberFormat('ru-RU').format(Math.round(n))+' ₽';

function App(){
 const [step,setStep]=useState(1),[goal,setGoal]=useState<number|null>(null),[sales,setSales]=useState<SalesMode|null>(null),[pv,setPv]=useState(200),[rank,setRank]=useState<string|null>(null),[done,setDone]=useState(false);
 const plan=useMemo(()=>goal?plans[goal]:null,[goal]);
 const canNext=step===1?!!goal:step===2?!!sales:step===4?!!rank:true;
 const next=()=>{if(!canNext)return; if(step<4)setStep(step+1);else setDone(true)};
 const reset=()=>{setDone(false);setStep(1)};
 const lPro=plan?plan.lgo*.03*90*3:0;
 const gift=pv>=500?pv*.2*90+450:pv>=200?pv*.1*90+450:pv>=50?450:0;
 const personal=pv>50?(pv-50)*.2*90:0;
 const modeText=sales==='sales'?'Клиенты и личный товарооборот':sales==='mixed'?'Баланс клиентов и команды':'Команда и развитие лидеров';
 return <div className="app">
  <header><b>HERO ROUTE 2.0</b><span>КОМАНДА «СУПЕРГЕРОИ» · GREENWAY 4.0</span></header>
  <main>
   {!done&&<>
    <section className="hero"><div><small>ПЕРСОНАЛЬНЫЙ БИЗНЕС-НАВИГАТОР</small><h1>МАРШРУТ<br/><mark>К ДОХОДУ</mark></h1><p>Выбери цель — система соберёт квалификацию, ветви, выплаты и детальный маршрут.</p></div><div className="orbit"><div className="core">ТЫ</div>{['ЦЕЛЬ','ВЕТВИ','PRO'].map((x,i)=><div key={x} className={'sat s'+i}>{x}</div>)}</div></section>
    <section className="wizard"><div className="progress"><i style={{width:`${step*25}%`}}/></div><div className="step-label">ШАГ {step} ИЗ 4</div>
     {step===1&&<><h2>Сколько ты хочешь получать в месяц?</h2><div className="grid">{goals.map(x=><button className={goal===x?'active':''} onClick={()=>setGoal(x)} key={x}>{rub(x)}</button>)}</div></>}
     {step===2&&<><h2>Как ты относишься к личным продажам?</h2><div className="stack">{[['sales','Люблю продавать','Основной упор на клиентов и повторные заказы.'],['mixed','Готов совмещать','Личные продажи плюс развитие ветвей.'],['team','Не люблю продавать','Фокус на партнёрах и лидерских квалификациях.']].map(([id,t,d])=><button className={sales===id?'active':''} onClick={()=>setSales(id as SalesMode)} key={id}><b>{t}</b><span>{d}</span></button>)}</div></>}
     {step===3&&<><h2>Какой личный объём ты готов делать?</h2><div className="range"><strong>{pv} PV</strong><input type="range" min="50" max="1000" step="50" value={pv} onChange={e=>setPv(+e.target.value)}/><div><span>50</span><span>500</span><span>1000 PV</span></div></div></>}
     {step===4&&<><h2>Какая у тебя квалификация сейчас?</h2><div className="grid ranks">{ranks.map(x=><button className={rank===x?'active':''} onClick={()=>setRank(x)} key={x}>{x}</button>)}</div></>}
     <div className="actions"><button disabled={step===1} onClick={()=>setStep(step-1)}>← НАЗАД</button><button className="primary" disabled={!canNext} onClick={next}>{step===4?'ПОСТРОИТЬ МАРШРУТ':'ДАЛЬШЕ'} <ArrowRight size={17}/></button></div>
    </section>
   </>}
   {done&&plan&&<section className="results">
    <div className="result-title"><div><small>ПЕРСОНАЛЬНЫЙ МАРШРУТ</small><h2>{rub(goal!)} В МЕСЯЦ</h2></div><button onClick={reset}><RotateCcw size={16}/> ИЗМЕНИТЬ</button></div>
    <div className="metrics"><article className="yellow"><Target/><small>ЦЕЛЕВАЯ ТОЧКА</small><strong>{plan.rank}</strong><p>{plan.note}</p></article><article><Users/><small>ЦЕЛЕВОЙ ЛГО</small><strong>{plan.lgo} PV</strong><p>Боковой объём без ветвей L и выше.</p></article><article><Route/><small>СТРАТЕГИЯ</small><strong>{plan.strategy}</strong><p>{modeText}</p></article></div>
    <Panel title="КАРТА ЦЕЛЕВОЙ СТРУКТУРЫ"><div className="tree"><div className="you">ТЫ<br/><b>{plan.rank}</b></div><div className="arrow">↓</div><div className="nodes">{plan.branches.map((b,i)=><div className={i<Math.ceil(plan.branches.length*.6)?'node key':'node reserve'} key={i}>{b}<small>ветвь {i+1}</small></div>)}</div></div></Panel>
    <div className="columns"><Panel title="ВЫПЛАТЫ ПО СЧЕТАМ"><Pay icon={<WalletCards/>} name="Валютный счёт" value={rub(personal)} text="Личный бонус: (ЛО − 50 PV) × 20% × 90 ₽."/><Pay icon={<Gift/>} name="Подарочный счёт" value={rub(gift)} text="5 у.е.; либо 10%/20% от ЛО + 5 у.е."/><Pay icon={<Sparkles/>} name="Квартальная часть" value={plan.pro==='L'?rub(lPro):plan.pro==='M'?'≈ 450–500 тыс. ₽':'—'} text={plan.pro==='M'?'Ориентир Master Pool, не фиксированная выплата.':plan.pro==='L'?'3% от ЛГО × 3 периода.':'PRO подключается с уровня L.'}/></Panel>
    <Panel title="PRO-КВАРТАЛ"><div className="flow">{(plan.pro==='M'?['5+ активных','ЛГО 3000 PV','5 лидерских ветвей','3 периода','L PRO + Master Pool']:plan.pro==='L'?['5+ активных',`ЛГО ${plan.lgo} PV`,'Квалификация L+','3 периода',`≈ ${rub(lPro)}`]:['Закрыть квалификацию','Создать резерв','Подготовить 5 активных']).map((x,i)=><div><b>{i+1}</b><span>{x}</span>{i<4&&<em>→</em>}</div>)}</div></Panel></div>
    <Panel title="ДЕТАЛЬНАЯ СТРАТЕГИЯ"><div className="strategy">{[['01','ЛИЧНЫЙ ФУНДАМЕНТ',[`ЛО ${pv} PV каждый период`,sales==='sales'?'15–25 активных клиентов':'5–12 активных клиентов','Повторные заказы и рекомендации']],['02','ПЕРВАЯ ЛИНИЯ',[`${plan.active}+ активных партнёров`,'2–3 новых запуска ежемесячно','Первые 2 активации — подарочный счёт']],['03','ВЕТВИ',[plan.branches.join(' · '),'Каждому лидеру отдельный маршрут','Не складывать объём в одну ветвь']],['04','РИТМ',[sales==='team'?'30–35 диалогов в неделю':'20–25 диалогов в неделю','6–10 презентаций в неделю','Еженедельный контроль цифр']]].map(([n,t,list])=><article><b>{n as string}</b><h3>{t as string}</h3><ul>{(list as string[]).map(x=><li>{x}</li>)}</ul></article>)}</div></Panel>
    <Panel title="МАРШРУТ НА 90 ДНЕЙ"><div className="roadmap">{[['МЕСЯЦ 1','ОСНОВА',[`ЛО ${pv} PV`,`${Math.max(2,Math.ceil(plan.active/2))} активных партнёра`,'Выбрать 2–3 потенциальных лидеров']],['МЕСЯЦ 2','ВЕТВИ',['Вывести первые ветви на S1/S2','Закрыть 70% целевого ЛГО','Еженедельный план каждой ветви']],['МЕСЯЦ 3','ФИКСАЦИЯ',[`Закрыть ${plan.rank}`,'Создать запас 10–15%','Проверить PRO до начала периода']]].map(([m,t,list],i)=><article><span>{m as string}</span><h3>{t as string}</h3><ul>{(list as string[]).map(x=><li>{x}</li>)}</ul>{i<2&&<div className="next">→</div>}</article>)}</div></Panel>
   </section>}
  </main><footer>HERO ROUTE 2.0 <span>Курс РФ: 1 у.е. = 90 ₽</span></footer>
 </div>
}
function Panel({title,children}:{title:string,children:any}){return <section className="panel"><h2>{title}</h2>{children}</section>}
function Pay({icon,name,value,text}:{icon:any,name:string,value:string,text:string}){return <div className="pay"><i>{icon}</i><div><b>{name}</b><p>{text}</p></div><strong>{value}</strong></div>}
export default App;
