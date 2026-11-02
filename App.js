import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { repository } from './src/data/repositories/AppRepository';
import { checkinService, adminService } from './src/data/services/AppServices';

// Importación de Módulos Independientes
import AccessModule from './src/modules/access/AccessModule';
import HomeModule from './src/modules/home/HomeModule';
import PlacesModule from './src/modules/places/PlacesModule';
import CheckinModule from './src/modules/checkin/CheckinModule';
import PassportModule from './src/modules/passport/PassportModule';
import AdminModule from './src/modules/admin/AdminModule';

export default function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState('access');
  const [loading, setLoading] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await repository.syncWithWebService();
    setLoading(false);
  };

  const handleLogin = (email) => {
    try {
      const loggedUser = repository.login(email);
      setUser({ ...loggedUser });
      setScreen('home');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleRegisterVisit = (code) => {
    try {
      checkinService.registerVisit(code);
      Alert.alert('¡Éxito!', 'Visita registrada en tu pasaporte');
      setScreen('passport');
    } catch (err) {
      Alert.alert('Error de Validación', err.message);
    }
  };

  const handleSavePlace = async (id, name, code) => {
    setLoading(true);
    try {
      if (id) {
        await adminService.updatePlace(id, { name, code });
      } else {
        await adminService.createPlace({
          name,
          category: 'museo',
          municipio: 'Ciudad Madero',
          address: 'Zona Centro',
          description: 'Lugar registrado',
          schedule: '09:00 - 18:00',
          code
        });
      }
      setEditingPlace(null);
      setScreen('places');
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlace = async (id) => {
    setLoading(true);
    try {
      await adminService.deactivatePlace(id);
      setScreen('home');
      setTimeout(() => setScreen('places'), 50);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0066cc" />
        </View>
      )}

      {!user ? (
        <AccessModule onLogin={handleLogin} />
      ) : (
        <View style={{flex: 1}}>
          <View style={styles.navHeader}>
            <Text style={styles.userInfo}>{user.name} ({user.role.toUpperCase()})</Text>
            <TouchableOpacity onPress={() => { repository.logout(); setUser(null); setScreen('access'); }}>
              <Text style={{color: 'red', fontWeight: 'bold'}}>Salir</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.menuBar}>
            <TouchableOpacity onPress={() => setScreen('home')}><Text style={styles.menuItem}>Inicio</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setScreen('places')}><Text style={styles.menuItem}>Lugares</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setScreen('checkin')}><Text style={styles.menuItem}>Check-in</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setScreen('passport')}><Text style={styles.menuItem}>Pasaporte</Text></TouchableOpacity>
            {user.role === 'editor' && (
              <TouchableOpacity onPress={() => { setEditingPlace(null); setScreen('admin'); }}>
                <Text style={[styles.menuItem, {color: 'purple'}]}>+ Admin</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={{flex: 1, padding: 15}}>
            {screen === 'home' && (
              <HomeModule 
                user={user} 
                visitsCount={repository.visits.filter(v => v.userId === user.id).length}
                favoritesCount={repository.favorites.filter(f => f.userId === user.id).length}
                challenges={repository.challenges}
                calculateProgress={(uId, c) => repository.calculateChallengeProgress(uId, c)}
              />
            )}

            {screen === 'places' && (
              <PlacesModule 
                places={repository.places}
                isFavorite={(pId) => repository.isFavorite(user.id, pId)}
                onToggleFavorite={(pId) => { repository.toggleFavorite(user.id, pId); setScreen('home'); setTimeout(() => setScreen('places'), 10); }}
                role={user.role}
                onEdit={(place) => { setEditingPlace(place); setScreen('admin'); }}
                onDelete={handleDeletePlace}
              />
            )}

            {screen === 'checkin' && (
              <CheckinModule onRegisterVisit={handleRegisterVisit} />
            )}

            {screen === 'passport' && (
              <PassportModule 
                visits={repository.visits.filter(v => v.userId === user.id)}
                places={repository.places}
              />
            )}

            {screen === 'admin' && (
              <AdminModule 
                editingPlace={editingPlace}
                onSavePlace={handleSavePlace}
              />
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 99 },
  navHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  userInfo: { fontWeight: 'bold', color: '#333' },
  menuBar: { flexDirection: 'row', justifyContent: 'space-around', padding: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#ddd' },
  menuItem: { fontWeight: 'bold', color: '#0066cc' }
});
