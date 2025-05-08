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
  | 'contact.invalidEmail'
  | 'portfolio.featured.title'
  | 'portfolio.featured.description'
  | 'portfolio.featured.project1.title'
  | 'portfolio.featured.project1.description'
  | 'portfolio.featured.project2.title'
  | 'portfolio.featured.project2.description'
  | 'portfolio.featured.project3.title'
  | 'portfolio.featured.project3.description'
  | 'portfolio.featured.project4.title'
  | 'portfolio.featured.project4.description'
  | 'portfolio.completed.title'
  | 'portfolio.completed.description'
  | 'portfolio.completed.project1.title'
  | 'portfolio.completed.project1.description'
  | 'portfolio.completed.project2.title'
  | 'portfolio.completed.project2.description'
  | 'portfolio.completed.project3.title'
  | 'portfolio.completed.project3.description';

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
    'nav.portfolio': 'Hizmetler',
    'nav.contact': 'İletişim',
    'home.title': 'Batuhan Erdener Ekşi',
    'home.subtitle': 'BT Çözümleri',
    'home.description': 'İşinize özel, esnek ve ölçeklenebilir çözümler. Her işletmenin ihtiyacı farklıdır. Bu yüzden hazır paketlerle yetinmek yerine, size özel yazılım çözümleri sunuyorum. Web tabanlı uygulamalardan mobil sistemlere, masaüstü programlardan ERP entegrasyonlarına kadar farklı alanlarda iş süreçlerinizi hızlandıran ve kolaylaştıran çözümler geliştiriyorum.',
    'about.title': 'Hakkımda',
    'about.description': 'Ben Batuhan Erdener Ekşi. Başkent Üniversitesi Bilgisayar Programcılığı mezunuyum, aynı zamanda Anadolu Üniversitesi İşletme bölümünü tamamladım. Teknolojiyle insanları buluşturmayı hedefleyen bir yazılım geliştiriciyim. Uzun süredir freelance olarak web ve mobil tabanlı projeler geliştiriyor, bireylere ve işletmelere dijital çözümler sunuyorum.\n\nŞu anda Aksa Runflat bünyesinde IT Specialist olarak aktif görev yapmaktayım. Bu görevim kapsamında ERP sistemlerinin kurulumu, yapılandırılması ve şirket içi iş akışlarına entegrasyonunu üstleniyor; aynı zamanda sunucu yönetimi, ağ güvenliği ve kullanıcı desteği gibi kritik BT süreçlerinde rol alıyorum. ERP süreçlerine hâkimiyetim sayesinde, firmaların iş süreçlerini dijitalleştirme ve otomasyon konusunda etkin çözümler sunuyorum.\n\nAyrıca kurucusu olduğum Ekşiler Studio çatısı altında oyun yazılımı, 3D modelleme ve interaktif medya projelerinde yer alıyor; hem yaratıcı hem teknik becerilerimi bir araya getirerek kullanıcı odaklı dijital deneyimler tasarlıyorum. Oyun geliştirme ve görselleştirme konularında edindiğim deneyim, projelere farklı bir perspektif kazandırıyor.\n\nDaha önce All R Studio\'da frontend developer olarak görev aldım. Web arayüzleri geliştirerek projelerin kullanıcı dostu, hızlı ve estetik bir şekilde hayata geçirilmesini sağladım.\n\nSadece yazılım üretmiyor, aynı zamanda kullanıcı deneyimi, tasarım ve iş geliştirme alanlarında da çok yönlü bakış açısıyla hareket ediyorum. Teknik bilgi birikimimi, işletme vizyonumla birleştirerek her projeyi hem çalışan hem de stratejik hedeflere hizmet eden bir yapıya dönüştürüyorum.\n\nBugüne kadar birçok sektöre özel yazılım, kurumsal web sitesi, oyun, sistem ve otomasyon çözümleri geliştirdim. Eğer siz de dijital dünyada güçlü bir yer edinmek, iş süreçlerinizi modernleştirmek ya da özel bir proje geliştirmek istiyorsanız, doğru adrestesiniz.',
    'about.whoAmI': 'Ben Kimim?',
    'about.continuousLearning': 'Sürekli öğrenmeye ve kendimi geliştirmeye odaklanıyorum. Yeni teknolojileri takip ediyor ve projelerimde en güncel çözümleri kullanmaya özen gösteriyorum.',
    'about.skills': 'Yeteneklerim',
    'portfolio.title': 'Hizmetlerim',
    'portfolio.description': 'Size sunduğum profesyonel hizmetler.',
    'portfolio.project1.title': 'Web Geliştirme',
    'portfolio.project1.description': '🌐 Modern ve Kullanıcı Dostu Web Çözümleri\n\n• Responsive Web Tasarımı\n• E-ticaret Platformları\n• Kurumsal Web Siteleri\n• Web Uygulamaları\n• API Entegrasyonları\n\n🛠 Kullanılan Teknolojiler:\nReact · Node.js · TypeScript · Next.js · Tailwind CSS',
    'portfolio.project2.title': 'Mobil Uygulama Geliştirme',
    'portfolio.project2.description': '📱 Cross-Platform Mobil Çözümler\n\n• iOS ve Android Uygulamaları\n• E-ticaret Mobil Uygulamaları\n• Kurumsal Mobil Uygulamalar\n• Oyun Uygulamaları\n• IoT Entegrasyonları\n\n🛠 Kullanılan Teknolojiler:\nReact Native · Flutter · Firebase · Redux',
    'portfolio.project3.title': 'ERP ve İş Otomasyonu',
    'portfolio.project3.description': '⚙️ Kurumsal Otomasyon Çözümleri\n\n• ERP Sistem Entegrasyonları\n• Stok ve Envanter Yönetimi\n• Üretim Planlama Sistemleri\n• İnsan Kaynakları Otomasyonu\n• Raporlama Sistemleri\n\n🛠 Kullanılan Teknolojiler:\nPython · SQL · .NET · Java',
    'portfolio.project4.title': 'Dijital Dönüşüm',
    'portfolio.project4.description': '🚀 Kapsamlı Dijital Dönüşüm\n\n• İş Süreçleri Optimizasyonu\n• Veri Analizi ve Raporlama\n• Bulut Çözümleri\n• Siber Güvenlik\n• Yapay Zeka Entegrasyonları\n\n🛠 Kullanılan Teknolojiler:\nAWS · Azure · Python · TensorFlow',
    'contact.title': 'İletişim',
    'contact.description': 'Benimle iletişime geçin.',
    'contact.form.name': 'İsim',
    'contact.form.email': 'E-posta',
    'contact.form.message': 'Mesaj',
    'contact.form.submit': 'Gönder',
    'contact.info.email': 'E-posta: erdener.eksi@gmail.com',
    'contact.info.phone': 'Telefon: +90 --- --- -- --',
    'contact.info.address': 'Adres: Ankara, Türkiye',
    'home.section1.title': 'Yazılım Geliştirme',
    'home.section1.description': 'İşinize özel, esnek ve ölçeklenebilir çözümler. Her işletmenin ihtiyacı farklıdır. Bu yüzden hazır paketlerle yetinmek yerine, size özel yazılım çözümleri sunuyorum. Web tabanlı uygulamalardan mobil sistemlere, masaüstü programlardan ERP entegrasyonlarına kadar farklı alanlarda iş süreçlerinizi hızlandıran ve kolaylaştıran çözümler geliştiriyorum.',
    'home.section2.title': 'Ne Sunuyorum?',
    'home.section2.description': '• İhtiyacınıza özel yazılım geliştirme\n• Stok, sipariş ve süreç takibi için otomasyon sistemleri\n• Mobil uygulamalar (Android & iOS)\n• Web tabanlı yönetim panelleri\n• Kurumsal yazılım çözümleri ve dijital dönüşüm desteği\n• Kullanıcı dostu arayüzler, güçlü veri yönetimi',
    'home.section3.title': 'Neden Ben?',
    'home.section3.description': 'Çünkü işinizi şansa bırakamazsınız.\n\nBen size zaman kaybettiren hazır paket çözümlerle değil, doğrudan ihtiyaçlarınıza özel geliştirilen yazılımlarla geliyorum. Sizi, sıradanlığın ötesine taşıyacak dijital çözümler sunuyorum.\n\nAjanslarla çalıştığınızda işler bölünür, iletişim kopuk olur, kalite dağılır.\nBenimle çalıştığınızda ise doğrudan geliştiriciyle, yani işi gerçekten yapan kişiyle muhatap olursunuz. Her adımı sizinle birlikte planlar, geliştirir ve hayata geçiririm.\n\nYalnızca yazılım değil; strateji, tasarım, iş anlayışı ve kullanıcı deneyimini birlikte sunuyorum. Başkent Üniversitesi\'nde teknik altyapımı, Anadolu Üniversitesi\'nde ise işletme vizyonumu geliştirdim. Bugün her ikisini bir araya getirerek projelerinizi sadece kodlayan değil, gerçekten anlayan biriyle çalışmış olursunuz.\n\nBugüne kadar onlarca farklı sektörde çözüm ürettim. ERP sistemlerinden mobil uygulamalara, kurumsal web sitelerinden özel otomasyonlara kadar farklı alanlarda güvenilir ve sürdürülebilir işler çıkardım.\n\nVakit nakittir.\nDoğru kişiyle, ilk seferde sağlam adımlar atmak istiyorsanız, şu an doğru yerdesiniz.\n\nİhtiyacınızı konuşalım.',
    'home.explore': 'Hizmetlerimizi Keşfedin',
    'contact.name': 'Adınız',
    'contact.subject': 'Konu',
    'contact.sending': 'Gönderiliyor...',
    'contact.success': 'Mesajınız başarıyla gönderildi!',
    'contact.error': 'Bir hata oluştu. Lütfen tekrar deneyin.',
    'contact.location': 'Konum',
    'contact.invalidEmail': 'Geçersiz veya kullanılmayan bir e-posta adresi girdiniz.',
    'portfolio.featured.title': 'Öne Çıkan Projelerim',
    'portfolio.featured.description': 'Son dönemde tamamladığım bazı önemli projeler.',
    'portfolio.featured.project1.title': 'Stoklen',
    'portfolio.featured.project1.description': 'Kurumsal Stok Takibi, Lisans Yönetimi ve Bakım Planlama Yazılımı\n\n🛠 Kullanılan Teknolojiler:\nPython · PyQt5 · SQLite · SQLAlchemy · Visual Studio · Windows Forms · ReportLab · openpyxl · PDF/Excel Entegrasyonu\n\n📦 Projenin Kapsamı ve Amaçları:\nStoklen, Aksa Runflat üretim tesisinde cihaz, araç, lisans ve bakım süreçlerinin tek platformda toplanmasını sağlamak amacıyla geliştirilen bir masaüstü uygulamasıdır. Kurumun ihtiyaçlarına özel olarak sıfırdan kodlanan bu sistem, mevcut manuel takip yöntemlerini ortadan kaldırarak dijitalleşme sürecine öncülük etmiştir.\n\nUygulamanın Ana Modülleri:\n• Cihaz Yönetimi: Cihaz tipi, donanım özellikleri (RAM, işlemci, disk vb.), kullanım geçmişi takibi\n• Araç Yönetimi: Araç bilgileri, kilometre takibi, kullanım ve bakım geçmişi\n• Lisans Yönetimi: Lisansın alınma tarihi, versiyonu, firması, geçerlilik süresi\n• Bakım Yönetimi: Cihaz ve araçlar için otomatik bakım zamanlaması ve bildirim sistemi\n• Raporlama: Anlık veri filtreleme, tablo görünümü, PDF ve Excel\'e aktarma seçenekleri\n• Bildirim ve Log Sistemi: Kullanıcı değişiklik kayıtları ve son 1 aya ait sistem hareketleri\n\n🚀 Kazanımlar ve Başarılar:\n• 200+ cihaz ve 50+ araç için %100 dijital yönetim\n• Bakım gecikmeleri %90 oranında azaldı, lisans takip süreçleri otomatize edildi\n• Kullanıcı dostu arayüz sayesinde teknik olmayan personel bile aktif kullanım sağlayabildi\n• Manuel Excel takip tabloları tamamen terk edilerek kurumsal veri disiplini sağlandı\n• ERP entegrasyonu için uyumlu veri formatı desteği hazırlandı\n\n📈 Etki ve Sonuçlar:\n• Departmanlar arası veri akışı hızlandı\n• Tüm fiziksel varlıkların durumu, geçmişi ve bakımı anlık kontrol altına alındı\n• Yönetici ve bakım ekipleri için karar verme süreçleri hızlandı\n• Geliştirilmeye açık modüler yapı sayesinde ihtiyaçlara göre sürekli güncellenebilirlik sağlandı',
    'portfolio.featured.project2.title': 'Ekşiler Studio Oyun Projesi',
    'portfolio.featured.project2.description': 'Unity ve C# kullanarak geliştirdiğim, 3D modelleme ve interaktif medya özellikleri içeren bir oyun projesi. Steam platformunda yayınlandı.',
    'portfolio.featured.project3.title': 'All R Studio Web Portalı',
    'portfolio.featured.project3.description': 'Modern ve kullanıcı dostu bir web portalı geliştirdim. React ve Node.js kullanılarak geliştirilen portal, şirketin müşteri yönetimini ve proje takibini kolaylaştırdı.',
    'portfolio.featured.project4.title': 'Mobil E-Ticaret Uygulaması',
    'portfolio.featured.project4.description': 'React Native ile geliştirdiğim, iOS ve Android platformları için cross-platform bir e-ticaret uygulaması. Uygulama, kullanıcı deneyimi ve performans odaklı tasarlandı.',
    'portfolio.completed.title': 'Tamamlanan Projeler',
    'portfolio.completed.description': 'Başarıyla tamamladığım öne çıkan projelerim.',
    'portfolio.completed.project1.title': ' Stoklen',
    'portfolio.completed.project1.description': 'Kurumsal Stok Takibi, Lisans Yönetimi ve Bakım Planlama Yazılımı\n\n🛠 Kullanılan Teknolojiler:\nPython · PyQt5 · SQLite · SQLAlchemy · Visual Studio · Windows Forms · ReportLab · openpyxl · PDF/Excel Entegrasyonu\n\n📦 Projenin Kapsamı ve Amaçları:\nStoklen, Aksa Runflat üretim tesisinde cihaz, araç, lisans ve bakım süreçlerinin tek platformda toplanmasını sağlamak amacıyla geliştirilen bir masaüstü uygulamasıdır. Kurumun ihtiyaçlarına özel olarak sıfırdan kodlanan bu sistem, mevcut manuel takip yöntemlerini ortadan kaldırarak dijitalleşme sürecine öncülük etmiştir.\n\nUygulamanın Ana Modülleri:\n• Cihaz Yönetimi: Cihaz tipi, donanım özellikleri (RAM, işlemci, disk vb.), kullanım geçmişi takibi\n• Araç Yönetimi: Araç bilgileri, kilometre takibi, kullanım ve bakım geçmişi\n• Lisans Yönetimi: Lisansın alınma tarihi, versiyonu, firması, geçerlilik süresi\n• Bakım Yönetimi: Cihaz ve araçlar için otomatik bakım zamanlaması ve bildirim sistemi\n• Raporlama: Anlık veri filtreleme, tablo görünümü, PDF ve Excel\'e aktarma seçenekleri\n• Bildirim ve Log Sistemi: Kullanıcı değişiklik kayıtları ve son 1 aya ait sistem hareketleri\n\n🚀 Kazanımlar ve Başarılar:\n• 200+ cihaz ve 50+ araç için %100 dijital yönetim\n• Bakım gecikmeleri %90 oranında azaldı, lisans takip süreçleri otomatize edildi\n• Kullanıcı dostu arayüz sayesinde teknik olmayan personel bile aktif kullanım sağlayabildi\n• Manuel Excel takip tabloları tamamen terk edilerek kurumsal veri disiplini sağlandı\n• ERP entegrasyonu için uyumlu veri formatı desteği hazırlandı\n\n📈 Etki ve Sonuçlar:\n• Departmanlar arası veri akışı hızlandı\n• Tüm fiziksel varlıkların durumu, geçmişi ve bakımı anlık kontrol altına alındı\n• Yönetici ve bakım ekipleri için karar verme süreçleri hızlandı\n• Geliştirilmeye açık modüler yapı sayesinde ihtiyaçlara göre sürekli güncellenebilirlik sağlandı',
    'portfolio.completed.project2.title': 'Oyun Projesi',
    'portfolio.completed.project2.description': 'Unity ve C# ile Geliştirilen 3D Oyun Projesi\n\n🛠 Kullanılan Teknolojiler:\nUnity · C# · Blender · Adobe Photoshop · Git\n\n📦 Projenin Kapsamı ve Amaçları:\nEkşiler Studio çatısı altında geliştirilen, 3D modelleme ve interaktif medya özellikleri içeren bir oyun projesi. Steam platformunda yayınlanan proje, kullanıcıların ilgisini çeken özgün bir oyun deneyimi sunuyor.\n\nProjenin Ana Özellikleri:\n• 3D Karakter ve Çevre Tasarımı\n• Fizik Tabanlı Oyun Mekanikleri\n• Çoklu Oyuncu Desteği\n• Başarım Sistemi\n• Steam Entegrasyonu\n\n🚀 Kazanımlar ve Başarılar:\n• Steam platformunda başarılı lansman\n• Olumlu kullanıcı yorumları\n• Aktif oyuncu topluluğu\n• Düzenli güncelleme ve destek\n\n📈 Etki ve Sonuçlar:\n• Oyun geliştirme süreçlerinde deneyim kazanımı\n• 3D modelleme ve animasyon becerilerinin gelişimi\n• Topluluk yönetimi ve kullanıcı geri bildirimi deneyimi',
    'portfolio.completed.project3.title': 'Web Portalı',
    'portfolio.completed.project3.description': 'Modern Kurumsal Web Portalı\n\n🛠 Kullanılan Teknolojiler:\nReact · Node.js · TypeScript · MongoDB · AWS\n\n📦 Projenin Kapsamı ve Amaçları:\nAll R Studio için geliştirilen, modern ve kullanıcı dostu bir web portalı. Şirketin müşteri yönetimini ve proje takibini kolaylaştıran, tam entegre bir çözüm sunuyor.\n\nPortalın Ana Özellikleri:\n• Müşteri Yönetim Sistemi\n• Proje Takip Paneli\n• Dosya Yönetimi\n• Raporlama Araçları\n• Kullanıcı Yetkilendirme\n\n🚀 Kazanımlar ve Başarılar:\n• %60 daha hızlı proje takibi\n• Müşteri memnuniyetinde artış\n• Verimli kaynak yönetimi\n• Güvenli veri depolama\n\n📈 Etki ve Sonuçlar:\n• İş süreçlerinin dijitalleşmesi\n• Operasyonel verimlilikte artış\n• Müşteri iletişiminde iyileşme'
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.portfolio': 'Services',
    'nav.contact': 'Contact',
    'home.title': 'Batuhan Erdener Ekşi',
    'home.subtitle': 'IT Solutions',
    'home.description': 'Custom, flexible, and scalable solutions for your business. Every business has different needs. That\'s why instead of settling for ready-made packages, I offer custom software solutions. From web-based applications to mobile systems, from desktop programs to ERP integrations, I develop solutions that speed up and facilitate your business processes in different areas.',
    'about.title': 'About Me',
    'about.description': 'I am Batuhan Erdener Ekşi. I graduated from Başkent University with a degree in Computer Programming and completed my Business degree at Anadolu University. I am a software developer aiming to bring people together with technology. I have been developing web and mobile-based projects as a freelancer for a long time, offering digital solutions to individuals and businesses.\n\nI am currently working as an IT Specialist at Aksa Runflat. In this role, I handle the installation, configuration, and integration of ERP systems into company workflows; I also take part in critical IT processes such as server management, network security, and user support. Thanks to my expertise in ERP processes, I provide effective solutions for digitizing and automating business processes.\n\nUnder Ekşiler Studio, which I founded, I am involved in game software, 3D modeling, and interactive media projects; I combine both creative and technical skills to design user-focused digital experiences. My experience in game development and visualization brings a different perspective to projects.\n\nPreviously, I worked as a frontend developer at All R Studio. I developed web interfaces to ensure projects were implemented in a user-friendly, fast, and aesthetic manner.\n\nI don\'t just produce software, I also operate with a multifaceted perspective in user experience, design, and business development. By combining my technical knowledge with my business vision, I transform each project into a structure that serves both operational and strategic goals.\n\nTo date, I have developed software, corporate websites, games, systems, and automation solutions for many sectors. If you want to establish a strong presence in the digital world, modernize your business processes, or develop a special project, you\'re in the right place.',
    'about.whoAmI': 'Who Am I?',
    'about.continuousLearning': 'I focus on continuous learning and self-improvement. I follow new technologies and strive to use the most up-to-date solutions in my projects.',
    'about.skills': 'My Skills',
    'portfolio.title': 'My Services',
    'portfolio.description': 'Professional services I offer.',
    'portfolio.project1.title': 'Web Development',
    'portfolio.project1.description': '🌐 Modern and User-Friendly Web Solutions\n\n• Responsive Web Design\n• E-commerce Platforms\n• Corporate Websites\n• Web Applications\n• API Integrations\n\n🛠 Technologies Used:\nReact · Node.js · TypeScript · Next.js · Tailwind CSS',
    'portfolio.project2.title': 'Mobile App Development',
    'portfolio.project2.description': '📱 Cross-Platform Mobile Solutions\n\n• iOS and Android Applications\n• E-commerce Mobile Apps\n• Corporate Mobile Apps\n• Game Applications\n• IoT Integrations\n\n🛠 Technologies Used:\nReact Native · Flutter · Firebase · Redux',
    'portfolio.project3.title': 'ERP & Business Automation',
    'portfolio.project3.description': '⚙️ Corporate Automation Solutions\n\n• ERP System Integrations\n• Inventory Management\n• Production Planning Systems\n• HR Automation\n• Reporting Systems\n\n🛠 Technologies Used:\nPython · SQL · .NET · Java',
    'portfolio.project4.title': 'Digital Transformation',
    'portfolio.project4.description': '🚀 Comprehensive Digital Transformation\n\n• Business Process Optimization\n• Data Analysis and Reporting\n• Cloud Solutions\n• Cybersecurity\n• AI Integrations\n\n🛠 Technologies Used:\nAWS · Azure · Python · TensorFlow',
    'contact.title': 'Contact',
    'contact.description': 'Get in touch with me.',
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.message': 'Message',
    'contact.form.submit': 'Send',
    'contact.info.email': 'Email: erdener.eksi@gmail.com',
    'contact.info.phone': 'Phone: +90 --- --- -- --',
    'contact.info.address': 'Address: Ankara, Turkey',
    'home.section1.title': 'Software Development',
    'home.section1.description': 'Custom, flexible, and scalable solutions for your business. Every business has different needs. That\'s why instead of settling for ready-made packages, I offer custom software solutions. From web-based applications to mobile systems, from desktop programs to ERP integrations, I develop solutions that speed up and facilitate your business processes in different areas.',
    'home.section2.title': 'What Do I Offer?',
    'home.section2.description': '• Custom software development for your needs\n• Automation systems for inventory, order, and process tracking\n• Mobile applications (Android & iOS)\n• Web-based management panels\n• Enterprise software solutions and digital transformation support\n• User-friendly interfaces, powerful data management',
    'home.section3.title': 'Why Me?',
    'home.section3.description': 'Because you can\'t leave your business to chance.\n\nI don\'t come to you with time-wasting ready-made package solutions, but with software specifically developed for your needs. I offer digital solutions that will take you beyond the ordinary.\n\nWhen working with agencies, tasks are divided, communication breaks down, and quality disperses.\nWhen working with me, you deal directly with the developer, the person who actually does the work. I plan, develop, and implement every step together with you.\n\nI don\'t just offer software; I provide strategy, design, business understanding, and user experience together. I developed my technical foundation at Başkent University and my business vision at Anadolu University. Today, by combining both, you work with someone who not only codes your projects but truly understands them.\n\nI have produced solutions in dozens of different sectors to date. From ERP systems to mobile applications, from corporate websites to custom automations, I have delivered reliable and sustainable work in different fields.\n\nTime is money.\nIf you want to take solid steps with the right person from the start, you\'re in the right place now.\n\nLet\'s talk about your needs.',
    'home.explore': 'Explore Our Services',
    'contact.name': 'Your Name',
    'contact.subject': 'Subject',
    'contact.sending': 'Sending...',
    'contact.success': 'Your message has been sent successfully!',
    'contact.error': 'An error occurred. Please try again.',
    'contact.location': 'Location',
    'contact.invalidEmail': 'You have entered an invalid or unused email address.',
    'portfolio.featured.title': 'Featured Projects',
    'portfolio.featured.description': 'Some of my recent significant projects.',
    'portfolio.featured.project1.title': 'Stoklen',
    'portfolio.featured.project1.description': 'Corporate Inventory Tracking, License Management and Maintenance Planning Software\n\n🛠 Technologies Used:\nPython · PyQt5 · SQLite · SQLAlchemy · Visual Studio · Windows Forms · ReportLab · openpyxl · PDF/Excel Integration\n\n📦 Project Scope and Objectives:\nStoklen is a desktop application developed to consolidate device, vehicle, license, and maintenance processes at Aksa Runflat production facility on a single platform. This system, custom-coded from scratch according to the company\'s needs, has led the digitalization process by eliminating existing manual tracking methods.\n\nMain Modules of the Application:\n• Device Management: Device type, hardware specifications (RAM, processor, disk, etc.), usage history tracking\n• Vehicle Management: Vehicle information, mileage tracking, usage and maintenance history\n• License Management: License acquisition date, version, company, validity period\n• Maintenance Management: Automatic maintenance scheduling and notification system for devices and vehicles\n• Reporting: Real-time data filtering, table view, PDF and Excel export options\n• Notification and Log System: User change records and system activities for the last month\n\n🚀 Achievements and Successes:\n• 100% digital management for 200+ devices and 50+ vehicles\n• Maintenance delays reduced by 90%, license tracking processes automated\n• User-friendly interface enabled active usage even by non-technical staff\n• Corporate data discipline achieved by completely abandoning manual Excel tracking tables\n• Compatible data format support prepared for ERP integration\n\n📈 Impact and Results:\n• Inter-departmental data flow accelerated\n• Status, history, and maintenance of all physical assets brought under instant control\n• Decision-making processes accelerated for managers and maintenance teams\n• Continuous updateability according to needs achieved through an open modular structure',
    'portfolio.featured.project2.title': 'Ekşiler Studio Game Project',
    'portfolio.featured.project2.description': 'Developed a game project using Unity and C#, featuring 3D modeling and interactive media elements. Published on the Steam platform.',
    'portfolio.featured.project3.title': 'All R Studio Web Portal',
    'portfolio.featured.project3.description': 'Developed a modern and user-friendly web portal. Built with React and Node.js, the portal streamlined the company\'s customer management and project tracking.',
    'portfolio.featured.project4.title': 'Mobile E-Commerce Application',
    'portfolio.featured.project4.description': 'A cross-platform e-commerce application for iOS and Android platforms, developed with React Native. The app was designed with a focus on user experience and performance.',
    'portfolio.completed.title': 'Completed Projects',
    'portfolio.completed.description': 'My featured successfully completed projects.',
    'portfolio.completed.project1.title': 'Stoklen',
    'portfolio.completed.project1.description': 'Corporate Inventory Tracking, License Management and Maintenance Planning Software\n\n🛠 Technologies Used:\nPython · PyQt5 · SQLite · SQLAlchemy · Visual Studio · Windows Forms · ReportLab · openpyxl · PDF/Excel Integration\n\n📦 Project Scope and Objectives:\nStoklen is a desktop application developed to consolidate device, vehicle, license, and maintenance processes at Aksa Runflat production facility on a single platform. This system, custom-coded from scratch according to the company\'s needs, has led the digitalization process by eliminating existing manual tracking methods.\n\nMain Modules of the Application:\n• Device Management: Device type, hardware specifications (RAM, processor, disk, etc.), usage history tracking\n• Vehicle Management: Vehicle information, mileage tracking, usage and maintenance history\n• License Management: License acquisition date, version, company, validity period\n• Maintenance Management: Automatic maintenance scheduling and notification system for devices and vehicles\n• Reporting: Real-time data filtering, table view, PDF and Excel export options\n• Notification and Log System: User change records and system activities for the last month\n\n🚀 Achievements and Successes:\n• 100% digital management for 200+ devices and 50+ vehicles\n• Maintenance delays reduced by 90%, license tracking processes automated\n• User-friendly interface enabled active usage even by non-technical staff\n• Corporate data discipline achieved by completely abandoning manual Excel tracking tables\n• Compatible data format support prepared for ERP integration\n\n📈 Impact and Results:\n• Inter-departmental data flow accelerated\n• Status, history, and maintenance of all physical assets brought under instant control\n• Decision-making processes accelerated for managers and maintenance teams\n• Continuous updateability according to needs achieved through an open modular structure',
    'portfolio.completed.project2.title': 'Game Project',
    'portfolio.completed.project2.description': '3D Game Project Developed with Unity and C#\n\n🛠 Technologies Used:\nUnity · C# · Blender · Adobe Photoshop · Git\n\n📦 Project Scope and Objectives:\nA game project developed under Ekşiler Studio, featuring 3D modeling and interactive media elements. Published on the Steam platform, the project offers a unique gaming experience that captures users\' interest.\n\nMain Features of the Project:\n• 3D Character and Environment Design\n• Physics-Based Game Mechanics\n• Multiplayer Support\n• Achievement System\n• Steam Integration\n\n🚀 Achievements and Successes:\n• Successful launch on Steam platform\n• Positive user reviews\n• Active player community\n• Regular updates and support\n\n📈 Impact and Results:\n• Gained experience in game development processes\n• Development of 3D modeling and animation skills\n• Experience in community management and user feedback',
    'portfolio.completed.project3.title': 'Web Portal',
    'portfolio.completed.project3.description': 'Modern Corporate Web Portal\n\n🛠 Technologies Used:\nReact · Node.js · TypeScript · MongoDB · AWS\n\n📦 Project Scope and Objectives:\nA modern and user-friendly web portal developed for All R Studio. It offers a fully integrated solution that facilitates the company\'s customer management and project tracking.\n\nMain Features of the Portal:\n• Customer Management System\n• Project Tracking Panel\n• File Management\n• Reporting Tools\n• User Authorization\n\n🚀 Achievements and Successes:\n• 60% faster project tracking\n• Increased customer satisfaction\n• Efficient resource management\n• Secure data storage\n\n📈 Impact and Results:\n• Digitalization of business processes\n• Increased operational efficiency\n• Improved customer communication'
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
