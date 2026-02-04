import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { 
  Dog, 
  Heart, 
  Shield, 
  Award, 
  Phone, 
  MessageCircle, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  CheckCircle, 
  Clock, 
  Star,
  PawPrint,
  Home,
  Menu,
  X
} from 'lucide-react'

// SafeIcon Component
const iconMap = {
  dog: Dog,
  heart: Heart,
  shield: Shield,
  award: Award,
  phone: Phone,
  messageCircle: MessageCircle,
  mapPin: MapPin,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  send: Send,
  checkCircle: CheckCircle,
  clock: Clock,
  star: Star,
  pawPrint: PawPrint,
  home: Home,
  menu: Menu,
  x: X
}

const SafeIcon = ({ name, size = 24, className = '', color }) => {
  const IconComponent = iconMap[name]
  
  if (!IconComponent) {
    return <div className={className} style={{ width: size, height: size }}><Dog size={size} color={color} /></div>
  }
  
  return <IconComponent size={size} className={className} color={color} />
}

// Web3Forms Hook
const useFormHandler = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleSubmit = async (e, accessKey) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsError(false);
    
    const formData = new FormData(e.target);
    formData.append('access_key', accessKey);
    
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsSuccess(true);
        e.target.reset();
      } else {
        setIsError(true);
        setErrorMessage(data.message || 'Что-то пошло не так');
      }
    } catch (error) {
      setIsError(true);
      setErrorMessage('Ошибка сети. Пожалуйста, попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setIsSuccess(false);
    setIsError(false);
    setErrorMessage('');
  };
  
  return { isSubmitting, isSuccess, isError, errorMessage, handleSubmit, resetForm };
};

// Gallery Data
const galleryImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
    alt: 'Японский шпиц играет',
    title: 'Белоснежная красота'
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54d?w=800&q=80',
    alt: 'Щенок японского шпица',
    title: 'Ласковый характер'
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1601971935068-fc5d46f1c5c0?w=800&q=80',
    alt: 'Японский шпиц на прогулке',
    title: 'Идеальный компаньон'
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
    alt: 'Щенки японского шпица',
    title: 'Чистокровные щенки'
  }
]

// FAQ Data for Chat
const FAQ_DATA = [
  {
    question: 'Сколько стоит щенок?',
    answer: 'Цена щенка японского шпица варьируется от 40 000 до 80 000 рублей в зависимости от родословной, окраса и возраста. Свяжитесь с нами для уточнения актуальных цен.',
    keywords: ['цена', 'стоит', 'сколько', 'денег', 'рублей', 'дорого']
  },
  {
    question: 'Какие документы у щенков?',
    answer: 'Все наши щенки имеют полный пакет документов: метрику щенка, ветеринарный паспорт с отметками о прививках, договор купли-продажи, и рекомендации по уходу.',
    keywords: ['документы', 'родословная', 'метрика', 'паспорт', 'прививки']
  },
  {
    question: 'Как забрать щенка?',
    answer: 'Вы можете забрать щенка лично из питомника или заказать доставку. Мы работаем с проверенными зоотакси по всей России. Также возможен самовывоз в Москве и области.',
    keywords: ['забрать', 'доставка', 'привезти', 'как купить', 'самовывоз']
  },
  {
    question: 'Возраст щенков?',
    answer: 'Щенки отдаются новым владельцам в возрасте 2-3 месяцев, когда они полностью готовы к переезду: привиты, приучены к пеленке, социализированы.',
    keywords: ['возраст', 'сколько месяцев', 'малыши', 'взрослые']
  }
]

const SITE_CONTEXT = 'Питомник японских шпицев. Продажа чистокровных щенков с документами. Услуги: консультация по выбору щенка, доставка по России, ветеринарная поддержка.'

function App() {
  const [currentImage, setCurrentImage] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessage, setChatMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([
    { type: 'bot', text: 'Здравствуйте! Я помогу вам с вопросами о щенках японского шпица. Задайте ваш вопрос!' }
  ])
  const [isTyping, setIsTyping] = useState(false)
  
  const formRef = useRef(null)
  const galleryRef = useRef(null)
  const isGalleryInView = useInView(galleryRef, { once: true })
  
  const { isSubmitting, isSuccess, isError, errorMessage, handleSubmit, resetForm } = useFormHandler()
  const ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY' // Replace with your Web3Forms Access Key from https://web3forms.com
  
  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % galleryImages.length)
  }
  
  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }
  
  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileMenuOpen(false)
  }
  
  const handleChatSubmit = async (e) => {
    e.preventDefault()
    if (!chatMessage.trim()) return
    
    const userMessage = chatMessage.trim()
    setChatHistory(prev => [...prev, { type: 'user', text: userMessage }])
    setChatMessage('')
    setIsTyping(true)
    
    // Check FAQ
    const lowerMessage = userMessage.toLowerCase()
    const faqMatch = FAQ_DATA.find(faq => 
      faq.keywords.some(keyword => lowerMessage.includes(keyword))
    )
    
    setTimeout(() => {
      if (faqMatch) {
        setChatHistory(prev => [...prev, { type: 'bot', text: faqMatch.answer }])
      } else {
        // Fallback to API
        setChatHistory(prev => [...prev, { type: 'bot', text: 'Извините, я не нашел точного ответа. Пожалуйста, позвоните нам или напишите в WhatsApp для подробной консультации!' }])
      }
      setIsTyping(false)
    }, 1000)
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-sky-50 overflow-x-hidden">
      {/* Navigation */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-rose-100 shadow-sm">
        <nav className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-2">
            <div className="bg-rose-500 p-2 rounded-full">
              <SafeIcon name="dog" size={24} color="white" />
            </div>
            <span className="text-xl md:text-2xl font-bold text-gray-800">Shiro Puppies</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('about')} className="text-gray-600 hover:text-rose-500 transition-colors font-medium">О породе</button>
            <button onClick={() => scrollToSection('puppies')} className="text-gray-600 hover:text-rose-500 transition-colors font-medium">Щенки</button>
            <button onClick={() => scrollToSection('reviews')} className="text-gray-600 hover:text-rose-500 transition-colors font-medium">Отзывы</button>
            <button onClick={() => scrollToSection('contacts')} className="text-gray-600 hover:text-rose-500 transition-colors font-medium">Контакты</button>
          </div>
          
          <button onClick={() => scrollToSection('contacts')} className="hidden md:block bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg shadow-rose-500/30">
            Забронировать
          </button>
          
          <button 
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <SafeIcon name={mobileMenuOpen ? "x" : "menu"} size={24} />
          </button>
        </nav>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-rose-100 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-3">
                <button onClick={() => scrollToSection('about')} className="block w-full text-left py-2 text-gray-600 hover:text-rose-500">О породе</button>
                <button onClick={() => scrollToSection('puppies')} className="block w-full text-left py-2 text-gray-600 hover:text-rose-500">Щенки</button>
                <button onClick={() => scrollToSection('reviews')} className="block w-full text-left py-2 text-gray-600 hover:text-rose-500">Отзывы</button>
                <button onClick={() => scrollToSection('contacts')} className="block w-full text-left py-2 text-gray-600 hover:text-rose-500">Контакты</button>
                <button onClick={() => scrollToSection('contacts')} className="w-full bg-rose-500 text-white py-3 rounded-full font-semibold mt-4">Забронировать щенка</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-100/40 via-transparent to-sky-100/40"></div>
          <div className="absolute top-20 left-10 w-64 h-64 bg-rose-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-sky-200/30 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-rose-200 mb-6 shadow-sm">
                <SafeIcon name="award" size={18} color="#f43f5e" />
                <span className="text-rose-600 font-semibold text-sm">Проверенный питомник</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black text-gray-800 mb-4 md:mb-6 leading-tight tracking-tight">
                Японский <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">Шпиц</span>
              </h1>
              
              <p className="text-lg md:text-2xl text-gray-600 mb-6 md:mb-8 leading-relaxed font-medium">
                Белоснежные комочки счастья ждут своих хозяев
              </p>
              
              <p className="text-base md:text-lg text-gray-500 mb-8 leading-relaxed">
                Чистокровные щенки с родословной от чемпионов. Полный пакет документов, прививки, консультация по уходу.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <button 
                  onClick={() => scrollToSection('puppies')}
                  className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-bold transition-all transform hover:scale-105 shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 min-h-[48px]"
                >
                  Выбрать щенка
                  <ChevronRight className="w-5 h-5" />
                </button>
                
                <a 
                  href="https://wa.me/79999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-bold transition-all transform hover:scale-105 shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 min-h-[48px]"
                >
                  <SafeIcon name="messageCircle" size={20} />
                  Написать в WhatsApp
                </a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative mt-8 md:mt-0"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-rose-200/50 border-4 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80" 
                  alt="Японский шпиц" 
                  className="w-full h-[400px] md:h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rose-900/30 to-transparent"></div>
              </div>
              
              <motion.div 
                className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-white rounded-2xl p-3 md:p-4 shadow-xl border border-rose-100"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="bg-rose-100 p-2 rounded-full">
                    <SafeIcon name="heart" size={20} color="#f43f5e" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">В продаже</p>
                    <p className="text-sm md:text-base font-bold text-rose-600">2 щенка</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute -top-4 -right-4 md:-top-6 md:-right-6 bg-white rounded-2xl p-3 md:p-4 shadow-xl border border-rose-100"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <SafeIcon name="award" size={20} color="#f59e0b" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Опыт</p>
                    <p className="text-sm md:text-base font-bold text-amber-600">10+ лет</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Breed Section */}
      <section id="about" className="py-16 md:py-24 px-4 md:px-6 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-rose-50/50 to-transparent"></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black text-gray-800 mb-4 md:mb-6">
              О породе <span className="text-rose-500">Японский Шпиц</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Идеальная порода для семьи - милые, пушистые и невероятно преданные
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-rose-50 to-white p-6 md:p-8 rounded-3xl border border-rose-100 hover:border-rose-300 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="bg-rose-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <SafeIcon name="heart" size={28} color="#f43f5e" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">Ласковый характер</h3>
              <p className="text-gray-600 leading-relaxed">
                Японский шпиц - невероятно ласковая и преданная порода. Они обожают детей, ладят с другими животными и всегда рады провести время с семьей.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-sky-50 to-white p-6 md:p-8 rounded-3xl border border-sky-100 hover:border-sky-300 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="bg-sky-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <SafeIcon name="shield" size={28} color="#0ea5e9" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">Простой уход</h3>
              <p className="text-gray-600 leading-relaxed">
                Несмотря на пушистую шерсть, уход за шпицем довольно прост. Они чистоплотны, не имеют специфического запаха, а их белоснежная шерсть легко поддерживается.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-amber-50 to-white p-6 md:p-8 rounded-3xl border border-amber-100 hover:border-amber-300 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="bg-amber-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <SafeIcon name="award" size={28} color="#f59e0b" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">Здоровье и гарантии</h3>
              <p className="text-gray-600 leading-relaxed">
                Все щенки проходят полное ветеринарное обследование, имеют прививки и международный ветпаспорт. Мы даем гарантию на здоровье и помогаем с адаптацией.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Puppies Gallery Section */}
      <section id="puppies" ref={galleryRef} className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-b from-white to-rose-50/30">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black text-gray-800 mb-4 md:mb-6">
              Наши <span className="text-rose-500">щенки</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Белоснежные малыши от чемпионов породы ждут своих любящих хозяев
            </p>
          </motion.div>

          {/* Gallery Slider */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isGalleryInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
              <div className="aspect-[4/3] md:aspect-[16/10] relative">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImage}
                    src={galleryImages[currentImage].src}
                    alt={galleryImages[currentImage].alt}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 text-white">
                  <h3 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">{galleryImages[currentImage].title}</h3>
                  <p className="text-sm md:text-base opacity-90">Японский шпиц</p>
                </div>
              </div>
              
              {/* Navigation Buttons */}
              <button 
                onClick={prevImage}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-lg"
              >
                <SafeIcon name="chevronLeft" size={24} />
              </button>
              
              <button 
                onClick={nextImage}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-lg"
              >
                <SafeIcon name="chevronRight" size={24} />
              </button>
            </div>
            
            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-4 md:mt-6">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${currentImage === index ? 'bg-rose-500 w-6 md:w-8' : 'bg-gray-300 hover:bg-gray-400'}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="py-12 md:py-16 px-4 md:px-6 bg-gradient-to-r from-rose-500 to-pink-500 text-white">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 md:p-4 rounded-full">
                <SafeIcon name="clock" size={32} color="white" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold">Осталось всего 2 щенка!</h3>
                <p className="text-rose-100 text-sm md:text-base">Из помета от 15 января 2024</p>
              </div>
            </div>
            
            <button 
              onClick={() => scrollToSection('contacts')}
              className="bg-white text-rose-500 hover:bg-rose-50 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg w-full md:w-auto text-center"
            >
              Забронировать щенка
            </button>
          </div>
        </div>
      </section>

      {/* Features/Why Choose Us */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black text-gray-800 mb-4">
              Почему выбирают <span className="text-rose-500">нас</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Мы заботимся о каждом щенке и предоставляем полную поддержку новым владельцам
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-rose-50 to-white p-6 rounded-2xl border border-rose-100 hover:border-rose-300 transition-all transform hover:scale-105 hover:shadow-xl group"
            >
              <div className="bg-rose-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-rose-200 transition-colors">
                <SafeIcon name="shield" size={28} color="#f43f5e" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Полный пакет документов</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Родословная, ветпаспорт, договор, чипирование
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-sky-50 to-white p-6 rounded-2xl border border-sky-100 hover:border-sky-300 transition-all transform hover:scale-105 hover:shadow-xl group"
            >
              <div className="bg-sky-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-sky-200 transition-colors">
                <SafeIcon name="heart" size={28} color="#0ea5e9" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Здоровье гарантировано</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Все прививки, обработка от паразитов, ветеринарная поддержка
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-2xl border border-amber-100 hover:border-amber-300 transition-all transform hover:scale-105 hover:shadow-xl group"
            >
              <div className="bg-amber-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
                <SafeIcon name="award" size={28} color="#f59e0b" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Чистокровность</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Родители - чемпионы выставок, документы РКФ/FCI
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-2xl border border-emerald-100 hover:border-emerald-300 transition-all transform hover:scale-105 hover:shadow-xl group"
            >
              <div className="bg-emerald-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                <SafeIcon name="pawPrint" size={28} color="#10b981" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Поддержка 24/7</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Консультации по уходу, кормлению, воспитанию щенка
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-b from-rose-50 to-white">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black text-gray-800 mb-4">
              Отзывы <span className="text-rose-500">владельцев</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              Истории наших клиентов, которые уже обрели друга
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                name: 'Анна М.',
                text: 'Наш Малыш - просто чудо! Спасибо за помощь в выборе и поддержку. Теперь у нас в доме настоящий компаньон!',
                rating: 5,
                dog: 'Малыш, 8 месяцев'
              },
              {
                name: 'Сергей К.',
                text: 'Профессиональный питомник! Все документы, щенок здоров, адаптировался быстро. Рекомендую всем!',
                rating: 5,
                dog: 'Белла, 1 год'
              },
              {
                name: 'Марина П.',
                text: 'Наша Луна - гордость семьи! Умная, послушная, очень красивая. Спасибо за чудесного щенка!',
                rating: 5,
                dog: 'Луна, 6 месяцев'
              }
            ].map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-rose-100 hover:shadow-xl transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <SafeIcon key={i} name="star" size={20} color="#fbbf24" className="fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed text-sm md:text-base">"{review.text}"</p>
                <div className="border-t border-gray-100 pt-4">
                  <p className="font-bold text-gray-800">{review.name}</p>
                  <p className="text-rose-500 text-sm">{review.dog}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacts" className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-b from-white to-rose-50">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black text-gray-800 mb-4">
              Свяжитесь с <span className="text-rose-500">нами</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Забронируйте щенка прямо сейчас или задайте вопрос - мы всегда рады помочь!
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-rose-100"
            >
              <div className="relative">
                <AnimatePresence mode="wait">
                  {!isSuccess ? (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={(e) => handleSubmit(e, ACCESS_KEY)}
                      className="space-y-4 md:space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Ваше имя</label>
                        <input
                          type="text"
                          name="name"
                          placeholder="Как к вам обращаться?"
                          required
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Телефон</label>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="+7 (999) 999-99-99"
                          required
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Сообщение</label>
                        <textarea
                          name="message"
                          placeholder="Какой щенок вас интересует? Или задайте вопрос..."
                          rows="4"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all resize-none"
                        ></textarea>
                      </div>
                      
                      {isError && (
                        <div className="text-rose-500 text-sm bg-rose-50 p-3 rounded-lg">
                          {errorMessage}
                        </div>
                      )}
                      
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-[1.02] disabled:transform-none shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Отправка...
                          </>
                        ) : (
                          <>
                            <SafeIcon name="send" size={20} />
                            Отправить заявку
                          </>
                        )}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, type: "spring" }}
                      className="text-center py-12"
                    >
                      <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <SafeIcon name="checkCircle" size={40} color="#22c55e" />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                        Заявка отправлена!
                      </h3>
                      <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        Спасибо за обращение! Мы свяжемся с вами в ближайшее время для уточнения деталей.
                      </p>
                      <button
                        onClick={resetForm}
                        className="text-rose-500 hover:text-rose-600 font-semibold transition-colors"
                      >
                        Отправить еще одну заявку
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-rose-100">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Контакты</h3>
                
                <div className="space-y-4">
                  <a href="tel:+79999999999" className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-rose-50 transition-colors group">
                    <div className="bg-rose-100 p-3 rounded-full group-hover:bg-rose-200 transition-colors">
                      <SafeIcon name="phone" size={24} color="#f43f5e" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Телефон</p>
                      <p className="text-lg font-bold text-gray-800">+7 (999) 999-99-99</p>
                    </div>
                  </a>
                  
                  <a href="https://wa.me/79999999999" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors group">
                    <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors">
                      <SafeIcon name="messageCircle" size={24} color="#22c55e" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">WhatsApp</p>
                      <p className="text-lg font-bold text-gray-800">Написать сообщение</p>
                    </div>
                  </a>
                  
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                    <div className="bg-sky-100 p-3 rounded-full">
                      <SafeIcon name="mapPin" size={24} color="#0ea5e9" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Локация</p>
                      <p className="text-lg font-bold text-gray-800">Москва и область</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="bg-gradient-to-br from-amber-50 to-white p-6 md:p-8 rounded-3xl shadow-lg border border-amber-100">
                <div className="flex items-center gap-3 mb-4">
                  <SafeIcon name="shield" size={24} color="#f59e0b" />
                  <h3 className="text-lg md:text-xl font-bold text-gray-800">Документы и гарантии</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <SafeIcon name="checkCircle" size={20} color="#22c55e" className="mt-0.5 shrink-0" />
                    <span className="text-gray-700 text-sm md:text-base">Метрика щенка и родословная РКФ/FCI</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <SafeIcon name="checkCircle" size={20} color="#22c55e" className="mt-0.5 shrink-0" />
                    <span className="text-gray-700 text-sm md:text-base">Ветеринарный паспорт с прививками</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <SafeIcon name="checkCircle" size={20} color="#22c55e" className="mt-0.5 shrink-0" />
                    <span className="text-gray-700 text-sm md:text-base">Договор купли-продажи</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <SafeIcon name="checkCircle" size={20} color="#22c55e" className="mt-0.5 shrink-0" />
                    <span className="text-gray-700 text-sm md:text-base">Гарантия здоровья 1 год</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 md:py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-rose-500 p-2 rounded-full">
                  <SafeIcon name="dog" size={24} color="white" />
                </div>
                <span className="text-2xl font-bold">Shiro Puppies</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Профессиональный питомник японских шпицев. Мы предлагаем здоровых, социализированных щенков с отличной родословной. Любовь и забота о каждом малыше!
              </p>
              <div className="flex gap-4">
                <a href="#" className="bg-gray-800 hover:bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-lg">VK</span>
                </a>
                <a href="#" className="bg-gray-800 hover:bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-lg">TG</span>
                </a>
                <a href="#" className="bg-gray-800 hover:bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-lg">IG</span>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Разделы</h3>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection('about')} className="text-gray-400 hover:text-white transition-colors">О породе</button></li>
                <li><button onClick={() => scrollToSection('puppies')} className="text-gray-400 hover:text-white transition-colors">Наши щенки</button></li>
                <li><button onClick={() => scrollToSection('reviews')} className="text-gray-400 hover:text-white transition-colors">Отзывы</button></li>
                <li><button onClick={() => scrollToSection('contacts')} className="text-gray-400 hover:text-white transition-colors">Контакты</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Контакты</h3>
              <ul className="space-y-4">
                <li>
                  <a href="tel:+79999999999" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                    <SafeIcon name="phone" size={20} />
                    <span>+7 (999) 999-99-99</span>
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/79999999999" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                    <SafeIcon name="messageCircle" size={20} />
                    <span>WhatsApp</span>
                  </a>
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <SafeIcon name="mapPin" size={20} />
                  <span>Москва, Россия</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2024 Shiro Puppies. Все права защищены.</p>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50">
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-16 right-0 w-[calc(100vw-32px)] md:w-96 bg-white rounded-2xl shadow-2xl border border-rose-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <SafeIcon name="dog" size={20} color="white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Помощник</h3>
                    <p className="text-rose-100 text-xs">Обычно отвечает за 5 минут</p>
                  </div>
                </div>
                <button 
                  onClick={() => setChatOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <SafeIcon name="x" size={24} />
                </button>
              </div>
              
              <div className="h-64 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.type === 'user' 
                        ? 'bg-rose-500 text-white rounded-br-none' 
                        : 'bg-white text-gray-700 shadow-sm rounded-bl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <form onSubmit={handleChatSubmit} className="p-4 border-t border-gray-100 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Напишите вопрос..."
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-rose-500 transition-colors"
                  />
                  <button 
                    type="submit"
                    className="bg-rose-500 hover:bg-rose-600 text-white p-2 rounded-full transition-colors"
                  >
                    <SafeIcon name="send" size={20} />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button
          onClick={() => setChatOpen(!chatOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-rose-500 to-pink-500 text-white p-4 rounded-full shadow-lg shadow-rose-500/30 flex items-center gap-2 hover:shadow-xl transition-shadow"
        >
          <SafeIcon name="messageCircle" size={24} />
          <span className="font-semibold hidden md:inline">Задать вопрос</span>
        </motion.button>
      </div>

      {/* Floating Action Button - Mobile Only */}
      <div className="fixed bottom-4 left-4 md:hidden z-40">
        <a 
          href="https://wa.me/79999999999"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white p-3 rounded-full shadow-lg flex items-center gap-2"
        >
          <SafeIcon name="messageCircle" size={24} />
          <span className="font-semibold text-sm">WhatsApp</span>
        </a>
      </div>
    </div>
  )
}

export default App