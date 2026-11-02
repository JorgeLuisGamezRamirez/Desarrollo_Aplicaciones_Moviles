import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity } from 'react-native';

export default function PlacesModule({ places, isFavorite, onToggleFavorite, role, onEdit, onDelete }) {
  const [searchText, setSearchText] = useState('');

  const filtered = places.filter(p => p.active && p.name.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <View style={{flex: 1}}>
      <TextInput style={styles.input} placeholder="Buscar por nombre..." value={searchText} onChangeText={setSearchText} />
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={{fontWeight: 'bold', fontSize: 16}}>{item.name}</Text>
            <Text style={{color: '#666'}}>{item.category} • {item.municipio}</Text>
            <Text style={{fontSize: 12, color: '#999'}}>Código: {item.code}</Text>
            
            <View style={{flexDirection: 'row', gap: 10, marginTop: 10}}>
              <TouchableOpacity style={styles.btnSm} onPress={() => onToggleFavorite(item.id)}>
                <Text style={{color: '#fff', fontSize: 12}}>
                  {isFavorite(item.id) ? '★ Quitar' : '☆ Favorito'}
                </Text>
              </TouchableOpacity>

              {role === 'editor' && (
                <>
                  <TouchableOpacity style={[styles.btnSm, {backgroundColor: '#ffc107'}]} onPress={() => onEdit(item)}>
                    <Text style={{color: '#000', fontSize: 12}}>✏️ Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.btnSm, {backgroundColor: '#dc3545'}]} onPress={() => onDelete(item.id)}>
                    <Text style={{color: '#fff', fontSize: 12}}>🗑️ Desactivar</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 10 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#e1e4e8' },
  btnSm: { backgroundColor: '#333', padding: 8, borderRadius: 6, alignItems: 'center' }
});
