import { useEffect, useRef, useState } from "react";

export default function MatrixPreview({ preview, previewTitle, previewUrl, onPreviewChange, onExpand }) {
  const previewMode = preview === "form" ? "cm-preview-form" : "cm-preview-matrix";
  const shellRef = useRef(null);
  const [showFrame, setShowFrame] = useState(false);

  useEffect(() => {
    setShowFrame(false);
    const node = shellRef.current;
    if (!node) return undefined;

    let cancelled = false;
    let timer = 0;
    let inView = false;

    const armFrame = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (cancelled) return;
        if (!inView) return;
        if (document.body.classList.contains("cm-cinematic-scroll")) {
          armFrame();
          return;
        }
        setShowFrame(true);
      }, 520);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting && entry.intersectionRatio > 0.38;
        if (inView) {
          armFrame();
        } else {
          window.clearTimeout(timer);
        }
      },
      { threshold: [0, 0.38, 0.7] }
    );

    observer.observe(node);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [previewUrl]);

  return (
    <div ref={shellRef} className={`cm-preview-shell ${previewMode}`}>
      <div className="cm-preview-tabs">
        <button className={`cm-preview-tab${preview === "matrix" ? " active" : ""}`} onClick={() => onPreviewChange("matrix")}>Matrix Preview</button>
        <button className={`cm-preview-tab${preview === "form" ? " active" : ""}`} onClick={() => onPreviewChange("form")}>Form Preview</button>
      </div>
      {showFrame ? (
        <iframe
          className="cm-preview-frame"
          title={previewTitle}
          src={previewUrl}
          loading="lazy"
        />
      ) : (
        <button className="cm-preview-frame cm-preview-placeholder" type="button" onClick={() => setShowFrame(true)}>
          <span>{previewTitle}</span>
          <strong>Tap to load live preview</strong>
        </button>
      )}
      <div className="cm-preview-footer">
        <button className="cm-preview-expand" onClick={onExpand}>Focus Preview</button>
      </div>
    </div>
  );
}
