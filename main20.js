/* main.js - Chore Coach Routine Manager
   Nested routines, automatic sub-chore timer progression,
   coach announcements, pause/resume/skip, light-show mode,
   vibration, and localStorage persistence.
*/
"use strict";

const STORAGE_KEY = "choreCoachRoutines_v1";
const state = {
  routines: [], activeRoutine: null, choreIndex: 0, subChoreIndex: 0,
  remainingSeconds: 0, timerId: null, running: false, paused: false,
  lightShow: false, audioEnabled: true, warningTriggered: false
};

const $ = id => document.getElementById(id);
const first = (...ids) => ids.map($).find(Boolean) || null;
const el = {
  routineType:first("routine-type","routineType"), routineName:first("routine-name","routineName"),
  routineList:first("routine-list","routineList","routines-list"),
  choreName:first("chore-name","choreName"), choreMinutes:first("chore-minutes","choreMinutes"),
  subName:first("subchore-name","subChoreName","sub-chore-name"), subMinutes:first("subchore-minutes","subChoreMinutes","sub-chore-minutes"),
  choreList:first("chore-list","choreList"), routineSelector:first("routine-selector","routineSelector"),
  currentRoutine:first("current-routine","currentRoutine"), currentChore:first("current-chore","currentChore"),
  currentSub:first("current-subchore","currentSubChore","current-sub-chore"), timer:first("timer","countdown","timer-display"),
  progress:first("routine-progress","progress-text","routineProgress"), progressBar:first("routine-progress-bar","progress-bar","routineProgressBar"),
  coach:first("coach-message","coachMessage","message","status-message"),
  pause:first("btn-pause","pause-btn","pause"), resume:first("btn-resume","resume-btn","resume"), skip:first("btn-skip","skip-btn","skip"),
  start:first("btn-start-routine","start-routine","startRoutine"), stop:first("btn-stop-routine","stop-routine","stopRoutine"),
  save:first("btn-save-routine","save-routine","saveRoutine"), addChore:first("btn-add-chore","add-chore","addChore"),
  addSub:first("btn-add-subchore","add-subchore","addSubChore"), light:first("btn-lightshow","lightshow-toggle","lightShowToggle"),
  audio:first("btn-audio","audio-toggle","sound-toggle","btn-sfx")
};

function id(p){return `${p}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`}
function text(v){return String(v??"").trim()}
function sec(m){return Math.max(1,Math.round((Number(m)||1)*60))}
function time(s){s=Math.max(0,Math.floor(s));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return h?`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(x).padStart(2,"0")}`:`${String(m).padStart(2,"0")}:${String(x).padStart(2,"0")}`}
function speechDuration(s){const m=Math.floor(s/60),x=s%60;return m?(x?`${m} minute${m===1?"":"s"} and ${x} seconds`:`${m} minute${m===1?"":"s"}`):`${x} second${x===1?"":"s"}`}
function setCoach(msg,announce=false){if(el.coach)el.coach.textContent=msg;if(announce)speak(msg)}
function speak(msg){if(!state.audioEnabled||state.lightShow||!("speechSynthesis"in window))return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(msg);u.rate=.95;speechSynthesis.speak(u)}catch(e){console.warn(e)}}
function vibrate(p){if(state.lightShow&&navigator.vibrate)try{navigator.vibrate(p)}catch(e){}}
function light(c){if(!state.lightShow)return;document.body.classList.remove("lightshow-green","lightshow-yellow","lightshow-red");document.body.classList.add(`lightshow-${c}`)}
function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state.routines))}catch(e){console.warn(e)}}
function load(){try{state.routines=JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");if(!Array.isArray(state.routines))state.routines=[]}catch(e){state.routines=[]}}
function sub(name,minutes){return{id:id("sub"),name:text(name),minutes:Math.max(.1,Number(minutes)||1)}}
function chore(name,minutes){return{id:id("chore"),name:text(name),minutes:Math.max(.1,Number(minutes)||1),subChores:[]}}
function routine(name,type,chores){return{id:id("routine"),name:text(name),type:type||"Daily",chores}}

state.builderChores=[];
function renderBuilder(){if(!el.choreList)return;el.choreList.innerHTML="";if(!state.builderChores.length){el.choreList.textContent="No chores added yet.";return}state.builderChores.forEach((c,i)=>{const box=document.createElement("div");box.className="builder-chore";const h=document.createElement("div");h.className="builder-chore-heading";const n=document.createElement("strong");n.textContent=`${c.name} — ${c.minutes} min`;const rm=document.createElement("button");rm.type="button";rm.textContent="Remove";rm.onclick=()=>{state.builderChores.splice(i,1);renderBuilder()};h.append(n,rm);box.appendChild(h);const list=document.createElement("div");list.className="builder-subchores";c.subChores.forEach((s,j)=>{const r=document.createElement("div");r.className="builder-subchore";const t=document.createElement("span");t.textContent=`${s.name} — ${s.minutes} min`;const b=document.createElement("button");b.type="button";b.textContent="×";b.onclick=()=>{c.subChores.splice(j,1);renderBuilder()};r.append(t,b);list.appendChild(r)});box.appendChild(list);el.choreList.appendChild(box)})}
function addChore(){const n=text(el.choreName?.value),m=Number(el.choreMinutes?.value);if(!n)return alert("Enter a chore name.");if(!(m>0))return alert("Enter a chore duration greater than 0 minutes.");state.builderChores.push(chore(n,m));if(el.choreName)el.choreName.value="";if(el.choreMinutes)el.choreMinutes.value="";renderBuilder()}
function addSub(){const n=text(el.subName?.value),m=Number(el.subMinutes?.value);if(!state.builderChores.length)return alert("Add a chore first. New sub-chores are added to the most recently added chore.");if(!n)return alert("Enter a sub-chore name.");if(!(m>0))return alert("Enter a sub-chore duration greater than 0 minutes.");state.builderChores.at(-1).subChores.push(sub(n,m));if(el.subName)el.subName.value="";if(el.subMinutes)el.subMinutes.value="";renderBuilder()}
function saveRoutine(){const n=text(el.routineName?.value),type=text(el.routineType?.value)||"Daily";if(!n)return alert("Enter a routine name.");if(!state.builderChores.length)return alert("Add at least one chore.");const r=routine(n,type,state.builderChores.map(c=>({...c,subChores:c.subChores.map(s=>({...s}))})));state.routines.push(r);state.builderChores=[];save();renderBuilder();renderRoutines();populate();setCoach(`${r.name} saved. Ready when you are!`,true)}
function renderRoutines(){if(!el.routineList)return;el.routineList.innerHTML="";if(!state.routines.length){el.routineList.textContent="No routines saved yet.";return}state.routines.forEach(r=>{const row=document.createElement("div");row.className="routine-item";const info=document.createElement("div");const title=document.createElement("strong");title.textContent=r.name;const small=document.createElement("small");small.textContent=`${r.type} • ${r.chores.length} chore${r.chores.length===1?"":"s"}`;info.append(title,small);const a=document.createElement("div");const start=document.createElement("button");start.type="button";start.textContent="Start";start.onclick=()=>startRoutine(r.id);const del=document.createElement("button");del.type="button";del.textContent="Delete";del.onclick=()=>deleteRoutine(r.id);a.append(start,del);row.append(info,a);el.routineList.appendChild(row)})}
function populate(){if(!el.routineSelector)return;el.routineSelector.innerHTML="";const p=document.createElement("option");p.value="";p.textContent="Select a routine";el.routineSelector.appendChild(p);state.routines.forEach(r=>{const o=document.createElement("option");o.value=r.id;o.textContent=`${r.type}: ${r.name}`;el.routineSelector.appendChild(o)})}
function deleteRoutine(rid){const r=state.routines.find(x=>x.id===rid);if(!r||!confirm(`Delete "${r.name}"?`))return;state.routines=state.routines.filter(x=>x.id!==rid);if(state.activeRoutine?.id===rid)stopRoutine(false);save();renderRoutines();populate()}

function currentChore(){return state.activeRoutine?.chores[state.choreIndex]||null}
function currentSub(){const c=currentChore();return c?.subChores?.length?c.subChores[state.subChoreIndex]:null}
function currentUnit(){return currentSub()||currentChore()}
function display(){const r=state.activeRoutine,c=currentChore(),s=currentSub();if(el.currentRoutine)el.currentRoutine.textContent=r?.name||"No routine active";if(el.currentChore)el.currentChore.textContent=c?.name||"—";if(el.currentSub)el.currentSub.textContent=s?.name||(c?.subChores?.length?"—":"Chore timer");if(el.timer)el.timer.textContent=time(state.remainingSeconds);progress();buttons()}
function progress(){if(!state.activeRoutine){if(el.progress)el.progress.textContent="0%";if(el.progressBar)el.progressBar.style.width="0%";return}let total=0,done=0;state.activeRoutine.chores.forEach((c,i)=>{const n=c.subChores?.length||1;total+=n;if(i<state.choreIndex)done+=n});done+=state.subChoreIndex;const p=Math.min(100,Math.round(done/Math.max(1,total)*100));if(el.progress)el.progress.textContent=`${p}%`;if(el.progressBar)el.progressBar.style.width=`${p}%`}
function buttons(){if(el.pause)el.pause.disabled=!state.running||state.paused;if(el.resume)el.resume.disabled=!state.running||!state.paused;if(el.skip)el.skip.disabled=!state.running;if(el.stop)el.stop.disabled=!state.running}
function stopInterval(){if(state.timerId!==null){clearInterval(state.timerId);state.timerId=null}}
function startInterval(){stopInterval();state.timerId=setInterval(()=>{if(!state.running||state.paused)return;state.remainingSeconds--;display();warning();if(state.remainingSeconds<=0)finish()},1000)}
function warning(){if(state.warningTriggered)return;const u=currentUnit();if(!u)return;const duration=sec(u.minutes);const warning=Math.min(300,Math.max(10,Math.floor(duration*.1667)));if(state.remainingSeconds<=warning){state.warningTriggered=true;const msg=`You are getting close to the end of ${u.name}. If you need more time, hit pause. Otherwise, the next sub-chore will start automatically.`;if(state.lightShow){light("yellow");vibrate([300,100,300,100,300])}else speak(msg);setCoach(msg,false)}}
function nextPosition(){const r=state.activeRoutine,c=currentChore();if(!r)return null;if(c?.subChores?.length&&state.subChoreIndex+1<c.subChores.length)return{choreIndex:state.choreIndex,subChoreIndex:state.subChoreIndex+1};if(state.choreIndex+1<r.chores.length)return{choreIndex:state.choreIndex+1,subChoreIndex:0};return null}
function startRoutine(rid){const r=state.routines.find(x=>x.id===rid);if(!r||!r.chores.length)return alert("This routine has no chores.");stopInterval();state.activeRoutine=r;state.choreIndex=0;state.subChoreIndex=0;state.running=true;state.paused=false;state.warningTriggered=false;beginUnit()}
function beginUnit(){const u=currentUnit();if(!u)return completeRoutine();state.remainingSeconds=sec(u.minutes);state.warningTriggered=false;display();const msg=`${u.name} starts now. ${speechDuration(state.remainingSeconds)}.`;setCoach(msg,!state.lightShow);if(state.lightShow){light("green");vibrate([150,80,150])}startInterval()}
function finish(){stopInterval();state.remainingSeconds=0;display();const u=currentUnit();if(state.lightShow){light("red");vibrate([500,150,500,150,800])}else speak(`${u?.name||"Chore"} complete!`);const next=nextPosition();if(!next)return setTimeout(completeRoutine,700);state.choreIndex=next.choreIndex;state.subChoreIndex=next.subChoreIndex;setTimeout(()=>{if(state.running)beginUnit()},900)}
function completeRoutine(){stopInterval();state.running=false;state.paused=false;state.remainingSeconds=0;display();if(state.lightShow){light("red");vibrate([600,150,600,150,1000])}else speak(`${state.activeRoutine?.name||"Routine"} is complete. Excellent work!`);setCoach(`${state.activeRoutine?.name||"Routine"} is complete. Excellent work!`,false);buttons()}
function pauseRoutine(){if(!state.running||state.paused)return;state.paused=true;stopInterval();if(state.lightShow){light("yellow");vibrate([200,100,200])}else if("speechSynthesis"in window)speechSynthesis.cancel();setCoach("Timer paused. Press Resume when you are ready.") ;buttons()}
function resumeRoutine(){if(!state.running||!state.paused)return;state.paused=false;if(state.lightShow){light("green");vibrate([150,80,150])}else speak(`Resuming ${currentUnit()?.name||"your chore"}. ${speechDuration(state.remainingSeconds)} remaining.`);setCoach(`Resuming ${currentUnit()?.name||"your chore"}. ${speechDuration(state.remainingSeconds)} remaining.`);startInterval()}
function skip(){if(!state.running)return;stopInterval();const n=nextPosition();if(!n)return completeRoutine();state.choreIndex=n.choreIndex;state.subChoreIndex=n.subChoreIndex;beginUnit()}
function stopRoutine(announce=true){stopInterval();state.running=false;state.paused=false;state.remainingSeconds=0;if("speechSynthesis"in window)speechSynthesis.cancel();document.body.classList.remove("lightshow-green","lightshow-yellow","lightshow-red");if(announce)setCoach("Routine stopped.");display()}
function toggleLight(){state.lightShow=!state.lightShow;if(state.lightShow){state.audioEnabled=false;if(el.audio)el.audio.textContent="🔇 Audio: OFF";if(el.light)el.light.textContent="💡 Light Show: ON";if("speechSynthesis"in window)speechSynthesis.cancel();light("green");vibrate([100,80,100]);setCoach("Light Show Mode is ON. Audio is disabled.")}else{document.body.classList.remove("lightshow-green","lightshow-yellow","lightshow-red");if(el.light)el.light.textContent="💡 Light Show: OFF";setCoach("Light Show Mode is OFF.")}}
function toggleAudio(){if(state.lightShow){setCoach("Audio is disabled while Light Show Mode is active.");return}state.audioEnabled=!state.audioEnabled;if(!state.audioEnabled&&"speechSynthesis"in window)speechSynthesis.cancel();if(el.audio)el.audio.textContent=state.audioEnabled?"🔊 Audio: ON":"🔇 Audio: OFF"}

[[el.save,"click",saveRoutine],[el.addChore,"click",addChore],[el.addSub,"click",addSub],[el.pause,"click",pauseRoutine],[el.resume,"click",resumeRoutine],[el.skip,"click",skip],[el.stop,"click",()=>stopRoutine(true)],[el.light,"click",toggleLight],[el.audio,"click",toggleAudio]].forEach(([x,e,f])=>x?.addEventListener(e,f));
el.start?.addEventListener("click",()=>{const rid=el.routineSelector?.value;if(!rid)return alert("Select a routine first.");startRoutine(rid)});
document.addEventListener("keydown",e=>{if(e.target.matches("input,textarea,select"))return;if(e.code==="Space"){e.preventDefault();state.running?(state.paused?resumeRoutine():pauseRoutine()):null}if(e.code==="ArrowRight"&&state.running)skip()});
window.ChoreCoach={state,startRoutine,pauseRoutine,resumeRoutine,skip,stopRoutine,saveRoutine,addChore,addSub,toggleLight,toggleAudio};
function init(){load();renderRoutines();renderBuilder();populate();display();if(el.audio)el.audio.textContent="🔊 Audio: ON";if(el.light)el.light.textContent="💡 Light Show: OFF";console.log("Chore Coach routine system ready.")}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
