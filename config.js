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
      depositAmount: 14000,
      consultationPrice: 28000,
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
        saveAndRedirect: "Al dar clic en <strong>PAGAR CITA →</strong>, se guardarán los datos de tu cita y serás redireccionado a MercadoPago para pagar el 50% de tu cita. Sólo confirmamos citas con pago anticipado. Si no finalizas el pago tu cita se libera automáticamente.",
        depositInfo: "Recuerda que se requiere el pago anticipado de $14.000 (50% de la cita) para confirmar tu turno. El 50% restante ($14.000) se abona el día de la visita en la clínica."
      },
      whatsappMessage: {
        greeting: "Hola, soy {nombre} y me interesa agendar una consulta con la Dra. Constanza Bossi.",
        contactInfo: "*DATOS DE CONTACTO*\n- Nombre: {nombre}\n- WhatsApp: {whatsapp}",
        appointmentInfo: "*CITA SOLICITADA*\n- Fecha: {fecha}\n- Hora: {hora}",
        depositInfo: "*ENTIENDO QUE:*\n- Se requiere el pago anticipado de $14.000 (50%) para confirmar mi reserva.\n- El 50% restante ($14.000) lo abonaré el día de la cita en la clínica.",
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
      formSubmission: "https://sswebhookss.odontolab.co/webhook/0dc8f34f-0992-419f-a841-b3782f2556a5"
    },

    // Preguntas del cuestionario
    questions: [
      {
        question: "¿Qué procedimiento te interesa?",
        options: ["Lipoescultura", "Aumento mamario", "Lipoabdominoplastia", "Tratamientos estéticos no quirúrgicos", "Remodelación costal", "Otro procedimiento"],
        key: "procedure"
      },
      {
        question: "¿Puedes asistir a nuestra clínica en Santiago del Estero 60, Piso 6, Edificio EMSA, Tucumán?",
        options: ["Sí, puedo asistir", "No, me queda muy lejos"],
        key: "location"
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
          "Más de 110 kg"
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

    // Tratamientos y precios (ACTUALIZADOS)
    treatments: [
      {
        name: "Consulta de Evaluación",
        initialPrice: 14000,
        regularPrice: 28000,
        monthlyFee: null,
        isOffer: true,
        highlightText: "$14.000 (Reserva 50%)",
        customNote: "El 50% restante se abona el día de la consulta"
      },
      {
        name: "Lipoescultura",
        initialPrice: 4200000,
        monthlyFee: null,
        priceFormat: "simple"
      },
      {
        name: "Lipoabdominoplastia",
        initialPrice: 4600000,
        monthlyFee: null,
        priceFormat: "simple"
      },
      {
        name: "Aumento mamario",
        initialPrice: 3000000,
        monthlyFee: null,
        priceFormat: "simple"
      },
      {
        name: "Remodelación costal",
        initialPrice: 4600000,
        monthlyFee: null,
        priceFormat: "simple",
        customNote: "Sin asociación con otros procedimientos"
      },
      {
        name: "Toxina botulínica (Botox)",
        initialPrice: 390000,
        monthlyFee: null,
        priceFormat: "simple",
        customNote: "Para arrugas de expresión"
      },
      {
        name: "Ácido hialurónico",
        initialPrice: 350000,
        monthlyFee: null,
        priceFormat: "simple",
        customNote: "Precio desde. Varía según zonas a tratar"
      },
      {
        name: "Rinomodelación",
        initialPrice: 400000,
        monthlyFee: null,
        priceFormat: "simple",
        customNote: "Con ácido hialurónico"
      }
    ],

    // Configuración de Facebook Pixel
    facebookPixel: {
      id: "1222298238852708", // ID del Pixel de Facebook
      enabledEvents: true // Habilitar eventos de seguimiento
    }
  }
};
