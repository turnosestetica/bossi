# Documentación de Cambios en el Sitio Web de Dra. Constanza Bossi

Este documento detalla los cambios realizados en el sitio web de la Dra. Constanza Bossi para que puedan ser aplicados en proyectos similares.

## 1. Cambios en la Estructura de Navegación

### 1.1. Eliminación de la Landing Page Inicial

Se modificó el flujo de navegación para eliminar la landing page de introducción y hacer que los usuarios entren directamente al paso de selección de cirugía:

```javascript
// En index.html, modificar la visibilidad inicial de los contenedores
<div class="landing-content" id="landing-content" style="display: none;">
    <!-- Contenido de la landing page -->
</div>

<div class="quiz-container" id="quiz-container" style="display: flex; opacity: 1;">
    <!-- Contenido del cuestionario -->
</div>
```

### 1.2. Reorganización de los Pasos

- Se mantiene la selección de cirugía como primer paso
- Se conserva la ubicación como segundo paso
- Se agregó la imagen de la doctora en la parte superior de cada paso

## 2. Adición de la Imagen de la Doctora

Se agregó la imagen circular de la Dra. Constanza Bossi en la parte superior de cada sección:

```html
<div class="doctor-profile">
    <img src="images/drabossi.jpg" alt="Dra. Constanza Bossi" class="doctor-image">
    <div class="doctor-name">Dra. Constanza Bossi - Cirujana Plástica Certificada en San Miguel de Tucumán.</div>
</div>
```

Con los siguientes estilos CSS:

```css
.doctor-profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--secondary-color);
}

.doctor-image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--primary-color);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 0.5rem;
}

.doctor-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--primary-color);
    text-align: center;
    margin-bottom: 0.2rem;
}
```

## 3. Modificación de las Opciones de Cirugía

Se actualizó la configuración para mostrar la remodelación costal como la última opción de cirugía:

```javascript
// En config.js
questions: [
  {
    question: "¿Qué procedimiento te interesa?",
    options: ["Lipoescultura", "Aumento mamario", "Lipoabdominoplastia", "Tratamientos estéticos no quirúrgicos", "Remodelación costal", "Otro procedimiento"],
    key: "procedure"
  },
  // Otras preguntas...
]
```

## 4. Adición de Campos Específicos

### 4.1. Campo para Videollamada Previa de 10 Minutos

Se agregó una pregunta específica para la opción de videollamada previa:

```javascript
// En config.js
{
  question: "¿Te gustaría tener una mini videollamada de 10 minutos previa a la cita?",
  options: ["Sí, me interesa", "No, prefiero solo la cita presencial"],
  key: "videocall"
}
```

### 4.2. Campos de Peso y Altura Fáciles de Seleccionar

Se agregaron preguntas con opciones predefinidas para peso y altura:

```javascript
// En config.js
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
```

## 5. Configuración del Facebook Pixel

Se configuró el ID del Facebook Pixel para la Dra. Constanza Bossi:

```javascript
// En config.js
facebookPixel: {
  id: "1222298238852708", // ID del Pixel de Facebook
  enabledEvents: true // Habilitar eventos de seguimiento
}
```

## 6. Configuración del Webhook

Se configuró la URL del webhook para guardar los datos de las citas:

```javascript
// En config.js
webhooks: {
  availability: "https://script.google.com/macros/s/AKfycby5o5wpGUPsaC3IhZgGlV-em6iBWKZCItsvqdkkNRM5xXNd_JtnvYVz3OYdTocn99MlQg/exec?fechasdisponibles=1",
  whatsappValidation: "https://sswebhookss.odontolab.co/webhook/02eb0643-1b9d-4866-87a7-f892d6a945ea",
  formSubmission: "https://sswebhookss.odontolab.co/webhook/0dc8f34f-0992-419f-a841-b3782f2556a5"
}
```

## 7. Actualización del Precio de Consulta

Se actualizó el precio de la consulta a $23.000 con el formato correcto:

```javascript
// En config.js
clinic: {
  name: "Dra. Constanza Bossi",
  address: "Santiago del Estero 60, Piso 6, Edificio EMSA, Tucumán",
  whatsapp: "5493812093646", // Sin el signo +
  whatsappDisplay: "381-209-3646",
  depositAmount: 23000,
  consultationPrice: 23000,
},

// En la sección de tratamientos
treatments: [
  {
    name: "Consulta de Evaluación",
    initialPrice: 30000,
    monthlyFee: null,
    isOffer: true,
    highlightText: "$23.000 con pago anticipado (¡Ahorras $7.000!)",
    customNote: "Evaluación personalizada con la Dra. Constanza Bossi"
  },
  // Otros tratamientos...
]
```

Y en el HTML:

```html
<div class="payment-reminder">
    <p><strong>IMPORTANTE:</strong> Se requiere un pago anticipado de $23.000 para confirmar tu cita de evaluación.</p>
    <p>Este pago es obligatorio para reservar tu consulta.</p>
</div>
```

## 8. Optimización de Carga de Datos de Fechas

### 8.1. Carga de Fechas Bajo Demanda

Se modificó el código para cargar las fechas disponibles solo cuando se necesitan (al hacer clic en "Ver disponibilidad"):

```javascript
// En landing.js
appointmentButton.addEventListener('click', () => {
    // Mostrar un indicador de carga mientras se obtienen las fechas disponibles
    appointmentButton.disabled = true;
    appointmentButton.innerHTML = '<span class="loading-spinner"></span> Consultando agenda de la Dra. Bossi...';

    // Primero ocultar el contenedor de resultados
    resultsContainer.style.opacity = '0';

    setTimeout(() => {
        // Ocultar completamente el contenedor de resultados
        resultsContainer.style.display = 'none';

        // Mostrar el formulario inmediatamente
        formContainer.style.display = 'flex';
        formContainer.style.opacity = '1';

        // Mostrar los mensajes de carga en las secciones de fechas y horas
        const dateGrid = document.getElementById('date-grid');
        const timeGrid = document.getElementById('time-grid');
        const loadingDates = document.getElementById('loading-dates');
        const loadingTimes = document.getElementById('loading-times');

        if (dateGrid) dateGrid.style.display = 'none';
        if (timeGrid) timeGrid.style.display = 'none';
        if (loadingDates) loadingDates.style.display = 'flex';
        if (loadingTimes) loadingTimes.style.display = 'flex';

        // Cargar las fechas disponibles desde el webhook
        loadAvailabilityData().then(success => {
            // Restaurar el botón a su estado original
            appointmentButton.disabled = false;
            appointmentButton.innerHTML = 'Ver disponibilidad';

            if (!success) {
                // Si hubo un error al cargar las fechas, mostrar un mensaje
                alert('Hubo un problema al cargar las fechas disponibles. Por favor, intenta nuevamente.');
                // Volver a la pantalla anterior
                formContainer.style.opacity = '0';
                setTimeout(() => {
                    formContainer.style.display = 'none';
                    resultsContainer.style.display = 'flex';
                    setTimeout(() => {
                        resultsContainer.style.opacity = '1';
                    }, 50);
                }, 300);
            }
        });
    }, 300);
});
```

### 8.2. Implementación de Indicadores de Carga

Se agregaron indicadores de carga mientras se esperan los datos de disponibilidad:

```html
<!-- En index.html -->
<div class="loading-dates" id="loading-dates">
    <div class="loading-spinner-large"></div>
    <p>Consultando fechas disponibles en la agenda de la Dra. Bossi...</p>
    <p style="font-size: 0.9rem; margin-top: 5px; color: #666;">Este proceso puede tomar unos segundos. Por favor, espere.</p>
</div>

<div class="loading-times" id="loading-times">
    <div class="loading-spinner-large"></div>
    <p>Selecciona primero una fecha para ver los horarios disponibles</p>
    <p style="font-size: 0.9rem; margin-top: 5px; color: #666;">Los horarios se mostrarán una vez que elijas una fecha</p>
</div>
```

Con los siguientes estilos CSS:

```css
/* En landing.css */
.loading-dates, .loading-times {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    text-align: center;
    background-color: var(--secondary-color);
    border: 1px solid rgba(var(--primary-color-rgb), 0.2);
    border-radius: var(--border-radius);
    margin-top: 10px;
    min-height: 150px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.loading-dates p, .loading-times p {
    margin-top: 15px;
    color: var(--primary-color);
    font-weight: 600;
    font-size: 1.05rem;
    line-height: 1.4;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
```

## 9. Envío de Datos al Webhook

Se actualizó el envío de datos al webhook para incluir los nuevos campos:

```javascript
// En landing.js
const webhookData = {
    fullname: formData.fullname,
    whatsapp: formData.whatsapp,
    tratamiento_interes: formData.tratamiento_interes || 'Cirugía plástica',
    fecha_cita: formData.fecha_cita,
    fecha: formData.fecha || '',
    hora: formData.hora || '',
    landingUrl: window.location.href,
    respuestas: formData.respuestas || '',
    respuestas_detalladas: formData.respuestas_detalladas || {},
    videollamada_previa: formData.videollamada_previa || 'No',
    peso: formData.peso || '',
    altura: formData.altura || '',
    estado: "NUEVO",
    origen: "Landing Dra. Constanza Bossi"
};
```

## 10. Adaptaciones Responsivas

Se ajustaron los estilos para mejorar la visualización en dispositivos móviles:

```css
/* En landing.css */
@media (max-width: 480px) {
    .doctor-profile {
        margin-bottom: 0.8rem;
        padding-bottom: 0.6rem;
    }

    .doctor-image {
        width: 100px;
        height: 100px;
        border-width: 2px;
    }

    .doctor-name {
        font-size: 0.9rem;
    }
    
    /* Otros ajustes responsivos... */
}
```

## Instrucciones para Implementar los Cambios

1. Copia los archivos necesarios del proyecto original al nuevo proyecto
2. Actualiza el archivo `config.js` con la configuración específica del nuevo proyecto
3. Modifica el archivo `index.html` para implementar la estructura actualizada
4. Actualiza los archivos CSS para incluir los nuevos estilos
5. Modifica los archivos JavaScript para implementar la lógica actualizada
6. Asegúrate de incluir la imagen del doctor en la ruta `/images/` correspondiente
7. Prueba el flujo completo para verificar que todos los cambios funcionen correctamente

## Notas Adicionales

- Asegúrate de que la URL del webhook para guardar los datos de las citas esté correctamente configurada
- Verifica que el ID del Facebook Pixel sea el correcto para el nuevo proyecto
- Ajusta los precios y textos según las necesidades del nuevo proyecto
