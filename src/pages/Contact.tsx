import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';

const neonPulse = keyframes`
  0% {
    filter: drop-shadow(0 0 2px #ff00ff) drop-shadow(0 0 4px #ff00ff);
  }
  50% {
    filter: drop-shadow(0 0 4px #ff00ff) drop-shadow(0 0 8px #ff00ff);
  }
  100% {
    filter: drop-shadow(0 0 2px #ff00ff) drop-shadow(0 0 4px #ff00ff);
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const robotPulse = keyframes`
  0% {
    filter: drop-shadow(0 0 2px #00ff00) drop-shadow(0 0 4px #00ff00);
  }
  50% {
    filter: drop-shadow(0 0 4px #00ff00) drop-shadow(0 0 8px #00ff00);
  }
  100% {
    filter: drop-shadow(0 0 2px #00ff00) drop-shadow(0 0 4px #00ff00);
  }
`;

const robotFloat = keyframes`
  0% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-5px) rotate(2deg);
  }
  50% {
    transform: translateY(0px) rotate(0deg);
  }
  75% {
    transform: translateY(-5px) rotate(-2deg);
  }
  100% {
    transform: translateY(0px) rotate(0deg);
  }
`;

const robotJump = keyframes`
  0% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-50px) rotate(5deg);
  }
  50% {
    transform: translateY(-100px) rotate(0deg);
  }
  75% {
    transform: translateY(-50px) rotate(-5deg);
  }
  100% {
    transform: translateY(0) rotate(0deg);
  }
`;

const spaceshipFloat = keyframes`
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(400px, -300px) rotate(5deg);
  }
  50% {
    transform: translate(-300px, 400px) rotate(-5deg);
  }
  75% {
    transform: translate(300px, -400px) rotate(3deg);
  }
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
`;

const laserBeam = keyframes`
  0% {
    opacity: 0;
    transform: scaleX(0) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scaleX(1) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: scaleX(0) rotate(0deg);
  }
`;

const neonBorder = keyframes`
  0% {
    box-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00, 0 0 15px #00ff00;
  }
  50% {
    box-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00;
  }
  100% {
    box-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00, 0 0 15px #00ff00;
  }
`;

const NeonCop = styled(motion.div)`
  position: fixed;
  bottom: 50px;
  right: 50px;
  width: 200px;
  height: 300px;
  z-index: 0;
  animation: ${float} 3s ease-in-out infinite;
  filter: drop-shadow(0 0 2px #ff00ff) drop-shadow(0 0 4px #ff00ff);
  
  @media (max-width: 768px) {
    width: 150px;
    height: 225px;
    bottom: 30px;
    right: 30px;
  }
`;

const CopSVG = styled.svg`
  width: 100%;
  height: 100%;
  fill: none;
  stroke: #ff00ff;
  stroke-width: 2;
  animation: ${neonPulse} 2s ease-in-out infinite;
`;

const NeonRobot = styled(motion.div)`
  position: fixed;
  bottom: 50px;
  right: 50px;
  width: 200px;
  height: 300px;
  z-index: 0;
  animation: ${robotFloat} 4s ease-in-out infinite;
  filter: drop-shadow(0 0 2px #00ff00) drop-shadow(0 0 4px #00ff00);
  transition: all 0.3s ease;
  overflow: visible;
  
  &.jumping {
    animation: ${robotJump} 1s ease-in-out;
  }
  
  @media (max-width: 768px) {
    width: 150px;
    height: 225px;
    bottom: 30px;
    right: 30px;
  }
`;

const RobotSVG = styled.svg`
  width: 100%;
  height: 100%;
  fill: none;
  stroke: #00ff00;
  stroke-width: 2;
  animation: ${robotPulse} 2s ease-in-out infinite;
  overflow: visible;
`;

const NeonSpaceship = styled(motion.div)`
  position: fixed;
  top: 30%;
  left: 30%;
  width: 100px;
  height: 60px;
  z-index: 1;
  animation: ${spaceshipFloat} 20s ease-in-out infinite;
  filter: drop-shadow(0 0 5px #00ff00) drop-shadow(0 0 10px #00ff00);
  pointer-events: none;
`;

const SpaceshipSVG = styled.svg`
  width: 100%;
  height: 100%;
  fill: none;
  stroke: #00ff00;
  stroke-width: 2;
  animation: ${robotPulse} 2s ease-in-out infinite;
`;

const LaserBeam = styled.div`
  position: absolute;
  top: 30px;
  right: 0;
  width: 300px;
  height: 2px;
  background: linear-gradient(90deg, #00ff00, transparent);
  transform-origin: right;
  animation: ${laserBeam} 2s ease-in-out infinite;
  pointer-events: none;
  transform: rotate(-45deg);
`;

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

const ContactForm = styled(motion.form)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 30px;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    margin-bottom: 15px;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #fff;
  font-size: 1.1rem;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 6px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;

  &:focus {
    outline: none;
    border-color: #4ecdc4;
    box-shadow: 0 0 0 2px rgba(78, 205, 196, 0.2);
  }

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 0.95rem;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;

  &:focus {
    outline: none;
    border-color: #4ecdc4;
    box-shadow: 0 0 0 2px rgba(78, 205, 196, 0.2);
  }

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 0.95rem;
    min-height: 120px;
  }
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: #fff;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 1rem;
  }
`;

const ContactInfo = styled(motion.div)`
  margin-top: 50px;
  text-align: center;
  color: #ccc;
  font-size: 1.1rem;

  @media (max-width: 768px) {
    margin-top: 30px;
    font-size: 1rem;
  }

  p {
    margin-bottom: 10px;

    @media (max-width: 768px) {
      margin-bottom: 8px;
    }
  }
`;

const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [escapePosition, setEscapePosition] = useState({ x: 0, y: 0, scale: 1 });
  const [armRotation, setArmRotation] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const robotRef = React.useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [emailError, setEmailError] = useState<string>('');

  // Mouse pozisyonunu takip et
  const handleMouseMove = (e: MouseEvent) => {
    if (robotRef.current) {
      const rect = robotRef.current.getBoundingClientRect();
      
      // Mouse robotun üzerinde mi kontrol et
      const isOverRobot = 
        e.clientX >= rect.left && 
        e.clientX <= rect.right && 
        e.clientY >= rect.top && 
        e.clientY <= rect.bottom;

      if (isOverRobot && !isHovered) {
        setIsHovered(true);
        const randomX = Math.random() > 0.5 ? 200 : -200;
        const randomY = Math.random() > 0.5 ? 100 : -100;
        setEscapePosition({ 
          x: randomX, 
          y: randomY,
          scale: 0.8
        });
      } else if (!isOverRobot && isHovered) {
        setIsHovered(false);
        setEscapePosition({ x: 0, y: 0, scale: 1 });
      }

      // Göz ve kol hareketi için mouse pozisyonunu hesapla
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = Math.max(-2, Math.min(2, ((e.clientX - centerX) / (rect.width / 2)) * 3));
      const y = Math.max(-2, Math.min(2, ((e.clientY - centerY) / (rect.height / 2)) * 3));
      setMousePosition({ x, y });

      // Kol rotasyonunu hesapla
      if (!emailError) {
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
        setArmRotation(angle - 90); // -90 derece offset to align with robot's arm
      }
    }
  };

  // E-posta hatası olduğunda kolu hareket ettir
  React.useEffect(() => {
    if (emailError) {
      setArmRotation(45); // Kolu yukarı kaldır
    }
  }, [emailError]);

  React.useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered]);

  const validateEmail = async (email: string): Promise<boolean> => {
    try {
      const response = await axios.get(`https://emailvalidation.abstractapi.com/v1/?api_key=3035c291304e4255a21dea15f9beddae&email=${email}`);
      const { is_valid_format, is_mx_found, is_smtp_valid } = response.data;
      
      return is_valid_format && is_mx_found && is_smtp_valid;
    } catch (error) {
      console.error('Email validation error:', error);
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // E-posta alanı değiştiğinde hata mesajını temizle
    if (name === 'email') {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setIsJumping(true);

    try {
      // E-posta doğrulaması yap
      const isValidEmail = await validateEmail(formData.email);
      
      if (!isValidEmail) {
        setEmailError(t('contact.invalidEmail'));
        setStatus('error');
        setIsJumping(false);
        return;
      }

      await emailjs.send(
        'service_pv3jdwr',
        'template_zjmgdjq',
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_name: 'Batuhan Erdener Ekşi',
          to_email: 'erdenereksi@gmail.com',
          reply_to: formData.email,
          user_email: formData.email,
          user_name: formData.name,
          user_subject: formData.subject,
          user_message: formData.message
        },
        'HRrU-ID-EaZ1E3mhC'
      );

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending email:', error);
      setStatus('error');
    } finally {
      setTimeout(() => setIsJumping(false), 1000);
    }
  };

  return (
    <Container>
      <NeonSpaceship
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <SpaceshipSVG viewBox="0 0 100 60">
          {/* Spaceship Body */}
          <path d="M20,30 L80,30 L70,40 L30,40 Z" />
          <path d="M30,20 L70,20 L80,30 L20,30 Z" />
          
          {/* Cockpit */}
          <ellipse cx="50" cy="25" rx="15" ry="8" />
          <ellipse cx="50" cy="25" rx="10" ry="5" fill="#00ff00" opacity="0.3" />
          
          {/* Wings */}
          <path d="M30,40 L10,50 L30,45 Z" />
          <path d="M70,40 L90,50 L70,45 Z" />
          
          {/* Engine Glow */}
          <path d="M25,40 L25,45" strokeWidth="3" />
          <path d="M75,40 L75,45" strokeWidth="3" />
          
          {/* Engine Particles */}
          <circle cx="25" cy="48" r="2" fill="#00ff00" />
          <circle cx="75" cy="48" r="2" fill="#00ff00" />
          
          {/* Decorative Lines */}
          <path d="M35,20 L35,40" />
          <path d="M65,20 L65,40" />
          <path d="M45,20 L45,40" />
          <path d="M55,20 L55,40" />
        </SpaceshipSVG>
      </NeonSpaceship>

      <NeonRobot
        ref={robotRef}
        id="neon-robot"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: escapePosition.scale,
          x: escapePosition.x,
          y: escapePosition.y,
          rotate: isHovered ? (escapePosition.x > 0 ? 15 : -15) : 0
        }}
        transition={{ 
          duration: 0.5,
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={isJumping ? 'jumping' : ''}
      >
        <RobotSVG viewBox="-50 0 300 300">
          {/* Robot Head */}
          <rect x="70" y="20" width="60" height="60" rx="10" />
          <rect x="80" y="30" width="40" height="40" rx="5" />
          
          {/* Robot Antenna */}
          <path d="M100,20 L100,10" />
          <circle cx="100" cy="10" r="3" fill="#00ff00" />
          
          {/* Robot Eyes */}
          <circle 
            cx={85 + mousePosition.x * 2} 
            cy={50 + mousePosition.y * 2} 
            r="5" 
            fill="#00ff00"
            filter="url(#neon-glow)"
          />
          <circle 
            cx={115 + mousePosition.x * 2} 
            cy={50 + mousePosition.y * 2} 
            r="5" 
            fill="#00ff00"
            filter="url(#neon-glow)"
          />
          
          {/* Robot Mouth */}
          <path d="M90,70 L110,70" />
          <path d="M85,75 L115,75" />
          
          {/* Robot Body */}
          <rect x="60" y="80" width="80" height="100" rx="10" />
          
          {/* Robot Chest Details */}
          <circle cx="100" cy="100" r="10" />
          <circle cx="100" cy="100" r="5" fill="#00ff00" />
          <path d="M90,120 L110,120" />
          <path d="M90,130 L110,130" />
          
          {/* Robot Arms */}
          <g transform={`rotate(${isJumping ? 90 : armRotation}, 50, 90)`}>
            <rect x="40" y="90" width="20" height="60" rx="5" />
            <circle cx="50" cy="160" r="8" />
          </g>
          <g transform={`rotate(${isJumping ? -90 : 0}, 150, 90)`}>
            <rect x="140" y="90" width="20" height="60" rx="5" />
            <circle cx="150" cy="160" r="8" />
          </g>
          
          {/* Robot Legs */}
          <rect x="70" y="180" width="25" height="80" rx="5" />
          <rect x="105" y="180" width="25" height="80" rx="5" />
          
          {/* Robot Feet */}
          <rect x="60" y="260" width="35" height="15" rx="5" />
          <rect x="105" y="260" width="35" height="15" rx="5" />
          
          {/* Neon Glow Filter */}
          <defs>
            <filter id="neon-glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        </RobotSVG>
      </NeonRobot>
      <Content>
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t('contact.title')}
        </Title>

        <ContactForm
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit}
        >
          <FormGroup>
            <Label htmlFor="name">{t('contact.form.name')}</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              autoFocus
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">{t('contact.form.email')}</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ borderColor: emailError ? '#ff6b6b' : 'rgba(255, 255, 255, 0.1)' }}
            />
            {emailError && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ color: '#ff6b6b', marginTop: '5px', fontSize: '0.9rem' }}
              >
                {emailError}
              </motion.p>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="subject">{t('contact.subject')}</Label>
            <Input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="message">{t('contact.form.message')}</Label>
            <TextArea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <SubmitButton
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={status === 'sending'}
          >
            {status === 'sending' ? t('contact.sending') : t('contact.form.submit')}
          </SubmitButton>

          {status === 'success' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ color: '#4ecdc4', marginTop: '10px', textAlign: 'center' }}
            >
              {t('contact.success')}
            </motion.p>
          )}

          {status === 'error' && !emailError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ color: '#ff6b6b', marginTop: '10px', textAlign: 'center' }}
            >
              {t('contact.error')}
            </motion.p>
          )}
        </ContactForm>

        <ContactInfo
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p>{t('contact.info.email')}</p>
          <p>{t('contact.info.phone')}</p>
          <p>{t('contact.info.address')}</p>
        </ContactInfo>
      </Content>
    </Container>
  );
};

export default Contact; 