import { useEffect, useState } from "react";

const ScrollWatcher = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", updateScrollProgress);
    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  return (
    <div
      className="sticky top-0 left-0 h-[4px] z-[1000] origin-left"
      style={{ width: `${scrollProgress}%`, backgroundColor:'#09ff98'}}
    />
  );
};

export default ScrollWatcher;
