import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, University, MapPin, Briefcase, GraduationCap, Phone, Camera, Save, Edit, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const ProfileAndSettings = ({ isOpen, onClose, currentUser, onUpdateUser, onActivateRole }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableUser, setEditableUser] = useState(currentUser);
  const [passwordChange, setPasswordChange] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [editErrors, setEditErrors] = useState({});
  const fileInputRef = useRef(null);
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  useEffect(() => {
    setEditableUser(currentUser);
    setIsEditing(false); // Reset editing state when modal opens/user changes
    setPasswordChange({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    setEditErrors({});
    setShowSaveMessage(false);
  }, [isOpen, currentUser]);


  const getInitials = (fullName) => {
    if (!fullName) return '';
    const names = fullName.split(' ').filter(Boolean);
    if (names.length === 0) return '';
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditableUser(prev => ({ ...prev, [name]: value }));
    setEditErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordChange(prev => ({ ...prev, [name]: value }));
    setEditErrors(prev => ({ ...prev, password: '', newPassword: '', confirmNewPassword: '' })); // Clear password errors
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditableUser(prev => ({ ...prev, profilePicPreview: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setEditableUser(prev => ({ ...prev, profilePicPreview: currentUser.profilePicPreview })); // Revert if no file selected
    }
  };

  const validateEdit = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@([^\s@]+\.)?ucvvirtual\.edu\.pe$/;
    const phoneRegex = /^[0-9]{9}$/;

    if (!editableUser.fullName.trim()) newErrors.fullName = "El nombre es obligatorio.";
    if (!editableUser.email.trim()) {
      newErrors.email = "El correo es obligatorio.";
    } else if (!emailRegex.test(editableUser.email)) {
      newErrors.email = "Debe ser un correo institucional de la UCV.";
    }
    if (!editableUser.campus.trim()) newErrors.campus = "El campus es obligatorio.";
    if (!editableUser.career.trim()) newErrors.career = "La carrera es obligatoria.";
    if (!editableUser.semester.trim()) newErrors.semester = "El ciclo es obligatorio.";
    if (!editableUser.phone.trim()) {
      newErrors.phone = "El celular es obligatorio.";
    } else if (!phoneRegex.test(editableUser.phone)) {
      newErrors.phone = "El celular debe tener 9 dígitos.";
    }
    if (editableUser.primaryRole === 'z-worker' && !editableUser.skills.trim()) {
      newErrors.skills = "Las habilidades son obligatorias para Z-Workers.";
    }
    if (editableUser.secondaryRole === 'z-worker' && !editableUser.skills.trim()) {
      newErrors.skills = "Las habilidades son obligatorias para Z-Workers.";
    }

    if (passwordChange.newPassword || passwordChange.currentPassword || passwordChange.confirmNewPassword) {
      if (passwordChange.currentPassword !== currentUser.password) { // Simulación
        newErrors.currentPassword = "Contraseña actual incorrecta.";
      }
      if (passwordChange.newPassword.length < 6) {
        newErrors.newPassword = "La nueva contraseña debe tener al menos 6 caracteres.";
      }
      if (passwordChange.newPassword !== passwordChange.confirmNewPassword) {
        newErrors.confirmNewPassword = "Las nuevas contraseñas no coinciden.";
      }
    }

    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = () => {
    if (validateEdit()) {
      let updatedUser = { ...editableUser };
      if (passwordChange.newPassword) {
        updatedUser.password = passwordChange.newPassword; // Actualizar contraseña
      }
      onUpdateUser(updatedUser);
      setShowSaveMessage(true);
      setTimeout(() => setShowSaveMessage(false), 3000);
      setIsEditing(false); // Sale del modo edición
    }
  };

  const handleActivateSecondaryRole = (roleType) => {
    onActivateRole(roleType);
  };

  if (!currentUser) return null;

  const rolesDisplay = [
    { role: currentUser.primaryRole, isPrimary: true, isActive: true },
    currentUser.secondaryRole ? { role: currentUser.secondaryRole, isPrimary: false, isActive: true } : null
  ].filter(Boolean);

  const pendingRole = currentUser.primaryRole === 'solicitante' && !currentUser.secondaryRole ? 'z-worker' :
                       currentUser.primaryRole === 'z-worker' && !currentUser.secondaryRole ? 'solicitante' : null;

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
            className="bg-white rounded-3xl p-8 shadow-2xl relative w-full max-w-4xl max-h-[90vh] overflow-y-auto"
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
              Perfil y Configuración
            </h2>
            <p className="text-center text-gray-500 mb-8">
              Gestiona tu información y roles en Z-Tech.
            </p>

            {showSaveMessage && (
                <motion.div
                    className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl relative mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                >
                    <CheckCircle2 className="inline h-5 w-5 mr-3" />
                    <span className="font-semibold">¡Cambios guardados exitosamente!</span>
                </motion.div>
            )}

            <div className="flex flex-col md:flex-row gap-8">
              {/* Columna Izquierda: Foto y Roles */}
              <div className="md:w-1/3 flex flex-col items-center p-6 bg-gray-50 rounded-2xl shadow-inner border border-gray-100">
                <div className="relative mb-6">
                  {editableUser.profilePicPreview ? (
                    <img
                      src={editableUser.profilePicPreview}
                      alt="Foto de perfil"
                      className="w-32 h-32 rounded-full object-cover border-4 border-blue-400 shadow-md"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center text-5xl font-bold border-4 border-blue-400 shadow-md">
                      {getInitials(editableUser.fullName)}
                    </div>
                  )}
                  {isEditing && (
                    <motion.button
                      onClick={() => fileInputRef.current.click()}
                      className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 shadow-md hover:bg-blue-600 transition-colors duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Camera className="h-5 w-5" />
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </motion.button>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-1">{editableUser.fullName}</h3>
                <p className="text-gray-600 text-sm mb-4">Miembro desde: {format(new Date(editableUser.createdAt), 'dd/MM/yyyy')}</p>

                <div className="w-full text-left mb-6">
                  <h4 className="font-bold text-gray-800 mb-2">Mis Roles:</h4>
                  {rolesDisplay.map((roleInfo, index) => (
                    <motion.div
                      key={index}
                      className={`flex items-center gap-2 mb-2 p-2 rounded-lg ${roleInfo.isPrimary ? 'bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200' : 'bg-gray-100 border border-gray-200'}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {roleInfo.role === 'solicitante' ?
                        <User className="h-5 w-5 text-blue-600" /> :
                        <Briefcase className="h-5 w-5 text-purple-600" />
                      }
                      <span className="font-semibold">{roleInfo.role === 'solicitante' ? 'Solicitante' : 'Z-Worker'}</span>
                      {roleInfo.isPrimary && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500 text-white">Principal</span>}
                      {roleInfo.role === currentUser.currentMode && <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-green-500 text-white">Activo</span>}
                    </motion.div>
                  ))}
                  {pendingRole && (
                    <motion.button
                      onClick={() => handleActivateSecondaryRole(pendingRole)}
                      className="mt-4 w-full bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <UserPlus className="h-5 w-5" />
                      Activar Modo {pendingRole === 'solicitante' ? 'Solicitante' : 'Z-Worker'}
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Columna Derecha: Detalles del Perfil y Edición */}
              <div className="md:w-2/3 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="flex justify-end mb-6">
                  {!isEditing ? (
                    <motion.button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 bg-blue-100 text-blue-700 px-5 py-2 rounded-full font-semibold hover:bg-blue-200 transition-colors duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit className="h-5 w-5" />
                      Editar Perfil
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={handleSaveChanges}
                      className="flex items-center gap-2 bg-green-500 text-white px-5 py-2 rounded-full font-semibold hover:bg-green-600 transition-colors duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Save className="h-5 w-5" />
                      Guardar Cambios
                    </motion.button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Campos de perfil */}
                  {[
                    { label: "Nombre Completo", name: "fullName", icon: User },
                    { label: "Correo Institucional", name: "email", icon: Mail, readOnly: true },
                    { label: "Celular", name: "phone", icon: Phone },
                    { label: "Universidad", name: "university", icon: University, readOnly: true },
                    { label: "Campus o Sede", name: "campus", icon: MapPin },
                    { label: "Carrera", name: "career", icon: Briefcase },
                    { label: "Ciclo o Semestre", name: "semester", icon: GraduationCap },
                  ].map((field, index) => (
                    <div key={index}>
                      <label className="block text-gray-700 text-sm font-bold mb-1 flex items-center gap-2">
                        {field.icon && <field.icon className="h-4 w-4 text-gray-500" />} {field.label}
                      </label>
                      <input
                        type="text"
                        name={field.name}
                        value={editableUser[field.name]}
                        onChange={handleEditChange}
                        readOnly={!isEditing || field.readOnly}
                        className={`shadow-sm appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 transition-all duration-200 ${
                          editErrors[field.name] ? 'border-red-500' : 'border-gray-200'
                        } ${!isEditing || field.readOnly ? 'bg-gray-100' : 'bg-white focus:ring-blue-200 focus:border-blue-300'}`}
                      />
                      {editErrors[field.name] && <p className="text-red-500 text-xs italic mt-1">{editErrors[field.name]}</p>}
                    </div>
                  ))}

                  {(editableUser.primaryRole === 'z-worker' || editableUser.secondaryRole === 'z-worker') && (
                    <div className="sm:col-span-2">
                      <label className="block text-gray-700 text-sm font-bold mb-1 flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-500" /> Habilidades o Servicios
                      </label>
                      <textarea
                        name="skills"
                        value={editableUser.skills || ''}
                        onChange={handleEditChange}
                        readOnly={!isEditing}
                        rows="3"
                        className={`shadow-sm appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 transition-all duration-200 ${
                          editErrors.skills ? 'border-red-500' : 'border-gray-200'
                        } ${!isEditing ? 'bg-gray-100' : 'bg-white focus:ring-purple-200 focus:border-purple-300'}`}
                      ></textarea>
                      {editErrors.skills && <p className="text-red-500 text-xs italic mt-1">{editErrors.skills}</p>}
                    </div>
                  )}

                  {isEditing && (
                    <AnimatePresence>
                      <motion.div
                        key="password-change-section"
                        className="sm:col-span-2 border-t border-gray-100 pt-6 mt-6"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-red-500" /> Cambiar Contraseña
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-gray-700 text-sm font-bold mb-1">Contraseña Actual</label>
                            <input
                              type="password"
                              name="currentPassword"
                              value={passwordChange.currentPassword}
                              onChange={handlePasswordChange}
                              className={`shadow-sm appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 transition-all duration-200 ${
                                editErrors.currentPassword ? 'border-red-500' : 'border-gray-200'
                              }`}
                            />
                            {editErrors.currentPassword && <p className="text-red-500 text-xs italic mt-1">{editErrors.currentPassword}</p>}
                          </div>
                          <div>
                            <label className="block text-gray-700 text-sm font-bold mb-1">Nueva Contraseña</label>
                            <input
                              type="password"
                              name="newPassword"
                              value={passwordChange.newPassword}
                              onChange={handlePasswordChange}
                              className={`shadow-sm appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200 ${
                                editErrors.newPassword ? 'border-red-500' : 'border-gray-200'
                              }`}
                            />
                            {editErrors.newPassword && <p className="text-red-500 text-xs italic mt-1">{editErrors.newPassword}</p>}
                          </div>
                          <div>
                            <label className="block text-gray-700 text-sm font-bold mb-1">Confirmar Nueva Contraseña</label>
                            <input
                              type="password"
                              name="confirmNewPassword"
                              value={passwordChange.confirmNewPassword}
                              onChange={handlePasswordChange}
                              className={`shadow-sm appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200 ${
                                editErrors.confirmNewPassword ? 'border-red-500' : 'border-gray-200'
                              }`}
                            />
                            {editErrors.confirmNewPassword && <p className="text-red-500 text-xs italic mt-1">{editErrors.confirmNewPassword}</p>}
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  )}

                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileAndSettings;