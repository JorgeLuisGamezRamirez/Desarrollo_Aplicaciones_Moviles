import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, ActivityIndicator, Text } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import StudentListScreen from './src/screens/StudentListScreen';
import StudentDetailScreen from './src/screens/StudentDetailScreen';
import { INITIAL_STUDENTS } from './src/data/studentsData';

export default function App() {
  const [screen, setScreen] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleLogin = (email, password) => {
    if (!email || !password) {
      setError('Por favor ingresa correo y contraseña');
      return;
    }
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      setUser({ email, name: email.split('@')[0] });
      setScreen('list');
    }, 800);
  };

  const toggleStatus = (id) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'presente' ? 'ausente' : 'presente' } : s));
    if (selectedStudent && selectedStudent.id === id) {
      setSelectedStudent(prev => ({ ...prev, status: prev.status === 'presente' ? 'ausente' : 'presente' }));
    }
  };

  const addStudent = (name, matricula) => {
    const newSt = { 
      id: Date.now().toString(), 
      name, 
      matricula, 
      status: 'ausente', 
      career: 'Ing. Sistemas Computacionales' 
    };
    setStudents(prev => [...prev, newSt]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={{ marginTop: 10, color: '#666' }}>Cargando datos...</Text>
        </View>
      ) : screen === 'login' ? (
        <LoginScreen onLogin={handleLogin} loading={loading} error={error} />
      ) : screen === 'list' ? (
        <StudentListScreen 
          user={user} 
          students={students} 
          onToggleStatus={toggleStatus} 
          onSelectStudent={(st) => { setSelectedStudent(st); setScreen('detail'); }} 
          onAddStudent={addStudent} 
        />
      ) : (
        <StudentDetailScreen 
          student={selectedStudent} 
          onBack={() => setScreen('list')} 
          onToggleStatus={toggleStatus} 
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
