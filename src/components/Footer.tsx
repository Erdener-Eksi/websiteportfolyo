import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const FooterContainer = styled.footer`
  width: 100%;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  text-align: center;
  color: #fff;
  font-size: 0.9rem;
  position: relative;
  z-index: 10;

  @media (max-width: 768px) {
    padding: 15px;
    font-size: 0.8rem;
  }
`;

const CopyrightText = styled(motion.p)`
  margin: 0;
  color: #ccc;
`;

const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <CopyrightText
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {language === 'tr' 
          ? `© ${currentYear} Batuhan Erdener Ekşi. Tüm hakları saklıdır.`
          : `© ${currentYear} Batuhan Erdener Ekşi. All rights reserved.`
        }
      </CopyrightText>
    </FooterContainer>
  );
};

export default Footer; 