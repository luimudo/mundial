import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// Nota: En una app real, los partidos vendrían de Firebase. Aquí simulamos datos.

const MOCK_MATCHES = [
  { id: '1', teamA: 'Argentina', teamB: 'Francia', date: '2024-06-15' },
  { id: '2', teamA: 'Brasil', teamB: 'Alemania', date: '2024-06-16' },
  { id: '3', teamA: 'España', teamB: 'Italia', date: '2024-06-17' },
];

export default function PredictionsScreen({ route, navigation }) {
  const { roomId } = route.params;
  const [predictions, setPredictions] = useState({});

  const updatePrediction = (matchId, type, value) => {
    setPredictions(prev => ({
      ...prev,
      [matchId]: { ...prev[matchId], [type]: value }
    }));
  };

  const savePredictions = () => {
    // Validar que todos tengan predicción
    const allFilled = MOCK_MATCHES.every(m => 
      predictions[m.id]?.scoreA !== undefined && predictions[m.id]?.scoreB !== undefined
    );

    if (!allFilled) {
      Alert.alert('Atención', 'Debes predecir el resultado de todos los partidos.');
      return;
    }

    // Aquí guardarías en Firebase: collection('rooms').doc(roomId).collection('predictions')...
    Alert.alert('Éxito', 'Predicciones guardadas correctamente', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Realiza tus predicciones</Text>
      
      {MOCK_MATCHES.map((match) => (
        <View key={match.id} style={styles.matchCard}>
          <Text style={styles.matchInfo}>{match.teamA} vs {match.teamB}</Text>
          <View style={styles.inputsRow}>
            <TextInput
              style={styles.scoreInput}
              placeholder="0"
              keyboardType="numeric"
              value={predictions[match.id]?.scoreA}
              onChangeText={(text) => updatePrediction(match.id, 'scoreA', text)}
            />
            <Text style={styles.vs}>-</Text>
            <TextInput
              style={styles.scoreInput}
              placeholder="0"
              keyboardType="numeric"
              value={predictions[match.id]?.scoreB}
              onChangeText={(text) => updatePrediction(match.id, 'scoreB', text)}
            />
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.saveButton} onPress={savePredictions}>
        <Text style={styles.saveButtonText}>Guardar Apuestas</Text>
      </TouchableOpacity>
      <View style={{height: 40}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  matchCard: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 2 },
  matchInfo: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  inputsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  scoreInput: { borderWidth: 1, borderColor: '#ccc', width: 60, padding: 10, borderRadius: 8, textAlign: 'center', fontSize: 18 },
  vs: { marginHorizontal: 15, fontSize: 18, fontWeight: 'bold' },
  saveButton: { backgroundColor: '#34C759', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});