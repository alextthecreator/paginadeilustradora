'use client';

import { motion } from "framer-motion";
import { FaSpinner, FaCheck } from "react-icons/fa";
import { useRef, useState } from "react";
import { contactFields, validateContact, sendContact, type ContactErrors, type ContactField } from "@/lib/contact-form";
import Image from "next/image";
import ConsentMap from "@/components/ConsentMap";
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
  const formRef = useRef<HTMLFormElement>(null);
  const [fieldErrors, setFieldErrors] = useState<ContactErrors>({});
  const [rateLimited, setRateLimited] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    setSubmitStatus('idle');
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const focusFirstError = () => window.requestAnimationFrame(() => {
    const field = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    field?.focus({ preventScroll: true });
    field?.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    const errors = validateContact(formData);
    setFieldErrors(errors);
    if (Object.keys(errors).length) {
      setSubmitStatus('idle');
      focusFirstError();
      return;
    }
    setRateLimited(false);
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Track form start
    trackEvent(analyticsConfig.events.CONTACT_FORM_START, {
      form_name: 'contact_form',
      page_location: window.location.href,
    });

    try {
      const result = await sendContact(formData);
      if (result.status === 'success') {
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
        setRateLimited(result.status === 'rateLimit');
        setFieldErrors(result.fieldErrors);
        if (Object.keys(result.fieldErrors).length) focusFirstError();
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

  const fieldProps = (field: ContactField) => ({
    id: `contact-${field}`,
    'aria-invalid': Boolean(fieldErrors[field]),
    'aria-describedby': fieldErrors[field] ? `contact-${field}-error` : undefined,
  });
  const fieldError = (field: ContactField) => fieldErrors[field] ? (
    <p id={`contact-${field}-error`} className="contact-field-error">
      {fieldErrors[field] === 'email' ? t.contact.invalidEmail : fieldErrors[field] === 'server' ? t.contact.serverFieldError : t.contact.requiredField}
    </p>
  ) : null;

  const fields: Record<ContactField, { label: string; placeholder: string; autoComplete?: string }> = {
    firstName: { label: `${t.contact.firstNamePlaceholder}*`, placeholder: t.contact.firstNamePlaceholder, autoComplete: 'given-name' },
    surname: { label: `${t.contact.surnamePlaceholder} (${t.contact.optional})`, placeholder: t.contact.surnamePlaceholder, autoComplete: 'family-name' },
    email: { label: t.contact.emailLabel, placeholder: t.contact.emailPlaceholder, autoComplete: 'email' },
    subject: { label: t.contact.subjectLabel, placeholder: t.contact.subjectPlaceholder },
    message: { label: t.contact.messageLabel, placeholder: t.contact.messagePlaceholder },
  };

  const mapEmbedSrc =
    'https://maps.google.com/maps?q=Lelewela%204%2C%2053-505%20Wroc%C5%82aw%2C%20Poland&z=16&output=embed';
  const mapLinkHref =
    'https://maps.google.com/?q=Lelewela+4,+53-505+Wroc%C5%82aw,+Poland';

  return (
    <main className="contact-page bg-brand-dark-teal">
      <div className="page-shell w-full">
        <div className="contact-layout">
          <div className="contact-hero">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="contact-copy w-full min-w-0"
          >
            <h1 className="type-display font-temeraire-display mb-2 text-left text-[#FF8A9D]">
              {t.contact.title}
            </h1>
            <p className="contact-subtitle type-lead font-mencken-regular whitespace-pre-line text-[#FBEAD5]">
              {t.contact.subtitle}
            </p>

            <div className="contact-form-card rounded-2xl bg-brand-vibrant-pink">
              <form ref={formRef} noValidate onSubmit={handleSubmit} aria-busy={isSubmitting} className="space-y-3 sm:space-y-4">
                {contactFields.some(field => fieldErrors[field]) && <p role="alert" className="contact-form-notice">{t.contact.checkFields}</p>}
                <div className="contact-field-grid">
                  {contactFields.map(field => {
                    const common = {
                      ...fieldProps(field), name: field, value: formData[field],
                      onChange: handleInputChange, required: field !== 'surname',
                      placeholder: fields[field].placeholder, className: 'contact-control',
                    };
                    return <div key={field} className={`contact-field${field === 'firstName' || field === 'surname' ? '' : ' contact-field--full'}`}>
                      <label htmlFor={`contact-${field}`} className="contact-field-label">{fields[field].label}</label>
                      {field === 'message' ? <textarea {...common} rows={4} /> : <input {...common} type={field === 'email' ? 'email' : 'text'} autoComplete={fields[field].autoComplete} />}
                      {fieldError(field)}
                    </div>;
                  })}
                </div>

                <div className="mt-4 flex justify-stretch sm:justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="type-btn cursor-pointer disabled:cursor-wait flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl px-8 py-3 font-mencken-bold transition-all duration-300 sm:w-auto"
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
                    role="status"
                    style={{ backgroundColor: '#FBEAD5', color: '#1a4d3a' }}
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
                    role="alert"
                    style={{ backgroundColor: '#FBEAD5', color: '#1a4d3a' }}
                  >
                    {rateLimited ? t.contact.rateLimit : t.contact.error}
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="contact-image-panel relative"
          >
            <Image
              src="https://res.cloudinary.com/dxpdn6xgr/image/upload/f_jpg,pg_1,q_auto,w_1200,c_limit,dpr_auto,fl_progressive/get_in_touch"
              alt={t.contact.imageAlt}
              fill
              className="object-cover object-center"
              sizes="(max-width: 767px) 100vw, (max-width: 1024px) 80vw, min(36rem, 42vw)"
              priority
            />
          </motion.div>
          </div>

          <div className="contact-directions">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="contact-map"
          >
            <ConsentMap title={t.contact.mapTitle} src={mapEmbedSrc} directionsUrl={mapLinkHref} />
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="contact-address"
          >
            <h2 className="contact-address-heading">{t.contact.addressHeading}</h2>
            <address className="contact-address-body">
              {t.contact.addressLines.map((line) => (
                <span key={line} className="contact-address-line">
                  {line}
                </span>
              ))}
              <a
                href={mapLinkHref}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-address-link"
              >
                Google Maps
              </a>
            </address>
          </motion.aside>
          </div>
        </div>
      </div>
    </main>
  );
}
