import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

export default function CreateRoomScreen({ navigation }) {
  const [roomName, setRoomName] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  async function handleCreateRoom() {
    if (!roomName) {
      Alert.alert('Error', 'Ingresa un nombre para la sala');
      return;
    }
    try {
      setLoading(true);
      const code = Math.floor(1000 + Math.random() * 9000).toString(); // Código aleatorio de 4 dígitos
      
      await addDoc(collection(db, 'rooms'), {
        name: roomName,
        code: code,
        createdBy: user.uid,
        participants: [user.uid],
        createdAt: new Date(),
        matches: [] // Aquí irían los partidos configurados
      });
      
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear la sala: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Nueva Sala</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de la sala (ej: Amigos del Mundial)"
        value={roomName}
        onChangeText={setRoomName}
      />
      <TouchableOpacity style={styles.button} onPress={handleCreateRoom} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Crear Sala</Text>}
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 15, borderRadius: 8, marginBottom: 20, fontSize: 16 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelBtn: { marginTop: 20, alignItems: 'center' },
  cancelText: { color: '#666', fontSize: 16 }
});