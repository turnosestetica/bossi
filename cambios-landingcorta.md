# Documentación de Cambios en el Proyecto LandingCorta

Este documento detalla los cambios realizados en el proyecto LandingCorta para mejorar la experiencia del usuario y optimizar la carga de datos.

## 1. Cambios Implementados

### 1.1. Eliminación del Paso Inicial

Se modificó el flujo de navegación para eliminar la landing page inicial y hacer que los usuarios entren directamente al cuestionario:

```html
<!-- Ocultar la landing page inicial -->
<div class="landing-content" id="landing-content" style="display: none;">
    <!-- Contenido de la landing page -->
</div>

<!-- Mostrar directamente el cuestionario -->
<div class="quiz-container" id="quiz-container" style="display: flex; opacity: 1;">
    <!-- Contenido del cuestionario -->
</div>
```

### 1.2. Adición del Logo en la Parte Superior

Se agregó un contenedor para mostrar el logo de la clínica en la parte superior de cada sección:

```html
<div class="doctor-profile">
    <img src="images/implantcenterslp.jpg" alt="Implant Center" class="doctor-image">
    <div class="doctor-name">Especialistas en Implantes Dentales</div>
</div>
```

### 1.3. Implementación de Carga de Fechas y Horas Bajo Demanda

Se modificó el código para cargar las fechas disponibles solo cuando el usuario hace clic en "Quiero una cita de valoración" y mostrar un spinner mientras se cargan los datos:

```html
<div class="loading-dates" id="loading-dates">
    <div class="loading-spinner-large"></div>
    <p>Consultando fechas disponibles...</p>
    <p style="font-size: 0.9rem; margin-top: 5px; color: #666;">Este proceso puede tomar unos segundos. Por favor, espere.</p>
</div>

<div class="loading-times" id="loading-times">
    <div class="loading-spinner-large"></div>
    <p>Selecciona primero una fecha para ver los horarios disponibles</p>
    <p style="font-size: 0.9rem; margin-top: 5px; color: #666;">Los horarios se mostrarán una vez que elijas una fecha</p>
</div>
```

## 2. Archivos Modificados

### 2.1. Estilos CSS (styles.css)

Se agregaron los siguientes estilos:

```css
/* Doctor Profile Header */
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

/* Contenedores de carga para fechas y horas */
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

.loading-spinner-large {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(var(--primary-color-rgb), 0.2);
    border-radius: 50%;
    border-top-color: var(--primary-color);
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
```

### 2.2. JavaScript (script.js)

Se modificó el código JavaScript para:

1. Detectar automáticamente el cliente basado en el nombre del archivo HTML:

```javascript
// Detectar qué configuración de cliente usar basado en el nombre del archivo HTML
function detectClientConfig() {
    // Obtener el nombre del archivo HTML actual (sin la extensión .html)
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1).replace('.html', '');
    
    // Si el nombre de archivo está vacío (index.html), usar el nombre del directorio
    const clientName = filename || 'implant-center-slp';
    
    console.log('Nombre de cliente detectado:', clientName);
    return clientName;
}

// Obtener el nombre del cliente actual
const currentClient = detectClientConfig();
```

2. Actualizar dinámicamente las imágenes y nombres de la clínica:

```javascript
// Actualizar las imágenes del logo con la imagen correspondiente al cliente
const doctorImages = document.querySelectorAll('.doctor-image');
doctorImages.forEach(img => {
    img.src = `images/${currentClient}.jpg`;
    img.alt = currentClient;
});

// Actualizar los nombres de la clínica según el cliente
const doctorNames = document.querySelectorAll('.doctor-name');
let clinicName = '';

// Asignar el nombre de la clínica según el cliente
switch(currentClient) {
    case 'especialidades-dentales':
        clinicName = 'Especialidades Dentales - Expertos en Implantes';
        break;
    case 'implant-center-slp':
        clinicName = 'Implant Center - Especialistas en Implantes Dentales';
        break;
    case 'mgortodoncia':
        clinicName = 'María Guillén Ortodoncia';
        break;
    case 'latino':
        clinicName = 'Clínica Dental Latino - Dr. Kevin Cevallos';
        break;
    default:
        clinicName = 'Especialistas en Implantes Dentales';
}

doctorNames.forEach(nameElement => {
    nameElement.textContent = clinicName;
});
```

3. Inicializar automáticamente el cuestionario al cargar la página:

```javascript
// Inicializar el cuestionario automáticamente al cargar la página
// ya que ahora mostramos directamente el cuestionario sin la landing page
initQuiz();
```

4. Modificar la carga de fechas y horas para que se realice bajo demanda:

```javascript
// Handle appointment button click
appointmentButton.addEventListener('click', () => {
    // Fade out results container
    resultsContainer.style.opacity = '0';
    
    // Mostrar un indicador de carga mientras se obtienen las fechas disponibles
    appointmentButton.disabled = true;
    appointmentButton.innerHTML = '<div class="loading-spinner-large" style="width: 20px; height: 20px; display: inline-block; margin-right: 10px;"></div> Consultando disponibilidad...';

    setTimeout(() => {
        resultsContainer.style.display = 'none';
        formContainer.style.display = 'flex';

        // Mostrar los mensajes de carga en las secciones de fechas y horas
        const dateSelect = document.getElementById('preferred-date');
        const timeSelect = document.getElementById('preferred-time');
        const loadingDates = document.getElementById('loading-dates');
        const loadingTimes = document.getElementById('loading-times');

        if (dateSelect) dateSelect.style.display = 'none';
        if (timeSelect) timeSelect.style.display = 'none';
        if (loadingDates) loadingDates.style.display = 'flex';
        if (loadingTimes) loadingTimes.style.display = 'flex';

        // Fade in form container
        setTimeout(() => {
            formContainer.style.opacity = '1';
            
            // Cargar las fechas disponibles
            loadAvailableDates();
            
            // Restaurar el botón a su estado original
            appointmentButton.disabled = false;
            appointmentButton.innerHTML = 'Quiero una cita de valoración';
        }, 50);
    }, 300);
});
```

5. Implementar la carga de fechas con un spinner:

```javascript
// Cargar fechas disponibles (próximos 14 días hábiles L-V)
function loadAvailableDates() {
    const dateSelect = document.getElementById('preferred-date');
    const loadingDates = document.getElementById('loading-dates');
    const today = new Date();
    let daysAdded = 0;
    let daysCount = 0;

    // Nombres de los días y meses en español
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    // Simular una carga de datos con un pequeño retraso para mostrar el spinner
    setTimeout(() => {
        // Agregar fechas hasta tener 14 días hábiles
        while (daysCount < 14) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() + daysAdded);
            daysAdded++;

            // Verificar si es día hábil (lunes a viernes)
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) { // 0 = domingo, 6 = sábado
                continue; // Saltar fines de semana
            }

            // Formatear fecha como "Lunes 14 de Abril"
            const dayName = dayNames[dayOfWeek];
            const day = currentDate.getDate();
            const month = monthNames[currentDate.getMonth()];
            const formattedDate = `${dayName} ${day} de ${month}`;

            // Crear opción para el selector
            const option = document.createElement('option');
            option.value = currentDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD para el valor
            option.textContent = formattedDate;
            dateSelect.appendChild(option);

            daysCount++;
        }
        
        // Ocultar el spinner y mostrar el selector
        if (loadingDates) loadingDates.style.display = 'none';
        if (dateSelect) dateSelect.style.display = 'block';
        
        // Añadir evento change al selector de fechas para cargar las horas
        dateSelect.addEventListener('change', function() {
            loadAvailableHours();
        });
    }, 1500); // Simular un retraso de 1.5 segundos para mostrar el spinner
}
```

6. Implementar la carga de horas con un spinner:

```javascript
// Cargar horas disponibles según la configuración
function loadAvailableHours() {
    const timeSelect = document.getElementById('preferred-time');
    const loadingTimes = document.getElementById('loading-times');
    
    // Mostrar el spinner de carga
    if (loadingTimes) loadingTimes.style.display = 'flex';
    if (timeSelect) timeSelect.style.display = 'none';

    // Limpiar opciones existentes excepto la primera (placeholder)
    while (timeSelect.options.length > 1) {
        timeSelect.remove(1);
    }
    
    // Simular una carga de datos con un pequeño retraso para mostrar el spinner
    setTimeout(() => {
        // Calcular número de intervalos
        const totalMinutes = (businessHours.end - businessHours.start) * 60;
        const intervals = totalMinutes / businessHours.interval;

        // Agregar cada intervalo de tiempo
        for (let i = 0; i <= intervals; i++) {
            const minutes = i * businessHours.interval;
            const hour = Math.floor(minutes / 60) + businessHours.start;
            const minute = minutes % 60;

            // Formatear hora (12h con AM/PM)
            let displayHour = hour;
            const period = hour >= 12 ? 'PM' : 'AM';
            if (displayHour > 12) displayHour -= 12;
            if (displayHour === 0) displayHour = 12;

            const formattedTime = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;

            // Crear opción para el selector
            const option = document.createElement('option');
            option.value = formattedTime;
            option.textContent = formattedTime;
            timeSelect.appendChild(option);
        }
        
        // Ocultar el spinner y mostrar el selector
        if (loadingTimes) loadingTimes.style.display = 'none';
        if (timeSelect) timeSelect.style.display = 'block';
    }, 1000); // Simular un retraso de 1 segundo para mostrar el spinner
}
```

## 3. Instrucciones para Aplicar los Cambios a Otros Proyectos

1. **Copiar los estilos CSS**:
   - Agregar los estilos para `.doctor-profile`, `.doctor-image`, `.doctor-name`, `.loading-dates`, `.loading-times` y `.loading-spinner-large` al archivo CSS del proyecto.

2. **Modificar el HTML**:
   - Agregar el contenedor `.doctor-profile` en la parte superior de cada sección (quiz, resultados y formulario).
   - Configurar la visualización inicial para que la landing page esté oculta y el cuestionario se muestre directamente.
   - Agregar los contenedores `.loading-dates` y `.loading-times` en las secciones correspondientes.

3. **Modificar el JavaScript**:
   - Implementar la función `detectClientConfig()` para detectar automáticamente el cliente.
   - Actualizar dinámicamente las imágenes y nombres de la clínica según el cliente detectado.
   - Modificar la carga de fechas y horas para que se realice bajo demanda y muestre spinners mientras se cargan los datos.
   - Inicializar automáticamente el cuestionario al cargar la página.

4. **Preparar las imágenes**:
   - Asegurarse de que las imágenes de los logos de cada cliente estén en la carpeta `/images` y tengan el mismo nombre que el archivo HTML correspondiente (por ejemplo, `especialidades-dentales.jpg`, `implant-center-slp.jpg`, etc.).

## 4. Notas Adicionales

- Los cambios se han implementado de manera que sean compatibles con todos los clientes existentes: especialidades-dentales, implant-center-slp, mgortodoncia y latino.
- El código detecta automáticamente qué cliente está siendo visualizado basado en el nombre del archivo HTML.
- Se ha mejorado la experiencia del usuario al mostrar indicadores visuales de carga mientras se esperan los datos.
- Se ha optimizado el rendimiento al cargar los datos solo cuando son necesarios.
