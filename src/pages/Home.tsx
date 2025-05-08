import React, { useRef, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import * as THREE from 'three';

const Container = styled.div`
  min-height: 100vh;
  padding: 60px 30px 30px;
  position: relative;
  overflow-x: hidden;
`;

const Content = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  align-items: center;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 0 20px;
  }
`;

const TextContent = styled(motion.div)`
  h1 {
    font-size: 2.8rem;
    margin-bottom: 15px;
    background: linear-gradient(45deg, #ffffff, #e0e0e0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 
      0 0 5px rgba(255, 255, 255, 0.7),
      0 0 7px rgba(255, 255, 255, 0.5),
      0 0 10px rgba(255, 255, 255, 0.4),
      0 0 15px rgba(255, 255, 255, 0.3);
    animation: neonPulse 3s ease-in-out infinite;
    font-weight: 800;
    letter-spacing: 2px;
  }

  p {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 20px;
    color: #ffffff;
    text-shadow: 
      0 0 3px rgba(255, 255, 255, 0.5),
      0 0 5px rgba(255, 255, 255, 0.4);
    font-weight: 500;
  }

  h2 {
    font-size: 2.2rem;
    margin: 40px 0 20px;
    color: #ffffff;
    text-shadow: 
      0 0 5px rgba(255, 255, 255, 0.7),
      0 0 7px rgba(255, 255, 255, 0.5);
    font-weight: 700;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0 0 30px;
  }

  li {
    color: #ffffff;
    font-size: 1.2rem;
    line-height: 2;
    margin-bottom: 15px;
    padding-left: 30px;
    position: relative;
    text-shadow: 
      0 0 3px rgba(255, 255, 255, 0.5),
      0 0 5px rgba(255, 255, 255, 0.4);
    font-weight: 500;

    &:before {
      content: "•";
      color: #ffffff;
      position: absolute;
      left: 0;
      font-size: 1.5rem;
      text-shadow: 
        0 0 5px rgba(255, 255, 255, 0.7),
        0 0 7px rgba(255, 255, 255, 0.5);
    }
  }

  @keyframes neonPulse {
    0% {
      text-shadow: 
        0 0 5px rgba(255, 255, 255, 0.7),
        0 0 7px rgba(255, 255, 255, 0.5),
        0 0 10px rgba(255, 255, 255, 0.4),
        0 0 15px rgba(255, 255, 255, 0.3);
    }
    50% {
      text-shadow: 
        0 0 5px rgba(255, 255, 255, 0.8),
        0 0 7px rgba(255, 255, 255, 0.6),
        0 0 10px rgba(255, 255, 255, 0.5),
        0 0 15px rgba(255, 255, 255, 0.4);
    }
    100% {
      text-shadow: 
        0 0 5px rgba(255, 255, 255, 0.7),
        0 0 7px rgba(255, 255, 255, 0.5),
        0 0 10px rgba(255, 255, 255, 0.4),
        0 0 15px rgba(255, 255, 255, 0.3);
    }
  }
`;

const Button = styled(Link)`
  display: inline-block;
  padding: 15px 30px;
  background: linear-gradient(45deg, #00f2ff, #00ff9d);
  color: #000000;
  text-decoration: none;
  border-radius: 30px;
  font-size: 1.3rem;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(0, 242, 255, 0.4);
  text-align: center;
  border: none;
  cursor: pointer;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #00ff9d, #00f2ff);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 20px rgba(0, 242, 255, 0.6);
    
    &::before {
      opacity: 1;
    }
  }

  span {
    position: relative;
    z-index: 1;
  }
`;

const ScrollSection = styled.div`
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  position: relative;
  overflow: hidden;
`;

const ScrollContent = styled.div`
  max-width: 800px;
  width: 100%;
  text-align: center;
  color: #ffffff;
  padding: 25px;
  background: rgba(17, 17, 17, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(78, 205, 196, 0.2);
  border: 1px solid rgba(78, 205, 196, 0.1);

  h2 {
    font-size: 2.2rem;
    margin-bottom: 15px;
    background: linear-gradient(45deg, #ffffff, #4ecdc4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.8),
                 0 0 30px rgba(78, 205, 196, 0.6),
                 0 0 40px rgba(78, 205, 196, 0.4);
  }

  p {
    font-size: 1.1rem;
    color: #ffffff;
    line-height: 1.6;
    white-space: pre-line;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5),
                 0 0 20px rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 768px) {
    padding: 20px;
    
    h2 {
      font-size: 1.8rem;
    }
    
    p {
      font-size: 1rem;
    }
  }
`;

const shootingStar = keyframes`
  0% {
    transform: translateX(100vw) translateY(var(--startY)) rotate(var(--angle));
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  95% {
    opacity: 1;
  }
  100% {
    transform: translateX(-100vw) translateY(calc(var(--startY) + 100vh)) rotate(var(--angle));
    opacity: 0;
  }
`;

const Trail = styled.div<{ delay: number; duration: number; startY: number; angle: number }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100px;
  height: 1px;
  --startY: ${props => props.startY}vh;
  --angle: ${props => props.angle}deg;
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.1) 20%,
    rgba(255, 255, 255, 0.2) 40%,
    rgba(255, 255, 255, 0.3) 60%,
    rgba(255, 255, 255, 0.2) 80%,
    rgba(255, 255, 255, 0) 100%
  );
  transform-origin: right center;
  animation: ${shootingStar} ${props => props.duration}s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  animation-delay: ${props => props.delay}s;
  z-index: 0;
  filter: blur(0.5px);
  box-shadow: 
    0 0 4px rgba(255, 255, 255, 0.3),
    0 0 8px rgba(255, 255, 255, 0.2),
    0 0 12px rgba(255, 255, 255, 0.1);
`;

const ShootingStars = () => {
  const getRandomDelay = () => Math.random() * 15; // 0 to 15 seconds
  const getRandomDuration = () => 2 + Math.random() * 2; // 2 to 4 seconds
  const getRandomStartY = () => Math.random() * 30; // 0 to 30vh
  const getRandomAngle = () => -15 + Math.random() * 30; // -15 to +15 degrees

  // Create array of 5 stars with random properties
  const stars = Array.from({ length: 5 }, () => ({
    delay: getRandomDelay(),
    duration: getRandomDuration(),
    startY: getRandomStartY(),
    angle: getRandomAngle()
  }));

  return (
    <>
      {stars.map((star, index) => (
        <Trail 
          key={index}
          delay={star.delay} 
          duration={star.duration} 
          startY={star.startY}
          angle={star.angle}
        />
      ))}
    </>
  );
};

const welcomeFade = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.95) translateY(20px) rotateX(20deg);
    filter: blur(10px);
  }
  20% {
    opacity: 1;
    transform: scale(1) translateY(0) rotateX(0deg);
    filter: blur(0px);
  }
  80% {
    opacity: 1;
    transform: scale(1) translateY(0) rotateX(0deg);
    filter: blur(0px);
  }
  100% {
    opacity: 0;
    transform: scale(1.05) translateY(-20px) rotateX(-20deg);
    filter: blur(10px);
  }
`;

const WelcomeOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.95) 0%,
    rgba(0, 0, 0, 0.98) 100%
  );
  backdrop-filter: blur(8px);
  z-index: 9999;
  pointer-events: none;
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  perspective: 1000px;
`;

const WelcomeText = styled.h1`
  font-size: 4.5rem;
  color: #fff;
  text-align: center;
  animation: ${welcomeFade} 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  letter-spacing: 2px;
  position: relative;
  z-index: 2;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  text-shadow: 
    0 0 0.5px rgba(255, 255, 255, 0.9),
    0 0 1px rgba(255, 255, 255, 0.9),
    0 0 1.5px rgba(255, 255, 255, 0.9),
    0 0 2px rgba(255, 255, 255, 0.9),
    0 0 2.5px rgba(255, 255, 255, 0.9),
    0 0 3px rgba(255, 255, 255, 0.9),
    0 0 3.5px rgba(255, 255, 255, 0.9),
    0 0 4px rgba(255, 255, 255, 0.9),
    0 0 4.5px rgba(255, 255, 255, 0.9),
    0 0 5px rgba(255, 255, 255, 0.9),
    0 0 7.5px rgba(0, 255, 255, 0.9),
    0 0 10px rgba(0, 255, 255, 0.9),
    0 0 12.5px rgba(0, 255, 255, 0.9),
    0 0 15px rgba(0, 255, 255, 0.9),
    0 0 17.5px rgba(0, 255, 255, 0.9),
    0 0 20px rgba(0, 255, 255, 0.9),
    0 0 25px rgba(0, 255, 255, 0.9),
    0 0 30px rgba(0, 255, 255, 0.9),
    0 0 35px rgba(0, 255, 255, 0.9),
    0 0 40px rgba(0, 255, 255, 0.9),
    0 0 45px rgba(0, 255, 255, 0.9),
    0 0 50px rgba(0, 255, 255, 0.9),
    0 0 55px rgba(0, 255, 255, 0.9),
    0 0 60px rgba(0, 255, 255, 0.9),
    0 0 65px rgba(0, 255, 255, 0.9),
    0 0 70px rgba(0, 255, 255, 0.9),
    0 0 75px rgba(0, 255, 255, 0.9),
    0 0 80px rgba(0, 255, 255, 0.9),
    0 0 85px rgba(0, 255, 255, 0.9),
    0 0 90px rgba(0, 255, 255, 0.9),
    0 0 95px rgba(0, 255, 255, 0.9),
    0 0 100px rgba(0, 255, 255, 0.9);
  background: transparent;
  padding: 25px 50px;
  transform-style: preserve-3d;
  transform: perspective(1000px) rotateX(0deg);
  filter: blur(0.2px);

  &::before {
    content: '';
    position: absolute;
    top: -20px;
    left: -20px;
    right: -20px;
    bottom: -20px;
    background: radial-gradient(
      circle at center,
      rgba(0, 255, 255, 0.15) 0%,
      rgba(0, 255, 255, 0.1) 30%,
      rgba(0, 255, 255, 0.05) 50%,
      transparent 70%
    );
    z-index: -1;
    border-radius: 50%;
    filter: blur(25px);
    opacity: 0.8;
    animation: pulseGlow 3s ease-in-out infinite;
    transform: translateZ(-10px);
    backdrop-filter: blur(8px);
  }

  &::after {
    content: '';
    position: absolute;
    top: -30px;
    left: -30px;
    right: -30px;
    bottom: -30px;
    background: radial-gradient(
      circle at center,
      rgba(0, 255, 255, 0.2) 0%,
      rgba(0, 255, 255, 0.15) 20%,
      rgba(0, 255, 255, 0.1) 40%,
      transparent 60%
    );
    z-index: -2;
    border-radius: 50%;
    filter: blur(35px);
    opacity: 0.6;
    animation: pulseGlow 3s ease-in-out infinite reverse;
    transform: translateZ(-20px);
    backdrop-filter: blur(12px);
  }

  @keyframes pulseGlow {
    0%, 100% {
      opacity: 0.6;
      filter: blur(25px);
      transform: translateZ(-10px) scale(1);
    }
    50% {
      opacity: 0.8;
      filter: blur(35px);
      transform: translateZ(-10px) scale(1.1);
    }
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
    padding: 20px 35px;
    letter-spacing: 1px;
    text-shadow: 
      0 0 0.5px rgba(255, 255, 255, 0.9),
      0 0 1px rgba(255, 255, 255, 0.9),
      0 0 1.5px rgba(255, 255, 255, 0.9),
      0 0 2px rgba(255, 255, 255, 0.9),
      0 0 2.5px rgba(255, 255, 255, 0.9),
      0 0 3px rgba(255, 255, 255, 0.9),
      0 0 3.5px rgba(255, 255, 255, 0.9),
      0 0 4px rgba(255, 255, 255, 0.9),
      0 0 4.5px rgba(255, 255, 255, 0.9),
      0 0 5px rgba(255, 255, 255, 0.9),
      0 0 7.5px rgba(0, 255, 255, 0.9),
      0 0 10px rgba(0, 255, 255, 0.9),
      0 0 12.5px rgba(0, 255, 255, 0.9),
      0 0 15px rgba(0, 255, 255, 0.9),
      0 0 17.5px rgba(0, 255, 255, 0.9),
      0 0 20px rgba(0, 255, 255, 0.9),
      0 0 25px rgba(0, 255, 255, 0.9),
      0 0 30px rgba(0, 255, 255, 0.9),
      0 0 35px rgba(0, 255, 255, 0.9),
      0 0 40px rgba(0, 255, 255, 0.9);
    filter: blur(0.15px);
  }
`;

const FloatingParticles = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

const Home: React.FC = () => {
  const { scrollY } = useScroll();
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const y = useTransform(scrollY, [0, 1000], [0, -1000]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  const sections = [
    {
      titleKey: 'home.section1.title' as const,
      descriptionKey: 'home.section1.description' as const
    },
    {
      titleKey: 'home.section2.title' as const,
      descriptionKey: 'home.section2.description' as const
    },
    {
      titleKey: 'home.section3.title' as const,
      descriptionKey: 'home.section3.description' as const
    }
  ];

  useEffect(() => {
    // Menüden gelip gelmediğini kontrol et
    const isFromMenu = sessionStorage.getItem('fromMenu') === 'true';
    
    if (isFirstLoad && !isFromMenu) {
      setShowWelcome(true);
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 2500);
      return () => clearTimeout(timer);
    } else {
      setShowWelcome(false);
    }
    
    // Menüden geldiğini işaretle
    sessionStorage.setItem('fromMenu', 'true');
    setIsFirstLoad(false);
  }, [isFirstLoad]);

  return (
    <Container ref={containerRef}>
      {showWelcome && (
        <WelcomeOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <WelcomeText>
            {t('home.welcome')}
          </WelcomeText>
        </WelcomeOverlay>
      )}
      <ShootingStars />
      <Content>
        <TextContent
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t('home.subtitle')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t('home.description')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button to="/portfolio">
              <span>{t('home.explore')}</span>
            </Button>
          </motion.div>
        </TextContent>
      </Content>

      {sections.map((section, index) => (
        <ScrollSection key={index}>
          <ScrollContent>
            <h2>{t(section.titleKey)}</h2>
            <p style={{ whiteSpace: 'pre-line' }}>{t(section.descriptionKey)}</p>
          </ScrollContent>
        </ScrollSection>
      ))}
    </Container>
  );
};

export default Home; 