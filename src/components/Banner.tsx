import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import '../index.css';

export default function Banner() {
  const titleRef = useRef<HTMLDivElement>(null);
  const sparkContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;

    const text = 'Faster than PooTube...';
    titleRef.current.innerHTML = text
      .split('')
      .map((c) => `<span class="char">${c === ' ' ? '&nbsp;' : c}</span>`)
      .join('');

    const chars = Array.from(titleRef.current.querySelectorAll('.char')) as HTMLElement[];

    // --- GPU hints + base color ---
    chars.forEach((char) => {
      char.style.willChange = 'transform, opacity, text-shadow';
      char.style.backfaceVisibility = 'hidden';
      char.style.display = 'inline-block';
      char.style.color = 'var(--text-color2)';
      char.style.transformOrigin = 'center bottom';
      char.style.position = 'relative';
    });

    gsap.set(chars, { opacity: 0, y: 40, rotateX: 90, scale: 1 });

    // --- PRIMARY TL: original animation ---
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });

    // START: elegant fly-in
    tl.to(chars, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 0.5,
      ease: 'back.out(2)',
      stagger: { amount: 0.5, from: 'random' },
    });

    // MID: glitch pulse
    const glitch = gsap.timeline({ repeat: 6, yoyo: true });
    glitch
      .to(titleRef.current, {
        x: 5,
        y: -2,
        skewX: 5,
        rotateZ: 1.5,
        textShadow: '2px 2px 12px var(--text-color2), -2px -2px 12px var(--text-color2)',
        duration: 0.2,
        ease: 'power1.inOut',
      })
      .to(titleRef.current, {
        x: -5,
        y: 2,
        skewX: -5,
        rotateZ: -1.5,
        textShadow: '-2px 2px 12px var(--text-color2), 2px -2px 12px var(--text-color2)',
        duration: 0.2,
        ease: 'power1.inOut',
      })
      .to(titleRef.current, {
        x: 0,
        y: 0,
        skewX: 0,
        rotateZ: 0,
        textShadow:
          '0 0 20px var(--text-color2), 0 0 30px var(--text-color2), 0 0 40px var(--text-color2)',
        duration: 0.4,
        ease: 'power1.inOut',
      });

    tl.add(glitch, '+=0.2');

    // Letter-by-letter flicker
    tl.to(
      chars,
      {
        opacity: () => gsap.utils.random(0.6, 1),
        scale: () => gsap.utils.random(1, 1.1),
        duration: 0.1,
        repeat: 5,
        yoyo: true,
        stagger: 0.03,
        textShadow:
          '0 0 8px var(--text-color2), 0 0 16px var(--text-color2), 0 0 24px var(--text-color2)',
      },
      '-=0.6'
    );

    // END: chaos burst
    const chaosPositions = chars.map(() => ({
      x: gsap.utils.random(-200, 200),
      y: gsap.utils.random(-100, 100),
      rotate: gsap.utils.random(-180, 180),
    }));

    tl.to(chars, {
      x: (i) => chaosPositions[i].x,
      y: (i) => chaosPositions[i].y,
      rotate: (i) => chaosPositions[i].rotate,
      opacity: 0.35,
      scale: 0.7,
      duration: 0.6,
      ease: 'power2.in',
      stagger: 0.02,
      roundProps: 'x,y',
      textShadow:
        '0 0 8px var(--text-color2), 0 0 16px var(--text-color2), 0 0 24px var(--text-color2)',
    });

    tl.to(chars, { opacity: 0, scale: 0.5, duration: 0.3, ease: 'power1.inOut' });
    tl.set(chars, { x: 0, y: 40, rotate: 0, opacity: 0, scale: 1 });

    // --- SECONDARY TL: pulsing glow + jitter ---
    const overlayTl = gsap.timeline({ repeat: -1 });
    chars.forEach((char) => {
      overlayTl.to(
        char,
        {
          scale: () => gsap.utils.random(1, 1.05),
          rotation: () => gsap.utils.random(-2, 2),
          textShadow: () => {
            const glow = gsap.utils.random(10, 22);
            return `0 0 ${glow}px var(--text-color2), 0 0 ${glow * 1.5}px var(--text-color2), 0 0 ${glow * 2}px var(--text-color2)`;
          },
          duration: 0.1,
          repeat: 10,
          yoyo: true,
          ease: 'power1.inOut',
        },
        0
      );
    });

    // --- PARTICLE SPARKS ---
    chars.forEach((char) => {
      for (let i = 0; i < 2; i++) {
        const sparkle = document.createElement('span');
        sparkle.textContent = '•';
        sparkle.style.position = 'absolute';
        sparkle.style.fontSize = '0.5rem';
        sparkle.style.color = 'var(--text-color2)';
        sparkle.style.opacity = '0';
        sparkle.style.pointerEvents = 'none';
        char.appendChild(sparkle);

        gsap.to(sparkle, {
          x: () => gsap.utils.random(-6, 6),
          y: () => gsap.utils.random(-6, 6),
          scale: () => gsap.utils.random(0.5, 1),
          opacity: () => gsap.utils.random(0.3, 0.8),
          duration: 0.3,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          delay: Math.random() * 0.5,
        });
      }
    });

    // --- RHYTHMIC WHOLE-WORD GLOW ---
    gsap.to(titleRef.current, {
      textShadow:
        '0 0 15px var(--text-color2), 0 0 25px var(--text-color2), 0 0 35px var(--text-color2)',
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    return () => {
      tl.kill();
      overlayTl.kill();
    };
  }, []);

  return (
    <section
      style={{
        padding: '1rem',
        textAlign: 'center',
        overflow: 'hidden',
        height: '140px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-color)',
        position: 'relative',
      }}
    >
      <div
        ref={titleRef}
        style={{
          fontSize: '2rem',
          fontWeight: 900,
          fontFamily: 'var(--font-poppins)',
          letterSpacing: '2px',
          textShadow:
            '0 0 10px var(--text-color2), 0 0 20px var(--text-color2), 0 0 30px var(--text-color2)',
          perspective: '800px',
          transformStyle: 'preserve-3d',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          padding: '1rem',
          display: 'inline-block',
          position: 'relative',
        }}
      ></div>
    </section>
  );
}
