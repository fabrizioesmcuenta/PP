import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, Clock, DollarSign, CheckCircle2 } from 'lucide-react';

const ServiceModal = ({ isOpen, onClose, user, onUpdateSkills }) => {
  const [skills, setSkills] = useState(user?.skills || '');
  const [availability, setAvailability] = useState(user?.availability || 'flexible');
  const [serviceTypes, setServiceTypes] = useState(user?.serviceTypes || '');
  const [paymentRange, setPaymentRange] = useState(user?.paymentRange || '');
  const [description, setDescription] = useState(user?.serviceDescription || '');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  React.useEffect(() => {
    if (isOpen && user) {
      setSkills(user.skills || '');
      setAvailability(user.availability || 'flexible');
      setServiceTypes(user.serviceTypes || '');
      setPaymentRange(user.paymentRange || '');
      setDescription(user.serviceDescription || '');
      setError('');
      setShowSuccess(false);
    }
  }, [isOpen, user]);

  const validate = () => {
    if (!skills.trim()) {
      setError("Por favor, describe las habilidades que puedes ofrecer.");
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onUpdateSkills({ skills, availability, serviceTypes, paymentRange, serviceDescription: description });
      setShowSuccess(true);
      setTimeout(() => onClose(), 2000); // Cierra el modal después de 2 segundos
    }
  };

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
            className="bg-white rounded-3xl p-8 shadow-2xl relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
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
                <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-2">
                  Ofrece tus Servicios Z-Worker
                </h2>
                <p className="text-center text-gray-500 mb-8">
                  Configura tu perfil para empezar a ganar dinero y ayudar a tus compañeros.
                </p>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="skills">
                      Tus Habilidades o Servicios <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="skills"
                      name="skills"
                      value={skills}
                      onChange={(e) => { setSkills(e.target.value); setError(''); }}
                      rows="3"
                      placeholder="Describe qué puedes ofrecer (ej. Clases de Cálculo, Edición de videos, Recados urgentes...). Sé específico."
                      className={`shadow-sm appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all duration-200 ${
                        error ? 'border-red-500' : 'border-gray-200'
                      }`}
                      maxLength="300"
                    ></textarea>
                    {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
                    <p className="text-right text-gray-400 text-xs mt-1">{skills.length}/300</p>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="availability">
                      Disponibilidad <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="availability"
                      name="availability"
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      className="shadow-sm appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all duration-200 bg-white border-gray-200"
                    >
                      <option value="flexible">Flexible</option>
                      <option value="mañanas">Solo Mañanas</option>
                      <option value="tardes">Solo Tardes</option>
                      <option value="fines_semana">Fines de Semana</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="serviceTypes">
                      Tipo de Servicios <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="serviceTypes"
                      name="serviceTypes"
                      value={serviceTypes}
                      onChange={(e) => setServiceTypes(e.target.value)}
                      placeholder="Ej. Tutorías, Logística, Soporte IT"
                      className="shadow-sm appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all duration-200 border-gray-200"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="paymentRange">
                      Rango de Pago Deseado (S/.)
                    </label>
                    <input
                      type="text"
                      id="paymentRange"
                      name="paymentRange"
                      value={paymentRange}
                      onChange={(e) => setPaymentRange(e.target.value)}
                      placeholder="Ej. S/10 - S/30 por hora/tarea"
                      className="shadow-sm appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all duration-200 border-gray-200"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                      Descripción de tu perfil de Z-Worker (Opcional)
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows="3"
                      placeholder="Una breve descripción sobre ti como Z-Worker, tu experiencia o lo que te motiva."
                      className="shadow-sm appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all duration-200 border-gray-200"
                      maxLength="300"
                    ></textarea>
                     <p className="text-right text-gray-400 text-xs mt-1">{description.length}/300</p>
                  </div>


                  <div className="md:col-span-2 text-center mt-8">
                    <motion.button
                      type="submit"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Actualizar Perfil de Z-Worker
                    </motion.button>
                  </div>
                </form>
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
                        ¡Perfil Z-Worker Actualizado!
                    </h3>
                    <p className="text-gray-700 text-lg mb-8">
                        ¡Estás listo para empezar a ofrecer tus servicios y conectar con tu campus!
                    </p>
                </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ServiceModal;