# 🏛️ Pasaporte Cultural - Versión 2

Aplicación modular desarrollada en **React Native / Expo** que permite explorar espacios culturales, registrar visitas mediante códigos únicos, cumplir retos de exploración y administrar el catálogo mediante roles.

## 📌 Arquitectura del Sistema

El proyecto cumple con la distribución de responsabilidades por capas especificada en el entregable:

- **`src/core/`**: Constantes, tipos de roles y utilidades globales.
- **`src/data/models/`**: Entidades principales (`User`, `Place`, `Visit`, `Challenge`).
- **`src/data/repositories/`**: Lógica de almacenamiento y persistencia.
- **`src/data/services/`**: Implementación de las 10 Reglas de Negocio (restricción diaria de visita, validación de códigos y permisos de editor).
- **`src/data/factories/`**: Semilla de datos iniciales reutilizables (`DEMO_USERS`, `DEMO_PLACES`).

---

## 👥 Perfiles de Prueba

1. **Visitante**: `user@uat.edu.mx` (Explora lugares, marca favoritos, registra visitas con código y consulta retos)[cite: 5].
2. **Editor**: `admin@uat.edu.mx` (Crea nuevos lugares culturales y gestiona el sistema)[cite: 5].
