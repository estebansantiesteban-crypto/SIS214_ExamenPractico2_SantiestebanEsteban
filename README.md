# Hoja de vida de Esteban Santiesteban

Sitio web personal con la hoja de vida de Esteban Javier Santiesteban Flores. Presenta su perfil, experiencia, formación, habilidades y datos de contacto.

## Contenido

- Diseño adaptable a móviles, tabletas y computadoras.
- Foto de perfil y enlace para descargar el CV en PDF.
- Menú de navegación y selector de tema claro/oscuro.
- Buscador y gráfico interactivo de habilidades.
- Información del clima actual de La Paz.
- Formulario de contacto con validación y envío de mensajes.
- Animaciones y opciones de accesibilidad.

## Archivos principales

```text
index.html                    Página principal y contenido del CV
css/styles.css                Estilos, temas y diseño adaptable
js/main.js                    Inicialización de las funciones
js/modules/                   Módulos JavaScript de la página
  animations.js               Animaciones de entrada
  form.js                     Validación y envío del formulario
  menu.js                     Menú adaptable
  skills-chart.js             Gráfico de habilidades
  skills-filter.js            Búsqueda de habilidades
  theme.js                    Cambio y persistencia del tema
  weather.js                  Consulta del clima
assets/imagenFoto.png         Foto de perfil
assets/CV_Esteban_Santiesteban.pdf  CV descargable
```

## Funciones

- El tema claro u oscuro se puede cambiar desde el botón de la barra de navegación. La preferencia queda guardada en el navegador.
- El menú de navegación se adapta al ancho de pantalla.
- El buscador filtra las habilidades mientras se escribe. El gráfico permite elegir entre barras, dona y radar.
- La tarjeta del clima consulta las condiciones actuales de La Paz usando la API de Open-Meteo.
- El formulario valida los campos y permite enviar un mensaje mediante EmailJS. Requiere que la configuración del servicio y la plantilla esté vigente.
- La página incluye animaciones y etiquetas accesibles para navegación con teclado y lectores de pantalla.

## Tecnologías

El proyecto está construido con HTML5 semántico, CSS3 y JavaScript moderno organizado en módulos. No requiere instalación de paquetes ni un proceso de compilación.

Las librerías Chart.js, Day.js, Lodash, Anime.js, AOS y Remix Icon se cargan desde CDN. La fecha del clima se presenta en español y en la zona horaria de La Paz. Se necesita conexión a Internet para cargar las librerías y consultar el clima o enviar el formulario.

