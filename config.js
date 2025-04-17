/**
 * Archivo de configuración para las landing pages
 * Contiene configuraciones para múltiples clientes
 */

// Objeto que contiene todas las configuraciones de clientes
const CLIENTS_CONFIG = {
  // Configuración para Dra. Constanza Bossi
  'bossi': {
    // Información de la clínica
    clinic: {
      name: "Dra. Constanza Bossi",
      address: "Santiago del Estero 60, Piso 6, Edificio EMSA, Tucumán",
      whatsapp: "5493812093646", // Sin el signo +
      whatsappDisplay: "381-209-3646",
      depositAmount: 23000,
      consultationPrice: 23000,
    },

    // Configuración de la landing page
    landingPage: {
      mainTitle: "¿Eres candidato para cirugía plástica?",
      subtitle: "Responde unas breves preguntas y descubre si calificas para una consulta con la Dra. Constanza Bossi, cirujana plástica en Tucumán.",
      startButtonText: "Evaluar Gratis Ahora",
      appointmentButtonText: "Ver disponibilidad",
      qualificationTitle: "¡Buenas noticias!",
      qualificationMessage: "Basado en tus respuestas, eres un buen candidato para una consulta con la Dra. Constanza Bossi.",
      qualificationAction: "Agenda una consulta para recibir una evaluación personalizada.",
      priceNote: "Podrías ser candidato para un procedimiento de cirugía plástica. Para comprobarlo, solicita una cita de evaluación.",
      confirmationText: {
        saveAndRedirect: "Al dar clic en <strong>Finalizar</strong>, se guardarán los datos de tu cita y serás redireccionado al WhatsApp oficial de la Dra. Constanza Bossi para confirmar tu cita.",
        depositInfo: "Recuerda que se requiere un pago anticipado de $23.000 para confirmar tu cita. Este pago es obligatorio para reservar tu consulta."
      },
      whatsappMessage: {
        greeting: "Hola, soy {nombre} y me interesa agendar una consulta con la Dra. Constanza Bossi.",
        contactInfo: "*DATOS DE CONTACTO*\n- Nombre: {nombre}\n- WhatsApp: {whatsapp}",
        appointmentInfo: "*CITA SOLICITADA*\n- Fecha: {fecha}\n- Hora: {hora}",
        depositInfo: "*ENTIENDO QUE:*\n- Se requiere un pago anticipado de $23.000 para confirmar mi cita\n- Este pago es obligatorio para reservar la consulta",
        questionnaireInfo: "*RESPUESTAS DEL CUESTIONARIO*\n{respuestas}",
        treatmentType: "cirugía plástica"
      }
    },

    // Colores (CSS variables)
    colors: {
      primary: "#9c27b0",    // Púrpura principal
      secondary: "#f3e5f5",  // Púrpura claro
      accent: "#7b1fa2",     // Púrpura oscuro para hover
      text: "#333333",       // Color de texto principal
      highlight: "#f8f1ff",  // Color de fondo para destacados
    },

    // Webhooks
    webhooks: {
      availability: "https://script.google.com/macros/s/AKfycby5o5wpGUPsaC3IhZgGlV-em6iBWKZCItsvqdkkNRM5xXNd_JtnvYVz3OYdTocn99MlQg/exec?fechasdisponibles=1",
      whatsappValidation: "https://sswebhookss.odontolab.co/webhook/02eb0643-1b9d-4866-87a7-f892d6a945ea",
      formSubmission: "https://script.google.com/macros/s/AKfycbxw9tKSUFVwxghVxUr5RDVK18wzSxHDAk9b7c2XA0cOomzPMWyl5vnZCNPwdoxcNtEJtw/exec"
    },

    // Preguntas del cuestionario
    questions: [
      {
        question: "¿Puedes asistir a nuestra clínica en Santiago del Estero 60, Piso 6, Edificio EMSA, Tucumán?",
        options: ["Sí, puedo asistir", "No, me queda muy lejos"],
        key: "location"
      },
      {
        question: "¿Qué tipo de procedimiento te interesa?",
        options: ["Lipoescultura", "Aumento mamario", "Lipoabdominoplastia", "Tratamientos estéticos no quirúrgicos", "Remodelación costal", "Otro procedimiento"],
        key: "procedure"
      },
      {
        question: "¿Has tenido alguna cirugía plástica anteriormente?",
        options: ["Sí", "No"],
        key: "previous_surgery"
      },
      {
        question: "¿Tienes alguna condición médica que debamos considerar?",
        options: ["No tengo condiciones médicas", "Sí, pero está controlada", "Sí, tengo condiciones médicas activas"],
        key: "medical_condition"
      },
      {
        question: "¿Cuándo te gustaría realizarte el procedimiento?",
        options: ["Lo antes posible", "En los próximos 3 meses", "En los próximos 6 meses", "Solo estoy explorando opciones"],
        key: "timeframe"
      },
      {
        question: "¿Te gustaría tener una mini videollamada de 10 minutos previa a la cita?",
        options: ["Sí, me interesa", "No, prefiero solo la cita presencial"],
        key: "videocall"
      },
      {
        question: "¿Cuál es tu peso aproximado?",
        options: [
          "Menos de 45 kg",
          "45-50 kg",
          "51-55 kg",
          "56-60 kg",
          "61-65 kg",
          "66-70 kg",
          "71-75 kg",
          "76-80 kg",
          "81-85 kg",
          "86-90 kg",
          "91-95 kg",
          "96-100 kg",
          "101-110 kg",
          "111-120 kg",
          "Más de 120 kg"
        ],
        key: "weight"
      },
      {
        question: "¿Cuál es tu altura aproximada?",
        options: [
          "Menos de 1.50 m",
          "1.50-1.55 m",
          "1.56-1.60 m",
          "1.61-1.65 m",
          "1.66-1.70 m",
          "1.71-1.75 m",
          "1.76-1.80 m",
          "1.81-1.85 m",
          "1.86-1.90 m",
          "Más de 1.90 m"
        ],
        key: "height"
      }
    ],

    // Tratamientos y precios
    treatments: [
      {
        name: "Consulta de Evaluación",
        initialPrice: 30000,
        monthlyFee: null,
        isOffer: true,
        highlightText: "$23.000 con pago anticipado (¡Ahorras $7.000!)",
        customNote: "Evaluación personalizada con la Dra. Constanza Bossi"
      },
      {
        name: "Lipoescultura",
        initialPrice: 2800000,
        monthlyFee: null,
        priceFormat: "simple"
      },
      {
        name: "Aumento mamario",
        initialPrice: 2900000,
        monthlyFee: null,
        priceFormat: "simple"
      },
      {
        name: "Lipoabdominoplastia",
        initialPrice: 3200000,
        monthlyFee: null,
        priceFormat: "simple"
      },
      {
        name: "Toxina botulínica (Botox)",
        initialPrice: 300000,
        monthlyFee: null,
        priceFormat: "simple",
        customNote: "Para arrugas de expresión"
      },
      {
        name: "Ácido hialurónico",
        initialPrice: 280000,
        monthlyFee: null,
        priceFormat: "simple",
        customNote: "Precio desde. Varía según zonas a tratar"
      },
      {
        name: "Rinomodelación",
        initialPrice: 320000,
        monthlyFee: null,
        priceFormat: "simple",
        customNote: "Con ácido hialurónico"
      },
      {
        name: "Remodelación costal",
        initialPrice: 4500000,
        monthlyFee: null,
        priceFormat: "simple",
        customNote: "Sin asociación con otros procedimientos"
      }
    ],

    // Configuración de Facebook Pixel
    facebookPixel: {
      id: "1222298238852708", // ID del Pixel de Facebook
      enabledEvents: true // Habilitar eventos de seguimiento
    }
  },
    // Configuración para María Guillén Ortodoncia
    'mgortodoncia': {
    // Información de la clínica
    clinic: {
        name: "María Guillén Ortodoncia",
        address: "Amado Nervo 615-INT 6, Col del Valle, 78200 San Luis Potosí",
        whatsapp: "5214443327418", // Sin el signo +
        whatsappDisplay: "444-332-7418",
        depositAmount: 400,
    },

    // Configuración de la landing page
    landingPage: {
        mainTitle: "¿Eres candidato para ortodoncia?",
        subtitle: "Responde unas preguntas y descubre si la ortodoncia es la solución para ti",
        startButtonText: "Comenzar evaluación",
        appointmentButtonText: "Ver disponibilidad",
        qualificationTitle: "¡Buenas noticias!",
        qualificationMessage: "Basado en tus respuestas, eres un buen candidato para tratamiento de ortodoncia.",
        qualificationAction: "Agenda una valoración para recibir un diagnóstico personalizado.",
        priceNote: "Podrías ser candidato para tratamiento de ortodoncia. Para comprobarlo, solicita una cita de valoración.",
        confirmationText: {
            saveAndRedirect: "Al dar clic en <strong>Finalizar</strong>, se guardarán los datos de tu cita y serás redireccionado al WhatsApp oficial de María Guillén Ortodoncia para confirmar tu cita.",
            depositInfo: "Recuerda que se requiere un depósito de $400 MXN para confirmar tu cita, este monto será deducido del costo total del tratamiento."
        },
        whatsappMessage: {
            greeting: "Hola, soy {nombre} y me interesa agendar una valoración de ortodoncia.",
            contactInfo: "*DATOS DE CONTACTO*\n- Nombre: {nombre}\n- WhatsApp: {whatsapp}",
            appointmentInfo: "*CITA SOLICITADA*\n- Fecha: {fecha}\n- Hora: {hora}",
            depositInfo: "*ENTIENDO QUE:*\n- Se requiere un depósito de ${deposito} para confirmar mi cita\n- Este monto será deducido del costo total del tratamiento",
            questionnaireInfo: "*RESPUESTAS DEL CUESTIONARIO*\n{respuestas}",
            treatmentType: "ortodoncia"
        }
    },

    // Colores (CSS variables)
    colors: {
        primary: "#8e44ad",    // Morado principal
        secondary: "#f3e5f5",  // Morado claro
        accent: "#7d3c98",     // Morado oscuro para hover
        text: "#333333",       // Color de texto principal
        highlight: "#f8f1ff",  // Color de fondo para destacados
    },

    // Webhooks
    webhooks: {
        availability: "https://sswebhookss.odontolab.co/webhook/f424d581-8261-4141-bcd6-4b021cf61d39",
        whatsappValidation: "https://sswebhookss.odontolab.co/webhook/02eb0643-1b9d-4866-87a7-f892d6a945ea",
        formSubmission: "https://sswebhookss.odontolab.co/webhook/7205b659-90da-4485-a394-ac2cd5acf147"
    },

    // Preguntas del cuestionario
    questions: [
        {
            question: "¿Puedes asistir a nuestra clínica en Amado Nervo 615-INT 6, Col del Valle, San Luis Potosí?",
            options: ["Sí, puedo asistir", "No, me queda muy lejos"],
            key: "location"
        },
        {
            question: "¿Tienes dientes chuecos o desalineados que quieras corregir?",
            options: ["Sí, bastante notables", "Sí, pero son leves", "No, mis dientes están bien alineados", "No estoy seguro"],
            key: "alignment"
        },
        {
            question: "¿Tienes problemas de mordida (sobremordida, submordida o mordida cruzada)?",
            options: ["Sí, tengo problemas al masticar", "Sí, pero no me causa molestias", "No tengo problemas de mordida", "No estoy seguro"],
            key: "bite"
        },
        {
            question: "¿Qué tipo de tratamiento de ortodoncia prefieres?",
            options: ["Brackets metálicos (más económicos)", "Brackets estéticos (menos visibles)", "Alineadores transparentes (removibles)", "No tengo preferencia, necesito asesoría"],
            key: "treatment_type"
        },
        {
            question: "¿Cuál es tu principal motivación para buscar tratamiento de ortodoncia?",
            options: ["Mejorar mi sonrisa y estética", "Corregir problemas funcionales al masticar", "Prevenir problemas dentales futuros", "Recomendación de otro dentista"],
            key: "motivation"
        }
    ],

    // Tratamientos y precios
    treatments: [
        {
            name: "Brackets Metálicos Convencionales",
            initialPrice: 6400,
            monthlyFee: 800,
            isOffer: true,
            highlightText: "Inicio: $6,400 (Oferta!)"
        },
        {
            name: "Brackets Estéticos de Resina",
            initialPrice: 10000,
            monthlyFee: 900
        },
        {
            name: "Brackets Estéticos de Zirconio",
            initialPrice: 12000,
            monthlyFee: 1000
        },
        {
            name: "Brackets Autoligado",
            initialPrice: 9000,
            monthlyFee: 900
        },
        {
            name: "Alineadores Transparentes",
            initialPrice: null, // Precio personalizado
            monthlyFee: null,
            customNote: "Se define tras consulta"
        }
    ],

    // Configuración de Facebook Pixel
    facebookPixel: {
        id: "606699411970935", // ID del Pixel de Facebook
        enabledEvents: true // Habilitar eventos de seguimiento
    }
  },

  // Configuración para Implant Center SLP
  'implant-center-slp': {
    // Información de la clínica
    clinic: {
        name: "Implant Center",
        address: "Montes Aconcagua #301 Int. 12 Lomas de Chapultepec, San Luis Potosí",
        whatsapp: "524444746180", // Sin el signo +
        whatsappDisplay: "444-474-6180",
        depositAmount: 400,
    },

    // Configuración de la landing page
    landingPage: {
        mainTitle: "¿Eres candidato para implantes dentales?",
        subtitle: "Responde unas breves preguntas y descubre si calificas para una consulta en Implant Center.",
        startButtonText: "Evaluar Gratis Ahora",
        appointmentButtonText: "Ver disponibilidad para agendar valoración",
        qualificationTitle: "¡Buenas noticias!",
        qualificationMessage: "Basado en tus respuestas, eres un buen candidato para implantes dentales.",
        qualificationAction: "Agenda una valoración para recibir un diagnóstico personalizado.",
        priceNote: "Podrías ser candidato para implantes dentales. Para comprobarlo, solicita una cita de valoración.",
        confirmationText: {
            saveAndRedirect: "Al dar clic en <strong>Finalizar</strong>, se guardarán los datos de tu cita y serás redireccionado al WhatsApp oficial de Implant Center para confirmar tu cita.",
            depositInfo: "Recuerda que se requiere un depósito de $400 MXN para confirmar tu cita, este monto será deducido del costo total del tratamiento."
        },
        whatsappMessage: {
            greeting: "Hola, soy {nombre} y me interesa agendar una valoración para implantes dentales.",
            contactInfo: "*DATOS DE CONTACTO*\n- Nombre: {nombre}\n- WhatsApp: {whatsapp}",
            appointmentInfo: "*CITA SOLICITADA*\n- Fecha: {fecha}\n- Hora: {hora}",
            depositInfo: "*ENTIENDO QUE:*\n- Se requiere un depósito de ${deposito} para confirmar mi cita\n- Este monto será deducido del costo total del tratamiento",
            questionnaireInfo: "*RESPUESTAS DEL CUESTIONARIO*\n{respuestas}",
            treatmentType: "implantes dentales"
        }
    },

    // Colores (CSS variables)
    colors: {
        primary: "#0078bf",    // Azul principal
        secondary: "#e6f3fa",  // Azul claro
        accent: "#005a8c",     // Azul oscuro para hover
        text: "#333333",       // Color de texto principal
        highlight: "#f0f8ff",  // Color de fondo para destacados
    },

    // Webhooks
    webhooks: {
        availability: "https://sswebhookss.odontolab.co/webhook/661ad9bb-8979-44e9-82f4-d22d59f14019",
        whatsappValidation: "https://sswebhookss.odontolab.co/webhook/02eb0643-1b9d-4866-87a7-f892d6a945ea",
        formSubmission: "https://sswebhookss.odontolab.co/webhook/7209a52c-e522-4763-a4cb-262770bd964d"
    },

    // Preguntas del cuestionario
    questions: [
        {
            question: "Estamos ubicados en Montes Aconcagua #301 Int. 12 Lomas de Chapultepec, San Luis Potosí. ¿Puedes asistir personalmente si confirmamos una cita?",
            options: ["Sí, puedo asistir", "No, me queda muy lejos"],
            key: "canAttend"
        },
        {
            question: "¿Cuántos dientes te faltan?",
            options: ["1-2 dientes", "3-5 dientes", "6-10 dientes", "Más de 10 dientes", "Todos o casi todos"],
            key: "missingTeeth"
        },
        {
            question: "¿Hace cuánto tiempo que te faltan dientes?",
            options: ["Menos de 6 meses", "Entre 6 meses y 1 año", "Entre 1 y 3 años", "Más de 3 años"],
            key: "timeSinceLoss"
        },
        {
            question: "¿Tienes diabetes?",
            options: ["No", "Sí, controlada", "Sí, no controlada"],
            key: "hasDiabetes"
        },
        {
            question: "¿Has visitado otra clínica para tener un presupuesto?",
            options: ["Sí", "No"],
            key: "previousConsultation"
        }
        ,
        {
            question: "¿Cuándo quieres avanzar con tu tratamiento?",
            options: ["Lo Más pronto posible", "No lo sé"],
            key: "urgency"
        }
    ],

    // Tratamientos y precios
    treatments: [
        {
            name: "Valoración",
            initialPrice: 800,
            monthlyFee: null,
            isOffer: false,
            priceFormat: "simple" // Formato simple: solo el precio sin "Inicio:"
        },
        {
            name: "Implante con corona",
            initialPrice: 28000,
            monthlyFee: null,
            priceFormat: "simple"
        },
        {
            name: "AllOn4 - Media boca",
            initialPrice: 150000,
            monthlyFee: null,
            priceFormat: "simple"
        },
        {
            name: "AllOn4 - Boca completa",
            initialPrice: 250000,
            monthlyFee: null,
            priceFormat: "simple"
        }
    ],

    // Configuración de Facebook Pixel
    facebookPixel: {
        id: "987654321098765", // ID del Pixel de Facebook
        enabledEvents: true // Habilitar eventos de seguimiento
    }
  },
  'latino': {
    // Información de la clínica
    clinic: {
        name: "Clínica Dental LATINO",
        address: "Edificio Montecarlo: Av. Ordóñez Lasso entre Nogales y Los Cedros, PB Local 004, Cuenca, Ecuador",
        whatsapp: "593990263260", // Número de WhatsApp para confirmaciones (usado como contacto principal aquí)
        whatsappDisplay: "099 026 3260", // Formato local Ecuador
        depositAmount: 15, // Usamos el valor de la valoración con descuento como referencia
    },

    // Configuración de la landing page (Adaptada, ya que el prompt es para un chatbot)
    landingPage: {
        mainTitle: "Tu Sonrisa Ideal en Clínica Dental LATINO",
        subtitle: "Expertos en estética dental y salud oral en Cuenca. Agenda tu cita con el Dr. Kevin Cevallos.",
        startButtonText: "Ver Tratamientos y Agendar", // Llamada a la acción principal
        appointmentButtonText: "Consultar Horarios Disponibles", // Botón para agendar
        qualificationTitle: "¡Listo para tu Cita!", // Texto genérico si no hay quiz
        qualificationMessage: "Estamos listos para ayudarte a conseguir la sonrisa que deseas.",
        qualificationAction: "Agenda tu cita de valoración o limpieza para empezar.",
        priceNote: "Consulta nuestros precios de referencia. El plan exacto se define en tu cita de valoración.", // Nota general sobre precios
        confirmationText: {
            saveAndRedirect: "Al dar clic en <strong>Continuar</strong>, serás redireccionado a nuestro Whatsaoo oficial para confirmar tu cita.", // Texto para la redirección a WhatsApp
            depositInfo: "Para <strong>Valoración</strong>: Se requiere un pago anticipado para confirmar." // Información clara de pagos
        },
        whatsappMessage: {
            greeting: "Hola, soy {nombre} y me interesa agendar una cita en Clínica Dental LATINO.",
            contactInfo: "*DATOS DE CONTACTO*\n- Nombre: {nombre}\n- WhatsApp: {whatsapp}",
            appointmentInfo: "*CITA SOLICITADA*\n- Fecha: {fecha}\n- Hora: {hora}",
            depositInfo: "*INFORMACIÓN DE PAGO*\n- Para confirmar la cita de valoración se requiere un pago anticipado\n- Este monto será deducido del costo total del tratamiento",
            questionnaireInfo: "*RESPUESTAS DEL CUESTIONARIO*\n{respuestas}",
            treatmentType: "dental"
        }
    },

    // Colores (CSS variables) - Ejemplo de paleta
    colors: {
        primary: "#0056b3",    // Azul oscuro
        secondary: "#e0efff",  // Azul muy claro
        accent: "#003d80",     // Azul más oscuro para hover
        text: "#333333",       // Color de texto principal
        highlight: "#f0f7ff",  // Color de fondo para destacados
    },

    // Webhooks (URLs actualizadas según solicitud)
    webhooks: {
        availability: "https://sswebhookss.odontolab.co/webhook/00192cd1-eade-4a78-9216-96f8074a79e3",
        whatsappValidation: "https://sswebhookss.odontolab.co/webhook/02eb0643-1b9d-4866-87a7-f892d6a945ea",
        formSubmission: "https://sswebhookss.odontolab.co/webhook/4e9383e4-7ff8-45be-961d-089c35038043"
    },

    // Preguntas del cuestionario (Ejemplo simple, ya que el prompt no lo detalla)
    questions: [
        {
            question: "¿Puedes asistir a nuestra clínica en Av. Ordóñez Lasso, Cuenca, Ecuador?",
            options: ["Sí, puedo asistir", "No, me queda muy lejos"],
            key: "location"
        },
        {
            question: "¿Cuál es tu principal interés o necesidad dental?",
            options: ["Mejorar la estética de mi sonrisa (diseño, carillas)", "Reemplazar dientes faltantes (implantes)", "Limpieza dental o chequeo general", "Tengo otro problema específico"],
            key: "interest"
        },
        {
            question: "¿Con qué urgencia necesitas tu cita?",
            options: ["Tengo dolor o urgencia", "Quisiera una cita pronto", "Puedo esperar algunas semanas"],
            key: "urgency"
        },
         {
            question: "¿Es tu primera visita a Clínica Dental LATINO?",
            options: ["Sí", "No, ya soy paciente"],
            key: "firstVisit"
        }
    ],

    // Tratamientos y precios (Basados en la información del prompt)
    treatments: [
         {
            name: "Cita de Valoración",
            initialPrice: 15, // Precio base en clínica
            monthlyFee: null,
            isOffer: true, // Marcar como oferta por el descuento
            highlightText: "$15 con pago anticipado", // Texto que explica el descuento
            customNote: "Incluye evaluación, radiografías, fotos y diseño digital si aplica."
        },
        {
            name: "Limpieza Dental Ultrasónica",
            initialPrice: 20,
            monthlyFee: null,
            isOffer: false,
            customNote: "Requiere pago anticipado por transferencia para confirmar."
        },
        {
            name: "Carillas de Porcelana",
            initialPrice: 250, // Precio de referencia por unidad
            monthlyFee: null,
            isOffer: false,
            customNote: "Precio ref. por unidad. Presupuesto final en valoración."
        },
        {
            name: "Carillas de Resina (Paquete 8)",
            initialPrice: 500, // Precio de referencia por paquete
            monthlyFee: null,
            isOffer: false,
            customNote: "Precio ref. por paquete de 8. Presupuesto final en valoración."
        },
        {
            name: "Implante Dental (Completo)",
            initialPrice: 800, // Precio de referencia completo
            monthlyFee: null,
            isOffer: false,
            customNote: "Precio ref. por implante + corona. Presupuesto final en valoración."
        }
    ],

    // Configuración de Facebook Pixel (ID actualizado según solicitud)
    facebookPixel: {
        id: "1367211287257337",
        enabledEvents: true // Habilitar eventos de seguimiento
    }
},
'especialidades-dentales': {
    // Información de la clínica (Basada en el prompt de Cecilia)
    clinic: {
        name: "Especialidades Dentales",
        address: "Rayón # 25, San Juan del Río, Querétaro (Hospital Medical Center)",
        whatsapp: "5214423013751", // Placeholder - Reemplazar con el WhatsApp real de la clínica si se tiene
        whatsappDisplay: "442-301-3751", // Placeholder - Formato display
        depositAmount: 400, // Costo de valoración con pago anticipado
    },

    // Configuración de la landing page (Adaptada de Implant Center, personalizada para Especialidades Dentales)
    landingPage: {
        mainTitle: "¿Eres candidato para Implantes Dentales o AllOn4?",
        subtitle: "Responde unas breves preguntas y descubre si calificas para una consulta en Especialidades Dentales, San Juan del Río.",
        startButtonText: "Evaluar Gratis Ahora",
        appointmentButtonText: "Ver disponibilidad para agendar valoración",
        qualificationTitle: "¡Buenas noticias!",
        qualificationMessage: "Basado en tus respuestas, podrías ser un buen candidato para implantes dentales o AllOn4.",
        qualificationAction: "Agenda una valoración para recibir un diagnóstico personalizado.",
        priceNote: "La cita de valoración es el primer paso esencial. Costo $600 MXN con pago anticipado de $400 MXN y se descuenta del tratamiento.",
        confirmationText: {
            saveAndRedirect: "Al dar clic en <strong>Finalizar</strong>, se guardarán los datos de tu cita y serás redireccionado al WhatsApp oficial de Especialidades Dentales para confirmar tu cita.",
            depositInfo: "Recuerda que la valoración tiene un costo especial de $400 MXN pagando anticipado. Este monto será deducido del costo total del tratamiento."
        }
    },

    // Colores (Mantenidos de Implant Center para consistencia visual azul)
    colors: {
        primary: "#0078bf",    // Azul principal
        secondary: "#e6f3fa",  // Azul claro
        accent: "#005a8c",     // Azul oscuro para hover
        text: "#333333",       // Color de texto principal
        highlight: "#f0f8ff",  // Color de fondo para destacados
    },

    // Webhooks (Actualizados según solicitud)
    webhooks: {
        availability: "https://sswebhookss.odontolab.co/webhook/ef684e23-4de3-4176-a7fc-0fc5f2e94973",
        whatsappValidation: "https://sswebhookss.odontolab.co/webhook/02eb0643-1b9d-4866-87a7-f892d6a945ea",
        formSubmission: "https://sswebhookss.odontolab.co/webhook/4f8b0750-61c7-4982-beea-434e805a1bee"
    },

    // Preguntas del cuestionario (Mismas que Implant Center, ubicación actualizada)
    questions: [
        {
            question: "Estamos ubicados en Rayón # 25, San Juan del Río, Querétaro (Hospital Medical Center). ¿Puedes asistir personalmente si confirmamos una cita?",
            options: ["Sí, puedo asistir", "No, me queda muy lejos"],
            key: "canAttend"
        },
        {
            question: "¿Cuántos dientes te faltan?",
            options: ["1-2 dientes", "3-5 dientes", "6-10 dientes", "Más de 10 dientes", "Todos o casi todos"],
            key: "missingTeeth"
        },
        {
            question: "¿Hace cuánto tiempo que te faltan dientes?",
            options: ["Menos de 6 meses", "Entre 6 meses y 1 año", "Entre 1 y 3 años", "Más de 3 años"],
            key: "timeSinceLoss"
        },
        {
            question: "¿Tienes diabetes?",
            options: ["No", "Sí, controlada", "Sí, no controlada"],
            key: "hasDiabetes"
        },
        {
            question: "¿Has visitado otra clínica para tener un presupuesto?",
            options: ["Sí", "No"],
            key: "previousConsultation"
        }
        ,
        {
            question: "¿Cuándo quieres avanzar con tu tratamiento?",
            options: ["Lo Más pronto posible", "No lo sé"],
            key: "urgency"
        }
    ],

    // Tratamientos y precios (Basados en la información del prompt de Cecilia)
    treatments: [
        {
            name: "Cita de Valoración",
            initialPrice: 600, // Precio regular en clínica
            monthlyFee: null,
            isOffer: true,     // Es una oferta por el descuento
            highlightText: "$400 Pago Anticipado", // Texto destacado
            customNote: "Ahorras $200. Se descuenta del tratamiento final."
        },
        {
            name: "Implante Dental Unitario (Completo)",
            initialPrice: 24000,
            monthlyFee: null,
            priceFormat: "simple", // Muestra solo el precio
            customNote: "Incluye implante + corona."
        },
        {
            name: "AllOn4 - Una Arcada",
            initialPrice: 105000,
            monthlyFee: null,
            priceFormat: "simple",
             customNote: "Superior o inferior."
        },
        {
            name: "AllOn4 - Ambas Arcadas",
            initialPrice: 200000,
            monthlyFee: null,
            priceFormat: "simple",
            customNote: "Boca completa. Arriba y Abajo."
        }
    ],

    // Configuración de Facebook Pixel (Actualizado según solicitud)
    facebookPixel: {
        id: "9190864014258684",
        enabledEvents: true // Habilitar eventos de seguimiento
    }
}
};
