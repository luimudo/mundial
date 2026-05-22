import { arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

export default function RoomScreen({ route, navigation }) {
  const { roomId } = route.params;
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'rooms', roomId), (doc) => {
      if (doc.exists()) {
        setRoom({ id: doc.id, ...doc.data() });
        
        // Unir al usuario si no está en la lista
        if (!doc.data().participants.includes(user.uid)) {
           // En una app real, esto debería ser un botón de "Unirse" con código
           // Por simplicidad, lo añadimos automáticamente si navega aquí
           updateDoc(doc.ref, {
             participants: arrayUnion(user.uid)
           });
        }
      } else {
        Alert.alert('Error', 'Sala no encontrada');
        navigation.goBack();
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [roomId]);

  if (loading || !room) return <Text>Cargando...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{room.name}</Text>
      <Text style={styles.code}>Código de invitación: {room.code}</Text>
      
      <TouchableOpacity 
        style={styles.playButton} 
        onPress={() => navigation.navigate('Predictions', { roomId })}
      >
        <Text style={styles.playButtonText}>Hacer Predicciones</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Tabla de Posiciones</Text>
      <FlatList
        data={room.participants || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.playerRow}>
            <Text style={styles.playerName}>Usuario ID: {item.substring(0, 5)}...</Text>
            <Text style={styles.playerPoints}>Puntos: 0</Text> {/* Aquí deberías calcular puntos reales */}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  code: { textAlign: 'center', color: '#666', marginBottom: 20 },
  playButton: { backgroundColor: '#FF9500', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 30 },
  playButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  playerRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', marginBottom: 5, borderRadius: 8 },
  playerName: { fontWeight: '500' },
  playerPoints: { fontWeight: 'bold', color: '#007AFF' }
});