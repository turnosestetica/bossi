# Landing Page - Dra. Constanza Bossi

Landing de captación para la Dra. Constanza Bossi, cirujana plástica en San Miguel de Tucumán.

Publicada en GitHub Pages: <https://turnosestetica.github.io/bossi/>

## Flujo

1. **Evaluación** — cuestionario de 7 preguntas (procedimiento, ubicación, antecedentes, peso, altura y urgencia). Si la persona no puede asistir a la clínica, se muestra una pantalla de descalificación.
2. **Resultado** — se muestran los precios de referencia del procedimiento elegido y la política de pago de la consulta.
3. **Turno** — se eligen día y horario según la agenda disponible (Google Sheet / n8n).
4. **Pago** — se validan el WhatsApp y los datos, y se redirige a Mercado Pago con un link personalizado. El turno se confirma con el pago acreditado.

## Archivos

| Archivo | Uso |
| --- | --- |
| `index.html` | Landing publicada (estructura y textos base) |
| `landing.css` | Estilos del flujo |
| `landing.js` | Lógica del cuestionario, agenda y pago |
| `config.js` | Configuración del cliente: preguntas, precios, webhooks, pixel |
| `gracias-pago-bossi.html` | Página de agradecimiento posterior al pago |
| `images/drabossi.jpg` | Foto de la profesional |

`index-bossi.html`, `bossi.js`, `script.js`, `styles.css`, `styles-new.css` y `bossi.css` son variantes anteriores que no se publican; se conservan como referencia.

## Configuración

Todo lo editable está en `config.js` (objeto `CLIENTS_CONFIG.bossi`):

- datos de la clínica y precio de la consulta
- preguntas del cuestionario
- precios de referencia
- webhooks de agenda, validación de WhatsApp y guardado del lead
- Facebook Pixel

Los importes de la consulta se actualizan solos desde `clinic.consultationPrice`; no hace falta editar el HTML.

## Pruebas

El flujo completo se verificó con Chrome headless (viewport móvil 390×844 y escritorio 1280×900): carga de agenda simulada, selección de turno, validación de WhatsApp, generación del link de pago y eventos de pixel.
