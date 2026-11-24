"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import Wishes from "./Wishes";

const reveal = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: .15 }, transition: { duration: .8 } };
function Ornament() { return <div className="ornament" aria-hidden="true"><span />✧<span /></div>; }
function Icon({ type }) {
 const paths = { home: "M3 10 12 3l9 7v10H3ZM9 20v-7h6v7", pin: "M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0ZM9 10a3 3 0 1 0 6 0 3 3 0 1 0-6 0", heart: "M12 20S2 14 2 8a5 5 0 0 1 10-1A5 5 0 0 1 22 8c0 6-10 12-10 12Z", music: "M9 18V5l11-2v13M9 5l11-2M9 18c0 3-6 4-6 1s6-4 6-1Zm11-2c0 3-6 4-6 1s6-4 6-1Z", time: "M12 8v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0" };
 return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[type]} /></svg>;
}
export default function WeddingClient({ wedding, slug }) {
 const [open, setOpen] = useState(false), [playing, setPlaying] = useState(false);
 const [remaining, setRemaining] = useState([0,0,0,0]);
 const audio = useRef(null);
 const date = wedding.date || "2026-12-18T19:00:00+02:00";
 useEffect(() => { const update = () => { const seconds = Math.max(0, Math.floor((new Date(date).getTime()-Date.now())/1000)); setRemaining([Math.floor(seconds/86400),Math.floor(seconds/3600)%24,Math.floor(seconds/60)%60,seconds%60]); }; update(); const timer=setInterval(update,1000);return()=>clearInterval(timer); },[date]);
 useEffect(()=>{ document.body.style.overflow = open ? "" : "hidden"; return()=>{document.body.style.overflow="";}; },[open]);
 useEffect(() => {
   if (!open || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
   let frame, timer, previous, position = window.scrollY, stopped = false;
   const stop = () => { stopped = true; cancelAnimationFrame(frame); clearTimeout(timer); };
   const tick = (now) => {
     if (stopped) return;
     if (previous !== undefined) position += Math.min(now - previous, 50) * .026;
     previous = now;
     window.scrollTo({ top: position, behavior: "instant" });
     if (position < document.documentElement.scrollHeight - window.innerHeight) frame = requestAnimationFrame(tick);
   };
   timer = setTimeout(() => { frame = requestAnimationFrame(tick); }, 2200);
   const keys = e => { if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " ", "Tab"].includes(e.key)) stop(); };
   const events = ["wheel", "touchstart", "pointerdown", "focusin"];
   events.forEach(event => window.addEventListener(event, stop, { passive: true }));
   window.addEventListener("keydown", keys);
   return () => { stop(); events.forEach(event => window.removeEventListener(event, stop)); window.removeEventListener("keydown", keys); };
 }, [open]);
 async function toggleMusic() { if(!audio.current)return; if(playing){audio.current.pause();setPlaying(false);}else{try{await audio.current.play();setPlaying(true);}catch{setPlaying(false);}} }
 function enter(){setOpen(true);toggleMusic();}
 const map = "https://maps.app.goo.gl/JZJMpwqbXk2ru5Xp9";
 const format = d=>d.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}Z$/,"Z");
 const start=new Date(date);
 const calendar="https://calendar.google.com/calendar/render?"+new URLSearchParams({action:"TEMPLATE",text:`زفاف ${wedding.groom} وآية`,dates:`${format(start)}/${format(new Date(+start+14400000))}`,location:wedding.venue||"قاعة الماسة الحديقة الدولية بوابة 2"});
 return <MotionConfig reducedMotion="user"><main className="wedding-page">
 {open && <div className="floating-bows" aria-hidden="true">{Array.from({length: 7}, (_, i) => <span key={i} className="flying-bow" style={{"--left": `${7+i*14}%`, "--delay": `${-i*3.7}s`, "--duration": `${19+i%3*4}s`, "--size": `${20+i%3*6}px`, "--sway": `${i%2 ? -35 : 35}px`}}><svg viewBox="0 0 64 64" fill="currentColor"><path d="M32 56S5 39 5 21C5 7 23 3 32 16 41 3 59 7 59 21c0 18-27 35-27 35Z"/></svg></span>)}</div>}
 <audio ref={audio} src={wedding.music || "/music/farha.mp3"} loop preload="none" />
 <AnimatePresence>{!open && <motion.div className="invitation-cover" exit={{opacity:0, y:-30}} transition={{duration:.85}}>
 <div className="cover-glow"/><div className="cover-line"/><div className="cover-line second"/>
 <motion.div className="cover-content" initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:1}}>
 <p className="eyebrow">THE WEDDING CELEBRATION</p><Ornament/><p className="cover-intro">بكل الحب، ندعوكم لمشاركتنا فرحتنا</p>
 <h1>{wedding.groom || "عبدالرحمن"}<i>&</i>{wedding.bride || "آية"}</h1>
 <p className="cover-date">الجمعة، 18 ديسمبر 2026</p><div className="cover-event-time"><Icon type="time"/><span>الساعة 7 مساءً</span></div><button className="gold-button" onClick={enter}>افتح الدعوة <span aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 13V6a2 2 0 0 1 4 0v6l2-1 5 2v5l-4 4h-5l-6-7a1.8 1.8 0 0 1 2.5-2.5L9 14"/><path d="M3 6H1M5 2 4 1M17 3l2-2M19 7h3"/></svg></span></button><p className="cover-note">بحضوركم يتم لنا الفرح والسرور</p>
 </motion.div><span className="cover-corner">A & A <small>18 · 12 · 2026</small></span>
 </motion.div>}</AnimatePresence>

 <section id="home" className="editorial-hero">
 <div className="hero-copy"><motion.div {...reveal}><p className="eyebrow">A LOVE TO CELEBRATE</p><p className="small-arabic">عَلَى الْمَوَدَّةِ وَالرَّحْمَةِ، نَبْدَأُ حِكَايَتَنَا</p><h1>{wedding.groom || "عبدالرحمن"}<span className="ampersand">&</span>{wedding.bride || "آية"}</h1><Ornament/><p className="hero-message">معًا نبدأ فصلًا جديدًا،<br/>وبوجودكم تصبح فرحتنا أجمل.</p><div className="date-row"><span>الجمعة</span><b>18</b><span>ديسمبر<br/>2026</span></div><a className="text-link" href="#details">تفاصيل يومنا <span>↓</span></a></motion.div></div>
 <div className="hero-visual"><motion.div className="portrait-frame" initial={{opacity:0,scale:1.04}} animate={open?{opacity:1,scale:1}:{opacity:0}} transition={{duration:1.4}}><img src={wedding.heroImage || "/images/aa.JPG"} alt="عبدالرحمن وآية في يوم خطوبتهما"/><div className="portrait-shade"/><span className="portrait-caption">Together is a beautiful place to be.</span></motion.div><span className="photo-stamp">OUR FOREVER<br/>STARTS HERE</span><svg className="botanical" viewBox="0 0 160 260" fill="none" stroke="currentColor" aria-hidden="true"><path d="M30 250Q110 150 100 10M70 180Q15 160 30 110Q70 130 70 180ZM91 120Q140 100 145 50Q105 65 91 120ZM100 65Q65 50 75 10Q104 25 100 65"/></svg></div>
 </section>
 <div className="love-ribbon" aria-hidden="true"><span>YOU · ME · FOREVER</span><i>✧</i><span>A lifetime begins… a love story unfolds</span><i>✧</i><span>18 DECEMBER 2026</span></div>
 <motion.section {...reveal} id="countdown" className="countdown-section"><p className="eyebrow">EVERY SECOND BRINGS US CLOSER</p><h2>بنعدّ اللحظات لفرحتنا</h2><p className="section-description">يوم واحد، وعمر كامل من الذكريات.</p><div className="luxury-countdown" dir="ltr">{remaining.map((value,index)=><div key={index}><strong>{String(value).padStart(2,"0")}</strong><span>{["يوم","ساعة","دقيقة","ثانية"][index]}</span></div>)}</div><a href={calendar} target="_blank" rel="noreferrer" className="outline-button">أضف يومنا إلى تقويمك <Icon type="time"/></a></motion.section>
 <section id="details" className="venue-section"><motion.div {...reveal} className="venue-art"><div className="arch-outline"/><span className="venue-number">18</span><span className="venue-month">DECEMBER · 2026</span><Ornament/><p>ليلة من العمر</p><div className="date-card-time" aria-label="الساعة 7 مساءً"><Icon type="time"/><span dir="ltr">7:00 <small>PM</small></span></div></motion.div><motion.div {...reveal} className="venue-copy"><p className="eyebrow">THE PLACE WE SAY FOREVER</p><h2>ميعادنا في الماسة</h2><p className="venue-en" dir="ltr">Al-Masa Hall</p><p className="venue-address">قاعة الماسة — الحديقة الدولية، بوابة 2<br/>عباس العقاد، مدينة نصر</p><p className="venue-english" dir="ltr">International Park, Gate 2<br/>Abbas El-Akkad, Nasr City</p><div className="venue-time"><Icon type="time"/><span>الجمعة 18 ديسمبر · الساعة 7 مساءً</span></div><a href={map} target="_blank" rel="noreferrer" className="gold-button">الموقع على الخريطة <Icon type="pin"/></a></motion.div></section>
 <Wishes weddingId={wedding.id || slug}/>
 <footer className="designer-footer"><div className="designer-credit" dir="ltr"><div><small>DESIGNED & DEVELOPED BY</small><strong>Abdulrahman Salah</strong></div></div></footer>
 {open&&<nav className="luxury-nav" aria-label="التنقل بالدعوة">{[["home","الرئيسية","home"],["countdown","الموعد","time"],["details","المكان","pin"],["wishes","التهاني","heart"]].map(([id,label,icon])=><a href={`#${id}`} key={id}><Icon type={icon}/><span>{label}</span></a>)}<button onClick={toggleMusic} aria-label={playing?"كتم الموسيقى":"تشغيل الموسيقى"} className={playing?"music-active":""}><Icon type="music"/><span>{playing?"كتم":"تشغيل"}</span></button></nav>}
 </main></MotionConfig>;
}
