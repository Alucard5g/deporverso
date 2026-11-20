import { useState, useEffect } from 'react';

export interface ViewportProfile {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  platformKind: 'mobile' | 'tablet' | 'desktop';
}

const getInitialProfile = (): ViewportProfile => {
  if (typeof window === 'undefined') {
    return {
      width: 1280,
      height: 800,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isTouchDevice: false,
      platformKind: 'desktop'
    };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;
  const isTouchDevice =
    'ontouchstart' in window ||
    (typeof navigator !== 'undefined' && (navigator.maxTouchPoints || 0) > 0);

  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
    isTouchDevice,
    platformKind: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
  };
};

export const useViewportProfile = (): ViewportProfile => {
  const [profile, setProfile] = useState<ViewportProfile>(getInitialProfile);

  useEffect(() => {
    const updateProfile = () => {
      setProfile(getInitialProfile());
    };

    updateProfile();
    window.addEventListener('resize', updateProfile, { passive: true });
    window.addEventListener('orientationchange', updateProfile, { passive: true });
    return () => {
      window.removeEventListener('resize', updateProfile);
      window.removeEventListener('orientationchange', updateProfile);
    };
  }, []);

  return profile;
};
