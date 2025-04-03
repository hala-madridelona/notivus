import { debounceMyFun } from '@/utils/client/debounce';
import { useEffect, useMemo, useState } from 'react';

enum DEVICES {
  SUPER_LARGE_DESKTOP = 'SUPER_LARGE_DESKTOP',
  LARGE_DESKTOP = 'LARGE_DESKTOP',
  DESKTOP = 'DESKTOP',
  TABLET = 'TABLET',
  MOBILE = 'MOBILE',
  UNKNOWN = 'UNKNOWN',
}

const findDeviceType = (viewportWidth: number): DEVICES => {
  if (viewportWidth < 600) {
    return DEVICES.MOBILE;
  } else if (viewportWidth >= 600 && viewportWidth <= 1024) {
    return DEVICES.TABLET;
  } else if (viewportWidth >= 1025 && viewportWidth <= 1440) {
    return DEVICES.DESKTOP;
  } else if (viewportWidth >= 1441 && viewportWidth <= 1920) {
    return DEVICES.LARGE_DESKTOP;
  } else if (viewportWidth > 1920) {
    return DEVICES.SUPER_LARGE_DESKTOP;
  }
  return DEVICES.UNKNOWN;
};

const DEFAULT_STATE = {
  isSuperLargeDesktop: false,
  isLargeDesktop: false,
  isDesktop: false,
  isMobile: false,
  isTablet: false,
};

export const useMediaQuery = () => {
  const [deviceType, setDeviceType] = useState<DEVICES>(() =>
    findDeviceType(typeof window !== 'undefined' ? window.innerWidth : 0)
  );
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQueries = [
      window.matchMedia('(max-width: 599px)'),
      window.matchMedia('(min-width: 600px) and (max-width: 1024px)'),
      window.matchMedia('(min-width: 1025px) and (max-width: 1440px)'),
      window.matchMedia('(min-width: 1441px) and (max-width: 1920px)'),
      window.matchMedia('(min-width: 1921px)'),
    ];
    const eventHandler = debounceMyFun(() => {
      const type = findDeviceType(window.innerWidth);
      setDeviceType(type);
    }, 200);

    mediaQueries.forEach((mq) => mq.addEventListener('change', eventHandler));

    eventHandler();

    return () => mediaQueries.forEach((mq) => mq.removeEventListener('change', eventHandler));
  }, []);

  const output = useMemo(() => {
    if (
      [DEVICES.SUPER_LARGE_DESKTOP, DEVICES.LARGE_DESKTOP, DEVICES.DESKTOP].includes(deviceType)
    ) {
      return {
        isSuperLargeDesktop: deviceType === DEVICES.SUPER_LARGE_DESKTOP,
        isLargeDesktop: deviceType === DEVICES.LARGE_DESKTOP,
        isDesktop: true,
        isTablet: false,
        isMobile: false,
      };
    } else if ([DEVICES.TABLET, DEVICES.MOBILE].includes(deviceType)) {
      return {
        isSuperLargeDesktop: false,
        isLargeDesktop: false,
        isDesktop: false,
        isTablet: deviceType === DEVICES.TABLET,
        isMobile: deviceType === DEVICES.MOBILE,
      };
    } else {
      return DEFAULT_STATE;
    }
  }, [deviceType]);

  return output;
};
