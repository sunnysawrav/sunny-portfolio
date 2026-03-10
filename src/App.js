import { useState, useEffect } from "react";
import client from './sanityClient';

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const YT_API_KEY = process.env.REACT_APP_YT_API_KEY;
const CHANNEL_ID = "UCGTyRlvoOhCJBqwFvhlZerw";
const GS_LOGO    = "https://yt3.googleusercontent.com/uPWh2l6-vb0yIfwQQnLglTdyH8KgvvZ6hpLvrESemcnm6-l_-WgomL1EHwKRysCf-EYRcSrFHA=s160-c-k-c0x00ffffff-no-rj";

// ── YOUTUBE API ───────────────────────────────────────────────────────────────
function decodeHTML(str) {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}

async function fetchChannelData(channelId) {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${YT_API_KEY}&channelId=${channelId}&part=snippet&order=date&maxResults=4&type=video`
  );
  const data = await res.json();
  return (data.items || []).map(item => ({
    id: item.id.videoId,
    title: decodeHTML(item.snippet.title),
    thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    published: new Date(item.snippet.publishedAt).toLocaleDateString("en-IN", { year:"numeric", month:"short", day:"numeric" })
  }));
}

// ── FALLBACK DATA ─────────────────────────────────────────────────────────────
const FALLBACK = {
  hero: {
    name: "Sunny Sawrav",
    tagline: "Film Maker • Creative Director • Post Production Supervisor • AI Strategist",
    description: "Ready to bring creative visions to life through innovative filmmaking and AI-enhanced solutions.",
    years: "15+",
    projects: "100+",
    bio: "With over 15 years of experience in the entertainment industry, I specialize in bringing creative visions to life through innovative filmmaking, post-production excellence, and strategic creative direction.",
    personal: "There are many things that I'd wish I could change but why bother? Life has led you and I to something really beautiful, hasn't it? Live / Play."
  },
  featured: [],
  experience: [],
  skills: [],
  achievements: [],
  gallery: [],
};

const showreel = [
  { id:1,  title:"A lullaby for the missing",            vid:"AsvbWOmvBbg", url:"https://www.youtube.com/watch?v=AsvbWOmvBbg", views:"1M" },
  { id:2,  title:"Follow Traffic Rules - Bajaj Avenger", vid:"rbUjgmJ0lFM", url:"https://www.youtube.com/watch?v=rbUjgmJ0lFM", views:"533" },
  { id:3,  title:"South Indian By Nature",               vid:"oTX_5xOiW6A", url:"https://www.youtube.com/watch?v=oTX_5xOiW6A", views:"29" },
  { id:4,  title:"3Devi - Final Trailer",                vid:"DeNuCn4ATy8", url:"https://www.youtube.com/watch?v=DeNuCn4ATy8", views:"872K" },
  { id:5,  title:"Vijay Karnataka - Protest",            vid:"jrOmAW1aDPY", url:"https://www.youtube.com/watch?v=jrOmAW1aDPY", views:"2.1K" },
  { id:6,  title:"Heretic - Thoughts",                   vid:"RZREe_vEH1g", url:"https://www.youtube.com/watch?v=RZREe_vEH1g", views:"91K" },
  { id:7,  title:"Vijay Karnataka - Cricket",            vid:"t2gc5ZWc_gA", url:"https://www.youtube.com/watch?v=t2gc5ZWc_gA", views:"879" },
  { id:8,  title:"A Love Song for Goddesses",            vid:"KIqpvVtIWNA", url:"https://www.youtube.com/watch?v=KIqpvVtIWNA", views:"1M" },
  { id:9,  title:"Vijay Karnataka - Water",              vid:"DHAPY_DNVEY", url:"https://www.youtube.com/watch?v=DHAPY_DNVEY", views:"628" },
  { id:10, title:"Cloudnine Hospitals",                  vid:"vnD4GBGzpiA", url:"https://www.youtube.com/watch?v=vnD4GBGzpiA", views:"17K" },
  { id:11, title:"Random - A short",                     vid:"9gkbJ4QmAyU", url:"https://www.youtube.com/watch?v=9gkbJ4QmAyU", views:"192" },
  { id:12, title:"Asirvad Microfinance - 42Gears",       vid:"ztsbIMYjhx0", url:"https://www.youtube.com/watch?v=ztsbIMYjhx0", views:"5.1K" },
];

const contact = {
  email:"sunnysawrav@gmail.com",
  phone:"+91-7892378521",
  linkedin:"https://www.linkedin.com/in/sunnysawrav/",
  instagram:"https://www.instagram.com/sunnysawrav/",
  facebook:"http://www.facebook.com/sunnysawrav",
  twitter:"http://www.twitter.com/helldoom"
};

// ── ICONS ─────────────────────────────────────────────────────────────────────
const Ico = ({d,size=20})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>;
const FilmIco   = ()=><Ico size={16} d="M2 2h20v20H2zM7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 7h5M17 17h5"/>;
const AwardIco  = ({s=20})=><Ico size={s} d="M12 15l-2 5 2-1 2 1-2-5zM12 2a7 7 0 1 0 0 14A7 7 0 0 0 12 2z"/>;
const BriefIco  = ()=><Ico size={18} d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>;
const MailIco   = ()=><Ico size={22} d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6"/>;
const PhoneIco  = ()=><Ico size={22} d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>;
const LiIco     = ()=><Ico size={22} d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>;
const IgIco     = ()=><Ico size={22} d="M4 4m0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01"/>;
const FbIco     = ()=><Ico size={22} d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>;
const TwIco     = ()=><Ico size={22} d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>;
const ExtIco    = ()=><Ico size={26} d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>;
const ChkIco    = ()=><Ico size={16} d="M20 6L9 17l-5-5"/>;
const PlayIco   = ()=><svg width="56" height="56" viewBox="0 0 24 24" fill="#d4a574" style={{filter:"drop-shadow(0 4px 8px rgba(0,0,0,.5))"}}><polygon points="5,3 19,12 5,21"/></svg>;
const SmPlayIco = ()=><svg width="36" height="36" viewBox="0 0 24 24" fill="#d4a574" style={{filter:"drop-shadow(0 2px 4px rgba(0,0,0,.5))"}}><polygon points="5,3 19,12 5,21"/></svg>;

// ── CSS ───────────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Montserrat:wght@400;500;600;700&family=Lato:wght@300;400;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{--bg:#0a0a0a;--bg2:#1a1a1a;--gold:#d4a574;--gold-dk:#b8860b;--txt:#f5f5f5;--txt2:#d1d1d1;--muted:#999;--bdr:rgba(212,165,116,.2);}
body,html{background:var(--bg);color:var(--txt);font-family:'Lato',sans-serif;}
.w{background:var(--bg);overflow-x:hidden;}
nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(10,10,10,.9);backdrop-filter:blur(12px);border-bottom:1px solid var(--bdr);padding:.75rem 2rem;display:flex;justify-content:space-between;align-items:center;}
.logo{font-family:'Playfair Display',serif;font-size:1.3rem;color:var(--gold);letter-spacing:2px;}
.links{display:flex;gap:1.2rem;flex-wrap:wrap;}
.links button{background:none;border:none;color:var(--txt2);font-size:.75rem;font-family:'Montserrat',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:1px;cursor:pointer;transition:color .2s;}
.links button:hover{color:var(--gold);}
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
@keyframes fadeUp{from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);}}
@media(max-width:1024px){.tl::before{left:1.5rem;}.tli:nth-child(odd) .tlc,.tli:nth-child(even) .tlc{margin-left:4rem;margin-right:0;}.tlm{left:1.5rem;}}
@media(max-width:768px){.sec{padding:4rem 1.5rem;}.fg{grid-template-columns:1fr;}.skg,.ag,.gs-grid{grid-template-columns:1fr;}.ctas{flex-direction:column;width:100%;}.bp,.bs{width:100%;}.stats{gap:2rem;}.sn{font-size:2.5rem;}.links{gap:.75rem;}.links button{font-size:.68rem;}}
@media(max-width:480px){.links{display:none;}}
`;

// ── THUMBNAIL HELPER ──────────────────────────────────────────────────────────
const T = id => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

// ── COMPONENT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeVid, setActiveVid] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [gsVideos, setGsVideos] = useState([]);
  const [gsLoading, setGsLoading] = useState(true);
  const [gsError, setGsError] = useState(false);
  const [siteData, setSiteData] = useState(FALLBACK);
  const [dataLoading, setDataLoading] = useState(true);

  const go = id => document.getElementById(id)?.scrollIntoView({behavior:"smooth"});

  // Fetch Sanity data
  useEffect(() => {
    async function fetchAll() {
      try {
        const [hero, featured, experience, skills, achievements, gallery] = await Promise.all([
          client.fetch(`*[_type == "hero"][0]`),
          client.fetch(`*[_type == "featured"] | order(order asc)`),
          client.fetch(`*[_type == "experience"] | order(order asc)`),
          client.fetch(`*[_type == "skills"] | order(order asc)`),
          client.fetch(`*[_type == "achievement"] | order(order asc)`),
          client.fetch(`*[_type == "gallery"] | order(order asc){
            _id, caption, order,
            "imageUrl": coalesce(imageUrl, image.asset->url)
          }`),
        ]);
        setSiteData({
          hero: hero || FALLBACK.hero,
          featured: featured || [],
          experience: experience || [],
          skills: skills || [],
          achievements: achievements || [],
          gallery: gallery || [],
        });
      } catch (err) {
        console.error('Sanity fetch error:', err);
      } finally {
        setDataLoading(false);
      }
    }
    fetchAll();
  }, []);

  // Fetch GameSlime YouTube data
  useEffect(() => {
    fetchChannelData(CHANNEL_ID)
      .then(videos => { setGsVideos(videos); setGsLoading(false); })
      .catch(() => { setGsError(true); setGsLoading(false); });
  }, []);

  const { hero, featured, experience, skills, achievements, gallery } = siteData;

  return (
    <>
      <style>{css}</style>
      <div className="w">

        {/* LIGHTBOX */}
        {lightbox && (
          <div onClick={()=>setLightbox(null)} style={{position:"fixed",inset:0,zIndex:999,background:"rgba(0,0,0,.92)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"zoom-out",padding:"1rem"}}>
            <img src={lightbox} alt="Gallery full view" style={{maxWidth:"95vw",maxHeight:"95vh",objectFit:"contain",borderRadius:"8px",boxShadow:"0 0 60px rgba(0,0,0,.8)"}} onClick={e=>e.stopPropagation()}/>
            <button onClick={()=>setLightbox(null)} style={{position:"fixed",top:"1.5rem",right:"1.5rem",background:"rgba(212,165,116,.15)",border:"1px solid rgba(212,165,116,.4)",color:"#d4a574",fontSize:"1.5rem",width:"2.5rem",height:"2.5rem",borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}>×</button>
          </div>
        )}

        {/* NAV */}
        <nav>
          <span className="logo">SS</span>
          <div className="links">
            {["about","featured","showreel","experience","skills","achievements","gallery","random","contact"].map(s=>(
              <button key={s} onClick={()=>go(s)}>{s[0].toUpperCase()+s.slice(1)}</button>
            ))}
          </div>
        </nav>

        {/* HERO */}
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

        {/* ABOUT */}
        <section id="about" className="sec alt">
          <div className="inn">
            <div className="shd"><h2 className="stitle">About Me</h2><div className="ul"/></div>
            <div className="about-wrap">
              <p className="abio">{hero.bio}</p>
              <p className="apersonal">{hero.personal}</p>
            </div>
          </div>
        </section>

        {/* FEATURED */}
        <section id="featured" className="sec">
          <div className="inn">
            <div className="shd"><h2 className="stitle">Featured Projects</h2><div className="ul"/></div>
            {dataLoading ? (
              <p style={{textAlign:"center",color:"var(--muted)"}}>Loading projects…</p>
            ) : (
              <div className="fg">
                {featured.map(p=>(
                  <div key={p._id} className="pc">
                    <div className="vw">
                      {activeVid===p._id
                        ? <iframe src={p.embed+"?autoplay=1"} title={p.title} frameBorder="0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowFullScreen/>
                        : <div className="tw" onClick={()=>setActiveVid(p._id)}>
                            <img src={T(p.vid)} alt={p.title} onError={e=>{e.target.style.display="none";e.target.parentElement.style.background="linear-gradient(135deg,#1a1a1a,#2a1a1a)";}}/>
                            <div className="pov"><PlayIco/></div>
                          </div>
                      }
                    </div>
                    <div className="pi">
                      <div className="pm"><span className="pt">{p.type}</span><span className="py">{p.year}</span></div>
                      <h3 className="pttl">{p.title}</h3>
                      <p className="pd">{p.desc}</p>
                      {p.award&&<div className="pr"><AwardIco s={16}/><span>{p.award}</span></div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SHOWREEL */}
        <section id="showreel" className="sec alt">
          <div className="inn">
            <div className="shd"><h2 className="stitle">Complete Showreel</h2><div className="ul"/></div>
            <div className="sg">
              {showreel.map(v=>(
                <div key={v.id} className="si" onClick={()=>window.open(v.url,"_blank")}>
                  <div className="siw">
                    <img src={T(v.vid)} alt={v.title} onError={e=>{e.target.style.display="none";e.target.parentElement.style.background="linear-gradient(135deg,#1a1a1a,#2a1a1a)";}}/>
                    <div className="sov"><ExtIco/></div>
                  </div>
                  <div className="sinf">
                    <div className="sttl">{v.title}</div>
                    <div className="svw">{v.views} views</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience" className="sec">
          <div className="inn">
            <div className="shd"><h2 className="stitle">Professional Journey</h2><div className="ul"/></div>
            {dataLoading ? (
              <p style={{textAlign:"center",color:"var(--muted)"}}>Loading experience…</p>
            ) : (
              <div className="tl">
                {experience.map(e=>(
                  <div key={e._id} className="tli">
                    <div className="tlm"><BriefIco/></div>
                    <div className="tlc">
                      <div className="tlin">
                        <div className="tlp">{e.period}</div>
                        <h3 className="tlr">{e.role}</h3>
                        <h4 className="tlco">{e.company}</h4>
                        <p className="tld">{e.desc}</p>
                        {e.award&&<div className="tla"><ChkIco/><span>{e.award}</span></div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="sec alt">
          <div className="inn">
            <div className="shd"><h2 className="stitle">Skills & Expertise</h2><div className="ul"/></div>
            {dataLoading ? (
              <p style={{textAlign:"center",color:"var(--muted)"}}>Loading skills…</p>
            ) : (
              <div className="skg">
                {skills.map(s=>(
                  <div key={s._id} className="skc">
                    <div className="skh">{s.category}</div>
                    <div className="skt">{(s.tags||[]).map((t,i)=><span key={i} className="sktg">{t}</span>)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ACHIEVEMENTS */}
        <section id="achievements" className="sec">
          <div className="inn">
            <div className="shd"><h2 className="stitle">Achievements & Recognition</h2><div className="ul"/></div>
            {dataLoading ? (
              <p style={{textAlign:"center",color:"var(--muted)"}}>Loading achievements…</p>
            ) : (
              <div className="ag">
                {achievements.map(a=>(
                  <div key={a._id} className="ac">
                    <AwardIco s={48}/>
                    <h3 className="at">{a.title}</h3>
                    <p className="ad">{a.desc}</p>
                    <span className="ay">{a.year}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* PERSONAL GALLERY */}
        <section id="gallery" className="sec alt">
          <div className="inn">
            <div className="shd"><h2 className="stitle">Personal Gallery</h2><div className="ul"/></div>
            {dataLoading ? (
              <p style={{textAlign:"center",color:"var(--muted)"}}>Loading gallery…</p>
            ) : (
              <div className="gal-grid">
                {gallery.map(g=>(
                  <div key={g._id} className="gal-item" onClick={()=>setLightbox(g.imageUrl)}>
                    <img src={g.imageUrl} alt={g.caption||"Gallery"} onError={e=>{e.target.parentElement.style.background="linear-gradient(135deg,#1a1a1a,#2a1a1a)";e.target.style.display="none";}}/>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* RANDOM THINGS / GAMESLIME */}
        <section id="random" className="sec">
          <div className="inn">
            <div className="shd"><h2 className="stitle">Random Things</h2><div className="ul"/></div>
            <div className="gs-intro">
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"1rem",marginBottom:"0.75rem"}}>
                <img src={GS_LOGO} alt="GameSlime logo" style={{width:56,height:56,borderRadius:"50%",border:"2px solid rgba(212,165,116,.4)",objectFit:"cover"}}/>
                <span className="gs-label">GameSlime</span>
              </div>
              <p className="gs-desc">When I'm not behind the camera or in the edit suite, I'm gaming. Here's a peek at the other side of Sunny.</p>
            </div>
            {gsLoading && <p style={{textAlign:"center",color:"var(--muted)",marginTop:"2rem"}}>Loading latest videos…</p>}
            {gsError && <p style={{textAlign:"center",color:"var(--muted)",marginTop:"2rem"}}>Couldn't load videos. <a href="https://www.youtube.com/@GameSlimeOG" target="_blank" rel="noopener noreferrer" style={{color:"var(--gold)"}}>Visit the channel →</a></p>}
            {!gsLoading && !gsError && (
              <div className="gs-grid">
                {gsVideos.map(v=>(
                  <div key={v.id} className="gs-card" onClick={()=>window.open(v.url,"_blank")}>
                    <div className="gs-thumb">
                      <img src={v.thumbnail} alt={v.title} onError={e=>{e.target.style.display="none";e.target.parentElement.style.background="linear-gradient(135deg,#1a1a1a,#2a1a1a)";}}/>
                      <div className="gs-ov"><SmPlayIco/></div>
                    </div>
                    <div className="gs-info">
                      <div className="gs-ttl">{v.title}</div>
                      <div className="gs-dur">{v.published}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={{textAlign:"center",marginTop:"2rem"}}>
              <a href="https://www.youtube.com/@GameSlimeOG" target="_blank" rel="noopener noreferrer"
                style={{color:"var(--gold)",fontFamily:"Montserrat,sans-serif",fontSize:".9rem",fontWeight:600,textDecoration:"none",border:"1px solid var(--bdr)",padding:".6rem 1.5rem",borderRadius:"6px",display:"inline-block"}}
                onMouseOver={e=>e.currentTarget.style.background="rgba(212,165,116,.1)"}
                onMouseOut={e=>e.currentTarget.style.background="transparent"}>
                Visit GameSlime Channel →
              </a>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="sec alt">
          <div className="inn">
            <div className="shd"><h2 className="stitle">Let's Create Together</h2><div className="ul"/></div>
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

        <footer>
          <p className="ft">© 2025 {hero.name}. All rights reserved.</p>
          <p className="ftag">Crafting stories, one frame at a time.</p>
        </footer>

      </div>
    </>
  );
}