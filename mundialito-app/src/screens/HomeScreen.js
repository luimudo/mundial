import { collection, onSnapshot, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'rooms'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const roomsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRooms(roomsData);
    });
    return unsubscribe;
  }, []);

  const handleJoinRoom = (roomId) => {
    navigation.navigate('Room', { roomId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Hola, {user.displayName || 'Jugador'}</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.createBtn} 
        onPress={() => navigation.navigate('CreateRoom')}
      >
        <Text style={styles.createBtnText}>+ Crear Nueva Sala</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Salas Disponibles</Text>
      <FlatList
        data={rooms}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.roomCard} onPress={() => handleJoinRoom(item.id)}>
            <Text style={styles.roomName}>{item.name}</Text>
            <Text style={styles.roomCode}>Código: {item.code}</Text>
            <Text style={styles.roomInfo}>Participantes: {item.participants?.length || 0}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  welcome: { fontSize: 24, fontWeight: 'bold' },
  logoutBtn: { padding: 10 },
  logoutText: { color: 'red', fontWeight: 'bold' },
  createBtn: { backgroundColor: '#34C759', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  createBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  roomCard: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 },
  roomName: { fontSize: 18, fontWeight: 'bold' },
  roomCode: { color: '#666', fontSize: 14 },
  roomInfo: { color: '#888', fontSize: 12, marginTop: 5 }
});