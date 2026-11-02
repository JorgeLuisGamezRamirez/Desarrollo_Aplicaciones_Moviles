class UserModel {
  final String id;
  final String name;
  final String email;
  final String role;

  UserModel({required this.id, required this.name, required this.email, required this.role});
}

class PlaceModel {
  final String id;
  final String name;
  final String category;
  final String municipio;
  final String code;
  final bool active;

  PlaceModel({
    required this.id,
    required this.name,
    required this.category,
    required this.municipio,
    required this.code,
    this.active = true,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'category': category,
      'municipio': municipio,
      'code': code,
      'active': active ? 1 : 0,
    };
  }
}
