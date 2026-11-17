/**
 * Landing Dra. Constanza Bossi
 * Flujo: evaluación (cuestionario) → turno (fecha y hora) → pago (Mercado Pago)
 *
 * Depende de config.js (CLIENTS_CONFIG). No usa jQuery.
 */
(function () {
    'use strict';

    /* =========================================================
       1. Configuración del cliente
       ========================================================= */

    function detectClientConfig() {
        const path = window.location.pathname;
        const filename = path.substring(path.lastIndexOf('/') + 1).replace('.html', '');

        if (typeof CLIENTS_CONFIG !== 'undefined' && CLIENTS_CONFIG[filename]) {
            return CLIENTS_CONFIG[filename];
        }

        if (typeof CLIENTS_CONFIG !== 'undefined') {
            const firstClient = Object.keys(CLIENTS_CONFIG)[0];
            return CLIENTS_CONFIG[firstClient] || {};
        }

        console.error('No se encontró ninguna configuración de cliente');
        return {};
    }

    const CONFIG = detectClientConfig() || {};
    const CLINIC = CONFIG.clinic || {};
    const LANDING = CONFIG.landingPage || {};
    const WEBHOOKS = CONFIG.webhooks || {};

    const QUESTIONS = Array.isArray(CONFIG.questions) ? CONFIG.questions : [];
    const CONSULTATION_PRICE = Number(CLINIC.consultationPrice || CLINIC.depositAmount || 40000);
    const CLINIC_WHATSAPP = String(CLINIC.whatsapp || '5493812093646').replace(/\D/g, '');

    const AVAILABILITY_URL = WEBHOOKS.availability ||
        'https://script.google.com/macros/s/AKfycby5o5wpGUPsaC3IhZgGlV-em6iBWKZCItsvqdkkNRM5xXNd_JtnvYVz3OYdTocn99MlQg/exec?fechasdisponibles=1';
    const VALIDATION_URL = WEBHOOKS.whatsappValidation ||
        'https://sswebhookss.odontolab.co/webhook/02eb0643-1b9d-4866-87a7-f892d6a945ea';
    const SUBMISSION_URL = WEBHOOKS.formSubmission ||
        'https://sswebhookss.odontolab.co/webhook/0dc8f34f-0992-419f-a841-b3782f2556a5';
    const PAYMENT_URL = 'https://sswebhookss.odontolab.co/webhook/c0cb515e-caf1-424f-b67c-84c022d90eae';

    window.answers = window.answers || {};
    window.questions = QUESTIONS;

    function formatPrice(value) {
        const amount = Number(value);
        return Number.isFinite(amount) ? amount.toLocaleString('es-AR') : '';
    }

    function money(value) {
        return '$' + formatPrice(value);
    }

    function normalizePhone(value) {
        return String(value || '').replace(/\D/g, '');
    }

    /* =========================================================
       2. Fechas y horarios
       ========================================================= */

    const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const DAYS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

    function parseDateValue(value) {
        if (!value) return null;
        const raw = String(value).trim();
        let match = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
        if (match) return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));

        match = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
        if (match) return new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]));

        const parsed = new Date(raw);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    function formatDateLabel(value) {
        const date = parseDateValue(value);
        if (!date) return String(value || '');
        return `${DAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]}`;
    }

    function startOfToday() {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    function isPastDate(value) {
        const date = parseDateValue(value);
        return Boolean(date) && date.getTime() < startOfToday().getTime();
    }

    function sortDateValues(values) {
        return values.slice().sort(function (a, b) {
            const first = parseDateValue(a);
            const second = parseDateValue(b);
            if (!first) return 1;
            if (!second) return -1;
            return first - second;
        });
    }

    function sortTimes(values) {
        return values.slice().sort(function (a, b) {
            return String(a).localeCompare(String(b), 'es', { numeric: true });
        });
    }

    // Expuesto para pruebas automatizadas del flujo.
    window.BossiFlow = {
        parseDateValue: parseDateValue,
        formatDateLabel: formatDateLabel,
        sortDateValues: sortDateValues,
        sortTimes: sortTimes,
        isPastDate: isPastDate,
        normalizePhone: normalizePhone
    };

    /* =========================================================
       3. Utilidades de interfaz
       ========================================================= */

    function toast(message, type) {
        let node = document.getElementById('app-toast');
        if (!node) {
            node = document.createElement('div');
            node.id = 'app-toast';
            node.setAttribute('role', 'status');
            node.setAttribute('aria-live', 'polite');
            document.body.appendChild(node);
        }
        node.textContent = message;
        node.className = 'toast' + (type === 'error' ? ' toast--error' : '');
        void node.offsetWidth;
        node.classList.add('is-visible');

        clearTimeout(toast.timer);
        toast.timer = setTimeout(function () {
            node.classList.remove('is-visible');
        }, 5000);
    }

    function fireEvent(name, params) {
        if (typeof fbq !== 'undefined') {
            fbq('trackCustom', name, params || {});
        }
    }

    /* =========================================================
       4. Inicio
       ========================================================= */

    function init() {
        const byId = function (id) { return document.getElementById(id); };

        const el = {
            quiz: byId('quiz-container'),
            results: byId('results-container'),
            form: byId('form-container'),
            questionContainer: byId('question-container'),
            locationError: byId('location-error'),
            quizTop: byId('quiz-top'),
            quizFooter: byId('quiz-footer'),
            prevButton: byId('prev-button'),
            quizHint: byId('quiz-hint'),
            progress: byId('progress'),
            progressBar: byId('progress-bar'),
            progressLabel: byId('progress-label'),
            restartButton: byId('restart-quiz'),
            qualification: byId('qualification-result'),
            resultsLead: byId('results-lead'),
            appointmentButton: byId('appointment-button'),
            priceGrid: byId('price-grid'),
            formScroll: byId('form-scroll'),
            step1: byId('form-step-1'),
            step2: byId('form-step-2'),
            footer1: byId('form-footer-1'),
            footer2: byId('form-footer-2'),
            dateGrid: byId('date-grid'),
            timeGrid: byId('time-grid'),
            loadingDates: byId('loading-dates'),
            loadingTimes: byId('loading-times'),
            datesEmpty: byId('dates-empty'),
            timesEmpty: byId('times-empty'),
            timeSection: byId('time-section'),
            dateInput: byId('preferred-date'),
            timeInput: byId('preferred-time'),
            selectionSummary: byId('selection-summary'),
            nextStep: byId('next-step-button'),
            nextHint: byId('next-step-hint'),
            summaryDatetime: byId('summary-datetime'),
            paymentDatetime: byId('payment-date-time'),
            changeSlot: byId('change-slot-button'),
            whatsapp: byId('whatsapp'),
            whatsappValidation: byId('whatsapp-validation'),
            fullname: byId('fullname'),
            doubt: byId('main_doubt'),
            checkbox: byId('payment-confirmation-checkbox'),
            finish: byId('finish-button'),
            status: byId('button-status-message'),
            datesWhatsapp: byId('dates-whatsapp'),
            stepper: byId('stepper')
        };

        if (!el.quiz || !el.questionContainer) return;

        const state = {
            index: 0,
            advanceTimer: null,
            availability: null,
            availabilityPromise: null,
            availabilityLoaded: false,
            selectedDate: '',
            whatsappVerified: false,
            validationToken: 0,
            busy: false
        };

        let questionElements = [];

        /* ---------- Textos desde config ---------- */

        document.querySelectorAll('[data-amount]').forEach(function (node) {
            node.textContent = money(CONSULTATION_PRICE);
        });

        if (el.qualification && LANDING.qualificationTitle) {
            el.qualification.textContent = LANDING.qualificationTitle;
        }
        if (el.resultsLead && LANDING.qualificationMessage) {
            el.resultsLead.textContent = LANDING.qualificationMessage;
        }
        if (el.appointmentButton && LANDING.appointmentButtonText) {
            el.appointmentButton.textContent = LANDING.appointmentButtonText;
        }
        if (el.datesWhatsapp) {
            el.datesWhatsapp.href = 'https://wa.me/' + CLINIC_WHATSAPP +
                '?text=' + encodeURIComponent('Hola, quiero consultar por turnos de evaluación.');
        }

        /* ---------- Pantallas y stepper ---------- */

        function setStepper(step) {
            if (!el.stepper) return;
            el.stepper.querySelectorAll('.stepper__item').forEach(function (item) {
                const number = Number(item.dataset.step);
                item.classList.toggle('is-current', number === step);
                item.classList.toggle('is-done', number < step);
                const dot = item.querySelector('.stepper__dot');
                if (dot) dot.textContent = number < step ? '✓' : String(number);
            });
        }

        function showScreen(target) {
            [el.quiz, el.results, el.form].forEach(function (screen) {
                if (!screen) return;
                screen.classList.remove('is-active');
                screen.style.display = 'none';
            });

            if (!target) return;

            target.style.display = 'flex';
            void target.offsetWidth;
            target.classList.add('is-active');

            const scroller = target.querySelector('.screen__scroll');
            if (scroller) scroller.scrollTop = 0;
            target.scrollTop = 0;
            window.scrollTo(0, 0);
        }

        /* ---------- Cuestionario ---------- */

        function renderQuiz() {
            el.questionContainer.innerHTML = '';
            questionElements = [];

            if (!QUESTIONS.length) {
                const empty = document.createElement('p');
                empty.className = 'empty-state';
                empty.innerHTML = 'No pudimos cargar la evaluación. Escribinos por ' +
                    '<a href="https://wa.me/' + CLINIC_WHATSAPP + '" target="_blank" rel="noopener">WhatsApp</a>.';
                el.questionContainer.appendChild(empty);
                return;
            }

            QUESTIONS.forEach(function (question, index) {
                const wrapper = document.createElement('section');
                wrapper.className = 'question' + (index === 0 ? ' active' : '');
                wrapper.dataset.index = String(index);

                const title = document.createElement('h3');
                title.id = 'question-' + index;
                title.textContent = question.question;

                const options = document.createElement('div');
                options.className = 'options';
                options.setAttribute('role', 'group');
                options.setAttribute('aria-labelledby', title.id);

                question.options.forEach(function (label, optionIndex) {
                    const button = document.createElement('button');
                    button.type = 'button';
                    button.className = 'option';
                    button.dataset.index = String(optionIndex);
                    button.setAttribute('aria-pressed', 'false');
                    button.textContent = label;
                    button.addEventListener('click', function () {
                        selectOption(index, optionIndex, button);
                    });
                    options.appendChild(button);
                });

                wrapper.appendChild(title);
                wrapper.appendChild(options);
                el.questionContainer.appendChild(wrapper);
                questionElements.push(wrapper);
            });

            applyOptionsGrid();
            updateProgress();
        }

        function applyOptionsGrid() {
            const gridKeywords = ['peso', 'altura', 'precio', 'presupuesto', 'invertir'];

            questionElements.forEach(function (wrapper, index) {
                const question = QUESTIONS[index];
                const options = wrapper.querySelector('.options');
                if (!question || !options) return;

                const text = String(question.question || '').toLowerCase();
                const needsGrid = question.options.length >= 6 ||
                    gridKeywords.some(function (word) { return text.indexOf(word) !== -1; });

                options.classList.toggle('options-grid', needsGrid);
            });
        }

        function selectOption(questionIndex, optionIndex, button) {
            const question = QUESTIONS[questionIndex];
            if (!question || state.busy) return;

            const wrapper = questionElements[questionIndex];
            if (!wrapper) return;

            wrapper.querySelectorAll('.option').forEach(function (option) {
                option.classList.remove('selected');
                option.setAttribute('aria-pressed', 'false');
            });

            button.classList.add('selected');
            button.setAttribute('aria-pressed', 'true');

            window.answers[question.key] = {
                value: question.options[optionIndex],
                index: optionIndex
            };

            if ((question.key === 'location' || question.key === 'canAttend') && optionIndex !== 0) {
                showLocationError();
                return;
            }

            fireEvent('Paso' + (questionIndex + 2) + '_Pregunta' + (questionIndex + 1), {
                event_category: 'Quiz',
                event_label: 'Pregunta ' + (questionIndex + 1),
                question: question.question
            });

            clearTimeout(state.advanceTimer);
            state.advanceTimer = setTimeout(function () {
                state.advanceTimer = null;
                if (questionIndex >= QUESTIONS.length - 1) {
                    goToResults();
                } else {
                    goToQuestion(questionIndex + 1);
                }
            }, 300);
        }

        function goToQuestion(index) {
            state.index = index;

            questionElements.forEach(function (node, position) {
                node.classList.toggle('active', position === index);
            });

            el.questionContainer.scrollTop = 0;
            updateProgress();
        }

        function updateProgress() {
            const total = Math.max(QUESTIONS.length, 1);
            const current = Math.min(state.index + 1, total);

            if (el.progress) el.progress.style.width = ((current / total) * 100) + '%';
            if (el.progressLabel) el.progressLabel.textContent = 'Pregunta ' + current + ' de ' + total;
            if (el.progressBar) {
                el.progressBar.setAttribute('aria-valuenow', String(current));
                el.progressBar.setAttribute('aria-valuemax', String(total));
            }
            if (el.prevButton) el.prevButton.hidden = state.index === 0;
            if (el.quizFooter) el.quizFooter.classList.toggle('is-first', state.index === 0);
            if (el.quizHint) {
                el.quizHint.textContent = state.index >= total - 1
                    ? 'Última pregunta: tocá una opción para ver tu resultado'
                    : 'Tocá una opción para continuar';
            }
        }

        function goBack() {
            clearTimeout(state.advanceTimer);
            state.advanceTimer = null;
            if (state.index === 0) return;
            goToQuestion(state.index - 1);
        }

        function showLocationError() {
            clearTimeout(state.advanceTimer);
            state.advanceTimer = null;

            if (el.questionContainer) el.questionContainer.style.display = 'none';
            if (el.quizTop) el.quizTop.style.display = 'none';
            if (el.quizFooter) el.quizFooter.hidden = true;
            if (el.locationError) el.locationError.style.display = 'flex';
        }

        function restartQuiz() {
            clearTimeout(state.advanceTimer);
            state.advanceTimer = null;

            if (el.locationError) el.locationError.style.display = 'none';
            if (el.questionContainer) el.questionContainer.style.display = 'block';
            if (el.quizTop) el.quizTop.style.display = 'block';
            if (el.quizFooter) el.quizFooter.hidden = false;

            Object.keys(window.answers).forEach(function (key) { delete window.answers[key]; });

            questionElements.forEach(function (wrapper, index) {
                wrapper.classList.toggle('active', index === 0);
                wrapper.querySelectorAll('.option').forEach(function (option) {
                    option.classList.remove('selected');
                    option.setAttribute('aria-pressed', 'false');
                });
            });

            state.index = 0;
            updateProgress();
        }

        /* ---------- Resultado ---------- */

        function priceCard(title, amount, note) {
            const card = document.createElement('div');
            card.className = 'price-card';

            const heading = document.createElement('div');
            heading.className = 'price-title';
            heading.textContent = title;

            const value = document.createElement('div');
            value.className = 'price-amount';
            value.textContent = amount;

            const caption = document.createElement('div');
            caption.className = 'price-note';
            caption.textContent = note;

            card.appendChild(heading);
            card.appendChild(value);
            card.appendChild(caption);
            return card;
        }

        function renderPrices() {
            const treatments = Array.isArray(CONFIG.treatments) ? CONFIG.treatments : [];
            if (!el.priceGrid || !treatments.length) return;

            const chosen = window.answers.procedure ? window.answers.procedure.value : '';
            const normalized = chosen.toLowerCase().trim();
            const wantsAesthetics = /estéticos|no quirúrgicos/.test(normalized);
            const wantsAny = !chosen || /otro procedimiento/.test(normalized) || wantsAesthetics;

            const visible = treatments.filter(function (treatment) {
                const name = treatment.name.toLowerCase();
                if (name.indexOf('valoraci') !== -1 || name.indexOf('consulta') !== -1) return false;
                if (wantsAesthetics) return /toxina|hialur|rinomodel/.test(name);
                if (wantsAny) return true;
                return name === normalized || name.indexOf(normalized) === 0 || normalized.indexOf(name) === 0;
            });

            el.priceGrid.innerHTML = '';
            el.priceGrid.appendChild(priceCard('Consulta de Evaluación', money(CONSULTATION_PRICE), 'Pago anticipado para confirmar'));

            visible.forEach(function (treatment) {
                const amount = treatment.currency
                    ? treatment.currency + formatPrice(treatment.initialPrice)
                    : money(treatment.initialPrice);
                el.priceGrid.appendChild(priceCard(treatment.name, amount, treatment.customNote || 'Precio desde'));
            });
        }

        function goToResults() {
            clearTimeout(state.advanceTimer);
            state.advanceTimer = null;

            renderPrices();
            setStepper(2);

            if (el.qualification) {
                el.qualification.textContent = LANDING.qualificationTitle || 'Podrías ser candidato';
            }
            if (el.resultsLead) {
                el.resultsLead.textContent = LANDING.qualificationMessage ||
                    'Según tus respuestas, podés avanzar con una consulta de evaluación.';
            }

            showScreen(el.results);

            fireEvent('Paso' + (QUESTIONS.length + 2) + '_FinCuestionario', {
                event_category: 'Quiz',
                event_label: 'Fin de la evaluación'
            });

            loadAvailability();
        }

        /* ---------- Disponibilidad ---------- */

        function normalizeAvailability(data) {
            const map = {};

            if (Array.isArray(data)) {
                data.forEach(function (item) {
                    if (!item || !item.fecha) return;
                    map[item.fecha] = Array.isArray(item.horas) ? item.horas : [];
                });
                return map;
            }

            if (data && Array.isArray(data.turnos)) {
                data.turnos.forEach(function (turno) {
                    if (!turno || !turno.fecha || !turno.hora_inicio) return;
                    if (!map[turno.fecha]) map[turno.fecha] = [];
                    map[turno.fecha].push(turno.hora_inicio);
                });
                return map;
            }

            return data && typeof data === 'object' ? data : {};
        }

        async function fetchAvailability() {
            const controller = new AbortController();
            const timeout = setTimeout(function () { controller.abort(); }, 15000);

            try {
                const response = await fetch(AVAILABILITY_URL, {
                    signal: controller.signal,
                    cache: 'no-store'
                });
                if (!response.ok) throw new Error('HTTP ' + response.status);

                state.availability = normalizeAvailability(await response.json());
                state.availabilityLoaded = true;
                renderAvailability();
                return true;
            } catch (error) {
                console.warn('No pudimos cargar la agenda:', error);
                state.availabilityPromise = null;
                renderAvailabilityError();
                return false;
            } finally {
                clearTimeout(timeout);
            }
        }

        function loadAvailability() {
            if (state.availabilityPromise) return state.availabilityPromise;
            state.availabilityPromise = fetchAvailability();
            return state.availabilityPromise;
        }

        function renderAvailability() {
            if (el.loadingDates) el.loadingDates.style.display = 'none';

            const map = state.availability || {};
            const dates = sortDateValues(Object.keys(map).filter(function (date) {
                const slots = map[date];
                const count = Array.isArray(slots)
                    ? slots.length
                    : (slots && typeof slots === 'object' ? Object.keys(slots).length : 0);
                return count > 0 && !isPastDate(date);
            }));

            if (el.dateGrid) {
                el.dateGrid.innerHTML = '';
                el.dateGrid.style.display = dates.length ? 'grid' : 'none';
            }

            if (!dates.length) {
                if (el.datesEmpty) el.datesEmpty.hidden = false;
                if (el.timeGrid) el.timeGrid.style.display = 'none';
                if (el.loadingTimes) el.loadingTimes.style.display = 'none';
                if (el.timesEmpty) el.timesEmpty.hidden = false;
                return;
            }

            if (el.datesEmpty) el.datesEmpty.hidden = true;

            dates.forEach(function (date) {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'date-option';
                button.dataset.value = date;
                button.textContent = formatDateLabel(date);
                button.setAttribute('aria-pressed', 'false');
                button.addEventListener('click', function () { selectDate(date); });
                el.dateGrid.appendChild(button);
            });
        }

        function renderAvailabilityError() {
            if (el.loadingDates) el.loadingDates.style.display = 'none';
            if (el.dateGrid) el.dateGrid.style.display = 'none';
            if (!el.datesEmpty) return;

            el.datesEmpty.hidden = false;
            el.datesEmpty.innerHTML = '';

            const message = document.createElement('p');
            message.textContent = 'No pudimos cargar la agenda en este momento.';
            const hint = document.createElement('p');
            hint.textContent = 'Revisá tu conexión y volvé a intentar, o escribinos por WhatsApp.';

            const retry = document.createElement('button');
            retry.type = 'button';
            retry.className = 'retry-button';
            retry.textContent = 'Reintentar';
            retry.addEventListener('click', function () {
                el.datesEmpty.hidden = true;
                showDatesLoading();
                loadAvailability();
            });

            const whatsapp = document.createElement('a');
            whatsapp.className = 'retry-link';
            whatsapp.href = 'https://wa.me/' + CLINIC_WHATSAPP + '?text=' +
                encodeURIComponent('Hola, quiero consultar por turnos de evaluación.');
            whatsapp.target = '_blank';
            whatsapp.rel = 'noopener';
            whatsapp.textContent = 'Escribir por WhatsApp';

            el.datesEmpty.appendChild(message);
            el.datesEmpty.appendChild(hint);
            el.datesEmpty.appendChild(retry);
            el.datesEmpty.appendChild(whatsapp);
        }

        function showDatesLoading() {
            if (el.dateGrid) el.dateGrid.style.display = 'none';
            if (el.datesEmpty) el.datesEmpty.hidden = true;
            if (el.loadingDates) el.loadingDates.style.display = 'flex';
            if (el.timeGrid) el.timeGrid.style.display = 'none';
            if (el.loadingTimes) el.loadingTimes.style.display = 'none';
            if (el.timesEmpty) {
                el.timesEmpty.hidden = false;
                el.timesEmpty.innerHTML = '<p>Elegí primero una fecha para ver los horarios disponibles.</p>';
            }
        }

        function selectDate(date) {
            state.selectedDate = date;

            if (el.dateInput) el.dateInput.value = date;

            if (el.dateGrid) {
                el.dateGrid.querySelectorAll('.date-option').forEach(function (option) {
                    const selected = option.dataset.value === date;
                    option.classList.toggle('selected', selected);
                    option.setAttribute('aria-pressed', selected ? 'true' : 'false');
                });
            }

            renderTimes(date);
            updateNextStep();

            setTimeout(function () {
                if (el.timeSection) el.timeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 180);
        }

        function renderTimes(date) {
            const raw = state.availability ? state.availability[date] : null;
            let slots = Array.isArray(raw) ? raw : Object.values(raw || {});
            slots = sortTimes(slots.filter(Boolean).map(String));

            if (el.timeInput) el.timeInput.value = '';
            if (el.loadingTimes) el.loadingTimes.style.display = 'none';
            updateSelectionSummary();

            if (el.timeGrid) {
                el.timeGrid.innerHTML = '';
                el.timeGrid.style.display = 'none';
            }

            if (!slots.length) {
                if (el.timesEmpty) {
                    el.timesEmpty.hidden = false;
                    el.timesEmpty.innerHTML = '<p>No quedan horarios para esa fecha. Probá con otro día.</p>';
                }
                updateNextStep();
                return;
            }

            if (el.timesEmpty) el.timesEmpty.hidden = true;

            slots.forEach(function (time) {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'time-option';
                button.dataset.value = time;
                button.textContent = time;
                button.setAttribute('aria-pressed', 'false');
                button.addEventListener('click', function () { selectTime(time); });
                el.timeGrid.appendChild(button);
            });

            if (el.timeGrid) el.timeGrid.style.display = 'grid';
            updateNextStep();
        }

        function selectTime(time) {
            if (el.timeInput) el.timeInput.value = time;

            if (el.timeGrid) {
                el.timeGrid.querySelectorAll('.time-option').forEach(function (option) {
                    const selected = option.dataset.value === time;
                    option.classList.toggle('selected', selected);
                    option.setAttribute('aria-pressed', selected ? 'true' : 'false');
                });
            }

            updateSelectionSummary();
            updateNextStep();
        }

        function updateSelectionSummary() {
            if (!el.selectionSummary) return;

            const date = el.dateInput ? el.dateInput.value : '';
            const time = el.timeInput ? el.timeInput.value : '';

            if (!date) {
                el.selectionSummary.textContent = 'Elegí una fecha y un horario';
                return;
            }

            if (!time) {
                el.selectionSummary.textContent = 'Tu cita: ' + formatDateLabel(date) + '. Ahora elegí un horario.';
                return;
            }

            const strongDate = document.createElement('strong');
            strongDate.textContent = formatDateLabel(date);
            const strongTime = document.createElement('strong');
            strongTime.textContent = time + ' hs';

            el.selectionSummary.textContent = 'Tu cita: ';
            el.selectionSummary.appendChild(strongDate);
            el.selectionSummary.appendChild(document.createTextNode(' a las '));
            el.selectionSummary.appendChild(strongTime);
        }

        function updateNextStep() {
            const ready = Boolean(el.dateInput && el.dateInput.value && el.timeInput && el.timeInput.value);
            if (el.nextStep) el.nextStep.disabled = !ready;
            if (el.nextHint) el.nextHint.hidden = ready;
        }

        /* ---------- Formulario ---------- */

        function setFormStep(step) {
            const isFirst = step === 1;

            if (el.step1) {
                el.step1.style.display = isFirst ? 'block' : 'none';
                el.step1.classList.toggle('is-active', isFirst);
            }
            if (el.step2) {
                el.step2.style.display = isFirst ? 'none' : 'block';
                el.step2.classList.toggle('is-active', !isFirst);
            }
            if (el.footer1) el.footer1.hidden = !isFirst;
            if (el.footer2) el.footer2.hidden = isFirst;
            if (el.formScroll) el.formScroll.scrollTop = 0;

            setStepper(isFirst ? 2 : 3);
            updateNextStep();

            if (!isFirst) {
                updateSummary();
                updateFinishState();
                if (el.whatsapp) {
                    setTimeout(function () {
                        el.whatsapp.focus({ preventScroll: true });
                    }, 150);
                }
            }
        }

        function updateSummary() {
            const date = el.dateInput ? el.dateInput.value : '';
            const time = el.timeInput ? el.timeInput.value : '';
            const ready = Boolean(date && time);

            if (el.summaryDatetime) {
                el.summaryDatetime.textContent = ready ? formatDateLabel(date) + ' · ' + time + ' hs' : '—';
            }
            if (el.paymentDatetime) {
                el.paymentDatetime.textContent = ready
                    ? formatDateLabel(date) + ' a las ' + time
                    : 'la fecha y hora elegidas';
            }
        }

        function setWhatsappMessage(message, kind) {
            if (!el.whatsappValidation) return;
            el.whatsappValidation.textContent = message || '';
            el.whatsappValidation.className = 'validation-message' + (kind ? ' ' + kind : '');
        }

        function resetWhatsappValidation() {
            state.whatsappVerified = false;
            setWhatsappMessage('', '');
            updateFinishState();
        }

        function updateFinishState() {
            const nameOk = Boolean(el.fullname && el.fullname.value.trim().length >= 3);
            const checkboxOk = el.checkbox ? el.checkbox.checked : true;
            const canPay = state.whatsappVerified && nameOk && checkboxOk && !state.busy;

            if (el.finish) el.finish.disabled = !canPay;

            if (!el.status) return;

            let message = 'Verificá tu WhatsApp para continuar';
            let kind = '';

            if (state.whatsappVerified) {
                if (!nameOk) {
                    message = 'Completá tu nombre y apellido';
                } else if (!checkboxOk) {
                    message = 'Confirmá que entendés la política de pago';
                } else {
                    message = 'Todo listo para continuar';
                    kind = 'success';
                }
            }

            el.status.textContent = message;
            el.status.className = 'button-status-message' + (kind ? ' ' + kind : '');
        }

        async function validateWhatsapp() {
            if (!el.whatsapp) return;

            const digits = normalizePhone(el.whatsapp.value);
            const token = ++state.validationToken;
            state.whatsappVerified = false;
            updateFinishState();

            if (digits.length < 10 || digits.length > 15) {
                setWhatsappMessage('Ingresá el número completo con código de área (10 a 15 dígitos).', 'error');
                return;
            }

            setWhatsappMessage('Verificando número...', '');

            const controller = new AbortController();
            const timeout = setTimeout(function () { controller.abort(); }, 12000);

            try {
                const response = await fetch(VALIDATION_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    signal: controller.signal,
                    body: JSON.stringify({
                        whatsapp_check: digits,
                        action: 'validate_whatsapp',
                        origen: 'Landing Dra. Constanza Bossi',
                        landingUrl: window.location.href,
                        respuestas: buildAnswersText(),
                        respuestas_detalladas: buildAnswersMap()
                    })
                });

                if (token !== state.validationToken) return;
                if (!response.ok) throw new Error('HTTP ' + response.status);

                const data = await response.json();

                if (data && data.exists === true) {
                    state.whatsappVerified = true;
                    setWhatsappMessage('WhatsApp verificado ✓', 'success');
                } else {
                    setWhatsappMessage('Este número no tiene WhatsApp activo. Revisalo e intentá de nuevo.', 'error');
                }
            } catch (error) {
                if (token !== state.validationToken) return;
                console.warn('No pudimos verificar el WhatsApp:', error);
                setWhatsappMessage('No pudimos verificar el número. Revisá tu conexión y volvé a intentar.', 'error');
            } finally {
                clearTimeout(timeout);
                if (token === state.validationToken) updateFinishState();
            }
        }

        /* ---------- Datos del lead ---------- */

        function buildAnswersText(extraDoubt) {
            let text = '';
            QUESTIONS.forEach(function (question) {
                if (window.answers[question.key]) {
                    text += question.question + ': ' + window.answers[question.key].value + '\n';
                }
            });
            if (extraDoubt) {
                text += '¿Cuál es tu principal duda sobre el procedimiento?: ' + extraDoubt + '\n';
            }
            return text;
        }

        function buildAnswersMap() {
            const map = {};
            QUESTIONS.forEach(function (question) {
                if (window.answers[question.key]) {
                    map[question.key] = window.answers[question.key].value;
                }
            });
            return map;
        }

        function buildLeadPayload(fullname, whatsapp, doubt) {
            const date = el.dateInput ? el.dateInput.value : '';
            const time = el.timeInput ? el.timeInput.value : '';

            return {
                fullname: fullname,
                whatsapp: whatsapp,
                tratamiento_interes: window.answers.procedure ? window.answers.procedure.value : 'Cirugía plástica',
                fecha_cita: (date + ' ' + time).trim(),
                fecha: date,
                hora: time,
                landingUrl: window.location.href,
                respuestas: buildAnswersText(doubt),
                respuestas_detalladas: buildAnswersMap(),
                // El flujo ya no ofrece videollamada: se mantiene el campo para no romper la automatización.
                videollamada_previa: 'No',
                peso: window.answers.weight ? window.answers.weight.value : '',
                altura: window.answers.height ? window.answers.height.value : '',
                duda_principal: doubt,
                estado: 'NUEVO',
                origen: 'Landing Dra. Constanza Bossi'
            };
        }

        async function createPaymentLink(fullname, whatsapp) {
            const controller = new AbortController();
            const timeout = setTimeout(function () { controller.abort(); }, 25000);

            try {
                const response = await fetch(PAYMENT_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    signal: controller.signal,
                    body: JSON.stringify([{
                        cliente: 'bossi',
                        paciente: fullname,
                        telefono: whatsapp,
                        whatsapp_cliente: CLINIC_WHATSAPP
                    }])
                });

                if (!response.ok) throw new Error('HTTP ' + response.status);

                const data = await response.json();
                const record = Array.isArray(data) ? data[0] : data;
                return record && record.mercadopago_linkpersonalizado_creado
                    ? record.mercadopago_linkpersonalizado_creado
                    : null;
            } finally {
                clearTimeout(timeout);
            }
        }

        async function submitLead(payload) {
            const controller = new AbortController();
            const timeout = setTimeout(function () { controller.abort(); }, 20000);

            try {
                const response = await fetch(SUBMISSION_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    signal: controller.signal,
                    body: JSON.stringify(payload)
                });

                if (!response.ok) throw new Error('HTTP ' + response.status);
            } finally {
                clearTimeout(timeout);
            }
        }

        function setBusy(busy) {
            state.busy = busy;
            if (el.finish) {
                el.finish.classList.toggle('is-busy', busy);
                el.finish.innerHTML = busy
                    ? '<span class="loading-spinner"></span> Procesando...'
                    : 'PAGAR CITA →';
            }
            if (el.prevButton) el.prevButton.disabled = busy;
            const backButton = document.getElementById('prev-step-button');
            if (backButton) backButton.disabled = busy;
            const changeButton = document.getElementById('change-slot-button');
            if (changeButton) changeButton.disabled = busy;
            updateFinishState();
        }

        function showOverlay() {
            hideOverlay();
            const overlay = document.createElement('div');
            overlay.className = 'mercadopago-overlay';
            overlay.id = 'mp-overlay';
            overlay.innerHTML = '<div class="mercadopago-spinner"></div>' +
                '<p>Generando el link de pago...</p>' +
                '<p class="mercadopago-overlay__sub">Te llevamos a Mercado Pago. No cierres esta pantalla.</p>';
            document.body.appendChild(overlay);
        }

        function hideOverlay() {
            const overlay = document.getElementById('mp-overlay');
            if (overlay) overlay.remove();
        }

        async function handlePayment() {
            if (!el.finish || el.finish.disabled) return;

            const fullname = el.fullname ? el.fullname.value.trim() : '';
            const whatsapp = el.whatsapp ? normalizePhone(el.whatsapp.value) : '';
            const doubt = el.doubt ? el.doubt.value.trim() : '';

            if (!fullname) {
                toast('Completá tu nombre y apellido', 'error');
                if (el.fullname) el.fullname.focus();
                return;
            }
            if (!whatsapp) {
                toast('Completá tu WhatsApp', 'error');
                if (el.whatsapp) el.whatsapp.focus();
                return;
            }

            const payload = buildLeadPayload(fullname, whatsapp, doubt);

            fireEvent('Paso' + (QUESTIONS.length + 5) + '_Finalizacion', {
                event_category: 'Form',
                event_label: 'Inicio del pago',
                fecha_cita: payload.fecha_cita
            });

            showOverlay();
            setBusy(true);

            try {
                const paymentLink = await createPaymentLink(fullname, whatsapp);
                if (!paymentLink) throw new Error('No se generó el link de pago');

                payload.mercadopago_link = paymentLink;
                await submitLead(payload);

                if (typeof fbq !== 'undefined') {
                    fbq('track', 'Lead', {
                        content_name: 'Consulta de Evaluación',
                        content_category: 'Cirugía Plástica',
                        value: CONSULTATION_PRICE,
                        currency: 'ARS'
                    });
                    fbq('trackCustom', 'CitaFiltro', {
                        fullname: fullname,
                        whatsapp: whatsapp,
                        fecha_cita: payload.fecha_cita,
                        tratamiento: payload.tratamiento_interes
                    });
                }

                window.location.href = paymentLink;
            } catch (error) {
                console.error('No pudimos iniciar el pago:', error);
                hideOverlay();
                setBusy(false);
                toast('No pudimos generar el link de pago. Intentá de nuevo en unos segundos.', 'error');
            }
        }

        /* ---------- Eventos ---------- */

        if (el.prevButton) el.prevButton.addEventListener('click', goBack);
        if (el.restartButton) el.restartButton.addEventListener('click', restartQuiz);

        if (el.appointmentButton) {
            el.appointmentButton.addEventListener('click', function () {
                showScreen(el.form);
                setFormStep(1);
                if (!state.availabilityLoaded) showDatesLoading();
                loadAvailability();

                fireEvent('Paso' + (QUESTIONS.length + 3) + '_InicioFormulario', {
                    event_category: 'Form',
                    event_label: 'Elección de turno'
                });
            });
        }

        if (el.nextStep) {
            el.nextStep.addEventListener('click', function () {
                if (!el.dateInput || !el.dateInput.value || !el.timeInput || !el.timeInput.value) {
                    toast('Elegí fecha y horario para continuar', 'error');
                    return;
                }

                fireEvent('Paso' + (QUESTIONS.length + 4) + '_SeleccionFechaHora', {
                    event_category: 'Form',
                    event_label: 'Fecha y hora elegidas',
                    fecha: el.dateInput.value,
                    hora: el.timeInput.value
                });

                setFormStep(2);
            });
        }

        const resultsBack = document.getElementById('results-back');
        if (resultsBack) {
            resultsBack.addEventListener('click', function () {
                showScreen(el.quiz);
                setStepper(1);
                goToQuestion(QUESTIONS.length - 1);
            });
        }

        const backToSlot = document.getElementById('prev-step-button');
        if (backToSlot) backToSlot.addEventListener('click', function () { setFormStep(1); });

        if (el.changeSlot) el.changeSlot.addEventListener('click', function () { setFormStep(1); });

        if (el.whatsapp) {
            if (!el.whatsapp.value) el.whatsapp.value = '549';
            el.whatsapp.addEventListener('input', resetWhatsappValidation);
            el.whatsapp.addEventListener('blur', validateWhatsapp);
        }

        if (el.fullname) el.fullname.addEventListener('input', updateFinishState);
        if (el.checkbox) el.checkbox.addEventListener('change', updateFinishState);
        if (el.finish) el.finish.addEventListener('click', handlePayment);

        const startButton = document.getElementById('start-quiz');
        if (startButton) {
            startButton.addEventListener('click', function () {
                const hero = document.getElementById('landing-content');
                if (hero) hero.style.display = 'none';
                showScreen(el.quiz);
                updateProgress();
            });
        }

        // Compatibilidad con la variante anterior (index-bossi.html), que tiene botón "Continuar".
        const legacyNext = document.getElementById('next-button');
        if (legacyNext) {
            legacyNext.addEventListener('click', function () {
                const question = QUESTIONS[state.index];
                if (!question || !window.answers[question.key]) {
                    toast('Elegí una opción para continuar', 'error');
                    return;
                }
                if (state.index >= QUESTIONS.length - 1) {
                    goToResults();
                } else {
                    goToQuestion(state.index + 1);
                }
            });
        }

        /* ---------- Estado inicial ---------- */

        renderQuiz();

        if (!startButton) {
            showScreen(el.quiz);
        }

        setStepper(1);
        updateNextStep();
        updateFinishState();
        updateSummary();
        updateSelectionSummary();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
