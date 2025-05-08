import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Container = styled.div`
  min-height: 100vh;
  padding: 80px 50px 50px;
  position: relative;

  @media (max-width: 768px) {
    padding: 60px 20px 30px;
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  color: #fff;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  margin-bottom: 40px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 2.2rem;
    margin-bottom: 30px;
  }
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 50px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-top: 30px;
  }
`;

const ProjectCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const ProjectTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #fff;

  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 10px;
  }
`;

const ProjectDescription = styled.p`
  color: #ccc;
  line-height: 1.6;
  font-size: 1.1rem;

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.5;
  }
`;

const Portfolio = () => {
  const { t } = useLanguage();
  const projects = [
    {
      title: t('portfolio.project1.title'),
      description: t('portfolio.project1.description')
    },
    {
      title: t('portfolio.project2.title'),
      description: t('portfolio.project2.description')
    },
    {
      title: t('portfolio.project3.title'),
      description: t('portfolio.project3.description')
    },
    {
      title: t('portfolio.project4.title'),
      description: t('portfolio.project4.description')
    }
  ];

  return (
    <Container>
      <Content>
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {t('portfolio.title')}
        </Title>
        <ProjectGrid>
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProjectTitle>{project.title}</ProjectTitle>
              <ProjectDescription>{project.description}</ProjectDescription>
            </ProjectCard>
          ))}
        </ProjectGrid>
      </Content>
    </Container>
  );
};

export default Portfolio; 