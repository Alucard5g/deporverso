import { useState, useEffect } from 'react';

export type PerformanceTier = 'HIGH' | 'MEDIUM' | 'LOW';

export interface PerformanceMode {
  tier: PerformanceTier;
  isWebGLAvailable: boolean;
  isMobile: boolean;
  maxParticles: number;
}

export const usePerformanceMode = (): PerformanceMode => {
  const [mode, setMode] = useState<PerformanceMode>({
    tier: 'HIGH',
    isWebGLAvailable: true,
    isMobile: false,
    maxParticles: 3000
  });

  useEffect(() => {
    // Check WebGL availability safely
    let hasWebGL = false;
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      hasWebGL = Boolean(gl);
    } catch {
      hasWebGL = false;
    }

    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (window.innerWidth < 768);
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    // @ts-ignore
    const deviceMemory = navigator.deviceMemory || 4;

    let tier: PerformanceTier = 'HIGH';
    let maxParticles = 3500;

    if (!hasWebGL) {
      tier = 'LOW';
      maxParticles = 0;
    } else if (isMobileDevice || hardwareConcurrency < 4 || deviceMemory < 4) {
      tier = 'MEDIUM';
      maxParticles = 1200;
    } else if (hardwareConcurrency >= 8 && deviceMemory >= 8) {
      tier = 'HIGH';
      maxParticles = 4000;
    }

    setMode({
      tier,
      isWebGLAvailable: hasWebGL,
      isMobile: isMobileDevice,
      maxParticles
    });
  }, []);

  return mode;
};
