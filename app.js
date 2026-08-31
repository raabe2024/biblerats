const B=window.BIBLE_BOOKS,K="biblerats-v01";let S=JSON.parse(localStorage.getItem(K)||"null")||{year:new Date().getFullYear(),minutesPerChapter:4,reads:{},favorites:{}},cur=null,filter="ALL",installPrompt=null;
const $=id=>document.getElementById(id),key=(i,c)=>i+":"+c,rd=(i,c)=>!!S.reads[key(i,c)],fv=(i,c)=>!!S.favorites[key(i,c)],bp=i=>{let n=0;for(let c=1;c<=B[i].chapters;c++)if(rd(i,c))n++;return n},pc=(n,d)=>d?Math.round(n/d*100):0;
function totals(){let chapters=0,favs=0,done=0,doing=0,at=0,nt=0;B.forEach((b,i)=>{let r=bp(i);chapters+=r;if(r===b.chapters)done++;else if(r)doing++;b.testament==="AT"?at+=r:nt+=r;for(let c=1;c<=b.chapters;c++)if(fv(i,c))favs++});return{chapters,favs,done,doing,at,nt}}
function time(n){let m=n*(+S.minutesPerChapter||4);return"≈"+Math.floor(m/60)+"h"+(m%60?" "+m%60+"m":"")}
function persist(){localStorage.setItem(K,JSON.stringify(S))}
function row(b,i,r){let p=pc(r,b.chapters);return`<div class="row" data-i="${i}"><div class="rowtop"><div><b>${b.name}</b><br><small>${r} de ${b.chapters} capítulos</small></div><b>${p}%</b></div><div class="bar"><i style="width:${p}%"></i></div></div>`}
function bindRows(root){root.querySelectorAll(".row").forEach(x=>x.onclick=()=>openBook(+x.dataset.i))}
function renderSummary(){let t=totals(),p=pc(t.chapters,1189),ap=pc(t.at,929),np=pc(t.nt,260);$("year").textContent=S.year;$("pct").textContent=p+"%";$("read").textContent=t.chapters;$("done").textContent=t.done;$("doing").textContent=t.doing;$("ring").style.background=`conic-gradient(var(--olive) ${p*3.6}deg,#e7e0d5 0)`;$("at").textContent=ap+"%";$("nt").textContent=np+"%";$("atb").style.width=ap+"%";$("ntb").style.width=np+"%";$("sch").textContent=t.chapters;$("sb").textContent=t.done+"/66";$("stime").textContent=time(t.chapters);$("sf").textContent=t.favs;let h="";B.forEach((b,i)=>{let r=bp(i);if(r&&r<b.chapters)h+=row(b,i,r)});$("progress").innerHTML=h||'<div class="card muted">Nenhum livro em andamento ainda.</div>';bindRows($("progress"))}
function renderBooks(){let q=$("search").value.toLowerCase(),h="";B.forEach((b,i)=>{if(filter!=="ALL"&&b.testament!==filter)return;if(q&&!b.name.toLowerCase().includes(q))return;h+=row(b,i,bp(i))});$("booklist").innerHTML=h;bindRows($("booklist"))}
function renderFavs(){let h="";B.forEach((b,i)=>{let a=[];for(let c=1;c<=b.chapters;c++)if(fv(i,c))a.push(c);if(a.length)h+=`<div class="row"><b>${b.name}</b><p class="muted">${a.map(c=>"★ "+b.name+" "+c).join(" · ")}</p></div>`});$("favlist").innerHTML=h||'<div class="card muted">Nenhum favorito ainda.</div>'}
function renderCats(){let C={};B.forEach((b,i)=>{C[b.category]??={r:0,t:0};C[b.category].r+=bp(i);C[b.category].t+=b.chapters});$("cats").innerHTML='<b>PROGRESSO POR CATEGORIA</b>'+Object.entries(C).map(([n,v])=>`<p>${n} · <b>${pc(v.r,v.t)}%</b></p><div class="bar"><i style="width:${pc(v.r,v.t)}%"></i></div>`).join("")}
function updateGlobal(){renderSummary();renderBooks();renderFavs();renderCats()}
function show(v){document.querySelectorAll(".view").forEach(x=>x.classList.remove("active"));$(v).classList.add("active");document.querySelectorAll("nav button").forEach(x=>x.classList.toggle("active",x.dataset.v===v))}
function paintChapter(i,c){let el=$("chapters").querySelector(`[data-c="${c}"]`);if(!el)return;el.classList.toggle("read",rd(i,c));let s=el.querySelector(".star");if(fv(i,c)){if(!s){s=document.createElement("span");s.className="star";s.textContent="★";el.appendChild(s)}}else if(s)s.remove()}
function updateBookStats(i){let b=B[i],r=bp(i),p=pc(r,b.chapters);$("bookcount").textContent=`${r} de ${b.chapters} capítulos lidos`;$("bookbar").style.width=p+"%";$("bookpct").textContent=p+"%"}
function toggleRead(i,c){let k=key(i,c);if(S.reads[k]){delete S.reads[k];delete S.favorites[k]}else S.reads[k]=true;persist();paintChapter(i,c);updateBookStats(i);updateGlobal()}
function toggleFav(i,c){let k=key(i,c);if(!S.reads[k])S.reads[k]=true;if(S.favorites[k])delete S.favorites[k];else S.favorites[k]=true;persist();paintChapter(i,c);updateBookStats(i);updateGlobal()}
function openBook(i){cur=i;let b=B[i];$("bookname").textContent=b.name;$("bookmeta").textContent=`${b.chapters} capítulos · ${b.testament==="AT"?"Antigo":"Novo"} Testamento`;let h="";for(let c=1;c<=b.chapters;c++)h+=`<button class="ch ${rd(i,c)?"read":""}" data-c="${c}">${c}${fv(i,c)?'<span class="star">★</span>':""}</button>`;$("chapters").innerHTML=h;updateBookStats(i);$("chapters").querySelectorAll(".ch").forEach(btn=>{let timer=null,c=+btn.dataset.c;btn.addEventListener("click",()=>{if(timer)return;timer=setTimeout(()=>{timer=null;toggleRead(i,c)},260)});btn.addEventListener("dblclick",e=>{e.preventDefault();if(timer){clearTimeout(timer);timer=null}toggleFav(i,c)})});show("book")}
document.querySelectorAll("nav button").forEach(x=>x.onclick=()=>show(x.dataset.v));document.querySelectorAll(".tabs button").forEach(x=>x.onclick=()=>{filter=x.dataset.f;document.querySelectorAll(".tabs button").forEach(y=>y.classList.toggle("active",x===y));renderBooks()});$("search").oninput=renderBooks;$("back").onclick=()=>show("bible");$("gear").onclick=()=>{$("minutes").value=S.minutesPerChapter;$("settings").showModal()};$("minutes").onchange=()=>{S.minutesPerChapter=+$("minutes").value||4;persist();updateGlobal()};
$("export").onclick=()=>{let a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(S,null,2)],{type:"application/json"}));a.download=`biblerats-backup-${S.year}.json`;a.click()};$("import").onchange=async e=>{try{S=JSON.parse(await e.target.files[0].text());persist();updateGlobal();$("settings").close();alert("Backup importado.")}catch{alert("Arquivo inválido.")}};

function isStandalone(){return window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone===true}
function installDismissed(){return sessionStorage.getItem("biblerats-install-dismissed")==="1"}
function hideInstallUI(){ $("installCard").hidden=true; $("install").hidden=true }
function refreshInstallUI(){
  if(isStandalone()||installDismissed()){hideInstallUI();return}
  if(installPrompt){
    $("installCard").classList.remove("ios-install");
    $("installCard").hidden=false;
    $("install").hidden=false;
  }
}
async function requestInstall(){
  if(isStandalone()){hideInstallUI();return}
  if(!installPrompt)return;
  installPrompt.prompt();
  const choice=await installPrompt.userChoice;
  if(choice.outcome==="accepted") hideInstallUI();
  installPrompt=null;
}
window.addEventListener("beforeinstallprompt",e=>{
  e.preventDefault();
  installPrompt=e;
  refreshInstallUI();
});
window.addEventListener("appinstalled",()=>{
  installPrompt=null;
  hideInstallUI();
});
$("installHome").onclick=requestInstall;
$("install").onclick=requestInstall;
$("dismissInstall").onclick=()=>{
  sessionStorage.setItem("biblerats-install-dismissed","1");
  $("installCard").hidden=true;
};
if(isStandalone())hideInstallUI();

if("serviceWorker"in navigator)navigator.serviceWorker.register("./service-worker.js");updateGlobal();