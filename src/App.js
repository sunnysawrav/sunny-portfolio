import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import client from './sanityClient';

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
const SmPlayIco=()=><svg width="36" height="36" viewBox="0 0 24 24" fill="#2a2420" style={{filter:"drop-shadow(0 2px 4px rgba(0,0,0,.2))"}}><polygon points="5,3 19,12 5,21"/></svg>;

// ── NODES ─────────────────────────────────────────────────────────────────────
const NODES=[
  {id:"about",       label:"About",        color:0x1a1612, shape:"sphere",     pos:[0,    0,    0],   scale:0.90},
  {id:"featured",    label:"Featured",     color:0x2a2420, shape:"box",        pos:[5.5,  3.5, -1.5], scale:0.75},
  {id:"showreel",    label:"Showreel",     color:0x1e1a16, shape:"box",        pos:[5.5, -2.5,  2.5], scale:0.62},
  {id:"experience",  label:"Experience",   color:0x2e2218, shape:"cone",       pos:[2.5, -5.5,  2],   scale:0.62},
  {id:"skills",      label:"Skills",       color:0x221e1a, shape:"cylinder",   pos:[-3,  -5.5,  2],   scale:0.58},
  {id:"achievements",label:"Achievements", color:0x1a1612, shape:"cone",       pos:[0,    6,    1.5],  scale:0.68},
  {id:"gallery",     label:"Gallery",      color:0x261e18, shape:"torus",      pos:[-5.5, 3,    1.5],  scale:0.56},
  {id:"random",      label:"GameSlime",    color:0x1e2218, shape:"octahedron", pos:[-5.5,-1.5, -2],   scale:0.58},
  {id:"contact",     label:"Contact",      color:0x1a1612, shape:"sphere",     pos:[-1,  -5.5, -2.5],  scale:0.52},
];

// ── CSS ───────────────────────────────────────────────────────────────────────
const css=`
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Montserrat:wght@400;500;600;700&family=Lato:wght@300;400;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#f0ece4;
  --bg2:#e8e2d8;
  --bg3:#ede8df;
  --ink:#1a1612;
  --ink2:#2e2820;
  --ink3:#4a4038;
  --muted:#8a7e72;
  --bdr:rgba(26,22,18,.15);
  --bdr2:rgba(26,22,18,.08);
  --accent:#5a4a3a;
  --accent2:#7a6a5a;
  --paper:#f5f1e8;
}
body,html{background:var(--bg);color:var(--ink);font-family:'Lato',sans-serif;overflow-x:hidden;}
.w{background:var(--bg);overflow-x:hidden;}

/* ── PAPER TEXTURE OVERLAY ── */
.w::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;opacity:.03;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");background-repeat:repeat;}

nav{position:fixed;top:0;left:0;right:0;z-index:200;background:rgba(240,236,228,.92);backdrop-filter:blur(12px);border-bottom:1px solid var(--bdr);padding:.75rem 2rem;display:flex;justify-content:space-between;align-items:center;}
.logo{font-family:'Playfair Display',serif;font-size:1.3rem;color:var(--ink);letter-spacing:2px;}
.classic-links{display:flex;gap:1.2rem;flex-wrap:wrap;}
.classic-links button{background:none;border:none;color:var(--ink3);font-size:.75rem;font-family:'Montserrat',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:1px;cursor:pointer;transition:color .2s;}
.classic-links button:hover{color:var(--ink);}
.view-toggle{display:flex;align-items:center;gap:.6rem;font-family:'Montserrat',sans-serif;font-size:.75rem;font-weight:600;color:var(--ink3);}
.toggle-label{text-transform:uppercase;letter-spacing:1px;}
.toggle-label.active{color:var(--ink);}
.toggle-switch{position:relative;width:52px;height:26px;cursor:pointer;}
.toggle-switch input{opacity:0;width:0;height:0;}
.toggle-track{position:absolute;inset:0;background:rgba(26,22,18,.08);border:1px solid var(--bdr);border-radius:50px;transition:background .3s;}
.toggle-track.on{background:rgba(26,22,18,.18);}
.toggle-thumb{position:absolute;top:3px;left:3px;width:18px;height:18px;background:var(--ink);border-radius:50%;transition:transform .3s;box-shadow:0 2px 6px rgba(0,0,0,.2);}
.toggle-thumb.on{transform:translateX(26px);}

/* ── IMMERSIVE CANVAS ── */
.canvas-wrap{position:fixed;inset:0;top:56px;z-index:1;background:var(--bg);}
canvas{display:block;width:100%!important;height:100%!important;}
.hint{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:rgba(240,236,228,.85);border:1px solid var(--bdr);border-radius:50px;padding:.5rem 1.5rem;font-size:.75rem;color:var(--muted);font-family:'Montserrat',sans-serif;letter-spacing:1.5px;z-index:10;pointer-events:none;transition:opacity .5s;text-transform:uppercase;}

/* ── PAPER PANEL (replaces glassmorphic) ── */
.glass-overlay{position:fixed;inset:0;z-index:300;display:flex;align-items:center;justify-content:center;padding:1rem;background:rgba(200,192,180,.35);backdrop-filter:blur(2px);animation:fadeIn .2s ease;}
.glass-panel{background:var(--paper);border:1px solid rgba(26,22,18,.2);border-radius:4px;box-shadow:4px 4px 0 rgba(26,22,18,.06),8px 8px 0 rgba(26,22,18,.03),0 20px 60px rgba(26,22,18,.12);max-width:800px;width:100%;max-height:85vh;overflow-y:auto;animation:slideUp .25s ease;position:relative;}
.glass-panel::-webkit-scrollbar{width:3px;}
.glass-panel::-webkit-scrollbar-thumb{background:var(--bdr);border-radius:2px;}
.glass-header{display:flex;align-items:center;justify-content:space-between;padding:1.5rem 2rem 1rem;border-bottom:1px solid var(--bdr);}
.glass-title{font-family:'Playfair Display',serif;font-size:1.8rem;color:var(--ink);letter-spacing:.5px;}
.glass-close{background:rgba(26,22,18,.06);border:1px solid var(--bdr);color:var(--ink);width:2rem;height:2rem;border-radius:2px;cursor:pointer;font-size:1.2rem;display:flex;align-items:center;justify-content:center;transition:background .2s;}
.glass-close:hover{background:rgba(26,22,18,.12);}
.glass-body{padding:1.5rem 2rem 2rem;}

/* ── CLASSIC MODE — SCHEMATIC REDESIGN ── */
/* Dot grid background on body for classic mode */
.classic-mode{background-image:radial-gradient(circle,rgba(26,22,18,.16) 1.2px,transparent 1.2px);background-size:24px 24px;background-color:var(--bg);}

/* Section micro system labels */
.sys-line{display:flex;align-items:center;gap:8px;margin-bottom:.5rem;}
.sys-dot{width:4px;height:4px;border-radius:50%;background:var(--ink3);flex-shrink:0;}
.sys-bar{flex:1;height:1px;background:var(--bdr);}
.sys-label{font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--muted);white-space:nowrap;}

/* Corner bracket marks on cards */
.cm-wrap{position:relative;}
.cm-wrap::before,.cm-wrap::after{content:'';position:absolute;width:10px;height:10px;border-color:rgba(26,22,18,.25);border-style:solid;pointer-events:none;}
.cm-wrap::before{top:0;left:0;border-width:1px 0 0 1px;}
.cm-wrap::after{top:0;right:0;border-width:1px 1px 0 0;}
.cm-wrap-b::before,.cm-wrap-b::after{content:'';position:absolute;width:10px;height:10px;border-color:rgba(26,22,18,.25);border-style:solid;pointer-events:none;}
.cm-wrap-b::before{bottom:0;left:0;border-width:0 0 1px 1px;}
.cm-wrap-b::after{bottom:0;right:0;border-width:0 1px 1px 0;}

/* ── HERO ── */
.hero{min-height:100vh;display:flex;align-items:center;justify-content:center;background:transparent;padding:7rem 2rem 4rem;text-align:center;position:relative;border-bottom:1px solid var(--bdr);}
.hero-in{max-width:900px;animation:fadeUp .9s ease-out;position:relative;z-index:1;}
.badge{display:inline-flex;align-items:center;gap:.5rem;padding:.4rem 1.2rem;background:rgba(26,22,18,.04);border:1px solid var(--bdr);margin-bottom:1.5rem;font-size:.78rem;color:var(--ink3);font-weight:700;letter-spacing:2px;font-family:'Montserrat',sans-serif;text-transform:uppercase;}
.hname{font-family:'Playfair Display',serif;font-size:clamp(3rem,8vw,6rem);font-weight:700;margin-bottom:1rem;color:var(--ink);line-height:1.1;}
.htag{font-family:'Montserrat',sans-serif;font-size:clamp(.78rem,2vw,1rem);color:var(--ink3);margin-bottom:1.5rem;font-weight:700;letter-spacing:3px;text-transform:uppercase;}
.hdesc{font-size:1rem;color:var(--ink3);max-width:600px;margin:0 auto 2rem;line-height:1.9;}
.stats{display:flex;align-items:stretch;justify-content:center;gap:0;margin:2.5rem auto;border:1px solid var(--bdr);max-width:380px;}
.sn{font-family:'Playfair Display',serif;font-size:2.8rem;font-weight:700;color:var(--ink);line-height:1;}
.sl{font-size:.65rem;color:var(--muted);text-transform:uppercase;letter-spacing:2px;margin-top:.4rem;font-family:'Montserrat',sans-serif;font-weight:700;}
.sdiv{width:1px;background:var(--bdr);align-self:stretch;}
.stat-cell{flex:1;padding:1.25rem 2rem;text-align:center;}
.ctas{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;}
.bp{background:var(--ink);color:var(--paper);padding:.85rem 2.2rem;font-size:.75rem;font-weight:700;border:1px solid var(--ink);border-radius:0;cursor:pointer;transition:transform .2s,box-shadow .2s;font-family:'Montserrat',sans-serif;text-transform:uppercase;letter-spacing:2px;}
.bp:hover{transform:translateY(-2px);box-shadow:3px 3px 0 rgba(26,22,18,.12);}
.bs{border:1px solid var(--bdr);color:var(--ink);background:transparent;padding:.85rem 2.2rem;font-size:.75rem;font-weight:700;border-radius:0;cursor:pointer;transition:background .2s,transform .2s;font-family:'Montserrat',sans-serif;text-transform:uppercase;letter-spacing:2px;}
.bs:hover{background:rgba(26,22,18,.05);transform:translateY(-2px);}

/* ── SECTIONS ── */
.sec{padding:5rem 2rem;background:transparent;border-bottom:1px solid var(--bdr);}
.alt{background:rgba(26,22,18,.02);}
.inn{max-width:1200px;margin:0 auto;}
.shd{margin-bottom:3rem;}
.stitle{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,4vw,2.8rem);font-weight:700;color:var(--ink);margin-top:.5rem;}
.ul{width:40px;height:1px;background:var(--ink3);margin-top:.75rem;}

/* ── ABOUT ── */
.about-wrap{max-width:820px;}
.abio{font-size:.98rem;line-height:1.95;color:var(--ink3);margin-bottom:1.75rem;}
.apersonal{font-size:.93rem;line-height:1.85;color:var(--ink3);font-style:italic;padding:1rem 1.5rem;border-left:2px solid var(--ink3);background:rgba(26,22,18,.03);text-align:left;margin-bottom:1.5rem;}
.about-stats{display:flex;border:1px solid var(--bdr);max-width:340px;margin-top:1.5rem;}
.about-stat{flex:1;padding:1rem 1.5rem;text-align:center;}
.about-stat+.about-stat{border-left:1px solid var(--bdr);}
.about-stat-n{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:700;color:var(--ink);}
.about-stat-l{font-family:'Montserrat',sans-serif;font-size:.6rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);margin-top:.3rem;}

/* ── GALLERY PAGINATION ── */
.gal-pagination{display:flex;align-items:center;justify-content:center;gap:1.5rem;margin-top:2rem;padding-top:1.5rem;border-top:1px solid var(--bdr);}
.gal-pg-btn{background:transparent;border:1px solid var(--bdr);color:var(--ink3);font-family:'Montserrat',sans-serif;font-size:.68rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:.45rem 1rem;cursor:pointer;transition:background .2s,color .2s;}
.gal-pg-btn:hover:not(:disabled){background:rgba(26,22,18,.06);color:var(--ink);}
.gal-pg-btn:disabled{opacity:.3;cursor:default;}
.gal-pg-count{font-family:'Montserrat',sans-serif;font-size:.72rem;font-weight:700;letter-spacing:3px;color:var(--muted);}
.gal-pg-bar{width:120px;height:1px;background:var(--bdr);position:relative;}
.gal-pg-bar-fill{position:absolute;left:0;top:0;height:100%;background:var(--ink3);transition:width .3s;}
.gal-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem;}
.gal-item{overflow:hidden;aspect-ratio:4/3;cursor:pointer;background:#ddd;border:1px solid var(--bdr);position:relative;}
.gal-item img{width:100%;height:100%;object-fit:cover;transition:transform .5s,filter .4s;filter:grayscale(100%);}
.gal-item:hover img{transform:scale(1.04);filter:grayscale(0%);}

/* ── FEATURED ── */
.fg{display:grid;grid-template-columns:repeat(auto-fit,minmax(420px,1fr));gap:2rem;}
.pc{background:rgba(26,22,18,.02);border:1px solid var(--bdr);overflow:visible;transition:transform .2s;position:relative;}
.pc:hover{transform:translateY(-2px);}
.vw{position:relative;width:100%;padding-bottom:56.25%;background:var(--ink);}
.vw iframe{position:absolute;top:0;left:0;width:100%;height:100%;}
.tw{position:absolute;top:0;left:0;width:100%;height:100%;cursor:pointer;overflow:hidden;background:var(--ink);}
.tw img{width:100%;height:100%;object-fit:cover;transition:transform .5s,filter .4s;filter:grayscale(100%);}
.tw:hover img{transform:scale(1.03);filter:grayscale(0%);}
.pov{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(26,22,18,.3);transition:background .3s;}
.tw:hover .pov{background:rgba(26,22,18,.15);}
.feat-play{width:44px;height:44px;border:1.5px solid rgba(240,236,228,.4);display:flex;align-items:center;justify-content:center;}
.pi{padding:1.25rem;}
.pm{display:flex;justify-content:space-between;margin-bottom:.5rem;}
.pt{font-size:.65rem;color:var(--ink3);font-weight:700;text-transform:uppercase;letter-spacing:2px;font-family:'Montserrat',sans-serif;}
.py{font-size:.65rem;color:var(--muted);font-family:'Montserrat',sans-serif;}
.pttl{font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:700;color:var(--ink);margin-bottom:.5rem;}
.pd{font-size:.85rem;color:var(--ink3);line-height:1.65;margin-bottom:.75rem;}
.pr{display:flex;align-items:center;gap:.5rem;padding:.45rem .75rem;border-left:2px solid var(--ink3);background:rgba(26,22,18,.03);font-size:.78rem;color:var(--ink3);}

/* ── SHOWREEL ── */
.sg{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.25rem;}
.si{position:relative;overflow:hidden;cursor:pointer;transition:transform .2s;background:rgba(26,22,18,.02);border:1px solid var(--bdr);}
.si:hover{transform:scale(1.02);}
.siw{width:100%;aspect-ratio:16/9;overflow:hidden;position:relative;background:#ccc;}
.siw img{width:100%;height:100%;object-fit:cover;display:block;filter:grayscale(100%);transition:filter .4s;}
.si:hover .siw img{filter:grayscale(0%);}
.sov{position:absolute;inset:0;background:rgba(26,22,18,.5);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .3s;color:var(--paper);}
.si:hover .sov{opacity:1;}
.sinf{padding:.6rem .75rem .75rem;}
.sttl{font-size:.8rem;font-weight:700;color:var(--ink);margin-bottom:.2rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:'Montserrat',sans-serif;letter-spacing:.5px;}
.svw{font-size:.7rem;color:var(--muted);font-family:'Montserrat',sans-serif;letter-spacing:1px;}

/* ── GAMESLIME ── */
.gs-intro{margin-bottom:2.5rem;}
.gs-label{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:var(--ink);letter-spacing:1px;}
.gs-desc{color:var(--ink3);font-size:.93rem;line-height:1.7;max-width:580px;margin:.6rem 0 0;}
.gs-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.25rem;}
.gs-card{background:rgba(26,22,18,.02);border:1px solid var(--bdr);overflow:hidden;cursor:pointer;transition:transform .2s;position:relative;}
.gs-card:hover{transform:translateY(-2px);}
.gs-thumb{width:100%;aspect-ratio:16/9;position:relative;background:#ccc;overflow:hidden;}
.gs-thumb img{width:100%;height:100%;object-fit:cover;transition:transform .5s,filter .4s;filter:grayscale(100%);}
.gs-card:hover .gs-thumb img{transform:scale(1.04);filter:grayscale(0%);}
.gs-ov{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(26,22,18,.35);}
.gs-info{padding:.85rem 1rem;}
.gs-ttl{font-size:.85rem;font-weight:700;color:var(--ink);margin-bottom:.3rem;font-family:'Montserrat',sans-serif;letter-spacing:.5px;}
.gs-dur{font-size:.72rem;color:var(--muted);font-family:'Montserrat',sans-serif;letter-spacing:1px;}

/* ── TIMELINE — left-rail schematic style ── */
.tl{position:relative;max-width:820px;}
.tl::before{content:'';position:absolute;left:18px;top:0;bottom:0;width:1px;background:var(--bdr);}
.tli{position:relative;padding-left:56px;margin-bottom:2rem;}
.tlm{position:absolute;left:0;top:1.2rem;width:37px;height:37px;border:1px solid var(--bdr);background:var(--bg3);display:flex;align-items:center;justify-content:center;color:var(--ink3);}
.tlc{background:rgba(26,22,18,.02);border:1px solid var(--bdr);transition:transform .2s;position:relative;}
.tlc:hover{transform:translateY(-2px);}
.tlin{padding:1.25rem;}
.tlp{font-size:.62rem;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:2px;font-family:'Montserrat',sans-serif;margin-bottom:.4rem;}
.tlr{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:var(--ink);margin-bottom:.2rem;}
.tlco{font-size:.9rem;color:var(--ink3);margin-bottom:.6rem;}
.tld{color:var(--ink3);line-height:1.65;font-size:.85rem;margin-bottom:.5rem;}
.tla{display:flex;align-items:center;gap:.5rem;padding:.42rem .75rem;border-left:2px solid var(--ink3);background:rgba(26,22,18,.03);font-size:.78rem;color:var(--ink3);margin-top:.5rem;}

/* ── SKILLS ── */
.skg{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;}
.skc{background:rgba(26,22,18,.02);border:1px solid var(--bdr);padding:1.5rem;transition:transform .2s;position:relative;}
.skc:hover{transform:translateY(-2px);}
.skh{font-family:'Montserrat',sans-serif;font-size:.75rem;font-weight:700;color:var(--ink);margin-bottom:1rem;text-transform:uppercase;letter-spacing:2px;}
.skt{display:flex;flex-wrap:wrap;gap:.4rem;}
.sktg{padding:.3rem .75rem;background:rgba(26,22,18,.04);border:1px solid var(--bdr);font-size:.75rem;color:var(--ink3);font-family:'Montserrat',sans-serif;letter-spacing:.5px;}
.sktg:hover{background:rgba(26,22,18,.08);color:var(--ink);}

/* ── ACHIEVEMENTS ── */
.ag{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;}
.ac{background:rgba(26,22,18,.02);border:1px solid var(--bdr);padding:1.75rem;text-align:center;transition:transform .2s;position:relative;}
.ac:hover{transform:translateY(-2px);}
.at{font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;color:var(--ink);margin:.75rem 0 .5rem;}
.ad{color:var(--ink3);line-height:1.6;margin-bottom:.75rem;font-size:.85rem;}
.ay{font-size:.65rem;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:2px;font-family:'Montserrat',sans-serif;}

/* ── CONTACT ── */
.cw{max-width:700px;}
.ct{font-size:.98rem;color:var(--ink3);line-height:1.9;margin-bottom:2.5rem;}
.cl{display:flex;flex-direction:column;gap:1.25rem;}
.ci{display:flex;align-items:center;gap:1rem;font-size:.95rem;color:var(--ink3);transition:transform .2s;}
.ci:hover{transform:translateX(4px);}
.ci a{color:var(--ink);text-decoration:none;font-weight:600;transition:color .2s;font-family:'Montserrat',sans-serif;font-size:.85rem;letter-spacing:.5px;}
.ci a:hover{color:var(--accent);}

footer{background:rgba(26,22,18,.03);border-top:1px solid var(--bdr);padding:2.5rem 2rem;text-align:center;}
.ft{color:var(--muted);font-size:.72rem;margin-bottom:.4rem;font-family:'Montserrat',sans-serif;letter-spacing:2px;text-transform:uppercase;}
.ftag{color:var(--ink3);font-style:italic;font-family:'Playfair Display',serif;font-size:.95rem;}

/* ── PANEL CONTENT (paper style) ── */
.gp-bio{font-size:1rem;line-height:1.9;color:var(--ink3);margin-bottom:1.5rem;}
.gp-quote{font-style:italic;padding:1rem 1.5rem;border-left:2px solid var(--ink3);background:rgba(26,22,18,.03);border-radius:0 2px 2px 0;color:var(--ink3);margin-bottom:1rem;}
.gp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1rem;margin-top:1rem;}
.gp-card{background:var(--bg2);border:1px solid var(--bdr);border-radius:2px;padding:1rem;}
.gp-card-title{font-family:'Playfair Display',serif;font-weight:700;color:var(--ink);margin-bottom:.4rem;font-size:.95rem;}
.gp-card-sub{font-size:.78rem;color:var(--muted);margin-bottom:.3rem;font-family:'Montserrat',sans-serif;text-transform:uppercase;letter-spacing:1px;}
.gp-card-desc{font-size:.82rem;color:var(--ink3);line-height:1.5;}
.gp-tags{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.75rem;}
.gp-tag{padding:.3rem .75rem;background:rgba(26,22,18,.05);border:1px solid var(--bdr);border-radius:2px;font-size:.78rem;color:var(--ink3);font-family:'Montserrat',sans-serif;}
.gp-skill-cat{margin-bottom:1.25rem;}
.gp-skill-cat h4{font-family:'Montserrat',sans-serif;color:var(--ink);font-size:.85rem;margin-bottom:.6rem;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;}
.gp-ach{display:flex;align-items:flex-start;gap:1rem;padding:.75rem;background:rgba(26,22,18,.03);border-radius:2px;margin-bottom:.75rem;border:1px solid var(--bdr2);}
.gp-ach-info h4{font-family:'Playfair Display',serif;font-size:.95rem;color:var(--ink);margin-bottom:.2rem;}
.gp-ach-info p{font-size:.85rem;color:var(--ink3);}
.gp-ach-year{font-size:.75rem;color:var(--muted);font-weight:700;margin-top:.2rem;font-family:'Montserrat',sans-serif;letter-spacing:1px;}
.gp-gal{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:.75rem;}
.gp-gal-item{aspect-ratio:4/3;border-radius:2px;overflow:hidden;cursor:pointer;background:#ccc;border:1px solid var(--bdr);}
.gp-gal-item img{width:100%;height:100%;object-fit:cover;transition:transform .4s,filter .4s;filter:grayscale(100%);}
.gp-gal-item:hover img{transform:scale(1.06);filter:grayscale(0%);}
.gp-contact{display:flex;flex-direction:column;gap:1rem;}
.gp-ci{display:flex;align-items:center;gap:1rem;color:var(--ink3);font-size:1rem;}
.gp-ci a{color:var(--ink);text-decoration:none;font-weight:600;}
.gp-vid-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem;margin-top:1rem;}
.gp-vid{cursor:pointer;border-radius:2px;overflow:hidden;background:var(--bg2);border:1px solid var(--bdr);transition:transform .3s;}
.gp-vid:hover{transform:translateY(-2px);}
.gp-feat-thumb-img{filter:grayscale(100%);transition:filter .4s;}
.gp-feat-thumb-wrap:hover .gp-feat-thumb-img{filter:grayscale(0%);}
.gp-feat-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(240,236,228,.45);transition:background .4s;}
.gp-feat-thumb-wrap:hover .gp-feat-overlay{background:rgba(240,236,228,0);}
.gp-vid img{width:100%;aspect-ratio:16/9;object-fit:cover;display:block;filter:grayscale(100%);transition:filter .4s;}
.gp-vid:hover img{filter:grayscale(0%);}
.gp-vid-info{padding:.5rem .75rem;}
.gp-vid-title{font-size:.78rem;font-weight:600;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:'Montserrat',sans-serif;}
.gp-vid-date{font-size:.7rem;color:var(--muted);font-family:'Montserrat',sans-serif;}

@keyframes fadeUp{from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes slideUp{from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);}}

@media(max-width:768px){.sec{padding:3.5rem 1.25rem;}.fg{grid-template-columns:1fr;}.skg,.ag,.gs-grid{grid-template-columns:1fr;}.ctas{flex-direction:column;width:100%;}.bp,.bs{width:100%;}.stats{max-width:100%;}.classic-links{gap:.75rem;}.classic-links button{font-size:.68rem;}.toggle-label{display:none;}.about-stats{max-width:100%;}}
@media(max-width:480px){.classic-links{display:none;}}

/* ── LOADING SCREEN (paper) ── */
.loader-wrap{position:fixed;inset:0;z-index:1000;background:var(--bg);display:flex;flex-direction:column;align-items:stretch;justify-content:space-between;overflow:hidden;}
.loader-wrap.loader-enter{animation:loaderFadeIn .4s ease forwards;}
.loader-wrap.loader-exit{animation:loaderFadeOut .7s ease forwards;pointer-events:none;}
@keyframes loaderFadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes loaderFadeOut{from{opacity:1;}to{opacity:0;}}
.loader-strip{display:flex;align-items:center;padding:.6rem 0;background:var(--bg2);border-top:1px solid var(--bdr);border-bottom:1px solid var(--bdr);overflow:hidden;gap:1.2rem;animation:stripScroll 4s linear infinite;}
.loader-strip.bottom{animation-direction:reverse;}
@keyframes stripScroll{from{transform:translateX(0);}to{transform:translateX(-50%);}}
.sprocket{flex-shrink:0;width:22px;height:14px;border-radius:2px;border:1px solid rgba(26,22,18,.2);background:rgba(26,22,18,.04);}
.loader-centre{flex:1;display:flex;align-items:center;justify-content:center;padding:2rem;}
.loader-frame{text-align:center;animation:loaderContentIn .6s .15s ease both;}
@keyframes loaderContentIn{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
.loader-initials{display:inline-block;font-family:'Playfair Display',serif;font-size:5rem;font-weight:700;color:transparent;-webkit-text-stroke:1px rgba(26,22,18,.4);letter-spacing:.15em;line-height:1;margin-bottom:1.2rem;}
.loader-name{font-family:'Montserrat',sans-serif;font-size:clamp(.9rem,3vw,1.3rem);font-weight:700;letter-spacing:.45em;color:var(--ink);text-transform:uppercase;margin-bottom:.6rem;}
.loader-role{font-family:'Lato',sans-serif;font-size:clamp(.75rem,2vw,.9rem);color:var(--muted);letter-spacing:.15em;margin-bottom:2rem;}
.loader-bar-wrap{width:220px;height:1px;background:rgba(26,22,18,.1);border-radius:1px;margin:0 auto 1rem;overflow:hidden;}
.loader-bar{height:100%;background:var(--ink3);border-radius:1px;animation:loaderBarSweep 1.6s ease-in-out infinite;}
@keyframes loaderBarSweep{0%{transform:translateX(-100%);}100%{transform:translateX(220px);}}
.loader-sub{font-family:'Montserrat',sans-serif;font-size:.68rem;color:var(--muted);letter-spacing:.2em;text-transform:uppercase;}

/* ── MOBILE NAV DRAWER ── */
.mob-burger{display:none;flex-direction:column;justify-content:center;gap:5px;background:none;border:none;cursor:pointer;padding:.25rem;z-index:210;}
.mob-burger span{display:block;width:22px;height:1.5px;background:var(--ink);border-radius:0;transition:transform .3s,opacity .3s;}
.mob-burger.open span:nth-child(1){transform:translateY(7px) rotate(45deg);}
.mob-burger.open span:nth-child(2){opacity:0;}
.mob-burger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}
.mob-drawer-backdrop{display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:500;background:rgba(26,22,18,.35);}
.mob-drawer-backdrop.open{display:block;}
.mob-drawer{position:fixed;top:0;right:0;height:100vh;z-index:501;width:78vw;max-width:300px;background:var(--bg);background-image:radial-gradient(circle,rgba(26,22,18,.16) 1.2px,transparent 1.2px);background-size:24px 24px;border-left:1px solid var(--bdr);padding:0;display:flex;flex-direction:column;transform:translateX(100%);transition:transform .35s cubic-bezier(.4,0,.2,1);}
.mob-drawer.open{transform:translateX(0);}
.mob-drawer-header{padding:1.25rem 1.25rem .75rem;border-bottom:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-between;}
.mob-drawer-sys{display:flex;align-items:center;gap:6px;}
.mob-drawer-sys-dot{width:4px;height:4px;border-radius:50%;background:var(--ink3);}
.mob-drawer-sys-label{font-family:'Montserrat',sans-serif;font-size:8px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--muted);}
.mob-drawer-close{background:transparent;border:1px solid var(--bdr);color:var(--ink);width:1.75rem;height:1.75rem;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;font-family:'Montserrat',sans-serif;}
.mob-drawer-close:hover{background:rgba(26,22,18,.06);}
.mob-drawer-links{display:flex;flex-direction:column;padding:.5rem 0;flex:1;overflow-y:auto;}
.mob-drawer-link{background:none;border:none;border-bottom:1px solid var(--bdr2);color:var(--ink3);font-family:'Montserrat',sans-serif;font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:2px;text-align:left;padding:.9rem 1.25rem;cursor:pointer;transition:color .2s,background .2s;width:100%;display:flex;align-items:center;gap:.75rem;}
.mob-drawer-link:hover{color:var(--ink);background:rgba(26,22,18,.04);}
.mob-drawer-link:last-child{border-bottom:none;}
.mob-drawer-link-num{font-size:8px;color:var(--muted);letter-spacing:1px;flex-shrink:0;}
@media(max-width:480px){.mob-burger{display:flex;}}

/* ── CV BUTTON ── */
.cv-btn{display:inline-flex;align-items:center;gap:.4rem;padding:.4rem 1rem;background:transparent;border:1px solid rgba(26,22,18,.3);border-radius:2px;color:var(--ink);font-family:'Montserrat',sans-serif;font-size:.72rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;text-decoration:none;white-space:nowrap;transition:background .2s;}
.cv-btn:hover{background:rgba(26,22,18,.06);}
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
        <div className="mob-drawer-header">
          <div className="mob-drawer-sys">
            <div className="mob-drawer-sys-dot"/>
            <span className="mob-drawer-sys-label">Nav · Menu · SYS</span>
          </div>
          <button className="mob-drawer-close" onClick={()=>setOpen(false)}>×</button>
        </div>
        <div className="mob-drawer-links">
          {sections.map((s,i)=>(
            <button key={s} className="mob-drawer-link" onClick={()=>handleNav(s)}>
              <span className="mob-drawer-link-num">{String(i+1).padStart(2,'0')}</span>
              {labels[s]}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ── SCENE (E-PAPER / ORTHOGRAPHIC / INK) ─────────────────────────────────────
function Scene({ onNodeClick }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    const W = el.clientWidth, H = el.clientHeight;

    // ── Orthographic camera (flat / e-paper feel)
    const frustumSize = 18;
    const aspect = W / H;
    const camera = new THREE.OrthographicCamera(
      -frustumSize * aspect / 2,
       frustumSize * aspect / 2,
       frustumSize / 2,
      -frustumSize / 2,
      0.1, 500
    );
    camera.position.set(0, 0, 40);
    camera.lookAt(0, 0, 0);

    // ── Renderer — paper background
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(W, H);
    renderer.setClearColor(0xf0ece4, 1); // cream paper fallback
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);
    // Clear any previously set CSS background from earlier iterations
    el.style.backgroundImage = '';
    el.style.backgroundColor = '';

    const scene = new THREE.Scene();

    // ── Dot-grid sphere skybox ─────────────────────────────────────────────────
    const SKY_W = 4096, SKY_H = 2048;
    const skyCanvas = document.createElement('canvas');
    skyCanvas.width = SKY_W; skyCanvas.height = SKY_H;
    const sctx = skyCanvas.getContext('2d');
    sctx.fillStyle = '#f0ece4';
    sctx.fillRect(0, 0, SKY_W, SKY_H);
    sctx.fillStyle = 'rgba(26,22,18,0.35)';
    const DOT_SPACING = 60; // larger spacing at higher res = crisp dots when projected
    for (let x = DOT_SPACING / 2; x < SKY_W; x += DOT_SPACING) {
      for (let y = DOT_SPACING / 2; y < SKY_H; y += DOT_SPACING) {
        sctx.beginPath();
        sctx.arc(x, y, 2.5, 0, Math.PI * 2);
        sctx.fill();
      }
    }
    const skyTex = new THREE.CanvasTexture(skyCanvas);
    skyTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const skyMesh = new THREE.Mesh(
      new THREE.SphereGeometry(80, 64, 40),
      new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, depthWrite: false })
    );
    scene.add(skyMesh);
    // Note: sphere radius kept tight (80) so texture sits close to camera — sharper dots

    // ── Flat lighting (minimal — toon feel)
    scene.add(new THREE.AmbientLight(0xf0ece4, 2.5));
    const dirLight = new THREE.DirectionalLight(0xf0ece4, 1.0);
    dirLight.position.set(0, 0, 10);
    scene.add(dirLight);

    // ── Orbit / rotation state
    let rotX = 0.15, rotY = 0;
    let autoRotateY = 0;
    let userInteracted = false;
    let isDown = false, lastX = 0, lastY = 0;
    let mouseDownPos = { x:0, y:0 };
    let hoveredIdx = -1;
    let inkBurstMesh = null;

    // ── Click burst animation state
    let burstAnim = null;
    // burstAnim = { startTime, nodeId, meshPos: Vector3, phase: 'expand'|'fade' }

    // ── Camera orbit helper (orthographic)
    const ORBIT_RADIUS = 40;
    function updateCamera() {
      const totalY = rotY + autoRotateY;
      camera.position.x = ORBIT_RADIUS * Math.sin(totalY) * Math.cos(rotX);
      camera.position.y = ORBIT_RADIUS * Math.sin(rotX);
      camera.position.z = ORBIT_RADIUS * Math.cos(totalY) * Math.cos(rotX);
      camera.lookAt(0, 0, 0);
    }
    updateCamera();

    // ── Node meshes (flat toon ink style)
    const meshes = [];
    const labelDivs = [];
    const nodeIndexLabels = []; // coordinate sub-labels

    NODES.forEach((node, idx) => {
      let geo;
      const s = node.scale;
      switch(node.shape) {
        case "box":        geo = new THREE.BoxGeometry(1.8*s,1.8*s,1.8*s); break;
        case "cylinder":   geo = new THREE.CylinderGeometry(s,s,2*s,16); break;
        case "cone":       geo = new THREE.ConeGeometry(1.2*s,2.2*s,16); break;
        case "torus":      geo = new THREE.TorusGeometry(1.1*s,0.38*s,12,32); break;
        case "octahedron": geo = new THREE.OctahedronGeometry(1.4*s); break;
        default:           geo = new THREE.SphereGeometry(1.2*s,24,24);
      }

      // Flat dark ink fill
      const mat = new THREE.MeshBasicMaterial({ color: 0x1a1612 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...node.pos);
      // Give torus a face-on starting angle so it reads as a ring, not an oval
      if (node.shape === 'torus') { mesh.rotation.x = Math.PI * 0.3; mesh.rotation.y = Math.PI * 0.2; }
      mesh.userData = { id: node.id, label: node.label, basePos: [...node.pos], idx };
      scene.add(mesh);
      meshes.push(mesh);

      // Wireframe outline — subtle, just enough to hint at the shape geometry
      const wireMat = new THREE.MeshBasicMaterial({ color: 0xf0ece4, wireframe: true, opacity: 0.12, transparent: true });
      const wireMesh = new THREE.Mesh(geo, wireMat);
      wireMesh.position.copy(mesh.position);
      wireMesh.rotation.copy(mesh.rotation);
      scene.add(wireMesh);
      mesh.userData.wire = wireMesh;

      // Label div — sits above the node
      const div = document.createElement('div');
      div.style.cssText = `position:absolute;pointer-events:none;font-family:'Montserrat',sans-serif;font-size:9.5px;font-weight:700;color:#1a1612;letter-spacing:2.5px;text-transform:uppercase;white-space:nowrap;transition:opacity .3s;background:rgba(240,236,228,0.75);padding:1px 4px;`;
      div.textContent = node.label;
      el.appendChild(div);
      labelDivs.push({ div, mesh });

      // Coordinate sub-label
      const sub = document.createElement('div');
      sub.style.cssText = `position:absolute;pointer-events:none;font-family:'Montserrat',sans-serif;font-size:7.5px;font-weight:400;color:#8a7e72;letter-spacing:1.5px;white-space:nowrap;transition:opacity .3s;opacity:0;`;
      sub.textContent = `NODE·${String(idx+1).padStart(3,'0')}`;
      el.appendChild(sub);
      nodeIndexLabels.push({ sub, mesh });
    });

    // ── Connection lines (thin hairline ink)
    for (let i = 0; i < NODES.length; i++) {
      for (let j = i+1; j < NODES.length; j++) {
        if (Math.random() > 0.5) continue;
        const pts = [new THREE.Vector3(...NODES[i].pos), new THREE.Vector3(...NODES[j].pos)];
        const line = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(pts),
          new THREE.LineBasicMaterial({ color: 0x1a1612, transparent: true, opacity: 0.06 })
        );
        scene.add(line);
      }
    }

    // ── Ink burst helper
    function createInkBurst() {
      // Burst is generated per-frame in the animate loop using seeded random
      // so it tracks the floating node position exactly — nothing to do here
      if (inkBurstMesh) { scene.remove(inkBurstMesh); inkBurstMesh = null; }
    }

    function removeInkBurst() {
      if (inkBurstMesh) { scene.remove(inkBurstMesh); inkBurstMesh = null; }
    }

    // ── Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // ── Interaction handlers
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
    const onWheel = e => {
      userInteracted = true;
      const s = camera.right;
      const newS = Math.max(8, Math.min(36, s + e.deltaY * 0.03));
      const a = el.clientWidth / el.clientHeight;
      const hs = newS / 2;
      camera.left = -hs * a; camera.right = hs * a;
      camera.top = hs; camera.bottom = -hs;
      camera.updateProjectionMatrix();
    };

    const onHover = e => {
      const rect = el.getBoundingClientRect();
      mouse.x = ((e.clientX-rect.left)/rect.width)*2-1;
      mouse.y = -((e.clientY-rect.top)/rect.height)*2+1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(meshes);
      el.style.cursor = hits.length ? 'pointer' : isDown ? 'grabbing' : 'grab';

      if (hits.length) {
        const idx = meshes.indexOf(hits[0].object);
        if (idx !== hoveredIdx) {
          hoveredIdx = idx;
          // Show ink burst at projected position (use mesh world pos)
          const worldPos = hits[0].object.position.clone();
          createInkBurst(worldPos);
          // Show coordinate sub-label
          nodeIndexLabels.forEach(({sub}, i) => { sub.style.opacity = i === idx ? '1' : '0'; });
        }
      } else {
        if (hoveredIdx !== -1) {
          hoveredIdx = -1;
          removeInkBurst();
          nodeIndexLabels.forEach(({sub}) => { sub.style.opacity = '0'; });
        }
      }
    };

    const triggerClickBurst = (nodeId, meshPos) => {
      // Clear any existing hover burst
      if (inkBurstMesh) { scene.remove(inkBurstMesh); inkBurstMesh = null; }
      hoveredIdx = -1;
      // Start burst animation
      burstAnim = { startTime: clock.getElapsedTime(), nodeId, meshPos: meshPos.clone(), phase: 'expand' };
    };

    const onClickRay = e => {
      if (Math.abs(e.clientX-mouseDownPos.x)>6||Math.abs(e.clientY-mouseDownPos.y)>6) return;
      if (burstAnim) return; // already animating
      const rect = el.getBoundingClientRect();
      mouse.x = ((e.clientX-rect.left)/rect.width)*2-1;
      mouse.y = -((e.clientY-rect.top)/rect.height)*2+1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(meshes);
      if (hits.length) triggerClickBurst(hits[0].object.userData.id, hits[0].object.position);
    };
    const onTapRay = e => {
      const t = e.changedTouches?.[0]; if(!t) return;
      if (burstAnim) return;
      const rect = el.getBoundingClientRect();
      mouse.x = ((t.clientX-rect.left)/rect.width)*2-1;
      mouse.y = -((t.clientY-rect.top)/rect.height)*2+1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(meshes);
      if (hits.length) triggerClickBurst(hits[0].object.userData.id, hits[0].object.position);
    };

    el.addEventListener('mousedown', onDown);
    el.addEventListener('mouseup', onUp);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mousemove', onHover);
    el.addEventListener('wheel', onWheel, { passive: true });
    el.addEventListener('click', onClickRay);
    el.addEventListener('touchstart', e=>onDown(e), { passive:true });
    el.addEventListener('touchend', e=>{ onUp(); onTapRay(e); });
    el.addEventListener('touchmove', e=>onMove(e), { passive:true });

    const onResize = () => {
      const W=el.clientWidth, H=el.clientHeight;
      const a=W/H;
      const hs = camera.right;
      camera.left=-hs*a; camera.right=hs*a;
      camera.top=hs; camera.bottom=-hs;
      camera.updateProjectionMatrix();
      renderer.setSize(W,H);
    };
    window.addEventListener('resize', onResize);

    // ── Animate
    const clock = new THREE.Clock();
    let animId;
    let introProgress = 0;
    const INTRO_DURATION = 2.2;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Intro zoom (orthographic: zoom in from large frustum)
      if (introProgress < 1) {
        introProgress = Math.min(1, introProgress + (0.016 / INTRO_DURATION));
        const ease = 1 - Math.pow(1-introProgress, 3);
        const startHS = 50, endHS = frustumSize / 2;
        const hs = startHS + (endHS - startHS) * ease;
        const a = el.clientWidth / el.clientHeight;
        camera.left=-hs*a; camera.right=hs*a;
        camera.top=hs; camera.bottom=-hs;
        camera.updateProjectionMatrix();
      }

      // Auto rotate (pause when hovering a node)
      if (hoveredIdx === -1 && (!userInteracted || !isDown)) {
        autoRotateY += 0.0006;
      }

      updateCamera();

      // Node animations — rotate all EXCEPT hovered
      meshes.forEach((m, i) => {
        if (i !== hoveredIdx) {
          m.rotation.y += 0.006;
          m.rotation.x += 0.003;
        }
        if (m.userData.wire) {
          m.userData.wire.rotation.copy(m.rotation);
          m.userData.wire.position.copy(m.position);
        }
        // Float
        const bp = m.userData.basePos;
        m.position.y = bp[1] + Math.sin(t * 0.4 + i * 0.9) * 0.3;
      });

      // ── Hover burst — pulsing hairlines, 3-4 cycles/sec, reduced length
      if (hoveredIdx !== -1 && !burstAnim) {
        const m = meshes[hoveredIdx];
        if (inkBurstMesh) { scene.remove(inkBurstMesh); inkBurstMesh = null; }
        const seed = hoveredIdx * 137.5;
        const seededRand = (offset) => Math.abs(Math.sin(seed + offset) * 43758.5453) % 1;
        // Pulse: 0.8 cycles/sec, per-line phase offset for organic independent breathing
        const points = [];
        const count = 10 + Math.floor(seededRand(0) * 6);
        for (let i = 0; i < count; i++) {
          const angle = seededRand(i * 3 + 1) * Math.PI * 2;
          const linePhase = seededRand(i * 3 + 5) * Math.PI * 2; // unique phase per line
          const pulse = 0.6 + 0.4 * (0.5 + 0.5 * Math.sin(t * Math.PI * 2 * 0.8 + linePhase));
          const baseLen = (1.8 + seededRand(i * 3 + 2) * 1.0) * pulse;
          const midLen = baseLen * (0.4 + seededRand(i * 3 + 3) * 0.25);
          const jagAngle = angle + (seededRand(i * 3 + 4) - 0.5) * 0.25;
          points.push(m.position.clone());
          points.push(new THREE.Vector3(
            m.position.x + Math.cos(jagAngle) * midLen,
            m.position.y + Math.sin(jagAngle) * midLen,
            m.position.z
          ));
          points.push(new THREE.Vector3(
            m.position.x + Math.cos(jagAngle) * midLen,
            m.position.y + Math.sin(jagAngle) * midLen,
            m.position.z
          ));
          points.push(new THREE.Vector3(
            m.position.x + Math.cos(angle) * baseLen,
            m.position.y + Math.sin(angle) * baseLen,
            m.position.z
          ));
        }
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({ color: 0x1a1612, transparent: true, opacity: 0.75 });
        inkBurstMesh = new THREE.LineSegments(geo, mat);
        scene.add(inkBurstMesh);
      }

      // ── Click burst animation — expand outward, shift to white, fade out, then open panel
      if (burstAnim) {
        const elapsed = clock.getElapsedTime() - burstAnim.startTime;
        const EXPAND_DUR = 0.28; // seconds to expand
        const FADE_DUR   = 0.22; // seconds to fade after expand

        if (inkBurstMesh) { scene.remove(inkBurstMesh); inkBurstMesh = null; }

        const pos = burstAnim.meshPos;
        const seed = 999;
        const seededRand = (offset) => Math.abs(Math.sin(seed + offset) * 43758.5453) % 1;
        const count = 14;
        const points = [];

        let lenScale, opacity, color;

        if (elapsed < EXPAND_DUR) {
          // Phase 1: expand outward, ink → white
          const p = elapsed / EXPAND_DUR; // 0→1
          const eased = 1 - Math.pow(1 - p, 2); // ease out
          lenScale = 1.5 + eased * 5.0; // expand from 1.5 to 6.5
          opacity = 0.75 + eased * 0.25; // 0.75 → 1.0
          // Lerp ink color to white
          const inkR = 0x1a/255, inkG = 0x16/255, inkB = 0x12/255;
          const r = Math.round((inkR + (1 - inkR) * eased) * 255);
          const g = Math.round((inkG + (1 - inkG) * eased) * 255);
          const b = Math.round((inkB + (1 - inkB) * eased) * 255);
          color = (r << 16) | (g << 8) | b;
          burstAnim.phase = 'expand';
        } else {
          // Phase 2: hold expanded, fade to zero
          const p = (elapsed - EXPAND_DUR) / FADE_DUR; // 0→1
          lenScale = 6.5;
          opacity = Math.max(0, 1.0 - p);
          color = 0xffffff;
          burstAnim.phase = 'fade';

          // Fire panel open at midpoint of fade
          if (p >= 0.4 && !burstAnim.fired) {
            burstAnim.fired = true;
            onNodeClick(burstAnim.nodeId);
          }
        }

        for (let i = 0; i < count; i++) {
          const angle = seededRand(i * 3 + 1) * Math.PI * 2;
          const baseLen = (1.8 + seededRand(i * 3 + 2) * 1.0) * lenScale;
          const midLen = baseLen * (0.4 + seededRand(i * 3 + 3) * 0.25);
          const jagAngle = angle + (seededRand(i * 3 + 4) - 0.5) * 0.15;
          points.push(pos.clone());
          points.push(new THREE.Vector3(pos.x + Math.cos(jagAngle)*midLen, pos.y + Math.sin(jagAngle)*midLen, pos.z));
          points.push(new THREE.Vector3(pos.x + Math.cos(jagAngle)*midLen, pos.y + Math.sin(jagAngle)*midLen, pos.z));
          points.push(new THREE.Vector3(pos.x + Math.cos(angle)*baseLen,   pos.y + Math.sin(angle)*baseLen,   pos.z));
        }

        if (opacity > 0) {
          const geo = new THREE.BufferGeometry().setFromPoints(points);
          const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
          inkBurstMesh = new THREE.LineSegments(geo, mat);
          scene.add(inkBurstMesh);
        }

        // Animation complete
        if (elapsed >= EXPAND_DUR + FADE_DUR) {
          if (inkBurstMesh) { scene.remove(inkBurstMesh); inkBurstMesh = null; }
          burstAnim = null;
        }
      }

      // Labels — offset above each node, soft-fade when occluded by another node
      labelDivs.forEach(({ div, mesh }, i) => {
        const pos = mesh.position.clone().project(camera);
        if (pos.z >= 1) { div.style.display='none'; return; }
        div.style.display='block';
        const x = (pos.x * 0.5 + 0.5) * el.clientWidth;
        const y = (-pos.y * 0.5 + 0.5) * el.clientHeight;
        const nodeScreenSize = NODES[i].scale * 48;
        div.style.left = (x - div.offsetWidth/2) + 'px';
        div.style.top  = (y - nodeScreenSize - 10) + 'px';

        // Occlusion check — ray from camera to this node, test against other meshes
        const dir = mesh.position.clone().sub(camera.position).normalize();
        const dist = mesh.position.distanceTo(camera.position);
        raycaster.set(camera.position, dir);
        const otherMeshes = meshes.filter((_, j) => j !== i);
        const hits = raycaster.intersectObjects(otherMeshes);
        const occluded = hits.length > 0 && hits[0].distance < dist - 0.5;

        // Soft fade: occluded → 0.08, hovered → 1.0, normal → 0.65
        div.style.opacity = occluded ? '0.08' : i === hoveredIdx ? '1' : '0.65';

        // Sub-label
        const { sub } = nodeIndexLabels[i];
        sub.style.left = (x - sub.offsetWidth/2) + 'px';
        sub.style.top  = (y - nodeScreenSize + 4) + 'px';
        sub.style.opacity = (!occluded && i === hoveredIdx) ? '1' : '0';
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      labelDivs.forEach(({ div }) => div.remove());
      nodeIndexLabels.forEach(({ sub }) => sub.remove());
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
        <div style={{textAlign:'center'}}><div style={{fontFamily:"'Playfair Display',serif",fontSize:'2.5rem',color:'var(--ink)',fontWeight:700}}>{hero.years}</div><div style={{fontSize:'.75rem',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'2px',fontFamily:'Montserrat,sans-serif'}}>Years Experience</div></div>
        <div style={{width:'1px',background:'var(--bdr)'}}/>
        <div style={{textAlign:'center'}}><div style={{fontFamily:"'Playfair Display',serif",fontSize:'2.5rem',color:'var(--ink)',fontWeight:700}}>{hero.projects}</div><div style={{fontSize:'.75rem',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'2px',fontFamily:'Montserrat,sans-serif'}}>Projects Completed</div></div>
      </div>
    </>
  );
  if (id==="featured") return (
    <div className="gp-grid">
      {featured.map(p=>(
        <div key={p._id} className="gp-card">
          <div style={{position:'relative',paddingBottom:'56.25%',background:'#ccc',borderRadius:'2px',overflow:'hidden',marginBottom:'.75rem',border:'1px solid var(--bdr)'}}>
            {activeVid===p._id
              ? <iframe style={{position:'absolute',top:0,left:0,width:'100%',height:'100%'}} src={p.embed+"?autoplay=1"} title={p.title} frameBorder="0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowFullScreen/>
              : <div className="gp-feat-thumb-wrap" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',cursor:'pointer'}} onClick={()=>setActiveVid(p._id)}>
                  <img src={T(p.vid)} alt={p.title} className="gp-feat-thumb-img" style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e=>{e.target.style.display='none';e.target.parentElement.style.background='#ccc';}}/>
                  <div className="gp-feat-overlay"><SmPlayIco/></div>
                </div>
            }
          </div>
          <div className="gp-card-title">{p.title}</div>
          <div className="gp-card-sub">{p.type} · {p.year}</div>
          {p.award&&<div className="gp-card-desc" style={{color:'var(--ink3)',marginTop:'.3rem',fontStyle:'italic'}}>✓ {p.award}</div>}
        </div>
      ))}
    </div>
  );
  if (id==="showreel") return (
    <div className="gp-vid-grid">
      {showreel.map(v=>(
        <div key={v.id} className="gp-vid" onClick={()=>window.open(v.url,"_blank")}>
          <img src={T(v.vid)} alt={v.title} onError={e=>{e.target.style.display='none';e.target.parentElement.style.background='#ccc';}}/>
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
          <div style={{color:'var(--ink3)',fontSize:'.88rem',marginBottom:'.4rem'}}>{e.company}</div>
          <div className="gp-card-desc">{e.desc}</div>
          {e.award&&<div style={{marginTop:'.5rem',fontSize:'.82rem',color:'var(--ink3)',fontStyle:'italic'}}>✓ {e.award}</div>}
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
      {siteData.gallery.map((g,i)=>(
        <div key={g._id} className="gp-gal-item" onClick={()=>lightboxSet({url:g.imageUrl,caption:g.caption,index:i,all:siteData.gallery})}>
          <img src={g.imageUrl} alt={g.caption||"Gallery"} onError={e=>{e.target.parentElement.style.background='#ccc';e.target.style.display='none';}}/>
        </div>
      ))}
    </div>
  );
  if (id==="random") return (
    <>
      <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1rem'}}>
        <img src={GS_LOGO} alt="GameSlime" style={{width:48,height:48,borderRadius:'2px',border:'1px solid var(--bdr)',filter:'grayscale(10%)'}}/>
        <div><div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,color:'var(--ink)',fontSize:'1.1rem'}}>GameSlime</div><div style={{fontSize:'.85rem',color:'var(--ink3)'}}>When I'm not behind the camera, I'm gaming.</div></div>
      </div>
      {gsLoading&&<p style={{color:'var(--muted)',fontFamily:'Montserrat,sans-serif',fontSize:'.85rem',letterSpacing:'1px',textTransform:'uppercase'}}>Loading videos…</p>}
      {!gsLoading&&<div className="gp-vid-grid">{gsVideos.map(v=><div key={v.id} className="gp-vid" onClick={()=>window.open(v.url,"_blank")}><img src={v.thumbnail} alt={v.title} onError={e=>{e.target.style.display='none';e.target.parentElement.style.background='#ccc';}} /><div className="gp-vid-info"><div className="gp-vid-title">{v.title}</div><div className="gp-vid-date">{v.published}</div></div></div>)}</div>}
      <div style={{textAlign:'center',marginTop:'1.5rem'}}><a href="https://www.youtube.com/@GameSlimeOG" target="_blank" rel="noopener noreferrer" style={{color:'var(--ink)',fontFamily:'Montserrat,sans-serif',fontSize:'.8rem',fontWeight:700,textDecoration:'none',border:'1px solid var(--bdr)',padding:'.5rem 1.25rem',borderRadius:'2px',display:'inline-block',textTransform:'uppercase',letterSpacing:'1px'}}>Visit Channel →</a></div>
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
  // lightbox = { url, caption, index, all } | null
  const [galPage, setGalPage] = useState(0);
  const GAL_PER_PAGE = 9;
  const [gsVideos, setGsVideos] = useState([]);
  const [gsLoading, setGsLoading] = useState(true);
  const [gsError, setGsError] = useState(false);
  const [siteData, setSiteData] = useState({...FALLBACK, featured: FEATURED_FALLBACK});
  const [dataLoading, setDataLoading] = useState(true);

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
          <div onClick={()=>setLightbox(null)} style={{position:"fixed",inset:0,zIndex:999,background:"rgba(26,22,18,.92)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"zoom-out",padding:"1rem"}}>
            {/* Prev arrow */}
            {lightbox.all&&lightbox.index>0&&(
              <button onClick={e=>{e.stopPropagation();const i=lightbox.index-1;const g=lightbox.all[i];setLightbox({url:g.imageUrl,caption:g.caption,index:i,all:lightbox.all});}} style={{position:"fixed",left:"1.5rem",top:"50%",transform:"translateY(-50%)",background:"rgba(240,236,228,.06)",border:"1px solid rgba(240,236,228,.15)",color:"#f0ece4",width:"2.5rem",height:"2.5rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Montserrat',sans-serif",fontSize:".7rem",fontWeight:700,letterSpacing:"1px"}}>←</button>
            )}
            {/* Image + caption */}
            <div style={{position:"relative",maxWidth:"90vw",maxHeight:"90vh",display:"flex",flexDirection:"column"}} onClick={e=>e.stopPropagation()}>
              {/* Index label */}
              {lightbox.all&&(
                <div style={{position:"absolute",top:"-1.75rem",right:0,fontFamily:"'Montserrat',sans-serif",fontSize:"9px",fontWeight:700,letterSpacing:"3px",textTransform:"uppercase",color:"rgba(240,236,228,.4)"}}>
                  IMG · {String(lightbox.index+1).padStart(2,'0')} / {String(lightbox.all.length).padStart(2,'0')}
                </div>
              )}
              <img src={lightbox.url} alt={lightbox.caption||"Gallery"} style={{maxWidth:"90vw",maxHeight:"80vh",objectFit:"contain",display:"block",border:"1px solid rgba(240,236,228,.1)"}} onError={e=>{e.target.style.display="none";}}/>
              {lightbox.caption&&(
                <div style={{background:"rgba(26,22,18,.8)",padding:".6rem 1rem",borderTop:"1px solid rgba(240,236,228,.1)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontFamily:"'Montserrat',sans-serif",fontSize:".72rem",fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:"rgba(240,236,228,.65)"}}>{lightbox.caption}</span>
                </div>
              )}
            </div>
            {/* Next arrow */}
            {lightbox.all&&lightbox.index<lightbox.all.length-1&&(
              <button onClick={e=>{e.stopPropagation();const i=lightbox.index+1;const g=lightbox.all[i];setLightbox({url:g.imageUrl,caption:g.caption,index:i,all:lightbox.all});}} style={{position:"fixed",right:"1.5rem",top:"50%",transform:"translateY(-50%)",background:"rgba(240,236,228,.06)",border:"1px solid rgba(240,236,228,.15)",color:"#f0ece4",width:"2.5rem",height:"2.5rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Montserrat',sans-serif",fontSize:".7rem",fontWeight:700,letterSpacing:"1px"}}>→</button>
            )}
            {/* Close */}
            <button onClick={()=>setLightbox(null)} style={{position:"fixed",top:"1.5rem",right:"1.5rem",background:"rgba(240,236,228,.06)",border:"1px solid rgba(240,236,228,.15)",color:"#f0ece4",fontSize:"1.1rem",width:"2.5rem",height:"2.5rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
          </div>
        )}

        {/* NAV */}
        <nav>
          <span className="logo">SS</span>
          {!isImmersive&&(
            <div className="classic-links">
              {["about","featured","showreel","experience","skills","achievements","gallery","random","contact"].map(s=>(
                <button key={s} onClick={()=>go(s)}>{s==="random"?"GameSlime":s[0].toUpperCase()+s.slice(1)}</button>
              ))}
            </div>
          )}
          <div style={{display:'flex',alignItems:'center',gap:'.75rem'}}>
            {!isImmersive && <MobileNav go={go}/>}
            <a href={`${process.env.PUBLIC_URL}/Sunny_Sawrav_Resume.pdf`} download className="cv-btn">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>CV
            </a>
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
            <div className="hint">Drag to explore · Click a node to open</div>
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
            <div className="classic-mode">
            <section className="hero">
              <div className="hero-in">
                <div className="sys-line" style={{justifyContent:"center",marginBottom:"1.5rem"}}>
                  <div className="sys-bar" style={{maxWidth:"60px"}}/>
                  <span className="sys-label">PROFILE · CREATIVE · DIRECTOR · SYS·001</span>
                  <div className="sys-bar" style={{maxWidth:"60px"}}/>
                </div>
                <div className="badge"><FilmIco/><span>{hero.years} Years of Excellence</span></div>
                <h1 className="hname">{hero.name}</h1>
                <p className="htag">{hero.tagline}</p>
                <p className="hdesc">{hero.description}</p>
                <div className="stats">
                  <div className="stat-cell"><div className="sn">{hero.years}</div><div className="sl">Years Experience</div></div>
                  <div className="sdiv"/>
                  <div className="stat-cell"><div className="sn">{hero.projects}</div><div className="sl">Projects Completed</div></div>
                </div>
                <div className="ctas">
                  <button className="bp" onClick={()=>go("contact")}>Get In Touch</button>
                  <button className="bs" onClick={()=>go("featured")}>View Work</button>
                </div>
              </div>
            </section>

            <section id="about" className="sec alt">
              <div className="inn">
                <div className="shd">
                  <div className="sys-line"><div className="sys-dot"/><span className="sys-label">Section · 01 · Identity Profile</span><div className="sys-bar"/></div>
                  <h2 className="stitle">About Me</h2><div className="ul"/>
                </div>
                <div className="about-wrap">
                  <p className="abio">{hero.bio}</p>
                  <p className="apersonal">{hero.personal}</p>
                  <div className="about-stats">
                    <div className="about-stat"><div className="about-stat-n">{hero.years}</div><div className="about-stat-l">Years</div></div>
                    <div className="about-stat"><div className="about-stat-n">{hero.projects}</div><div className="about-stat-l">Projects</div></div>
                  </div>
                </div>
              </div>
            </section>

            <section id="featured" className="sec">
              <div className="inn">
                <div className="shd">
                  <div className="sys-line"><div className="sys-dot"/><span className="sys-label">Section · 02 · Selected Works</span><div className="sys-bar"/></div>
                  <h2 className="stitle">Featured Projects</h2><div className="ul"/>
                </div>
                {dataLoading?<p style={{color:"var(--muted)",fontFamily:"Montserrat,sans-serif",fontSize:".82rem",letterSpacing:"1px",textTransform:"uppercase"}}>Loading…</p>:
                <div className="fg">{featured.map(p=>(
                  <div key={p._id} className="pc cm-wrap cm-wrap-b">
                    <div className="vw">
                      {activeVid===p._id
                        ?<iframe src={p.embed+"?autoplay=1"} title={p.title} frameBorder="0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowFullScreen/>
                        :<div className="tw" onClick={()=>setActiveVid(p._id)}>
                          <img src={T(p.vid)} alt={p.title} onError={e=>{e.target.style.display="none";e.target.parentElement.style.background="#1a1612";}}/>
                          <div className="pov"><div className="feat-play"><svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(240,236,228,.8)"><polygon points="5,3 19,12 5,21"/></svg></div></div>
                        </div>
                      }
                    </div>
                    <div className="pi">
                      <div className="pm"><span className="pt">{p.type}</span><span className="py">{p.year}</span></div>
                      <h3 className="pttl">{p.title}</h3>
                      <p className="pd">{p.desc}</p>
                      {p.award&&<div className="pr"><AwardIco s={14}/><span>{p.award}</span></div>}
                    </div>
                  </div>
                ))}</div>}
              </div>
            </section>

            <section id="showreel" className="sec alt">
              <div className="inn">
                <div className="shd">
                  <div className="sys-line"><div className="sys-dot"/><span className="sys-label">Section · 03 · Complete Showreel</span><div className="sys-bar"/></div>
                  <h2 className="stitle">Complete Showreel</h2><div className="ul"/>
                </div>
                <div className="sg">{showreel.map(v=>(
                  <div key={v.id} className="si" onClick={()=>window.open(v.url,"_blank")}>
                    <div className="siw"><img src={T(v.vid)} alt={v.title} onError={e=>{e.target.style.display="none";e.target.parentElement.style.background="#ccc";}}/><div className="sov"><ExtIco/></div></div>
                    <div className="sinf"><div className="sttl">{v.title}</div><div className="svw">{v.views} views</div></div>
                  </div>
                ))}</div>
              </div>
            </section>

            <section id="experience" className="sec">
              <div className="inn">
                <div className="shd">
                  <div className="sys-line"><div className="sys-dot"/><span className="sys-label">Section · 04 · Professional Record</span><div className="sys-bar"/></div>
                  <h2 className="stitle">Professional Journey</h2><div className="ul"/>
                </div>
                {dataLoading?<p style={{color:"var(--muted)",fontFamily:"Montserrat,sans-serif",fontSize:".82rem",letterSpacing:"1px",textTransform:"uppercase"}}>Loading…</p>:
                <div className="tl">{experience.map(e=>(
                  <div key={e._id} className="tli">
                    <div className="tlm"><BriefIco/></div>
                    <div className="tlc cm-wrap">
                      <div className="tlin">
                        <div className="tlp">{e.period}</div>
                        <h3 className="tlr">{e.role}</h3>
                        <h4 className="tlco">{e.company}</h4>
                        <p className="tld">{e.desc}</p>
                        {e.award&&<div className="tla"><ChkIco/><span>{e.award}</span></div>}
                      </div>
                    </div>
                  </div>
                ))}</div>}
              </div>
            </section>

            <section id="skills" className="sec alt">
              <div className="inn">
                <div className="shd">
                  <div className="sys-line"><div className="sys-dot"/><span className="sys-label">Section · 05 · Capabilities</span><div className="sys-bar"/></div>
                  <h2 className="stitle">Skills & Expertise</h2><div className="ul"/>
                </div>
                {dataLoading?<p style={{color:"var(--muted)",fontFamily:"Montserrat,sans-serif",fontSize:".82rem",letterSpacing:"1px",textTransform:"uppercase"}}>Loading…</p>:
                <div className="skg">{skills.map(s=>(
                  <div key={s._id} className="skc cm-wrap">
                    <div className="skh">{s.category}</div>
                    <div className="skt">{(s.tags||[]).map((t,i)=><span key={i} className="sktg">{t}</span>)}</div>
                  </div>
                ))}</div>}
              </div>
            </section>

            <section id="achievements" className="sec">
              <div className="inn">
                <div className="shd">
                  <div className="sys-line"><div className="sys-dot"/><span className="sys-label">Section · 06 · Recognition</span><div className="sys-bar"/></div>
                  <h2 className="stitle">Achievements & Recognition</h2><div className="ul"/>
                </div>
                {dataLoading?<p style={{color:"var(--muted)",fontFamily:"Montserrat,sans-serif",fontSize:".82rem",letterSpacing:"1px",textTransform:"uppercase"}}>Loading…</p>:
                <div className="ag">{achievements.map(a=>(
                  <div key={a._id} className="ac cm-wrap cm-wrap-b">
                    <AwardIco s={40}/>
                    <h3 className="at">{a.title}</h3>
                    <p className="ad">{a.desc}</p>
                    <span className="ay">{a.year}</span>
                  </div>
                ))}</div>}
              </div>
            </section>

            <section id="gallery" className="sec alt">
              <div className="inn">
                <div className="shd">
                  <div className="sys-line"><div className="sys-dot"/><span className="sys-label">Section · 07 · Personal Gallery</span><div className="sys-bar"/></div>
                  <h2 className="stitle">Personal Gallery</h2><div className="ul"/>
                </div>
                {dataLoading?<p style={{color:"var(--muted)",fontFamily:"Montserrat,sans-serif",fontSize:".82rem",letterSpacing:"1px",textTransform:"uppercase"}}>Loading…</p>:(()=>{
                  const totalPages = Math.ceil(gallery.length / GAL_PER_PAGE);
                  const pageItems = gallery.slice(galPage * GAL_PER_PAGE, (galPage+1) * GAL_PER_PAGE);
                  const fillPct = totalPages > 1 ? ((galPage+1)/totalPages*100) : 100;
                  return (
                    <>
                      <div className="gal-grid">{pageItems.map((g,i)=>(
                        <div key={g._id} className="gal-item" onClick={()=>setLightbox({url:g.imageUrl,caption:g.caption,index:galPage*GAL_PER_PAGE+i,all:gallery})}>
                          <img src={g.imageUrl} alt={g.caption||"Gallery"} onError={e=>{e.target.parentElement.style.background="#ccc";e.target.style.display="none";}}/>
                        </div>
                      ))}</div>
                      {totalPages > 1 && (
                        <div className="gal-pagination">
                          <button className="gal-pg-btn" disabled={galPage===0} onClick={()=>setGalPage(p=>p-1)}>← Prev</button>
                          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:".5rem"}}>
                            <span className="gal-pg-count">{String(galPage+1).padStart(2,'0')} / {String(totalPages).padStart(2,'0')}</span>
                            <div className="gal-pg-bar"><div className="gal-pg-bar-fill" style={{width:`${fillPct}%`}}/></div>
                          </div>
                          <button className="gal-pg-btn" disabled={galPage===totalPages-1} onClick={()=>setGalPage(p=>p+1)}>Next →</button>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </section>

            <section id="random" className="sec">
              <div className="inn">
                <div className="shd">
                  <div className="sys-line"><div className="sys-dot"/><span className="sys-label">Section · 08 · Random Things</span><div className="sys-bar"/></div>
                  <h2 className="stitle">Random Things</h2><div className="ul"/>
                </div>
                <div className="gs-intro">
                  <div style={{display:"flex",alignItems:"center",gap:"1rem",marginBottom:".6rem"}}>
                    <img src={GS_LOGO} alt="GameSlime logo" style={{width:48,height:48,border:"1px solid var(--bdr)",objectFit:"cover",filter:"grayscale(10%)"}}/>
                    <span className="gs-label">GameSlime</span>
                  </div>
                  <p className="gs-desc">When I'm not behind the camera or in the edit suite, I'm gaming.</p>
                </div>
                {gsLoading&&<p style={{color:"var(--muted)",marginTop:"2rem",fontFamily:"Montserrat,sans-serif",fontSize:".82rem",letterSpacing:"1px",textTransform:"uppercase"}}>Loading latest videos…</p>}
                {gsError&&<p style={{color:"var(--muted)",marginTop:"2rem"}}>Couldn't load videos. <a href="https://www.youtube.com/@GameSlimeOG" target="_blank" rel="noopener noreferrer" style={{color:"var(--ink)"}}>Visit the channel →</a></p>}
                {!gsLoading&&!gsError&&<div className="gs-grid">{gsVideos.map(v=>(
                  <div key={v.id} className="gs-card cm-wrap" onClick={()=>window.open(v.url,"_blank")}>
                    <div className="gs-thumb"><img src={v.thumbnail} alt={v.title} onError={e=>{e.target.style.display="none";e.target.parentElement.style.background="#ccc";}}/><div className="gs-ov"><SmPlayIco/></div></div>
                    <div className="gs-info"><div className="gs-ttl">{v.title}</div><div className="gs-dur">{v.published}</div></div>
                  </div>
                ))}</div>}
                <div style={{marginTop:"2rem"}}><a href="https://www.youtube.com/@GameSlimeOG" target="_blank" rel="noopener noreferrer" className="cv-btn" style={{display:"inline-flex"}}>Visit GameSlime Channel →</a></div>
              </div>
            </section>

            <section id="contact" className="sec alt">
              <div className="inn">
                <div className="shd">
                  <div className="sys-line"><div className="sys-dot"/><span className="sys-label">Section · 09 · Contact</span><div className="sys-bar"/></div>
                  <h2 className="stitle">Let's Create Together</h2><div className="ul"/>
                </div>
                <div className="cw">
                  <p className="ct">Have a project in mind? Let's discuss how we can bring your creative vision to life.</p>
                  <div className="cl">
                    <div className="ci"><PhoneIco/><a href={`tel:${contact.phone}`}>{contact.phone}</a></div>
                    <div className="ci"><MailIco/><a href={`mailto:${contact.email}`}>{contact.email}</a></div>
                    <div className="ci"><LiIco/><a href={contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></div>
                    <div className="ci"><IgIco/><a href={contact.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></div>
                    <div className="ci"><FbIco/><a href={contact.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></div>
                    <div className="ci"><TwIco/><a href={contact.twitter} target="_blank" rel="noopener noreferrer">Twitter</a></div>
                  </div>
                </div>
              </div>
            </section>
            <footer><p className="ft">© 2025 {hero.name} · All Rights Reserved</p><p className="ftag">Crafting stories, one frame at a time.</p></footer>
            </div>
          </>
        )}
      </div>
    </>
  );
}