import { repository } from '../repositories/AppRepository';
import { ApiService } from './ApiService';

export const checkinService = {
  registerVisit: (code) => {
    const user = repository.currentUser;
    if (!user) throw new Error('Debes iniciar sesión');

    const place = repository.getPlaceByCode(code);
    if (!place) throw new Error('Código inválido o lugar inactivo');

    const today = new Date().toISOString().split('T')[0];
    return repository.addVisit(user.id, place.id, today);
  }
};

export const adminService = {
  // CREATE via Web Service
  async createPlace(placeData) {
    if (repository.currentUser?.role !== 'editor') {
      throw new Error('Acceso denegado: Se requiere rol de Editor');
    }
    
    // Llamada HTTP POST
    await ApiService.createPlace(placeData);

    const newPlace = { id: `p${Date.now()}`, ...placeData, active: true };
    repository.places.unshift(newPlace);
    return newPlace;
  },

  // UPDATE via Web Service
  async updatePlace(id, updatedData) {
    if (repository.currentUser?.role !== 'editor') {
      throw new Error('Acceso denegado: Se requiere rol de Editor');
    }

    await ApiService.updatePlace(id, updatedData);

    const index = repository.places.findIndex(p => p.id === id);
    if (index !== -1) {
      repository.places[index] = { ...repository.places[index], ...updatedData };
    }
    return repository.places[index];
  },

  // DELETE / DESACTIVAR via Web Service
  async deactivatePlace(id) {
    if (repository.currentUser?.role !== 'editor') {
      throw new Error('Acceso denegado: Se requiere rol de Editor');
    }

    await ApiService.deletePlace(id);

    const place = repository.places.find(p => p.id === id);
    if (place) {
      place.active = false;
    }
    return true;
  }
};
