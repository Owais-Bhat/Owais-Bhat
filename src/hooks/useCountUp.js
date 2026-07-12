import { useEffect, useRef, useState } from 'react';

/**
 * Animates a number from its previous value to `target`.
 * Returns the in-flight value; render it with your own formatter.
 */
export default function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  const prevTarget = useRef(0);

  useEffect(() => {
    const from = prevTarget.current;
    const to = Number(target) || 0;
    prevTarget.current = to;

    if (from === to) {
      setValue(to);
      return undefined;
    }

    let frame;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(from + (to - from) * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}
