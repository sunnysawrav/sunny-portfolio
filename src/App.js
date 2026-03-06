import { useState } from "react";

const T = id => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

const data = {
  hero: { name: "Sunny Sawrav", tagline: "Film Maker • Creative Director • Post Production Supervisor • AI Strategist", description: "Ready to bring creative visions to life through innovative filmmaking and AI-enhanced solutions.", years: "15+", projects: "100+" },
  about: { bio: "With over 15 years of experience in the entertainment industry, I specialize in bringing creative visions to life through innovative filmmaking, post-production excellence, and strategic creative direction. I combine technical expertise with creative storytelling to deliver exceptional results, from feature films gracing international festivals to cutting-edge digital campaigns achieving unprecedented growth. As an AI strategist, I bridge the gap between traditional storytelling and emerging technologies, leveraging current-gen AI tools to unlock new creative possibilities while maintaining authentic human connection." },
  featured: [
    { id:1, title:"3Devi", type:"Feature Film", desc:"A compelling feature film showcasing innovative storytelling and cinematic excellence. Premiered at international festivals.", embed:"https://www.youtube.com/embed/DeNuCn4ATy8", vid:"DeNuCn4ATy8", year:"2022", award:"NY Film Festival 2022 - Best Editor Nominee" },
    { id:2, title:"A Love Song for Goddesses", type:"Music Video", desc:"Artistic music video combining creative direction with technical expertise in visual storytelling.", embed:"https://www.youtube.com/embed/KIqpvVtIWNA", vid:"KIqpvVtIWNA", year:"2020", award:"1M+ Views" },
    { id:3, title:"Heretic - Thoughts", type:"Music Video", desc:"Bold and innovative music video showcasing advanced post-production and creative direction skills.", embed:"https://www.youtube.com/embed/RZREe_vEH1g", vid:"RZREe_vEH1g", year:"2012", award:"91K+ Views" },
    { id:4, title:"Disha Habitat", type:"Commercial", desc:"Professional commercial production showcasing brand storytelling and visual communication excellence.", embed:"https://www.youtube.com/embed/EFDhOmvK108", vid:"EFDhOmvK108", year:"2021", award:"145K+ Views" },
  ],
  showreel: [
    { id:1,  title:"A lullaby for the missing",        vid:"AsvbWOmvBbg", url:"https://www.youtube.com/watch?v=AsvbWOmvBbg", views:"1M" },
    { id:2,  title:"Follow Traffic Rules - Bajaj Avenger", vid:"rbUjgmJ0lFM", url:"https://www.youtube.com/watch?v=rbUjgmJ0lFM", views:"533" },
    { id:3,  title:"South Indian By Nature",            vid:"oTX_5xOiW6A", url:"https://www.youtube.com/watch?v=oTX_5xOiW6A", views:"29" },
    { id:4,  title:"3Devi - Final Trailer",             vid:"DeNuCn4ATy8", url:"https://www.youtube.com/watch?v=DeNuCn4ATy8", views:"872K" },
    { id:5,  title:"Vijay Karnataka - Protest",         vid:"jrOmAW1aDPY", url:"https://www.youtube.com/watch?v=jrOmAW1aDPY", views:"2.1K" },
    { id:6,  title:"Heretic - Thoughts",                vid:"RZREe_vEH1g", url:"https://www.youtube.com/watch?v=RZREe_vEH1g", views:"91K" },
    { id:7,  title:"Vijay Karnataka - Cricket",         vid:"t2gc5ZWc_gA", url:"https://www.youtube.com/watch?v=t2gc5ZWc_gA", views:"879" },
    { id:8,  title:"A Love Song for Goddesses",         vid:"KIqpvVtIWNA", url:"https://www.youtube.com/watch?v=KIqpvVtIWNA", views:"1M" },
    { id:9,  title:"Vijay Karnataka - Water",           vid:"DHAPY_DNVEY", url:"https://www.youtube.com/watch?v=DHAPY_DNVEY", views:"628" },
    { id:10, title:"Cloudnine Hospitals",               vid:"vnD4GBGzpiA", url:"https://www.youtube.com/watch?v=vnD4GBGzpiA", views:"17K" },
    { id:11, title:"Random - A short",                  vid:"9gkbJ4QmAyU", url:"https://www.youtube.com/watch?v=9gkbJ4QmAyU", views:"192" },
    { id:12, title:"Asirvad Microfinance - 42Gears",    vid:"ztsbIMYjhx0", url:"https://www.youtube.com/watch?v=ztsbIMYjhx0", views:"5.1K" },
  ],
  experience: [
    { id:1, role:"Executive Director", company:"Altered Ego Entertainment", period:"2020 - Present", desc:"Leading creative vision and business strategy for a full-service entertainment production company. Overseeing film production, post-production services, and creative content development across multiple platforms.", award:"Led production of 3Devi feature film and Disha Habitat commercial" },
    { id:2, role:"Head of Creative Marketing", company:"Studio Sirah (Consultant)", period:"January 2026", desc:"Delivered strategic ideations and comprehensive marketing plan for Kalpa, a mobile tower defense game. Developed creative marketing strategies to enhance game visibility and player engagement." },
    { id:3, role:"Head of Media and Communications", company:"Life Science Education Trust", period:"2024 - 2025", desc:"Led comprehensive media strategy and communications for educational initiatives in life sciences.", award:"3000% social media growth" },
    { id:4, role:"Creative Manager", company:"OLA - ANI Technologies", period:"2020", desc:"Managed creative campaigns for one of India's leading mobility platforms. Developed visual content strategy and supervised creative production for digital marketing initiatives." },
    { id:5, role:"Post Production Supervisor", company:"Edusys Services Pvt Ltd", period:"2014 - 2020", desc:"Supervised video editing, color grading, and final delivery for educational content across multiple platforms.", award:"200% efficiency improvement" },
    { id:6, role:"Director", company:"Fullmeals Creative Studio", period:"2011 - 2013", desc:"Founded and directed a creative studio specializing in commercial video production and digital content creation. Led creative teams and managed client relationships." },
  ],
  skills: {
    "Post Production":      ["Video Editing","Color Grading","Audio Post","VFX Supervision","Motion Graphics","Workflow Optimization"],
    "Creative Direction":   ["Script Development","Concept Ideation","Visual Storytelling","Team Leadership","Project Management","Client Relations"],
    "Production":           ["Line Production","Multi-team Coordination","Budget Management","Schedule Optimization","Quality Control","Technology Integration"],
    "AI & Digital Strategy":["AI-Enhanced Workflows","Intelligent Content Optimization","Social Media Strategy","Content Marketing","Digital Campaign Management","Analytics & Growth Hacking"],
    "Technical Skills":     ["3D Animation & VFX","Web Design & Development","C++ Programming","Creative Algorithms","Online Editing Systems","AI Tools Integration"],
  },
  achievements: [
    { id:1, title:"NY Film Festival 2022",       desc:"Nominated for Best Editor",                    year:"2022" },
    { id:2, title:"National Recognition",        desc:"Documentary award presented by Imtiaz Ali",    year:"2020" },
    { id:3, title:"3000% Social Media Growth",   desc:"Life Science Education Trust",                 year:"2024" },
    { id:4, title:"200% Efficiency Improvement", desc:"Post-production workflows at Edusys",          year:"2019" },
    { id:5, title:"COVID-19 Innovation",         desc:"Developed online film editing methodology",    year:"2020" },
    { id:6, title:"15+ Years Experience",        desc:"Creative excellence in entertainment industry",year:"2009-Present" },
  ],
  contact: { email:"sunnysawrav@gmail.com", phone:"+91-7892378521", linkedin:"https://www.linkedin.com/in/sunnysawrav/", instagram:"https://www.instagram.com/sunnysawrav/" },
};

// Icons
const Ico = ({d,size=20})=><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>;
const FilmIco  = ()=><Ico size={16} d="M2 2h20v20H2zM7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 7h5M17 17h5"/>;
const AwardIco = ({s=20})=><Ico size={s} d="M12 15l-2 5 2-1 2 1-2-5zM12 2a7 7 0 1 0 0 14A7 7 0 0 0 12 2z"/>;
const BriefIco = ()=><Ico size={18} d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>;
const MailIco  = ()=><Ico size={22} d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6"/>;
const PhoneIco = ()=><Ico size={22} d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>;
const LiIco   = ()=><Ico size={22} d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>;
const IgIco   = ()=><Ico size={22} d="M4 4m0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01"/>;
const ExtIco  = ()=><Ico size={26} d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>;
const ChkIco  = ()=><Ico size={16} d="M20 6L9 17l-5-5"/>;
const PlayIco = ()=><svg width="56" height="56" viewBox="0 0 24 24" fill="#d4a574" style={{filter:"drop-shadow(0 4px 8px rgba(0,0,0,.5));"}}><polygon points="5,3 19,12 5,21"/></svg>;

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Montserrat:wght@400;500;600;700&family=Lato:wght@300;400;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{--bg:#0a0a0a;--bg2:#1a1a1a;--gold:#d4a574;--gold-dk:#b8860b;--txt:#f5f5f5;--txt2:#d1d1d1;--muted:#999;--bdr:rgba(212,165,116,.2);}
body,html{background:var(--bg);color:var(--txt);font-family:'Lato',sans-serif;}
.w{background:var(--bg);overflow-x:hidden;}
/* NAV */
nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(10,10,10,.9);backdrop-filter:blur(12px);border-bottom:1px solid var(--bdr);padding:.75rem 2rem;display:flex;justify-content:space-between;align-items:center;}
.logo{font-family:'Playfair Display',serif;font-size:1.3rem;color:var(--gold);letter-spacing:2px;}
.links{display:flex;gap:1.5rem;flex-wrap:wrap;}
.links button{background:none;border:none;color:var(--txt2);font-size:.78rem;font-family:'Montserrat',sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:1px;cursor:pointer;transition:color .2s;}
.links button:hover{color:var(--gold);}
/* HERO */
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
/* SECTIONS */
.sec{padding:6rem 2rem;}.alt{background:var(--bg2);}
.inn{max-width:1400px;margin:0 auto;}
.shd{text-align:center;margin-bottom:4rem;}
.stitle{font-family:'Playfair Display',serif;font-size:clamp(2.2rem,5vw,3.8rem);font-weight:700;color:var(--txt);margin-bottom:1rem;}
.ul{width:100px;height:3px;background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:0 auto;}
/* ABOUT */
.abio{max-width:1000px;margin:0 auto;font-size:1.1rem;line-height:2;color:var(--txt2);text-align:center;}
/* FEATURED */
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
/* SHOWREEL */
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
/* TIMELINE */
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
/* SKILLS */
.skg{display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:2rem;}
.skc{background:var(--bg);border:1px solid var(--bdr);border-radius:12px;padding:2rem;transition:transform .3s,box-shadow .3s;}
.skc:hover{transform:translateY(-5px);box-shadow:0 10px 30px rgba(212,165,116,.15);}
.skh{font-family:'Montserrat',sans-serif;font-size:1.2rem;font-weight:700;color:var(--gold);margin-bottom:1.25rem;}
.skt{display:flex;flex-wrap:wrap;gap:.6rem;}
.sktg{padding:.4rem .9rem;background:rgba(212,165,116,.1);border:1px solid var(--bdr);border-radius:20px;font-size:.85rem;color:var(--txt2);transition:background .3s,color .3s,border-color .3s;cursor:default;}
.sktg:hover{background:rgba(212,165,116,.2);color:var(--gold);border-color:var(--gold);}
/* ACHIEVEMENTS */
.ag{display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:2rem;}
.ac{background:var(--bg2);border:1px solid var(--bdr);border-radius:12px;padding:2rem;text-align:center;transition:transform .3s,box-shadow .3s;}
.ac:hover{transform:translateY(-5px);box-shadow:0 10px 30px rgba(212,165,116,.15);}
.at{font-family:'Montserrat',sans-serif;font-size:1.2rem;font-weight:700;color:var(--txt);margin:.75rem 0 .5rem;}
.ad{color:var(--txt2);line-height:1.6;margin-bottom:.75rem;font-size:.95rem;}
.ay{font-size:.85rem;color:var(--gold);font-weight:600;}
/* CONTACT */
.cw{max-width:800px;margin:0 auto;text-align:center;}
.ct{font-size:1.2rem;color:var(--txt2);line-height:1.8;margin-bottom:3rem;}
.cl{display:flex;flex-direction:column;gap:1.5rem;align-items:center;}
.ci{display:flex;align-items:center;gap:1rem;font-size:1.1rem;color:var(--txt2);transition:transform .3s;}
.ci:hover{transform:translateX(5px);}
.ci a{color:var(--gold);text-decoration:none;font-weight:500;transition:color .3s;}
.ci a:hover{color:var(--gold-dk);}
/* FOOTER */
footer{background:var(--bg);border-top:1px solid var(--bdr);padding:3rem 2rem;text-align:center;}
.ft{color:var(--muted);font-size:.875rem;margin-bottom:.4rem;}
.ftag{color:var(--gold);font-style:italic;}
@keyframes fadeUp{from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);}}
@media(max-width:1024px){.tl::before{left:1.5rem;}.tli:nth-child(odd) .tlc,.tli:nth-child(even) .tlc{margin-left:4rem;margin-right:0;}.tlm{left:1.5rem;}}
@media(max-width:768px){.sec{padding:4rem 1.5rem;}.fg{grid-template-columns:1fr;}.skg,.ag{grid-template-columns:1fr;}.ctas{flex-direction:column;width:100%;}.bp,.bs{width:100%;}.stats{gap:2rem;}.sn{font-size:2.5rem;}.links{gap:.75rem;}.links button{font-size:.7rem;}}
@media(max-width:480px){.links{display:none;}}
`;

export default function App() {
  const [activeVid, setActiveVid] = useState(null);
  const go = id => document.getElementById(id)?.scrollIntoView({behavior:"smooth"});

  return (
    <>
      <style>{css}</style>
      <div className="w">

        {/* NAV */}
        <nav>
          <span className="logo">SS</span>
          <div className="links">
            {["about","featured","showreel","experience","skills","achievements","contact"].map(s=>(
              <button key={s} onClick={()=>go(s)}>{s[0].toUpperCase()+s.slice(1)}</button>
            ))}
          </div>
        </nav>

        {/* HERO */}
        <section className="hero">
          <div className="hero-in">
            <div className="badge"><FilmIco/><span>{data.hero.years} Years of Excellence</span></div>
            <h1 className="hname">{data.hero.name}</h1>
            <p className="htag">{data.hero.tagline}</p>
            <p className="hdesc">{data.hero.description}</p>
            <div className="stats">
              <div><div className="sn">{data.hero.years}</div><div className="sl">Years Experience</div></div>
              <div className="sdiv"/>
              <div><div className="sn">{data.hero.projects}</div><div className="sl">Projects Completed</div></div>
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
            <p className="abio">{data.about.bio}</p>
          </div>
        </section>

        {/* FEATURED */}
        <section id="featured" className="sec">
          <div className="inn">
            <div className="shd"><h2 className="stitle">Featured Projects</h2><div className="ul"/></div>
            <div className="fg">
              {data.featured.map(p=>(
                <div key={p.id} className="pc">
                  <div className="vw">
                    {activeVid===p.id
                      ? <iframe src={p.embed+"?autoplay=1"} title={p.title} frameBorder="0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowFullScreen/>
                      : <div className="tw" onClick={()=>setActiveVid(p.id)}>
                          <img src={T(p.vid)} alt={p.title} onError={e=>{e.target.style.display="none"; e.target.parentElement.style.background="linear-gradient(135deg,#1a1a1a,#2a1a1a)";}}/>
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
          </div>
        </section>

        {/* SHOWREEL */}
        <section id="showreel" className="sec alt">
          <div className="inn">
            <div className="shd"><h2 className="stitle">Complete Showreel</h2><div className="ul"/></div>
            <div className="sg">
              {data.showreel.map(v=>(
                <div key={v.id} className="si" onClick={()=>window.open(v.url,"_blank")}>
                  <div className="siw">
                    <img src={T(v.vid)} alt={v.title} onError={e=>{e.target.style.display="none"; e.target.parentElement.style.background="linear-gradient(135deg,#1a1a1a,#2a1a1a)";}}/>
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
            <div className="tl">
              {data.experience.map(e=>(
                <div key={e.id} className="tli">
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
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="sec alt">
          <div className="inn">
            <div className="shd"><h2 className="stitle">Skills & Expertise</h2><div className="ul"/></div>
            <div className="skg">
              {Object.entries(data.skills).map(([cat,tags])=>(
                <div key={cat} className="skc">
                  <div className="skh">{cat}</div>
                  <div className="skt">{tags.map((t,i)=><span key={i} className="sktg">{t}</span>)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ACHIEVEMENTS */}
        <section id="achievements" className="sec">
          <div className="inn">
            <div className="shd"><h2 className="stitle">Achievements & Recognition</h2><div className="ul"/></div>
            <div className="ag">
              {data.achievements.map(a=>(
                <div key={a.id} className="ac">
                  <AwardIco s={48}/>
                  <h3 className="at">{a.title}</h3>
                  <p className="ad">{a.desc}</p>
                  <span className="ay">{a.year}</span>
                </div>
              ))}
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
                <div className="ci"><PhoneIco/><a href={`tel:${data.contact.phone}`}>{data.contact.phone}</a></div>
                <div className="ci"><MailIco/><a href={`mailto:${data.contact.email}`}>{data.contact.email}</a></div>
                <div className="ci"><LiIco/><a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></div>
                <div className="ci"><IgIco/><a href={data.contact.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></div>
              </div>
            </div>
          </div>
        </section>

        <footer>
          <p className="ft">© 2025 {data.hero.name}. All rights reserved.</p>
          <p className="ftag">Crafting stories, one frame at a time.</p>
        </footer>

      </div>
    </>
  );
}