document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DEL DOM ---
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
    const priceGrid = document.getElementById('price-grid');

    // Elementos del formulario de citas
    const formStep1 = document.getElementById('form-step-1');
    const formStep2 = document.getElementById('form-step-2');
    const dateGrid = document.getElementById('date-grid');
    const timeGrid = document.getElementById('time-grid');
    const hiddenDateInput = document.getElementById('preferred-date');
    const hiddenTimeInput = document.getElementById('preferred-time');
    const selectedDateDisplay = document.getElementById('selected-date-display');
    const selectedTimeDisplay = document.getElementById('selected-time-display');
    const loadingDates = document.getElementById('loading-dates');
    const loadingTimes = document.getElementById('loading-times');
    const nextStepButton = document.getElementById('next-step-button');
    const prevStepButton = document.getElementById('prev-step-button');
    const finishButton = document.getElementById('finish-button');
    const personalInfoForm = document.getElementById('personal-info-form');
    const paymentCheckbox = document.getElementById('payment-confirmation-checkbox');
    const buttonStatusMessage = document.getElementById('button-status-message');

    // --- CONFIGURACIÓN Y ESTADO DEL QUIZ ---
    const questions = [
        {
            question: "Estamos ubicados en Santiago del Estero 60, Piso 6, Edificio EMSA, Tucumán. ¿Puedes asistir presencialmente para tu consulta y cirugía?",
            options: ["Sí, puedo asistir", "No, me queda muy lejos"],
            key: "canAttend"
        },
        {
            question: "¿Qué procedimiento te interesa?",
            options: ["Aumento Mamario", "Rinoplastia", "Abdominoplastia", "Lipoescultura", "Blefaroplastia (Párpados)", "Otro"],
            key: "procedure"
        },
        {
            question: "¿Tienes alguna condición médica preexistente importante? (Ej: diabetes, hipertensión, problemas cardíacos)",
            options: ["No, ninguna", "Sí, pero está controlada", "Sí, y no está controlada"],
            key: "medicalCondition"
        },
        {
            question: "¿Fumas actualmente?",
            options: ["No", "Ocasionalmente", "Diariamente"],
            key: "isSmoker"
        },
        {
            question: "¿Cuál es tu principal motivación para considerar esta cirugía?",
            options: ["Mejorar mi autoestima", "Corregir algo que me incomoda", "Recomendación médica", "Otro motivo"],
            key: "motivation"
        },
        {
            question: "¿Has tenido alguna cirugía plástica anteriormente?",
            options: ["Sí", "No"],
            key: "previousSurgery"
        }
    ];

    let currentQuestionIndex = 0;
    const answers = {};

    function initQuiz() {
        questions.forEach((question, index) => {
            const questionElement = document.createElement('div');
            questionElement.classList.add('question');
            if (index === 0) questionElement.classList.add('active');
            questionElement.innerHTML = `<h3>${question.question}</h3><div class="options">${question.options.map((option, optionIndex) => `<div class="option" data-index="${optionIndex}">${option}</div>`).join('')}</div>`;
            questionContainer.appendChild(questionElement);
        });
        document.querySelectorAll('.option').forEach(option => option.addEventListener('click', selectOption));
        updateButtons();
        updateProgressBar();
    }

    function selectOption(e) {
        const selectedOption = e.target;
        const questionElement = selectedOption.closest('.question');
        const options = questionElement.querySelectorAll('.option');
        options.forEach(option => option.classList.remove('selected'));
        selectedOption.classList.add('selected');
        const questionIndex = Array.from(questionContainer.children).indexOf(questionElement);
        const optionIndex = parseInt(selectedOption.dataset.index);
        answers[questions[questionIndex].key] = { value: questions[questionIndex].options[optionIndex], index: optionIndex };
        if (questions[questionIndex].key === 'canAttend' && optionIndex === 1) {
            questionContainer.style.display = 'none';
            document.querySelector('.buttons').style.display = 'none';
            locationError.style.display = 'flex';
            return;
        }
        nextButton.disabled = false;
    }

    function nextQuestion() {
        if (!answers[questions[currentQuestionIndex].key]) {
            nextButton.disabled = true;
            return;
        }
        if (currentQuestionIndex === questions.length - 1) {
            showResults();
            return;
        }
        document.querySelectorAll('.question')[currentQuestionIndex].classList.remove('active');
        currentQuestionIndex++;
        document.querySelectorAll('.question')[currentQuestionIndex].classList.add('active');
        updateButtons();
        updateProgressBar();
    }

    function prevQuestion() {
        if (currentQuestionIndex === 0) return;
        document.querySelectorAll('.question')[currentQuestionIndex].classList.remove('active');
        currentQuestionIndex--;
        document.querySelectorAll('.question')[currentQuestionIndex].classList.add('active');
        updateButtons();
        updateProgressBar();
    }

    function updateButtons() {
        prevButton.style.display = currentQuestionIndex === 0 ? 'none' : 'block';
        nextButton.textContent = currentQuestionIndex === questions.length - 1 ? 'Ver Resultados' : 'Continuar →';
        nextButton.disabled = !answers[questions[currentQuestionIndex].key];
    }

    function updateProgressBar() {
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function showResults() {
        quizContainer.style.opacity = '0';
        setTimeout(() => {
            quizContainer.style.display = 'none';
            resultsContainer.style.display = 'flex';
            setTimeout(() => {
                resultsContainer.style.opacity = '1';
                const qualified = determineQualification();
                if (qualified) {
                    qualificationResult.textContent = '¡Excelente! Eres un buen candidato para una evaluación';
                    qualificationResult.style.color = 'var(--primary-color)';
                    loadProcedurePrices();
                } else {
                    qualificationResult.textContent = 'Gracias por tu interés. En base a tus respuestas, puede que necesitemos una evaluación más detallada.';
                    qualificationResult.style.color = '#e67e22';
                    appointmentButton.textContent = 'Agendar evaluación de todas formas';
                    loadProcedurePrices();
                }
            }, 50);
        }, 300);
    }

    function determineQualification() {
        if (!answers.canAttend || answers.canAttend.index !== 0) return false;
        if (answers.medicalCondition && answers.medicalCondition.index === 2) return false; // Condición no controlada
        if (answers.isSmoker && answers.isSmoker.index === 2) return false; // Fuma diariamente
        return true;
    }

    function loadProcedurePrices() {
        const selectedProcedure = answers.procedure ? answers.procedure.value : "Otro";
        const prices = {
            "Aumento Mamario": { from: "$2.500.000", to: "$4.000.000" },
            "Rinoplastia": { from: "$2.000.000", to: "$3.500.000" },
            "Abdominoplastia": { from: "$3.000.000", to: "$5.000.000" },
            "Lipoescultura": { from: "$2.800.000", to: "$4.500.000" },
            "Blefaroplastia (Párpados)": { from: "$1.500.000", to: "$2.500.000" },
            "Otro": { from: "A determinar", to: "en consulta" }
        };

        const priceData = prices[selectedProcedure] || prices["Otro"];
        priceGrid.innerHTML = `
            <div class="price-item">
                <h4>${selectedProcedure}</h4>
                <p>Desde ${priceData.from} hasta ${priceData.to} ARS</p>
                <span>Precios aproximados, sujetos a evaluación.</span>
            </div>
        `;
    }

    // --- LÓGICA DE NAVEGACIÓN DE PÁGINAS ---
    startQuizButton.addEventListener('click', () => {
        landingContent.style.opacity = '0';
        setTimeout(() => {
            landingContent.style.display = 'none';
            quizContainer.style.display = 'flex';
            setTimeout(() => {
                quizContainer.style.opacity = '1';
                initQuiz();
            }, 50);
        }, 300);
    });

    nextButton.addEventListener('click', nextQuestion);
    prevButton.addEventListener('click', prevQuestion);

    restartQuizButton.addEventListener('click', () => {
        window.location.reload();
    });

    appointmentButton.addEventListener('click', () => {
        resultsContainer.style.opacity = '0';
        setTimeout(() => {
            resultsContainer.style.display = 'none';
            formContainer.style.display = 'flex';
            setTimeout(() => {
                formContainer.style.opacity = '1';
                loadAvailableDates(); // Inicia la carga de fechas aquí
            }, 50);
        }, 300);
    });

    // --- LÓGICA DEL FORMULARIO DE CITAS (MODIFICADA) ---
    const horariosHabiles = { // 1: Lunes, 2: Martes, etc.
        1: ['17:00', '17:30', '18:00', '18:30', '19:00'],
        2: ['10:00', '10:30', '11:00', '11:30', '12:00'],
        3: ['17:00', '17:30', '18:00', '18:30', '19:00'],
        4: ['10:00', '10:30', '11:00', '11:30', '12:00'],
        5: ['10:00', '10:30', '11:00']
    };

    async function fetchAppointmentsFromN8N() {
        // Simula la llamada a n8n. Reemplaza con tu URL de webhook real.
        // En un caso real, aquí iría: const response = await fetch('URL_DEL_WEBHOOK');
        // const bookedSlots = await response.json();
        // Por ahora, simulamos que algunas citas ya están tomadas:
        return {
            // Formato: "YYYY-MM-DD": ["HH:MM", "HH:MM"]
            "2025-07-29": ["10:00", "11:30"], // Martes
            "2025-07-30": ["17:30"]           // Miércoles
        };
    }

    async function loadAvailableDates() {
        loadingDates.style.display = 'flex';
        dateGrid.style.display = 'none';
        
        const bookedSlots = await fetchAppointmentsFromN8N();

        dateGrid.innerHTML = '';
        const today = new Date();
        let daysAdded = 1;
        let daysCount = 0;

        while (daysCount < 14 && daysAdded < 60) {
            const currentDate = new Date();
            currentDate.setDate(today.getDate() + daysAdded);
            const dayOfWeek = currentDate.getDay();

            if (horariosHabiles[dayOfWeek]) {
                const dateString = currentDate.toISOString().split('T')[0];
                const totalSlots = horariosHabiles[dayOfWeek].length;
                const bookedForDay = bookedSlots[dateString] ? bookedSlots[dateString].length : 0;

                if (totalSlots > bookedForDay) {
                    const dateElement = document.createElement('div');
                    dateElement.classList.add('date-slot');
                    dateElement.dataset.date = dateString;
                    dateElement.innerHTML = `
                        <span class="day-name">${currentDate.toLocaleDateString('es-ES', { weekday: 'long' })}</span>
                        <span class="day-number">${currentDate.getDate()}</span>
                        <span class="month-name">${currentDate.toLocaleDateString('es-ES', { month: 'long' })}</span>
                    `;
                    dateGrid.appendChild(dateElement);
                    daysCount++;
                }
            }
            daysAdded++;
        }
        
        loadingDates.style.display = 'none';
        dateGrid.style.display = 'grid';

        // Añadir event listeners a los nuevos elementos de fecha
        document.querySelectorAll('.date-slot').forEach(slot => {
            slot.addEventListener('click', () => handleDateSelection(slot, bookedSlots));
        });
    }
    
    function handleDateSelection(selectedSlot, bookedSlots) {
        document.querySelectorAll('.date-slot').forEach(s => s.classList.remove('selected'));
        selectedSlot.classList.add('selected');
        
        const dateValue = selectedSlot.dataset.date;
        hiddenDateInput.value = dateValue;
        selectedDateDisplay.textContent = new Date(dateValue + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
        
        // Limpiar hora seleccionada
        hiddenTimeInput.value = '';
        selectedTimeDisplay.textContent = "Selecciona una hora";
        nextStepButton.disabled = true;

        loadAvailableHours(dateValue, bookedSlots);
    }
    
    function loadAvailableHours(date, bookedSlots) {
        loadingTimes.style.display = 'none';
        timeGrid.style.display = 'grid';
        timeGrid.innerHTML = '';

        const dayOfWeek = new Date(date + 'T00:00:00').getDay();
        const allTimes = horariosHabiles[dayOfWeek];
        const bookedTimes = bookedSlots[date] || [];
        
        const availableTimes = allTimes.filter(time => !bookedTimes.includes(time));
        
        if (availableTimes.length > 0) {
            availableTimes.forEach(time => {
                const timeElement = document.createElement('div');
                timeElement.classList.add('time-slot');
                timeElement.dataset.time = time;
                timeElement.textContent = time;
                timeGrid.appendChild(timeElement);
            });
            
            document.querySelectorAll('.time-slot').forEach(slot => {
                slot.addEventListener('click', () => handleTimeSelection(slot));
            });
        } else {
            timeGrid.innerHTML = '<p>No hay horarios disponibles para esta fecha.</p>';
        }
    }
    
    function handleTimeSelection(selectedSlot) {
        document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
        selectedSlot.classList.add('selected');
        
        const timeValue = selectedSlot.dataset.time;
        hiddenTimeInput.value = timeValue;
        selectedTimeDisplay.textContent = timeValue;
        
        nextStepButton.disabled = false; // Habilitar el botón para continuar
    }
    
    // --- NAVEGACIÓN DEL FORMULARIO MULTI-PASO ---
    nextStepButton.addEventListener('click', () => {
        formStep1.style.display = 'none';
        formStep2.style.display = 'block';
        const fullDate = `${selectedDateDisplay.textContent} a las ${selectedTimeDisplay.textContent}hs`;
        document.getElementById('payment-date-time').textContent = fullDate;
    });

    prevStepButton.addEventListener('click', () => {
        formStep2.style.display = 'none';
        formStep1.style.display = 'block';
    });

    paymentCheckbox.addEventListener('change', () => {
        if (paymentCheckbox.checked) {
            finishButton.disabled = false;
            buttonStatusMessage.style.display = 'none';
        } else {
            finishButton.disabled = true;
            buttonStatusMessage.style.display = 'block';
        }
    });

    // --- ENVÍO FINAL DEL FORMULARIO Y PAGO ---
    finishButton.addEventListener('click', () => {
        // Aquí iría la lógica para procesar el pago con Mercado Pago
        // Por ahora, simularemos el envío a WhatsApp y mostraremos un spinner
        
        // Validar formulario de información personal
        if (!personalInfoForm.checkValidity()) {
            personalInfoForm.reportValidity();
            return;
        }

        // Mostrar overlay de "procesando"
        const overlay = document.createElement('div');
        overlay.className = 'mercadopago-overlay';
        overlay.innerHTML = `<div class="mercadopago-spinner"></div><p>Estamos preparando tu link de pago seguro...</p>`;
        document.body.appendChild(overlay);

        // Simulación de creación de preferencia de Mercado Pago
        setTimeout(() => {
            // Lógica para enviar datos a WhatsApp (o a n8n para que envíe el msj)
            const fullname = document.getElementById('fullname').value;
            const whatsapp = document.getElementById('whatsapp').value;
            const mainDoubt = document.getElementById('main_doubt').value;
            const preferredDate = hiddenDateInput.value;
            const preferredTime = hiddenTimeInput.value;

            let message = `*Nueva Solicitud de Cita - Dra. Bossi*\n\n`;
            message += `*DATOS DEL PACIENTE*\n`;
            message += `- Nombre: ${fullname}\n`;
            message += `- WhatsApp: ${whatsapp}\n\n`;
            message += `*CITA SOLICITADA*\n`;
            message += `- Fecha: ${preferredDate}\n`;
            message += `- Hora: ${preferredTime}\n\n`;
            message += `*RESPUESTAS DEL CUESTIONARIO*\n`;
            questions.forEach(q => {
                if(answers[q.key]) {
                    message += `- ${q.question}: ${answers[q.key].value}\n`;
                }
            });
            message += `\n*DUDA PRINCIPAL*\n- ${mainDoubt}\n\n`;
            message += `El paciente ha aceptado los términos y está siendo redirigido para completar el pago de la consulta de $23.000.`;
            
            const encodedMessage = encodeURIComponent(message);
            // Reemplaza el número de teléfono con el real
            const whatsappUrl = `https://wa.me/5493810000000?text=${encodedMessage}`;
            
            // Aquí redirigirías al link de pago de Mercado Pago
            // window.location.href = 'URL_DE_PAGO_MERCADOPAGO';

            // Por ahora, solo quitamos el overlay y mostramos una alerta
            document.body.removeChild(overlay);
            alert("Serías redirigido a Mercado Pago. Después, te enviaremos la confirmación por WhatsApp.");
            console.log("Mensaje para WhatsApp:", message);
            // window.open(whatsappUrl, '_blank');
        }, 2500); // Simula 2.5 segundos de espera
    });
});
