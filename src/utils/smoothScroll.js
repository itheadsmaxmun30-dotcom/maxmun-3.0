let scrollAnimationFrame = null;
let scrollRunId = 0;
let scrollCleanupTimer = null;

export function smoothScrollToId(id, offset = 90) {
  const el = document.getElementById(id);
  if (!el) return;

  if (scrollAnimationFrame) {
    cancelAnimationFrame(scrollAnimationFrame);
  }
  if (scrollCleanupTimer) window.clearTimeout(scrollCleanupTimer);
  document.body.classList.remove("cm-cinematic-scroll");

  const runId = ++scrollRunId;
  const start = window.scrollY;
  const target = el.getBoundingClientRect().top + window.scrollY - offset;
  const distance = target - start;

  if (Math.abs(distance) < 8) {
    window.scrollTo(0, target);
    return;
  }

  document.body.classList.add("cm-cinematic-scroll");
  const duration = Math.min(3600, Math.max(780, Math.abs(distance) * 0.62));
  const startTime = performance.now();
  const frameGap = Math.abs(distance) > 1800
    ? 54
    : Math.abs(distance) > 900
      ? 42
      : Math.abs(distance) > 520
        ? 30
      : 16;
  let lastStep = 0;

  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function frame(now) {
    if (now - lastStep < frameGap) {
      scrollAnimationFrame = requestAnimationFrame(frame);
      return;
    }
    lastStep = now;
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = easeInOutCubic(progress);
    window.scrollTo(0, start + distance * eased);
    if (progress < 1 && runId === scrollRunId) {
      scrollAnimationFrame = requestAnimationFrame(frame);
    } else if (runId === scrollRunId) {
      scrollAnimationFrame = null;
      document.body.classList.remove("cm-cinematic-scroll");
    }
  }

  scrollAnimationFrame = requestAnimationFrame(frame);
}

export function forceScrollTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}
