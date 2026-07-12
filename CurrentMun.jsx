import React, { useEffect, useRef, useState } from "react";
import ExternalLinkButton from "./src/components/ExternalLinkButton.jsx";
import FooterContact from "./src/components/FooterContact.jsx";
import MatrixPreview from "./src/components/MatrixPreview.jsx";
import { REGISTRATION_FORM_URL, REGISTRATION_FORM_EMBED_URL, MATRIX_FULL_URL, MATRIX_EMBED_URL } from "./src/config/registrationLinks.js";
import { currentCommittees, currentPerks, currentAwards, specialAwards, participationSteps, currentSchedule } from "./src/data/currentMunData.js";
import { forceScrollTop, smoothScrollToId } from "./src/utils/smoothScroll.js";

const CURRENT_NAV_ITEMS = [
  ["current-about", "About"],
  ["current-register", "Register"],
  ["current-preview", "Preview"],
  ["current-committees", "Committees"],
  ["current-perks", "Perks"],
  ["current-awards", "Awards"],
  ["current-schedule", "Schedule"],
];
const CURRENT_MUN_STYLES = `
html,body,#root{overscroll-behavior-y:auto;scrollbar-gutter:stable}
html{scrollbar-color:#38bdf8 #020711;scrollbar-width:thin}
body::-webkit-scrollbar{width:12px}
body::-webkit-scrollbar-track{background:#020711}
body::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#1d4ed8,#38bdf8,#c8a96e);border:3px solid #020711;border-radius:999px}
.cm-page{min-height:100vh;background:#000;color:#f0ead6;font-family:'Space Grotesk',sans-serif;overflow-x:hidden;overflow-y:visible;touch-action:pan-y;-webkit-overflow-scrolling:touch;scroll-behavior:auto;--mx:50%;--my:48%;--scroll-progress:0%}
.cm-page *{box-sizing:border-box}
.cm-contact-gap{display:inline-block;margin:0 .9rem;color:rgba(255,255,255,.32)}.cm-actions button.cm-btn{font-family:'Space Grotesk',sans-serif;cursor:pointer}

.cm-nav{position:fixed;top:0;left:0;right:0;z-index:80;display:flex;align-items:center;justify-content:space-between;padding:1rem clamp(1rem,4vw,3rem);background:rgba(0,0,0,.66);backdrop-filter:blur(18px);border-bottom:1px solid rgba(255,255,255,.08)}
.cm-brand{font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:700;letter-spacing:.28em;font-size:clamp(1.05rem,2vw,1.45rem);color:#f7f2ec;text-decoration:none;white-space:nowrap}.cm-brand span{color:#38bdf8}
.cm-links{display:flex;align-items:center;gap:clamp(.8rem,2vw,1.7rem)}
.cm-links a,.cm-links button{font:700 .68rem/1 'Space Grotesk',sans-serif;letter-spacing:.20em;text-transform:uppercase;color:rgba(255,255,255,.72);background:none;border:0;text-decoration:none;cursor:pointer;transition:.25s}.cm-links a:hover,.cm-links button:hover{color:#c8a96e}.cm-back{border:1px solid rgba(200,169,110,.55)!important;color:#c8a96e!important;border-radius:6px!important;padding:.68rem .9rem!important}.cm-back:hover{background:#c8a96e!important;color:#000!important}
.cm-hero{position:relative;min-height:100vh;display:grid;place-items:center;text-align:center;overflow:hidden;padding:8rem 1.2rem 5rem;--mx:50%;--my:48%}
.cm-hero::before{content:"";position:absolute;inset:-22%;background:radial-gradient(circle at 30% 20%,rgba(29,78,216,.28),transparent 32%),radial-gradient(circle at 80% 82%,rgba(200,169,110,.18),transparent 28%),linear-gradient(180deg,#02050b 0%,#020b18 55%,#000 100%);transition:background .12s linear}
.cm-grid{position:absolute;inset:0;opacity:.10;background-image:linear-gradient(rgba(255,255,255,.18) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.18) 1px,transparent 1px);background-size:70px 70px;mask-image:radial-gradient(circle at center,black 0%,transparent 76%)}
.cm-particles{display:none!important;position:absolute;inset:0;width:100%;height:100%;z-index:1;pointer-events:none;opacity:0}.cm-mouse-aura{display:none!important}
.cm-orb-wrap{position:absolute;inset:0;pointer-events:none;perspective:900px;z-index:2}.cm-orb{position:absolute;left:50%;top:48%;width:min(54vw,520px);height:min(54vw,520px);transform:translate(-50%,-50%) rotateX(calc((var(--my) - 50%) * .10)) rotateY(calc((var(--mx) - 50%) * -.10));border-radius:50%;border:1px solid rgba(56,189,248,.32);box-shadow:0 0 90px rgba(29,78,216,.30),inset 0 0 70px rgba(200,169,110,.08);background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.15),transparent 15%),radial-gradient(circle at 60% 70%,rgba(56,189,248,.20),transparent 35%),rgba(255,255,255,.015);animation:cmFloat 7s ease-in-out infinite}.cm-orb::before,.cm-orb::after{content:"";position:absolute;inset:10%;border:1px solid rgba(200,169,110,.35);border-radius:50%;transform:rotate(62deg)}.cm-orb::after{inset:22%;border-color:rgba(255,255,255,.18);transform:rotate(-28deg)}
@keyframes cmFloat{0%,100%{margin-top:0}50%{margin-top:-18px}}
.cm-hero-content{position:relative;z-index:4;max-width:980px}.cm-kicker{display:inline-flex;align-items:center;gap:.7rem;margin-bottom:1.6rem;color:rgba(255,255,255,.68);text-transform:uppercase;letter-spacing:.35em;font-size:.68rem;font-weight:700}.cm-kicker::before,.cm-kicker::after{content:"";width:36px;height:1px;background:linear-gradient(90deg,transparent,#c8a96e)}.cm-kicker::after{background:linear-gradient(90deg,#c8a96e,transparent)}
.cm-title{font-family:'Cormorant Garamond',serif;font-size:clamp(4.4rem,15vw,12rem);line-height:.82;font-weight:300;letter-spacing:-.05em;margin:0;text-shadow:0 20px 80px rgba(0,0,0,.65)}.cm-title span{font-style:italic;background:linear-gradient(90deg,#fff,#38bdf8 42%,#c8a96e);-webkit-background-clip:text;background-clip:text;color:transparent}.cm-sub{max-width:720px;margin:1.4rem auto 2.2rem;color:rgba(255,255,255,.74);font-size:clamp(.98rem,1.7vw,1.15rem);line-height:1.75}.cm-actions{display:flex;justify-content:center;gap:1rem;flex-wrap:wrap}.cm-btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:.9rem 1.45rem;border-radius:6px;border:1px solid rgba(255,255,255,.15);text-decoration:none;color:#fff;background:rgba(255,255,255,.06);font-size:.75rem;font-weight:800;letter-spacing:.18em;text-transform:uppercase;transition:.25s}.cm-btn.primary{background:#c8a96e;color:#000;border-color:#c8a96e}.cm-btn:hover{transform:translateY(-2px);box-shadow:0 16px 45px rgba(56,189,248,.18)}
.cm-section{position:relative;padding:clamp(5rem,9vw,8rem) clamp(1rem,4vw,3rem);background:#000;border-top:1px solid rgba(255,255,255,.07)}.cm-section.alt{background:#020b18}.cm-inner{max-width:1180px;margin:0 auto}.cm-section-head{text-align:center;margin-bottom:3.2rem}.cm-label{color:#c8a96e;text-transform:uppercase;letter-spacing:.30em;font-size:.7rem;font-weight:800;margin-bottom:.85rem}.cm-h2{font-family:'Cormorant Garamond',serif;font-size:clamp(2.7rem,7vw,5.2rem);font-style:italic;line-height:.95;margin:0;color:#f0ead6}.cm-h2 span{font-style:normal;background:linear-gradient(90deg,#1d4ed8,#0ea5e9);-webkit-background-clip:text;background-clip:text;color:transparent}.cm-lead{max-width:780px;margin:1.2rem auto 0;color:rgba(255,255,255,.66);line-height:1.8;font-size:1rem}.cm-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-top:3rem}.cm-stat,.cm-card,.cm-timeline-card,.cm-reg-panel{background:rgba(17,17,17,.76);border:1px solid rgba(255,255,255,.08);backdrop-filter:blur(12px);box-shadow:0 20px 70px rgba(0,0,0,.35)}.cm-stat{padding:1.4rem;text-align:center;border-radius:16px}.cm-stat strong{display:block;font-size:clamp(2rem,4vw,3.1rem);color:#c8a96e}.cm-stat span{font-size:.72rem;text-transform:uppercase;letter-spacing:.22em;color:rgba(255,255,255,.58)}
.cm-card-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.3rem}.cm-card{position:relative;overflow:hidden;padding:1.55rem;border-radius:18px;transition:.25s}.cm-card::before{content:"";position:absolute;inset:0 0 auto 0;height:3px;background:linear-gradient(90deg,#1d4ed8,#0ea5e9,#c8a96e);transform:scaleX(0);transform-origin:left;transition:.25s}.cm-card:hover{transform:translateY(-6px);border-color:rgba(56,189,248,.35);box-shadow:0 28px 80px rgba(29,78,216,.16)}.cm-card:hover::before{transform:scaleX(1)}.cm-card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;margin-bottom:1rem}.cm-acronym{font-size:2rem;font-weight:800;color:#fff;letter-spacing:-.04em}.cm-pill{font-size:.63rem;letter-spacing:.16em;text-transform:uppercase;padding:.42rem .55rem;border:1px solid rgba(200,169,110,.45);border-radius:999px;color:#c8a96e}.cm-card h3{margin:.2rem 0 .9rem;color:rgba(255,255,255,.86);font-size:1.03rem}.cm-card p{margin:0;color:rgba(255,255,255,.58);line-height:1.65;font-size:.9rem}.cm-card p strong{color:rgba(255,255,255,.82)}
.cm-perks{display:grid;grid-template-columns:repeat(3,1fr);gap:2rem}.cm-perk{text-align:center}.cm-perk-ico{width:78px;height:78px;margin:0 auto 1.15rem;display:grid;place-items:center;border-radius:50%;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);font-size:2rem;transition:.25s}.cm-perk:hover .cm-perk-ico{transform:scale(1.08);border-color:rgba(56,189,248,.42);box-shadow:0 0 35px rgba(56,189,248,.16)}.cm-perk h3{margin:.4rem 0;color:#fff;font-size:1.12rem}.cm-perk p{margin:0;color:rgba(255,255,255,.58);line-height:1.65}
.cm-schedule{display:grid;grid-template-columns:repeat(2,1fr);gap:2.2rem}.cm-day-title{font-size:1.7rem;color:#fff;border-left:2px solid #1d4ed8;padding-left:1rem;margin-bottom:1.6rem}.cm-timeline{display:flex;flex-direction:column;gap:1rem;border-left:1px solid rgba(56,189,248,.42);padding-left:1.2rem}.cm-timeline-card{position:relative;padding:1rem 1.1rem;border-radius:0 14px 14px 0}.cm-timeline-card::before{content:"";position:absolute;left:-1.62rem;top:1.2rem;width:12px;height:12px;border-radius:50%;background:#000;border:2px solid #c8a96e;box-shadow:0 0 14px rgba(200,169,110,.6)}.cm-time{color:#c8a96e;font-family:monospace;font-size:.8rem;letter-spacing:.08em}.cm-event{color:#fff;font-weight:800;margin-top:.3rem}
.cm-reg-layout{display:grid;grid-template-columns:.9fr 1.1fr;gap:1.5rem;align-items:stretch}.cm-fees{display:flex;flex-direction:column;gap:1rem}.cm-fee{display:flex;justify-content:space-between;gap:1rem;padding:1.15rem;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);border-radius:14px;color:#fff}.cm-fee span:last-child{color:#c8a96e;text-transform:uppercase;letter-spacing:.14em;font-size:.72rem}.cm-reg-panel{padding:2rem;border-radius:20px}.cm-reg-badge{display:inline-block;margin-bottom:1rem;padding:.45rem .75rem;border:1px solid rgba(204,0,0,.45);background:rgba(204,0,0,.15);border-radius:999px;color:#ff6b6b;font-size:.68rem;text-transform:uppercase;letter-spacing:.18em;font-weight:800}.cm-reg-panel h3{font-family:'Cormorant Garamond',serif;font-size:2.4rem;font-style:italic;margin:.2rem 0 .8rem}.cm-reg-panel p{color:rgba(255,255,255,.62);line-height:1.7}.cm-note{margin-top:1.4rem;padding:1rem;border-left:3px solid #c8a96e;background:rgba(200,169,110,.08);color:rgba(255,255,255,.76);line-height:1.65}
.cm-footer{padding:3rem clamp(1rem,4vw,3rem);background:#000;border-top:1px solid rgba(255,255,255,.1)}.cm-footer-inner{max-width:1180px;margin:0 auto;display:flex;justify-content:space-between;gap:2rem;flex-wrap:wrap}.cm-footer-brand{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:2rem;letter-spacing:.12em}.cm-footer p{color:rgba(255,255,255,.5);max-width:460px;line-height:1.7}.cm-footer-links{display:flex;flex-direction:column;gap:.7rem}.cm-footer-links a,.cm-footer-links button{background:none;border:0;color:rgba(255,255,255,.56);font:inherit;text-align:left;cursor:pointer;text-decoration:none}.cm-footer-links a:hover,.cm-footer-links button:hover{color:#c8a96e}.cm-made-by{max-width:1180px;margin:1.8rem auto 0;padding-top:1.1rem;border-top:1px solid rgba(255,255,255,.08);font-size:.75rem;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.48);text-align:center}.cm-made-by span{color:#c8a96e}

.cm-reg-feature{position:relative;overflow:hidden;border:1px solid rgba(200,169,110,.22);box-shadow:0 30px 120px rgba(29,78,216,.20),inset 0 0 80px rgba(56,189,248,.05)}
.cm-reg-feature::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 28% 12%,rgba(56,189,248,.20),transparent 34%),radial-gradient(circle at 78% 72%,rgba(200,169,110,.16),transparent 38%);pointer-events:none}.cm-reg-feature .cm-inner{position:relative;z-index:2}.cm-live-grid{display:grid;grid-template-columns:.88fr 1.12fr;gap:1.35rem;align-items:stretch}.cm-live-card,.cm-preview-shell,.cm-award-card,.cm-step-card{background:rgba(12,12,16,.78);border:1px solid rgba(255,255,255,.09);border-radius:22px;backdrop-filter:blur(14px);box-shadow:0 24px 75px rgba(0,0,0,.45)}.cm-live-card{padding:2rem}.cm-live-card h3{font-family:'Cormorant Garamond',serif;font-size:clamp(2.4rem,5vw,4rem);font-style:italic;line-height:.95;margin:0 0 1rem;color:#f0ead6}.cm-live-card h3 span{background:linear-gradient(90deg,#38bdf8,#c8a96e);-webkit-background-clip:text;background-clip:text;color:transparent}.cm-live-card p{color:rgba(255,255,255,.68);line-height:1.75;margin:0 0 1rem}.cm-action-row{display:flex;gap:.8rem;flex-wrap:wrap;margin-top:1.25rem}.cm-preview-shell{overflow:hidden;min-height:410px;position:relative}.cm-preview-tabs{display:flex;gap:.5rem;padding:.85rem;border-bottom:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.035)}.cm-preview-tab{flex:1;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);color:rgba(255,255,255,.72);border-radius:12px;padding:.8rem .75rem;font:800 .68rem/1 'Space Grotesk';letter-spacing:.16em;text-transform:uppercase;transition:.22s}.cm-preview-tab.active{background:linear-gradient(135deg,#c8a96e,#f1d38a);color:#000;border-color:#c8a96e}.cm-preview-frame{width:100%;height:380px;border:0;display:block;background:#fff}.cm-preview-expand{position:absolute;right:1rem;bottom:1rem;z-index:3;border:1px solid rgba(200,169,110,.55);background:rgba(0,0,0,.76);color:#c8a96e;border-radius:999px;padding:.72rem 1rem;font:800 .66rem/1 'Space Grotesk';letter-spacing:.16em;text-transform:uppercase}.cm-preview-expand:hover{background:#c8a96e;color:#000}.cm-focus-view{position:fixed;inset:0;z-index:9999;background:#02040a;display:flex;flex-direction:column;padding:1rem}.cm-focus-top{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.75rem 1rem;border:1px solid rgba(255,255,255,.09);border-radius:14px;background:rgba(255,255,255,.045);margin-bottom:.8rem}.cm-focus-title{font:800 .8rem/1 'Space Grotesk';letter-spacing:.2em;text-transform:uppercase;color:#c8a96e}.cm-focus-actions{display:flex;gap:.7rem;align-items:center}.cm-focus-actions button,.cm-focus-actions a{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);color:#fff;border-radius:999px;padding:.7rem 1rem;text-decoration:none;font:800 .66rem/1 'Space Grotesk';letter-spacing:.15em;text-transform:uppercase;cursor:pointer}.cm-focus-actions button:hover,.cm-focus-actions a:hover{background:#c8a96e;color:#000}.cm-focus-frame{flex:1;width:100%;border:0;border-radius:14px;background:#fff}.cm-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-top:1.2rem}.cm-step-card{padding:1.15rem}.cm-step-num{font:800 1.45rem/1 'Space Grotesk';color:#38bdf8;margin-bottom:.7rem}.cm-step-card h4{margin:0 0 .5rem;color:#fff}.cm-step-card p{margin:0;color:rgba(255,255,255,.58);line-height:1.55;font-size:.88rem}.cm-awards-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem}.cm-award-card{padding:1.1rem}.cm-award-title{font:800 .92rem/1 'Space Grotesk';letter-spacing:.14em;color:#c8a96e;margin-bottom:.8rem}.cm-award-row{display:flex;justify-content:space-between;gap:1rem;padding:.55rem 0;border-top:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.74);font-size:.86rem;line-height:1.35}.cm-award-row strong{color:#fff}.cm-special-awards{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-top:1.25rem}.cm-special{padding:1rem;border:1px solid rgba(200,169,110,.25);background:rgba(200,169,110,.08);border-radius:16px}.cm-special strong{display:block;color:#fff;margin-bottom:.35rem}.cm-special span{color:rgba(255,255,255,.62);font-size:.88rem}.cm-contact-strip{margin-top:1.2rem;padding:1rem;border:1px solid rgba(120,193,255,.16);border-radius:14px;background:rgba(120,193,255,.06);color:rgba(255,255,255,.68);line-height:1.6}.cm-contact-strip strong{color:#c8a96e}

/* merged buddy-inspired navigation + texture pass */
.cm-page{
  position:relative;
  background:
    radial-gradient(circle at 18% 14%,rgba(61,139,255,.13),transparent 30%),
    radial-gradient(circle at 72% 30%,rgba(56,189,248,.18),transparent 32%),
    radial-gradient(circle at 82% 76%,rgba(200,169,110,.10),transparent 30%),
    linear-gradient(135deg,#02040a 0%,#031326 40%,#02030a 100%);
}
.cm-page::before{
  content:"";position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.46;
  background:
    linear-gradient(180deg,transparent 0%,rgba(56,189,248,.10) var(--scroll-progress,0%),transparent min(100%,calc(var(--scroll-progress,0%) + 12%))),
    radial-gradient(circle at var(--mx,50%) var(--my,50%),rgba(120,193,255,.12),transparent 18%),
    radial-gradient(circle at 12% 22%,rgba(0,80,255,.10),transparent 34%),
    radial-gradient(circle at 88% 62%,rgba(56,189,248,.14),transparent 38%),
    linear-gradient(115deg,rgba(0,0,0,.12),rgba(4,18,36,.72));
}
.cm-page::after{
  content:"";position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.075;
  background-image:linear-gradient(rgba(120,193,255,.26) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,.18) 1px,transparent 1px),linear-gradient(45deg,rgba(200,169,110,.14) 1px,transparent 1px);
  background-size:76px 76px,76px 76px,152px 152px;
  mask-image:radial-gradient(circle at 50% 35%,black 0%,transparent 82%);
}
.cm-page > *{position:relative;z-index:1}.cm-nav{z-index:80}.cm-focus-view{z-index:9999}
.cm-nav.cm-nav-pill{
  top:18px;left:50%;right:auto;transform:translateX(-50%);width:min(1280px,calc(100% - 28px));
  padding:.76rem .9rem .76rem 1.15rem;border:1px solid rgba(255,255,255,.12);border-radius:999px;
  background:linear-gradient(110deg,rgba(2,4,12,.78),rgba(5,23,46,.68),rgba(3,7,18,.76));
  box-shadow:0 24px 80px rgba(0,0,0,.42),0 0 55px rgba(29,78,216,.10);
}
.cm-brand-btn{border:0;background:transparent;cursor:pointer;text-align:left}.cm-brand-btn:hover{color:#fff}.cm-brand-btn span{filter:drop-shadow(0 0 14px rgba(56,189,248,.65))}
.cm-links{gap:.35rem}.cm-links button:not(.cm-back){position:relative;border:0;background:transparent;border-radius:999px;padding:.78rem .95rem;overflow:hidden}.cm-links button:not(.cm-back)::before{content:"";position:absolute;inset:0;border-radius:inherit;background:linear-gradient(135deg,rgba(255,255,255,.10),rgba(255,255,255,.025));opacity:0;transition:.24s}.cm-links button:not(.cm-back)::after{content:"";position:absolute;left:18%;right:18%;bottom:.45rem;height:1px;background:linear-gradient(90deg,transparent,#78c1ff,#38bdf8,#c8a96e,transparent);transform:scaleX(0);transition:.28s}.cm-links button:not(.cm-back):hover::before,.cm-links button.active:not(.cm-back)::before{opacity:1}.cm-links button:not(.cm-back):hover::after,.cm-links button.active:not(.cm-back)::after{transform:scaleX(1)}.cm-links button.active:not(.cm-back){color:#fff;text-shadow:0 0 18px rgba(120,193,255,.34)}.cm-links button.cm-keep{color:#c8a96e}.cm-back{border-radius:999px!important}
.cm-hero{padding-top:10rem}.cm-hero::before{background:radial-gradient(circle at 28% 18%,rgba(29,78,216,.34),transparent 34%),radial-gradient(circle at 82% 82%,rgba(200,169,110,.20),transparent 30%),linear-gradient(180deg,#02030a 0%,#021124 52%,#000 100%)}
.cm-section{background:linear-gradient(180deg,rgba(1,3,10,.98),rgba(2,10,24,.98));overflow:hidden}.cm-section.alt{background:linear-gradient(180deg,rgba(3,14,30,.98),rgba(1,4,13,.98))}.cm-section::before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 10% 15%,rgba(61,139,255,.055),transparent 28%),radial-gradient(circle at 86% 36%,rgba(56,189,248,.075),transparent 32%);opacity:.9}.cm-inner{position:relative;z-index:2}
.cm-card,.cm-live-card,.cm-preview-shell,.cm-award-card,.cm-step-card,.cm-stat,.cm-timeline-card{background:linear-gradient(145deg,rgba(255,255,255,.09),rgba(255,255,255,.025));box-shadow:0 24px 75px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.05)}
.cm-committee-console{display:grid;grid-template-columns:minmax(210px,.32fr) 1fr;gap:1rem;margin-bottom:1.2rem}.cm-committee-nav{display:grid;gap:.55rem;padding:.8rem;border:1px solid rgba(255,255,255,.09);border-radius:22px;background:rgba(255,255,255,.045);backdrop-filter:blur(16px)}.cm-committee-nav button{border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.04);color:rgba(255,255,255,.70);border-radius:999px;padding:.85rem 1rem;font:900 .72rem/1 'Space Grotesk';letter-spacing:.18em;text-transform:uppercase;transition:.22s}.cm-committee-nav button:hover,.cm-committee-nav button.active{background:linear-gradient(135deg,#c8a96e,#f3d994);color:#07030c;border-color:#c8a96e;transform:translateX(4px)}.cm-committee-spotlight{position:relative;overflow:hidden;display:grid;grid-template-columns:auto 1fr;gap:1.3rem;align-items:start;border:1px solid rgba(56,189,248,.24);border-radius:24px;padding:1.4rem;background:radial-gradient(circle at 88% 20%,rgba(56,189,248,.17),transparent 38%),linear-gradient(145deg,rgba(255,255,255,.10),rgba(255,255,255,.03));box-shadow:0 28px 90px rgba(29,78,216,.16)}.cm-spotlight-code{font:900 clamp(2.9rem,7vw,6rem)/.8 'Space Grotesk';letter-spacing:-.11em;background:linear-gradient(100deg,#fff,#78c1ff,#38bdf8,#c8a96e);-webkit-background-clip:text;background-clip:text;color:transparent;min-width:180px}.cm-committee-spotlight h3{margin:.85rem 0 .75rem;color:#fff;font-size:clamp(1.2rem,2vw,1.65rem)}.cm-committee-spotlight p{color:rgba(255,255,255,.66);line-height:1.65;margin:.55rem 0}.cm-card{cursor:pointer}.cm-card.active{border-color:rgba(200,169,110,.42);box-shadow:0 28px 90px rgba(200,169,110,.10),0 0 0 1px rgba(200,169,110,.12) inset}.cm-card.active::before{transform:scaleX(1)}.cm-card-grid.enhanced{margin-top:1rem}
.cm-hamburger{display:none;flex-direction:column;gap:6px;background:none;border:none;cursor:pointer;padding:.5rem;margin-left:auto;transition:.3s}.cm-hamburger span{width:24px;height:2px;background:rgba(255,255,255,.72);border-radius:2px;transition:.3s;transform-origin:center}.cm-hamburger-active span:nth-child(1){transform:rotate(45deg) translate(10px,10px)}.cm-hamburger-active span:nth-child(2){opacity:0}.cm-hamburger-active span:nth-child(3){transform:rotate(-45deg) translate(7px,-7px)}.cm-nav-pill.cm-nav-open{flex-direction:column;align-items:stretch;height:auto}.cm-links-open{display:flex!important;flex-direction:column;width:100%;gap:.75rem;margin-top:1rem;padding-top:1rem;border-top:1px solid rgba(255,255,255,.1)}
@media(max-width:980px){.cm-nav.cm-nav-pill{border-radius:26px;align-items:flex-start;gap:.7rem}.cm-links{overflow-x:auto;justify-content:flex-end;max-width:100%;padding-bottom:.2rem}.cm-links button:not(.cm-back){padding:.72rem .75rem}.cm-committee-console{grid-template-columns:1fr}.cm-committee-nav{grid-template-columns:repeat(4,1fr)}.cm-committee-spotlight{grid-template-columns:1fr}.cm-spotlight-code{min-width:0}.cm-hero{padding-top:11rem}}
@media(max-width:560px){.cm-nav.cm-nav-pill{position:absolute;border-radius:22px}.cm-hamburger{display:flex}.cm-links{display:none}.cm-links-open{display:flex}.cm-links button:not(.cm-back),.cm-back{font-size:.58rem!important;padding:.65rem .55rem!important}.cm-brand-btn{width:100%;margin-bottom:.35rem}.cm-committee-nav{grid-template-columns:repeat(2,1fr)}}

@media(max-width:880px){.cm-links a:not(.cm-keep){display:none}.cm-stats,.cm-card-grid,.cm-perks,.cm-schedule,.cm-reg-layout,.cm-live-grid,.cm-steps,.cm-awards-grid,.cm-special-awards{grid-template-columns:1fr}.cm-nav{padding:.85rem 1rem}.cm-brand{letter-spacing:.18em}.cm-title{font-size:clamp(4.1rem,21vw,7rem)}.cm-orb{width:82vw;height:82vw}.cm-particles{display:none!important;opacity:0}.cm-mouse-aura{display:none!important}.cm-kicker{letter-spacing:.22em}.cm-kicker::before,.cm-kicker::after{width:20px}}.cm-section{padding-left:1rem;padding-right:1rem}.cm-fee{flex-direction:column}.cm-particles{display:none}.cm-preview-frame{height:340px}.cm-action-row .cm-btn{width:100%}}@media(prefers-reduced-motion:reduce){.cm-particles{display:none}.cm-mouse-aura{display:none!important}.cm-hero::before{transition:none}}
.cm-btn,.cm-preview-tab,.cm-preview-expand,.cm-card,.cm-live-card,.cm-award-card,.cm-step-card{position:relative;overflow:hidden}
.cm-btn,.cm-card,.cm-live-card,.cm-award-card,.cm-step-card,.cm-preview-shell{transition:transform .25s ease,border-color .25s ease,box-shadow .25s ease,background .25s ease,color .25s ease}
.cm-btn::after,.cm-card::after,.cm-live-card::after,.cm-preview-shell::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,transparent 0 36%,rgba(255,255,255,.13) 48%,transparent 62% 100%);transform:translateX(-125%);transition:transform .55s ease}
.cm-btn:hover::after,.cm-card:hover::after,.cm-live-card:hover::after,.cm-preview-shell:hover::after{transform:translateX(125%)}
.cm-btn:hover{transform:translateY(-4px) scale(1.015);border-color:rgba(120,193,255,.34);box-shadow:0 18px 50px rgba(120,193,255,.14),0 18px 45px rgba(56,189,248,.12)}
.cm-btn.primary:hover{box-shadow:0 20px 58px rgba(200,169,110,.24)}
.cm-card:hover,.cm-live-card:hover,.cm-award-card:hover,.cm-step-card:hover{transform:translateY(-7px);border-color:rgba(120,193,255,.22);box-shadow:0 30px 85px rgba(120,193,255,.10),0 26px 80px rgba(56,189,248,.14)}
.cm-contact-strip{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem 1.3rem;margin-top:1.2rem;padding:1.2rem 1.25rem;border:1px solid rgba(120,193,255,.16);border-radius:14px;background:rgba(120,193,255,.06);color:rgba(255,255,255,.72);line-height:1.55}
.cm-contact-item{display:flex;align-items:baseline;gap:.55rem;min-width:0}.cm-contact-item strong{color:#c8a96e;white-space:nowrap}.cm-contact-item span,.cm-contact-item a{color:rgba(255,255,255,.74);text-decoration:none}.cm-contact-item a:hover{color:#c8a96e}.cm-contact-dot{color:rgba(255,255,255,.34);margin:0 .2rem}.cm-contact-address{grid-column:1/-1}
@media(max-width:760px){.cm-contact-strip{grid-template-columns:1fr;gap:.8rem;padding:1rem}.cm-contact-item{display:grid;gap:.22rem}.cm-contact-item strong{white-space:normal}.cm-contact-address{grid-column:auto}}
/* final polish: smoother preview spacing, safer acronym type, richer hover affordance */
.cm-preview-shell{display:grid;grid-template-rows:auto minmax(360px,1fr) auto;min-height:0;overflow:hidden}
.cm-preview-frame{height:clamp(360px,46vh,455px);border:0;border-bottom:1px solid rgba(255,255,255,.08);display:block}
.cm-preview-footer{display:flex;align-items:center;justify-content:flex-start;padding:.85rem 1rem;background:linear-gradient(180deg,rgba(4,12,24,.98),rgba(2,8,18,.98));border-top:1px solid rgba(200,169,110,.20)}
.cm-preview-expand{position:relative;right:auto;bottom:auto;z-index:2;display:inline-flex;align-items:center;justify-content:center;min-height:42px;margin:0;border-radius:999px;box-shadow:0 14px 40px rgba(0,0,0,.24)}
.cm-preview-expand:hover{transform:translateY(-3px) scale(1.015);box-shadow:0 18px 48px rgba(200,169,110,.18),0 0 26px rgba(120,193,255,.12)}
.cm-spotlight-code{font-size:clamp(2.7rem,6.1vw,5.05rem)!important;line-height:1!important;letter-spacing:-.075em!important;min-width:clamp(132px,16vw,235px);padding:.15rem 0 .2rem;overflow:visible}
.cm-committee-spotlight{overflow:visible;align-items:center}
.cm-committee-nav button,.cm-preview-tab,.cm-focus-actions button,.cm-focus-actions a,.cm-footer-links button,.cm-footer-links a{transition:transform .22s ease,border-color .22s ease,box-shadow .22s ease,background .22s ease,color .22s ease}
.cm-committee-nav button:hover,.cm-preview-tab:hover,.cm-focus-actions button:hover,.cm-focus-actions a:hover,.cm-footer-links button:hover,.cm-footer-links a:hover{transform:translateY(-3px);box-shadow:0 14px 35px rgba(120,193,255,.10)}
.cm-preview-tab:hover{border-color:rgba(200,169,110,.38);color:#fff}
.cm-stat{transition:transform .24s ease,border-color .24s ease,box-shadow .24s ease}
.cm-stat:hover{transform:translateY(-5px);border-color:rgba(200,169,110,.32);box-shadow:0 26px 75px rgba(200,169,110,.10),0 22px 70px rgba(120,193,255,.08)}
.cm-page{cursor:auto}
.cm-live-grid{grid-template-columns:minmax(0,920px);justify-content:center}
.cm-live-card{min-height:100%}
.cm-preview-feature{background:linear-gradient(180deg,rgba(2,8,20,.98),rgba(3,16,34,.98))}
.cm-preview-stage{max-width:1180px;margin:0 auto}
.cm-preview-shell{width:100%;max-width:1180px;margin:0 auto}
.cm-preview-shell.cm-preview-matrix{min-height:clamp(560px,74vh,780px)}
.cm-preview-shell.cm-preview-matrix .cm-preview-frame{height:clamp(500px,68vh,720px)}
.cm-preview-shell.cm-preview-form{max-width:min(760px,100%);min-height:clamp(650px,82vh,880px)}
.cm-preview-shell.cm-preview-form .cm-preview-frame{height:clamp(620px,78vh,820px)}
.cm-preview-shell.cm-preview-form .cm-preview-footer{justify-content:center}
@media(max-width:880px){.cm-preview-shell{grid-template-rows:auto auto auto}.cm-preview-shell.cm-preview-matrix .cm-preview-frame{height:520px}.cm-preview-shell.cm-preview-form .cm-preview-frame{height:680px}.cm-spotlight-code{font-size:clamp(3.4rem,18vw,5.5rem)!important;min-width:0}}
@media(max-width:560px){.cm-preview-shell.cm-preview-matrix .cm-preview-frame{height:460px}.cm-preview-shell.cm-preview-form .cm-preview-frame{height:720px}}

/* final current-page polish: smoother hero + premium delegate experience */
.cm-hero::before{transition:none!important}
.cm-orb{animation:none!important;opacity:.62;box-shadow:0 0 42px rgba(29,78,216,.20),inset 0 0 38px rgba(200,169,110,.06)!important}
.cm-grid{opacity:.065}
.cm-experience-feature{
  background:
    radial-gradient(circle at 14% 20%,rgba(56,189,248,.10),transparent 30%),
    radial-gradient(circle at 86% 36%,rgba(200,169,110,.10),transparent 32%),
    linear-gradient(180deg,rgba(1,7,18,.98),rgba(2,13,28,.98));
}
.cm-experience-hero{
  display:grid;grid-template-columns:minmax(0,1.1fr) minmax(340px,.9fr);gap:1.2rem;align-items:center;
  margin:-.5rem 0 1.35rem;padding:1.35rem;border:1px solid rgba(120,193,255,.18);border-radius:24px;
  background:linear-gradient(135deg,rgba(255,255,255,.095),rgba(120,193,255,.055),rgba(2,8,18,.52));
  box-shadow:0 26px 90px rgba(0,0,0,.36),inset 0 1px 0 rgba(255,255,255,.06);
}
.cm-experience-kicker{color:#c8a96e;text-transform:uppercase;letter-spacing:.24em;font-size:.68rem;font-weight:900;margin-bottom:.55rem}
.cm-experience-hero h3{font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,4.2vw,3.45rem);line-height:.96;font-style:italic;font-weight:600;color:#f7f2ec;margin:0;max-width:760px}
.cm-experience-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:.7rem}
.cm-experience-metrics div{min-height:112px;display:grid;place-items:center;text-align:center;padding:.9rem;border:1px solid rgba(255,255,255,.10);border-radius:18px;background:rgba(255,255,255,.045)}
.cm-experience-metrics strong{display:block;color:#c8a96e;font-size:clamp(1.8rem,3vw,2.7rem);line-height:1}
.cm-experience-metrics span{display:block;margin-top:.45rem;color:rgba(255,255,255,.66);font-size:.64rem;font-weight:900;letter-spacing:.18em;text-transform:uppercase}
.cm-experience-feature .cm-perks{grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}
.cm-experience-feature .cm-perk{
  position:relative;overflow:hidden;text-align:left;min-height:246px;padding:1.25rem;border-radius:22px;
  border:1px solid rgba(120,193,255,.16);
  background:linear-gradient(145deg,rgba(255,255,255,.09),rgba(255,255,255,.025));
  box-shadow:0 22px 72px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.05);
}
.cm-experience-feature .cm-perk::before{content:"";position:absolute;inset:-35% -20% auto auto;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,rgba(56,189,248,.18),transparent 66%);pointer-events:none}
.cm-experience-feature .cm-perk::after{content:"";position:absolute;left:1.25rem;right:1.25rem;bottom:0;height:3px;background:linear-gradient(90deg,#1d4ed8,#38bdf8,#c8a96e);transform:scaleX(.34);transform-origin:left;transition:transform .25s ease}
.cm-experience-feature .cm-perk:hover::after{transform:scaleX(1)}
.cm-perk-num{position:absolute;right:1rem;top:1rem;color:rgba(255,255,255,.20);font:900 1.35rem/1 'Space Grotesk';letter-spacing:.02em}
.cm-experience-feature .cm-perk-ico{width:68px;height:68px;margin:0 0 1rem;box-shadow:0 0 30px rgba(120,193,255,.08);background:rgba(120,193,255,.07)}
.cm-experience-feature .cm-perk h3{font-size:1.08rem;margin:.35rem 0 .7rem;color:#fff}
.cm-experience-feature .cm-perk p{font-size:.91rem;color:rgba(255,255,255,.68)}
.cm-experience-feature .cm-perk:hover{transform:translateY(-8px);border-color:rgba(120,193,255,.34);box-shadow:0 30px 90px rgba(29,78,216,.14),0 24px 70px rgba(0,0,0,.40)}
@media(max-width:980px){.cm-experience-hero{grid-template-columns:1fr}.cm-experience-feature .cm-perks{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:640px){.cm-experience-metrics,.cm-experience-feature .cm-perks{grid-template-columns:1fr}.cm-experience-hero{padding:1rem}.cm-experience-feature .cm-perk{min-height:auto}}

/* current MUN 3D pass: CSS transform depth, low JS, mobile-safe */
.cm-title,.cm-spotlight-code{letter-spacing:0!important}
.cm-hero{
  min-height:clamp(720px,100svh,940px);
  text-align:left;
  padding:8.4rem clamp(1rem,4vw,3rem) 4.8rem;
  isolation:isolate;
}
.cm-hero-layout{
  position:relative;z-index:5;width:min(1280px,100%);display:grid;
  grid-template-columns:minmax(0,1fr) minmax(380px,.72fr);gap:clamp(2.2rem,5vw,5.8rem);
  align-items:center;perspective:1200px;padding-left:clamp(2.7rem,5vw,5.8rem);
}
.cm-hero-layout>*{min-width:0}
.cm-title{font-size:clamp(4.4rem,10vw,8.8rem)!important;line-height:.88}
.cm-hero-copy{position:relative;z-index:4;max-width:690px;text-align:left}.cm-hero-copy .cm-sub{margin-left:0;margin-right:0}
.cm-hero-badges{display:flex;flex-wrap:wrap;gap:.65rem;margin:-.55rem 0 1.35rem}
.cm-hero-badges span{
  display:inline-flex;align-items:center;min-height:34px;padding:.58rem .78rem;border-radius:999px;
  border:1px solid rgba(120,193,255,.18);background:linear-gradient(135deg,rgba(120,193,255,.10),rgba(255,255,255,.04));
  color:rgba(255,255,255,.78);font-size:.65rem;font-weight:900;text-transform:uppercase;letter-spacing:.14em;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.05);
}
.cm-hero-visual{position:relative;z-index:2;min-height:520px;display:grid;place-items:center;justify-self:end;width:min(500px,100%);perspective:1200px;contain:layout paint}
.cm-command-deck{
  position:relative;width:min(100%,470px);aspect-ratio:1;transform-style:preserve-3d;
  transform:rotateX(58deg) rotateZ(-24deg);will-change:transform;animation:cmDeckFloat 8s ease-in-out infinite;
}
.cm-command-deck::before{
  content:"";position:absolute;inset:8%;border-radius:34px;border:1px solid rgba(120,193,255,.22);
  background:
    linear-gradient(rgba(120,193,255,.12) 1px,transparent 1px),
    linear-gradient(90deg,rgba(120,193,255,.12) 1px,transparent 1px),
    linear-gradient(135deg,rgba(255,255,255,.08),rgba(56,189,248,.045),rgba(0,0,0,.14));
  background-size:34px 34px,34px 34px,100% 100%;
  box-shadow:0 35px 90px rgba(0,0,0,.42),0 0 70px rgba(56,189,248,.13),inset 0 1px 0 rgba(255,255,255,.10);
  transform:translateZ(-36px);
}
.cm-command-deck::after{
  content:"";position:absolute;left:16%;right:16%;bottom:1%;height:28px;border-radius:50%;
  background:rgba(0,0,0,.45);filter:blur(16px);transform:translateZ(-90px) rotateX(8deg);
}
.cm-deck-ring{
  position:absolute;inset:13%;border-radius:50%;border:1px solid rgba(120,193,255,.30);
  box-shadow:0 0 34px rgba(56,189,248,.12),inset 0 0 26px rgba(120,193,255,.06);
  transform:translateZ(6px);pointer-events:none;
}
.cm-deck-ring.ring-two{inset:27%;border-color:rgba(200,169,110,.30);transform:translateZ(22px) rotate(24deg)}
.cm-deck-core{
  position:absolute;left:50%;top:50%;width:142px;height:142px;display:grid;place-items:center;text-align:center;
  border-radius:50%;border:1px solid rgba(255,255,255,.22);
  background:radial-gradient(circle at 35% 22%,rgba(255,255,255,.24),rgba(120,193,255,.10) 38%,rgba(2,8,18,.88));
  box-shadow:0 22px 60px rgba(0,0,0,.38),0 0 48px rgba(120,193,255,.18),inset 0 1px 0 rgba(255,255,255,.18);
  transform:translate(-50%,-50%) translateZ(86px) rotateZ(24deg) rotateX(-58deg);
}
.cm-deck-core span{display:block;color:#78c1ff;font-size:1rem;font-weight:900;letter-spacing:.18em}.cm-deck-core strong{display:block;margin-top:.2rem;color:#f7f2ec;font-size:1.65rem;letter-spacing:.08em}
.cm-deck-panel,.cm-deck-chip{
  position:absolute;display:grid;align-content:center;gap:.2rem;border:1px solid rgba(255,255,255,.16);
  background:linear-gradient(145deg,rgba(9,24,46,.92),rgba(6,12,24,.86));box-shadow:0 20px 52px rgba(0,0,0,.32),inset 0 1px 0 rgba(255,255,255,.10);
  transform-style:preserve-3d;backface-visibility:hidden;
}
.cm-deck-panel{
  width:142px;min-height:96px;padding:1rem;border-radius:18px;
  transform:translateZ(76px) rotateZ(24deg) rotateX(-58deg);
}
.cm-deck-panel small{color:#c8a96e;font-size:.62rem;font-weight:900;text-transform:uppercase;letter-spacing:.14em}
.cm-deck-panel strong{color:#fff;font-size:1.2rem;line-height:1}.cm-deck-panel span{color:rgba(255,255,255,.64);font-size:.72rem;font-weight:800}
.panel-form{left:7%;top:19%}.panel-matrix{right:4%;top:35%;border-color:rgba(120,193,255,.34)}.panel-awards{left:30%;bottom:3%;border-color:rgba(200,169,110,.30)}
.cm-deck-chip{
  min-width:72px;min-height:34px;padding:.5rem .72rem;border-radius:999px;color:rgba(255,255,255,.78);
  font-size:.63rem;font-weight:900;text-transform:uppercase;letter-spacing:.13em;text-align:center;
  transform:translateZ(52px) rotateZ(24deg) rotateX(-58deg);
}
.chip-one{left:2%;bottom:29%}.chip-two{right:7%;bottom:17%}.chip-three{right:25%;top:8%}.chip-four{left:36%;top:2%}
@keyframes cmDeckFloat{0%,100%{transform:rotateX(58deg) rotateZ(-24deg) translate3d(0,0,0)}50%{transform:rotateX(58deg) rotateZ(-24deg) translate3d(0,-12px,18px)}}
.cm-reg-feature .cm-live-card,.cm-preview-feature .cm-preview-shell,.cm-committee-spotlight,.cm-card-grid.enhanced .cm-card,.cm-experience-hero,.cm-experience-feature .cm-perk{
  transform-style:preserve-3d;backface-visibility:hidden;
}
.cm-reg-feature .cm-live-card{
  position:relative;overflow:hidden;border-color:rgba(120,193,255,.22);
  background:
    radial-gradient(circle at var(--scan-x,50%) var(--scan-y,34%),rgba(125,236,255,.18),transparent 24%),
    linear-gradient(135deg,rgba(120,193,255,.10),transparent 34%),
    linear-gradient(145deg,rgba(255,255,255,.10),rgba(255,255,255,.025));
}
.cm-reg-feature .cm-live-card::before{
  content:"";position:absolute;left:1.1rem;right:1.1rem;top:1.1rem;height:5px;border-radius:999px;
  background:linear-gradient(90deg,#1d4ed8,#38bdf8,#c8a96e);box-shadow:0 0 28px rgba(56,189,248,.20);
}
.cm-reg-feature .cm-steps{perspective:900px}.cm-step-card:nth-child(1){transform:translateZ(18px)}.cm-step-card:nth-child(2){transform:translateZ(34px)}.cm-step-card:nth-child(3){transform:translateZ(18px)}
.cm-preview-feature .cm-preview-shell{
  border-color:rgba(120,193,255,.20);box-shadow:0 34px 105px rgba(0,0,0,.42),0 0 70px rgba(56,189,248,.10),inset 0 1px 0 rgba(255,255,255,.07);
}
.cm-preview-feature .cm-preview-stage{perspective:1100px}.cm-preview-feature .cm-preview-shell:hover{transform:translateY(-6px) rotateX(.8deg)}
.cm-committee-console{perspective:1000px}.cm-committee-spotlight{transform:rotateX(.01deg)}
.cm-card-grid.enhanced .cm-card:hover{transform:translateY(-8px) translateZ(22px);border-color:rgba(120,193,255,.34)}
.cm-award-card:hover,.cm-timeline-card:hover{transform:translateY(-5px);border-color:rgba(120,193,255,.24)}
.cm-about-stage{
  display:grid;grid-template-columns:minmax(280px,.72fr) minmax(0,1fr);gap:1.1rem;align-items:stretch;margin-top:3rem;
  perspective:1100px;
}
.cm-about-stage .cm-stats{grid-template-columns:repeat(2,minmax(0,1fr));margin-top:0}
.cm-about-radar{
  position:relative;min-height:330px;border:1px solid rgba(120,193,255,.18);border-radius:24px;overflow:hidden;isolation:isolate;
  background:
    linear-gradient(115deg,rgba(120,193,255,.10),transparent 28%,rgba(200,169,110,.08) 72%,transparent),
    linear-gradient(145deg,rgba(255,255,255,.08),rgba(255,255,255,.025));
  box-shadow:0 28px 90px rgba(0,0,0,.36),inset 0 1px 0 rgba(255,255,255,.06);
  transform-style:preserve-3d;
}
.cm-about-radar::before{
  content:"";position:absolute;inset:14% 9%;border-radius:24px;
  background:
    linear-gradient(120deg,transparent 0 18%,rgba(56,189,248,.38) 19%,transparent 20% 46%,rgba(200,169,110,.26) 47%,transparent 49% 100%),
    linear-gradient(rgba(120,193,255,.10) 1px,transparent 1px),
    linear-gradient(90deg,rgba(120,193,255,.10) 1px,transparent 1px),
    linear-gradient(135deg,rgba(255,255,255,.06),rgba(56,189,248,.035),rgba(0,0,0,.16));
  background-size:100% 100%,34px 34px,34px 34px,100% 100%;
  transform:perspective(900px) rotateX(58deg) rotateZ(-13deg);transform-origin:center;
  border:1px solid rgba(120,193,255,.16);box-shadow:0 22px 60px rgba(0,0,0,.26),0 0 42px rgba(56,189,248,.08);
}
.cm-radar-ring{display:none}
.cm-radar-core{
  position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(-3deg);
  width:148px;height:82px;display:grid;place-items:center;border-radius:18px;
  border:1px solid rgba(120,193,255,.24);
  background:linear-gradient(145deg,rgba(3,18,38,.94),rgba(4,10,22,.84));
  color:#78c1ff;font-weight:900;letter-spacing:.14em;
  box-shadow:0 22px 52px rgba(0,0,0,.32),0 0 36px rgba(56,189,248,.14),inset 0 1px 0 rgba(255,255,255,.08);
}
.cm-radar-core::before{content:"EDITION";display:block;color:#c8a96e;font-size:.54rem;letter-spacing:.2em;margin-bottom:-.6rem}
.cm-radar-node{
  position:absolute;display:inline-flex;align-items:center;justify-content:center;min-height:40px;min-width:112px;padding:.58rem .8rem;
  border:1px solid rgba(255,255,255,.13);border-radius:14px;
  background:linear-gradient(145deg,rgba(5,20,38,.90),rgba(2,8,18,.78));
  color:rgba(255,255,255,.78);font-size:.62rem;font-weight:900;letter-spacing:.13em;text-transform:uppercase;
  box-shadow:0 16px 42px rgba(0,0,0,.26),inset 0 1px 0 rgba(255,255,255,.06);
}
.cm-radar-node::before{content:"";width:7px;height:7px;border-radius:50%;margin-right:.48rem;background:#38bdf8;box-shadow:0 0 16px rgba(56,189,248,.75)}
.node-a{left:7%;top:18%}.node-b{right:7%;top:16%}.node-c{right:8%;bottom:17%}.node-d{left:7%;bottom:18%}
.cm-access-console{
  display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:.65rem;align-items:center;margin:1.35rem 0 1.45rem;padding:1rem;
  border:1px solid rgba(120,193,255,.16);border-radius:18px;background:rgba(120,193,255,.055);
}
.cm-access-node{min-height:104px;padding:.9rem;border:1px solid rgba(255,255,255,.10);border-radius:16px;background:linear-gradient(145deg,rgba(255,255,255,.08),rgba(255,255,255,.025));box-shadow:inset 0 1px 0 rgba(255,255,255,.05)}
.cm-access-node span{display:block;color:#78c1ff;font-size:.66rem;font-weight:900;letter-spacing:.18em}.cm-access-node strong{display:block;color:#fff;font-size:1.05rem;margin:.32rem 0}.cm-access-node small{color:rgba(255,255,255,.58);font-weight:800}
.cm-access-line{
  position:relative;width:42px;height:10px;border-radius:999px;overflow:hidden;
  background:linear-gradient(90deg,rgba(56,189,248,.14),rgba(200,169,110,.12));
  box-shadow:0 0 18px rgba(56,189,248,.16);isolation:isolate;
}
.cm-access-line::before{
  content:"";position:absolute;left:0;right:0;top:50%;height:2px;border-radius:999px;
  background:linear-gradient(90deg,transparent,rgba(56,189,248,.95),rgba(200,169,110,.85),transparent);
  transform:translateY(-50%) scaleX(.42);transform-origin:left;
  animation:cmConnectorCharge 1.65s ease-in-out infinite;
}
.cm-preview-dock,.cm-committee-holo,.cm-flow-map{
  display:grid;gap:.75rem;margin:-1rem auto 1.35rem;max-width:960px;
}
.cm-preview-dock{grid-template-columns:repeat(3,1fr)}
.cm-preview-dock span,.cm-flow-map span,.cm-committee-holo div{
  min-height:54px;display:grid;place-items:center;text-align:center;border:1px solid rgba(120,193,255,.16);border-radius:16px;
  background:linear-gradient(145deg,rgba(255,255,255,.075),rgba(255,255,255,.025));color:rgba(255,255,255,.72);
  font-size:.66rem;font-weight:900;letter-spacing:.16em;text-transform:uppercase;box-shadow:0 18px 54px rgba(0,0,0,.22),inset 0 1px 0 rgba(255,255,255,.05);
}
.cm-committee-holo{grid-template-columns:repeat(3,1fr);perspective:1000px}
.cm-committee-holo div{min-height:92px;transform:rotateX(6deg)}
.cm-committee-holo strong{display:block;color:#c8a96e;font-size:1.15rem;line-height:1}.cm-committee-holo span{display:block;margin-top:.35rem;color:rgba(255,255,255,.60)}
.cm-awards-podium{
  display:grid;grid-template-columns:1fr 1.35fr 1fr;gap:.8rem;align-items:end;margin:-.8rem auto 1.4rem;max-width:940px;perspective:1000px;
}
.cm-awards-podium>div{display:grid;place-items:center;text-align:center;border:1px solid rgba(200,169,110,.24);background:linear-gradient(145deg,rgba(200,169,110,.12),rgba(255,255,255,.03));box-shadow:0 22px 70px rgba(0,0,0,.30),inset 0 1px 0 rgba(255,255,255,.06)}
.podium-main{min-height:124px;border-radius:22px;transform:translateZ(30px)}.podium-side{min-height:92px;border-radius:18px;transform:translateY(18px)}
.cm-awards-podium span{color:rgba(255,255,255,.58);font-size:.65rem;font-weight:900;letter-spacing:.16em;text-transform:uppercase}.cm-awards-podium strong{color:#f0ead6;font-size:1.1rem;margin-top:.25rem}
.cm-flow-map{grid-template-columns:1fr 1.2fr 1fr;position:relative}
.cm-flow-map::before{content:"";position:absolute;left:12%;right:12%;top:50%;height:1px;background:linear-gradient(90deg,transparent,#38bdf8,#c8a96e,transparent);z-index:-1}
.cm-scroll-rail{
  --scroll:var(--scroll-progress,0%);
  position:fixed;left:clamp(.35rem,.9vw,.85rem);top:50%;z-index:70;transform:translateY(-50%);
  display:grid;gap:.46rem;padding:.58rem;border:1px solid rgba(120,193,255,.18);border-radius:999px;
  background:linear-gradient(180deg,rgba(2,8,18,.82),rgba(2,18,36,.58));backdrop-filter:blur(16px);
  box-shadow:0 22px 70px rgba(0,0,0,.36),inset 0 1px 0 rgba(255,255,255,.06);
}
.cm-scroll-rail button{
  width:34px;height:34px;border-radius:50%;border:1px solid rgba(255,255,255,.11);
  background:rgba(255,255,255,.04);color:rgba(255,255,255,.58);font:900 .56rem/1 'Space Grotesk';letter-spacing:.08em;
  cursor:pointer;transition:transform .2s ease,border-color .2s ease,color .2s ease,background .2s ease,box-shadow .2s ease;
}
.cm-scroll-rail button:hover,.cm-scroll-rail button.active{color:#020711;background:#c8a96e;border-color:#c8a96e;transform:scale(1.08);box-shadow:0 0 24px rgba(200,169,110,.22)}
.cm-scroll-meter{width:4px;height:92px;justify-self:center;border-radius:999px;background:rgba(255,255,255,.09);overflow:hidden;margin:.15rem 0}
.cm-scroll-meter span{display:block;width:100%;height:var(--scroll);border-radius:inherit;background:linear-gradient(180deg,#38bdf8,#c8a96e);box-shadow:0 0 16px rgba(56,189,248,.40)}
body.cm-cinematic-scroll .cm-scroll-rail{box-shadow:0 28px 90px rgba(56,189,248,.22),inset 0 1px 0 rgba(255,255,255,.10);border-color:rgba(120,193,255,.34)}
body.cm-cinematic-scroll .cm-scroll-meter span{box-shadow:0 0 26px rgba(56,189,248,.80),0 0 16px rgba(200,169,110,.35)}
body.cm-cinematic-scroll .cm-page::before{opacity:.66}
body.cm-cinematic-scroll .cm-signal-strip{border-color:rgba(120,193,255,.34);box-shadow:0 0 80px rgba(56,189,248,.12) inset}
.cm-signal-strip{
  position:relative;overflow:hidden;border-block:1px solid rgba(120,193,255,.16);background:linear-gradient(90deg,rgba(2,8,18,.98),rgba(4,20,42,.94),rgba(2,8,18,.98));
  box-shadow:0 0 60px rgba(56,189,248,.08) inset;
}
.cm-signal-strip::before,.cm-signal-strip::after{content:"";position:absolute;top:0;bottom:0;width:120px;z-index:2;pointer-events:none}
.cm-signal-strip::before{left:0;background:linear-gradient(90deg,#020711,transparent)}.cm-signal-strip::after{right:0;background:linear-gradient(270deg,#020711,transparent)}
.cm-signal-track{display:flex;width:max-content;gap:1.2rem;padding:.82rem 0;animation:cmSignalMove 28s linear infinite}
.cm-signal-track span{display:inline-flex;align-items:center;gap:.55rem;white-space:nowrap;color:rgba(255,255,255,.72);font-size:.68rem;font-weight:900;letter-spacing:.18em;text-transform:uppercase}
.cm-signal-track span::before{content:"";width:7px;height:7px;border-radius:50%;background:#38bdf8;box-shadow:0 0 14px rgba(56,189,248,.75)}
@keyframes cmSignalMove{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.cm-section[data-section]{isolation:isolate}
.cm-section[data-section]::after{
  content:attr(data-section);position:absolute;right:clamp(.6rem,4vw,3rem);top:clamp(1.2rem,3vw,2.8rem);z-index:0;
  font:900 clamp(4rem,13vw,12rem)/.8 'Space Grotesk';letter-spacing:-.06em;color:transparent;
  -webkit-text-stroke:1px rgba(120,193,255,.10);text-shadow:0 0 55px rgba(56,189,248,.08);pointer-events:none;
}
.cm-section-head{position:relative}
.cm-section-head::after{
  content:"";display:block;width:min(520px,70vw);height:1px;margin:1.4rem auto 0;
  background:linear-gradient(90deg,transparent,rgba(120,193,255,.55),rgba(200,169,110,.50),transparent);
  box-shadow:0 0 18px rgba(56,189,248,.16);
}
.cm-about-stage,.cm-live-card,.cm-preview-stage,.cm-committee-console,.cm-experience-hero,.cm-awards-grid,.cm-schedule{
  position:relative;
}
.cm-about-stage::after,.cm-live-card::after,.cm-preview-stage::after,.cm-committee-console::after,.cm-experience-hero::after,.cm-awards-grid::after,.cm-schedule::after{
  content:"";position:absolute;left:4%;right:4%;bottom:-18px;height:34px;border-radius:50%;
  background:radial-gradient(ellipse at center,rgba(56,189,248,.16),transparent 65%);filter:blur(10px);z-index:-1;pointer-events:none;
}
.cm-about-radar,.cm-live-card,.cm-preview-shell,.cm-committee-spotlight,.cm-experience-hero,.cm-award-card,.cm-timeline-card{
  outline:1px solid rgba(120,193,255,.04);
}
.cm-about-radar:hover,.cm-live-card:hover,.cm-preview-shell:hover,.cm-committee-spotlight:hover,.cm-experience-hero:hover,.cm-award-card:hover,.cm-timeline-card:hover{
  outline-color:rgba(120,193,255,.18);
}
.cm-radar-ring.ring-a{animation:cmPulseRing 5.5s ease-in-out infinite}.cm-radar-ring.ring-b{animation:cmPulseRing 5.5s ease-in-out infinite reverse}
@keyframes cmPulseRing{0%,100%{opacity:.52;transform:translate(-50%,-50%) scale(1)}50%{opacity:.9;transform:translate(-50%,-50%) scale(1.035)}}
.cm-access-console{position:relative;overflow:hidden}
.cm-access-console::before{content:none!important}
.cm-access-node{position:relative;z-index:1}
.cm-preview-dock span,.cm-committee-holo div,.cm-flow-map span{position:relative;overflow:hidden}
.cm-preview-dock span::after,.cm-committee-holo div::after,.cm-flow-map span::after{
  content:"";position:absolute;inset:auto 12% 0;height:2px;background:linear-gradient(90deg,#1d4ed8,#38bdf8,#c8a96e);transform:scaleX(.34);transition:transform .24s ease;transform-origin:left;
}
.cm-preview-dock span:hover::after,.cm-committee-holo div:hover::after,.cm-flow-map span:hover::after{transform:scaleX(1)}
.cm-card-grid.enhanced .cm-card{min-height:218px;display:flex;flex-direction:column;justify-content:space-between}
.cm-card-grid.enhanced .cm-card::after{
  content:"";position:absolute;right:-42px;bottom:-42px;width:132px;height:132px;border-radius:50%;
  background:radial-gradient(circle,rgba(56,189,248,.14),transparent 66%);pointer-events:none;
}
.cm-special-awards .cm-special{position:relative;overflow:hidden}.cm-special-awards .cm-special::after{content:"";position:absolute;left:0;right:0;bottom:0;height:2px;background:linear-gradient(90deg,#1d4ed8,#38bdf8,#c8a96e)}

/* next-level motion layer: scroll-driven control-room energy without heavy canvas/WebGL */
.cm-page::selection{background:#38bdf8;color:#020711}
.cm-page-aurora{
  position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.55;mix-blend-mode:screen;
  background:
    conic-gradient(from calc(var(--scroll-progress,0%) * 3.6) at 78% 24%,transparent 0 18%,rgba(56,189,248,.16) 22%,transparent 30% 58%,rgba(200,169,110,.10) 64%,transparent 72%),
    radial-gradient(circle at 18% calc(18% + var(--scroll-progress,0%) * .45),rgba(29,78,216,.20),transparent 26%),
    radial-gradient(circle at 82% calc(86% - var(--scroll-progress,0%) * .38),rgba(56,189,248,.16),transparent 26%);
  transform:translateZ(0);will-change:background;
}
.cm-hero::after{
  content:"";position:absolute;inset:0;z-index:3;pointer-events:none;opacity:.16;
  background:repeating-linear-gradient(180deg,rgba(120,193,255,.18) 0 1px,transparent 1px 9px);
  mask-image:linear-gradient(180deg,transparent 0%,black 28%,black 70%,transparent 100%);
  animation:cmScanline 8s linear infinite;
}
@keyframes cmScanline{from{background-position:0 0}to{background-position:0 180px}}
.cm-orb{animation:cmOrbSpin 18s linear infinite!important;transform-style:preserve-3d;will-change:transform;opacity:.72!important}
.cm-orb::before{animation:cmOrbRingA 11s linear infinite}.cm-orb::after{animation:cmOrbRingB 15s linear infinite reverse}
@keyframes cmOrbSpin{from{transform:translate(-50%,-50%) rotateX(62deg) rotateY(0deg) rotateZ(0deg)}to{transform:translate(-50%,-50%) rotateX(62deg) rotateY(360deg) rotateZ(360deg)}}
@keyframes cmOrbRingA{from{transform:rotate(62deg)}to{transform:rotate(422deg)}}@keyframes cmOrbRingB{from{transform:rotate(-28deg)}to{transform:rotate(-388deg)}}
.cm-command-deck::before{animation:cmDeckGridSpin 22s linear infinite;will-change:transform}
.cm-deck-ring.ring-one{animation:cmDeckRingSpin 13s linear infinite}.cm-deck-ring.ring-two{animation:cmDeckRingSpin 19s linear infinite reverse}
.cm-deck-core::before{
  content:"";position:absolute;inset:-7px;border-radius:50%;border:1px dashed rgba(120,193,255,.42);
  animation:cmDeckCoreSpin 6s linear infinite;pointer-events:none;
}
@keyframes cmDeckGridSpin{from{transform:translateZ(-36px) rotateZ(0deg)}to{transform:translateZ(-36px) rotateZ(360deg)}}
@keyframes cmDeckRingSpin{from{transform:translateZ(16px) rotate(0deg)}to{transform:translateZ(16px) rotate(360deg)}}
@keyframes cmDeckCoreSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.cm-section{scroll-margin-top:92px}
.cm-section .cm-inner{transition:opacity .8s cubic-bezier(.22,.88,.24,1),transform .85s cubic-bezier(.16,.84,.2,1)}
.cm-section:not(.cm-in-view) .cm-inner{opacity:.6;transform:translateY(42px)}
.cm-section.cm-in-view .cm-inner{opacity:1;transform:none}
.cm-section.cm-in-view::before{
  opacity:1;background:
    radial-gradient(circle at 18% 16%,rgba(56,189,248,.16),transparent 30%),
    radial-gradient(circle at 86% 46%,rgba(200,169,110,.12),transparent 32%),
    linear-gradient(115deg,rgba(56,189,248,.05),transparent 45%,rgba(200,169,110,.04));
}
.cm-section.cm-in-view::after{animation:cmWatermarkGlow 2.6s ease both}
@keyframes cmWatermarkGlow{0%{opacity:.12;transform:translateY(18px) scale(.96)}45%{opacity:.72}100%{opacity:.44;transform:translateY(0) scale(1)}}
.cm-section-head .cm-label{position:relative;display:inline-block}
.cm-section.cm-in-view .cm-label{animation:cmKickerSnap .65s ease both}
@keyframes cmKickerSnap{0%{letter-spacing:.55em;opacity:.2;transform:translateY(12px)}100%{letter-spacing:.30em;opacity:1;transform:translateY(0)}}
.cm-section.cm-in-view .cm-h2 span,.cm-section.cm-in-view .cm-title span{filter:drop-shadow(0 0 20px rgba(56,189,248,.26));animation:cmTextCharge 2.2s ease both}
@keyframes cmTextCharge{0%{text-shadow:0 0 0 rgba(56,189,248,0)}50%{text-shadow:0 0 34px rgba(56,189,248,.22)}100%{text-shadow:0 0 16px rgba(56,189,248,.12)}}
.cm-about-stage,.cm-live-card,.cm-preview-shell,.cm-committee-console,.cm-experience-hero,.cm-awards-podium,.cm-flow-map,.cm-schedule{transition:transform .75s cubic-bezier(.2,.8,.2,1),box-shadow .55s ease}
.cm-section.cm-in-view .cm-about-stage,.cm-section.cm-in-view .cm-live-card,.cm-section.cm-in-view .cm-preview-shell,.cm-section.cm-in-view .cm-committee-console,.cm-section.cm-in-view .cm-experience-hero,.cm-section.cm-in-view .cm-awards-podium,.cm-section.cm-in-view .cm-flow-map,.cm-section.cm-in-view .cm-schedule{transform:translateZ(0) rotateX(0);box-shadow:0 0 0 1px rgba(120,193,255,.02)}
.cm-section:not(.cm-in-view) .cm-about-stage,.cm-section:not(.cm-in-view) .cm-live-card,.cm-section:not(.cm-in-view) .cm-preview-shell,.cm-section:not(.cm-in-view) .cm-committee-console,.cm-section:not(.cm-in-view) .cm-experience-hero,.cm-section:not(.cm-in-view) .cm-awards-podium,.cm-section:not(.cm-in-view) .cm-flow-map,.cm-section:not(.cm-in-view) .cm-schedule{transform:translateY(26px) rotateX(2.5deg)}
.cm-live-card,.cm-preview-shell,.cm-committee-spotlight,.cm-experience-hero,.cm-award-card,.cm-timeline-card,.cm-about-radar{position:relative}
.cm-live-card::selection,.cm-preview-shell::selection,.cm-committee-spotlight::selection{background:#c8a96e;color:#020711}
.cm-live-card::before,.cm-preview-shell::before,.cm-committee-spotlight::before,.cm-experience-hero::before,.cm-award-card::before,.cm-timeline-card::before{
  pointer-events:none;
}
.cm-section.cm-in-view .cm-live-card,.cm-section.cm-in-view .cm-preview-shell,.cm-section.cm-in-view .cm-committee-spotlight,.cm-section.cm-in-view .cm-experience-hero,.cm-section.cm-in-view .cm-award-card,.cm-section.cm-in-view .cm-timeline-card{
  box-shadow:0 34px 115px rgba(0,0,0,.42),0 0 70px rgba(56,189,248,.10),inset 0 1px 0 rgba(255,255,255,.07);
}
.cm-card,.cm-perk,.cm-stat,.cm-award-card,.cm-step-card,.cm-special,.cm-timeline-card{transition:transform .32s ease,border-color .32s ease,box-shadow .32s ease,filter .32s ease}
.cm-card:hover,.cm-perk:hover,.cm-award-card:hover,.cm-step-card:hover,.cm-special:hover,.cm-timeline-card:hover{filter:saturate(1.18) brightness(1.05)}

/* visible orbital upgrade: CSS-only 3D motion, no canvas/WebGL cost */
.cm-hero-visual::before{
  content:"";position:absolute;inset:8% -4% 2%;border-radius:50%;
  background:radial-gradient(ellipse at center,rgba(56,189,248,.18),transparent 58%);
  filter:blur(18px);transform:rotateX(72deg);opacity:.72;pointer-events:none;
}
.cm-orbit-globe{
  position:absolute;inset:0;z-index:0;display:grid;place-items:center;pointer-events:none;
  perspective:900px;transform-style:preserve-3d;opacity:.84;contain:layout paint;
}
.cm-orbit-globe::before,.cm-orbit-globe::after{
  content:"";position:absolute;border-radius:50%;border:1px solid rgba(120,193,255,.20);
  transform:rotateX(68deg) rotateZ(-18deg);box-shadow:0 0 45px rgba(56,189,248,.12);
}
.cm-orbit-globe::before{width:92%;aspect-ratio:1;animation:cmGlobeHalo 18s linear infinite}
.cm-orbit-globe::after{width:68%;aspect-ratio:1;border-color:rgba(200,169,110,.22);animation:cmGlobeHalo 26s linear infinite reverse}
.cm-globe-shell{
  position:relative;display:block;width:min(78%,360px);aspect-ratio:1;border-radius:50%;
  background:
    radial-gradient(circle at 34% 25%,rgba(255,255,255,.24),transparent 13%),
    radial-gradient(circle at 62% 68%,rgba(56,189,248,.26),transparent 34%),
    linear-gradient(135deg,rgba(4,22,46,.92),rgba(3,9,20,.78));
  border:1px solid rgba(120,193,255,.30);
  box-shadow:0 0 80px rgba(56,189,248,.22),inset 0 0 52px rgba(56,189,248,.12),inset 0 0 18px rgba(255,255,255,.09);
  transform-style:preserve-3d;will-change:transform;animation:cmGlobeSpin 15s linear infinite;
}
.cm-globe-shell::before,.cm-globe-shell::after{
  content:"";position:absolute;inset:11%;border-radius:50%;border:1px solid rgba(255,255,255,.16);
  transform:rotateX(68deg);box-shadow:0 0 22px rgba(120,193,255,.10);
}
.cm-globe-shell::after{inset:22%;border-color:rgba(200,169,110,.23);transform:rotateY(68deg)}
.cm-globe-ring{
  position:absolute;left:50%;top:50%;width:78%;aspect-ratio:1;border-radius:50%;
  border:1px solid rgba(120,193,255,.24);transform-style:preserve-3d;will-change:transform;
}
.cm-globe-ring.ring-equator{transform:translate(-50%,-50%) rotateX(72deg);animation:cmGlobeRingOne 9s linear infinite}
.cm-globe-ring.ring-meridian{transform:translate(-50%,-50%) rotateY(72deg);animation:cmGlobeRingTwo 11s linear infinite}
.cm-globe-ring.ring-tilt{width:92%;border-color:rgba(200,169,110,.26);transform:translate(-50%,-50%) rotateX(58deg) rotateZ(34deg);animation:cmGlobeRingThree 14s linear infinite reverse}
.cm-globe-dot{
  position:absolute;left:62%;top:23%;width:9px;height:9px;border-radius:50%;background:#c8a96e;
  box-shadow:0 0 18px rgba(200,169,110,.75),0 0 36px rgba(56,189,248,.22);
  animation:cmGlobeDot 2.4s ease-in-out infinite;
}
.cm-command-deck{z-index:2}.cm-deck-panel,.cm-deck-chip,.cm-deck-core{z-index:3}
@keyframes cmGlobeSpin{from{transform:rotateX(8deg) rotateY(0deg) rotateZ(-8deg)}to{transform:rotateX(8deg) rotateY(360deg) rotateZ(-8deg)}}
@keyframes cmGlobeHalo{from{transform:rotateX(68deg) rotateZ(-18deg)}to{transform:rotateX(68deg) rotateZ(342deg)}}
@keyframes cmGlobeRingOne{from{transform:translate(-50%,-50%) rotateX(72deg) rotateZ(0deg)}to{transform:translate(-50%,-50%) rotateX(72deg) rotateZ(360deg)}}
@keyframes cmGlobeRingTwo{from{transform:translate(-50%,-50%) rotateY(72deg) rotateZ(0deg)}to{transform:translate(-50%,-50%) rotateY(72deg) rotateZ(360deg)}}
@keyframes cmGlobeRingThree{from{transform:translate(-50%,-50%) rotateX(58deg) rotateZ(34deg)}to{transform:translate(-50%,-50%) rotateX(58deg) rotateZ(394deg)}}
@keyframes cmGlobeDot{0%,100%{transform:scale(.92);opacity:.7}50%{transform:scale(1.34);opacity:1}}

.cm-section .cm-inner::before{
  content:"";position:absolute;left:50%;top:-3.2rem;width:min(900px,92vw);height:150px;
  transform:translateX(-50%) rotateX(70deg) scale(.92);transform-origin:center;opacity:0;pointer-events:none;z-index:-1;
  background:
    repeating-linear-gradient(90deg,rgba(120,193,255,.13) 0 1px,transparent 1px 52px),
    linear-gradient(90deg,transparent,rgba(56,189,248,.20),rgba(200,169,110,.12),transparent);
  border:1px solid rgba(120,193,255,.10);border-radius:50%;
  filter:blur(.2px);transition:opacity .7s ease,transform .85s cubic-bezier(.2,.8,.2,1);
}
.cm-section.cm-in-view .cm-inner::before{opacity:.72;transform:translateX(-50%) rotateX(70deg) scale(1)}
.cm-about-radar::after{
  content:"";position:absolute;left:11%;right:11%;top:50%;height:2px;border-radius:999px;
  background:linear-gradient(90deg,transparent,rgba(56,189,248,.75),rgba(200,169,110,.52),transparent);
  box-shadow:0 0 24px rgba(56,189,248,.34);transform:translateY(-50%) rotate(-13deg) scaleX(.38);
  transform-origin:left;animation:cmRoutePulse 3.8s ease-in-out infinite;pointer-events:none;z-index:0;
}
@keyframes cmRoutePulse{0%,100%{opacity:.42;transform:translateY(-50%) rotate(-13deg) scaleX(.38)}50%{opacity:1;transform:translateY(-50%) rotate(-13deg) scaleX(1)}}
.cm-access-line{position:relative;overflow:visible}
.cm-access-line::after{
  content:"";position:absolute;top:50%;left:-5px;width:10px;height:10px;border-radius:50%;z-index:2;
  background:#38bdf8;box-shadow:0 0 18px rgba(56,189,248,.85),0 0 30px rgba(200,169,110,.28);
  transform:translateY(-50%);animation:cmPacketRun 1.65s ease-in-out infinite;
}
.cm-access-line:nth-of-type(4)::before,.cm-access-line:nth-of-type(4)::after{animation-delay:.42s}
@keyframes cmConnectorCharge{0%{opacity:.25;transform:translateY(-50%) scaleX(.18)}50%{opacity:1;transform:translateY(-50%) scaleX(1)}100%{opacity:.34;transform:translateY(-50%) scaleX(.24);transform-origin:right}}
@keyframes cmPacketRun{0%{left:-5px;opacity:0}18%{opacity:1}82%{opacity:1}100%{left:calc(100% - 5px);opacity:0}}
@keyframes cmConnectorChargeVertical{0%{opacity:.25;transform:translateX(-50%) scaleY(.18)}50%{opacity:1;transform:translateX(-50%) scaleY(1)}100%{opacity:.34;transform:translateX(-50%) scaleY(.24);transform-origin:bottom}}
@keyframes cmPacketRunVertical{0%{top:-5px;opacity:0}18%{opacity:1}82%{opacity:1}100%{top:calc(100% - 5px);opacity:0}}
.cm-access-node::before{
  content:"";position:absolute;inset:0;border-radius:inherit;
  background:linear-gradient(115deg,transparent 0 42%,rgba(120,193,255,.16) 48%,transparent 55% 100%);
  transform:translateX(-120%);animation:cmNodeScan 5.4s ease-in-out infinite;pointer-events:none;
}
.cm-access-node:nth-child(3)::before{animation-delay:.8s}.cm-access-node:nth-child(5)::before{animation-delay:1.6s}
@keyframes cmNodeScan{0%,45%{transform:translateX(-120%)}72%,100%{transform:translateX(120%)}}
.cm-preview-dock span,.cm-committee-holo div,.cm-flow-map span{animation:cmDockBreathe 5.5s ease-in-out infinite}
.cm-preview-dock span:nth-child(2),.cm-committee-holo div:nth-child(2),.cm-flow-map span:nth-child(2){animation-delay:.65s}
.cm-preview-dock span:nth-child(3),.cm-committee-holo div:nth-child(3),.cm-flow-map span:nth-child(3){animation-delay:1.3s}
@keyframes cmDockBreathe{0%,100%{box-shadow:0 18px 54px rgba(0,0,0,.22),inset 0 1px 0 rgba(255,255,255,.05)}50%{box-shadow:0 22px 70px rgba(56,189,248,.12),0 0 28px rgba(120,193,255,.08),inset 0 1px 0 rgba(255,255,255,.08)}}
.cm-awards-podium::before,.cm-flow-map::after{
  content:"";position:absolute;left:8%;right:8%;top:50%;height:1px;
  background:linear-gradient(90deg,transparent,rgba(56,189,248,.78),rgba(200,169,110,.55),transparent);
  box-shadow:0 0 22px rgba(56,189,248,.28);transform:translateY(-50%) scaleX(.2);
  transform-origin:left;animation:cmBeamCharge 4.2s ease-in-out infinite;pointer-events:none;
}
.cm-awards-podium{position:relative}
.cm-awards-podium::before{top:auto;bottom:18px}.cm-flow-map::after{z-index:-1}
@keyframes cmBeamCharge{0%,100%{transform:translateY(-50%) scaleX(.2);opacity:.35}50%{transform:translateY(-50%) scaleX(1);opacity:1}}

body.cm-cinematic-scroll .cm-page-aurora{opacity:.78}
body.cm-cinematic-scroll .cm-orbit-globe{opacity:1}
body.cm-cinematic-scroll .cm-globe-shell{animation-duration:10s}
body.cm-cinematic-scroll .cm-section.cm-in-view .cm-inner{filter:saturate(1.18) contrast(1.04)}
@media(max-width:760px){
  .cm-orbit-globe{opacity:.58;transform:scale(.88)}
  .cm-globe-shell{width:min(70vw,255px)}
  .cm-orbit-globe::before{width:74%}.cm-orbit-globe::after{width:56%}
  .cm-section .cm-inner::before{display:none}
  .cm-about-radar::after{left:13%;right:13%;top:51%}
  .cm-access-line::after{display:block}
}
@media(max-width:980px){
  .cm-hero{min-height:auto;text-align:center;padding-top:8rem}
  .cm-hero-layout{grid-template-columns:1fr;gap:1.4rem;padding-left:0}
  .cm-hero-copy,.cm-hero-copy .cm-sub{text-align:center;margin-left:auto;margin-right:auto}
  .cm-hero-badges,.cm-actions{justify-content:center}
  .cm-hero-visual{justify-self:center;width:100%;min-height:390px}.cm-command-deck{width:min(76vw,390px)}
  .cm-about-stage{grid-template-columns:1fr}.cm-about-stage .cm-stats{grid-template-columns:repeat(4,1fr)}
  .cm-scroll-rail{display:none}
}
@media(max-width:640px){
  .cm-hero{padding:6.55rem .9rem 2.4rem;min-height:100svh}
  .cm-hero-layout{gap:.45rem;max-width:100%;overflow:visible}
  .cm-hero-copy{width:100%;max-width:100%;min-width:0;overflow:hidden;padding:0 .2rem}
  .cm-kicker{margin-bottom:.95rem}
  .cm-title{font-size:clamp(2.7rem,12.8vw,3.35rem)!important;line-height:.94;white-space:nowrap}
  .cm-sub{font-size:.88rem;line-height:1.48;max-width:27ch;margin-top:.95rem!important;margin-bottom:1.25rem!important}
  .cm-actions{display:grid;grid-template-columns:1fr;width:min(100%,276px);margin:0 auto;gap:.62rem}
  .cm-actions .cm-btn{width:100%;min-width:0;min-height:46px;padding:.78rem .7rem;font-size:.62rem;letter-spacing:.12em}
  .cm-hero-badges{width:min(100%,286px);margin-left:auto;margin-right:auto;gap:.5rem}
  .cm-hero-badges span{flex:1 1 calc(50% - .5rem);justify-content:center;min-width:0;white-space:nowrap}
  .cm-hero-badges span:last-child{flex-basis:100%}
  .cm-hero-visual{min-height:286px;overflow:visible;width:100%;margin-top:.05rem;place-items:center}
  .cm-command-deck{width:min(82vw,300px);animation:none;transform:rotateX(58deg) rotateZ(0deg);transform-origin:center 58%}
  .cm-command-deck::before{inset:7%;border-radius:26px}
  .cm-deck-ring{inset:11%}.cm-deck-ring.ring-two{inset:27%}
  .cm-deck-core{width:82px;height:82px;transform:translate(-50%,-50%) translateZ(74px) rotateX(-58deg)}
  .cm-deck-core span{font-size:.72rem}.cm-deck-core strong{font-size:.98rem}
  .cm-deck-panel{width:88px;min-height:60px;padding:.54rem;border-radius:12px;transform:translateZ(64px) rotateX(-58deg)}
  .cm-deck-panel strong{font-size:.78rem}.cm-deck-panel small,.cm-deck-panel span{font-size:.48rem}.cm-deck-chip{min-width:48px;min-height:24px;font-size:.46rem;padding:.34rem .46rem}
  .cm-deck-chip{transform:translateZ(44px) rotateX(-58deg)}
  .chip-three,.chip-four{display:none}
  .panel-form{left:2%;top:22%}
  .panel-matrix{right:2%;top:22%}
  .panel-awards{left:50%;bottom:4%;transform:translateX(-50%) translateZ(64px) rotateX(-58deg)}
  .chip-one{left:11%;bottom:27%}
  .chip-two{right:11%;bottom:27%}
  .cm-hero-badges span{font-size:.52rem;letter-spacing:.07em;padding:.44rem .5rem;min-height:30px}
  .cm-reg-feature .cm-live-card::before{left:.9rem;right:.9rem}
  .cm-step-card:nth-child(n){transform:none}
  .cm-preview-feature .cm-preview-shell:hover,.cm-card-grid.enhanced .cm-card:hover{transform:translateY(-5px)}
  .cm-about-stage{gap:.85rem;margin-top:2rem}.cm-about-radar{min-height:270px}.cm-about-stage .cm-stats{grid-template-columns:1fr 1fr}
  .cm-radar-node{min-width:84px;min-height:34px;font-size:.5rem;letter-spacing:.08em;padding:.38rem .5rem}.cm-radar-core{width:108px;height:64px;font-size:.76rem;border-radius:16px}
  .cm-access-console{grid-template-columns:1fr;gap:.55rem;padding:.75rem}.cm-access-line{width:10px;height:22px;justify-self:center}.cm-access-line::before{left:50%;right:auto;top:0;bottom:0;width:2px;height:auto;transform:translateX(-50%) scaleY(.3);transform-origin:top;animation:cmConnectorChargeVertical 1.65s ease-in-out infinite}.cm-access-line::after{left:50%;top:-5px;transform:translateX(-50%);animation:cmPacketRunVertical 1.65s ease-in-out infinite}.cm-access-node{min-height:78px;text-align:center}
  .cm-preview-dock,.cm-committee-holo,.cm-awards-podium,.cm-flow-map{grid-template-columns:1fr;margin-bottom:1rem}
  .cm-preview-dock span,.cm-flow-map span,.cm-committee-holo div{min-height:48px}.cm-committee-holo div,.podium-main,.podium-side{transform:none}
  .cm-awards-podium>div{min-height:76px}.cm-flow-map::before{display:none}
  .cm-signal-track{animation:none;display:grid;width:auto;grid-template-columns:1fr 1fr;gap:.55rem;padding:.75rem .9rem}
  .cm-signal-track span:nth-child(n+5){display:none}
  .cm-signal-track span{justify-content:center;font-size:.52rem;letter-spacing:.1em;border:1px solid rgba(120,193,255,.12);border-radius:999px;padding:.45rem .45rem;background:rgba(255,255,255,.035)}
  .cm-section[data-section]::after{font-size:4rem;right:.65rem;top:.9rem;opacity:.55}
}
@media(prefers-reduced-motion:reduce){
  .cm-command-deck{animation:none!important}
  .cm-globe-shell{animation:cmGlobeSpin 28s linear infinite!important}
  .cm-orbit-globe::before,.cm-orbit-globe::after,.cm-globe-ring{animation-duration:34s!important}
  .cm-globe-dot{animation:none!important}
  .cm-signal-track,.cm-radar-ring.ring-a,.cm-radar-ring.ring-b{animation:none!important}
  .cm-command-deck,.cm-deck-core,.cm-deck-panel,.cm-deck-chip{will-change:auto}
}

/* optimized cinematic engine: richer than static CSS, capped for low-end devices */
.cm-cinematic-canvas{
  position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.58;
  mix-blend-mode:normal;filter:none;
}
.cm-page-aurora{opacity:.30!important;mix-blend-mode:normal!important}

/* final cinematic system: every section becomes its own control surface */
.cm-section[data-scene]{
  min-height:min(1080px,92svh);
  display:grid;
  align-items:center;
  border-top-color:rgba(120,193,255,.14);
}
.cm-section[data-scene] .cm-inner::after{
  content:none!important;
}
.cm-section[data-scene] .cm-section-head{
  position:relative;
  width:min(980px,100%);
  margin-left:auto;margin-right:auto;
  padding-top:clamp(3.7rem,5.8vw,5.25rem);
  isolation:isolate;
  --eye-travel:clamp(28px,5.2vw,58px);
  --eye-mid-left:clamp(18px,3.4vw,36px);
  --eye-mid-right:clamp(20px,3.8vw,40px);
  --pupil-tx:0px;--pupil-ty:0px;--pupil-scale:1;
}
.cm-section[data-scene] .cm-section-head > *{
  position:relative;z-index:2;
}
.cm-section[data-scene] .cm-section-head::before{
  content:"";position:absolute;left:50%;top:.32rem;z-index:0;pointer-events:none;
  width:clamp(190px,30vw,340px);height:clamp(44px,6.2vw,68px);
  border-radius:999px;
  clip-path:polygon(0 50%,8% 30%,24% 14%,50% 7%,76% 14%,92% 30%,100% 50%,92% 70%,76% 86%,50% 93%,24% 86%,8% 70%);
  background:
    radial-gradient(ellipse at 50% 50%,rgba(235,252,255,.22) 0 8%,rgba(89,207,255,.20) 10% 23%,transparent 25%),
    radial-gradient(ellipse at 50% 51%,rgba(120,193,255,.28) 0 24%,rgba(11,45,82,.72) 46%,rgba(2,8,18,.94) 76%),
    linear-gradient(90deg,rgba(2,8,18,.98),rgba(30,97,145,.52) 28%,rgba(200,169,110,.20) 50%,rgba(30,97,145,.48) 72%,rgba(2,8,18,.98));
  background-size:100% 100%,100% 100%,125% 100%;
  border:1px solid rgba(120,193,255,.28);
  box-shadow:0 0 22px rgba(56,189,248,.25),0 0 44px rgba(120,193,255,.10),inset 0 0 28px rgba(56,189,248,.10),inset 0 1px 0 rgba(255,255,255,.16);
  transform:translate3d(-50%,0,0) scaleX(1);
  transform-origin:center;
  animation:cmEyeSlitBlink 5.8s cubic-bezier(.7,0,.22,1) infinite,cmEyeSlitScan 6.5s linear infinite;
  will-change:clip-path,background-position;
}
.cm-section[data-scene] .cm-section-head .cm-label::after{
  content:"";position:absolute;left:50%;top:calc(-1 * clamp(3rem,4.95vw,4.25rem));z-index:1;pointer-events:none;
  width:clamp(20px,3.2vw,34px);height:clamp(20px,3.2vw,34px);border-radius:50%;
  background:
    radial-gradient(circle at 38% 32%,#ffffff 0 8%,rgba(255,255,255,.72) 9% 13%,transparent 14%),
    radial-gradient(circle,#020815 0 18%,#0f4ab8 19% 39%,#38bdf8 40% 58%,#dffaff 59% 66%,rgba(56,189,248,.20) 67% 78%,transparent 79%);
  box-shadow:0 0 16px rgba(255,255,255,.54),0 0 32px rgba(56,189,248,.72),0 0 52px rgba(200,169,110,.20);
  mix-blend-mode:screen;
  transform:translate3d(-50%,0,0) scale(1);
  animation:cmEyePupilRun 5.8s cubic-bezier(.65,0,.2,1) infinite,cmEyeFocusPulse 2.8s ease-in-out infinite;
  will-change:transform,opacity;
}
/* Real cursor tracking: when JS enables live tracking (fine pointer + motion allowed),
   the pupil position is driven every frame by --pupil-tx/--pupil-ty (already lerped
   in JS), so we cancel the timed left-right sweep and keep only blink + focus glow. */
.cm-page.cm-eye-live .cm-section[data-scene] .cm-section-head .cm-label::after{
  animation:cmEyeFocusPulse 2.8s ease-in-out infinite!important;
  transform:translate3d(calc(-50% + var(--pupil-tx,0px)),var(--pupil-ty,0px),0) scale(var(--pupil-scale,1))!important;
}
.cm-section[data-scene] .cm-section-head::after{
  width:min(300px,54vw);height:1px;margin-top:1.1rem;
  background:linear-gradient(90deg,transparent,#38bdf8 20%,rgba(200,169,110,.72) 50%,#38bdf8 80%,transparent);
  box-shadow:0 0 16px rgba(56,189,248,.18);
  animation:cmEyeSignalLine 4.8s ease-in-out infinite;
}
.cm-section[data-section]::after{
  opacity:.16!important;font-size:clamp(3.4rem,9vw,7.2rem)!important;
  top:clamp(1rem,2vw,1.7rem)!important;right:clamp(.75rem,3vw,2rem)!important;
  -webkit-text-stroke-color:rgba(120,193,255,.12)!important;
}
@keyframes cmEyeSlitBlink{
  0%,86%,100%{
    opacity:.92;
    clip-path:polygon(0 50%,8% 30%,24% 14%,50% 7%,76% 14%,92% 30%,100% 50%,92% 70%,76% 86%,50% 93%,24% 86%,8% 70%);
  }
  90%,93%{
    opacity:1;
    clip-path:polygon(0 50%,12% 46%,30% 43%,50% 42%,70% 43%,88% 46%,100% 50%,88% 54%,70% 57%,50% 58%,30% 57%,12% 54%);
  }
  96%{
    opacity:.94;
    clip-path:polygon(0 50%,8% 34%,24% 18%,50% 10%,76% 18%,92% 34%,100% 50%,92% 66%,76% 82%,50% 90%,24% 82%,8% 66%);
  }
}
@keyframes cmEyeSlitScan{
  0%{background-position:0 0,0 0,-34px 0}
  100%{background-position:0 0,0 0,34px 0}
}
@keyframes cmEyePupilRun{
  0%,100%{opacity:.88;transform:translate3d(calc(-50% - var(--eye-mid-left)),0,0) scale(.94)}
  32%{opacity:1;transform:translate3d(-50%,1px,0) scale(1.04)}
  66%{opacity:1;transform:translate3d(calc(-50% + var(--eye-mid-right)),-1px,0) scale(1)}
  90%,93%{opacity:.65;transform:translate3d(calc(-50% + var(--eye-mid-right)),0,0) scale(.34)}
}
@keyframes cmEyeFocusPulse{0%,100%{filter:none}50%{filter:drop-shadow(0 0 7px rgba(56,189,248,.38))}}
@keyframes cmEyeSignalLine{
  0%,100%{opacity:.48;transform:scaleX(.68)}
  45%{opacity:.88;transform:scaleX(1)}
  68%{opacity:.62;transform:scaleX(.78)}
}

#current-register{
  --scan-x:50%;--scan-y:34%;
  --card-tilt-x:0deg;--card-tilt-y:0deg;
  --field-x:0px;--field-y:0px;
}
#current-register .cm-section-head{
  padding-top:0;
  transform:translate3d(calc(var(--field-x) * .08),calc(var(--field-y) * .08),0);
}
#current-register.cm-in-view .cm-inner,
body.cm-cinematic-scroll #current-register.cm-in-view .cm-inner{
  filter:none!important;
}
#current-register .cm-section-head::before,
#current-register .cm-section-head .cm-label::after{
  content:none!important;display:none!important;
}
.cm-access-scanner{
  position:relative;width:clamp(218px,25vw,330px);height:clamp(112px,13.5vw,170px);
  margin:0 auto .45rem;perspective:900px;isolation:isolate;
  --iris-tx:0px;--iris-ty:0px;
  transform:
    translate3d(calc(var(--field-x) * .12),calc(var(--field-y) * .08),0)
    rotateX(calc(var(--card-tilt-x) * .16))
    rotateY(calc(var(--card-tilt-y) * .12));
  transform-style:preserve-3d;will-change:transform;
}
.cm-access-scanner::before{
  content:"";position:absolute;left:50%;top:50%;width:92%;height:54%;border-radius:999px;
  transform:translate(-50%,-50%);
  clip-path:polygon(0 50%,8% 28%,25% 10%,50% 4%,75% 10%,92% 28%,100% 50%,92% 72%,75% 90%,50% 96%,25% 90%,8% 72%);
  background:
    radial-gradient(ellipse at 50% 50%,rgba(255,255,255,.20) 0 11%,rgba(56,189,248,.16) 16%,transparent 26%),
    radial-gradient(ellipse at 50% 52%,rgba(120,193,255,.27) 0 30%,rgba(6,27,52,.82) 56%,rgba(1,6,14,.97) 82%),
    linear-gradient(90deg,rgba(1,8,18,.98),rgba(49,130,190,.42),rgba(200,169,110,.18),rgba(49,130,190,.36),rgba(1,8,18,.98));
  border:1px solid rgba(120,193,255,.30);
  box-shadow:0 0 30px rgba(56,189,248,.22),0 0 56px rgba(120,193,255,.08),inset 0 0 30px rgba(56,189,248,.08),inset 0 1px 0 rgba(255,255,255,.14);
  animation:cmAccessEyeBlink 5.2s cubic-bezier(.7,0,.22,1) infinite,cmHaloPulse 4.5s ease-in-out infinite;
}
.cm-access-scanner::after{
  content:"";position:absolute;left:50%;top:50%;width:78%;height:36%;border-radius:50%;
  transform:translate(-50%,-50%) rotate(-8deg);
  border:1px solid rgba(200,169,110,.24);
  box-shadow:0 0 24px rgba(200,169,110,.12),inset 0 0 24px rgba(56,189,248,.06);
  animation:cmAccessEyeOrbit 8s ease-in-out infinite;
}
.cm-scanner-ring{
  position:absolute;left:50%;top:50%;border-radius:50%;pointer-events:none;
  border:1px solid rgba(120,193,255,.18);box-shadow:0 0 22px rgba(56,189,248,.10);
}
.cm-scanner-ring.ring-a{
  width:82%;height:42%;transform:translate(-50%,-50%) rotate(8deg);
  animation:cmAccessEyeOrbitA 9s ease-in-out infinite;
}
.cm-scanner-ring.ring-b{
  width:60%;height:24%;border-color:rgba(200,169,110,.24);
  transform:translate(-50%,-50%) rotate(-12deg);
  animation:cmAccessEyeOrbitB 11s ease-in-out infinite reverse;
}
.cm-scanner-iris{
  position:absolute;left:50%;top:50%;z-index:3;width:clamp(38px,5.1vw,64px);aspect-ratio:1;border-radius:50%;
  transform:translate(-50%,-50%) translate3d(var(--iris-tx,0px),var(--iris-ty,0px),42px);
  background:
    radial-gradient(circle at 36% 30%,#ffffff 0 7%,rgba(255,255,255,.72) 8% 12%,transparent 13%),
    radial-gradient(circle,#010612 0 17%,#0b2f8f 18% 36%,#38bdf8 37% 58%,#dffaff 59% 65%,rgba(56,189,248,.24) 66% 77%,transparent 78%);
  box-shadow:0 0 26px rgba(255,255,255,.48),0 0 50px rgba(56,189,248,.72),0 0 80px rgba(200,169,110,.20);
  animation:cmHaloIrisPulse 2.4s ease-in-out infinite;
  will-change:transform,opacity;
}
.cm-scanner-iris::after{
  content:"";position:absolute;inset:24%;border-radius:50%;background:radial-gradient(circle,#020711 0 48%,rgba(2,7,17,.72) 52%,transparent 62%);
}
.cm-scanner-beam{
  position:absolute;left:50%;top:50%;z-index:2;width:2px;height:70%;border-radius:999px;
  transform:translate(-50%,-50%) rotate(-18deg);
  background:linear-gradient(180deg,transparent,rgba(125,236,255,.80),rgba(255,255,255,.70),rgba(200,169,110,.42),transparent);
  box-shadow:0 0 14px rgba(56,189,248,.34);
  opacity:.72;mix-blend-mode:screen;
  animation:cmAccessEyeGlint 4.2s ease-in-out infinite;
}
.cm-scanner-readout{
  position:absolute;z-index:4;top:50%;min-width:54px;padding:.34rem .46rem;border-radius:999px;
  border:1px solid rgba(120,193,255,.16);background:rgba(2,14,28,.56);
  color:rgba(214,239,255,.76);font-size:.48rem;font-weight:900;letter-spacing:.14em;text-transform:uppercase;
  box-shadow:0 10px 24px rgba(0,0,0,.20),inset 0 1px 0 rgba(255,255,255,.06);
}
.cm-scanner-readout::before{content:"";display:inline-block;width:5px;height:5px;margin-right:.34rem;border-radius:50%;background:#38bdf8;box-shadow:0 0 12px rgba(56,189,248,.9)}
.readout-left{right:75%;transform:translateY(-50%) translate3d(calc(var(--field-x) * -.10),0,0)}
.readout-right{left:75%;transform:translateY(-50%) translate3d(calc(var(--field-x) * .10),0,0)}
@keyframes cmAccessEyeBlink{
  0%,84%,100%{clip-path:polygon(0 50%,8% 28%,25% 10%,50% 4%,75% 10%,92% 28%,100% 50%,92% 72%,75% 90%,50% 96%,25% 90%,8% 72%)}
  89%,92%{clip-path:polygon(0 50%,12% 45%,30% 42%,50% 41%,70% 42%,88% 45%,100% 50%,88% 55%,70% 58%,50% 59%,30% 58%,12% 55%)}
  96%{clip-path:polygon(0 50%,8% 32%,25% 14%,50% 7%,75% 14%,92% 32%,100% 50%,92% 68%,75% 86%,50% 93%,25% 86%,8% 68%)}
}
@keyframes cmAccessEyeOrbit{0%,100%{transform:translate(-50%,-50%) rotate(-8deg) scaleX(1)}50%{transform:translate(-50%,-50%) rotate(8deg) scaleX(.96)}}
@keyframes cmAccessEyeOrbitA{0%,100%{transform:translate(-50%,-50%) rotate(8deg)}50%{transform:translate(-50%,-50%) rotate(-6deg)}}
@keyframes cmAccessEyeOrbitB{0%,100%{transform:translate(-50%,-50%) rotate(-12deg)}50%{transform:translate(-50%,-50%) rotate(10deg)}}
@keyframes cmHaloPulse{0%,100%{opacity:.82}50%{opacity:1}}
@keyframes cmHaloIrisPulse{0%,100%{opacity:.86;scale:.96}50%{opacity:1;scale:1.04}}
@keyframes cmAccessEyeGlint{0%,100%{opacity:.42;transform:translate(-50%,-50%) rotate(-22deg) scaleY(.82)}50%{opacity:.86;transform:translate(calc(-50% + 18px),-50%) rotate(-16deg) scaleY(1)}}

#current-register .cm-live-grid{
  position:relative;max-width:1120px;margin:0 auto;perspective:1200px;
}
#current-register .cm-live-grid::before{
  content:"";position:absolute;inset:-1.2rem;border-radius:28px;pointer-events:none;
  background:
    linear-gradient(90deg,transparent 0 9%,rgba(56,189,248,.35) 9.3%,transparent 9.6% 90%,rgba(200,169,110,.24) 90.3%,transparent 90.6%),
    linear-gradient(rgba(120,193,255,.10) 1px,transparent 1px),
    linear-gradient(90deg,rgba(120,193,255,.08) 1px,transparent 1px);
  background-size:100% 100%,48px 48px,48px 48px;
  opacity:.34;transform:rotateX(63deg) translateY(32px);transform-origin:center bottom;
}
#current-register .cm-live-card{
  clip-path:polygon(0 0,calc(100% - 28px) 0,100% 28px,100% 100%,28px 100%,0 calc(100% - 28px));
  border-radius:18px!important;
  transform:
    perspective(1200px)
    rotateX(var(--card-tilt-x))
    rotateY(var(--card-tilt-y))
    translate3d(calc(var(--field-x) * .12),calc(var(--field-y) * .08),0);
  transition:transform 90ms linear,border-color .2s ease,box-shadow .2s ease;
  will-change:transform;
  backdrop-filter:none;
}
#current-register.cm-in-view .cm-live-card{animation:cmAccessLift .55s cubic-bezier(.2,.8,.2,1) both}
@keyframes cmAccessLift{from{opacity:.58}to{opacity:1}}
#current-register .cm-reg-badge{box-shadow:0 0 24px rgba(200,169,110,.18)}
#current-register .cm-access-console{
  background:
    radial-gradient(circle at var(--scan-x) var(--scan-y),rgba(56,189,248,.18),transparent 31%),
    linear-gradient(145deg,rgba(120,193,255,.10),rgba(255,255,255,.025));
  box-shadow:inset 0 0 34px rgba(56,189,248,.06),0 0 40px rgba(56,189,248,.06);
}
#current-register .cm-access-node{
  background:
    radial-gradient(circle at var(--scan-x) var(--scan-y),rgba(255,255,255,.12),transparent 34%),
    linear-gradient(145deg,rgba(255,255,255,.10),rgba(255,255,255,.026));
  backdrop-filter:none;
}
#current-register .cm-steps{
  position:relative;z-index:2;transform-style:preserve-3d;
}
#current-register .cm-step-card{
  min-height:150px;border-radius:18px;transform:translateZ(18px);
}
#current-register .cm-step-card:nth-child(2){transform:translateZ(44px)}
#current-register .cm-step-card::after{
  content:"";position:absolute;inset:auto 1rem .75rem;height:2px;border-radius:999px;
  background:linear-gradient(90deg,#38bdf8,#c8a96e);opacity:.55;
}

#current-preview .cm-preview-stage{
  position:relative;padding:clamp(.65rem,1.6vw,1.1rem);
  border:1px solid rgba(120,193,255,.16);border-radius:28px;
  background:
    radial-gradient(circle at 15% 15%,rgba(56,189,248,.18),transparent 28%),
    linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.018));
  box-shadow:0 34px 120px rgba(0,0,0,.42),0 0 80px rgba(56,189,248,.08);
}
#current-preview .cm-preview-stage::before,
#current-preview .cm-preview-stage::after{
  content:"";position:absolute;inset:.85rem;border-radius:22px;pointer-events:none;
  border:1px solid rgba(120,193,255,.18);
  clip-path:polygon(0 0,18% 0,18% 2px,2px 2px,2px 18%,0 18%,0 100%,18% 100%,18% calc(100% - 2px),2px calc(100% - 2px),2px 82%,0 82%,0 0);
}
#current-preview .cm-preview-stage::after{
  transform:scaleX(-1);border-color:rgba(200,169,110,.18);
}
#current-preview .cm-preview-shell{
  border-radius:18px!important;
  transform-origin:center top;
}
#current-preview.cm-in-view .cm-preview-shell{animation:cmDockArrive .8s cubic-bezier(.2,.8,.2,1) both}
@keyframes cmDockArrive{from{transform:translateY(38px) rotateX(8deg) scale(.97);opacity:.55}to{transform:translateY(0) rotateX(0) scale(1);opacity:1}}
#current-preview .cm-preview-frame{filter:saturate(.94) contrast(1.02)}

#current-committees .cm-committee-console{
  position:relative;grid-template-columns:minmax(190px,.26fr) minmax(0,1fr);
  padding:1rem;border:1px solid rgba(120,193,255,.14);border-radius:26px;
  background:linear-gradient(145deg,rgba(255,255,255,.055),rgba(255,255,255,.018));
  transform-style:preserve-3d;
}
#current-committees .cm-committee-console::before{
  content:"";position:absolute;inset:1rem;border-radius:20px;pointer-events:none;opacity:.20;
  background:
    linear-gradient(rgba(120,193,255,.14) 1px,transparent 1px),
    linear-gradient(90deg,rgba(120,193,255,.10) 1px,transparent 1px);
  background-size:42px 42px;
  transform:translateZ(-28px) rotateX(58deg);transform-origin:center bottom;
}
#current-committees .cm-committee-nav{
  border-radius:18px;background:rgba(2,9,20,.72);
}
#current-committees .cm-committee-spotlight{
  min-height:250px;align-items:center;overflow:hidden;
  box-shadow:0 40px 120px rgba(0,0,0,.42),0 0 80px rgba(56,189,248,.12);
}
#current-committees .cm-committee-spotlight::after{
  content:"";position:absolute;right:-7%;top:-35%;width:46%;aspect-ratio:1;border-radius:50%;
  border:1px solid rgba(120,193,255,.20);box-shadow:inset 0 0 50px rgba(56,189,248,.06),0 0 50px rgba(56,189,248,.08);
  animation:cmCommitteeHalo 16s linear infinite;pointer-events:none;
}
@keyframes cmCommitteeHalo{to{transform:rotate(360deg)}}
#current-committees .cm-card-grid.enhanced{
  perspective:1300px;gap:1.15rem;align-items:stretch;margin-top:1.6rem;
}
/* flat, aligned grid: the static rotateY tilts + 18px stagger + the active
   card's translateZ pop made corners jut into the spotlight panel above —
   the cursor-tilt engine now supplies the 3D feel interactively instead */
#current-committees .cm-card-grid.enhanced .cm-card{
  border-radius:16px;min-height:250px;transform:none;
  background:linear-gradient(160deg,rgba(255,255,255,.08),rgba(7,24,47,.40),rgba(255,255,255,.02));
}
#current-committees .cm-card-grid.enhanced .cm-card:nth-child(even){transform:none}
#current-committees .cm-card-grid.enhanced .cm-card.active{
  transform:translateY(-6px) scale(1.012);
}

#current-perks .cm-experience-hero{
  position:relative;overflow:hidden;border-radius:26px;
  clip-path:polygon(0 0,100% 0,100% calc(100% - 26px),calc(100% - 26px) 100%,0 100%);
}
#current-perks .cm-experience-hero::before{
  content:"";position:absolute;inset:-40%;pointer-events:none;
  background:conic-gradient(from 0deg at 50% 50%,transparent 0 35%,rgba(56,189,248,.18) 42%,transparent 50% 70%,rgba(200,169,110,.13) 77%,transparent 84%);
  animation:cmExperienceSweep 18s linear infinite;opacity:.70;
}
@keyframes cmExperienceSweep{to{transform:rotate(360deg)}}
#current-perks .cm-experience-hero>*{position:relative;z-index:2}
#current-perks .cm-perks{perspective:1100px}
#current-perks .cm-perk{transform-style:preserve-3d}
#current-perks .cm-perk:nth-child(3n+1){transform:rotateZ(-1.4deg) translateY(10px)}
#current-perks .cm-perk:nth-child(3n+2){transform:translateZ(26px)}
#current-perks .cm-perk:nth-child(3n){transform:rotateZ(1.4deg) translateY(10px)}
#current-perks .cm-perk:hover{transform:translateY(-12px) translateZ(44px) rotateZ(0)!important}
#current-perks .cm-perk-ico{animation:cmIconFloat 4.5s ease-in-out infinite}
#current-perks .cm-perk:nth-child(even) .cm-perk-ico{animation-delay:1s}
@keyframes cmIconFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}

#current-awards .cm-awards-podium{
  max-width:1040px;transform-style:preserve-3d;
}
#current-awards .cm-awards-podium>div{
  position:relative;overflow:hidden;border-radius:18px;
}
#current-awards .cm-awards-podium>div::before{
  content:"";position:absolute;inset:-60% -20%;background:linear-gradient(115deg,transparent 0 36%,rgba(255,255,255,.20) 48%,transparent 60%);
  transform:translateX(-90%);animation:cmPodiumSweep 5.2s ease-in-out infinite;pointer-events:none;
}
#current-awards .podium-main{
  min-height:160px;transform:translateZ(58px) translateY(-10px);
  box-shadow:0 38px 100px rgba(200,169,110,.14),0 0 80px rgba(56,189,248,.10);
}
#current-awards .podium-side{transform:translateY(24px) rotateX(4deg)}
@keyframes cmPodiumSweep{0%,45%{transform:translateX(-90%)}78%,100%{transform:translateX(90%)}}
#current-awards .cm-awards-grid{
  grid-template-columns:repeat(2,minmax(0,1fr));
  perspective:1000px;
}
#current-awards .cm-award-card:nth-child(odd){transform:rotateY(-2.5deg)}
#current-awards .cm-award-card:nth-child(even){transform:rotateY(2.5deg)}
#current-awards .cm-special-awards{position:relative;z-index:2}

#current-schedule .cm-flow-map{
  max-width:1080px;grid-template-columns:1fr 1.25fr 1fr;
  padding:1rem;border:1px solid rgba(120,193,255,.15);border-radius:24px;
  background:linear-gradient(135deg,rgba(255,255,255,.065),rgba(255,255,255,.02));
}
#current-schedule .cm-flow-map span{
  border-radius:999px;transform:translateZ(0);
}
#current-schedule .cm-schedule{
  position:relative;max-width:1120px;margin:0 auto;
}
#current-schedule .cm-schedule::before{
  content:"";position:absolute;left:50%;top:0;bottom:0;width:2px;border-radius:999px;
  background:linear-gradient(180deg,transparent,#38bdf8,#c8a96e,#38bdf8,transparent);
  box-shadow:0 0 24px rgba(56,189,248,.28);transform:translateX(-50%);
}
#current-schedule .cm-day-title{
  border-left:0;text-align:center;padding-left:0;color:#f7f2ec;
}
#current-schedule .cm-timeline{
  border-left:0;padding-left:0;gap:.85rem;
}
#current-schedule .cm-timeline-card{
  border-radius:16px;border:1px solid rgba(120,193,255,.14);
  background:linear-gradient(145deg,rgba(255,255,255,.08),rgba(255,255,255,.025));
}
#current-schedule .cm-timeline-card::before{left:50%;top:-7px;transform:translateX(-50%)}
#current-schedule .cm-timeline-card:hover{transform:translateY(-6px) scale(1.015)}

@media(max-width:980px){
  .cm-section[data-scene]{min-height:auto}
  .cm-section[data-scene] .cm-inner::after{font-size:clamp(3.3rem,16vw,7rem);right:.5rem;top:.4rem;opacity:.32}
  #current-register .cm-live-grid::before{display:none}
  #current-committees .cm-committee-console{grid-template-columns:1fr}
  #current-committees .cm-card-grid.enhanced .cm-card,
  #current-committees .cm-card-grid.enhanced .cm-card:nth-child(even),
  #current-awards .cm-award-card:nth-child(odd),
  #current-awards .cm-award-card:nth-child(even),
  #current-perks .cm-perk:nth-child(n){
    transform:none;
  }
  #current-schedule .cm-schedule::before{left:12px}
}
@media(max-width:640px){
  .cm-section[data-scene] .cm-inner::after{display:none}
  .cm-section[data-scene] .cm-section-head{padding-top:1.75rem;--eye-travel:112px;--eye-mid-left:42px;--eye-mid-right:48px}
  .cm-section[data-scene] .cm-section-head::before{display:block;width:min(330px,86vw);height:22px;opacity:.78}
  .cm-section[data-scene] .cm-section-head .cm-label::after{top:-1.05rem}
  #current-register .cm-section-head{padding-top:0}
  #current-register .cm-access-scanner{width:150px;height:132px;margin-bottom:.35rem}
  #current-register .cm-scanner-readout{display:none}
  #current-register .cm-scanner-iris{width:17px}
  #current-register .cm-scanner-beam{width:110px}
  #current-register .cm-live-card,
  #current-perks .cm-experience-hero{
    clip-path:none;border-radius:22px!important;
  }
  #current-preview .cm-preview-stage{padding:.5rem;border-radius:20px}
  #current-committees .cm-card-grid.enhanced .cm-card{min-height:auto}
  #current-awards .podium-main,#current-awards .podium-side{transform:none}
  #current-schedule .cm-flow-map{grid-template-columns:1fr}
  #current-schedule .cm-schedule::before{display:none}
}
/* performance polish: keep the graphics, reduce the tiny stutter */
.cm-section,.cm-card,.cm-live-card,.cm-preview-shell,.cm-committee-spotlight,.cm-experience-hero,.cm-award-card,.cm-timeline-card{contain:layout paint;}
.cm-cinematic-canvas{opacity:.46;}
.cm-command-deck{animation-duration:11s;}
.cm-globe-shell,.cm-globe-ring,.cm-orbit-globe::before,.cm-orbit-globe::after{animation-duration:18s!important;}
.cm-preview-dock span,.cm-committee-holo div,.cm-flow-map span{position:relative;z-index:3;background:linear-gradient(145deg,rgba(7,20,39,.92),rgba(5,12,25,.82));}
#current-schedule .cm-flow-map{position:relative;isolation:isolate;overflow:hidden;}
#current-schedule .cm-flow-map::before{top:auto!important;bottom:.46rem!important;left:16%!important;right:16%!important;z-index:1!important;opacity:.62;}
#current-schedule .cm-flow-map::after{top:auto!important;bottom:.46rem!important;z-index:2!important;opacity:.44;}
@media(max-width:640px){
  .cm-section[data-scene] .cm-section-head{padding-top:3.3rem;--eye-travel:30px;--eye-mid-left:18px;--eye-mid-right:20px;}
  .cm-section[data-scene] .cm-section-head::before{width:min(230px,72vw);height:42px;top:.25rem;}
  .cm-section[data-scene] .cm-section-head .cm-label::after{top:-2.72rem;width:20px;height:20px;}
  #current-register .cm-access-scanner{width:210px;height:112px;}
  #current-register .cm-scanner-iris{width:38px;}
  #current-register .cm-scanner-beam{height:66%;}
}

/* targeted hero deck spacing + non-destructive scroll performance fix */
.cm-deck-panel{z-index:5;}
.cm-deck-chip{z-index:3;min-width:86px;background:linear-gradient(145deg,rgba(5,16,32,.94),rgba(3,9,20,.90));}
.panel-form{left:2%!important;top:22%!important;}
.panel-matrix{right:2%!important;top:22%!important;}
.panel-awards{left:50%!important;bottom:1%!important;transform:translateX(-50%) translateZ(76px) rotateZ(24deg) rotateX(-58deg)!important;}
.chip-one{left:5%!important;bottom:31%!important;}
.chip-two{right:4%!important;bottom:31%!important;}
.chip-three{left:50%!important;top:4%!important;transform:translateX(-50%) translateZ(52px) rotateZ(24deg) rotateX(-58deg)!important;}
.chip-four{left:50%!important;bottom:28%!important;transform:translateX(-50%) translateZ(52px) rotateZ(24deg) rotateX(-58deg)!important;}
.cm-section[data-scene]{content-visibility:auto;contain-intrinsic-size:940px;}
.cm-command-deck,.cm-globe-shell,.cm-globe-ring,.cm-orbit-globe::before,.cm-orbit-globe::after,.cm-section-head::before,.cm-section-head .cm-label::after{backface-visibility:hidden;transform-style:preserve-3d;}
.cm-section .cm-inner{will-change:transform,opacity;}
.cm-cinematic-canvas{contain:strict;}


/* final repair: remove the weird opened panels, keep the cinematic scroll, and cut scroll jank safely */
.cm-section[data-scene]{content-visibility:visible!important;contain-intrinsic-size:auto!important;}
.cm-section .cm-inner::before{content:none!important;display:none!important;}
.cm-section.cm-in-view .cm-inner{filter:none!important;}
.cm-section.cm-in-view .cm-card,.cm-section.cm-in-view .cm-perk,.cm-section.cm-in-view .cm-stat,.cm-section.cm-in-view .cm-award-card,.cm-section.cm-in-view .cm-step-card,.cm-section.cm-in-view .cm-special,.cm-section.cm-in-view .cm-timeline-card{filter:none!important;}
.cm-card:hover,.cm-perk:hover,.cm-award-card:hover,.cm-step-card:hover,.cm-special:hover,.cm-timeline-card:hover{filter:none!important;}
.cm-page-aurora{
  opacity:.24!important;mix-blend-mode:normal!important;will-change:transform,opacity!important;
  background:
    radial-gradient(circle at 18% 24%,rgba(29,78,216,.16),transparent 30%),
    radial-gradient(circle at 82% 76%,rgba(56,189,248,.12),transparent 32%),
    conic-gradient(from 210deg at 78% 24%,transparent 0 18%,rgba(56,189,248,.10) 22%,transparent 33% 64%,rgba(200,169,110,.07) 70%,transparent 78%)!important;
  animation:cmAuroraDrift 18s ease-in-out infinite alternate;
}
body.cm-cinematic-scroll .cm-page-aurora{opacity:.30!important;}
@keyframes cmAuroraDrift{from{transform:translate3d(-1.5%,-1%,0) scale(1)}to{transform:translate3d(1.5%,1%,0) scale(1.02)}}
.cm-nav,.cm-stat,.cm-card,.cm-timeline-card,.cm-reg-panel,.cm-live-card,.cm-preview-shell,.cm-award-card,.cm-step-card,.cm-committee-nav,.cm-scroll-rail{backdrop-filter:blur(8px)!important;-webkit-backdrop-filter:blur(8px)!important;}

/* clean eye headers: actual eye shape, no giant opened strip behind it */
.cm-section[data-scene] .cm-section-head{padding-top:clamp(3.2rem,5vw,4.5rem)!important;--eye-mid-left:clamp(12px,2.3vw,24px);--eye-mid-right:clamp(12px,2.5vw,26px);}
.cm-section[data-scene] .cm-section-head::before{
  width:clamp(188px,24vw,286px)!important;height:clamp(38px,4.7vw,56px)!important;top:.42rem!important;opacity:.9!important;
  border-radius:50%/58%!important;
  clip-path:polygon(0 50%,10% 35%,28% 20%,50% 13%,72% 20%,90% 35%,100% 50%,90% 65%,72% 80%,50% 87%,28% 80%,10% 65%)!important;
  background:
    radial-gradient(ellipse at 50% 52%,rgba(232,252,255,.24) 0 10%,rgba(70,198,255,.20) 11% 27%,transparent 30%),
    radial-gradient(ellipse at 50% 52%,rgba(120,193,255,.34) 0 28%,rgba(7,37,70,.80) 58%,rgba(1,7,16,.98) 82%),
    linear-gradient(90deg,rgba(1,7,16,.98),rgba(42,122,178,.36),rgba(200,169,110,.18),rgba(42,122,178,.32),rgba(1,7,16,.98))!important;
  animation:cmEyeSoftScan 7s ease-in-out infinite!important;will-change:opacity,background-position!important;
}
.cm-section[data-scene] .cm-section-head .cm-label::after{top:calc(-1 * clamp(2.55rem,4.1vw,3.42rem))!important;width:clamp(19px,2.5vw,28px)!important;height:clamp(19px,2.5vw,28px)!important;}
@keyframes cmEyeSoftScan{0%,100%{opacity:.82;background-position:0 0,0 0,-22px 0}50%{opacity:.96;background-position:0 0,0 0,22px 0}}
#current-register .cm-access-scanner::before{width:86%!important;height:50%!important;border-radius:50%/58%!important;}

/* rebuilt hero command deck: no central pill/glitch, no overlapping tags, no specific committee names */
.cm-hero-visual{contain:layout paint!important;}
.cm-command-deck{width:min(100%,470px)!important;aspect-ratio:1!important;transform:none!important;animation:cmDeckFloatClean 9s ease-in-out infinite!important;transform-style:flat!important;will-change:transform!important;}
.cm-command-deck::before{
  inset:9%!important;border-radius:50%!important;transform:none!important;opacity:.82!important;
  background:
    radial-gradient(circle at 50% 50%,rgba(120,193,255,.18),transparent 34%),
    repeating-radial-gradient(circle at 50% 50%,rgba(120,193,255,.14) 0 1px,transparent 1px 31px),
    conic-gradient(from 20deg,rgba(56,189,248,.16),transparent 20%,rgba(200,169,110,.12),transparent 54%,rgba(120,193,255,.12),transparent 100%)!important;
  box-shadow:0 28px 90px rgba(0,0,0,.30),0 0 62px rgba(56,189,248,.12),inset 0 1px 0 rgba(255,255,255,.08)!important;
  animation:cmDeckBaseBreathe 10s ease-in-out infinite!important;will-change:opacity,transform!important;
}
.cm-command-deck::after{left:18%!important;right:18%!important;bottom:4%!important;height:24px!important;transform:none!important;filter:blur(18px)!important;opacity:.62!important;}
.cm-deck-ring{inset:15%!important;transform:none!important;z-index:2!important;}
.cm-deck-ring.ring-two{inset:30%!important;transform:rotate(24deg)!important;}
.cm-deck-core{width:118px!important;height:118px!important;z-index:8!important;transform:translate(-50%,-50%)!important;}
.cm-deck-core::before{animation:cmDeckCoreSpin 10s linear infinite!important;}
.cm-deck-core span{font-size:.86rem!important}.cm-deck-core strong{font-size:1.42rem!important}
.cm-deck-panel,.cm-deck-chip{transform:none!important;backface-visibility:visible!important;transform-style:flat!important;}
.cm-deck-panel{width:150px!important;min-height:96px!important;z-index:7!important;}
.panel-form{left:0!important;top:22%!important;}
.panel-matrix{right:0!important;top:22%!important;}
.panel-awards{left:50%!important;bottom:4%!important;transform:translateX(-50%)!important;}
.cm-deck-chip{z-index:6!important;min-width:84px!important;min-height:34px!important;background:linear-gradient(145deg,rgba(5,16,32,.96),rgba(3,9,20,.92))!important;}
.chip-one{left:4%!important;bottom:32%!important;}
.chip-two{right:2%!important;bottom:32%!important;}
.chip-three{left:50%!important;top:5%!important;transform:translateX(-50%)!important;}
.chip-four{left:50%!important;bottom:29%!important;transform:translateX(-50%)!important;}
@keyframes cmDeckFloatClean{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(0,-10px,0)}}
@keyframes cmDeckBaseBreathe{0%,100%{opacity:.72;transform:scale(.985)}50%{opacity:.88;transform:scale(1.01)}}
@media(max-width:980px){
  .cm-command-deck{width:min(84vw,390px)!important;}
  .cm-deck-panel{width:128px!important;min-height:82px!important;}
  .panel-form{left:0!important}.panel-matrix{right:0!important}.panel-awards{bottom:5%!important;}
  .cm-deck-core{width:102px!important;height:102px!important;}
}
@media(max-width:640px){
  .cm-section[data-scene] .cm-section-head{padding-top:3rem!important;}
  .cm-section[data-scene] .cm-section-head::before{width:min(210px,72vw)!important;height:42px!important;top:.35rem!important;}
  .cm-section[data-scene] .cm-section-head .cm-label::after{top:-2.28rem!important;width:22px!important;height:22px!important;}
  .cm-command-deck{width:min(86vw,312px)!important;animation:none!important;}
  .cm-deck-core{width:78px!important;height:78px!important;}
  .cm-deck-core span{font-size:.64rem!important}.cm-deck-core strong{font-size:.9rem!important}
  .cm-deck-panel{width:96px!important;min-height:62px!important;padding:.56rem!important;border-radius:12px!important;}
  .cm-deck-panel strong{font-size:.78rem!important}.cm-deck-panel small,.cm-deck-panel span{font-size:.48rem!important}
  .cm-deck-chip{min-width:54px!important;min-height:24px!important;font-size:.46rem!important;padding:.33rem .45rem!important;}
  .chip-three,.chip-four{display:none!important;}
  .panel-form{left:0!important;top:23%!important;}.panel-matrix{right:0!important;top:23%!important;}.panel-awards{bottom:7%!important;}
  .chip-one{left:8%!important;bottom:31%!important;}.chip-two{right:8%!important;bottom:31%!important;}
}

/* final orbital-eye repair: keeps the eye, removes the broken central pillar, and stays GPU-light */
.cm-hero-visual{
  --deck-x:0px;--deck-y:0px;--deck-tilt-x:0deg;--deck-tilt-y:0deg;--deck-glow-x:50%;--deck-glow-y:48%;
  overflow:visible!important;isolation:isolate!important;contain:layout paint style!important;
}
.cm-command-deck{
  width:min(46vw,500px)!important;min-width:360px!important;aspect-ratio:1.12/1!important;
  transform:translate3d(var(--deck-x),var(--deck-y),0) rotateX(var(--deck-tilt-x)) rotateY(var(--deck-tilt-y))!important;
  animation:cmDeckFloatEye 14s ease-in-out infinite!important;
  transform-style:flat!important;contain:layout paint style!important;
}
.cm-command-deck::before{
  inset:12% 4%!important;border-radius:50%/44%!important;transform:none!important;opacity:.92!important;
  background:
    radial-gradient(ellipse at var(--deck-glow-x) var(--deck-glow-y),rgba(232,252,255,.22) 0 5%,rgba(76,201,255,.20) 6% 16%,rgba(8,32,58,.56) 34%,transparent 56%),
    repeating-radial-gradient(ellipse at 50% 50%,rgba(120,193,255,.16) 0 1px,transparent 1px 34px),
    conic-gradient(from 18deg,rgba(56,189,248,.18),transparent 19%,rgba(200,169,110,.14),transparent 48%,rgba(120,193,255,.14),transparent 100%),
    linear-gradient(135deg,rgba(12,37,66,.52),rgba(3,10,22,.66))!important;
  box-shadow:0 24px 70px rgba(0,0,0,.28),0 0 42px rgba(56,189,248,.12),inset 0 1px 0 rgba(255,255,255,.10)!important;
  animation:cmDeckEyeBreathe 9s ease-in-out infinite!important;
}
.cm-command-deck::after{
  left:18%!important;right:18%!important;bottom:4%!important;height:14px!important;border-radius:50%!important;
  background:rgba(0,0,0,.30)!important;filter:none!important;opacity:.42!important;transform:none!important;
}
.cm-deck-ring{inset:18% 8%!important;border-radius:50%/46%!important;z-index:2!important;transform:none!important;animation:cmDeckRingDrift 24s linear infinite!important;}
.cm-deck-ring.ring-two{inset:28% 20%!important;transform:rotate(22deg)!important;animation-duration:30s!important;animation-direction:reverse!important;}
.cm-deck-core{
  left:50%!important;top:50%!important;width:114px!important;height:114px!important;min-width:0!important;min-height:0!important;
  max-width:114px!important;max-height:114px!important;border-radius:50%!important;overflow:hidden!important;z-index:8!important;
  display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:.3rem!important;
  transform:translate(-50%,-50%)!important;background:radial-gradient(circle at 45% 36%,rgba(189,236,255,.30),rgba(36,155,230,.24) 28%,rgba(2,8,18,.94) 68%)!important;
  box-shadow:0 18px 48px rgba(0,0,0,.36),0 0 34px rgba(56,189,248,.18),inset 0 0 0 1px rgba(255,255,255,.16)!important;
}
.cm-deck-core::before{
  content:""!important;position:absolute!important;inset:12px!important;border-radius:50%!important;
  background:conic-gradient(from 0deg,transparent,rgba(120,193,255,.42),transparent 28%,rgba(200,169,110,.35),transparent 62%,rgba(120,193,255,.30),transparent)!important;
  animation:cmDeckIrisSpin 18s linear infinite!important;opacity:.72!important;
}
.cm-deck-core::after{
  content:""!important;position:absolute!important;inset:36%!important;border-radius:50%!important;
  background:radial-gradient(circle,rgba(232,252,255,.95),rgba(80,189,255,.70) 34%,rgba(8,21,38,.92) 70%)!important;
  box-shadow:0 0 20px rgba(86,204,255,.56)!important;
}
.cm-deck-core span,.cm-deck-core strong{position:relative!important;z-index:2!important;text-shadow:0 2px 12px rgba(0,0,0,.55)!important;}
.cm-deck-core span{font-size:.72rem!important;color:#9bdcff!important;line-height:1!important;}
.cm-deck-core strong{font-size:1.1rem!important;line-height:1!important;color:#fffaf0!important;margin:0!important;}
.cm-deck-panel,.cm-deck-chip{
  transform:none!important;backface-visibility:hidden!important;transform-style:flat!important;will-change:auto!important;
}
.cm-deck-panel{
  width:148px!important;height:88px!important;min-height:0!important;max-height:88px!important;padding:.9rem 1rem!important;
  display:flex!important;flex-direction:column!important;justify-content:center!important;gap:.24rem!important;border-radius:18px!important;z-index:7!important;
  background:linear-gradient(145deg,rgba(10,26,48,.96),rgba(4,12,25,.90))!important;
  box-shadow:0 16px 42px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.10)!important;
}
.cm-deck-panel small{font-size:.58rem!important;line-height:1!important;}
.cm-deck-panel strong{font-size:1.12rem!important;line-height:1.05!important;}
.cm-deck-panel span{font-size:.68rem!important;line-height:1.1!important;}
.panel-form{left:-1%!important;top:28%!important;}
.panel-matrix{right:-1%!important;top:28%!important;}
.panel-awards{left:50%!important;bottom:0!important;transform:translateX(-50%)!important;}
.cm-deck-chip{
  width:auto!important;min-width:74px!important;min-height:30px!important;max-height:32px!important;padding:.42rem .68rem!important;
  display:inline-flex!important;align-items:center!important;justify-content:center!important;border-radius:999px!important;z-index:6!important;
  font-size:.56rem!important;line-height:1!important;background:linear-gradient(145deg,rgba(5,16,32,.98),rgba(3,9,20,.94))!important;
}
.chip-one{left:5%!important;bottom:25%!important;}
.chip-two{right:5%!important;bottom:25%!important;}
.chip-three{left:50%!important;top:6%!important;right:auto!important;transform:translateX(-50%)!important;}
.chip-four{display:none!important;}
@keyframes cmDeckFloatEye{
  0%,100%{transform:translate3d(var(--deck-x),var(--deck-y),0) rotateX(var(--deck-tilt-x)) rotateY(var(--deck-tilt-y))}
  50%{transform:translate3d(var(--deck-x),calc(var(--deck-y) - 8px),0) rotateX(var(--deck-tilt-x)) rotateY(var(--deck-tilt-y))}
}
@keyframes cmDeckEyeBreathe{0%,100%{opacity:.86}50%{opacity:.98}}
@keyframes cmDeckRingDrift{to{rotate:360deg}}
@keyframes cmDeckIrisSpin{to{transform:rotate(360deg)}}
body.cm-cinematic-scroll .cm-cinematic-canvas{display:block!important;opacity:.46!important}
body.cm-cinematic-scroll .cm-page-aurora{display:block!important;opacity:.54!important}
body.cm-cinematic-scroll .cm-orbit-globe{display:block!important;opacity:1!important}
.cm-section{content-visibility:visible!important;contain-intrinsic-size:auto!important;}
body.cm-cinematic-scroll .cm-command-deck,
body.cm-cinematic-scroll .cm-command-deck::before,
body.cm-cinematic-scroll .cm-deck-ring,
body.cm-cinematic-scroll .cm-deck-core::before,
body.cm-cinematic-scroll .cm-section[data-scene] .cm-section-head::before,
body.cm-cinematic-scroll .cm-section[data-scene] .cm-section-head .cm-label::after,
body.cm-cinematic-scroll .cm-access-scanner::before,
body.cm-cinematic-scroll .cm-globe-ring{
  animation-play-state:running!important;
}
body.cm-cinematic-scroll .cm-card,body.cm-cinematic-scroll .cm-timeline-card,body.cm-cinematic-scroll .cm-reg-panel,body.cm-cinematic-scroll .cm-live-card,body.cm-cinematic-scroll .cm-preview-shell,body.cm-cinematic-scroll .cm-award-card,body.cm-cinematic-scroll .cm-step-card{
  transition:transform .28s cubic-bezier(.2,.8,.2,1),border-color .18s ease,background .18s ease,color .18s ease,box-shadow .18s ease!important;
}
@media(max-width:980px){
  .cm-hero-visual{justify-self:center!important;min-height:390px!important;width:100%!important;}
  .cm-command-deck{width:min(84vw,390px)!important;min-width:0!important;}
  .cm-deck-panel{width:122px!important;height:76px!important;max-height:76px!important;padding:.7rem .78rem!important;}
  .cm-deck-panel strong{font-size:.92rem!important}.cm-deck-panel span{font-size:.58rem!important}.cm-deck-panel small{font-size:.5rem!important}
  .cm-deck-core{width:92px!important;height:92px!important;max-width:92px!important;max-height:92px!important;}
}
@media(max-width:640px){
  .cm-hero-visual{min-height:285px!important;margin-top:.6rem!important;}
  .cm-command-deck{width:min(92vw,310px)!important;min-width:0!important;animation:cmDeckFloatEye 18s ease-in-out infinite!important;}
  .cm-command-deck::before{inset:15% 3%!important;}
  .cm-deck-ring{inset:22% 8%!important;animation:cmDeckRingDrift 34s linear infinite!important;}
  .cm-deck-ring.ring-two{inset:32% 20%!important;}
  .cm-deck-core{width:74px!important;height:74px!important;max-width:74px!important;max-height:74px!important;}
  .cm-deck-core::before{inset:8px!important}.cm-deck-core strong{font-size:.78rem!important}.cm-deck-core span{font-size:.5rem!important}
  .cm-deck-panel{width:86px!important;height:54px!important;max-height:54px!important;padding:.46rem .5rem!important;border-radius:12px!important;}
  .cm-deck-panel strong{font-size:.62rem!important}.cm-deck-panel span{font-size:.44rem!important}.cm-deck-panel small{font-size:.38rem!important}
  .panel-form{left:0!important;top:29%!important}.panel-matrix{right:0!important;top:29%!important}.panel-awards{display:none!important}
  .cm-deck-chip{display:none!important;}
}
@media(max-width:760px){
  .cm-cinematic-canvas{display:block!important;opacity:.20!important;}
  .cm-page-aurora{opacity:.20!important;animation:cmAuroraDrift 28s ease-in-out infinite alternate!important;}
  .cm-orbit-globe{display:block!important;opacity:.38!important;transform:scale(.72)!important;}
  .cm-nav,.cm-stat,.cm-card,.cm-timeline-card,.cm-reg-panel,.cm-live-card,.cm-preview-shell,.cm-award-card,.cm-step-card,.cm-committee-nav,.cm-scroll-rail{backdrop-filter:blur(7px)!important;-webkit-backdrop-filter:blur(7px)!important;}
}
@media(prefers-reduced-motion:reduce){
  .cm-command-deck,.cm-command-deck::before,.cm-deck-ring,.cm-deck-core::before,.cm-section[data-scene] .cm-section-head::before,.cm-section[data-scene] .cm-section-head .cm-label::after{animation:none!important;}
  .cm-cinematic-canvas{display:none!important;}
}

/* HARD EFFECT RESTORE: keep the cinematic Current MUN graphics alive */
.cm-cinematic-canvas{display:block!important;opacity:.46!important;visibility:visible!important}
.cm-page-aurora{display:block!important;opacity:.42!important;animation:cmAuroraDrift 18s ease-in-out infinite alternate!important}
.cm-orbit-globe{display:grid!important;opacity:1!important;visibility:visible!important}
.cm-orbit-globe::before{display:block!important;animation:cmGlobeHalo 18s linear infinite!important}
.cm-orbit-globe::after{display:block!important;animation:cmGlobeHalo 26s linear infinite reverse!important}
.cm-globe-shell{display:grid!important;animation:cmGlobeSpin 12s linear infinite!important}
.cm-globe-ring{display:block!important;animation-play-state:running!important}
.cm-globe-dot{display:block!important;animation:cmGlobeDot 2.4s ease-in-out infinite!important}
.cm-command-deck{animation:cmDeckFloatEye 14s ease-in-out infinite!important}
.cm-command-deck::before{animation:cmDeckEyeBreathe 9s ease-in-out infinite!important}
.cm-deck-ring{animation:cmDeckRingDrift 24s linear infinite!important}
.cm-deck-ring.ring-two{animation:cmDeckRingDrift 30s linear infinite reverse!important}
.cm-deck-core::before{animation:cmDeckIrisSpin 18s linear infinite!important}
.cm-section[data-scene] .cm-section-head::before{
  display:block!important;visibility:visible!important;opacity:.92!important;
  animation:cmEyeAliveBlink 5.8s cubic-bezier(.7,0,.22,1) infinite,cmEyeSoftScan 7s ease-in-out infinite!important;
  transform:translate3d(-50%,0,0) scaleY(1)!important;transform-origin:center!important;
}
.cm-section[data-scene] .cm-section-head .cm-label::after{
  display:block!important;visibility:visible!important;opacity:1!important;
  animation:cmEyePupilRun 5.8s cubic-bezier(.65,0,.2,1) infinite,cmEyeFocusPulse 2.8s ease-in-out infinite!important;
}
@keyframes cmEyeAliveBlink{
  0%,84%,100%{transform:translate3d(-50%,0,0) scaleY(1);opacity:.92}
  88%{transform:translate3d(-50%,0,0) scaleY(.14);opacity:.74}
  91%{transform:translate3d(-50%,0,0) scaleY(1);opacity:.96}
}
@media(max-width:760px){
  .cm-cinematic-canvas{display:block!important;opacity:.24!important}
  .cm-orbit-globe{display:grid!important;opacity:.48!important;transform:scale(.76)!important}
  .cm-command-deck{animation:cmDeckFloatEye 18s ease-in-out infinite!important}
  .cm-deck-ring{animation:cmDeckRingDrift 34s linear infinite!important}
  .cm-section[data-scene] .cm-section-head::before{animation:cmEyeAliveBlink 6.4s cubic-bezier(.7,0,.22,1) infinite,cmEyeSoftScan 8s ease-in-out infinite!important}
}
.cm-preview-placeholder{
  display:grid!important;
  place-items:center!important;
  align-content:center!important;
  gap:.55rem!important;
  padding:1.25rem!important;
  cursor:pointer!important;
  color:rgba(255,255,255,.72)!important;
  background:
    linear-gradient(120deg,rgba(29,78,216,.13),rgba(56,189,248,.09),rgba(200,169,110,.08)),
    repeating-linear-gradient(90deg,rgba(255,255,255,.055) 0 1px,transparent 1px 72px),
    #06111f!important;
}
.cm-preview-placeholder span{
  color:#8bdcff!important;
  font:900 .72rem/1 'Space Grotesk',sans-serif!important;
  letter-spacing:.18em!important;
  text-transform:uppercase!important;
}
.cm-preview-placeholder strong{
  color:#fff7df!important;
  font:900 clamp(1.05rem,2vw,1.5rem)/1.1 'Space Grotesk',sans-serif!important;
  letter-spacing:.04em!important;
}
.cm-card.active,
.cm-preview-tab.active,
.cm-committee-nav button.active,
.cm-scroll-rail button.active,
.cm-btn:active,
.cm-preview-expand:active{
  transform:translate3d(0,-6px,0) scale(1.015)!important;
  transition:transform .28s cubic-bezier(.2,.8,.2,1),box-shadow .28s ease,border-color .28s ease,background .28s ease,color .28s ease!important;
}
.cm-card.active{
  box-shadow:0 34px 96px rgba(120,193,255,.16),0 0 0 1px rgba(200,169,110,.22) inset!important;
}
#current-committees .cm-card-grid.enhanced .cm-card.active{
  transform:translate3d(0,-6px,0) scale(1.012);
}
.cm-preview-tab.active{
  box-shadow:0 14px 34px rgba(200,169,110,.20),0 0 28px rgba(120,193,255,.12)!important;
}
.cm-committee-nav button.active{
  transform:translate3d(4px,-5px,0) scale(1.01)!important;
}

/* final premium glass pop pass: premium feel without punishing low-end GPUs */
.cm-stat,
.cm-card,
.cm-live-card,
.cm-preview-shell,
.cm-committee-spotlight,
.cm-award-card,
.cm-step-card,
.cm-special,
.cm-timeline-card,
.cm-reg-panel,
.cm-committee-nav,
.cm-flow-map{
  backdrop-filter:blur(11px) saturate(1.12)!important;
  -webkit-backdrop-filter:blur(11px) saturate(1.12)!important;
  background:
    radial-gradient(circle at var(--scan-x,20%) var(--scan-y,12%),rgba(120,193,255,.115),transparent 36%),
    linear-gradient(145deg,rgba(255,255,255,.092),rgba(255,255,255,.028) 56%,rgba(5,16,34,.76))!important;
  border-color:rgba(120,193,255,.19)!important;
  box-shadow:0 22px 62px rgba(0,0,0,.36),inset 0 1px 0 rgba(255,255,255,.06)!important;
  transform:translateZ(0);
}
.cm-preview-shell,
.cm-live-card,
.cm-committee-spotlight,
.cm-experience-hero,
.cm-awards-podium,
.cm-flow-map,
.cm-schedule{
  transform-style:preserve-3d;
}
.cm-stat::after,
.cm-card::after,
.cm-live-card::after,
.cm-preview-shell::after,
.cm-committee-spotlight::after,
.cm-award-card::after,
.cm-step-card::after,
.cm-timeline-card::after{
  content:"";position:absolute;inset:0;pointer-events:none;border-radius:inherit;
  background:linear-gradient(112deg,transparent 0 38%,rgba(255,255,255,.12) 49%,transparent 62%);
  transform:translateX(-132%);
  transition:transform .5s ease;
  will-change:transform;
}
.cm-stat:hover::after,
.cm-card:hover::after,
.cm-live-card:hover::after,
.cm-preview-shell:hover::after,
.cm-committee-spotlight:hover::after,
.cm-award-card:hover::after,
.cm-step-card:hover::after,
.cm-timeline-card:hover::after{
  transform:translateX(132%);
}
.cm-card:hover,
.cm-stat:hover,
.cm-live-card:hover,
.cm-preview-shell:hover,
.cm-committee-spotlight:hover,
.cm-award-card:hover,
.cm-step-card:hover,
.cm-special:hover,
.cm-timeline-card:hover,
.cm-reg-panel:hover{
  transform:translate3d(0,-7px,0) scale(1.008)!important;
  border-color:rgba(120,193,255,.36)!important;
  box-shadow:0 30px 84px rgba(0,0,0,.46),0 0 44px rgba(56,189,248,.12),0 0 28px rgba(200,169,110,.07)!important;
}
.cm-btn,
.cm-preview-tab,
.cm-preview-expand,
.cm-committee-nav button,
.cm-focus-actions button,
.cm-focus-actions a{
  backdrop-filter:blur(9px) saturate(1.10)!important;
  -webkit-backdrop-filter:blur(9px) saturate(1.10)!important;
  transition:transform .26s cubic-bezier(.2,.8,.2,1),box-shadow .26s ease,border-color .26s ease,background .26s ease,color .26s ease!important;
}
.cm-btn:hover,
.cm-preview-tab:hover,
.cm-preview-expand:hover,
.cm-committee-nav button:hover,
.cm-focus-actions button:hover,
.cm-focus-actions a:hover{
  transform:translate3d(0,-4px,0) scale(1.012)!important;
  box-shadow:0 16px 38px rgba(56,189,248,.12),0 0 24px rgba(200,169,110,.09)!important;
}
.cm-preview-tab.active,
.cm-committee-nav button.active,
.cm-scroll-rail button.active{
  animation:cmControlPop .46s cubic-bezier(.18,.9,.2,1) both;
}
.cm-section.cm-in-view .cm-stat,
.cm-section.cm-in-view .cm-card,
.cm-section.cm-in-view .cm-live-card,
.cm-section.cm-in-view .cm-preview-shell,
.cm-section.cm-in-view .cm-committee-spotlight,
.cm-section.cm-in-view .cm-award-card,
.cm-section.cm-in-view .cm-step-card,
.cm-section.cm-in-view .cm-special,
.cm-section.cm-in-view .cm-timeline-card,
.cm-section.cm-in-view .cm-reg-panel{
  animation:cmGlassPop .7s cubic-bezier(.18,.9,.2,1) both;
}
.cm-section.cm-in-view .cm-card:nth-child(2),
.cm-section.cm-in-view .cm-stat:nth-child(2),
.cm-section.cm-in-view .cm-step-card:nth-child(2),
.cm-section.cm-in-view .cm-award-card:nth-child(2),
.cm-section.cm-in-view .cm-timeline-card:nth-child(2){animation-delay:.05s}
.cm-section.cm-in-view .cm-card:nth-child(3),
.cm-section.cm-in-view .cm-stat:nth-child(3),
.cm-section.cm-in-view .cm-step-card:nth-child(3),
.cm-section.cm-in-view .cm-award-card:nth-child(3),
.cm-section.cm-in-view .cm-timeline-card:nth-child(3){animation-delay:.1s}
.cm-section.cm-in-view .cm-card:nth-child(4),
.cm-section.cm-in-view .cm-stat:nth-child(4),
.cm-section.cm-in-view .cm-award-card:nth-child(4),
.cm-section.cm-in-view .cm-timeline-card:nth-child(4){animation-delay:.15s}
@keyframes cmGlassPop{
  0%{opacity:0;transform:translate3d(0,24px,0) scale(.965);filter:saturate(.74)}
  58%{opacity:1;transform:translate3d(0,-6px,0) scale(1.014)}
  100%{opacity:1;transform:translate3d(0,0,0) scale(1);filter:saturate(1)}
}
@keyframes cmControlPop{
  0%{transform:translate3d(0,0,0) scale(.96)}
  70%{transform:translate3d(0,-7px,0) scale(1.025)}
  100%{transform:translate3d(0,-6px,0) scale(1.015)}
}
@media(max-width:760px){
  .cm-stat,
  .cm-card,
  .cm-live-card,
  .cm-preview-shell,
  .cm-committee-spotlight,
  .cm-award-card,
  .cm-step-card,
  .cm-special,
  .cm-timeline-card,
  .cm-reg-panel,
  .cm-committee-nav,
  .cm-flow-map{
    backdrop-filter:blur(8px) saturate(1.08)!important;
    -webkit-backdrop-filter:blur(8px) saturate(1.08)!important;
    box-shadow:0 18px 48px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.055)!important;
  }
  .cm-section.cm-in-view .cm-stat,
  .cm-section.cm-in-view .cm-card,
  .cm-section.cm-in-view .cm-live-card,
  .cm-section.cm-in-view .cm-preview-shell,
  .cm-section.cm-in-view .cm-committee-spotlight,
  .cm-section.cm-in-view .cm-award-card,
  .cm-section.cm-in-view .cm-step-card,
  .cm-section.cm-in-view .cm-special,
  .cm-section.cm-in-view .cm-timeline-card,
  .cm-section.cm-in-view .cm-reg-panel{
    animation-duration:.48s!important;
  }
  body.cm-cinematic-scroll .cm-section.cm-in-view .cm-stat,
  body.cm-cinematic-scroll .cm-section.cm-in-view .cm-card,
  body.cm-cinematic-scroll .cm-section.cm-in-view .cm-live-card,
  body.cm-cinematic-scroll .cm-section.cm-in-view .cm-preview-shell,
  body.cm-cinematic-scroll .cm-section.cm-in-view .cm-committee-spotlight,
  body.cm-cinematic-scroll .cm-section.cm-in-view .cm-award-card,
  body.cm-cinematic-scroll .cm-section.cm-in-view .cm-step-card,
  body.cm-cinematic-scroll .cm-section.cm-in-view .cm-special,
  body.cm-cinematic-scroll .cm-section.cm-in-view .cm-timeline-card,
body.cm-cinematic-scroll .cm-section.cm-in-view .cm-reg-panel{
    animation:none!important;
  }
  .cm-card:hover,.cm-stat:hover,.cm-live-card:hover,.cm-preview-shell:hover,.cm-committee-spotlight:hover,.cm-award-card:hover,.cm-step-card:hover,.cm-special:hover,.cm-timeline-card:hover,.cm-reg-panel:hover{
    transform:translate3d(0,-6px,0) scale(1.008)!important;
  }
}
#current-register .cm-live-card,
#current-register .cm-live-card:hover,
body.cm-cinematic-scroll #current-register .cm-live-card,
body.cm-cinematic-scroll #current-register .cm-live-card:hover{
  transform:
    perspective(1200px)
    rotateX(var(--card-tilt-x))
    rotateY(var(--card-tilt-y))
    translate3d(calc(var(--field-x) * .12),calc(var(--field-y) * .08),0)
    scale(var(--register-card-scale,1))!important;
}
#current-register .cm-live-card:hover{
  --register-card-scale:1.008;
  border-color:rgba(120,193,255,.38)!important;
  box-shadow:0 34px 96px rgba(0,0,0,.50),0 0 56px rgba(56,189,248,.15),0 0 32px rgba(200,169,110,.08)!important;
}
.cm-section[data-scene]:not(.cm-in-view){
  content-visibility:auto!important;
  contain-intrinsic-size:920px!important;
}
.cm-section .cm-inner{will-change:auto!important}
.cm-section.cm-in-view .cm-inner{will-change:transform,opacity!important}
@media(min-width:981px){
  .cm-hero-layout{
    grid-template-columns:minmax(0,1fr) minmax(340px,.64fr)!important;
    gap:clamp(1.5rem,3.4vw,4.2rem)!important;
    padding-right:clamp(1.4rem,4vw,4rem)!important;
  }
  .cm-hero-visual{justify-self:center!important;width:min(455px,100%)!important}
  .cm-command-deck{width:min(42vw,455px)!important;min-width:330px!important}
  .panel-matrix{right:4%!important}
  .chip-two{right:12%!important}
}

/* ── performance pass: integrated onto the main site's light engine ──
   backdrop-filter forces a full-viewport repaint per scrolled frame for
   every card it touches; over a near-opaque dark page the visual delta
   is nil, so it goes. Reveals are one-way (JS unobserves), so hidden
   sections no longer hold live transitions either. */
.cm-stat,.cm-card,.cm-timeline-card,.cm-reg-panel,.cm-perk,.cm-award-card,.cm-step-card,.cm-special,.cm-live-card,.cm-preview-shell,.cm-committee-spotlight,.cm-experience-hero,.cm-about-stage,.cm-schedule,.cm-flow-map{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
.cm-nav{backdrop-filter:blur(10px)}
`;

function CinematicCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return undefined;

    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes = [];
    let lastFrame = 0;
    let mouseX = 0.5;
    let mouseY = 0.5;
    let running = true;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const makeNodes = () => {
      const area = Math.max(1, width * height);
      const count = prefersReduced
        ? Math.min(10, Math.max(6, Math.floor(area / 160000)))
        : Math.min(width < 640 ? 8 : 14, Math.max(8, Math.floor(area / 150000)));
      nodes = Array.from({ length: count }, (_, index) => ({
        x: Math.random(),
        y: Math.random(),
        z: 0.35 + Math.random() * 0.9,
        phase: Math.random() * Math.PI * 2,
        speed: 0.12 + Math.random() * 0.32,
        size: index % 7 === 0 ? 1.8 : 1 + Math.random() * 1.2,
        hue: index % 4 === 0 ? "gold" : "blue",
      }));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, width < 720 ? 1 : 1.15);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeNodes();
    };

    const draw = (time) => {
      if (!running) return;
      const scrollLite = document.body.classList.contains("cm-cinematic-scroll");
      const frameGap = prefersReduced ? 240 : scrollLite ? 260 : width < 720 ? 180 : 148;
      if (time - lastFrame < frameGap) {
        raf = requestAnimationFrame(draw);
        return;
      }
      lastFrame = time;

      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scroll = window.scrollY / maxScroll;
      context.clearRect(0, 0, width, height);

      const wash = context.createRadialGradient(
        width * (0.2 + mouseX * 0.08),
        height * (0.22 + mouseY * 0.08),
        0,
        width * 0.48,
        height * 0.42,
        Math.max(width, height) * 0.76
      );
      wash.addColorStop(0, "rgba(56,189,248,0.18)");
      wash.addColorStop(0.38, "rgba(29,78,216,0.08)");
      wash.addColorStop(1, "rgba(2,7,18,0)");
      context.fillStyle = wash;
      context.fillRect(0, 0, width, height);

      if (scrollLite) {
        const y = height * 0.28 + Math.sin(time * 0.00036 + scroll * Math.PI) * 28;
        const grd = context.createLinearGradient(0, y, width, y + 74);
        grd.addColorStop(0, "rgba(56,189,248,0)");
        grd.addColorStop(0.44, "rgba(56,189,248,0.14)");
        grd.addColorStop(0.62, "rgba(200,169,110,0.08)");
        grd.addColorStop(1, "rgba(56,189,248,0)");
        context.strokeStyle = grd;
        context.lineWidth = width < 720 ? 1 : 1.35;
        context.beginPath();
        context.moveTo(-90, y);
        context.bezierCurveTo(width * 0.22, y - 74, width * 0.66, y + 96, width + 90, y + 8);
        context.stroke();

        const pulseX = width * (0.5 + Math.sin(time * 0.00042) * 0.16);
        const pulseY = height * (0.22 + Math.cos(time * 0.00032) * 0.05);
        context.beginPath();
        context.fillStyle = "rgba(120,193,255,0.38)";
        context.arc(pulseX, pulseY, width < 720 ? 1.7 : 2.4, 0, Math.PI * 2);
        context.fill();

        raf = requestAnimationFrame(draw);
        return;
      }

      const projected = nodes.map((node) => {
        const drift = time * 0.00004 * node.speed;
        const x = ((node.x + Math.sin(node.phase + time * 0.00022) * 0.018 + scroll * 0.09 * node.z + 1) % 1) * width;
        const y = ((node.y + Math.cos(node.phase + time * 0.00018) * 0.022 - scroll * 0.05 * node.z + 1) % 1) * height;
        return {
          x: x + (mouseX - 0.5) * 18 * node.z + drift,
          y: y + (mouseY - 0.5) * 14 * node.z,
          z: node.z,
          size: node.size,
          hue: node.hue,
        };
      });

      context.lineWidth = 1;
      for (let i = 0; i < projected.length; i += 1) {
        const a = projected[i];
        for (let j = i + 2; j < projected.length; j += 3) {
          const b = projected[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const limit = width < 720 ? 86 : 132;
          if (dist < limit) {
            const alpha = (1 - dist / limit) * 0.22;
            context.strokeStyle = `rgba(56,189,248,${alpha})`;
            context.beginPath();
            context.moveTo(a.x, a.y);
            context.lineTo(b.x, b.y);
            context.stroke();
          }
        }
      }

      for (let i = 0; i < projected.length; i += 1) {
        const node = projected[i];
        context.beginPath();
        context.fillStyle = node.hue === "gold"
          ? "rgba(200,169,110,0.72)"
          : "rgba(56,189,248,0.76)";
        context.arc(node.x, node.y, node.size * node.z, 0, Math.PI * 2);
        context.fill();
      }

      const ribbons = width < 720 ? 1 : 2;
      for (let i = 0; i < ribbons; i += 1) {
        const y = height * (0.22 + i * 0.18) + Math.sin(time * 0.00045 + i) * 24;
        const grd = context.createLinearGradient(0, y, width, y + 80);
        grd.addColorStop(0, "rgba(56,189,248,0)");
        grd.addColorStop(0.45, i % 2 ? "rgba(200,169,110,0.13)" : "rgba(56,189,248,0.16)");
        grd.addColorStop(1, "rgba(56,189,248,0)");
        context.strokeStyle = grd;
        context.lineWidth = i === 1 ? 1.8 : 1.1;
        context.beginPath();
        context.moveTo(-80, y);
        context.bezierCurveTo(width * 0.24, y - 80, width * 0.62, y + 120, width + 80, y + 10);
        context.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    const onPointerMove = (event) => {
      mouseX = event.clientX / Math.max(1, window.innerWidth);
      mouseY = event.clientY / Math.max(1, window.innerHeight);
    };

    const onVisibility = () => {
      running = document.visibilityState === "visible";
      if (running) {
        lastFrame = 0;
        raf = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(raf);
      }
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="cm-cinematic-canvas" aria-hidden="true" />;
}

function ReactiveHero({ smoothTo }) {
  const heroVisualRef = useRef(null);
  const heroPointerRef = useRef({ x: 0.5, y: 0.5 });
  const heroPointerFrame = useRef(0);

  const handleHeroMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    event.currentTarget.style.setProperty("--mx", `${x}%`);
    event.currentTarget.style.setProperty("--my", `${y}%`);
  };

  const updateHeroPointer = (visual, x, y) => {
    visual.style.setProperty("--deck-x", `${Math.round((x - 0.5) * 18)}px`);
    visual.style.setProperty("--deck-y", `${Math.round((y - 0.5) * 12)}px`);
    visual.style.setProperty("--deck-tilt-x", `${Math.round((0.5 - y) * 40) / 10}deg`);
    visual.style.setProperty("--deck-tilt-y", `${Math.round((x - 0.5) * 52) / 10}deg`);
    visual.style.setProperty("--deck-glow-x", `${Math.round(x * 100)}%`);
    visual.style.setProperty("--deck-glow-y", `${Math.round(y * 100)}%`);
  };

  const handleHeroPointerMove = (event) => {
    const visual = heroVisualRef.current || event.currentTarget;
    const rect = visual.getBoundingClientRect();
    const x = Math.min(0.92, Math.max(0.08, (event.clientX - rect.left) / Math.max(1, rect.width)));
    const y = Math.min(0.9, Math.max(0.1, (event.clientY - rect.top) / Math.max(1, rect.height)));
    heroPointerRef.current = { x, y };
    if (heroPointerFrame.current) return;
    heroPointerFrame.current = requestAnimationFrame(() => {
      heroPointerFrame.current = 0;
      const latest = heroPointerRef.current;
      updateHeroPointer(visual, latest.x, latest.y);
    });
  };

  const handleHeroPointerLeave = () => {
    const visual = heroVisualRef.current;
    if (!visual) return;
    if (heroPointerFrame.current) {
      cancelAnimationFrame(heroPointerFrame.current);
      heroPointerFrame.current = 0;
    }
    updateHeroPointer(visual, 0.5, 0.5);
  };

  useEffect(() => () => {
    if (heroPointerFrame.current) cancelAnimationFrame(heroPointerFrame.current);
  }, []);

  return (
    <section className="cm-hero" id="current-home" onMouseMove={handleHeroMouseMove}>
      <div className="cm-grid" />
      <div className="cm-orb-wrap"><div className="cm-orb" /></div>
      <div className="cm-hero-layout">
        <div className="cm-hero-content cm-hero-copy">
          <div className="cm-kicker">Current Conference Microsite</div>
          <h1 className="cm-title">MAX<span>MUN</span></h1>
          <p className="cm-sub">
            MAXMUN 3.0 is the dedicated senior-conference hub for registrations, matrix access,
            final committees, agendas, awards, delegate resources, and conference updates.
          </p>
          <div className="cm-hero-badges" aria-label="Current MUN highlights">
            <span>Live Registration</span>
            <span>Matrix Preview</span>
            <span>7 Committees</span>
          </div>
          <div className="cm-actions">
            <button className="cm-btn primary" onClick={() => smoothTo("current-register")}>Register / Matrix</button>
            <button className="cm-btn" onClick={() => smoothTo("current-committees")}>View Committees</button>
          </div>
        </div>

        <div
          className="cm-hero-visual"
          ref={heroVisualRef}
          onPointerMove={handleHeroPointerMove}
          onPointerLeave={handleHeroPointerLeave}
          aria-hidden="true"
        >
          <div className="cm-orbit-globe">
            <span className="cm-globe-shell">
              <span className="cm-globe-ring ring-equator" />
              <span className="cm-globe-ring ring-meridian" />
              <span className="cm-globe-ring ring-tilt" />
              <span className="cm-globe-dot" />
            </span>
          </div>
          <div className="cm-command-deck">
            <div className="cm-deck-ring ring-one" />
            <div className="cm-deck-ring ring-two" />
            <div className="cm-deck-core">
              <span>3.0</span>
              <strong>LIVE</strong>
            </div>
            <div className="cm-deck-panel panel-form">
              <small>Access</small>
              <strong>Form</strong>
              <span>Open</span>
            </div>
            <div className="cm-deck-panel panel-matrix">
              <small>Matrix</small>
              <strong>Live</strong>
              <span>Review</span>
            </div>
            <div className="cm-deck-panel panel-awards">
              <small>Awards</small>
              <strong>Cash</strong>
              <span>Trophies</span>
            </div>
            <div className="cm-deck-chip chip-one">Debate</div>
            <div className="cm-deck-chip chip-two">Delegates</div>
            <div className="cm-deck-chip chip-three">3-4 Tracks</div>
            <div className="cm-deck-chip chip-four">Awards</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CurrentMunPage({ onBack }) {
  const [preview, setPreview] = useState("matrix");
  const [expandedPreview, setExpandedPreview] = useState(false);
  const [activeSection, setActiveSection] = useState("current-home");
  const [featuredCommittee, setFeaturedCommittee] = useState(currentCommittees[0]?.acronym || "UNCSW");
  const [isNavOpen, setIsNavOpen] = useState(false);
  const registerRef = useRef(null);
  const pageRef = useRef(null);
  const heroVisualRef = useRef(null);
  const scrollRailRef = useRef(null);
  const activeSectionRef = useRef("current-home");
  const heroPointerRef = useRef({ x: 0.5, y: 0.5 });
  const heroPointerFrame = useRef(0);
  const registerPointerRef = useRef({ x: 0.5, y: 0.34 });
  const registerPointerFrame = useRef(0);
  const goBack = () => onBack?.();
  const previewUrl = preview === "matrix" ? MATRIX_EMBED_URL : REGISTRATION_FORM_EMBED_URL;
  const previewTitle = preview === "matrix" ? "MAXMUN Matrix Preview" : "MAXMUN Registration Form Preview";
  const featured = currentCommittees.find((item) => item.acronym === featuredCommittee) || currentCommittees[0];

  const smoothTo = (id) => {
    activeSectionRef.current = id;
    setActiveSection(id);
    smoothScrollToId(id, 92);
    window.history.replaceState(null, "", `#${id}`);
    setIsNavOpen(false);
  };

  const updateRegisterPointer = (section, x, y) => {
    section.style.setProperty("--scan-x", `${Math.round(x * 1000) / 10}%`);
    section.style.setProperty("--scan-y", `${Math.round(y * 1000) / 10}%`);
    section.style.setProperty("--card-tilt-x", `${Math.round((0.5 - y) * 54) / 10}deg`);
    section.style.setProperty("--card-tilt-y", `${Math.round((x - 0.5) * 68) / 10}deg`);
    section.style.setProperty("--field-x", `${Math.round((x - 0.5) * 24)}px`);
    section.style.setProperty("--field-y", `${Math.round((y - 0.5) * 18)}px`);
  };

  const updateHeroPointer = (visual, x, y) => {
    visual.style.setProperty("--deck-x", `${Math.round((x - 0.5) * 18)}px`);
    visual.style.setProperty("--deck-y", `${Math.round((y - 0.5) * 12)}px`);
    visual.style.setProperty("--deck-tilt-x", `${Math.round((0.5 - y) * 40) / 10}deg`);
    visual.style.setProperty("--deck-tilt-y", `${Math.round((x - 0.5) * 52) / 10}deg`);
    visual.style.setProperty("--deck-glow-x", `${Math.round(x * 100)}%`);
    visual.style.setProperty("--deck-glow-y", `${Math.round(y * 100)}%`);
  };

  const handleHeroPointerMove = (event) => {
    const visual = heroVisualRef.current || event.currentTarget;
    const rect = visual.getBoundingClientRect();
    const x = Math.min(0.92, Math.max(0.08, (event.clientX - rect.left) / Math.max(1, rect.width)));
    const y = Math.min(0.9, Math.max(0.1, (event.clientY - rect.top) / Math.max(1, rect.height)));
    heroPointerRef.current = { x, y };
    if (heroPointerFrame.current) return;
    heroPointerFrame.current = requestAnimationFrame(() => {
      heroPointerFrame.current = 0;
      const latest = heroPointerRef.current;
      updateHeroPointer(visual, latest.x, latest.y);
    });
  };

  const handleHeroPointerLeave = () => {
    const visual = heroVisualRef.current;
    if (!visual) return;
    if (heroPointerFrame.current) {
      cancelAnimationFrame(heroPointerFrame.current);
      heroPointerFrame.current = 0;
    }
    updateHeroPointer(visual, 0.5, 0.5);
  };

  const handleRegisterPointerMove = (event) => {
    const section = registerRef.current || event.currentTarget;
    const rect = section.getBoundingClientRect();
    const x = Math.min(0.94, Math.max(0.06, (event.clientX - rect.left) / Math.max(1, rect.width)));
    const y = Math.min(0.88, Math.max(0.12, (event.clientY - rect.top) / Math.max(1, rect.height)));
    registerPointerRef.current = { x, y };
    if (registerPointerFrame.current) return;
    registerPointerFrame.current = requestAnimationFrame(() => {
      registerPointerFrame.current = 0;
      const latest = registerPointerRef.current;
      updateRegisterPointer(section, latest.x, latest.y);
    });
  };

  const handleRegisterPointerLeave = () => {
    const section = registerRef.current;
    if (!section) return;
    if (registerPointerFrame.current) {
      cancelAnimationFrame(registerPointerFrame.current);
      registerPointerFrame.current = 0;
    }
    updateRegisterPointer(section, 0.5, 0.34);
  };

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      forceScrollTop();
      setTimeout(() => smoothTo(hash), 140);
    } else {
      forceScrollTop();
    }
  }, []);

  useEffect(() => () => {
    if (registerPointerFrame.current) cancelAnimationFrame(registerPointerFrame.current);
    if (heroPointerFrame.current) cancelAnimationFrame(heroPointerFrame.current);
  }, []);

  useEffect(() => {
    const sectionIds = ["current-home", ...CURRENT_NAV_ITEMS.map(([id]) => id), "current-contact"];
    let ticking = false;
    let lastProgress = -1;
    let lastProgressWrite = 0;
    let sectionStops = [];

    const refreshSectionStops = () => {
      sectionStops = sectionIds
        .map((id) => {
          const element = document.getElementById(id);
          return element ? { id, top: element.offsetTop } : null;
        })
        .filter(Boolean);
    };

    const updateActive = () => {
      let nextId = activeSectionRef.current;
      let bestDistance = Number.POSITIVE_INFINITY;
      const anchor = window.scrollY + 120;

      for (const stop of sectionStops) {
        const distance = Math.abs(stop.top - anchor);
        if (distance < bestDistance) {
          bestDistance = distance;
          nextId = stop.id;
        }
      }

      if (nextId && nextId !== activeSectionRef.current) {
        activeSectionRef.current = nextId;
        setActiveSection(nextId);
      }

      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const nextProgress = Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100));
      const now = performance.now();
      if (Math.abs(nextProgress - lastProgress) > 0.6 && now - lastProgressWrite > 42) {
        lastProgress = nextProgress;
        lastProgressWrite = now;
        scrollRailRef.current?.style.setProperty("--scroll-progress", `${nextProgress.toFixed(1)}%`);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateActive);
      }
    };

    const onResize = () => {
      refreshSectionStops();
      updateActive();
    };

    refreshSectionStops();
    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    const refreshTimer = window.setTimeout(onResize, 600);
    return () => {
      window.clearTimeout(refreshTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll(".cm-section"));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("cm-in-view");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "-6% 0px -10% 0px", threshold: 0.1 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Real cursor-tracking eyes: pupils smoothly follow the pointer anywhere on
  // screen (not just at the extremes), clamped inside the eye shape, using
  // requestAnimationFrame + lerp for silky, non-jumpy motion. Falls back to the
  // original idle sweep animation on touch devices or prefers-reduced-motion.
  useEffect(() => {
    const page = pageRef.current;
    if (!page) return undefined;

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reducedMotion) return undefined;

    page.classList.add("cm-eye-live");

    const heads = Array.from(page.querySelectorAll(".cm-section[data-scene] .cm-section-head"));
    const scanners = Array.from(page.querySelectorAll(".cm-access-scanner"));
    if (!heads.length && !scanners.length) return undefined;

    const headState = heads.map((el) => ({ el, cx: 0, cy: 0, tx: 0, ty: 0, visible: false, xProp: "--pupil-tx", yProp: "--pupil-ty", maxX: 22, maxY: 7, bias: 0.42 }));
    const scannerState = scanners.map((el) => ({ el, cx: 0, cy: 0, tx: 0, ty: 0, visible: false, xProp: "--iris-tx", yProp: "--iris-ty", maxX: 44, maxY: 16, bias: 0.5 }));
    const state = [...headState, ...scannerState];
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight * 0.3, active: false };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const item = state.find((s) => s.el === entry.target);
          if (!item) return;
          item.visible = entry.isIntersecting;
          if (entry.isIntersecting) {
            item.measured = false;
            // reveal transitions translate ancestors; settle then re-measure
            window.setTimeout(() => { item.measured = false; }, 1000);
          }
        });
      },
      { rootMargin: "120px 0px 120px 0px", threshold: 0 }
    );
    state.forEach((item) => io.observe(item.el));

    const onPointerMove = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerout", onPointerLeave, { passive: true });

    const LERP = 0.16; // smoothing factor: higher = snappier, lower = floatier

    // Cache element geometry in document coordinates so the rAF loop never
    // reads layout (getBoundingClientRect per frame forces synchronous
    // reflow after the style writes below — the old source of jank).
    const measure = (item) => {
      const rect = item.el.getBoundingClientRect();
      item.docX = rect.left + rect.width / 2;
      item.docY = rect.top + window.scrollY + rect.height * item.bias;
      item.measured = true;
    };
    const remeasureAll = () => state.forEach((item) => { item.measured = false; });
    window.addEventListener("resize", remeasureAll, { passive: true });

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const scrollY = window.scrollY;
      for (let i = 0; i < state.length; i += 1) {
        const item = state[i];
        if (!item.visible) continue;
        if (!item.measured) measure(item);
        const centerX = item.docX;
        const centerY = item.docY - scrollY;

        if (pointer.active) {
          const dx = pointer.x - centerX;
          const dy = pointer.y - centerY;
          const dist = Math.max(1, Math.hypot(dx, dy));
          const reach = Math.min(1, dist / 260);
          item.tx = (dx / dist) * item.maxX * reach;
          item.ty = (dy / dist) * item.maxY * reach;
        } else {
          item.tx = 0;
          item.ty = 0;
        }

        item.cx += (item.tx - item.cx) * LERP;
        item.cy += (item.ty - item.cy) * LERP;

        item.el.style.setProperty(item.xProp, `${item.cx.toFixed(2)}px`);
        item.el.style.setProperty(item.yProp, `${item.cy.toFixed(2)}px`);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerout", onPointerLeave);
      window.removeEventListener("resize", remeasureAll);
      page.classList.remove("cm-eye-live");
    };
  }, []);

  return (
    <div ref={pageRef} className="cm-page" style={{ "--scroll-progress": "0%" }}>
      <style>{CURRENT_MUN_STYLES}</style>
      {/* CinematicCanvas + cm-page-aurora retired: the global GoatedFX layer
          (starfield, aurora, spotlight) already supplies the ambience at a
          fraction of the cost — one canvas instead of two plus a blurred div. */}
      <nav className={`cm-nav cm-nav-pill${isNavOpen ? " cm-nav-open" : ""}`}>
        <button className="cm-brand cm-brand-btn" onClick={() => smoothTo("current-home")}>MAXMUN <span>3.0</span></button>
        <button 
          className={`cm-hamburger${isNavOpen ? " cm-hamburger-active" : ""}`}
          onClick={() => setIsNavOpen(!isNavOpen)}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className={`cm-links${isNavOpen ? " cm-links-open" : ""}`}>
          {CURRENT_NAV_ITEMS.map(([id, label]) => (
            <button
              key={id}
              className={`${activeSection === id ? "active" : ""}${id === "current-register" ? " cm-keep" : ""}`}
              onClick={() => smoothTo(id)}
            >
              {label}
            </button>
          ))}
          <button className="cm-back" onClick={goBack}>Back to Main</button>
        </div>
      </nav>
      <aside ref={scrollRailRef} className="cm-scroll-rail" aria-label="Current MUN page sections">
        <div className="cm-scroll-meter"><span /></div>
        <button className={activeSection === "current-home" ? "active" : ""} onClick={() => smoothTo("current-home")}>00</button>
        {CURRENT_NAV_ITEMS.map(([id], index) => (
          <button key={id} className={activeSection === id ? "active" : ""} onClick={() => smoothTo(id)}>
            {String(index + 1).padStart(2, "0")}
          </button>
        ))}
      </aside>

      <ReactiveHero smoothTo={smoothTo} />
      <div className="cm-signal-strip" aria-hidden="true">
        <div className="cm-signal-track">
          <span>Registration Open</span><span>Matrix Live</span><span>7 Committees</span><span>250+ Past Delegates</span><span>Cash Prizes</span><span>Senior Conference</span>
          <span>Registration Open</span><span>Matrix Live</span><span>7 Committees</span><span>250+ Past Delegates</span><span>Cash Prizes</span><span>Senior Conference</span>
        </div>
      </div>

      <section className="cm-section" id="current-about" data-section="01" data-scene="Origin">
        <div className="cm-inner" data-scene="Origin">
          <div className="cm-section-head">
            <div className="cm-label">About the Edition</div>
            <h2 className="cm-h2">What is <span>MAXMUN 3.0?</span></h2>
            <p className="cm-lead">
              MAXMUN 3.0 is the current conference edition of Maxfort School Dwarka's Model United Nations.
              This page keeps the latest edition information separate from the main legacy website, so senior delegates can quickly access the active conference details in one focused place.
            </p>
          </div>
          <div className="cm-about-stage">
            <div className="cm-about-radar" aria-hidden="true">
              <div className="cm-radar-ring ring-a" />
              <div className="cm-radar-ring ring-b" />
              <div className="cm-radar-core">3.0</div>
              <span className="cm-radar-node node-a">Register</span>
              <span className="cm-radar-node node-b">Matrix</span>
              <span className="cm-radar-node node-c">Awards</span>
              <span className="cm-radar-node node-d">Schedule</span>
            </div>
            <div className="cm-stats">
              <div className="cm-stat"><strong>250+</strong><span>Past Delegates</span></div>
              <div className="cm-stat"><strong>2</strong><span>Conference Days</span></div>
              <div className="cm-stat"><strong>Delhi</strong><span>Region</span></div>
              <div className="cm-stat"><strong>7</strong><span>Committees</span></div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="cm-section alt cm-reg-feature"
        id="current-register"
        data-section="02"
        data-scene="Access"
        ref={registerRef}
        onPointerMove={handleRegisterPointerMove}
        onPointerLeave={handleRegisterPointerLeave}
      >
        <div className="cm-inner" data-scene="Access">
          <div className="cm-section-head">
            <div className="cm-access-scanner" aria-hidden="true">
              <span className="cm-scanner-ring ring-a" />
              <span className="cm-scanner-ring ring-b" />
              <span className="cm-scanner-iris" />
              <span className="cm-scanner-beam" />
              <span className="cm-scanner-readout readout-left">TRACK</span>
              <span className="cm-scanner-readout readout-right">SYNC</span>
            </div>
            <div className="cm-label">Live Access</div>
            <h2 className="cm-h2">Register & <span>Preview Matrix</span></h2>
            <p className="cm-lead">
              Public registrations are open. Use the official form to register, then check the matrix to choose an available portfolio/country before final submission.
            </p>
          </div>
          <div className="cm-live-grid">
            <div className="cm-live-card">
              <div className="cm-reg-badge" style={{ borderColor: "rgba(200,169,110,.55)", background: "rgba(200,169,110,.12)", color: "#c8a96e" }}>Open Public Access</div>
              <h3>Registration <span>Hub</span></h3>
              <p>
                Complete the official MAXMUN registration form and cross-check your committee preference through the matrix before final submission.
              </p>
              <div className="cm-access-console" aria-label="Registration workflow">
                <div className="cm-access-node node-form"><span>01</span><strong>Form</strong><small>Delegate data</small></div>
                <div className="cm-access-line" />
                <div className="cm-access-node node-matrix"><span>02</span><strong>Matrix</strong><small>Portfolio check</small></div>
                <div className="cm-access-line" />
                <div className="cm-access-node node-seat"><span>03</span><strong>Seat</strong><small>Final review</small></div>
              </div>
              <div className="cm-action-row">
                <ExternalLinkButton className="cm-btn primary" href={REGISTRATION_FORM_URL}>Open Form</ExternalLinkButton>
                <ExternalLinkButton className="cm-btn" href={MATRIX_FULL_URL}>Open Matrix</ExternalLinkButton>
                <button className="cm-btn" onClick={() => smoothTo("current-preview")}>Review Preview</button>
                <button className="cm-btn" onClick={() => smoothTo("current-committees")}>View Agendas</button>
              </div>
              <div className="cm-steps">
                {participationSteps.map(([num, title, text]) => (
                  <div className="cm-step-card" key={num}>
                    <div className="cm-step-num">{num}</div>
                    <h4>{title}</h4>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
              <div className="cm-note">
                Registration Fees: <strong style={{ color: "#c8a96e" }}>₹2,000 per delegate</strong>. Countries/portfolios highlighted as taken in the matrix may no longer be available.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cm-section cm-preview-feature" id="current-preview" data-section="03" data-scene="Matrix">
        <div className="cm-inner" data-scene="Matrix">
          <div className="cm-section-head">
            <div className="cm-label">Live Review</div>
            <h2 className="cm-h2">Matrix & <span>Form Preview</span></h2>
            <p className="cm-lead">
              Review the allocation matrix in a wide view, then switch to the registration form in a compact frame sized for form reading.
            </p>
          </div>
          <div className="cm-preview-dock" aria-hidden="true">
            <span>Wide Matrix Bay</span>
            <span>Compact Form Bay</span>
            <span>Fullscreen Review</span>
          </div>
          <div className="cm-preview-stage">
            <MatrixPreview
              preview={preview}
              previewTitle={previewTitle}
              previewUrl={previewUrl}
              onPreviewChange={setPreview}
              onExpand={() => setExpandedPreview(true)}
            />
          </div>
        </div>
      </section>

      <section className="cm-section alt" id="current-committees" data-section="04" data-scene="Arena">
        <div className="cm-inner" data-scene="Arena">
          <div className="cm-section-head">
            <div className="cm-label">The Arena</div>
            <h2 className="cm-h2">Current <span>Committees</span></h2>
            <p className="cm-lead">Choose your battlefield. These are the finalised MAXMUN 3.0 committees and agendas extracted from the official conference material.</p>
          </div>
          <div className="cm-committee-holo" aria-hidden="true">
            <div><strong>7</strong><span>Live rooms</span></div>
            <div><strong>Agenda</strong><span>Locked briefings</span></div>
            <div><strong>Matrix</strong><span>Portfolio routing</span></div>
          </div>
          <div className="cm-committee-console">
            <div className="cm-committee-nav" aria-label="Committee quick navigation">
              {currentCommittees.map((com) => (
                <button
                  key={com.acronym}
                  className={featuredCommittee === com.acronym ? "active" : ""}
                  onClick={() => setFeaturedCommittee(com.acronym)}
                >
                  {com.acronym}
                </button>
              ))}
            </div>
            {featured && (
              <article className="cm-committee-spotlight">
                <div className="cm-spotlight-code">{featured.acronym}</div>
                <div>
                  <div className="cm-pill">{featured.level}</div>
                  <h3>{featured.name}</h3>
                  <p>{featured.overview}</p>
                  <p><strong>Agenda:</strong> {featured.agenda}</p>
                </div>
              </article>
            )}
          </div>
          <div className="cm-card-grid enhanced">
            {currentCommittees.map((com) => (
              <article
                className={`cm-card${featuredCommittee === com.acronym ? " active" : ""}`}
                key={com.acronym}
                onClick={() => setFeaturedCommittee(com.acronym)}
              >
                <div className="cm-card-top"><div className="cm-acronym">{com.acronym}</div><div className="cm-pill">{com.level}</div></div>
                <h3>{com.name}</h3>
                <p><strong>Agenda:</strong> {com.agenda}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cm-section cm-experience-feature" id="current-perks" data-section="05" data-scene="Experience">
        <div className="cm-inner" data-scene="Experience">
          <div className="cm-section-head">
            <div className="cm-label">Delegate Experience</div>
            <h2 className="cm-h2">The <span>Experience</span></h2>
            <p className="cm-lead">
              Built for delegates who want more than a committee seat: sharp debate rooms, polished resources,
              social energy, and awards that make the weekend feel properly alive.
            </p>
          </div>
          <div className="cm-experience-hero">
            <div>
              <div className="cm-experience-kicker">Why delegates remember it</div>
              <h3>Debate, recognition, socials, and a clean conference flow in one senior edition.</h3>
            </div>
            <div className="cm-experience-metrics" aria-label="Delegate experience highlights">
              <div><strong>250+</strong><span>Past Delegates</span></div>
              <div><strong>7</strong><span>Live Committees</span></div>
              <div><strong>2</strong><span>Power Days</span></div>
            </div>
          </div>
          <div className="cm-perks">
            {currentPerks.map(([icon, title, description], index) => (
              <div className="cm-perk" key={title}>
                <div className="cm-perk-num">{String(index + 1).padStart(2, "0")}</div>
                <div className="cm-perk-ico">{icon}</div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cm-section alt" id="current-awards" data-section="06" data-scene="Awards">
        <div className="cm-inner" data-scene="Awards">
          <div className="cm-section-head">
            <div className="cm-label">Awards & Cash Prizes</div>
            <h2 className="cm-h2">Recognition <span>Track</span></h2>
            <p className="cm-lead">Committee-wise award structure, plus special recognitions and best school delegation.</p>
          </div>
          <div className="cm-awards-podium" aria-hidden="true">
            <div className="podium-side"><span>High Comm.</span><strong>Track</strong></div>
            <div className="podium-main"><span>Best Delegate</span><strong>Cash + Trophy</strong></div>
            <div className="podium-side"><span>Specials</span><strong>School</strong></div>
          </div>
          <div className="cm-awards-grid">
            {currentAwards.map((item) => (
              <div className="cm-award-card" key={item.committee}>
                <div className="cm-award-title">{item.committee}</div>
                <div className="cm-award-row"><strong>Best Delegate</strong><span>{item.best}</span></div>
                <div className="cm-award-row"><strong>High Commendation</strong><span>{item.high}</span></div>
              </div>
            ))}
          </div>
          <div className="cm-special-awards">
            {specialAwards.map(([title, reward]) => (
              <div className="cm-special" key={title}><strong>{title}</strong><span>{reward}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="cm-section alt" id="current-schedule" data-section="07" data-scene="Timeline">
        <div className="cm-inner" data-scene="Timeline">
          <div className="cm-section-head">
            <div className="cm-label">Senior Timeline</div>
            <h2 className="cm-h2">Senior Conference <span>Flow</span></h2>
          </div>
          <div className="cm-flow-map" aria-hidden="true">
            <span>Opening</span>
            <span>Committee Sessions</span>
            <span>Awards</span>
          </div>
          <div className="cm-schedule">
            {currentSchedule.map((day) => (
              <div key={day.day}>
                <div className="cm-day-title">{day.day}<br /><small style={{ color: "rgba(255,255,255,.55)", fontSize: ".9rem" }}>{day.date}</small></div>
                <div className="cm-timeline">
                  {day.events.map(([time, event]) => (
                    <div className="cm-timeline-card" key={day.day + time + event}>
                      <div className="cm-time">{time}</div>
                      <div className="cm-event">{event}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cm-section" id="current-contact" data-section="08" data-scene="Support">
        <div className="cm-inner" data-scene="Support">
          <div className="cm-section-head">
            <div className="cm-label">Contact & Support</div>
            <h2 className="cm-h2">Need <span>Help?</span></h2>
            <p className="cm-lead">For registrations and conference information, use the official form. For website or matrix-preview issues, contact IT support.</p>
          </div>
          <FooterContact />
        </div>
      </section>

      {expandedPreview && (
        <div className="cm-focus-view" role="dialog" aria-modal="true" aria-label={previewTitle}>
          <div className="cm-focus-top">
            <div className="cm-focus-title">{previewTitle}</div>
            <div className="cm-focus-actions">
              <a href={preview === "matrix" ? MATRIX_FULL_URL : REGISTRATION_FORM_URL} target="_blank" rel="noopener noreferrer">Open Direct</a>
              <button onClick={() => setExpandedPreview(false)}>Exit</button>
            </div>
          </div>
          <iframe className="cm-focus-frame" title={previewTitle + " Focus View"} src={previewUrl} loading="lazy" />
        </div>
      )}

      <footer className="cm-footer">
        <div className="cm-footer-inner">
          <div>
            <div className="cm-footer-brand">MAXMUN 3.0</div>
            <p>Where debate meets legacy. Current conference details live here; the main website remains the permanent MAXMUN archive.</p>
          </div>
          <div className="cm-footer-links">
            <button onClick={goBack}>← Back to Main Website</button>
            <button onClick={() => smoothTo("current-committees")}>Committees</button>
            <button onClick={() => smoothTo("current-awards")}>Awards</button>
            <button onClick={() => smoothTo("current-schedule")}>Schedule</button>
            <button onClick={() => smoothTo("current-register")}>Register</button>
          </div>
        </div>
        <div className="cm-made-by">Made by <span>Prakhar Bhassin</span> · IT Head, MAXMUN 3.0 Organising Committee</div>
      </footer>
    </div>
  );
}
