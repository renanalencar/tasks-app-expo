import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTaskStore } from '../../src/store/useTaskStore';

export default function TaskDetailScreen() {
  const { id: taskId } = useLocalSearchParams<{ id: string }>();
  const navigation = useRouter();
  
  // Buscando a tarefa com uma nomenclatura diferente
  const currentTask = useTaskStore((state) => state.tasks.find((item) => item._id === taskId));

  // Tela de fallback caso não encontre o registro
  if (!currentTask) {
    return (
      <View style={styles.mainWrapper}>
        <Text style={styles.errorText}>Tarefa não encontrada.</Text>
        <TouchableOpacity onPress={() => navigation.back()}>
          <Text style={styles.btnReturn}>← Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isTaskDone = currentTask.completed;

  return (
    <View style={styles.mainWrapper}>
      <TouchableOpacity onPress={() => navigation.back()}>
        <Text style={styles.btnReturn}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.headTitle}>{currentTask.text}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.fieldLabel}>Status</Text>
        <Text style={[styles.statusTag, isTaskDone ? styles.tagSuccess : styles.tagWarning]}>
          {isTaskDone ? 'Concluída' : 'Pendente'}
        </Text>
      </View>

      {currentTask.dueDate && (
        <View style={styles.infoRow}>
          <Text style={styles.fieldLabel}>Data limite</Text>
          <Text style={styles.fieldValue}>
            {new Date(currentTask.dueDate).toLocaleDateString()}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, padding: 24, backgroundColor: '#fff' },
  btnReturn: { fontSize: 16, color: '#007AFF', marginTop: 48, marginBottom: 24 },
  headTitle: { fontSize: 26, fontWeight: 'bold', marginBottom: 32 },
  errorText: { fontSize: 18, color: '#999', marginBottom: 16 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  fieldLabel: { fontSize: 16, color: '#666' },
  fieldValue: { fontSize: 16, fontWeight: 'bold' },
  statusTag: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    overflow: 'hidden',
    fontWeight: 'bold',
    fontSize: 14,
  },
  tagSuccess: { backgroundColor: '#e6f4ea', color: '#2e7d32' },
  tagWarning: { backgroundColor: '#fff3e0', color: '#e65100' },
});