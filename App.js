import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform } from 'react-native';

// On native (iPad/iPhone), use WebView. On web (Safari/Brave), use iframe.
let WebView;
if (Platform.OS !== 'web') {
  WebView = require('react-native-webview').WebView;
}

const HTML_CONTENT = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap" rel="stylesheet"/>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
    html, body { height: 100%; background: #fff9f0; }
    body { font-family: 'Fredoka One', cursive; padding: 10px; overflow-x: hidden; }
    @keyframes pop { 0%{transform:scale(0.8)} 50%{transform:scale(1.15)} 100%{transform:scale(1)} }
    @keyframes shake { 0%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} 100%{transform:translateX(0)} }
    @keyframes bounce { 0%{transform:scale(1)} 50%{transform:scale(1.2)} 100%{transform:scale(1)} }
    button { font-family: 'Fredoka One', cursive; }
    button:active { transform: scale(0.95) !important; }
    .pop { animation: pop 0.35s ease; }
    .shake { animation: shake 0.4s ease; }
    .bounce { animation: bounce 0.5s ease; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script type="text/babel">
const { useState } = React;

const ISLANDS = [
  { id:"colors",  name:"Color Cove",   bg:"#FFE4B5", accent:"#FF8C42", x:12, y:55, stars:0, description:"Learn all the colors of the rainbow!", icon:"🌈" },
  { id:"animals", name:"Animal Isle",  bg:"#D4F1C0", accent:"#4CAF50", x:38, y:35, stars:0, description:"Meet amazing creatures from around the world!", icon:"🦁" },
  { id:"shapes",  name:"Shape Shore",  bg:"#C9E8FF", accent:"#2196F3", x:63, y:58, stars:0, description:"Discover triangles, circles, and more!", icon:"🔷" },
  { id:"numbers", name:"Number Nook",  bg:"#F9D0FF", accent:"#9C27B0", x:82, y:30, stars:0, description:"Count your way through number land!", icon:"🔢" },
];

const GAMES = {
  colors: {
    title: "What Color Is This?",
    questions: [
      { answer:"Red",    options:["Red","Blue","Green","Yellow"],    color:"#E53935", emoji:"🍎" },
      { answer:"Blue",   options:["Purple","Blue","Orange","Pink"],  color:"#1E88E5", emoji:"🫐" },
      { answer:"Yellow", options:["Yellow","Green","Red","White"],   color:"#FDD835", emoji:"🌻" },
      { answer:"Green",  options:["Blue","Black","Green","Brown"],   color:"#43A047", emoji:"🌿" },
      { answer:"Orange", options:["Red","Orange","Pink","Yellow"],   color:"#FB8C00", emoji:"🍊" },
      { answer:"Purple", options:["Purple","Blue","Pink","Red"],     color:"#8E24AA", emoji:"🍇" },
      { answer:"Pink",   options:["Red","Orange","Pink","White"],    color:"#E91E8C", emoji:"🌸" },
      { answer:"White",  options:["Gray","Yellow","White","Silver"], color:"#F5F5F5", emoji:"☁️" },
    ],
  },
  animals: {
    title: "What Animal Is This?",
    questions: [
      { answer:"Lion",      options:["Tiger","Lion","Cheetah","Leopard"],    emoji:"🦁", sound:"Roar!" },
      { answer:"Elephant",  options:["Elephant","Hippo","Rhino","Giraffe"],  emoji:"🐘", sound:"Trumpet!" },
      { answer:"Penguin",   options:["Duck","Goose","Penguin","Puffin"],     emoji:"🐧", sound:"Squawk!" },
      { answer:"Butterfly", options:["Moth","Butterfly","Dragonfly","Bee"],  emoji:"🦋", sound:"Flutter!" },
      { answer:"Frog",      options:["Toad","Lizard","Frog","Salamander"],   emoji:"🐸", sound:"Ribbit!" },
      { answer:"Dolphin",   options:["Shark","Whale","Dolphin","Seal"],      emoji:"🐬", sound:"Click!" },
      { answer:"Owl",       options:["Owl","Eagle","Hawk","Falcon"],         emoji:"🦉", sound:"Hoo hoo!" },
      { answer:"Crab",      options:["Lobster","Shrimp","Crab","Jellyfish"], emoji:"🦀", sound:"Snap!" },
    ],
  },
  shapes: {
    title: "What Shape Is This?",
    questions: [
      { answer:"Circle",    options:["Oval","Circle","Sphere","Round"],               shape:"circle" },
      { answer:"Triangle",  options:["Triangle","Diamond","Arrow","Pyramid"],         shape:"triangle" },
      { answer:"Square",    options:["Rectangle","Square","Box","Diamond"],           shape:"square" },
      { answer:"Star",      options:["Sun","Star","Flower","Snowflake"],              shape:"star" },
      { answer:"Heart",     options:["Heart","Diamond","Club","Teardrop"],            shape:"heart" },
      { answer:"Diamond",   options:["Square","Rectangle","Diamond","Kite"],          shape:"diamond" },
      { answer:"Rectangle", options:["Square","Rectangle","Parallelogram","Trapezoid"], shape:"rectangle" },
      { answer:"Pentagon",  options:["Hexagon","Pentagon","Octagon","Triangle"],      shape:"pentagon" },
    ],
  },
  numbers: {
    title: "Count and Choose!",
    questions: [
      { answer:"3", options:["2","3","4","5"],    emoji:"🍎🍎🍎" },
      { answer:"5", options:["4","5","6","7"],    emoji:"⭐⭐⭐⭐⭐" },
      { answer:"2", options:["1","2","3","4"],    emoji:"🐶🐶" },
      { answer:"7", options:["6","7","8","9"],    emoji:"🌸🌸🌸🌸🌸🌸🌸" },
      { answer:"4", options:["3","4","5","6"],    emoji:"🦋🦋🦋🦋" },
      { answer:"6", options:["5","6","7","8"],    emoji:"🍕🍕🍕🍕🍕🍕" },
      { answer:"1", options:["1","2","3","4"],    emoji:"🏆" },
      { answer:"8", options:["7","8","9","10"],   emoji:"🎈🎈🎈🎈🎈🎈🎈🎈" },
    ],
  },
};

const SHAPES_SVG = {
  circle:    <circle cx="75" cy="75" r="60" fill="currentColor"/>,
  triangle:  <polygon points="75,15 140,135 10,135" fill="currentColor"/>,
  square:    <rect x="15" y="15" width="120" height="120" fill="currentColor"/>,
  star:      <polygon points="75,10 90,55 140,55 100,82 115,130 75,103 35,130 50,82 10,55 60,55" fill="currentColor"/>,
  heart:     <path d="M75,120 C35,90 5,65 5,40 C5,20 20,5 40,5 C55,5 68,14 75,28 C82,14 95,5 110,5 C130,5 145,20 145,40 C145,65 115,90 75,120Z" fill="currentColor"/>,
  diamond:   <polygon points="75,5 140,75 75,145 10,75" fill="currentColor"/>,
  rectangle: <rect x="5" y="30" width="140" height="90" fill="currentColor"/>,
  pentagon:  <polygon points="75,10 140,55 118,130 32,130 10,55" fill="currentColor"/>,
};

const btnStyle = (color) => ({
  background: color, color:"white", border:"none",
  borderRadius:14, padding:"14px 28px",
  fontFamily:"'Fredoka One',cursive", fontSize:17, fontWeight:700,
  cursor:"pointer", boxShadow:"0 4px 12px "+color+"66",
});

function Cloud({style}) {
  return (
    <div style={{position:"absolute",borderRadius:"50px",background:"rgba(255,255,255,0.7)",...style}}>
      <div style={{position:"absolute",width:"60%",height:"200%",background:"rgba(255,255,255,0.7)",borderRadius:"50%",top:"-60%",left:"15%"}}/>
      <div style={{position:"absolute",width:"40%",height:"160%",background:"rgba(255,255,255,0.7)",borderRadius:"50%",top:"-40%",left:"45%"}}/>
    </div>
  );
}

const CHAR_NAMES  = ["Pip","Zara","Boo","Max"];
const CHAR_COLORS = ["#FF8C42","#4CAF50","#2196F3","#9C27B0"];
const CHAR_EMOJIS = ["🧒","👧","🦸","🧑‍🚀"];

function CharacterSelect({onSelect}) {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:28,textAlign:"center",background:"linear-gradient(135deg,#fff9e6,#ffe0cc)",borderRadius:24,border:"4px solid #FF8C42"}}>
      <div style={{fontSize:52,marginBottom:8}}>🌍</div>
      <h2 style={{fontFamily:"'Fredoka One',cursive",fontSize:30,color:"#3a2a1a",marginBottom:6}}>Learn World</h2>
      <p style={{color:"#888",marginBottom:24,fontSize:16}}>Pick your explorer to begin!</p>
      <div style={{display:"flex",gap:16,flexWrap:"wrap",justifyContent:"center"}}>
        {CHAR_NAMES.map((name,i)=>(
          <button key={name} onClick={()=>onSelect({name,color:CHAR_COLORS[i],emoji:CHAR_EMOJIS[i]})} style={{
            background:"white", border:"3px solid "+CHAR_COLORS[i],
            borderRadius:20, padding:"18px 22px", cursor:"pointer",
            boxShadow:"0 4px 16px "+CHAR_COLORS[i]+"44",
          }}>
            <div style={{fontSize:52}}>{CHAR_EMOJIS[i]}</div>
            <div style={{fontFamily:"'Fredoka One',cursive",fontSize:18,color:CHAR_COLORS[i],marginTop:6}}>{name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function IslandTile({island, onClick, isUnlocked, stars}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={()=>isUnlocked&&onClick(island)}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{
        position:"absolute", left:island.x+"%", top:island.y+"%",
        cursor:isUnlocked?"pointer":"not-allowed",
        transform:hov&&isUnlocked?"scale(1.12) translateY(-6px)":"scale(1)",
        transition:"transform 0.25s cubic-bezier(.34,1.56,.64,1)",
        zIndex:hov?10:1,
      }}
    >
      <div style={{
        width:110, height:72, borderRadius:"50% 50% 40% 40%",
        background:"radial-gradient(ellipse at 40% 30%,"+island.bg+","+island.accent+"44)",
        border:"3px solid "+island.accent,
        boxShadow:"0 4px 14px "+island.accent+(hov?"88":"44"),
        display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
        position:"relative",
        filter:isUnlocked?"none":"grayscale(1) opacity(0.45)",
      }}>
        <span style={{fontSize:28}}>{island.icon}</span>
        {stars>0&&<div style={{position:"absolute",top:-10,right:-10,background:"#FFD700",borderRadius:"50%",width:26,height:26,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#333",border:"2px solid white"}}>{stars}⭐</div>}
        {!isUnlocked&&<span style={{position:"absolute",fontSize:18}}>🔒</span>}
      </div>
      <div style={{textAlign:"center",marginTop:5,fontFamily:"'Fredoka One',cursive",fontSize:12,fontWeight:700,color:"#3a2a1a",background:"rgba(255,255,255,0.65)",borderRadius:8,padding:"2px 7px"}}>{island.name}</div>
    </div>
  );
}

function WorldMap({islands, onIslandClick}) {
  return (
    <div style={{width:"100%",minHeight:460,background:"linear-gradient(160deg,#74C8E0,#5BA8C4 30%,#A8D5BA 60%,#C4E8A0)",borderRadius:20,position:"relative",overflow:"hidden",border:"3px solid #4a90b8"}}>
      <Cloud style={{width:75,height:26,top:"7%",left:"4%",opacity:0.8}}/>
      <Cloud style={{width:55,height:20,top:"13%",left:"28%",opacity:0.7}}/>
      <Cloud style={{width:90,height:30,top:"4%",left:"58%",opacity:0.75}}/>
      <Cloud style={{width:65,height:22,top:"17%",left:"83%",opacity:0.8}}/>
      <div style={{position:"absolute",top:14,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(135deg,#FF8C42,#FF6B35)",borderRadius:18,padding:"8px 24px",border:"3px solid rgba(255,255,255,0.5)",zIndex:20}}>
        <span style={{fontFamily:"'Fredoka One',cursive",fontSize:20,fontWeight:900,color:"white",letterSpacing:1}}>🌍 Learn World</span>
      </div>
      {islands.map((island,i)=>(
        <IslandTile key={island.id} island={island} onClick={onIslandClick}
          isUnlocked={i===0||islands[i-1].stars>0} stars={island.stars}/>
      ))}
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}>
        {islands.slice(0,-1).map((island,i)=>{
          const next=islands[i+1];
          return <line key={i} x1={(island.x+6)+"%"} y1={(island.y+5)+"%"} x2={(next.x+6)+"%"} y2={(next.y+5)+"%"} stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeDasharray="10,8"/>;
        })}
      </svg>
    </div>
  );
}

function IslandDetail({island, onPlay, onBack}) {
  return (
    <div style={{background:"linear-gradient(135deg,"+island.bg+",white)",borderRadius:24,padding:32,border:"4px solid "+island.accent,textAlign:"center"}}>
      <div style={{fontSize:72,marginBottom:8}}>{island.icon}</div>
      <h2 style={{fontFamily:"'Fredoka One',cursive",fontSize:30,color:"#3a2a1a",margin:"0 0 8px"}}>{island.name}</h2>
      <p style={{fontSize:17,color:"#555",marginBottom:28}}>{island.description}</p>
      {island.stars>0&&(
        <div style={{marginBottom:20,display:"flex",justifyContent:"center",gap:8}}>
          {[1,2,3].map(s=><span key={s} style={{fontSize:34,opacity:s<=island.stars?1:0.2}}>⭐</span>)}
        </div>
      )}
      <div style={{display:"flex",gap:12,justifyContent:"center"}}>
        <button onClick={onBack} style={{background:"white",color:island.accent,border:"2px solid "+island.accent,borderRadius:14,padding:"12px 24px",fontFamily:"'Fredoka One',cursive",fontSize:16,cursor:"pointer"}}>← Map</button>
        <button onClick={onPlay} style={btnStyle(island.accent)}>🎮 Play!</button>
      </div>
    </div>
  );
}

function GameScreen({island, game, onBack, onComplete}) {
  const [qIdx,setQIdx]           = useState(0);
  const [score,setScore]         = useState(0);
  const [selected,setSelected]   = useState(null);
  const [showResult,setShowResult] = useState(false);
  const [finished,setFinished]   = useState(false);
  const [animKey,setAnimKey]     = useState(0);
  const [animClass,setAnimClass] = useState("");

  const q     = game.questions[qIdx];
  const total = game.questions.length;

  const handleAnswer = (opt) => {
    if(selected) return;
    setSelected(opt);
    const correct = opt===q.answer;
    if(correct){ setScore(s=>s+1); setAnimClass("bounce"); }
    else { setAnimClass("shake"); }
    setAnimKey(k=>k+1);
    setShowResult(true);
    setTimeout(()=>{
      setAnimClass("");
      if(qIdx+1>=total){ setFinished(true); }
      else { setQIdx(i=>i+1); setSelected(null); setShowResult(false); }
    },1300);
  };

  const stars = score>=total*0.8?3:score>=total*0.5?2:1;

  if(finished){
    return (
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,textAlign:"center",background:"linear-gradient(135deg,"+island.bg+",white)",borderRadius:24,minHeight:380}}>
        <div style={{fontSize:76,marginBottom:8}}>{stars===3?"🏆":stars===2?"🥈":"🥉"}</div>
        <h2 style={{fontFamily:"'Fredoka One',cursive",fontSize:32,color:"#3a2a1a",margin:"0 0 8px"}}>
          {score===total?"Perfect!":score>=total*0.8?"Amazing!":"Good Try!"}
        </h2>
        <p style={{fontSize:18,color:"#555",margin:"0 0 16px"}}>You got <strong>{score}</strong> out of <strong>{total}</strong></p>
        <div style={{display:"flex",gap:8,marginBottom:28}}>
          {[1,2,3].map(s=><span key={s} style={{fontSize:40,opacity:s<=stars?1:0.22}}>⭐</span>)}
        </div>
        <div style={{display:"flex",gap:12}}>
          <button onClick={()=>{setQIdx(0);setScore(0);setSelected(null);setShowResult(false);setFinished(false);}} style={btnStyle("#4CAF50")}>🔄 Again</button>
          <button onClick={()=>onComplete(stars)} style={btnStyle(island.accent)}>🗺️ Map</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{background:"linear-gradient(135deg,"+island.bg+"88,white)",borderRadius:24,overflow:"hidden",border:"3px solid "+island.accent}}>
      <div style={{background:island.accent,padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <button onClick={onBack} style={{background:"rgba(255,255,255,0.3)",border:"none",borderRadius:10,padding:"7px 14px",color:"white",fontWeight:700,fontSize:14,cursor:"pointer"}}>← Back</button>
        <span style={{fontFamily:"'Fredoka One',cursive",fontSize:17,color:"white",fontWeight:900}}>{game.title}</span>
        <span style={{background:"rgba(255,255,255,0.3)",borderRadius:10,padding:"7px 12px",color:"white",fontWeight:700,fontSize:14}}>{qIdx+1}/{total}</span>
      </div>
      <div style={{height:6,background:"rgba(0,0,0,0.1)"}}>
        <div style={{height:"100%",width:((qIdx/total)*100)+"%",background:island.accent,transition:"width 0.4s"}}/>
      </div>
      <div style={{padding:"24px 20px",textAlign:"center"}}>
        <div key={animKey} className={animClass} style={{display:"flex",justifyContent:"center",marginBottom:20}}>
          {island.id==="colors"&&(
            <div style={{width:120,height:120,borderRadius:20,background:q.color,border:"4px solid rgba(0,0,0,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:54,boxShadow:"0 8px 24px "+q.color+"88"}}>{q.emoji}</div>
          )}
          {island.id==="animals"&&(
            <div style={{width:120,height:120,borderRadius:"50%",background:"white",border:"4px solid "+island.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:72,boxShadow:"0 8px 24px "+island.accent+"44"}}>{q.emoji}</div>
          )}
          {island.id==="shapes"&&(
            <svg viewBox="0 0 150 150" width="120" height="120" style={{color:island.accent}}>
              {SHAPES_SVG[q.shape]}
            </svg>
          )}
          {island.id==="numbers"&&(
            <div style={{background:"white",borderRadius:16,padding:"14px 20px",border:"3px solid "+island.accent,fontSize:32,lineHeight:1.6,maxWidth:260,textAlign:"center",wordBreak:"break-all",boxShadow:"0 4px 16px "+island.accent+"44"}}>{q.emoji}</div>
          )}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,maxWidth:400,margin:"0 auto"}}>
          {q.options.map(opt=>{
            const isSel=selected===opt, isRight=opt===q.answer;
            let bg="#fff", border="2.5px solid "+island.accent+"66", col="#333";
            if(showResult&&isSel&&isRight)      {bg="#4CAF50";col="white";border="2.5px solid #388E3C";}
            else if(showResult&&isSel&&!isRight){bg="#E53935";col="white";border="2.5px solid #C62828";}
            else if(showResult&&isRight)        {bg="#C8E6C9";border="2.5px solid #4CAF50";}
            return (
              <button key={opt} onClick={()=>handleAnswer(opt)} style={{
                padding:"17px 8px",borderRadius:14,background:bg,border,color:col,
                fontFamily:"'Fredoka One',cursive",fontSize:19,fontWeight:700,
                cursor:selected?"default":"pointer",
                transform:isSel&&showResult?"scale(1.06)":"scale(1)",
                transition:"all 0.18s",
                boxShadow:"0 3px 10px rgba(0,0,0,0.1)",
              }}>{opt}</button>
            );
          })}
        </div>
        {showResult&&selected===q.answer&&island.id==="animals"&&(
          <div style={{marginTop:14,fontSize:22,fontWeight:700,color:island.accent,fontFamily:"'Fredoka One',cursive",animation:"pop 0.3s ease"}}>🔊 {q.sound}</div>
        )}
      </div>
      <div style={{background:"rgba(0,0,0,0.06)",padding:"10px 20px",display:"flex",justifyContent:"center",gap:6}}>
        {Array.from({length:total}).map((_,i)=>(
          <div key={i} style={{width:10,height:10,borderRadius:"50%",
            background:i<qIdx?(i<score?"#4CAF50":"#E53935"):i===qIdx?island.accent:"rgba(0,0,0,0.15)",
            transition:"background 0.3s"}}/>
        ))}
      </div>
    </div>
  );
}

function Header({character,totalStars,onReset}) {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"linear-gradient(135deg,#FF8C42,#FF6B35)",borderRadius:"16px 16px 0 0",padding:"12px 18px"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:26}}>{character.emoji}</span>
        <span style={{fontFamily:"'Fredoka One',cursive",fontSize:17,color:"white",fontWeight:900}}>{character.name}</span>
      </div>
      <span style={{fontFamily:"'Fredoka One',cursive",fontSize:20,color:"white"}}>🌍 Learn World</span>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <span style={{background:"rgba(255,255,255,0.25)",borderRadius:12,padding:"5px 12px",color:"white",fontWeight:700,fontSize:15}}>⭐ {totalStars}</span>
        <button onClick={onReset} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:9,padding:"5px 10px",color:"white",cursor:"pointer",fontSize:13}}>↩</button>
      </div>
    </div>
  );
}

function App() {
  const [character,setCharacter]       = useState(null);
  const [screen,setScreen]             = useState("map");
  const [activeIsland,setActiveIsland] = useState(null);
  const [islands,setIslands]           = useState(ISLANDS);

  const totalStars = islands.reduce((s,i)=>s+(i.stars||0),0);
  const handleIslandClick = (island)=>{ setActiveIsland(island); setScreen("detail"); };
  const handlePlay = ()=> setScreen("game");
  const handleGameComplete = (stars)=>{
    setIslands(prev=>prev.map(i=>i.id===activeIsland.id?{...i,stars:Math.max(i.stars,stars)}:i));
    setActiveIsland(prev=>({...prev,stars:Math.max(prev.stars||0,stars)}));
    setScreen("map");
  };

  if(!character) return (
    <div style={{maxWidth:720,margin:"0 auto",padding:12}}>
      <CharacterSelect onSelect={setCharacter}/>
    </div>
  );

  return (
    <div style={{maxWidth:720,margin:"0 auto"}}>
      <Header character={character} totalStars={totalStars} onReset={()=>{setCharacter(null);setIslands(ISLANDS);setScreen("map");}}/>
      <div style={{background:"white",borderRadius:"0 0 16px 16px",padding:14,border:"3px solid #FF8C42",borderTop:"none",minHeight:500}}>
        {screen==="map"&&(
          <>
            <WorldMap islands={islands} onIslandClick={handleIslandClick}/>
            <div style={{marginTop:12,display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
              {islands.map((island,i)=>(
                <div key={island.id} onClick={()=>{if(i===0||islands[i-1].stars>0)handleIslandClick(island);}} style={{
                  display:"flex",alignItems:"center",gap:6,
                  background:island.bg,borderRadius:10,padding:"6px 12px",
                  border:"2px solid "+island.accent,
                  cursor:(i===0||islands[i-1].stars>0)?"pointer":"not-allowed",
                  opacity:(i===0||islands[i-1].stars>0)?1:0.5,
                  fontSize:14,fontWeight:700,color:"#3a2a1a",
                }}>
                  <span>{island.icon}</span><span>{island.name}</span>
                  {island.stars>0&&<span>{"⭐".repeat(island.stars)}</span>}
                </div>
              ))}
            </div>
          </>
        )}
        {screen==="detail"&&activeIsland&&<IslandDetail island={activeIsland} onPlay={handlePlay} onBack={()=>setScreen("map")}/>}
        {screen==="game"&&activeIsland&&<GameScreen island={activeIsland} game={GAMES[activeIsland.id]} onBack={()=>setScreen("detail")} onComplete={handleGameComplete}/>}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
  </script>
</body>
</html>
`;

// ── Web version: render via iframe srcdoc ──
function WebApp() {
  return (
    <iframe
      srcDoc={HTML_CONTENT}
      style={{
        width: '100%',
        height: '100vh',
        border: 'none',
        display: 'block',
      }}
      title="Learn World"
    />
  );
}

// ── Native version: render via WebView ──
function NativeApp() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#FF8C42" />
      <WebView
        source={{ html: HTML_CONTENT }}
        style={styles.webview}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// ── Entry point: auto-detects platform ──
export default function AppRoot() {
  if (Platform.OS === 'web') {
    return <WebApp />;
  }
  return <NativeApp />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF8C42',
  },
  webview: {
    flex: 1,
    backgroundColor: '#fff9f0',
  },
});