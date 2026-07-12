import { useState } from "react";
import FloatingSEOTags from "./FloatingSEOTags.jsx";

export default function LockAccess({ onPrevious, onCurrent }) {
  const [entering, setEntering] = useState(false);

  const enter = () => {
    if (entering) return;
    setEntering(true);
    // second dispatch as the gate fades: the gate background is opaque, so
    // the starfield hyperspace must fire again to be visible over the hero
    try { window.dispatchEvent(new CustomEvent("gfx-warp")); } catch { /* effects are optional */ }
    setTimeout(() => {
      try { window.dispatchEvent(new CustomEvent("gfx-warp")); } catch { /* ignore */ }
    }, 1150);
    setTimeout(() => onPrevious?.(), 1900);
  };

  return (
    <section className={`lock-access${entering ? " entering" : ""}`} aria-label="MAXMUN entry screen">
      <div className="lock-access-mesh" aria-hidden="true" />
      <div className="lock-access-rings" aria-hidden="true" />
      <div className="lock-holo-field" aria-hidden="true">
        <span className="lock-holo-object cube" />
        <span className="lock-holo-object cube small" />
        <span className="lock-holo-object orb" />
        <span className="lock-holo-object ring" />
        <span className="lock-holo-object prism" />
        <span className="lock-holo-object shard" />
      </div>
      <FloatingSEOTags />

      <div className="lock-warp" aria-hidden="true">
        <span className="lock-warp-stars s1" />
        <span className="lock-warp-stars s2" />
        <span className="lock-warp-stars s3" />
        <i /><i /><i /><i /><i /><i /><i /><i />
        <span className="lock-warp-burst" />
      </div>
      <div className="lock-warp-chroma chroma-a" aria-hidden="true" />
      <div className="lock-warp-chroma chroma-b" aria-hidden="true" />
      <div className="lock-warp-flash" aria-hidden="true" />

      <div className="lock-access-card">
        <div className="lock-access-top">
          <div className="lock-logo-shell">
            <img className="lock-logo" src="/maxmun-crest-centered.png" alt="MAXMUN crest" />
          </div>
          <div className="lock-edition-mark">
            <span>MaxMUN 3.0</span>
            <strong>The Renaissance Edition</strong>
            <em>The Rebirth</em>
          </div>
        </div>
        <div className="lock-kicker">Maxfort School Dwarka Presents</div>
        <div className="lock-title">MAX<span>MUN</span></div>
        <p className="lock-text">
          One gateway to the complete MAXMUN universe — live MAXMUN 3.0 registration, the delegate
          matrix, final committees, awards, and the legacy archive of every edition.
        </p>
        <div className="lock-enter-wrap">
          <button className="lock-enter-btn" onClick={enter} disabled={entering}>
            <span className="lock-enter-orbit" aria-hidden="true" />
            <span className="lock-enter-eyebrow">Initialize</span>
            <strong>ENTER</strong>
            <span className="lock-enter-sub">MAXMUN Universe</span>
          </button>
          <div className="lock-enter-hint">Registration · Matrix · Committees · Legacy Archive</div>
        </div>
      </div>
    </section>
  );
}
