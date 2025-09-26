import { motion } from 'motion/react';
import { useEffect, useRef, useState, useMemo } from 'react';

const buildKeyframes = (from, steps) => {
  // Ensure steps is an array and handle server-side rendering
  const safeSteps = Array.isArray(steps) ? steps : [];
  const safeFrom = from || {};
  const keys = new Set([...Object.keys(safeFrom), ...safeSteps.flatMap(s => Object.keys(s || {}))]);

  const keyframes = {};
  keys.forEach(k => {
    keyframes[k] = [safeFrom[k], ...safeSteps.map(s => s?.[k] ?? safeFrom[k])];
  });
  return keyframes;
};

const BlurText = ({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = t => t,
  onAnimationComplete,
  stepDuration = 0.35,
  as = 'p',
  textAlign = 'center',
  style = {}
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const element = ref.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log('BlurText intersection:', {
          isIntersecting: entry.isIntersecting,
          intersectionRatio: entry.intersectionRatio,
          text: text.substring(0, 20)
        });
        if (entry.isIntersecting) {
          console.log('BlurText triggering animation for:', text);
          setInView(true);
          observer.unobserve(element);
        }
      },
      { 
        threshold: Math.max(0.1, threshold), 
        rootMargin: rootMargin || '0px 0px -50% 0px' // Trigger earlier when element is 50% into viewport
      }
    );
    
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold, rootMargin]);

  const defaultFrom = useMemo(
    () =>
      direction === 'top' ? { filter: 'blur(10px)', opacity: 0, y: -50 } : { filter: 'blur(10px)', opacity: 0, y: 50 },
    [direction]
  );

  const defaultTo = useMemo(
    () => [
      {
        filter: 'blur(5px)',
        opacity: 0.5,
        y: direction === 'top' ? 5 : -5
      },
      { filter: 'blur(0px)', opacity: 1, y: 0 }
    ],
    [direction]
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = Array.isArray(animationTo) ? animationTo : defaultTo;

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) => (stepCount === 1 ? 0 : i / (stepCount - 1)));

  // Create the element dynamically based on the 'as' prop
  const Component = as;

  return (
    <Component ref={ref} className={className} style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      justifyContent: textAlign === 'left' ? 'flex-start' : textAlign === 'right' ? 'flex-end' : 'center', 
      width: '100%', 
      ...style 
    }}>
      {elements.map((segment, index) => {
        // For simple single-step animations, use the final state directly
        const finalState = Array.isArray(toSnapshots) && toSnapshots.length === 1 ? toSnapshots[0] : toSnapshots[toSnapshots.length - 1] || {};
        
        const spanTransition = {
          duration: totalDuration,
          delay: (index * delay) / 1000,
          ease: easing
        };

        return (
          <motion.span
            className="inline-block will-change-[transform,filter,opacity]"
            key={index}
            initial={fromSnapshot}
            animate={inView ? finalState : fromSnapshot}
            transition={spanTransition}
            onAnimationComplete={index === elements.length - 1 ? onAnimationComplete : undefined}
            style={{ fontFamily: 'inherit', fontWeight: 'inherit', fontStyle: 'inherit' }}
          >
            {segment === ' ' ? '\u00A0' : segment}
            {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
          </motion.span>
        );
      })}
    </Component>
  );
};

export default BlurText;
