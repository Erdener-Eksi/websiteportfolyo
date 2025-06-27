import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #16213e 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(78, 205, 196, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const LoginCard = styled(motion.div)`
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(78, 205, 196, 0.3);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 
    0 0 30px rgba(78, 205, 196, 0.2),
    0 0 60px rgba(78, 205, 196, 0.1),
    inset 0 0 20px rgba(78, 205, 196, 0.05);
  position: relative;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, 
      rgba(78, 205, 196, 0.5), 
      rgba(78, 205, 196, 0.2), 
      rgba(78, 205, 196, 0.5));
    border-radius: 22px;
    z-index: -1;
    animation: borderGlow 3s ease-in-out infinite alternate;
  }

  @keyframes borderGlow {
    0% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
`;

const Title = styled.h1`
  color: #4ECDC4;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 0 0 20px rgba(78, 205, 196, 0.5);
  letter-spacing: 2px;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin-bottom: 30px;
  font-size: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(78, 205, 196, 0.3);
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #4ECDC4;
    box-shadow: 0 0 20px rgba(78, 205, 196, 0.3);
    background: rgba(255, 255, 255, 0.1);
  }

  &:hover {
    border-color: rgba(78, 205, 196, 0.5);
  }
`;

const LoginButton = styled(motion.button)`
  background: linear-gradient(45deg, #4ECDC4, #44A08D);
  border: none;
  padding: 15px;
  border-radius: 10px;
  color: #000;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(78, 205, 196, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled(motion.div)`
  color: #ff6b6b;
  text-align: center;
  font-size: 0.9rem;
  margin-top: 10px;
  padding: 10px;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 107, 107, 0.3);
`;

const BackButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: 1px solid rgba(78, 205, 196, 0.3);
  color: #4ECDC4;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    background: rgba(78, 205, 196, 0.1);
    border-color: #4ECDC4;
    box-shadow: 0 0 15px rgba(78, 205, 196, 0.3);
  }
`;

const SecretLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Gizli kullanıcı bilgileri (gerçek uygulamada bu bilgiler güvenli bir şekilde saklanmalı)
  const SECRET_USERNAME = 'erdener';
  const SECRET_PASSWORD = 'Bee2508';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simüle edilmiş giriş gecikmesi
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (username === SECRET_USERNAME && password === SECRET_PASSWORD) {
      // Başarılı giriş
      login();
      navigate('/secret-dashboard');
    } else {
      setError('Kullanıcı adı veya şifre hatalı!');
    }

    setIsLoading(false);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <LoginContainer>
      <BackButton
        onClick={handleBack}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← Geri
      </BackButton>
      
      <LoginCard
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Title>🔐 Gizli Giriş</Title>
        <Subtitle>Yetkili erişim için giriş yapın</Subtitle>
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Input
              type="text"
              placeholder="Kullanıcı Adı"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </InputGroup>
          
          <InputGroup>
            <Input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>
          
          <LoginButton
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </LoginButton>
        </Form>
        
        {error && (
          <ErrorMessage
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </ErrorMessage>
        )}
      </LoginCard>
    </LoginContainer>
  );
};

export default SecretLogin; 