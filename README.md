# Bodega Piedra Alta

Landing de demostración para una bodega de vinos de altura de Cafayate (Valles Calchaquíes). **Piedra Alta es una marca ficticia.** Hecho por [NorteDigitalDev](https://nortedigitaldev.vercel.app).

## Qué tiene

- **Relato con scroll:** la botella queda fija mientras pasan la noche, el valle, la cosecha (la botella se llena) y la bodega con sus barricas.
- **Cuatro vinos:** Torrontés, Rosado de Malbec, Malbec Reserva y Tannat Gran Reserva. En computadora, la botella grande cambia de etiqueta según el vino que estás leyendo.
- **Maridaje:** elegís el plato y la ocasión y te recomienda un vino, con un consejo y el botón para agregarlo.
- **Carrito simple:** cantidades, total, envío o retiro y forma de pago. El pedido llega armado por WhatsApp. Se guarda en el navegador.
- **Reserva de visitas:** dos degustaciones, fecha y personas, con el total calculado. Los lunes está cerrado.
- **Aviso de edad** al entrar y la leyenda legal de bebidas alcohólicas.

Todo con HTML, CSS y JavaScript, sin librerías. Las ilustraciones (botella, cerros, barricas) son SVG.

## Cómo cambiar cosas

- **Vinos y precios:** arriba de todo en `js/app.js`, en la lista `VINOS`.
- **Recomendaciones de maridaje:** `PLATOS` en `js/app.js`.
- **Número de WhatsApp:** `WHATSAPP` en `js/app.js`.
- **Colores:** variables al principio de `css/styles.css`.
