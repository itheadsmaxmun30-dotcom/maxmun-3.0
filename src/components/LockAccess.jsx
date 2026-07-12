import FloatingSEOTags from "./FloatingSEOTags.jsx";

export default function LockAccess({ onPrevious, onCurrent }) {
  return (
    <section className="lock-access" aria-label="MAXMUN entry screen">
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
        <div className="lock-kicker">Choose Your Access</div>
        <div className="lock-title">MAX<span>MUN</span></div>
        <p className="lock-text">
          Enter the archive to learn about previous editions, or jump straight into the live MAXMUN 3.0 registration and current conference hub.
        </p>
        <div className="lock-actions">
          <button className="lock-choice" onClick={onPrevious}>
            <strong>Know Previous Versions</strong>
            <span>Explore MaxMUN 1.0 and 2.0 legacy, committees, Executive Boards, and archive.</span>
          </button>
          <button className="lock-choice primary lock-choice-current" onClick={onCurrent}>
            <span className="lock-current-status">Live MAXMUN 3.0 Hub</span>
            <span className="lock-current-head">
              <strong>Register & Explore Current MUN</strong>
              <span className="lock-current-arrow" aria-hidden="true">GO</span>
            </span>
            <span className="lock-current-copy">
              Open registrations, preview the delegate matrix, scan final committees, awards, schedules, and conference support in one polished hub.
            </span>
            <span className="lock-current-pills" aria-hidden="true">
              <span>Form</span>
              <span>Matrix</span>
              <span>7 Committees</span>
            </span>
            <span className="lock-current-stats" aria-hidden="true">
              <span><b>400+</b> Past Delegates</span>
              <span><b>2</b> Days</span>
              <span><b>Rs. 2K</b> Fee</span>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
