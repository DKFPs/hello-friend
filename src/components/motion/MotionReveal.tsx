import { useEffect, useRef, useState, type ReactNode } from "react";

export function MotionReveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={"motion-reveal " + (visible ? "is-visible " : "") + className} style={{ transitionDelay: delay + "ms" }}>{children}</div>;
}
