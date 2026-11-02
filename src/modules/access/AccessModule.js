import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function AccessModule({ onLogin }) {
  return (
    <View style={styles.boxCenter}>
      <Text style={styles.title}>Pasaporte Cultural V4</Text>
      <Text style={styles.sub}>Arquitectura Modular Independiente</Text>
      <TouchableOpacity style={[styles.btn, styles.bgBlue]} onPress={() => onLogin('user@uat.edu.mx')}>
        <Text style={styles.btnText}>Entrar como Visitante</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, styles.bgPurple, {marginTop: 10}]} onPress={() => onLogin('admin@uat.edu.mx')}>
        <Text style={styles.btnText}>Entrar como Editor</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  boxCenter: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', color: '#111', marginBottom: 5 },
  sub: { textAlign: 'center', color: '#666', marginBottom: 20 },
  btn: { padding: 14, borderRadius: 8, alignItems: 'center' },
  bgBlue: { backgroundColor: '#0066cc' },
  bgPurple: { backgroundColor: '#6f42c1' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});
