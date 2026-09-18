# Portal Taller Semillas

Interfaz Vue 3 del Sistema de Gestión Académica (SGA) de Taller Semillas. Incluye la página pública, autenticación, agenda de entrevistas, gestión administrativa de aspirantes y estudiantes, y el formulario de preinscripción que se abre con un enlace personalizado.

## Estado actual

El frontend está integrado con la API versionada del backend en `/api/v1`. El acceso al área administrativa exige un token Bearer y las rutas `/admin` ya no usan datos de demostración. El formulario público solicita y valida el contexto de la invitación antes de enviar información de matrícula.

Los módulos que siguen pendientes de cierre operativo son la carga persistente de foto del aspirante, las notificaciones por correo, las excepciones al horario y las comunicaciones directas. La selección de foto aún existe en la interfaz, pero no se guarda en el servidor; no debe usarse como evidencia documental.

## Ejecutar localmente

Requiere Node.js 20 o superior y el backend en ejecución.

```powershell
npm install
$env:VITE_API_URL = 'http://localhost:8080/api/v1'
npm run dev
```

La aplicación se abre normalmente en `http://localhost:5173`. Si se usa Docker para el frontend, el valor de `VITE_API_URL` se incorpora durante el build:

```powershell
docker build --build-arg VITE_API_URL=http://localhost:8080/api/v1 -t portal-semillas .
```

Con Docker Compose, el frontend se publica en `http://localhost:5173`; el puerto `8080` queda reservado para la API.

## Verificación

```powershell
npm run test
npm run build
```

La compilación de producción fue comprobada el 15 de septiembre de 2026. Vite informó solamente la recomendación de separar el bundle principal, que supera 500 kB sin comprimir.

## Integración con la API

Definir `VITE_API_URL` con la base de `/api/v1`; no añadir una barra final. El cliente guarda el token de sesión recibido en inicio de sesión y lo envía en `Authorization: Bearer ...`. Una respuesta 401 limpia la sesión local y envía al usuario a iniciar sesión.

La matrícula pública se abre con una ruta como `http://localhost:5173/inscripciones-matricula?token=...`. El enlace se expide luego de registrar y aprobar la entrevista. El cliente toma la versión del esquema desde el contexto que responde el backend, para evitar enviar formularios contra una versión incorrecta.

## Seguridad y datos personales

El portal no debe desplegarse sin HTTPS, la política de tratamiento de datos publicada y un origen permitido en la configuración del backend. La información de menores y acudientes se almacena únicamente en el backend; no se debe usar el almacenamiento local como fuente de verdad ni guardar copias de formularios reales en el repositorio.
