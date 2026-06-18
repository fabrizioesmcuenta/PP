import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import SectionWrapper from './components/SectionWrapper';
import FAQItem from './components/FAQItem';
import AuthModal from './components/AuthModal'; // Renombrado de RegisterModal a AuthModal
import ProfileAndSettings from './components/ProfileAndSettings';
import PublishTaskModal from './components/PublishTaskModal';
import OfferServiceModal from './components/OfferServiceModal';

import { ArrowRight, CheckCircle2, User, Users, Shield, Calendar, CreditCard, Star, MessageSquare, Sparkles, X } from 'lucide-react';

// Función para obtener el usuario autenticado desde localStorage
const getAuthenticatedUser = () => {
    const storedUser = localStorage.getItem('ztech_currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
};

const App = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [defaultAuthType, setDefaultAuthType] = useState('general'); // 'solicitante', 'z-worker', 'general'
    const [currentUser, setCurrentUser] = useState(getAuthenticatedUser()); // Cargar usuario desde localStorage
    const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
    const [isPublishTaskModalOpen, setIsPublishTaskModalOpen] = useState(false);
    const [isOfferServiceModalOpen, setIsOfferServiceModalOpen] = useState(false);

    useEffect(() => {
        // Guardar el usuario en localStorage cada vez que cambie
        if (currentUser) {
            localStorage.setItem('ztech_currentUser', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('ztech_currentUser');
        }
    }, [currentUser]);

    const handleAuthClick = (type) => {
        setDefaultAuthType(type);
        setIsAuthModalOpen(true);
    };

    const handleAuthSuccess = (userData) => {
        setCurrentUser(userData);
        setIsAuthModalOpen(false);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        // Opcional: limpiar usuarios registrados de localStorage si quieres que 'se pierdan' al hacer logout
        // localStorage.removeItem('ztech_users');
    };

    const handleUpdateUser = (updatedUserData) => {
        setCurrentUser(updatedUserData);
        // También actualizar en la "base de datos" simulada de localStorage
        const storedUsers = JSON.parse(localStorage.getItem('ztech_users')) || {};
        if (storedUsers[updatedUserData.email]) {
            storedUsers[updatedUserData.email] = updatedUserData;
            localStorage.setItem('ztech_users', JSON.stringify(storedUsers));
        }
    };

    const handleActivateRole = ({ type, skills, serviceDetails, availability, rate, serviceTypes }) => {
        if (!currentUser) return;

        let updatedUser = { ...currentUser };
        if (type === 'z-worker' && !updatedUser.secondaryRole) {
            updatedUser.secondaryRole = 'z-worker';
            updatedUser.skills = skills;
            updatedUser.serviceDetails = serviceDetails; // Guardar detalles específicos del servicio
            updatedUser.availability = availability;
            updatedUser.rate = rate;
            updatedUser.serviceTypes = serviceTypes;
            setCurrentUser(updatedUser);
            alert('¡Modo Z-Worker activado con éxito!');
        } else if (type === 'solicitante' && !updatedUser.secondaryRole) {
            updatedUser.secondaryRole = 'solicitante';
            setCurrentUser(updatedUser);
            alert('¡Modo Solicitante activado con éxito!');
        }
        handleUpdateUser(updatedUser); // Guardar cambios en localStorage
        setIsOfferServiceModalOpen(false); // Cierra el modal de ofrecer servicio si acaba de activar el rol
        setIsProfileSettingsOpen(false); // Cierra el modal de settings si viene de ahi
    };

    const handleUserAction = (actionType) => {
        switch (actionType) {
            case 'viewProfile':
            case 'settings':
                setIsProfileSettingsOpen(true);
                break;
            case 'toggleMode':
                if (currentUser) {
                    const newMode = currentUser.currentMode === 'solicitante' ? 'z-worker' : 'solicitante';
                    if (!currentUser.secondaryRole && newMode !== currentUser.primaryRole) {
                        // Si intenta cambiar a un rol no activado, no hace nada o muestra alerta
                        alert(`Debes activar el modo ${newMode === 'solicitante' ? 'Solicitante' : 'Z-Worker'} primero.`);
                        return;
                    }
                    setCurrentUser(prev => ({ ...prev, currentMode: newMode }));
                }
                break;
            case 'activateSecondaryRole':
                if (currentUser && !currentUser.secondaryRole) {
                    // Decide qué modal abrir para activar el rol secundario
                    if (currentUser.primaryRole === 'solicitante') {
                        setIsOfferServiceModalOpen(true); // Para activar Z-Worker
                    } else {
                        // Aquí no se necesita modal para activar solicitante, simplemente se cambia el rol
                        handleActivateRole({ type: 'solicitante' });
                    }
                }
                break;
            default:
                break;
        }
    };

    const handleCTAClick = (ctaRole) => {
        if (!currentUser) {
            handleAuthClick(ctaRole);
            return;
        }

        if (ctaRole === 'solicitante') {
            const hasSolicitanteRole = currentUser.primaryRole === 'solicitante' || currentUser.secondaryRole === 'solicitante';
            if (hasSolicitanteRole) {
                if (currentUser.currentMode === 'solicitante') {
                    setIsPublishTaskModalOpen(true);
                } else {
                    // Si está en modo Z-Worker y quiere "Crear Tareas", cambia a modo solicitante y luego abre el modal de publicar
                    handleUserAction('toggleMode'); // Esto cambiará el currentMode o te alertará si no tienes el rol
                    if (currentUser.currentMode !== 'solicitante') {
                        setTimeout(() => setIsPublishTaskModalOpen(true), 100); // Pequeño delay
                    }
                }
            } else {
                // Si no tiene el rol de solicitante activado
                // Abre el modal para activar el rol, en este caso es un simple cambio de estado
                handleActivateRole({ type: 'solicitante' });
            }
        } else if (ctaRole === 'z-worker') {
            const hasZWorkerRole = currentUser.primaryRole === 'z-worker' || currentUser.secondaryRole === 'z-worker';
            if (hasZWorkerRole) {
                if (currentUser.currentMode === 'z-worker') {
                    setIsOfferServiceModalOpen(true);
                } else {
                    handleUserAction('toggleMode'); // Esto cambiará el currentMode o te alertará si no tienes el rol
                    if (currentUser.currentMode !== 'z-worker') {
                         setTimeout(() => setIsOfferServiceModalOpen(true), 100);
                    }
                }
            } else {
                // Si no tiene el rol de Z-Worker activado, abre el modal para pedir habilidades
                setIsOfferServiceModalOpen(true);
            }
        }
    };


    const featureCardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
    };

    const howItWorksSteps = [
        {
            icon: <User className="h-8 w-8 text-blue-600" />,
            title: "Regístrate con tu correo institucional",
            description: "Verificación sencilla para una comunidad segura y de confianza."
        },
        {
            icon: <MessageSquare className="h-8 w-8 text-purple-600" />,
            title: "Publica tu necesidad o servicio",
            description: "Describe lo que necesitas o lo que puedes ofrecer en minutos."
        },
        {
            icon: <Users className="h-8 w-8 text-green-600" />,
            title: "Conecta con otro estudiante",
            description: "Encuentra al match perfecto en tu mismo campus gracias a nuestra geolocalización."
        },
        {
            icon: <CheckCircle2 className="h-8 w-8 text-yellow-600" />,
            title: "Realiza la tarea",
            description: "Colabora y resuelve con rapidez, apoyando a tu comunidad universitaria."
        },
        {
            icon: <CreditCard className="h-8 w-8 text-red-600" />,
            title: "Paga o cobra digitalmente",
            description: "Transacciones seguras y sin efectivo a través de nuestra plataforma."
        },
        {
            icon: <Star className="h-8 w-8 text-indigo-600" />,
            title: "Califica la experiencia",
            description: "Construye una comunidad confiable con tu opinión y reputación."
        },
    ];

    const benefitsData = [
        {
          icon: <Shield className="h-10 w-10 text-blue-500" />,
          title: "Seguridad Verificada",
          description: "Solo estudiantes UCV con correo institucional pueden unirse. Di adiós a los extraños."
        },
        {
          icon: <Users className="h-10 w-10 text-purple-500" />,
          title: "Comunidad Cerrada",
          description: "Un espacio exclusivo para la confianza y el apoyo entre compañeros de campus."
        },
        {
          icon: <Calendar className="h-10 w-10 text-emerald-500" />,
          title: "Geolocalización",
          description: "Encuentra ayuda o trabajos cerca de ti, justo en tu campus o alrededores."
        },
        {
          icon: <Star className="h-10 w-10 text-amber-500" />,
          title: "Sistema de Reputación",
          description: "Califica y sé calificado para construir un perfil de confianza."
        },
        {
          icon: <CreditCard className="h-10 w-10 text-rose-500" />,
          title: "Pagos Digitales Seguros",
          description: "Olvídate del efectivo. Transacciones fáciles y protegidas con un click."
        },
        {
          icon: <MessageSquare className="h-10 w-10 text-indigo-500" />,
          title: "Soporte al Usuario",
          description: "Siempre estamos aquí para ayudarte con cualquier duda o inconveniente."
        }
      ];

      const faqs = [
        {
          question: "¿Qué es Z-Tech?",
          answer: "Z-Tech es una plataforma digital que conecta a estudiantes universitarios del mismo campus para que puedan ofrecer y encontrar microservicios, como ayuda con tareas, encargos logísticos o apoyo académico, a cambio de una retribución económica."
        },
        {
          question: "¿Es seguro usar Z-Tech?",
          answer: "¡Absolutamente! En Z-Tech, la seguridad es nuestra prioridad. Solo puedes registrarte con tu correo institucional, garantizando que todos en la plataforma son estudiantes verificados de tu campus. Además, contamos con un sistema de reputación, pagos digitales seguros y soporte al usuario para cualquier eventualidad."
        },
        {
          question: "¿Cómo puedo empezar a ganar dinero en Z-Tech?",
          answer: "Es muy fácil. Una vez registrado y verificado con tu correo institucional, puedes crear un perfil de 'Z-Worker' y publicar los servicios que puedes ofrecer. Cuando un compañero de campus necesite tu ayuda, te contactará, y una vez completada la tarea, recibirás tu pago digitalmente."
        },
        {
          question: "¿Qué tipo de microservicios puedo encontrar o ofrecer?",
          answer: "Z-Tech está diseñado para microservicios que faciliten la vida universitaria. Esto incluye desde apoyo académico (clases de refuerzo, revisión de trabajos), encargos logísticos (recoger un paquete, llevar algo a otra facultad), hasta gestiones personales o tareas rápidas que requieran poca inversión de tiempo. ¡Las posibilidades son muchas!"
        },
        {
          question: "¿Z-Tech es solo para la Universidad César Vallejo (UCV)?",
          answer: "En su etapa inicial (MVP), Z-Tech está enfocado en la Universidad César Vallejo (UCV) para asegurar una experiencia óptima y poder crecer de manera controlada. Sin embargo, nuestro objetivo es expandirnos a más universidades en el futuro cercano."
        }
      ];

    return (
        <div className="font-sans antialiased text-gray-900">
            <Header
                onAuthClick={handleAuthClick}
                onLogout={handleLogout}
                currentUser={currentUser}
                onUserAction={handleUserAction}
            />
            <Hero
                onAuthClick={handleAuthClick}
                currentUser={currentUser}
                onUserAction={handleUserAction}
                onCTAClick={handleCTAClick}
            />

            {/* Sección del Problema */}
            <SectionWrapper id="problema" className="bg-white">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <motion.h2
                        className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700"
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        ¿Te suena familiar? El día a día universitario es un caos.
                    </motion.h2>
                    <motion.p
                        className="text-xl text-gray-600 mb-12"
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        Entre clases, proyectos y vida social, el tiempo es oro y a veces ¡simplemente no alcanza!
                    </motion.p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div
                            variants={featureCardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.4 }}
                            className="bg-red-50 border-red-200 p-8 rounded-2xl shadow-lg"
                        >
                            <h3 className="text-2xl font-bold text-red-700 mb-3">Falta de Tiempo</h3>
                            <p className="text-gray-600">Necesitas ayuda rápida con un encargo o una tarea ¡pero no hay horas en el día!</p>
                        </motion.div>
                        <motion.div
                            variants={featureCardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{ delay: 0.2, ...featureCardVariants.visible.transition }}
                            className="bg-green-50 border-green-200 p-8 rounded-2xl shadow-lg"
                        >
                            <h3 className="text-2xl font-bold text-green-700 mb-3">Ingresos Extra</h3>
                            <p className="text-gray-600">Buscas una forma flexible y segura de ganar dinero mientras estudias.</p>
                        </motion.div>
                        <motion.div
                            variants={featureCardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{ delay: 0.4, ...featureCardVariants.visible.transition }}
                            className="bg-yellow-50 border-yellow-200 p-8 rounded-2xl shadow-lg"
                        >
                            <h3 className="text-2xl font-bold text-yellow-700 mb-3">Ayuda Confiable</h3>
                            <p className="text-gray-600">Es difícil encontrar apoyo rápido y de confianza entre tanto contacto efímero.</p>
                        </motion.div>
                    </div>
                </div>
            </SectionWrapper>

            {/* Sección Qué es Z-Tech */}
            <SectionWrapper id="que-es" className="bg-indigo-50">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <motion.h2
                        className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700"
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        Z-Tech: La Plataforma que Conecta Tu Campus
                    </motion.h2>
                    <motion.p
                        className="text-xl text-gray-700 leading-relaxed mb-10"
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        Imagina un lugar donde todos los estudiantes de tu universidad se apoyan mutuamente.
                        <span className="font-bold text-blue-600 ml-2">Z-Tech es esa comunidad.</span>
                        Un puente digital para que recibas ayuda o generes ingresos, ¡todo dentro del ambiente universitario que ya conoces y confías!
                    </motion.p>
                    <motion.button
                        onClick={() => handleAuthClick('general')}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
                    >
                        Descubre los Microservicios <ArrowRight className="h-5 w-5 ml-2" />
                    </motion.button>
                </div>
            </SectionWrapper>

            {/* Sección Cómo funciona */}
            <SectionWrapper id="como-funciona" className="bg-white">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <motion.h2
                        className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600"
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        La Magia de Z-Tech en 6 Pasos Sencillos
                    </motion.h2>
                    <motion.p
                        className="text-xl text-gray-600 mb-12"
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        Conectar nunca fue tan fácil. Sigue estos pasos y empieza a ser parte de la comunidad.
                    </motion.p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-x-16 max-w-3xl mx-auto">
                        {howItWorksSteps.map((step, index) => (
                            <motion.div
                                key={index}
                                className="flex flex-col items-center text-center p-6 rounded-2xl shadow-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-100"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
                            >
                                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl font-bold text-gray-800 border-4 border-blue-400 mb-4 shadow-md">
                                    {index + 1}
                                </div>
                                <div className="mb-4 p-3 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-600">
                                    {step.icon}
                                </div>
                                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700 mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-gray-700 leading-relaxed">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </SectionWrapper>


            {/* Sección de servicios disponibles */}
            <SectionWrapper id="servicios" className="bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="container mx-auto px-4 text-center max-w-5xl">
                    <motion.h2
                        className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-700"
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        Amplía tus Posibilidades: Descubre Nuestros Servicios
                    </motion.h2>
                    <motion.p
                        className="text-xl text-gray-700 mb-12"
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        Desde ayuda académica hasta pequeños encargos, Z-Tech tiene lo que necesitas.
                    </motion.p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "Encargos Logísticos", description: "Necesitas que alguien recoja un paquete, lleve un documento, o haga una compra rápida en el campus.", icon: <CheckCircle2 className="h-8 w-8 text-blue-600" /> },
                            { title: "Apoyo Académico", description: "Refuerzo para exámenes, ayuda con tareas específicas, tutorías individuales o grupales.", icon: <Users className="h-8 w-8 text-purple-600" /> },
                            { title: "Gestiones Personales", description: "Ayuda con trámites, reserva de espacios, organización de eventos o recados diarios.", icon: <User className="h-8 w-8 text-green-600" /> },
                            { title: "Tareas Rápidas", description: "Todo aquello que te quite tiempo y otro estudiante pueda resolver en un instante.", icon: <Shield className="h-8 w-8 text-yellow-600" /> },
                            { title: "Recados dentro del Campus", description: "Desde buscar un libro en la biblioteca hasta llevar un café. ¡Simplifica tu día!", icon: <Calendar className="h-8 w-8 text-red-600" /> },
                            { title: "Micro-emprendimientos", description: "Ofrece tus habilidades únicas a la comunidad y monetiza tu talento. Diseña un flyer, edita un video, etc.", icon: <Sparkles className="h-8 w-8 text-indigo-600" /> },
                        ].map((service, index) => (
                            <motion.div
                                key={index}
                                variants={featureCardVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{ delay: index * 0.1, ...featureCardVariants.visible.transition }}
                                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-left z-10"
                                whileHover={{ scale: 1.03, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
                            >
                                <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full inline-flex mb-4">
                                    {service.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">{service.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{service.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </SectionWrapper>

            {/* Sección dividida para dos tipos de usuario */}
            <SectionWrapper id="para-quien" className="bg-white">
                <div className="container mx-auto px-4 text-center max-w-5xl">
                    <motion.h2
                        className="text-4xl font-extrabold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-green-700"
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        Ayuda y Oportunidades para Todos
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <motion.div
                            variants={featureCardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.4 }}
                            className="bg-blue-50 border-blue-200 text-left p-10 flex flex-col items-start"
                        >
                            <div className="p-4 bg-blue-200 rounded-full inline-flex mb-6">
                                <Users className="h-10 w-10 text-blue-700" />
                            </div>
                            <h3 className="text-3xl font-bold text-blue-800 mb-4">Para quien necesita ayuda</h3>
                            <p className="text-gray-700 text-lg leading-relaxed mb-6">
                                ¿Atascado con un trabajo, necesitas un recado o simplemente no tienes tiempo? Publica tu necesidad en Z-Tech y deja que la comunidad de tu campus te eche una mano. Rápido, seguro y confiable.
                            </p>
                            <motion.button
                                onClick={() => handleCTAClick('solicitante')}
                                className="bg-blue-600 text-white px-7 py-3 rounded-full text-base font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Publicar una Tarea <ArrowRight className="h-4 w-4" />
                            </motion.button>
                        </motion.div>

                        <motion.div
                            variants={featureCardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{ delay: 0.2, ...featureCardVariants.visible.transition }}
                            className="bg-purple-50 border-purple-200 text-left p-10 flex flex-col items-start"
                        >
                            <div className="p-4 bg-purple-200 rounded-full inline-flex mb-6">
                                <CreditCard className="h-10 w-10 text-purple-700" />
                            </div>
                            <h3 className="text-3xl font-bold text-purple-800 mb-4">Para quien quiere generar ingresos</h3>
                            <p className="text-gray-700 text-lg leading-relaxed mb-6">
                                ¿Tienes tiempo libre y quieres ganar dinero extra? Ofrece tus habilidades, ayuda a tus compañeros y cobra por tus servicios. Con Z-Tech, el campus se convierte en tu fuente de ingresos flexible y segura.
                            </p>
                            <motion.button
                                onClick={() => handleCTAClick('z-worker')}
                                className="bg-purple-600 text-white px-7 py-3 rounded-full text-base font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Ofrecer mis Servicios <ArrowRight className="h-4 w-4" />
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </SectionWrapper>

            {/* Sección de seguridad y confianza */}
            <SectionWrapper id="seguridad" className="bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="container mx-auto px-4 text-center max-w-5xl">
                    <motion.h2
                        className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-teal-700"
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        Tu Tranquilidad es Nuestra Prioridad
                    </motion.h2>
                    <motion.p
                        className="text-xl text-gray-700 mb-12"
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        En Z-Tech, construimos confianza con cada interacción.
                    </motion.p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {benefitsData.map((benefit, index) => (
                            <motion.div
                                key={index}
                                variants={featureCardVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{ delay: index * 0.1, ...featureCardVariants.visible.transition }}
                                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-left z-10"
                                whileHover={{ scale: 1.03, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
                            >
                                <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full inline-flex mb-4">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">{benefit.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </SectionWrapper>

            {/* Sección comparativa entre Z-Tech y grupos informales */}
            <SectionWrapper id="comparativa" className="bg-white">
                <div className="container mx-auto px-4 text-center max-w-5xl">
                    <motion.h2
                        className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-red-700"
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        ¿Grupos de WhatsApp o Z-Tech? La Elección es Clara.
                    </motion.h2>
                    <motion.p
                        className="text-xl text-gray-600 mb-12"
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        Adiós al caos, hola a la eficiencia, la seguridad y la confianza verificada.
                    </motion.p>

                    <div className="flex flex-col md:flex-row gap-8 items-stretch">
                        {/* Tarjeta Z-Tech */}
                        <motion.div
                            variants={featureCardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            className="flex-1 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-300 p-10 text-left shadow-2xl relative overflow-hidden"
                            whileHover={{ scale: 1.03, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                        >
                            <div className="absolute top-0 left-0 w-full h-full bg-blue-100 opacity-20 transform -skew-y-6 -translate-y-1/2"></div>
                            <div className="relative z-10">
                                <h3 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                    Z-Tech
                                </h3>
                                <p className="text-xl text-gray-700 mb-8 font-semibold">Tu plataforma inteligente y segura.</p>
                                <ul className="space-y-4 text-gray-700 text-lg">
                                    <li className="flex items-center gap-3">
                                        <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                                        <span>Solo estudiantes UCV verificados.</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                                        <span>Pagos digitales seguros y transparentes.</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                                        <span>Sistema de reputación y calificaciones.</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                                        <span>Geolocalización para encontrar ayuda cerca.</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                                        <span>Interfaz limpia y organizada.</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                                        <span>Soporte al usuario dedicado.</span>
                                    </li>
                                </ul>
                            </div>
                        </motion.div>

                        {/* Tarjeta Grupos Informales */}
                        <motion.div
                            variants={featureCardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ delay: 0.2, ...featureCardVariants.visible.transition }}
                            className="flex-1 bg-white rounded-2xl border-2 border-gray-200 p-10 text-left shadow-lg relative overflow-hidden"
                            whileHover={{ scale: 1.03, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                        >
                            <div className="absolute top-0 right-0 w-full h-full bg-red-50 opacity-20 transform skew-y-6 translate-y-1/2"></div>
                            <div className="relative z-10">
                                <h3 className="text-4xl font-extrabold mb-4 text-gray-800">
                                    Grupos Informales
                                </h3>
                                <p className="text-xl text-gray-600 mb-8 font-semibold">El caos de siempre.</p>
                                <ul className="space-y-4 text-gray-600 text-lg">
                                    <li className="flex items-center gap-3">
                                        <X className="h-6 w-6 text-red-500 flex-shrink-0" />
                                        <span>Poca o nula verificación de identidad.</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <X className="h-6 w-6 text-red-500 flex-shrink-0" />
                                        <span>Riesgo en pagos (efectivo, transferencias no trazables).</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <X className="h-6 w-6 text-red-500 flex-shrink-0" />
                                        <span>Ausencia de reputación o historial claro.</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <X className="h-6 w-6 text-red-500 flex-shrink-0" />
                                        <span>Dificultad para encontrar quién está cerca.</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <X className="h-6 w-6 text-red-500 flex-shrink-0" />
                                        <span>Chats saturados y difícil seguimiento.</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <X className="h-6 w-6 text-red-500 flex-shrink-0" />
                                        <span>Sin soporte o ayuda oficial.</span>
                                    </li>
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </SectionWrapper>


            {/* Sección de preguntas frecuentes (FAQ) */}
            <SectionWrapper id="faq" className="bg-indigo-50">
                <div className="container mx-auto px-4 max-w-4xl">
                    <motion.h2
                        className="text-4xl font-extrabold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-blue-700"
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        Preguntas Frecuentes
                    </motion.h2>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <FAQItem key={index} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </div>
            </SectionWrapper>


            {/* CTA final fuerte */}
            <SectionWrapper className="bg-gradient-to-br from-blue-700 to-purple-700 text-white text-center">
                <div className="container mx-auto px-4 max-w-4xl">
                    <motion.h2
                        className="text-4xl md:text-5xl font-extrabold mb-6"
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        ¿Listo para Revolucionar tu Vida Universitaria?
                    </motion.h2>
                    <motion.p
                        className="text-xl md:text-2xl mb-10 opacity-90"
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        Únete a la comunidad Z-Tech y haz que tu campus trabaje para ti.
                    </motion.p>
                    <motion.button
                        onClick={() => handleAuthClick('general')}
                        className="bg-white text-blue-700 px-10 py-5 rounded-full text-xl font-bold shadow-2xl hover:shadow-cyan-400/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 mx-auto"
                        whileHover={{ scale: 1.05, boxShadow: '0 15px 30px rgba(255,255,255,0.2)' }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
                    >
                        <img src="https://framerusercontent.com/images/3DtnJkS7pQd2sWlOqW2q2oQ.png" alt="Z-Tech Icon" className="h-6 w-6" />
                        ¡Quiero unirme a Z-Tech!
                    </motion.button>
                </div>
            </SectionWrapper>

            {/* Footer */}
            <footer className="bg-gray-800 text-gray-300 py-12">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-full md:col-span-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                        <img src="https://framerusercontent.com/images/kF5a0gkqK1uG8L9oW9t2y0N6S8.png" alt="Z-Tech Logo" className="h-10 w-auto" />
                        </div>
                        <p className="text-gray-400 leading-relaxed">Conectando estudiantes, potenciando el campus.</p>
                    </div>

                    <div className="text-center md:text-left">
                        <h4 className="font-bold text-white text-lg mb-4">Explora</h4>
                        <ul className="space-y-2">
                            <li><a href="#problema" className="hover:text-blue-400 transition-colors duration-300">Problema</a></li>
                            <li><a href="#como-funciona" className="hover:text-blue-400 transition-colors duration-300">Cómo funciona</a></li>
                            <li><a href="#servicios" className="hover:text-blue-400 transition-colors duration-300">Servicios</a></li>
                            <li><a href="#seguridad" className="hover:text-blue-400 transition-colors duration-300">Seguridad</a></li>
                        </ul>
                    </div>

                    <div className="text-center md:text-left">
                        <h4 className="font-bold text-white text-lg mb-4">Legal</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Términos y Condiciones</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Política de Privacidad</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Aviso Legal</a></li>
                        </ul>
                    </div>

                    <div className="text-center md:text-left">
                        <h4 className="font-bold text-white text-lg mb-4">Contacto</h4>
                        <p className="mb-2">info@ztech.com</p>
                        <div className="flex justify-center md:justify-start gap-4 mt-4">
                            {/* Iconos de Redes Sociales (puedes usar Lucide o SVGs) */}
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">FB</a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">IG</a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">TW</a>
                        </div>
                    </div>
                </div>
                <div className="text-center mt-12 text-gray-500 text-sm">
                    © {new Date().getFullYear()} Z-Tech. Todos los derechos reservados.
                </div>
            </footer>

            {/* Modales */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                defaultAccountType={defaultAuthType}
                onAuthSuccess={handleAuthSuccess}
            />

            <ProfileAndSettings
                isOpen={isProfileSettingsOpen}
                onClose={() => setIsProfileSettingsOpen(false)}
                currentUser={currentUser}
                onUpdateUser={handleUpdateUser}
                onActivateRole={handleActivateRole}
            />

            <PublishTaskModal
                isOpen={isPublishTaskModalOpen}
                onClose={() => setIsPublishTaskModalOpen(false)}
                currentUser={currentUser}
            />

            <OfferServiceModal
                isOpen={isOfferServiceModalOpen}
                onClose={() => setIsOfferServiceModalOpen(false)}
                currentUser={currentUser}
                onActivateRole={handleActivateRole}
            />
        </div>
    );
};

export default App;