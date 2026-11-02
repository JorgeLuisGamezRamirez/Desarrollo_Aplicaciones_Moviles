import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';

export default function AdminModule({ editingPlace, onSavePlace }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    if (editingPlace) {
      setName(editingPlace.name);
      setCode(editingPlace.code);
    } else {
      setName('');
      setCode('');
    }
  }, [editingPlace]);

  const handleSave = () => {
    onSavePlace(editingPlace?.id, name, code);
  };

  return (
    <ScrollView style={{flex: 1}}>
      <Text style={styles.screenTitle}>{editingPlace ? 'Editar Lugar' : 'Crear Nuevo Lugar'}</Text>
      <TextInput style={styles.input} placeholder="Nombre del lugar" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Código único" value={code} onChangeText={setCode} />
      
      <TouchableOpacity style={[styles.btn, styles.bgPurple]} onPress={handleSave}>
        <Text style={styles.btnText}>{editingPlace ? 'Actualizar' : '+ Guardar Lugar'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 10 },
  btn: { padding: 14, borderRadius: 8, alignItems: 'center' },
  bgPurple: { backgroundColor: '#6f42c1' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});
