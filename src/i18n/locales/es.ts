import type en from './en';

// TODO: Replace with your Spanish translations
const es: typeof en = {
  nav: {
    about: 'Sobre mí',
    work: 'Mi trabajo',
    shop: 'Tienda',
    calendar: 'Calendario',
    contact: 'Contacto',
  },
  home: {
    myWork: 'Mi trabajo',
    seeAll: 'Ver todo',
    skills: ['diseño gráfico', 'ilustración', 'cerámica', 'macramé'],
    heroAlt: 'Toska CR - cerámica artesanal y trabajo artístico',
  },
  work: {
    title: 'Mi trabajo',
    skills: ['diseño gráfico', 'ilustración', 'cerámica', 'macramé'],
    sections: {
      graphic: 'Diseño gráfico e ilustración',
      pottery: 'Cerámica',
      macrame: 'Macramé',
    },
    pottery: {
      showAll: 'Todas',
      collectionsNavLabel: 'Colecciones de cerámica',
    },
  },
  contact: {
    title: 'Ponte en contacto',
    subtitle: '¿Tienes una pregunta o una idea en mente?\n\n¡Nos encantaría saber de ti! Ya sea una consulta, una pregunta sobre nuestras piezas o un pedido personalizado, escríbenos. Estaremos encantadas de ayudarte a dar vida a tus ideas.',
    nameLabel: 'Nombre y apellido*',
    firstNamePlaceholder: 'Nombre',
    surnamePlaceholder: 'Apellido',
    emailLabel: 'Correo electrónico*',
    emailPlaceholder: 'tu@email.com',
    subjectLabel: 'Asunto*',
    subjectPlaceholder: '¿De qué se trata?',
    messageLabel: 'Mensaje*',
    messagePlaceholder: 'Cuéntame sobre tu proyecto...',
    sending: 'Enviando...',
    send: 'Enviar',
    success: '¡Gracias! Tu mensaje se ha enviado correctamente.',
    error: 'Lo sentimos, ocurrió un error al enviar tu mensaje. Inténtalo de nuevo.',
    addressHeading: 'Dirección',
    addressLines: ['Lelewela 4, Wrocław', '53-505, Poland', 'Local 322'],
    mapTitle: 'Dirección — Lelewela 4, Wrocław',
    imageAlt: 'Ponte en contacto - contacto Toska CR',
  },
  about: {
    aboutMeTitle: 'Sobre mí',
    aboutMeIntro: 'Hola! Soy Gloriana, una costarricense viviendo en Polonia, diseñadora gráfica e ilustradora de profesión y apasionada de crear arte de distintas formas.',
    aboutMeBody: 'Me gradué como licenciada en Diseño Publicitario de la Universidad Veritas de Arte y Diseño de Costa Rica en el año 2012. Después de terminar mis estudios, trabajé por 4 años en agencias de publicidad, en ese tiempo tuve la oportunidad de conocer gente increíble, tuve experiencias muy buenas con varias marcas y clientes, definitivamente fueron años de formación excelentes, pero el mundo de las agencias de publicidad no era para mi.\n\nEn 2017 decidí tomarme un año sabatico, y viajar a Polonia a hacer algo completamente distinto con mi vida. De eso ya hace 9 años…lo que comenzó como una aventura temporal terminó conviertiéndose en mi nuevo hogar. Durante estos años nació la idea de Toska, encontré el amor y también me convertí en la mamá perruna de Augusto (que ahora está del otro lado del arcoirirs) y de Oliver, ellos son mi sostén y mis aliados más fieles.',
    toskaTitle: 'Sobre Toska Art Project',
    toskaIntro: 'Toska nació en Polonia en el 2017, unos meses después de mudarme aquí. Comenzó como la visión lejana de un sueño que ahora, años después, finalmente toma forma y se hace realidad.',
    toskaBody: 'Mis sueños más grandes siempre fueron vivir en otro país y tener mi propio estudio de arte y diseño. Y aunque empezó forma muy tímida, e incluso estuvo en pausa un tiempo, la idea de Toska nunca abandonó mi mente y siempre ha sido una voz dentro de mi cabeza que me inspira y me motiva.\n\nLa palabra Toska significa “sentir nostalgia y anhelo por el lugar en el que naciste” y me pareció una buena palabra para resumir un proyecto que se hace grande y se inspira desde dónde sea que yo esté, pero que tiene sus raíces en Costa Rica, el hogar que me vio crecer.\n\nHasta el momento Toska Art Project se expresa por medio de la ilustración y técnicas artesanales como el macramé y la cerámica, aunque no descarto explorar otras áreas en el futuro, en general, me encanta poder crear cosas nuevas y tener el privilegio de poder hacerlo con mis manos.',
    photoAlt: 'Gloriana - diseñadora gráfica e ilustradora',
    toskaPhotoAlt: 'Toska Art Project - macramé artesanal',
  },
  shop: {
    languageNotice:
      'La tienda está disponible por ahora solo en polaco. Si quieres ver el contenido en otro idioma, usa la traducción automática del navegador.',
  },
  calendar: {
    title: 'Calendario',
    subtitle: 'Talleres, ferias y fechas del estudio.',
    prevMonth: 'Mes anterior',
    nextMonth: 'Mes siguiente',
    today: 'Hoy',
    noEvents: 'No hay eventos este mes.',
    noEventsDay: 'No hay eventos este día.',
    allDay: 'Todo el día',
    loading: 'Cargando calendario...',
    error: 'No se pudo cargar el calendario. Inténtalo de nuevo más tarde.',
    notPublic:
      'Este calendario aún no es público. En la configuración de Google Calendar activa “Hacer público” o pega la dirección iCal secreta en GOOGLE_CALENDAR_ICS_URL.',
    notConfigured:
      'El calendario aún no está conectado. Añade el enlace ICS de Google Calendar en GOOGLE_CALENDAR_ICS_URL.',
    upcoming: 'Eventos',
    location: 'Lugar',
    moreEvents: '+{count} más',
    otherMonth: 'Fuera de este mes',
  },
  footer: {
    socials: 'Redes',
    copyright: 'TODOS LOS DERECHOS RESERVADOS © 2025 TOSKA ART PROJECT',
  },
  language: {
    label: 'Seleccionar idioma',
    en: 'ENG',
    es: 'ESP',
    pl: 'PL',
  },
};

export default es;
