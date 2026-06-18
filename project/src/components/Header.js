import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import UserProfileDropdown from './UserProfileDropdown'; // Import the new dropdown component

const Header = ({ onAuthClick, onLogout, currentUser, onUserAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Problema', href: '#problema' },
    { name: 'Qué es Z-Tech', href: '#que-es' },
    { name: 'Cómo funciona', href: '#como-funciona' },
    { name: 'Servicios', href: '#servicios' },
    { name: 'Para quién', href: '#para-quien' },
    { name: 'Seguridad', href: '#seguridad' },
    { name: 'Z-Tech vs. Otros', href: '#comparativa' },
    { name: 'FAQ', href: '#faq' },
  ];

  const getInitials = (fullName) => {
    if (!fullName) return '';
    const names = fullName.split(' ').filter(Boolean);
    if (names.length === 0) return '';
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <motion.header
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-4'}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 14 }}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <img src="https://framerusercontent.com/images/kF5a0gkqK1uG8L9oW9t2y0N6S8.png" alt="Z-Tech Logo" className="h-10 w-auto" />
        </motion.div>

        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item, index) => (
            <motion.a
              key={item.name}
              href={item.href}
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-300"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              {item.name}
            </motion.a>
          ))}
          <motion.div className="relative ml-6">
            <AnimatePresence mode="wait">
              {currentUser ? (
                <motion.button
                  key="user-profile-button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 bg-gray-100 rounded-full pr-4 py-2 pl-2 text-gray-800 font-semibold shadow-inner hover:bg-gray-200 transition-colors duration-300"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentUser.profilePicPreview ? (
                    <img src={currentUser.profilePicPreview} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-blue-300" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                      {getInitials(currentUser.fullName)}
                    </div>
                  )}
                  <span className="hidden lg:block text-sm">{currentUser.fullName.split(' ')[0]}</span>
                </motion.button>
              ) : (
                <motion.button
                  key="register-button"
                  onClick={() => onAuthClick('general')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-base font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  Regístrate Ahora
                </motion.button>
              )}
            </AnimatePresence>
            <UserProfileDropdown
              isOpen={isDropdownOpen}
              onClose={() => setIsDropdownOpen(false)}
              onLogout={onLogout}
              currentUser={currentUser}
              onUserAction={onUserAction}
            />
          </motion.div>
        </nav>

        <div className="md:hidden">
            <motion.div className="relative">
                <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 text-gray-700 hover:text-blue-600 focus:outline-none"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                </motion.button>

                <AnimatePresence>
                    {isOpen && (
                    <motion.nav
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="absolute right-0 mt-2 w-64 bg-white shadow-xl pt-4 pb-6 border-t border-gray-100 rounded-lg overflow-hidden"
                    >
                        <div className="flex flex-col items-center space-y-4">
                        {currentUser && (
                            <motion.div
                                className="flex flex-col items-center mb-4"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                {currentUser.profilePicPreview ? (
                                    <img src={currentUser.profilePicPreview} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-blue-300 mb-2" />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold mb-2">
                                    {getInitials(currentUser.fullName)}
                                    </div>
                                )}
                                <span className="text-lg font-semibold">{currentUser.fullName.split(' ')[0]}</span>
                                <span className="text-sm text-gray-500">{currentUser.currentMode}</span>
                            </motion.div>
                        )}
                        {navItems.map((item, index) => (
                            <motion.a
                            key={item.name}
                            href={item.href}
                            className="text-gray-700 hover:text-blue-600 font-medium text-lg w-full text-center py-2"
                            onClick={() => setIsOpen(false)}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            >
                            {item.name}
                            </motion.a>
                        ))}
                        {currentUser ? (
                            <>
                            <motion.button
                                onClick={() => { onUserAction('viewProfile'); setIsOpen(false); }}
                                className="w-3/4 bg-gray-100 text-gray-700 px-8 py-3 rounded-full text-base font-semibold shadow-md hover:bg-gray-200 transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Ver Perfil
                            </motion.button>
                            <motion.button
                                onClick={() => { onUserAction('settings'); setIsOpen(false); }}
                                className="w-3/4 bg-gray-100 text-gray-700 px-8 py-3 rounded-full text-base font-semibold shadow-md hover:bg-gray-200 transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Configuración
                            </motion.button>
                            <motion.button
                                onClick={() => { onUserAction('toggleMode'); setIsOpen(false); }}
                                className="w-3/4 bg-blue-100 text-blue-700 px-8 py-3 rounded-full text-base font-semibold shadow-md hover:bg-blue-200 transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Cambiar Modo
                            </motion.button>
                            <motion.button
                                onClick={() => { onLogout(); setIsOpen(false); }}
                                className="w-3/4 bg-red-500 text-white px-8 py-3 rounded-full text-base font-semibold shadow-lg hover:bg-red-600 transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Cerrar Sesión
                            </motion.button>
                            </>
                        ) : (
                            <motion.button
                                onClick={() => { onAuthClick('general'); setIsOpen(false); }}
                                className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full text-base font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 w-3/4"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: navItems.length * 0.05 }}
                            >
                                Regístrate Ahora
                            </motion.button>
                        )}
                        </div>
                    </motion.nav>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;