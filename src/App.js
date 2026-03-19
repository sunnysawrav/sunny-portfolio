import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import client from './sanityClient';
import panoramaImg from './panorama.jpg';

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const YT_API_KEY = process.env.REACT_APP_YT_API_KEY;
const CHANNEL_ID = "UCGTyRlvoOhCJBqwFvhlZerw";
const GS_LOGO    = "https://yt3.googleusercontent.com/uPWh2l6-vb0yIfwQQnLglTdyH8KgvvZ6hpLvrESemcnm6-l_-WgomL1EHwKRysCf-EYRcSrFHA=s160-c-k-c0x00ffffff-no-rj";

function decodeHTML(str) {
  const txt = document.createElement("textarea");
  txt.innerHTML = str; return txt.value;
}
async function fetchChannelData(channelId) {
  const res = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${YT_API_KEY}&channelId=${channelId}&part=snippet&order=date&maxResults=4&type=video`);
  const data = await res.json();
  return (data.items||[]).map(item=>({
    id:item.id.videoId, title:decodeHTML(item.snippet.title),
    thumbnail:item.snippet.thumbnails.high?.url||item.snippet.thumbnails.default?.url,
    url:`https://www.youtube.com/watch?v=${item.id.videoId}`,
    published:new Date(item.snippet.publishedAt).toLocaleDateString("en-IN",{year:"numeric",month:"short",day:"numeric"})
  }));
}
const isMobile = ()=>/Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent)||window.innerWidth<768;
const T = id=>`https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

// ── FALLBACK ──────────────────────────────────────────────────────────────────
const FALLBACK = {
  hero:{name:"Sunny Sawrav",tagline:"Film Maker • Creative Director • Post Production Supervisor • AI Strategist",description:"Ready to bring creative visions to life through innovative filmmaking and AI-enhanced solutions.",years:"15+",projects:"100+",bio:"With over 15 years of experience in the entertainment industry, I specialize in bringing creative visions to life.",personal:"There are many things that I'd wish I could change but why bother? Life has led you and I to something really beautiful, hasn't it? Live / Play."},
  featured:[],experience:[],skills:[],achievements:[],gallery:[],
};
const showreel=[
  {id:1,title:"A lullaby for the missing",vid:"AsvbWOmvBbg",url:"https://www.youtube.com/watch?v=AsvbWOmvBbg",views:"1M"},
  {id:2,title:"Follow Traffic Rules - Bajaj Avenger",vid:"rbUjgmJ0lFM",url:"https://www.youtube.com/watch?v=rbUjgmJ0lFM",views:"533"},
  {id:3,title:"South Indian By Nature",vid:"oTX_5xOiW6A",url:"https://www.youtube.com/watch?v=oTX_5xOiW6A",views:"29"},
  {id:4,title:"3Devi - Final Trailer",vid:"DeNuCn4ATy8",url:"https://www.youtube.com/watch?v=DeNuCn4ATy8",views:"872K"},
  {id:5,title:"Vijay Karnataka - Protest",vid:"jrOmAW1aDPY",url:"https://www.youtube.com/watch?v=jrOmAW1aDPY",views:"2.1K"},
  {id:6,title:"Heretic - Thoughts",vid:"RZREe_vEH1g",url:"https://www.youtube.com/watch?v=RZREe_vEH1g",views:"91K"},
  {id:7,title:"Vijay Karnataka - Cricket",vid:"t2gc5ZWc_gA",url:"https://www.youtube.com/watch?v=t2gc5ZWc_gA",views:"879"},
  {id:8,title:"A Love Song for Goddesses",vid:"KIqpvVtIWNA",url:"https://www.youtube.com/watch?v=KIqpvVtIWNA",views:"1M"},
  {id:9,title:"Vijay Karnataka - Water",vid:"DHAPY_DNVEY",url:"https://www.youtube.com/watch?v=DHAPY_DNVEY",views:"628"},
  {id:10,title:"Cloudnine Hospitals",vid:"vnD4GBGzpiA",url:"https://www.youtube.com/watch?v=vnD4GBGzpiA",views:"17K"},
  {id:11,title:"Random - A short",vid:"9gkbJ4QmAyU",url:"https://www.youtube.com/watch?v=9gkbJ4QmAyU",views:"192"},
  {id:12,title:"Asirvad Microfinance - 42Gears",vid:"ztsbIMYjhx0",url:"https://www.youtube.com/watch?v=ztsbIMYjhx0",views:"5.1K"},
];
const contact={email:"sunnysawrav@gmail.com",phone:"+91-7892378521",linkedin:"https://www.linkedin.com/in/sunnysawrav/",instagram:"https://www.instagram.com/sunnysawrav/",facebook:"http://www.facebook.com/sunnysawrav",twitter:"http://www.twitter.com/helldoom"};

const FEATURED_FALLBACK = [
  {_id:"f1", title:"A lullaby for the missing", vid:"AsvbWOmvBbg", embed:"https://www.youtube.com/embed/AsvbWOmvBbg", type:"Short Film", year:"2022", desc:"An evocative short film exploring loss, memory, and the spaces between.", award:"Best Short Film – Festival Selection"},
  {_id:"f2", title:"3Devi - Final Trailer", vid:"DeNuCn4ATy8", embed:"https://www.youtube.com/embed/DeNuCn4ATy8", type:"Feature Film", year:"2021", desc:"Official trailer for the critically acclaimed feature film 3Devi.", award:""},
  {_id:"f3", title:"A Love Song for Goddesses", vid:"KIqpvVtIWNA", embed:"https://www.youtube.com/embed/KIqpvVtIWNA", type:"Music Video", year:"2020", desc:"A cinematic music video blending mythology, dance, and stunning visuals.", award:""},
  {_id:"f4", title:"Heretic - Thoughts", vid:"RZREe_vEH1g", embed:"https://www.youtube.com/embed/RZREe_vEH1g", type:"Documentary", year:"2023", desc:"A thought-provoking documentary capturing candid perspectives on belief and doubt.", award:""},
];

// ── ICONS ─────────────────────────────────────────────────────────────────────
const Ico=({d,size=20})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>;
const FilmIco=()=><Ico size={16} d="M2 2h20v20H2zM7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 7h5M17 17h5"/>;
const AwardIco=({s=20})=><Ico size={s} d="M12 15l-2 5 2-1 2 1-2-5zM12 2a7 7 0 1 0 0 14A7 7 0 0 0 12 2z"/>;
const BriefIco=()=><Ico size={18} d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>;
const MailIco=()=><Ico size={22} d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6"/>;
const PhoneIco=()=><Ico size={22} d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>;
const LiIco=()=><Ico size={22} d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>;
const IgIco=()=><Ico size={22} d="M4 4m0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01"/>;
const FbIco=()=><Ico size={22} d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>;
const TwIco=()=><Ico size={22} d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>;
const ExtIco=()=><Ico size={26} d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>;
const ChkIco=()=><Ico size={16} d="M20 6L9 17l-5-5"/>;
const PlayIco=()=><svg width="56" height="56" viewBox="0 0 24 24" fill="#d4a574" style={{filter:"drop-shadow(0 4px 8px rgba(0,0,0,.5))"}}><polygon points="5,3 19,12 5,21"/></svg>;
const SmPlayIco=()=><svg width="36" height="36" viewBox="0 0 24 24" fill="#d4a574" style={{filter:"drop-shadow(0 2px 4px rgba(0,0,0,.5))"}}><polygon points="5,3 19,12 5,21"/></svg>;

// ── NODES ─────────────────────────────────────────────────────────────────────
const NODES=[
  {id:"about",       label:"About",        color:0xcc99ff, shape:"sphere",     pos:[0,0,0],      scale:1.6},
  {id:"featured",    label:"Featured",     color:0x99ffff, shape:"box",        pos:[8,2,-4],     scale:1.4},
  {id:"showreel",    label:"Showreel",     color:0xff99ff, shape:"box",        pos:[9,0,2],      scale:1.1},
  {id:"experience",  label:"Experience",   color:0xb87d4b, shape:"cone",       pos:[6,-3,6],     scale:1.1},
  {id:"skills",      label:"Skills",       color:0xff9999, shape:"cylinder",   pos:[-6,-2,6],    scale:1.0},
  {id:"achievements",label:"Achievements", color:0xffd700, shape:"cone",       pos:[0,5,8],      scale:1.2},
  {id:"gallery",     label:"Gallery",      color:0xa0785a, shape:"torus",      pos:[-9,3,2],     scale:0.9},
  {id:"random",      label:"GameSlime",    color:0xb3ff99, shape:"octahedron", pos:[-8,1,-4],    scale:1.0},
  {id:"contact",     label:"Contact",      color:0xd4a574, shape:"sphere",     pos:[0,-5,4],     scale:0.9},
];

// ── CSS ───────────────────────────────────────────────────────────────────────
const css=`
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Montserrat:wght@400;500;600;700&family=Lato:wght@300;400;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{--bg:#0a0a0a;--bg2:#1a1a1a;--gold:#d4a574;--gold-dk:#b8860b;--txt:#f5f5f5;--txt2:#d1d1d1;--muted:#999;--bdr:rgba(212,165,116,.2);}
body,html{background:var(--bg);color:var(--txt);font-family:'Lato',sans-serif;overflow-x:hidden;}
.w{background:var(--bg);overflow-x:hidden;}
nav{position:fixed;top:0;left:0;right:0;z-index:200;background:rgba(10,10,10,.85);backdrop-filter:blur(12px);border-bottom:1px solid var(--bdr);padding:.75rem 2rem;display:flex;justify-content:space-between;align-items:center;}
.logo{font-family:'Playfair Display',serif;font-size:1.3rem;color:var(--gold);letter-spacing:2px;}
.classic-links{display:flex;gap:1.2rem;flex-wrap:wrap;}
.classic-links button{background:none;border:none;color:var(--txt2);font-size:.75rem;font-family:'Montserrat',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:1px;cursor:pointer;transition:color .2s;}
.classic-links button:hover{color:var(--gold);}
.view-toggle{display:flex;align-items:center;gap:.6rem;font-family:'Montserrat',sans-serif;font-size:.75rem;font-weight:600;color:var(--txt2);}
.toggle-label{text-transform:uppercase;letter-spacing:1px;}
.toggle-label.active{color:var(--gold);}
.toggle-switch{position:relative;width:52px;height:26px;cursor:pointer;}
.toggle-switch input{opacity:0;width:0;height:0;}
.toggle-track{position:absolute;inset:0;background:rgba(212,165,116,.2);border:1px solid var(--bdr);border-radius:50px;transition:background .3s;}
.toggle-track.on{background:rgba(212,165,116,.3);}
.toggle-thumb{position:absolute;top:3px;left:3px;width:18px;height:18px;background:var(--gold);border-radius:50%;transition:transform .3s;box-shadow:0 2px 6px rgba(0,0,0,.4);}
.toggle-thumb.on{transform:translateX(26px);}
.canvas-wrap{position:fixed;inset:0;top:56px;z-index:1;}
canvas{display:block;width:100%!important;height:100%!important;}
.hint{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:rgba(10,10,10,.7);border:1px solid var(--bdr);border-radius:50px;padding:.5rem 1.5rem;font-size:.8rem;color:var(--muted);font-family:'Montserrat',sans-serif;letter-spacing:1px;z-index:10;pointer-events:none;transition:opacity .5s;}
.glass-overlay{position:fixed;inset:0;z-index:300;display:flex;align-items:center;justify-content:center;padding:1rem;background:rgba(0,0,0,.5);backdrop-filter:blur(4px);animation:fadeIn .25s ease;}
.glass-panel{background:rgba(20,15,10,.75);border:1px solid rgba(212,165,116,.3);border-radius:20px;backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);box-shadow:0 8px 60px rgba(0,0,0,.6),inset 0 1px 0 rgba(212,165,116,.15);max-width:800px;width:100%;max-height:85vh;overflow-y:auto;animation:slideUp .3s ease;position:relative;}
.glass-panel::-webkit-scrollbar{width:4px;}
.glass-panel::-webkit-scrollbar-thumb{background:var(--bdr);border-radius:4px;}
.glass-header{display:flex;align-items:center;justify-content:space-between;padding:1.5rem 2rem 1rem;border-bottom:1px solid var(--bdr);}
.glass-title{font-family:'Playfair Display',serif;font-size:1.8rem;color:var(--gold);}
.glass-close{background:rgba(212,165,116,.1);border:1px solid var(--bdr);color:var(--gold);width:2rem;height:2rem;border-radius:50%;cursor:pointer;font-size:1.2rem;display:flex;align-items:center;justify-content:center;transition:background .2s;}
.glass-close:hover{background:rgba(212,165,116,.25);}
.glass-body{padding:1.5rem 2rem 2rem;}
.hero{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#0a0a0a,#1a1a1a 50%,#2a1a1a);padding:7rem 2rem 4rem;text-align:center;}
.hero-in{max-width:900px;animation:fadeUp .9s ease-out;}
.badge{display:inline-flex;align-items:center;gap:.5rem;padding:.5rem 1.5rem;background:rgba(212,165,116,.1);border:1px solid var(--bdr);border-radius:50px;margin-bottom:2rem;font-size:.85rem;color:var(--gold);font-weight:500;}
.hname{font-family:'Playfair Display',serif;font-size:clamp(3rem,8vw,6rem);font-weight:700;margin-bottom:1rem;background:linear-gradient(135deg,var(--txt),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1.2;}
.htag{font-family:'Montserrat',sans-serif;font-size:clamp(.95rem,2vw,1.4rem);color:var(--gold);margin-bottom:1.5rem;font-weight:500;letter-spacing:.5px;}
.hdesc{font-size:1.1rem;color:var(--txt2);max-width:700px;margin:0 auto 2rem;line-height:1.8;}
.stats{display:flex;align-items:center;justify-content:center;gap:3rem;margin:3rem 0;}
.sn{font-family:'Playfair Display',serif;font-size:3rem;font-weight:700;color:var(--gold);line-height:1;}
.sl{font-size:.85rem;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-top:.5rem;}
.sdiv{width:1px;height:60px;background:var(--bdr);}
.ctas{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;}
.bp{background:linear-gradient(135deg,var(--gold-dk),var(--gold));color:#0a0a0a;padding:.9rem 2.5rem;font-size:1rem;font-weight:700;border:none;border-radius:6px;cursor:pointer;transition:transform .3s,box-shadow .3s;font-family:'Montserrat',sans-serif;}
.bp:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(212,165,116,.35);}
.bs{border:2px solid var(--gold);color:var(--gold);background:transparent;padding:.9rem 2.5rem;font-size:1rem;font-weight:700;border-radius:6px;cursor:pointer;transition:background .3s,transform .3s;font-family:'Montserrat',sans-serif;}
.bs:hover{background:rgba(212,165,116,.1);transform:translateY(-2px);}
.sec{padding:6rem 2rem;}.alt{background:var(--bg2);}
.inn{max-width:1400px;margin:0 auto;}
.shd{text-align:center;margin-bottom:4rem;}
.stitle{font-family:'Playfair Display',serif;font-size:clamp(2.2rem,5vw,3.8rem);font-weight:700;color:var(--txt);margin-bottom:1rem;}
.ul{width:100px;height:3px;background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:0 auto;}
.about-wrap{max-width:1000px;margin:0 auto;text-align:center;}
.abio{font-size:1.1rem;line-height:2;color:var(--txt2);margin-bottom:2rem;}
.apersonal{font-size:1.15rem;line-height:1.9;color:var(--txt2);font-style:italic;padding:1.5rem 2rem;border-left:3px solid var(--gold);background:rgba(212,165,116,.05);border-radius:0 8px 8px 0;text-align:left;max-width:700px;margin:0 auto;}
.gal-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem;}
.gal-item{overflow:hidden;border-radius:8px;aspect-ratio:4/3;cursor:pointer;background:#111;}
.gal-item img{width:100%;height:100%;object-fit:cover;transition:transform .5s;}
.gal-item:hover img{transform:scale(1.07);}
.fg{display:grid;grid-template-columns:repeat(auto-fit,minmax(440px,1fr));gap:2rem;}
.pc{background:var(--bg2);border:1px solid var(--bdr);border-radius:12px;overflow:hidden;transition:transform .3s,box-shadow .3s;}
.pc:hover{transform:translateY(-5px);box-shadow:0 20px 40px rgba(212,165,116,.15);}
.vw{position:relative;width:100%;padding-bottom:56.25%;background:#000;}
.vw iframe{position:absolute;top:0;left:0;width:100%;height:100%;}
.tw{position:absolute;top:0;left:0;width:100%;height:100%;cursor:pointer;overflow:hidden;background:#111;}
.tw img{width:100%;height:100%;object-fit:cover;transition:transform .5s;}
.tw:hover img{transform:scale(1.05);}
.pov{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(10,10,10,.55);transition:background .3s;}
.tw:hover .pov{background:rgba(10,10,10,.3);}
.pi{padding:1.5rem;}
.pm{display:flex;justify-content:space-between;margin-bottom:.75rem;}
.pt{font-size:.85rem;color:var(--gold);font-weight:600;text-transform:uppercase;letter-spacing:1px;}
.py{font-size:.85rem;color:var(--muted);}
.pttl{font-family:'Montserrat',sans-serif;font-size:1.4rem;font-weight:700;color:var(--txt);margin-bottom:.6rem;}
.pd{font-size:.95rem;color:var(--txt2);line-height:1.6;margin-bottom:.75rem;}
.pr{display:flex;align-items:center;gap:.5rem;padding:.6rem .75rem;background:rgba(212,165,116,.1);border-left:3px solid var(--gold);border-radius:4px;font-size:.85rem;color:var(--gold);}
.sg{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:1.5rem;}
.si{position:relative;border-radius:8px;overflow:hidden;cursor:pointer;transition:transform .3s;background:var(--bg2);}
.si:hover{transform:scale(1.03);}
.siw{width:100%;aspect-ratio:16/9;overflow:hidden;position:relative;background:#111;}
.siw img{width:100%;height:100%;object-fit:cover;display:block;}
.sov{position:absolute;inset:0;background:rgba(10,10,10,.7);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .3s;color:var(--gold);}
.si:hover .sov{opacity:1;}
.sinf{padding:.6rem .75rem .75rem;}
.sttl{font-size:.85rem;font-weight:600;color:var(--txt);margin-bottom:.2rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.svw{font-size:.75rem;color:var(--muted);}
.gs-intro{text-align:center;margin-bottom:2.5rem;}
.gs-label{font-family:'Montserrat',sans-serif;font-size:1.1rem;font-weight:700;color:var(--gold);letter-spacing:1px;}
.gs-desc{color:var(--txt2);font-size:1rem;line-height:1.7;max-width:600px;margin:.75rem auto 0;}
.gs-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.5rem;}
.gs-card{background:var(--bg2);border:1px solid var(--bdr);border-radius:10px;overflow:hidden;cursor:pointer;transition:transform .3s,box-shadow .3s;}
.gs-card:hover{transform:translateY(-4px);box-shadow:0 12px 30px rgba(212,165,116,.12);}
.gs-thumb{width:100%;aspect-ratio:16/9;position:relative;background:#111;overflow:hidden;}
.gs-thumb img{width:100%;height:100%;object-fit:cover;transition:transform .5s;}
.gs-card:hover .gs-thumb img{transform:scale(1.05);}
.gs-ov{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(10,10,10,.55);}
.gs-info{padding:.85rem 1rem;}
.gs-ttl{font-size:.9rem;font-weight:600;color:var(--txt);margin-bottom:.3rem;}
.gs-dur{font-size:.75rem;color:var(--muted);}
.tl{position:relative;max-width:900px;margin:0 auto;}
.tl::before{content:'';position:absolute;left:50%;top:0;bottom:0;width:2px;background:var(--bdr);transform:translateX(-50%);}
.tli{position:relative;margin-bottom:3rem;}
.tli:nth-child(odd) .tlc{margin-left:calc(50% + 2rem);}
.tli:nth-child(even) .tlc{margin-right:calc(50% + 2rem);}
.tlm{position:absolute;left:50%;top:1.5rem;transform:translateX(-50%);width:3rem;height:3rem;background:var(--bg2);border:3px solid var(--gold);border-radius:50%;display:flex;align-items:center;justify-content:center;z-index:1;color:var(--gold);}
.tlc{background:var(--bg2);border:1px solid var(--bdr);border-radius:12px;transition:transform .3s,box-shadow .3s;}
.tlc:hover{transform:translateY(-5px);box-shadow:0 10px 30px rgba(212,165,116,.15);}
.tlin{padding:1.5rem;}
.tlp{font-size:.85rem;color:var(--gold);font-weight:600;text-transform:uppercase;letter-spacing:1px;}
.tlr{font-family:'Montserrat',sans-serif;font-size:1.4rem;font-weight:700;color:var(--txt);margin:.4rem 0;}
.tlco{font-size:1.1rem;color:var(--txt2);margin-bottom:.75rem;}
.tld{color:var(--txt2);line-height:1.6;margin-bottom:.75rem;}
.tla{display:flex;align-items:center;gap:.5rem;padding:.6rem .75rem;background:rgba(212,165,116,.1);border-left:3px solid var(--gold);border-radius:4px;font-size:.85rem;color:var(--gold);}
.skg{display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:2rem;}
.skc{background:var(--bg);border:1px solid var(--bdr);border-radius:12px;padding:2rem;transition:transform .3s,box-shadow .3s;}
.skc:hover{transform:translateY(-5px);box-shadow:0 10px 30px rgba(212,165,116,.15);}
.skh{font-family:'Montserrat',sans-serif;font-size:1.2rem;font-weight:700;color:var(--gold);margin-bottom:1.25rem;}
.skt{display:flex;flex-wrap:wrap;gap:.6rem;}
.sktg{padding:.4rem .9rem;background:rgba(212,165,116,.1);border:1px solid var(--bdr);border-radius:20px;font-size:.85rem;color:var(--txt2);transition:background .3s,color .3s,border-color .3s;cursor:default;}
.sktg:hover{background:rgba(212,165,116,.2);color:var(--gold);border-color:var(--gold);}
.ag{display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:2rem;}
.ac{background:var(--bg2);border:1px solid var(--bdr);border-radius:12px;padding:2rem;text-align:center;transition:transform .3s,box-shadow .3s;}
.ac:hover{transform:translateY(-5px);box-shadow:0 10px 30px rgba(212,165,116,.15);}
.at{font-family:'Montserrat',sans-serif;font-size:1.2rem;font-weight:700;color:var(--txt);margin:.75rem 0 .5rem;}
.ad{color:var(--txt2);line-height:1.6;margin-bottom:.75rem;font-size:.95rem;}
.ay{font-size:.85rem;color:var(--gold);font-weight:600;}
.cw{max-width:800px;margin:0 auto;text-align:center;}
.ct{font-size:1.2rem;color:var(--txt2);line-height:1.8;margin-bottom:3rem;}
.cl{display:flex;flex-direction:column;gap:1.5rem;align-items:center;}
.ci{display:flex;align-items:center;gap:1rem;font-size:1.1rem;color:var(--txt2);transition:transform .3s;}
.ci:hover{transform:translateX(5px);}
.ci a{color:var(--gold);text-decoration:none;font-weight:500;transition:color .3s;}
.ci a:hover{color:var(--gold-dk);}
footer{background:var(--bg);border-top:1px solid var(--bdr);padding:3rem 2rem;text-align:center;}
.ft{color:var(--muted);font-size:.875rem;margin-bottom:.4rem;}
.ftag{color:var(--gold);font-style:italic;}
.gp-bio{font-size:1rem;line-height:1.9;color:var(--txt2);margin-bottom:1.5rem;}
.gp-quote{font-style:italic;padding:1rem 1.5rem;border-left:3px solid var(--gold);background:rgba(212,165,116,.05);border-radius:0 8px 8px 0;color:var(--txt2);margin-bottom:1rem;}
.gp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1rem;margin-top:1rem;}
.gp-card{background:rgba(212,165,116,.05);border:1px solid var(--bdr);border-radius:10px;padding:1rem;}
.gp-card-title{font-family:'Montserrat',sans-serif;font-weight:700;color:var(--txt);margin-bottom:.4rem;font-size:.95rem;}
.gp-card-sub{font-size:.85rem;color:var(--gold);margin-bottom:.3rem;}
.gp-card-desc{font-size:.82rem;color:var(--txt2);line-height:1.5;}
.gp-tags{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.75rem;}
.gp-tag{padding:.3rem .75rem;background:rgba(212,165,116,.1);border:1px solid var(--bdr);border-radius:20px;font-size:.8rem;color:var(--txt2);}
.gp-skill-cat{margin-bottom:1.25rem;}
.gp-skill-cat h4{font-family:'Montserrat',sans-serif;color:var(--gold);font-size:.95rem;margin-bottom:.6rem;}
.gp-ach{display:flex;align-items:flex-start;gap:1rem;padding:.75rem;background:rgba(212,165,116,.05);border-radius:8px;margin-bottom:.75rem;}
.gp-ach-info h4{font-family:'Montserrat',sans-serif;font-size:.95rem;color:var(--txt);margin-bottom:.2rem;}
.gp-ach-info p{font-size:.85rem;color:var(--txt2);}
.gp-ach-year{font-size:.8rem;color:var(--gold);font-weight:600;margin-top:.2rem;}
.gp-gal{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:.75rem;}
.gp-gal-item{aspect-ratio:4/3;border-radius:8px;overflow:hidden;cursor:pointer;background:#111;}
.gp-gal-item img{width:100%;height:100%;object-fit:cover;transition:transform .4s;}
.gp-gal-item:hover img{transform:scale(1.08);}
.gp-contact{display:flex;flex-direction:column;gap:1rem;}
.gp-ci{display:flex;align-items:center;gap:1rem;color:var(--txt2);font-size:1rem;}
.gp-ci a{color:var(--gold);text-decoration:none;font-weight:500;}
.gp-vid-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem;margin-top:1rem;}
.gp-vid{cursor:pointer;border-radius:8px;overflow:hidden;background:var(--bg2);border:1px solid var(--bdr);transition:transform .3s;}
.gp-vid:hover{transform:translateY(-3px);}
.gp-vid img{width:100%;aspect-ratio:16/9;object-fit:cover;display:block;}
.gp-vid-info{padding:.5rem .75rem;}
.gp-vid-title{font-size:.8rem;font-weight:600;color:var(--txt);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.gp-vid-date{font-size:.72rem;color:var(--muted);}
@keyframes fadeUp{from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes slideUp{from{opacity:0;transform:translateY(40px);}to{opacity:1;transform:translateY(0);}}
@media(max-width:1024px){.tl::before{left:1.5rem;}.tli:nth-child(odd) .tlc,.tli:nth-child(even) .tlc{margin-left:4rem;margin-right:0;}.tlm{left:1.5rem;}}
@media(max-width:768px){.sec{padding:4rem 1.5rem;}.fg{grid-template-columns:1fr;}.skg,.ag,.gs-grid{grid-template-columns:1fr;}.ctas{flex-direction:column;width:100%;}.bp,.bs{width:100%;}.stats{gap:2rem;}.sn{font-size:2.5rem;}.classic-links{gap:.75rem;}.classic-links button{font-size:.68rem;}.toggle-label{display:none;}}
@media(max-width:480px){.classic-links{display:none;}}

/* ── LOADING SCREEN ── */
.loader-wrap{position:fixed;inset:0;z-index:1000;background:#0a0a0a;display:flex;flex-direction:column;align-items:stretch;justify-content:space-between;overflow:hidden;}
.loader-wrap.loader-enter{animation:loaderFadeIn .4s ease forwards;}
.loader-wrap.loader-exit{animation:loaderFadeOut .7s ease forwards;pointer-events:none;}
@keyframes loaderFadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes loaderFadeOut{from{opacity:1;}to{opacity:0;}}
.loader-strip{display:flex;align-items:center;padding:.6rem 0;background:#111;border-top:1px solid rgba(212,165,116,.15);border-bottom:1px solid rgba(212,165,116,.15);overflow:hidden;gap:1.2rem;animation:stripScroll 4s linear infinite;}
.loader-strip.bottom{animation-direction:reverse;}
@keyframes stripScroll{from{transform:translateX(0);}to{transform:translateX(-50%);}}
.sprocket{flex-shrink:0;width:22px;height:14px;border-radius:3px;border:1.5px solid rgba(212,165,116,.35);background:rgba(212,165,116,.07);}
.loader-centre{flex:1;display:flex;align-items:center;justify-content:center;padding:2rem;}
.loader-frame{text-align:center;animation:loaderContentIn .6s .15s ease both;}
@keyframes loaderContentIn{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
.loader-initials{display:inline-block;font-family:'Playfair Display',serif;font-size:5rem;font-weight:700;color:transparent;-webkit-text-stroke:1.5px rgba(212,165,116,.7);letter-spacing:.15em;line-height:1;margin-bottom:1.2rem;}
.loader-name{font-family:'Montserrat',sans-serif;font-size:clamp(.9rem,3vw,1.3rem);font-weight:700;letter-spacing:.45em;color:var(--gold);text-transform:uppercase;margin-bottom:.6rem;}
.loader-role{font-family:'Lato',sans-serif;font-size:clamp(.75rem,2vw,.95rem);color:var(--muted);letter-spacing:.15em;margin-bottom:2rem;}
.loader-bar-wrap{width:220px;height:2px;background:rgba(212,165,116,.15);border-radius:2px;margin:0 auto 1rem;overflow:hidden;}
.loader-bar{height:100%;background:linear-gradient(90deg,transparent,var(--gold),transparent);border-radius:2px;animation:loaderBarSweep 1.6s ease-in-out infinite;}
@keyframes loaderBarSweep{0%{transform:translateX(-100%);}100%{transform:translateX(220px);}}
.loader-sub{font-family:'Montserrat',sans-serif;font-size:.7rem;color:rgba(153,153,153,.6);letter-spacing:.2em;text-transform:uppercase;}

/* ── MOBILE NAV DRAWER ── */
.mob-burger{display:none;flex-direction:column;justify-content:center;gap:5px;background:none;border:none;cursor:pointer;padding:.25rem;z-index:210;}
.mob-burger span{display:block;width:22px;height:2px;background:var(--gold);border-radius:2px;transition:transform .3s,opacity .3s;}
.mob-burger.open span:nth-child(1){transform:translateY(7px) rotate(45deg);}
.mob-burger.open span:nth-child(2){opacity:0;}
.mob-burger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}
.mob-drawer-backdrop{display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:500;background:rgba(0,0,0,.85);}
.mob-drawer-backdrop.open{display:block;}
.mob-drawer{position:fixed;top:0;right:0;height:100vh;z-index:501;width:78vw;max-width:300px;background:rgba(13,11,9,0.82);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-left:1px solid rgba(212,165,116,.35);box-shadow:-12px 0 50px rgba(0,0,0,.9);padding:5rem 2rem 2rem;display:flex;flex-direction:column;gap:.25rem;transform:translateX(100%);transition:transform .35s cubic-bezier(.4,0,.2,1);}
.mob-drawer.open{transform:translateX(0);}
.mob-drawer-link{background:none;border:none;color:var(--txt2);font-family:'Montserrat',sans-serif;font-size:.95rem;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;text-align:left;padding:.85rem .5rem;border-bottom:1px solid rgba(212,165,116,.08);cursor:pointer;transition:color .2s,padding-left .2s;width:100%;}
.mob-drawer-link:hover{color:var(--gold);padding-left:1rem;}
.mob-drawer-link:last-child{border-bottom:none;}
@media(max-width:480px){.mob-burger{display:flex;}}
`;

// ── LOADING SCREEN ────────────────────────────────────────────────────────────
function LoadingScreen({ phase }) {
  return (
    <div className={`loader-wrap loader-${phase}`}>
      <div className="loader-strip top">
        {[...Array(36)].map((_,i)=><span key={i} className="sprocket"/>)}
      </div>
      <div className="loader-centre">
        <div className="loader-frame">
          <div className="loader-initials">SS</div>
          <div className="loader-name">Sunny Sawrav</div>
          <div className="loader-role">Film Maker · Creative Director · AI Strategist</div>
          <div className="loader-bar-wrap"><div className="loader-bar"/></div>
          <div className="loader-sub">Loading experience…</div>
        </div>
      </div>
      <div className="loader-strip bottom">
        {[...Array(36)].map((_,i)=><span key={i} className="sprocket"/>)}
      </div>
    </div>
  );
}

// ── MOBILE NAV DRAWER ─────────────────────────────────────────────────────────
function MobileNav({ go }) {
  const [open, setOpen] = useState(false);
  const sections = ["about","featured","showreel","experience","skills","achievements","gallery","random","contact"];
  const labels = {about:"About",featured:"Featured Projects",showreel:"Showreel",experience:"Experience",skills:"Skills",achievements:"Achievements",gallery:"Gallery",random:"GameSlime",contact:"Contact"};

  useEffect(()=>{
    document.body.style.overflow = open ? 'hidden' : '';
    return ()=>{ document.body.style.overflow=''; };
  },[open]);

  const handleNav = id => { go(id); setOpen(false); };

  return (
    <>
      <button className={`mob-burger ${open?'open':''}`} onClick={()=>setOpen(v=>!v)} aria-label="Menu">
        <span/><span/><span/>
      </button>
      <div className={`mob-drawer-backdrop ${open?'open':''}`} onClick={()=>setOpen(false)}/>
      <div className={`mob-drawer ${open?'open':''}`}>
        <button onClick={()=>setOpen(false)} style={{position:'absolute',top:'1rem',right:'1rem',background:'rgba(212,165,116,.1)',border:'1px solid rgba(212,165,116,.3)',color:'#d4a574',width:'2rem',height:'2rem',borderRadius:'50%',cursor:'pointer',fontSize:'1.2rem',display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>
        {sections.map(s=>(
          <button key={s} className="mob-drawer-link" onClick={()=>handleNav(s)}>{labels[s]}</button>
        ))}
      </div>
    </>
  );
}

// ── SCENE ─────────────────────────────────────────────────────────────────────
function Scene({ onNodeClick }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    const W = el.clientWidth, H = el.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(W, H);
    renderer.setClearAlpha(0);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 500);

    // ── Intro animation state
    let introProgress = 0; // 0→1 over ~2.5s
    const INTRO_DURATION = 2.5;
    const INTRO_START_RADIUS = 60;
    const IDLE_RADIUS = 22;

    // ── Orbit state
    let rotX = 0.2, rotY = 0;
    let camRadius = IDLE_RADIUS;
    let autoRotateY = 0;
    let userInteracted = false;

    // ── Fog
    scene.fog = new THREE.FogExp2(0x060408, 0.018);

    // ── Lights
    scene.add(new THREE.AmbientLight(0xffeedd, 0.5));
    const sun = new THREE.DirectionalLight(0xd4a574, 1.5);
    sun.position.set(10, 15, 10);
    scene.add(sun);
    const fill = new THREE.PointLight(0x7b4f2e, 1.0, 80);
    fill.position.set(-10, -5, -10);
    scene.add(fill);
    const rim = new THREE.PointLight(0xffd700, 0.6, 60);
    rim.position.set(0, 20, -15);
    scene.add(rim);

    // ── Panoramic skybox
    const texLoader = new THREE.TextureLoader();
    texLoader.load(panoramaImg, tex => {
      tex.mapping = THREE.EquirectangularReflectionMapping;
      tex.mapping = THREE.EquirectangularReflectionMapping;
      const skyMesh = new THREE.Mesh(
        new THREE.SphereGeometry(250, 64, 40),
        new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide, depthWrite: false })
      );
      scene.add(skyMesh);
    });

    // ── Stars — 3 layers
    function makeStars(count, spread, size, opacity) {
      const geo = new THREE.BufferGeometry();
      const verts = [];
      for (let i = 0; i < count; i++) {
        verts.push((Math.random()-0.5)*spread,(Math.random()-0.5)*spread,(Math.random()-0.5)*spread);
      }
      geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
      return new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size, transparent: true, opacity }));
    }
    scene.add(makeStars(3000, 300, 0.25, 0.7));
    scene.add(makeStars(1500, 150, 0.15, 0.5));
    scene.add(makeStars(800,  80,  0.08, 0.3));

    // ── Gold dust particles
    const dustGeo = new THREE.BufferGeometry();
    const dustVerts = [], dustCount = 600;
    for (let i = 0; i < dustCount; i++) {
      dustVerts.push((Math.random()-0.5)*60,(Math.random()-0.5)*40,(Math.random()-0.5)*60);
    }
    dustGeo.setAttribute('position', new THREE.Float32BufferAttribute(dustVerts, 3));
    const dustMat = new THREE.PointsMaterial({ color: 0xd4a574, size: 0.06, transparent: true, opacity: 0.4 });
    scene.add(new THREE.Points(dustGeo, dustMat));

    // ── Node meshes
    const meshes = [];
    const glowSprites = [];
    const labelDivs = [];

    // Glow sprite texture
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = glowCanvas.height = 128;
    const gc = glowCanvas.getContext('2d');
    const gg = gc.createRadialGradient(64,64,0,64,64,64);
    gg.addColorStop(0,'rgba(212,165,116,0.9)');
    gg.addColorStop(0.3,'rgba(212,165,116,0.3)');
    gg.addColorStop(1,'rgba(212,165,116,0)');
    gc.fillStyle=gg; gc.fillRect(0,0,128,128);
    const glowTex = new THREE.CanvasTexture(glowCanvas);

    NODES.forEach(node => {
      let geo;
      const s = node.scale;
      switch(node.shape) {
        case "box":        geo = new THREE.BoxGeometry(1.8*s,1.8*s,1.8*s); break;
        case "cylinder":   geo = new THREE.CylinderGeometry(s,s,2*s,24); break;
        case "cone":       geo = new THREE.ConeGeometry(1.2*s,2.2*s,24); break;
        case "torus":      geo = new THREE.TorusGeometry(1.1*s,0.38*s,20,40); break;
        case "octahedron": geo = new THREE.OctahedronGeometry(1.4*s); break;
        default:           geo = new THREE.SphereGeometry(1.2*s,32,32);
      }
      const mat = new THREE.MeshStandardMaterial({
        color: node.color, metalness: 0.7, roughness: 0.25,
        emissive: node.color, emissiveIntensity: 0.2,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...node.pos);
      mesh.userData = { id: node.id, label: node.label, basePos: [...node.pos], baseEmissive: 0.2 };
      scene.add(mesh);
      meshes.push(mesh);

      // Glow sprite
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending }));
      sprite.scale.set(6*s, 6*s, 1);
      sprite.position.copy(mesh.position);
      scene.add(sprite);
      glowSprites.push({ sprite, mesh, baseOpacity: 0.35 });

      // Label
      const div = document.createElement('div');
      div.style.cssText = `position:absolute;pointer-events:none;font-family:'Montserrat',sans-serif;font-size:11px;font-weight:700;color:#d4a574;letter-spacing:2px;text-transform:uppercase;text-shadow:0 0 12px rgba(212,165,116,1),0 0 4px rgba(212,165,116,.6);white-space:nowrap;transition:opacity .3s;`;
      div.textContent = node.label;
      el.appendChild(div);
      labelDivs.push({ div, mesh });
    });

    // ── Animated connection lines (pulse segments)
    const lineSegments = [];
    const lineMat = new THREE.LineBasicMaterial({ color: 0xd4a574, transparent: true, opacity: 0.12, depthWrite: false });
    for (let i = 0; i < NODES.length; i++) {
      for (let j = i+1; j < NODES.length; j++) {
        if (Math.random() > 0.55) continue;
        const pts = [new THREE.Vector3(...NODES[i].pos), new THREE.Vector3(...NODES[j].pos)];
        const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat.clone());
        scene.add(line);
        lineSegments.push({ line, phase: Math.random() * Math.PI * 2 });
      }
    }

    // ── Pulse rings (flat torus ring that grows and fades)
    const pulseRings = meshes.map(mesh => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1, 0.05, 8, 32),
        new THREE.MeshBasicMaterial({ color: 0xd4a574, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })
      );
      ring.position.copy(mesh.position);
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);
      return { ring, phase: Math.random() * Math.PI * 2, baseScale: mesh.userData.id === 'about' || mesh.userData.id === 'featured' ? 2.2 : 1.5 };
    });

    // ── Interaction
    let isDown = false, lastX = 0, lastY = 0;
    let isPinch = false, lastPinchDist = 0;
    let mouseDownPos = { x:0, y:0 };
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onDown = e => {
      isDown = true;
      lastX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
      lastY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
      mouseDownPos = { x: lastX, y: lastY };
    };
    const onUp = () => { isDown = false; };
    const onMove = e => {
      if (!isDown) return;
      userInteracted = true;
      const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
      const y = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
      rotY += (x - lastX) * 0.005;
      rotX += (y - lastY) * 0.005;
      rotX = Math.max(-1.2, Math.min(1.2, rotX));
      lastX = x; lastY = y;
    };
    const onWheel = e => { userInteracted = true; camRadius = Math.max(8, Math.min(50, camRadius + e.deltaY * 0.02)); };
    const onTouchStart = e => { if (e.touches.length===2) { isPinch=true; lastPinchDist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY); } };
    const onTouchMove = e => { if (e.touches.length===2&&isPinch) { const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY); camRadius=Math.max(8,Math.min(50,camRadius-(d-lastPinchDist)*0.05)); lastPinchDist=d; } };
    const onTouchEnd = () => { isPinch=false; };

    const onClickRay = e => {
      if (Math.abs(e.clientX-mouseDownPos.x)>6||Math.abs(e.clientY-mouseDownPos.y)>6) return;
      const rect = el.getBoundingClientRect();
      mouse.x = ((e.clientX-rect.left)/rect.width)*2-1;
      mouse.y = -((e.clientY-rect.top)/rect.height)*2+1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(meshes);
      if (hits.length) onNodeClick(hits[0].object.userData.id);
    };
    const onTapRay = e => {
      const t = e.changedTouches?.[0]; if(!t) return;
      const rect = el.getBoundingClientRect();
      mouse.x = ((t.clientX-rect.left)/rect.width)*2-1;
      mouse.y = -((t.clientY-rect.top)/rect.height)*2+1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(meshes);
      if (hits.length) onNodeClick(hits[0].object.userData.id);
    };
    const onHover = e => {
      const rect = el.getBoundingClientRect();
      mouse.x = ((e.clientX-rect.left)/rect.width)*2-1;
      mouse.y = -((e.clientY-rect.top)/rect.height)*2+1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(meshes);
      el.style.cursor = hits.length ? 'pointer' : isDown ? 'grabbing' : 'grab';
      meshes.forEach(m => { m.material.emissiveIntensity = m.userData.baseEmissive; });
      glowSprites.forEach(g => { g.sprite.material.opacity = g.baseOpacity; });
      if (hits.length) {
        hits[0].object.material.emissiveIntensity = 0.7;
        const idx = meshes.indexOf(hits[0].object);
        if (idx>=0) glowSprites[idx].sprite.material.opacity = 0.8;
      }
    };

    el.addEventListener('mousedown', onDown);
    el.addEventListener('mouseup', onUp);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mousemove', onHover);
    el.addEventListener('wheel', onWheel, { passive: true });
    el.addEventListener('click', onClickRay);
    el.addEventListener('touchstart', e=>{onDown(e);onTouchStart(e);}, { passive:true });
    el.addEventListener('touchend', e=>{onUp();onTouchRay(e);onTouchEnd();});
    el.addEventListener('touchmove', e=>{onMove(e);onTouchMove(e);}, { passive:true });
    function onTouchRay(e) { onTapRay(e); }

    const onResize = () => {
      const W=el.clientWidth, H=el.clientHeight;
      camera.aspect=W/H; camera.updateProjectionMatrix();
      renderer.setSize(W,H);
    };
    window.addEventListener('resize', onResize);

    // ── Animate
    const clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();


      // Intro zoom
      if (introProgress < 1) {
        introProgress = Math.min(1, introProgress + (0.016 / INTRO_DURATION));
        const ease = 1 - Math.pow(1 - introProgress, 3);
        camRadius = INTRO_START_RADIUS + (IDLE_RADIUS - INTRO_START_RADIUS) * ease;
      }

      // Auto rotate when idle
      if (!userInteracted || !isDown) {
        autoRotateY += 0.0008;
      }

      // Camera
      const totalRotY = rotY + autoRotateY;
      camera.position.x = camRadius * Math.sin(totalRotY) * Math.cos(rotX);
      camera.position.y = camRadius * Math.sin(rotX);
      camera.position.z = camRadius * Math.cos(totalRotY) * Math.cos(rotX);
      camera.lookAt(0, 0, 0);

      // Node animations
      meshes.forEach((m, i) => {
        m.rotation.y += 0.004;
        m.rotation.x += 0.002;
        const bp = m.userData.basePos;
        m.position.y = bp[1] + Math.sin(t * 0.5 + i * 0.8) * 0.35;
        glowSprites[i].sprite.position.copy(m.position);
      });

      // Pulse rings
      pulseRings.forEach(({ ring, phase, baseScale }, i) => {
        const p = ((t * 0.5 + phase) % (Math.PI * 2)) / (Math.PI * 2);
        const s = baseScale * (1 + p * 1.2);
        ring.scale.set(s, s, s);
        ring.material.opacity = 0.25 * (1 - p);
        ring.position.copy(meshes[i].position);
      });

      // Animated connection lines
      lineSegments.forEach(({ line, phase }) => {
        line.material.opacity = 0.06 + 0.1 * (0.5 + 0.5 * Math.sin(t * 0.8 + phase));
      });

      // Dust drift
      const dp = dustGeo.attributes.position;
      for (let i = 0; i < dustCount; i++) {
        dp.setY(i, dp.getY(i) + Math.sin(t * 0.3 + i) * 0.002);
      }
      dp.needsUpdate = true;

      // Labels with occlusion (exclude own mesh)
      labelDivs.forEach(({ div, mesh }) => {
        const pos = mesh.position.clone().project(camera);
        const x = (pos.x * 0.5 + 0.5) * el.clientWidth;
        const y = (-pos.y * 0.5 + 0.5) * el.clientHeight;
        if (pos.z >= 1) { div.style.display = 'none'; return; }
        // check occlusion by OTHER meshes only
        const dir = mesh.position.clone().sub(camera.position).normalize();
        const dist = mesh.position.distanceTo(camera.position);
        raycaster.set(camera.position, dir);
        const otherMeshes = meshes.filter(m => m !== mesh);
        const hits = raycaster.intersectObjects(otherMeshes);
        const occluded = hits.length > 0 && hits[0].distance < dist - 0.5;
        div.style.display = occluded ? 'none' : 'block';
        div.style.left = (x - div.offsetWidth / 2) + 'px';
        div.style.top = (y - 36) + 'px';
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      labelDivs.forEach(({ div }) => div.remove());
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      el.removeEventListener('mousedown', onDown);
      el.removeEventListener('mouseup', onUp);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mousemove', onHover);
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('click', onClickRay);
      window.removeEventListener('resize', onResize);
    };
  }, [onNodeClick]);

  return <div ref={mountRef} style={{ width:'100%', height:'100%', position:'relative' }} />;
}

// ── PANEL CONTENT ─────────────────────────────────────────────────────────────
function PanelContent({ id, siteData, gsVideos, gsLoading, lightboxSet, activeVid, setActiveVid }) {
  const { hero, featured, experience, skills } = siteData;

  if (id==="about") return (
    <>
      <p className="gp-bio">{hero.bio}</p>
      <p className="gp-quote">{hero.personal}</p>
      <div style={{display:'flex',gap:'2rem',justifyContent:'center',marginTop:'1rem'}}>
        <div style={{textAlign:'center'}}><div style={{fontFamily:"'Playfair Display',serif",fontSize:'2.5rem',color:'var(--gold)',fontWeight:700}}>{hero.years}</div><div style={{fontSize:'.8rem',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'1px'}}>Years Experience</div></div>
        <div style={{textAlign:'center'}}><div style={{fontFamily:"'Playfair Display',serif",fontSize:'2.5rem',color:'var(--gold)',fontWeight:700}}>{hero.projects}</div><div style={{fontSize:'.8rem',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'1px'}}>Projects Completed</div></div>
      </div>
    </>
  );
  if (id==="featured") return (
    <div className="gp-grid">
      {featured.map(p=>(
        <div key={p._id} className="gp-card">
          <div style={{position:'relative',paddingBottom:'56.25%',background:'#000',borderRadius:'6px',overflow:'hidden',marginBottom:'.75rem'}}>
            {activeVid===p._id
              ? <iframe style={{position:'absolute',top:0,left:0,width:'100%',height:'100%'}} src={p.embed+"?autoplay=1"} title={p.title} frameBorder="0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowFullScreen/>
              : <div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',cursor:'pointer'}} onClick={()=>setActiveVid(p._id)}>
                  <img src={T(p.vid)} alt={p.title} style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e=>{e.target.style.display='none';e.target.parentElement.style.background='linear-gradient(135deg,#1a1a1a,#2a1a1a)';}}/>
                  <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(10,10,10,.5)'}}><SmPlayIco/></div>
                </div>
            }
          </div>
          <div className="gp-card-title">{p.title}</div>
          <div className="gp-card-sub">{p.type} · {p.year}</div>
          {p.award&&<div className="gp-card-desc" style={{color:'var(--gold)',marginTop:'.3rem'}}>🏆 {p.award}</div>}
        </div>
      ))}
    </div>
  );
  if (id==="showreel") return (
    <div className="gp-vid-grid">
      {showreel.map(v=>(
        <div key={v.id} className="gp-vid" onClick={()=>window.open(v.url,"_blank")}>
          <img src={T(v.vid)} alt={v.title} onError={e=>{e.target.style.display='none';e.target.parentElement.style.background='linear-gradient(135deg,#1a1a1a,#2a1a1a)';}}/>
          <div className="gp-vid-info"><div className="gp-vid-title">{v.title}</div><div className="gp-vid-date">{v.views} views</div></div>
        </div>
      ))}
    </div>
  );
  if (id==="experience") return (
    <div>
      {experience.map(e=>(
        <div key={e._id} className="gp-card" style={{marginBottom:'1rem'}}>
          <div className="gp-card-sub">{e.period}</div>
          <div className="gp-card-title">{e.role}</div>
          <div style={{color:'var(--txt2)',fontSize:'.9rem',marginBottom:'.4rem'}}>{e.company}</div>
          <div className="gp-card-desc">{e.desc}</div>
          {e.award&&<div style={{marginTop:'.5rem',fontSize:'.82rem',color:'var(--gold)'}}>✓ {e.award}</div>}
        </div>
      ))}
    </div>
  );
  if (id==="skills") return (
    <div>
      {skills.map(s=>(
        <div key={s._id} className="gp-skill-cat">
          <h4>{s.category}</h4>
          <div className="gp-tags">{(s.tags||[]).map((t,i)=><span key={i} className="gp-tag">{t}</span>)}</div>
        </div>
      ))}
    </div>
  );
  if (id==="achievements") return (
    <div>
      {siteData.achievements.map(a=>(
        <div key={a._id} className="gp-ach">
          <AwardIco s={32}/>
          <div className="gp-ach-info"><h4>{a.title}</h4><p>{a.desc}</p><div className="gp-ach-year">{a.year}</div></div>
        </div>
      ))}
    </div>
  );
  if (id==="gallery") return (
    <div className="gp-gal">
      {siteData.gallery.map(g=>(
        <div key={g._id} className="gp-gal-item" onClick={()=>lightboxSet(g.imageUrl)}>
          <img src={g.imageUrl} alt={g.caption||"Gallery"} onError={e=>{e.target.parentElement.style.background='linear-gradient(135deg,#1a1a1a,#2a1a1a)';e.target.style.display='none';}}/>
        </div>
      ))}
    </div>
  );
  if (id==="random") return (
    <>
      <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1rem'}}>
        <img src={GS_LOGO} alt="GameSlime" style={{width:48,height:48,borderRadius:'50%',border:'2px solid rgba(212,165,116,.4)'}}/>
        <div><div style={{fontFamily:"'Montserrat',sans-serif",fontWeight:700,color:'var(--gold)'}}>GameSlime</div><div style={{fontSize:'.85rem',color:'var(--txt2)'}}>When I'm not behind the camera, I'm gaming.</div></div>
      </div>
      {gsLoading&&<p style={{color:'var(--muted)'}}>Loading videos…</p>}
      {!gsLoading&&<div className="gp-vid-grid">{gsVideos.map(v=><div key={v.id} className="gp-vid" onClick={()=>window.open(v.url,"_blank")}><img src={v.thumbnail} alt={v.title} onError={e=>{e.target.style.display='none';e.target.parentElement.style.background='linear-gradient(135deg,#1a1a1a,#2a1a1a)';}} /><div className="gp-vid-info"><div className="gp-vid-title">{v.title}</div><div className="gp-vid-date">{v.published}</div></div></div>)}</div>}
      <div style={{textAlign:'center',marginTop:'1.5rem'}}><a href="https://www.youtube.com/@GameSlimeOG" target="_blank" rel="noopener noreferrer" style={{color:'var(--gold)',fontFamily:"Montserrat,sans-serif",fontSize:'.9rem',fontWeight:600,textDecoration:'none',border:'1px solid var(--bdr)',padding:'.5rem 1.25rem',borderRadius:'6px',display:'inline-block'}}>Visit Channel →</a></div>
    </>
  );
  if (id==="contact") return (
    <div className="gp-contact">
      <div className="gp-ci"><PhoneIco/><a href={`tel:${contact.phone}`}>{contact.phone}</a></div>
      <div className="gp-ci"><MailIco/><a href={`mailto:${contact.email}`}>{contact.email}</a></div>
      <div className="gp-ci"><LiIco/><a href={contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></div>
      <div className="gp-ci"><IgIco/><a href={contact.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></div>
      <div className="gp-ci"><FbIco/><a href={contact.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></div>
      <div className="gp-ci"><TwIco/><a href={contact.twitter} target="_blank" rel="noopener noreferrer">Twitter</a></div>
    </div>
  );
  return null;
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState(()=>isMobile()?'classic':'immersive');
  const [activePanel, setActivePanel] = useState(null);
  const [activeVid, setActiveVid] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [gsVideos, setGsVideos] = useState([]);
  const [gsLoading, setGsLoading] = useState(true);
  const [gsError, setGsError] = useState(false);
  const [siteData, setSiteData] = useState({...FALLBACK, featured: FEATURED_FALLBACK});
  const [dataLoading, setDataLoading] = useState(true);

  // ── Loader phases: 'enter' → 'exit' → null (unmounted)
  const [loaderPhase, setLoaderPhase] = useState('enter');
  const loaderDismissed = useRef(false);
  const dismissLoader = useCallback(()=>{
    if (loaderDismissed.current) return;
    loaderDismissed.current = true;
    setLoaderPhase('exit');
    setTimeout(()=>setLoaderPhase(null), 750);
  },[]);

  const go = id => document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
  const { hero, featured, experience, skills, achievements, gallery } = siteData;
  const isImmersive = view==='immersive';

  const handleNodeClick = useCallback(id => setActivePanel(id), []);

  useEffect(()=>{
    const minWait = new Promise(r=>setTimeout(r,2200));
    async function fetchAll(){
      try {
        const [h,f,e,s,a,g] = await Promise.all([
          client.fetch(`*[_type=="hero"][0]`),
          client.fetch(`*[_type=="featured"]|order(order asc)`),
          client.fetch(`*[_type=="experience"]|order(order asc)`),
          client.fetch(`*[_type=="skills"]|order(order asc)`),
          client.fetch(`*[_type=="achievement"]|order(order asc)`),
          client.fetch(`*[_type=="gallery"]|order(order asc){_id,caption,order,"imageUrl":coalesce(imageUrl,image.asset->url)}`),
        ]);
        setSiteData({hero:h||FALLBACK.hero,featured:(f&&f.length)?f:FEATURED_FALLBACK,experience:e||[],skills:s||[],achievements:a||[],gallery:g||[]});
      } catch(err){console.error(err);}
      finally{setDataLoading(false);}
    }
    Promise.all([fetchAll(),minWait]).then(()=>dismissLoader());
  },[dismissLoader]);

  useEffect(()=>{
    fetchChannelData(CHANNEL_ID)
      .then(v=>{setGsVideos(v);setGsLoading(false);})
      .catch(()=>{setGsError(true);setGsLoading(false);});
  },[]);

  const panelTitle = activePanel ? NODES.find(n=>n.id===activePanel)?.label : '';

  return (
    <>
      <style>{css}</style>
      {loaderPhase && <LoadingScreen phase={loaderPhase}/>}
      <div className="w">

        {/* LIGHTBOX */}
        {lightbox&&(
          <div onClick={()=>setLightbox(null)} style={{position:"fixed",inset:0,zIndex:999,background:"rgba(0,0,0,.92)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"zoom-out",padding:"1rem"}}>
            <img src={lightbox} alt="Gallery" style={{maxWidth:"95vw",maxHeight:"95vh",objectFit:"contain",borderRadius:"8px"}} onClick={e=>e.stopPropagation()}/>
            <button onClick={()=>setLightbox(null)} style={{position:"fixed",top:"1.5rem",right:"1.5rem",background:"rgba(212,165,116,.15)",border:"1px solid rgba(212,165,116,.4)",color:"#d4a574",fontSize:"1.5rem",width:"2.5rem",height:"2.5rem",borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
          </div>
        )}

        {/* NAV */}
        <nav>
          <span className="logo">SS</span>
          {!isImmersive&&(
            <div className="classic-links">
              {["about","featured","showreel","experience","skills","achievements","gallery","random","contact"].map(s=>(
                <button key={s} onClick={()=>go(s)}>{s[0].toUpperCase()+s.slice(1)}</button>
              ))}
            </div>
          )}
          <div style={{display:'flex',alignItems:'center',gap:'.75rem'}}>
            {!isImmersive && <MobileNav go={go}/>}
            <a href={`${process.env.PUBLIC_URL}/Sunny_Sawrav_Resume.pdf`} download style={{display:"inline-flex",alignItems:"center",gap:".4rem",padding:".4rem 1rem",background:"transparent",border:"1px solid rgba(212,165,116,.5)",borderRadius:"6px",color:"#d4a574",fontFamily:"Montserrat,sans-serif",fontSize:".72rem",fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",textDecoration:"none",whiteSpace:"nowrap"}} onMouseOver={e=>e.currentTarget.style.background="rgba(212,165,116,.1)"} onMouseOut={e=>e.currentTarget.style.background="transparent"}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d4a574" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>CV</a>
            <div className="view-toggle">
            <span className={`toggle-label ${!isImmersive?'active':''}`}>Classic</span>
            <label className="toggle-switch">
              <input type="checkbox" checked={isImmersive} onChange={()=>setView(v=>v==='immersive'?'classic':'immersive')}/>
              <div className={`toggle-track ${isImmersive?'on':''}`}/>
              <div className={`toggle-thumb ${isImmersive?'on':''}`}/>
            </label>
            <span className={`toggle-label ${isImmersive?'active':''}`}>Immersive</span>
          </div>
          </div>
        </nav>

        {/* IMMERSIVE */}
        {isImmersive&&(
          <>
            <div className="canvas-wrap">
              <Scene onNodeClick={handleNodeClick}/>
            </div>
            <div className="hint">Drag to explore · Click a node to discover</div>
            {activePanel&&(
              <div className="glass-overlay" onClick={()=>setActivePanel(null)}>
                <div className="glass-panel" onClick={e=>e.stopPropagation()}>
                  <div className="glass-header">
                    <span className="glass-title">{panelTitle}</span>
                    <button className="glass-close" onClick={()=>setActivePanel(null)}>×</button>
                  </div>
                  <div className="glass-body">
                    <PanelContent id={activePanel} siteData={siteData} gsVideos={gsVideos} gsLoading={gsLoading} lightboxSet={setLightbox} activeVid={activeVid} setActiveVid={setActiveVid}/>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* CLASSIC */}
        {!isImmersive&&(
          <>
            <section className="hero">
              <div className="hero-in">
                <div className="badge"><FilmIco/><span>{hero.years} Years of Excellence</span></div>
                <h1 className="hname">{hero.name}</h1>
                <p className="htag">{hero.tagline}</p>
                <p className="hdesc">{hero.description}</p>
                <div className="stats">
                  <div><div className="sn">{hero.years}</div><div className="sl">Years Experience</div></div>
                  <div className="sdiv"/>
                  <div><div className="sn">{hero.projects}</div><div className="sl">Projects Completed</div></div>
                </div>
                <div className="ctas">
                  <button className="bp" onClick={()=>go("contact")}>Get In Touch</button>
                  <button className="bs" onClick={()=>go("featured")}>View Work</button>
                </div>
              </div>
            </section>
            <section id="about" className="sec alt"><div className="inn"><div className="shd"><h2 className="stitle">About Me</h2><div className="ul"/></div><div className="about-wrap"><p className="abio">{hero.bio}</p><p className="apersonal">{hero.personal}</p></div></div></section>
            <section id="featured" className="sec"><div className="inn"><div className="shd"><h2 className="stitle">Featured Projects</h2><div className="ul"/></div>{dataLoading?<p style={{textAlign:"center",color:"var(--muted)"}}>Loading…</p>:<div className="fg">{featured.map(p=><div key={p._id} className="pc"><div className="vw">{activeVid===p._id?<iframe src={p.embed+"?autoplay=1"} title={p.title} frameBorder="0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowFullScreen/>:<div className="tw" onClick={()=>setActiveVid(p._id)}><img src={T(p.vid)} alt={p.title} onError={e=>{e.target.style.display="none";e.target.parentElement.style.background="linear-gradient(135deg,#1a1a1a,#2a1a1a)";}}/><div className="pov"><PlayIco/></div></div>}</div><div className="pi"><div className="pm"><span className="pt">{p.type}</span><span className="py">{p.year}</span></div><h3 className="pttl">{p.title}</h3><p className="pd">{p.desc}</p>{p.award&&<div className="pr"><AwardIco s={16}/><span>{p.award}</span></div>}</div></div>)}</div>}</div></section>
            <section id="showreel" className="sec alt"><div className="inn"><div className="shd"><h2 className="stitle">Complete Showreel</h2><div className="ul"/></div><div className="sg">{showreel.map(v=><div key={v.id} className="si" onClick={()=>window.open(v.url,"_blank")}><div className="siw"><img src={T(v.vid)} alt={v.title} onError={e=>{e.target.style.display="none";e.target.parentElement.style.background="linear-gradient(135deg,#1a1a1a,#2a1a1a)";}}/><div className="sov"><ExtIco/></div></div><div className="sinf"><div className="sttl">{v.title}</div><div className="svw">{v.views} views</div></div></div>)}</div></div></section>
            <section id="experience" className="sec"><div className="inn"><div className="shd"><h2 className="stitle">Professional Journey</h2><div className="ul"/></div>{dataLoading?<p style={{textAlign:"center",color:"var(--muted)"}}>Loading…</p>:<div className="tl">{experience.map(e=><div key={e._id} className="tli"><div className="tlm"><BriefIco/></div><div className="tlc"><div className="tlin"><div className="tlp">{e.period}</div><h3 className="tlr">{e.role}</h3><h4 className="tlco">{e.company}</h4><p className="tld">{e.desc}</p>{e.award&&<div className="tla"><ChkIco/><span>{e.award}</span></div>}</div></div></div>)}</div>}</div></section>
            <section id="skills" className="sec alt"><div className="inn"><div className="shd"><h2 className="stitle">Skills & Expertise</h2><div className="ul"/></div>{dataLoading?<p style={{textAlign:"center",color:"var(--muted)"}}>Loading…</p>:<div className="skg">{skills.map(s=><div key={s._id} className="skc"><div className="skh">{s.category}</div><div className="skt">{(s.tags||[]).map((t,i)=><span key={i} className="sktg">{t}</span>)}</div></div>)}</div>}</div></section>
            <section id="achievements" className="sec"><div className="inn"><div className="shd"><h2 className="stitle">Achievements & Recognition</h2><div className="ul"/></div>{dataLoading?<p style={{textAlign:"center",color:"var(--muted)"}}>Loading…</p>:<div className="ag">{achievements.map(a=><div key={a._id} className="ac"><AwardIco s={48}/><h3 className="at">{a.title}</h3><p className="ad">{a.desc}</p><span className="ay">{a.year}</span></div>)}</div>}</div></section>
            <section id="gallery" className="sec alt"><div className="inn"><div className="shd"><h2 className="stitle">Personal Gallery</h2><div className="ul"/></div>{dataLoading?<p style={{textAlign:"center",color:"var(--muted)"}}>Loading…</p>:<div className="gal-grid">{gallery.map(g=><div key={g._id} className="gal-item" onClick={()=>setLightbox(g.imageUrl)}><img src={g.imageUrl} alt={g.caption||"Gallery"} onError={e=>{e.target.parentElement.style.background="linear-gradient(135deg,#1a1a1a,#2a1a1a)";e.target.style.display="none";}}/></div>)}</div>}</div></section>
            <section id="random" className="sec"><div className="inn"><div className="shd"><h2 className="stitle">Random Things</h2><div className="ul"/></div><div className="gs-intro"><div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"1rem",marginBottom:"0.75rem"}}><img src={GS_LOGO} alt="GameSlime logo" style={{width:56,height:56,borderRadius:"50%",border:"2px solid rgba(212,165,116,.4)",objectFit:"cover"}}/><span className="gs-label">GameSlime</span></div><p className="gs-desc">When I'm not behind the camera or in the edit suite, I'm gaming.</p></div>{gsLoading&&<p style={{textAlign:"center",color:"var(--muted)",marginTop:"2rem"}}>Loading latest videos…</p>}{gsError&&<p style={{textAlign:"center",color:"var(--muted)",marginTop:"2rem"}}>Couldn't load videos. <a href="https://www.youtube.com/@GameSlimeOG" target="_blank" rel="noopener noreferrer" style={{color:"var(--gold)"}}>Visit the channel →</a></p>}{!gsLoading&&!gsError&&<div className="gs-grid">{gsVideos.map(v=><div key={v.id} className="gs-card" onClick={()=>window.open(v.url,"_blank")}><div className="gs-thumb"><img src={v.thumbnail} alt={v.title} onError={e=>{e.target.style.display="none";e.target.parentElement.style.background="linear-gradient(135deg,#1a1a1a,#2a1a1a)";}}/><div className="gs-ov"><SmPlayIco/></div></div><div className="gs-info"><div className="gs-ttl">{v.title}</div><div className="gs-dur">{v.published}</div></div></div>)}</div>}<div style={{textAlign:"center",marginTop:"2rem"}}><a href="https://www.youtube.com/@GameSlimeOG" target="_blank" rel="noopener noreferrer" style={{color:"var(--gold)",fontFamily:"Montserrat,sans-serif",fontSize:".9rem",fontWeight:600,textDecoration:"none",border:"1px solid var(--bdr)",padding:".6rem 1.5rem",borderRadius:"6px",display:"inline-block"}} onMouseOver={e=>e.currentTarget.style.background="rgba(212,165,116,.1)"} onMouseOut={e=>e.currentTarget.style.background="transparent"}>Visit GameSlime Channel →</a></div></div></section>
            <section id="contact" className="sec alt"><div className="inn"><div className="shd"><h2 className="stitle">Let's Create Together</h2><div className="ul"/></div><div className="cw"><p className="ct">Have a project in mind? Let's discuss how we can bring your creative vision to life.</p><div className="cl"><div className="ci"><PhoneIco/><a href={`tel:${contact.phone}`}>{contact.phone}</a></div><div className="ci"><MailIco/><a href={`mailto:${contact.email}`}>{contact.email}</a></div><div className="ci"><LiIco/><a href={contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></div><div className="ci"><IgIco/><a href={contact.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></div><div className="ci"><FbIco/><a href={contact.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></div><div className="ci"><TwIco/><a href={contact.twitter} target="_blank" rel="noopener noreferrer">Twitter</a></div></div></div></div></section>
            <footer><p className="ft">© 2025 {hero.name}. All rights reserved.</p><p className="ftag">Crafting stories, one frame at a time.</p></footer>
          </>
        )}
      </div>
    </>
  );
}