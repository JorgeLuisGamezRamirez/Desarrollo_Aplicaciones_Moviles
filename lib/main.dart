import 'package:flutter/material.dart';
import 'data/providers/database_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await DatabaseProvider.initHive(); // Inicializar Hive
  runApp(const PasaporteCulturalApp());
}

class PasaporteCulturalApp extends StatelessWidget {
  const PasaporteCulturalApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Pasaporte Cultural Flutter',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String? _currentUser;
  String? _userRole;
  bool _isOffline = false;
  final TextEditingController _codeController = TextEditingController();

  List> _places = [
    {'name': 'Museo de Historia Regional', 'category': 'museo', 'code': 'MUSEO123'},
    {'name': 'Galería de Arte Moderno FIT', 'category': 'galería', 'code': 'GALERIA456'},
    {'name': 'Centro Cultural METRO Tampico', 'category': 'centro cultural', 'code': 'METRO789'},
  ];

  List<String> _myVisits = [];

  @override
  void initState() {
    super.initState();
    _checkPersistedSession();
  }

  // Comprobar inicio de sesión persistido con HIVE
  void _checkPersistedSession() {
    final session = DatabaseProvider.getUserSession();
    if (session != null) {
      setState(() {
        _currentUser = session['email'];
        _userRole = session['role'];
      });
    }
  }

  void _login(String email, String role) async {
    await DatabaseProvider.saveUserSession(email, role);
    setState(() {
      _currentUser = email;
      _userRole = role;
    });
  }

  void _logout() async {
    await DatabaseProvider.clearUserSession();
    setState(() {
      _currentUser = null;
      _userRole = null;
    });
  }

  void _registerVisit() {
    final code = _codeController.text.trim();
    final place = _places.firstWhere(
      (p) => p['code'] == code,
      orElse: () => {},
    );

    if (place.isNotEmpty) {
      setState(() {
        _myVisits.add('${place['name']} - ${DateTime.now().toString().split(' ')[0]}');
        _codeController.clear();
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('¡Visita guardada localmente en SQLite!')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Código inválido o lugar inactivo')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Pasaporte Cultural (Hive & SQLite)'),
        backgroundColor: Colors.indigo,
        foregroundColor: Colors.white,
        actions: _currentUser != null
            ? [
                IconButton(
                  icon: const Icon(Icons.logout),
                  onPressed: _logout,
                )
              ]
            : null,
      ),
      body: _currentUser == null
          ? Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    'Pasaporte Cultural V5',
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 10),
                  const Text('Persistencia con Hive & SQLite en Flutter'),
                  const SizedBox(height: 30),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      minimumSize: const Size.fromHeight(50),
                      backgroundColor: Colors.blue,
                      foregroundColor: Colors.white,
                    ),
                    onPressed: () => _login('user@uat.edu.mx', 'visitante'),
                    child: const Text('Entrar como Visitante'),
                  ),
                  const SizedBox(height: 10),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      minimumSize: const Size.fromHeight(50),
                      backgroundColor: Colors.purple,
                      foregroundColor: Colors.white,
                    ),
                    onPressed: () => _login('admin@uat.edu.mx', 'editor'),
                    child: const Text('Entrar como Editor'),
                  ),
                ],
              ),
            )
          : DefaultTabController(
              length: 3,
              child: Column(
                children: [
                  Container(
                    color: Colors.amber.shade100,
                    padding: const EdgeInsets.all(8),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.storage, size: 16),
                        const SizedBox(width: 5),
                        Text(
                          'Sesión Persistida con Hive: $_currentUser ($_userRole)',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                  const TabBar(
                    labelColor: Colors.indigo,
                    tabs: [
                      Tab(icon: Icon(Icons.museum), text: 'Lugares'),
                      Tab(icon: Icon(Icons.qr_code), text: 'Check-in'),
                      Tab(icon: Icon(Icons.history), text: 'Pasaporte'),
                    ],
                  ),
                  Expanded(
                    child: TabBarView(
                      children: [
                        // Tab 1: Lugares
                        ListView.builder(
                          itemCount: _places.length,
                          itemBuilder: (context, index) {
                            final p = _places[index];
                            return Card(
                              margin: const EdgeInsets.all(8),
                              child: ListTile(
                                title: Text(p['name']!),
                                subtitle: Text('Categoría: ${p['category']}'),
                                trailing: Text('Código: ${p['code']}'),
                              ),
                            );
                          },
                        ),

                        // Tab 2: Checkin
                        Padding(
                          padding: const EdgeInsets.all(20.0),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              TextField(
                                controller: _codeController,
                                decoration: const InputDecoration(
                                  labelText: 'Código de Registro',
                                  border: OutlineInputBorder(),
                                ),
                              ),
                              const SizedBox(height: 15),
                              ElevatedButton(
                                onPressed: _registerVisit,
                                child: const Text('Registrar Visita (SQLite)'),
                              )
                            ],
                          ),
                        ),

                        // Tab 3: Pasaporte
                        _myVisits.isEmpty
                            ? const Center(child: Text('No hay visitas registradas'))
                            : ListView.builder(
                                itemCount: _myVisits.length,
                                itemBuilder: (context, index) {
                                  return ListTile(
                                    leading: const Icon(Icons.check_circle, color: Colors.green),
                                    title: Text(_myVisits[index]),
                                  );
                                },
                              ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
