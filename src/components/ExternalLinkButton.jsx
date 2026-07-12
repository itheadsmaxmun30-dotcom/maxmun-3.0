export default function ExternalLinkButton({ href, className = "", children, ...props }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...props}>
      {children}
    </a>
  );
}
