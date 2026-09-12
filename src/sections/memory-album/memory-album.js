export function setupMemoryAlbum() {
 const button=document.querySelector('[data-action="memory-album"]'); if(!button)return; let overlay=null;
 const close=()=>{if(!overlay)return; overlay.classList.remove("is-open"); document.body.classList.remove("memory-album-open"); setTimeout(()=>{overlay?.remove();overlay=null},220)};
 button.addEventListener("click",()=>{if(overlay)return; overlay=document.createElement("div"); overlay.id="memory-album-overlay"; overlay.className="memory-album-overlay"; overlay.innerHTML=`<div class="memory-album-backdrop"></div><div class="memory-album-window"><button class="memory-album-close" type="button" aria-label="Close Memory Album">×</button><iframe class="memory-album-frame" src="/memory-album/index.html" title="Memory Album"></iframe></div>`; document.body.appendChild(overlay); document.body.classList.add("memory-album-open"); overlay.querySelector(".memory-album-backdrop").onclick=close; overlay.querySelector(".memory-album-close").onclick=close; requestAnimationFrame(()=>overlay.classList.add("is-open"));});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&overlay)close()});
}
