import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { repository } from './src/data/repositories/AppRepository';
import { checkinService, adminService } from './src/data/services/AppServices';

import AccessModule from './src/modules/access/AccessModule';
import HomeModule from './src/modules/home/HomeModule';
import PlacesModule from './src/modules/places/PlacesModule';
import CheckinModule from './src/modules/checkin/CheckinModule';
import PassportModule from './src/modules/passport/PassportModule';
import AdminModule from './src/modules/admin/AdminModule';

export default function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState('access');
  const [loading, setLoading] = useState(true);
  const [editingPlace, setEditingPlace] = useState(null);

  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    setLoading(true);
    await repository.initLocalStorage();
    if (repository.currentUser) {
      setUser({ ...repository.currentUser });
      setScreen('home');
    }
    setLoading(false);
  };

  const handleLogin = async (email) => {
    try {
      const loggedUser = await repository.login(email);
      setUser({ ...loggedUser });
      setScreen('home');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleLogout = async () => {
    await repository.logout();
    setUser(null);
    setScreen('access');
  };

  const handleRegisterVisit = async (code) => {
    try {
      await checkinService.registerVisit(code);
      Alert.alert('¡Éxito!', 'Visita guardada localmente en tu pasaporte');
      setScreen('passport');
    } catch (err) {
      Alert.alert('Error de Validación', err.message);
    }
  };

  const handleToggleFavorite = async (pId) => {
    await repository.toggleFavorite(user.id, pId);
    setScreen('home');
    setTimeout(() => setScreen('places'), 10);
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={{ marginTop: 10, color: '#666' }}>Cargando datos y caché local...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {repository.isOfflineMode && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>⚠️ Modo Offline: Usando datos de Caché Local</Text>
        </View>
      )}

      {!user ? (
        <AccessModule onLogin={handleLogin} />
      ) : (
        <View style={{flex: 1}}>
          <View style={styles.navHeader}>
            <Text style={styles.userInfo}>{user.name} ({user.role.toUpperCase()})</Text>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={{color: 'red', fontWeight: 'bold'}}>Cerrar Sesión</Text>
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
                onToggleFavorite={handleToggleFavorite}
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  userInfo: { fontWeight: 'bold', color: '#333' },
  menuBar: { flexDirection: 'row', justifyContent: 'space-around', padding: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#ddd' },
  menuItem: { fontWeight: 'bold', color: '#0066cc' },
  offlineBanner: { backgroundColor: '#ffc107', padding: 8, alignItems: 'center' },
  offlineText: { color: '#000', fontWeight: 'bold', fontSize: 12 }
});
