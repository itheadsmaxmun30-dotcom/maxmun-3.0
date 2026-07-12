import { useEffect, useRef, useState } from "react";
import "./MunRoomIntro.css";

const FILM_SRC = "/intro-mun.mp4"; // real MAXMUN committee footage, 11.07s, 1080p
const SCORE_SRC = "/intro-score.mp3"; // Let Me Drive (funk edit) — drop cut
const DIPLOMACY_AT = 4.36; // cut into the raised-placard shot
const DOMINATE_AT = 8.92; // cut into the committee-wide shot
const TUNNEL_AT = 10.42; // the baked spin-out begins at ~10.47 in the film
const FILM_STALL_DEADLINE = 5500; // ms for playback to actually begin
const MASTER_DEADLINE = 26000; // hard cap for the whole intro
const FALLBACK_HOLD = 2400;

const HUD_LABELS = {
  film: "Committee in session",
  tunnel: "Entering MAXMUN",
  fallback: "The Renaissance Edition",
};

const WORDS = {
  debate: { label: "Debate", index: "01" },
  diplomacy: { label: "Diplomacy", index: "02" },
  dominate: { label: "Dominate", index: "03" },
};

const PORTAL_RAYS = Array.from({ length: 24 }, (_, index) => ({
  angle: index * 15 + (index % 3) * 2.4,
  delay: (index % 6) * 0.035,
  length: 0.72 + (index % 5) * 0.12,
}));

export default function MunRoomIntro({ onComplete }) {
  const [phase, setPhase] = useState("film"); // film → tunnel (or fallback)
  const [word, setWord] = useState("");
  const [audioOn, setAudioOn] = useState(false);
  const [ending, setEnding] = useState(false);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const audioOnRef = useRef(false);
  const completed = useRef(false);
  const started = useRef(false);
  const rolling = useRef(false);
  const warped = useRef(false);
  const timers = useRef([]);
  const landingTimer = useRef(0);
  const fadeTimer = useRef(0);
  const rafId = useRef(0);
  const phaseRef = useRef("film");
  phaseRef.current = phase;

  const later = (fn, ms) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  };

  const finish = (delay = 520, fade = true) => {
    if (completed.current) return;
    completed.current = true;
    if (fade) setEnding(true); // tunnel path skips the fade — it hands over at full white
    cancelAnimationFrame(rafId.current);
    const score = audioRef.current;
    if (score && !score.paused) {
      fadeTimer.current = window.setInterval(() => {
        score.volume = Math.max(0, score.volume - 0.16);
        if (score.volume <= 0.02) {
          window.clearInterval(fadeTimer.current);
          score.pause();
        }
      }, 70);
    }
    // the site "arrives" out of the tunnel: gfx burst + a settle-zoom on the page
    document.documentElement.classList.add("gfx-landing", "mun-warp-in");
    landingTimer.current = window.setTimeout(() => {
      document.documentElement.classList.remove("gfx-landing", "mun-warp-in");
    }, 2200);
    later(() => {
      try {
        videoRef.current?.pause(); // only now — the baked spin-out must play to its end
      } catch {
        /* noop */
      }
      onComplete?.();
    }, delay);
  };

  const enterTunnel = () => {
    if (warped.current || completed.current) return;
    warped.current = true;
    cancelAnimationFrame(rafId.current);
    setPhase("tunnel");
    later(() => finish(820, true), 940); // reveal the moving page beneath the portal's white horizon
  };

  const fallback = () => {
    if (completed.current || warped.current) return;
    setPhase("fallback");
    later(() => finish(480), FALLBACK_HOLD);
  };

  const tick = () => {
    if (completed.current || warped.current) return;
    const film = videoRef.current;
    if (film && phaseRef.current === "film") {
      const t = film.currentTime;
      if (t >= TUNNEL_AT) {
        enterTunnel();
        return;
      }
      setWord(t >= DOMINATE_AT ? "dominate" : t >= DIPLOMACY_AT ? "diplomacy" : "debate");
    }
    rafId.current = requestAnimationFrame(tick);
  };

  const tryScore = (syncToFilm) => {
    if (audioOnRef.current || completed.current) return;
    const score = audioRef.current;
    if (!score) return;
    if (syncToFilm && videoRef.current) {
      try {
        score.currentTime = Math.min(videoRef.current.currentTime, 14);
      } catch {
        /* not seekable yet */
      }
    }
    const granted = () => {
      audioOnRef.current = true;
      setAudioOn(true);
    };
    const playback = score.play();
    if (playback?.then) playback.then(granted).catch(() => {});
    else granted();
  };

  const startFilm = () => {
    if (started.current || completed.current) return;
    const film = videoRef.current;
    if (!film) {
      fallback();
      return;
    }
    started.current = true;
    tryScore(false); // usually blocked before a tap — the chip handles that
    const playback = film.play();
    const onRolling = () => {
      rolling.current = true;
      setWord("debate");
      rafId.current = requestAnimationFrame(tick);
    };
    if (playback?.then) {
      playback.then(onRolling).catch(() => {
        started.current = false; // retry on canplay
      });
    } else onRolling();
  };

  const handleTap = (event) => {
    if (event.target.closest(".mun-intro__skip")) return;
    if (phaseRef.current === "film" && !audioOn) tryScore(true);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("mun-intro-active");
    if (audioRef.current) audioRef.current.volume = 0.9;

    startFilm();
    later(() => tryScore(false), 1200); // retry once the mp3 is likely buffered
    later(() => {
      if (!rolling.current) fallback();
    }, FILM_STALL_DEADLINE);
    later(() => finish(320), MASTER_DEADLINE);

    // any real gesture anywhere — click, tap, or key — flips the sound on instantly
    const onAnyKey = () => tryScore(true);
    window.addEventListener("keydown", onAnyKey, { capture: true });

    return () => {
      window.removeEventListener("keydown", onAnyKey, { capture: true });
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
      cancelAnimationFrame(rafId.current);
      window.clearInterval(fadeTimer.current);
      root.classList.remove("mun-intro-active");
      if (!completed.current) {
        window.clearTimeout(landingTimer.current);
        root.classList.remove("gfx-landing", "mun-warp-in");
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      className={`mun-intro is-${phase}${ending ? " is-ending" : ""}`}
      onPointerDown={handleTap}
      aria-label="MAXMUN cinematic intro — committee footage from previous editions"
    >
      <div className="mun-intro__void" aria-hidden="true" />

      <video
        ref={videoRef}
        className="mun-intro__film"
        src={FILM_SRC}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        onCanPlay={startFilm}
        onTimeUpdate={(event) => {
          if (event.currentTarget.currentTime >= TUNNEL_AT) enterTunnel();
        }}
        onEnded={enterTunnel}
        onError={() => {
          if (rolling.current) enterTunnel();
          else fallback();
        }}
      />
      <audio
        ref={audioRef}
        src={SCORE_SRC}
        preload="auto"
        aria-hidden="true"
        onCanPlayThrough={() => tryScore(false)}
      />

      <div className="mun-intro__treatment" aria-hidden="true" />
      <div className="mun-intro__grain" aria-hidden="true" />

      <div className="mun-intro__tunnel" aria-hidden="true">
        <div className="mun-intro__portal-rings"><b /><b /><b /><b /></div>
        <div className="mun-intro__rays">
          {PORTAL_RAYS.map((ray, index) => (
            <i
              key={index}
              style={{
                "--ray-angle": `${ray.angle}deg`,
                "--ray-delay": `${ray.delay}s`,
                "--ray-length": ray.length,
              }}
            />
          ))}
        </div>
        <div className="mun-intro__portal-core"><i /></div>
        <div className="mun-intro__warp-grid" />
        <div className="mun-intro__tunnel-field"><i /><i /><i /><i /><i /></div>
      </div>

      <div className="mun-intro__hud" aria-hidden="true">
        <span>MAXMUN / 03</span>
        <span className="mun-intro__hud-line"><i /></span>
        <span>{HUD_LABELS[phase]}</span>
      </div>

      {(phase === "film" || phase === "tunnel") && word && (
        <div className="mun-intro__word" data-w={word} key={word} aria-hidden="true">
          <small>{WORDS[word].index} / 03</small>
          <strong>{WORDS[word].label}</strong>
        </div>
      )}

      {phase === "fallback" && (
        <div className="mun-intro__crest" aria-hidden="true">
          <img src="/maxmun-logo-transparent.png" alt="" width="512" height="512" />
          <strong>MAX<span>MUN</span></strong>
          <small>THE RENAISSANCE EDITION · 2026</small>
        </div>
      )}

      <div className="mun-intro__flash" aria-hidden="true" />

      {phase === "film" && !audioOn && (
        <button className="mun-intro__chip" type="button" onClick={() => tryScore(true)}>
          <span aria-hidden="true">♪</span> Sound on
        </button>
      )}

      <div className="mun-intro__source">Footage · MAXMUN archives</div>

      <button className="mun-intro__skip" type="button" onClick={() => finish(240)}>
        Skip intro <span aria-hidden="true">↗</span>
      </button>
    </section>
  );
}
