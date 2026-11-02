# 🌐 Pasaporte Cultural - Versión 3 (CRUD & Servicios Web)

Aplicación móvil en **React Native / Expo** implementando la **Gestión de Datos (CRUD)** conectada a **Servicios Web REST** (`fetch` / API HTTP).

## 📡 Integración de Servicios Web

- **`GET`**: Carga dinámica de catálogo cultural desde la API HTTP en el arranque de la app.
- **`POST`**: Creación de nuevos espacios culturales sincronizados con el servidor remoto[cite: 5, 9].
- **`PUT`**: Edición y actualización de datos persistidos en el servicio web[cite: 5, 9].
- **`DELETE`**: Desactivación y borrado lógico de registros expuestos por la API REST[cite: 5, 9].

## 🏗️ Arquitectura
- `src/data/services/ApiService.js`: Encapsula el consumo de peticiones HTTP asíncronas (`fetch` y `async/await`)[cite: 5, 9].
- `src/data/services/AppServices.js`: Lógica CRUD expuesta al usuario Editor con validación de roles y estados[cite: 5, 9].
