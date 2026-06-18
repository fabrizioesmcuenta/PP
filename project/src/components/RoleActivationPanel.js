import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, User, CheckCircle2 } from 'lucide-react';

const RoleActivationPanel = ({ isOpen, onClose, user, onActivateRole }) => {
  const [skills, setSkills] = useState('');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  React.useEffect(() => {
    setSkills(user?.skills || '');
    setError('');
    setShowSuccess(false);
  }, [isOpen, user]);

  if (!user) return null;

  const targetRole = user.primaryRole === 'solicitante' ? 'z-worker' : 'solicitante';
  const isTargetRoleActive = (targetRole === 'z-worker' && user.isZWorkerActive) || (targetRole === 'solicitante' && user.isSolicitanteActive);

  const handleActivate = () => {
    if (targetRole === 'z-worker' && !skills.trim()) {
      setError("Por favor, describe las habilidades que puedes ofrecer.");
      return;
    }
    setError('');
    onActivateRole(targetRole, skills);
    setShowSuccess(true);
    setTimeout(() => onClose(), 1500);
  };

  const currentModeTag = user.currentMode === 'z-worker' ? 'Z-Worker' : 'Solicitante';
  const primaryRoleTag = user.primaryRole === 'z-worker' ? 'Z-Worker Principal' : 'Solicitante Principal';
  const secondaryRoleTag = user.secondaryRole === 'z-worker' ? 'Z-Worker Secundario' : 'Solicitante Secundario';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-3xl p-8 shadow-2xl relative w-full max-w-lg max-h-[90vh] overflow-y-auto text-center"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors duration-300 p-2 rounded-full hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>

            {!showSuccess ? (
              <>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                  Gestiona tus Roles
                </h2>
                <p className="text-center text-gray-500 mb-8">
                  Activa o cambia entre tus modos de {user.fullName.split(' ')[0]}.
                </p>

                <div className="flex justify-center flex-wrap gap-3 mb-8">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${user.primaryRole === 'z-worker' ? 'bg-purple-500 text-white' : 'bg-blue-500 text-white'}`}>
                        {primaryRoleTag}
                    </span>
                    {user.secondaryRole && (
                        <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${user.secondaryRole === 'z-worker' ? 'bg-purple-300 text-purple-900' : 'bg-blue-300 text-blue-900'}`}>
                            {secondaryRoleTag}
                        </span>
                    )}
                     <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${user.currentMode === 'z-worker' ? 'bg-indigo-500 text-white' : 'bg-teal-500 text-white'}`}>
                        Modo Actual: {currentModeTag}
                    </span>
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8 text-left">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    {targetRole === 'z-worker' ? <Briefcase className="h-6 w-6 text-purple-600" /> : <User className="h-6 w-6 text-blue-600" />}
                    Activar Modo {targetRole === 'z-worker' ? 'Z-Worker' : 'Solicitante'}
                  </h3>
                  {isTargetRoleActive ? (
                    <p className="text-gray-600 mb-4 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ¡Modo {targetRole === 'z-worker' ? 'Z-Worker' : 'Solicitante'} ya está activo! Puedes cambiar tu modo actual directamente.
                    </p>
                  ) : (
                    <>
                      <p className="text-gray-600 mb-4">
                        Desbloquea nuevas oportunidades. Al activar este modo, podrás {targetRole === 'z-worker' ? 'ofrecer tus servicios y generar ingresos' : 'publicar tareas y recibir ayuda'}.
                      </p>
                      {targetRole === 'z-worker' && (
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="skills">
                            Tus Habilidades/Servicios <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="skills"
                            name="skills"
                            value={skills}
                            onChange={(e) => { setSkills(e.target.value); setError(''); }}
                            rows="3"
                            placeholder="Ej. Clases de Cálculo, Edición de videos, Recados urgentes..."
                            className={`shadow-sm appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all duration-200 ${
                              error ? 'border-red-500' : 'border-gray-200'
                            }`}
                          ></textarea>
                          {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {!isTargetRoleActive && (
                    <motion.button
                        onClick={handleActivate}
                        className={`bg - gradient - to - r from - blue - 600 to - purple - 600 text - white px - 8 py - 4 rounded - full text - lg font - semibold shadow - xl hover: shadow - 2xl transform hover:-translate-y-1 transition-all duration-300 w-full mb-4`}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        Activar Modo {targetRole === 'z-worker' ? 'Z-Worker' : 'Solicitante'}
                    </motion.button>
                )}


                <h3 className="text-xl font-bold text-gray-800 mb-4 mt-8">Cambiar Modo Actual</h3>
                <p className="text-gray-600 mb-4">
                    Al cambiar de modo, la interfaz se adaptará a tus necesidades.
                </p>
                <div className="flex justify-center gap-4">
                    <motion.button
                        onClick={() => { onActivateRole('changeCurrentMode', 'solicitante'); setShowSuccess(true); setTimeout(() => onClose(), 1500); }}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                            user.currentMode === 'solicitante'
                                ? 'bg-blue-600 text-white shadow-xl'
                                : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={!user.isSolicitanteActive || user.currentMode === 'solicitante'}
                    >
                        <User className="h-5 w-5" />
                        Modo Solicitante
                    </motion.button>
                     <motion.button
                        onClick={() => { onActivateRole('changeCurrentMode', 'z-worker'); setShowSuccess(true); setTimeout(() => onClose(), 1500); }}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                            user.currentMode === 'z-worker'
                                ? 'bg-purple-600 text-white shadow-xl'
                                : 'bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={!user.isZWorkerActive || user.currentMode === 'z-worker'}
                    >
                        <Briefcase className="h-5 w-5" />
                        Modo Z-Worker
                    </motion.button>
                </div>

              </>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 10 }}
                    className="text-center py-10"
                >
                    <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
                    <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600 mb-4">
                        ¡Operación Exitosa!
                    </h3>
                    <p className="text-gray-700 text-lg mb-8">
                        Tu configuración de rol ha sido actualizada.
                    </p>
                </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RoleActivationPanel;