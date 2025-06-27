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
    ? 'linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #16213e 100%)'
    : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)'
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
      ? `radial-gradient(circle at 20% 80%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
         radial-gradient(circle at 80% 20%, rgba(78, 205, 196, 0.1) 0%, transparent 50%)`
      : `radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
         radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`
    };
    pointer-events: none;
  }
`;

const Header = styled.div<{ $isDarkMode: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
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
  box-shadow: ${props => props.$isDarkMode 
    ? '0 0 30px rgba(78, 205, 196, 0.2)' 
    : '0 0 30px rgba(59, 130, 246, 0.2)'
  };
  transition: all 0.3s ease;

  @media (min-width: 768px) {
    margin-bottom: 30px;
    padding: 20px;
  }
`;

const Title = styled.h1`
  color: #4ECDC4;
  font-size: 1.5rem;
  font-weight: 700;
  text-shadow: 0 0 20px rgba(78, 205, 196, 0.5);
  margin: 0;

  @media (min-width: 768px) {
    font-size: 2.5rem;
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

const AccordionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
`;

const AccordionCard = styled(motion.div)`
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(78, 205, 196, 0.3);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(78, 205, 196, 0.2);
  transform: translateZ(0);
  backface-visibility: hidden;
`;

const AccordionHeader = styled.div<{ $isOpen: boolean }>`
  padding: 20px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${props => props.$isOpen ? 'rgba(78, 205, 196, 0.1)' : 'transparent'};
  border-bottom: ${props => props.$isOpen ? '1px solid rgba(78, 205, 196, 0.3)' : 'none'};
  transition: background-color 0.2s ease-out, border-bottom 0.2s ease-out;

  &:hover {
    background: rgba(78, 205, 196, 0.05);
  }
`;

const AccordionTitle = styled.h2`
  color: #4ECDC4;
  font-size: 1.2rem;
  margin: 0;
  font-weight: 600;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
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

const AccordionIcon = styled.div<{ $isOpen: boolean }>`
  color: #4ECDC4;
  font-size: 1.5rem;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  transition: transform 0.2s ease-out;
`;

const AccordionContent = styled(motion.div)`
  padding: 0 20px 20px 20px;
  overflow: hidden;
  will-change: transform, opacity;
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
      income: 'linear-gradient(45deg, #4CAF50, #45a049)',
      expense: 'linear-gradient(45deg, #F44336, #d32f2f)',
      debt: 'linear-gradient(45deg, #9C27B0, #7b1fa2)',
      fixed: 'linear-gradient(45deg, #FF9800, #f57c00)'
    };
    return colors[props.$type];
  }};
  border: none;
  padding: 15px;
  border-radius: 15px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  }

  .icon {
    font-size: 1.5rem;
  }
`;

const StatCard = styled.div<{ $type: 'income' | 'expense' | 'debt' | 'balance' }>`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid ${props => {
    switch (props.$type) {
      case 'income': return 'rgba(76, 175, 80, 0.3)';
      case 'expense': return 'rgba(244, 67, 54, 0.3)';
      case 'debt': return 'rgba(255, 152, 0, 0.3)';
      case 'balance': return 'rgba(78, 205, 196, 0.3)';
      default: return 'rgba(78, 205, 196, 0.3)';
    }
  }};
  border-radius: 10px;
  padding: 15px;
  text-align: center;
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
        <Title>💰 Cüzdan Takip</Title>
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

      {/* Charts Section */}
      <ChartsContainer>
        <ChartCard $isDarkMode={isDarkMode}>
          <ChartTitle $isDarkMode={isDarkMode}>📊 Aylık Gelir/Gider Trend</ChartTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#333" : "#ccc"} />
              <XAxis dataKey="month" stroke={isDarkMode ? "#fff" : "#000"} />
              <YAxis stroke={isDarkMode ? "#fff" : "#000"} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDarkMode ? "#1a1a2e" : "#fff",
                  border: `1px solid ${isDarkMode ? "#4ECDC4" : "#3b82f6"}`,
                  borderRadius: "10px"
                }}
              />
              <Bar dataKey="gelir" fill="#4CAF50" />
              <Bar dataKey="gider" fill="#F44336" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard $isDarkMode={isDarkMode}>
          <ChartTitle $isDarkMode={isDarkMode}>💰 Bütçe Dağılımı</ChartTitle>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value.toLocaleString('tr-TR')} ₺`, '']}
                contentStyle={{
                  backgroundColor: isDarkMode ? "#1a1a2e" : "#fff",
                  border: `1px solid ${isDarkMode ? "#4ECDC4" : "#3b82f6"}`,
                  borderRadius: "10px"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard $isDarkMode={isDarkMode}>
          <ChartTitle $isDarkMode={isDarkMode}>📈 Tasarruf Oranı</ChartTitle>
          <ProgressContainer>
            <CircularProgressbar
              value={Math.max(0, Math.min(100, savingsRate))}
              text={`${savingsRate.toFixed(1)}%`}
              styles={buildStyles({
                textColor: isDarkMode ? '#4ECDC4' : '#3b82f6',
                pathColor: savingsRate > 20 ? '#4CAF50' : savingsRate > 10 ? '#FF9800' : '#F44336',
                trailColor: isDarkMode ? '#333' : '#f3f4f6'
              })}
            />
          </ProgressContainer>
          <div style={{ textAlign: 'center', marginTop: '10px', color: isDarkMode ? '#fff' : '#000' }}>
            <small>Hedef: %20+</small>
          </div>
        </ChartCard>
      </ChartsContainer>

      {/* Quick Actions */}
      <QuickActionsContainer>
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

      <AccordionContainer>
        {/* Genel Bakış */}
        <AccordionCard>
          <AccordionHeader 
            $isOpen={openSection === 'overview'} 
            onClick={() => toggleSection('overview')}
          >
            <div>
              <AccordionTitle>📊 Genel Bakış</AccordionTitle>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <AccordionValue $type="balance">₺{totalBalance.toLocaleString()}</AccordionValue>
              <AccordionIcon $isOpen={openSection === 'overview'}>▼</AccordionIcon>
            </div>
          </AccordionHeader>
          <AnimatePresence>
            {openSection === 'overview' && (
              <AccordionContent
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                exit={{ scaleY: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{ transformOrigin: "top" }}
              >
                <StatsGrid>
                  <StatCard $type="income">
                    <AnimatedCounter value={totalIncome} $type="income" />
                    <StatLabel>Toplam Gelir</StatLabel>
                  </StatCard>
                  <StatCard $type="expense">
                    <AnimatedCounter value={totalExpenses} $type="expense" />
                    <StatLabel>Toplam Gider</StatLabel>
                  </StatCard>
                  <StatCard $type="debt">
                    <AnimatedCounter value={totalRemainingDebts} $type="debt" />
                    <StatLabel>Kalan Borç</StatLabel>
                  </StatCard>
                  <StatCard $type="balance">
                    <AnimatedCounter value={netWorth} $type="balance" />
                    <StatLabel>Net Değer</StatLabel>
                  </StatCard>
                  <StatCard $type="expense">
                    <AnimatedCounter value={totalFixedExpenses} $type="expense" />
                    <StatLabel>Sabit Gider</StatLabel>
                  </StatCard>
                  <StatCard $type="debt">
                    <AnimatedCounter value={monthlyDebtPayments} $type="debt" />
                    <StatLabel>Aylık Ödeme</StatLabel>
                  </StatCard>
                  <StatCard $type="income">
                    <AnimatedCounter value={monthlyRecurringIncome} $type="income" />
                    <StatLabel>Aylık Düzenli Gelir</StatLabel>
                  </StatCard>
                  <StatCard $type="income">
                    <AnimatedCounter value={totalRecurringIncome} $type="income" />
                    <StatLabel>Toplam Düzenli Gelir</StatLabel>
                  </StatCard>
                </StatsGrid>
              </AccordionContent>
            )}
          </AnimatePresence>
        </AccordionCard>

        {/* Gelirler */}
        <AccordionCard>
          <AccordionHeader 
            $isOpen={openSection === 'income'} 
            onClick={() => toggleSection('income')}
          >
            <div>
              <AccordionTitle>💰 Gelirler</AccordionTitle>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <AccordionValue $type="income">₺{totalIncome.toLocaleString()}</AccordionValue>
              <AccordionIcon $isOpen={openSection === 'income'}>▼</AccordionIcon>
            </div>
          </AccordionHeader>
          <AnimatePresence>
            {openSection === 'income' && (
              <AccordionContent
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                exit={{ scaleY: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{ transformOrigin: "top" }}
              >
                <ButtonContainer>
                  {!showIncomeForm ? (
                    <AddButton
                      onClick={() => setShowIncomeForm(true)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      + Gelir Ekle
                    </AddButton>
                  ) : (
                    <AddButton
                      onClick={() => setShowIncomeForm(false)}
                      $isCancel={true}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      İptal
                    </AddButton>
                  )}
                </ButtonContainer>

                {showIncomeForm && (
                  <FormContainer>
                    <Form onSubmit={handleIncomeSubmit}>
                      <Input
                        type="text"
                        placeholder="Başlık (Maaş, Bonus, vb.)"
                        value={incomeForm.title}
                        onChange={(e) => setIncomeForm({...incomeForm, title: e.target.value})}
                        required
                      />
                      <Input
                        type="number"
                        placeholder="Tutar (₺)"
                        value={incomeForm.amount}
                        onChange={(e) => setIncomeForm({...incomeForm, amount: e.target.value})}
                        required
                      />
                      <Input
                        type="date"
                        value={incomeForm.date}
                        onChange={(e) => setIncomeForm({...incomeForm, date: e.target.value})}
                        required
                      />
                      <Input
                        type="text"
                        placeholder="Açıklama (Opsiyonel)"
                        value={incomeForm.description}
                        onChange={(e) => setIncomeForm({...incomeForm, description: e.target.value})}
                      />
                      <SubmitButton type="submit">Gelir Ekle</SubmitButton>
                    </Form>
                  </FormContainer>
                )}

                <ItemList>
                  {incomes.map(item => (
                    <Item key={item.id} $type="income">
                      <ItemTitle>{item.title}</ItemTitle>
                      <ItemDetails>{item.date} • {item.description}</ItemDetails>
                      <ItemAmount $type="income">
                        <span>₺{item.amount.toLocaleString()}</span>
                        <DeleteButton onClick={() => deleteIncome(item.id)}>Sil</DeleteButton>
                      </ItemAmount>
                    </Item>
                  ))}
                </ItemList>
              </AccordionContent>
            )}
          </AnimatePresence>
        </AccordionCard>

        {/* Giderler */}
        <AccordionCard>
          <AccordionHeader 
            $isOpen={openSection === 'expenses'} 
            onClick={() => toggleSection('expenses')}
          >
            <div>
              <AccordionTitle>💸 Giderler</AccordionTitle>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <AccordionValue $type="expense">₺{totalExpenses.toLocaleString()}</AccordionValue>
              <AccordionIcon $isOpen={openSection === 'expenses'}>▼</AccordionIcon>
            </div>
          </AccordionHeader>
          <AnimatePresence>
            {openSection === 'expenses' && (
              <AccordionContent
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                exit={{ scaleY: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{ transformOrigin: "top" }}
              >
                <ButtonContainer>
                  {!showExpenseForm ? (
                    <AddButton
                      onClick={() => setShowExpenseForm(true)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      + Gider Ekle
                    </AddButton>
                  ) : (
                    <AddButton
                      onClick={() => setShowExpenseForm(false)}
                      $isCancel={true}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      İptal
                    </AddButton>
                  )}
                </ButtonContainer>

                {showExpenseForm && (
                  <FormContainer>
                    <Form onSubmit={handleExpenseSubmit}>
                      <Input
                        type="text"
                        placeholder="Başlık (Market, Benzin, vb.)"
                        value={expenseForm.title}
                        onChange={(e) => setExpenseForm({...expenseForm, title: e.target.value})}
                        required
                      />
                      <Input
                        type="number"
                        placeholder="Tutar (₺)"
                        value={expenseForm.amount}
                        onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                        required
                      />
                      <Select
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
                      </Select>
                      <Input
                        type="date"
                        value={expenseForm.date}
                        onChange={(e) => setExpenseForm({...expenseForm, date: e.target.value})}
                        required
                      />
                      <SubmitButton type="submit">Gider Ekle</SubmitButton>
                    </Form>
                  </FormContainer>
                )}

                <ItemList>
                  {expenses.map(item => (
                    <Item key={item.id} $type="expense">
                      <ItemTitle>{item.title}</ItemTitle>
                      <ItemDetails>{item.date} • {item.category}</ItemDetails>
                      <ItemAmount $type="expense">
                        <span>₺{item.amount.toLocaleString()}</span>
                        <DeleteButton onClick={() => deleteExpense(item.id)}>Sil</DeleteButton>
                      </ItemAmount>
                    </Item>
                  ))}
                </ItemList>
              </AccordionContent>
            )}
          </AnimatePresence>
        </AccordionCard>

        {/* Borçlar */}
        <AccordionCard>
          <AccordionHeader 
            $isOpen={openSection === 'debts'} 
            onClick={() => toggleSection('debts')}
          >
            <div>
              <AccordionTitle>🏦 Borçlar</AccordionTitle>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <AccordionValue $type="debt">₺{totalRemainingDebts.toLocaleString()}</AccordionValue>
              <AccordionIcon $isOpen={openSection === 'debts'}>▼</AccordionIcon>
            </div>
          </AccordionHeader>
          <AnimatePresence>
            {openSection === 'debts' && (
              <AccordionContent
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                exit={{ scaleY: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{ transformOrigin: "top" }}
              >
                <ButtonContainer>
                  {!showDebtForm ? (
                    <AddButton
                      onClick={() => setShowDebtForm(true)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      + Borç Ekle
                    </AddButton>
                  ) : (
                    <AddButton
                      onClick={() => setShowDebtForm(false)}
                      $isCancel={true}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      İptal
                    </AddButton>
                  )}
                </ButtonContainer>

                {showDebtForm && (
                  <FormContainer>
                    <Form onSubmit={handleDebtSubmit}>
                      <Input
                        type="text"
                        placeholder="Borç Adı (Kredi, Kredi Kartı)"
                        value={debtForm.title}
                        onChange={(e) => setDebtForm({...debtForm, title: e.target.value})}
                        required
                      />
                      <Input
                        type="number"
                        placeholder="Toplam Borç (₺)"
                        value={debtForm.amount}
                        onChange={(e) => setDebtForm({...debtForm, amount: e.target.value})}
                        required
                      />
                      <Input
                        type="number"
                        placeholder="Aylık Ödeme (₺)"
                        value={debtForm.monthlyPayment}
                        onChange={(e) => setDebtForm({...debtForm, monthlyPayment: e.target.value})}
                        required
                      />
                      <Input
                        type="number"
                        placeholder="Vade (Ay)"
                        value={debtForm.totalMonths}
                        onChange={(e) => setDebtForm({...debtForm, totalMonths: e.target.value})}
                        required
                      />
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ 
                          display: 'block', 
                          color: '#4ECDC4', 
                          fontSize: '0.9rem', 
                          marginBottom: '5px',
                          fontWeight: '500'
                        }}>
                          📅 Başlangıç Tarihi (Borcun alındığı tarih)
                        </label>
                        <Input
                          type="date"
                          value={debtForm.startDate}
                          onChange={(e) => setDebtForm({...debtForm, startDate: e.target.value})}
                          required
                        />
                      </div>
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ 
                          display: 'block', 
                          color: '#FF9800', 
                          fontSize: '0.9rem', 
                          marginBottom: '5px',
                          fontWeight: '500'
                        }}>
                          ⏰ Vade Tarihi (Son ödeme tarihi)
                        </label>
                        <Input
                          type="date"
                          value={debtForm.dueDate}
                          onChange={(e) => setDebtForm({...debtForm, dueDate: e.target.value})}
                          required
                        />
                      </div>
                      <Input
                        type="number"
                        placeholder="Faiz Oranı (%) - Opsiyonel"
                        value={debtForm.interestRate}
                        onChange={(e) => setDebtForm({...debtForm, interestRate: e.target.value})}
                      />
                      <SubmitButton type="submit">Borç Ekle</SubmitButton>
                    </Form>
                  </FormContainer>
                )}

                <ItemList>
                  {debts.map(item => (
                    <Item key={item.id} $type="debt">
                      <ItemTitle>{item.title}</ItemTitle>
                      <ItemDetails>
                        Başlangıç: {item.startDate} • Vade: {item.dueDate} • Kalan: {item.remainingMonths} ay
                      </ItemDetails>
                      <ItemAmount $type="debt">
                        <span>₺{(item.amount - item.paidAmount).toLocaleString()}</span>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {item.remainingMonths > 0 && item.monthlyPayment && (
                            <motion.button
                              onClick={() => makeDebtPayment(item.id)}
                              style={{
                                background: '#4CAF50',
                                border: 'none',
                                color: '#fff',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: '500',
                                minWidth: '80px',
                                height: '28px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Ödeme (₺{item.monthlyPayment.toLocaleString()})
                            </motion.button>
                          )}
                          <DeleteButton onClick={() => deleteDebt(item.id)}>Sil</DeleteButton>
                        </div>
                      </ItemAmount>
                    </Item>
                  ))}
                </ItemList>
              </AccordionContent>
            )}
          </AnimatePresence>
        </AccordionCard>

        {/* Sabit Giderler */}
        <AccordionCard>
          <AccordionHeader 
            $isOpen={openSection === 'fixed'} 
            onClick={() => toggleSection('fixed')}
          >
            <div>
              <AccordionTitle>📅 Sabit Giderler</AccordionTitle>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <AccordionValue $type="expense">₺{totalFixedExpenses.toLocaleString()}</AccordionValue>
              <AccordionIcon $isOpen={openSection === 'fixed'}>▼</AccordionIcon>
            </div>
          </AccordionHeader>
          <AnimatePresence>
            {openSection === 'fixed' && (
              <AccordionContent
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                exit={{ scaleY: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{ transformOrigin: "top" }}
              >
                <ButtonContainer>
                  {!showFixedExpenseForm ? (
                    <AddButton
                      onClick={() => setShowFixedExpenseForm(true)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      + Sabit Gider Ekle
                    </AddButton>
                  ) : (
                    <AddButton
                      onClick={() => setShowFixedExpenseForm(false)}
                      $isCancel={true}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      İptal
                    </AddButton>
                  )}
                </ButtonContainer>

                {showFixedExpenseForm && (
                  <FormContainer>
                    <Form onSubmit={handleFixedExpenseSubmit}>
                      <Input
                        type="text"
                        placeholder="Gider Adı (Kira, Elektrik)"
                        value={fixedExpenseForm.title}
                        onChange={(e) => setFixedExpenseForm({...fixedExpenseForm, title: e.target.value})}
                        required
                      />
                      <Input
                        type="number"
                        placeholder="Aylık Tutar (₺)"
                        value={fixedExpenseForm.amount}
                        onChange={(e) => setFixedExpenseForm({...fixedExpenseForm, amount: e.target.value})}
                        required
                      />
                      <Select
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
                      </Select>
                      <SubmitButton type="submit">Sabit Gider Ekle</SubmitButton>
                    </Form>
                  </FormContainer>
                )}

                <ItemList>
                  {fixedExpenses.map(item => (
                    <Item key={item.id} $type="expense">
                      <ItemTitle>{item.title}</ItemTitle>
                      <ItemDetails>Aylık • {item.category}</ItemDetails>
                      <ItemAmount $type="expense">
                        <span>₺{item.amount.toLocaleString()}</span>
                        <DeleteButton onClick={() => deleteFixedExpense(item.id)}>Sil</DeleteButton>
                      </ItemAmount>
                    </Item>
                  ))}
                </ItemList>
              </AccordionContent>
            )}
          </AnimatePresence>
        </AccordionCard>

        {/* Düzenli Gelirler */}
        <AccordionCard>
          <AccordionHeader 
            $isOpen={openSection === 'recurring'} 
            onClick={() => toggleSection('recurring')}
          >
            <div>
              <AccordionTitle>🔄 Düzenli Gelirler</AccordionTitle>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <AccordionValue $type="income">₺{monthlyRecurringIncome.toLocaleString()}/ay</AccordionValue>
              <AccordionIcon $isOpen={openSection === 'recurring'}>▼</AccordionIcon>
            </div>
          </AccordionHeader>
          <AnimatePresence>
            {openSection === 'recurring' && (
              <AccordionContent
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                exit={{ scaleY: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{ transformOrigin: "top" }}
              >
                <ButtonContainer>
                  {!showRecurringIncomeForm ? (
                    <AddButton
                      onClick={() => setShowRecurringIncomeForm(true)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      + Düzenli Gelir Ekle
                    </AddButton>
                  ) : (
                    <AddButton
                      onClick={() => setShowRecurringIncomeForm(false)}
                      $isCancel={true}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      İptal
                    </AddButton>
                  )}
                </ButtonContainer>

                {showRecurringIncomeForm && (
                  <FormContainer>
                    <Form onSubmit={handleRecurringIncomeSubmit}>
                      <Input
                        type="text"
                        placeholder="Gelir Adı (Maaş, Kira Geliri, vb.)"
                        value={recurringIncomeForm.title}
                        onChange={(e) => setRecurringIncomeForm({...recurringIncomeForm, title: e.target.value})}
                        required
                      />
                      <Input
                        type="number"
                        placeholder="Tutar (₺)"
                        value={recurringIncomeForm.amount}
                        onChange={(e) => setRecurringIncomeForm({...recurringIncomeForm, amount: e.target.value})}
                        required
                      />
                      <Select
                        value={recurringIncomeForm.frequency}
                        onChange={(e) => setRecurringIncomeForm({...recurringIncomeForm, frequency: e.target.value})}
                        required
                      >
                        <option value="monthly">Aylık</option>
                        <option value="weekly">Haftalık</option>
                        <option value="biweekly">İki Haftada Bir</option>
                        <option value="yearly">Yıllık</option>
                      </Select>
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ 
                          display: 'block', 
                          color: '#4CAF50', 
                          fontSize: '0.9rem', 
                          marginBottom: '5px',
                          fontWeight: '500'
                        }}>
                          🚀 Başlangıç Tarihi (İlk ödeme tarihi)
                        </label>
                        <Input
                          type="date"
                          value={recurringIncomeForm.startDate}
                          onChange={(e) => setRecurringIncomeForm({...recurringIncomeForm, startDate: e.target.value})}
                          required
                        />
                      </div>
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ 
                          display: 'block', 
                          color: '#FF5722', 
                          fontSize: '0.9rem', 
                          marginBottom: '5px',
                          fontWeight: '500'
                        }}>
                          🏁 Bitiş Tarihi (Opsiyonel - boş bırakırsan süresiz)
                        </label>
                        <Input
                          type="date"
                          value={recurringIncomeForm.endDate}
                          onChange={(e) => setRecurringIncomeForm({...recurringIncomeForm, endDate: e.target.value})}
                        />
                      </div>
                      <Input
                        type="text"
                        placeholder="Açıklama (Opsiyonel)"
                        value={recurringIncomeForm.description}
                        onChange={(e) => setRecurringIncomeForm({...recurringIncomeForm, description: e.target.value})}
                      />
                      <SubmitButton type="submit">Düzenli Gelir Ekle</SubmitButton>
                    </Form>
                  </FormContainer>
                )}

                <ItemList>
                  {recurringIncomes.map(item => (
                    <Item key={item.id} $type="income">
                      <ItemTitle>
                        {item.title} 
                        <span style={{ 
                          fontSize: '0.75rem', 
                          marginLeft: '8px',
                          color: item.isActive ? '#4CAF50' : '#F44336',
                          fontWeight: 'normal'
                        }}>
                          {item.isActive ? '● Aktif' : '● Pasif'}
                        </span>
                      </ItemTitle>
                      <ItemDetails>
                        {item.frequency === 'monthly' && 'Aylık'} 
                        {item.frequency === 'weekly' && 'Haftalık'} 
                        {item.frequency === 'biweekly' && 'İki Haftada Bir'} 
                        {item.frequency === 'yearly' && 'Yıllık'} 
                        • Sonraki: {item.nextPaymentDate} • Toplam: {item.receivedCount} ödeme
                      </ItemDetails>
                      <ItemAmount $type="income">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <span>₺{item.amount.toLocaleString()} / {
                            item.frequency === 'monthly' ? 'ay' :
                            item.frequency === 'weekly' ? 'hafta' :
                            item.frequency === 'biweekly' ? '2 hafta' : 'yıl'
                          }</span>
                          <small style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' }}>
                            Toplam alınan: ₺{item.totalReceived.toLocaleString()}
                          </small>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <motion.button
                            onClick={() => toggleRecurringIncome(item.id)}
                            style={{
                              background: item.isActive ? '#FF9800' : '#4CAF50',
                              border: 'none',
                              color: '#fff',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              minWidth: '60px',
                              height: '28px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {item.isActive ? 'Durdur' : 'Başlat'}
                          </motion.button>
                          {item.isActive && (
                            <motion.button
                              onClick={() => receiveRecurringPayment(item.id)}
                              style={{
                                background: '#4CAF50',
                                border: 'none',
                                color: '#fff',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: '500',
                                minWidth: '70px',
                                height: '28px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Al (₺{item.amount.toLocaleString()})
                            </motion.button>
                          )}
                          <DeleteButton onClick={() => deleteRecurringIncome(item.id)}>Sil</DeleteButton>
                        </div>
                      </ItemAmount>
                    </Item>
                  ))}
                </ItemList>
              </AccordionContent>
            )}
          </AnimatePresence>
        </AccordionCard>
      </AccordionContainer>
    </DashboardContainer>
  );
};

export default SecretDashboard; 