import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import axios from 'axios';
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

const ContactForm = styled(motion.form)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 30px;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [emailError, setEmailError] = useState<string>('');

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

    try {
      // E-posta doğrulaması yap
      const isValidEmail = await validateEmail(formData.email);
      
      if (!isValidEmail) {
        setEmailError(t('contact.invalidEmail'));
        setStatus('error');
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
          to_email: 'batuhanerdenereksi@gmail.com',
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
    }
  };

  return (
    <Container>
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