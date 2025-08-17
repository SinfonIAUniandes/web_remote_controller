# Control Remoto para ROS2

Este proyecto es un control remoto diseñado para interactuar con los robots NAO y Pepper de SoftBank Robotics utilizando ROS2. Proporciona una interfaz gráfica que permite controlar diversas funcionalidades de los robots, como movimientos, animaciones, reproducción de audio, control de cámara, entre otros.

## Requisitos

Este control remoto está diseñado para ser usado junto con el paquete [naoqi_bringup2_SinfonIA](https://github.com/SinfonIAUniandes/naoqi_bringup2_SinfonIA), un metapaquete de ROS2 que simplifica el proceso de lanzamiento de una interfaz completa y rica en funcionalidades para los robots NAO y Pepper. Ese paquete actúa como un driver no oficial de ROS2, permitiendo acceder a todas las capacidades de estos robots.

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
