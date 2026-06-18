import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, Power, RefreshCcw } from 'lucide-react';

const UserProfileDropdown = ({ isOpen, onClose, onLogout, currentUser, onUserAction }) => {
  if (!currentUser) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute top-full right-0 mt-4 w-64 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 z-50 origin-top-right"
          initial={{ opacity: 0, scale: 0.9, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <div className="flex flex-col items-start space-y-2">
            <div className="w-full pb-3 mb-3 border-b border-gray-100 flex items-center gap-3">
              {currentUser.profilePicPreview ? (
                <img src={currentUser.profilePicPreview} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-blue-300" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-base font-bold">
                  {currentUser.fullName.split(' ')[0][0].toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-800">{currentUser.fullName.split(' ')[0]}</p>
                <p className="text-xs text-gray-500">{currentUser.currentMode === 'solicitante' ? 'Modo Solicitante' : 'Modo Z-Worker'}</p>
              </div>
            </div>

            <motion.button
              onClick={() => { onUserAction('viewProfile'); onClose(); }}
              className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors duration-200 text-left"
              whileHover={{ x: 5 }}
            >
              <User className="h-5 w-5" />
              <span>Ver perfil</span>
            </motion.button>
            <motion.button
              onClick={() => { onUserAction('settings'); onClose(); }}
              className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors duration-200 text-left"
              whileHover={{ x: 5 }}
            >
              <Settings className="h-5 w-5" />
              <span>Configuración</span>
            </motion.button>
            {(currentUser.primaryRole === 'solicitante' && currentUser.secondaryRole === 'z-worker') ||
            (currentUser.primaryRole === 'z-worker' && currentUser.secondaryRole === 'solicitante') ? (
                <motion.button
                    onClick={() => { onUserAction('toggleMode'); onClose(); }}
                    className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors duration-200 text-left"
                    whileHover={{ x: 5 }}
                >
                    <RefreshCcw className="h-5 w-5" />
                    <span>Cambiar a Modo {currentUser.currentMode === 'solicitante' ? 'Z-Worker' : 'Solicitante'}</span>
                </motion.button>
            ) : (
                <motion.button
                    onClick={() => { onUserAction('activateSecondaryRole'); onClose(); }}
                    className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors duration-200 text-left"
                    whileHover={{ x: 5 }}
                >
                    <RefreshCcw className="h-5 w-5" />
                    <span>Activar {currentUser.primaryRole === 'solicitante' ? 'Modo Z-Worker' : 'Modo Solicitante'}</span>
                </motion.button>
            )}

            <motion.button
              onClick={() => { onLogout(); onClose(); }}
              className="flex items-center gap-3 w-full px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 text-left mt-2 border-t border-gray-100 pt-3"
              whileHover={{ x: 5 }}
            >
              <Power className="h-5 w-5" />
              <span>Cerrar Sesión</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserProfileDropdown;