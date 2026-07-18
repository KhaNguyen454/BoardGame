import React, { useEffect, useRef } from 'react';

/**
 * Animated starfield background – pure CSS/JS, no canvas.
 * Renders `count` stars of varying sizes with randomized twinkle animation.
 */
const StarBackground = ({ count = 120 }) => {
  const starsRef = useRef([]);

  if (starsRef.current.length === 0) {
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 2.5 + 0.5;
      starsRef.current.push({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: `${size}px`,
        opacity: Math.random() * 0.6 + 0.2,
        animationDuration: `${Math.random() * 4 + 2}s`,
        animationDelay: `${Math.random() * 5}s`,
      });
    }
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {starsRef.current.map(star => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animation: `twinkle ${star.animationDuration} ease-in-out infinite`,
            animationDelay: star.animationDelay,
          }}
        />
      ))}

      {/* Nebula overlays for depth */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '10%', left: '-10%',
          width: '50vw', height: '50vh',
          background: 'radial-gradient(ellipse, rgba(37,99,235,0.08) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '10%', right: '-10%',
          width: '60vw', height: '60vh',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.06) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: '40%', left: '30%',
          width: '40vw', height: '40vh',
          background: 'radial-gradient(ellipse, rgba(218,37,29,0.04) 0%, transparent 70%)',
        }}
      />
    </div>
  );
};

export default StarBackground;
