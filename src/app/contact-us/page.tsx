'use client'
//import ContactForm from '@/components/ContactForm';
import Footer from '@/components/footer';
import Navigation from '@/components/Navigation';
import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslations } from '@/i18n/useTranslations';
import { useRouter } from 'next/navigation';

const ContactPage: React.FC = () => {
    const messages = useTranslations();
    const router = useRouter();

    useEffect(() => {
        console.log("🔧 Setting up HubSpot form submission listener");

        // Listener para capturar el envío del formulario embebido
        const messageHandler = (event: MessageEvent) => {
            // Filtrar mensajes irrelevantes
            if (!event.data || 
                event.data.source === 'react-devtools-bridge' ||
                event.data.source === 'react-devtools-content-script' ||
                event.data.source === 'react-devtools-backend-manager' ||
                event.data.source === 'react-devtools-hook' ||
                event.data.action === 'FB_LOG') { // Filtrar mensajes de Facebook Pixel
                return;
            }

            // Log temporal para debugging - solo mensajes que podrían ser de HubSpot
            console.log("📨 Message received:", event.data, "Origin:", event.origin);

            // Detectar envío del formulario de HubSpot
            if (event.data?.type === "hsFormCallback" &&
                event.data?.eventName === "onFormSubmitted") {
                console.log("✅ Form submitted successfully!", event.data);
                const formId = event.data.id;

                if (formId === "053cd3b5-2374-4e68-953c-5dabb2ca4323") {
                    console.log("🎯 Redirecting to thank-you page");
                    router.push("/thank-you");
                }
            }
        };

        window.addEventListener('message', messageHandler);

        return () => {
            window.removeEventListener('message', messageHandler);
        };
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
                        className={`hs-form-frame transition-opacity duration-300`}
                        data-region="na1"
                        data-form-id="053cd3b5-2374-4e68-953c-5dabb2ca4323"
                        data-portal-id="48421759"
                    ></div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ContactPage;
