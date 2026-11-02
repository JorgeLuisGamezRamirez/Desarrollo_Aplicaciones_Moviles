import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';

export default function PassportModule({ visits, places }) {
  return (
    <View style={{flex: 1}}>
      <Text style={styles.screenTitle}>Historial de Visitas</Text>
      <FlatList
        data={visits}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const place = places.find(p => p.id === item.placeId);
          return (
            <View style={styles.card}>
              <Text style={{fontWeight: 'bold'}}>{place?.name || 'Lugar'}</Text>
              <Text style={{color: '#666'}}>Fecha: {item.date}</Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#e1e4e8' }
});
