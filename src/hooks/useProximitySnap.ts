import { useEffect } from 'react';

export const useProximitySnap = () => {
  useEffect(() => {
    let scrollTimer: number | undefined;
    let snapFallbackTimer: number | undefined;
    let animationFrameId: number | undefined;
    let snapInProgress = false;
    let skipNextSnap = false;

    const finishSnap = () => {
      if (!snapInProgress) return;
      snapInProgress = false;
      if (scrollTimer !== undefined) window.clearTimeout(scrollTimer);
      if (snapFallbackTimer !== undefined) window.clearTimeout(snapFallbackTimer);
      if (animationFrameId !== undefined) window.cancelAnimationFrame(animationFrameId);
    };

    const cancelSnapForUserInput = () => {
      if (!snapInProgress) return;
      snapInProgress = false;
      skipNextSnap = true;
      if (scrollTimer !== undefined) window.clearTimeout(scrollTimer);
      if (snapFallbackTimer !== undefined) window.clearTimeout(snapFallbackTimer);
      if (animationFrameId !== undefined) window.cancelAnimationFrame(animationFrameId);
    };

    const handleScroll = () => {
      if (scrollTimer !== undefined) window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        if (snapInProgress) {
          finishSnap();
          return;
        }
        if (skipNextSnap) {
          skipNextSnap = false;
          return;
        }

        const viewportHeight = window.innerHeight;
        const footer = document.querySelector<HTMLElement>('footer');
        const footerRect = footer?.getBoundingClientRect();
        const footerVisibleHeight = footerRect
          ? Math.max(0, Math.min(footerRect.bottom, viewportHeight) - Math.max(footerRect.top, 0))
          : 0;
        const footerVisibilityRatio = footerRect && footerRect.height > 0
          ? footerVisibleHeight / footerRect.height
          : 0;
        const footerIsMostlyVisible = footerVisibilityRatio >= 0.3;
        let closestSectionTop: number | null = null;
        // Use the tighter 5% threshold only once at least 30% of the footer is visible.
        let closestDistance = viewportHeight * (footerIsMostlyVisible ? 0.05 : 0.3);

        document.querySelectorAll<HTMLElement>('.proximity-snap-section').forEach((section) => {
          const sectionTop = window.scrollY + section.getBoundingClientRect().top;
          const distance = Math.abs(sectionTop - window.scrollY);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestSectionTop = sectionTop;
          }
        });

        const targetTop = closestSectionTop;
        if (targetTop === null || closestDistance < 2) return;

        snapInProgress = true;
        const startY = window.scrollY;
        const startTime = performance.now();
        const animateSnap = (now: number) => {
          const progress = Math.min((now - startTime) / 1000, 1);
          const easedProgress =
            progress < 0.5
              ? 4 * progress * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 3) / 2;
          window.scrollTo(0, startY + (targetTop - startY) * easedProgress);

          if (progress < 1) {
            animationFrameId = window.requestAnimationFrame(animateSnap);
          }
        };

        animationFrameId = window.requestAnimationFrame(animateSnap);
        snapFallbackTimer = window.setTimeout(finishSnap, 1400);
      }, 250);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) {
        cancelSnapForUserInput();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', cancelSnapForUserInput, { passive: true });
    window.addEventListener('touchmove', cancelSnapForUserInput, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', cancelSnapForUserInput);
      window.removeEventListener('touchmove', cancelSnapForUserInput);
      window.removeEventListener('keydown', handleKeyDown);
      if (scrollTimer !== undefined) window.clearTimeout(scrollTimer);
      if (snapFallbackTimer !== undefined) window.clearTimeout(snapFallbackTimer);
      if (animationFrameId !== undefined) window.cancelAnimationFrame(animationFrameId);
    };
  }, []);
};
