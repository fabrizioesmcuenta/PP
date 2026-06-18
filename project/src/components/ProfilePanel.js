import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, University, MapPin, Briefcase, GraduationCap, Phone, Clock, Camera, Save, Edit, Lock, Eye, EyeOff } from 'lucide-react';

const ProfilePanel = ({ isOpen, onClose, user, onUpdateUser, onChangeModeRequest }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [passwordChange, setPasswordChange] = useState({ current: '', new: '', confirmNew: '' });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef(null);
  const [editSuccess, setEditSuccess] = useState(false);

  React.useEffect(() => {
    setEditedUser(user);
    setPasswordChange({ current: '', new: '', confirmNew: '' });
    setPasswordErrors({});
    setEditSuccess(false);
  }, [user, isOpen]);

  if (!user) return null;

  const getUserInitials = (fullName) => {
    if (!fullName) return '';
    const names = fullName.split(' ').filter(Boolean);
    if (names.length === 0) return '';
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordChange(prev => ({ ...prev, [name]: value }));
    setPasswordErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedUser(prev => ({ ...prev, profilePic: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedUser(prev => ({ ...prev, profilePicPreview: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setEditedUser(prev => ({ ...prev, profilePic: null, profilePicPreview: null }));
    }
  };

  const validatePasswordChange = () => {
    let newErrors = {};
    if (!passwordChange.current) newErrors.current = "Ingresa tu contraseña actual.";
    // Simple validation for demo. In real app, current password would be validated against stored hash.
    if (passwordChange.current !== user.password) newErrors.current = "Contraseña actual incorrecta.";
    if (!passwordChange.new) newErrors.new = "Ingresa tu nueva contraseña.";
    if (passwordChange.new.length < 6) newErrors.new = "La nueva contraseña debe tener al menos 6 caracteres.";
    if (!passwordChange.confirmNew) newErrors.confirmNew = "Confirma tu nueva contraseña.";
    if (passwordChange.new !== passwordChange.confirmNew) newErrors.confirmNew = "Las nuevas contraseñas no coinciden.";
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = () => {
    if (isEditing) {
        let updatedUser = { ...editedUser };
        // Si hay cambios de contraseña, validarlos
        if (passwordChange.current || passwordChange.new || passwordChange.confirmNew) {
            if (validatePasswordChange()) {
                updatedUser.password = passwordChange.new; // Actualizar contraseña
            } else {
                return; // No guardar si hay errores de contraseña
            }
        }
        // Llamar a la función de actualización en App.js
        onUpdateUser(updatedUser);
        setIsEditing(false);
        setPasswordChange({ current: '', new: '', confirmNew: '' });
        setEditSuccess(true);
        setTimeout(() => setEditSuccess(false), 2000); // Ocultar mensaje de éxito
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
            className="bg-white rounded-3xl p-8 shadow-2xl relative w-full lg:max-w-4xl max-h-[90vh] overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-8"
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

            {editSuccess && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center py-3 rounded-t-3xl text-sm font-semibold"
                >
                    ¡Cambios guardados con éxito!
                </motion.div>
            )}

            {/* Columna de Perfil (Avatar y Roles) */}
            <div className="md:col-span-1 flex flex-col items-center text-center p-6 border-r border-gray-100">
                <div className="relative mb-6">
                    {editedUser.profilePicPreview ? (
                        <img
                            src={editedUser.profilePicPreview}
                            alt="Foto de perfil"
                            className="w-32 h-32 rounded-full object-cover border-4 border-blue-400 shadow-lg"
                        />
                    ) : (
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center text-5xl font-bold border-4 border-blue-400 shadow-lg">
                            {getUserInitials(editedUser.fullName)}
                        </div>
                    )}
                    {isEditing && (
                        <>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 shadow-md hover:bg-blue-600 transition-colors duration-200"
                            >
                                <Camera className="h-5 w-5" />
                            </button>
                        </>
                    )}
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-2">{editedUser.fullName}</h3>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${editedUser.primaryRole === 'z-worker' ? 'bg-purple-200 text-purple-800' : 'bg-blue-200 text-blue-800'}`}>
                        {editedUser.primaryRole === 'z-worker' ? 'Z-Worker Principal' : 'Solicitante Principal'}
                    </span>
                    {editedUser.secondaryRole && (
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${editedUser.secondaryRole === 'z-worker' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                            {editedUser.secondaryRole === 'z-worker' ? 'Z-Worker Secundario' : 'Solicitante Secundario'}
                        </span>
                    )}
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${editedUser.currentMode === 'z-worker' ? 'bg-purple-500 text-white' : 'bg-blue-500 text-white'}`}>
                    Modo Actual: {editedUser.currentMode === 'z-worker' ? 'Z-Worker' : 'Solicitante'}
                </span>

                <motion.button
                    onClick={() => setIsEditing(!isEditing)}
                    className="mt-8 bg-gradient-to-r from-teal-500 to-green-500 text-white px-6 py-3 rounded-full text-base font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {isEditing ? <Save className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
                    {isEditing ? 'Guardar Cambios' : 'Editar Perfil'}
                </motion.button>
            </div>

            {/* Columna de Detalles del Perfil y Edición */}
            <div className="md:col-span-2 p-6">
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
                    Detalles de la Cuenta
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                        <Mail className="h-5 w-5 text-blue-500" />
                        {isEditing ? (
                            <input type="email" name="email" value={editedUser.email} onChange={handleChange} className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500" />
                        ) : (
                            <span>{user.email}</span>
                        )}
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                        <Phone className="h-5 w-5 text-purple-500" />
                        {isEditing ? (
                            <input type="tel" name="phone" value={editedUser.phone} onChange={handleChange} className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500" />
                        ) : (
                            <span>{user.phone}</span>
                        )}
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                        <University className="h-5 w-5 text-green-500" />
                        <span>{user.university}</span>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                        <MapPin className="h-5 w-5 text-yellow-500" />
                        {isEditing ? (
                            <input type="text" name="campus" value={editedUser.campus} onChange={handleChange} className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500" />
                        ) : (
                            <span>{user.campus}</span>
                        )}
                    </div>
                     <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                        <GraduationCap className="h-5 w-5 text-red-500" />
                        {isEditing ? (
                            <input type="text" name="career" value={editedUser.career} onChange={handleChange} className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500" />
                        ) : (
                            <span>{user.career}</span>
                        )}
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                        <Clock className="h-5 w-5 text-indigo-500" />
                        {isEditing ? (
                            <input type="text" name="semester" value={editedUser.semester} onChange={handleChange} className="w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500" />
                        ) : (
                            <span>{user.semester}</span>
                        )}
                    </div>
                </div>

                {isEditing && (
                    <div className="border-t border-gray-100 pt-6 mt-6">
                        <h4 className="font-bold text-gray-800 mb-4">Actualizar Contraseña</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Actual</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="current"
                                        value={passwordChange.current}
                                        onChange={handlePasswordChange}
                                        className={`shadow-sm appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-100 ${passwordErrors.current ? 'border-red-500' : 'border-gray-200'}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {passwordErrors.current && <p className="text-red-500 text-xs italic mt-1">{passwordErrors.current}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Nueva</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="new"
                                        value={passwordChange.new}
                                        onChange={handlePasswordChange}
                                        className={`shadow-sm appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-100 ${passwordErrors.new ? 'border-red-500' : 'border-gray-200'}`}
                                    />
                                     <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {passwordErrors.new && <p className="text-red-500 text-xs italic mt-1">{passwordErrors.new}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Confirmar Nueva</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="confirmNew"
                                        value={passwordChange.confirmNew}
                                        onChange={handlePasswordChange}
                                        className={`shadow-sm appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-100 ${passwordErrors.confirmNew ? 'border-red-500' : 'border-gray-200'}`}
                                    />
                                     <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {passwordErrors.confirmNew && <p className="text-red-500 text-xs italic mt-1">{passwordErrors.confirmNew}</p>}
                            </div>
                        </div>
                    </div>
                )}


                {(user.primaryRole === 'z-worker' || user.secondaryRole === 'z-worker') && editedUser.isZWorkerActive && (
                    <div className="border-t border-gray-100 pt-6 mt-6">
                        <h4 className="font-bold text-gray-800 mb-4">Habilidades de Z-Worker</h4>
                        {isEditing ? (
                            <textarea
                                name="skills"
                                value={editedUser.skills}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Describe las habilidades o servicios que puedes ofrecer (ej. Clases de Cálculo, Edición de videos)"
                                className="shadow-sm appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-100 border-gray-200"
                            ></textarea>
                        ) : (
                            <p className="text-gray-600 leading-relaxed italic">{user.skills || 'Aún no has registrado tus habilidades.'}</p>
                        )}
                    </div>
                )}

                <div className="border-t border-gray-100 pt-6 mt-6">
                    <h4 className="font-bold text-gray-800 mb-4">Información Adicional</h4>
                    <p className="text-gray-600">Miembro desde: {user.createdAt}</p>
                </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfilePanel;