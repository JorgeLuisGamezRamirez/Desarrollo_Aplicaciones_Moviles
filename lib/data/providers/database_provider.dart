import 'package:hive_flutter/hive_flutter.dart';
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class DatabaseProvider {
  static Database? _db;
  static Box? _hiveSessionBox;
  static Box? _hiveCacheBox;

  static const List<Map<String, Object?>> _seedPlaces = [
    {'id': 'p1', 'name': 'Museo de Historia Regional', 'category': 'museo', 'municipio': 'Tampico', 'code': 'MUSEO123', 'active': 1},
    {'id': 'p2', 'name': 'Galería de Arte Moderno FIT', 'category': 'galería', 'municipio': 'Tampico', 'code': 'GALERIA456', 'active': 1},
    {'id': 'p3', 'name': 'Centro Cultural METRO Tampico', 'category': 'centro cultural', 'municipio': 'Tampico', 'code': 'METRO789', 'active': 1},
  ];

  // Hive: inicialización de sesión y caché
  static Future<void> initHive() async {
    await Hive.initFlutter();
    _hiveSessionBox = await Hive.openBox('session_box');
    _hiveCacheBox = await Hive.openBox('cache_box');
  }

  // SQLite: se crea la base y se llena con los lugares de prueba la primera vez
  static Future<Database> get database async {
    if (_db != null) return _db!;
    final dbPath = await getDatabasesPath();
    _db = await openDatabase(
      join(dbPath, 'pasaporte_cultural.db'),
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
        for (final p in _seedPlaces) {
          await db.insert('places', p);
        }
      },
    );
    return _db!;
  }

  // ---------- Lugares ----------

  static Future<List<Map<String, dynamic>>> getPlaces() async {
    try {
      final db = await database;
      final rows = await db.query('places', where: 'active = 1');
      await cachePlacesData(rows);
      return rows;
    } catch (_) {
      // Si falla SQLite, se usa la copia guardada en Hive
      return getCachedPlaces();
    }
  }

  // ---------- Visitas ----------

  static Future<Map<String, dynamic>> registerVisit(String userId, String code) async {
    final db = await database;
    final places = await db.query('places', where: 'code = ? AND active = 1', whereArgs: [code]);
    if (places.isEmpty) {
      return {'ok': false, 'message': 'Código inválido o lugar inactivo'};
    }
    final placeId = places.first['id'] as String;
    final today = DateTime.now().toIso8601String().split('T').first;

    final already = await db.query(
      'visits',
      where: 'userId = ? AND placeId = ? AND date = ?',
      whereArgs: [userId, placeId, today],
    );
    if (already.isNotEmpty) {
      return {'ok': false, 'message': 'Ya registraste este lugar hoy'};
    }

    await db.insert('visits', {
      'id': DateTime.now().microsecondsSinceEpoch.toString(),
      'userId': userId,
      'placeId': placeId,
      'date': today,
    });
    return {'ok': true, 'message': '¡Visita guardada en SQLite!'};
  }

  static Future<List<Map<String, dynamic>>> getVisitsForUser(String userId) async {
    final db = await database;
    return db.rawQuery('''
      SELECT v.date AS date, p.name AS placeName
      FROM visits v
      JOIN places p ON p.id = v.placeId
      WHERE v.userId = ?
      ORDER BY v.date DESC
    ''', [userId]);
  }

  // ---------- Hive: sesión ----------

  static Future<void> saveUserSession(String email, String role) async {
    await _hiveSessionBox?.put('user_email', email);
    await _hiveSessionBox?.put('user_role', role);
  }

  static Map<String, String>? getUserSession() {
    final email = _hiveSessionBox?.get('user_email');
    final role = _hiveSessionBox?.get('user_role');
    if (email != null && role != null) {
      return {'email': email as String, 'role': role as String};
    }
    return null;
  }

  static Future<void> clearUserSession() async {
    await _hiveSessionBox?.clear();
  }

  // ---------- Hive: caché ----------

  static Future<void> cachePlacesData(List<Map<String, dynamic>> places) async {
    await _hiveCacheBox?.put('places_cache', places);
  }

  static List<Map<String, dynamic>> getCachedPlaces() {
    final cached = _hiveCacheBox?.get('places_cache');
    if (cached == null) return [];
    return (cached as List)
        .map((e) => Map<String, dynamic>.from(e as Map))
        .toList();
  }
}
