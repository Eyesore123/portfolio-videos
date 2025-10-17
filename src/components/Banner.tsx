import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Banner() {
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;

    const text = 'Faster than PooTube...';
    titleRef.current.innerHTML = text
      .split('')
      .map((c) => `<span class="char">${c === ' ' ? '&nbsp;' : c}</span>`)
      .join('');

    const chars = titleRef.current.querySelectorAll('.char');

    // Initial state
    gsap.set(chars, { display: 'inline-block', opacity: 0, y: 40 });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });

    // START: elegant fly-in
    tl.to(chars, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'back.out(2)',
      stagger: { amount: 0.5, from: 'random' },
    });

    // MID: rhythmic pulse (letter-by-letter vertical bounce + glow)
    tl.to(
      chars,
      {
        y: '-=10',
        textShadow: '0 0 20px #fff, 0 0 30px #e900ff, 0 0 40px #ffc600',
        duration: 0.15,
        yoyo: true,
        repeat: 3,
        stagger: 0.05,
      },
      '+=0.2'
    );

    // END: chaos burst
    const chaosPositions = Array.from(chars).map(() => ({
      x: gsap.utils.random(-200, 200),
      y: gsap.utils.random(-100, 100),
      rotate: gsap.utils.random(-180, 180),
    }));

    tl.to(chars, {
      x: (i) => chaosPositions[i].x,
      y: (i) => chaosPositions[i].y,
      rotate: (i) => chaosPositions[i].rotate,
      opacity: 0.4,
      duration: 0.6,
      ease: 'power2.in',
      stagger: 0.02,
    });

    tl.to(chars, {
      opacity: 0,
      scale: 0.5,
      duration: 0.3,
      ease: 'power1.inOut',
    });

    // Reset for next loop
    tl.set(chars, { x: 0, y: 40, rotate: 0, opacity: 0, scale: 1 });

    // Background gradient shimmer
    const shimmer = gsap.to(titleRef.current, {
      backgroundPosition: '200% 0%',
      duration: 4,
      repeat: -1,
      ease: 'linear',
    });

    return () => {
      tl.kill();
      shimmer.kill();
    };
  }, []);

  return (
    <section
      style={{
        padding: '1rem',
        textAlign: 'center',
        overflow: 'hidden',
        height: '120px',
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
          background: 'linear-gradient(90deg, #e900ff, #ffc600, #5800ff, #e900ff)',
          backgroundSize: '200% 100%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '2px',
          textShadow: '0 0 10px #fff, 0 0 20px #e900ff, 0 0 30px #ffc600',
          display: 'inline-block',
        }}
      ></div>
    </section>
  );
}
