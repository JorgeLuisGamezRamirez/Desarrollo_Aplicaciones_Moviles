import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

export default function StudentDetailScreen({ student, onBack, onToggleStatus }) {
  if (!student) return null;

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Text style={styles.backText}>← Volver a la lista</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.name}>{student.name}</Text>
        <Text style={styles.info}>Matrícula: {student.matricula}</Text>
        <Text style={styles.info}>Carrera: {student.career}</Text>
        <Text style={styles.info}>Estado actual: <Text style={{fontWeight: 'bold', color: student.status === 'presente' ? '#28a745' : '#dc3545'}}>{student.status.toUpperCase()}</Text></Text>

        <TouchableOpacity 
          style={[styles.btn, student.status === 'presente' ? styles.bgRed : styles.bgGreen]} 
          onPress={() => onToggleStatus(student.id)}>
          <Text style={styles.btnText}>
            Marcar como {student.status === 'presente' ? 'Ausente' : 'Presente'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  backBtn: { marginBottom: 15 },
  backText: { color: '#0066cc', fontWeight: 'bold', fontSize: 16 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 10, borderWidth: 1, borderColor: '#eee' },
  name: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  info: { fontSize: 15, color: '#444', marginBottom: 8 },
  btn: { padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  bgGreen: { backgroundColor: '#28a745' },
  bgRed: { backgroundColor: '#dc3545' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 }
});
