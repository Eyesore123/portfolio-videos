import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import '../index.css';

export default function Banner() {
  const neonRef = useRef<HTMLDivElement>(null);
  const royalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!neonRef.current || !royalRef.current) return;

    const text = 'Faster than PooTube...';

    // --- Helper: wrap text in spans ---
    const wrapText = (el: HTMLDivElement) => {
      el.innerHTML = text
        .split('')
        .map((c) => `<span class="char">${c === ' ' ? '&nbsp;' : c}</span>`)
        .join('');
      return Array.from(el.querySelectorAll('.char')) as HTMLElement[];
    };

    const neonChars = wrapText(neonRef.current);
    const royalChars = wrapText(royalRef.current);

    // --- Setup Neon ---
    gsap.set(neonChars, { display: 'inline-block', opacity: 0, y: 40, rotateX: 90 });
    // --- Setup Royal ---
    royalChars.forEach((char) => {
      char.style.display = 'inline-block';
      char.style.position = 'relative';
      char.style.backfaceVisibility = 'hidden';
      char.style.willChange = 'transform, opacity, text-shadow';
    });
    gsap.set(royalChars, { opacity: 0, y: 40, rotateX: 90, scale: 1 });

    // --- Pre-generate chaos positions to keep effect consistent ---
    const neonChaosPositions = neonChars.map(() => ({
      x: gsap.utils.random(-200, 200),
      y: gsap.utils.random(-100, 100),
      rotate: gsap.utils.random(-180, 180),
    }));
    const royalChaosPositions = royalChars.map(() => ({
      x: gsap.utils.random(-200, 200),
      y: gsap.utils.random(-100, 100),
      rotate: gsap.utils.random(-180, 180),
    }));

    // --- Create sparkles only once ---
    royalChars.forEach((char) => {
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

    // --- Neon Animation ---
    const neonAnimation = (onComplete?: () => void) => {
      const tl = gsap.timeline({ onComplete });
      tl.to(neonChars, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.5,
        ease: 'back.out(2)',
        stagger: { amount: 0.5, from: 'random' },
      });

      const glitch = gsap.timeline({ repeat: 6, yoyo: true });
      glitch
        .to(neonRef.current, { x: 5, y: -2, skewX: 5, textShadow: '2px 2px 10px #0ff, -2px -2px 10px #0ff', duration: 0.2 })
        .to(neonRef.current, { x: -5, y: 2, skewX: -5, textShadow: '-2px 2px 10px #0ff, 2px -2px 10px #0ff', duration: 0.2 })
        .to(neonRef.current, { x: 0, y: 0, skewX: 0, textShadow: '0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff', duration: 0.4 });
      tl.add(glitch, '+=0.2');

      tl.to(neonChars, {
        x: (i) => neonChaosPositions[i].x,
        y: (i) => neonChaosPositions[i].y,
        rotate: (i) => neonChaosPositions[i].rotate,
        opacity: 0.4,
        duration: 0.6,
        ease: 'power2.in',
        stagger: 0.02,
      });
      tl.to(neonChars, { opacity: 0, scale: 0.5, duration: 0.3 });
      tl.set(neonChars, { x: 0, y: 40, rotate: 0, opacity: 0, scale: 1 });
      return tl;
    };

    // --- Royal Animation ---
    const royalAnimation = (onComplete?: () => void) => {
      const tl = gsap.timeline({ onComplete });
      tl.to(royalChars, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.5,
        ease: 'back.out(2)',
        stagger: { amount: 0.5, from: 'random' },
      });

      const glitch = gsap.timeline({ repeat: 6, yoyo: true });
      glitch
        .to(royalRef.current, { x: 5, y: -2, skewX: 5, rotateZ: 1.5, textShadow: '2px 2px 12px var(--text-color2), -2px -2px 12px var(--text-color2)', duration: 0.2 })
        .to(royalRef.current, { x: -5, y: 2, skewX: -5, rotateZ: -1.5, textShadow: '-2px 2px 12px var(--text-color2), 2px -2px 12px var(--text-color2)', duration: 0.2 })
        .to(royalRef.current, { x: 0, y: 0, skewX: 0, rotateZ: 0, textShadow: '0 0 20px var(--text-color2), 0 0 30px var(--text-color2), 0 0 40px var(--text-color2)', duration: 0.4 });
      tl.add(glitch, '+=0.2');

      tl.to(royalChars, {
        opacity: () => gsap.utils.random(0.6, 1),
        scale: () => gsap.utils.random(1, 1.1),
        duration: 0.1,
        repeat: 5,
        yoyo: true,
        stagger: 0.03,
        textShadow: '0 0 8px var(--text-color2), 0 0 16px var(--text-color2), 0 0 24px var(--text-color2)',
      }, '-=0.6');

      tl.to(royalChars, {
        x: (i) => royalChaosPositions[i].x,
        y: (i) => royalChaosPositions[i].y,
        rotate: (i) => royalChaosPositions[i].rotate,
        opacity: 0.35,
        scale: 0.7,
        duration: 0.6,
        ease: 'power2.in',
        stagger: 0.02,
      });
      tl.to(royalChars, { opacity: 0, scale: 0.5, duration: 0.3 });
      tl.set(royalChars, { x: 0, y: 40, rotate: 0, opacity: 0, scale: 1 });

      return tl;
    };

    // --- Sequential loop ---
    const runSequence = () => {
      neonAnimation(() => {
        royalAnimation(() => {
          runSequence(); // loop indefinitely
        });
      });
    };
    runSequence();

    return () => { gsap.globalTimeline.clear();
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
        background: '#000',
        position: 'relative',
      }}
    >
      <div
        ref={neonRef}
        style={{
          fontSize: '2rem',
          fontWeight: 900,
          fontFamily: '"Poppins", sans-serif',
          color: '#0ff',
          letterSpacing: '2px',
          textShadow: '0 0 10px #0ff, 0 0 20px #0ff, 0 0 30px #0ff',
          perspective: '800px',
          transformStyle: 'preserve-3d',
          whiteSpace: 'normal',
          position: 'absolute',
        }}
      ></div>
      <div
        ref={royalRef}
        style={{
          fontSize: '2rem',
          fontWeight: 900,
          fontFamily: 'var(--font-poppins)',
          letterSpacing: '2px',
          textShadow: '0 0 10px var(--text-color2), 0 0 20px var(--text-color2), 0 0 30px var(--text-color2)',
          perspective: '800px',
          transformStyle: 'preserve-3d',
          whiteSpace: 'normal',
          position: 'absolute',
        }}
      ></div>
    </section>
  );
}
