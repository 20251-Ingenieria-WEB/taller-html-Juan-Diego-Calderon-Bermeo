# taller-html-Juan-Diego-Calderon-Bermeo<br>

Pokédex Interactiva
Este proyecto es una aplicación web interactiva que permite a los usuarios buscar y filtrar Pokémon utilizando datos en tiempo real de la PokéAPI. Ha sido desarrollada como una herramienta de consulta y exploración, así como una práctica en el uso de tecnologías web modernas.

📌 Descripción general
La Pokédex interactiva permite:

Realizar búsquedas de Pokémon por nombre o ID.

Filtrar resultados por tipo, habilidad o estadísticas específicas.

Visualizar información detallada de cada Pokémon, incluyendo imagen, tipos, habilidades y stats base.

La interfaz es intuitiva y está optimizada para funcionar correctamente en diferentes dispositivos gracias a un diseño responsive.

⚙️ Tecnologías utilizadas
HTML5 – Estructura del sitio.

CSS3 – Estilos personalizados y diseño responsive.

JavaScript (Vanilla) – Lógica principal de la aplicación y consumo de API.

PokéAPI – Fuente de datos utilizada para obtener información de los Pokémon.

🚀 Instrucciones de uso
Clona o descarga el repositorio:

bash
Copiar
Editar
git clone https://github.com/tu-usuario/pokedex-interactiva.git
Abre el archivo index.html en cualquier navegador web moderno (no se requiere instalación adicional ni backend).

También puedes utilizar una extensión como Live Server desde VS Code para una experiencia más fluida durante el desarrollo.

🧩 Estructura del proyecto
bash
Copiar
Editar
pokedex-interactiva/
│
├── index.html       # Página principal del sitio
├── style.css        # Hoja de estilos
├── script.js        # Lógica de interacción con la API
└── README.md        # Documentación del proyecto
💡 Consideraciones técnicas
La aplicación utiliza fetch API para realizar llamadas HTTP a la PokéAPI.

Se implementan filtros por múltiples criterios mediante inputs y selects dinámicos.

El diseño está adaptado para pantallas pequeñas mediante media queries.

📱 Diseño adaptable (responsive)
El diseño ha sido desarrollado con Flexbox y Media Queries, permitiendo una correcta visualización en:

Equipos de escritorio

Tablets

Dispositivos móviles
