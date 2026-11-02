import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

export default function CheckinModule({ onRegisterVisit }) {
  const [code, setCode] = useState('');

  const handlePress = () => {
    onRegisterVisit(code);
    setCode('');
  };

  return (
    <View style={styles.boxCenter}>
      <Text style={styles.screenTitle}>Registrar Visita Cultural</Text>
      <TextInput style={styles.input} placeholder="Código único del lugar (ej. CODE123)" value={code} onChangeText={setCode} />
      <TouchableOpacity style={[styles.btn, styles.bgBlue]} onPress={handlePress}>
        <Text style={styles.btnText}>Validar y Registrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  boxCenter: { flex: 1, justifyContent: 'center', padding: 20 },
  screenTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 10 },
  btn: { padding: 14, borderRadius: 8, alignItems: 'center' },
  bgBlue: { backgroundColor: '#0066cc' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});
