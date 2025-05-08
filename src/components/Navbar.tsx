import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 50px;
  z-index: 1000;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: fixed;
    top: 0;
    width: 4px;
    height: 200vh;
    background: linear-gradient(to bottom,
      rgba(78, 205, 196, 0) 0%,
      rgba(78, 205, 196, 0.1) 5%,
      rgba(78, 205, 196, 0.2) 10%,
      rgba(78, 205, 196, 0.3) 15%,
      rgba(78, 205, 196, 0.4) 20%,
      rgba(78, 205, 196, 0.5) 25%,
      rgba(78, 205, 196, 0.6) 30%,
      rgba(78, 205, 196, 0.7) 35%,
      rgba(78, 205, 196, 0.8) 40%,
      rgba(78, 205, 196, 0.7) 45%,
      rgba(78, 205, 196, 0.6) 50%,
      rgba(78, 205, 196, 0.5) 55%,
      rgba(78, 205, 196, 0.4) 60%,
      rgba(78, 205, 196, 0.3) 65%,
      rgba(78, 205, 196, 0.2) 70%,
      rgba(78, 205, 196, 0.1) 75%,
      rgba(78, 205, 196, 0) 80%,
      rgba(78, 205, 196, 0.1) 85%,
      rgba(78, 205, 196, 0.2) 90%,
      rgba(78, 205, 196, 0.1) 95%,
      rgba(78, 205, 196, 0) 100%
    );
    box-shadow: 0 0 15px rgba(78, 205, 196, 0.7),
                0 0 25px rgba(78, 205, 196, 0.5),
                0 0 35px rgba(78, 205, 196, 0.3);
    z-index: -1;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      top: -100%;
      left: 0;
      width: 100%;
      height: 300%;
      background: linear-gradient(to bottom,
        rgba(78, 205, 196, 0) 0%,
        rgba(78, 205, 196, 0.05) 10%,
        rgba(78, 205, 196, 0.1) 20%,
        rgba(78, 205, 196, 0.2) 30%,
        rgba(78, 205, 196, 0.3) 40%,
        rgba(78, 205, 196, 0.4) 50%,
        rgba(78, 205, 196, 0.3) 60%,
        rgba(78, 205, 196, 0.2) 70%,
        rgba(78, 205, 196, 0.1) 80%,
        rgba(78, 205, 196, 0.05) 90%,
        rgba(78, 205, 196, 0) 100%
      );
      animation: waterFlow 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }

  @keyframes waterFlow {
    0% {
      transform: translateY(0);
      opacity: 0.3;
    }
    20% {
      transform: translateY(20%);
      opacity: 0.6;
    }
    40% {
      transform: translateY(40%);
      opacity: 0.8;
    }
    60% {
      transform: translateY(60%);
      opacity: 1;
    }
    80% {
      transform: translateY(80%);
      opacity: 0.8;
    }
    100% {
      transform: translateY(100%);
      opacity: 0.3;
    }
  }
`;

const BottomNeon = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to right,
    rgba(78, 205, 196, 0) 0%,
    rgba(78, 205, 196, 0.1) 5%,
    rgba(78, 205, 196, 0.2) 10%,
    rgba(78, 205, 196, 0.3) 15%,
    rgba(78, 205, 196, 0.4) 20%,
    rgba(78, 205, 196, 0.5) 25%,
    rgba(78, 205, 196, 0.6) 30%,
    rgba(78, 205, 196, 0.7) 35%,
    rgba(78, 205, 196, 0.8) 40%,
    rgba(78, 205, 196, 0.7) 45%,
    rgba(78, 205, 196, 0.6) 50%,
    rgba(78, 205, 196, 0.5) 55%,
    rgba(78, 205, 196, 0.4) 60%,
    rgba(78, 205, 196, 0.3) 65%,
    rgba(78, 205, 196, 0.2) 70%,
    rgba(78, 205, 196, 0.1) 75%,
    rgba(78, 205, 196, 0) 80%,
    rgba(78, 205, 196, 0.1) 85%,
    rgba(78, 205, 196, 0.2) 90%,
    rgba(78, 205, 196, 0.1) 95%,
    rgba(78, 205, 196, 0) 100%
  );
  box-shadow: 0 0 15px rgba(78, 205, 196, 0.7),
              0 0 25px rgba(78, 205, 196, 0.5),
              0 0 35px rgba(78, 205, 196, 0.3);
  z-index: -1;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 300%;
    height: 100%;
    background: linear-gradient(to right,
      rgba(78, 205, 196, 0) 0%,
      rgba(78, 205, 196, 0.05) 10%,
      rgba(78, 205, 196, 0.1) 20%,
      rgba(78, 205, 196, 0.2) 30%,
      rgba(78, 205, 196, 0.3) 40%,
      rgba(78, 205, 196, 0.4) 50%,
      rgba(78, 205, 196, 0.3) 60%,
      rgba(78, 205, 196, 0.2) 70%,
      rgba(78, 205, 196, 0.1) 80%,
      rgba(78, 205, 196, 0.05) 90%,
      rgba(78, 205, 196, 0) 100%
    );
    animation: waterFlowHorizontal 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }

  @keyframes waterFlowHorizontal {
    0% {
      transform: translateX(0);
      opacity: 0.3;
    }
    20% {
      transform: translateX(20%);
      opacity: 0.6;
    }
    40% {
      transform: translateX(40%);
      opacity: 0.8;
    }
    60% {
      transform: translateX(60%);
      opacity: 1;
    }
    80% {
      transform: translateX(80%);
      opacity: 0.8;
    }
    100% {
      transform: translateX(100%);
      opacity: 0.3;
    }
  }
`;

const Logo = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8),
               0 0 20px rgba(255, 255, 255, 0.6),
               0 0 30px rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;
  position: relative;
  padding: 5px 0;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
    transform: translate(-50%, -50%);
    border-radius: 50%;
    opacity: 0;
    transition: all 0.3s ease;
    pointer-events: none;
  }

  &:hover {
    text-shadow: 0 0 15px rgba(255, 255, 255, 0.9),
                 0 0 25px rgba(255, 255, 255, 0.7),
                 0 0 35px rgba(255, 255, 255, 0.5);
  }

  &:active::before {
    width: 200px;
    height: 200px;
    opacity: 1;
    animation: explode 0.5s ease-out forwards;
  }

  @keyframes explode {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0;
    }
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 30px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)<{ $isExploding: boolean }>`
  color: #ffffff;
  text-decoration: none;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  position: relative;
  padding: 5px 0;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8),
               0 0 20px rgba(255, 255, 255, 0.6),
               0 0 30px rgba(255, 255, 255, 0.4);

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
    transform: translate(-50%, -50%);
    border-radius: 50%;
    opacity: 0;
    transition: all 0.3s ease;
    pointer-events: none;
  }

  ${props => props.$isExploding && `
    &::before {
      width: 200px;
      height: 200px;
      opacity: 1;
      animation: explode 0.5s ease-out forwards;
    }
  `}

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.8) 20%,
      rgba(255, 255, 255, 1) 50%,
      rgba(255, 255, 255, 0.8) 80%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: scaleX(0);
    transition: transform 0.3s ease;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.7),
                0 0 20px rgba(255, 255, 255, 0.5),
                0 0 30px rgba(255, 255, 255, 0.3);
  }

  &:hover {
    text-shadow: 0 0 15px rgba(255, 255, 255, 0.9),
                 0 0 25px rgba(255, 255, 255, 0.7),
                 0 0 35px rgba(255, 255, 255, 0.5);

    &::after {
      transform: scaleX(1);
    }
  }

  @keyframes explode {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0;
    }
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  display: none;
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  background: rgba(10, 10, 10, 0.95);
  padding: 20px;
  flex-direction: column;
  gap: 20px;
  align-items: center;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const LanguageButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  margin-left: 10px;
  transition: all 0.3s ease;
  position: relative;

  img {
    width: 24px;
    height: 16px;
    border-radius: 2px;
    transition: all 0.3s ease;
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
    transform: translate(-50%, -50%);
    border-radius: 50%;
    opacity: 0;
    transition: all 0.3s ease;
    pointer-events: none;
  }

  &:hover {
    transform: scale(1.1);
  }

  &:active::before {
    width: 200px;
    height: 200px;
    opacity: 1;
    animation: explode 0.5s ease-out forwards;
  }
`;

const LanguageContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [explodingLink, setExplodingLink] = useState<string | null>(null);
  const { language, setLanguage, t } = useLanguage();

  const handleClick = (path: string) => {
    setExplodingLink(path);
    setTimeout(() => {
      setExplodingLink(null);
    }, 500);
  };

  const handleLanguageChange = (lang: 'tr' | 'en') => {
    setLanguage(lang);
    // Dil değişikliğini localStorage'a kaydet
    localStorage.setItem('language', lang);
  };

  return (
    <>
      <Nav>
        <Logo to="/">Batuhan Erdener Ekşi</Logo>
        <NavLinks>
          <NavLink to="/" $isExploding={explodingLink === '/'} onClick={() => handleClick('/')}>
            {t('nav.home')}
          </NavLink>
          <NavLink to="/about" $isExploding={explodingLink === '/about'} onClick={() => handleClick('/about')}>
            {t('nav.about')}
          </NavLink>
          <NavLink to="/portfolio" $isExploding={explodingLink === '/portfolio'} onClick={() => handleClick('/portfolio')}>
            {t('nav.portfolio')}
          </NavLink>
          <LanguageContainer>
            <NavLink to="/contact" $isExploding={explodingLink === '/contact'} onClick={() => handleClick('/contact')}>
              {t('nav.contact')}
            </NavLink>
            <LanguageButton 
              onClick={() => handleLanguageChange('tr')} 
              style={{ opacity: language === 'tr' ? 1 : 0.5 }}
              title="Türkçe"
            >
              <img src="https://flagcdn.com/w40/tr.png" alt="Türkçe" />
            </LanguageButton>
            <LanguageButton 
              onClick={() => handleLanguageChange('en')} 
              style={{ opacity: language === 'en' ? 1 : 0.5 }}
              title="English"
            >
              <img src="https://flagcdn.com/w40/gb.png" alt="English" />
            </LanguageButton>
          </LanguageContainer>
        </NavLinks>
        <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          ☰
        </MobileMenuButton>
        <MobileMenu
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isMobileMenuOpen ? 1 : 0, y: isMobileMenuOpen ? 0 : -20 }}
          transition={{ duration: 0.3 }}
        >
          <NavLink to="/" $isExploding={explodingLink === '/'} onClick={() => handleClick('/')}>
            {t('nav.home')}
          </NavLink>
          <NavLink to="/portfolio" $isExploding={explodingLink === '/portfolio'} onClick={() => handleClick('/portfolio')}>
            {t('nav.portfolio')}
          </NavLink>
          <NavLink to="/about" $isExploding={explodingLink === '/about'} onClick={() => handleClick('/about')}>
            {t('nav.about')}
          </NavLink>
          <NavLink to="/contact" $isExploding={explodingLink === '/contact'} onClick={() => handleClick('/contact')}>
            {t('nav.contact')}
          </NavLink>
          <LanguageContainer>
            <LanguageButton 
              onClick={() => handleLanguageChange('tr')} 
              style={{ opacity: language === 'tr' ? 1 : 0.5 }}
              title="Türkçe"
            >
              <img src="https://flagcdn.com/w40/tr.png" alt="Türkçe" />
            </LanguageButton>
            <LanguageButton 
              onClick={() => handleLanguageChange('en')} 
              style={{ opacity: language === 'en' ? 1 : 0.5 }}
              title="English"
            >
              <img src="https://flagcdn.com/w40/gb.png" alt="English" />
            </LanguageButton>
          </LanguageContainer>
        </MobileMenu>
      </Nav>
      <BottomNeon />
    </>
  );
};

export default Navbar; 