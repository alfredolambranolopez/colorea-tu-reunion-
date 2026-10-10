# 🎨 ColoreaLaReunión™
> *"Porque esa reunión definitivamente pudo haber sido un correo."*

Una tienda web moderna, llamativa y súper creativa para vender libros de colorear y mandalas pasivo-agresivos a personas atrapadas en videollamadas interminables de Zoom, Microsoft Teams y juntas corporativas.

---

## 🚀 Cómo Iniciar la Página Web

Tienes dos opciones muy sencillas:

### Opción 1: Abrir directamente en tu navegador (Recomendada)
Simplemente haz doble clic en el archivo **`index.html`** y se abrirá en tu navegador favorito (Chrome, Edge, Firefox, etc.) sin necesidad de instalar nada.

### Opción 2: Usar el servidor local con Python
Si prefieres servirla con un servidor HTTP local:
```bash
python serve.py
```
Se abrirá automáticamente en tu navegador en `http://localhost:8000`.

---

## ✨ Características y Secciones del Proyecto

1. **🎨 El Desahogador 3000 (Lienzo para Colorear en Vivo)**:
   - Simulador interactivo en el navegador que permite a los visitantes probar la experiencia antes de comprar.
   - 3 láminas seleccionables: *"Pudo haber sido un correo"*, *"Gatito asintiendo en Teams"* y *"Gráfico de Sinergias Inútiles"*.
   - Paleta de colores con nombres corporativos satíricos (*Resaltador Amarillo Tóxico*, *Alerta de Burnout*, *Rosa Ganas de Renunciar*, etc.).
   - Herramientas: Bote de pintura (clic para rellenar áreas del SVG), Deshacer trazo, Limpiar lámina y **Descargar Mi Obra** en formato SVG/imagen.
   - Sonidos de camuflaje usando la Web Audio API (*Teclado mecánico agresivo*, *Falsa tos para mutearse*, *Sorbo de café*).

2. **🚨 "Modo Pánico: ¡Viene mi Jefe!" (Tecla ESC)**:
   - Botón de emergencia en la barra de navegación o simplemente presionando la tecla **`ESC`** en el teclado en cualquier momento.
   - Oculta inmediatamente la tienda y muestra una pantalla completa hiperrealista de **Microsoft Excel** con fórmulas financieras serias (`=SUMA(...)`), tablas y gráficos corporativos para que parezcas un empleado ejemplar.
   - Al presionar **ESC** de nuevo o el botón de salida, regresas fluidamente a colorear.

3. **📚 Catálogo de Productos y Modos de Formato**:
   - Cada libro cuenta con alternador entre **Descarga Inmediata (PDF imprimible)** y **Libro Físico (Papel 160g anti-traspaso)**.
   - Filtros dinámicos: *Todos los Libros*, *Digital (PDF)*, *Edición Física*, *Packs Ahorro*.
   - Función **"Ojear por dentro"**: modal interactivo tipo flipbook que muestra páginas interiores con citas cómicas.

4. **🛒 Carrito de Compras Lateral con Cupones**:
   - Drawer deslizable con recuento dinámico de artículos.
   - Control de cantidades y eliminación de ítems.
   - Soporte para códigos de descuento (ejemplo: `PUDOSERUNCORREO` o `REUNIONINUTIL` para un 20% de descuento).
   - Flujo de checkout simulado con confirmación y botón de descarga directa de PDF.

5. **⏱️ Calculadora de Aburrimiento Corporativo (ROI)**:
   - Sliders interactivos de *Horas en reuniones a la semana* y *Frecuencia de frases como 'Alinear alfas'*.
   - Calcula las horas de vida perdidas al año y la cantidad de libros que podrías haber pintado, con diagnóstico y botón de *"Añadir Dosis Recomendada"*.

6. **💬 Testimonios y Preguntas Frecuentes**:
   - Reseñas satíricas de colegas ficticios y acordeón de preguntas frecuentes con respuestas prácticas e irónicas.

---

## 📁 Archivos del Proyecto

- `index.html`: Estructura semántica, diseño y SVGs colorables.
- `styles.css`: Estilos Neo-Brutalist corporativo lúdico, variables CSS, micro-interacciones, animaciones y diseño 100% responsivo para móviles y escritorios.
- `app.js`: Lógica del lienzo interactivo, carrito de compras, cupones, calculadora, sonidos con Web Audio y Modo Pánico con teclado.
- `serve.py`: Servidor HTTP ligero para previsualización inmediata.
