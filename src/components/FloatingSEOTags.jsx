import { floatingSeoTags } from "../data/siteData.js";

export default function FloatingSEOTags() {
  return (
    <div className="floating-seo-tags" aria-hidden="true">
      {floatingSeoTags.map((tag) => (
        <span
          className="floating-seo-tag"
          key={tag.label}
          style={{
            "--x": tag.x,
            "--y": tag.y,
            "--delay": tag.delay,
            "--duration": tag.duration,
            "--driftX": tag.driftX,
            "--driftY": tag.driftY,
            "--scale": tag.scale,
          }}
        >
          {tag.label}
        </span>
      ))}
    </div>
  );
}
