import { DEMO_USERS, DEMO_PLACES, DEMO_CHALLENGES } from '../factories/demoData';

class AppRepository {
  constructor() {
    this.users = [...DEMO_USERS];
    this.places = [...DEMO_PLACES];
    this.visits = [];
    this.favorites = []; // Arreglo de { userId, placeId }
    this.challenges = [...DEMO_CHALLENGES];
    this.currentUser = null;
  }

  // Métodos de Sesión
  login(email, password) {
    const user = this.users.find(u => u.email === email);
    if (!user) throw new Error('Usuario no encontrado');
    this.currentUser = user;
    return user;
  }

  logout() { this.currentUser = null; }

  // Métodos de Lugares
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

  // Regla de Negocio 3: Máximo una visita por lugar en un mismo día
  addVisit(userId, placeId, dateStr) {
    const exists = this.visits.some(v => v.userId === userId && v.placeId === placeId && v.date === dateStr);
    if (exists) throw new Error('Ya registraste una visita a este lugar el día de hoy');
    
    const newVisit = { id: Date.now().toString(), userId, placeId, date: dateStr };
    this.visits.push(newVisit);
    return newVisit;
  }

  // Favoritos
  toggleFavorite(userId, placeId) {
    const index = this.favorites.findIndex(f => f.userId === userId && f.placeId === placeId);
    if (index >= 0) {
      this.favorites.splice(index, 1);
      return false;
    } else {
      this.favorites.push({ userId, placeId });
      return true;
    }
  }

  isFavorite(userId, placeId) {
    return this.favorites.some(f => f.userId === userId && f.placeId === placeId);
  }

  // Cálculo de avance de retos (Regla 6: Lugares distintos)
  calculateChallengeProgress(userId, challenge) {
    const userVisits = this.visits.filter(v => v.userId === userId && v.date >= challenge.startDate && v.date <= challenge.endDate);
    const placeIds = userVisits.map(v => v.placeId);
    
    // Filtrar lugares distintos por categoría del reto
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
