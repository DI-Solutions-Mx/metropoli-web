'use client'
//import ContactForm from '@/components/ContactForm';
import Footer from '@/components/footer';
import Navigation from '@/components/Navigation';
import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useTranslations } from '@/i18n/useTranslations';
import { useRouter } from 'next/navigation';

// Declarar el tipo global de HubSpot
declare global {
    interface Window {
        hbspt?: {
            forms: {
                create: (options: {
                    region: string;
                    portalId: string;
                    formId: string;
                    target: string;
                    onFormSubmitted?: () => void;
                    onFormReady?: () => void;
                }) => void;
            };
        };
    }
}

const ContactPage: React.FC = () => {
    const messages = useTranslations();
    const router = useRouter();
    const formContainerRef = useRef<HTMLDivElement>(null);
    const formCreated = useRef(false);
    const scriptLoaded = useRef(false);

    useEffect(() => {
        console.log("🔧 Initializing HubSpot form with SDK");

        // Función para cargar el script de HubSpot
        const loadHubSpotScript = () => {
            return new Promise<void>((resolve, reject) => {
                // Verificar si ya existe el script
                if (document.querySelector('script[src*="js.hsforms.net"]')) {
                    console.log("📦 HubSpot script already exists");
                    if (window.hbspt) {
                        resolve();
                    } else {
                        // Esperar a que se cargue
                        const checkInterval = setInterval(() => {
                            if (window.hbspt) {
                                clearInterval(checkInterval);
                                resolve();
                            }
                        }, 100);
                        
                        setTimeout(() => {
                            clearInterval(checkInterval);
                            reject(new Error("Script exists but hbspt not available"));
                        }, 5000);
                    }
                    return;
                }

                console.log("📥 Loading HubSpot script...");
                const script = document.createElement('script');
                script.src = 'https://js.hsforms.net/forms/embed/v2.js';
                script.async = true;
                script.defer = true;
                
                script.onload = () => {
                    console.log("✅ HubSpot script loaded");
                    // Esperar un momento para que se inicialice
                    const checkInterval = setInterval(() => {
                        if (window.hbspt) {
                            clearInterval(checkInterval);
                            scriptLoaded.current = true;
                            resolve();
                        }
                    }, 100);
                    
                    setTimeout(() => {
                        clearInterval(checkInterval);
                        if (!window.hbspt) {
                            reject(new Error("Script loaded but hbspt not available"));
                        }
                    }, 5000);
                };
                
                script.onerror = () => {
                    console.error("❌ Failed to load HubSpot script");
                    reject(new Error("Failed to load script"));
                };
                
                document.body.appendChild(script);
            });
        };

        // Función para crear el formulario
        const createForm = () => {
            if (window.hbspt && formContainerRef.current && !formCreated.current) {
                console.log("✨ Creating HubSpot form...");
                formCreated.current = true;

                try {
                    window.hbspt.forms.create({
                        region: "na1",
                        portalId: "48421759",
                        formId: "053cd3b5-2374-4e68-953c-5dabb2ca4323",
                        target: "#hubspot-form-container",
                        onFormReady: () => {
                            console.log("📋 Form is ready");
                        },
                        onFormSubmitted: () => {
                            console.log("✅ Form submitted successfully!");
                            console.log("🎯 Redirecting to thank-you page...");
                            router.push("/thank-you");
                        }
                    });
                } catch (error) {
                    console.error("❌ Error creating form:", error);
                    formCreated.current = false;
                }
            }
        };

        // Cargar script y crear formulario
        loadHubSpotScript()
            .then(() => {
                createForm();
            })
            .catch((error) => {
                console.error("❌ HubSpot SDK failed to load:", error);
            });

    }, [router]);

    return (
        <div style={
            {

                background: '#d1d7e1 url(/waves.png) center/cover no-repeat',
            }
        }>
            <Navigation />
            <div className="max-w-[800px] mx-auto pt-[100px]">
                <div className='px-[40px] mb-[-40px] '>
                    <motion.h1
                        className="text-[32px] md:text-[40px] font-normal leading-[48px] bg-gradient-to-r from-[#091934] to-[#1C6EF6] bg-clip-text text-transparent"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                            duration: 0.8,
                            ease: [0.16, 1, 0.3, 1]
                        }}
                    >
                        {messages.contactFormTitle}
                    </motion.h1>
                    <motion.p
                        className="text-[#3b3b3b] mb-8 md:mb-12 text-base md:text-lg max-w-[600px] whitespace-pre-line"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.2,
                            ease: [0.16, 1, 0.3, 1]
                        }}
                    >
                        {messages.contactFormDescription}
                    </motion.p>
                </div>

                <div className="relative min-h-[600px]">
                    <div 
                        id="hubspot-form-container" 
                        ref={formContainerRef}
                        className="transition-opacity duration-300"
                    ></div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ContactPage;
