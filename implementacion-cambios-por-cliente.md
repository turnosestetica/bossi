# Implementación de Cambios por Cliente en el Proyecto LandingCorta

Este documento detalla cómo implementar los cambios solicitados para cada cliente específico en el proyecto LandingCorta.

## Estructura del Proyecto

El proyecto LandingCorta contiene varios archivos HTML, cada uno correspondiente a un cliente diferente:

- `especialidades-dentales.html`
- `implant-center-slp.html`
- `mgortodoncia.html`
- `latino.html`

Cada cliente tiene su propio logo en la carpeta `/images` con el mismo nombre que el archivo HTML correspondiente:

- `implantcenterslp.jpg`
- `latino.jpg`
- `mgortodoncia.jpg`

El proyecto utiliza un sistema de detección automática del cliente basado en el nombre del archivo HTML, que se implementa en `landing.js`:

```javascript
// Detectar qué configuración de cliente usar basado en el nombre del archivo HTML
function detectClientConfig() {
    // Obtener el nombre del archivo HTML actual (sin la extensión .html)
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1).replace('.html', '');
    
    console.log('Nombre de archivo detectado:', filename);
    
    // Buscar la configuración correspondiente en CLIENTS_CONFIG
    if (CLIENTS_CONFIG && CLIENTS_CONFIG[filename]) {
        console.log('Configuración de cliente encontrada para:', filename);
        return CLIENTS_CONFIG[filename];
    }
    
    // Si no se encuentra una configuración específica, usar la primera disponible como fallback
    if (CLIENTS_CONFIG) {
        const firstClient = Object.keys(CLIENTS_CONFIG)[0];
        console.log('Usando configuración de cliente por defecto:', firstClient);
        return CLIENTS_CONFIG[firstClient];
    }
    
    console.error('No se encontró ninguna configuración de cliente');
    return {};
}
```

## Cambios a Implementar para Cada Cliente

Para implementar los cambios solicitados para cada cliente, necesitamos modificar los siguientes archivos:

1. Archivo HTML del cliente
2. Archivo CSS compartido (styles.css)
3. Archivo JavaScript compartido (script.js)

### 1. Modificaciones en el Archivo HTML de Cada Cliente

Para cada archivo HTML de cliente (`especialidades-dentales.html`, `implant-center-slp.html`, `mgortodoncia.html`, `latino.html`), necesitamos realizar las siguientes modificaciones:

#### 1.1. Ocultar la Landing Page Inicial

```html
<!-- Cambiar esto: -->
<div class="landing-content" id="landing-content">
    <h1 class="compact-title">¿Eres candidato para implantes dentales?</h1>
    <p class="simple-intro">Responde unas breves preguntas y descubre si calificas para una consulta.</p>
    <button class="cta-button" id="start-quiz">Evaluar Gratis Ahora</button>
</div>

<!-- Por esto: -->
<div class="landing-content" id="landing-content" style="display: none;">
    <h1 class="compact-title">¿Eres candidato para implantes dentales?</h1>
    <p class="simple-intro">Responde unas breves preguntas y descubre si calificas para una consulta.</p>
    <button class="cta-button" id="start-quiz">Evaluar Gratis Ahora</button>
</div>
```

#### 1.2. Mostrar Directamente el Cuestionario

```html
<!-- Cambiar esto: -->
<div class="quiz-container" id="quiz-container">
    <div class="progress-bar">
        <div class="progress" id="progress"></div>
    </div>
    
    <!-- Resto del contenido... -->
</div>

<!-- Por esto: -->
<div class="quiz-container" id="quiz-container" style="display: flex; opacity: 1;">
    <div class="doctor-profile">
        <!-- La imagen y el nombre se actualizarán dinámicamente con JavaScript -->
        <img src="images/[nombre-del-cliente].jpg" alt="[Nombre del Cliente]" class="doctor-image">
        <div class="doctor-name">[Nombre de la Clínica]</div>
    </div>
    
    <div class="progress-bar">
        <div class="progress" id="progress"></div>
    </div>
    
    <!-- Resto del contenido... -->
</div>
```

#### 1.3. Agregar el Logo en la Sección de Resultados

```html
<!-- Cambiar esto: -->
<div class="results-container" id="results-container">
    <h2 id="qualification-result"></h2>
    
    <!-- Resto del contenido... -->
</div>

<!-- Por esto: -->
<div class="results-container" id="results-container">
    <div class="doctor-profile">
        <!-- La imagen y el nombre se actualizarán dinámicamente con JavaScript -->
        <img src="images/[nombre-del-cliente].jpg" alt="[Nombre del Cliente]" class="doctor-image">
        <div class="doctor-name">[Nombre de la Clínica]</div>
    </div>
    
    <h2 id="qualification-result"></h2>
    
    <!-- Resto del contenido... -->
</div>
```

#### 1.4. Agregar el Logo en la Sección de Formulario

```html
<!-- Cambiar esto: -->
<div class="form-container" id="form-container">
    <h2>Agenda tu cita de valoración</h2>
    
    <!-- Resto del contenido... -->
</div>

<!-- Por esto: -->
<div class="form-container" id="form-container">
    <div class="doctor-profile">
        <!-- La imagen y el nombre se actualizarán dinámicamente con JavaScript -->
        <img src="images/[nombre-del-cliente].jpg" alt="[Nombre del Cliente]" class="doctor-image">
        <div class="doctor-name">[Nombre de la Clínica]</div>
    </div>
    
    <h2>Agenda tu cita de valoración</h2>
    
    <!-- Resto del contenido... -->
</div>
```

#### 1.5. Agregar Indicadores de Carga para Fechas y Horas

Buscar la sección de selección de fecha y hora en el formulario y agregar los indicadores de carga:

```html
<!-- Dentro de la sección de selección de fecha: -->
<div class="selector-section">
    <h4>Selecciona una fecha</h4>
    <div class="date-grid" id="date-grid">
        <!-- Las fechas se cargarán dinámicamente con JavaScript -->
    </div>
    <input type="hidden" id="preferred-date" name="preferred-date" required>
    
    <!-- Agregar esto: -->
    <div class="loading-dates" id="loading-dates">
        <div class="loading-spinner-large"></div>
        <p>Consultando fechas disponibles...</p>
        <p style="font-size: 0.9rem; margin-top: 5px; color: #666;">Este proceso puede tomar unos segundos. Por favor, espere.</p>
    </div>
</div>

<!-- Dentro de la sección de selección de hora: -->
<div class="selector-section">
    <h4>Selecciona una hora</h4>
    <div class="time-grid" id="time-grid">
        <!-- Las horas se cargarán dinámicamente con JavaScript -->
    </div>
    <input type="hidden" id="preferred-time" name="preferred-time" required>
    
    <!-- Agregar esto: -->
    <div class="loading-times" id="loading-times">
        <div class="loading-spinner-large"></div>
        <p>Selecciona primero una fecha para ver los horarios disponibles</p>
        <p style="font-size: 0.9rem; margin-top: 5px; color: #666;">Los horarios se mostrarán una vez que elijas una fecha</p>
    </div>
</div>
```

### 2. Modificaciones en el Archivo CSS (styles.css)

Agregar los siguientes estilos al archivo CSS:

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

/* Estilos responsivos */
@media (max-width: 768px) {
    .doctor-profile {
        margin-bottom: 1rem;
        padding-bottom: 0.8rem;
    }

    .doctor-image {
        width: 100px;
        height: 100px;
    }

    .doctor-name {
        font-size: 1rem;
    }
}

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
}
```

### 3. Modificaciones en el Archivo JavaScript (landing.js)

#### 3.1. Actualizar Dinámicamente las Imágenes y Nombres de la Clínica

Agregar el siguiente código al inicio de la función `document.addEventListener('DOMContentLoaded', () => {...})`:

```javascript
// Actualizar las imágenes del logo con la imagen correspondiente al cliente
const doctorImages = document.querySelectorAll('.doctor-image');
const currentClient = detectClientConfig();
const clientName = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1).replace('.html', '');

doctorImages.forEach(img => {
    // Usar el nombre del archivo HTML como nombre de la imagen
    img.src = `images/${clientName}.jpg`;
    img.alt = CONFIG.clinic ? CONFIG.clinic.name : clientName;
});

// Actualizar los nombres de la clínica según el cliente
const doctorNames = document.querySelectorAll('.doctor-name');
let clinicName = CONFIG.clinic ? CONFIG.clinic.name : 'Clínica Dental';

doctorNames.forEach(nameElement => {
    nameElement.textContent = clinicName;
});

// Inicializar el cuestionario automáticamente al cargar la página
// ya que ahora mostramos directamente el cuestionario sin la landing page
initQuiz();
```

#### 3.2. Modificar la Carga de Fechas y Horas para que se Realice Bajo Demanda

Modificar la función que maneja el clic en el botón de cita:

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
        const dateGrid = document.getElementById('date-grid');
        const timeGrid = document.getElementById('time-grid');
        const loadingDates = document.getElementById('loading-dates');
        const loadingTimes = document.getElementById('loading-times');

        if (dateGrid) dateGrid.style.display = 'none';
        if (timeGrid) timeGrid.style.display = 'none';
        if (loadingDates) loadingDates.style.display = 'flex';
        if (loadingTimes) loadingTimes.style.display = 'flex';

        // Fade in form container
        setTimeout(() => {
            formContainer.style.opacity = '1';
            
            // Cargar las fechas disponibles
            loadAvailableDates();
            
            // Restaurar el botón a su estado original
            appointmentButton.disabled = false;
            appointmentButton.innerHTML = 'Ver disponibilidad';
        }, 50);
    }, 300);
});
```

#### 3.3. Modificar la Función de Carga de Fechas para Mostrar un Spinner

```javascript
// Modificar la función loadAvailableDates
function loadAvailableDates() {
    const dateGrid = document.getElementById('date-grid');
    const loadingDates = document.getElementById('loading-dates');
    
    // Simular una carga de datos con un pequeño retraso para mostrar el spinner
    setTimeout(() => {
        // Código original para cargar las fechas...
        
        // Ocultar el spinner y mostrar las fechas
        if (loadingDates) loadingDates.style.display = 'none';
        if (dateGrid) dateGrid.style.display = 'grid';
        
        // Añadir evento click a las fechas para cargar las horas
        const dateItems = document.querySelectorAll('.date-item');
        dateItems.forEach(item => {
            item.addEventListener('click', function() {
                loadAvailableHours();
            });
        });
    }, 1500); // Simular un retraso de 1.5 segundos para mostrar el spinner
}
```

#### 3.4. Modificar la Función de Carga de Horas para Mostrar un Spinner

```javascript
// Modificar la función loadAvailableHours
function loadAvailableHours() {
    const timeGrid = document.getElementById('time-grid');
    const loadingTimes = document.getElementById('loading-times');
    
    // Mostrar el spinner de carga
    if (loadingTimes) loadingTimes.style.display = 'flex';
    if (timeGrid) timeGrid.style.display = 'none';
    
    // Simular una carga de datos con un pequeño retraso para mostrar el spinner
    setTimeout(() => {
        // Código original para cargar las horas...
        
        // Ocultar el spinner y mostrar las horas
        if (loadingTimes) loadingTimes.style.display = 'none';
        if (timeGrid) timeGrid.style.display = 'grid';
    }, 1000); // Simular un retraso de 1 segundo para mostrar el spinner
}
```

## Implementación para Cada Cliente Específico

### Cliente: especialidades-dentales

1. **Imagen del Logo**: `images/especialidades-dentales.jpg` (crear si no existe)
2. **Nombre de la Clínica**: "Especialidades Dentales - Expertos en Implantes"
3. **Modificaciones HTML**: Aplicar los cambios descritos en la sección 1 al archivo `especialidades-dentales.html`

### Cliente: implant-center-slp

1. **Imagen del Logo**: `images/implantcenterslp.jpg` (ya existe)
2. **Nombre de la Clínica**: "Implant Center - Especialistas en Implantes Dentales"
3. **Modificaciones HTML**: Aplicar los cambios descritos en la sección 1 al archivo `implant-center-slp.html`

### Cliente: mgortodoncia

1. **Imagen del Logo**: `images/mgortodoncia.jpg` (ya existe)
2. **Nombre de la Clínica**: "María Guillén Ortodoncia"
3. **Modificaciones HTML**: Aplicar los cambios descritos en la sección 1 al archivo `mgortodoncia.html`

### Cliente: latino

1. **Imagen del Logo**: `images/latino.jpg` (ya existe)
2. **Nombre de la Clínica**: "Clínica Dental Latino - Dr. Kevin Cevallos"
3. **Modificaciones HTML**: Aplicar los cambios descritos en la sección 1 al archivo `latino.html`

## Notas Importantes

1. **Detección Automática del Cliente**: El sistema ya tiene implementada la detección automática del cliente basada en el nombre del archivo HTML, por lo que no es necesario modificar esta parte.

2. **Configuración del Cliente**: La configuración específica de cada cliente se obtiene del objeto `CLIENTS_CONFIG` definido en `config.js`. Asegúrate de que cada cliente tenga su propia configuración en este archivo.

3. **Imágenes de los Logos**: Asegúrate de que cada cliente tenga su propia imagen de logo en la carpeta `/images` con el mismo nombre que el archivo HTML correspondiente.

4. **Pruebas**: Después de implementar los cambios, prueba cada landing page de cliente para asegurarte de que todo funciona correctamente:
   - La landing page inicial debe estar oculta
   - El cuestionario debe mostrarse directamente
   - El logo del cliente debe aparecer en la parte superior de cada sección
   - Los indicadores de carga deben mostrarse mientras se cargan las fechas y horas
