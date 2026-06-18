import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Briefcase, Camera } from 'lucide-react';

const RegisterModal = ({ isOpen, onClose, defaultType, onRegisterSuccess }) => {
  const [accountType, setAccountType] = useState(defaultType || 'solicitante');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    campus: '',
    career: '',
    semester: '',
    phone: '',
    profilePic: null, // Para almacenar el archivo de imagen
    profilePicPreview: null, // Para mostrar la vista previa de la imagen
    skills: ''
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef(null);

  React.useEffect(() => {
    setAccountType(defaultType === 'general' ? 'solicitante' : defaultType);
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      university: '',
      campus: '',
      career: '',
      semester: '',
      phone: '',
      profilePic: null,
      profilePicPreview: null,
      skills: ''
    });
    setErrors({});
    setShowSuccess(false);
  }, [isOpen, defaultType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' })); // Limpiar error al escribir
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePic: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePicPreview: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, profilePic: null, profilePicPreview: null }));
    }
  };

  const validate = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@([^\s@]+\.)?ucvvirtual\.edu\.pe$/; // Regex para correo institucional UCV
    const phoneRegex = /^[0-9]{9}$/; // Asumiendo formato de 9 dígitos para celular

    if (!formData.fullName.trim()) newErrors.fullName = "El nombre completo es obligatorio.";
    if (!formData.email.trim()) {
      newErrors.email = "El correo institucional es obligatorio.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Debe ser un correo institucional de la UCV (ej. @ucvvirtual.edu.pe)";
    }
    if (!formData.password) newErrors.password = "La contraseña es obligatoria.";
    if (formData.password.length < 6) newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirmar contraseña es obligatorio.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }
    if (!formData.university.trim()) newErrors.university = "La universidad es obligatoria.";
    if (!formData.campus.trim()) newErrors.campus = "El campus o sede es obligatorio.";
    if (!formData.career.trim()) newErrors.career = "La carrera es obligatoria.";
    if (!formData.semester.trim()) newErrors.semester = "El ciclo o semestre es obligatorio.";
    if (!formData.phone.trim()) {
        newErrors.phone = "El celular es obligatorio.";
    } else if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = "El celular debe tener 9 dígitos.";
    }

    if (accountType === 'z-worker' && !formData.skills.trim()) {
      newErrors.skills = "Las habilidades/servicios son obligatorias para Z-Workers.";
    }

    // Aquí iría la validación del checkbox de términos y condiciones si existiera
    // if (!formData.acceptTerms) newErrors.acceptTerms = "Debes aceptar los términos y condiciones.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Logic for successful registration (client-side only for demo)
      setShowSuccess(true);
      onRegisterSuccess({ ...formData, accountType });
      // Clear sensitive data from form after success for demo purposes
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    }
  };

  const closeModal = () => {
    if (showSuccess) {
      setShowSuccess(false);
    }
    onClose();
  };

  const getInitials = (fullName) => {
    if (!fullName) return '';
    const names = fullName.split(' ').filter(n => n);
    if (names.length === 0) return '';
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
        >
          <motion.div
            className="bg-white rounded-3xl p-8 shadow-2xl relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            onClick={(e) => e.stopPropagation()} // Evita que el clic en el modal cierre el modal
          >
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors duration-300 p-2 rounded-full hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>

            {!showSuccess ? (
              <>
                <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                  ¡Únete a Z-Tech!
                </h2>
                <p className="text-center text-gray-500 mb-8">Regístrate y conecta con tu comunidad universitaria.</p>

                {/* Selector de tipo de cuenta */}
                {defaultType === 'general' && (
                    <div className="flex justify-center gap-4 mb-8">
                        <motion.button
                            onClick={() => setAccountType('solicitante')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                                accountType === 'solicitante'
                                    ? 'bg-blue-600 text-white shadow-xl'
                                    : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <User className="h-5 w-5" />
                            Soy Solicitante
                        </motion.button>
                        <motion.button
                            onClick={() => setAccountType('z-worker')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                                accountType === 'z-worker'
                                    ? 'bg-purple-600 text-white shadow-xl'
                                    : 'bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Briefcase className="h-5 w-5" />
                            Soy Z-Worker
                        </motion.button>
                    </div>
                )}


                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Campo Nombre Completo */}
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
                      Nombre Completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`shadow-sm appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200 ${
                        errors.fullName ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.fullName && <p className="text-red-500 text-xs italic mt-1">{errors.fullName}</p>}
                  </div>

                  {/* Campo Correo Institucional */}
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                      Correo Institucional <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ej. mi.correo@ucvvirtual.edu.pe"
                      className={`shadow-sm appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200 ${
                        errors.email ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.email && <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>}
                  </div>

                  {/* Campo Contraseña */}
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                      Contraseña <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`shadow-sm appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200 ${
                        errors.password ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.password && <p className="text-red-500 text-xs italic mt-1">{errors.password}</p>}
                  </div>

                  {/* Campo Confirmar Contraseña */}
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                      Confirmar Contraseña <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`shadow-sm appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200 ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-xs italic mt-1">{errors.confirmPassword}</p>}
                  </div>

                  {/* Campo Universidad */}
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="university">
                      Universidad <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="university"
                      name="university"
                      value={formData.university}
                      onChange={handleChange}
                      className={`shadow-sm appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200 ${
                        errors.university ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.university && <p className="text-red-500 text-xs italic mt-1">{errors.university}</p>}
                  </div>

                  {/* Campo Campus o Sede */}
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="campus">
                      Campus o Sede <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="campus"
                      name="campus"
                      value={formData.campus}
                      onChange={handleChange}
                      className={`shadow-sm appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200 ${
                        errors.campus ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.campus && <p className="text-red-500 text-xs italic mt-1">{errors.campus}</p>}
                  </div>

                  {/* Campo Carrera */}
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="career">
                      Carrera <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="career"
                      name="career"
                      value={formData.career}
                      onChange={handleChange}
                      className={`shadow-sm appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200 ${
                        errors.career ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.career && <p className="text-red-500 text-xs italic mt-1">{errors.career}</p>}
                  </div>

                  {/* Campo Ciclo o Semestre */}
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="semester">
                      Ciclo o Semestre <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="semester"
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      className={`shadow-sm appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200 ${
                        errors.semester ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.semester && <p className="text-red-500 text-xs italic mt-1">{errors.semester}</p>}
                  </div>

                  {/* Campo Celular */}
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                      Celular <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9 dígitos sin espacios"
                      className={`shadow-sm appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200 ${
                        errors.phone ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs italic mt-1">{errors.phone}</p>}
                  </div>

                  {/* Campo Foto de Perfil Opcional */}
                  <div className="md:col-span-1">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Foto de Perfil (Opcional)
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <div
                      className="flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
                      onClick={() => fileInputRef.current.click()}
                    >
                      {formData.profilePicPreview ? (
                        <motion.img
                          src={formData.profilePicPreview}
                          alt="Previsualización de perfil"
                          className="w-24 h-24 rounded-full object-cover shrink-0 border-2 border-blue-400"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      ) : (
                        <div className="flex flex-col items-center text-gray-400">
                          <Camera className="h-8 w-8 mb-2" />
                          <span>Subir foto</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Campo Habilidades/Servicios (solo para Z-Worker) */}
                  {accountType === 'z-worker' && (
                    <motion.div
                      className="md:col-span-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="skills">
                        Habilidades o Servicios que puedes ofrecer <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="skills"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Ej. Clases de Cálculo, Edición de videos, Recados urgentes..."
                        className={`shadow-sm appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all duration-200 ${
                          errors.skills ? 'border-red-500' : 'border-gray-200'
                        }`}
                      ></textarea>
                      {errors.skills && <p className="text-red-500 text-xs italic mt-1">{errors.skills}</p>}
                    </motion.div>
                  )}

                  {/* Checkbox de Términos (Placeholder) */}
                  <div className="md:col-span-2 flex items-center mt-4">
                    <input type="checkbox" id="acceptTerms" name="acceptTerms" className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" required />
                    <label htmlFor="acceptTerms" className="text-gray-700 text-sm">
                      Acepto los <a href="#" className="text-blue-600 hover:underline">términos y condiciones</a> <span className="text-red-500">*</span>
                    </label>
                    {/* {errors.acceptTerms && <p className="text-red-500 text-xs italic mt-1">{errors.acceptTerms}</p>} */}
                  </div>

                  {/* Botón de Registro */}
                  <div className="md:col-span-2 text-center mt-8">
                    <motion.button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Completar Registro
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
                        ¡Registro Exitoso!
                    </h3>
                    <p className="text-gray-700 text-lg mb-8">
                        ¡Bienvenid@ a la comunidad Z-Tech, {formData.fullName.split(' ')[0]}!
                        Prepárate para conectar y potenciar tu vida universitaria.
                    </p>
                    <motion.button
                        onClick={closeModal}
                        className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        ¡Empecemos!
                    </motion.button>
                </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegisterModal;