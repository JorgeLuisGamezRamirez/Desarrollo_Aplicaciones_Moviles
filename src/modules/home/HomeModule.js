import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeModule({ user, visitsCount, favoritesCount, challenges, calculateProgress }) {
  return (
    <View>
      <Text style={styles.screenTitle}>Resumen del Pasaporte</Text>
      <Text style={styles.cardInfo}>Visitas Totales: {visitsCount}</Text>
      <Text style={styles.cardInfo}>Favoritos: {favoritesCount}</Text>
      
      <Text style={[styles.screenTitle, {marginTop: 20}]}>Retos Activos</Text>
      {challenges.map(c => {
        const progress = calculateProgress(user.id, c);
        return (
          <View key={c.id} style={styles.card}>
            <Text style={{fontWeight: 'bold'}}>{c.title}</Text>
            <Text>{c.description}</Text>
            <Text style={{color: 'blue', marginTop: 5}}>Progreso: {progress} / {c.target}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  screenTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  cardInfo: { fontSize: 16, marginBottom: 5 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#e1e4e8' }
});
