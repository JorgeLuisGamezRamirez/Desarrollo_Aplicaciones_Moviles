import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, SafeAreaView, Alert, ScrollView } from 'react-native';
import { repository } from './src/data/repositories/AppRepository';
import { checkinService, adminService } from './src/data/services/AppServices';

export default function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState('login'); // login, home, places, checkin, passport, admin

  // Estados de formularios
  const [email, setEmail] = useState('user@uat.edu.mx');
  const [code, setCode] = useState('');
  const [searchText, setSearchText] = useState('');

  // Estados del editor
  const [newPlaceName, setNewPlaceName] = useState('');
  const [newPlaceCode, setNewPlaceCode] = useState('');

  const handleLogin = (roleEmail) => {
    try {
      const loggedUser = repository.login(roleEmail, '123456');
      setUser({ ...loggedUser });
      setScreen('home');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleRegisterVisit = () => {
    try {
      checkinService.registerVisit(code);
      Alert.alert('¡Éxito!', 'Visita registrada en tu pasaporte');
      setCode('');
      setScreen('passport');
    } catch (err) {
      Alert.alert('Error de Validación', err.message);
    }
  };

  const handleCreatePlace = () => {
    try {
      adminService.createPlace({
        name: newPlaceName,
        category: 'museo',
        municipio: 'Ciudad Madero',
        address: 'Zona Centro',
        description: 'Lugar agregado por el editor',
        schedule: '09:00 - 17:00',
        code: newPlaceCode
      });
      Alert.alert('Éxito', 'Lugar creado por el editor');
      setNewPlaceName('');
      setNewPlaceCode('');
      setScreen('places');
    } catch (err) {
      Alert.alert('Permiso denegado', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {!user ? (
        <View style={styles.boxCenter}>
          <Text style={styles.title}>Pasaporte Cultural</Text>
          <Text style={styles.sub}>Ingresa como Visitante o Editor</Text>
          <TouchableOpacity style={[styles.btn, styles.bgBlue]} onPress={() => handleLogin('user@uat.edu.mx')}>
            <Text style={styles.btnText}>Entrar como Visitante</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.bgPurple, {marginTop: 10}]} onPress={() => handleLogin('admin@uat.edu.mx')}>
            <Text style={styles.btnText}>Entrar como Editor</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{flex: 1}}>
          {/* Header de Navegación */}
          <View style={styles.navHeader}>
            <Text style={styles.userInfo}>{user.name} ({user.role.toUpperCase()})</Text>
            <TouchableOpacity onPress={() => { repository.logout(); setUser(null); setScreen('login'); }}>
              <Text style={{color: 'red', fontWeight: 'bold'}}>Salir</Text>
            </TouchableOpacity>
          </View>

          {/* Menú de Módulos */}
          <View style={styles.menuBar}>
            <TouchableOpacity onPress={() => setScreen('home')}><Text style={styles.menuItem}>Inicio</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setScreen('places')}><Text style={styles.menuItem}>Lugares</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setScreen('checkin')}><Text style={styles.menuItem}>Check-in</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setScreen('passport')}><Text style={styles.menuItem}>Pasaporte</Text></TouchableOpacity>
            {user.role === 'editor' && (
              <TouchableOpacity onPress={() => setScreen('admin')}><Text style={[styles.menuItem, {color: 'purple'}]}>Admin</Text></TouchableOpacity>
            )}
          </View>

          {/* Renderizado de Vistas/Módulos */}
          <View style={{flex: 1, padding: 15}}>
            {screen === 'home' && (
              <View>
                <Text style={styles.screenTitle}>Resumen del Pasaporte</Text>
                <Text style={styles.cardInfo}>Visitas Totales: {repository.visits.filter(v => v.userId === user.id).length}</Text>
                <Text style={styles.cardInfo}>Favoritos: {repository.favorites.filter(f => f.userId === user.id).length}</Text>
                
                <Text style={[styles.screenTitle, {marginTop: 20}]}>Retos Activos</Text>
                {repository.challenges.map(c => {
                  const progress = repository.calculateChallengeProgress(user.id, c);
                  return (
                    <View key={c.id} style={styles.card}>
                      <Text style={{fontWeight: 'bold'}}>{c.title}</Text>
                      <Text>{c.description}</Text>
                      <Text style={{color: 'blue', marginTop: 5}}>Progreso: {progress} / {c.target}</Text>
                    </View>
                  );
                })}
              </View>
            )}

            {screen === 'places' && (
              <View style={{flex: 1}}>
                <TextInput style={styles.input} placeholder="Buscar por nombre..." value={searchText} onChangeText={setSearchText} />
                <FlatList
                  data={repository.searchPlaces(searchText)}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.card}>
                      <Text style={{fontWeight: 'bold', fontSize: 16}}>{item.name}</Text>
                      <Text style={{color: '#666'}}>{item.category} • {item.municipio}</Text>
                      <Text style={{fontSize: 12, color: '#999'}}>Código: {item.code}</Text>
                      <TouchableOpacity 
                        style={[styles.btnSm, {marginTop: 10}]} 
                        onPress={() => { repository.toggleFavorite(user.id, item.id); setScreen('places'); }}>
                        <Text style={{color: '#fff', fontSize: 12}}>
                          {repository.isFavorite(user.id, item.id) ? '★ Quitar Favorito' : '☆ Marcar Favorito'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>
            )}

            {screen === 'checkin' && (
              <View style={styles.boxCenter}>
                <Text style={styles.screenTitle}>Registrar Visita Cultural</Text>
                <TextInput style={styles.input} placeholder="Código único del lugar (ej. MUSEO123)" value={code} onChangeText={setCode} />
                <TouchableOpacity style={[styles.btn, styles.bgBlue]} onPress={handleRegisterVisit}>
                  <Text style={styles.btnText}>Validar y Registrar</Text>
                </TouchableOpacity>
              </View>
            )}

            {screen === 'passport' && (
              <View style={{flex: 1}}>
                <Text style={styles.screenTitle}>Historial de Visitas</Text>
                <FlatList
                  data={repository.visits.filter(v => v.userId === user.id)}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => {
                    const place = repository.places.find(p => p.id === item.placeId);
                    return (
                      <View style={styles.card}>
                        <Text style={{fontWeight: 'bold'}}>{place?.name || 'Lugar'}</Text>
                        <Text style={{color: '#666'}}>Fecha: {item.date}</Text>
                      </View>
                    );
                  }}
                />
              </View>
            )}

            {screen === 'admin' && (
              <ScrollView>
                <Text style={styles.screenTitle}>Administración (Solo Editor)</Text>
                <TextInput style={styles.input} placeholder="Nombre del nuevo lugar" value={newPlaceName} onChangeText={setNewPlaceName} />
                <TextInput style={styles.input} placeholder="Código de registro único" value={newPlaceCode} onChangeText={setNewPlaceCode} />
                <TouchableOpacity style={[styles.btn, styles.bgPurple]} onPress={handleCreatePlace}>
                  <Text style={styles.btnText}>+ Crear Lugar</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  boxCenter: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', color: '#111', marginBottom: 5 },
  sub: { textAlign: 'center', color: '#666', marginBottom: 20 },
  screenTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 10 },
  btn: { padding: 14, borderRadius: 8, alignItems: 'center' },
  btnSm: { backgroundColor: '#333', padding: 8, borderRadius: 6, alignItems: 'center', alignSelf: 'flex-start' },
  bgBlue: { backgroundColor: '#0066cc' },
  bgPurple: { backgroundColor: '#6f42c1' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  navHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  userInfo: { fontWeight: 'bold', color: '#333' },
  menuBar: { flexDirection: 'row', justifyContent: 'space-around', padding: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#ddd' },
  menuItem: { fontWeight: 'bold', color: '#0066cc' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#e1e4e8' },
  cardInfo: { fontSize: 16, marginBottom: 5 }
});
