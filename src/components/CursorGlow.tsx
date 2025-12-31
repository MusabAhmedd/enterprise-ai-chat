import { useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CursorGlow() {
  const [isVisible, setIsVisible] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  }, [mouseX, mouseY]);

  const handleMouseEnter = useCallback(() => {
    setIsVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          x: smoothX,
          y: smoothY,
          background: 'radial-gradient(circle, hsl(var(--dropzone) / 0.12) 0%, hsl(var(--dropzone) / 0.05) 30%, transparent 70%)',
        }}
      />
      <motion.div
        className="absolute h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          x: smoothX,
          y: smoothY,
          background: 'radial-gradient(circle, hsl(var(--dropzone) / 0.08) 0%, transparent 60%)',
        }}
      />
    </motion.div>
  );
}
