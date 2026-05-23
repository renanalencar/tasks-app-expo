import { View, Text, StyleSheet, Switch } from 'react-native';
import { useState } from 'react';
import { useTaskStore } from '../src/store/useTaskStore';

export default function SettingsScreen() {
  const tasks = useTaskStore((state) => state.tasks);
  const deleteAll = useTaskStore((state) => state.deleteAllTasks);
  const [notifications, setNotifications] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Notificações</Text>
        <Switch value={notifications} onValueChange={setNotifications} />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Total de tarefas salvas</Text>
        <Text style={styles.value}>{tasks.length}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label} onPress={deleteAll}>
          🗑 Limpar todas as tarefas
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 32, marginTop: 48 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: { fontSize: 16, color: '#333' },
  value: { fontSize: 16, fontWeight: 'bold' },
});