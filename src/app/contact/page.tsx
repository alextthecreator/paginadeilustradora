'use client';

import { motion } from "framer-motion";
import { FaSpinner, FaCheck } from "react-icons/fa";
import { useState } from "react";
import Image from "next/image";
import { trackEvent, trackConversion, analyticsConfig } from "@/lib/analytics";
import { useLanguage } from "@/i18n/LanguageContext";

export default function ContactPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Track form start
    trackEvent(analyticsConfig.events.CONTACT_FORM_START, {
      form_name: 'contact_form',
      page_location: window.location.href,
    });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', `${formData.firstName} ${formData.surname}`);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('_replyto', formData.email);

      const response = await fetch('https://formspree.io/f/xdklqgyo', {
        method: 'POST',
        body: formDataToSend,
        redirect: 'manual', // Handle redirects manually to avoid CORS issues
      });

      // Check if response is ok (status 200-299) or redirect (301, 302)
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      console.log('Response type:', response.type);
      
      // Formspree typically redirects to /thanks on success, which we handle manually
      // Status 0 means the request was successful but redirected (CORS-safe)
      // Status 200-299 means direct success
      if (response.status === 0 || (response.status >= 200 && response.status < 300)) {
        console.log('Form submission successful - email received');
        setSubmitStatus('success');
        setFormData({ firstName: '', surname: '', email: '', subject: '', message: '' });
        
        // Track successful form submission
        trackEvent(analyticsConfig.events.CONTACT_FORM_SUCCESS, {
          form_name: 'contact_form',
          page_location: window.location.href,
        });
        
        // Track conversion
        trackConversion(analyticsConfig.conversions.CONTACT_FORM_SUBMISSION);
      } else {
        console.error('Formspree error response:', response.status, response.statusText);
        setSubmitStatus('error');
        
        // Track form error
        trackEvent(analyticsConfig.events.CONTACT_FORM_ERROR, {
          form_name: 'contact_form',
          error_type: 'server_error',
          page_location: window.location.href,
        });
      }
    } catch (error) {
      console.error('Formspree Error:', error);
      setSubmitStatus('error');
      
      // Track form error
      trackEvent(analyticsConfig.events.CONTACT_FORM_ERROR, {
        form_name: 'contact_form',
        error_type: 'network_error',
        page_location: window.location.href,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-brand-dark-teal">
      <div className="page-shell w-full">
        <div className="contact-layout">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full min-w-0"
          >
            <h1 className="type-display font-temeraire-display mb-2 pb-5 text-left text-[#FF8A9D]">
              {t.contact.title}
            </h1>


            <div className="contact-form-card rounded-2xl bg-brand-vibrant-pink">
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="type-label font-mencken-bold mb-2 block p-1 text-[#1a4d3a]">
                    {t.contact.nameLabel}
                  </label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="min-h-11 w-full rounded-lg border-0 bg-[#FBEAD5] p-3 text-[#1a4d3a]"
                      placeholder={t.contact.firstNamePlaceholder}
                    />
                    <input
                      type="text"
                      name="surname"
                      value={formData.surname}
                      onChange={handleInputChange}
                      required
                      className="min-h-11 w-full rounded-lg border-0 bg-[#FBEAD5] p-3 text-[#1a4d3a]"
                      placeholder={t.contact.surnamePlaceholder}
                    />
                  </div>
                </div>

                <div>
                  <label className="type-label font-mencken-bold mb-2 block p-1 text-[#1a4d3a]">
                    {t.contact.emailLabel}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="min-h-11 w-full rounded-lg border-0 bg-[#FBEAD5] p-3 text-[#1a4d3a]"
                    placeholder={t.contact.emailPlaceholder}
                  />
                </div>

                <div>
                  <label className="type-label font-mencken-bold mb-2 block p-1 text-[#1a4d3a]">
                    {t.contact.subjectLabel}
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="min-h-11 w-full rounded-lg border-0 bg-[#FBEAD5] p-3 text-[#1a4d3a]"
                    placeholder={t.contact.subjectPlaceholder}
                  />
                </div>

                <div>
                  <label className="type-label font-mencken-bold mb-2 block p-1 text-[#1a4d3a]">
                    {t.contact.messageLabel}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full rounded-lg border-0 bg-[#FBEAD5] p-3 text-[#1a4d3a] resize-none"
                    placeholder={t.contact.messagePlaceholder}
                  />
                </div>

                <div className="mt-4 flex justify-stretch sm:justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="type-btn flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl px-8 py-3 font-mencken-bold transition-all duration-300 sm:w-auto"
                    style={{ paddingLeft: '30px', paddingRight: '30px', 
                      backgroundColor: isSubmitting ? '#1a4d3a80' : '#1a4d3a',
                      color: 'white'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        {t.contact.sending}
                      </>
                    ) : (
                      t.contact.send
                    )}
                  </button>
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-lg flex items-center gap-2"
                    style={{ backgroundColor: '#1a4d3a20', color: '#1a4d3a' }}
                  >
                    <FaCheck />
                    {t.contact.success}
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-lg"
                    style={{ backgroundColor: '#ff000020', color: '#ff0000' }}
                  >
                    {t.contact.error}
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>

          {/* Right Column - Contact Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="contact-image-panel"
          >
            <Image
              src="https://res.cloudinary.com/dxpdn6xgr/image/upload/f_auto,q_auto,w_900,h_1125,c_fill,dpr_auto,fl_progressive/toska-cr/contact/get_in_touch.jpg"
              alt={t.contact.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
              priority
            />
          </motion.div>
        </div>
      </div>
    </main>
  );
}
