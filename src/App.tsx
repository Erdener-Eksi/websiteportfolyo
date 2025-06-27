import React, { Suspense, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { useScroll } from 'framer-motion';
import * as THREE from 'three';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import About from './pages/About';
import Contact from './pages/Contact';
import SecretLogin from './pages/SecretLogin';
import SecretDashboard from './pages/SecretDashboard';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import GlobalStyle from './styles/GlobalStyle';

const AppContainer = styled.div`
  min-height: 100vh;
  background: #000000;
  color: #fff;
  position: relative;
`;

const CanvasContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 1;
  min-height: 100vh;
`;

const SpaceBackground = () => {
  const starsRef = useRef<THREE.Points>(null);
  const { scrollY } = useScroll();

  useFrame((state) => {
    if (starsRef.current) {
      // Yavaş sürekli dönüş
      starsRef.current.rotation.y += 0.0001;
      starsRef.current.rotation.x += 0.00005;

      // Scroll ile hareket
      starsRef.current.rotation.y = THREE.MathUtils.lerp(
        starsRef.current.rotation.y,
        scrollY.get() * 0.0001,
        0.02
      );
      starsRef.current.rotation.x = THREE.MathUtils.lerp(
        starsRef.current.rotation.x,
        scrollY.get() * 0.00005,
        0.02
      );
    }
  });

  return (
    <>
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 30, 100]} />
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <Stars
        ref={starsRef}
        radius={500}
        depth={200}
        count={20000}
        factor={2}
        saturation={0}
        fade
        speed={0.1}
      />
    </>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const isSecretPage = location.pathname === '/secret-login' || location.pathname === '/secret-dashboard';

  return (
    <AppContainer>
      <CanvasContainer>
        <Canvas camera={{ position: [0, 0, 30], fov: 75 }}>
          <Suspense fallback={null}>
            <SpaceBackground />
          </Suspense>
        </Canvas>
      </CanvasContainer>
      <ContentContainer>
        {!isSecretPage && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/secret-login" element={<SecretLogin />} />
          <Route path="/secret-dashboard" element={<SecretDashboard />} />
        </Routes>
        {!isSecretPage && <Footer />}
      </ContentContainer>
    </AppContainer>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CustomThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <Router
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
              }}
            >
              <GlobalStyle />
              <AppContent />
            </Router>
          </AuthProvider>
        </LanguageProvider>
      </CustomThemeProvider>
    </ThemeProvider>
  );
};

export default App;
