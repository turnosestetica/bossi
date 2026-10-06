// Variables globales - Definidas en el ámbito global para que sean accesibles desde el HTML
let availabilityDataLoaded = false;

// Detectar qué configuración de cliente usar basado en el nombre del archivo HTML
function detectClientConfig() {
    // Obtener el nombre del archivo HTML actual (sin la extensión .html)
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1).replace('.html', '');

    console.log('Nombre de archivo detectado:', filename);

    // Buscar la configuración correspondiente en CLIENTS_CONFIG
    if (typeof CLIENTS_CONFIG !== 'undefined' && CLIENTS_CONFIG[filename]) {
        console.log('Configuración de cliente encontrada para:', filename);
        return CLIENTS_CONFIG[filename];
    }

    // Si no se encuentra una configuración específica, usar la primera disponible como fallback
    if (typeof CLIENTS_CONFIG !== 'undefined') {
        const firstClient = Object.keys(CLIENTS_CONFIG)[0];
        console.log('Usando configuración de cliente por defecto:', firstClient);
        return CLIENTS_CONFIG[firstClient];
    }

    console.error('No se encontró ninguna configuración de cliente');
    return {};
}

// Obtener la configuración del cliente actual
const CONFIG = detectClientConfig();

function formatPrice(value) {
    const amount = Number(value);
    return Number.isFinite(amount) ? amount.toLocaleString('es-AR') : '';
}

// Depuración: Mostrar la configuración detectada
console.log('Configuración detectada:', CONFIG);
console.log('Configuración completa:', typeof CLIENTS_CONFIG !== 'undefined' ? CLIENTS_CONFIG : 'No definida');

// Aplicar colores desde la configuración
if (CONFIG && CONFIG.colors) {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', CONFIG.colors.primary);
    root.style.setProperty('--secondary-color', CONFIG.colors.secondary);
    root.style.setProperty('--accent-color', CONFIG.colors.accent);
    root.style.setProperty('--text-color', CONFIG.colors.text);
    root.style.setProperty('--highlight-color', CONFIG.colors.highlight);
}

window.answers = {}; // Para almacenar las respuestas del cuestionario

// Usar las preguntas desde la configuración si están disponibles
window.questions = CONFIG && CONFIG.questions ? CONFIG.questions : [
    {
        question: "¿Puedes asistir a nuestra clínica en Santiago del Estero 60, Piso 6, Edificio EMSA, Tucumán?",
        options: ["Sí, puedo asistir", "No, me queda muy lejos"],
        key: "location"
    },
    {
        question: "¿Qué procedimiento te interesa?",
        options: ["Lipoescultura", "Aumento mamario", "Lipoabdominoplastia", "Tratamientos estéticos no quirúrgicos", "Remodelación costal", "Otro procedimiento"],
        key: "procedure"
    }
];

// Función para volver al formulario desde la página de confirmación
window.goBackToForm = function () {
    console.log('goBackToForm called');

    const formStep1 = document.getElementById('form-step-1');
    const formStep2 = document.getElementById('form-step-2');

    if (!formStep1 || !formStep2) {
        console.error('No se encontraron los pasos del formulario:', { formStep1, formStep2 });
        return;
    }

    // Mostrar el paso 1 y ocultar el paso 2
    formStep2.style.display = 'none';
    formStep1.style.display = 'flex';

    console.log('Volviendo al paso 1 del formulario');
};

// Función para enviar el formulario
window.submitForm = function () {
    console.log('submitForm called');

    // Deshabilitar el botón para evitar envíos duplicados
    const confirmButton = document.getElementById('confirm-button');
    if (confirmButton) {
        confirmButton.disabled = true;
        confirmButton.innerHTML = 'Enviando...';
    }

    // Mostrar el contenedor de estado
    const submissionStatus = document.getElementById('submission-status');
    if (submissionStatus) {
        submissionStatus.style.display = 'block';
    }

    // Obtener los valores del formulario
    const fullname = document.getElementById('fullname').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const preferredDate = document.getElementById('preferred-date').value;
    const preferredTime = document.getElementById('preferred-time').value;

    // Obtener el texto visible de la fecha seleccionada
    const dateOption = document.querySelector(`#preferred-date option[value="${preferredDate}"]`);
    const formattedDate = dateOption ? dateOption.textContent : preferredDate;

    // Crear mensaje para WhatsApp con pago 100%
    let message = `Hola, soy ${fullname} y me interesa agendar una consulta con la Dra. Constanza Bossi.\n\n`;
    message += `*DATOS DE CONTACTO*\n`;
    message += `- Nombre: ${fullname}\n`;
    message += `- WhatsApp: ${whatsapp}\n\n`;
    message += `*CITA SOLICITADA*\n`;
    message += `- Fecha: ${formattedDate}\n`;
    message += `- Hora: ${preferredTime}\n\n`;
    message += `*ENTIENDO QUE:*\n`;
    const formattedTotalAmount = formatPrice(CONFIG && CONFIG.clinic ? CONFIG.clinic.consultationPrice : 40000);
    message += `- Se requiere el pago total anticipado de $${formattedTotalAmount} para confirmar mi cita\n\n`;
    message += `*RESPUESTAS DEL CUESTIONARIO*\n`;

    // Agregar respuestas del cuestionario al mensaje
    if (window.questions && window.questions.length > 0) {
        window.questions.forEach(question => {
            if (window.answers[question.key]) {
                message += `- ${question.question.replace(/\?/g, '')}? ${window.answers[question.key].value}\n`;
            }
        });
    }

    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(message);

    // Recopilar respuestas del cuestionario en formato legible
    let respuestasFormateadas = '';

    // Mostrar las respuestas en la página de confirmación
    const summaryAnswers = document.getElementById('summary-answers');
    if (summaryAnswers) {
        summaryAnswers.innerHTML = '';
        summaryAnswers.parentElement.classList.remove('hidden');
    }

    if (window.questions && window.questions.length > 0) {
        window.questions.forEach(question => {
            if (window.answers[question.key]) {
                respuestasFormateadas += `${question.question}: ${window.answers[question.key].value}\n`;

                if (summaryAnswers) {
                    const answerItem = document.createElement('div');
                    answerItem.classList.add('info-row');
                    answerItem.innerHTML = `
                        <div class="info-label">${question.question}:</div>
                        <div class="info-value">${window.answers[question.key].value}</div>
                    `;
                    summaryAnswers.appendChild(answerItem);
                }
            }
        });
    }

    // Enviar datos al endpoint
    const formData = {
        fullname: fullname,
        whatsapp: whatsapp,
        tratamiento_interes: window.answers && window.answers.procedure ? window.answers.procedure.value : 'Consulta de Evaluación',
        fecha_cita: `${formattedDate} ${preferredTime}`,
        respuestas: respuestasFormateadas || 'No se registraron respuestas al cuestionario.',
        landingUrl: window.location.href,
        estado: "NUEVO"
    };

    // Disparar eventos personalizados de Facebook Pixel
    if (typeof fbq !== 'undefined') {
        const pasoNum = window.questions.length + 4;
        const eventName = `Paso${pasoNum}_EnvioFormulario`;

        fbq('trackCustom', eventName, {
            event_category: 'Form',
            event_label: 'Envío del formulario',
            fullname: formData.fullname,
            whatsapp: formData.whatsapp,
            fecha_cita: formData.fecha_cita
        });

        fbq('trackCustom', 'CitaFiltro', {
            fullname: formData.fullname,
            whatsapp: formData.whatsapp,
            fecha_cita: formData.fecha_cita
        });

        fbq('track', 'Lead', {
            content_name: 'Formulario de cita para cirugía plástica',
            content_category: 'Cirugía Plástica',
            value: 1,
            currency: 'ARS'
        });
    }

    // Enviar datos al webhook usando fetch
    const webhookData = {
        fullname: formData.fullname,
        whatsapp: formData.whatsapp,
        tratamiento_interes: formData.tratamiento_interes || 'Cirugía plástica',
        fecha_cita: formData.fecha_cita,
        landingUrl: window.location.href,
        respuestas: formData.respuestas || '',
        estado: "NUEVO",
        origen: "Landing Dra. Constanza Bossi"
    };

    fetch('https://sswebhookss.odontolab.co/webhook/0dc8f34f-0992-419f-a841-b3782f2556a5', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(() => {
            const successMessage = document.getElementById('success-message');
            const errorMessage = document.getElementById('error-message');

            if (successMessage) successMessage.style.display = 'flex';
            if (errorMessage) errorMessage.style.display = 'none';

            setTimeout(function () {
                window.location.href = `https://wa.me/+5493812093646?text=${encodedMessage}`;
            }, 2000);
        })
        .catch(error => {
            console.error('Error al enviar los datos:', error);

            const errorMessage = document.getElementById('error-message');
            const successMessage = document.getElementById('success-message');

            if (errorMessage) errorMessage.style.display = 'flex';
            if (successMessage) successMessage.style.display = 'none';

            if (confirmButton) {
                confirmButton.disabled = false;
                confirmButton.innerHTML = 'Confirmar y contactar por WhatsApp';
            }

            setTimeout(function () {
                window.open(`https://wa.me/+${CONFIG && CONFIG.clinic ? CONFIG.clinic.whatsapp : '5493812093646'}?text=${encodedMessage}`, '_blank');
            }, 3000);
        });
};

document.addEventListener('DOMContentLoaded', () => {
    // Actualizar el título de la página
    if (CONFIG && CONFIG.clinic && CONFIG.clinic.name) {
        document.title = `${CONFIG.clinic.name} - Evaluación de Tratamiento`;
    }

    // Actualizar el contenido de la pantalla de inicio
    if (CONFIG && CONFIG.landingPage) {
        const mainTitle = document.querySelector('.landing-content .compact-title');
        if (mainTitle && CONFIG.landingPage.mainTitle) {
            mainTitle.textContent = CONFIG.landingPage.mainTitle;
        }

        const subtitle = document.querySelector('.landing-content .simple-intro');
        if (subtitle && CONFIG.landingPage.subtitle) {
            subtitle.textContent = CONFIG.landingPage.subtitle;
        }

        const startButton = document.getElementById('start-quiz');
        if (startButton && CONFIG.landingPage.startButtonText) {
            startButton.textContent = CONFIG.landingPage.startButtonText;
        }

        // Actualizar precios y condiciones de pago
        if (CONFIG.treatments && CONFIG.treatments.length > 0) {
            const valoracionTreatment = CONFIG.treatments.find(t => t.name.toLowerCase().includes('valoración') || t.name.toLowerCase().includes('valoracion'));
            if (valoracionTreatment) {
                const valoracionPrice = document.querySelector('.valoracion-row .price-value');
                if (valoracionPrice) {
                    const consultationPrice = valoracionTreatment.regularPrice || (CONFIG.clinic ? CONFIG.clinic.consultationPrice : 0) || valoracionTreatment.initialPrice;
                    valoracionPrice.textContent = `$${formatPrice(consultationPrice)}`;
                }

                // Actualizar el texto del pago total en .payment-note
                const paymentNote = document.querySelector('.payment-note p:first-child strong');
                if (paymentNote && CONFIG.clinic && CONFIG.clinic.consultationPrice) {
                    const paymentText = document.querySelector('.payment-note p:first-child');
                    if (paymentText) {
                        paymentText.innerHTML = `Para confirmar tu cita es <strong>obligatorio</strong> realizar el pago total de $${formatPrice(CONFIG.clinic.consultationPrice)}.`;
                    }

                    const discountText = document.querySelector('.payment-note p:last-child');
                    if (discountText) {
                        discountText.innerHTML = `Solo se confirman citas con el pago acreditado con anterioridad.`;
                    }
                }

                // Actualizar el mensaje de valoración en la parte superior
                if (CONFIG.landingPage && CONFIG.landingPage.priceNote) {
                    const priceNote = document.querySelector('.results-container .price-note');
                    if (priceNote) {
                        priceNote.textContent = CONFIG.landingPage.priceNote;
                    }
                }

                // Actualizar el texto en la sección de recordatorio de pago si existe
                if (CONFIG.clinic && CONFIG.clinic.consultationPrice) {
                    const paymentReminder = document.querySelector('.payment-reminder p:first-child');
                    if (paymentReminder) {
                        paymentReminder.innerHTML = `<strong>IMPORTANTE:</strong> Se requiere el pago total de $${formatPrice(CONFIG.clinic.consultationPrice)} para asegurar y confirmar tu cita de valoración.`;
                    }
                }
            }
        }
    }

    // Actualizar la dirección en el mensaje de error de ubicación
    if (CONFIG && CONFIG.clinic && CONFIG.clinic.address) {
        const locationErrorAddress = document.querySelector('#location-error p:nth-child(3)');
        if (locationErrorAddress) {
            locationErrorAddress.textContent = `Nuestros tratamientos requieren atención presencial en nuestra clínica ubicada en ${CONFIG.clinic.address}.`;
        }
    }

    // Actualizar los textos de confirmación
    if (CONFIG && CONFIG.landingPage && CONFIG.landingPage.confirmationText) {
        const saveRedirectText = document.getElementById('save-redirect-text');
        const depositInfoText = document.getElementById('deposit-info-text');

        if (saveRedirectText && CONFIG.landingPage.confirmationText.saveAndRedirect) {
            let saveRedirectContent = CONFIG.landingPage.confirmationText.saveAndRedirect;
            if (CONFIG.clinic && CONFIG.clinic.name) {
                saveRedirectContent = saveRedirectContent.replace(/María Guillén Ortodoncia|Implant Center/g, CONFIG.clinic.name);
            }
            saveRedirectText.innerHTML = saveRedirectContent;
        }

        if (depositInfoText && CONFIG.landingPage.confirmationText.depositInfo) {
            let depositInfoContent = CONFIG.landingPage.confirmationText.depositInfo;
            if (CONFIG.clinic && CONFIG.clinic.consultationPrice) {
                depositInfoContent = depositInfoContent.replace(/\$[\d.]+/g, '$' + formatPrice(CONFIG.clinic.consultationPrice));
            }
            depositInfoText.innerHTML = depositInfoContent;
        }
    }

    // Generar dinámicamente el HTML de los precios si hay tratamientos en la configuración
    if (CONFIG && CONFIG.treatments && CONFIG.treatments.length > 0) {
        const priceList = document.querySelector('.price-list');
        if (priceList) {
            priceList.innerHTML = '';
            const selectedProcedure = window.answers.procedure ? window.answers.procedure.value : '';
            const normalizedProcedure = selectedProcedure.trim();

            const showAllTreatments =
                !normalizedProcedure ||
                normalizedProcedure.includes('Otro procedimiento') ||
                normalizedProcedure.includes('no quirúrgicos') ||
                normalizedProcedure.includes('estéticos');

            const pricingTitle = document.querySelector('.pricing-info h3');
            if (pricingTitle) {
                pricingTitle.textContent = 'Precio de Referencia';
            }

            CONFIG.treatments.forEach(treatment => {
                if (treatment.name.toLowerCase().includes('valoración') || treatment.name.toLowerCase().includes('valoracion')) {
                    return;
                }

                if (!showAllTreatments) {
                    const treatmentNameLower = treatment.name.toLowerCase().trim();
                    const procedureLower = normalizedProcedure.toLowerCase().trim();

                    if (procedureLower === "lipoescultura" && treatmentNameLower.includes("lipo")) {
                        // Coincide caso especial
                    } else if (treatmentNameLower === procedureLower || treatmentNameLower.startsWith(procedureLower) || procedureLower.startsWith(treatmentNameLower)) {
                        // Coincidencia
                    } else {
                        return;
                    }
                }

                const treatmentGroup = document.createElement('div');
                treatmentGroup.className = 'treatment-group';

                const mainRow = document.createElement('div');
                mainRow.className = treatment.isOffer ? 'price-row highlight' : 'price-row';

                const nameSpan = document.createElement('span');
                nameSpan.className = 'price-label';
                nameSpan.textContent = treatment.name + ':';

                const priceSpan = document.createElement('span');
                priceSpan.className = 'price-value';

                if (treatment.highlightText) {
                    priceSpan.textContent = treatment.highlightText;
                } else if (treatment.initialPrice) {
                    priceSpan.textContent = `$${treatment.initialPrice.toLocaleString()}`;
                } else {
                    priceSpan.textContent = treatment.customNote || 'Precio personalizado';
                }

                mainRow.appendChild(nameSpan);
                mainRow.appendChild(priceSpan);
                treatmentGroup.appendChild(mainRow);
                priceList.appendChild(treatmentGroup);
            });
        }
    }

    // DOM Elements
    const landingContent = document.getElementById('landing-content');
    const quizContainer = document.getElementById('quiz-container');
    const resultsContainer = document.getElementById('results-container');
    const formContainer = document.getElementById('form-container');
    const questionContainer = document.getElementById('question-container');
    const locationError = document.getElementById('location-error');
    const progressBar = document.getElementById('progress');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const startQuizButton = document.getElementById('start-quiz');
    const restartQuizButton = document.getElementById('restart-quiz');
    const appointmentButton = document.getElementById('appointment-button');
    const qualificationResult = document.getElementById('qualification-result');

    let currentQuestionIndex = 0;

    // Inicializar Quiz
    function initQuiz() {
        if (!questionContainer) return;
        questionContainer.innerHTML = '';

        window.questions.forEach((question, index) => {
            const questionElement = document.createElement('div');
            questionElement.classList.add('question');
            if (index === 0) questionElement.classList.add('active');

            questionElement.innerHTML = `
                <h3>${question.question}</h3>
                <div class="options">
                    ${question.options.map((option, optionIndex) => `
                        <div class="option" data-index="${optionIndex}">${option}</div>
                    `).join('')}
                </div>
            `;
            questionContainer.appendChild(questionElement);
        });

        document.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', selectOption);
        });

        updateButtons();
        updateProgressBar();
        setupOptionsGrid();
    }

    function selectOption(e) {
        const selectedOption = e.target;
        const questionElement = selectedOption.closest('.question');
        const options = questionElement.querySelectorAll('.option');

        options.forEach(option => option.classList.remove('selected'));
        selectedOption.classList.add('selected');

        const questionIndex = Array.from(questionContainer.children).indexOf(questionElement);
        const optionIndex = parseInt(selectedOption.dataset.index);
        window.answers[window.questions[questionIndex].key] = {
            value: window.questions[questionIndex].options[optionIndex],
            index: optionIndex
        };

        if ((window.questions[questionIndex].key === 'location' || window.questions[questionIndex].key === 'canAttend') && optionIndex === 1) {
            questionContainer.style.display = 'none';
            const buttons = document.querySelector('.buttons');
            if (buttons) buttons.style.display = 'none';
            if (locationError) locationError.style.display = 'flex';
            return;
        }

        nextButton.disabled = false;
        const validationMsg = questionElement.querySelector('.validation-message');
        if (validationMsg) validationMsg.style.display = 'none';
    }

    function nextQuestion() {
        if (!window.answers[window.questions[currentQuestionIndex].key]) {
            const currentQuestion = document.querySelectorAll('.question')[currentQuestionIndex];
            let validationMsg = currentQuestion.querySelector('.validation-message');

            if (!validationMsg) {
                validationMsg = document.createElement('div');
                validationMsg.className = 'validation-message';
                validationMsg.textContent = 'Por favor selecciona una opción para continuar';
                validationMsg.style.color = '#F44336';
                validationMsg.style.marginTop = '1rem';
                validationMsg.style.fontSize = '1rem';
                validationMsg.style.textAlign = 'center';
                validationMsg.style.fontWeight = 'bold';
                validationMsg.style.padding = '10px';
                validationMsg.style.backgroundColor = 'rgba(244, 67, 54, 0.1)';
                validationMsg.style.borderRadius = '5px';
                validationMsg.style.border = '1px solid #F44336';
                currentQuestion.appendChild(validationMsg);
            } else {
                validationMsg.style.display = 'block';
            }
            return;
        }

        if (currentQuestionIndex === window.questions.length - 1) {
            showResults();
            return;
        }

        document.querySelectorAll('.question')[currentQuestionIndex].classList.remove('active');
        currentQuestionIndex++;
        document.querySelectorAll('.question')[currentQuestionIndex].classList.add('active');

        if (typeof fbq !== 'undefined') {
            const currentQuestion = window.questions[currentQuestionIndex];
            const pasoNum = currentQuestionIndex + 2;
            const eventName = `Paso${pasoNum}_Pregunta${currentQuestionIndex + 1}`;

            fbq('trackCustom', eventName, {
                event_category: 'Quiz',
                event_label: `Pregunta ${currentQuestionIndex + 1}`,
                question: currentQuestion.question
            });
        }

        updateButtons();
        updateProgressBar();
        setTimeout(setupOptionsGrid, 100);
    }

    function prevQuestion() {
        if (currentQuestionIndex === 0) return;

        document.querySelectorAll('.question')[currentQuestionIndex].classList.remove('active');
        currentQuestionIndex--;
        document.querySelectorAll('.question')[currentQuestionIndex].classList.add('active');

        updateButtons();
        updateProgressBar();
        setTimeout(setupOptionsGrid, 100);
    }

    function updateButtons() {
        const buttonsContainer = document.querySelector('.buttons');
        if (!buttonsContainer) return;

        if (currentQuestionIndex === 0) {
            if (prevButton) prevButton.style.display = 'none';
            buttonsContainer.classList.remove('two-buttons');
        } else {
            if (prevButton) prevButton.style.display = 'block';
            buttonsContainer.classList.add('two-buttons');
        }

        if (nextButton) {
            nextButton.textContent = currentQuestionIndex === window.questions.length - 1 ? 'FINALIZAR →' : 'Continuar →';
            nextButton.disabled = false;
        }
    }

    function updateProgressBar() {
        const progress = ((currentQuestionIndex + 1) / window.questions.length) * 100;
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }

    function loadPrices() {
        if (!CONFIG || !CONFIG.treatments || CONFIG.treatments.length === 0) return;
        const priceGrid = document.getElementById('price-grid');
        if (!priceGrid) return;

        priceGrid.innerHTML = '';
        const selectedProcedure = window.answers.procedure ? window.answers.procedure.value : '';
        const normalizedProcedure = selectedProcedure.trim();

        const showAllTreatments =
            !normalizedProcedure ||
            normalizedProcedure.includes('Otro procedimiento') ||
            normalizedProcedure.includes('no quirúrgicos') ||
            normalizedProcedure.includes('estéticos');

        const pricingTitle = document.querySelector('.pricing-info h3');
        if (pricingTitle) {
            pricingTitle.textContent = 'Precio de Referencia';
        }

        // Card de evaluación
        const evaluationCard = document.createElement('div');
        evaluationCard.className = 'price-card';
        evaluationCard.innerHTML = `
            <div class="price-title">Consulta de Evaluación</div>
            <div class="price-amount">$${formatPrice(CONFIG.clinic ? CONFIG.clinic.consultationPrice : 40000)}</div>
            <div class="price-note">Pago anticipado requerido para confirmar</div>
        `;
        priceGrid.appendChild(evaluationCard);

        let treatmentsToShow = [];
        if (showAllTreatments) {
            treatmentsToShow = CONFIG.treatments.filter(t => !t.name.toLowerCase().includes('valoración') && !t.name.toLowerCase().includes('valoracion'));
        } else {
            const procedureLower = normalizedProcedure.toLowerCase().trim();
            treatmentsToShow = CONFIG.treatments.filter(t => {
                const treatmentNameLower = t.name.toLowerCase().trim();
                return !t.name.toLowerCase().includes('valoración') &&
                       !t.name.toLowerCase().includes('valoracion') &&
                       (treatmentNameLower === procedureLower || treatmentNameLower.startsWith(procedureLower) || procedureLower.startsWith(treatmentNameLower));
            });
        }

        treatmentsToShow.forEach(treatment => {
            const priceCard = document.createElement('div');
            priceCard.className = 'price-card';

            const priceTitle = document.createElement('div');
            priceTitle.className = 'price-title';
            priceTitle.textContent = treatment.name;

            const priceAmount = document.createElement('div');
            priceAmount.className = 'price-amount';
            const currency = treatment.currency || '$';
            priceAmount.textContent = treatment.initialPrice ? `${currency}${treatment.initialPrice}` : (treatment.customNote || 'Precio personalizado');

            const priceNote = document.createElement('div');
            priceNote.className = 'price-note';
            priceNote.textContent = 'Precio desde';

            priceCard.appendChild(priceTitle);
            priceCard.appendChild(priceAmount);
            priceCard.appendChild(priceNote);
            priceGrid.appendChild(priceCard);
        });
    }

    function setupOptionsGrid() {
        const questionsToCheck = ['peso', 'altura', 'precio', 'presupuesto', 'invertir'];
        document.querySelectorAll('.question').forEach(q => {
            const heading = q.querySelector('h3');
            if (heading) {
                const text = heading.textContent.toLowerCase();
                if (questionsToCheck.some(word => text.includes(word))) {
                    const optionsContainer = q.querySelector('.options');
                    if (optionsContainer) optionsContainer.classList.add('options-grid');
                }
            }
        });
    }

    function showResults() {
        if (quizContainer) quizContainer.style.opacity = '0';

        if (typeof fbq !== 'undefined') {
            const pasoNum = window.questions.length + 2;
            fbq('trackCustom', `Paso${pasoNum}_FinCuestionario`, {
                event_category: 'Quiz',
                event_label: 'Finalización del cuestionario'
            });
        }

        setTimeout(() => {
            if (quizContainer) quizContainer.style.display = 'none';
            showResultsAndLoadData();
            loadPrices();

            const qualified = determineQualification();
            if (qualificationResult) {
                if (qualified) {
                    qualificationResult.textContent = 'Podrías ser candidato. Para comprobarlo, solicita una cita de evaluación.';
                    qualificationResult.style.color = 'var(--primary-color)';
                    qualificationResult.classList.add('qualified');
                } else {
                    qualificationResult.textContent = 'Lamentablemente, no podemos avanzar con tu cita si no puedes visitarnos en nuestra ubicación';
                    qualificationResult.style.color = '#e67e22';
                }
            }
        }, 300);
    }

    function showResultsAndLoadData() {
        if (!resultsContainer) return;
        resultsContainer.style.display = 'flex';
        resultsContainer.style.opacity = '1';

        const appointmentBtn = document.getElementById('appointment-button');
        if (!availabilityDataLoaded) {
            loadAvailabilityData(false).then(success => {
                availabilityDataLoaded = success;
            });
        }
    }

    function determineQualification() {
        const locationKey = window.answers.location ? 'location' : 'canAttend';
        if (!window.answers[locationKey] || window.answers[locationKey].index !== 0) {
            return false;
        }
        return true;
    }

    if (startQuizButton) {
        startQuizButton.addEventListener('click', () => {
            if (landingContent) landingContent.style.opacity = '0';
            if (typeof fbq !== 'undefined') {
                fbq('trackCustom', 'Paso1_InicioQuiz', { event_category: 'Quiz', event_label: 'Inicio del cuestionario' });
            }
            setTimeout(() => {
                if (landingContent) landingContent.style.display = 'none';
                if (quizContainer) {
                    quizContainer.style.display = 'flex';
                    setTimeout(() => {
                        quizContainer.style.opacity = '1';
                        initQuiz();
                    }, 50);
                }
            }, 300);
        });
    }

    // Inicializar directo
    initQuiz();
    updateButtons();
    updateProgressBar();
    setTimeout(setupOptionsGrid, 500);

    const buttonStatusMessage = document.getElementById('button-status-message');
    if (buttonStatusMessage) {
        buttonStatusMessage.textContent = 'Verifica tu número de WhatsApp para continuar';
        buttonStatusMessage.className = 'button-status-message';
    }

    const confirmButton = document.getElementById('confirm-button');
    if (confirmButton) confirmButton.disabled = true;

    if (nextButton) nextButton.addEventListener('click', nextQuestion);
    if (prevButton) prevButton.addEventListener('click', prevQuestion);

    if (restartQuizButton) {
        restartQuizButton.addEventListener('click', () => {
            if (locationError) locationError.style.display = 'none';
            if (questionContainer) questionContainer.style.display = 'block';
            const buttons = document.querySelector('.buttons');
            if (buttons) buttons.style.display = 'flex';

            Object.keys(window.answers).forEach(key => delete window.answers[key]);
            document.querySelectorAll('.question').forEach((q, idx) => {
                q.classList.toggle('active', idx === 0);
            });
            currentQuestionIndex = 0;
            updateButtons();
            updateProgressBar();
        });
    }

    if (appointmentButton) {
        appointmentButton.addEventListener('click', () => {
            if (resultsContainer) resultsContainer.style.opacity = '0';

            if (typeof fbq !== 'undefined') {
                const pasoNum = window.questions.length + 3;
                fbq('trackCustom', `Paso${pasoNum}_InicioFormulario`, {
                    event_category: 'Form',
                    event_label: 'Inicio del formulario de cita',
                    qualified: determineQualification()
                });
            }

            appointmentButton.disabled = true;
            appointmentButton.innerHTML = '<span class="loading-spinner"></span> Consultando agenda de la Dra. Bossi...';

            setTimeout(() => {
                if (resultsContainer) resultsContainer.style.display = 'none';
                if (formContainer) {
                    formContainer.style.display = 'flex';
                    formContainer.style.opacity = '1';
                }

                const dateGrid = document.getElementById('date-grid');
                const timeGrid = document.getElementById('time-grid');
                const loadingDates = document.getElementById('loading-dates');
                const loadingTimes = document.getElementById('loading-times');

                if (dateGrid) dateGrid.style.display = 'none';
                if (timeGrid) timeGrid.style.display = 'none';
                if (loadingDates) loadingDates.style.display = 'flex';
                if (loadingTimes) loadingTimes.style.display = 'flex';

                if (!availabilityDataLoaded) {
                    loadAvailabilityData(true).then(success => {
                        appointmentButton.disabled = false;
                        appointmentButton.innerHTML = 'Ver disponibilidad';
                        if (!success) {
                            alert('Hubo un problema al cargar las fechas disponibles. Por favor, intenta nuevamente.');
                            if (formContainer) formContainer.style.opacity = '0';
                            setTimeout(() => {
                                if (formContainer) formContainer.style.display = 'none';
                                if (resultsContainer) {
                                    resultsContainer.style.display = 'flex';
                                    resultsContainer.style.opacity = '1';
                                }
                            }, 300);
                        } else {
                            availabilityDataLoaded = true;
                        }
                    });
                } else {
                    if (dateGrid) dateGrid.style.display = 'grid';
                    if (timeGrid) timeGrid.style.display = 'grid';
                    if (loadingDates) loadingDates.style.display = 'none';
                    if (loadingTimes) loadingTimes.style.display = 'none';

                    appointmentButton.disabled = false;
                    appointmentButton.innerHTML = 'Ver disponibilidad';
                }
            }, 300);
        });
    }

    let availabilityData = null;
    const availabilityWebhookUrl = CONFIG && CONFIG.webhooks ? CONFIG.webhooks.availability : 'https://sswebhookss.odontolab.co/webhook/f424d581-8261-4141-bcd6-4b021cf61d39';

    async function loadAvailabilityData(showAlerts = false) {
        try {
            const response = await fetch(availabilityWebhookUrl);
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            const responseData = await response.json();

            if (Array.isArray(responseData)) {
                if (responseData.length > 0 && responseData[0].fecha && Array.isArray(responseData[0].horas)) {
                    availabilityData = {};
                    responseData.forEach(item => {
                        if (item.fecha && Array.isArray(item.horas)) availabilityData[item.fecha] = item.horas;
                    });
                } else {
                    availabilityData = responseData[0] || {};
                }
            } else if (typeof responseData === 'object' && responseData.turnos && Array.isArray(responseData.turnos)) {
                availabilityData = {};
                responseData.turnos.forEach(turno => {
                    if (turno.fecha && turno.hora_inicio) {
                        if (!availabilityData[turno.fecha]) availabilityData[turno.fecha] = [];
                        availabilityData[turno.fecha].push(turno.hora_inicio);
                    }
                });
            } else {
                availabilityData = responseData || {};
            }

            loadAvailableDates();

            const timeGrid = document.getElementById('time-grid');
            if (timeGrid) timeGrid.innerHTML = '';
            const timeInput = document.getElementById('preferred-time');
            if (timeInput) timeInput.value = '';
            const timeDisplay = document.getElementById('selected-time-display');
            if (timeDisplay) timeDisplay.textContent = 'Selecciona una hora';

            return true;
        } catch (error) {
            console.error('Error al cargar datos de disponibilidad:', error);
            if (showAlerts) alert('Hubo un problema al cargar las fechas disponibles. Por favor, intenta nuevamente.');
            return false;
        }
    }

    function loadAvailableDates() {
        const dateInput = document.getElementById('preferred-date');
        const dateGrid = document.getElementById('date-grid');
        const loadingDates = document.getElementById('loading-dates');
        if (!dateGrid || !availabilityData) return;

        dateGrid.innerHTML = '';
        const availableDates = Object.keys(availabilityData);

        availableDates.forEach(date => {
            if (availabilityData[date] && availabilityData[date].length > 0) {
                const dateOption = document.createElement('div');
                dateOption.className = 'date-option';
                dateOption.dataset.value = date;
                dateOption.textContent = date;

                dateOption.addEventListener('click', function () {
                    document.querySelectorAll('.date-option').forEach(opt => opt.classList.remove('selected'));
                    this.classList.add('selected');

                    if (dateInput) dateInput.value = this.dataset.value;
                    const dateDisplay = document.getElementById('selected-date-display');
                    if (dateDisplay) dateDisplay.textContent = this.dataset.value;

                    loadAvailableHours();

                    setTimeout(() => {
                        const timeSection = document.querySelector('.selector-section:nth-child(2)');
                        if (timeSection) timeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300);
                });

                dateGrid.appendChild(dateOption);
            }
        });

        if (loadingDates) loadingDates.style.display = 'none';
        dateGrid.style.display = 'grid';
    }

    function loadAvailableHours() {
        const dateInput = document.getElementById('preferred-date');
        const timeInput = document.getElementById('preferred-time');
        const timeGrid = document.getElementById('time-grid');
        const loadingTimes = document.getElementById('loading-times');

        if (loadingTimes) loadingTimes.style.display = 'flex';
        if (timeGrid) {
            timeGrid.style.display = 'none';
            timeGrid.innerHTML = '';
        }

        if (timeInput) timeInput.value = '';
        const timeDisplay = document.getElementById('selected-time-display');
        if (timeDisplay) timeDisplay.textContent = 'Selecciona una hora';

        const selectedDate = dateInput ? dateInput.value : '';
        if (!selectedDate || !availabilityData || !availabilityData[selectedDate]) return;

        let availableTimes = availabilityData[selectedDate];
        if (!Array.isArray(availableTimes)) availableTimes = Object.values(availableTimes || {});

        if (Array.isArray(availableTimes) && timeGrid) {
            availableTimes.forEach(time => {
                const timeOption = document.createElement('div');
                timeOption.className = 'time-option';
                timeOption.dataset.value = time;
                timeOption.textContent = time;

                timeOption.addEventListener('click', function () {
                    document.querySelectorAll('.time-option').forEach(opt => opt.classList.remove('selected'));
                    this.classList.add('selected');

                    if (timeInput) timeInput.value = this.dataset.value;
                    if (timeDisplay) timeDisplay.textContent = this.textContent;

                    setTimeout(() => {
                        const continueButton = document.getElementById('next-step-button');
                        if (continueButton) continueButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                });

                timeGrid.appendChild(timeOption);
            });

            if (loadingTimes) loadingTimes.style.display = 'none';
            timeGrid.style.display = 'grid';
        }
    }

    // Validación WhatsApp
    const whatsappInput = document.getElementById('whatsapp');
    const whatsappValidation = document.getElementById('whatsapp-validation');

    if (whatsappInput) {
        if (whatsappInput.value === '') whatsappInput.value = '549';

        whatsappInput.addEventListener('input', function () {
            if (whatsappValidation) {
                whatsappValidation.textContent = '';
                whatsappValidation.className = 'validation-message';
            }
            const finishButton = document.getElementById('finish-button');
            const buttonStatusMessage = document.getElementById('button-status-message');
            if (finishButton) finishButton.disabled = true;
            if (buttonStatusMessage) {
                buttonStatusMessage.textContent = 'Verifica tu número de WhatsApp para continuar';
                buttonStatusMessage.className = 'button-status-message';
            }
        });

        whatsappInput.addEventListener('blur', function () {
            const whatsappNumber = this.value.trim();
            if (!whatsappNumber) return;

            const digitsOnly = whatsappNumber.replace(/\D/g, '');
            if (digitsOnly.length < 10 || digitsOnly.length > 15) {
                if (whatsappValidation) {
                    whatsappValidation.textContent = 'Ingresa un número válido (al menos 10 dígitos)';
                    whatsappValidation.className = 'validation-message error';
                }
                return;
            }

            if (whatsappValidation) {
                whatsappValidation.textContent = 'Verificando número...';
                whatsappValidation.className = 'validation-message';
            }

            let respuestasTexto = '';
            let respuestasDetalladas = {};
            if (window.questions) {
                window.questions.forEach(q => {
                    if (window.answers[q.key]) {
                        respuestasTexto += `${q.question}: ${window.answers[q.key].value}\n`;
                        respuestasDetalladas[q.key] = window.answers[q.key].value;
                    }
                });
            }

            const validationData = {
                whatsapp_check: digitsOnly,
                action: 'validate_whatsapp',
                origen: "Landing Dra. Constanza Bossi",
                landingUrl: window.location.href,
                respuestas: respuestasTexto,
                respuestas_detalladas: respuestasDetalladas
            };

            fetch(CONFIG && CONFIG.webhooks ? CONFIG.webhooks.whatsappValidation : 'https://sswebhookss.odontolab.co/webhook/02eb0643-1b9d-4866-87a7-f892d6a945ea', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(validationData)
            })
                .then(res => res.json())
                .then(data => {
                    const finishButton = document.getElementById('finish-button');
                    const buttonStatusMessage = document.getElementById('button-status-message');
                    const paymentCheckbox = document.getElementById('payment-confirmation-checkbox');
                    const checkboxChecked = paymentCheckbox && paymentCheckbox.checked;

                    if (data && data.exists === true) {
                        if (whatsappValidation) {
                            whatsappValidation.textContent = 'Número de WhatsApp válido';
                            whatsappValidation.className = 'validation-message success';
                        }
                        if (finishButton) finishButton.disabled = !checkboxChecked;
                        if (buttonStatusMessage) {
                            buttonStatusMessage.textContent = checkboxChecked ? 'Todo listo para continuar' : 'Debes confirmar que entiendes la política de pago';
                            buttonStatusMessage.className = checkboxChecked ? 'button-status-message success' : 'button-status-message';
                        }
                    } else {
                        if (whatsappValidation) {
                            whatsappValidation.textContent = 'Este número no tiene WhatsApp activo';
                            whatsappValidation.className = 'validation-message error';
                        }
                        if (finishButton) finishButton.disabled = true;
                        if (buttonStatusMessage) {
                            buttonStatusMessage.textContent = 'Número de WhatsApp inválido';
                            buttonStatusMessage.className = 'button-status-message error';
                        }
                    }
                })
                .catch(() => {
                    if (whatsappValidation) {
                        whatsappValidation.textContent = 'Error al verificar el número';
                        whatsappValidation.className = 'validation-message error';
                    }
                });
        });
    }

    // Paso siguiente en el formulario
    const nextStepButton = document.getElementById('next-step-button');
    if (nextStepButton) {
        nextStepButton.addEventListener('click', () => {
            const preferredDate = document.getElementById('preferred-date').value;
            const preferredTime = document.getElementById('preferred-time').value;

            if (!preferredDate || !preferredTime) {
                alert('Por favor selecciona una fecha y hora disponible.');
                return;
            }

            if (typeof fbq !== 'undefined') {
                const pasoNum = window.questions.length + 3;
                fbq('trackCustom', `Paso${pasoNum}_SeleccionFechaHora`, {
                    event_category: 'Form',
                    event_label: 'Selección de fecha y hora',
                    qualified: determineQualification()
                });
            }

            const paymentDateTimeElement = document.getElementById('payment-date-time');
            if (paymentDateTimeElement) {
                const selectedDateDisplay = document.getElementById('selected-date-display').textContent;
                const selectedTimeDisplay = document.getElementById('selected-time-display').textContent;
                paymentDateTimeElement.textContent = `${selectedDateDisplay} a las ${selectedTimeDisplay}`;
            }

            document.getElementById('form-step-1').style.display = 'none';
            document.getElementById('form-step-2').style.display = 'block';

            window.scrollTo(0, 0);
            if (whatsappInput) whatsappInput.focus();
        });
    }

    // Regresar al paso 1
    const prevStepButton = document.getElementById('prev-step-button');
    if (prevStepButton) {
        prevStepButton.addEventListener('click', () => {
            document.getElementById('form-step-2').style.display = 'none';
            document.getElementById('form-step-1').style.display = 'block';
        });
    }

    // Checkbox de confirmación
    const paymentConfirmationCheckbox = document.getElementById('payment-confirmation-checkbox');
    if (paymentConfirmationCheckbox) {
        paymentConfirmationCheckbox.addEventListener('change', function () {
            const finishButton = document.getElementById('finish-button');
            const buttonStatusMessage = document.getElementById('button-status-message');
            const whatsappValid = whatsappValidation && whatsappValidation.classList.contains('success');

            if (finishButton) {
                if (this.checked && whatsappValid) {
                    finishButton.disabled = false;
                    if (buttonStatusMessage) {
                        buttonStatusMessage.textContent = 'Todo listo para continuar';
                        buttonStatusMessage.className = 'button-status-message success';
                    }
                } else if (!this.checked) {
                    finishButton.disabled = true;
                    if (buttonStatusMessage) {
                        buttonStatusMessage.textContent = 'Debes confirmar que entiendes la política de pago';
                        buttonStatusMessage.className = 'button-status-message';
                    }
                } else {
                    finishButton.disabled = true;
                    if (buttonStatusMessage) {
                        buttonStatusMessage.textContent = 'Verifica tu número de WhatsApp para continuar';
                        buttonStatusMessage.className = 'button-status-message';
                    }
                }
            }
        });
    }

    // Botón Finalizar -> Generar Link y Redirigir
    const finishButtonElement = document.getElementById('finish-button');
    if (finishButtonElement) {
        finishButtonElement.disabled = true;

        finishButtonElement.addEventListener('click', () => {
            if (typeof fbq !== 'undefined') {
                const pasoNum = window.questions.length + 5;
                fbq('trackCustom', `Paso${pasoNum}_Finalizacion`, {
                    event_category: 'Form',
                    event_label: 'Finalización del proceso',
                    qualified: determineQualification()
                });
            }

            const fullname = document.getElementById('fullname').value;
            const whatsapp = document.getElementById('whatsapp').value;
            let preferredDate = document.getElementById('preferred-date').value || "Próxima disponible";
            let preferredTime = document.getElementById('preferred-time').value || "A coordinar";
            const mainDoubt = document.getElementById('main_doubt') ? document.getElementById('main_doubt').value : '';

            let respuestasTexto = '';
            window.questions.forEach(q => {
                if (window.answers[q.key]) {
                    respuestasTexto += `${q.question}: ${window.answers[q.key].value}\n`;
                }
            });

            if (mainDoubt && mainDoubt.trim() !== '') {
                respuestasTexto += `¿Cuál es tu principal duda sobre el procedimiento?: ${mainDoubt}\n`;
            }

            const formData = {
                fullname: fullname,
                whatsapp: whatsapp,
                tratamiento_interes: window.answers.procedure ? window.answers.procedure.value : 'Cirugía plástica',
                fecha_cita: `${preferredDate} ${preferredTime}`,
                fecha: preferredDate,
                hora: preferredTime,
                landingUrl: window.location.href,
                respuestas: respuestasTexto,
                respuestas_detalladas: {},
                videollamada_previa: window.answers.videocall ? (window.answers.videocall.value.includes('Sí') ? 'Sí' : 'No') : 'No',
                peso: window.answers.weight ? window.answers.weight.value : '',
                altura: window.answers.height ? window.answers.height.value : '',
                duda_principal: mainDoubt,
                estado: "NUEVO",
                origen: "Landing Dra. Constanza Bossi"
            };

            window.questions.forEach(q => {
                if (window.answers[q.key]) {
                    formData.respuestas_detalladas[q.key] = window.answers[q.key].value;
                }
            });

            if (!fullname || !whatsapp) {
                alert('Por favor completa tu nombre y número de WhatsApp.');
                return;
            }

            const overlay = document.createElement('div');
            overlay.className = 'mercadopago-overlay';
            overlay.innerHTML = `
                <div class="mercadopago-spinner"></div>
                <p>Generando link de pago personalizado...</p>
                <p>Por favor espera, serás redirigido a Mercado Pago en unos segundos.</p>
            `;
            document.body.appendChild(overlay);

            finishButtonElement.disabled = true;
            finishButtonElement.innerHTML = '<span class="loading-spinner"></span> Procesando...';

            fetch('https://sswebhookss.odontolab.co/webhook/c0cb515e-caf1-424f-b67c-84c022d90eae', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify([
                    {
                        "cliente": "bossi",
                        "paciente": fullname,
                        "telefono": whatsapp.replace(/\D/g, ''),
                        "whatsapp_cliente": "5493812093646"
                    }
                ])
            })
                .then(response => response.json())
                .then(data => {
                    let mercadoPagoLink = null;
                    if (Array.isArray(data) && data.length > 0 && data[0].mercadopago_linkpersonalizado_creado) {
                        mercadoPagoLink = data[0].mercadopago_linkpersonalizado_creado;
                    } else if (data && data.mercadopago_linkpersonalizado_creado) {
                        mercadoPagoLink = data.mercadopago_linkpersonalizado_creado;
                    }

                    if (mercadoPagoLink) {
                        formData.mercadopago_link = mercadoPagoLink;
                        const targetUrl = CONFIG && CONFIG.webhooks ? CONFIG.webhooks.formSubmission : "https://sswebhookss.odontolab.co/webhook/0dc8f34f-0992-419f-a841-b3782f2556a5";

                        jQuery.ajax({
                            url: targetUrl,
                            data: JSON.stringify(formData),
                            type: "POST",
                            contentType: "application/json",
                            dataType: "json"
                        })
                            .done(function () {
                                if (typeof fbq !== 'undefined') {
                                    fbq('trackCustom', 'CitaFiltro', {
                                        fullname: fullname,
                                        whatsapp: whatsapp,
                                        fecha_cita: `${preferredDate} ${preferredTime}`,
                                        tratamiento: 'Cirugía plástica'
                                    });
                                }
                                window.location.href = mercadoPagoLink;
                            })
                            .fail(function (error) {
                                console.error('Error al enviar los datos:', error);
                                if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
                                finishButtonElement.disabled = false;
                                finishButtonElement.innerHTML = 'Finalizar →';
                                alert('Hubo un error al guardar los datos. Por favor, inténtalo de nuevo.');
                            });
                    } else {
                        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
                        finishButtonElement.disabled = false;
                        finishButtonElement.innerHTML = 'Finalizar →';
                        alert('Hubo un error al generar el link de pago. Por favor, inténtalo de nuevo.');
                    }
                })
                .catch(error => {
                    console.error('Error al obtener el link de Mercado Pago:', error);
                    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
                    finishButtonElement.disabled = false;
                    finishButtonElement.innerHTML = 'Finalizar →';
                    alert('Hubo un error al conectar con el servidor de pagos. Por favor, inténtalo de nuevo.');
                });
        });
    }
});
