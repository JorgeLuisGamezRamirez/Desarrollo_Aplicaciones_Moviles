import { DEMO_USERS, DEMO_PLACES, DEMO_CHALLENGES } from '../factories/demoData';
import { ApiService } from '../services/ApiService';
import { LocalStorage } from '../providers/LocalStorage';

const KEYS = {
  SESSION: '@user_session',
  PLACES_CACHE: '@places_cache',
  VISITS: '@user_visits',
  FAVORITES: '@user_favorites'
};

class AppRepository {
  constructor() {
    this.users = [...DEMO_USERS];
    this.places = [...DEMO_PLACES];
    this.visits = [];
    this.favorites = [];
    this.challenges = [...DEMO_CHALLENGES];
    this.currentUser = null;
    this.isOfflineMode = false;
  }

  // Carga inicial e integración con Local Storage + Caché Offline
  async initLocalStorage() {
    // 1. Restaurar Sesión de usuario persistida
    const savedUser = await LocalStorage.getItem(KEYS.SESSION);
    if (savedUser) {
      this.currentUser = savedUser;
    }

    // 2. Restaurar Visitas y Favoritos del usuario
    const savedVisits = await LocalStorage.getItem(KEYS.VISITS);
    if (savedVisits) this.visits = savedVisits;

    const savedFavs = await LocalStorage.getItem(KEYS.FAVORITES);
    if (savedFavs) this.favorites = savedFavs;

    // 3. Estrategia de Caché: Intenta cargar de la API; si falla, usa el Caché Local
    try {
      const remotePlaces = await ApiService.getPlaces();
      if (remotePlaces && remotePlaces.length > 0) {
        this.places = remotePlaces;
        await LocalStorage.setItem(KEYS.PLACES_CACHE, remotePlaces); // Actualizar caché local
        this.isOfflineMode = false;
      }
    } catch (error) {
      console.warn('Fallo de red. Cargando catálogo desde Caché Local (SQLite/Storage)...');
      const cachedPlaces = await LocalStorage.getItem(KEYS.PLACES_CACHE);
      if (cachedPlaces) {
        this.places = cachedPlaces;
        this.isOfflineMode = true;
      }
    }
  }

  async login(email) {
    const user = this.users.find(u => u.email === email);
    if (!user) throw new Error('Usuario no encontrado');
    this.currentUser = user;
    await LocalStorage.setItem(KEYS.SESSION, user); // Persistir sesión
    return user;
  }

  async logout() { 
    this.currentUser = null;
    await LocalStorage.removeItem(KEYS.SESSION); // Limpiar sesión guardada
  }

  searchPlaces(text = '', category = '', municipio = '') {
    return this.places.filter(p => p.active && 
      p.name.toLowerCase().includes(text.toLowerCase()) &&
      (category ? p.category === category : true) &&
      (municipio ? p.municipio === municipio : true)
    );
  }

  getPlaceByCode(code) {
    return this.places.find(p => p.code === code && p.active);
  }

  async addVisit(userId, placeId, dateStr) {
    const exists = this.visits.some(v => v.userId === userId && v.placeId === placeId && v.date === dateStr);
    if (exists) throw new Error('Ya registraste una visita a este lugar el día de hoy');
    
    const newVisit = { id: Date.now().toString(), userId, placeId, date: dateStr };
    this.visits.push(newVisit);
    await LocalStorage.setItem(KEYS.VISITS, this.visits); // Persistir visita localmente
    return newVisit;
  }

  async toggleFavorite(userId, placeId) {
    const index = this.favorites.findIndex(f => f.userId === userId && f.placeId === placeId);
    if (index >= 0) {
      this.favorites.splice(index, 1);
    } else {
      this.favorites.push({ userId, placeId });
    }
    await LocalStorage.setItem(KEYS.FAVORITES, this.favorites); // Persistir favoritos
    return index < 0;
  }

  isFavorite(userId, placeId) {
    return this.favorites.some(f => f.userId === userId && f.placeId === placeId);
  }

  calculateChallengeProgress(userId, challenge) {
    const userVisits = this.visits.filter(v => v.userId === userId && v.date >= challenge.startDate && v.date <= challenge.endDate);
    const placeIds = userVisits.map(v => v.placeId);
    
    const uniquePlaces = new Set();
    placeIds.forEach(pId => {
      const place = this.places.find(p => p.id === pId);
      if (place && place.category === challenge.category) {
        uniquePlaces.add(pId);
      }
    });

    return Math.min(uniquePlaces.size, challenge.target);
  }
}

export const repository = new AppRepository();
