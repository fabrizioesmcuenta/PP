import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, User, Mail, University, MapPin, Briefcase, GraduationCap, Phone } from 'lucide-react';
import { format } from 'date-fns'; // Importamos format de date-fns para las fechas

const Hero = ({ onAuthClick, currentUser, onUserAction, onCTAClick }) => {
  const getInitials = (fullName) => {
    if (!fullName) return '';
    const names = fullName.split(' ').filter(Boolean);
    if (names.length === 0) return '';
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const accountTypeTag = currentUser && (currentUser.currentMode === 'z-worker' ? 'Z-Worker' : 'Solicitante');
  const tagColor = currentUser && (currentUser.currentMode === 'z-worker' ? 'bg-purple-200 text-purple-800' : 'bg-blue-200 text-blue-800');

  const formattedDate = currentUser?.createdAt ? format(new Date(currentUser.createdAt), 'dd/MM/yyyy') : 'N/A';

  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between relative z-10 gap-12">
        <motion.div
          className={`text-center md:text-left ${currentUser ? 'md:w-1/2' : 'md:w-auto'} transition-all duration-700`}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold leading-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
          >
            Tu Campus, Tus Soluciones, Tu Dinero Extra
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg mx-auto md:mx-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Conecta con estudiantes de tu campus para tareas rápidas, encargos y apoyo académico. ¡Ayuda y gana dinero, fácil y seguro!
          </motion.p>

          <AnimatePresence mode="wait">
            {!currentUser ? (
              <motion.div
                key="anon-ctas"
                className="flex flex-col sm:flex-row justify-center md:justify-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.button
                  onClick={() => onAuthClick('solicitante')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Sparkles className="h-5 w-5" />
                  Empieza a Crear Tareas
                </motion.button>
                <motion.button
                  onClick={() => onAuthClick('z-worker')}
                  className="bg-white text-blue-700 border border-blue-200 px-8 py-4 rounded-full text-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img src="https://framerusercontent.com/images/3DtnJkS7pQd2sWlOqW2q2oQ.png" alt="Z-Worker Icon" className="h-5 w-5" />
                  Conviértete en Z-Worker
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="user-ctas"
                className="flex flex-col sm:flex-row justify-center md:justify-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.button
                    onClick={() => onCTAClick('solicitante')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Sparkles className="h-5 w-5" />
                    {currentUser.currentMode === 'solicitante' ? 'Publicar una Nueva Tarea' : 'Activar Modo Solicitante'}
                </motion.button>
                {(currentUser.primaryRole === 'z-worker' || currentUser.secondaryRole === 'z-worker') && currentUser.currentMode === 'solicitante' && (
                    <motion.button
                        onClick={() => onUserAction('toggleMode')}
                        className="bg-white text-blue-700 border border-blue-200 px-8 py-4 rounded-full text-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <img src="https://framerusercontent.com/images/3DtnJkS7pQd2sWlOqW2q2oQ.png" alt="Z-Worker Icon" className="h-5 w-5" />
                        Cambiar a Modo Z-Worker
                    </motion.button>
                )}
                {(currentUser.primaryRole === 'solicitante' || currentUser.secondaryRole === 'solicitante') && currentUser.currentMode === 'z-worker' &&(
                    <motion.button
                        onClick={() => onUserAction('toggleMode')}
                        className="bg-white text-blue-700 border border-blue-200 px-8 py-4 rounded-full text-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <User className="h-5 w-5" />
                        Cambiar a Modo Solicitante
                    </motion.button>
                )}
                 {!currentUser.secondaryRole && currentUser.primaryRole === 'solicitante' &&(
                    <motion.button
                        onClick={() => onCTAClick('z-worker')}
                        className="bg-white text-blue-700 border border-blue-200 px-8 py-4 rounded-full text-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <img src="https://framerusercontent.com/images/3DtnJkS7pQd2sWlOqW2q2oQ.png" alt="Z-Worker Icon" className="h-5 w-5" />
                        Activar Modo Z-Worker
                    </motion.button>
                )}
                {!currentUser.secondaryRole && currentUser.primaryRole === 'z-worker' && (
                    <motion.button
                        onClick={() => onCTAClick('solicitante')}
                        className="bg-white text-blue-700 border border-blue-200 px-8 py-4 rounded-full text-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <User className="h-5 w-5" />
                        Activar Modo Solicitante
                    </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
  className={`w-full md:w-1/2 flex justify-center ${currentUser ? 'md:justify-around' : 'md:justify-end'} mt-12 md:mt-0 relative transition-all duration-700`}
  initial={{ opacity: 0, x: 50, rotate: 5 }}
  animate={{ opacity: 1, x: 0, rotate: 0 }}
  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
>
  {/* Mockup visual de la app */}
  <motion.div
    className="relative w-[300px] h-[600px] bg-gray-800 rounded-[2.5rem] shadow-2xl border-[10px] border-gray-900 overflow-hidden group mb-8 md:mb-0"
    whileHover={{ translateY: -10, rotate: -2, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)' }}
    transition={{ duration: 0.4, type: 'spring', stiffness: 150 }}
  >
    {/* Pantalla del teléfono */}
    <div className="absolute inset-0 p-4 bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col items-center justify-start text-gray-800">
      <div className="w-full text-center mb-6">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-2 bg-gray-700 rounded-full"></div> {/* Notch simple */}
        <h3 className="text-xl font-bold mt-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700">Mis Z-Tareas</h3>
      </div>
      <div className="w-full space-y-3 px-2">
      <motion.div
          className="bg-white rounded-xl shadow-md p-4 flex items-center gap-3 border border-blue-100"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5, type: 'spring' }}
        >
          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">1</div>
          <span className="font-medium">Terminar informe de física</span>
        </motion.div>
        <motion.div
          className="bg-white rounded-xl shadow-md p-4 flex items-center gap-3 border border-purple-100"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5, type: 'spring' }}
        >
          <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-bold">2</div>
          <span className="font-medium">Recoger paquete en paquetería</span>
        </motion.div>
        <motion.div
          className="bg-white rounded-xl shadow-md p-4 flex items-center gap-3 border border-green-100 opacity-0 transform translate-x-full group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out delay-200"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.5, type: 'spring' }}
        >
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">3</div>
          <span className="font-medium">Clases de apoyo para Cálculo</span>
        </motion.div>
      </div>
      {/* Botón flotante de añadir tarea */}
      <motion.button
        className="absolute bottom-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full p-3 shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.8, type: 'spring', stiffness: 200 }}
        whileHover={{ rotate: 90 }}
      >
        <Sparkles className="h-6 w-6" />
      </motion.button>
    </div>
  </motion.div>

  {/* Tarjeta de Bienvenida del Usuario (integrada en el hero) */}
  <AnimatePresence>
    {currentUser && (
      <motion.div
        key="user-welcome-card"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:relative md:top-auto md:left-auto md:translate-x-0 md:translate-y-0 p-8 bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-xs md:max-w-sm ml-0 md:ml-8 transform rotate-3"
        initial={{ opacity: 0, scale: 0.8, y: -50, x: 50, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0, x: 0, rotate: 3 }}
        exit={{ opacity: 0, scale: 0.8, y: -50, x: 50, rotate: -10 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.5 }}
      >
        <div className="flex flex-col items-center text-center mb-6" onClick={() => onUserAction('viewProfile')}>
          {currentUser.profilePicPreview ? (
            <img
              src={currentUser.profilePicPreview}
              alt="Foto de perfil"
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-400 shadow-md mb-4 cursor-pointer"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center text-4xl font-bold mb-4 border-4 border-blue-400 shadow-md cursor-pointer">
              {getInitials(currentUser.fullName)}
            </div>
          )}
          <h3 className="text-2xl font-bold text-gray-800 mb-1">Bienvenid@, {currentUser.fullName.split(' ')[0]}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tagColor}`}>
            {accountTypeTag}
          </span>
        </div>

        <div className="space-y-3 text-gray-700 text-sm">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-blue-500" />
            <span>{currentUser.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <University className="h-4 w-4 text-purple-500" />
            <span>{currentUser.university}</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-green-500" />
            <span>{currentUser.campus}</span>
          </div>
          <div className="flex items-center gap-3">
            <GraduationCap className="h-4 w-4 text-yellow-500" />
            <span>{currentUser.career} ({currentUser.semester})</span>
          </div>
           {currentUser.secondaryRole && (
             <div className="flex items-center gap-3">
               <Briefcase className="h-4 w-4 text-pink-500" />
               <span className="font-semibold">2do Rol activado: {currentUser.secondaryRole === 'z-worker' ? 'Z-Worker' : 'Solicitante'}</span>
             </div>
           )}
          <div className="flex items-center gap-3 text-gray-500 text-xs">
            <User className="h-4 w-4" />
            <span>Miembro desde: {formattedDate}</span>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</motion.div>
      </div>

      {/* Elementos de fondo decorativos */}
      <motion.div
        className="absolute top-1/4 left-0 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
      ></motion.div>
      <motion.div
        className="absolute bottom-1/4 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4 }}
      ></motion.div>
    </section>
  );
};

export default Hero;