import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const Mascot = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [isBlinking, setIsBlinking] = useState(false);
  const location = useLocation();

  // Random eye blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, Math.random() * 4000 + 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Contextual messages based on route
  useEffect(() => {
    let newMessage = '';
    
    switch (location.pathname) {
      case '/':
        newMessage = 'Olá! Sou o Leo, seu assistente. Vamos ver como estão os pacientes hoje?';
        break;
      case '/trail':
        newMessage = 'Roar! Vamos criar uma aventura incrível com inteligência artificial?';
        break;
      case '/reports':
        newMessage = 'Aqui você acompanha o progresso de todos. Muito importante!';
        break;
      default:
        if (location.pathname.includes('/patient')) {
          newMessage = 'O perfil de cada paciente nos ajuda a entender melhor suas necessidades!';
        } else if (location.pathname.includes('/session')) {
          newMessage = 'Hora de aprender brincando! Ganhe pontos e suba de nível!';
        } else {
          newMessage = 'Estou aqui para ajudar!';
        }
    }

    setMessage(newMessage);

    // Hide message after 5 seconds
    const hideTimeout = setTimeout(() => {
      setMessage(null);
    }, 5000);

    return () => clearTimeout(hideTimeout);
  }, [location.pathname]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-4 pointer-events-none">
      
      {/* Speech Bubble */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="bg-white px-5 py-4 rounded-2xl shadow-lg border-2 border-hospital-blue/20 max-w-[220px] pointer-events-auto cursor-pointer"
            onClick={() => setMessage(null)}
          >
            <p className="text-sm font-bold text-hospital-dark">{message}</p>
            {/* Speech bubble tail */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-b-2 border-r-2 border-hospital-blue/20 transform rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Mascot */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="relative w-28 h-28 pointer-events-auto cursor-pointer"
        onClick={() => {
          if (!message) {
            setMessage('Você clicou em mim! Roar! 🦁');
            setTimeout(() => setMessage(null), 3000);
          }
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
          {/* Mane (Juba) */}
          <circle cx="50" cy="50" r="45" fill="#f59e0b" />
          <circle cx="20" cy="30" r="18" fill="#d97706" />
          <circle cx="80" cy="30" r="18" fill="#d97706" />
          <circle cx="20" cy="70" r="18" fill="#d97706" />
          <circle cx="80" cy="70" r="18" fill="#d97706" />
          <circle cx="50" cy="15" r="20" fill="#f59e0b" />
          <circle cx="50" cy="85" r="20" fill="#f59e0b" />
          <circle cx="15" cy="50" r="20" fill="#f59e0b" />
          <circle cx="85" cy="50" r="20" fill="#f59e0b" />

          {/* Ears */}
          <circle cx="28" cy="32" r="12" fill="#fbbf24" />
          <circle cx="28" cy="32" r="6" fill="#fef3c7" />
          <circle cx="72" cy="32" r="12" fill="#fbbf24" />
          <circle cx="72" cy="32" r="6" fill="#fef3c7" />

          {/* Face */}
          <circle cx="50" cy="55" r="32" fill="#fbbf24" />

          {/* Eyes */}
          {isBlinking ? (
            <>
              <path d="M 32 48 Q 38 52 44 48" stroke="#451a03" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 56 48 Q 62 52 68 48" stroke="#451a03" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Left Eye */}
              <circle cx="38" cy="48" r="5" fill="#451a03" />
              <circle cx="39.5" cy="46.5" r="1.5" fill="#ffffff" />
              {/* Right Eye */}
              <circle cx="62" cy="48" r="5" fill="#451a03" />
              <circle cx="63.5" cy="46.5" r="1.5" fill="#ffffff" />
            </>
          )}

          {/* Cheeks */}
          <ellipse cx="32" cy="55" rx="4" ry="2" fill="#fca5a5" opacity="0.6" />
          <ellipse cx="68" cy="55" rx="4" ry="2" fill="#fca5a5" opacity="0.6" />

          {/* Snout */}
          <ellipse cx="50" cy="62" rx="12" ry="9" fill="#fef3c7" />
          
          {/* Nose */}
          <path d="M 46 58 L 54 58 L 50 63 Z" fill="#451a03" />
          
          {/* Mouth */}
          <path d="M 50 63 L 50 66" stroke="#451a03" strokeWidth="2" strokeLinecap="round" />
          <path d="M 44 66 Q 47 70 50 66" stroke="#451a03" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 56 66 Q 53 70 50 66" stroke="#451a03" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </motion.div>
    </div>
  );
};

export default Mascot;
