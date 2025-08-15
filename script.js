/* WaveMuse — Vanilla JS Music App
 * Features: playlist + search, shuffle/repeat, keyboard shortcuts,
 * draggable seekbar, volume & mute, canvas audio visualizer, responsive UI.
 *
 * ⚠ Add/replace tracks below. You can use your own MP3s by putting them in /assets
 * and updating the "src" path.
 */
const tracks = [
  {
    title: "Sunny Mornings",
    artist: "Lofi Collective",
    // Royalty-free sample sources (replace if blocked in your region)
    src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Sakura_Hz/99_Sakura_Hz/Sakura_Hz_-_99_-_Chill.mp3",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Night Drive",
    artist: "Analog Dreams",
    src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Komiku/Komiku_-_Its_time_for_adventure/Komiku_-_18_-_Monday_8_AM.mp3",
    cover: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Waves",
    artist: "Oceanic",
    src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Komiku/Time_for_a_Sushi/Komiku_-_20_-_Time_for_Sushi.mp3",
    cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop"
  },
];

const audio = new Audio();
audio.preload = "metadata";

let currentIndex = 0;
let isPlaying = false;
let isShuffle = false;
let repeatMode = 0; // 0: off, 1: all, 2: one

// UI elements
const cover = document.getElementById("cover");
const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const currentEl = document.getElementById("current");
const durationEl = document.getElementById("duration");
const seek = document.getElementById("seek");
const vol = document.getElementById("vol");

const btnPlay = document.getElementById("btnPlay");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const btnShuffle = document.getElementById("btnShuffle");
const btnRepeat = document.getElementById("btnRepeat");
const btnMute = document.getElementById("btnMute");

const list = document.getElementById("list");
const searchInput = document.getElementById("searchInput");
const btnClearSearch = document.getElementById("btnClearSearch");

// Visualizer
const viz = document.getElementById("viz");
const ctx = viz.getContext("2d");
let ac, sourceNode, analyser, rafId;

// Helpers
function formatTime(sec){
  if (isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return ${m}:${s};
}
function setPlayIcon(playing){
  btnPlay.querySelector(".play-icon").style.display = playing ? "none" : "block";
  btnPlay.querySelector(".pause-icon").style.display = playing ? "block" : "none";
}
function randomIndex(){ return Math.floor(Math.random() * tracks.length); }

function load(index){
  currentIndex = index;
  const t = tracks[index];
  audio.src = t.src;
  cover.src = t.cover;
  titleEl.textContent = t.title;
  artistEl.textContent = t.artist;

  // highlight list
  document.querySelectorAll("#list li").forEach((li,i)=>{
    li.classList.toggle("active", i === index);
  });

  // reset progress
  seek.value = 0;
  currentEl.textContent = "0:00";
  durationEl.textContent = "0:00";
  // (re)connect analyser
  setupVisualizer();
}
function play(){ audio.play().then(()=>{ isPlaying = true; setPlayIcon(true); }).catch(console.warn); }
function pause(){ audio.pause(); isPlaying = false; setPlayIcon(false); }

function next(){
  if (isShuffle && repeatMode !== 2){
    let r = randomIndex();
    if (tracks.length > 1){
      while(r === currentIndex) r = randomIndex();
    }
    load(r);
  } else if (repeatMode === 2) {
    // repeat one -> reload same index to restart
    load(currentIndex);
  } else {
    // normal / repeat all
    if (currentIndex === tracks.length - 1){
      if (repeatMode === 1) currentIndex = -1;
      else { pause(); return; }
    }
    load(currentIndex + 1);
  }
  play();
}
function prev(){
  if (audio.currentTime > 3){ audio.currentTime = 0; return; }
  if (currentIndex === 0) currentIndex = tracks.length;
  load(currentIndex - 1);
  play();
}

function toggleRepeat(){
  repeatMode = (repeatMode + 1) % 3;
  let label = "off", iconTint = "";
  if (repeatMode === 1){ label = "all"; iconTint = "drop-shadow(0 0 6px #92e6a7)"; }
  if (repeatMode === 2){ label = "one"; iconTint = "drop-shadow(0 0 6px #92e6a7)"; }
  btnRepeat.title = Repeat: ${label};
  btnRepeat.style.filter = iconTint;
}
function toggleShuffle(){
  isShuffle = !isShuffle;
  btnShuffle.style.filter = isShuffle ? "drop-shadow(0 0 6px #92e6a7)" : "";
}

function renderList(items){
  list.innerHTML = "";
  items.forEach((t, i)=>{
    const li = document.createElement("li");
    li.innerHTML = `
      <img class="item-cover" src="${t.cover}" alt="">
      <div>
        <p class="item-title">${t.title}</p>
        <p class="item-artist">${t.artist}</p>
      </div>
      <span class="badge">${i === currentIndex ? "Now" : "Play"}</span>
    `;
    li.addEventListener("click", ()=>{
      load(i);
      play();
    });
    list.appendChild(li);
  });
}

function filterList(){
  const q = searchInput.value.trim().toLowerCase();
  const filtered = tracks.filter(t =>
    t.title.toLowerCase().includes(q) ||
    t.artist.toLowerCase().includes(q)
  );
  renderList(filtered);
}
btnClearSearch.addEventListener("click", ()=>{
  searchInput.value = "";
  renderList(tracks);
});
searchInput.addEventListener("input", filterList);

// Events
btnPlay.addEventListener("click", ()=> isPlaying ? pause() : play());
btnNext.addEventListener("click", next);
btnPrev.addEventListener("click", prev);
btnShuffle.addEventListener("click", toggleShuffle);
btnRepeat.addEventListener("click", toggleRepeat);

seek.addEventListener("input", ()=>{
  if (!isNaN(audio.duration)){
    audio.currentTime = (seek.value/1000) * audio.duration;
  }
});
vol.addEventListener("input", ()=>{ audio.volume = parseFloat(vol.value); });
btnMute.addEventListener("click", ()=>{
  audio.muted = !audio.muted;
  btnMute.style.filter = audio.muted ? "drop-shadow(0 0 6px #92e6a7)" : "";
});

audio.addEventListener("timeupdate", ()=>{
  currentEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);
  if (!isNaN(audio.duration)){
    seek.value = Math.floor((audio.currentTime / audio.duration) * 1000);
  }
});
audio.addEventListener("ended", next);
audio.addEventListener("loadedmetadata", ()=>{
  durationEl.textContent = formatTime(audio.duration);
});

// Keyboard shortcuts
document.addEventListener("keydown", (e)=>{
  if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;
  if (e.code === "Space"){ e.preventDefault(); isPlaying ? pause() : play(); }
  if (e.code === "ArrowRight"){ audio.currentTime = Math.min(audio.currentTime + 5, audio.duration||audio.currentTime); }
  if (e.code === "ArrowLeft"){ audio.currentTime = Math.max(audio.currentTime - 5, 0); }
  if (e.key.toLowerCase() === "s"){ toggleShuffle(); }
  if (e.key.toLowerCase() === "r"){ toggleRepeat(); }
  if (e.key.toLowerCase() === "m"){ audio.muted = !audio.muted; btnMute.style.filter = audio.muted ? "drop-shadow(0 0 6px #92e6a7)" : ""; }
});

// Visualizer (bars + glow)
function setupVisualizer(){
  try{
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    if (sourceNode) sourceNode.disconnect();
    if (analyser) analyser.disconnect();

    sourceNode = ac.createMediaElementSource(audio);
    analyser = ac.createAnalyser();
    analyser.fftSize = 1024;

    sourceNode.connect(analyser);
    analyser.connect(ac.destination);
  } catch(err){
    console.warn("Web Audio not available", err);
  }
  cancelAnimationFrame(rafId);
  drawViz();
}
function drawViz(){
  if (!analyser){ rafId = requestAnimationFrame(drawViz); return; }
  const w = viz.width = viz.clientWidth * devicePixelRatio;
  const h = viz.height = viz.clientHeight * devicePixelRatio;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);

  ctx.clearRect(0,0,w,h);

  // background glow based on average energy
  const avg = dataArray.reduce((a,b)=>a+b,0)/bufferLength;
  ctx.fillStyle = rgba(146, 230, 167, ${Math.min(0.28, (avg/255)*0.4)});
  ctx.shadowBlur = 60; ctx.shadowColor = "rgba(146,230,167,.6)";
  ctx.beginPath(); ctx.arc(w*0.5, h*0.9, Math.max(40, avg*1.2), 0, Math.PI*2); ctx.fill();

  // bars
  const barCount = Math.floor(w / 8);
  const step = Math.floor(bufferLength / barCount);
  const barWidth = Math.max(2, (w / barCount) * 0.6);
  ctx.shadowBlur = 0;

  for (let i=0; i<barCount; i++){
    const v = dataArray[i*step] || 0;
    const barHeight = (v/255) * (h*0.6);
    const x = i * (w / barCount);
    const y = h - barHeight - 10;
    ctx.fillStyle = rgba(255,255,255,0.7);
    ctx.fillRect(x, y, barWidth, barHeight);

    // accent tip
    ctx.fillStyle = rgba(146,230,167,0.9);
    ctx.fillRect(x, y-3, barWidth, 3);
  }

  rafId = requestAnimationFrame(drawViz);
}

// Init
renderList(tracks);
load(0);
setPlayIcon(false);
audio.volume = parseFloat(vol.value);

// Make the canvas responsive to DPR & resizing
new ResizeObserver(()=> drawViz()).observe(document.querySelector(".player"));
