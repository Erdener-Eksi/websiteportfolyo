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

const AboutSection = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  border: 1px solid rgba(0, 255, 0, 0.3);
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.4);
    border-color: rgba(0, 255, 0, 0.5);
  }

  @media (max-width: 768px) {
    padding: 20px;
    margin-bottom: 20px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
  color: #fff;

  @media (max-width: 768px) {
    font-size: 1.6rem;
    margin-bottom: 15px;
  }
`;

const Text = styled.p`
  color: #ccc;
  line-height: 1.8;
  font-size: 1.1rem;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 15px;
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 30px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
    margin-top: 20px;
  }
`;

const SkillCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 255, 0, 0.3);
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.2);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-5px);
    border-color: rgba(0, 255, 0, 0.5);
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.4);
  }

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const SkillTitle = styled.h3`
  color: #fff;
  margin-bottom: 10px;
  font-size: 1.1rem;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 8px;
  }
`;

const SkillLevel = styled.div`
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
`;

const SkillProgress = styled(motion.div)<{ level: number }>`
  height: 100%;
  width: ${props => props.level}%;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border-radius: 3px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: shine 2s infinite;
  }

  @keyframes shine {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

const About = () => {
  const { t } = useLanguage();
  const skills = [
    { name: 'React', level: 90 },
    { name: 'React Native', level: 85 },
    { name: 'TypeScript', level: 85 },
    { name: 'Node.js', level: 80 },
    { name: 'Python', level: 75 },
    { name: 'HTML', level: 70 },
    { name: 'CSS', level: 65 },
    { name: 'JavaScript', level: 60 }, 
    { name: 'SQL', level: 55 },
    { name: 'Git', level: 80},
    { name: 'Docker', level: 50},
    { name: 'Linux', level: 90},
    { name: 'C#', level: 70},
    { name: 'C++', level: 55},
    { name: 'Arduino', level: 70},
    { name: 'Matlab', level: 85},
    { name: 'Unity', level: 90},
    { name: 'Unreal Engine', level: 80},
    { name: 'Twinmotion', level: 90},
    { name: 'Blender', level: 40},
    { name: 'Photoshop', level: 75},
    { name: 'Premiere Pro', level: 70},
    { name: 'Fortigate', level: 80},
    { name: 'Visual Studio', level: 70},
    { name: 'Visual Studio Code', level: 90},
    { name: 'PyCharm', level: 70},
    { name: 'Android Studio', level: 60},
    { name: 'Xcode', level: 60},
    { name: 'Android Studio', level: 80},
  ];

  return (
    <Container>
      <Content>
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {t('about.title')}
        </Title>

        <AboutSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SectionTitle>{t('about.whoAmI')}</SectionTitle>
          <Text>
            {t('about.description')}
          </Text>
          
          <Text>
            {t('about.continuousLearning')}
          </Text>
        </AboutSection>

        <AboutSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <SectionTitle>{t('about.skills')}</SectionTitle>
          <SkillsGrid>
            {skills.map((skill, index) => (
              <SkillCard
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                <SkillTitle>{skill.name}</SkillTitle>
                <SkillLevel>
                  <SkillProgress 
                    level={skill.level}
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ 
                      width: `${skill.level}%`,
                      opacity: 1
                    }}
                    transition={{ 
                      duration: 1.5,
                      delay: 0.8 + index * 0.1,
                      ease: [0.6, -0.05, 0.01, 0.99]
                    }}
                  />
                </SkillLevel>
              </SkillCard>
            ))}
          </SkillsGrid>
        </AboutSection>
      </Content>
    </Container>
  );
};

export default About; 