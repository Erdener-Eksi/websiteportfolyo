import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

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

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  margin: 60px 0 30px;
  background: linear-gradient(45deg, #4ecdc4, #ff6b6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin: 40px 0 20px;
  }
`;

const Description = styled(motion.p)`
  text-align: center;
  color: #ccc;
  font-size: 1.2rem;
  margin-bottom: 40px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 30px;
  }
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 50px;
  position: relative;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-top: 30px;
  }
`;

const ProjectCard = styled(motion.div)<{ isExpanded: boolean }>`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 25px;
  transition: all 0.3s ease;
  white-space: pre-line;
  cursor: pointer;
  overflow: hidden;
  height: ${props => props.isExpanded ? 'auto' : '80px'};
  grid-column: ${props => props.isExpanded ? '1 / -1' : 'auto'};
  z-index: ${props => props.isExpanded ? 2 : 1};
  transform: ${props => props.isExpanded ? 'scale(1.02)' : 'none'};
  box-shadow: ${props => props.isExpanded ? '0 10px 30px rgba(0, 0, 0, 0.3)' : '0 0 10px rgba(0, 255, 0, 0.2)'};
  position: relative;
  margin: ${props => props.isExpanded ? '50px 0' : '0'};
  outline: none;
  border: 1px solid rgba(0, 255, 0, 0.3);

  &:hover {
    transform: ${props => props.isExpanded ? 'scale(1.02)' : 'translateY(-5px)'};
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.4);
    border-color: rgba(0, 255, 0, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #00ff00;
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.4);
  }

  @media (max-width: 768px) {
    padding: 20px;
    height: ${props => props.isExpanded ? 'auto' : '70px'};
    margin: ${props => props.isExpanded ? '30px 0' : '0'};
  }
`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  min-height: 50px;
`;

const ProjectTitle = styled.h3`
  font-size: 1.5rem;
  margin: 0;
  color: #fff;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const ProjectDescription = styled(motion.div)`
  color: #ccc;
  line-height: 1.6;
  font-size: 1.1rem;
  margin-top: 15px;
  white-space: pre-line;
  overflow: hidden;

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.5;
  }
`;

const IconWrapper = styled.div`
  color: #fff;
  font-size: 1.2rem;
  transition: transform 0.3s ease;
`;

const ServiceContent = styled.div`
  color: #ccc;
  line-height: 1.6;
  font-size: 1.1rem;
  margin-top: 15px;
  white-space: pre-line;
  overflow: visible;
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 10px;
  border: 1px solid rgba(0, 255, 0, 0.3);
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.4);
    border-color: rgba(0, 255, 0, 0.5);
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.5;
    padding: 15px;
  }
`;

const ServiceCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 25px;
  transition: all 0.3s ease;
  white-space: pre-line;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Portfolio = () => {
  const { t } = useLanguage();
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const expandedCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (expandedProject === null && expandedCardRef.current) {
      // Kart kapanırken scroll yap
      const card = expandedCardRef.current;
      if (card) {
        const cardPosition = card.offsetTop;
        window.scrollTo({
          top: cardPosition - 100,
          behavior: 'smooth'
        });
      }
    }
  }, [expandedProject]);

  const renderIcon = (isExpanded: boolean) => {
    return isExpanded ? FaChevronUp({}) : FaChevronDown({});
  };

  const services = [
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

  const completedProjects = [
    {
      title: t('portfolio.completed.project1.title'),
      description: t('portfolio.completed.project1.description')
    },
    {
      title: t('portfolio.completed.project2.title'),
      description: t('portfolio.completed.project2.description')
    },
    {
      title: t('portfolio.completed.project3.title'),
      description: t('portfolio.completed.project3.description')
    }
  ];

  const toggleProject = (index: number) => {
    if (expandedProject === index) {
      setExpandedProject(null);
    } else {
      setExpandedProject(index);
      // Kart açıldığında focus ve scroll yap
      setTimeout(() => {
        const card = expandedCardRef.current;
        if (card) {
          // Önce focus yap
          card.focus();
          
          // Sonra scroll yap
          const cardRect = card.getBoundingClientRect();
          const cardTop = cardRect.top + window.pageYOffset;
          const cardHeight = cardRect.height;
          const windowHeight = window.innerHeight;
          
          // Kartın üst kısmının viewport'un üst kısmından ne kadar uzakta olduğunu hesapla
          const distanceFromTop = cardRect.top;
          
          // Eğer kart viewport'un üst kısmına çok yakınsa veya altındaysa scroll yap
          if (distanceFromTop < 0 || distanceFromTop > windowHeight - cardHeight) {
            const scrollTo = cardTop - (windowHeight / 2) + (cardHeight / 2);
            
            window.scrollTo({
              top: scrollTo,
              behavior: 'smooth'
            });
          }
        }
      }, 300); // Kartın açılma animasyonunun süresi kadar bekle
    }
  };

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
        <Description
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {t('portfolio.description')}
        </Description>

        <ProjectGrid>
          {services.map((service, index) => (
            <ServiceCard
              key={`service-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProjectHeader>
                <ProjectTitle>{service.title}</ProjectTitle>
              </ProjectHeader>
              <ServiceContent>
                {service.description}
              </ServiceContent>
            </ServiceCard>
          ))}
        </ProjectGrid>

        <SectionTitle
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {t('portfolio.completed.title')}
        </SectionTitle>
        <Description
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {t('portfolio.completed.description')}
        </Description>
        <ProjectGrid>
          {completedProjects.map((project, index) => (
            <ProjectCard
              key={`project-${index}`}
              ref={expandedProject === index ? expandedCardRef : null}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => toggleProject(index)}
              isExpanded={expandedProject === index}
              tabIndex={0}
            >
              <ProjectHeader>
                <ProjectTitle>{project.title}</ProjectTitle>
                <IconWrapper>
                  {renderIcon(expandedProject === index)}
                </IconWrapper>
              </ProjectHeader>
              <AnimatePresence mode="wait">
                {expandedProject === index && (
                  <ProjectDescription
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {project.description}
                  </ProjectDescription>
                )}
              </AnimatePresence>
            </ProjectCard>
          ))}
        </ProjectGrid>
      </Content>
    </Container>
  );
};

export default Portfolio; 