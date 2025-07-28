
document.addEventListener('DOMContentLoaded', () => {
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
    const appointmentForm = document.getElementById('appointment-form');
    const qualificationResult = document.getElementById('qualification-result');

    // Quiz questions
    const questions = [
        {
            question: "Estamos ubicados en Rayón # 25, San Juan del Río, Querétaro (dentro del Hospital Medical Center), ¿puedes asistir personalmente si confirmamos una cita?",
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
        },
        {
            question: "¿Tienes radiografías recientes?",
            options: ["Sí", "No"],
            key: "hasXrays"
        },
        {
            question: "¿Usas dentaduras postizas?",
            options: ["Sí", "No"],
            key: "usesDentures"
        }
    ];

    // Quiz state
    let currentQuestionIndex = 0;
    const answers = {};

    // Initialize quiz
    function initQuiz() {
        // Create question elements
        questions.forEach((question, index) => {
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

        // Add event listeners to options
        document.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', selectOption);
        });

        updateButtons();
        updateProgressBar();
    }

    // Select option
    function selectOption(e) {
        const selectedOption = e.target;
        const questionElement = selectedOption.closest('.question');
        const options = questionElement.querySelectorAll('.option');

        // Remove selected class from all options
        options.forEach(option => option.classList.remove('selected'));

        // Add selected class to clicked option
        selectedOption.classList.add('selected');

        // Save answer
        const questionIndex = Array.from(questionContainer.children).indexOf(questionElement);
        const optionIndex = parseInt(selectedOption.dataset.index);
        answers[questions[questionIndex].key] = {
            value: questions[questionIndex].options[optionIndex],
            index: optionIndex
        };

        // Check if this is the location question and they can't attend
        if (questions[questionIndex].key === 'canAttend' && optionIndex === 1) {
            // Hide the question container and buttons
            questionContainer.style.display = 'none';
            document.querySelector('.buttons').style.display = 'none';

            // Show the location error message
            locationError.style.display = 'flex';
            return;
        }

        // Enable next button if it was disabled
        nextButton.disabled = false;
    }

    // Navigate to next question
    function nextQuestion() {
        // If current question has no answer, disable next button
        if (!answers[questions[currentQuestionIndex].key]) {
            nextButton.disabled = true;
            return;
        }

        // If last question, show results
        if (currentQuestionIndex === questions.length - 1) {
            showResults();
            return;
        }

        // Hide current question and show next
        document.querySelectorAll('.question')[currentQuestionIndex].classList.remove('active');
        currentQuestionIndex++;
        document.querySelectorAll('.question')[currentQuestionIndex].classList.add('active');

        updateButtons();
        updateProgressBar();
    }

    // Navigate to previous question
    function prevQuestion() {
        if (currentQuestionIndex === 0) return;

        document.querySelectorAll('.question')[currentQuestionIndex].classList.remove('active');
        currentQuestionIndex--;
        document.querySelectorAll('.question')[currentQuestionIndex].classList.add('active');

        updateButtons();
        updateProgressBar();
    }

    // Update navigation buttons
    function updateButtons() {
        prevButton.style.display = currentQuestionIndex === 0 ? 'none' : 'block';

        if (currentQuestionIndex === questions.length - 1) {
            nextButton.textContent = 'Ver Resultados';
        } else {
            nextButton.textContent = 'Siguiente';
        }

        // Disable next button if current question has no answer
        nextButton.disabled = !answers[questions[currentQuestionIndex].key];
    }

    // Update progress bar
    function updateProgressBar() {
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Show results
    function showResults() {
        // Fade out quiz container
        quizContainer.style.opacity = '0';

        setTimeout(() => {
            quizContainer.style.display = 'none';
            resultsContainer.style.display = 'flex';

            // Fade in results container
            setTimeout(() => {
                resultsContainer.style.opacity = '1';

                // Determine qualification
                const qualified = determineQualification();

                if (qualified) {
                    qualificationResult.textContent = 'Eres candidato para implantes dentales';
                    qualificationResult.style.color = 'var(--primary-color)';
                    qualificationResult.classList.add('qualified');
                } else {
                    qualificationResult.textContent = 'En este momento no calificas para implantes';
                    qualificationResult.style.color = '#e67e22';
                }
            }, 50);
        }, 300);
    }

    // Determine if user qualifies
    function determineQualification() {
        // Must be able to attend the clinic
        if (!answers.canAttend || answers.canAttend.index !== 0) {
            return false;
        }

        // Check diabetes status - uncontrolled diabetes is a risk factor
        if (answers.hasDiabetes && answers.hasDiabetes.index === 2) { // Uncontrolled diabetes
            return false;
        }

        // Check if they have enough missing teeth to justify implants
        if (!answers.missingTeeth) {
            return false;
        }

        // People with dentures are excellent candidates for implants
        // especially for All-on-Four solutions
        if (answers.usesDentures && answers.usesDentures.index === 0) { // Yes to dentures
            return true;
        }

        // People with multiple missing teeth are good candidates
        if (answers.missingTeeth.index >= 1) { // 3 or more teeth missing
            return true;
        }

        // For 1-2 missing teeth, they qualify if they've had the issue for some time
        if (answers.missingTeeth.index === 0 && answers.timeSinceLoss && answers.timeSinceLoss.index >= 1) {
            return true;
        }

        return false;
    }

    // Event listeners
    startQuizButton.addEventListener('click', () => {
        // Fade out landing content
        landingContent.style.opacity = '0';

        setTimeout(() => {
            landingContent.style.display = 'none';
            quizContainer.style.display = 'flex';

            // Fade in quiz container
            setTimeout(() => {
                quizContainer.style.opacity = '1';
                initQuiz();
            }, 50);
        }, 300);
    });

    nextButton.addEventListener('click', nextQuestion);
    prevButton.addEventListener('click', prevQuestion);

    // Handle restart button click
    restartQuizButton.addEventListener('click', () => {
        // Reset the quiz
        locationError.style.display = 'none';
        questionContainer.style.display = 'block';
        document.querySelector('.buttons').style.display = 'flex';

        // Go back to the landing page
        quizContainer.style.opacity = '0';

        setTimeout(() => {
            quizContainer.style.display = 'none';
            landingContent.style.display = 'flex';

            // Reset answers and current question
            Object.keys(answers).forEach(key => delete answers[key]);
            currentQuestionIndex = 0;

            // Clear question container
            questionContainer.innerHTML = '';

            // Fade in landing content
            setTimeout(() => {
                landingContent.style.opacity = '1';
            }, 50);
        }, 300);
    });

    // Handle appointment button click
    appointmentButton.addEventListener('click', () => {
        // Fade out results container
        resultsContainer.style.opacity = '0';

        setTimeout(() => {
            resultsContainer.style.display = 'none';
            formContainer.style.display = 'flex';

            // Fade in form container
            setTimeout(() => {
                formContainer.style.opacity = '1';
            }, 50);
        }, 300);
    });

    // Configuración de horario laboral (fácilmente ajustable)
    const businessHours = {
        start: 9, // 9 AM
        end: 18,  // 6 PM
        interval: 30 // intervalo en minutos
    };

    // Cargar fechas disponibles (próximos 14 días hábiles L-V)
    function loadAvailableDates() {
        const dateSelect = document.getElementById('preferred-date');
        const today = new Date();
        let daysAdded = 0;
        let daysCount = 0;

        // Nombres de los días y meses en español
        const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

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
    }

    // Cargar horas disponibles según la configuración
    function loadAvailableHours() {
        const timeSelect = document.getElementById('preferred-time');

        // Limpiar opciones existentes excepto la primera (placeholder)
        while (timeSelect.options.length > 1) {
            timeSelect.remove(1);
        }

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
    }

    // Cargar fechas y horas al iniciar
    loadAvailableDates();
    loadAvailableHours();

    // WhatsApp validation
    const whatsappInput = document.getElementById('whatsapp');
    const whatsappValidation = document.getElementById('whatsapp-validation');
    let whatsappValid = false;

    whatsappInput.addEventListener('blur', validateWhatsApp);
    whatsappInput.addEventListener('input', function() {
        // Clear validation message when user is typing
        whatsappValidation.textContent = '';
        whatsappValidation.className = 'validation-message';
    });

    function validateWhatsApp() {
        const whatsappNumber = whatsappInput.value.trim();

        // Basic format validation
        if (!/^\d{10,15}$/.test(whatsappNumber)) {
            whatsappValidation.textContent = 'Ingresa un número válido (10-15 dígitos sin espacios ni guiones)';
            whatsappValidation.className = 'validation-message error';
            whatsappValid = false;
            return;
        }

        // Show checking message
        whatsappValidation.textContent = 'Verificando número...';
        whatsappValidation.className = 'validation-message';

        // Verificación básica de formato antes de llamar al webhook
        if (!/^\d{10,15}$/.test(whatsappNumber)) {
            whatsappValidation.textContent = 'Formato inválido. Ingresa solo números (10-15 dígitos)';
            whatsappValidation.className = 'validation-message error';
            whatsappValid = false;
            return;
        }

        // Llamada al webhook exacto que usa odontolab.co para validar números de WhatsApp
        fetch('https://sswebhookss.odontolab.co/webhook/02eb0643-1b9d-4866-87a7-f892d6a945ea', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ whatsapp_check: whatsappNumber })
        })
        .then(response => response.json())
        .then(data => {
            console.log('API Response:', data);

            if (data && typeof data.exists === 'boolean') {
                if (data.exists === true) {
                    // El número existe en WhatsApp
                    whatsappValidation.textContent = 'Número de WhatsApp válido';
                    whatsappValidation.className = 'validation-message success';
                    whatsappValid = true;
                } else {
                    // El número no existe en WhatsApp
                    whatsappValidation.textContent = 'Este número no tiene WhatsApp activo';
                    whatsappValidation.className = 'validation-message error';
                    whatsappValid = false;
                }
            } else {
                // Respuesta inesperada de la API
                whatsappValidation.textContent = 'No se pudo verificar el número';
                whatsappValidation.className = 'validation-message error';
                whatsappValid = false;
            }
        })
        .catch(error => {
            console.error('Error validando WhatsApp:', error);
            whatsappValidation.textContent = 'Error al verificar el número';
            whatsappValidation.className = 'validation-message error';
            whatsappValid = false;
        });
    }

    // Handle form submission
    appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate the form
        if (!document.getElementById('payment-agreement').checked) {
            alert('Debes aceptar el requisito de depósito para continuar.');
            return;
        }

        // Validate WhatsApp number
        if (!whatsappValid) {
            alert('Por favor ingresa un número de WhatsApp válido.');
            whatsappInput.focus();
            return;
        }

        // Get form values
        const fullname = document.getElementById('fullname').value;
        const whatsapp = whatsappInput.value;
        const preferredDate = document.getElementById('preferred-date').value;
        const preferredTime = document.getElementById('preferred-time').value;

        // Obtener el texto visible de la fecha seleccionada
        const dateOption = document.querySelector(`#preferred-date option[value="${preferredDate}"]`);
        const formattedDate = dateOption ? dateOption.textContent : preferredDate;

        // Create WhatsApp message with all the information
        let message = `Hola, soy ${fullname} y me interesa agendar una valoración para implantes dentales.\n\n`;
        message += `*DATOS DE CONTACTO*\n`;
        message += `- Nombre: ${fullname}\n`;
        message += `- WhatsApp: ${whatsapp}\n\n`;
        message += `*CITA SOLICITADA*\n`;
        message += `- Fecha: ${formattedDate}\n`;
        message += `- Hora: ${preferredTime}\n\n`;
        message += `*ENTIENDO QUE:*\n`;
        message += `- Se requiere un depósito de $400 para confirmar mi cita\n`;
        message += `- Este monto será deducido del costo total del tratamiento\n\n`;
        message += `*RESPUESTAS DEL CUESTIONARIO*\n`;

        // Add quiz answers to the message
        questions.forEach(question => {
            if (answers[question.key]) {
                message += `- ${question.question.replace(/\?/g, '')}? ${answers[question.key].value}\n`;
            }
        });

        // Encode the message for URL
        const encodedMessage = encodeURIComponent(message);

        // Show confirmation message
        alert('¡Gracias! Ahora serás redirigido a WhatsApp para completar tu solicitud de cita.');

        // Open WhatsApp with the message
        window.open(`https://wa.me/+5214271234567?text=${encodedMessage}`, '_blank');
    });
});
