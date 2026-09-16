import { useState, useEffect } from 'react';

export interface ScrollState {
  progress: number; // 0.0 to 1.0
  scrollY: number;
  activeAct: 1 | 2 | 3 | 4;
}

export const useScrollProgress = (): ScrollState => {
  const [scrollState, setScrollState] = useState<ScrollState>({
    progress: 0,
    scrollY: 0,
    activeAct: 1
  });

  useEffect(() => {
    let ticking = false;

    const calculateScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;

      // Map progress to Acts:
      // Act 1: 0% - 25% (El Origen)
      // Act 2: 25% - 50% (El Despertar Digital)
      // Act 3: 50% - 75% (El Ecosistema)
      // Act 4: 75% - 100% (El Multiverso)
      let activeAct: 1 | 2 | 3 | 4 = 1;
      if (progress >= 0.72) {
        activeAct = 4;
      } else if (progress >= 0.45) {
        activeAct = 3;
      } else if (progress >= 0.20) {
        activeAct = 2;
      } else {
        activeAct = 1;
      }

      setScrollState({ progress, scrollY, activeAct });
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(calculateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    calculateScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return scrollState;
};
