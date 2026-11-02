import 'package:hive_flutter/hive_flutter.dart';
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class DatabaseProvider {
  static Database? _db;
  static Box? _hiveSessionBox;
  static Box? _hiveCacheBox;

  // Inicialización de Hive (KeyValue Store)
  static Future<void> initHive() async {
    await Hive.initFlutter();
    _hiveSessionBox = await Hive.openBox('session_box');
    _hiveCacheBox = await Hive.openBox('cache_box');
  }

  // Inicialización de SQLite (Relational DB)
  static Future<Database> get database async {
    if (_db != null) return _db!;
    _db = await _initDB('pasaporte_cultural.db');
    return _db!;
  }

  static Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, filePath);

    return await openDatabase(
      path,
      version: 1,
      onCreate: (db, version) async {
        await db.execute('''
          CREATE TABLE places(
            id TEXT PRIMARY KEY,
            name TEXT,
            category TEXT,
            municipio TEXT,
            code TEXT,
            active INTEGER
          )
        ''');
        await db.execute('''
          CREATE TABLE visits(
            id TEXT PRIMARY KEY,
            userId TEXT,
            placeId TEXT,
            date TEXT
          )
        ''');
      },
    );
  }

  // Métodos de HIVE (Persistencia de Sesión y Caché de Configuración)
  static Future<void> saveUserSession(String email, String role) async {
    await _hiveSessionBox?.put('user_email', email);
    await _hiveSessionBox?.put('user_role', role);
  }

  static Map<String, String>? getUserSession() {
    final email = _hiveSessionBox?.get('user_email');
    final role = _hiveSessionBox?.get('user_role');
    if (email != null && role != null) {
      return {'email': email, 'role': role};
    }
    return null;
  }

  static Future<void> clearUserSession() async {
    await _hiveSessionBox?.clear();
  }

  static Future<void> cachePlacesData(List> places) async {
    await _hiveCacheBox?.put('places_cache', places);
  }

  static List<dynamic>? getCachedPlaces() {
    return _hiveCacheBox?.get('places_cache');
  }
}
