import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput } from 'react-native';

export default function StudentListScreen({ user, students, onToggleStatus, onSelectStudent, onAddStudent }) {
  const [newName, setNewName] = useState('');
  const [newMatricula, setNewMatricula] = useState('');

  const handleAdd = () => {
    if (!newName.trim() || !newMatricula.trim()) return;
    onAddStudent(newName, newMatricula);
    setNewName('');
    setNewMatricula('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Alumnos en clase</Text>
      <Text style={styles.subHeader}>Docente: {user?.name}</Text>
      
      <FlatList
        data={students}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <TouchableOpacity onPress={() => onSelectStudent(item)} style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemSub}>{item.matricula} • {item.career}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.badge, item.status === 'presente' ? styles.bgGreen : styles.bgRed]} 
              onPress={() => onToggleStatus(item.id)}>
              <Text style={styles.badgeText}>{item.status.toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.addBox}>
        <Text style={styles.addTitle}>Registrar nuevo alumno</Text>
        <TextInput style={styles.inputSm} placeholder="Nombre completo" value={newName} onChangeText={setNewName} />
        <TextInput style={styles.inputSm} placeholder="Matrícula" value={newMatricula} onChangeText={setNewMatricula} />
        <TouchableOpacity style={styles.btnAdd} onPress={handleAdd}>
          <Text style={styles.btnText}>+ Agregar Alumno</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a' },
  subHeader: { fontSize: 14, color: '#666', marginBottom: 15 },
  itemRow: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
  itemTitle: { fontSize: 16, fontWeight: '600' },
  itemSub: { color: '#666', fontSize: 12, marginTop: 2 },
  badge: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12 },
  bgGreen: { backgroundColor: '#28a745' },
  bgRed: { backgroundColor: '#dc3545' },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 11 },
  addBox: { marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#e0e0e0' },
  addTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  inputSm: { backgroundColor: '#fff', padding: 10, borderRadius: 6, marginBottom: 8, borderWidth: 1, borderColor: '#ddd' },
  btnAdd: { backgroundColor: '#28a745', padding: 12, borderRadius: 6, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});
