# 🎯 Pasaporte Cultural - Entrega: Local storage, hive, sqlite (Flutter)

Aplicación móvil desarrollada en **Flutter / Dart** implementando **Hive** para persistencia de sesión/clave-valor y **SQLite (`sqflite`)** para el almacenamiento de datos relacionales y visitas.

## 📌 Implementación de Persistencia Local en Flutter

- 🐝 **Hive (`hive_flutter`)**: Se utiliza para el almacenamiento ligero tipo Key-Value. Mantiene persistida la sesión del usuario (`session_box`) y el caché de preferencias.
- 🗄️ **SQLite (`sqflite`)**: Se utiliza para la base de datos relacional local. Gestiona el catálogo de lugares culturales y el historial de visitas en `pasaporte_cultural.db`[cite: 5, 11].
- 🔑 **Manejo de Sesión**: La sesión perdura activa entre reinicios del dispositivo gracias a Hive.
- 🌐 **Estrategia Caché**: Carga y lectura offline de datos locales.

## 🏗️ Estructura del Proyecto Flutter
- `lib/data/providers/database_provider.dart`: Abstracción conjunta de inicialización de **Hive** y **SQLite**.
- `lib/data/models/models.dart`: Modelos de entidades (`UserModel`, `PlaceModel`)[cite: 5].
- `lib/main.dart`: Interfaz y controlador principal en Flutter (Material Design 3)[cite: 5].
