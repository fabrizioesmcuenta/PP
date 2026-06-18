import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Briefcase, Camera, LogIn, UserPlus } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, onAuthSuccess, defaultAccountType = 'solicitante' }) => {
  const [isLogin, setIsLogin] = useState(true); // true for Login, false for Register
  const [accountType, setAccountType] = useState(defaultAccountType === 'general' ? 'solicitante' : defaultAccountType);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: 'Universidad César Vallejo (UCV)',
    campus: '',
    career: '',
    semester: '',
    phone: '',
    profilePic: null, // Para almacenar el archivo de imagen
    profilePicPreview: null, // Para mostrar la vista previa de la imagen
    skills: '',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  React.useEffect(() => {
    if (isOpen) {
      if (defaultAccountType !== 'general') {
        setIsLogin(false); // Si viene de un CTA específico, force el registro
        setAccountType(defaultAccountType);
      } else {
        setIsLogin(true); // Si viene de "Regístrate Ahora", por defecto Login
      }
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        university: 'Universidad César Vallejo (UCV)',
        campus: '',
        career: '',
        semester: '',
        phone: '',
        profilePic: null,
        profilePicPreview: null,
        skills: '',
        acceptTerms: false,
      });
      setErrors({});
    }
  }, [isOpen, defaultAccountType]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData(prev => ({ // Limpiar campos no relevantes o sensibles
      ...prev,
      password: '',
      confirmPassword: '',
      fullName: isLogin ? '' : prev.fullName, // Clear full name only when switching from login to register
      university: 'Universidad César Vallejo (UCV)',
      campus: '', // Clear campus on toggle for simplicity
      career: '',
      semester: '',
      phone: '',
      profilePic: null, // Clear profile pic
      profilePicPreview: null,
      skills: '',
      acceptTerms: false,
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
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
    const emailRegex = /^[^\s@]+@([^\s@]+\.)?ucv\.edu\.pe$/;
    const phoneRegex = /^[0-9]{9}$/;

    if (!formData.email.trim()) {
      newErrors.email = "El correo institucional es obligatorio.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Debe ser un correo institucional de la UCV (ej. @ucv.edu.pe)";
    }
    if (!formData.password) newErrors.password = "La contraseña es obligatoria.";
    if (formData.password.length < 6) newErrors.password = "La contraseña debe tener al menos 6 caracteres.";

    if (!isLogin) { // Only validate these for registration
      if (!formData.fullName.trim()) newErrors.fullName = "El nombre completo es obligatorio.";
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
      if (!formData.acceptTerms) newErrors.acceptTerms = "Debes aceptar los términos y condiciones.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const userToRegister = {
        ...formData,
        primaryRole: accountType,
        secondaryRole: null, // Initially no secondary role
        currentMode: accountType, // Start in primary role mode
        createdAt: new Date().toISOString(),
      };

      if (isLogin) {
        // En una implementación real, aquí se verificarían las credenciales contra un backend.
        // Como es solo demo, simulamos un login exitoso si las credenciales coinciden con algún usuario registrado previamente.
        // O simplemente asumimos que el login es exitoso con credenciales válidas básicas.
        const storedUsers = JSON.parse(localStorage.getItem('ztech_users')) || {};
        const user = storedUsers[userToRegister.email];

        if (user && user.password === userToRegister.password) {
            onAuthSuccess(user);
            onClose();
        } else {
            setErrors({ general: 'Correo o contraseña incorrectos.' });
        }
      } else {
        // Simular registro: guardar en localStorage como si fuera una base de datos.
        const storedUsers = JSON.parse(localStorage.getItem('ztech_users')) || {};
        if (storedUsers[userToRegister.email]) {
            setErrors({ email: 'Este correo ya está registrado.' });
            return;
        }

        const newUser = {
            fullName: userToRegister.fullName,
            email: userToRegister.email,
            password: userToRegister.password, // En un entorno real, la contraseña se hashearía
            university: userToRegister.university,
            campus: userToRegister.campus,
            career: userToRegister.career,
            semester: userToRegister.semester,
            phone: userToRegister.phone,
            profilePicPreview: userToRegister.profilePicPreview,
            primaryRole: userToRegister.primaryRole,
            secondaryRole: null,
            currentMode: userToRegister.primaryRole,
            skills: userToRegister.skills,
            createdAt: userToRegister.createdAt,
        };

        storedUsers[newUser.email] = newUser;
        localStorage.setItem('ztech_users', JSON.stringify(storedUsers));
        onAuthSuccess(newUser);
        onClose();
      }
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

            <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              {isLogin ? 'Iniciar Sesión' : '¡Únete a Z-Tech!'}
            </h2>
            <p className="text-center text-gray-500 mb-8">
              {isLogin ? 'Accede a tu cuenta y continúa donde lo dejaste.' : 'Regístrate y conecta con tu comunidad universitaria.'}
            </p>

            {errors.general && <p className="text-red-500 text-sm italic text-center mb-4">{errors.general}</p>}


            {!isLogin && (
              <div className="flex justify-center flex-wrap gap-4 mb-8">
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
              {!isLogin && (
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
              )}

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
                  placeholder="ej. mi.correo@ucv.edu.pe"
                  className={`shadow-sm appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200 ${
                    errors.email ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.email && <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>}
              </div>

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

              {!isLogin && (
                <>
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
                      readOnly
                    />
                    {errors.university && <p className="text-red-500 text-xs italic mt-1">{errors.university}</p>}
                  </div>

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

                  <div className="md:col-span-2 flex items-center mt-4">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="acceptTerms" className="text-gray-700 text-sm">
                      Acepto los <a href="#" className="text-blue-600 hover:underline">términos y condiciones</a> <span className="text-red-500">*</span>
                    </label>
                    {errors.acceptTerms && <p className="text-red-500 text-xs italic mt-1">{errors.acceptTerms}</p>}
                  </div>
                </>
              )}

              <div className="md:col-span-2 text-center mt-8">
                <motion.button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isLogin ? 'Iniciar Sesión' : 'Completar Registro'}
                </motion.button>
              </div>
            </form>

            <motion.p
              className="mt-6 text-center text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {isLogin ?
                "¿No tienes cuenta? " :
                "¿Ya tienes una cuenta? "
              }
              <button onClick={toggleForm} className="text-blue-600 font-semibold hover:underline focus:outline-none">
                {isLogin ? 'Regístrate aquí' : 'Inicia Sesión'}
              </button>
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;