# Control Remoto para ROS2

Este proyecto es un control remoto diseñado para interactuar con los robots NAO y Pepper de SoftBank Robotics utilizando ROS2. Proporciona una interfaz gráfica que permite controlar diversas funcionalidades de los robots, como movimientos, animaciones, reproducción de audio, control de cámara, entre otros.

## Requisitos

Este control remoto está diseñado para ser usado junto con el paquete [naoqi_bringup2_SinfonIA](https://github.com/SinfonIAUniandes/naoqi_bringup2_SinfonIA), un metapaquete de ROS2 que simplifica el proceso de lanzamiento de una interfaz completa y rica en funcionalidades para los robots NAO y Pepper. Ese paquete actúa como un driver no oficial de ROS2, permitiendo acceder a todas las capacidades de estos robots.

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

-   `public/`: Contiene los archivos estáticos y el `index.html` principal.
-   `src/`: Contiene todo el código fuente de la aplicación React.
    -   `assets/`: Almacena imágenes, archivos JSON con acciones y animaciones para los robots.
    -   `components/`: Contiene los componentes de React, organizados por funcionalidad.
        -   `common/`: Componentes reutilizables.
        -   `features/`: Componentes que implementan las funcionalidades específicas del robot (movimiento, habla, percepción, etc.).
        -   `layout/`: Componentes para la estructura visual de la aplicación, incluyendo los diferentes modos de dashboard.
    -   `contexts/`: Gestiona el estado global de la aplicación, como la conexión con ROS.
    -   `services/`: Lógica para interactuar con servicios externos, principalmente el `RosManager` para la comunicación con ROS2.

## Modos de Visualización

La interfaz se adapta a diferentes tamaños de pantalla y orientaciones, ofreciendo tres modos de visualización:

1.  **Modo de Escritorio**: Diseñado para pantallas grandes, muestra todos los controles y cámaras en una sola vista.
2.  **Modo Táctil Vertical**: Optimizado para dispositivos móviles en orientación vertical, organiza los controles de forma apilada para un fácil acceso.
3.  **Modo Táctil Horizontal**: Para dispositivos móviles en orientación horizontal, distribuye los controles y la vista de la cámara de manera diferente para aprovechar el espacio.

## Funcionalidades

El control remoto ofrece una amplia gama de funcionalidades para controlar el robot:

-   **Manipulación**: Control de la cabeza, posturas, animaciones y rigidez de las articulaciones.
-   **Navegación**: Control de la base móvil del robot mediante un joystick virtual.
-   **Percepción**: Visualización de la cámara del robot y control del seguimiento de personas.
-   **Habla**: Envío de texto para que el robot lo sintetice y hable, control del volumen y visualización del audio del micrófono.
-   **Misceláneos**: Control de los LEDs, estado de la batería y gestión de la vida autónoma del robot.
-   **Acciones predefinidas**: Ejecución de secuencias de acciones y animaciones cargadas desde archivos JSON.

## Acciones Predefinidas

Las acciones predefinidas permiten ejecutar secuencias específicas de animaciones y diálogos en los robots NAO y Pepper. Estas acciones están diseñadas para facilitar la interacción con los robots y pueden ser configuradas mediante archivos JSON.

### Ejemplo de Acciones para NAO

En el archivo `nao_actions.json`, se define una acción llamada "Saludar":

```json
{
  "name": "Saludar",
  "icon": "👋",
  "animation": "Stand/Emotions/Neutral/Hello_1",
  "speech": {
    "text": "Hola, soy Nao, mucho gusto en conocerte.",
    "volume": 80,
    "animated": true,
    "language": "Spanish"
  }
}
```

- **Nombre**: "Saludar".
- **Ícono**: Representa visualmente la acción en la interfaz.
- **Animación**: Especifica el movimiento que realizará el robot.
- **Diálogo**: El texto que el robot dirá, con opciones para ajustar el volumen, animar el habla y definir el idioma.

### Ejemplo de Acciones para Pepper

En el archivo `pepper_actions.json`, se define una acción llamada "Presentarse":

```json
{
  "name": "Presentarse",
  "icon": "🙋‍♂️",
  "animation": "Gestures/Enthusiastic_4",
  "speech": {
    "text": "Hola a todos, mi nombre es Pepper. ¡Es un placer estar aquí!",
    "volume": 75,
    "animated": true,
    "language": "Spanish"
  }
}
```

- **Nombre**: "Presentarse".
- **Ícono**: Representa visualmente la acción en la interfaz.
- **Animación**: Especifica el movimiento que realizará el robot.
- **Diálogo**: El texto que el robot dirá, con opciones para ajustar el volumen, animar el habla y definir el idioma.

### Configuración de Acciones

Las acciones se configuran en archivos JSON dentro de la carpeta `src/assets/`. Cada acción incluye:

- **name**: Nombre de la acción.
- **icon**: Ícono que se muestra en la interfaz.
- **animation**: Ruta de la animación que ejecutará el robot.
- **speech**: Configuración del diálogo, incluyendo texto, volumen, animación del habla y idioma.

Estas acciones pueden ser fácilmente extendidas o modificadas para adaptarse a las necesidades específicas de cada usuario.

## Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

### `npm start`

Ejecuta la aplicación en modo de desarrollo. Abre [http://localhost:3000](http://localhost:3000) para verla en tu navegador.

La página se recargará cuando realices cambios. También puedes ver errores de lint en la consola.

### `npm test`

Lanza el ejecutor de pruebas en modo interactivo. Consulta la sección sobre [ejecución de pruebas](https://facebook.github.io/create-react-app/docs/running-tests) para más información.

### `npm run build`

Construye la aplicación para producción en la carpeta `build`. Agrupa correctamente React en modo de producción y optimiza la compilación para obtener el mejor rendimiento.

La compilación está minificada y los nombres de archivo incluyen hashes. Tu aplicación está lista para ser desplegada.

Consulta la sección sobre [despliegue](https://facebook.github.io/create-react-app/docs/deployment) para más información.

### `npm run eject`

**Nota: esta es una operación unidireccional. Una vez que ejecutes `eject`, no podrás volver atrás.**

Si no estás satisfecho con las opciones de configuración y herramientas, puedes ejecutar `eject` en cualquier momento. Este comando eliminará la dependencia única de compilación y copiará todos los archivos de configuración y las dependencias transitivas (webpack, Babel, ESLint, etc.) directamente en tu proyecto para que tengas control total sobre ellos. En este punto, estarás por tu cuenta.

No necesitas usar `eject`. El conjunto de características seleccionadas es adecuado para despliegues pequeños y medianos, y no deberías sentirte obligado a usar esta función. Sin embargo, entendemos que esta herramienta no sería útil si no pudieras personalizarla cuando estés listo para hacerlo.

## Aprende Más

Puedes aprender más en la [documentación de Create React App](https://facebook.github.io/create-react-app/docs/getting-started).

Para aprender React, consulta la [documentación de React](https://reactjs.org/).
