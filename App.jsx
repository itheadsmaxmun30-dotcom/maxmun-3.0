import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import CurrentMunPage from "./CurrentMun.jsx";
import LockAccess from "./src/components/LockAccess.jsx";
import FloatingSEOTags from "./src/components/FloatingSEOTags.jsx";
import GoatedFX from "./src/components/GoatedFX.jsx";
import { forceScrollTop, smoothScrollToId } from "./src/utils/smoothScroll.js";

/* ═══════════════════════════════════════════════════════════
   GLOBAL STYLES — MAXMUN PREMIUM CINEMATIC UI
═══════════════════════════════════════════════════════════ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Space+Grotesk:wght@300;400;500;600;700&family=Bebas+Neue&family=Syncopate:wght@400;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --ink:#03060d;
  --ink1:#060e1c;
  --ink2:#091625;
  --ink3:#0d2040;
  --azure:#0050ff;
  --azure2:#1a6fff;
  --azure3:#3d8bff;
  --sky:#78c1ff;
  --ice:#c4e4ff;
  --gold:#c8953a;
  --gold2:#e8b86d;
  --gold3:#f5d49a;
  --platinum:#e8edf5;
  --silver:#a0b4cc;
  --dim:#3a5270;
  --ghost:rgba(255,255,255,0.03);
  --ghost2:rgba(255,255,255,0.06);
  --ghost3:rgba(255,255,255,0.1);
  --glassborder:rgba(255,255,255,0.08);
  --glassborder2:rgba(120,193,255,0.2);
  --r4:4px;--r8:8px;--r12:12px;--r16:16px;--r24:24px;--r50:50px;
  --shadow-deep:0 32px 80px rgba(0,0,0,0.7);
  --glow-azure:0 0 60px rgba(0,80,255,0.3);
  --glow-gold:0 0 40px rgba(200,149,58,0.25);
}

html{scroll-behavior:smooth;font-size:16px}
body{
  font-family:'Space Grotesk',sans-serif;
  background:var(--ink);
  color:var(--platinum);
  overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
}
::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-track{background:var(--ink)}
::-webkit-scrollbar-thumb{background:linear-gradient(var(--azure),var(--gold));border-radius:2px}
button{cursor:pointer;font-family:'Space Grotesk',sans-serif}

.main-cursor-layer{
  position:fixed;inset:0;z-index:580;pointer-events:none;mix-blend-mode:screen;
}
.main-cursor-aura,.main-cursor-dot,.main-cursor-trace{
  position:absolute;left:0;top:0;border-radius:50%;pointer-events:none;
  transform:translate3d(-999px,-999px,0);will-change:transform,opacity;
}
.main-cursor-aura{
  width:170px;height:170px;margin:-85px 0 0 -85px;
  background:radial-gradient(circle,rgba(120,193,255,.18),rgba(200,149,58,.08) 34%,transparent 68%);
  filter:blur(2px);opacity:.72;transition:opacity .2s ease;
}
.main-cursor-dot{
  width:10px;height:10px;margin:-5px 0 0 -5px;
  background:radial-gradient(circle,#f5d49a 0 18%,#78c1ff 48%,rgba(120,193,255,.05) 72%);
  box-shadow:0 0 18px rgba(120,193,255,.55),0 0 24px rgba(200,149,58,.22);opacity:.95;
}
.main-cursor-trace{
  width:26px;height:26px;margin:-13px 0 0 -13px;
  border:1px solid rgba(120,193,255,.24);
  box-shadow:0 0 22px rgba(120,193,255,.12);opacity:.42;
}
body.pointer-idle .main-cursor-layer{opacity:.3}
.magnetic-card,.edition-card,.cc,.feat,.oc-card,.legacy-placard,.legacy-member,.cinfo,.current-live-chip,.ltab,.ctab,.btn-primary,.btn-ghost{
  --mx:50%;--my:50%;--tilt-x:0deg;--tilt-y:0deg;
}
.cursor-reactive{
  transform:perspective(900px) rotateX(var(--tilt-x)) rotateY(var(--tilt-y)) translate3d(0,-4px,0)!important;
}
.edition-card,.cc,.feat,.oc-card,.legacy-placard,.legacy-member,.cinfo,.current-live-chip{
  background-blend-mode:screen,normal;
}
.edition-card::before,.cc::before,.legacy-placard::before,.oc-card::before,.feat::after,.cinfo::after{
  pointer-events:none;
}
.home-section-rail{
  position:fixed;left:clamp(.65rem,1.4vw,1.15rem);top:50%;transform:translateY(-50%);
  z-index:560;display:grid;gap:.42rem;padding:.74rem .42rem;border-radius:999px;
  border:1px solid rgba(120,193,255,.18);
  background:linear-gradient(180deg,rgba(3,8,18,.76),rgba(5,18,36,.54));
  backdrop-filter:blur(14px) saturate(1.12);
  box-shadow:0 22px 70px rgba(0,0,0,.36),inset 0 1px 0 rgba(255,255,255,.06);
}
.home-section-rail::before{
  content:"";position:absolute;left:50%;top:.9rem;bottom:.9rem;width:2px;transform:translateX(-50%);
  border-radius:999px;background:linear-gradient(180deg,rgba(120,193,255,.18),rgba(200,149,58,.20));
  opacity:.5;pointer-events:none;
}
.home-section-rail button{
  position:relative;z-index:1;width:34px;height:34px;border-radius:50%;
  border:1px solid rgba(120,193,255,.15);background:rgba(255,255,255,.045);
  color:rgba(232,237,245,.62);font:800 .56rem/1 'Space Grotesk';letter-spacing:.08em;
  display:grid;place-items:center;transition:transform .22s ease,background .22s ease,color .22s ease,border-color .22s ease,box-shadow .22s ease;
}
.home-section-rail button:hover,.home-section-rail button.active{
  transform:scale(1.08);background:linear-gradient(135deg,var(--gold),var(--gold2));color:#03060d;
  border-color:rgba(245,212,154,.8);box-shadow:0 0 24px rgba(200,149,58,.24),0 0 28px rgba(120,193,255,.14);
}
.section{scroll-margin-top:88px}
.section.home-in-view::before{
  opacity:1;
}
body.cm-cinematic-scroll .home-section-rail{
  border-color:rgba(120,193,255,.34);box-shadow:0 26px 80px rgba(56,189,248,.16),inset 0 1px 0 rgba(255,255,255,.08);
}
.noise-layer{
  position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.025;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

.fx-canvas{position:fixed;inset:0;z-index:0;pointer-events:none}

.nav{
  position:fixed;top:0;left:0;right:0;z-index:600;
  height:70px;display:flex;align-items:center;
  justify-content:space-between;
  padding:0 clamp(1.5rem,5vw,4rem);
  transition:all .4s cubic-bezier(.25,.46,.45,.94);
}
.nav.solid{
  background:rgba(3,6,13,.85);
  backdrop-filter:blur(24px) saturate(1.4);
  border-bottom:1px solid var(--glassborder);
  height:60px;
}
.nav-brand{
  display:flex;align-items:center;gap:12px;cursor:pointer;
  font-family:'Syncopate',sans-serif;
  font-size:1.1rem;font-weight:700;letter-spacing:4px;
  color:var(--platinum);
}
.nav-brand-dot{
  width:8px;height:8px;border-radius:50%;
  background:var(--gold2);
  box-shadow:0 0 12px var(--gold),0 0 24px rgba(232,184,109,.4);
  animation:livePulse 2s ease infinite;
}
@keyframes livePulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.5);opacity:.6}}
.nav-badge{
  background:linear-gradient(135deg,var(--gold),var(--gold2));
  color:var(--ink);font-size:.55rem;font-weight:700;
  letter-spacing:1.5px;padding:3px 8px;border-radius:var(--r4);
  font-family:'Space Grotesk',sans-serif;
}
.nav-links{display:flex;align-items:center;gap:2.2rem}
.nav-links a{
  color:var(--silver);text-decoration:none;
  font-size:.75rem;font-weight:500;letter-spacing:1.5px;
  text-transform:uppercase;cursor:pointer;transition:color .25s;
  position:relative;
}
.nav-links a::after{
  content:'';position:absolute;bottom:-4px;left:0;right:0;
  height:1px;background:linear-gradient(90deg,var(--azure3),var(--gold));
  transform:scaleX(0);transform-origin:left;transition:transform .3s;
}
.nav-links a:hover{color:var(--platinum)}
.nav-links a:hover::after{transform:scaleX(1)}
.nav-cta{
  background:transparent;
  border:1px solid var(--glassborder2);
  color:var(--sky);
  padding:.5rem 1.4rem;border-radius:var(--r4);
  font-size:.72rem;font-weight:600;letter-spacing:2px;
  text-transform:uppercase;transition:all .3s;
  backdrop-filter:blur(8px);
}
.nav-cta:hover{
  background:rgba(120,193,255,.08);
  border-color:var(--sky);color:var(--platinum);
  box-shadow:0 0 30px rgba(120,193,255,.15);
}
.hamburger{display:none;flex-direction:column;gap:5px;background:none;border:none;padding:4px}
.hamburger span{width:22px;height:1px;background:var(--silver);display:block;transition:.3s}
.mob-menu{
  display:none;position:fixed;top:60px;left:0;right:0;z-index:590;
  background:rgba(3,6,13,.97);backdrop-filter:blur(20px);
  border-bottom:1px solid var(--glassborder);
  padding:1.5rem clamp(1.5rem,5vw,4rem);
  flex-direction:column;gap:1.4rem;
}
.mob-menu.open{display:flex}
.mob-menu a{
  color:var(--silver);font-size:.9rem;font-weight:500;
  cursor:pointer;letter-spacing:2px;text-transform:uppercase;
  padding:.4rem 0;border-bottom:1px solid var(--glassborder);
  transition:color .2s;
}
.mob-menu a:hover{color:var(--sky)}

.hero{
  position:relative;min-height:100vh;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  overflow:hidden;padding-top:70px;
}
.hero-bg{
  position:absolute;inset:0;pointer-events:none;
  background:
    radial-gradient(ellipse 70% 50% at 50% -10%,rgba(0,80,255,.18) 0%,transparent 60%),
    radial-gradient(ellipse 40% 30% at 85% 70%,rgba(200,149,58,.06) 0%,transparent 60%),
    radial-gradient(ellipse 30% 40% at 10% 60%,rgba(0,80,255,.05) 0%,transparent 60%);
}
.hero-grid{
  position:absolute;inset:0;pointer-events:none;opacity:.035;
  background-image:
    linear-gradient(rgba(120,193,255,1) 1px,transparent 1px),
    linear-gradient(90deg,rgba(120,193,255,1) 1px,transparent 1px);
  background-size:80px 80px;
  mask-image:radial-gradient(ellipse 100% 80% at 50% 0%,black 0%,transparent 85%);
}
.hero-grid-diagonal{
  position:absolute;inset:0;pointer-events:none;opacity:.015;
  background-image:
    linear-gradient(45deg,rgba(200,149,58,1) 1px,transparent 1px);
  background-size:120px 120px;
}
.hero-orb{position:absolute;border-radius:50%;filter:blur(100px);pointer-events:none}
.hero-orb-1{width:600px;height:600px;background:rgba(0,80,255,.12);top:-200px;left:-150px;animation:orbFloat1 12s ease-in-out infinite}
.hero-orb-2{width:400px;height:400px;background:rgba(200,149,58,.07);bottom:-100px;right:-100px;animation:orbFloat2 16s ease-in-out infinite}
.hero-orb-3{width:300px;height:300px;background:rgba(0,80,255,.08);bottom:20%;left:30%;animation:orbFloat3 10s ease-in-out infinite}
@keyframes orbFloat1{0%,100%{transform:translate(0,0)}33%{transform:translate(30px,-40px)}66%{transform:translate(-20px,20px)}}
@keyframes orbFloat2{0%,100%{transform:translate(0,0)}50%{transform:translate(-25px,-30px)}}
@keyframes orbFloat3{0%,100%{transform:translate(0,0)}50%{transform:translate(20px,25px)}}

.hero-content{
  position:relative;z-index:2;text-align:center;
  padding:0 clamp(1rem,5vw,3rem);max-width:1000px;
}
.hero-overline{
  display:inline-flex;align-items:center;gap:10px;
  margin-bottom:2.5rem;
  font-size:.65rem;font-weight:600;letter-spacing:4px;text-transform:uppercase;
  color:var(--silver);animation:riseIn .8s ease both;
}
.hero-overline-line{width:32px;height:1px;background:linear-gradient(90deg,transparent,var(--gold))}
.hero-overline-line-r{width:32px;height:1px;background:linear-gradient(90deg,var(--gold),transparent)}
.hero-title-wrap{animation:riseIn .9s .1s ease both}
.hero-title{
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(5rem,16vw,14rem);
  font-weight:300;line-height:.85;
  color:var(--platinum);letter-spacing:-3px;
  position:relative;
}
.hero-title-accent{
  font-style:italic;
  background:linear-gradient(135deg,var(--sky) 0%,var(--azure3) 40%,var(--gold2) 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}
.hero-edition{
  font-family:'Syncopate',sans-serif;
  font-size:clamp(.65rem,1.2vw,.8rem);
  font-weight:700;letter-spacing:8px;text-transform:uppercase;
  color:var(--gold2);margin:1.2rem 0 1.8rem;
  animation:riseIn .9s .2s ease both;
}
.hero-sub{
  color:var(--silver);font-size:clamp(.9rem,1.5vw,1.05rem);
  line-height:1.8;font-weight:300;max-width:540px;margin:0 auto 3rem;
  animation:riseIn .9s .3s ease both;
}
.hero-actions{
  display:flex;gap:1rem;justify-content:center;
  flex-wrap:wrap;animation:riseIn .9s .4s ease both;
}
.btn-primary{
  position:relative;overflow:hidden;
  background:linear-gradient(135deg,var(--azure),var(--azure2));
  color:#fff;border:none;padding:.9rem 2.2rem;border-radius:var(--r4);
  font-size:.78rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;
  transition:all .35s;box-shadow:0 0 40px rgba(0,80,255,.35);
}
.btn-primary::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(255,255,255,.1),transparent);
  opacity:0;transition:.3s;
}
.btn-primary:hover{transform:translateY(-3px);box-shadow:0 12px 50px rgba(0,80,255,.5)}
.btn-primary:hover::before{opacity:1}
.btn-ghost{
  background:transparent;color:var(--sky);
  border:1px solid rgba(120,193,255,.3);
  padding:.9rem 2.2rem;border-radius:var(--r4);
  font-size:.78rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;
  transition:all .35s;backdrop-filter:blur(8px);
}
.btn-ghost:hover{
  background:rgba(120,193,255,.07);
  border-color:var(--sky);transform:translateY(-3px);
  box-shadow:0 0 30px rgba(120,193,255,.15);
}

.hero-metrics{
  display:flex;gap:clamp(1.5rem,6vw,5rem);justify-content:center;
  margin-top:5rem;padding-top:2.5rem;
  border-top:1px solid var(--glassborder);
  animation:riseIn .9s .5s ease both;
}
.metric-num{
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(1.8rem,4vw,3rem);font-weight:600;
  color:var(--platinum);line-height:1;
}
.metric-num span{color:var(--gold2)}
.metric-label{
  font-size:.6rem;color:var(--dim);
  letter-spacing:2.5px;text-transform:uppercase;margin-top:5px;
}

.hero-scroll{
  position:absolute;bottom:2.5rem;left:50%;transform:translateX(-50%);
  display:flex;flex-direction:column;align-items:center;gap:8px;
  animation:scrollBob 3s ease infinite;color:var(--dim);
  font-size:.58rem;letter-spacing:3px;text-transform:uppercase;
}
.scroll-line{
  width:1px;height:40px;
  background:linear-gradient(var(--azure2),transparent);
}
@keyframes scrollBob{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(10px)}}

.hero-sphere{
  position:absolute;right:clamp(-60px,-5vw,60px);top:50%;
  transform:translateY(-50%);
  width:clamp(200px,24vw,360px);height:clamp(200px,24vw,360px);
  pointer-events:none;z-index:1;
  animation:sphereFloat 8s ease-in-out infinite;
}
@keyframes sphereFloat{0%,100%{transform:translateY(-50%) rotate(0deg)}50%{transform:translateY(calc(-50% - 20px)) rotate(180deg)}}
.sphere-svg{width:100%;height:100%;opacity:.3;filter:drop-shadow(0 0 30px rgba(0,80,255,.4))}

@keyframes riseIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}

.section{
  padding:clamp(5rem,9vw,9rem) clamp(1.5rem,5vw,4rem);
  position:relative;z-index:2;
}
.section-label{
  display:inline-flex;align-items:center;gap:10px;
  font-size:.62rem;font-weight:600;letter-spacing:4px;text-transform:uppercase;
  color:var(--gold2);margin-bottom:1rem;
}
.section-label::before{content:'';width:24px;height:1px;background:linear-gradient(90deg,transparent,var(--gold))}
.section-h{
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(2rem,5vw,3.8rem);font-weight:300;
  color:var(--platinum);line-height:1.1;margin-bottom:1rem;letter-spacing:-1px;
}
.section-h em{font-style:italic;color:var(--sky)}
.section-p{
  color:var(--silver);font-size:.95rem;
  line-height:1.85;font-weight:300;max-width:560px;
}

.about-layout{
  display:grid;grid-template-columns:1fr 1fr;
  gap:clamp(3rem,7vw,8rem);align-items:center;
  max-width:1200px;margin:0 auto;
}
.about-features{display:flex;flex-direction:column;gap:.8rem;margin-top:2.5rem}
.feat{
  display:flex;align-items:flex-start;gap:1rem;
  padding:1rem 1.3rem;
  background:var(--ghost);border:1px solid var(--glassborder);
  border-radius:var(--r8);transition:all .3s;position:relative;overflow:hidden;
}
.feat::before{
  content:'';position:absolute;top:0;left:0;width:2px;height:100%;
  background:linear-gradient(var(--azure2),var(--gold));
  transform:scaleY(0);transform-origin:top;transition:.35s;
}
.feat:hover{border-color:var(--glassborder2);background:var(--ghost2);transform:translateX(6px)}
.feat:hover::before{transform:scaleY(1)}
.feat-icon{
  width:38px;height:38px;border-radius:var(--r8);flex-shrink:0;
  background:linear-gradient(135deg,rgba(0,80,255,.2),rgba(0,80,255,.05));
  border:1px solid rgba(0,80,255,.2);
  display:flex;align-items:center;justify-content:center;font-size:1rem;
}
.feat-name{font-weight:600;font-size:.85rem;color:var(--platinum);margin-bottom:3px}
.feat-text{font-size:.78rem;color:var(--silver);line-height:1.55}

.about-visual{
  position:relative;display:flex;
  align-items:center;justify-content:center;
}
.glass-cards-stack{position:relative;width:340px;height:420px;margin:0 auto}
.gcard{
  position:absolute;
  background:rgba(255,255,255,.04);
  border:1px solid var(--glassborder);
  border-radius:var(--r16);
  backdrop-filter:blur(20px);
  padding:1.5rem;
  box-shadow:var(--shadow-deep);
}
.gcard-1{width:240px;top:0;left:0;transform:rotate(-5deg);border-color:rgba(200,149,58,.2)}
.gcard-2{width:270px;top:70px;left:50px;transform:rotate(2.5deg)}
.gcard-3{
  width:250px;top:155px;left:20px;transform:rotate(-1.5deg);
  background:rgba(0,80,255,.08);border-color:rgba(120,193,255,.2);z-index:3;
}
.gcard-ico{font-size:1.8rem;margin-bottom:.6rem}
.gcard-t{font-family:'Syncopate',sans-serif;font-size:.75rem;font-weight:700;letter-spacing:2px;color:var(--platinum);margin-bottom:.3rem;text-transform:uppercase}
.gcard-s{font-size:.72rem;color:var(--silver)}

.countdown-section{
  background:var(--ink1);border-top:1px solid var(--glassborder);border-bottom:1px solid var(--glassborder);
  padding:clamp(4rem,7vw,7rem) clamp(1.5rem,5vw,4rem);
  position:relative;z-index:2;overflow:hidden;
}
.countdown-bg-text{
  position:absolute;font-family:'Cormorant Garamond',serif;
  font-size:clamp(8rem,20vw,20rem);font-weight:700;
  color:rgba(255,255,255,.015);top:50%;left:50%;
  transform:translate(-50%,-50%);white-space:nowrap;pointer-events:none;
  letter-spacing:-5px;
}
.countdown-inner{max-width:900px;margin:0 auto;text-align:center;position:relative;z-index:2}
.countdown-label{
  font-family:'Syncopate',sans-serif;font-size:.65rem;font-weight:700;
  letter-spacing:5px;text-transform:uppercase;color:var(--gold2);
  margin-bottom:2.5rem;
}
.countdown-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem;max-width:700px;margin:0 auto 2.5rem}
.cdown-unit{
  background:var(--ghost);border:1px solid var(--glassborder);
  border-radius:var(--r12);padding:1.5rem 1rem;
  backdrop-filter:blur(12px);position:relative;overflow:hidden;
}
.cdown-unit::before{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,var(--azure3),transparent);
}
.cdown-num{
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(2.5rem,6vw,4rem);font-weight:600;
  color:var(--platinum);line-height:1;
}
.cdown-sep{
  font-family:'Cormorant Garamond',serif;font-size:2rem;
  color:var(--dim);display:flex;align-items:center;padding-top:1.2rem;
}
.cdown-u{font-size:.58rem;letter-spacing:2.5px;text-transform:uppercase;color:var(--dim);margin-top:4px}
.countdown-info{
  display:flex;gap:2rem;justify-content:center;flex-wrap:wrap;margin-top:2rem;
}
.cdown-conf{
  background:var(--ghost);border:1px solid var(--glassborder);
  border-radius:var(--r8);padding:.8rem 1.5rem;
  font-size:.75rem;color:var(--silver);letter-spacing:1px;
}
.cdown-conf span{color:var(--gold2);font-weight:600}

.editions-grid{
  display:grid;grid-template-columns:repeat(3,1fr);
  gap:1.5rem;max-width:1200px;margin:0 auto;
}
.edition-card{
  background:var(--ghost);border:1px solid var(--glassborder);
  border-radius:var(--r16);padding:2.2rem;cursor:pointer;
  transition:all .4s cubic-bezier(.25,.46,.45,.94);
  position:relative;overflow:hidden;
  transform-style:preserve-3d;
}
.edition-card::after{
  content:'';position:absolute;inset:0;border-radius:var(--r16);
  background:linear-gradient(135deg,transparent 60%,rgba(0,80,255,.04));
  opacity:0;transition:.3s;
}
.edition-card:hover{
  border-color:var(--glassborder2);
  transform:translateY(-8px) rotateX(2deg);
  box-shadow:0 32px 80px rgba(0,0,0,.5),var(--glow-azure);
}
.edition-card:hover::after{opacity:1}
.ed-num{
  font-family:'Cormorant Garamond',serif;
  font-size:5rem;font-weight:300;color:rgba(120,193,255,.06);
  line-height:1;margin-bottom:1rem;
}
.ed-name{font-family:'Syncopate',sans-serif;font-size:.85rem;font-weight:700;letter-spacing:3px;color:var(--platinum);margin-bottom:.3rem;text-transform:uppercase}
.ed-year{font-size:.7rem;color:var(--gold2);letter-spacing:3px;font-weight:600;margin-bottom:1.2rem;text-transform:uppercase}
.ed-desc{font-size:.8rem;color:var(--silver);line-height:1.7}
.ed-committees{margin-top:1.2rem}
.ed-cmds{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.5rem}
.ed-cmd-chip{
  background:rgba(0,80,255,.1);border:1px solid rgba(0,80,255,.2);
  border-radius:var(--r4);padding:.2rem .6rem;
  font-size:.62rem;color:var(--azure3);font-weight:600;letter-spacing:.5px;
}
.ed-tag{
  display:inline-block;margin-top:1.2rem;
  border-radius:var(--r50);padding:.25rem .8rem;
  font-size:.62rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;
}
.ed-tag.completed{background:rgba(0,80,255,.1);border:1px solid rgba(0,80,255,.25);color:var(--azure3)}
.ed-tag.upcoming{background:rgba(200,149,58,.1);border:1px solid rgba(200,149,58,.25);color:var(--gold2)}
.ed-tag.legacy{background:rgba(120,193,255,.08);border:1px solid rgba(120,193,255,.2);color:var(--sky)}
.ed-bar{position:absolute;top:0;left:0;right:0;height:1.5px;background:linear-gradient(90deg,var(--azure),var(--azure3),var(--gold));transform:scaleX(0);transform-origin:left;transition:.4s}
.edition-card:hover .ed-bar{transform:scaleX(1)}

.committees-section{background:var(--ink1)}
.committees-tabs{
  display:flex;gap:.5rem;
  background:rgba(0,0,0,.3);
  border:1px solid var(--glassborder);
  border-radius:var(--r8);padding:5px;
  display:inline-flex;margin-bottom:3rem;
}
.ctab{
  padding:.6rem 1.4rem;border:none;border-radius:var(--r4);
  background:transparent;color:var(--silver);
  font-size:.72rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;
  transition:all .25s;cursor:pointer;
}
.ctab.active{
  background:linear-gradient(135deg,var(--azure),var(--azure2));
  color:#fff;box-shadow:0 0 20px rgba(0,80,255,.3);
}

.committees-grid{
  display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));
  gap:1.5rem;max-width:1300px;margin:0 auto;
}

.cc{
  border-radius:var(--r16);padding:2rem;cursor:pointer;
  transition:all .4s cubic-bezier(.25,.46,.45,.94);
  position:relative;overflow:hidden;
  transform-style:preserve-3d;
}
.cc:hover{transform:translateY(-8px) scale(1.01)}

.cc-unga{background:linear-gradient(135deg,rgba(0,20,60,.9),rgba(0,40,100,.7));border:1px solid rgba(60,140,255,.25);box-shadow:inset 0 1px 0 rgba(120,193,255,.1)}
.cc-unga:hover{box-shadow:0 24px 60px rgba(0,0,0,.5),0 0 50px rgba(0,80,255,.2),inset 0 1px 0 rgba(120,193,255,.2)}
.cc-unga .cc-glow{background:radial-gradient(ellipse at top,rgba(0,80,255,.15),transparent 70%)}
.cc-unga .cc-abbr{color:#78c1ff}
.cc-unga .cc-bar{background:linear-gradient(90deg,#0050ff,#78c1ff,#c8953a)}

.cc-fifa{background:linear-gradient(135deg,rgba(0,40,20,.9),rgba(0,80,30,.6));border:1px solid rgba(50,220,120,.2)}
.cc-fifa:hover{box-shadow:0 24px 60px rgba(0,0,0,.5),0 0 50px rgba(50,220,120,.15)}
.cc-fifa .cc-glow{background:radial-gradient(ellipse at top,rgba(50,220,120,.1),transparent 70%)}
.cc-fifa .cc-abbr{color:#50dc78}
.cc-fifa .cc-bar{background:linear-gradient(90deg,#00ff7f,#50dc78,#00c853)}

.cc-unsc{background:linear-gradient(135deg,rgba(30,0,0,.9),rgba(60,10,10,.7));border:1px solid rgba(220,80,80,.2)}
.cc-unsc:hover{box-shadow:0 24px 60px rgba(0,0,0,.6),0 0 50px rgba(220,80,80,.15)}
.cc-unsc .cc-glow{background:radial-gradient(ellipse at top,rgba(220,80,80,.12),transparent 70%)}
.cc-unsc .cc-abbr{color:#f08080}
.cc-unsc .cc-bar{background:linear-gradient(90deg,#dc5050,#f08080,#ffc0c0)}

.cc-uncsw{background:linear-gradient(135deg,rgba(50,0,50,.9),rgba(90,20,80,.6));border:1px solid rgba(220,130,255,.2)}
.cc-uncsw:hover{box-shadow:0 24px 60px rgba(0,0,0,.5),0 0 50px rgba(220,130,255,.15)}
.cc-uncsw .cc-glow{background:radial-gradient(ellipse at top,rgba(200,100,220,.1),transparent 70%)}
.cc-uncsw .cc-abbr{color:#dc82ff}
.cc-uncsw .cc-bar{background:linear-gradient(90deg,#c864e8,#dc82ff,#f5c0ff)}

.cc-aippm{background:linear-gradient(135deg,rgba(40,20,0,.9),rgba(80,40,0,.7));border:1px solid rgba(255,160,0,.2)}
.cc-aippm:hover{box-shadow:0 24px 60px rgba(0,0,0,.5),0 0 50px rgba(255,160,0,.15)}
.cc-aippm .cc-glow{background:radial-gradient(ellipse at top,rgba(255,160,0,.1),transparent 70%)}
.cc-aippm .cc-abbr{color:#ffb030}
.cc-aippm .cc-bar{background:linear-gradient(90deg,#ff6b00,#ffb030,#ffd700)}

.cc-unep{background:linear-gradient(135deg,rgba(0,30,30,.9),rgba(0,60,50,.6));border:1px solid rgba(0,210,180,.2)}
.cc-unep:hover{box-shadow:0 24px 60px rgba(0,0,0,.5),0 0 50px rgba(0,210,180,.12)}
.cc-unep .cc-glow{background:radial-gradient(ellipse at top,rgba(0,210,180,.08),transparent 70%)}
.cc-unep .cc-abbr{color:#00d2b4}
.cc-unep .cc-bar{background:linear-gradient(90deg,#00b4a0,#00d2b4,#80ffe8)}

.cc-loksabha{background:linear-gradient(135deg,rgba(20,10,0,.9),rgba(60,30,0,.7));border:1px solid rgba(220,150,50,.2)}
.cc-loksabha:hover{box-shadow:0 24px 60px rgba(0,0,0,.5),0 0 50px rgba(220,150,50,.12)}
.cc-loksabha .cc-glow{background:radial-gradient(ellipse at top,rgba(220,150,50,.08),transparent 70%)}
.cc-loksabha .cc-abbr{color:#dc9632}
.cc-loksabha .cc-bar{background:linear-gradient(90deg,#dc9632,#ffc060,#ffe0a0)}

.cc-unhrc{background:linear-gradient(135deg,rgba(0,20,40,.9),rgba(0,40,70,.7));border:1px solid rgba(80,160,255,.2)}
.cc-unhrc:hover{box-shadow:0 24px 60px rgba(0,0,0,.5),0 0 50px rgba(80,160,255,.12)}
.cc-unhrc .cc-glow{background:radial-gradient(ellipse at top,rgba(80,160,255,.1),transparent 70%)}
.cc-unhrc .cc-abbr{color:#50a0ff}
.cc-unhrc .cc-bar{background:linear-gradient(90deg,#3080ff,#50a0ff,#a0d0ff)}

.cc-ipc{background:linear-gradient(135deg,rgba(20,20,20,.9),rgba(40,40,40,.7));border:1px solid rgba(200,200,200,.15)}
.cc-ipc:hover{box-shadow:0 24px 60px rgba(0,0,0,.6),0 0 40px rgba(200,200,200,.08)}
.cc-ipc .cc-glow{background:radial-gradient(ellipse at top,rgba(200,200,200,.05),transparent 70%)}
.cc-ipc .cc-abbr{color:#d0d0d0}
.cc-ipc .cc-bar{background:linear-gradient(90deg,#808080,#d0d0d0,#ffffff)}

.cc-bar{position:absolute;top:0;left:0;right:0;height:1.5px;transform:scaleX(0);transform-origin:left;transition:.4s}
.cc:hover .cc-bar{transform:scaleX(1)}
.cc-glow{position:absolute;inset:0;pointer-events:none;opacity:0;transition:.4s}
.cc:hover .cc-glow{opacity:1}
.cc-corner{
  position:absolute;top:1rem;right:1rem;
  width:28px;height:28px;
  border-top:1.5px solid currentColor;border-right:1.5px solid currentColor;
  border-radius:0 var(--r4) 0 0;opacity:.3;
}
.cc-abbr{
  font-family:'Syncopate',sans-serif;font-size:.72rem;font-weight:700;
  letter-spacing:3px;text-transform:uppercase;margin-bottom:.5rem;
  position:relative;z-index:1;
}
.cc-name{
  font-family:'Cormorant Garamond',serif;
  font-size:1.1rem;font-weight:400;color:var(--platinum);
  margin-bottom:.7rem;line-height:1.3;position:relative;z-index:1;
}
.cc-agenda{
  font-size:.76rem;color:var(--silver);line-height:1.65;
  margin-bottom:1.2rem;position:relative;z-index:1;
}
.cc-footer{
  display:flex;align-items:center;justify-content:space-between;
  position:relative;z-index:1;
}
.cc-level{
  font-size:.62rem;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;
  padding:.2rem .7rem;border-radius:var(--r50);
  background:rgba(255,255,255,.06);border:1px solid var(--glassborder);
  color:var(--silver);
}
.cc-arrow{
  color:var(--silver);font-size:.8rem;opacity:0;
  transform:translateX(-8px);transition:all .25s;
}
.cc:hover .cc-arrow{opacity:1;transform:translateX(0)}
.cc-edition-badge{
  font-size:.58rem;color:var(--dim);letter-spacing:2px;
  text-transform:uppercase;margin-top:.5rem;position:relative;z-index:1;
}

.cc-locked{
  background:linear-gradient(135deg,rgba(10,20,40,.6),rgba(6,14,30,.8));
  border:1px solid rgba(120,193,255,.06);
  border-radius:var(--r16);padding:2rem;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  min-height:200px;text-align:center;gap:.7rem;
}
.cc-locked-ico{font-size:1.8rem;opacity:.3}
.cc-locked-txt{font-size:.72rem;color:var(--dim);letter-spacing:3px;text-transform:uppercase;font-weight:600}
.cc-locked-badge{
  background:rgba(200,149,58,.08);border:1px solid rgba(200,149,58,.2);
  border-radius:var(--r50);padding:.25rem .9rem;
  font-size:.62rem;color:var(--gold2);font-weight:600;letter-spacing:2px;
  text-transform:uppercase;
}

.overlay{
  position:fixed;inset:0;z-index:100020;
  background:rgba(3,6,13,.92);
  backdrop-filter:blur(16px);
  display:flex;align-items:center;justify-content:center;
  padding:1rem;animation:fadeIn .3s ease;
  overflow-y:auto;overscroll-behavior:contain;
}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.cmodal{
  background:rgba(9,22,37,.95);
  border:1px solid var(--glassborder);
  border-radius:var(--r24);
  width:100%;max-width:680px;max-height:min(90vh,820px);
  overflow-y:auto;position:relative;
  animation:modalUp .4s cubic-bezier(.25,.46,.45,.94) both;
  box-shadow:0 40px 100px rgba(0,0,0,.7),var(--glow-azure);
}
@keyframes modalUp{from{opacity:0;transform:scale(.94) translateY(30px)}to{opacity:1;transform:scale(1) translateY(0)}}
.cmodal-header{
  padding:2.2rem 2.2rem 1.5rem;
  border-bottom:1px solid var(--glassborder);
  position:relative;
}
.cmodal-bar{
  position:absolute;top:0;left:0;right:0;height:2px;border-radius:var(--r24) var(--r24) 0 0;
}
.cmodal-abbr{
  font-family:'Syncopate',sans-serif;font-size:.65rem;font-weight:700;
  letter-spacing:4px;text-transform:uppercase;margin-bottom:.5rem;
}
.cmodal-name{
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(1.4rem,4vw,1.9rem);font-weight:400;
  color:var(--platinum);line-height:1.2;margin-bottom:1rem;
}
.cmodal-badges{display:flex;gap:.5rem;flex-wrap:wrap}
.cmod-badge{
  font-size:.6rem;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;
  padding:.2rem .7rem;border-radius:var(--r50);
  background:rgba(255,255,255,.05);border:1px solid var(--glassborder);color:var(--silver);
}
.cmodal-close{
  position:absolute;top:1.5rem;right:1.5rem;
  background:rgba(255,255,255,.06);border:1px solid var(--glassborder);
  border-radius:50%;width:36px;height:36px;
  display:flex;align-items:center;justify-content:center;
  color:var(--silver);font-size:.9rem;transition:all .2s;
}
.cmodal-close:hover{background:rgba(255,255,255,.1);color:var(--platinum)}
.cmodal-body{padding:2rem 2.2rem 2.2rem}
.cmodal-section{margin-bottom:1.8rem}
.cmodal-section-title{
  font-size:.62rem;font-weight:700;letter-spacing:3px;text-transform:uppercase;
  color:var(--gold2);margin-bottom:.8rem;display:flex;align-items:center;gap:8px;
}
.cmodal-section-title::before{content:'';width:16px;height:1px;background:var(--gold)}
.cmodal-text{font-size:.88rem;color:var(--silver);line-height:1.8}
.cmodal-agenda-box{
  background:rgba(0,80,255,.06);border:1px solid rgba(0,80,255,.15);
  border-radius:var(--r12);padding:1.2rem 1.4rem;
}
.cmodal-agenda-lbl{font-size:.6rem;letter-spacing:2px;color:var(--azure3);text-transform:uppercase;font-weight:600;margin-bottom:.4rem}
.cmodal-agenda-txt{font-family:'Cormorant Garamond',serif;font-size:1.05rem;font-style:italic;color:var(--platinum);line-height:1.5}
.eb-panel{display:flex;flex-wrap:wrap;gap:.7rem;margin-top:.5rem}
.eb-chip{
  background:var(--ghost);border:1px solid var(--glassborder);
  border-radius:var(--r8);padding:.75rem 1rem;min-width:140px;
  cursor:help;position:relative;transition:all .25s;
}
.eb-chip:hover{border-color:var(--glassborder2);background:var(--ghost2)}
.eb-role-lbl{font-size:.58rem;letter-spacing:2px;color:var(--dim);text-transform:uppercase;margin-bottom:3px}
.eb-name-val{font-size:.85rem;font-weight:600;color:var(--platinum)}
.eb-tooltip{
  position:absolute;bottom:calc(100% + 10px);left:50%;
  transform:translateX(-50%) translateY(4px);
  background:rgba(9,22,37,.98);border:1px solid var(--glassborder2);
  border-radius:var(--r8);padding:.7rem 1rem;
  width:220px;font-size:.72rem;color:var(--silver);line-height:1.5;
  pointer-events:none;opacity:0;transition:all .2s;z-index:10;
  box-shadow:0 16px 40px rgba(0,0,0,.5);white-space:normal;
}
.eb-chip:hover .eb-tooltip{opacity:1;transform:translateX(-50%) translateY(0)}
.cmodal-info-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.7rem;margin-top:.5rem}
.cmod-info{
  background:var(--ghost);border:1px solid var(--glassborder);
  border-radius:var(--r8);padding:.8rem 1rem;
}
.cmod-info-lbl{font-size:.58rem;letter-spacing:2px;color:var(--dim);text-transform:uppercase;margin-bottom:3px}
.cmod-info-val{font-size:.82rem;font-weight:600;color:var(--platinum)}

.oc-grid{
  display:flex;flex-direction:column;gap:.75rem;
  max-width:900px;margin:0 auto;
}
.oc-card{
  background:var(--ghost);border:1px solid var(--glassborder);
  border-radius:var(--r12);cursor:pointer;
  transition:all .3s;overflow:hidden;position:relative;
}
.oc-card-accent{
  position:absolute;left:0;top:0;bottom:0;width:2px;
  background:linear-gradient(var(--azure2),var(--gold));
  transform:scaleY(0);transform-origin:top;transition:.4s;
}
.oc-card.expanded .oc-card-accent{transform:scaleY(1)}
.oc-card:hover{border-color:var(--glassborder2);background:var(--ghost2)}
.oc-header{
  display:flex;align-items:center;gap:1rem;
  padding:1.2rem 1.4rem;
}
.oc-emoji{font-size:1.4rem;flex-shrink:0}
.oc-role{font-weight:600;font-size:.9rem;color:var(--platinum)}
.oc-dept{font-size:.65rem;letter-spacing:2px;color:var(--dim);text-transform:uppercase;margin-top:2px}
.oc-chevron{margin-left:auto;color:var(--dim);font-size:.7rem;transition:transform .3s}
.oc-card.expanded .oc-chevron{transform:rotate(180deg)}
.oc-body{
  max-height:0;overflow:hidden;
  transition:max-height .4s cubic-bezier(.25,.46,.45,.94);
}
.oc-card.expanded .oc-body{max-height:400px}
.oc-body-inner{
  padding:0 1.4rem 1.4rem;
  border-top:1px solid var(--glassborder);
  padding-top:1rem;
}
.oc-what{font-size:.82rem;color:var(--silver);line-height:1.7;margin-bottom:1rem}
.oc-contact-lbl{font-size:.6rem;letter-spacing:2px;color:var(--gold2);text-transform:uppercase;margin-bottom:.4rem;font-weight:600}
.oc-contact-txt{font-size:.78rem;color:var(--silver);line-height:1.6;margin-bottom:1rem}
.oc-skills{display:flex;flex-wrap:wrap;gap:.4rem}
.oc-skill{
  background:rgba(0,80,255,.08);border:1px solid rgba(0,80,255,.15);
  border-radius:var(--r50);padding:.2rem .7rem;
  font-size:.62rem;color:var(--azure3);letter-spacing:.5px;
}

.legacy-tabs{display:flex;gap:.5rem;margin-bottom:2.5rem;flex-wrap:wrap}
.ltab{
  padding:.5rem 1.2rem;border:1px solid var(--glassborder);
  border-radius:var(--r50);background:transparent;
  color:var(--silver);font-size:.68rem;font-weight:600;
  letter-spacing:2px;text-transform:uppercase;transition:all .25s;
}
.ltab.active{background:var(--ghost2);border-color:var(--gold2);color:var(--gold2)}
.legacy-grid{
  display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));
  gap:1rem;max-width:1200px;
}
.lcard{
  background:var(--ghost);border:1px solid var(--glassborder);
  border-radius:var(--r12);padding:1.3rem;
  transition:all .3s;position:relative;overflow:hidden;text-align:center;
}
.lcard-bar{position:absolute;top:0;left:0;right:0;height:1.5px;background:linear-gradient(90deg,var(--azure),var(--gold));transform:scaleX(0);transform-origin:left;transition:.35s}
.lcard:hover{border-color:var(--glassborder2);background:var(--ghost2);transform:translateY(-4px)}
.lcard:hover .lcard-bar{transform:scaleX(1)}
.lcard-avatar{font-size:1.8rem;margin-bottom:.7rem}
.lcard-name{font-weight:700;font-size:.88rem;color:var(--platinum);margin-bottom:.2rem}
.lcard-role{font-size:.65rem;letter-spacing:1.5px;color:var(--azure3);text-transform:uppercase;font-weight:600;margin-bottom:.3rem}
.lcard-committee{font-size:.72rem;color:var(--silver)}
.lcard-edition-badge{
  position:absolute;top:.6rem;right:.6rem;
  background:rgba(200,149,58,.1);border:1px solid rgba(200,149,58,.2);
  border-radius:var(--r50);padding:.15rem .5rem;
  font-size:.52rem;color:var(--gold2);letter-spacing:1px;font-weight:600;
}

.tba-section{
  max-width:900px;margin:0 auto;
  display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;
}
.tba-card{
  background:var(--ghost);border:1px solid var(--glassborder);
  border-radius:var(--r16);padding:2rem;
  position:relative;overflow:hidden;
}
.tba-card::before{
  content:'TBA';
  position:absolute;bottom:-1rem;right:-1rem;
  font-family:'Cormorant Garamond',serif;
  font-size:6rem;font-weight:700;
  color:rgba(255,255,255,.025);pointer-events:none;letter-spacing:-2px;
}
.tba-ico{font-size:2rem;margin-bottom:1rem;opacity:.7}
.tba-title{font-family:'Syncopate',sans-serif;font-size:.72rem;font-weight:700;letter-spacing:3px;color:var(--platinum);text-transform:uppercase;margin-bottom:.5rem}
.tba-desc{font-size:.8rem;color:var(--silver);line-height:1.65}
.tba-badge{
  display:inline-block;margin-top:1rem;
  background:rgba(200,149,58,.08);border:1px solid rgba(200,149,58,.2);
  border-radius:var(--r50);padding:.25rem .8rem;
  font-size:.6rem;color:var(--gold2);font-weight:600;letter-spacing:2px;text-transform:uppercase;
}

.contact-layout{
  display:grid;grid-template-columns:1fr 1.5fr;
  gap:clamp(2rem,6vw,6rem);max-width:1000px;margin:0 auto;
}
.contact-info-list{display:flex;flex-direction:column;gap:1.2rem}
.cinfo{display:flex;align-items:center;gap:1rem}
.cinfo-ico{
  width:42px;height:42px;flex-shrink:0;
  border-radius:var(--r8);background:var(--ghost2);
  border:1px solid var(--glassborder);
  display:flex;align-items:center;justify-content:center;font-size:1rem;
}
.cinfo-label{font-size:.6rem;letter-spacing:2px;color:var(--dim);text-transform:uppercase;margin-bottom:2px}
.cinfo-val{font-size:.88rem;color:var(--platinum);font-weight:500}
.socials{display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.5rem}
.soc-chip{
  display:flex;align-items:center;gap:.4rem;
  background:var(--ghost);border:1px solid var(--glassborder);
  border-radius:var(--r8);padding:.4rem .9rem;
  color:var(--silver);font-size:.75rem;font-weight:500;
  cursor:pointer;transition:all .25s;text-decoration:none;
}
.soc-chip:hover{border-color:var(--glassborder2);color:var(--sky);background:var(--ghost2)}
.contact-panel{
  background:var(--ghost);border:1px solid var(--glassborder);
  border-radius:var(--r16);padding:2rem;backdrop-filter:blur(12px);
}
.contact-panel-title{
  font-family:'Cormorant Garamond',serif;
  font-size:1.4rem;font-weight:400;color:var(--platinum);margin-bottom:.4rem;
}
.contact-panel-sub{font-size:.78rem;color:var(--silver);margin-bottom:1.5rem}
.fg{margin-bottom:1rem}
.fg label{display:block;font-size:.65rem;letter-spacing:2px;color:var(--silver);text-transform:uppercase;margin-bottom:.4rem}
.fg input,.fg textarea{
  width:100%;background:rgba(0,0,0,.3);
  border:1px solid var(--glassborder);border-radius:var(--r8);
  padding:.7rem 1rem;color:var(--platinum);font-size:.85rem;
  font-family:'Space Grotesk',sans-serif;
  transition:border-color .25s;outline:none;resize:none;
}
.fg input:focus,.fg textarea:focus{border-color:var(--glassborder2)}
.fg textarea{min-height:90px}
.btn-send{
  width:100%;background:linear-gradient(135deg,var(--azure),var(--azure2));
  color:#fff;border:none;padding:.9rem;border-radius:var(--r8);
  font-size:.78rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;
  transition:all .3s;margin-top:.5rem;
  box-shadow:0 0 30px rgba(0,80,255,.25);
}
.btn-send:hover{transform:translateY(-2px);box-shadow:0 8px 40px rgba(0,80,255,.45)}

.reg-overlay{
  position:fixed;inset:0;z-index:100020;
  background:rgba(3,6,13,.92);backdrop-filter:blur(16px);
  display:flex;align-items:center;justify-content:center;
  padding:1rem;animation:fadeIn .3s ease;
  overflow-y:auto;overscroll-behavior:contain;
}
.reg-modal{
  background:rgba(9,22,37,.97);
  border:1px solid var(--glassborder);
  border-radius:var(--r24);
  width:100%;max-width:560px;max-height:min(90vh,820px);
  overflow-y:auto;position:relative;
  animation:modalUp .4s cubic-bezier(.25,.46,.45,.94) both;
  box-shadow:0 40px 100px rgba(0,0,0,.7);
}
.reg-header{
  padding:2rem 2rem 1.5rem;
  border-bottom:1px solid var(--glassborder);
  background:linear-gradient(135deg,rgba(0,80,255,.06),transparent);
}
.reg-title{
  font-family:'Cormorant Garamond',serif;
  font-size:1.6rem;font-weight:400;color:var(--platinum);margin-bottom:.2rem;
}
.reg-sub{font-size:.75rem;color:var(--silver)}
.reg-body{padding:1.8rem 2rem 2rem}
.reg-close{
  position:absolute;top:1.5rem;right:1.5rem;
  background:rgba(255,255,255,.06);border:1px solid var(--glassborder);
  border-radius:50%;width:36px;height:36px;
  display:flex;align-items:center;justify-content:center;
  color:var(--silver);font-size:.9rem;transition:all .2s;
}
.reg-close:hover{background:rgba(255,255,255,.1);color:var(--platinum)}
.reg-select{
  width:100%;background:rgba(0,0,0,.3);
  border:1px solid var(--glassborder);border-radius:var(--r8);
  padding:.7rem 1rem;color:var(--platinum);font-size:.85rem;
  font-family:'Space Grotesk',sans-serif;outline:none;
  -webkit-appearance:none;
}
.reg-select:focus{border-color:var(--glassborder2)}
.field-err{font-size:.7rem;color:#f08080;margin-top:.3rem;display:block}
.success-wrap{text-align:center;padding:2rem}
.success-ico{font-size:3rem;margin-bottom:1rem}
.success-title{font-family:'Cormorant Garamond',serif;font-size:1.6rem;color:var(--platinum);margin-bottom:.5rem}
.success-desc{font-size:.88rem;color:var(--silver);line-height:1.7}
.reg-frow{display:grid;grid-template-columns:1fr 1fr;gap:1rem}

footer{
  background:var(--ink1);border-top:1px solid var(--glassborder);
  padding:clamp(3.5rem,7vw,6rem) clamp(1.5rem,5vw,4rem) 2rem;
  position:relative;z-index:2;
}
.footer-inner{max-width:1200px;margin:0 auto}
.footer-top{
  display:grid;grid-template-columns:2fr 1fr 1fr 1fr;
  gap:clamp(2rem,4vw,5rem);margin-bottom:3rem;
}
.footer-brand{font-family:'Syncopate',sans-serif;font-size:1rem;font-weight:700;letter-spacing:4px;color:var(--platinum);margin-bottom:.8rem}
.footer-brand-dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--gold2);margin-left:4px;vertical-align:middle}
.footer-desc{color:var(--silver);font-size:.8rem;line-height:1.7;max-width:270px}
.footer-col-title{font-size:.62rem;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--platinum);margin-bottom:1rem}
.footer-links{display:flex;flex-direction:column;gap:.55rem}
.footer-links a{color:var(--silver);font-size:.8rem;cursor:pointer;text-decoration:none;transition:color .2s;letter-spacing:.3px}
.footer-links a:hover{color:var(--sky)}
.footer-bottom{
  border-top:1px solid var(--glassborder);padding-top:1.4rem;
  display:flex;justify-content:space-between;align-items:center;
  flex-wrap:wrap;gap:.8rem;
}
.footer-copy{color:var(--dim);font-size:.72rem;letter-spacing:.5px}
.footer-right{color:var(--dim);font-size:.72rem}
.footer-right span{color:var(--gold2)}

.toast{
  position:fixed;bottom:2rem;right:2rem;z-index:900;
  background:rgba(9,22,37,.98);border:1px solid var(--glassborder2);
  border-radius:var(--r12);padding:1rem 1.5rem;
  color:var(--platinum);font-size:.82rem;font-weight:500;
  box-shadow:0 20px 60px rgba(0,0,0,.5),var(--glow-azure);
  animation:toastIn .35s cubic-bezier(.25,.46,.45,.94) both;
  max-width:320px;display:flex;align-items:center;gap:.6rem;
}
@keyframes toastIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}

.sr{opacity:0;transform:translateY(28px);transition:opacity .7s ease,transform .7s ease}
.sr.vis{opacity:1;transform:translateY(0)}
.sr-delay-1{transition-delay:.1s}
.sr-delay-2{transition-delay:.2s}
.sr-delay-3{transition-delay:.3s}
.sr-delay-4{transition-delay:.4s}



.entry-lock{
  position:fixed;inset:0;z-index:100000;display:grid;place-items:center;
  background:
    radial-gradient(circle at 18% 18%,rgba(0,80,255,.18),transparent 32%),
    radial-gradient(circle at 82% 70%,rgba(200,149,58,.13),transparent 34%),
    linear-gradient(135deg,#020815 0%,#061528 42%,#02050b 100%);
  overflow:hidden;padding:clamp(1.5rem,5vw,4rem);
}
.entry-lock::before{
  content:"";position:absolute;inset:0;opacity:.16;
  background-image:linear-gradient(rgba(120,193,255,.18) 1px,transparent 1px),linear-gradient(90deg,rgba(120,193,255,.18) 1px,transparent 1px);
  background-size:78px 78px;mask-image:radial-gradient(circle at center,black 0%,transparent 78%);
}

.entry-motion-tags{position:absolute;inset:0;z-index:4;pointer-events:none;overflow:hidden;opacity:1;mask-image:linear-gradient(90deg,black 0%,black 28%,transparent 43%,transparent 57%,black 72%,black 100%)}
.entry-motion-tag{position:absolute;display:inline-flex;align-items:center;gap:.4rem;border:1px solid rgba(120,193,255,.26);background:linear-gradient(135deg,rgba(255,255,255,.10),rgba(120,193,255,.055),rgba(48,128,255,.04));backdrop-filter:blur(10px);border-radius:999px;padding:.62rem .95rem;font-size:clamp(.56rem,.95vw,.78rem);font-weight:900;letter-spacing:.26em;text-transform:uppercase;color:rgba(235,244,255,.82);text-shadow:0 0 12px rgba(120,193,255,.36);box-shadow:0 0 34px rgba(120,193,255,.14),inset 0 0 18px rgba(255,255,255,.035);white-space:nowrap;animation:entryTagDrift var(--dur,22s) ease-in-out infinite alternate;animation-delay:var(--delay,0s);will-change:transform,opacity}
.entry-motion-tag::before{content:"";width:6px;height:6px;border-radius:50%;background:linear-gradient(135deg,var(--gold2),var(--sky));box-shadow:0 0 14px rgba(120,193,255,.46)}
.entry-motion-tag:nth-child(1){left:4%;top:10%;--dur:18s;--delay:-4s}.entry-motion-tag:nth-child(2){left:70%;top:10%;--dur:22s;--delay:-9s}.entry-motion-tag:nth-child(3){left:78%;top:25%;--dur:19s;--delay:-2s}.entry-motion-tag:nth-child(4){left:5%;top:31%;--dur:25s;--delay:-13s}.entry-motion-tag:nth-child(5){left:79%;top:44%;--dur:21s;--delay:-7s}.entry-motion-tag:nth-child(6){left:6%;top:53%;--dur:26s;--delay:-16s}.entry-motion-tag:nth-child(7){left:73%;top:62%;--dur:23s;--delay:-5s}.entry-motion-tag:nth-child(8){left:36%;top:7%;--dur:29s;--delay:-11s}.entry-motion-tag:nth-child(9){left:16%;top:84%;--dur:20s;--delay:-6s}.entry-motion-tag:nth-child(10){left:72%;top:83%;--dur:27s;--delay:-18s}.entry-motion-tag:nth-child(11){left:2%;top:72%;--dur:19s;--delay:-3s}.entry-motion-tag:nth-child(12){left:82%;top:73%;--dur:24s;--delay:-12s}.entry-motion-tag:nth-child(13){left:2%;top:18%;--dur:31s;--delay:-17s}.entry-motion-tag:nth-child(14){left:64%;top:18%;--dur:28s;--delay:-8s}.entry-motion-tag:nth-child(15){left:1%;top:44%;--dur:30s;--delay:-20s}.entry-motion-tag:nth-child(16){left:86%;top:34%;--dur:26s;--delay:-14s}.entry-motion-tag:nth-child(17){left:30%;top:88%;--dur:22s;--delay:-10s}.entry-motion-tag:nth-child(18){left:62%;top:91%;--dur:25s;--delay:-22s}.entry-motion-tag:nth-child(19){left:9%;top:62%;--dur:27s;--delay:-15s}.entry-motion-tag:nth-child(20){left:76%;top:55%;--dur:24s;--delay:-1s}
@keyframes entryTagDrift{0%{transform:translate3d(-26px,12px,0) rotate(-5deg);opacity:.48}35%{opacity:.96}70%{opacity:.70}100%{transform:translate3d(48px,-30px,0) rotate(6deg);opacity:.86}}
@media(max-width:760px),(prefers-reduced-motion:reduce){.entry-motion-tags{opacity:.28}.entry-motion-tag{animation:none!important;transform:none!important}.entry-motion-tag:nth-child(n+7){display:none}}

.entry-lock-card{
  position:relative;z-index:2;width:min(980px,100%);border:1px solid rgba(120,193,255,.18);
  background:linear-gradient(180deg,rgba(8,18,34,.86),rgba(4,9,18,.94));
  border-radius:28px;padding:clamp(2rem,6vw,4.8rem);text-align:center;
  box-shadow:0 40px 140px rgba(0,0,0,.65),0 0 80px rgba(0,80,255,.14),inset 0 0 70px rgba(120,193,255,.035);
  backdrop-filter:blur(20px);
}
.entry-lock-icon{font-size:2.8rem;margin-bottom:1rem;filter:drop-shadow(0 0 24px rgba(120,193,255,.4))}
.entry-lock-kicker{font-size:.72rem;letter-spacing:.38em;text-transform:uppercase;color:var(--gold2);font-weight:800;margin-bottom:1rem}
.entry-lock-title{font-family:'Cormorant Garamond',serif;font-size:clamp(4rem,13vw,9rem);font-weight:300;line-height:.82;letter-spacing:-.06em;color:var(--platinum);margin-bottom:1rem}
.entry-lock-title span{font-style:italic;background:linear-gradient(90deg,var(--ice),var(--azure3) 45%,var(--gold3));-webkit-background-clip:text;background-clip:text;color:transparent}
.entry-lock-text{max-width:680px;margin:0 auto 2.3rem;color:var(--silver);line-height:1.8;font-size:clamp(.95rem,1.6vw,1.08rem)}
.entry-lock-actions{display:grid;grid-template-columns:1fr 1fr;gap:1.1rem;max-width:760px;margin:0 auto}
.entry-choice{position:relative;overflow:hidden;border-radius:20px;border:1px solid rgba(255,255,255,.10);padding:1.45rem 1.2rem;background:rgba(255,255,255,.045);color:var(--platinum);text-align:left;transition:.25s;min-height:130px}
.entry-choice::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 20% 20%,rgba(120,193,255,.20),transparent 45%);opacity:.55;transition:.25s}
.entry-choice strong{position:relative;z-index:1;display:block;font-size:1rem;letter-spacing:.18em;text-transform:uppercase;margin-bottom:.65rem;color:#fff}
.entry-choice span{position:relative;z-index:1;color:var(--silver);font-size:.86rem;line-height:1.6;display:block}
.entry-choice.primary{background:linear-gradient(135deg,rgba(200,149,58,.95),rgba(245,212,154,.95));color:#000;border-color:rgba(245,212,154,.85)}
.entry-choice.primary strong,.entry-choice.primary span{color:#06101b}.entry-choice:hover{transform:translateY(-4px);box-shadow:0 26px 70px rgba(0,80,255,.22);border-color:rgba(120,193,255,.35)}
.entry-choice.primary:hover{box-shadow:0 26px 70px rgba(200,149,58,.24)}
.current-live-strip{margin-top:2.4rem;display:grid;grid-template-columns:repeat(7,1fr);gap:.7rem}
.current-live-chip{border:1px solid rgba(120,193,255,.18);background:rgba(120,193,255,.055);border-radius:14px;padding:.9rem .5rem;text-align:center;font-size:.76rem;font-weight:800;letter-spacing:.15em;color:var(--ice);transition:.25s}
.current-live-chip:hover{transform:translateY(-3px);border-color:rgba(200,149,58,.4);color:var(--gold2);box-shadow:0 16px 40px rgba(0,80,255,.14)}
.legacy-placard-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.2rem}
.legacy-placard{position:relative;overflow:hidden;border-radius:18px;border:1px solid rgba(120,193,255,.16);background:linear-gradient(145deg,rgba(8,18,34,.82),rgba(255,255,255,.025));padding:1.2rem;box-shadow:0 22px 70px rgba(0,0,0,.34);transition:.28s}
.legacy-placard::after{content:"";position:absolute;inset:auto -20% -45% -20%;height:65%;background:radial-gradient(circle,rgba(200,149,58,.12),transparent 65%);pointer-events:none}.legacy-placard:hover{transform:translateY(-5px);border-color:rgba(200,149,58,.35)}
.legacy-placard-head{position:relative;z-index:1;display:flex;justify-content:space-between;gap:1rem;align-items:center;margin-bottom:1rem;padding-bottom:.85rem;border-bottom:1px solid rgba(255,255,255,.08)}
.legacy-committee-name{font-family:'Syncopate',sans-serif;font-size:.78rem;letter-spacing:2.5px;color:var(--platinum);font-weight:700}.legacy-placard-badge{font-size:.58rem;border:1px solid rgba(200,149,58,.32);color:var(--gold2);border-radius:999px;padding:.25rem .55rem;white-space:nowrap}
.legacy-member-list{position:relative;z-index:1;display:flex;flex-direction:column;gap:.65rem}.legacy-member{display:grid;grid-template-columns:34px 1fr;gap:.7rem;align-items:center;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.055);border-radius:12px;padding:.65rem}.legacy-member-emoji{font-size:1.2rem}.legacy-member-name{font-size:.84rem;color:var(--platinum);font-weight:700}.legacy-member-role{font-size:.62rem;text-transform:uppercase;letter-spacing:1.5px;color:var(--azure3);font-weight:700;margin-top:.1rem}


/* custom cursor field disabled */
.ag-field,.ag-aura{display:none!important}
.ag-particle{position:absolute;left:calc(var(--x,0) * 1%);top:calc(var(--y,0) * 1%);width:12px;height:12px;border-radius:50%;will-change:transform;transform:translate3d(0,0,0);transition:opacity .3s;background:radial-gradient(circle,rgba(255,255,255,.92),rgba(255,255,255,.13) 48%,transparent 72%);box-shadow:0 0 18px rgba(255,255,255,.35)}
.ag-particle::after{content:"";position:absolute;inset:-10px;border:1px solid rgba(255,255,255,.08);border-radius:40%;transform:rotate(35deg)}
.ag-particle.gold{background:radial-gradient(circle,rgba(245,212,154,.96),rgba(200,149,58,.18) 52%,transparent 76%);box-shadow:0 0 24px rgba(200,149,58,.42)}
.ag-particle.cyan{background:radial-gradient(circle,rgba(120,193,255,.96),rgba(0,80,255,.16) 50%,transparent 76%);box-shadow:0 0 26px rgba(120,193,255,.36)}
.ag-particle.violet{background:radial-gradient(circle,rgba(120,193,255,.86),rgba(24,86,175,.16) 52%,transparent 76%);box-shadow:0 0 26px rgba(120,193,255,.30)}
.ag-particle.glass{width:18px;height:10px;border-radius:4px;background:linear-gradient(135deg,rgba(255,255,255,.16),rgba(120,193,255,.05));border:1px solid rgba(255,255,255,.11);box-shadow:0 0 24px rgba(120,193,255,.12)}
.ag-particle[data-x="7"]{--x:7}.ag-particle[data-x="16"]{--x:16}.ag-particle[data-x="27"]{--x:27}.ag-particle[data-x="38"]{--x:38}.ag-particle[data-x="49"]{--x:49}.ag-particle[data-x="58"]{--x:58}.ag-particle[data-x="66"]{--x:66}.ag-particle[data-x="78"]{--x:78}.ag-particle[data-x="88"]{--x:88}.ag-particle[data-x="22"]{--x:22}.ag-particle[data-x="72"]{--x:72}.ag-particle[data-x="92"]{--x:92}.ag-particle[data-x="12"]{--x:12}.ag-particle[data-x="42"]{--x:42}.ag-particle[data-x="84"]{--x:84}.ag-particle[data-x="32"]{--x:32}
.ag-particle[data-y="22"]{--y:22}.ag-particle[data-y="58"]{--y:58}.ag-particle[data-y="36"]{--y:36}.ag-particle[data-y="74"]{--y:74}.ag-particle[data-y="18"]{--y:18}.ag-particle[data-y="46"]{--y:46}.ag-particle[data-y="67"]{--y:67}.ag-particle[data-y="28"]{--y:28}.ag-particle[data-y="61"]{--y:61}.ag-particle[data-y="83"]{--y:83}.ag-particle[data-y="86"]{--y:86}.ag-particle[data-y="15"]{--y:15}.ag-particle[data-y="40"]{--y:40}.ag-particle[data-y="55"]{--y:55}.ag-particle[data-y="82"]{--y:82}.ag-particle[data-y="12"]{--y:12}
button,a,.cc,.edition-card,.feat,.oc-card,.entry-choice,.cinfo,.ltab,.eb-chip{transform:translate3d(var(--ag-tx,0),var(--ag-ty,0),0) rotateX(var(--ag-rx,0)) rotateY(var(--ag-ry,0));transition:transform .18s ease,box-shadow .24s ease,border-color .24s ease,background .24s ease,color .24s ease}
.entry-lock-logo{display:block;width:clamp(118px,18vw,190px);height:auto;margin:0 auto 1.25rem;object-fit:contain;filter:drop-shadow(0 0 24px rgba(120,193,255,.34)) drop-shadow(0 0 34px rgba(200,149,58,.20))}
@media(max-width:760px){.ag-field{display:none!important}button,a,.cc,.edition-card,.feat,.oc-card,.entry-choice,.cinfo,.ltab,.eb-chip{transition:transform .24s cubic-bezier(.2,.8,.2,1),box-shadow .24s ease,border-color .24s ease,background .24s ease,color .24s ease}}
@media(prefers-reduced-motion:reduce){.ag-field{display:none!important}button,a,.cc,.edition-card,.feat,.oc-card,.entry-choice,.cinfo,.ltab,.eb-chip{transform:none!important;transition:box-shadow .24s ease,border-color .24s ease,background .24s ease,color .24s ease}}

/* buddy-inspired gradient texture merge */
.hero-bg{
  background:
    radial-gradient(ellipse 72% 52% at 50% -10%,rgba(0,80,255,.18) 0%,transparent 60%),
    radial-gradient(circle at var(--mx,50%) var(--my,50%),rgba(120,193,255,.10),transparent 20%),
    radial-gradient(ellipse 48% 36% at 83% 70%,rgba(64,159,255,.12) 0%,transparent 64%),
    radial-gradient(ellipse 38% 42% at 12% 62%,rgba(18,78,158,.12) 0%,transparent 60%),
    radial-gradient(ellipse 42% 32% at 90% 28%,rgba(200,149,58,.07) 0%,transparent 60%)!important;
}
.hero-grid{opacity:.05;background-size:72px 72px!important}
.hero-grid-diagonal{opacity:.03;background-size:138px 138px!important}
.nav{
  background:linear-gradient(90deg,rgba(3,6,13,.46),rgba(5,18,42,.34),rgba(3,6,13,.36));
  backdrop-filter:blur(16px) saturate(1.2);
}
.nav.solid{
  background:linear-gradient(90deg,rgba(3,6,13,.90),rgba(5,18,42,.84),rgba(3,6,13,.88));
  box-shadow:0 18px 55px rgba(0,0,0,.28),0 0 42px rgba(0,80,255,.08);
}
.nav-links a:hover{color:#fff;text-shadow:0 0 18px rgba(120,193,255,.28)}
.entry-lock{
  background:
    radial-gradient(circle at 18% 18%,rgba(0,80,255,.20),transparent 32%),
    radial-gradient(circle at 72% 26%,rgba(64,159,255,.16),transparent 34%),
    radial-gradient(circle at 82% 70%,rgba(200,149,58,.13),transparent 34%),
    linear-gradient(135deg,#020815 0%,#03172d 46%,#02050b 100%)!important;
}
.entry-lock::before{background-image:linear-gradient(rgba(120,193,255,.16) 1px,transparent 1px),linear-gradient(90deg,rgba(64,159,255,.12) 1px,transparent 1px),linear-gradient(45deg,rgba(200,149,58,.14) 1px,transparent 1px)!important;background-size:78px 78px,78px 78px,156px 156px!important}
.entry-lock-card{background:linear-gradient(145deg,rgba(255,255,255,.105),rgba(255,255,255,.035))!important;box-shadow:0 40px 130px rgba(0,0,0,.60),0 0 90px rgba(64,159,255,.12)!important}
.entry-choice.primary{background:linear-gradient(135deg,rgba(200,149,58,.22),rgba(120,193,255,.12),rgba(48,128,255,.08))!important}

@media(max-width:720px){.entry-lock-actions{grid-template-columns:1fr}.current-live-strip{grid-template-columns:repeat(2,1fr)}.entry-choice{text-align:center}.legacy-placard-grid{grid-template-columns:1fr}}



/* FINAL urgent fixes: bigger crest, positioned lock SEO tags, normal cursor */
.entry-lock-logo{width:clamp(170px,15vw,260px)!important;max-height:210px!important;margin:0 auto 1rem!important;filter:drop-shadow(0 0 32px rgba(120,193,255,.62)) drop-shadow(0 0 34px rgba(200,149,58,.28))!important}
.entry-lock-card{z-index:5!important;width:min(1080px,calc(100vw - 56px))!important;padding:clamp(2rem,4.5vw,4.2rem)!important}
.entry-motion-tags{z-index:2!important;opacity:1!important;mask-image:none!important}
.entry-motion-tag{opacity:.78!important;animation-timing-function:linear!important;animation-iteration-count:infinite!important;will-change:transform;transform:translate3d(0,0,0);}
.entry-motion-tag:nth-child(4n+1){animation-name:entryFloatOne!important}.entry-motion-tag:nth-child(4n+2){animation-name:entryFloatTwo!important}.entry-motion-tag:nth-child(4n+3){animation-name:entryFloatThree!important}.entry-motion-tag:nth-child(4n){animation-name:entryFloatFour!important}
.entry-motion-tag:nth-child(1){left:4%;top:7%}.entry-motion-tag:nth-child(2){left:72%;top:7%}.entry-motion-tag:nth-child(3){left:84%;top:18%}.entry-motion-tag:nth-child(4){left:3%;top:23%}.entry-motion-tag:nth-child(5){left:86%;top:34%}.entry-motion-tag:nth-child(6){left:5%;top:45%}.entry-motion-tag:nth-child(7){left:80%;top:51%}.entry-motion-tag:nth-child(8){left:32%;top:5%}.entry-motion-tag:nth-child(9){left:12%;top:77%}.entry-motion-tag:nth-child(10){left:67%;top:79%}.entry-motion-tag:nth-child(11){left:3%;top:63%}.entry-motion-tag:nth-child(12){left:83%;top:68%}.entry-motion-tag:nth-child(13){left:18%;top:12%}.entry-motion-tag:nth-child(14){left:61%;top:15%}.entry-motion-tag:nth-child(15){left:19%;top:88%}.entry-motion-tag:nth-child(16){left:77%;top:88%}.entry-motion-tag:nth-child(17){left:8%;top:88%}.entry-motion-tag:nth-child(18){left:55%;top:90%}.entry-motion-tag:nth-child(19){left:7%;top:55%}.entry-motion-tag:nth-child(20){left:74%;top:43%}
@keyframes entryFloatOne{0%{transform:translate3d(-80px,8px,0) rotate(-4deg);opacity:.42}50%{transform:translate3d(34px,-18px,0) rotate(2deg);opacity:.92}100%{transform:translate3d(120px,12px,0) rotate(5deg);opacity:.58}}
@keyframes entryFloatTwo{0%{transform:translate3d(90px,-10px,0) rotate(4deg);opacity:.45}50%{transform:translate3d(-28px,24px,0) rotate(-2deg);opacity:.9}100%{transform:translate3d(-130px,-8px,0) rotate(-5deg);opacity:.6}}
@keyframes entryFloatThree{0%{transform:translate3d(-35px,42px,0) rotate(2deg);opacity:.48}50%{transform:translate3d(46px,-34px,0) rotate(-3deg);opacity:.96}100%{transform:translate3d(-12px,44px,0) rotate(3deg);opacity:.68}}
@keyframes entryFloatFour{0%{transform:translate3d(28px,-46px,0) rotate(-3deg);opacity:.46}50%{transform:translate3d(-62px,20px,0) rotate(3deg);opacity:.88}100%{transform:translate3d(52px,54px,0) rotate(-1deg);opacity:.64}}
.ag-field,.ag-aura,.ag-particle{display:none!important}

@media(max-width:960px){
  .nav-links{display:none}.hamburger{display:flex}
  .about-layout{grid-template-columns:1fr}.about-visual{display:none}
  .editions-grid{grid-template-columns:1fr 1fr}
  .footer-top{grid-template-columns:1fr 1fr;gap:2rem}
  .contact-layout{grid-template-columns:1fr}
  .tba-section{grid-template-columns:1fr}
  .countdown-grid{gap:.8rem}
  .hero-sphere{display:none}
}
@media(max-width:640px){
  .editions-grid{grid-template-columns:1fr}
  .committees-grid{grid-template-columns:1fr}
  .legacy-grid{grid-template-columns:repeat(2,1fr)}
  .footer-top{grid-template-columns:1fr}
  .hero-metrics{gap:2rem}
  .reg-frow{grid-template-columns:1fr}
  .cmodal-info-grid{grid-template-columns:1fr 1fr}
  .countdown-grid{grid-template-columns:repeat(2,1fr)}
}

.admin-stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.2rem;margin-bottom:2rem}
.stat-card{background:rgba(255,255,255,.02);border:1px solid var(--glassborder);border-radius:var(--r12);padding:1.4rem;text-align:left;position:relative;overflow:hidden;transition:all .3s}
.stat-card:hover{border-color:rgba(255,255,255,.12);transform:translateY(-2px)}
.stat-card-bar{position:absolute;bottom:0;left:0;right:0;height:2px;background:var(--azure)}
.stat-card.gold-bar .stat-card-bar{background:var(--gold)}
.stat-val{font-family:'Cormorant Garamond',serif;font-size:2.2rem;font-weight:600;line-height:1;margin-bottom:.4rem;color:var(--platinum)}
.stat-lbl{font-size:.6rem;color:var(--dim);letter-spacing:2px;text-transform:uppercase}
@media(max-width:768px){.admin-stats-grid{grid-template-columns:1fr 1fr}}

/* FINAL FIX: lock screen visible on laptop heights + clearer crest + highlighted choices */
.entry-lock{
  align-items:center!important;
  justify-items:center!important;
  padding:18px!important;
  overflow:auto!important;
  min-height:100svh!important;
}
.entry-lock-card{
  width:min(930px,calc(100vw - 34px))!important;
  max-height:calc(100svh - 36px)!important;
  overflow-y:auto!important;
  padding:clamp(1rem,2.5vh,2rem) clamp(1rem,4vw,2.4rem)!important;
  display:flex!important;
  flex-direction:column!important;
  align-items:center!important;
  justify-content:center!important;
  gap:.45rem!important;
}
.entry-lock-logo{
  width:clamp(96px,13vh,148px)!important;
  max-height:18vh!important;
  opacity:1!important;
  border-radius:50%!important;
  padding:5px!important;
  background:radial-gradient(circle,rgba(255,255,255,.98) 0%,rgba(255,255,255,.95) 58%,rgba(120,193,255,.20) 61%,transparent 70%)!important;
  box-shadow:0 0 0 1px rgba(255,255,255,.36),0 0 34px rgba(120,193,255,.28),0 0 52px rgba(200,149,58,.18)!important;
  filter:brightness(1.08) saturate(1.18) contrast(1.06) drop-shadow(0 0 22px rgba(120,193,255,.30))!important;
  margin:0 auto .7rem!important;
}
.entry-lock-kicker{margin-bottom:.45rem!important}
.entry-lock-title{
  font-size:clamp(3.4rem,9.5vw,6.8rem)!important;
  line-height:.82!important;
  margin-bottom:.35rem!important;
}
.entry-lock-text{
  max-width:740px!important;
  margin:0 auto 1rem!important;
  line-height:1.6!important;
  font-size:clamp(.84rem,1.4vw,1rem)!important;
}
.entry-lock-actions{
  width:100%!important;
  max-width:860px!important;
  gap:1rem!important;
  margin-top:.3rem!important;
}
.entry-choice{
  min-height:102px!important;
  padding:1.15rem 1.25rem!important;
  border:1px solid rgba(120,193,255,.30)!important;
  background:linear-gradient(135deg,rgba(255,255,255,.095),rgba(120,193,255,.055))!important;
  box-shadow:0 18px 52px rgba(0,0,0,.30), inset 0 0 28px rgba(255,255,255,.025)!important;
}
.entry-choice strong{font-size:clamp(.84rem,1.2vw,1rem)!important;color:#fff!important}
.entry-choice span{font-size:clamp(.78rem,1vw,.88rem)!important;color:rgba(235,244,255,.76)!important}
.entry-choice.primary{
  background:linear-gradient(135deg,#d7b46a 0%,#fff0b7 42%,#7fc8ff 100%)!important;
  border-color:rgba(255,235,170,.88)!important;
  box-shadow:0 22px 70px rgba(215,180,106,.26),0 0 46px rgba(120,193,255,.16)!important;
}
.entry-choice.primary strong,.entry-choice.primary span{color:#030913!important}
@media(max-height:760px){
  .entry-lock-card{justify-content:flex-start!important}
  .entry-lock-logo{width:92px!important;max-height:92px!important;margin-bottom:.45rem!important}
  .entry-lock-title{font-size:clamp(3rem,8vw,5.6rem)!important}
  .entry-lock-text{font-size:.88rem!important;margin-bottom:.75rem!important}
  .entry-choice{min-height:90px!important;padding:1rem!important}
}
@media(max-width:720px){
  .entry-lock-card{justify-content:flex-start!important}
  .entry-lock-actions{grid-template-columns:1fr!important}
}

/* URGENT FINAL: visible SEO moving tags on lock screen */
.entry-motion-tags{z-index:4!important;opacity:1!important;mask-image:linear-gradient(90deg,black 0%,black 30%,transparent 43%,transparent 57%,black 70%,black 100%)!important}
.entry-motion-tag{opacity:.92!important;color:rgba(245,250,255,.86)!important;border-color:rgba(120,193,255,.30)!important}
.entry-lock-card{z-index:5!important}

/* extracted premium lock/access gateway */
.lock-access{
  position:fixed;inset:0;z-index:100000;display:grid;place-items:center;isolation:isolate;
  min-height:100svh;padding:clamp(14px,2.5vh,28px);overflow:hidden;
  background:
    radial-gradient(circle at 16% 18%,rgba(0,80,255,.26),transparent 30%),
    radial-gradient(circle at 76% 20%,rgba(64,159,255,.20),transparent 32%),
    radial-gradient(circle at 86% 78%,rgba(232,184,109,.18),transparent 34%),
    linear-gradient(135deg,#01030a 0%,#050d1f 38%,#03172d 66%,#02040b 100%);
}
.lock-access::before{
  content:"";position:absolute;inset:-18%;z-index:0;opacity:.58;pointer-events:none;
  background:
    radial-gradient(circle at 50% 42%,rgba(120,193,255,.18),transparent 20%),
    conic-gradient(from 120deg at 50% 50%,rgba(120,193,255,.14),transparent 12%,rgba(232,184,109,.12) 28%,transparent 43%,rgba(64,159,255,.12) 68%,transparent 82%,rgba(120,193,255,.14));
  filter:blur(30px);animation:lockMeshOrbit 18s ease-in-out infinite alternate;
}
.lock-access::after{
  content:"";position:absolute;inset:0;z-index:1;pointer-events:none;opacity:.18;
  background-image:
    linear-gradient(rgba(120,193,255,.22) 1px,transparent 1px),
    linear-gradient(90deg,rgba(64,159,255,.15) 1px,transparent 1px),
    linear-gradient(rgba(255,255,255,.05) 50%,transparent 50%);
  background-size:76px 76px,76px 76px,100% 5px;
  mask-image:radial-gradient(ellipse at 50% 48%,black 0%,black 46%,transparent 82%);
  animation:lockGridShift 14s linear infinite;
}
.lock-access-mesh{
  position:absolute;inset:-30%;z-index:0;pointer-events:none;opacity:.36;
  background:
    radial-gradient(circle at 30% 28%,rgba(120,193,255,.32),transparent 18%),
    radial-gradient(circle at 70% 36%,rgba(64,159,255,.25),transparent 20%),
    radial-gradient(circle at 58% 78%,rgba(232,184,109,.22),transparent 22%);
  filter:blur(46px);animation:lockMeshDrift 20s ease-in-out infinite alternate;
}
.lock-access-rings{
  position:absolute;z-index:1;left:50%;top:51%;width:min(76vw,900px);aspect-ratio:1/1;
  transform:translate(-50%,-50%);border-radius:50%;pointer-events:none;opacity:.38;
  background:
    radial-gradient(circle,transparent 0 47%,rgba(120,193,255,.16) 47.2% 47.4%,transparent 47.8% 57%,rgba(232,184,109,.16) 57.2% 57.5%,transparent 58%),
    conic-gradient(from 0deg,transparent 0 12%,rgba(120,193,255,.18) 13% 16%,transparent 17% 44%,rgba(232,184,109,.18) 46% 49%,transparent 50% 78%,rgba(64,159,255,.15) 79% 82%,transparent 83%);
  animation:lockRingSpin 28s linear infinite;
}
.floating-seo-tags{
  position:absolute;inset:0;z-index:2;pointer-events:none;overflow:hidden;
  mask-image:radial-gradient(ellipse at 50% 48%,transparent 0 34%,black 52%);
}
.floating-seo-tag{
  position:absolute;left:var(--x);top:var(--y);display:inline-flex;align-items:center;gap:.42rem;
  padding:clamp(.42rem,.75vw,.66rem) clamp(.62rem,1vw,.95rem);border-radius:999px;
  border:1px solid rgba(120,193,255,.24);
  background:linear-gradient(135deg,rgba(255,255,255,.12),rgba(120,193,255,.06),rgba(64,159,255,.04));
  color:rgba(241,248,255,.78);font-size:clamp(.54rem,.78vw,.72rem);font-weight:900;
  letter-spacing:.22em;text-transform:uppercase;white-space:nowrap;text-shadow:0 0 13px rgba(120,193,255,.34);
  box-shadow:0 0 30px rgba(120,193,255,.12),inset 0 0 18px rgba(255,255,255,.04);
  backdrop-filter:blur(12px);animation:floatTag var(--duration) ease-in-out infinite both;
  animation-delay:var(--delay);will-change:transform,opacity;
}
.floating-seo-tag::before{
  content:"";width:5px;height:5px;border-radius:50%;
  background:linear-gradient(135deg,var(--gold2),var(--sky));
  box-shadow:0 0 15px rgba(120,193,255,.52);
}
.lock-access-card{
  position:relative;z-index:5;width:min(900px,calc(100vw - 32px));max-height:calc(100svh - 28px);
  display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;overflow:hidden;
  padding:clamp(1rem,2.5vh,1.8rem) clamp(1rem,3.6vw,2.4rem);
  border:1px solid rgba(180,220,255,.22);border-radius:clamp(20px,2.4vw,30px);
  background:linear-gradient(145deg,rgba(255,255,255,.13),rgba(255,255,255,.045) 46%,rgba(7,13,28,.70));
  box-shadow:0 34px 120px rgba(0,0,0,.62),0 0 86px rgba(0,80,255,.16),inset 0 0 80px rgba(255,255,255,.035);
  backdrop-filter:blur(24px) saturate(1.25);
}
.lock-access-card::before{
  content:"";position:absolute;inset:-1px;z-index:-1;border-radius:inherit;pointer-events:none;
  background:linear-gradient(115deg,transparent 0%,rgba(255,255,255,.16) 18%,transparent 36%,transparent 100%);
  transform:translateX(-72%);animation:lockCardSweep 5.8s ease-in-out infinite;
}
.lock-access-card::after{
  content:"";position:absolute;inset:0;z-index:-2;pointer-events:none;
  background:radial-gradient(circle at 50% 12%,rgba(120,193,255,.22),transparent 28%),radial-gradient(circle at 50% 92%,rgba(232,184,109,.13),transparent 34%);
}
.lock-logo-shell{
  width:clamp(108px,15vh,150px);height:clamp(108px,15vh,150px);display:grid;place-items:center;
  border-radius:50%;margin:0 auto clamp(.55rem,1vh,.85rem);padding:clamp(5px,.8vh,8px);
  border:1px solid rgba(255,255,255,.34);
  background:radial-gradient(circle,rgba(255,255,255,.96) 0 58%,rgba(120,193,255,.20) 61%,rgba(232,184,109,.08) 75%,transparent 100%);
  box-shadow:0 0 0 1px rgba(120,193,255,.10),0 0 42px rgba(120,193,255,.32),0 0 64px rgba(232,184,109,.18);
}
.lock-logo{width:100%;height:100%;object-fit:contain;display:block;filter:brightness(1.08) saturate(1.14) contrast(1.05)}
.lock-kicker{
  color:var(--gold2);font-size:clamp(.6rem,1.1vw,.72rem);font-weight:900;letter-spacing:.36em;text-transform:uppercase;
  margin-bottom:clamp(.35rem,.9vh,.55rem);
}
.lock-title{
  font-family:'Cormorant Garamond',serif;font-size:clamp(3rem,8.6vw,6.3rem);font-weight:300;line-height:.82;
  letter-spacing:-.06em;color:#f4f7ff;margin-bottom:clamp(.28rem,.8vh,.5rem);
  text-shadow:0 18px 70px rgba(0,0,0,.68),0 0 35px rgba(120,193,255,.16);
}
.lock-title span{
  font-style:italic;background:linear-gradient(90deg,#eaf7ff,#78c1ff 36%,#d83cff 62%,#f5d49a);
  -webkit-background-clip:text;background-clip:text;color:transparent;
}
.lock-text{
  max-width:720px;color:rgba(220,232,248,.78);line-height:1.56;font-size:clamp(.84rem,1.4vw,1rem);
  margin:0 auto clamp(.85rem,1.8vh,1.2rem);
}
.lock-actions{
  width:100%;max-width:820px;display:grid;grid-template-columns:1fr 1fr;gap:clamp(.75rem,1.6vw,1rem);
}
.lock-choice{
  position:relative;overflow:hidden;min-height:clamp(92px,13vh,118px);padding:clamp(.85rem,2vh,1.15rem) clamp(.9rem,2vw,1.25rem);
  border-radius:18px;border:1px solid rgba(120,193,255,.30);text-align:left;color:#fff;
  background:linear-gradient(135deg,rgba(255,255,255,.105),rgba(120,193,255,.065));
  box-shadow:0 18px 54px rgba(0,0,0,.30),inset 0 0 28px rgba(255,255,255,.028);
  transition:transform .25s ease,border-color .25s ease,box-shadow .25s ease,background .25s ease;
}
.lock-choice::before{
  content:"";position:absolute;inset:0;pointer-events:none;opacity:.64;
  background:radial-gradient(circle at 18% 18%,rgba(120,193,255,.24),transparent 44%),linear-gradient(115deg,transparent,rgba(255,255,255,.10),transparent);
}
.lock-choice strong,.lock-choice span{position:relative;z-index:1;display:block}
.lock-choice strong{font-size:clamp(.82rem,1.1vw,.96rem);line-height:1.35;letter-spacing:.17em;text-transform:uppercase;margin-bottom:.52rem}
.lock-choice span{color:rgba(226,238,255,.77);font-size:clamp(.74rem,.95vw,.84rem);line-height:1.48}
.lock-choice.primary{
  color:#030913;border-color:rgba(255,235,170,.9);
  background:linear-gradient(135deg,#d7b46a 0%,#fff0b7 42%,#7fc8ff 100%);
  box-shadow:0 22px 72px rgba(215,180,106,.26),0 0 48px rgba(120,193,255,.16);
}
.lock-choice.primary strong,.lock-choice.primary span{color:#030913}
.lock-choice:hover{transform:translateY(-4px);border-color:rgba(120,193,255,.56);box-shadow:0 24px 70px rgba(0,80,255,.22)}
.lock-choice.primary:hover{box-shadow:0 26px 76px rgba(215,180,106,.30),0 0 52px rgba(120,193,255,.20)}
@keyframes lockMeshOrbit{0%{transform:translate3d(-2%,1%,0) rotate(0deg)}100%{transform:translate3d(2%,-2%,0) rotate(16deg)}}
@keyframes lockMeshDrift{0%{transform:translate3d(-3%,1%,0) scale(1)}50%{transform:translate3d(3%,-2%,0) scale(1.04)}100%{transform:translate3d(1%,2%,0) scale(1.01)}}
@keyframes lockGridShift{0%{background-position:0 0,0 0,0 0}100%{background-position:76px 76px,-76px 76px,0 40px}}
@keyframes lockRingSpin{to{transform:translate(-50%,-50%) rotate(360deg)}}
@keyframes lockCardSweep{0%,42%{transform:translateX(-78%);opacity:0}52%{opacity:.85}72%,100%{transform:translateX(78%);opacity:0}}
@keyframes floatTag{
  0%{transform:translate3d(0,0,0) rotate(-2deg) scale(var(--scale));opacity:.18}
  50%{transform:translate3d(var(--driftX),var(--driftY),0) rotate(2deg) scale(var(--scale));opacity:.45}
  100%{transform:translate3d(calc(var(--driftX) * -0.45),calc(var(--driftY) * -0.45),0) rotate(-1deg) scale(var(--scale));opacity:.22}
}
@media(max-height:760px){
  .lock-access{padding:12px}
  .lock-access-card{width:min(880px,calc(100vw - 24px));max-height:calc(100svh - 24px);padding:.9rem clamp(.9rem,3vw,1.8rem)}
  .lock-logo-shell{width:clamp(86px,12vh,112px);height:clamp(86px,12vh,112px);margin-bottom:.45rem}
  .lock-title{font-size:clamp(2.8rem,7.6vw,5.4rem)}
  .lock-text{font-size:.86rem;margin-bottom:.72rem}
  .lock-choice{min-height:86px;padding:.85rem 1rem}
}
@media(max-width:720px){
  .lock-access{overflow:auto;align-items:start;padding:14px}
  .lock-access-card{margin:auto 0;justify-content:flex-start;max-height:none}
  .lock-logo-shell{width:clamp(82px,24vw,96px);height:clamp(82px,24vw,96px)}
  .lock-actions{grid-template-columns:1fr}
  .lock-choice{text-align:center;min-height:86px}
  .floating-seo-tag:nth-child(n+9){display:none}
}
@media(prefers-reduced-motion:reduce){
  .lock-access::before,.lock-access::after,.lock-access-mesh,.lock-access-rings,.lock-access-card::before{animation:none!important}
  .floating-seo-tag{animation:floatTag var(--duration) ease-in-out infinite both!important;animation-delay:var(--delay)!important;opacity:.22}
}

/* visual recovery pass: bigger crest, better type, real hover life, CSS-only holo objects */
.lock-access{perspective:1200px}
.lock-holo-field{position:absolute;inset:0;z-index:2;pointer-events:none;overflow:hidden}
.lock-holo-object{position:absolute;display:block;opacity:.62;will-change:transform,opacity;filter:drop-shadow(0 0 22px rgba(120,193,255,.28))}
.lock-holo-object.cube{
  left:9%;top:18%;width:56px;height:56px;
  background:linear-gradient(135deg,rgba(255,255,255,.18),rgba(120,193,255,.07));
  border:1px solid rgba(120,193,255,.30);border-radius:10px;
  box-shadow:inset 0 0 24px rgba(255,255,255,.08),0 0 32px rgba(120,193,255,.18);
  transform:rotateX(58deg) rotateZ(38deg);animation:holoCubeFloat 9s ease-in-out infinite;
}
.lock-holo-object.cube::before,.lock-holo-object.cube::after{
  content:"";position:absolute;inset:8px;border:1px solid rgba(232,184,109,.22);border-radius:8px;transform:translateZ(10px)
}
.lock-holo-object.cube.small{left:83%;top:66%;width:42px;height:42px;animation-duration:11s;animation-delay:-4s}
.lock-holo-object.orb{
  right:10%;top:20%;width:88px;height:88px;border-radius:50%;
  border:1px solid rgba(232,184,109,.28);
  background:radial-gradient(circle at 35% 28%,rgba(255,255,255,.30),rgba(120,193,255,.13) 26%,rgba(64,159,255,.10) 58%,transparent 72%);
  box-shadow:0 0 44px rgba(64,159,255,.20),inset 0 0 34px rgba(120,193,255,.10);
  animation:holoOrbFloat 10s ease-in-out infinite;
}
.lock-holo-object.ring{
  left:14%;bottom:12%;width:120px;height:120px;border-radius:50%;
  border:1px solid rgba(120,193,255,.22);
  background:radial-gradient(circle,transparent 0 54%,rgba(120,193,255,.18) 55% 56%,transparent 58%);
  transform:rotateX(68deg) rotateZ(-18deg);animation:holoRingSpin 16s linear infinite;
}
.lock-holo-object.prism{
  right:14%;bottom:13%;width:0;height:0;
  border-left:34px solid transparent;border-right:34px solid transparent;border-bottom:72px solid rgba(120,193,255,.16);
  filter:drop-shadow(0 0 28px rgba(232,184,109,.20));animation:holoPrismFloat 12s ease-in-out infinite;
}
.lock-holo-object.prism::after{content:"";position:absolute;left:-23px;top:26px;width:46px;height:1px;background:rgba(232,184,109,.42);box-shadow:0 14px 0 rgba(120,193,255,.28),0 28px 0 rgba(64,159,255,.18)}
.lock-holo-object.shard{
  left:49%;top:9%;width:76px;height:16px;border-radius:999px;
  border:1px solid rgba(232,184,109,.24);
  background:linear-gradient(90deg,transparent,rgba(232,184,109,.20),rgba(120,193,255,.16),transparent);
  transform:rotate(-12deg);animation:holoShardSlide 8s ease-in-out infinite;
}
.floating-seo-tags{z-index:3;mask-image:radial-gradient(ellipse at 50% 50%,transparent 0 29%,black 48%)}
.floating-seo-tag{
  opacity:.34;color:rgba(245,250,255,.84);border-color:rgba(120,193,255,.32);
  background:linear-gradient(135deg,rgba(255,255,255,.14),rgba(120,193,255,.08),rgba(64,159,255,.045));
}
.lock-access-card{
  width:min(920px,calc(100vw - 32px));padding:clamp(.95rem,2vh,1.45rem) clamp(1.1rem,3.4vw,2.25rem);
  transform-style:preserve-3d;transition:transform .35s ease,border-color .35s ease,box-shadow .35s ease;
}
.lock-access-card:hover{transform:translateY(-2px);border-color:rgba(120,193,255,.34);box-shadow:0 38px 128px rgba(0,0,0,.64),0 0 96px rgba(120,193,255,.18),inset 0 0 90px rgba(255,255,255,.04)}
.lock-logo-shell{
  width:clamp(124px,17vh,154px);height:clamp(124px,17vh,154px);margin-bottom:clamp(.45rem,.8vh,.7rem);
  padding:clamp(6px,.8vh,9px);background:radial-gradient(circle,rgba(255,255,255,.98) 0 58%,rgba(120,193,255,.28) 61%,rgba(232,184,109,.16) 75%,transparent 100%);
  box-shadow:0 0 0 1px rgba(255,255,255,.34),0 0 46px rgba(120,193,255,.36),0 0 70px rgba(232,184,109,.22);
}
.lock-logo{filter:brightness(1.12) saturate(1.18) contrast(1.08) drop-shadow(0 0 10px rgba(0,0,0,.18))}
.lock-kicker{font-family:'Syncopate','Space Grotesk',sans-serif;letter-spacing:.24em;font-size:clamp(.55rem,.9vw,.66rem)}
.lock-title{
  font-size:clamp(3.25rem,8.1vw,6rem);font-weight:400;letter-spacing:0;margin-bottom:clamp(.22rem,.55vh,.42rem);
  text-rendering:geometricPrecision;
}
.lock-text{font-family:'Space Grotesk',sans-serif;font-weight:400;letter-spacing:0;max-width:760px;margin-bottom:clamp(.75rem,1.35vh,1.05rem)}
.lock-choice{
  min-height:clamp(96px,12.4vh,112px);border-radius:22px;overflow:hidden;
  transform:translate3d(0,0,0);transition:transform .25s ease,border-color .25s ease,box-shadow .25s ease,background .25s ease;
}
.lock-choice::after{
  content:"";position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(112deg,transparent 0 34%,rgba(255,255,255,.22) 46%,transparent 60% 100%);
  transform:translateX(-120%);transition:transform .55s ease;
}
.lock-choice strong{font-family:'Space Grotesk',sans-serif;letter-spacing:.10em;font-weight:800}
.lock-choice span{letter-spacing:0;font-weight:400}
.lock-choice:hover{transform:translate3d(0,-7px,0) scale(1.012);border-color:rgba(120,193,255,.62)}
.lock-choice:hover::after{transform:translateX(120%)}
.lock-choice.primary:hover{filter:saturate(1.08) brightness(1.03)}
@keyframes holoCubeFloat{0%,100%{transform:translate3d(0,0,0) rotateX(58deg) rotateZ(38deg)}50%{transform:translate3d(18px,-22px,0) rotateX(64deg) rotateZ(62deg)}}
@keyframes holoOrbFloat{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(-18px,24px,0) scale(1.06)}}
@keyframes holoRingSpin{to{transform:rotateX(68deg) rotateZ(342deg)}}
@keyframes holoPrismFloat{0%,100%{transform:translate3d(0,0,0) rotate(8deg)}50%{transform:translate3d(-20px,-18px,0) rotate(-5deg)}}
@keyframes holoShardSlide{0%,100%{transform:translate3d(-18px,0,0) rotate(-12deg);opacity:.35}50%{transform:translate3d(22px,10px,0) rotate(8deg);opacity:.82}}
@media(max-height:760px){
  .lock-logo-shell{width:clamp(116px,16vh,132px);height:clamp(116px,16vh,132px);margin-bottom:.35rem}
  .lock-title{font-size:clamp(3rem,7.2vw,5.15rem)}
  .lock-choice{min-height:90px}
}
@media(max-width:720px){
  .lock-logo-shell{width:clamp(104px,27vw,116px);height:clamp(104px,27vw,116px)}
  .lock-holo-object{display:block;opacity:.38}
  .lock-holo-object.cube{left:5%;top:13%;width:34px;height:34px}
  .lock-holo-object.cube.small,.lock-holo-object.prism,.lock-holo-object.shard{display:none}
  .lock-holo-object.orb{right:5%;top:12%;width:54px;height:54px}
  .lock-holo-object.ring{left:7%;bottom:8%;width:76px;height:76px}
}
@media(prefers-reduced-motion:reduce){
  .lock-access::before{animation:lockMeshOrbit 32s ease-in-out infinite alternate!important}
  .lock-access::after{animation:lockGridShift 26s linear infinite!important}
  .lock-access-mesh{animation:lockMeshDrift 34s ease-in-out infinite alternate!important}
  .lock-access-rings{animation:lockRingSpin 46s linear infinite!important}
  .lock-access-card::before{animation:lockCardSweep 9s ease-in-out infinite!important}
  .floating-seo-tag{animation:floatTag var(--duration) ease-in-out infinite both!important;opacity:.30}
  .lock-holo-object.cube{animation:holoCubeFloat 14s ease-in-out infinite!important}
  .lock-holo-object.orb{animation:holoOrbFloat 15s ease-in-out infinite!important}
  .lock-holo-object.ring{animation:holoRingSpin 28s linear infinite!important}
  .lock-holo-object.prism{animation:holoPrismFloat 16s ease-in-out infinite!important}
  .lock-holo-object.shard{animation:holoShardSlide 13s ease-in-out infinite!important}
}

/* final lock performance + crest completion pass */
.lock-access::before{filter:blur(20px);animation-duration:30s}
.lock-access::after{opacity:.12;animation-duration:28s}
.lock-access-mesh{filter:blur(34px);opacity:.28;animation-duration:36s}
.lock-access-rings{opacity:.30;animation-duration:52s}
.lock-holo-object{filter:none;opacity:.48;backface-visibility:hidden;contain:layout paint}
.lock-holo-object.cube{animation-duration:15s;box-shadow:inset 0 0 18px rgba(255,255,255,.06),0 0 22px rgba(120,193,255,.14)}
.lock-holo-object.cube.small{animation-duration:18s}
.lock-holo-object.orb{animation-duration:17s;box-shadow:0 0 26px rgba(64,159,255,.15),inset 0 0 24px rgba(120,193,255,.08)}
.lock-holo-object.ring{animation-duration:42s}
.lock-holo-object.prism{animation-duration:19s;filter:none}
.lock-holo-object.shard{animation-duration:17s}
.floating-seo-tag{
  backdrop-filter:none;box-shadow:0 0 18px rgba(120,193,255,.08),inset 0 0 12px rgba(255,255,255,.03);
  animation-timing-function:cubic-bezier(.45,0,.25,1);opacity:.28;
}
.lock-access-card::before{animation-duration:9s}
.lock-logo-shell{
  width:clamp(132px,17.6vh,162px);height:clamp(132px,17.6vh,162px);
  padding:clamp(9px,1vh,12px);overflow:visible;
  background:radial-gradient(circle,rgba(255,255,255,.98) 0 63%,rgba(120,193,255,.24) 66%,rgba(232,184,109,.16) 80%,transparent 100%);
}
.lock-logo{width:100%;height:100%;object-fit:contain;object-position:center;transform:scale(.91)}
.lock-edition-mark{
  display:grid;place-items:center;gap:.14rem;margin:0 auto clamp(.45rem,.8vh,.7rem);
  text-align:center;text-transform:uppercase;color:#fff;line-height:1;
}
.lock-edition-mark span{
  font-family:'Syncopate','Space Grotesk',sans-serif;font-size:clamp(.56rem,.9vw,.7rem);font-weight:800;letter-spacing:.24em;
  color:rgba(120,193,255,.90);text-shadow:0 0 18px rgba(120,193,255,.34);
}
.lock-edition-mark strong{
  font-family:'Cormorant Garamond',serif;font-size:clamp(1rem,1.8vw,1.42rem);font-style:italic;font-weight:700;letter-spacing:.02em;
  background:linear-gradient(90deg,#fff,#f5d49a 44%,#78c1ff 100%);-webkit-background-clip:text;background-clip:text;color:transparent;
}
.lock-edition-mark em{
  font-family:'Space Grotesk',sans-serif;font-size:clamp(.56rem,.86vw,.68rem);font-style:normal;font-weight:800;letter-spacing:.18em;color:rgba(232,184,109,.86);
}
.lock-kicker{margin-top:.05rem}
@media(max-height:760px){
  .lock-logo-shell{width:clamp(118px,16vh,138px);height:clamp(118px,16vh,138px)}
  .lock-edition-mark{gap:.08rem;margin-bottom:.4rem}
  .lock-edition-mark strong{font-size:clamp(.92rem,1.5vw,1.18rem)}
}
@media(max-width:720px){
  .lock-logo-shell{width:clamp(112px,29vw,124px);height:clamp(112px,29vw,124px)}
  .lock-edition-mark strong{font-size:clamp(.95rem,4vw,1.12rem)}
}

/* final landing cleanup: cleaner rebirth header, fewer moving layers, less lag */
.lock-access{
  background:
    radial-gradient(circle at 18% 18%,rgba(30,92,190,.22),transparent 32%),
    radial-gradient(circle at 82% 78%,rgba(232,184,109,.12),transparent 34%),
    linear-gradient(135deg,#020815 0%,#061a32 48%,#02050b 100%)!important;
}
.lock-access::before{animation:none!important;filter:blur(18px)!important;opacity:.28!important}
.lock-access::after{animation:none!important;opacity:.075!important}
.lock-access-mesh{animation:none!important;filter:blur(24px)!important;opacity:.18!important}
.lock-access-rings{animation:none!important;opacity:.16!important}
.lock-holo-field{display:none!important}
.lock-access-card::before{animation:none!important;opacity:.20!important;transform:none!important}
.floating-seo-tags{z-index:1!important;mask-image:none!important;opacity:.72!important}
.floating-seo-tag{
  animation:floatTag var(--duration) ease-in-out infinite both!important;
  animation-delay:var(--delay)!important;
  opacity:.24!important;backdrop-filter:none!important;
  will-change:transform,opacity!important;
  background:linear-gradient(135deg,rgba(255,255,255,.10),rgba(120,193,255,.055))!important;
  border-color:rgba(120,193,255,.22)!important;box-shadow:0 0 16px rgba(120,193,255,.07)!important;
  color:rgba(241,248,255,.62)!important;
}
.lock-access-card{
  width:min(1020px,calc(100vw - 44px))!important;
  padding:clamp(1.2rem,2.6vh,2.2rem) clamp(1.2rem,4vw,3rem)!important;
  gap:.72rem!important;background:linear-gradient(145deg,rgba(255,255,255,.105),rgba(255,255,255,.04) 48%,rgba(4,13,28,.76))!important;
}
.lock-access-top{
  width:100%;max-width:760px;display:flex;align-items:center;justify-content:center;gap:1.1rem;
  margin:0 auto .2rem;padding-bottom:.6rem;border-bottom:1px solid rgba(255,255,255,.08);
}
.lock-access-top .lock-logo-shell{flex:0 0 auto;margin:0!important;width:clamp(92px,13vh,132px)!important;height:clamp(92px,13vh,132px)!important}
.lock-access-top .lock-edition-mark{place-items:start;text-align:left;margin:0!important;gap:.18rem}
.lock-access-top .lock-edition-mark span{letter-spacing:.22em}
.lock-access-top .lock-edition-mark strong{font-size:clamp(1.14rem,2.2vw,1.62rem)!important}
.lock-access-top .lock-edition-mark em{letter-spacing:.28em}
.lock-kicker{margin:.1rem 0 .05rem!important;letter-spacing:.28em!important}
.lock-title{font-size:clamp(3.8rem,8.4vw,6.8rem)!important;margin-bottom:.1rem!important}
.lock-title span{background:linear-gradient(90deg,#eaf7ff,#78c1ff 45%,#f5d49a 100%)!important;-webkit-background-clip:text!important;background-clip:text!important;color:transparent!important}
.lock-text{max-width:780px!important;margin-bottom:.85rem!important}
.lock-actions{max-width:880px!important}
.lock-choice{min-height:104px!important}
.lock-choice-current{
  min-height:156px!important;
  padding:1.1rem 1.15rem!important;
  display:grid!important;
  align-content:center!important;
  gap:.58rem!important;
  isolation:isolate!important;
  background:
    radial-gradient(circle at 16% 20%,rgba(255,255,255,.62),transparent 30%),
    linear-gradient(135deg,#d4ae61 0%,#fff0b7 42%,#aee3ff 100%)!important;
  border-color:rgba(255,241,187,.86)!important;
  box-shadow:0 24px 74px rgba(215,180,106,.22),0 0 54px rgba(120,193,255,.18)!important;
}
.lock-choice-current::before{
  background:
    radial-gradient(circle at 20% 20%,rgba(255,255,255,.34),transparent 36%),
    linear-gradient(110deg,transparent 0 25%,rgba(255,255,255,.30) 43%,transparent 62%)!important;
  opacity:.75!important;
}
.lock-choice-current::after{background:linear-gradient(112deg,transparent 0 30%,rgba(255,255,255,.42) 46%,transparent 64%)!important}
.lock-current-status,
.lock-current-head,
.lock-current-copy,
.lock-current-pills,
.lock-current-stats{position:relative;z-index:2}
.lock-current-status{
  width:max-content;max-width:100%;
  display:inline-flex!important;align-items:center;gap:.45rem;
  padding:.28rem .58rem;border-radius:999px;
  border:1px solid rgba(3,9,19,.18);
  background:rgba(3,9,19,.10);
  color:#06101b!important;
  font-size:.58rem!important;font-weight:900!important;letter-spacing:.16em!important;text-transform:uppercase!important;
}
.lock-current-status::before{
  content:"";width:7px;height:7px;border-radius:50%;background:#0f7fff;
  box-shadow:0 0 0 4px rgba(15,127,255,.16),0 0 16px rgba(15,127,255,.50);
}
.lock-current-head{
  display:grid!important;grid-template-columns:1fr auto;align-items:center;gap:.75rem;
}
.lock-current-head strong{
  margin:0!important;font-size:clamp(1rem,1.35vw,1.2rem)!important;line-height:1.08!important;
  color:#030913!important;letter-spacing:.12em!important;
}
.lock-current-arrow{
  width:46px;height:46px;border-radius:50%;
  display:grid!important;place-items:center;
  border:1px solid rgba(3,9,19,.18);
  background:rgba(3,9,19,.92);
  color:#eaf7ff!important;
  font-size:.62rem!important;font-weight:900!important;letter-spacing:.08em!important;
  box-shadow:0 10px 26px rgba(3,9,19,.28),0 0 22px rgba(120,193,255,.22);
}
.lock-current-copy{
  color:rgba(3,9,19,.78)!important;
  font-size:clamp(.76rem,.95vw,.88rem)!important;
  line-height:1.42!important;
}
.lock-current-pills{
  display:flex!important;flex-wrap:wrap;gap:.42rem;
}
.lock-current-pills span{
  display:inline-flex!important;align-items:center;justify-content:center;
  min-height:28px;padding:.24rem .58rem;border-radius:999px;
  border:1px solid rgba(3,9,19,.14);
  background:rgba(255,255,255,.34);
  color:#071626!important;
  font-size:.62rem!important;font-weight:900!important;letter-spacing:.08em!important;text-transform:uppercase!important;
}
.lock-current-stats{
  display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr));gap:.45rem;
}
.lock-current-stats span{
  min-width:0;padding:.48rem .35rem;border-radius:13px;
  border:1px solid rgba(3,9,19,.10);
  background:rgba(3,9,19,.08);
  color:rgba(3,9,19,.72)!important;
  font-size:.58rem!important;font-weight:800!important;line-height:1.15!important;text-align:center!important;
}
.lock-current-stats b{
  display:block;color:#030913!important;font-size:.9rem!important;line-height:1!important;margin-bottom:.12rem;
}
.lock-choice-current:hover{
  transform:translate3d(0,-8px,0) scale(1.018)!important;
  box-shadow:0 34px 90px rgba(215,180,106,.32),0 0 66px rgba(120,193,255,.26)!important;
}
@media(max-height:760px){
  .lock-access-card{gap:.42rem!important}
  .lock-access-top{padding-bottom:.42rem}
  .lock-access-top .lock-logo-shell{width:88px!important;height:88px!important}
  .lock-title{font-size:clamp(3rem,7.2vw,5.4rem)!important}
  .lock-choice{min-height:86px!important}
  .lock-choice-current{min-height:132px!important;gap:.42rem!important;padding:.88rem 1rem!important}
  .lock-current-stats{display:none!important}
  .lock-current-copy{font-size:.74rem!important}
}
@media(max-width:720px){
  .lock-access-card{width:min(100%,calc(100vw - 28px))!important}
  .lock-access-top{display:grid;justify-items:center;text-align:center;gap:.5rem}
  .lock-access-top .lock-edition-mark{place-items:center;text-align:center}
  .lock-current-head{grid-template-columns:1fr!important;justify-items:center;text-align:center!important}
  .lock-current-arrow{display:none!important}
  .lock-current-status{margin:0 auto}
  .lock-current-pills{justify-content:center}
  .lock-current-stats{grid-template-columns:1fr!important}
  .floating-seo-tag:nth-child(n+6){display:none!important}
}

/* final performance budget: keep the premium blue look without costly blur/paint storms */
body.cm-cinematic-scroll .fx-canvas{display:block!important;opacity:.30!important}
body.cm-cinematic-scroll .hero-orb,body.cm-cinematic-scroll .floating-seo-tag,body.cm-cinematic-scroll .entry-motion-tag{animation-play-state:running!important}
section{content-visibility:visible!important;contain-intrinsic-size:auto!important}
.fx-canvas{opacity:.62}
@media(max-width:980px){
  .fx-canvas{opacity:.32!important}
  .hero-orb{filter:blur(44px)!important;opacity:.45!important}
  .nav.solid,.mob-menu,.edition-card,.feat,.oc-card,.cinfo,.entry-choice,.lock-access-card,.modal-overlay{backdrop-filter:blur(6px)!important;-webkit-backdrop-filter:blur(6px)!important}
}
@media(max-width:760px){
  .fx-canvas{display:block!important;opacity:.18!important}
  .noise-layer{opacity:.012!important}
  .hero-orb{display:block!important;filter:blur(54px)!important;opacity:.25!important}
  .ag-field{display:none!important}
  .entry-motion-tags{display:block!important;opacity:.52!important}
  .entry-motion-tag{animation:entryTagDrift var(--dur,26s) ease-in-out infinite alternate!important}
  .floating-seo-tags{display:block!important;opacity:.70!important}
  .floating-seo-tag{display:inline-flex!important;animation:floatTag var(--duration) ease-in-out infinite both!important;opacity:.32!important}
  .floating-seo-tag:nth-child(n+8){display:none!important}
  .hero-grid,.hero-grid-diagonal{opacity:.018!important;background-size:112px 112px!important}
  .nav.solid,.mob-menu,.edition-card,.feat,.oc-card,.cinfo,.entry-choice,.lock-access-card,.modal-overlay,.dash-nav,.admin-modal-overlay{backdrop-filter:blur(7px)!important;-webkit-backdrop-filter:blur(7px)!important}
  .edition-card:hover,.committee-card:hover,.oc-card:hover,.entry-choice:hover,.lock-choice-current:hover,
  .edition-card:focus-visible,.committee-card:focus-visible,.oc-card:focus-visible,.entry-choice:focus-visible,.lock-choice-current:focus-visible{
    transform:translate3d(0,-5px,0) scale(1.012)!important;
  }
}
@media(prefers-reduced-motion:reduce){
  .fx-canvas,.hero-orb,.entry-motion-tags,.floating-seo-tag,.ag-field{display:none!important}
  *,*::before,*::after{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important;scroll-behavior:auto!important}
}

/* HARD EFFECT RESTORE: keep the entry experience alive on every normal viewport/settings combo */
.fx-canvas{display:block!important;opacity:.58!important}
.hero-orb{display:block!important;opacity:.78!important}
.lock-access-mesh{display:block!important;opacity:.36!important;animation:lockMeshDrift 20s ease-in-out infinite alternate!important}
.lock-access-rings{display:block!important;opacity:.38!important;animation:lockRingSpin 28s linear infinite!important}
.floating-seo-tags{
  display:block!important;opacity:1!important;visibility:visible!important;
  mask-image:radial-gradient(ellipse at 50% 48%,transparent 0 34%,black 52%)!important;
}
.floating-seo-tag,
.floating-seo-tag:nth-child(n){
  display:inline-flex!important;visibility:visible!important;opacity:.72!important;
  animation:floatTag var(--duration) ease-in-out infinite both!important;
  animation-delay:var(--delay)!important;
  backdrop-filter:none!important;-webkit-backdrop-filter:none!important;
  box-shadow:0 0 18px rgba(120,193,255,.10),inset 0 0 10px rgba(255,255,255,.035)!important;
}
.entry-motion-tags{display:block!important;opacity:1!important;visibility:visible!important}
.entry-motion-tag,
.entry-motion-tag:nth-child(n){
  display:inline-flex!important;visibility:visible!important;opacity:.86!important;
  animation:entryTagDrift var(--dur,22s) ease-in-out infinite alternate!important;
  animation-delay:var(--delay,0s)!important;
}
@media(max-width:760px){
  .fx-canvas{display:block!important;opacity:.24!important}
  .hero-orb{display:block!important;opacity:.42!important;filter:blur(54px)!important}
  .floating-seo-tags{display:block!important;opacity:.82!important}
  .floating-seo-tag,.floating-seo-tag:nth-child(n){display:inline-flex!important;opacity:.38!important}
  .entry-motion-tags{display:block!important;opacity:.62!important}
  .entry-motion-tag,.entry-motion-tag:nth-child(n){display:inline-flex!important;opacity:.46!important}
}
.lock-access-mesh{filter:blur(24px)!important}
.lock-access-card{backdrop-filter:blur(14px) saturate(1.08)!important;-webkit-backdrop-filter:blur(14px) saturate(1.08)!important}
.edition-card:hover,.edition-card:focus-visible,
.oc-card:hover,.oc-card:focus-visible,
.entry-choice:hover,.entry-choice:focus-visible,
.lock-choice-current:hover,.lock-choice-current:focus-visible,
.ltab.active,.ctab.active{
  transform:translate3d(0,-6px,0) scale(1.015)!important;
  transition:transform .28s cubic-bezier(.2,.8,.2,1),box-shadow .28s ease,border-color .28s ease,background .28s ease,color .28s ease!important;
}

/* final lock preview repair: short desktop previews must scroll, not crop the crest/card */
.lock-access{
  overflow-x:hidden!important;
  overflow-y:auto!important;
  -webkit-overflow-scrolling:touch!important;
  overscroll-behavior:contain!important;
  scrollbar-gutter:stable!important;
}
.lock-access-card{
  max-height:none!important;
  overflow:visible!important;
  flex:0 0 auto!important;
}
@media(max-height:760px){
  .lock-access{
    align-items:flex-start!important;
    justify-items:center!important;
    place-items:start center!important;
    padding:14px!important;
  }
  .lock-access-card{
    margin:0 auto!important;
    width:min(1020px,calc(100vw - 36px))!important;
    padding:.82rem clamp(.9rem,3vw,1.65rem)!important;
    gap:.34rem!important;
  }
  .lock-access-top{
    gap:.72rem!important;
    padding-bottom:.34rem!important;
    margin-bottom:.12rem!important;
  }
  .lock-access-top .lock-logo-shell{
    width:clamp(62px,12vh,82px)!important;
    height:clamp(62px,12vh,82px)!important;
    padding:5px!important;
  }
  .lock-access-top .lock-edition-mark strong{font-size:clamp(1rem,2vw,1.34rem)!important}
  .lock-access-top .lock-edition-mark span{font-size:.58rem!important}
  .lock-access-top .lock-edition-mark em{font-size:.54rem!important}
  .lock-kicker{font-size:.58rem!important;margin:.05rem 0 0!important}
  .lock-title{font-size:clamp(2.85rem,7vw,4.9rem)!important;margin-bottom:0!important}
  .lock-text{font-size:.82rem!important;line-height:1.42!important;margin-bottom:.52rem!important}
  .lock-choice{min-height:78px!important;padding:.72rem .9rem!important}
  .lock-choice-current{min-height:116px!important;padding:.78rem .95rem!important;gap:.34rem!important}
}
@media(max-height:620px){
  .lock-access-card{padding:.68rem clamp(.75rem,2.6vw,1.25rem)!important}
  .lock-access-top .lock-logo-shell{width:58px!important;height:58px!important}
  .lock-access-top .lock-edition-mark strong{font-size:1.05rem!important}
  .lock-title{font-size:clamp(2.35rem,6.2vw,4.1rem)!important}
  .lock-text{font-size:.76rem!important;line-height:1.34!important;margin-bottom:.42rem!important}
  .lock-current-pills span{min-height:24px!important;padding:.18rem .48rem!important;font-size:.56rem!important}
  .lock-current-stats{display:none!important}
}

/* real crest + previous versions premium pass */
.lock-logo-shell{
  overflow:hidden!important;
  background:#05070b!important;
  border:1px solid rgba(255,255,255,.42)!important;
  box-shadow:0 0 0 1px rgba(200,169,110,.20),0 0 32px rgba(120,193,255,.28),0 0 40px rgba(200,169,110,.16)!important;
}
.lock-logo{
  width:100%!important;
  height:100%!important;
  object-fit:cover!important;
  object-position:center!important;
  transform:scale(1.035)!important;
  filter:none!important;
}
.lock-choice{
  backdrop-filter:blur(16px) saturate(1.14)!important;
  -webkit-backdrop-filter:blur(16px) saturate(1.14)!important;
}
.lock-choice::after{
  content:"";position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(112deg,transparent 0 34%,rgba(255,255,255,.24) 48%,transparent 62%);
  transform:translateX(-126%);
  transition:transform .58s ease;
}
.lock-choice-current::after{background:linear-gradient(112deg,transparent 0 30%,rgba(255,255,255,.42) 46%,transparent 64%)!important}
.lock-choice:hover::after,.lock-choice:focus-visible::after{transform:translateX(126%)}
#editions,
#committees,
#legacy{
  position:relative!important;
  isolation:isolate!important;
  overflow:hidden!important;
}
#editions::before,
#committees::before,
#legacy::before{
  content:"";position:absolute;inset:0;z-index:0;pointer-events:none;
  background:
    radial-gradient(circle at 12% 18%,rgba(64,159,255,.18),transparent 30%),
    radial-gradient(circle at 88% 16%,rgba(200,149,58,.12),transparent 28%),
    linear-gradient(rgba(120,193,255,.055) 1px,transparent 1px),
    linear-gradient(90deg,rgba(120,193,255,.045) 1px,transparent 1px);
  background-size:auto,auto,82px 82px,82px 82px;
  opacity:.88;
  mask-image:linear-gradient(180deg,transparent 0%,black 14%,black 86%,transparent 100%);
}
#editions::after,
#committees::after,
#legacy::after{
  content:"";position:absolute;left:50%;top:8%;z-index:0;width:min(72vw,760px);aspect-ratio:1;border-radius:50%;
  transform:translateX(-50%);
  border:1px solid rgba(120,193,255,.13);
  box-shadow:inset 0 0 70px rgba(120,193,255,.045),0 0 80px rgba(64,159,255,.08);
  opacity:.62;pointer-events:none;
}
#editions > div,
#committees > div,
#legacy > div{position:relative;z-index:1}
.edition-card,
.cc,
.legacy-placard,
.legacy-member{
  backdrop-filter:blur(18px) saturate(1.15)!important;
  -webkit-backdrop-filter:blur(18px) saturate(1.15)!important;
}
.edition-card{
  border-color:rgba(120,193,255,.22)!important;
  background:
    radial-gradient(circle at var(--mx,22%) var(--my,18%),rgba(120,193,255,.17),transparent 34%),
    linear-gradient(145deg,rgba(255,255,255,.105),rgba(255,255,255,.035) 52%,rgba(5,18,38,.76))!important;
  box-shadow:0 28px 90px rgba(0,0,0,.44),inset 0 1px 0 rgba(255,255,255,.07)!important;
}
.edition-card::before{
  content:"";position:absolute;inset:1rem;border-radius:14px;pointer-events:none;
  border:1px solid rgba(255,255,255,.055);
  background:linear-gradient(135deg,rgba(255,255,255,.08),transparent 42%,rgba(120,193,255,.06));
  opacity:.74;
}
.edition-card:hover,
.edition-card:focus-visible{
  transform:translate3d(0,-12px,0) rotateX(4deg) scale(1.018)!important;
  border-color:rgba(120,193,255,.48)!important;
  box-shadow:0 38px 110px rgba(0,0,0,.55),0 0 70px rgba(64,159,255,.20),0 0 42px rgba(200,149,58,.10)!important;
}
.edition-card:hover .ed-num{color:rgba(120,193,255,.16);text-shadow:0 0 32px rgba(120,193,255,.22)}
.ed-cmd-chip,.current-live-chip,.legacy-placard-badge{
  backdrop-filter:blur(10px)!important;
  -webkit-backdrop-filter:blur(10px)!important;
}
.committees-tabs,.legacy-tabs{
  width:max-content;max-width:100%;
  padding:.42rem!important;border-radius:999px!important;
  background:linear-gradient(145deg,rgba(255,255,255,.085),rgba(255,255,255,.025))!important;
  border:1px solid rgba(120,193,255,.18)!important;
  box-shadow:0 22px 70px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.06)!important;
  backdrop-filter:blur(16px) saturate(1.12)!important;
  -webkit-backdrop-filter:blur(16px) saturate(1.12)!important;
}
.ctab,.ltab{
  position:relative!important;overflow:hidden!important;
  border-radius:999px!important;
}
.ctab::after,.ltab::after{
  content:"";position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(110deg,transparent 0 34%,rgba(255,255,255,.26) 48%,transparent 62%);
  transform:translateX(-130%);transition:transform .5s ease;
}
.ctab:hover::after,.ctab.active::after,.ltab:hover::after,.ltab.active::after{transform:translateX(130%)}
.ctab.active,.ltab.active{
  background:linear-gradient(135deg,rgba(200,149,58,.94),rgba(245,212,154,.92),rgba(120,193,255,.50))!important;
  color:#06101b!important;
  box-shadow:0 18px 45px rgba(200,149,58,.20),0 0 34px rgba(120,193,255,.14)!important;
}
.cc{
  border-color:rgba(120,193,255,.20)!important;
  box-shadow:0 30px 90px rgba(0,0,0,.40),inset 0 1px 0 rgba(255,255,255,.065)!important;
}
.cc:hover,.cc:focus-visible{
  transform:translate3d(0,-12px,0) scale(1.016)!important;
  border-color:rgba(120,193,255,.44)!important;
  box-shadow:0 40px 118px rgba(0,0,0,.56),0 0 74px rgba(64,159,255,.18)!important;
}
.legacy-placard{
  border-color:rgba(120,193,255,.22)!important;
  background:
    linear-gradient(145deg,rgba(255,255,255,.10),rgba(255,255,255,.032) 54%,rgba(4,15,32,.78))!important;
  box-shadow:0 30px 90px rgba(0,0,0,.42),inset 0 1px 0 rgba(255,255,255,.065)!important;
}
.legacy-placard::before{
  content:"";position:absolute;left:-30%;right:-30%;top:-60%;height:90%;
  background:conic-gradient(from 90deg,transparent 0 35%,rgba(120,193,255,.14),transparent 52%,rgba(200,149,58,.12),transparent 76%);
  opacity:.72;pointer-events:none;transition:transform .75s ease;
}
.legacy-placard:hover{
  transform:translate3d(0,-10px,0) scale(1.012)!important;
  border-color:rgba(200,149,58,.42)!important;
  box-shadow:0 40px 118px rgba(0,0,0,.54),0 0 64px rgba(200,149,58,.13)!important;
}
.legacy-placard:hover::before{transform:rotate(18deg) translateY(8%)}
.legacy-member{
  background:rgba(255,255,255,.055)!important;
  border-color:rgba(255,255,255,.09)!important;
  transition:transform .24s cubic-bezier(.2,.8,.2,1),border-color .24s ease,background .24s ease,box-shadow .24s ease!important;
}
.legacy-member:hover{
  transform:translate3d(0,-4px,0) scale(1.01)!important;
  border-color:rgba(120,193,255,.28)!important;
  box-shadow:0 14px 36px rgba(64,159,255,.12)!important;
}
.sr.visible .edition-card,
.sr.visible .legacy-placard,
.sr.visible .cc,
.edition-card.sr.visible,
.legacy-placard.sr.visible{
  animation:legacyGlassPop .72s cubic-bezier(.2,.9,.2,1) both;
}
@keyframes legacyGlassPop{
  0%{opacity:0;transform:translate3d(0,26px,0) scale(.965);filter:saturate(.72)}
  62%{opacity:1;transform:translate3d(0,-5px,0) scale(1.012)}
  100%{opacity:1;transform:translate3d(0,0,0) scale(1);filter:saturate(1)}
}
@media(max-width:760px){
  .committees-tabs,.legacy-tabs{width:100%;justify-content:center}
  .edition-card:hover,.edition-card:focus-visible,.cc:hover,.cc:focus-visible,.legacy-placard:hover{transform:translate3d(0,-7px,0) scale(1.01)!important}
}

/* final crest alignment: single source of truth for the gateway logo */
.lock-access-top{
  display:grid!important;
  grid-template-columns:auto auto!important;
  align-items:center!important;
  justify-content:center!important;
  gap:clamp(.78rem,1.4vw,1.15rem)!important;
  max-width:min(760px,100%)!important;
  margin:0 auto .22rem!important;
  padding-bottom:.62rem!important;
}
.lock-access-top .lock-logo-shell{
  box-sizing:border-box!important;
  width:clamp(82px,12vh,108px)!important;
  height:clamp(82px,12vh,108px)!important;
  padding:0!important;
  margin:0!important;
  overflow:hidden!important;
  display:grid!important;
  place-items:center!important;
  border-radius:50%!important;
  background:#05070b!important;
  border:1px solid rgba(255,255,255,.42)!important;
  box-shadow:0 0 0 1px rgba(200,169,110,.22),0 0 30px rgba(120,193,255,.26),0 0 38px rgba(200,169,110,.14)!important;
  transform:translateY(0)!important;
}
.lock-access-top .lock-logo{
  width:100%!important;
  height:100%!important;
  display:block!important;
  object-fit:cover!important;
  object-position:50% 50%!important;
  transform:none!important;
  filter:none!important;
}
.lock-access-top .lock-edition-mark{
  align-self:center!important;
  display:grid!important;
  place-items:start!important;
  text-align:left!important;
  gap:.16rem!important;
  margin:0!important;
  transform:translateY(-1px)!important;
}
.lock-access{
  --lock-card-y:clamp(30px,5svh,54px);
}
.lock-access-card{
  transform:translate3d(0,var(--lock-card-y),0)!important;
}
.lock-access-card:hover{
  transform:translate3d(0,calc(var(--lock-card-y) - 2px),0)!important;
}
@media(max-height:760px){
  .lock-access{
    --lock-card-y:0px;
    place-items:start center!important;
    align-content:start!important;
    overflow-y:auto!important;
    overscroll-behavior:contain!important;
  }
  .lock-access-card{
    max-height:none!important;
    margin:clamp(12px,2.6svh,22px) 0!important;
  }
}
@media(max-width:620px){
  .lock-access{--lock-card-y:0px}
  .lock-access-top{
    grid-template-columns:1fr!important;
    justify-items:center!important;
    gap:.48rem!important;
  }
  .lock-access-top .lock-logo-shell{
    width:clamp(72px,21vw,90px)!important;
    height:clamp(72px,21vw,90px)!important;
  }
  .lock-access-top .lock-edition-mark{
    place-items:center!important;
    text-align:center!important;
    transform:none!important;
  }
}
@media(max-width:900px),(pointer:coarse){
  .main-cursor-layer{display:none!important}
  .home-section-rail{display:none!important}
}
.cursor-reactive,
.cursor-reactive:hover,
.lock-choice.cursor-reactive,
.lock-choice.cursor-reactive:hover,
.cc.cursor-reactive,
.edition-card.cursor-reactive,
.legacy-placard.cursor-reactive,
.oc-card.cursor-reactive,
.feat.cursor-reactive,
.cinfo.cursor-reactive{
  transform:perspective(900px) translate3d(0,-6px,0) rotateX(var(--tilt-x)) rotateY(var(--tilt-y)) scale(1.01)!important;
}
.lock-choice.cursor-reactive::before{
  background:
    radial-gradient(circle at var(--mx,50%) var(--my,50%),rgba(255,255,255,.32),transparent 34%),
    radial-gradient(circle at var(--mx,50%) var(--my,50%),rgba(120,193,255,.24),transparent 48%),
    linear-gradient(115deg,transparent,rgba(255,255,255,.10),transparent)!important;
}
.lock-choice-current.cursor-reactive{
  box-shadow:0 34px 96px rgba(215,180,106,.34),0 0 76px rgba(120,193,255,.28)!important;
}

/* ── single-entry portal: one gateway, hyperspace exit ── */
.lock-enter-wrap{display:flex;flex-direction:column;align-items:center;gap:1.15rem;margin-top:1.6rem}
.lock-enter-btn{position:relative;width:min(200px,52vw);aspect-ratio:1;border-radius:50%;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.32rem;background:radial-gradient(circle at 50% 38%,rgba(16,38,74,.94),rgba(3,8,18,.96) 72%);border:1px solid rgba(120,193,255,.42);color:var(--platinum);font-family:'Space Grotesk',sans-serif;transition:transform .4s cubic-bezier(.34,1.56,.64,1),box-shadow .4s ease,border-color .4s ease;box-shadow:0 0 70px rgba(0,80,255,.28),0 0 26px rgba(120,193,255,.18),inset 0 0 46px rgba(61,139,255,.14)}
.lock-enter-btn strong{font-family:'Syncopate',sans-serif;font-size:1.28rem;letter-spacing:.34em;text-indent:.34em;color:#fff;text-shadow:0 0 24px rgba(120,193,255,.6)}
.lock-enter-eyebrow{font-size:.56rem;font-weight:700;letter-spacing:.42em;text-transform:uppercase;color:var(--gold2)}
.lock-enter-sub{font-size:.55rem;font-weight:600;letter-spacing:.3em;text-transform:uppercase;color:var(--silver)}
.lock-enter-orbit{position:absolute;inset:-12px;border-radius:50%;border:1px dashed rgba(232,184,109,.5);animation:lockOrbitSlow 9s linear infinite;pointer-events:none}
.lock-enter-orbit::before{content:"";position:absolute;top:-4px;left:50%;width:7px;height:7px;margin-left:-3px;border-radius:50%;background:var(--gold2);box-shadow:0 0 16px var(--gold2),0 0 30px rgba(120,193,255,.5)}
@keyframes lockOrbitSlow{to{transform:rotate(360deg)}}
.lock-enter-btn::before{content:"";position:absolute;inset:-1px;border-radius:50%;padding:1px;background:conic-gradient(from 0deg,transparent 0 18%,rgba(120,193,255,.9) 26%,rgba(245,212,154,.95) 34%,transparent 42% 100%);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:lockSweep 3.4s linear infinite;pointer-events:none}
@keyframes lockSweep{to{transform:rotate(360deg)}}
.lock-enter-btn::after{content:"";position:absolute;inset:14%;border-radius:50%;border:1px solid rgba(120,193,255,.22);pointer-events:none;animation:lockCorePulse 2.6s ease-in-out infinite}
@keyframes lockCorePulse{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.08);opacity:1}}
.lock-enter-btn:hover{transform:scale(1.07) translateY(-3px);border-color:rgba(245,212,154,.8);box-shadow:0 0 110px rgba(0,80,255,.5),0 0 40px rgba(200,149,58,.4),inset 0 0 60px rgba(61,139,255,.2)}
.lock-enter-hint{font-size:.6rem;letter-spacing:.3em;text-transform:uppercase;color:var(--dim)}

/* hyperspace warp-out sequence — every layer explicitly centered
   (absolutely positioned grid children land at the static position,
   NOT the grid center, which silently killed the first version) */
.lock-warp{position:absolute;inset:0;pointer-events:none;z-index:6;perspective:760px;overflow:hidden}
.lock-warp i{position:absolute;left:50%;top:50%;width:16vmax;height:16vmax;margin:-8vmax 0 0 -8vmax;border-radius:50%;border:3px solid rgba(120,193,255,.9);opacity:0;box-shadow:0 0 70px rgba(61,139,255,.7),0 0 24px rgba(120,193,255,.9),inset 0 0 44px rgba(120,193,255,.35)}
.lock-warp i:nth-of-type(2n){border-color:rgba(245,212,154,.95);box-shadow:0 0 70px rgba(200,149,58,.65),0 0 24px rgba(245,212,154,.9),inset 0 0 44px rgba(245,212,154,.3)}
.lock-warp-stars{position:absolute;left:50%;top:50%;width:140vmax;height:140vmax;margin:-70vmax 0 0 -70vmax;border-radius:50%;opacity:0;mix-blend-mode:screen;background-image:
  radial-gradient(2px 2px at 12% 24%,rgba(196,228,255,.9),transparent 55%),
  radial-gradient(2px 2px at 78% 16%,rgba(245,212,154,.85),transparent 55%),
  radial-gradient(1.6px 1.6px at 34% 68%,rgba(255,255,255,.9),transparent 55%),
  radial-gradient(1.6px 1.6px at 62% 42%,rgba(196,228,255,.8),transparent 55%),
  radial-gradient(2px 2px at 88% 74%,rgba(120,193,255,.85),transparent 55%),
  radial-gradient(1.4px 1.4px at 22% 86%,rgba(245,212,154,.8),transparent 55%),
  radial-gradient(1.8px 1.8px at 48% 12%,rgba(255,255,255,.85),transparent 55%),
  radial-gradient(1.5px 1.5px at 70% 88%,rgba(196,228,255,.85),transparent 55%),
  radial-gradient(1.8px 1.8px at 8% 52%,rgba(255,255,255,.75),transparent 55%),
  radial-gradient(1.5px 1.5px at 92% 40%,rgba(245,212,154,.8),transparent 55%)}
.lock-warp-burst{position:absolute;left:50%;top:50%;width:150vmax;height:150vmax;margin:-75vmax 0 0 -75vmax;border-radius:50%;opacity:0;background:repeating-conic-gradient(from 0deg,rgba(120,193,255,.3) 0deg 1.4deg,transparent 1.4deg 6.5deg),repeating-conic-gradient(from 3deg,rgba(245,212,154,.16) 0deg 1deg,transparent 1deg 11deg);mix-blend-mode:screen}
.lock-warp-chroma{position:fixed;inset:0;opacity:0;pointer-events:none;z-index:7;mix-blend-mode:screen}
.lock-warp-chroma.chroma-a{background:radial-gradient(circle at 50% 50%,rgba(61,139,255,.5),transparent 62%)}
.lock-warp-chroma.chroma-b{background:radial-gradient(circle at 50% 50%,rgba(232,184,109,.45),transparent 62%)}
.lock-warp-flash{position:fixed;inset:0;opacity:0;pointer-events:none;z-index:8;background:radial-gradient(circle at 50% 50%,rgba(255,250,236,.98),rgba(140,200,255,.55) 42%,rgba(0,80,255,.18) 62%,transparent 78%)}

.lock-access.entering{pointer-events:none;animation:lockGateOut 1.3s ease forwards}
@keyframes lockGateOut{0%,62%{opacity:1}100%{opacity:0}}
/* the card carries an !important transform, which outranks keyframes —
   so the fly-through is a transition between two !important states */
.lock-access.entering .lock-access-card{
  transform:translate3d(0,var(--lock-card-y),0) translateZ(1500px) rotateX(16deg) scale(1.6)!important;
  opacity:0;filter:blur(22px);
  transition:transform 1.05s cubic-bezier(.7,.01,.85,.4),opacity .9s ease .15s,filter 1s ease;
}
.lock-access.entering .lock-warp{animation:lockShake .5s linear .55s}
@keyframes lockShake{0%,100%{transform:translate(0,0)}20%{transform:translate(-7px,5px)}40%{transform:translate(6px,-6px)}60%{transform:translate(-5px,-4px)}80%{transform:translate(5px,6px)}}
.lock-access.entering .lock-warp i{animation:lockTunnel 1.05s cubic-bezier(.5,0,.82,.4) forwards}
.lock-access.entering .lock-warp i:nth-of-type(1){animation-delay:0s}
.lock-access.entering .lock-warp i:nth-of-type(2){animation-delay:.09s}
.lock-access.entering .lock-warp i:nth-of-type(3){animation-delay:.18s}
.lock-access.entering .lock-warp i:nth-of-type(4){animation-delay:.27s}
.lock-access.entering .lock-warp i:nth-of-type(5){animation-delay:.36s}
.lock-access.entering .lock-warp i:nth-of-type(6){animation-delay:.45s}
.lock-access.entering .lock-warp i:nth-of-type(7){animation-delay:.54s}
.lock-access.entering .lock-warp i:nth-of-type(8){animation-delay:.63s}
@keyframes lockTunnel{0%{transform:scale(.06) translateZ(-420px);opacity:0}18%{opacity:1}100%{transform:scale(11) translateZ(320px);opacity:0}}
.lock-access.entering .lock-warp-stars{animation:lockStarRush 1.15s cubic-bezier(.55,0,.85,.35) forwards}
.lock-access.entering .lock-warp-stars.s2{animation-delay:.14s}
.lock-access.entering .lock-warp-stars.s3{animation-delay:.28s}
@keyframes lockStarRush{0%{transform:scale(.18) rotate(0deg);opacity:0}22%{opacity:1}100%{transform:scale(3.4) rotate(14deg);opacity:0}}
.lock-access.entering .lock-warp-burst{animation:lockBurst 1.15s cubic-bezier(.58,0,.88,.45) .05s forwards}
@keyframes lockBurst{0%{transform:scale(.03) rotate(0deg);opacity:0}26%{opacity:1}100%{transform:scale(1.45) rotate(70deg);opacity:0}}
.lock-access.entering .lock-warp-chroma.chroma-a{animation:lockChromaA .55s ease-out .5s forwards}
.lock-access.entering .lock-warp-chroma.chroma-b{animation:lockChromaB .55s ease-out .52s forwards}
@keyframes lockChromaA{0%{opacity:0;transform:translate(0,0) scale(.85)}35%{opacity:.85;transform:translate(-14px,-6px) scale(1.05)}100%{opacity:0;transform:translate(-30px,-12px) scale(1.2)}}
@keyframes lockChromaB{0%{opacity:0;transform:translate(0,0) scale(.85)}35%{opacity:.8;transform:translate(14px,8px) scale(1.05)}100%{opacity:0;transform:translate(30px,14px) scale(1.2)}}
.lock-access.entering .lock-warp-flash{animation:lockFlash .6s ease-out .62s forwards}
@keyframes lockFlash{0%{opacity:0}34%{opacity:1}100%{opacity:0}}
.lock-access.entering .lock-access-mesh,.lock-access.entering .lock-access-rings{animation:lockBgRush 1s ease-in forwards}
@keyframes lockBgRush{to{transform:scale(1.9);opacity:0;filter:blur(14px)}}
.lock-access.entering .lock-holo-object,.lock-access.entering .floating-seo-tag{animation:lockScatter .7s cubic-bezier(.55,0,.85,.4) forwards!important}
@keyframes lockScatter{to{transform:scale(2.8) translateY(-44px);opacity:0;filter:blur(10px)}}
.lock-access.entering .lock-enter-btn{transform:scale(.9);opacity:.3;transition:transform .45s ease,opacity .45s ease}
@media(prefers-reduced-motion:reduce){.lock-warp,.lock-warp-flash,.lock-warp-chroma{display:none}.lock-access.entering{animation:lockGateOut .6s ease forwards}.lock-access.entering .lock-access-card{transition:opacity .4s ease;transform:translate3d(0,var(--lock-card-y),0)!important;filter:none}.lock-access.entering .lock-holo-object,.lock-access.entering .floating-seo-tag{animation:none!important}}
@media(max-width:640px){.lock-enter-btn{width:min(170px,58vw)}}

/* ── hero: holographic crest + drifting keyword tags ── */
.hero-crest{position:absolute;left:50%;top:47%;width:clamp(280px,42vw,540px);transform:translate(-50%,-50%);opacity:.13;pointer-events:none;z-index:1;filter:drop-shadow(0 0 70px rgba(61,139,255,.5));animation:heroCrestFloat 9s ease-in-out infinite}
.hero-crest img{width:100%;height:auto;display:block}
@keyframes heroCrestFloat{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.11}50%{transform:translate(-50%,-52.5%) scale(1.04);opacity:.17}}
/* tags keep floating but never sit over content: a large center
   exclusion mask pins them to the page edges (important beats the
   global mask reset at the top of this sheet) */
.hero .floating-seo-tags{position:absolute;inset:0;z-index:0!important;pointer-events:none;opacity:.5!important;mask-image:linear-gradient(90deg,black 0 24%,transparent 31% 69%,black 76% 100%)!important;-webkit-mask-image:linear-gradient(90deg,black 0 24%,transparent 31% 69%,black 76% 100%)!important}
.lock-access .floating-seo-tags{opacity:.85!important;mask-image:radial-gradient(ellipse 54% 62% at 50% 54%,transparent 0 54%,black 72%)!important;-webkit-mask-image:radial-gradient(ellipse 54% 62% at 50% 54%,transparent 0 54%,black 72%)!important}
@media(max-width:760px){.hero-crest{width:74vw;opacity:.09}.hero .floating-seo-tags{opacity:.3!important}}
`;

/* ═══════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════ */
const EDITIONS_DATA = [
  {
    num:"1", name:"MaxMUN 1.0", year:"2024",
    tag:"Founding Edition",tagClass:"legacy",
    desc:"The inaugural edition that started it all. MaxMUN 1.0 brought together Delhi's finest young minds, igniting a tradition of rigorous diplomacy at Maxfort School Dwarka.",
    committees:["FIFA","UNSC","UNGA","UNCSW","IPC","UNHRC"],
  },
  {
    num:"2", name:"MaxMUN 2.0", year:"2025",
    tag:"Legacy Edition",tagClass:"completed",
    desc:"Held on 1st & 2nd August 2025 — the second edition welcomed 150+ delegates across 7 committees, raising the bar for debate and delegate development.",
    committees:["UNGA","UNSC","UNCSW","UNEP","AIPPM","Lok Sabha","IPC"],
  },
  {
    num:"3", name:"MaxMUN 3.0", year:"2026",
    tag:"Registrations Open",tagClass:"upcoming",
    desc:"The current edition is live with public registration, matrix access, finalised committees, awards, and delegate information.",
    committees:["UNCSW","UNSC","UNGA","Lok Sabha","AIPPM","IP","FIFA"],
  },
];

const COMMITTEE_THEME_MAP = {
  UNGA:"unga", FIFA:"fifa", UNSC:"unsc", UNCSW:"uncsw",
  AIPPM:"aippm", UNEP:"unep", "Lok Sabha":"loksabha",
  UNHRC:"unhrc", IPC:"ipc",
};

const EB_ROLE_DESCRIPTIONS = {
  "Chairperson":"Leads committee sessions, maintains order, and guides debate. The final authority on procedural matters.",
  "Chair":"Leads committee sessions, maintains order, and guides debate. The final authority on procedural matters.",
  "Vice Chairperson":"Supports the Chair, assists with moderated caucuses, and ensures delegates' rights are protected.",
  "Vice Chair":"Supports the Chair, assists with moderated caucuses, and ensures delegates' rights are protected.",
  "Rapporteur":"Records proceedings, tracks resolutions, and ensures accurate documentation throughout sessions.",
  "Head of Press":"Oversees the International Press Corps, editorial standards, and live coverage operations.",
  "Head of International Press":"Oversees the full IPC newsroom — journalists, photographers, and caricaturists — and sets editorial direction.",
  "Head of IP":"Manages the International Press Corps and coordinates coverage across all committees.",
};

const ALL_COMMITTEES = [
  { abbr:"UNGA", name:"UN General Assembly", agenda:"Deliberating global frameworks for sustainable development and equitable resource distribution", desc:"The UN General Assembly is the main deliberative body of the United Nations, open to all member states. Every nation has equal voting weight — making it the world's most democratic forum.", purpose:"Delegates debate and draft resolutions on broad policy questions affecting peace, development, and human rights.", level:"Intermediate", edition:"MaxMUN 1.0", days:"2 Days",
    eb:[{role:"Chairperson",name:"Arnav Gupta"},{role:"Vice Chairperson",name:"Kashvi Arora"},{role:"Rapporteur",name:"Vedika Arora"}] },
  { abbr:"UNCSW", name:"UN Commission on the Status of Women", agenda:"Eliminating structural barriers to gender equity in education and employment", desc:"The CSW is the principal intergovernmental body dedicated to the promotion of gender equality and the empowerment of women worldwide.", purpose:"Delegates propose frameworks to accelerate gender parity across legislative, social, and economic dimensions.", level:"Beginner", edition:"MaxMUN 1.0", days:"2 Days",
    eb:[{role:"Chairperson",name:"Hiya Mongia"},{role:"Rapporteur",name:"Pari Madan"}] },
  { abbr:"UNSC", name:"UN Security Council", agenda:"Addressing threats to international peace and stability in geopolitically sensitive regions", desc:"The Security Council holds primary responsibility for the maintenance of international peace and security. Only five permanent members wield the veto.", purpose:"Delegates engage in high-stakes diplomacy, veto strategy, and rapid-response conflict resolution.", level:"Advanced", edition:"MaxMUN 1.0", days:"2 Days",
    eb:[{role:"Chairperson",name:"Anshika Singh"},{role:"Vice Chairperson",name:"Kushagra"}] },
  { abbr:"FIFA", name:"Fédération Internationale de Football Association", agenda:"Combating corruption and match-fixing in professional football governance", desc:"A unique committee simulating the governing body of world football, where policy meets sport on a global stage.", purpose:"Delegates tackle policy challenges unique to global sports governance, from financial fair play to player welfare.", level:"Beginner", edition:"MaxMUN 1.0", days:"2 Days",
    eb:[{role:"Chairperson",name:"Advit Upadhyay"},{role:"Vice Chairperson",name:"Arham Jain"},{role:"Rapporteur",name:"Raghav Arora"}] },
  { abbr:"UNHRC", name:"UN Human Rights Council", agenda:"Protecting civil liberties, privacy, and freedom of expression in the digital age", desc:"The UNHRC is responsible for promoting and protecting human rights globally, with authority to investigate violations.", purpose:"Delegates draft resolutions to uphold civil liberties and protect freedom of assembly in an increasingly surveilled world.", level:"Intermediate", edition:"MaxMUN 1.0", days:"2 Days",
    eb:[{role:"Chairperson",name:"—"},{role:"Vice Chairperson",name:"—"}] },
  { abbr:"IPC", name:"International Press Corps", agenda:"The Role of Investigative Journalism in Democratic Accountability", desc:"The IPC simulates a live newsroom environment where delegates report on all committee proceedings in real-time.", purpose:"Delegates develop critical media skills — writing under pressure, editorial judgment, and ethical reporting.", level:"Beginner", edition:"MaxMUN 1.0", days:"2 Days",
    eb:[{role:"Head of IP",name:"Ayush Vishwakarma"}] },
  { abbr:"UNGA", name:"UN General Assembly", agenda:"The demilitarization of the Arctic region and its role in maintaining global peace", desc:"Open to Grades 9–12, the UNGA serves as the chief deliberative body of the UN with landmark debate on Arctic sovereignty.", purpose:"Delegates debate the militarization of the Arctic, balancing sovereignty, resource rights, and environmental protection.", level:"Advanced", edition:"MaxMUN 2.0", days:"2 Days", grades:"Grades 9–12",
    eb:[{role:"Chairperson",name:"Pravar Denison"},{role:"Vice Chairperson",name:"Meet Goel"}] },
  { abbr:"UNSC", name:"UN Security Council", agenda:"Deliberating the rise of non-state armed groups in Africa and the Middle East", desc:"Held as a double delegation committee — each country seats two delegates to simulate real-world diplomatic teams.", purpose:"Delegates engage in high-stakes diplomacy in double-delegation format, requiring internal coordination and external persuasion.", level:"Advanced", edition:"MaxMUN 2.0", days:"2 Days", grades:"Grades 9–12", note:"Double Delegation",
    eb:[{role:"Chairperson",name:"Anshika Singh"},{role:"Vice Chairperson",name:"Dishita Jain"},{role:"Rapporteur",name:"Tarana Chauhan"}] },
  { abbr:"UNCSW", name:"UN Commission on the Status of Women", agenda:"Women's economic empowerment, healthcare access, political participation, and the pink tax", desc:"Tackled a broad and critical mandate — from wage gaps to healthcare inequity and structural political barriers.", purpose:"Delegates propose intersectional frameworks addressing structural barriers faced by women and girls globally.", level:"Intermediate", edition:"MaxMUN 2.0", days:"2 Days", grades:"Grades 6–12",
    eb:[{role:"Chairperson",name:"Ayushi Kukreja"},{role:"Vice Chairperson",name:"Avnesha Pahwa"}] },
  { abbr:"UNEP", name:"UN Environment Programme", agenda:"Climate-induced migration and its implications for global peace and sustainability", desc:"Addressing how accelerating climate change is forcing displacement of millions — a humanitarian and security crisis.", purpose:"Delegates negotiate environmental and humanitarian frameworks for climate refugees and stateless populations.", level:"Beginner", edition:"MaxMUN 2.0", days:"2 Days", grades:"Grades 6–8",
    eb:[{role:"Chairperson",name:"Saanvi Duggal"},{role:"Vice Chairperson",name:"Sanvi Gupta"},{role:"Rapporteur",name:"Prisha Nautiyal"}] },
  { abbr:"AIPPM", name:"All India Political Parties Meet", agenda:"Social media moderation, censorship, OTT regulation, and digital governance in India", desc:"AIPPM simulates India's inter-party political deliberation — where ideology meets policy in parliamentary format.", purpose:"Delegates represent major Indian political parties, debating digital rights, platform regulation, and free speech.", level:"Intermediate", edition:"MaxMUN 2.0", days:"2 Days", grades:"Grades 6–12",
    eb:[{role:"Chairperson",name:"Rishi Singh"},{role:"Vice Chairperson",name:"Harsh Chaudhary"},{role:"Rapporteur",name:"Anshika Batra"}] },
  { abbr:"Lok Sabha", name:"Lok Sabha", agenda:"Reforming India's criminal justice system and the Bharatiya Nyaya Sanhita", desc:"Lok Sabha brings India's parliamentary process to life — bills, amendments, and constitutional debate.", purpose:"Delegates draft bills, move amendments, and debate the constitutional and social implications of India's new legal code.", level:"Intermediate", edition:"MaxMUN 2.0", days:"2 Days", grades:"Grades 8–12",
    eb:[{role:"Chairperson",name:"Aman Yadav"},{role:"Vice Chairperson",name:"Rakib"},{role:"Rapporteur",name:"Divija Babbar"}] },
  { abbr:"IPC", name:"International Press Corps", agenda:"Live coverage of all MaxMUN 2.0 committees — journalism, photography, caricature", desc:"The IPC simulated a dynamic newsroom producing live reports, photo essays, and editorial caricatures across the conference.", purpose:"Delegates develop real-time reporting skills and editorial decision-making under deadline pressure.", level:"Beginner", edition:"MaxMUN 2.0", days:"2 Days", grades:"All Grades",
    eb:[{role:"Head of International Press",name:"Ayush Vishwakarma"}] },
];

const LEGACY_EB = {
  "1.0":[
    {emoji:"🌟",name:"Arnav Gupta",role:"Chairperson",committee:"UNGA",edition:"1.0"},
    {emoji:"⭐",name:"Kashvi Arora",role:"Vice Chairperson",committee:"UNGA",edition:"1.0"},
    {emoji:"📋",name:"Vedika Arora",role:"Rapporteur",committee:"UNGA",edition:"1.0"},
    {emoji:"📸",name:"Ayush Vishwakarma",role:"Head of IP",committee:"IPC",edition:"1.0"},
    {emoji:"⚽",name:"Advit Upadhyay",role:"Chairperson",committee:"FIFA",edition:"1.0"},
    {emoji:"🎯",name:"Arham Jain",role:"Vice Chairperson",committee:"FIFA",edition:"1.0"},
    {emoji:"📝",name:"Raghav Arora",role:"Rapporteur",committee:"FIFA",edition:"1.0"},
    {emoji:"⚖️",name:"Hiya Mongia",role:"Chairperson",committee:"UNCSW",edition:"1.0"},
    {emoji:"🕊️",name:"Pari Madan",role:"Rapporteur",committee:"UNCSW",edition:"1.0"},
    {emoji:"🔐",name:"Anshika Singh",role:"Chairperson",committee:"UNSC",edition:"1.0"},
    {emoji:"🛡️",name:"Kushagra",role:"Vice Chairperson",committee:"UNSC",edition:"1.0"},
  ],
  "2.0":[
    {emoji:"🌐",name:"Pravar Denison",role:"Chairperson",committee:"UNGA",edition:"2.0"},
    {emoji:"🗣️",name:"Meet Goel",role:"Vice Chairperson",committee:"UNGA",edition:"2.0"},
    {emoji:"🔐",name:"Anshika Singh",role:"Chairperson",committee:"UNSC",edition:"2.0"},
    {emoji:"⚖️",name:"Dishita Jain",role:"Vice Chairperson",committee:"UNSC",edition:"2.0"},
    {emoji:"📋",name:"Tarana Chauhan",role:"Rapporteur",committee:"UNSC",edition:"2.0"},
    {emoji:"💜",name:"Ayushi Kukreja",role:"Chairperson",committee:"UNCSW",edition:"2.0"},
    {emoji:"🌸",name:"Avnesha Pahwa",role:"Vice Chairperson",committee:"UNCSW",edition:"2.0"},
    {emoji:"🌿",name:"Saanvi Duggal",role:"Chairperson",committee:"UNEP",edition:"2.0"},
    {emoji:"🍃",name:"Sanvi Gupta",role:"Vice Chairperson",committee:"UNEP",edition:"2.0"},
    {emoji:"🌱",name:"Prisha Nautiyal",role:"Rapporteur",committee:"UNEP",edition:"2.0"},
    {emoji:"🏛️",name:"Rishi Singh",role:"Chairperson",committee:"AIPPM",edition:"2.0"},
    {emoji:"🎙️",name:"Harsh Chaudhary",role:"Vice Chairperson",committee:"AIPPM",edition:"2.0"},
    {emoji:"📜",name:"Anshika Batra",role:"Rapporteur",committee:"AIPPM",edition:"2.0"},
    {emoji:"⚡",name:"Aman Yadav",role:"Chairperson",committee:"Lok Sabha",edition:"2.0"},
    {emoji:"🎯",name:"Rakib",role:"Vice Chairperson",committee:"Lok Sabha",edition:"2.0"},
    {emoji:"📋",name:"Divija Babbar",role:"Rapporteur",committee:"Lok Sabha",edition:"2.0"},
    {emoji:"📸",name:"Ayush Vishwakarma",role:"Head of International Press",committee:"IPC",edition:"2.0"},
  ],
};

const CURRENT_FINAL_COMMITTEES = ["UNCSW", "UNSC", "UNGA", "LOK SABHA", "AIPPM", "IP", "FIFA"];

const groupLegacyEB = (items = []) => Object.values(items.reduce((acc, person) => {
  const key = person.committee || "Legacy";
  if (!acc[key]) acc[key] = { committee: key, edition: person.edition, members: [] };
  acc[key].members.push(person);
  return acc;
}, {}));

const OC_DATA = [
  { role:"Joint Secretary-Generals", emoji:"🌟", dept:"Supreme Leadership", what:"The highest authority of MaxMUN — setting the overarching vision, overseeing all departments, and bearing ultimate responsibility for delegate experience and strategic direction.", contact:"Reach out for overarching conference concerns, escalations from other departments, or matters affecting the entire conference.", skills:["Strategic Leadership","Conference Vision","Public Speaking","Crisis Management","Stakeholder Relations"] },
  { role:"Deputy Secretary-Generals", emoji:"⚖️", dept:"Executive Operations", what:"Support the JSGs in managing day-to-day operations, bridge departments, and step in to lead when a JSG is unavailable. They coordinate cross-departmental decisions.", contact:"Contact for inter-departmental concerns, general administrative queries, or if you're unsure who else to approach.", skills:["Operations Management","Team Coordination","Decision-Making","Conflict Resolution","Administrative Skills"] },
  { role:"IT Heads", emoji:"💻", dept:"Digital Command", what:"Owns the complete digital backbone of MaxMUN — website experience, registration access, matrix visibility, technical troubleshooting, and smooth online communication. This role is placed at the centre of delegate access because every delegate interaction now begins through the website.", contact:"Contact for website issues, registration-page glitches, matrix preview errors, broken links, or any digital access problem.\n\n IT support: Prakhar Bhassin · +91 9818319146", skills:["Website Management","Registration Flow","Matrix Access","Deployment","Technical Support"] },
  { role:"Head of EB Affairs", emoji:"🎙️", dept:"Committee Governance", what:"Oversees all Executive Boards — training chairs, ensuring procedural correctness, and maintaining the quality and fairness of every committee session.", contact:"Reach out for complaints about committee chairing, procedural violations, or conduct concerns involving EB members.", skills:["Robert's Rules / RoP","Chair Training","Procedural Knowledge","Quality Control","Conflict Resolution"] },
  { role:"Head of Committees", emoji:"📜", dept:"Academic Content", what:"Manages the intellectual substance of MaxMUN — committee selection, agenda setting, background guide development, and overall academic calibre.", contact:"Contact for committee topics, background guide accuracy, agenda relevance, or research-related disputes.", skills:["Research & Policy","Background Guide Writing","Agenda Design","Academic Rigour","Content Strategy"] },
  { role:"Head of Logistics", emoji:"🚀", dept:"On-Ground Operations", what:"Coordinates all physical operations — venue setup, room allocation, scheduling, session timing, and on-ground troubleshooting.", contact:"Reach out for anything related to physical space, room conflicts, session timing, or venue-related concerns.", skills:["Event Planning","Venue Coordination","Time Management","Team Deployment","Problem Solving"] },
  { role:"Head of Delegate Affairs", emoji:"🤝", dept:"Delegate Experience", what:"Primary point of contact for delegates — managing experience, portfolio allotments, country assignments, onboarding, and welfare.", contact:"Contact for portfolio issues, country or committee assignments, delegate welfare, or anything affecting your delegate experience.", skills:["Delegate Communication","Portfolio Management","Outreach & Onboarding","Conflict Resolution","Empathy"] },
  { role:"Head of Finance", emoji:"💼", dept:"Financial Management", what:"Manages the conference budget, delegate fee collection, expense tracking, and financial planning across all departments.", contact:"For payment queries, fee structure questions, or financial concerns related to your registration.", skills:["Budget Management","Fee Collection","Expense Tracking","Financial Planning","Transparency"] },
];

/* ═══════════════════════════════════════
   CANVAS
═══════════════════════════════════════ */
function FXCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    let W, H, raf, t = 0, lastFrame = 0, running = true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const particles = [];
    const cubes = [];
    const spheres = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 760 ? 1 : 1.15);
      W = window.innerWidth;
      H = window.innerHeight;
      c.width = Math.max(1, Math.floor(W * dpr));
      c.height = Math.max(1, Math.floor(H * dpr));
      c.style.width = `${W}px`;
      c.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const particleCount = reducedMotion ? 0 : window.innerWidth < 760 ? 16 : 32;
    const cubeCount = reducedMotion ? 0 : window.innerWidth < 900 ? 0 : 1;
    const sphereCount = reducedMotion ? 0 : window.innerWidth < 760 ? 1 : 2;

    for (let i = 0; i < particleCount; i++) {
      particles.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3, r: Math.random() * 1.5 + .3, o: Math.random() * .4 + .1, c: Math.random() > .7 ? "#c8953a" : "#3d8bff" });
    }
    for (let i = 0; i < cubeCount; i++) {
      cubes.push({ x: Math.random() * W, y: Math.random() * H, size: 40 + Math.random() * 60, angle: Math.random() * Math.PI, speed: .0003 + Math.random() * .0004, drift: { x: (Math.random() - .5) * .15, y: (Math.random() - .5) * .15 }, alpha: .04 + Math.random() * .05 });
    }
    for (let i = 0; i < sphereCount; i++) {
      spheres.push({ x: Math.random() * W, y: Math.random() * H, r: 30 + Math.random() * 50, speed: .0002 + Math.random() * .0003, phase: Math.random() * Math.PI * 2, alpha: .04 + Math.random() * .04, drift: { x: (Math.random() - .5) * .12, y: (Math.random() - .5) * .12 } });
    }

    const drawCube = (cx, cy, s, a, al) => {
      const cos = Math.cos(a), sin = Math.sin(a);
      const pts = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]].map(([x,y,z]) => {
        const rx = x * cos - z * sin; const rz = x * sin + z * cos;
        return { x: cx + (rx * s) / (3 + rz), y: cy + (y * s) / (3 + rz) };
      });
      const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
      ctx.strokeStyle = `rgba(61,139,255,${al})`; ctx.lineWidth = .5;
      edges.forEach(([a2, b]) => { ctx.beginPath(); ctx.moveTo(pts[a2].x, pts[a2].y); ctx.lineTo(pts[b].x, pts[b].y); ctx.stroke(); });
    };

    const drawSphere = (cx, cy, r, t2, al) => {
      for (let l = 0; l < 3; l++) {
        const tilt = (l - 1) * .5; const yr = r * Math.cos(tilt);
        ctx.beginPath(); ctx.ellipse(cx, cy, yr * .4, yr, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(200,149,58,${al * .7})`; ctx.lineWidth = .4; ctx.stroke();
      }
      for (let m = 0; m < 3; m++) {
        const angle2 = (m * Math.PI) / 3 + t2;
        ctx.beginPath(); ctx.ellipse(cx, cy, r, r, angle2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(61,139,255,${al})`; ctx.lineWidth = .4; ctx.stroke();
      }
    };

    const draw = (time = 0) => {
      if (!running) return;
      const frameGap = reducedMotion ? 180 : W < 760 ? 110 : 70;
      if (time - lastFrame < frameGap) { raf = requestAnimationFrame(draw); return; }
      lastFrame = time;
      ctx.clearRect(0, 0, W, H); t += .004;
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c.replace(")", `,${p.o * (Math.sin(t + p.x) * .3 + .7)})`).replace("rgb","rgba"); ctx.fill();
      });
      ctx.strokeStyle = "rgba(61,139,255,0.025)"; ctx.lineWidth = 1;
      const gridStep = W < 760 ? 128 : 104;
      for (let x = 0; x < W; x += gridStep) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += gridStep) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      cubes.forEach(cb => {
        cb.angle += cb.speed; cb.x += cb.drift.x; cb.y += cb.drift.y;
        if (cb.x < -100) cb.x = W + 100; if (cb.x > W + 100) cb.x = -100;
        if (cb.y < -100) cb.y = H + 100; if (cb.y > H + 100) cb.y = -100;
        drawCube(cb.x, cb.y, cb.size, cb.angle, cb.alpha);
      });
      spheres.forEach(s => {
        s.x += s.drift.x; s.y += s.drift.y;
        if (s.x < -100) s.x = W + 100; if (s.x > W + 100) s.x = -100;
        if (s.y < -100) s.y = H + 100; if (s.y > H + 100) s.y = -100;
        drawSphere(s.x, s.y, s.r, t * s.speed * 200, s.alpha);
      });
      raf = requestAnimationFrame(draw);
    };
    const onVisibility = () => {
      running = document.visibilityState === "visible";
      if (running) { lastFrame = 0; raf = requestAnimationFrame(draw); }
      else cancelAnimationFrame(raf);
    };
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(draw);
    return () => { running = false; cancelAnimationFrame(raf); window.removeEventListener("resize", resize); document.removeEventListener("visibilitychange", onVisibility); };
  }, []);
  return <canvas ref={canvasRef} className="fx-canvas" />;
}

const HOME_SECTION_ITEMS = [
  ["hero", "00"],
  ["about", "01"],
  ["editions", "02"],
  ["committees", "03"],
  ["secretariat", "04"],
  ["legacy", "05"],
  ["contact", "06"],
];

function HomeCursorLayer({ active = true }) {
  const layerRef = useRef(null);
  const dotRef = useRef(null);
  const auraRef = useRef(null);
  const traceRefs = useRef([]);

  useEffect(() => {
    if (!active || window.matchMedia("(pointer: coarse)").matches) return undefined;
    const layer = layerRef.current;
    const dot = dotRef.current;
    const aura = auraRef.current;
    const traces = traceRefs.current.filter(Boolean);
    if (!layer || !dot || !aura) return undefined;

    const state = {
      targetX: window.innerWidth / 2,
      targetY: window.innerHeight / 2,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      trace: traces.map(() => ({ x: window.innerWidth / 2, y: window.innerHeight / 2 })),
      activeEl: null,
      activeRect: null,
      raf: 0,
      running: true,
    };

    const selectors = ".edition-card,.cc,.feat,.oc-card,.legacy-placard,.legacy-member,.cinfo,.current-live-chip,.ltab,.ctab,.btn-primary,.btn-ghost,.lock-choice";

    const clearActive = () => {
      if (!state.activeEl) return;
      state.activeEl.classList.remove("cursor-reactive");
      state.activeEl.style.removeProperty("--mx");
      state.activeEl.style.removeProperty("--my");
      state.activeEl.style.removeProperty("--tilt-x");
      state.activeEl.style.removeProperty("--tilt-y");
      state.activeEl = null;
      state.activeRect = null;
    };

    const setActive = (next) => {
      if (next === state.activeEl) return;
      clearActive();
      if (!next) return;
      state.activeEl = next;
      state.activeRect = next.getBoundingClientRect();
      next.classList.add("cursor-reactive");
    };

    const onPointerMove = (event) => {
      state.targetX = event.clientX;
      state.targetY = event.clientY;
      const next = event.target?.closest?.(selectors);
      setActive(next);
      if (state.activeEl && state.activeRect) {
        const rect = state.activeRect;
        const px = Math.min(1, Math.max(0, (event.clientX - rect.left) / Math.max(1, rect.width)));
        const py = Math.min(1, Math.max(0, (event.clientY - rect.top) / Math.max(1, rect.height)));
        state.activeEl.style.setProperty("--mx", `${Math.round(px * 100)}%`);
        state.activeEl.style.setProperty("--my", `${Math.round(py * 100)}%`);
        state.activeEl.style.setProperty("--tilt-x", `${Math.round((0.5 - py) * 80) / 10}deg`);
        state.activeEl.style.setProperty("--tilt-y", `${Math.round((px - 0.5) * 90) / 10}deg`);
      }
    };

    const onPointerLeave = () => clearActive();
    const refreshRect = () => {
      if (state.activeEl) state.activeRect = state.activeEl.getBoundingClientRect();
    };

    const draw = () => {
      if (!state.running) return;
      state.x += (state.targetX - state.x) * 0.18;
      state.y += (state.targetY - state.y) * 0.18;
      dot.style.transform = `translate3d(${state.targetX}px,${state.targetY}px,0)`;
      aura.style.transform = `translate3d(${state.x}px,${state.y}px,0)`;
      traces.forEach((trace, index) => {
        const prev = index === 0 ? { x: state.x, y: state.y } : state.trace[index - 1];
        state.trace[index].x += (prev.x - state.trace[index].x) * (0.22 - index * 0.025);
        state.trace[index].y += (prev.y - state.trace[index].y) * (0.22 - index * 0.025);
        trace.style.transform = `translate3d(${state.trace[index].x}px,${state.trace[index].y}px,0)`;
        trace.style.opacity = String(Math.max(0.12, 0.42 - index * 0.055));
      });
      state.raf = requestAnimationFrame(draw);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("resize", refreshRect, { passive: true });
    window.addEventListener("scroll", refreshRect, { passive: true });
    state.raf = requestAnimationFrame(draw);

    return () => {
      state.running = false;
      cancelAnimationFrame(state.raf);
      clearActive();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", refreshRect);
      window.removeEventListener("scroll", refreshRect);
    };
  }, [active]);

  if (!active) return null;
  return (
    <div ref={layerRef} className="main-cursor-layer" aria-hidden="true">
      <span ref={auraRef} className="main-cursor-aura" />
      {[0, 1, 2, 3, 4].map((n) => (
        <span key={n} ref={(el) => { traceRefs.current[n] = el; }} className="main-cursor-trace" />
      ))}
      <span ref={dotRef} className="main-cursor-dot" />
    </div>
  );
}

function HomeSectionRail({ active = true, activeSection, onJump }) {
  if (!active) return null;
  return (
    <aside className="home-section-rail" aria-label="MAXMUN sections">
      {HOME_SECTION_ITEMS.map(([id, label]) => (
        <button key={id} className={activeSection === id ? "active" : ""} onClick={() => onJump(id)} aria-label={`Go to ${id}`}>
          {label}
        </button>
      ))}
    </aside>
  );
}

function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("vis", "visible"); obs.unobserve(e.target); } });
    }, { threshold: .1 });
    document.querySelectorAll(".sr").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function useCountdown(targetDate) {
  const [t, setT] = useState({ d:0, h:0, m:0, s:0 });
  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate) - Date.now();
      if (diff <= 0) { setT({ d:0, h:0, m:0, s:0 }); return; }
      setT({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return t;
}

function CommitteeCard({ c, onClick }) {
  const theme = COMMITTEE_THEME_MAP[c.abbr] || "unga";
  const cardRef = useRef(null);
  const onMouseMove = (e) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = ((e.clientX - r.left) / r.width - .5) * 14;
    const y = ((e.clientY - r.top) / r.height - .5) * -14;
    cardRef.current.style.transform = `translateY(-8px) rotateX(${y}deg) rotateY(${x}deg)`;
  };
  const onMouseLeave = () => { if (cardRef.current) cardRef.current.style.transform = ""; };
  return (
    <div ref={cardRef} className={`cc cc-${theme}`} onClick={() => onClick(c)} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} style={{ transition:"box-shadow .4s, border-color .4s" }}>
      <div className="cc-bar" /><div className="cc-glow" />
      <div className="cc-corner" style={{ color: cardRef.current?.style.color || "#78c1ff" }} />
      <div className="cc-abbr">{c.abbr}</div>
      <div className="cc-name">{c.name}</div>
      <div className="cc-agenda">{c.agenda}</div>
      <div className="cc-footer"><span className="cc-level">{c.level}</span><span className="cc-arrow">→</span></div>
      <div className="cc-edition-badge">{c.edition} · {c.days}</div>
    </div>
  );
}

function CommitteeModal({ committee: c, onClose }) {
  const theme = COMMITTEE_THEME_MAP[c.abbr] || "unga";
  const BAR_COLORS = { unga:"linear-gradient(90deg,#0050ff,#78c1ff,#c8953a)", fifa:"linear-gradient(90deg,#00ff7f,#50dc78,#00c853)", unsc:"linear-gradient(90deg,#dc5050,#f08080,#ffc0c0)", uncsw:"linear-gradient(90deg,#c864e8,#dc82ff,#f5c0ff)", aippm:"linear-gradient(90deg,#ff6b00,#ffb030,#ffd700)", unep:"linear-gradient(90deg,#00b4a0,#00d2b4,#80ffe8)", loksabha:"linear-gradient(90deg,#dc9632,#ffc060,#ffe0a0)", unhrc:"linear-gradient(90deg,#3080ff,#50a0ff,#a0d0ff)", ipc:"linear-gradient(90deg,#808080,#d0d0d0,#ffffff)" };
  const ABBR_COLORS = { unga:"#78c1ff", fifa:"#50dc78", unsc:"#f08080", uncsw:"#dc82ff", aippm:"#ffb030", unep:"#00d2b4", loksabha:"#dc9632", unhrc:"#50a0ff", ipc:"#d0d0d0" };
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const onKey = (event) => { if (event.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="cmodal">
        <div className="cmodal-header">
          <div className="cmodal-bar" style={{ background: BAR_COLORS[theme] }} />
          <div className="cmodal-abbr" style={{ color: ABBR_COLORS[theme] }}>{c.abbr}</div>
          <div className="cmodal-name">{c.name}</div>
          <div className="cmodal-badges">
            <span className="cmod-badge">{c.level}</span><span className="cmod-badge">{c.edition}</span>
            <span className="cmod-badge">{c.days}</span>
            {c.grades && <span className="cmod-badge">{c.grades}</span>}
            {c.note && <span className="cmod-badge" style={{ color:"#f08080", borderColor:"rgba(248,113,113,.2)" }}>{c.note}</span>}
          </div>
          <button className="cmodal-close" onClick={onClose}>✕</button>
        </div>
        <div className="cmodal-body">
          <div className="cmodal-section"><div className="cmodal-section-title">Agenda</div><div className="cmodal-agenda-box"><div className="cmodal-agenda-lbl">Agenda for Discussion</div><div className="cmodal-agenda-txt">{c.agenda}</div></div></div>
          <div className="cmodal-section"><div className="cmodal-section-title">About This Committee</div><div className="cmodal-text">{c.desc}</div></div>
          <div className="cmodal-section"><div className="cmodal-section-title">Committee Purpose</div><div className="cmodal-text">{c.purpose}</div></div>
          {c.eb?.length > 0 && (
            <div className="cmodal-section"><div className="cmodal-section-title">Executive Board</div>
              <div className="eb-panel">{c.eb.map(m => (<div className="eb-chip" key={m.role + m.name}><div className="eb-role-lbl">{m.role}</div><div className="eb-name-val">{m.name !== "—" ? m.name : "TBA"}</div>{EB_ROLE_DESCRIPTIONS[m.role] && <div className="eb-tooltip">{EB_ROLE_DESCRIPTIONS[m.role]}</div>}</div>))}</div>
            </div>
          )}
          <div className="cmodal-section"><div className="cmodal-section-title">Conference Details</div>
            <div className="cmodal-info-grid">{[["Level",c.level],["Edition",c.edition],["Duration",c.days],["Grades",c.grades||"All"],["Format","In-Person"],["Venue","Maxfort Dwarka"]].map(([l,v])=>(<div className="cmod-info" key={l}><div className="cmod-info-lbl">{l}</div><div className="cmod-info-val">{v}</div></div>))}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegisterModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const onKey = (event) => { if (event.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);
  const fi = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const validate = () => {
    const e = {};
    if (!form.name?.trim()) e.name = "Required";
    if (!form.email?.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone?.trim()) e.phone = "Required";
    if (!form.school?.trim()) e.school = "Required";
    setErrors(e); return Object.keys(e).length === 0;
  };
  const submit = async () => {
    if (!validate()) return;
    try { await DB.submitRegistration(form); } catch(e) {}
    setDone(true); onSuccess?.("Registration submitted! We'll be in touch soon. 🎊");
  };
  return (
    <div className="reg-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="reg-modal">
        <div className="reg-header"><div className="reg-title">Register as Delegate</div><div className="reg-sub">MaxMUN 3.0 · Maxfort School Dwarka · 2026</div><button className="reg-close" onClick={onClose}>✕</button></div>
        <div className="reg-body">
          {done ? (
            <div className="success-wrap"><div className="success-ico">✅</div><div className="success-title">You're Registered</div><div className="success-desc">Your application has been submitted. The Delegate Affairs team will contact you shortly.</div><button className="btn-primary" style={{ marginTop:"1.5rem", width:"auto", padding:".7rem 2rem" }} onClick={onClose}>Close</button></div>
          ) : (
            <>
              <div className="reg-frow">
                <div className="fg"><label>Full Name</label><input name="name" placeholder="Your full name" onChange={fi}/>{errors.name&&<span className="field-err">{errors.name}</span>}</div>
                <div className="fg"><label>Email</label><input name="email" placeholder="you@email.com" onChange={fi}/>{errors.email&&<span className="field-err">{errors.email}</span>}</div>
              </div>
              <div className="fg"><label>Phone Number</label><input name="phone" placeholder="+91 98765 00000" onChange={fi}/>{errors.phone&&<span className="field-err">{errors.phone}</span>}</div>
              <div className="fg"><label>School / Institution</label><input name="school" placeholder="Your school name" onChange={fi}/>{errors.school&&<span className="field-err">{errors.school}</span>}</div>
              <div className="reg-frow">
                <div className="fg"><label>Class / Grade</label><select name="grade" className="reg-select" onChange={fi}><option value="">Select class</option>{["Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12"].map(c=><option key={c}>{c}</option>)}</select></div>
                <div className="fg"><label>Conference Division</label><select name="division" className="reg-select" onChange={fi}><option value="">Select division</option><option>Junior (Classes 2–5) · 17 Jul</option><option>Senior (Classes 6–12) · 31 Jul</option></select></div>
              </div>
              <div className="fg"><label>MUN Experience</label><select name="experience" className="reg-select" onChange={fi}><option value="">Select level</option><option>First-time</option><option>1–2 conferences</option><option>3–5 conferences</option><option>5+ conferences</option></select></div>
              <button className="btn-primary" style={{ width:"100%", marginTop:".5rem" }} onClick={submit}>Submit Registration</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN HOME
═══════════════════════════════════════ */

/* ════════════════════════════════════════════════════
   PUBLIC COMPLAINT FORM
════════════════════════════════════════════════════ */
const COMPLAINT_CATEGORIES = [
  { id:"academic", label:"Academic / Committee", icon:"🏛️", desc:"Background guides, agenda, committee conduct" },
  { id:"registration", label:"Registration / Portal", icon:"📋", desc:"Account issues, delegate ID, portal access" },
  { id:"technical", label:"Technical / Website", icon:"💻", desc:"Website bugs, loading issues, portal errors" },
  { id:"logistics", label:"Logistics / Venue", icon:"📍", desc:"Venue, schedule, transportation, facilities" },
  { id:"secretariat", label:"Secretariat / Staff", icon:"👥", desc:"Staff conduct, communication, support" },
  { id:"other", label:"Other", icon:"✦", desc:"Anything else not listed above" },
];


/* ════════════════════════════════════════════════════
   LIVE ANNOUNCEMENTS SECTION
════════════════════════════════════════════════════ */
function LiveAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DB.getAnnouncements()
      .then(data => { setAnnouncements(Array.isArray(data) ? data : []); })
      .catch(() => setAnnouncements([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="ann-ticker-wrap">
      <div className="ann-ticker-label">📢 Live Announcements</div>
      <div className="ann-empty">Loading announcements…</div>
    </div>
  );

  if (!announcements.length) return null;

  return (
    <div className="ann-ticker-wrap">
      <div className="ann-ticker-label">📢 Live Announcements</div>
      {announcements.map(a => (
        <div key={a.id} className={`ann-item${a.pinned ? " ann-item-pinned" : ""}`}>
          <div className="ann-item-title">
            {a.pinned && <span className="ann-pin-badge">📌 PINNED</span>}
            {a.title}
          </div>
          <div className="ann-item-body">{a.body}</div>
          <div className="ann-item-date">{a.created_at ? new Date(a.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}) : ""}</div>
        </div>
      ))}
    </div>
  );
}

function PublicComplaintForm({ showToast }) {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState(null);
  const [form, setForm] = useState({ name:"", email:"", subject:"", description:"" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submitForm = async () => {
    if (!form.name || !form.description) { showToast("Please fill in all required fields."); return; }
    setLoading(true);
    try {
      await DB.submitComplaint("PUBLIC", form.name, form.subject || `${category.label} Issue`, form.description, category.label);
      setDone(true);
    } catch {
      showToast("Complaint submitted! We will review it shortly.");
      setDone(true);
    }
    setLoading(false);
  };

  if (done) return (
    <div style={{ textAlign:"center", padding:"3rem 1rem", background:"var(--ghost)", borderRadius:20, border:"1px solid var(--glassborder2)" }}>
      <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>✦</div>
      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.8rem", color:"var(--platinum)", marginBottom:".75rem" }}>Complaint Received</div>
      <div style={{ color:"var(--silver)", fontSize:".85rem", lineHeight:1.7, maxWidth:400, margin:"0 auto 1.5rem" }}>
        Thank you, <strong style={{ color:"var(--gold2)" }}>{form.name}</strong>. Your complaint has been submitted to the Secretariat and will be reviewed within 24–48 hours.
      </div>
      <button onClick={() => { setDone(false); setStep(1); setCategory(null); setForm({ name:"", email:"", subject:"", description:"" }); }} style={{ padding:".6rem 1.8rem", borderRadius:50, border:"1px solid var(--glassborder2)", background:"transparent", color:"var(--azure3)", cursor:"pointer", fontFamily:"inherit", fontSize:".8rem" }}>Submit Another</button>
    </div>
  );

  return (
    <div>
      {/* Step indicator */}
      <div style={{ display:"flex", alignItems:"center", gap:".5rem", marginBottom:"2rem", justifyContent:"center" }}>
        {[1,2].map(s => (
          <React.Fragment key={s}>
            <div style={{ width:32, height:32, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:".75rem", fontWeight:700, background: step >= s ? "var(--azure)" : "var(--ghost)", color: step >= s ? "#fff" : "var(--dim)", border:`1px solid ${step >= s ? "var(--azure)" : "var(--glassborder)"}`, transition:"all .3s" }}>{s}</div>
            {s < 2 && <div style={{ flex:1, maxWidth:80, height:1, background: step > s ? "var(--azure)" : "var(--glassborder)", transition:"all .3s" }} />}
          </React.Fragment>
        ))}
      </div>

      {step === 1 && (
        <div>
          <div style={{ textAlign:"center", marginBottom:"1.5rem", color:"var(--silver)", fontSize:".82rem" }}>Select the category that best describes your issue</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:"1rem" }}>
            {COMPLAINT_CATEGORIES.map(cat => (
              <div key={cat.id} onClick={() => setCategory(cat)} style={{ padding:"1.2rem 1.4rem", borderRadius:14, border:`2px solid ${category?.id === cat.id ? "var(--azure)" : "var(--glassborder)"}`, background: category?.id === cat.id ? "rgba(0,80,255,.08)" : "var(--ghost)", cursor:"pointer", transition:"all .2s", display:"flex", alignItems:"flex-start", gap:"1rem" }}>
                <div style={{ fontSize:"1.6rem", flexShrink:0 }}>{cat.icon}</div>
                <div>
                  <div style={{ fontWeight:600, color:"var(--platinum)", fontSize:".88rem", marginBottom:".25rem" }}>{cat.label}</div>
                  <div style={{ color:"var(--dim)", fontSize:".72rem", lineHeight:1.5 }}>{cat.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center", marginTop:"1.5rem" }}>
            <button onClick={() => category && setStep(2)} disabled={!category} style={{ padding:".7rem 2.5rem", borderRadius:50, border:"none", background: category ? "linear-gradient(135deg, var(--azure), var(--azure2))" : "var(--ghost)", color: category ? "#fff" : "var(--dim)", cursor: category ? "pointer" : "not-allowed", fontFamily:"inherit", fontWeight:600, fontSize:".8rem", letterSpacing:"1px", transition:"all .3s" }}>
              CONTINUE →
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ background:"var(--ghost)", border:"1px solid var(--glassborder2)", borderRadius:20, padding:"2rem" }}>
          <div style={{ display:"flex", alignItems:"center", gap:".75rem", marginBottom:"1.5rem", paddingBottom:"1rem", borderBottom:"1px solid var(--glassborder)" }}>
            <div style={{ fontSize:"1.4rem" }}>{category.icon}</div>
            <div>
              <div style={{ color:"var(--azure3)", fontSize:".7rem", fontWeight:600, letterSpacing:"1px", textTransform:"uppercase" }}>Category</div>
              <div style={{ color:"var(--platinum)", fontWeight:600 }}>{category.label}</div>
            </div>
            <button onClick={() => setStep(1)} style={{ marginLeft:"auto", padding:".3rem .8rem", borderRadius:50, border:"1px solid var(--glassborder)", background:"transparent", color:"var(--dim)", cursor:"pointer", fontSize:".7rem", fontFamily:"inherit" }}>Change</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>
            <div className="fg"><label>Full Name *</label><input value={form.name} placeholder="Your name" onChange={e => setForm(p=>({...p,name:e.target.value}))} /></div>
            <div className="fg"><label>Email</label><input type="email" value={form.email} placeholder="you@email.com" onChange={e => setForm(p=>({...p,email:e.target.value}))} /></div>
          </div>
          <div className="fg" style={{ marginBottom:"1rem" }}><label>Subject</label><input value={form.subject} placeholder="Brief subject line" onChange={e => setForm(p=>({...p,subject:e.target.value}))} /></div>
          <div className="fg" style={{ marginBottom:"1.5rem" }}><label>Description *</label><textarea rows={5} value={form.description} placeholder="Please describe your issue in detail..." onChange={e => setForm(p=>({...p,description:e.target.value}))} style={{ resize:"vertical" }} /></div>
          <button onClick={submitForm} disabled={loading} style={{ width:"100%", padding:"1rem", borderRadius:10, border:"none", background:"linear-gradient(135deg, var(--azure), var(--azure2))", color:"#fff", fontFamily:"inherit", fontWeight:700, fontSize:".78rem", letterSpacing:"2px", textTransform:"uppercase", cursor: loading ? "not-allowed":"pointer", opacity: loading ? 0.7 : 1, transition:"all .3s" }}>
            {loading ? "Submitting…" : "Submit Complaint"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════
   CONTACT FORM
════════════════════════════════════════════════════ */
function ContactForm({ showToast }) {
  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) { showToast("Please fill in all required fields."); return; }
    setLoading(true);
    try { await DB.submitContact(form); } catch {}
    setSent(true);
    showToast("Message sent! We will reply within 48 hours. ✦");
    setLoading(false);
  };

  if (sent) return (
    <div className="contact-panel" style={{ textAlign:"center" }}>
      <div style={{ fontSize:"2.5rem", marginBottom:"1rem" }}>✦</div>
      <div className="contact-panel-title" style={{ marginBottom:".5rem" }}>Message Sent!</div>
      <div style={{ color:"var(--silver)", fontSize:".82rem", lineHeight:1.6 }}>We typically respond within 24-48 hours. Thank you for reaching out.</div>
      <button className="btn-send" style={{ marginTop:"1.5rem", width:"auto", padding:".6rem 1.8rem" }} onClick={() => { setSent(false); setForm({ name:"", email:"", subject:"", message:"" }); }}>Send Another</button>
    </div>
  );

  return (
    <div className="contact-panel">
      <div className="contact-panel-title">Send a Message</div>
      <div className="contact-panel-sub">We typically respond within 24-48 hours during conference season.</div>
      <div className="fg"><label>Full Name *</label><input value={form.name} placeholder="Your name" onChange={e => setForm(p=>({...p,name:e.target.value}))} /></div>
      <div className="fg"><label>Email *</label><input type="email" value={form.email} placeholder="you@email.com" onChange={e => setForm(p=>({...p,email:e.target.value}))} /></div>
      <div className="fg"><label>Subject</label><input value={form.subject} placeholder="What is this about?" onChange={e => setForm(p=>({...p,subject:e.target.value}))} /></div>
      <div className="fg"><label>Message *</label><textarea rows={4} value={form.message} placeholder="Your question or message..." onChange={e => setForm(p=>({...p,message:e.target.value}))} style={{ resize:"vertical" }} /></div>
      <button className="btn-send" onClick={submit} disabled={loading} style={{ opacity:loading?0.7:1, cursor:loading?"not-allowed":"pointer" }}>{loading?"Sending...":"Send Message"}</button>
    </div>
  );
}


function AntiGravityField({ active = true }) {
  return null;
}

function MaxMUNHome({ onNavigateToRegister, onNavigateToAdmin, onNavigateToCurrentMun }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCommitteeTab, setActiveCommitteeTab] = useState("1.0");
  const [selectedCommittee, setSelectedCommittee] = useState(null);
  const [legacyTab, setLegacyTab] = useState("1.0");
  const [expandedOC, setExpandedOC] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [toast, setToast] = useState("");
  const [gatewayOpen, setGatewayOpen] = useState(() => window.location.hash !== "#admin");
  const [activeSection, setActiveSection] = useState("hero");
  const activeSectionRef = useRef("hero");
  const cd = useCountdown("2026-07-31T09:00:00");

  useScrollReveal();

  useEffect(() => { const fn = () => setScrolled(window.scrollY > 40); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);

  useEffect(() => {
    if (gatewayOpen) return undefined;
    let raf = 0;
    const updateActive = () => {
      raf = 0;
      const probe = window.innerHeight * 0.38;
      let nextId = activeSectionRef.current;
      HOME_SECTION_ITEMS.forEach(([id]) => {
        const el = document.getElementById(id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= probe && rect.bottom >= probe) nextId = id;
      });
      if (nextId !== activeSectionRef.current) {
        document.getElementById(activeSectionRef.current)?.classList.remove("home-in-view");
        activeSectionRef.current = nextId;
        document.getElementById(nextId)?.classList.add("home-in-view");
        setActiveSection(nextId);
      } else {
        document.getElementById(nextId)?.classList.add("home-in-view");
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(updateActive);
    };
    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      HOME_SECTION_ITEMS.forEach(([id]) => document.getElementById(id)?.classList.remove("home-in-view"));
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [gatewayOpen]);

  const go = id => { smoothScrollToId(id); setMenuOpen(false); };
  const showToast = msg => { setToast(msg); setTimeout(() => setToast(""), 4000); };
  const openPreviousVersions = () => {
    setGatewayOpen(false);
    requestAnimationFrame(forceScrollTop);
  };
  const openCurrentMun = () => {
    setGatewayOpen(false);
    forceScrollTop();
    onNavigateToCurrentMun?.();
  };

  const mm1 = ALL_COMMITTEES.filter(c => c.edition === "MaxMUN 1.0");
  const mm2 = ALL_COMMITTEES.filter(c => c.edition === "MaxMUN 2.0");

  return (
    <>
      <style>{STYLES}</style>
      {!gatewayOpen && <FXCanvas />}
      <HomeCursorLayer active />
      {!gatewayOpen && <HomeSectionRail active={!gatewayOpen} activeSection={activeSection} onJump={go} />}
      <div className="noise-layer" />
      {gatewayOpen && <LockAccess onPrevious={openPreviousVersions} onCurrent={openCurrentMun} />}

      <nav className={`nav${scrolled ? " solid":""}`}>
        <div className="nav-brand" onClick={() => go("hero")}><div className="nav-brand-dot" />MAXMUN<span className="nav-badge">3.0</span></div>
        <div className="nav-links">
          <a onClick={() => go("about")}>About</a><a onClick={() => go("editions")}>Editions</a>
          <a onClick={() => go("committees")}>Committees</a><a onClick={() => go("secretariat")}>Secretariat</a>
          <a onClick={() => go("legacy")}>Legacy</a><a onClick={() => go("contact")}>Contact</a>
          <a onClick={() => onNavigateToCurrentMun?.()} style={{ color:"var(--gold2)", cursor:"pointer" }}>Current MUN</a>
          <a onClick={() => onNavigateToRegister?.()} style={{ fontSize:".72rem", letterSpacing:"1.5px", color:"var(--sky)", cursor:"pointer" }}>Register Now</a>
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(p => !p)}><span /><span /><span /></button>
      </nav>
      {menuOpen && (
        <div className="mob-menu open">
          {["about","editions","committees","secretariat","legacy","contact"].map(id => (<a key={id} onClick={() => go(id)}>{id.charAt(0).toUpperCase() + id.slice(1)}</a>))}
          <a onClick={() => { onNavigateToCurrentMun?.(); setMenuOpen(false); }} style={{ color:"var(--gold2)" }}>Current MUN</a>
          <a onClick={() => { onNavigateToRegister?.(); setMenuOpen(false); }} style={{ color:"var(--sky)" }}>Register Now</a>
        </div>
      )}

      <section className="hero" id="hero">
        <div className="hero-bg" /><div className="hero-grid" /><div className="hero-grid-diagonal" />
        <div className="hero-orb hero-orb-1" /><div className="hero-orb hero-orb-2" /><div className="hero-orb hero-orb-3" />
        <div className="hero-sphere">
          <svg className="sphere-svg" viewBox="0 0 400 400" fill="none">
            {[0,30,60,90,120,150].map(deg => (<ellipse key={deg} cx="200" cy="200" rx="180" ry="60" transform={`rotate(${deg} 200 200)`} stroke="#3d8bff" strokeWidth=".8" opacity=".5" />))}
            {[-120,-80,-40,0,40,80,120].map((dy,i) => { const r = Math.sqrt(Math.max(0, 180*180 - dy*dy)); return <ellipse key={i} cx="200" cy={200+dy} rx={r} ry={r*.15} stroke="#c8953a" strokeWidth=".5" opacity=".35" />; })}
            <circle cx="200" cy="200" r="6" fill="#78c1ff" opacity=".8" />
            <circle cx="200" cy="200" r="180" stroke="#1a6fff" strokeWidth=".5" strokeDasharray="4 8" opacity=".3" />
          </svg>
        </div>
        <FloatingSEOTags />
        <div className="hero-crest" aria-hidden="true"><img src="/maxmun-crest-centered.png" alt="" /></div>
        <div className="hero-content">
          <div className="hero-overline"><div className="hero-overline-line" />Maxfort School Dwarka · New Delhi · India<div className="hero-overline-line-r" /></div>
          <div className="hero-title-wrap"><h1 className="hero-title">MAX<span className="hero-title-accent">MUN</span></h1></div>
          <div className="hero-edition">Edition 3.0 · Two Conferences · 2026</div>
          <p className="hero-sub">Delhi's most prestigious student-led Model United Nations.<br />Junior Conference: <strong style={{color:"var(--gold2)"}}>17 July</strong> &nbsp;·&nbsp; Senior Conference: <strong style={{color:"var(--gold2)"}}>31 July</strong></p>
          <div className="hero-actions"><button className="btn-primary" style={{ padding:"1.05rem 1.85rem", fontSize:".82rem" }} onClick={() => onNavigateToCurrentMun?.()}>Explore Current MAXMUN 3.0</button><button className="btn-ghost" style={{ padding:"1.05rem 1.85rem", fontSize:".82rem" }} onClick={() => onNavigateToRegister?.()}>Register Now</button></div>
          <div className="hero-metrics">{[["150+","Delegates"],["7","Committees"],["3","Editions"],["2","Conferences"]].map(([n,l]) => (<div key={l} style={{ textAlign:"center" }}><div className="metric-num">{n.replace("+","")}{n.includes("+") && <span>+</span>}</div><div className="metric-label">{l}</div></div>))}</div>
        </div>
        <div className="hero-scroll"><div className="scroll-line"/>Scroll</div>
      </section>

      <section className="section" id="about" style={{ background:"var(--ink)" }}>
        <div className="about-layout">
          <div className="sr">
            <div className="section-label">About MaxMUN</div>
            <h2 className="section-h">Delhi's Home for<br /><em>Flagship Diplomacy</em></h2>
            <p className="section-p">MaxMUN is Maxfort School Dwarka's signature Model United Nations experience. Now entering its third edition, MaxMUN 3.0 expands into two conferences — Junior for Classes 2–5, and Senior for Classes 6–12.</p>
            <div className="about-features">
              {[{ icon:"🏛️", name:"Rigorous Committees", text:"Spanning UN bodies, Indian parliamentary forums, and specialist commissions — each built for depth." },{ icon:"🎙️", name:"Expert Executive Boards", text:"Led by Maxfort's most experienced student chairs, trained by the Head of EB Affairs." },{ icon:"🏆", name:"Merit-Based Awards", text:"Compete for Best Delegate, Outstanding Delegate, and special mentions across all committees." },{ icon:"📍", name:"Maxfort School Dwarka", text:"Designed by students, for students, at our home campus in New Delhi." }].map(f => (<div className="feat" key={f.name}><div className="feat-icon">{f.icon}</div><div><div className="feat-name">{f.name}</div><div className="feat-text">{f.text}</div></div></div>))}
            </div>
          </div>
          <div className="about-visual sr sr-delay-2">
            <div className="glass-cards-stack">
              <div className="gcard gcard-1"><div className="gcard-ico">📜</div><div className="gcard-t">Research</div><div className="gcard-s">Policy-driven committee content</div></div>
              <div className="gcard gcard-2"><div className="gcard-ico">⚖️</div><div className="gcard-t">Procedure</div><div className="gcard-s">Structured parliamentary debate</div></div>
              <div className="gcard gcard-3"><div className="gcard-ico">🏆</div><div className="gcard-t">Excellence</div><div className="gcard-s">Awards recognising the finest</div></div>
            </div>
          </div>
        </div>
      </section>

      <div className="countdown-section">
        <div className="countdown-bg-text">3.0</div>
        <div className="countdown-inner sr">
          <div className="countdown-label">MaxMUN 3.0 Countdown</div>
          <div className="countdown-grid">{[["Days", cd.d], ["Hours", cd.h], ["Minutes", cd.m], ["Seconds", cd.s]].map(([u, n]) => (<div className="cdown-unit" key={u}><div className="cdown-num">{String(n).padStart(2, "0")}</div><div className="cdown-u">{u}</div></div>))}</div>
          <div style={{ fontSize:".78rem", color:"var(--silver)", marginBottom:"1.5rem" }}>Until Senior Conference · 31 July 2026</div>
          <div className="countdown-info"><div className="cdown-conf"><span>Senior Conference</span> · Classes 6–12 · 31 July 2026</div><div className="cdown-conf"><span>Junior Conference</span> · Classes 2–5 · 17 July 2026</div></div>
        </div>
      </div>

      <section className="section" id="editions" style={{ background:"var(--ink1)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div className="section-header sr"><div className="section-label">All Editions</div><h2 className="section-h">Three Years of <em>MaxMUN</em></h2><p className="section-p" style={{ marginBottom:"3rem" }}>From our founding conference to the upcoming third edition.</p></div>
          <div className="editions-grid">{EDITIONS_DATA.map((e, i) => (<div key={e.num} className={`edition-card sr sr-delay-${i+1}`} onClick={() => { if (e.num === "3") { onNavigateToCurrentMun?.(); return; } setActiveCommitteeTab(`${e.num}.0`); go("committees"); }}><div className="ed-bar" /><div className="ed-num">{e.num}</div><div className="ed-name">{e.name}</div><div className="ed-year">{e.year}</div><div className="ed-desc">{e.desc}</div><div className="ed-committees"><div style={{ fontSize:".6rem", color:"var(--dim)", letterSpacing:"2px", textTransform:"uppercase", marginBottom:".4rem" }}>Committees</div><div className="ed-cmds">{e.committees.map(cm => <span key={cm} className="ed-cmd-chip">{cm}</span>)}</div></div><div className={`ed-tag ${e.tagClass}`}>{e.tag}</div></div>))}</div>
        </div>
      </section>

      <section className="section committees-section" id="committees">
        <div style={{ maxWidth:1300, margin:"0 auto" }}>
          <div className="section-header sr"><div className="section-label">Previous Editions</div><h2 className="section-h">Committee <em>Archive</em></h2><p className="section-p" style={{ marginBottom:"2.5rem" }}>Click any card to explore the full committee history.</p></div>
          <div className="committees-tabs">{["1.0","2.0"].map(tab => (<button key={tab} className={`ctab${activeCommitteeTab === tab ? " active":""}`} onClick={() => setActiveCommitteeTab(tab)}>MaxMUN {tab}</button>))}</div>
          <div className="committees-grid">
            {(activeCommitteeTab === "1.0" ? mm1 : mm2).map(c => (<CommitteeCard key={c.abbr + c.edition} c={c} onClick={setSelectedCommittee} />))}
          </div>
        </div>
      </section>

      <section className="section" id="agenda" style={{ background:"var(--ink1)" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div className="section-header sr" style={{ marginBottom:"2rem" }}><div className="section-label">MAXMUN 3.0 Live</div><h2 className="section-h">Senior Committees <em>Are Live</em></h2><p className="section-p">Final committees are now published. Use the current MUN hub for registration, matrix preview, agendas, awards, and delegate resources.</p></div>
          <div className="current-live-strip sr">{CURRENT_FINAL_COMMITTEES.map(cm => <div className="current-live-chip" key={cm}>{cm}</div>)}</div>
          <div style={{ textAlign:"center", marginTop:"2rem" }}><button className="btn-primary" onClick={() => onNavigateToCurrentMun?.()}>Explore MAXMUN 3.0 Hub</button></div>
        </div>
      </section>

      <section className="section" id="secretariat">
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div className="section-header sr" style={{ marginBottom:"3rem" }}><div className="section-label">Secretariat</div><h2 className="section-h">The Organising <em>Council</em></h2><p className="section-p">Every role exists to serve the delegate experience. Click any position to learn more.</p></div>
          <div className="oc-grid sr">{OC_DATA.map(item => (<div key={item.role} className={`oc-card${expandedOC === item.role ? " expanded":""}`} onClick={() => setExpandedOC(p => p === item.role ? null : item.role)}><div className="oc-card-accent" /><div className="oc-header"><div className="oc-emoji">{item.emoji}</div><div><div className="oc-role">{item.role}</div><div className="oc-dept">{item.dept}</div></div><div className="oc-chevron">▼</div></div><div className="oc-body"><div className="oc-body-inner"><div className="oc-what">{item.what}</div><div className="oc-contact-lbl">When to Contact</div><div className="oc-contact-txt">{item.contact}</div><div className="oc-skills">{item.skills.map(s => <span key={s} className="oc-skill">{s}</span>)}</div></div></div></div>))}</div>
        </div>
      </section>

      <section className="section" id="legacy" style={{ background:"var(--ink1)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div className="section-header sr" style={{ marginBottom:"2.5rem" }}><div className="section-label">Legacy Hall</div><h2 className="section-h">The Founding & Legacy <em>Executive Boards</em></h2><p className="section-p">Every edition is shaped by its chairs and rapporteurs. This is their permanent record.</p></div>
          <div className="legacy-tabs">{["1.0","2.0"].map(t => (<button key={t} className={`ltab${legacyTab === t ? " active":""}`} onClick={() => setLegacyTab(t)}>{t === "1.0" ? "Founding Edition — 1.0" : "Legacy Edition — 2.0"}</button>))}</div>
          <div className="legacy-placard-grid sr">{groupLegacyEB(LEGACY_EB[legacyTab] || []).map(group => (<div className="legacy-placard" key={legacyTab + group.committee}><div className="legacy-placard-head"><div className="legacy-committee-name">{group.committee}</div><div className="legacy-placard-badge">MM {group.edition}</div></div><div className="legacy-member-list">{group.members.map((p, i) => (<div className="legacy-member" key={p.name + p.role + i}><div className="legacy-member-emoji">{p.emoji}</div><div><div className="legacy-member-name">{p.name}</div><div className="legacy-member-role">{p.role}</div></div></div>))}</div></div>))}</div>
        </div>
      </section>

      {/* ═══ ANNOUNCEMENTS SECTION ═══ */}
      <section className="section" id="announcements" style={{ background:"var(--ink)", paddingBottom:"2rem" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <div className="section-header sr" style={{ marginBottom:"2rem" }}>
            <div className="section-label">Updates</div>
            <h2 className="section-h">Official <em>Announcements</em></h2>
            <p className="section-p">Stay up to date with the latest news from the MaxMUN Secretariat.</p>
          </div>
          <div className="sr">
            <LiveAnnouncements />
          </div>
        </div>
      </section>

      {/* ═══ COMPLAINTS SECTION ═══ */}
      <section className="section" id="complaints" style={{ background:"linear-gradient(180deg, var(--ink) 0%, var(--ink1) 100%)", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:0 }}>
          <div style={{ position:"absolute", top:"10%", left:"5%", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle, rgba(0,80,255,.08) 0%, transparent 70%)" }} />
          <div style={{ position:"absolute", bottom:"10%", right:"5%", width:250, height:250, borderRadius:"50%", background:"radial-gradient(circle, rgba(200,149,58,.06) 0%, transparent 70%)" }} />
        </div>
        <div style={{ maxWidth:1000, margin:"0 auto", position:"relative", zIndex:1 }}>
          <div className="section-header sr" style={{ marginBottom:"3rem" }}>
            <div className="section-label">Support</div>
            <h2 className="section-h">Submit a <em>Complaint</em></h2>
            <p className="section-p">Facing an issue? Select a category and describe your concern — the Secretariat will respond promptly.</p>
          </div>
          <PublicComplaintForm showToast={showToast} />
        </div>
      </section>

      {/* ═══ CONTACT SECTION ═══ */}
      <section className="section" id="contact">
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div className="section-header sr" style={{ marginBottom:"3rem" }}><div className="section-label">Contact</div><h2 className="section-h">Reach the <em>Secretariat</em></h2><p className="section-p">Questions about committees, registration, or anything MaxMUN — we're here.</p></div>
          <div className="contact-layout">
            <div className="sr">
              <div className="contact-info-list">
                {[{ ico:"📍", label:"Venue", val:"Maxfort School, Sector 7, Dwarka, New Delhi" },{ ico:"📅", label:"Conference Dates", val:"Junior: 17 Jul · Senior: 31 Jul 2026" },{ ico:"📧", label:"Email", val:"maxmun@maxfortdwarka.com" },
                  { ico:"💻", label:"Website / IT Support", val:"Prakhar Bhassin · +91 9818319146" },{ ico:"📸", label:"Follow for Updates", val:null, socials:["Instagram","LinkedIn","Twitter"] }].map(item => (<div className="cinfo" key={item.label}><div className="cinfo-ico">{item.ico}</div><div><div className="cinfo-label">{item.label}</div>{item.val && <div className="cinfo-val">{item.val}</div>}{item.socials && <div className="socials">{item.socials.map(s => <a key={s} className="soc-chip" href="" onClick={(event) => event.preventDefault()}>{s}</a>)}</div>}</div></div>))}
              </div>
            </div>
            <div className="sr sr-delay-2">
              <ContactForm showToast={showToast} />
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-inner">
          <div className="footer-top">
            <div><div className="footer-brand">MAXMUN<span className="footer-brand-dot" /></div><div className="footer-desc">Maxfort School Dwarka's flagship Model United Nations — training the next generation of global thinkers since 2024.</div></div>
            <div><div className="footer-col-title">Navigate</div><div className="footer-links">{[["about","About"],["editions","Editions"],["committees","Committees"],["secretariat","Secretariat"],["legacy","Legacy"],["announcements","Announcements"],["complaints","Complaints"],["contact","Contact"]].map(([id,label]) => (<a key={id} onClick={() => go(id)}>{label}</a>))}</div></div>
            <div><div className="footer-col-title">Editions</div><div className="footer-links"><a>MaxMUN 1.0 — 2024</a><a>MaxMUN 2.0 — 2025</a><a>MaxMUN 3.0 — 2026</a></div></div>
            <div><div className="footer-col-title">MaxMUN 3.0</div><div className="footer-links"><a>Conference Day 1: 31 July 2026</a><a>Conference Day 2: 1 August 2026</a><a>Maxfort Dwarka</a><a>IT Support: +91 9818319146</a><a onClick={() => onNavigateToCurrentMun?.()} style={{ color:"var(--gold2)", cursor:"pointer" }}>Explore Current MUN →</a><a onClick={() => onNavigateToRegister?.()} style={{ color:"var(--sky)" }}>Register Now →</a><a onClick={() => onNavigateToAdmin?.()} style={{ cursor:"pointer", color:"var(--dim)", fontSize:".72rem", letterSpacing:"1px" }}>Secretariat Access</a></div></div>
          </div>
          <div className="footer-bottom"><div className="footer-copy">© 2026 MaxMUN · Maxfort School Dwarka. All rights reserved.</div><div className="footer-right">Made by <span>♦</span> Prakhar Bhassin · IT Head, MAXMUN 3.0 Organising Committee</div></div>
        </div>
      </footer>

      {selectedCommittee && <CommitteeModal committee={selectedCommittee} onClose={() => setSelectedCommittee(null)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} onSuccess={msg => { setShowRegister(false); showToast(msg); }} />}
      {toast && <div className="toast">✦ {toast}</div>}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PORTAL SYSTEM
═══════════════════════════════════════════════════════════════════ */
const COMMITTEE_OPTIONS = ["UNGA","UNSC","UNCSW","FIFA","UNHRC","IPC","UNEP","AIPPM","Lok Sabha"];

const API_BASE = "https://backend-maxmun.vercel.app";
const isLocalPreviewHost = () => (
  typeof window !== "undefined" &&
  /^(localhost|127\.0\.0\.1|::1)$/.test(window.location.hostname)
);

const Session = {
  get: () => { try { return JSON.parse(localStorage.getItem("mm_session") || "null"); } catch { return null; } },
  save: (s) => localStorage.setItem("mm_session", JSON.stringify(s)),
  clear: () => localStorage.removeItem("mm_session"),
};

const AdminAuth = {
  save: (id, pw) => {
    localStorage.setItem("mm_admin_id", id);
    localStorage.setItem("mm_admin_pw", pw);
  },
  getId: () => localStorage.getItem("mm_admin_id") || "",
  getPw: () => localStorage.getItem("mm_admin_pw") || "",
  clear: () => {
    localStorage.removeItem("mm_admin_id");
    localStorage.removeItem("mm_admin_pw");
  },
};

async function apiFetch(path, options = {}) {
  if (path === "/announcements" && (!options.method || options.method === "GET") && isLocalPreviewHost()) {
    return [];
  }

  const res = await fetch(`${API_BASE}/api${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data;
}

function adminFetch(path, options = {}) {
  // Inject admin credentials into every request
  const id = AdminAuth.getId();
  const pw = AdminAuth.getPw();
  
  // For GET requests, append to URL as query params
  if (!options.method || options.method === "GET") {
    const sep = path.includes("?") ? "&" : "?";
    const authedPath = path + sep + "aid=" + encodeURIComponent(id) + "&apw=" + encodeURIComponent(pw);
    return apiFetch(authedPath, options);
  }
  
  // For POST/PUT/DELETE, merge credentials into body
  let body = {};
  try { body = options.body ? JSON.parse(options.body) : {}; } catch {}
  return apiFetch(path, {
    ...options,
    body: JSON.stringify({ ...body, _aid: id, _apw: pw }),
  });
}

const DB = {
  getSession: Session.get,
  saveSession: Session.save,
  clearSession: () => { Session.clear(); AdminAuth.clear(); },

  // ── AUTH ──
  loginDelegate: async (delegateId, password) => {
    const data = await apiFetch("/auth/delegate", {
      method: "POST", body: JSON.stringify({ delegateId, password }),
    });
    Session.save({ type: "delegate", id: data.delegate.id });
    return data.delegate;
  },
  loginAdmin: async (adminId, password) => {
    await apiFetch("/auth/admin", {
      method: "POST", body: JSON.stringify({ adminId, password }),
    });
    AdminAuth.save(adminId, password);
    Session.save({ type: "admin", id: adminId });
  },

  // ── PUBLIC ──
  getAnnouncements: () => apiFetch("/announcements"),
  submitRegistration: (form) => apiFetch("/registrations", { method: "POST", body: JSON.stringify(form) }),
  submitContact: (form) => apiFetch("/contact", { method: "POST", body: JSON.stringify(form) }),

  // ── DELEGATE PORTAL ──
  getMyProfile: (id) => apiFetch(`/delegate/me?id=${encodeURIComponent(id)}`),
  getMyComplaints: (id) => apiFetch(`/delegate/complaints?id=${encodeURIComponent(id)}`),
  submitComplaint: (delegateId, delegateName, subject, description, category) =>
    apiFetch("/delegate/complaints", { method: "POST", body: JSON.stringify({ delegateId, delegateName, subject, description, category }) }),

  // ── ADMIN: DELEGATES ──
  getDelegates: () => adminFetch("/admin/delegates"),
  createDelegate: (d) => adminFetch("/admin/delegates", { method: "POST", body: JSON.stringify(d) }),
  updateDelegate: (id, d) => adminFetch(`/admin/delegates/${id}`, { method: "PUT", body: JSON.stringify(d) }),
  deleteDelegate: (id) => adminFetch(`/admin/delegates/${id}`, { method: "DELETE" }),

  // ── ADMIN: COMPLAINTS ──
  getAllComplaints: () => adminFetch("/admin/complaints"),
  updateComplaintStatus: (id, status) => adminFetch(`/admin/complaints/${id}`, { method: "PUT", body: JSON.stringify({ status }) }),

  // ── ADMIN: ANNOUNCEMENTS ──
  createAnnouncement: (title, body, pinned) => adminFetch("/admin/announcements", { method: "POST", body: JSON.stringify({ title, body, pinned }) }),
  updateAnnouncement: (id, title, body, pinned) => adminFetch(`/admin/announcements/${id}`, { method: "PUT", body: JSON.stringify({ title, body, pinned }) }),
  deleteAnnouncement: (id) => adminFetch(`/admin/announcements/${id}`, { method: "DELETE" }),

  // ── ADMIN: MESSAGES ──
  getMessages: () => adminFetch("/admin/messages"),
  markMessageRead: (id) => adminFetch(`/admin/messages/${id}/read`, { method: "PUT" }),
  deleteMessage: (id) => adminFetch(`/admin/messages/${id}`, { method: "DELETE" }),

  // ── ADMIN: STATS ──
  getStats: () => adminFetch("/admin/stats"),
};

/* ─── PORTAL STYLES ─── */
const PORTAL_STYLES = `
.portal-page{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;padding:2rem;z-index:2;overflow-y:auto;background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(0,80,255,.30),transparent 65%),radial-gradient(ellipse 50% 40% at 85% 80%,rgba(200,149,58,.14),transparent 60%),linear-gradient(180deg,#0a1628 0%,#05091a 100%)}
.portal-page-signup{align-items:flex-start;padding-top:2.5rem;padding-bottom:2.5rem}
.portal-card{background:rgba(8,20,42,.99);border:1px solid rgba(120,193,255,.28);border-radius:var(--r24);width:100%;max-width:480px;box-shadow:0 40px 100px rgba(0,0,0,.7),0 0 0 1px rgba(0,80,255,.12),var(--glow-azure);overflow:hidden;animation:portalIn .4s cubic-bezier(.25,.46,.45,.94) both;position:relative}
.portal-card-wide{max-width:580px}
@keyframes portalIn{from{opacity:0;transform:translateY(24px) scale(.97)}to{opacity:1;transform:none}}
.portal-card-top{padding:2rem 2rem 1.5rem;background:linear-gradient(135deg,rgba(0,80,255,.16),rgba(0,80,255,.06));border-bottom:1px solid rgba(120,193,255,.20);position:relative}
.portal-card-bar{position:absolute;top:0;left:0;right:0;height:2.5px;background:linear-gradient(90deg,var(--azure),var(--azure3),var(--gold));border-radius:var(--r24) var(--r24) 0 0}
.portal-brand{display:flex;align-items:center;gap:8px;margin-bottom:1.2rem;cursor:pointer}
.portal-brand-name{font-family:'Syncopate',sans-serif;font-size:.75rem;font-weight:700;letter-spacing:4px;color:#fff;text-transform:uppercase}
.portal-brand-dot{width:7px;height:7px;border-radius:50%;background:var(--gold2);box-shadow:0 0 8px var(--gold)}
.portal-title{font-family:'Cormorant Garamond',serif;font-size:1.7rem;font-weight:400;color:#fff;margin-bottom:.3rem;letter-spacing:-.3px}
.portal-sub{font-size:.78rem;color:rgba(200,230,255,.85);line-height:1.5}
.portal-body{padding:1.8rem 2rem 2rem}
.pf{margin-bottom:1.1rem}
.pf label{display:block;font-size:.62rem;letter-spacing:2.5px;color:rgba(210,235,255,.95);text-transform:uppercase;margin-bottom:.45rem;font-weight:700}
.pf input,.pf select,.pf textarea{width:100%;background:rgba(0,15,40,.7);border:1px solid rgba(120,193,255,.30);border-radius:var(--r8);padding:.75rem 1rem;color:#fff;font-size:.88rem;font-family:'Space Grotesk',sans-serif;outline:none;transition:border-color .25s,box-shadow .25s}
.pf input::placeholder,.pf textarea::placeholder{color:rgba(140,180,220,.55)}
.pf input:focus,.pf select:focus,.pf textarea:focus{border-color:rgba(120,193,255,.65);background:rgba(0,25,65,.75);box-shadow:0 0 0 3px rgba(0,80,255,.16)}
.pf select{-webkit-appearance:none;cursor:pointer;color:#fff}
.pf select option{background:#0c1c34;color:#fff}
.pf-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
.pf-err{font-size:.70rem;color:#ff8080;margin-top:.35rem;display:block;font-weight:500}
.portal-btn{width:100%;background:linear-gradient(135deg,var(--azure),#2a7fff);color:#fff;border:none;padding:.95rem;border-radius:var(--r8);font-size:.8rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;transition:all .3s;margin-top:.4rem;box-shadow:0 4px 24px rgba(0,80,255,.4)}
.portal-btn:hover{transform:translateY(-2px);box-shadow:0 8px 40px rgba(0,80,255,.55)}
.portal-btn:disabled{opacity:.55;cursor:not-allowed;transform:none}
.portal-link{text-align:center;margin-top:1.5rem;font-size:.82rem;color:rgba(200,225,255,.9);padding:.5rem}
.portal-link a{color:#a8d4ff;cursor:pointer;font-weight:700;transition:color .2s;text-decoration:underline;text-decoration-color:rgba(168,212,255,.4);text-underline-offset:2px;display:inline}
.portal-link a:hover{color:#fff}
.portal-divider{display:flex;align-items:center;gap:1rem;margin:1.2rem 0}
.portal-divider::before,.portal-divider::after{content:'';flex:1;height:1px;background:rgba(120,193,255,.15)}
.portal-divider span{font-size:.65rem;color:rgba(120,193,255,.5);letter-spacing:2px;text-transform:uppercase}

.badge-status{display:inline-block;padding:.2rem .75rem;border-radius:var(--r50);font-size:.62rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase}
.badge-pending{background:rgba(250,204,21,.12);border:1px solid rgba(250,204,21,.3);color:#facc15}
.badge-approved{background:rgba(74,222,128,.12);border:1px solid rgba(74,222,128,.3);color:#4ade80}
.badge-rejected{background:rgba(248,113,113,.12);border:1px solid rgba(248,113,113,.3);color:#f87171}
.badge-paid{background:rgba(74,222,128,.12);border:1px solid rgba(74,222,128,.3);color:#4ade80}
.badge-review{background:rgba(147,197,253,.12);border:1px solid rgba(147,197,253,.3);color:#93c5fd}
.badge-resolved{background:rgba(74,222,128,.12);border:1px solid rgba(74,222,128,.3);color:#4ade80}
.badge-tba{background:rgba(161,161,170,.1);border:1px solid rgba(161,161,170,.2);color:#a1a1aa}

.dash-page{min-height:100vh;background:var(--ink);position:relative;z-index:2;padding-top:70px}
.dash-nav{position:fixed;top:0;left:0;right:0;z-index:600;height:70px;display:flex;align-items:center;justify-content:space-between;padding:0 clamp(1.5rem,4vw,3rem);background:rgba(3,6,13,.92);backdrop-filter:blur(24px);border-bottom:1px solid var(--glassborder)}
.dash-nav-brand{display:flex;align-items:center;gap:8px;cursor:pointer;font-family:'Syncopate',sans-serif;font-size:.8rem;font-weight:700;letter-spacing:4px;color:var(--platinum)}
.dash-nav-right{display:flex;align-items:center;gap:1rem}
.dash-nav-del-id{font-size:.65rem;letter-spacing:2px;color:var(--gold2);background:rgba(200,149,58,.08);border:1px solid rgba(200,149,58,.2);border-radius:var(--r4);padding:.3rem .8rem;font-weight:700}
.dash-logout-btn{background:transparent;border:1px solid var(--glassborder);color:var(--silver);padding:.4rem .9rem;border-radius:var(--r4);font-size:.68rem;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;transition:all .2s}
.dash-logout-btn:hover{border-color:rgba(248,113,113,.4);color:#f87171}
.dash-container{max-width:1100px;margin:0 auto;padding:2.5rem clamp(1.5rem,4vw,3rem) 4rem}
.dash-greeting{margin-bottom:2.5rem;animation:portalIn .5s ease both}
.dash-greeting-name{font-family:'Cormorant Garamond',serif;font-size:clamp(1.6rem,4vw,2.6rem);font-weight:400;color:var(--platinum);margin-bottom:.4rem;line-height:1.1}
.dash-greeting-sub{font-size:.82rem;color:var(--silver)}
.dash-id-pill{display:inline-block;margin-left:.8rem;background:rgba(0,80,255,.12);border:1px solid rgba(0,80,255,.25);border-radius:var(--r4);padding:.15rem .6rem;font-size:.65rem;color:var(--azure3);font-weight:700;letter-spacing:2px;vertical-align:middle}
.profile-card{background:var(--ghost);border:1px solid var(--glassborder);border-radius:var(--r16);padding:1.8rem;margin-bottom:1.5rem;display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:1.2rem;animation:portalIn .5s .05s ease both;position:relative;overflow:hidden}
.profile-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1.5px;background:linear-gradient(90deg,var(--azure),var(--azure3),var(--gold))}
.profile-field{padding:.8rem 0;border-bottom:1px solid var(--glassborder)}
.profile-field:last-child{border-bottom:none}
.pf-lbl{font-size:.58rem;letter-spacing:2px;color:var(--dim);text-transform:uppercase;margin-bottom:4px;font-weight:600}
.pf-val{font-size:.88rem;color:var(--platinum);font-weight:500}
.dash-section{margin-bottom:2rem;animation:portalIn .5s .1s ease both}
.dash-section-title{font-size:.65rem;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--gold2);margin-bottom:1rem;display:flex;align-items:center;gap:8px}
.dash-section-title::before{content:'';width:20px;height:1px;background:var(--gold)}
.resource-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:.75rem}
.resource-card{background:var(--ghost);border:1px solid var(--glassborder);border-radius:var(--r12);padding:1.2rem;transition:all .2s;cursor:pointer}
.resource-card:hover{background:var(--ghost2);border-color:var(--glassborder2);transform:translateY(-2px)}
.resource-ico{font-size:1.4rem;margin-bottom:.5rem}
.resource-title{font-size:.8rem;font-weight:600;color:var(--platinum);margin-bottom:.2rem}
.resource-sub{font-size:.68rem;color:var(--silver)}
.complaint-form-wrap{background:var(--ghost);border:1px solid var(--glassborder);border-radius:var(--r12);padding:1.5rem;margin-bottom:1.5rem}
.complaint-card{background:var(--ghost);border:1px solid var(--glassborder);border-radius:var(--r12);padding:1.2rem;margin-bottom:.75rem}
.complaint-card-sub{display:flex;align-items:center;gap:.75rem;margin-bottom:.5rem;flex-wrap:wrap}
.complaint-subject{font-size:.88rem;font-weight:600;color:var(--platinum);margin-bottom:.4rem}
.complaint-desc{font-size:.8rem;color:var(--silver);line-height:1.6}
.ann-card{background:var(--ghost);border:1px solid var(--glassborder);border-radius:var(--r12);padding:1.2rem;margin-bottom:.75rem;position:relative;overflow:hidden}
.ann-card.pinned{border-color:rgba(200,149,58,.25)}
.ann-card.pinned::before{content:'';position:absolute;left:0;top:0;bottom:0;width:2.5px;background:linear-gradient(var(--gold),var(--gold2))}
.ann-pin{font-size:.62rem;color:var(--gold2);font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:.4rem}
.ann-title{font-size:.95rem;font-weight:600;color:var(--platinum);margin-bottom:.3rem}
.ann-body{font-size:.82rem;color:var(--silver);line-height:1.6}
.ann-date{font-size:.65rem;color:var(--dim);margin-top:.5rem;letter-spacing:1px}

.admin-modal-overlay{position:fixed;inset:0;z-index:800;background:rgba(3,6,13,.92);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;padding:1rem;animation:fadeIn .25s ease}
.admin-modal{background:rgba(6,12,28,.99);border:1px solid rgba(200,149,58,.2);border-radius:16px;width:100%;max-width:580px;max-height:92vh;overflow-y:auto;animation:portalIn .35s cubic-bezier(.25,.46,.45,.94) both;box-shadow:0 40px 100px rgba(0,0,0,.8)}
.admin-modal-header{padding:1.5rem 1.8rem;border-bottom:1px solid rgba(255,255,255,.06);display:flex;align-items:center;justify-content:space-between}
.admin-modal-title{font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:400;color:var(--platinum)}
.admin-modal-close{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;color:var(--silver);font-size:.8rem;cursor:pointer;transition:all .2s}
.admin-modal-close:hover{background:rgba(255,255,255,.12);color:var(--platinum)}
.admin-modal-body{padding:1.5rem 1.8rem 1.8rem}

.cred-box{background:rgba(200,149,58,.07);border:1px solid rgba(200,149,58,.22);border-radius:var(--r12);padding:1.2rem 1.4rem;margin-bottom:1.5rem}
.cred-box-title{font-size:.58rem;letter-spacing:3px;color:var(--gold2);text-transform:uppercase;font-weight:700;margin-bottom:.8rem}
.cred-row{display:flex;align-items:center;gap:.75rem;margin-bottom:.5rem;flex-wrap:wrap}
.cred-row:last-child{margin-bottom:0}
.cred-label{font-size:.62rem;letter-spacing:1.5px;color:var(--dim);text-transform:uppercase;font-weight:600;min-width:80px;flex-shrink:0}
.cred-val{font-family:'Space Grotesk',monospace;font-size:.88rem;color:var(--platinum);font-weight:600;letter-spacing:1px;background:rgba(0,0,0,.35);border:1px solid var(--glassborder);border-radius:var(--r4);padding:.3rem .75rem;user-select:all;cursor:text}

.toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:rgba(6,14,28,.98);border:1px solid rgba(200,149,58,.3);border-radius:10px;padding:.75rem 1.5rem;font-size:.8rem;color:var(--gold2);font-weight:600;letter-spacing:1px;z-index:9999;animation:toastIn .3s ease;box-shadow:0 8px 32px rgba(0,0,0,.5)}
@keyframes toastIn{from{opacity:0;transform:translate(-50%,12px)}to{opacity:1;transform:translate(-50%,0)}}

.al-scene{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;padding:2rem;z-index:2;overflow-y:auto;background:radial-gradient(ellipse 60% 50% at 50% 0%,rgba(200,149,58,.14) 0%,transparent 65%),radial-gradient(ellipse 45% 45% at 8% 70%,rgba(0,80,255,.10) 0%,transparent 60%),linear-gradient(160deg,#040810 0%,#060d1e 40%,#030608 100%)}
.al-grid{position:fixed;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(rgba(200,149,58,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(200,149,58,.03) 1px,transparent 1px);background-size:60px 60px;mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 0%,transparent 90%)}
.al-geo{position:fixed;pointer-events:none;z-index:1;border-radius:4px}
.al-geo-1{width:160px;height:160px;top:7%;left:5%;border:1px solid rgba(200,149,58,.08);animation:algeo 14s ease-in-out infinite}
.al-geo-2{width:90px;height:90px;bottom:14%;right:7%;border:1px solid rgba(0,80,255,.09);border-radius:50%;animation:algeo 11s ease-in-out infinite reverse}
.al-geo-3{width:55px;height:55px;top:42%;right:14%;border:1px solid rgba(200,149,58,.07);transform:rotate(45deg);animation:algeo 9s ease-in-out infinite 2s}
.al-geo-4{width:220px;height:220px;bottom:4%;left:8%;border:1px solid rgba(120,193,255,.05);border-radius:50%;animation:algeo 20s ease-in-out infinite reverse 1s}
@keyframes algeo{0%,100%{transform:translate(0,0) rotate(0deg)}50%{transform:translate(12px,-16px) rotate(6deg)}}
.al-card{position:relative;z-index:3;background:rgba(5,10,22,.97);border:1px solid rgba(200,149,58,.22);border-radius:20px;width:100%;max-width:460px;box-shadow:0 40px 80px rgba(0,0,0,.8),0 0 60px rgba(200,149,58,.07),inset 0 1px 0 rgba(255,255,255,.04);overflow:hidden;animation:portalIn .5s cubic-bezier(.25,.46,.45,.94) both}
.al-bar{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--gold),var(--gold2),transparent)}
.al-head{padding:2rem 2.2rem 1.6rem;background:linear-gradient(135deg,rgba(200,149,58,.08),rgba(200,149,58,.02));border-bottom:1px solid rgba(200,149,58,.10);position:relative;overflow:hidden}
.al-head-glow{position:absolute;top:-50px;right:-50px;width:150px;height:150px;border-radius:50%;background:radial-gradient(circle,rgba(200,149,58,.09) 0%,transparent 70%);pointer-events:none}
.al-orbit{position:absolute;right:1.8rem;top:50%;transform:translateY(-50%);width:52px;height:52px;pointer-events:none}
.al-ring{position:absolute;inset:0;border-radius:50%;border:1px solid rgba(200,149,58,.18);animation:alRingSpin 8s linear infinite}
.al-ring:nth-child(2){inset:12px;border-color:rgba(200,149,58,.10);animation-duration:5s;animation-direction:reverse}
.al-dot{position:absolute;width:5px;height:5px;border-radius:50%;background:var(--gold2);top:-2.5px;left:calc(50% - 2.5px);box-shadow:0 0 8px var(--gold)}
@keyframes alRingSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.al-brand{display:flex;align-items:center;gap:8px;margin-bottom:.9rem;cursor:pointer}
.al-brand-dot{width:7px;height:7px;border-radius:50%;background:var(--gold2);box-shadow:0 0 10px var(--gold);animation:livePulse 2s ease infinite}
.al-brand-name{font-family:'Syncopate',sans-serif;font-size:.7rem;font-weight:700;letter-spacing:4px;color:var(--platinum);text-transform:uppercase}
.al-title{font-family:'Cormorant Garamond',serif;font-size:1.8rem;font-weight:400;color:var(--platinum);margin-bottom:.25rem}
.al-sub{font-size:.7rem;color:rgba(210,190,140,.7);letter-spacing:1px}
.al-badge{display:inline-flex;align-items:center;gap:5px;margin-top:.7rem;background:rgba(200,149,58,.08);border:1px solid rgba(200,149,58,.18);border-radius:4px;padding:.25rem .7rem;font-size:.58rem;font-weight:700;letter-spacing:2px;color:var(--gold2);text-transform:uppercase}
.al-body{padding:1.7rem 2.2rem 2.1rem}
.al-warn{background:rgba(200,149,58,.06);border:1px solid rgba(200,149,58,.14);border-radius:8px;padding:.65rem 1rem;margin-bottom:1.2rem;font-size:.73rem;color:var(--gold2);line-height:1.5;display:flex;align-items:flex-start;gap:.5rem}
.al-err{background:rgba(248,113,113,.08);border:1px solid rgba(248,113,113,.22);border-radius:8px;padding:.7rem 1rem;margin-bottom:1rem;font-size:.76rem;color:#f87171;display:flex;align-items:center;gap:.5rem}
.al-btn{width:100%;background:linear-gradient(135deg,var(--gold),var(--gold2));color:var(--ink);border:none;padding:1rem;border-radius:8px;font-size:.76rem;font-weight:800;letter-spacing:2.5px;text-transform:uppercase;transition:all .3s;margin-top:.4rem;box-shadow:0 4px 24px rgba(200,149,58,.28)}
.al-btn:hover{transform:translateY(-2px);box-shadow:0 8px 40px rgba(200,149,58,.42)}
.al-btn:disabled{opacity:.55;cursor:not-allowed;transform:none}

.adm-wrap{display:flex;min-height:100vh;background:radial-gradient(ellipse 50% 40% at 80% 5%,rgba(200,149,58,.05) 0%,transparent 60%),radial-gradient(ellipse 55% 50% at 5% 90%,rgba(0,80,255,.04) 0%,transparent 60%),linear-gradient(155deg,#030609 0%,#060d18 50%,#040810 100%);position:relative}
.adm-sidebar{width:230px;flex-shrink:0;background:rgba(3,5,12,.99);border-right:1px solid rgba(200,149,58,.09);display:flex;flex-direction:column;position:fixed;left:0;top:0;bottom:0;z-index:100;overflow-y:auto;box-shadow:4px 0 40px rgba(0,0,0,.4)}
.adm-sidebar::-webkit-scrollbar{width:2px}
.adm-sidebar::-webkit-scrollbar-thumb{background:rgba(200,149,58,.2);border-radius:1px}
.adm-brand-section{padding:1.5rem 1.5rem 1.1rem;border-bottom:1px solid rgba(255,255,255,.04);position:relative}
.adm-brand-section::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(200,149,58,.2),transparent)}
.adm-logo{display:flex;align-items:center;gap:8px;cursor:pointer;margin-bottom:.6rem}
.adm-logo-mark{width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,rgba(200,149,58,.18),rgba(200,149,58,.04));border:1px solid rgba(200,149,58,.22);display:flex;align-items:center;justify-content:center;font-family:'Syncopate',sans-serif;font-size:.6rem;font-weight:700;color:var(--gold2);letter-spacing:1px}
.adm-logo-text{font-family:'Syncopate',sans-serif;font-size:.7rem;font-weight:700;letter-spacing:3px;color:var(--platinum)}
.adm-role-pill{display:inline-flex;align-items:center;gap:5px;background:rgba(200,149,58,.09);border:1px solid rgba(200,149,58,.18);border-radius:4px;padding:.22rem .65rem;font-size:.56rem;font-weight:700;letter-spacing:2px;color:var(--gold2);text-transform:uppercase}
.adm-role-dot{width:5px;height:5px;border-radius:50%;background:var(--gold2);box-shadow:0 0 6px var(--gold);animation:livePulse 2s ease infinite}
.adm-nav{padding:1rem 0;flex:1}
.adm-nav-group-label{font-size:.5rem;letter-spacing:3px;color:var(--dim);text-transform:uppercase;font-weight:700;padding:.5rem 1.5rem .25rem}
.adm-nav-item{display:flex;align-items:center;gap:.85rem;padding:.65rem 1.5rem;cursor:pointer;color:rgba(150,170,205,.7);font-size:.76rem;font-weight:500;transition:all .2s;border-left:2px solid transparent;margin:1px 0}
.adm-nav-item:hover{color:var(--platinum);background:rgba(255,255,255,.03)}
.adm-nav-item.active{color:var(--gold2);background:rgba(200,149,58,.07);border-left-color:var(--gold)}
.adm-nav-ico{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:.88rem;flex-shrink:0;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.05);transition:all .2s}
.adm-nav-item.active .adm-nav-ico{background:rgba(200,149,58,.12);border-color:rgba(200,149,58,.20)}
.adm-nav-count{margin-left:auto;background:rgba(200,149,58,.12);border:1px solid rgba(200,149,58,.2);border-radius:9px;padding:.08rem .45rem;font-size:.56rem;font-weight:700;color:var(--gold2);letter-spacing:.5px;min-width:18px;text-align:center}
.adm-nav-count.red{background:rgba(248,113,113,.12);border-color:rgba(248,113,113,.2);color:#f87171}
.adm-sidebar-footer{padding:1rem 1.5rem;border-top:1px solid rgba(255,255,255,.04)}
.adm-logout-btn{width:100%;background:rgba(248,113,113,.06);border:1px solid rgba(248,113,113,.16);color:rgba(248,113,113,.8);padding:.55rem;border-radius:7px;font-size:.62rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:.45rem}
.adm-logout-btn:hover{background:rgba(248,113,113,.12);border-color:rgba(248,113,113,.3);color:#f87171}
.adm-main{margin-left:230px;flex:1;position:relative;z-index:1;padding:2.4rem clamp(1.5rem,3vw,2.5rem) 4rem;min-height:100vh;overflow-y:auto;color:var(--platinum)}
.adm-main::-webkit-scrollbar{width:3px}
.adm-main::-webkit-scrollbar-thumb{background:rgba(200,149,58,.2);border-radius:2px}
.adm-ph{margin-bottom:1.8rem;padding-bottom:1.4rem;border-bottom:1px solid rgba(255,255,255,.05);display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:1rem}
.adm-ph-title{font-family:'Cormorant Garamond',serif;font-size:1.9rem;font-weight:300;color:var(--platinum);margin-bottom:.2rem;letter-spacing:-.4px}
.adm-ph-sub{font-size:.65rem;color:var(--dim);letter-spacing:2px;text-transform:uppercase;font-weight:600}
.adm-ph-btns{display:flex;gap:.65rem;align-items:center;flex-wrap:wrap}
.adm-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:.85rem;margin-bottom:1.8rem}
.adm-stat{background:rgba(8,14,28,.95);border:1px solid rgba(255,255,255,.07);border-radius:13px;padding:1.3rem 1.4rem;position:relative;overflow:hidden;transition:all .3s}
.adm-stat:hover{border-color:rgba(255,255,255,.13);transform:translateY(-3px);box-shadow:0 14px 45px rgba(0,0,0,.5)}
.adm-stat::before{content:'';position:absolute;top:0;left:0;right:0;height:1.5px}
.adm-stat.s-gold::before{background:linear-gradient(90deg,transparent,var(--gold2),transparent)}
.adm-stat.s-blue::before{background:linear-gradient(90deg,transparent,var(--azure3),transparent)}
.adm-stat.s-green::before{background:linear-gradient(90deg,transparent,#4ade80,transparent)}
.adm-stat.s-red::before{background:linear-gradient(90deg,transparent,#f87171,transparent)}
.adm-stat.s-purple::before{background:linear-gradient(90deg,transparent,#c084fc,transparent)}
.adm-stat.s-sky::before{background:linear-gradient(90deg,transparent,var(--sky),transparent)}
.adm-stat-ico{width:36px;height:36px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:.95rem;margin-bottom:.85rem;border:1px solid}
.adm-stat.s-gold .adm-stat-ico{background:rgba(200,149,58,.10);border-color:rgba(200,149,58,.20)}
.adm-stat.s-blue .adm-stat-ico{background:rgba(0,80,255,.10);border-color:rgba(0,80,255,.20)}
.adm-stat.s-green .adm-stat-ico{background:rgba(74,222,128,.08);border-color:rgba(74,222,128,.18)}
.adm-stat.s-red .adm-stat-ico{background:rgba(248,113,113,.08);border-color:rgba(248,113,113,.18)}
.adm-stat.s-purple .adm-stat-ico{background:rgba(192,132,252,.08);border-color:rgba(192,132,252,.18)}
.adm-stat.s-sky .adm-stat-ico{background:rgba(120,193,255,.08);border-color:rgba(120,193,255,.18)}
.adm-stat-num{font-family:'Cormorant Garamond',serif;font-size:2.3rem;font-weight:600;line-height:1;margin-bottom:3px}
.adm-stat.s-gold .adm-stat-num{color:var(--gold2)}
.adm-stat.s-blue .adm-stat-num{color:var(--azure3)}
.adm-stat.s-green .adm-stat-num{color:#4ade80}
.adm-stat.s-red .adm-stat-num{color:#f87171}
.adm-stat.s-purple .adm-stat-num{color:#c084fc}
.adm-stat.s-sky .adm-stat-num{color:var(--sky)}
.adm-stat-lbl{font-size:.58rem;color:rgba(160,180,210,.7);letter-spacing:2px;text-transform:uppercase;font-weight:600}
.adm-sec-ttl{font-size:.58rem;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--gold2);margin-bottom:1rem;display:flex;align-items:center;gap:8px}
.adm-sec-ttl::before{content:'';width:16px;height:1px;background:var(--gold)}
.adm-tbl-wrap{overflow-x:auto;border-radius:12px;border:1px solid rgba(255,255,255,.07)}
.adm-tbl{width:100%;border-collapse:collapse;font-size:.78rem}
.adm-tbl th{background:rgba(0,0,0,.5);color:var(--gold2);font-size:.56rem;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;padding:.85rem 1rem;text-align:left;border-bottom:1px solid rgba(255,255,255,.05);white-space:nowrap}
.adm-tbl td{padding:.8rem 1rem;border-bottom:1px solid rgba(255,255,255,.03);color:var(--silver);background:rgba(5,10,22,.96)}
.adm-tbl tr:last-child td{border-bottom:none}
.adm-tbl tr:hover td{background:rgba(200,149,58,.025);color:var(--platinum)}
.adm-tbl-name{font-weight:600;color:var(--platinum)}
.adm-tbl-id{font-size:.68rem;color:var(--gold2);font-weight:700;letter-spacing:1.5px;font-family:monospace}
.tbl-actions{display:flex;gap:.35rem;flex-wrap:wrap}
.tbl-btn{padding:.22rem .55rem;border-radius:4px;font-size:.6rem;font-weight:600;letter-spacing:.8px;text-transform:uppercase;border:1px solid;cursor:pointer;transition:all .2s;background:transparent;white-space:nowrap}
.tbl-btn-edit{color:var(--sky);border-color:rgba(120,193,255,.25)}
.tbl-btn-edit:hover{background:rgba(120,193,255,.1)}
.tbl-btn-del{color:#f87171;border-color:rgba(248,113,113,.25)}
.tbl-btn-del:hover{background:rgba(248,113,113,.1)}
.tbl-btn-approve{color:#4ade80;border-color:rgba(74,222,128,.25)}
.tbl-btn-approve:hover{background:rgba(74,222,128,.1)}
.tbl-btn-reject{color:#f87171;border-color:rgba(248,113,113,.25)}
.tbl-btn-reject:hover{background:rgba(248,113,113,.1)}
.tbl-btn-review{color:#93c5fd;border-color:rgba(147,197,253,.25)}
.tbl-btn-review:hover{background:rgba(147,197,253,.1)}
.adm-search-row{display:flex;gap:.65rem;align-items:center;margin-bottom:1.2rem;flex-wrap:wrap}
.adm-search{flex:1;min-width:200px;background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:.6rem 1rem;color:var(--platinum);font-size:.84rem;font-family:'Space Grotesk',sans-serif;outline:none;transition:border-color .25s}
.adm-search:focus{border-color:rgba(200,149,58,.28)}
.adm-search::placeholder{color:rgba(100,130,170,.6)}
.adm-filter{background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:.6rem .85rem;color:var(--platinum);font-size:.76rem;font-family:'Space Grotesk',sans-serif;outline:none;cursor:pointer}
.adm-filter option{background:#080f20;color:var(--platinum)}
.adm-btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:var(--ink);border:none;padding:.6rem 1.2rem;border-radius:8px;font-size:.68rem;font-weight:800;letter-spacing:2px;text-transform:uppercase;transition:all .3s;box-shadow:0 0 18px rgba(200,149,58,.18);white-space:nowrap}
.adm-btn-gold:hover{transform:translateY(-1px);box-shadow:0 4px 24px rgba(200,149,58,.36)}
.adm-btn-blue{background:linear-gradient(135deg,var(--azure),var(--azure2));color:#fff;border:none;padding:.6rem 1.2rem;border-radius:8px;font-size:.68rem;font-weight:800;letter-spacing:2px;text-transform:uppercase;transition:all .3s;white-space:nowrap}
.adm-btn-blue:hover{transform:translateY(-1px);box-shadow:0 4px 24px rgba(0,80,255,.38)}
.adm-btn-ghost{background:transparent;border:1px solid rgba(255,255,255,.12);color:var(--silver);padding:.6rem 1rem;border-radius:8px;font-size:.65rem;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;transition:all .2s;white-space:nowrap}
.adm-btn-ghost:hover{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.2);color:var(--platinum)}
.adm-ann-card{background:rgba(8,14,28,.95);border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:1.2rem 1.4rem;margin-bottom:.7rem;display:flex;align-items:flex-start;gap:.9rem;transition:all .25s;position:relative;overflow:hidden}
.adm-ann-card.pinned{border-color:rgba(200,149,58,.18)}
.adm-ann-card.pinned::before{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:linear-gradient(var(--gold),var(--gold2))}
.adm-ann-card:hover{background:rgba(12,22,42,.95);border-color:rgba(255,255,255,.11)}
.adm-ann-content{flex:1;min-width:0}
.adm-ann-actions{display:flex;gap:.4rem;flex-shrink:0}
.adm-cmp-card{background:rgba(8,14,28,.95);border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:1.2rem 1.4rem;margin-bottom:.7rem;transition:all .25s}
.adm-cmp-card:hover{background:rgba(12,22,42,.95);border-color:rgba(255,255,255,.11)}
.adm-cmp-header{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:.5rem;margin-bottom:.6rem}
.adm-cmp-subject{font-size:.9rem;font-weight:600;color:var(--platinum)}
.adm-cmp-meta{display:flex;align-items:center;gap:.75rem;flex-wrap:wrap;margin-bottom:.5rem}
.adm-cmp-delegate{font-size:.78rem;font-weight:600;color:var(--sky)}
.adm-cmp-id{font-size:.62rem;color:var(--dim);font-family:monospace;letter-spacing:.5px}
.adm-cmp-date{font-size:.62rem;color:var(--dim)}
.adm-cmp-desc{font-size:.8rem;color:var(--silver);line-height:1.6;margin-bottom:.7rem}
.adm-cmp-actions{display:flex;gap:.4rem;flex-wrap:wrap}
.adm-note-box{background:rgba(74,222,128,.06);border:1px solid rgba(74,222,128,.15);border-radius:8px;padding:.6rem .9rem;margin-top:.5rem;font-size:.78rem;color:#4ade80;line-height:1.5}
.committee-breakdown{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:.6rem;margin-top:1rem}
.cb-chip{background:rgba(0,80,255,.06);border:1px solid rgba(0,80,255,.14);border-radius:8px;padding:.7rem 1rem;text-align:center}
.cb-chip-name{font-size:.58rem;letter-spacing:2px;color:var(--azure3);text-transform:uppercase;font-weight:700;margin-bottom:.3rem}
.cb-chip-count{font-family:'Cormorant Garamond',serif;font-size:1.6rem;font-weight:600;color:var(--platinum);line-height:1}
.status-filter-pills{display:flex;gap:.4rem;flex-wrap:wrap;margin-bottom:1rem}
.sfp{padding:.3rem .8rem;border-radius:var(--r50);font-size:.62rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;border:1px solid;cursor:pointer;background:transparent;transition:all .2s}
.sfp-all{color:var(--silver);border-color:rgba(255,255,255,.12)}
.sfp-all.active,.sfp-all:hover{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.2);color:var(--platinum)}
.sfp-approved{color:#4ade80;border-color:rgba(74,222,128,.25)}
.sfp-approved.active,.sfp-approved:hover{background:rgba(74,222,128,.08)}
.sfp-pending{color:#facc15;border-color:rgba(250,204,21,.25)}
.sfp-pending.active,.sfp-pending:hover{background:rgba(250,204,21,.08)}
.sfp-rejected{color:#f87171;border-color:rgba(248,113,113,.25)}
.sfp-rejected.active,.sfp-rejected:hover{background:rgba(248,113,113,.08)}
@media(max-width:900px){.adm-sidebar{width:200px}.adm-main{margin-left:200px}}
@media(max-width:768px){.pf-row{grid-template-columns:1fr}.adm-sidebar{width:100%;height:auto;position:static;flex-direction:row;flex-wrap:wrap}.adm-main{margin-left:0}.adm-stats{grid-template-columns:1fr 1fr}.portal-card,.portal-card-wide{max-width:100%;border-radius:var(--r16)}.portal-body{padding:1.4rem}.portal-card-top{padding:1.5rem 1.4rem 1.2rem}.portal-title{font-size:1.45rem}}
@media(max-width:480px){.adm-stats{grid-template-columns:1fr 1fr}.portal-page{padding:1rem}.portal-body{padding:1.2rem}.pf input,.pf select,.pf textarea{font-size:.82rem;padding:.7rem .85rem}.portal-btn{font-size:.74rem;padding:.85rem}.admin-modal-body,.admin-modal-header{padding:1.2rem}}
`;

/* ─── UTILITY ─── */
function exportDelegatesToCSV(delegates) {
  const headers = ["ID","Name","Email","Phone","School","Grade","Committee Applied","Assigned Committee","Assigned Country","Registration Status","Payment Status","Experience","Application Date"];
  const rows = delegates.map(d => [
    d.id, d.name, d.email, d.phone, d.school, d.grade,
    d.committee, d.assigned_committee || "", d.assigned_country || "",
    d.registration_status, d.payment_status, d.experience, d.application_date,
  ].map(v => `"${(v || "").toString().replace(/"/g, '""')}"`).join(","));
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type:"text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `maxmun3_delegates_${new Date().toISOString().slice(0,10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

/* ════════════════════════════════════════
   DELEGATE LOGIN
════════════════════════════════════════ */
function DelegateLogin({ onNavigate }) {
  const [form, setForm] = useState({ delegateId:"", password:"" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fi = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async () => {
    setError("");
    if (!form.delegateId.trim() || !form.password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      await DB.loginDelegate(form.delegateId.trim(), form.password);
      onNavigate("delegate-dashboard");
    } catch (e) {
      setError("Invalid Delegate ID or password. Contact the Secretariat if you've forgotten your credentials.");
    }
    setLoading(false);
  };

  return (
    <div className="portal-page">
      <div className="portal-card">
        <div className="portal-card-top">
          <div className="portal-card-bar" />
          <div className="portal-brand" onClick={() => onNavigate("home")}><div className="portal-brand-dot" /><div className="portal-brand-name">MaxMUN</div></div>
          <div className="portal-title">Delegate Login</div>
          <div className="portal-sub">Access your delegate portal for MaxMUN 3.0</div>
        </div>
        <div className="portal-body">
          {error && <div style={{ background:"rgba(248,113,113,.10)", border:"1px solid rgba(248,113,113,.30)", borderRadius:"var(--r8)", padding:".75rem 1rem", marginBottom:"1rem", fontSize:".8rem", color:"#ff9090", lineHeight:1.5 }}>{error}</div>}
          <div className="pf"><label>Delegate ID</label><input name="delegateId" type="text" placeholder="e.g. DEL001" value={form.delegateId} onChange={fi} onKeyDown={e => e.key === "Enter" && submit()} autoComplete="username" /></div>
          <div className="pf"><label>Password</label><input name="password" type="password" placeholder="Your assigned password" value={form.password} onChange={fi} onKeyDown={e => e.key === "Enter" && submit()} autoComplete="current-password" /></div>
          <button className="portal-btn" onClick={submit} disabled={loading}>{loading ? "Signing in…" : "Sign In"}</button>
          <div className="portal-link" style={{ fontSize:".76rem", color:"rgba(160,195,240,.75)", marginTop:"1.2rem" }}>Delegate accounts are created by the Secretariat.<br />Contact admin if you haven't received your credentials.</div>
          <div className="portal-link" style={{ marginTop:".6rem" }}><a onClick={() => onNavigate("home")}>← Back to Homepage</a></div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   DELEGATE DASHBOARD
════════════════════════════════════════ */
function DelegateDashboard({ onNavigate }) {
  const session = DB.getSession();
  const [delegate, setDelegate] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [tab, setTab] = useState("overview");
  const [cForm, setCForm] = useState({ subject:"", description:"" });
  const [cErrors, setCErrors] = useState({});
  const [cDone, setCDone] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!session || session.type !== "delegate") { onNavigate("delegate-login"); return; }
    DB.getMyProfile(session.id).then(data => setDelegate(data)).catch(() => { DB.clearSession(); onNavigate("delegate-login"); });
    DB.getMyComplaints(session.id).then(setComplaints).catch(() => setComplaints([]));
    DB.getAnnouncements().then(setAnnouncements).catch(() => setAnnouncements([]));
  }, []);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(""), 3500); };
  const logout = () => { DB.clearSession(); onNavigate("home"); };

  const submitComplaint = async () => {
    const e = {};
    if (!cForm.subject?.trim()) e.subject = "Subject is required";
    if (!cForm.description?.trim()) e.description = "Description is required";
    setCErrors(e);
    if (Object.keys(e).length > 0) return;
    try {
      const { id } = await DB.submitComplaint(delegate.id, delegate.name, cForm.subject.trim(), cForm.description.trim());
      await DB.getMyComplaints(delegate.id).then(setComplaints);
      setCForm({ subject:"", description:"" });
      setCDone(true);
      showToast("Complaint submitted — Ref: " + id);
      setTimeout(() => setCDone(false), 4000);
    } catch (e) { showToast("Failed to submit. Please try again."); }
  };

  if (!delegate) return null;

  const regBadge = s => { const m = { Pending:"badge-pending", Approved:"badge-approved", Rejected:"badge-rejected" }; return <span className={`badge-status ${m[s] || "badge-tba"}`}>{s || "TBA"}</span>; };
  const payBadge = s => { const m = { Pending:"badge-pending", Paid:"badge-paid", Waived:"badge-approved" }; return <span className={`badge-status ${m[s] || "badge-tba"}`}>{s || "TBA"}</span>; };
  const cmpBadge = s => { const m = { Pending:"badge-pending", "Under Review":"badge-review", Resolved:"badge-resolved" }; return <span className={`badge-status ${m[s] || "badge-tba"}`}>{s || "Pending"}</span>; };

  return (
    <div className="dash-page">
      <div className="dash-nav">
        <div className="dash-nav-brand" onClick={() => onNavigate("home")}><div style={{ width:6, height:6, borderRadius:"50%", background:"var(--gold2)" }} />MAXMUN</div>
        <div className="dash-nav-right"><div className="dash-nav-del-id">{delegate.id}</div><button className="dash-logout-btn" onClick={logout}>Logout</button></div>
      </div>
      <div className="dash-container">
        <div className="dash-greeting">
          <div className="dash-greeting-name">Welcome, <em style={{ fontStyle:"italic", color:"var(--sky)" }}>{delegate.name.split(" ")[0]}</em><span className="dash-id-pill">{delegate.id}</span></div>
          <div className="dash-greeting-sub">MaxMUN 3.0 Delegate Portal · {delegate.school}</div>
        </div>
        <div style={{ display:"flex", gap:".5rem", marginBottom:"2rem", flexWrap:"wrap" }}>
          {[["overview","Overview"],["complaints","Raise a Concern"],["resources","Resources"]].map(([k,l]) => (
            <button key={k} onClick={() => setTab(k)} style={{ padding:".5rem 1.2rem", border:"1px solid", borderRadius:"var(--r50)", background: tab === k ? "rgba(0,80,255,.15)" : "transparent", borderColor: tab === k ? "var(--azure3)" : "var(--glassborder)", color: tab === k ? "var(--sky)" : "var(--silver)", fontSize:".72rem", fontWeight:600, letterSpacing:"2px", textTransform:"uppercase", cursor:"pointer", transition:"all .2s" }}>{l}</button>
          ))}
        </div>

        {tab === "overview" && (
          <>
            <div className="dash-section">
              <div className="dash-section-title">My Profile</div>
              <div className="profile-card">
                {[["Full Name", delegate.name],["Delegate ID", delegate.id],["Email", delegate.email],["Phone", delegate.phone],["School", delegate.school],["Grade", delegate.grade],["Application Date", delegate.application_date],["MUN Experience", delegate.experience]].map(([l,v]) => (<div className="profile-field" key={l}><div className="pf-lbl">{l}</div><div className="pf-val">{v}</div></div>))}
              </div>
            </div>
            <div className="dash-section">
              <div className="dash-section-title">Registration Status</div>
              <div className="profile-card">
                {[["Registration Status", regBadge(delegate.registration_status)],["Payment Status", payBadge(delegate.payment_status)],["Committee Applied", <span key="ca" style={{ color:"var(--azure3)", fontWeight:600 }}>{delegate.committee}</span>],["Assigned Committee", delegate.assigned_committee ? <span key="ac" style={{ color:"var(--gold2)", fontWeight:600 }}>{delegate.assigned_committee}</span> : <span key="act" className="badge-status badge-tba">TBA</span>],["Preferred Country", delegate.preferred_country],["Assigned Country", delegate.assigned_country ? <span key="acn" style={{ color:"var(--gold2)", fontWeight:600 }}>{delegate.assigned_country}</span> : <span key="acnt" className="badge-status badge-tba">TBA</span>]].map(([l,v]) => (<div className="profile-field" key={l}><div className="pf-lbl">{l}</div><div className="pf-val">{v}</div></div>))}
              </div>
            </div>
            <div className="dash-section">
              <div className="dash-section-title">Announcements from Secretariat</div>
              {announcements.length === 0 && <div style={{ color:"var(--dim)", fontSize:".82rem" }}>No announcements yet. Check back soon.</div>}
              {[...announcements].sort((a,b) => b.pinned - a.pinned).map(ann => (<div key={ann.id} className={`ann-card${ann.pinned ? " pinned":""}`}>{ann.pinned && <div className="ann-pin">📌 Pinned Notice</div>}<div className="ann-title">{ann.title}</div><div className="ann-body">{ann.body}</div><div className="ann-date">{ann.date}</div></div>))}
            </div>
          </>
        )}

        {tab === "complaints" && (
          <>
            <div className="dash-section">
              <div className="dash-section-title">Raise a Concern</div>
              <div className="complaint-form-wrap">
                {cDone && <div style={{ background:"rgba(74,222,128,.08)", border:"1px solid rgba(74,222,128,.2)", borderRadius:"var(--r8)", padding:".8rem 1rem", marginBottom:"1rem", fontSize:".8rem", color:"#4ade80" }}>✓ Your concern has been submitted. The Secretariat will review it shortly.</div>}
                <div className="pf"><label>Subject *</label><input placeholder="Brief subject line" value={cForm.subject} onChange={e => setCForm(p => ({ ...p, subject: e.target.value }))} />{cErrors.subject && <span className="pf-err">{cErrors.subject}</span>}</div>
                <div className="pf"><label>Details *</label><textarea rows={4} placeholder="Describe your concern clearly…" value={cForm.description} style={{ resize:"vertical" }} onChange={e => setCForm(p => ({ ...p, description: e.target.value }))} />{cErrors.description && <span className="pf-err">{cErrors.description}</span>}</div>
                <button className="portal-btn" style={{ maxWidth:220 }} onClick={submitComplaint}>Submit Concern</button>
              </div>
            </div>
            <div className="dash-section">
              <div className="dash-section-title">My Submitted Concerns ({complaints.length})</div>
              {complaints.length === 0 && <div style={{ color:"var(--dim)", fontSize:".82rem" }}>No concerns submitted yet.</div>}
              {[...complaints].reverse().map(c => (
                <div className="complaint-card" key={c.id}>
                  <div className="complaint-card-sub"><span style={{ fontFamily:"monospace", fontSize:".65rem", color:"var(--azure3)" }}>{c.id}</span>{cmpBadge(c.status)}</div>
                  <div className="complaint-subject">{c.subject}</div>
                  <div className="complaint-desc">{c.description}</div>
                  {c.admin_note && <div style={{ marginTop:".6rem", background:"rgba(74,222,128,.06)", border:"1px solid rgba(74,222,128,.15)", borderRadius:"var(--r8)", padding:".6rem .9rem", fontSize:".78rem", color:"#4ade80" }}>📩 Secretariat note: {c.admin_note}</div>}
                  <div style={{ fontSize:".6rem", color:"var(--dim)", marginTop:".4rem" }}>{c.date}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "resources" && (
          <div className="dash-section">
            <div className="dash-section-title">Committee Resources</div>
            <div className="resource-grid">
              {[{ ico:"📜", name:"Background Guides", desc:"Will be released to delegates closer to the conference." },{ ico:"📋", name:"Rules of Procedure", desc:"MaxMUN Standard RoP for all committee sessions." },{ ico:"✍️", name:"Position Paper Guide", desc:"How to write an effective position paper." },{ ico:"🗣️", name:"Public Speaking Tips", desc:"Oratory and debate skills for committee." },{ ico:"📅", name:"Conference Schedule", desc:"Full schedule to be shared on registration confirmation." },{ ico:"🏅", name:"Awards Criteria", desc:"Judging criteria and award categories." }].map(r => (<div className="resource-card" key={r.name}><div className="resource-ico">{r.ico}</div><div className="resource-title">{r.name}</div><div className="resource-sub">{r.desc}</div><div style={{ marginTop:".5rem" }}><span className="badge-status badge-tba">Coming Soon</span></div></div>))}
            </div>
          </div>
        )}
      </div>
      {toast && <div className="toast">✦ {toast}</div>}
    </div>
  );
}

/* ════════════════════════════════════════
   ADMIN LOGIN
════════════════════════════════════════ */
function AdminLogin({ onNavigate }) {
  const [form, setForm] = useState({ id:"", password:"" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fi = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async () => {
    setError("");
    if (!form.id || !form.password) { setError("Please enter your credentials."); return; }
    setLoading(true);
    try {
      await DB.loginAdmin(form.id, form.password);
      onNavigate("admin-dashboard");
    } catch (e) {
      setError("Invalid Admin ID or password. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="al-scene">
      <div className="al-grid" />
      <div className="al-geo al-geo-1" /><div className="al-geo al-geo-2" /><div className="al-geo al-geo-3" /><div className="al-geo al-geo-4" />
      <div className="al-card">
        <div className="al-bar" />
        <div className="al-head">
          <div className="al-head-glow" />
          <div className="al-orbit"><div className="al-ring" /><div className="al-ring" /><div className="al-dot" /></div>
          <div className="al-brand" onClick={() => onNavigate("home")}><div className="al-brand-dot" /><div className="al-brand-name">MaxMUN</div></div>
          <div className="al-title">Secretariat Access</div>
          <div className="al-sub">Admin Panel · Authorised Personnel Only</div>
          <div className="al-badge"><span style={{width:5,height:5,borderRadius:"50%",background:"var(--gold2)",display:"inline-block"}} />Secretariat Only</div>
        </div>
        <div className="al-body">
          <div className="al-warn">🔒 This panel is for MaxMUN Secretariat use only. Unauthorised access is prohibited.</div>
          {error && <div className="al-err">⚠ {error}</div>}
          <div className="pf"><label>Admin ID</label><input name="id" placeholder="Enter your Admin ID" value={form.id} onChange={fi} onKeyDown={e => e.key === "Enter" && submit()} /></div>
          <div className="pf"><label>Password</label><input name="password" type="password" placeholder="••••••••" value={form.password} onChange={fi} onKeyDown={e => e.key === "Enter" && submit()} /></div>
          <button className="al-btn" onClick={submit} disabled={loading}>{loading ? "Authenticating…" : "Access Secretariat Panel"}</button>
          <div className="portal-link" style={{ marginTop:"1.2rem" }}><a onClick={() => onNavigate("home")}>← Back to Homepage</a></div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   ADMIN DASHBOARD
════════════════════════════════════════ */
function AdminDashboard({ onNavigate }) {
  const [adminTab, setAdminTab] = useState("delegates");
  const [delegates, setDelegates] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [stats, setStats] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterReg, setFilterReg] = useState("All");
  const [editForm, setEditForm] = useState(null);
  const [annForm, setAnnForm] = useState({ title:"", body:"", pinned:false });
  const [addForm, setAddForm] = useState({});
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");
  const [newlyCreated, setNewlyCreated] = useState(null);
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [complaintNote, setComplaintNote] = useState({});
  const [messages, setMessages] = useState([]);
  const [msgSearch, setMsgSearch] = useState("");
  const [msgFilter, setMsgFilter] = useState("All");

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(""), 3500); };

  const loadData = useCallback(async () => {
    try {
      const [dels, cmps, anns, msgs] = await Promise.all([
        DB.getDelegates(),
        DB.getAllComplaints(),
        DB.getAnnouncements(),
        DB.getMessages().catch(() => []),
      ]);
      setDelegates(dels || []);
      setComplaints(cmps || []);
      setAnnouncements(anns || []);
      setMessages(Array.isArray(msgs) ? msgs : []);
      try { const st = await DB.getStats(); if (st) setStats(st); } catch(_) {}
    } catch(err) {
      // Silent fail on background refresh — only show toast on manual refresh
    }
  }, []);

  const loadDataWithToast = useCallback(async () => {
    try { await loadData(); }
    catch { showToast("Failed to load data. Check connection."); }
  }, [loadData]);

  useEffect(() => {
    const s = DB.getSession();
    if (!s || s.type !== "admin") { onNavigate("admin-login"); return; }
    // Small delay to ensure credentials are ready
    setTimeout(() => loadData(), 100);
  }, []);

  const logout = () => { DB.clearSession(); onNavigate("home"); };

  /* ── DELEGATE ACTIONS ── */
  const changeRegStatus = async (id, status) => {
    try {
      const target = delegates.find(d => d.id === id);
      if (target) { await DB.updateDelegate(id, { ...target, registration_status: status }); loadData(); showToast(`${id} marked as ${status}`); }
    } catch(e) { showToast("Failed to update. Please try again."); }
  };

  const saveDelegateEdits = async () => {
    try {
      await DB.updateDelegate(editForm.id, { name: editForm.name, email: editForm.email, phone: editForm.phone, school: editForm.school, grade: editForm.grade, committee: editForm.committee, assigned_committee: editForm.assigned_committee, assigned_country: editForm.assigned_country, registration_status: editForm.registration_status, payment_status: editForm.payment_status, division: editForm.division, experience: editForm.experience, ...(editForm.password ? { password: editForm.password } : {}) });
      setEditForm(null); loadData(); showToast("Delegate profile updated.");
    } catch(e) { showToast("Failed to save changes."); }
  };

  const deleteDelegate = async (id) => {
    if (!window.confirm(`Remove delegate ${id}? This cannot be undone.`)) return;
    try { await DB.deleteDelegate(id); loadData(); showToast("Delegate removed."); }
    catch(e) { showToast("Failed to remove delegate."); }
  };

  // NEW: Bulk approve all pending
  const bulkApprovePending = async () => {
    const pending = delegates.filter(d => d.registration_status === "Pending");
    if (pending.length === 0) { showToast("No pending delegates to approve."); return; }
    if (!window.confirm(`Approve all ${pending.length} pending delegates?`)) return;
    try {
      await Promise.all(pending.map(d => DB.updateDelegate(d.id, { ...d, registration_status: "Approved" })));
      loadData(); showToast(`${pending.length} delegates approved.`);
    } catch(e) { showToast("Bulk approve failed — some may have succeeded."); }
  };

  /* ── ADD DELEGATE ── */
  const addDelegate = async () => {
    setAddError("");
    if (!addForm.name?.trim()) { setAddError("Full name is required."); return; }
    if (!addForm.password?.trim()) { setAddError("Password is required — you will share this with the delegate."); return; }
    setAddLoading(true);
    try {
      const { id } = await DB.createDelegate({
        name: addForm.name.trim(),
        email: (addForm.email || "").toLowerCase().trim(),
        phone: addForm.phone || "—",
        school: addForm.school || "—",
        grade: addForm.grade || "—",
        committee: addForm.committee || "—",
        preferred_country: addForm.country || "Not Specified",
        experience: addForm.experience || "First-time",
        password: addForm.password.trim(),
        registration_status: addForm.registrationStatus || "Approved",
        payment_status: addForm.paymentStatus || "Pending",
        assigned_committee: addForm.assignedCommittee || null,
        assigned_country: addForm.assignedCountry || null,
        division: addForm.division || null,
      });
      loadData();
      setModal(null);
      setAddForm({});
      setAddError("");
      setNewlyCreated({ id, name: addForm.name, password: addForm.password });
      showToast(`Delegate account created: ${id}`);
    } catch(err) {
      setAddError(err.message || "Could not create delegate account. Please check all fields and try again.");
    }
    setAddLoading(false);
  };

  /* ── COMPLAINT ACTIONS ── */
  const changeComplaintStatus = async (id, status) => {
    try {
      await DB.updateComplaintStatus(id, status, complaintNote[id] || "");
      loadData(); showToast(`Concern ${id} → ${status}`);
      setComplaintNote(p => { const n = {...p}; delete n[id]; return n; });
    } catch(e) { showToast("Failed to update concern status."); }
  };

  /* ── ANNOUNCEMENT ACTIONS ── */
  const saveAnnouncement = async () => {
    if (!annForm.title || !annForm.body) { showToast("Please enter both a title and body."); return; }
    try {
      if (annForm.editId) { await DB.updateAnnouncement(annForm.editId, annForm.title, annForm.body, !!annForm.pinned); }
      else { await DB.createAnnouncement(annForm.title, annForm.body, !!annForm.pinned); }
      loadData(); setModal(null); setAnnForm({ title:"", body:"", pinned:false });
      showToast("Announcement published.");
    } catch(e) { showToast("Failed to save announcement."); }
  };

  const deleteAnnouncement = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    try { await DB.deleteAnnouncement(id); loadData(); showToast("Announcement removed."); }
    catch(e) { showToast("Failed to delete."); }
  };

  /* ── FILTERS & COMPUTED ── */
  const filteredDelegates = delegates.filter(d => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || (d.name||"").toLowerCase().includes(q) || (d.id||"").toLowerCase().includes(q) || (d.school||"").toLowerCase().includes(q) || (d.committee||"").toLowerCase().includes(q) || (d.email||"").toLowerCase().includes(q);
    const matchesFilter = filterReg === "All" || d.registration_status === filterReg;
    return matchesSearch && matchesFilter;
  });

  // Committee breakdown
  const committeeBreakdown = {};
  delegates.forEach(d => { const c = d.assigned_committee || d.committee || "Unassigned"; committeeBreakdown[c] = (committeeBreakdown[c] || 0) + 1; });

  const regBadge = s => { const m = { Pending:"badge-pending", Approved:"badge-approved", Rejected:"badge-rejected" }; return <span className={`badge-status ${m[s] || "badge-tba"}`}>{s || "TBA"}</span>; };
  const payBadge = s => { const m = { Pending:"badge-pending", Paid:"badge-paid", Waived:"badge-approved" }; return <span className={`badge-status ${m[s] || "badge-tba"}`}>{s || "TBA"}</span>; };
  const cmpBadge = s => { const m = { Pending:"badge-pending", "Under Review":"badge-review", Resolved:"badge-resolved" }; return <span className={`badge-status ${m[s] || "badge-tba"}`}>{s || "Pending"}</span>; };

  const totalDelegates = stats.totalDelegates ?? delegates.length;
  const pendingCount = delegates.filter(d => d.registration_status === "Pending").length;
  const approvedCount = delegates.filter(d => d.registration_status === "Approved").length;
  const paidCount = delegates.filter(d => d.payment_status === "Paid").length;
  const openComplaints = complaints.filter(c => c.status !== "Resolved").length;

  return (
    <div className="adm-wrap">
      {/* ── SIDEBAR ── */}
      <div className="adm-sidebar">
        <div className="adm-brand-section">
          <div className="adm-logo" onClick={() => onNavigate("home")}>
            <div className="adm-logo-mark">MM</div>
            <div className="adm-logo-text">MaxMUN</div>
          </div>
          <div className="adm-role-pill"><div className="adm-role-dot" />Secretariat</div>
        </div>
        <div className="adm-nav">
          <div className="adm-nav-group-label">Manage</div>
          {[
            { key:"overview", ico:"📊", label:"Overview", count: null, countClass:"" },
            { key:"delegates", ico:"👥", label:"Delegates", count: pendingCount > 0 ? pendingCount : null, countClass:"" },
            { key:"complaints", ico:"📩", label:"Complaints", count: openComplaints > 0 ? openComplaints : null, countClass:"red" },
            { key:"messages", ico:"✉️", label:"Messages", count: messages.filter(m=>!m.is_read).length > 0 ? messages.filter(m=>!m.is_read).length : null, countClass:"" },
            { key:"announcements", ico:"📢", label:"Announcements", count: null },
          ].map(item => (
            <div key={item.key} className={`adm-nav-item${adminTab === item.key ? " active":""}`} onClick={() => setAdminTab(item.key)}>
              <div className="adm-nav-ico">{item.ico}</div>
              {item.label}
              {item.count != null && <span className={`adm-nav-count${item.countClass ? " " + item.countClass : ""}`}>{item.count}</span>}
            </div>
          ))}
        </div>
        <div className="adm-sidebar-footer">
          <button className="adm-logout-btn" onClick={logout}>⏻ Log Out</button>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div className="adm-main">
        {/* Stats always visible */}
        <div className="admin-stats-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:"1rem", marginBottom:"1.8rem" }}>
          {[
            { label:"Total Delegates", val: totalDelegates, bar:"var(--azure3)" },
            { label:"Approved", val: approvedCount, bar:"#4ade80" },
            { label:"Pending Review", val: pendingCount, bar:"var(--gold2)" },
            { label:"Fees Paid", val: paidCount, bar:"#4ade80" },
            { label:"Open Concerns", val: openComplaints, bar:"#f87171" },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ background:"rgba(8,14,28,.95)", border:"1px solid rgba(255,255,255,.07)", borderRadius:13, padding:"1.2rem 1.3rem", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:"1.5px", background:`linear-gradient(90deg,transparent,${s.bar},transparent)` }} />
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2rem", fontWeight:600, color:s.bar, lineHeight:1, marginBottom:4 }}>{s.val}</div>
              <div style={{ fontSize:".58rem", color:"rgba(160,180,210,.7)", letterSpacing:"2px", textTransform:"uppercase", fontWeight:600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {adminTab === "overview" && (
          <div>
            <div className="adm-ph">
              <div><div className="adm-ph-title">Overview</div><div className="adm-ph-sub">MaxMUN 3.0 at a glance</div></div>
              <div className="adm-ph-btns"><button className="adm-btn-ghost" onClick={loadDataWithToast}>↻ Refresh</button></div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:"1rem", marginBottom:"2rem" }}>
              {[
                { label:"Total Delegates", val:delegates.length, icon:"👥", color:"var(--azure3)" },
                { label:"Approved", val:delegates.filter(d=>d.registration_status==="Approved").length, icon:"✅", color:"#4ade80" },
                { label:"Pending", val:delegates.filter(d=>d.registration_status==="Pending").length, icon:"⏳", color:"var(--gold2)" },
                { label:"Fees Paid", val:delegates.filter(d=>d.payment_status==="Paid").length, icon:"💰", color:"#4ade80" },
                { label:"Open Complaints", val:openComplaints, icon:"📩", color:"#f87171" },
                { label:"Unread Messages", val:messages.filter(m=>!m.is_read).length, icon:"✉️", color:"var(--azure3)" },
                { label:"Announcements", val:announcements.length, icon:"📢", color:"var(--gold2)" },
              ].map(s => (
                <div key={s.label} style={{ background:"rgba(8,14,28,.95)", border:"1px solid rgba(255,255,255,.07)", borderRadius:13, padding:"1.4rem", position:"relative", overflow:"hidden", cursor:"pointer" }}>
                  <div style={{ fontSize:"1.5rem", marginBottom:".5rem" }}>{s.icon}</div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2.2rem", fontWeight:600, color:s.color, lineHeight:1 }}>{s.val}</div>
                  <div style={{ fontSize:".6rem", color:"rgba(160,180,210,.7)", letterSpacing:"2px", textTransform:"uppercase", fontWeight:600, marginTop:4 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem", flexWrap:"wrap" }}>
              <div style={{ background:"rgba(8,14,28,.95)", border:"1px solid rgba(255,255,255,.07)", borderRadius:13, padding:"1.4rem" }}>
                <div style={{ fontSize:".65rem", color:"var(--azure3)", letterSpacing:"2px", textTransform:"uppercase", fontWeight:700, marginBottom:"1rem" }}>Recent Delegates</div>
                {delegates.slice(0,5).map(d => (
                  <div key={d.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:".5rem 0", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                    <span style={{ color:"var(--platinum)", fontSize:".82rem" }}>{d.name}</span>
                    <span style={{ color:"var(--dim)", fontSize:".7rem" }}>{d.id}</span>
                  </div>
                ))}
                {delegates.length === 0 && <div style={{ color:"var(--dim)", fontSize:".78rem" }}>No delegates yet.</div>}
              </div>
              <div style={{ background:"rgba(8,14,28,.95)", border:"1px solid rgba(255,255,255,.07)", borderRadius:13, padding:"1.4rem" }}>
                <div style={{ fontSize:".65rem", color:"var(--gold2)", letterSpacing:"2px", textTransform:"uppercase", fontWeight:700, marginBottom:"1rem" }}>Recent Complaints</div>
                {complaints.slice(0,5).map(c => (
                  <div key={c.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:".5rem 0", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                    <span style={{ color:"var(--silver)", fontSize:".78rem", flex:1, marginRight:".5rem", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.subject}</span>
                    {cmpBadge(c.status)}
                  </div>
                ))}
                {complaints.length === 0 && <div style={{ color:"var(--dim)", fontSize:".78rem" }}>No complaints yet.</div>}
              </div>
            </div>
          </div>
        )}

        {/* ── DELEGATES TAB ── */}
        {adminTab === "delegates" && (
          <>
            <div className="adm-ph">
              <div><div className="adm-ph-title">Delegate Management</div><div className="adm-ph-sub">Manage registrations, assign committees, and update portfolios</div></div>
              <div className="adm-ph-btns">
                <button className="adm-btn-ghost" onClick={() => exportDelegatesToCSV(delegates)}>⬇ Export CSV</button>
                <button className="adm-btn-ghost" onClick={bulkApprovePending}>✓ Approve All Pending</button>
                <button className="adm-btn-gold" onClick={() => { setAddForm({}); setAddError(""); setModal("add-delegate"); }}>+ Add Delegate</button>
              </div>
            </div>

            {/* Quick filter pills */}
            <div className="status-filter-pills">
              {[["All","sfp-all"],["Approved","sfp-approved"],["Pending","sfp-pending"],["Rejected","sfp-rejected"]].map(([val, cls]) => (
                <button key={val} className={`sfp ${cls}${filterReg === val ? " active":""}`} onClick={() => setFilterReg(val)}>{val}</button>
              ))}
            </div>

            <div className="adm-search-row">
              <input className="adm-search" placeholder="Search by name, delegate ID, school or committee…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>

            {/* Committee breakdown */}
            {Object.keys(committeeBreakdown).length > 0 && (
              <div style={{ marginBottom:"1.5rem" }}>
                <div className="adm-sec-ttl">Committee Breakdown</div>
                <div className="committee-breakdown">
                  {Object.entries(committeeBreakdown).sort((a,b) => b[1]-a[1]).map(([name, count]) => (
                    <div key={name} className="cb-chip"><div className="cb-chip-name">{name}</div><div className="cb-chip-count">{count}</div></div>
                  ))}
                </div>
              </div>
            )}

            <div className="adm-tbl-wrap">
              <table className="adm-tbl">
                <thead>
                  <tr>
                    <th>ID</th><th>Delegate</th><th>Committee Applied</th>
                    <th>Assigned Committee</th><th>Assigned Country</th>
                    <th>Registration</th><th>Payment</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDelegates.map(d => (
                    <tr key={d.id}>
                      <td><span className="adm-tbl-id">{d.id}</span></td>
                      <td><div className="adm-tbl-name">{d.name}</div><div style={{ fontSize:".68rem", color:"var(--dim)" }}>{d.school} · {d.grade}</div><div style={{ fontSize:".65rem", color:"var(--silver)" }}>{d.email}</div></td>
                      <td>{d.committee || "—"}</td>
                      <td>{d.assigned_committee ? <span style={{ color:"var(--gold2)", fontWeight:600 }}>{d.assigned_committee}</span> : <span className="badge-status badge-tba">TBA</span>}</td>
                      <td>{d.assigned_country ? <span style={{ color:"var(--ice)" }}>{d.assigned_country}</span> : <span className="badge-status badge-tba">TBA</span>}</td>
                      <td>{regBadge(d.registration_status)}</td>
                      <td>{payBadge(d.payment_status)}</td>
                      <td>
                        <div className="tbl-actions">
                          {d.registration_status !== "Approved" && <button className="tbl-btn tbl-btn-approve" onClick={() => changeRegStatus(d.id, "Approved")}>Approve</button>}
                          {d.registration_status !== "Rejected" && <button className="tbl-btn tbl-btn-reject" onClick={() => changeRegStatus(d.id, "Rejected")}>Reject</button>}
                          <button className="tbl-btn tbl-btn-edit" onClick={() => setEditForm({ ...d })}>Edit</button>
                          <button className="tbl-btn tbl-btn-del" onClick={() => deleteDelegate(d.id)}>Remove</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredDelegates.length === 0 && <tr><td colSpan={8} style={{ textAlign:"center", color:"var(--dim)", padding:"2rem" }}>No delegates found.</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── COMPLAINTS TAB ── */}
        {adminTab === "complaints" && (
          <>
            <div className="adm-ph">
              <div><div className="adm-ph-title">Delegate Concerns</div><div className="adm-ph-sub">{complaints.length} total · {complaints.filter(c=>c.status==="Pending").length} pending</div></div>
              <div className="adm-ph-btns">
                <select className="adm-filter" value={filterReg} onChange={e => setFilterReg(e.target.value)}>
                  <option value="All">All Concerns</option>
                  <option value="Pending">Pending</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <button className="adm-btn-blue" onClick={loadDataWithToast} style={{ padding:".4rem 1rem", fontSize:".72rem" }}>↻ Refresh</button>
              </div>
            </div>
            {complaints.filter(c => filterReg === "All" || c.status === filterReg).map(c => (
              <div key={c.id} className="adm-cmp-card">
                <div className="adm-cmp-header">
                  <div className="adm-cmp-subject">{c.subject}</div>
                  {cmpBadge(c.status)}
                </div>
                <div className="adm-cmp-meta">
                  <span className="adm-cmp-delegate">{c.delegate_name || "Public"}</span>
                  <span className="adm-cmp-id">{c.delegate_id || "—"}</span>
                  {c.category && <span style={{ background:"rgba(0,80,255,.15)", color:"var(--azure3)", borderRadius:50, padding:"2px 8px", fontSize:".62rem", fontWeight:600 }}>{c.category}</span>}
                  <span className="adm-cmp-date">{c.created_at ? new Date(c.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}) : "—"}</span>
                </div>
                <div className="adm-cmp-desc">{c.description}</div>
                {c.admin_note && <div className="adm-note-box">📩 Your note: {c.admin_note}</div>}
                <div style={{ marginBottom:".5rem" }}>
                  <input
                    style={{ width:"100%", background:"rgba(0,0,0,.3)", border:"1px solid rgba(255,255,255,.08)", borderRadius:6, padding:".5rem .75rem", color:"var(--platinum)", fontSize:".78rem", fontFamily:"'Space Grotesk',sans-serif", outline:"none", marginBottom:".4rem" }}
                    placeholder="Add a note to this delegate (optional)…"
                    value={complaintNote[c.id] || ""}
                    onChange={e => setComplaintNote(p => ({ ...p, [c.id]: e.target.value }))}
                  />
                </div>
                <div className="adm-cmp-actions">
                  <button className="tbl-btn tbl-btn-approve" onClick={() => changeComplaintStatus(c.id, "Resolved")}>Mark Resolved</button>
                  <button className="tbl-btn tbl-btn-review" onClick={() => changeComplaintStatus(c.id, "Under Review")}>Under Review</button>
                  {c.status !== "Pending" && <button className="tbl-btn tbl-btn-edit" onClick={() => changeComplaintStatus(c.id, "Pending")}>Reopen</button>}
                </div>
              </div>
            ))}
            {complaints.filter(c => filterReg === "All" || c.status === filterReg).length === 0 && (
              <div style={{ color:"var(--dim)", fontSize:".82rem", padding:"2rem 0" }}>No concerns found.</div>
            )}
          </>
        )}


        {/* ── MESSAGES TAB ── */}
        {adminTab === "messages" && (
          <div>
            <div className="adm-ph">
              <div><div className="adm-ph-title">Messages</div><div className="adm-ph-sub">{messages.length} total · {messages.filter(m=>!m.is_read).length} unread</div></div>
              <div className="adm-ph-btns">
                <button className="adm-btn-ghost" onClick={loadDataWithToast}>↻ Refresh</button>
                <button className="adm-btn-ghost" style={{ color:"#f87171", borderColor:"rgba(248,113,113,.3)" }} onClick={async () => { if(window.confirm("Delete all read messages?")) { await Promise.all(messages.filter(m=>m.is_read).map(m=>DB.deleteMessage(m.id))); loadData(); }}}>Clear Read</button>
              </div>
            </div>
            <div style={{ display:"flex", gap:".75rem", marginBottom:"1.2rem", flexWrap:"wrap" }}>
              <input style={{ flex:1, minWidth:180, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:8, padding:".5rem 1rem", color:"var(--platinum)", fontSize:".82rem", outline:"none", fontFamily:"inherit" }} placeholder="Search messages…" value={msgSearch} onChange={e => setMsgSearch(e.target.value)} />
              {["All","Unread","Read"].map(f => (
                <button key={f} onClick={() => setMsgFilter(f)} style={{ padding:".4rem .9rem", borderRadius:50, border:"1px solid", fontSize:".72rem", cursor:"pointer", fontFamily:"inherit", background: msgFilter===f ? "rgba(0,80,255,.2)" : "transparent", color: msgFilter===f ? "var(--azure3)" : "var(--silver)", borderColor: msgFilter===f ? "rgba(0,80,255,.4)" : "rgba(255,255,255,.08)" }}>{f}</button>
              ))}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:".75rem" }}>
              {messages
                .filter(m => {
                  const q = msgSearch.toLowerCase();
                  const mQ = !q || [m.name,m.email,m.subject,m.message].some(v=>v?.toLowerCase().includes(q));
                  const mF = msgFilter==="All"||(msgFilter==="Unread"&&!m.is_read)||(msgFilter==="Read"&&m.is_read);
                  return mQ && mF;
                })
                .map(m => (
                  <div key={m.id} style={{ background:m.is_read?"rgba(255,255,255,.02)":"rgba(0,80,255,.06)", border:`1px solid ${m.is_read?"rgba(255,255,255,.07)":"rgba(0,80,255,.2)"}`, borderRadius:12, padding:"1.1rem 1.3rem", position:"relative" }}>
                    {!m.is_read && <div style={{ position:"absolute", top:14, right:14, width:8, height:8, borderRadius:"50%", background:"var(--azure3)", boxShadow:"0 0 8px var(--azure3)" }} />}
                    <div style={{ display:"flex", flexWrap:"wrap", gap:".5rem", alignItems:"center", marginBottom:".4rem" }}>
                      <span style={{ fontWeight:600, color:"var(--platinum)", fontSize:".88rem" }}>{m.name}</span>
                      <span style={{ color:"var(--dim)", fontSize:".72rem" }}>{m.email}</span>
                      <span style={{ color:"var(--dim)", fontSize:".65rem", marginLeft:"auto" }}>{m.created_at ? new Date(m.created_at).toLocaleString("en-GB",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}) : ""}</span>
                    </div>
                    {m.subject && <div style={{ color:"var(--azure3)", fontSize:".75rem", fontWeight:600, marginBottom:".4rem" }}>{m.subject}</div>}
                    <div style={{ color:"var(--silver)", fontSize:".82rem", lineHeight:1.6, marginBottom:".75rem" }}>{m.message}</div>
                    <div style={{ display:"flex", gap:".5rem", flexWrap:"wrap" }}>
                      {!m.is_read && <button onClick={async()=>{ await DB.markMessageRead(m.id); loadData(); }} style={{ padding:".3rem .8rem", borderRadius:50, border:"1px solid rgba(74,222,128,.3)", background:"rgba(74,222,128,.08)", color:"#4ade80", fontSize:".68rem", cursor:"pointer", fontFamily:"inherit" }}>✓ Mark Read</button>}
                      <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject||"Your MaxMUN message")}`} style={{ padding:".3rem .8rem", borderRadius:50, border:"1px solid rgba(255,255,255,.1)", background:"transparent", color:"var(--azure3)", fontSize:".68rem", cursor:"pointer", fontFamily:"inherit", textDecoration:"none" }}>Reply</a>
                      <button onClick={async()=>{ if(window.confirm("Delete?")){ await DB.deleteMessage(m.id); loadData(); }}} style={{ padding:".3rem .8rem", borderRadius:50, border:"1px solid rgba(248,113,113,.3)", background:"rgba(248,113,113,.08)", color:"#f87171", fontSize:".68rem", cursor:"pointer", fontFamily:"inherit" }}>Delete</button>
                    </div>
                  </div>
                ))
              }
              {messages.filter(m=>{ const q=msgSearch.toLowerCase(); const mQ=!q||[m.name,m.email,m.subject,m.message].some(v=>v?.toLowerCase().includes(q)); const mF=msgFilter==="All"||(msgFilter==="Unread"&&!m.is_read)||(msgFilter==="Read"&&m.is_read); return mQ&&mF; }).length === 0 && (
                <div style={{ color:"var(--dim)", fontSize:".82rem", textAlign:"center", padding:"3rem", background:"rgba(255,255,255,.02)", borderRadius:12, border:"1px solid rgba(255,255,255,.06)" }}>
                  {msgSearch||msgFilter!=="All" ? "No messages match your search." : "No messages yet. Contact form submissions will appear here."}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ANNOUNCEMENTS TAB ── */}
        {adminTab === "announcements" && (
          <>
            <div className="adm-ph">
              <div><div className="adm-ph-title">Announcements</div><div className="adm-ph-sub">Post notices and updates visible to all delegates</div></div>
              <div className="adm-ph-btns">
                <button className="adm-btn-blue" onClick={() => { setAnnForm({ title:"", body:"", pinned:false }); setModal("add-announcement"); }}>+ New Announcement</button>
              </div>
            </div>

            {/* Quick create inline */}
            <div style={{ background:"rgba(255,255,255,.01)", border:"1px dashed rgba(255,255,255,.08)", borderRadius:12, padding:"1.5rem", marginBottom:"1.5rem" }}>
              <div style={{ fontSize:".72rem", color:"var(--gold2)", marginBottom:"1rem", letterSpacing:"1px", textTransform:"uppercase", fontWeight:700 }}>Quick Post</div>
              <div className="pf-row">
                <div className="pf"><label>Title</label><input placeholder="Announcement title…" value={annForm.title || ""} onChange={e => setAnnForm(p => ({ ...p, title: e.target.value }))} /></div>
                <div className="pf"><label>Body</label><input placeholder="Announcement content…" value={annForm.body || ""} onChange={e => setAnnForm(p => ({ ...p, body: e.target.value }))} /></div>
              </div>
              <div style={{ display:"flex", gap:"1rem", alignItems:"center", marginTop:".5rem", flexWrap:"wrap" }}>
                <button className="adm-btn-blue" onClick={saveAnnouncement}>Publish</button>
                <label style={{ display:"flex", alignItems:"center", gap:".4rem", fontSize:".72rem", color:"var(--silver)", cursor:"pointer" }}>
                  <input type="checkbox" checked={!!annForm.pinned} onChange={e => setAnnForm(p => ({ ...p, pinned: e.target.checked }))} style={{ width:"auto" }} />
                  Pin to top of delegate dashboard
                </label>
              </div>
            </div>

            {announcements.length === 0 && <div style={{ color:"var(--dim)", fontSize:".82rem" }}>No announcements yet.</div>}
            {[...announcements].sort((a,b) => b.pinned - a.pinned).map(a => (
              <div key={a.id} className={`adm-ann-card${a.pinned ? " pinned":""}`}>
                <div className="adm-ann-content">
                  {a.pinned && <div style={{ fontSize:".58rem", color:"var(--gold2)", letterSpacing:"2px", textTransform:"uppercase", fontWeight:700, marginBottom:".3rem" }}>📌 Pinned</div>}
                  <div style={{ fontWeight:600, color:"var(--platinum)", marginBottom:".3rem" }}>{a.title}</div>
                  <div style={{ fontSize:".8rem", color:"var(--silver)", lineHeight:1.6 }}>{a.body}</div>
                  <div style={{ fontSize:".62rem", color:"var(--dim)", marginTop:".4rem" }}>{a.created_at ? new Date(a.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}) : ""}</div>
                </div>
                <div className="adm-ann-actions">
                  <button className="tbl-btn tbl-btn-edit" onClick={() => { setAnnForm({ title:a.title, body:a.body, pinned:a.pinned, editId:a.id }); setModal("add-announcement"); }}>Edit</button>
                  <button className="tbl-btn tbl-btn-del" onClick={() => deleteAnnouncement(a.id)}>Delete</button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* ── EDIT DELEGATE MODAL ── */}
      {editForm && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setEditForm(null)}>
          <div className="admin-modal">
            <div className="admin-modal-header"><div className="admin-modal-title">Edit Delegate — {editForm.id}</div><button className="admin-modal-close" onClick={() => setEditForm(null)}>✕</button></div>
            <div className="admin-modal-body">
              <div className="pf-row">
                <div className="pf"><label>Full Name</label><input value={editForm.name || ""} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} /></div>
                <div className="pf"><label>School</label><input value={editForm.school || ""} onChange={e => setEditForm(p => ({ ...p, school: e.target.value }))} /></div>
              </div>
              <div className="pf-row">
                <div className="pf"><label>Assign Committee</label>
                  <select value={editForm.assignedCommittee || editForm.assigned_committee || ""} onChange={e => setEditForm(p => ({ ...p, assigned_committee: e.target.value || null }))}>
                    <option value="">TBA</option>{COMMITTEE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="pf"><label>Assign Country</label><input value={editForm.assignedCountry || editForm.assigned_country || ""} placeholder="e.g. United States" onChange={e => setEditForm(p => ({ ...p, assigned_country: e.target.value || null }))} /></div>
              </div>
              <div className="pf-row">
                <div className="pf"><label>Registration Status</label>
                  <select value={editForm.registrationStatus || editForm.registration_status || "Pending"} onChange={e => setEditForm(p => ({ ...p, registration_status: e.target.value }))}>
                    <option>Pending</option><option>Approved</option><option>Rejected</option>
                  </select>
                </div>
                <div className="pf"><label>Payment Status</label>
                  <select value={editForm.paymentStatus || editForm.payment_status || "Pending"} onChange={e => setEditForm(p => ({ ...p, payment_status: e.target.value }))}>
                    <option>Pending</option><option>Paid</option><option>Waived</option>
                  </select>
                </div>
              </div>
              <div style={{ display:"flex", gap:".75rem", marginTop:".5rem" }}>
                <button className="portal-btn" onClick={saveDelegateEdits} style={{ background:"linear-gradient(135deg,var(--gold),var(--gold2))", color:"var(--ink)" }}>Save Changes</button>
                <button className="portal-btn" onClick={() => setEditForm(null)} style={{ background:"transparent", border:"1px solid var(--glassborder)", color:"var(--silver)", boxShadow:"none" }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD DELEGATE MODAL ── */}
      {modal === "add-delegate" && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="admin-modal">
            <div className="admin-modal-header"><div className="admin-modal-title">Add New Delegate</div><button className="admin-modal-close" onClick={() => setModal(null)}>✕</button></div>
            <div className="admin-modal-body">
              <div style={{ background:"rgba(0,80,255,.07)", border:"1px solid rgba(0,80,255,.18)", borderRadius:8, padding:".7rem 1rem", marginBottom:"1rem", fontSize:".76rem", color:"var(--azure3)", lineHeight:1.5 }}>
                A unique Delegate ID will be generated automatically. Set a password to share with the delegate after account creation.
              </div>
              {addError && <div style={{ background:"rgba(248,113,113,.08)", border:"1px solid rgba(248,113,113,.22)", borderRadius:8, padding:".7rem 1rem", marginBottom:"1rem", fontSize:".78rem", color:"#f87171", lineHeight:1.5 }}>⚠ {addError}</div>}
              <div className="pf-row">
                <div className="pf"><label>Full Name *</label><input value={addForm.name || ""} placeholder="Delegate's full name" onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))} /></div>
                <div className="pf"><label>Email</label><input value={addForm.email || ""} placeholder="delegate@email.com" onChange={e => setAddForm(p => ({ ...p, email: e.target.value }))} /></div>
              </div>
              <div className="pf-row">
                <div className="pf"><label>Phone</label><input value={addForm.phone || ""} placeholder="+91 99999 00000" onChange={e => setAddForm(p => ({ ...p, phone: e.target.value }))} /></div>
                <div className="pf"><label>School</label><input value={addForm.school || ""} placeholder="School name" onChange={e => setAddForm(p => ({ ...p, school: e.target.value }))} /></div>
              </div>
              <div className="pf-row">
                <div className="pf"><label>Grade / Class</label>
                  <select value={addForm.grade || ""} onChange={e => setAddForm(p => ({ ...p, grade: e.target.value }))}>
                    <option value="">— Select —</option>{["Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="pf"><label>Committee Applied</label>
                  <select value={addForm.committee || ""} onChange={e => setAddForm(p => ({ ...p, committee: e.target.value }))}>
                    <option value="">— Select —</option>{COMMITTEE_OPTIONS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="pf-row">
                <div className="pf"><label>Assign Committee</label>
                  <select value={addForm.assignedCommittee || ""} onChange={e => setAddForm(p => ({ ...p, assigned_committee: e.target.value || null }))}>
                    <option value="">TBA</option>{COMMITTEE_OPTIONS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="pf"><label>Assign Country</label><input value={addForm.assignedCountry || ""} placeholder="e.g. India" onChange={e => setAddForm(p => ({ ...p, assigned_country: e.target.value || null }))} /></div>
              </div>
              <div className="pf-row">
                <div className="pf"><label>Registration Status</label>
                  <select value={addForm.registrationStatus || "Approved"} onChange={e => setAddForm(p => ({ ...p, registration_status: e.target.value }))}>
                    <option>Approved</option><option>Pending</option><option>Rejected</option>
                  </select>
                </div>
                <div className="pf"><label>MUN Experience</label>
                  <select value={addForm.experience || ""} onChange={e => setAddForm(p => ({ ...p, experience: e.target.value }))}>
                    <option value="">— Select —</option><option>First-time</option><option>1–2 conferences</option><option>3–5 conferences</option><option>5+ conferences</option>
                  </select>
                </div>
              </div>
              <div className="pf"><label>Password * (share this with the delegate)</label><input type="text" placeholder="Set a password for this delegate" value={addForm.password || ""} onChange={e => setAddForm(p => ({ ...p, password: e.target.value }))} autoComplete="off" /></div>
              <button className="portal-btn" onClick={addDelegate} disabled={addLoading} style={{ marginTop:".5rem" }}>{addLoading ? "Creating account…" : "Create Delegate Account"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── CREDENTIALS MODAL ── */}
      {newlyCreated && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setNewlyCreated(null)}>
          <div className="admin-modal">
            <div className="admin-modal-header"><div className="admin-modal-title" style={{ color:"var(--gold2)" }}>✓ Account Created</div><button className="admin-modal-close" onClick={() => setNewlyCreated(null)}>✕</button></div>
            <div className="admin-modal-body">
              <div style={{ background:"rgba(74,222,128,.07)", border:"1px solid rgba(74,222,128,.2)", borderRadius:8, padding:".75rem 1rem", marginBottom:"1.2rem", fontSize:".78rem", color:"#4ade80", lineHeight:1.5 }}>
                Account created for <strong>{newlyCreated.name}</strong>. Share these credentials with them — they won't be shown again.
              </div>
              <div className="cred-box">
                <div className="cred-box-title">🔑 Login Credentials</div>
                <div className="cred-row"><span className="cred-label">Delegate ID</span><span className="cred-val">{newlyCreated.id}</span></div>
                <div className="cred-row"><span className="cred-label">Password</span><span className="cred-val">{newlyCreated.password}</span></div>
                <div className="cred-row"><span className="cred-label">Login URL</span><span className="cred-val" style={{ fontSize:".75rem" }}>maxmun.in → Delegate Login</span></div>
              </div>
              <button className="portal-btn" onClick={() => setNewlyCreated(null)} style={{ background:"linear-gradient(135deg,var(--gold),var(--gold2))", color:"var(--ink)" }}>Done — I've saved the credentials</button>
            </div>
          </div>
        </div>
      )}

      {/* ── ANNOUNCEMENT MODAL ── */}
      {modal === "add-announcement" && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="admin-modal">
            <div className="admin-modal-header"><div className="admin-modal-title">{annForm.editId ? "Edit Announcement" : "New Announcement"}</div><button className="admin-modal-close" onClick={() => setModal(null)}>✕</button></div>
            <div className="admin-modal-body">
              <div className="pf"><label>Title</label><input value={annForm.title} onChange={e => setAnnForm(p => ({ ...p, title: e.target.value }))} placeholder="Announcement title" /></div>
              <div className="pf"><label>Body</label><textarea rows={4} value={annForm.body} onChange={e => setAnnForm(p => ({ ...p, body: e.target.value }))} placeholder="Announcement content…" style={{ resize:"vertical" }} /></div>
              <div className="pf" style={{ display:"flex", alignItems:"center", gap:".5rem" }}>
                <input type="checkbox" id="pin-chk" checked={!!annForm.pinned} onChange={e => setAnnForm(p => ({ ...p, pinned: e.target.checked }))} style={{ width:"auto" }} />
                <label htmlFor="pin-chk" style={{ fontSize:".78rem", color:"var(--silver)", letterSpacing:"1px", textTransform:"none", margin:0 }}>Pin this announcement to the top of the delegate dashboard</label>
              </div>
              <button className="portal-btn" onClick={saveAnnouncement} style={{ marginTop:".5rem" }}>Publish Announcement</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">✦ {toast}</div>}
    </div>
  );
}

/* ════════════════════════════════════════
   APP ROUTER
════════════════════════════════════════ */
export default function App() {
  const getInitialPage = () => {
    const path = window.location.pathname.replace(/\/$/, "");
    if (path === "/current-mun") return "current-mun";
    const h = window.location.hash.replace("#","");
    if (h === "admin") return "admin-login";
    const s = DB.getSession();
    if (s?.type === "admin") return "admin-dashboard";
    return "home";
  };

  const [page, setPage] = useState(getInitialPage);

  const navigate = (p) => {
    if (p === "current-register") {
      setPage("current-mun");
      forceScrollTop();
      window.history.pushState(null, "", "/current-mun#current-register");
      setTimeout(() => smoothScrollToId("current-register"), 120);
      return;
    }
    setPage(p);
    forceScrollTop();
    if (p === "current-mun") {
      window.history.pushState(null, "", "/current-mun");
      return;
    }
    if (window.location.pathname !== "/") window.history.pushState(null, "", "/");
    if (p === "admin-login") window.location.hash = "admin";
    else if (p === "home") window.location.hash = "";
  };

  useEffect(() => {
    forceScrollTop();
  }, [page]);

  useEffect(() => {
    const syncRoute = () => {
      const path = window.location.pathname.replace(/\/$/, "");
      if (path === "/current-mun") { setPage("current-mun"); return; }
      const h = window.location.hash.replace("#","");
      if (h === "admin" && page !== "admin-login" && page !== "admin-dashboard") setPage("admin-login");
      else if (!h && path === "") setPage("home");
      else if (!h && path === "/") setPage("home");
    };
    window.addEventListener("hashchange", syncRoute);
    window.addEventListener("popstate", syncRoute);
    return () => {
      window.removeEventListener("hashchange", syncRoute);
      window.removeEventListener("popstate", syncRoute);
    };
  }, [page]);

  return (
    <>
      <style>{STYLES}</style>
      <style>{PORTAL_STYLES}</style>
      {page === "home" && <MaxMUNHome onNavigateToRegister={() => navigate("current-register")} onNavigateToAdmin={() => navigate("admin-login")} onNavigateToCurrentMun={() => navigate("current-mun")} />}
      {page === "current-mun" && <><HomeCursorLayer active /><div className="noise-layer" /><CurrentMunPage onBack={() => navigate("home")} /></>}
      {page === "admin-login" && <><FXCanvas /><div className="noise-layer" /><AdminLogin onNavigate={navigate} /></>}
      {page === "admin-dashboard" && <AdminDashboard onNavigate={navigate} />}
      <GoatedFX />
    </>
  );
}
