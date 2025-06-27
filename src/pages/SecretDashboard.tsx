import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const DashboardContainer = styled.div<{ $isDarkMode: boolean }>`
  min-height: 100vh;
  background: ${props => props.$isDarkMode 
    ? `linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0e3a5f 75%, #1a1a2e 100%)`
    : `linear-gradient(135deg, #ffffff 0%, #f8fafc 25%, #e2e8f0 50%, #cbd5e1 75%, #f1f5f9 100%)`
  };
  padding: 10px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  @media (min-width: 768px) {
    padding: 20px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.$isDarkMode
      ? `radial-gradient(circle at 20% 80%, rgba(78, 205, 196, 0.15) 0%, transparent 50%),
         radial-gradient(circle at 80% 20%, rgba(156, 39, 176, 0.1) 0%, transparent 50%),
         radial-gradient(circle at 50% 50%, rgba(255, 152, 0, 0.05) 0%, transparent 70%)`
      : `radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
         radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
         radial-gradient(circle at 50% 50%, rgba(245, 101, 101, 0.05) 0%, transparent 70%)`
    };
    pointer-events: none;
    animation: backgroundPulse 10s infinite alternate;
  }

  @keyframes backgroundPulse {
    0% { opacity: 0.8; }
    100% { opacity: 1; }
  }
`;

const Header = styled.div<{ $isDarkMode: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding: 20px 25px;
  background: ${props => props.$isDarkMode 
    ? 'linear-gradient(145deg, rgba(15, 15, 35, 0.95), rgba(26, 26, 46, 0.9))' 
    : 'linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9))'
  };
  backdrop-filter: blur(25px);
  border: 1px solid ${props => props.$isDarkMode 
    ? 'rgba(78, 205, 196, 0.4)' 
    : 'rgba(59, 130, 246, 0.4)'
  };
  border-radius: 20px;
  box-shadow: ${props => props.$isDarkMode 
    ? `0 8px 32px rgba(0, 0, 0, 0.4),
       0 0 40px rgba(78, 205, 196, 0.2),
       inset 0 1px 0 rgba(255, 255, 255, 0.1)` 
    : `0 8px 32px rgba(0, 0, 0, 0.1),
       0 0 40px rgba(59, 130, 246, 0.2),
       inset 0 1px 0 rgba(255, 255, 255, 0.8)`
  };
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: ${props => props.$isDarkMode
      ? 'linear-gradient(90deg, transparent, rgba(78, 205, 196, 0.1), transparent)'
      : 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent)'
    };
    animation: shine 3s infinite;
  }

  @keyframes shine {
    0% { left: -100%; }
    100% { left: 100%; }
  }

  @media (min-width: 768px) {
    margin-bottom: 35px;
    padding: 25px 30px;
  }
`;

const Title = styled.h1<{ $isDarkMode: boolean }>`
  background: ${props => props.$isDarkMode
    ? 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 50%, #9C27B0 100%)'
    : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #7c3aed 100%)'
  };
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  text-shadow: ${props => props.$isDarkMode 
    ? '0 0 30px rgba(78, 205, 196, 0.6)' 
    : '0 0 30px rgba(59, 130, 246, 0.4)'
  };
  position: relative;
  animation: titleGlow 3s ease-in-out infinite alternate;

  @keyframes titleGlow {
    0% { 
      filter: brightness(1);
      transform: scale(1);
    }
    100% { 
      filter: brightness(1.1);
      transform: scale(1.02);
    }
  }

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 100%;
    height: 3px;
    background: ${props => props.$isDarkMode
      ? 'linear-gradient(90deg, #4ECDC4, #44A08D, #9C27B0)'
      : 'linear-gradient(90deg, #3b82f6, #1d4ed8, #7c3aed)'
    };
    border-radius: 2px;
    animation: underlineGlow 2s ease-in-out infinite alternate;
  }

  @keyframes underlineGlow {
    0% { opacity: 0.6; transform: scaleX(0.8); }
    100% { opacity: 1; transform: scaleX(1); }
  }
`;

const LogoutButton = styled(motion.button)`
  background: linear-gradient(45deg, #ff6b6b, #ee5a52);
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;

  @media (min-width: 768px) {
    padding: 12px 24px;
    font-size: 1rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(255, 107, 107, 0.4);
  }
`;

const PDFButton = styled(motion.button)`
  background: linear-gradient(45deg, #4ECDC4, #44A08D);
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  color: #000;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;

  @media (min-width: 768px) {
    padding: 12px 24px;
    font-size: 1rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(78, 205, 196, 0.4);
  }
`;

const ThemeButton = styled(motion.button)<{ $isDarkMode: boolean }>`
  background: ${props => props.$isDarkMode 
    ? 'linear-gradient(45deg, #fbbf24, #f59e0b)' 
    : 'linear-gradient(45deg, #1e293b, #334155)'
  };
  border: none;
  padding: 8px 12px;
  border-radius: 50%;
  color: ${props => props.$isDarkMode ? '#000' : '#fff'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: translateY(-2px) rotate(180deg);
    box-shadow: ${props => props.$isDarkMode 
      ? '0 10px 30px rgba(251, 191, 36, 0.4)' 
      : '0 10px 30px rgba(30, 41, 59, 0.4)'
    };
  }
`;

const TileGridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 30px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 25px;
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 30px;
  }
`;

const DashboardWidget = styled(motion.div)<{ $isDarkMode?: boolean }>`
  background: ${props => props.$isDarkMode 
    ? 'rgba(26, 26, 46, 0.6)' 
    : 'rgba(255, 255, 255, 0.8)'
  };
  border: 1px solid ${props => props.$isDarkMode 
    ? 'rgba(78, 205, 196, 0.2)' 
    : 'rgba(59, 130, 246, 0.2)'
  };
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
  box-shadow: ${props => props.$isDarkMode 
    ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
    : '0 4px 20px rgba(0, 0, 0, 0.1)'
  };
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.$isDarkMode 
      ? '0 8px 30px rgba(78, 205, 196, 0.2)' 
      : '0 8px 30px rgba(59, 130, 246, 0.2)'
    };
  }
`;

const WidgetTitle = styled.div<{ $isDarkMode?: boolean }>`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.$isDarkMode ? '#fff' : '#1f2937'};
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const WidgetValue = styled.div<{ $isDarkMode?: boolean; $color?: string }>`
  font-size: 2rem;
  font-weight: 800;
  color: ${props => props.$color || (props.$isDarkMode ? '#4ECDC4' : '#3b82f6')};
  margin-bottom: 5px;
  line-height: 1;
`;

const WidgetSubtext = styled.div<{ $isDarkMode?: boolean }>`
  font-size: 0.85rem;
  color: ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'};
`;

const DashboardWidgetGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 25px;
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 30px;
  }
`;

const DataCard = styled(motion.div)<{ $isDarkMode?: boolean; $type?: string }>`
  background: ${props => props.$isDarkMode 
    ? 'linear-gradient(135deg, rgba(26, 26, 46, 0.9), rgba(15, 15, 35, 0.8))' 
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9))'
  };
  border: 1px solid ${props => {
    if (props.$type === 'income') return props.$isDarkMode ? 'rgba(76, 175, 80, 0.3)' : 'rgba(76, 175, 80, 0.2)';
    if (props.$type === 'expense') return props.$isDarkMode ? 'rgba(244, 67, 54, 0.3)' : 'rgba(244, 67, 54, 0.2)';
    if (props.$type === 'debt') return props.$isDarkMode ? 'rgba(255, 152, 0, 0.3)' : 'rgba(255, 152, 0, 0.2)';
    return props.$isDarkMode ? 'rgba(78, 205, 196, 0.2)' : 'rgba(59, 130, 246, 0.2)';
  }};
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(15px);
  box-shadow: ${props => props.$isDarkMode 
    ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
    : '0 8px 32px rgba(0, 0, 0, 0.1)'
  };
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => {
      if (props.$type === 'income') return '0 12px 40px rgba(76, 175, 80, 0.2)';
      if (props.$type === 'expense') return '0 12px 40px rgba(244, 67, 54, 0.2)';
      if (props.$type === 'debt') return '0 12px 40px rgba(255, 152, 0, 0.2)';
      return props.$isDarkMode ? '0 12px 40px rgba(78, 205, 196, 0.2)' : '0 12px 40px rgba(59, 130, 246, 0.2)';
    }};
  }
`;

const DataCardHeader = styled.div<{ $isDarkMode?: boolean; $type?: string }>`
  padding: 20px 25px;
  background: ${props => {
    if (props.$type === 'income') return props.$isDarkMode 
      ? 'linear-gradient(90deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05))' 
      : 'linear-gradient(90deg, rgba(76, 175, 80, 0.05), rgba(76, 175, 80, 0.02))';
    if (props.$type === 'expense') return props.$isDarkMode 
      ? 'linear-gradient(90deg, rgba(244, 67, 54, 0.1), rgba(244, 67, 54, 0.05))' 
      : 'linear-gradient(90deg, rgba(244, 67, 54, 0.05), rgba(244, 67, 54, 0.02))';
    if (props.$type === 'debt') return props.$isDarkMode 
      ? 'linear-gradient(90deg, rgba(255, 152, 0, 0.1), rgba(255, 152, 0, 0.05))' 
      : 'linear-gradient(90deg, rgba(255, 152, 0, 0.05), rgba(255, 152, 0, 0.02))';
    return props.$isDarkMode 
      ? 'linear-gradient(90deg, rgba(78, 205, 196, 0.1), rgba(78, 205, 196, 0.05))' 
      : 'linear-gradient(90deg, rgba(59, 130, 246, 0.05), rgba(59, 130, 246, 0.02))';
  }};
  border-bottom: 1px solid ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DataCardTitle = styled.h3<{ $isDarkMode?: boolean }>`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${props => props.$isDarkMode ? '#fff' : '#1f2937'};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const DataCardValue = styled.div<{ $type?: string }>`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => {
    if (props.$type === 'income') return '#4CAF50';
    if (props.$type === 'expense') return '#F44336';
    if (props.$type === 'debt') return '#FF9800';
    return '#4ECDC4';
  }};
`;

const DataCardContent = styled.div`
  padding: 25px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const ActionButton = styled(motion.button)<{ $variant?: 'primary' | 'secondary'; $isDarkMode?: boolean }>`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => {
    if (props.$variant === 'primary') {
      return props.$isDarkMode 
        ? 'linear-gradient(45deg, #4ECDC4, #44A08D)' 
        : 'linear-gradient(45deg, #3b82f6, #1d4ed8)';
    }
    return props.$isDarkMode 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.05)';
  }};
  color: ${props => {
    if (props.$variant === 'primary') return '#000';
    return props.$isDarkMode ? '#fff' : '#374151';
  }};
  border: 1px solid ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const QuickForm = styled(motion.div)<{ $isDarkMode?: boolean }>`
  background: ${props => props.$isDarkMode ? 'rgba(20, 20, 40, 0.8)' : 'rgba(248, 250, 252, 0.9)'};
  border: 2px solid ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ModernInput = styled.input<{ $isDarkMode?: boolean }>`
  padding: 12px 16px;
  border: 2px solid ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'};
  border-radius: 8px;
  background: ${props => props.$isDarkMode ? 'rgba(30, 30, 60, 0.8)' : 'rgba(255, 255, 255, 0.95)'};
  color: ${props => props.$isDarkMode ? '#fff' : '#1f2937'};
  font-size: 0.9rem;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #4ECDC4;
    box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.2);
    background: ${props => props.$isDarkMode ? 'rgba(30, 30, 60, 0.9)' : 'rgba(255, 255, 255, 1)'};
  }

  &::placeholder {
    color: ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'};
  }
`;

const ModernSelect = styled.select<{ $isDarkMode?: boolean }>`
  padding: 12px 16px;
  border: 2px solid ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'};
  border-radius: 8px;
  background: ${props => props.$isDarkMode ? 'rgba(30, 30, 60, 0.8)' : 'rgba(255, 255, 255, 0.95)'};
  color: ${props => props.$isDarkMode ? '#fff' : '#1f2937'};
  font-size: 0.9rem;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #4ECDC4;
    box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.2);
    background: ${props => props.$isDarkMode ? 'rgba(30, 30, 60, 0.9)' : 'rgba(255, 255, 255, 1)'};
  }

  option {
    background: ${props => props.$isDarkMode ? '#1e1e3c' : '#fff'};
    color: ${props => props.$isDarkMode ? '#fff' : '#1f2937'};
  }
`;

const ItemGrid = styled.div`
  display: grid;
  gap: 12px;
`;

const DataItem = styled(motion.div)<{ $isDarkMode?: boolean; $type?: string }>`
  background: ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.6)'};
  border: 1px solid ${props => {
    if (props.$type === 'income') return props.$isDarkMode ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.1)';
    if (props.$type === 'expense') return props.$isDarkMode ? 'rgba(244, 67, 54, 0.2)' : 'rgba(244, 67, 54, 0.1)';
    if (props.$type === 'debt') return props.$isDarkMode ? 'rgba(255, 152, 0, 0.2)' : 'rgba(255, 152, 0, 0.1)';
    return props.$isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
  }};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(4px);
    border-color: ${props => {
      if (props.$type === 'income') return '#4CAF50';
      if (props.$type === 'expense') return '#F44336';
      if (props.$type === 'debt') return '#FF9800';
      return '#4ECDC4';
    }};
  }
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.h4<{ $isDarkMode?: boolean }>`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.$isDarkMode ? '#fff' : '#1f2937'};
  margin: 0 0 4px 0;
`;

const ItemMeta = styled.p<{ $isDarkMode?: boolean }>`
  font-size: 0.85rem;
  color: ${props => props.$isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'};
  margin: 0;
`;

const ItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ModernItemAmount = styled.span<{ $type?: string }>`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${props => {
    if (props.$type === 'income') return '#4CAF50';
    if (props.$type === 'expense') return '#F44336';
    if (props.$type === 'debt') return '#FF9800';
    return '#4ECDC4';
  }};
`;

const DeleteBtn = styled(motion.button)<{ $isDarkMode?: boolean }>`
  padding: 6px 12px;
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
  border-radius: 6px;
  color: #F44336;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(244, 67, 54, 0.2);
    transform: scale(1.05);
  }
`;

const FinancialTile = styled(motion.div)<{ 
  $isDarkMode?: boolean; 
  $variant?: 'overview' | 'income' | 'expense' | 'debt' | 'fixed' | 'recurring';
  $isCompact?: boolean;
}>`
  background: ${props => props.$isDarkMode 
    ? 'linear-gradient(145deg, rgba(26, 26, 46, 0.95), rgba(15, 15, 35, 0.9))' 
    : 'linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9))'
  };
  backdrop-filter: blur(20px);
  border: 2px solid ${props => {
    const variants = {
      overview: props.$isDarkMode ? '#4ECDC4' : '#3b82f6',
      income: '#4CAF50',
      expense: '#F44336', 
      debt: '#FF9800',
      fixed: '#9C27B0',
      recurring: '#00BCD4'
    };
    const color = variants[props.$variant || 'overview'];
    return `${color}40`; // 25% opacity
  }};
  border-radius: 20px;
  padding: ${props => props.$isCompact ? '20px' : '0'};
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: ${props => props.$isCompact ? 'auto' : '200px'};
  height: auto;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-6px) scale(1.02);
    border-color: ${props => {
      const variants = {
        overview: props.$isDarkMode ? '#4ECDC4' : '#3b82f6',
        income: '#4CAF50',
        expense: '#F44336', 
        debt: '#FF9800',
        fixed: '#9C27B0',
        recurring: '#00BCD4'
      };
      const color = variants[props.$variant || 'overview'];
      return `${color}80`; // 50% opacity
    }};
    box-shadow: ${props => {
      const variants = {
        overview: props.$isDarkMode ? 'rgba(78, 205, 196, 0.3)' : 'rgba(59, 130, 246, 0.3)',
        income: 'rgba(76, 175, 80, 0.3)',
        expense: 'rgba(244, 67, 54, 0.3)', 
        debt: 'rgba(255, 152, 0, 0.3)',
        fixed: 'rgba(156, 39, 176, 0.3)',
        recurring: 'rgba(0, 188, 212, 0.3)'
      };
      const color = variants[props.$variant || 'overview'];
      return `0 20px 40px ${color}`;
    }};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: ${props => {
      const variants = {
        overview: props.$isDarkMode ? 'linear-gradient(90deg, #4ECDC4, #44A08D)' : 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
        income: 'linear-gradient(90deg, #4CAF50, #81C784)',
        expense: 'linear-gradient(90deg, #F44336, #E57373)', 
        debt: 'linear-gradient(90deg, #FF9800, #FFB74D)',
        fixed: 'linear-gradient(90deg, #9C27B0, #BA68C8)',
        recurring: 'linear-gradient(90deg, #00BCD4, #4DD0E1)'
      };
      return variants[props.$variant || 'overview'];
    }};
    border-radius: 20px 20px 0 0;
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: ${props => {
      const variants = {
        overview: 'radial-gradient(circle, rgba(78, 205, 196, 0.1) 0%, transparent 70%)',
        income: 'radial-gradient(circle, rgba(76, 175, 80, 0.1) 0%, transparent 70%)',
        expense: 'radial-gradient(circle, rgba(244, 67, 54, 0.1) 0%, transparent 70%)', 
        debt: 'radial-gradient(circle, rgba(255, 152, 0, 0.1) 0%, transparent 70%)',
        fixed: 'radial-gradient(circle, rgba(156, 39, 176, 0.1) 0%, transparent 70%)',
        recurring: 'radial-gradient(circle, rgba(0, 188, 212, 0.1) 0%, transparent 70%)'
      };
      return variants[props.$variant || 'overview'];
    }};
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 50%;
  }

  &:hover::after {
    opacity: 1;
  }
`;

// Backward compatibility aliases
const AccordionCard = FinancialTile;
const AccordionHeader = styled.div<{ $isOpen: boolean; $isDarkMode?: boolean }>`
  padding: 24px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: ${props => props.$isOpen 
    ? `1px solid ${props.$isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}` 
    : 'none'
  };
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.$isDarkMode 
      ? 'rgba(255, 255, 255, 0.05)' 
      : 'rgba(0, 0, 0, 0.02)'
    };
  }
`;
const AccordionTitle = styled.h2<{ $isDarkMode?: boolean }>`
  color: ${props => props.$isDarkMode ? '#4ECDC4' : '#3b82f6'};
  font-size: 1.1rem;
  margin: 0;
  font-weight: 600;
`;

const CardHeader = styled.div<{ $isDarkMode?: boolean; $type?: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.$isDarkMode 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'
  };
`;

const CardTitle = styled.h2<{ $isDarkMode?: boolean; $type?: string }>`
  color: ${props => {
    if (!props.$type) return props.$isDarkMode ? '#4ECDC4' : '#3b82f6';
    const colors = {
      overview: props.$isDarkMode ? '#4ECDC4' : '#3b82f6',
      income: '#4CAF50',
      expense: '#F44336', 
      debt: '#FF9800',
      fixed: '#9C27B0',
      recurring: '#00BCD4'
    };
    return colors[props.$type as keyof typeof colors] || (props.$isDarkMode ? '#4ECDC4' : '#3b82f6');
  }};
  font-size: 1.3rem;
  margin: 0;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const CardContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 24px 24px 24px;
  overflow: visible;
`;

const AccordionValue = styled.div<{ $type: 'income' | 'expense' | 'debt' | 'balance' }>`
  color: ${props => {
    switch (props.$type) {
      case 'income': return '#4CAF50';
      case 'expense': return '#F44336';
      case 'debt': return '#FF9800';
      case 'balance': return '#4ECDC4';
      default: return '#4ECDC4';
    }
  }};
  font-weight: 700;
  font-size: 1.1rem;

  @media (min-width: 768px) {
    font-size: 1.3rem;
  }
`;

const AccordionIcon = styled.div<{ $isOpen: boolean; $isDarkMode?: boolean }>`
  color: ${props => props.$isDarkMode ? '#4ECDC4' : '#3b82f6'};
  font-size: 1.2rem;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  transition: all 0.2s ease;
  opacity: 0.8;

  &:hover {
    opacity: 1;
    transform: ${props => props.$isOpen ? 'rotate(180deg) scale(1.1)' : 'rotate(0deg) scale(1.1)'};
  }
`;

const AccordionContent = styled(motion.div)`
  padding: 24px;
  overflow: hidden;
  will-change: transform, opacity;
  background: rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 25px;
  }
`;

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 1fr 1fr;
  }
`;

const ChartCard = styled.div<{ $isDarkMode: boolean }>`
  background: ${props => props.$isDarkMode 
    ? 'rgba(0, 0, 0, 0.8)' 
    : 'rgba(255, 255, 255, 0.9)'
  };
  backdrop-filter: blur(20px);
  border: 1px solid ${props => props.$isDarkMode 
    ? 'rgba(78, 205, 196, 0.3)' 
    : 'rgba(59, 130, 246, 0.3)'
  };
  border-radius: 15px;
  padding: 20px;
  box-shadow: ${props => props.$isDarkMode 
    ? '0 0 30px rgba(78, 205, 196, 0.2)' 
    : '0 0 30px rgba(59, 130, 246, 0.2)'
  };
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.$isDarkMode 
      ? '0 10px 40px rgba(78, 205, 196, 0.3)' 
      : '0 10px 40px rgba(59, 130, 246, 0.3)'
    };
  }
`;

const ChartTitle = styled.h3<{ $isDarkMode: boolean }>`
  color: ${props => props.$isDarkMode ? '#4ECDC4' : '#3b82f6'};
  margin: 0 0 15px 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const ProgressContainer = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto;
`;

const QuickActionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(5, 1fr);
  }

  @media (max-width: 767px) {
    grid-template-columns: repeat(2, 1fr);
    
    /* 5. button'u ortala */
    & > :nth-child(5) {
      grid-column: 1 / -1;
      max-width: 200px;
      margin: 0 auto;
    }
  }
`;

const QuickActionButton = styled(motion.button)<{ $isDarkMode: boolean; $type: 'income' | 'expense' | 'debt' | 'fixed' }>`
  background: ${props => {
    const colors = {
      income: props.$isDarkMode 
        ? 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 50%, #1B5E20 100%)'
        : 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
      expense: props.$isDarkMode 
        ? 'linear-gradient(135deg, #F44336 0%, #C62828 50%, #B71C1C 100%)'
        : 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)',
      debt: props.$isDarkMode 
        ? 'linear-gradient(135deg, #9C27B0 0%, #6A1B9A 50%, #4A148C 100%)'
        : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)',
      fixed: props.$isDarkMode 
        ? 'linear-gradient(135deg, #FF9800 0%, #EF6C00 50%, #E65100 100%)'
        : 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)'
    };
    return colors[props.$type];
  }};
  border: none;
  padding: 20px;
  border-radius: 20px;
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  font-size: 0.95rem;
  position: relative;
  overflow: hidden;
  box-shadow: ${props => props.$isDarkMode 
    ? `0 8px 32px rgba(0, 0, 0, 0.4),
       0 0 0 1px rgba(255, 255, 255, 0.1),
       inset 0 1px 0 rgba(255, 255, 255, 0.2)` 
    : `0 8px 32px rgba(0, 0, 0, 0.15),
       0 0 0 1px rgba(255, 255, 255, 0.2),
       inset 0 1px 0 rgba(255, 255, 255, 0.4)`
  };

  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: ${props => props.$isDarkMode 
      ? `0 16px 48px rgba(0, 0, 0, 0.5),
         0 0 0 1px rgba(255, 255, 255, 0.15),
         inset 0 1px 0 rgba(255, 255, 255, 0.3)` 
      : `0 16px 48px rgba(0, 0, 0, 0.2),
         0 0 0 1px rgba(255, 255, 255, 0.3),
         inset 0 1px 0 rgba(255, 255, 255, 0.5)`
    };

    .icon {
      transform: scale(1.1) rotate(5deg);
    }
  }

  &:active {
    transform: translateY(-2px) scale(0.98);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.6s ease;
  }

  &:hover::before {
    left: 100%;
  }

  .icon {
    font-size: 1.8rem;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    transition: transform 0.3s ease;
  }

  @media (min-width: 768px) {
    padding: 25px;
    font-size: 1.1rem;
    border-radius: 25px;
    
    .icon {
      font-size: 2.2rem;
    }
  }
`;

const StatCard = styled.div<{ $type: 'income' | 'expense' | 'debt' | 'balance' }>`
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(20px);
  border: 2px solid ${props => {
    switch (props.$type) {
      case 'income': return 'rgba(76, 175, 80, 0.4)';
      case 'expense': return 'rgba(244, 67, 54, 0.4)';
      case 'debt': return 'rgba(255, 152, 0, 0.4)';
      case 'balance': return 'rgba(78, 205, 196, 0.4)';
      default: return 'rgba(78, 205, 196, 0.4)';
    }
  }};
  border-radius: 20px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
    border-color: ${props => {
      switch (props.$type) {
        case 'income': return 'rgba(76, 175, 80, 0.6)';
        case 'expense': return 'rgba(244, 67, 54, 0.6)';
        case 'debt': return 'rgba(255, 152, 0, 0.6)';
        case 'balance': return 'rgba(78, 205, 196, 0.6)';
        default: return 'rgba(78, 205, 196, 0.6)';
      }
    }};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => {
      switch (props.$type) {
        case 'income': return 'linear-gradient(90deg, #4CAF50, #81C784)';
        case 'expense': return 'linear-gradient(90deg, #F44336, #E57373)';
        case 'debt': return 'linear-gradient(90deg, #FF9800, #FFB74D)';
        case 'balance': return 'linear-gradient(90deg, #4ECDC4, #80CBC4)';
        default: return 'linear-gradient(90deg, #4ECDC4, #80CBC4)';
      }
    }};
    border-radius: 20px 20px 0 0;
  }
`;

const StatValue = styled.div<{ $type: 'income' | 'expense' | 'debt' | 'balance' }>`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${props => {
    switch (props.$type) {
      case 'income': return '#4CAF50';
      case 'expense': return '#F44336';
      case 'debt': return '#FF9800';
      case 'balance': return '#4ECDC4';
      default: return '#4ECDC4';
    }
  }};
  margin-bottom: 5px;

  @media (min-width: 768px) {
    font-size: 1.3rem;
  }
`;

// Animated Counter Component
const AnimatedCounter: React.FC<{ 
  value: number; 
  duration?: number; 
  prefix?: string; 
  suffix?: string;
  $type: 'income' | 'expense' | 'debt' | 'balance';
}> = ({ value, duration = 2, prefix = '₺', suffix = '', $type }) => {
  const [displayedValue, setDisplayedValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const increment = end / (duration * 60); // 60fps
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayedValue(end);
        clearInterval(timer);
      } else {
        setDisplayedValue(Math.round(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <StatValue $type={$type}>
      <motion.span
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {prefix}{displayedValue.toLocaleString('tr-TR')}{suffix}
      </motion.span>
    </StatValue>
  );
};

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);

  @media (min-width: 768px) {
    font-size: 0.9rem;
  }
`;

const AddButton = styled(motion.button)<{ $isCancel?: boolean }>`
  background: ${props => props.$isCancel 
    ? 'linear-gradient(45deg, #F44336, #d32f2f)' 
    : 'linear-gradient(45deg, #4ECDC4, #44A08D)'
  };
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  color: ${props => props.$isCancel ? '#fff' : '#000'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 15px;
  width: 100%;

  @media (min-width: 768px) {
    width: auto;
    min-width: 140px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.$isCancel 
      ? '0 10px 30px rgba(244, 67, 54, 0.4)' 
      : '0 10px 30px rgba(78, 205, 196, 0.4)'
    };
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  align-items: center;
  
  @media (max-width: 767px) {
    flex-direction: column;
    
    button {
      width: 100%;
    }
  }
`;

const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Input = styled.input`
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(78, 205, 196, 0.3);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #4ECDC4;
    box-shadow: 0 0 15px rgba(78, 205, 196, 0.3);
  }
`;

const Select = styled.select`
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(78, 205, 196, 0.3);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4ECDC4;
    box-shadow: 0 0 15px rgba(78, 205, 196, 0.3);
  }

  option {
    background: #1a1a2e;
    color: #fff;
  }
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(45deg, #4ECDC4, #44A08D);
  border: none;
  padding: 12px;
  border-radius: 8px;
  color: #000;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(78, 205, 196, 0.4);
  }
`;

const ItemList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const Item = styled.div<{ $type: 'income' | 'expense' | 'debt' }>`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid ${props => {
    switch (props.$type) {
      case 'income': return 'rgba(76, 175, 80, 0.3)';
      case 'expense': return 'rgba(244, 67, 54, 0.3)';
      case 'debt': return 'rgba(255, 152, 0, 0.3)';
      default: return 'rgba(78, 205, 196, 0.3)';
    }
  }};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 80px;
`;

const ItemTitle = styled.div`
  color: #fff;
  font-weight: 600;
  margin-bottom: 5px;
  font-size: 0.9rem;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const ItemDetails = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  margin-bottom: 8px;
`;

const ItemAmount = styled.div<{ $type: 'income' | 'expense' | 'debt' }>`
  color: ${props => {
    switch (props.$type) {
      case 'income': return '#4CAF50';
      case 'expense': return '#F44336';
      case 'debt': return '#FF9800';
      default: return '#4ECDC4';
    }
  }};
  font-weight: 700;
  font-size: 1rem;
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DeleteButton = styled.button`
  background: rgba(244, 67, 54, 0.2);
  border: 1px solid rgba(244, 67, 54, 0.3);
  color: #F44336;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: 50px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(244, 67, 54, 0.4);
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(244, 67, 54, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

interface FinancialItem {
  id: string;
  title: string;
  amount: number;
  date: string;
  description?: string;
  category?: string;
}

interface Debt extends FinancialItem {
  dueDate: string;
  interestRate?: number;
  monthlyPayment?: number;
  totalMonths: number;
  remainingMonths: number;
  startDate: string;
  paidAmount: number;
  lastPaymentDate?: string;
}

interface RecurringIncome extends FinancialItem {
  frequency: 'monthly' | 'weekly' | 'biweekly' | 'yearly';
  startDate: string;
  endDate?: string; // Optional - for temporary recurring income
  isActive: boolean;
  nextPaymentDate: string;
  totalReceived: number;
  receivedCount: number;
}

const SecretDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const [incomes, setIncomes] = useState<FinancialItem[]>([]);
  const [expenses, setExpenses] = useState<FinancialItem[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [fixedExpenses, setFixedExpenses] = useState<FinancialItem[]>([]);
  const [recurringIncomes, setRecurringIncomes] = useState<RecurringIncome[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Accordion states
  const [openSection, setOpenSection] = useState<string | null>('overview');
  
  // Form states
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showDebtForm, setShowDebtForm] = useState(false);
  const [showFixedExpenseForm, setShowFixedExpenseForm] = useState(false);
  const [showRecurringIncomeForm, setShowRecurringIncomeForm] = useState(false);

  const [incomeForm, setIncomeForm] = useState({ title: '', amount: '', date: '', description: '' });
  const [expenseForm, setExpenseForm] = useState({ title: '', amount: '', date: '', category: '' });
  const [debtForm, setDebtForm] = useState({ 
    title: '', 
    amount: '', 
    dueDate: '', 
    interestRate: '', 
    monthlyPayment: '',
    totalMonths: '',
    startDate: ''
  });
  const [fixedExpenseForm, setFixedExpenseForm] = useState({ title: '', amount: '', category: '' });
  const [recurringIncomeForm, setRecurringIncomeForm] = useState({ 
    title: '', 
    amount: '', 
    frequency: 'monthly',
    startDate: '',
    endDate: '',
    description: ''
  });



  // Load data from localStorage on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/secret-login');
      return;
    }

    const loadFinancialData = () => {
      try {
        const savedIncomes = localStorage.getItem('financial_incomes');
        const savedExpenses = localStorage.getItem('financial_expenses');
        const savedDebts = localStorage.getItem('financial_debts');
        const savedFixedExpenses = localStorage.getItem('financial_fixedExpenses');
        const savedRecurringIncomes = localStorage.getItem('financial_recurringIncomes');

        if (savedIncomes && savedIncomes !== '[]') {
          const parsedIncomes = JSON.parse(savedIncomes);
          if (Array.isArray(parsedIncomes) && parsedIncomes.length > 0) {
            setIncomes(parsedIncomes);
          }
        }
        
        if (savedExpenses && savedExpenses !== '[]') {
          const parsedExpenses = JSON.parse(savedExpenses);
          if (Array.isArray(parsedExpenses) && parsedExpenses.length > 0) {
            setExpenses(parsedExpenses);
          }
        }
        
        if (savedDebts && savedDebts !== '[]') {
          const parsedDebts = JSON.parse(savedDebts);
          if (Array.isArray(parsedDebts) && parsedDebts.length > 0) {
            setDebts(parsedDebts);
          }
        }
        
        if (savedFixedExpenses && savedFixedExpenses !== '[]') {
          const parsedFixedExpenses = JSON.parse(savedFixedExpenses);
          if (Array.isArray(parsedFixedExpenses) && parsedFixedExpenses.length > 0) {
            setFixedExpenses(parsedFixedExpenses);
          }
        }
        
        if (savedRecurringIncomes && savedRecurringIncomes !== '[]') {
          const parsedRecurringIncomes = JSON.parse(savedRecurringIncomes);
          if (Array.isArray(parsedRecurringIncomes) && parsedRecurringIncomes.length > 0) {
            setRecurringIncomes(parsedRecurringIncomes);
          }
        }
      } catch (error) {
        console.error('Error loading financial data from localStorage:', error);
      }
    };

         loadFinancialData();
     setDataLoaded(true);
  }, [navigate, isAuthenticated]);

  // Save data to localStorage whenever data changes (only after initial load)
  useEffect(() => { 
    if (isAuthenticated && dataLoaded) {
      localStorage.setItem('financial_incomes', JSON.stringify(incomes)); 
    }
  }, [incomes, isAuthenticated, dataLoaded]);
  
  useEffect(() => { 
    if (isAuthenticated && dataLoaded) {
      localStorage.setItem('financial_expenses', JSON.stringify(expenses)); 
    }
  }, [expenses, isAuthenticated, dataLoaded]);
  
  useEffect(() => { 
    if (isAuthenticated && dataLoaded) {
      localStorage.setItem('financial_debts', JSON.stringify(debts)); 
    }
  }, [debts, isAuthenticated, dataLoaded]);
  
  useEffect(() => { 
    if (isAuthenticated && dataLoaded) {
      localStorage.setItem('financial_fixedExpenses', JSON.stringify(fixedExpenses)); 
    }
  }, [fixedExpenses, isAuthenticated, dataLoaded]);
  
  useEffect(() => { 
    if (isAuthenticated && dataLoaded) {
      localStorage.setItem('financial_recurringIncomes', JSON.stringify(recurringIncomes)); 
    }
  }, [recurringIncomes, isAuthenticated, dataLoaded]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Türkçe karakter desteği için font ayarları
    doc.setFont('helvetica', 'normal');
    
    // Başlık
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Finansal Rapor', 20, 20);
    
    // Tarih
    const currentDate = new Date().toLocaleDateString('tr-TR');
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('Rapor Tarihi: ' + currentDate, 20, 30);
    
    let yPosition = 50;
    
    // Özet Bilgiler
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text('OZET BILGILER', 20, yPosition);
    yPosition += 10;
    
    const summaryData = [
      ['Toplam Gelir', totalIncome.toLocaleString() + ' TL'],
      ['Toplam Gider', totalExpenses.toLocaleString() + ' TL'],
      ['Kalan Borc', totalRemainingDebts.toLocaleString() + ' TL'],
      ['Sabit Giderler', totalFixedExpenses.toLocaleString() + ' TL'],
      ['Net Bakiye', totalBalance.toLocaleString() + ' TL'],
      ['Net Deger', netWorth.toLocaleString() + ' TL']
    ];
    
    autoTable(doc, {
      startY: yPosition,
      head: [['Kategori', 'Tutar']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [78, 205, 196], fontSize: 10 },
      bodyStyles: { fontSize: 9 },
      margin: { left: 20, right: 20 }
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 20;
    
    // Gelirler Tablosu
    if (incomes.length > 0) {
      doc.setFontSize(14);
      doc.text('GELIRLER', 20, yPosition);
      yPosition += 5;
      
      const incomeData = incomes.map(income => [
        income.title,
        income.amount.toLocaleString() + ' TL',
        income.date,
        income.description || '-'
      ]);
      
      autoTable(doc, {
        startY: yPosition,
        head: [['Baslik', 'Tutar', 'Tarih', 'Aciklama']],
        body: incomeData,
        theme: 'striped',
        headStyles: { fillColor: [76, 175, 80], fontSize: 10 },
        bodyStyles: { fontSize: 9 },
        margin: { left: 20, right: 20 }
      });
      
      yPosition = (doc as any).lastAutoTable.finalY + 15;
    }
    
    // Giderler Tablosu
    if (expenses.length > 0) {
      doc.setFontSize(14);
      doc.text('GIDERLER', 20, yPosition);
      yPosition += 5;
      
      const expenseData = expenses.map(expense => [
        expense.title,
        expense.amount.toLocaleString() + ' TL',
        expense.date,
        expense.category || '-'
      ]);
      
      autoTable(doc, {
        startY: yPosition,
        head: [['Baslik', 'Tutar', 'Tarih', 'Kategori']],
        body: expenseData,
        theme: 'striped',
        headStyles: { fillColor: [244, 67, 54], fontSize: 10 },
        bodyStyles: { fontSize: 9 },
        margin: { left: 20, right: 20 }
      });
      
      yPosition = (doc as any).lastAutoTable.finalY + 15;
    }
    
    // Yeni sayfa gerekirse
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Borçlar Tablosu
    if (debts.length > 0) {
      doc.setFontSize(14);
      doc.text('BORCLAR', 20, yPosition);
      yPosition += 5;
      
      const debtData = debts.map(debt => [
        debt.title,
        debt.amount.toLocaleString() + ' TL',
        (debt.amount - debt.paidAmount).toLocaleString() + ' TL',
        (debt.monthlyPayment?.toLocaleString() || '0') + ' TL',
        debt.remainingMonths + ' ay',
        debt.dueDate
      ]);
      
      autoTable(doc, {
        startY: yPosition,
        head: [['Borc Adi', 'Toplam Tutar', 'Kalan Tutar', 'Aylik Odeme', 'Kalan Vade', 'Vade Tarihi']],
        body: debtData,
        theme: 'striped',
        headStyles: { fillColor: [255, 152, 0], fontSize: 9 },
        bodyStyles: { fontSize: 8 },
        margin: { left: 20, right: 20 }
      });
      
      yPosition = (doc as any).lastAutoTable.finalY + 15;
    }
    
    // Sabit Giderler Tablosu
    if (fixedExpenses.length > 0) {
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.text('SABIT GIDERLER', 20, yPosition);
      yPosition += 5;
      
      const fixedExpenseData = fixedExpenses.map(expense => [
        expense.title,
        expense.amount.toLocaleString() + ' TL',
        expense.category || '-'
      ]);
      
      autoTable(doc, {
        startY: yPosition,
        head: [['Gider Adi', 'Aylik Tutar', 'Kategori']],
        body: fixedExpenseData,
        theme: 'striped',
        headStyles: { fillColor: [156, 39, 176], fontSize: 10 },
        bodyStyles: { fontSize: 9 },
        margin: { left: 20, right: 20 }
      });
    }
    
    // PDF'i indir
    const fileName = `finansal-rapor-${currentDate.replace(/\./g, '-')}.pdf`;
    doc.save(fileName);
  };

  // Calculate totals
  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalRemainingDebts = debts.reduce((sum, item) => sum + (item.amount - item.paidAmount), 0);
  const totalFixedExpenses = fixedExpenses.reduce((sum, item) => sum + item.amount, 0);
  const monthlyDebtPayments = debts.reduce((sum, debt) => sum + (debt.monthlyPayment || 0), 0);
  
  // Calculate recurring income totals
  const totalRecurringIncome = recurringIncomes
    .filter(income => income.isActive)
    .reduce((sum, income) => sum + income.totalReceived, 0);
  
  const monthlyRecurringIncome = recurringIncomes
    .filter(income => income.isActive)
    .reduce((sum, income) => {
      switch (income.frequency) {
        case 'monthly': return sum + income.amount;
        case 'weekly': return sum + (income.amount * 4.33); // Average weeks per month
        case 'biweekly': return sum + (income.amount * 2.17); // Average biweeks per month
        case 'yearly': return sum + (income.amount / 12);
        default: return sum;
      }
    }, 0);
  
  const totalBalance = totalIncome + totalRecurringIncome - totalExpenses - totalFixedExpenses;
  const netWorth = totalIncome + totalRecurringIncome - totalExpenses - totalRemainingDebts;

  // Chart data
  const pieData = [
    { name: 'Tek Seferlik Gelirler', value: totalIncome, color: '#4CAF50' },
    { name: 'Düzenli Gelirler', value: totalRecurringIncome, color: '#8BC34A' },
    { name: 'Giderler', value: totalExpenses, color: '#F44336' },
    { name: 'Sabit Giderler', value: totalFixedExpenses, color: '#FF9800' },
    { name: 'Borç Ödemeleri', value: monthlyDebtPayments, color: '#9C27B0' }
  ];

  const monthlyData = [
    { month: 'Ocak', gelir: 8000, gider: 5000 },
    { month: 'Şubat', gelir: 9000, gider: 4500 },
    { month: 'Mart', gelir: 7500, gider: 5500 },
    { month: 'Nisan', gelir: 8500, gider: 4800 },
    { month: 'Mayıs', gelir: 9500, gider: 5200 },
    { month: 'Haziran', gelir: 10000, gider: 4700 }
  ];

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses - totalFixedExpenses) / totalIncome) * 100 : 0;
  const debtRatio = totalIncome > 0 ? (totalRemainingDebts / totalIncome) * 100 : 0;

  // Quick actions
  const quickAddIncome = () => {
    setOpenSection('income');
    setShowIncomeForm(true);
  };

  const quickAddExpense = () => {
    setOpenSection('expenses');
    setShowExpenseForm(true);
  };

  const quickAddDebt = () => {
    setOpenSection('debts');
    setShowDebtForm(true);
  };

  const quickAddFixed = () => {
    setOpenSection('fixed');
    setShowFixedExpenseForm(true);
  };

  const quickAddRecurring = () => {
    setOpenSection('recurring');
    setShowRecurringIncomeForm(true);
  };

  // Toggle accordion
  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Form handlers
  const handleIncomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newIncome: FinancialItem = {
      id: Date.now().toString(),
      title: incomeForm.title,
      amount: parseFloat(incomeForm.amount),
      date: incomeForm.date,
      description: incomeForm.description
    };
    setIncomes([...incomes, newIncome]);
    setIncomeForm({ title: '', amount: '', date: '', description: '' });
    setShowIncomeForm(false);
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense: FinancialItem = {
      id: Date.now().toString(),
      title: expenseForm.title,
      amount: parseFloat(expenseForm.amount),
      date: expenseForm.date,
      category: expenseForm.category
    };
    setExpenses([...expenses, newExpense]);
    setExpenseForm({ title: '', amount: '', date: '', category: '' });
    setShowExpenseForm(false);
  };

  const handleDebtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDebt: Debt = {
      id: Date.now().toString(),
      title: debtForm.title,
      amount: parseFloat(debtForm.amount),
      date: new Date().toISOString().split('T')[0],
      dueDate: debtForm.dueDate,
      interestRate: debtForm.interestRate ? parseFloat(debtForm.interestRate) : undefined,
      monthlyPayment: parseFloat(debtForm.monthlyPayment || '0'),
      totalMonths: parseInt(debtForm.totalMonths || '0'),
      remainingMonths: parseInt(debtForm.totalMonths || '0'),
      startDate: debtForm.startDate,
      paidAmount: 0
    };
    setDebts([...debts, newDebt]);
    setDebtForm({ title: '', amount: '', dueDate: '', interestRate: '', monthlyPayment: '', totalMonths: '', startDate: '' });
    setShowDebtForm(false);
  };

  const handleFixedExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFixedExpense: FinancialItem = {
      id: Date.now().toString(),
      title: fixedExpenseForm.title,
      amount: parseFloat(fixedExpenseForm.amount),
      date: new Date().toISOString().split('T')[0],
      category: fixedExpenseForm.category
    };
    setFixedExpenses([...fixedExpenses, newFixedExpense]);
    setFixedExpenseForm({ title: '', amount: '', category: '' });
    setShowFixedExpenseForm(false);
  };

  // Helper function to calculate next payment date
  const calculateNextPaymentDate = (startDate: string, frequency: string): string => {
    const start = new Date(startDate);
    const now = new Date();
    
    switch (frequency) {
      case 'weekly':
        start.setDate(start.getDate() + 7);
        while (start < now) {
          start.setDate(start.getDate() + 7);
        }
        break;
      case 'biweekly':
        start.setDate(start.getDate() + 14);
        while (start < now) {
          start.setDate(start.getDate() + 14);
        }
        break;
      case 'monthly':
        start.setMonth(start.getMonth() + 1);
        while (start < now) {
          start.setMonth(start.getMonth() + 1);
        }
        break;
      case 'yearly':
        start.setFullYear(start.getFullYear() + 1);
        while (start < now) {
          start.setFullYear(start.getFullYear() + 1);
        }
        break;
    }
    
    return start.toISOString().split('T')[0];
  };

  const handleRecurringIncomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecurringIncome: RecurringIncome = {
      id: Date.now().toString(),
      title: recurringIncomeForm.title,
      amount: parseFloat(recurringIncomeForm.amount),
      date: recurringIncomeForm.startDate,
      description: recurringIncomeForm.description,
      frequency: recurringIncomeForm.frequency as 'monthly' | 'weekly' | 'biweekly' | 'yearly',
      startDate: recurringIncomeForm.startDate,
      endDate: recurringIncomeForm.endDate || undefined,
      isActive: true,
      nextPaymentDate: calculateNextPaymentDate(recurringIncomeForm.startDate, recurringIncomeForm.frequency),
      totalReceived: 0,
      receivedCount: 0
    };
    setRecurringIncomes([...recurringIncomes, newRecurringIncome]);
    setRecurringIncomeForm({ 
      title: '', 
      amount: '', 
      frequency: 'monthly',
      startDate: '',
      endDate: '',
      description: ''
    });
    setShowRecurringIncomeForm(false);
  };

  // Delete handlers
  const deleteIncome = (id: string) => setIncomes(incomes.filter(item => item.id !== id));
  const deleteExpense = (id: string) => setExpenses(expenses.filter(item => item.id !== id));
  const deleteDebt = (id: string) => setDebts(debts.filter(item => item.id !== id));
  const deleteFixedExpense = (id: string) => setFixedExpenses(fixedExpenses.filter(item => item.id !== id));
  const deleteRecurringIncome = (id: string) => setRecurringIncomes(recurringIncomes.filter(item => item.id !== id));

  // Receive recurring income payment
  const receiveRecurringPayment = (incomeId: string) => {
    setRecurringIncomes(recurringIncomes.map(income => {
      if (income.id === incomeId) {
        const newTotalReceived = income.totalReceived + income.amount;
        const newReceivedCount = income.receivedCount + 1;
        const newNextPaymentDate = calculateNextPaymentDate(income.nextPaymentDate, income.frequency);
        
        return {
          ...income,
          totalReceived: newTotalReceived,
          receivedCount: newReceivedCount,
          nextPaymentDate: newNextPaymentDate
        };
      }
      return income;
    }));
  };

  // Toggle recurring income active status
  const toggleRecurringIncome = (incomeId: string) => {
    setRecurringIncomes(recurringIncomes.map(income => {
      if (income.id === incomeId) {
        return { ...income, isActive: !income.isActive };
      }
      return income;
    }));
  };

  // Make debt payment
  const makeDebtPayment = (debtId: string) => {
    const debt = debts.find(d => d.id === debtId);
    if (debt && debt.monthlyPayment) {
      const updatedDebt = {
        ...debt,
        paidAmount: debt.paidAmount + debt.monthlyPayment,
        remainingMonths: Math.max(0, debt.remainingMonths - 1),
        lastPaymentDate: new Date().toISOString().split('T')[0]
      };
      setDebts(debts.map(d => d.id === debtId ? updatedDebt : d));
    }
  };

  return (
    <DashboardContainer $isDarkMode={isDarkMode}>
      <Header $isDarkMode={isDarkMode}>
        <Title $isDarkMode={isDarkMode}>💰 Cüzdan Takip</Title>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <ThemeButton
            $isDarkMode={isDarkMode}
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </ThemeButton>
          <PDFButton
            onClick={generatePDF}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📄 PDF İndir
          </PDFButton>
          <LogoutButton
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Çıkış
          </LogoutButton>
        </div>
      </Header>

      {/* Quick Actions */}
      {/* Dashboard Widgets - Üst Bölüm */}
      <DashboardWidgetGrid>
        {/* Toplam Bakiye Widget */}
        <DashboardWidget 
          $isDarkMode={isDarkMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <WidgetTitle $isDarkMode={isDarkMode}>💰 Toplam Bakiye</WidgetTitle>
          <WidgetValue $isDarkMode={isDarkMode} $color="#4ECDC4">
            ₺{totalBalance.toLocaleString()}
          </WidgetValue>
          <WidgetSubtext $isDarkMode={isDarkMode}>
            Net Değer: ₺{netWorth.toLocaleString()}
          </WidgetSubtext>
        </DashboardWidget>

        {/* Aylık Trend Widget */}
        <DashboardWidget 
          $isDarkMode={isDarkMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <WidgetTitle $isDarkMode={isDarkMode}>📈 Aylık Trend</WidgetTitle>
          <div style={{ height: '120px', marginTop: '10px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { name: 'Oca', gelir: 8000, gider: 3500 },
                { name: 'Şub', gelir: 7500, gider: 4200 },
                { name: 'Mar', gelir: 9200, gider: 3800 },
                { name: 'Nis', gelir: 8800, gider: 4100 },
                { name: 'May', gelir: 9500, gider: 3900 },
                { name: 'Haz', gelir: totalIncome, gider: totalExpenses },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#333' : '#e0e0e0'} />
                <XAxis dataKey="name" stroke={isDarkMode ? '#fff' : '#333'} fontSize={10} />
                <YAxis stroke={isDarkMode ? '#fff' : '#333'} fontSize={10} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1a1a2e' : '#fff',
                    border: `1px solid ${isDarkMode ? '#4ECDC4' : '#3b82f6'}`,
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="gelir" 
                  stroke="#4CAF50" 
                  strokeWidth={2}
                  dot={{ fill: '#4CAF50', strokeWidth: 1, r: 2 }}
                  name="Gelir"
                />
                <Line 
                  type="monotone" 
                  dataKey="gider" 
                  stroke="#F44336" 
                  strokeWidth={2}
                  dot={{ fill: '#F44336', strokeWidth: 1, r: 2 }}
                  name="Gider"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DashboardWidget>

        {/* Bütçe Dağılımı Widget */}
        <DashboardWidget 
          $isDarkMode={isDarkMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <WidgetTitle $isDarkMode={isDarkMode}>💰 Bütçe Dağılımı</WidgetTitle>
          <div style={{ height: '120px', marginTop: '10px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Gelir', value: totalIncome, fill: '#4CAF50' },
                    { name: 'Gider', value: totalExpenses, fill: '#F44336' },
                    { name: 'Borç', value: totalRemainingDebts, fill: '#FF9800' },
                    { name: 'Tasarruf', value: Math.max(0, totalIncome - totalExpenses), fill: '#00BCD4' }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={50}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {[
                    { name: 'Gelir', value: totalIncome, fill: '#4CAF50' },
                    { name: 'Gider', value: totalExpenses, fill: '#F44336' },
                    { name: 'Borç', value: totalRemainingDebts, fill: '#FF9800' },
                    { name: 'Tasarruf', value: Math.max(0, totalIncome - totalExpenses), fill: '#00BCD4' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1a1a2e' : '#fff',
                    border: `1px solid ${isDarkMode ? '#4ECDC4' : '#3b82f6'}`,
                    borderRadius: '8px'
                  }}
                  formatter={(value: any) => [`₺${value.toLocaleString()}`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </DashboardWidget>

        {/* Tasarruf Oranı Widget */}
        <DashboardWidget 
          $isDarkMode={isDarkMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <WidgetTitle $isDarkMode={isDarkMode}>📈 Tasarruf Oranı</WidgetTitle>
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <div style={{ width: '80px', height: '80px', margin: '0 auto' }}>
              <CircularProgressbar
                value={totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0}
                text={`${totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1) : '0.0'}%`}
                styles={buildStyles({
                  textColor: '#4ECDC4',
                  pathColor: '#4CAF50',
                  trailColor: isDarkMode ? '#333' : '#e0e0e0',
                  textSize: '12px'
                })}
              />
            </div>
            <WidgetSubtext $isDarkMode={isDarkMode} style={{ marginTop: '8px' }}>
              Aylık: ₺{Math.max(0, totalIncome - totalExpenses).toLocaleString()}
            </WidgetSubtext>
          </div>
        </DashboardWidget>
      </DashboardWidgetGrid>

      {/* Hızlı İşlem Butonları */}
      <QuickActionsContainer style={{ marginBottom: '30px' }}>
        <QuickActionButton
          $isDarkMode={isDarkMode}
          $type="income"
          onClick={quickAddIncome}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="icon">💰</span>
          <span>Gelir Ekle</span>
        </QuickActionButton>

        <QuickActionButton
          $isDarkMode={isDarkMode}
          $type="expense"
          onClick={quickAddExpense}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="icon">💸</span>
          <span>Gider Ekle</span>
        </QuickActionButton>

        <QuickActionButton
          $isDarkMode={isDarkMode}
          $type="debt"
          onClick={quickAddDebt}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="icon">🏦</span>
          <span>Borç Ekle</span>
        </QuickActionButton>

        <QuickActionButton
          $isDarkMode={isDarkMode}
          $type="fixed"
          onClick={quickAddFixed}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="icon">📅</span>
          <span>Sabit Gider</span>
        </QuickActionButton>

        <QuickActionButton
          $isDarkMode={isDarkMode}
          $type="income"
          onClick={quickAddRecurring}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="icon">🔄</span>
          <span>Düzenli Gelir</span>
        </QuickActionButton>
      </QuickActionsContainer>

      {/* Veri Giriş Kartları - Alt Bölüm */}
      <TileGridContainer>

        {/* Gelirler */}
        <DataCard 
          $isDarkMode={isDarkMode} 
          $type="income"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DataCardHeader $isDarkMode={isDarkMode} $type="income">
            <DataCardTitle $isDarkMode={isDarkMode}>💰 Gelirler</DataCardTitle>
            <DataCardValue $type="income">₺{totalIncome.toLocaleString()}</DataCardValue>
          </DataCardHeader>
          
          <DataCardContent>
            <ActionButtons>
              <ActionButton
                $variant="primary"
                $isDarkMode={isDarkMode}
                onClick={() => setShowIncomeForm(!showIncomeForm)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {showIncomeForm ? 'İptal' : '+ Gelir Ekle'}
              </ActionButton>
              <ActionButton
                $variant="secondary"
                $isDarkMode={isDarkMode}
                onClick={() => setOpenSection(openSection === 'income' ? '' : 'income')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {openSection === 'income' ? 'Gizle' : 'Listele'}
              </ActionButton>
            </ActionButtons>

            <AnimatePresence>
              {showIncomeForm && (
                <QuickForm
                  $isDarkMode={isDarkMode}
                  initial={{ opacity: 0, maxHeight: 0, overflow: "hidden" }}
                  animate={{ opacity: 1, maxHeight: "500px", overflow: "visible" }}
                  exit={{ opacity: 0, maxHeight: 0, overflow: "hidden" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <form onSubmit={handleIncomeSubmit}>
                    <FormGrid>
                      <ModernInput
                        $isDarkMode={isDarkMode}
                        type="text"
                        placeholder="Başlık (Maaş, Bonus, vb.)"
                        value={incomeForm.title}
                        onChange={(e) => setIncomeForm({...incomeForm, title: e.target.value})}
                        required
                      />
                      <ModernInput
                        $isDarkMode={isDarkMode}
                        type="number"
                        placeholder="Tutar (₺)"
                        value={incomeForm.amount}
                        onChange={(e) => setIncomeForm({...incomeForm, amount: e.target.value})}
                        required
                      />
                      <ModernInput
                        $isDarkMode={isDarkMode}
                        type="date"
                        value={incomeForm.date}
                        onChange={(e) => setIncomeForm({...incomeForm, date: e.target.value})}
                        required
                      />
                      <ModernInput
                        $isDarkMode={isDarkMode}
                        type="text"
                        placeholder="Açıklama (Opsiyonel)"
                        value={incomeForm.description}
                        onChange={(e) => setIncomeForm({...incomeForm, description: e.target.value})}
                        style={{ gridColumn: '1 / -1' }}
                      />
                    </FormGrid>
                    <ActionButton
                      $variant="primary"
                      $isDarkMode={isDarkMode}
                      type="submit"
                      style={{ marginTop: '15px' }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Gelir Ekle
                    </ActionButton>
                  </form>
                </QuickForm>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {openSection === 'income' && (
                <motion.div
                  initial={{ opacity: 0, maxHeight: 0, overflow: "hidden" }}
                  animate={{ opacity: 1, maxHeight: "1000px", overflow: "visible" }}
                  exit={{ opacity: 0, maxHeight: 0, overflow: "hidden" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ItemGrid>
                    {incomes.map((item, index) => (
                      <DataItem 
                        key={item.id} 
                        $isDarkMode={isDarkMode} 
                        $type="income"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <ItemInfo>
                          <ItemName $isDarkMode={isDarkMode}>{item.title}</ItemName>
                          <ItemMeta $isDarkMode={isDarkMode}>{item.date} • {item.description}</ItemMeta>
                        </ItemInfo>
                        <ItemActions>
                          <ModernItemAmount $type="income">₺{item.amount.toLocaleString()}</ModernItemAmount>
                          <DeleteBtn 
                            $isDarkMode={isDarkMode}
                            onClick={() => deleteIncome(item.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Sil
                          </DeleteBtn>
                        </ItemActions>
                      </DataItem>
                    ))}
                  </ItemGrid>
                </motion.div>
              )}
            </AnimatePresence>
          </DataCardContent>
        </DataCard>

        {/* Giderler */}
        <DataCard 
          $isDarkMode={isDarkMode} 
          $type="expense"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <DataCardHeader $isDarkMode={isDarkMode} $type="expense">
            <DataCardTitle $isDarkMode={isDarkMode}>💸 Giderler</DataCardTitle>
            <DataCardValue $type="expense">₺{totalExpenses.toLocaleString()}</DataCardValue>
          </DataCardHeader>
          
          <DataCardContent>
            <ActionButtons>
              <ActionButton
                $variant="primary"
                $isDarkMode={isDarkMode}
                onClick={() => setShowExpenseForm(!showExpenseForm)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {showExpenseForm ? 'İptal' : '+ Gider Ekle'}
              </ActionButton>
              <ActionButton
                $variant="secondary"
                $isDarkMode={isDarkMode}
                onClick={() => setOpenSection(openSection === 'expenses' ? '' : 'expenses')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {openSection === 'expenses' ? 'Gizle' : 'Listele'}
              </ActionButton>
            </ActionButtons>

            <AnimatePresence>
              {showExpenseForm && (
                <QuickForm
                  $isDarkMode={isDarkMode}
                  initial={{ opacity: 0, maxHeight: 0, overflow: "hidden" }}
                  animate={{ opacity: 1, maxHeight: "500px", overflow: "visible" }}
                  exit={{ opacity: 0, maxHeight: 0, overflow: "hidden" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <form onSubmit={handleExpenseSubmit}>
                    <FormGrid>
                      <ModernInput
                        $isDarkMode={isDarkMode}
                        type="text"
                        placeholder="Başlık (Market, Benzin, vb.)"
                        value={expenseForm.title}
                        onChange={(e) => setExpenseForm({...expenseForm, title: e.target.value})}
                        required
                      />
                      <ModernInput
                        $isDarkMode={isDarkMode}
                        type="number"
                        placeholder="Tutar (₺)"
                        value={expenseForm.amount}
                        onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                        required
                      />
                      <ModernSelect
                        $isDarkMode={isDarkMode}
                        value={expenseForm.category}
                        onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})}
                        required
                      >
                        <option value="">Kategori Seçin</option>
                        <option value="market">Market</option>
                        <option value="benzin">Benzin</option>
                        <option value="fatura">Fatura</option>
                        <option value="eglence">Eğlence</option>
                        <option value="saglik">Sağlık</option>
                        <option value="diger">Diğer</option>
                      </ModernSelect>
                      <ModernInput
                        $isDarkMode={isDarkMode}
                        type="date"
                        value={expenseForm.date}
                        onChange={(e) => setExpenseForm({...expenseForm, date: e.target.value})}
                        required
                      />
                    </FormGrid>
                    <ActionButton
                      $variant="primary"
                      $isDarkMode={isDarkMode}
                      type="submit"
                      style={{ marginTop: '15px' }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Gider Ekle
                    </ActionButton>
                  </form>
                </QuickForm>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {openSection === 'expenses' && (
                <motion.div
                  initial={{ opacity: 0, maxHeight: 0, overflow: "hidden" }}
                  animate={{ opacity: 1, maxHeight: "1000px", overflow: "visible" }}
                  exit={{ opacity: 0, maxHeight: 0, overflow: "hidden" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ItemGrid>
                    {expenses.map((item, index) => (
                      <DataItem 
                        key={item.id} 
                        $isDarkMode={isDarkMode} 
                        $type="expense"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <ItemInfo>
                          <ItemName $isDarkMode={isDarkMode}>{item.title}</ItemName>
                          <ItemMeta $isDarkMode={isDarkMode}>{item.date} • {item.category}</ItemMeta>
                        </ItemInfo>
                        <ItemActions>
                          <ModernItemAmount $type="expense">₺{item.amount.toLocaleString()}</ModernItemAmount>
                          <DeleteBtn 
                            $isDarkMode={isDarkMode}
                            onClick={() => deleteExpense(item.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Sil
                          </DeleteBtn>
                        </ItemActions>
                      </DataItem>
                    ))}
                  </ItemGrid>
                </motion.div>
              )}
            </AnimatePresence>
          </DataCardContent>
        </DataCard>

        {/* Borçlar */}
        <DataCard 
          $isDarkMode={isDarkMode} 
          $type="debt"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DataCardHeader $isDarkMode={isDarkMode} $type="debt">
            <DataCardTitle $isDarkMode={isDarkMode}>🏦 Borçlar</DataCardTitle>
            <DataCardValue $type="debt">₺{totalRemainingDebts.toLocaleString()}</DataCardValue>
          </DataCardHeader>
          
          <DataCardContent>
            <ActionButtons>
              <ActionButton
                $variant="primary"
                $isDarkMode={isDarkMode}
                onClick={() => setShowDebtForm(!showDebtForm)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {showDebtForm ? 'İptal' : '+ Borç Ekle'}
              </ActionButton>
              <ActionButton
                $variant="secondary"
                $isDarkMode={isDarkMode}
                onClick={() => setOpenSection(openSection === 'debts' ? '' : 'debts')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {openSection === 'debts' ? 'Gizle' : 'Listele'}
              </ActionButton>
            </ActionButtons>

            <AnimatePresence>
              {showDebtForm && (
                <QuickForm
                  $isDarkMode={isDarkMode}
                  initial={{ opacity: 0, maxHeight: 0, overflow: "hidden" }}
                  animate={{ opacity: 1, maxHeight: "600px", overflow: "visible" }}
                  exit={{ opacity: 0, maxHeight: 0, overflow: "hidden" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <form onSubmit={handleDebtSubmit}>
                    <FormGrid>
                      <ModernInput
                        $isDarkMode={isDarkMode}
                        type="text"
                        placeholder="Borç Adı (Kredi, Kredi Kartı)"
                        value={debtForm.title}
                        onChange={(e) => setDebtForm({...debtForm, title: e.target.value})}
                        required
                      />
                      <ModernInput
                        $isDarkMode={isDarkMode}
                        type="number"
                        placeholder="Toplam Borç (₺)"
                        value={debtForm.amount}
                        onChange={(e) => setDebtForm({...debtForm, amount: e.target.value})}
                        required
                      />
                      <ModernInput
                        $isDarkMode={isDarkMode}
                        type="number"
                        placeholder="Aylık Ödeme (₺)"
                        value={debtForm.monthlyPayment}
                        onChange={(e) => setDebtForm({...debtForm, monthlyPayment: e.target.value})}
                        required
                      />
                      <ModernInput
                        $isDarkMode={isDarkMode}
                        type="number"
                        placeholder="Vade (Ay)"
                        value={debtForm.totalMonths}
                        onChange={(e) => setDebtForm({...debtForm, totalMonths: e.target.value})}
                        required
                      />
                      <ModernInput
                        $isDarkMode={isDarkMode}
                        type="date"
                        placeholder="Başlangıç Tarihi"
                        value={debtForm.startDate}
                        onChange={(e) => setDebtForm({...debtForm, startDate: e.target.value})}
                        required
                      />
                      <ModernInput
                        $isDarkMode={isDarkMode}
                        type="date"
                        placeholder="Vade Tarihi"
                        value={debtForm.dueDate}
                        onChange={(e) => setDebtForm({...debtForm, dueDate: e.target.value})}
                        required
                      />
                      <ModernInput
                        $isDarkMode={isDarkMode}
                        type="number"
                        placeholder="Faiz Oranı (%)"
                        value={debtForm.interestRate}
                        onChange={(e) => setDebtForm({...debtForm, interestRate: e.target.value})}
                        style={{ gridColumn: '1 / -1' }}
                      />
                    </FormGrid>
                    <ActionButton
                      $variant="primary"
                      $isDarkMode={isDarkMode}
                      type="submit"
                      style={{ marginTop: '15px' }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Borç Ekle
                    </ActionButton>
                  </form>
                </QuickForm>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {openSection === 'debts' && (
                <motion.div
                  initial={{ opacity: 0, maxHeight: 0, overflow: "hidden" }}
                  animate={{ opacity: 1, maxHeight: "1000px", overflow: "visible" }}
                  exit={{ opacity: 0, maxHeight: 0, overflow: "hidden" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ItemGrid>
                    {debts.map((item, index) => (
                      <DataItem 
                        key={item.id} 
                        $isDarkMode={isDarkMode} 
                        $type="debt"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <ItemInfo>
                          <ItemName $isDarkMode={isDarkMode}>{item.title}</ItemName>
                          <ItemMeta $isDarkMode={isDarkMode}>
                            Kalan: {item.remainingMonths} ay • Vade: {item.dueDate}
                          </ItemMeta>
                        </ItemInfo>
                        <ItemActions>
                          <ModernItemAmount $type="debt">₺{(item.amount - item.paidAmount).toLocaleString()}</ModernItemAmount>
                          {item.remainingMonths > 0 && item.monthlyPayment && (
                            <ActionButton
                              $variant="primary"
                              $isDarkMode={isDarkMode}
                              onClick={() => makeDebtPayment(item.id)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              style={{ fontSize: '0.75rem', padding: '6px 10px' }}
                            >
                              Öde ₺{item.monthlyPayment.toLocaleString()}
                            </ActionButton>
                          )}
                          <DeleteBtn 
                            $isDarkMode={isDarkMode}
                            onClick={() => deleteDebt(item.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Sil
                          </DeleteBtn>
                        </ItemActions>
                      </DataItem>
                    ))}
                  </ItemGrid>
                </motion.div>
              )}
            </AnimatePresence>
          </DataCardContent>
        </DataCard>

        {/* Sabit Giderler */}
        <DataCard 
          $isDarkMode={isDarkMode} 
          $type="expense"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <DataCardHeader $isDarkMode={isDarkMode} $type="expense">
            <DataCardTitle $isDarkMode={isDarkMode}>📅 Sabit Giderler</DataCardTitle>
            <DataCardValue $type="expense">₺{totalFixedExpenses.toLocaleString()}</DataCardValue>
          </DataCardHeader>
          
          <DataCardContent>
            <ActionButtons>
              <ActionButton
                $variant="primary"
                $isDarkMode={isDarkMode}
                onClick={() => setShowFixedExpenseForm(!showFixedExpenseForm)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {showFixedExpenseForm ? 'İptal' : '+ Sabit Gider Ekle'}
              </ActionButton>
              <ActionButton
                $variant="secondary"
                $isDarkMode={isDarkMode}
                onClick={() => setOpenSection(openSection === 'fixed' ? '' : 'fixed')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {openSection === 'fixed' ? 'Gizle' : 'Listele'}
              </ActionButton>
            </ActionButtons>

            <AnimatePresence>
              {showFixedExpenseForm && (
                <QuickForm
                  $isDarkMode={isDarkMode}
                  initial={{ opacity: 0, maxHeight: 0, overflow: "hidden" }}
                  animate={{ opacity: 1, maxHeight: "500px", overflow: "visible" }}
                  exit={{ opacity: 0, maxHeight: 0, overflow: "hidden" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <form onSubmit={handleFixedExpenseSubmit}>
                    <FormGrid>
                      <ModernInput
                        $isDarkMode={isDarkMode}
                        type="text"
                        placeholder="Gider Adı (Kira, Elektrik)"
                        value={fixedExpenseForm.title}
                        onChange={(e) => setFixedExpenseForm({...fixedExpenseForm, title: e.target.value})}
                        required
                      />
                      <ModernInput
                        $isDarkMode={isDarkMode}
                        type="number"
                        placeholder="Aylık Tutar (₺)"
                        value={fixedExpenseForm.amount}
                        onChange={(e) => setFixedExpenseForm({...fixedExpenseForm, amount: e.target.value})}
                        required
                      />
                      <ModernSelect
                        $isDarkMode={isDarkMode}
                        value={fixedExpenseForm.category}
                        onChange={(e) => setFixedExpenseForm({...fixedExpenseForm, category: e.target.value})}
                        required
                      >
                        <option value="">Kategori Seçin</option>
                        <option value="kira">Kira</option>
                        <option value="elektrik">Elektrik</option>
                        <option value="su">Su</option>
                        <option value="internet">İnternet</option>
                        <option value="telefon">Telefon</option>
                        <option value="sigorta">Sigorta</option>
                        <option value="diger">Diğer</option>
                      </ModernSelect>
                    </FormGrid>
                    <ActionButton
                      $variant="primary"
                      $isDarkMode={isDarkMode}
                      type="submit"
                      style={{ marginTop: '15px' }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Sabit Gider Ekle
                    </ActionButton>
                  </form>
                </QuickForm>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {openSection === 'fixed' && (
                <motion.div
                  initial={{ opacity: 0, maxHeight: 0, overflow: "hidden" }}
                  animate={{ opacity: 1, maxHeight: "1000px", overflow: "visible" }}
                  exit={{ opacity: 0, maxHeight: 0, overflow: "hidden" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ItemGrid>
                    {fixedExpenses.map((item, index) => (
                      <DataItem 
                        key={item.id} 
                        $isDarkMode={isDarkMode} 
                        $type="expense"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <ItemInfo>
                          <ItemName $isDarkMode={isDarkMode}>{item.title}</ItemName>
                          <ItemMeta $isDarkMode={isDarkMode}>Aylık • {item.category}</ItemMeta>
                        </ItemInfo>
                        <ItemActions>
                          <ModernItemAmount $type="expense">₺{item.amount.toLocaleString()}</ModernItemAmount>
                          <DeleteBtn 
                            $isDarkMode={isDarkMode}
                            onClick={() => deleteFixedExpense(item.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Sil
                          </DeleteBtn>
                        </ItemActions>
                      </DataItem>
                    ))}
                  </ItemGrid>
                </motion.div>
              )}
            </AnimatePresence>
          </DataCardContent>
        </DataCard>

        {/* Düzenli Gelirler */}
        <DataCard 
          $isDarkMode={isDarkMode} 
          $type="income"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <DataCardHeader $isDarkMode={isDarkMode} $type="income">
            <DataCardTitle $isDarkMode={isDarkMode}>🔄 Düzenli Gelirler</DataCardTitle>
            <DataCardValue $type="income">₺{monthlyRecurringIncome.toLocaleString()}/ay</DataCardValue>
          </DataCardHeader>
          
          <DataCardContent>
            <ActionButtons>
              <ActionButton
                $variant="primary"
                $isDarkMode={isDarkMode}
                onClick={() => setShowRecurringIncomeForm(!showRecurringIncomeForm)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {showRecurringIncomeForm ? 'İptal' : '+ Düzenli Gelir Ekle'}
              </ActionButton>
              <ActionButton
                $variant="secondary"
                $isDarkMode={isDarkMode}
                onClick={() => setOpenSection(openSection === 'recurring' ? '' : 'recurring')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {openSection === 'recurring' ? 'Gizle' : 'Listele'}
              </ActionButton>
            </ActionButtons>

            <AnimatePresence>
              {showRecurringIncomeForm && (
                <QuickForm
                  $isDarkMode={isDarkMode}
                  initial={{ opacity: 0, maxHeight: 0, overflow: "hidden" }}
                  animate={{ opacity: 1, maxHeight: "600px", overflow: "visible" }}
                  exit={{ opacity: 0, maxHeight: 0, overflow: "hidden" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <form onSubmit={handleRecurringIncomeSubmit}>
                    <FormGrid>
                      <ModernInput
                        $isDarkMode={isDarkMode}
                        type="text"
                        placeholder="Gelir Adı (Maaş, Kira Geliri, vb.)"
                        value={recurringIncomeForm.title}
                        onChange={(e) => setRecurringIncomeForm({...recurringIncomeForm, title: e.target.value})}
                        required
                      />
                      <ModernInput
                        $isDarkMode={isDarkMode}
                        type="number"
                        placeholder="Tutar (₺)"
                        value={recurringIncomeForm.amount}
                        onChange={(e) => setRecurringIncomeForm({...recurringIncomeForm, amount: e.target.value})}
                        required
                      />
                      <ModernSelect
                        $isDarkMode={isDarkMode}
                        value={recurringIncomeForm.frequency}
                        onChange={(e) => setRecurringIncomeForm({...recurringIncomeForm, frequency: e.target.value})}
                        required
                      >
                        <option value="monthly">Aylık</option>
                        <option value="weekly">Haftalık</option>
                        <option value="biweekly">İki Haftada Bir</option>
                        <option value="yearly">Yıllık</option>
                      </ModernSelect>
                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ 
                          display: 'block', 
                          color: isDarkMode ? '#4CAF50' : '#2E7D32', 
                          fontSize: '0.9rem', 
                          marginBottom: '5px',
                          fontWeight: '500'
                        }}>
                          🚀 Başlangıç Tarihi (İlk ödeme tarihi)
                        </label>
                        <ModernInput
                          $isDarkMode={isDarkMode}
                          type="date"
                          value={recurringIncomeForm.startDate}
                          onChange={(e) => setRecurringIncomeForm({...recurringIncomeForm, startDate: e.target.value})}
                          required
                        />
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ 
                          display: 'block', 
                          color: isDarkMode ? '#FF5722' : '#D32F2F', 
                          fontSize: '0.9rem', 
                          marginBottom: '5px',
                          fontWeight: '500'
                        }}>
                          🏁 Bitiş Tarihi (Opsiyonel - boş bırakırsan süresiz)
                        </label>
                        <ModernInput
                          $isDarkMode={isDarkMode}
                          type="date"
                          value={recurringIncomeForm.endDate}
                          onChange={(e) => setRecurringIncomeForm({...recurringIncomeForm, endDate: e.target.value})}
                        />
                      </div>
                      <ModernInput
                        $isDarkMode={isDarkMode}
                        type="text"
                        placeholder="Açıklama (Opsiyonel)"
                        value={recurringIncomeForm.description}
                        onChange={(e) => setRecurringIncomeForm({...recurringIncomeForm, description: e.target.value})}
                        style={{ gridColumn: 'span 2' }}
                      />
                    </FormGrid>
                    <ActionButton
                      $variant="primary"
                      $isDarkMode={isDarkMode}
                      type="submit"
                      style={{ marginTop: '15px' }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Düzenli Gelir Ekle
                    </ActionButton>
                  </form>
                </QuickForm>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {openSection === 'recurring' && (
                <motion.div
                  initial={{ opacity: 0, maxHeight: 0, overflow: "hidden" }}
                  animate={{ opacity: 1, maxHeight: "1000px", overflow: "visible" }}
                  exit={{ opacity: 0, maxHeight: 0, overflow: "hidden" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ItemGrid>
                    {recurringIncomes.map((item, index) => (
                      <DataItem 
                        key={item.id} 
                        $isDarkMode={isDarkMode} 
                        $type="income"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <ItemInfo>
                          <ItemName $isDarkMode={isDarkMode}>
                            {item.title} 
                            <span style={{ 
                              fontSize: '0.75rem', 
                              marginLeft: '8px',
                              color: item.isActive ? '#4CAF50' : '#F44336',
                              fontWeight: 'normal'
                            }}>
                              {item.isActive ? '● Aktif' : '● Pasif'}
                            </span>
                          </ItemName>
                          <ItemMeta $isDarkMode={isDarkMode}>
                            {item.frequency === 'monthly' && 'Aylık'} 
                            {item.frequency === 'weekly' && 'Haftalık'} 
                            {item.frequency === 'biweekly' && 'İki Haftada Bir'} 
                            {item.frequency === 'yearly' && 'Yıllık'} 
                            • Sonraki: {item.nextPaymentDate}
                          </ItemMeta>
                          <ItemMeta $isDarkMode={isDarkMode} style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                            Toplam alınan: ₺{item.totalReceived.toLocaleString()} • {item.receivedCount} ödeme
                          </ItemMeta>
                        </ItemInfo>
                        <ItemActions style={{ flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                          <ModernItemAmount $type="income">
                            ₺{item.amount.toLocaleString()} / {
                              item.frequency === 'monthly' ? 'ay' :
                              item.frequency === 'weekly' ? 'hafta' :
                              item.frequency === 'biweekly' ? '2 hafta' : 'yıl'
                            }
                          </ModernItemAmount>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <ActionButton
                              $variant={item.isActive ? "secondary" : "primary"}
                              $isDarkMode={isDarkMode}
                              onClick={() => toggleRecurringIncome(item.id)}
                              style={{
                                fontSize: '0.75rem',
                                padding: '6px 10px',
                                minWidth: '60px',
                                height: '28px'
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {item.isActive ? 'Durdur' : 'Başlat'}
                            </ActionButton>
                            {item.isActive && (
                              <ActionButton
                                $variant="primary"
                                $isDarkMode={isDarkMode}
                                onClick={() => receiveRecurringPayment(item.id)}
                                style={{
                                  fontSize: '0.75rem',
                                  padding: '6px 10px',
                                  minWidth: '70px',
                                  height: '28px'
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Al ₺{item.amount.toLocaleString()}
                              </ActionButton>
                            )}
                            <DeleteBtn 
                              $isDarkMode={isDarkMode}
                              onClick={() => deleteRecurringIncome(item.id)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Sil
                            </DeleteBtn>
                          </div>
                        </ItemActions>
                      </DataItem>
                    ))}
                  </ItemGrid>
                </motion.div>
              )}
            </AnimatePresence>
          </DataCardContent>
        </DataCard>
      </TileGridContainer>
    </DashboardContainer>
  );
};

export default SecretDashboard; 