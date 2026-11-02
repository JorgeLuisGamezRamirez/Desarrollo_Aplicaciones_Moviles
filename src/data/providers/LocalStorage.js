// Abstracción de Almacenamiento Local (AsyncStorage / LocalStorage API)
export const LocalStorage = {
  async getItem(key) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      }
      return null;
    } catch (e) {
      console.error('Error leyendo LocalStorage:', e);
      return null;
    }
  },

  async setItem(key, value) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (e) {
      console.error('Error guardando en LocalStorage:', e);
    }
  },

  async removeItem(key) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      console.error('Error eliminando de LocalStorage:', e);
    }
  }
};
