import type { Locale } from './index';
import type { Translation } from 'vanilla-cookieconsent';

export const cookieCopy = {
  en: {
    title: 'Your cookie choices',
    description: 'We use essential cookies to keep the shop and your preferences working. With your permission, we can enable Google Analytics and the embedded Google map. You can reject optional cookies and still browse and shop.',
    accept: 'Accept all', reject: 'Reject optional', manage: 'Choose settings', settings: 'Cookie settings', save: 'Save my choices', close: 'Close',
    preferences: 'Choose which optional services you want to allow. You can change your choice at any time using Cookie settings in the footer.',
    necessary: 'Essential', necessaryDescription: 'Required for the shopping cart, checkout, security and remembering your language and cookie choices. These cannot be switched off here. Optional tracking in Ecwid is disabled.',
    analytics: 'Analytics', analyticsDescription: 'Allow Google Analytics to measure visits and use of the website. It is loaded only with your consent and a configured measurement ID.',
    maps: 'Google Maps', mapsDescription: 'Allow the embedded Google map on the Contact page. Loading it connects your browser to Google, which may use cookies or similar technologies.',
    mapBlocked: 'The map is disabled until you allow Google Maps in cookie settings.', mapSettings: 'Choose map settings', mapLink: 'Open directions in Google Maps',
  },
  es: {
    title: 'Tus preferencias de cookies',
    description: 'Usamos cookies esenciales para que funcionen la tienda y tus preferencias. Con tu permiso, podemos activar Google Analytics y el mapa integrado de Google. Puedes rechazar las cookies opcionales y seguir navegando y comprando.',
    accept: 'Aceptar todas', reject: 'Rechazar opcionales', manage: 'Elegir preferencias', settings: 'Preferencias de cookies', save: 'Guardar mis preferencias', close: 'Cerrar',
    preferences: 'Elige qué servicios opcionales quieres permitir. Puedes cambiar tu elección en cualquier momento desde Preferencias de cookies en el pie de página.',
    necessary: 'Esenciales', necessaryDescription: 'Necesarias para el carrito, el pago, la seguridad y para recordar tu idioma y preferencias de cookies. No se pueden desactivar aquí. El seguimiento opcional de Ecwid está desactivado.',
    analytics: 'Analítica', analyticsDescription: 'Permite que Google Analytics mida las visitas y el uso del sitio. Solo se carga con tu consentimiento y un identificador de medición configurado.',
    maps: 'Google Maps', mapsDescription: 'Permite el mapa integrado de Google en la página de contacto. Al cargarlo, tu navegador se conecta con Google, que puede usar cookies o tecnologías similares.',
    mapBlocked: 'El mapa está desactivado hasta que permitas Google Maps en las preferencias de cookies.', mapSettings: 'Elegir preferencias del mapa', mapLink: 'Abrir indicaciones en Google Maps',
  },
  pl: {
    title: 'Twoje ustawienia cookies',
    description: 'Używamy niezbędnych cookies do działania sklepu i zapamiętania Twoich ustawień. Za Twoją zgodą możemy włączyć Google Analytics i osadzoną mapę Google. Możesz odrzucić opcjonalne cookies i nadal przeglądać stronę oraz robić zakupy.',
    accept: 'Akceptuję wszystkie', reject: 'Odrzucam opcjonalne', manage: 'Wybieram ustawienia', settings: 'Ustawienia cookies', save: 'Zapisz mój wybór', close: 'Zamknij',
    preferences: 'Wybierz, na które opcjonalne usługi się zgadzasz. Możesz zmienić wybór w dowolnym momencie przez Ustawienia cookies w stopce.',
    necessary: 'Niezbędne', necessaryDescription: 'Potrzebne do działania koszyka, płatności, bezpieczeństwa oraz zapamiętania języka i wyboru cookies. Nie można ich tutaj wyłączyć. Opcjonalne śledzenie Ecwid jest wyłączone.',
    analytics: 'Analityka', analyticsDescription: 'Pozwala Google Analytics mierzyć odwiedziny i korzystanie ze strony. Usługa uruchamia się tylko po zgodzie i skonfigurowaniu identyfikatora pomiaru.',
    maps: 'Google Maps', mapsDescription: 'Pozwala wyświetlić osadzoną mapę Google na stronie Kontakt. Jej załadowanie łączy przeglądarkę z Google, które może używać cookies lub podobnych technologii.',
    mapBlocked: 'Mapa jest wyłączona do czasu udzielenia zgody na Google Maps w ustawieniach cookies.', mapSettings: 'Wybierz ustawienia mapy', mapLink: 'Otwórz wskazówki w Google Maps',
  },
};

export const cookieTranslations = Object.fromEntries(
  Object.entries(cookieCopy).map(([locale, copy]) => [locale, {
    consentModal: { title: copy.title, description: copy.description, acceptAllBtn: copy.accept, acceptNecessaryBtn: copy.reject, showPreferencesBtn: copy.manage },
    preferencesModal: {
      title: copy.settings, acceptAllBtn: copy.accept, acceptNecessaryBtn: copy.reject, savePreferencesBtn: copy.save, closeIconLabel: copy.close,
      sections: [
        { description: copy.preferences },
        { title: copy.necessary, description: copy.necessaryDescription, linkedCategory: 'necessary' },
        { title: copy.analytics, description: copy.analyticsDescription, linkedCategory: 'analytics' },
        { title: copy.maps, description: copy.mapsDescription, linkedCategory: 'maps' },
      ],
    },
  }]),
) as Record<Locale, Translation>;
