import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'tr' | 'en';

type TranslationKey = 
  | 'nav.home'
  | 'nav.about'
  | 'nav.portfolio'
  | 'nav.contact'
  | 'home.title'
  | 'home.subtitle'
  | 'home.description'
  | 'about.title'
  | 'about.description'
  | 'about.whoAmI'
  | 'about.continuousLearning'
  | 'about.skills'
  | 'portfolio.title'
  | 'portfolio.description'
  | 'portfolio.project1.title'
  | 'portfolio.project1.description'
  | 'portfolio.project2.title'
  | 'portfolio.project2.description'
  | 'portfolio.project3.title'
  | 'portfolio.project3.description'
  | 'portfolio.project4.title'
  | 'portfolio.project4.description'
  | 'contact.title'
  | 'contact.description'
  | 'contact.form.name'
  | 'contact.form.email'
  | 'contact.form.message'
  | 'contact.form.submit'
  | 'contact.info.email'
  | 'contact.info.phone'
  | 'contact.info.address'
  | 'home.section1.title'
  | 'home.section1.description'
  | 'home.section2.title'
  | 'home.section2.description'
  | 'home.section3.title'
  | 'home.section3.description'
  | 'home.explore'
  | 'contact.name'
  | 'contact.subject'
  | 'contact.sending'
  | 'contact.success'
  | 'contact.error'
  | 'contact.location'
  | 'contact.invalidEmail';

type Translations = {
  [key in Language]: {
    [key in TranslationKey]: string;
  };
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const translations: Translations = {
  tr: {
    'nav.home': 'Ana Sayfa',
    'nav.about': 'Hakkımda',
    'nav.portfolio': 'Portfolyo',
    'nav.contact': 'İletişim',
    'home.title': 'Batuhan Erdener Ekşi',
    'home.subtitle': 'BT Çözümleri',
    'home.description': 'İşinize özel, esnek ve ölçeklenebilir çözümler. Her işletmenin ihtiyacı farklıdır. Bu yüzden hazır paketlerle yetinmek yerine, size özel yazılım çözümleri sunuyorum. Web tabanlı uygulamalardan mobil sistemlere, masaüstü programlardan ERP entegrasyonlarına kadar farklı alanlarda iş süreçlerinizi hızlandıran ve kolaylaştıran çözümler geliştiriyorum.',
    'about.title': 'Hakkımda',
    'about.description': 'Ben Batuhan Erdener Ekşi. Başkent Üniversitesi Bilgisayar Programcılığı mezunuyum, aynı zamanda Anadolu Üniversitesi İşletme bölümünü tamamladım. Teknolojiyle insanları buluşturmayı hedefleyen bir yazılım geliştiriciyim. Uzun süredir freelance olarak web ve mobil tabanlı projeler geliştiriyor, bireylere ve işletmelere dijital çözümler sunuyorum.\n\nŞu anda Aksa Runflat bünyesinde IT Specialist olarak aktif görev yapmaktayım. Bu görevim kapsamında ERP sistemlerinin kurulumu, yapılandırılması ve şirket içi iş akışlarına entegrasyonunu üstleniyor; aynı zamanda sunucu yönetimi, ağ güvenliği ve kullanıcı desteği gibi kritik BT süreçlerinde rol alıyorum. ERP süreçlerine hâkimiyetim sayesinde, firmaların iş süreçlerini dijitalleştirme ve otomasyon konusunda etkin çözümler sunuyorum.\n\nAyrıca kurucusu olduğum Ekşiler Studio çatısı altında oyun yazılımı, 3D modelleme ve interaktif medya projelerinde yer alıyor; hem yaratıcı hem teknik becerilerimi bir araya getirerek kullanıcı odaklı dijital deneyimler tasarlıyorum. Oyun geliştirme ve görselleştirme konularında edindiğim deneyim, projelere farklı bir perspektif kazandırıyor.\n\nDaha önce All R Studio\'da frontend developer olarak görev aldım. Web arayüzleri geliştirerek projelerin kullanıcı dostu, hızlı ve estetik bir şekilde hayata geçirilmesini sağladım.\n\nSadece yazılım üretmiyor, aynı zamanda kullanıcı deneyimi, tasarım ve iş geliştirme alanlarında da çok yönlü bakış açısıyla hareket ediyorum. Teknik bilgi birikimimi, işletme vizyonumla birleştirerek her projeyi hem çalışan hem de stratejik hedeflere hizmet eden bir yapıya dönüştürüyorum.\n\nBugüne kadar birçok sektöre özel yazılım, kurumsal web sitesi, oyun, sistem ve otomasyon çözümleri geliştirdim. Eğer siz de dijital dünyada güçlü bir yer edinmek, iş süreçlerinizi modernleştirmek ya da özel bir proje geliştirmek istiyorsanız, doğru adrestesiniz.',
    'about.whoAmI': 'Ben Kimim?',
    'about.continuousLearning': 'Sürekli öğrenmeye ve kendimi geliştirmeye odaklanıyorum. Yeni teknolojileri takip ediyor ve projelerimde en güncel çözümleri kullanmaya özen gösteriyorum.',
    'about.skills': 'Yeteneklerim',
    'portfolio.title': 'Portfolyo',
    'portfolio.description': 'Projelerim ve çalışmalarım.',
    'portfolio.project1.title': 'E-Ticaret Platformu',
    'portfolio.project1.description': 'Modern ve kullanıcı dostu bir e-ticaret platformu geliştirdim. React ve Node.js kullanıldı.',
    'portfolio.project2.title': 'Mobil Uygulama',
    'portfolio.project2.description': 'iOS ve Android için cross-platform bir mobil uygulama. React Native ile geliştirildi.',
    'portfolio.project3.title': 'Web Portal',
    'portfolio.project3.description': 'Kurumsal bir web portalı. Vue.js ve Django kullanılarak geliştirildi.',
    'portfolio.project4.title': 'Yapay Zeka Projesi',
    'portfolio.project4.description': 'Makine öğrenmesi tabanlı bir öneri sistemi. Python ve TensorFlow kullanıldı.',
    'contact.title': 'İletişim',
    'contact.description': 'Benimle iletişime geçin.',
    'contact.form.name': 'İsim',
    'contact.form.email': 'E-posta',
    'contact.form.message': 'Mesaj',
    'contact.form.submit': 'Gönder',
    'contact.info.email': 'E-posta: erdener.eksi@gmail.com',
    'contact.info.phone': 'Telefon: +90 ',
    'contact.info.address': 'Adres: Ankara, Türkiye',
    'home.section1.title': 'Yazılım Geliştirme',
    'home.section1.description': 'İşinize özel, esnek ve ölçeklenebilir çözümler. Her işletmenin ihtiyacı farklıdır. Bu yüzden hazır paketlerle yetinmek yerine, size özel yazılım çözümleri sunuyorum. Web tabanlı uygulamalardan mobil sistemlere, masaüstü programlardan ERP entegrasyonlarına kadar farklı alanlarda iş süreçlerinizi hızlandıran ve kolaylaştıran çözümler geliştiriyorum.',
    'home.section2.title': 'Ne Sunuyorum?',
    'home.section2.description': '• İhtiyacınıza özel yazılım geliştirme\n• Stok, sipariş ve süreç takibi için otomasyon sistemleri\n• Mobil uygulamalar (Android & iOS)\n• Web tabanlı yönetim panelleri\n• Kurumsal yazılım çözümleri ve dijital dönüşüm desteği\n• Kullanıcı dostu arayüzler, güçlü veri yönetimi',
    'home.section3.title': 'Neden Ben?',
    'home.section3.description': 'Çünkü hazır çözümler sizi yavaşlatır.\n\nBen, ihtiyacınıza özel, sadece sizin için tasarlanmış yazılımlar geliştiriyorum. Sektörünüzü, işleyişinizi ve hedef kitlenizi anlıyor, bu doğrultuda sade ama güçlü dijital çözümler sunuyorum.\n\nSize tek bir isim, tek bir muhatap, tek bir çözüm sunuyorum.\nAjanslar gibi araya kimse girmez, kaybolmazsınız. Her şey doğrudan benim kontrolümde; tasarımdan kodlamaya, teknik destekten geliştirme sürecine kadar her adımı sizinle birebir iletişimde yürütüyorum.\n\nYıllardır hem kurumsal hem bireysel projelerde onlarca müşterinin sorunlarını çözdüm. Sadece proje teslim etmiyorum — sizinle birlikte düşünen, işinize ortak olan biri olarak çalışıyorum.\n\nİşinizi dijital dünyada öne çıkaracak güvenilir, hızlı ve uzun vadeli bir çözüm ortağı arıyorsanız, aramanız gereken kişi belli.\n\nÇünkü bir işi ya size özel yaparım, ya hiç yapmam.',
    'home.explore': 'Hizmetlerimizi Keşfedin',
    'contact.name': 'Adınız',
    'contact.subject': 'Konu',
    'contact.sending': 'Gönderiliyor...',
    'contact.success': 'Mesajınız başarıyla gönderildi!',
    'contact.error': 'Bir hata oluştu. Lütfen tekrar deneyin.',
    'contact.location': 'Konum',
    'contact.invalidEmail': 'Geçersiz veya kullanılmayan bir e-posta adresi girdiniz.'
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.portfolio': 'Portfolio',
    'nav.contact': 'Contact',
    'home.title': 'Batuhan Erdener Ekşi',
    'home.subtitle': 'IT Solutions',
    'home.description': 'Custom, flexible, and scalable solutions for your business. Every business has different needs. That\'s why instead of settling for ready-made packages, I offer custom software solutions. From web-based applications to mobile systems, from desktop programs to ERP integrations, I develop solutions that speed up and facilitate your business processes in different areas.',
    'about.title': 'About Me',
    'about.description': 'I am Batuhan Erdener Ekşi. I graduated from Başkent University with a degree in Computer Programming and completed my Business degree at Anadolu University. I am a software developer aiming to bring people together with technology. I have been developing web and mobile-based projects as a freelancer for a long time, offering digital solutions to individuals and businesses.\n\nI am currently working as an IT Specialist at Aksa Runflat. In this role, I handle the installation, configuration, and integration of ERP systems into company workflows; I also take part in critical IT processes such as server management, network security, and user support. Thanks to my expertise in ERP processes, I provide effective solutions for digitizing and automating business processes.\n\nUnder Ekşiler Studio, which I founded, I am involved in game software, 3D modeling, and interactive media projects; I combine both creative and technical skills to design user-focused digital experiences. My experience in game development and visualization brings a different perspective to projects.\n\nPreviously, I worked as a frontend developer at All R Studio. I developed web interfaces to ensure projects were implemented in a user-friendly, fast, and aesthetic manner.\n\nI don\'t just produce software, I also operate with a multifaceted perspective in user experience, design, and business development. By combining my technical knowledge with my business vision, I transform each project into a structure that serves both operational and strategic goals.\n\nTo date, I have developed software, corporate websites, games, systems, and automation solutions for many sectors. If you want to establish a strong presence in the digital world, modernize your business processes, or develop a special project, you\'re in the right place.',
    'about.whoAmI': 'Who Am I?',
    'about.continuousLearning': 'I focus on continuous learning and self-improvement. I follow new technologies and strive to use the most up-to-date solutions in my projects.',
    'about.skills': 'My Skills',
    'portfolio.title': 'Portfolio',
    'portfolio.description': 'My projects and works.',
    'portfolio.project1.title': 'E-Commerce Platform',
    'portfolio.project1.description': 'I developed a modern and user-friendly e-commerce platform. Built with React and Node.js.',
    'portfolio.project2.title': 'Mobile Application',
    'portfolio.project2.description': 'A cross-platform mobile application for iOS and Android. Developed with React Native.',
    'portfolio.project3.title': 'Web Portal',
    'portfolio.project3.description': 'A corporate web portal. Developed using Vue.js and Django.',
    'portfolio.project4.title': 'AI Project',
    'portfolio.project4.description': 'A machine learning-based recommendation system. Built with Python and TensorFlow.',
    'contact.title': 'Contact',
    'contact.description': 'Get in touch with me.',
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.message': 'Message',
    'contact.form.submit': 'Send',
    'contact.info.email': 'Email: erdener.eksi@gmail.com',
    'contact.info.phone': 'Phone: +90 532 --------',
    'contact.info.address': 'Address: Ankara, Turkey',
    'home.section1.title': 'Software Development',
    'home.section1.description': 'Custom, flexible, and scalable solutions for your business. Every business has different needs. That\'s why instead of settling for ready-made packages, I offer custom software solutions. From web-based applications to mobile systems, from desktop programs to ERP integrations, I develop solutions that speed up and facilitate your business processes in different areas.',
    'home.section2.title': 'What Do I Offer?',
    'home.section2.description': '• Custom software development for your needs\n• Automation systems for inventory, order, and process tracking\n• Mobile applications (Android & iOS)\n• Web-based management panels\n• Enterprise software solutions and digital transformation support\n• User-friendly interfaces, powerful data management',
    'home.section3.title': 'Why Me?',
    'home.section3.description': 'Because ready-made solutions slow you down.\n\nI develop custom software designed specifically for you. I understand your industry, operations, and target audience, offering simple but powerful digital solutions accordingly.\n\nI offer you a single name, a single point of contact, a single solution.\nUnlike agencies, no one gets in between, you won\'t get lost. Everything is under my direct control; from design to coding, from technical support to the development process, I carry out every step in direct communication with you.\n\nI have solved the problems of dozens of clients in both corporate and individual projects over the years. I don\'t just deliver projects — I work as someone who thinks with you, becomes a partner in your business.\n\nIf you\'re looking for a reliable, fast, and long-term solution partner to make your business stand out in the digital world, you know who to look for.\n\nBecause I either do a job specifically for you, or I don\'t do it at all.',
    'home.explore': 'Explore Our Services',
    'contact.name': 'Your Name',
    'contact.subject': 'Subject',
    'contact.sending': 'Sending...',
    'contact.success': 'Your message has been sent successfully!',
    'contact.error': 'An error occurred. Please try again.',
    'contact.location': 'Location',
    'contact.invalidEmail': 'You have entered an invalid or unused email address.'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage || 'tr';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: TranslationKey): string => {
    return translations[language][key];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 
