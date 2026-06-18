import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, MapPin, Tag, Clock } from 'lucide-react';

const TaskModal = ({ isOpen, onClose }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    category: '',
    urgency: 'normal',
    location: '',
    payment: '',
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setTaskData({
        title: '', description: '', category: '', urgency: 'normal', location: '', payment: '',
      });
      setErrors({});
      setShowSuccess(false);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateTask = () => {
    let newErrors = {};
    if (!taskData.title.trim()) newErrors.title = "El título es obligatorio.";
    if (!taskData.description.trim()) newErrors.description = "La descripción es obligatoria.";
    if (!taskData.category.trim()) newErrors.category = "La categoría es obligatoria.";
    if (!taskData.location.trim()) newErrors.location = "La ubicación es obligatoria.";
    if (!taskData.payment.trim() || isNaN(taskData.payment) || parseFloat(taskData.payment) <= 0) {
      newErrors.payment = "El pago estimado debe ser un número válido mayor que cero.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateTask()) {
      // Simulate task creation
      console.log("Nueva tarea publicada:", taskData);
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
                <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                  Publica una Nueva Tarea
                </h2>
                <p className="text-center text-gray-500 mb-8">
                  ¿Necesitas ayuda? Describe tu necesidad y encuentra a tu Z-Worker ideal.
                </p>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                      Título de la Tarea <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={taskData.title}
                      onChange={handleChange}
                      className={`shadow-sm appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200 ${
                        errors.title ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.title && <p className="text-red-500 text-xs italic mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                      Categoría <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={taskData.category}
                      onChange={handleChange}
                      className={`shadow-sm appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200 bg-white ${
                        errors.category ? 'border-red-500' : 'border-gray-200'
                      }`}
                    >
                      <option value="">Selecciona una categoría</option>
                      <option value="academico">Apoyo Académico</option>
                      <option value="logistico">Encargos Logísticos</option>
                      <option value="personal">Gestiones Personales</option>
                      <option value="varios">Varios / Tareas Rápidas</option>
                    </select>
                    {errors.category && <p className="text-red-500 text-xs italic mt-1">{errors.category}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                      Descripción de la Tarea <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={taskData.description}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Describe en detalle lo que necesitas (ej. ayudarme con proyecto de estadística, recoger material de la biblioteca...). Max 300 caracteres."
                      className={`shadow-sm appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200 ${
                        errors.description ? 'border-red-500' : 'border-gray-200'
                      }`}
                      maxLength="300"
                    ></textarea>
                    {errors.description && <p className="text-red-500 text-xs italic mt-1">{errors.description}</p>}
                    <p className="text-right text-gray-400 text-xs mt-1">{taskData.description.length}/300</p>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="urgency">
                      Urgencia
                    </label>
                    <select
                      id="urgency"
                      name="urgency"
                      value={taskData.urgency}
                      onChange={handleChange}
                      className={`shadow-sm appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200 bg-white ${
                        errors.urgency ? 'border-red-500' : 'border-gray-200'
                      }`}
                    >
                      <option value="normal">Normal</option>
                      <option value="media">Media</option>
                      <option value="alta">Alta</option>
                      <option value="urgente">¡Urgente!</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                      Ubicación (Campus/Zona) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={taskData.location}
                      onChange={handleChange}
                      placeholder="Ej. Campus LIMA NORTE, Biblioteca UCV"
                      className={`shadow-sm appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200 ${
                        errors.location ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.location && <p className="text-red-500 text-xs italic mt-1">{errors.location}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="payment">
                      Pago Estimado (S/.) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="payment"
                      name="payment"
                      value={taskData.payment}
                      onChange={handleChange}
                      min="1"
                      step="0.50"
                      placeholder="Monto ideal por la tarea (ej. 15.00)"
                      className={`shadow-sm appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200 ${
                        errors.payment ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.payment && <p className="text-red-500 text-xs italic mt-1">{errors.payment}</p>}
                  </div>

                  <div className="md:col-span-2 text-center mt-8">
                    <motion.button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Publicar Tarea
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
                  ¡Tarea Publicada con Éxito!
                </h3>
                <p className="text-gray-700 text-lg mb-8">
                  Tu tarea ha sido enviada a la comunidad de Z-Workers. ¡Pronto recibirás ayuda!
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;