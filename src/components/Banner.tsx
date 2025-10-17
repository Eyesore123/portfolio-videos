import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Banner() {
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;

    // Glitch effect timeline
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(titleRef.current, {
      x: 5,
      y: -2,
      skewX: 5,
      textShadow: '2px 2px 10px #e900ff, -2px -2px 10px #ffc600',
      duration: 0.2,
      ease: 'power1.inOut',
    })
      .to(titleRef.current, {
        x: -5,
        y: 2,
        skewX: -5,
        textShadow: '-2px 2px 10px #5800ff, 2px -2px 10px #ffc600',
        duration: 0.2,
        ease: 'power1.inOut',
      })
      .to(titleRef.current, {
        x: 0,
        y: 0,
        skewX: 0,
        textShadow: '0 0 20px #fff, 0 0 30px #e900ff, 0 0 40px #ffc600',
        duration: 0.4,
        ease: 'power1.inOut',
      });

    // Floating color shimmer
    gsap.to(titleRef.current, {
      backgroundPosition: '200% 0%',
      duration: 4,
      repeat: -1,
      ease: 'linear',
    });
  }, []);

  return (
    <section
      style={{
        padding: '1rem',
        textAlign: 'center',
        overflow: 'hidden',
        height: '120px', // keeps it a small slice
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
      }}
    >
      <div
        ref={titleRef}
        style={{
          fontSize: '2rem',
          fontWeight: 900,
          fontFamily: '"Poppins", sans-serif',
          color: '#fff',
          background: 'linear-gradient(90deg, #e900ff, #ffc600, #5800ff, #e900ff)',
          backgroundSize: '200% 100%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '2px',
          textShadow: '0 0 10px #fff, 0 0 20px #e900ff, 0 0 30px #ffc600',
          display: 'inline-block',
        }}
      >
        Faster than PooTube...
      </div>
    </section>
  );
}
