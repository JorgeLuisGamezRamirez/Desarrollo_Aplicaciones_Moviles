import { repository } from '../repositories/AppRepository';

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
  createPlace: (placeData) => {
    if (repository.currentUser?.role !== 'editor') {
      throw new Error('Acceso denegado: Se requiere rol de Editor'); // Regla 9
    }
    const newPlace = { id: Date.now().toString(), ...placeData, active: true };
    repository.places.push(newPlace);
    return newPlace;
  }
};
