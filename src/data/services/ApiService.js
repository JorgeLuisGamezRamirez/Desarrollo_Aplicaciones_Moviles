// Servicio Web para consumir la API REST de Pasaporte Cultural
const API_BASE_URL = 'https://jsonplaceholder.typicode.com'; // O tu endpoint REST / MockAPI

export const ApiService = {
  // GET: Obtener lugares desde servicio web
  async getPlaces() {
    try {
      const response = await fetch(`${API_BASE_URL}/posts?_limit=6`);
      if (!response.ok) throw new Error('Error al conectar con el servicio web');
      const data = await response.json();
      
      // Mapeo de respuesta API a nuestra entidad Place
      return data.map((item, index) => ({
        id: `p${item.id}`,
        name: item.title.slice(0, 20).toUpperCase(),
        category: index % 3 === 0 ? 'museo' : index % 3 === 1 ? 'galería' : 'centro cultural',
        municipio: index % 2 === 0 ? 'Tampico' : 'Ciudad Madero',
        address: 'Av. Hidalgo #102',
        description: item.body,
        schedule: '09:00 - 18:00',
        code: `CODE${item.id}23`,
        active: true
      }));
    } catch (error) {
      console.warn('Fallo de red, usando respaldo local:', error.message);
      return null;
    }
  },

  // POST: Crear nuevo lugar (CRUD) via HTTP POST
  async createPlace(placeData) {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(placeData)
    });
    if (!response.ok) throw new Error('Error HTTP al registrar en servidor web');
    return await response.json();
  },

  // PUT: Actualizar lugar (CRUD) via HTTP PUT
  async updatePlace(id, updatedData) {
    const response = await fetch(`${API_BASE_URL}/posts/1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });
    if (!response.ok) throw new Error('Error HTTP al actualizar en servidor web');
    return await response.json();
  },

  // DELETE: Desactivar/Eliminar lugar (CRUD) via HTTP DELETE
  async deletePlace(id) {
    const response = await fetch(`${API_BASE_URL}/posts/1`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error HTTP al eliminar del servidor web');
    return true;
  }
};
