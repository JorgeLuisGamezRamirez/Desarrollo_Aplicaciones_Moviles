# 💾 Pasaporte Cultural - Entrega: Local Storage, Hive, SQLite

Aplicación móvil en **React Native / Expo** implementando **Persistencia de Datos Local**, **Caché Offline** y **Persistencia de Sesión**.

## 📦 Características de Almacenamiento Local

- 🔐 **Inicio de Sesión Persistente**: Mantiene activa la sesión del usuario al recargar o reabrir la app.
- ⚡ **Caché Offline de Lugares**: Si la app pierde conectividad, recupera los datos desde el almacenamiento local.
- 💾 **Datos de Usuario Persistidos**: Guarda las visitas realizadas y los lugares favoritos localmente para que no se pierdan[cite: 5, 11].

## 🏗️ Estructura del Almacenamiento
- `src/data/providers/LocalStorage.js`: Abstracción del API de almacenamiento local (`AsyncStorage` / `LocalStorage`).
- `src/data/repositories/AppRepository.js`: Coordinación entre API remota, caché local y restauración de la sesión[cite: 5, 11].
