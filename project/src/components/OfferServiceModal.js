import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, DollarSign, List, Calendar, FileText, CheckCircle2 } from 'lucide-react';

const OfferServiceModal = ({ isOpen, onClose, currentUser, onActivateRole }) => {
  const isActivatingRole = currentUser?.primaryRole === 'solicitante' && !currentUser?.secondaryRole;
  const [formData, setFormData] = useState({
    skills: currentUser?.skills || '',
    availability: '',
    serviceTypes: [],
    description: '',
    rate: '',
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        skills: currentUser?.skills || '',
        availability: '',
        serviceTypes: [],
        description: '',
        rate: '',
      });
      setErrors({});
      setShowSuccess(false);
    }
  }, [isOpen, currentUser]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        serviceTypes: checked
          ? [...prev.serviceTypes, value]
          : prev.serviceTypes.filter(type => type !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.skills.trim()) newErrors.skills = "Tus habilidades son obligatorias.";
    if (!formData.description.trim()) newErrors.description = "Una descripción de tus servicios es obligatoria.";
    if (formData.serviceTypes.length === 0) newErrors.serviceTypes = "Debes seleccionar al menos un tipo de servicio.";
    if (!formData.rate.trim()) {
      newErrors.rate = "Tu tarifa o rango de pago es obligatorio.";
    } else if (isNaN(formData.rate) || parseFloat(formData.rate) <= 0) {
        newErrors.rate = "La tarifa debe ser un número positivo.";
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Simular actualización del perfil de Z-Worker o activación de rol
      if (isActivatingRole) {
        onActivateRole({ type: 'z-worker', skills: formData.skills, serviceDetails: formData.description, availability: formData.availability, rate: formData.rate, serviceTypes: formData.serviceTypes });
      } else {
        // Asumir que onUpdateUser en ProfileAndSettings se encarga si no es activación
        console.log('Actualización de perfil Z-Worker (demo):', formData);
        onClose(); // Cerrar si solo es actualización y no tiene que pasar por onActivateRole
      }
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000); // Cierra el modal después de 2 segundos
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
                <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-teal-600 mb-2">
                  {isActivatingRole ? '¡Conviértete en Z-Worker!' : 'Ofrece tus Servicios'}
                </h2>
                <p className="text-center text-gray-500 mb-8">
                  {isActivatingRole ?
                    'Activa tu perfil de Z-Worker y empieza a generar ingresos con tus habilidades.' :
                    'Actualiza tu perfil de Z-Worker y haz que más compañeros te encuentren.'
                  }
                </p>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center gap-2" htmlFor="skills">
                      <Briefcase className="h-4 w-4" /> Tus Habilidades/Servicios Clave <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="skills"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      rows="3"
                      className={`shadow-sm appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all duration-200 ${
                        errors.skills ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Ej. Clases de Cálculo diferencial, Traducción de textos, Diseño de presentaciones, Edición de Tik Toks..."
                    ></textarea>
                    {errors.skills && <p className="text-red-500 text-xs italic mt-1">{errors.skills}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center gap-2" htmlFor="description">
                      <FileText className="h-4 w-4" /> Descripción de tus Servicios <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      className={`shadow-sm appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all duration-200 ${
                        errors.description ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Describe qué tipo de ayuda puedes ofrecer, tu enfoque, y por qué eres el Z-Worker ideal."
                    ></textarea>
                    {errors.description && <p className="text-red-500 text-xs italic mt-1">{errors.description}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center gap-2">
                      <List className="h-4 w-4" /> Tipos de Servicios <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      {[
                        { value: 'academico', label: 'Apoyo Académico' },
                        { value: 'logistico', label: 'Encargos Logísticos' },
                        { value: 'personal', label: 'Gestiones Personales' },
                        { value: 'digital', label: 'Servicios Digitales' },
                      ].map((type) => (
                        <div key={type.value} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`service-${type.value}`}
                            name="serviceTypes"
                            value={type.value}
                            checked={formData.serviceTypes.includes(type.value)}
                            onChange={handleChange}
                            className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <label htmlFor={`service-${type.value}`} className="ml-2 text-sm text-gray-700">
                            {type.label}
                          </label>
                        </div>
                      ))}
                    </div>
                    {errors.serviceTypes && <p className="text-red-500 text-xs italic mt-1">{errors.serviceTypes}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center gap-2" htmlFor="availability">
                      <Calendar className="h-4 w-4" /> Tu Disponibilidad
                    </label>
                    <select
                      id="availability"
                      name="availability"
                      value={formData.availability}
                      onChange={handleChange}
                      className="shadow-sm appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all duration-200 border-gray-200"
                    >
                      <option value="">Selecciona tu disponibilidad</option>
                      <option value="flexible">Flexible</option>
                      <option value="mananas">Mañanas</option>
                      <option value="tardes">Tardes</option>
                      <option value="noches">Noches</option>
                      <option value="fines-semana">Fines de semana</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center gap-2" htmlFor="rate">
                      <DollarSign className="h-4 w-4" /> Tarifa por Hora/Servicio (S/) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="rate"
                      name="rate"
                      value={formData.rate}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className={`shadow-sm appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all duration-200 ${
                        errors.rate ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Ej. 15.00 (por hora) o 30.00 (por servicio)"
                    />
                    {errors.rate && <p className="text-red-500 text-xs italic mt-1">{errors.rate}</p>}
                  </div>

                  <div className="md:col-span-2 text-center mt-8">
                    <motion.button
                      type="submit"
                      className="bg-gradient-to-r from-purple-600 to-teal-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Briefcase className="inline-block h-5 w-5 mr-2" /> {isActivatingRole ? 'Activar y Guardar Perfil' : 'Actualizar Perfil Z-Worker'}
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
                <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-purple-600 mb-4">
                  ¡Perfil Z-Worker Actualizado!
                </h3>
                <p className="text-gray-700 text-lg mb-8">
                  ¡Ahora estás listo para conectar y ganar dinero en el campus!
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfferServiceModal;