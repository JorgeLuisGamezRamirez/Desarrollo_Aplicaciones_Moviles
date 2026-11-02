# 🧩 Pasaporte Cultural - Entrega: Módulos

Aplicación móvil desarrollada en **React Native / Expo** estructurada bajo la arquitectura por **Módulos Independientes**[cite: 5, 10].

## 📁 Distribución de Módulos

La lógica de negocio e interfaz se ha dividido en submódulos encapsulados dentro de `src/modules/`:

- 🔑 **`src/modules/access/AccessModule.js`**: Gestión de acceso, roles y sesión.
- 🏠 **`src/modules/home/HomeModule.js`**: Resumen general, contadores y avance de retos[cite: 5].
- 🏛️ **`src/modules/places/PlacesModule.js`**: Catálogo de lugares, filtros y lista de favoritos[cite: 5].
- 📍 **`src/modules/checkin/CheckinModule.js`**: Proceso de validación e ingreso de códigos[cite: 5].
- 📖 **`src/modules/passport/PassportModule.js`**: Historial de visitas y pasaporte cultural[cite: 5].
- ⚙️ **`src/modules/admin/AdminModule.js`**: Administración CRUD para perfil de Editor[cite: 5].
