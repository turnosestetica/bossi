# Cambios de flujo — noviembre 2026

Documento de los cambios aplicados a la landing publicada (`index.html`).

## 1. Se eliminó el paso de videollamada

- Se quitó del cuestionario la pregunta *"¿Te gustaría tener una mini videollamada de 10 minutos previa a la cita?"* (`config.js`, clave `videocall`).
- El cuestionario pasó de 8 a 7 preguntas.
- Se eliminó también el campo `videollamada_previa` del payload que se envía al webhook: no queda ninguna referencia a videollamada en el sitio. Si el workflow de n8n que recibe el lead lo consume, hay que quitar ese mapeo (ya no va a llegar).
- El orden de las preguntas cambió: peso y altura quedan antes de *"¿Cuándo te gustaría realizarte el procedimiento?"*, para cerrar la evaluación con una pregunta simple.

## 2. Estructura de pantalla

- Encabezado fijo con foto, nombre y especialidad: se dejó de repetir el bloque de presentación en cada pantalla.
- Indicador de etapas **Evaluación → Turno → Pago** siempre visible.
- La barra de acciones dejó de ser `position: fixed` sobre todo el viewport (en escritorio se salía de la tarjeta) y ahora es un pie dentro de la tarjeta. El contenido scrollea por separado.
- Se respeta el alto real del navegador móvil (`100dvh`) y el área segura inferior.

## 3. Cuestionario

- **Avance automático** al elegir una opción (300 ms), con botón "← Anterior" para corregir.
- Contador explícito: "Pregunta 1 de 7" + barra de progreso animada.
- Opciones como `<button>` reales: foco visible, `aria-pressed`, área táctil mínima de 48–52 px.
- La pregunta se centra verticalmente cuando sobra espacio y scrollea cuando no entra.
- Pantalla de descalificación con el motivo, la dirección de la clínica y una salida clara.

## 4. Resultado

- Copia del resultado tomada de `config.js` (`qualificationTitle` / `qualificationMessage`).
- Tarjetas de precios compactas (dos columnas en móvil) y consulta de evaluación siempre primero.
- Si el procedimiento elegido es estético / no quirúrgico, solo se muestran tratamientos estéticos.
- El botón "Ver turnos disponibles" queda fijo al pie de la pantalla, visible sin scrollear.

## 5. Turno

- Las fechas que devuelve la agenda (`"Miércoles 18 de Noviembre 2026"`) se muestran en formato corto (`"mié 18 nov"`), se ordenan de la más próxima a la más lejana y se descartan las pasadas. El valor que se envía al webhook sigue siendo el texto original de la agenda.
- Horarios ordenados.
- "Continuar" deshabilitado hasta elegir fecha **y** horario, con mensaje de ayuda.
- Resumen progresivo: "Tu cita: mié 18 nov. Ahora elegí un horario." → "Tu cita: mié 18 nov a las 17:20 hs".
- Estados de agenda vacía y de error de red con botón **Reintentar** y acceso a WhatsApp (antes la pantalla quedaba en blanco).

## 6. Datos y pago

- La duda sobre el procedimiento pasó a ser **opcional** para reducir el abandono.
- El botón de pago solo se habilita con WhatsApp verificado, nombre completo y aceptación de la política de pago; el mensaje de estado indica qué falta.
- Resumen del turno elegido con acceso directo para cambiarlo.
- Validación de WhatsApp con timeout (12 s) y reintento; antes, si el webhook no respondía, el usuario quedaba bloqueado sin explicación.
- Se reemplazó jQuery por `fetch` (se eliminó una dependencia externa de 90 KB del camino de pago).
- Overlay de Mercado Pago con aviso de redirección y estados de error claros (avisos flotantes en lugar de `alert`).

## 7. Integraciones

- Mismos webhooks, mismos campos y mismo orden de llamadas:
  1. `POST` link de pago (`c0cb515e…`)
  2. `POST` guardado del lead (`0dc8f34f…`)
  3. redirección a Mercado Pago
- Se mantienen los eventos de pixel existentes (`PasoN_*`, `CitaFiltro`) y se agrega `Lead` al iniciar el pago.
- La página de agradecimiento (`gracias-pago-bossi.html`) ahora toma el valor de `Purchase` desde `config.js` (antes quedó fijo en $17.500).
