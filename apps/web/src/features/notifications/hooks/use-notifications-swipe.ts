'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

import { animate, type PanInfo, type Transition, useMotionValue, useTransform } from 'motion/react';

import { type TabType } from '../types';

export function useNotificationsSwipe(tabs: readonly TabType[]) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const x = useMotionValue(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  const snapTransition = useMemo<Transition>(
    () => ({
      type: 'spring',
      bounce: 0,
      duration: 0.3,
    }),
    [],
  );

  useEffect(() => {
    if (containerWidth > 0) {
      animate(x, -activeIndex * containerWidth, snapTransition);
    }
  }, [activeIndex, containerWidth, x, snapTransition]);

  const indicatorX = useTransform(
    x,
    [0, -containerWidth * (tabs.length - 1) || -1],
    ['0%', `${(tabs.length - 1) * 100}%`],
  );

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    const swipeThreshold = containerWidth * 0.1;
    let nextIndex = activeIndex;

    if (velocity < -200 || offset < -swipeThreshold) {
      nextIndex = Math.min(activeIndex + 1, tabs.length - 1);
    } else if (velocity > 200 || offset > swipeThreshold) {
      nextIndex = Math.max(activeIndex - 1, 0);
    }

    setActiveIndex(nextIndex);
    animate(x, -nextIndex * containerWidth, snapTransition);
  };

  return {
    activeIndex,
    setActiveIndex,
    containerRef,
    containerWidth,
    x,
    indicatorX,
    handleDragEnd,
  };
}

