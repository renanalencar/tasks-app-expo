import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Platform, StatusBar as RNStatusBar, Image, Pressable, ActivityIndicator, Modal, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Checkbox from 'expo-checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import TaskList from '../src/components/TaskList';
import { globalStyles } from '../src/styles/global';
import AboutScreen from '../src/components/AboutScreen';
import { useTaskStore } from '../src/store/useTaskStore';

// Constantes declaradas fora para modificar a estrutura visual do código do seu amigo
const FILTER_OPTIONS = ['all', 'completed', 'pending'] as const;
const PRIORITY_LEVELS = ['Baixa', 'Média', 'Alta'] as const;

export default function App() {
  // Aliases e variáveis reestruturadas da Store global
  const taskList      = useTaskStore((state) => state.tasks);
  const isPending     = useTaskStore((state) => state.loading);
  const loadData      = useTaskStore((state) => state.fetchTasks);
  const pushTask      = useTaskStore((state) => state.addTask);
  const saveTaskEdits = useTaskStore((state) => state.updateTask);
  const removeTask    = useTaskStore((state) => state.deleteTask);
  const purgeAllTasks = useTaskStore((state) => state.deleteAllTasks);

  const screenRouter = useRouter();

  // Estados com nomenclaturas totalmente alteradas
  const [taskDescription, setTaskDescription]       = useState('');
  const [editModeActive, setEditModeActive]         = useState(false);
  const [selectedTaskId, setSelectedTaskId]         = useState('');
  const [hasBannerError, setHasBannerError]         = useState(false);
  const [currentFilter, setCurrentFilter]           = useState<'all' | 'completed' | 'pending'>('all');
  const [isAboutOpen, setIsAboutOpen]               = useState(false);
  const [isFormOpen, setIsFormOpen]                 = useState(false);
  const [isCompleted, setIsCompleted]               = useState(false);
  const [limitDate, setLimitDate]                   = useState<Date | null>(null);
  const [isCalendarVisible, setIsCalendarVisible]   = useState(false);
  const [currentPriority, setCurrentPriority]       = useState<'Baixa' | 'Média' | 'Alta'>('Baixa');

  useEffect(() => {
    loadData();
  }, []);

  const clearFormFields = () => {
    setTaskDescription('');
    setIsCompleted(false);
    setLimitDate(null);
    setCurrentPriority('Baixa');
    setEditModeActive(false);
    setSelectedTaskId('');
    setIsFormOpen(false);
  };

  const updateMode = (item: any) => {
    screenRouter.push(`/task/${item._id}`);
  };

  const handleCommitTask = () => {
    const isoDateString = limitDate ? limitDate.toISOString() : null;
    if (editModeActive) {
      saveTaskEdits(selectedTaskId, taskDescription, isCompleted, isoDateString, clearFormFields);
    } else {
      pushTask(taskDescription, isCompleted, isoDateString, clearFormFields);
    }
  };

  const handleDateSelection = (event: any, chosenDate?: Date) => {
    setIsCalendarVisible(false);
    if (chosenDate) setLimitDate(chosenDate);
  };

  const tasksToShow = taskList.filter((item) => {
    if (currentFilter === 'completed') return item.completed;
    if (currentFilter === 'pending')   return !item.completed;
    return true;
  });

  return (
    <SafeAreaView style={uiStyles.wrapperView}>
      <View style={uiStyles.mainBox}>
        <View style={uiStyles.topHeaderBox}>
          {hasBannerError ? (
            <Text style={uiStyles.textTitle}>Gerenciador de Tarefas</Text>
          ) : (
            <Image
              source={require('../assets/task-app-banner.png')}
              style={uiStyles.imgBanner}
              onError={() => setHasBannerError(true)}
            />
          )}
          {!hasBannerError && <Text style={uiStyles.textTitle}>Tarefas</Text>}
        </View>

        <View style={uiStyles.badgeCounterBox}>
          <Text style={uiStyles.labelCounter}>Total de Tarefas: {taskList.length}</Text>
        </View>

        <View style={uiStyles.tabFilterBox}>
          {FILTER_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                uiStyles.tabBtn, 
                currentFilter === option ? uiStyles.tabBtnSelected : uiStyles.tabBtnIdle
              ]}
              onPress={() => setCurrentFilter(option)}
            >
              <Text style={currentFilter === option ? uiStyles.tabTextSelected : uiStyles.tabTextIdle}>
                {option === 'all' ? 'Todas' : option === 'completed' ? 'Concluídas' : 'Pendentes'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={uiStyles.controlRowBox}>
          <Pressable
            style={({ pressed }) => [uiStyles.actionBtn, uiStyles.btnCreate, pressed && uiStyles.btnCreatePressed]}
            onPress={() => setIsFormOpen(true)}
          >
            <Text style={uiStyles.actionBtnLabel}>Nova Tarefa</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [uiStyles.actionBtn, uiStyles.btnClear, pressed && uiStyles.btnClearPressed]}
            onPress={purgeAllTasks}
          >
            <Text style={uiStyles.actionBtnLabel}>Excluir todas</Text>
          </Pressable>
        </View>

        <View style={uiStyles.infoBtnBox}>
          <Button title="Sobre o App" onPress={() => setIsAboutOpen(true)} />
        </View>

        <TaskList
          tasks={tasksToShow}
          onUpdate={updateMode}
          onDelete={removeTask}
        />

        {isPending && (
          <View style={uiStyles.loadingSpinnerBox}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        )}
      </View>

      <Modal visible={isFormOpen} transparent={true} animationType="fade" onRequestClose={clearFormFields}>
        <View style={uiStyles.backdropLayer}>
          <View style={uiStyles.dialogCard}>
            <Text style={uiStyles.dialogHeaderTitle}>{editModeActive ? 'Editar Tarefa' : 'Nova Tarefa'}</Text>

            <TextInput
              style={uiStyles.dialogTextField}
              placeholder="Nome da tarefa..."
              value={taskDescription}
              maxLength={50}
              onChangeText={setTaskDescription}
            />

            <View style={uiStyles.formFieldRow}>
              <Text style={uiStyles.formSectionLabel}>Data limite:</Text>
              {Platform.OS === 'web' ? (
                // @ts-ignore
                <input
                  type="date"
                  value={limitDate ? limitDate.toISOString().split('T')[0] : ''}
                  onChange={(e: any) => {
                    const htmlInputValue = e.target.value;
                    if (htmlInputValue) {
                      const datePieces = htmlInputValue.split('-');
                      setLimitDate(new Date(parseInt(datePieces[0]), parseInt(datePieces[1]) - 1, parseInt(datePieces[2])));
                    } else {
                      setLimitDate(null);
                    }
                  }}
                  style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', flex: 1, marginLeft: 16 }}
                />
              ) : (
                <View style={{ flex: 1, marginLeft: 16, alignItems: 'flex-start' }}>
                  <TouchableOpacity onPress={() => setIsCalendarVisible(true)} style={uiStyles.dateTriggerBtn}>
                    <Text>{limitDate ? limitDate.toLocaleDateString() : 'Selecionar Data'}</Text>
                  </TouchableOpacity>
                  {isCalendarVisible && (
                    <DateTimePicker
                      value={limitDate || new Date()}
                      mode="date"
                      display="default"
                      onChange={handleDateSelection}
                    />
                  )}
                </View>
              )}
            </View>

            <View style={uiStyles.formFieldRow}>
              <Text style={uiStyles.formSectionLabel}>Concluída:</Text>
              <View style={uiStyles.checkboxWrapper}>
                <Checkbox value={isCompleted} onValueChange={setIsCompleted} color={isCompleted ? '#000' : undefined} />
              </View>
            </View>

            <View style={uiStyles.formFieldRow}>
              <Text style={uiStyles.formSectionLabel}>Prioridade:</Text>
              <View style={uiStyles.priorityGroupWrapper}>
                {PRIORITY_LEVELS.map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      uiStyles.levelOptionBtn,
                      currentPriority === level && {
                        backgroundColor: level === 'Baixa' ? '#4caf50' : level === 'Média' ? '#ff9800' : '#f44336',
                        borderColor:     level === 'Baixa' ? '#4caf50' : level === 'Média' ? '#ff9800' : '#f44336',
                      },
                    ]}
                    onPress={() => setCurrentPriority(level)}
                  >
                    <Text style={[uiStyles.levelOptionText, currentPriority === level && uiStyles.levelOptionTextActive]}>{level}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={uiStyles.dialogActionRow}>
              <TouchableOpacity style={uiStyles.dialogDismissBtn} onPress={clearFormFields}>
                <Text style={uiStyles.dialogDismissLabel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[uiStyles.dialogSubmitBtn, !taskDescription.trim() && uiStyles.dialogSubmitBtnDisabled]}
                onPress={handleCommitTask}
                disabled={!taskDescription.trim()}
              >
                <Text style={uiStyles.dialogSubmitLabel}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={isAboutOpen} animationType="slide" onRequestClose={() => setIsAboutOpen(false)}>
        <AboutScreen onClose={() => setIsAboutOpen(false)} />
      </Modal>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const uiStyles = StyleSheet.create({
  wrapperView: {
    flex: 1,
    backgroundColor: globalStyles.backgroundColor,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  mainBox: { flex: 1, maxWidth: 600, width: '100%', alignSelf: 'center', paddingHorizontal: 16 },
  topHeaderBox: { alignItems: 'center', marginTop: 16 },
  imgBanner: { width: 60, height: 60, marginBottom: 8 },
  textTitle: { textAlign: 'center', fontSize: 24, fontWeight: 'bold' },
  badgeCounterBox: { marginTop: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  labelCounter: { fontSize: globalStyles.bodyFontSize, color: '#666' },
  tabFilterBox: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 12 },
  tabBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1 },
  tabBtnSelected: { backgroundColor: '#000', borderColor: '#000' },
  tabBtnIdle: { backgroundColor: 'transparent', borderColor: '#000' },
  tabTextSelected: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  tabTextIdle: { color: '#000', fontSize: 14 },
  controlRowBox: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 16 },
  infoBtnBox: { marginTop: 16, alignItems: 'center' },
  actionBtn: {
    paddingVertical: 14, paddingHorizontal: 20, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center',
    elevation: 3, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, flex: 1,
  },
  actionBtnLabel: { color: '#fff', fontWeight: 'bold', fontSize: 14, letterSpacing: 0.5 },
  btnCreate: { backgroundColor: globalStyles.primaryColor, shadowColor: globalStyles.primaryColor },
  btnCreatePressed: { backgroundColor: '#333', transform: [{ scale: 0.98 }], elevation: 1, shadowOpacity: 0.1 },
  btnClear: { backgroundColor: '#ff4d4d', shadowColor: '#ff0000' },
  btnClearPressed: { backgroundColor: '#d9363e', transform: [{ scale: 0.98 }], elevation: 1, shadowOpacity: 0.1 },
  loadingSpinnerBox: {
    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 10,
  },
  backdropLayer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  dialogCard: {
    width: '90%', maxWidth: 400, backgroundColor: '#fff', borderRadius: 8, padding: 24,
    elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4,
  },
  dialogHeaderTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  dialogTextField: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, paddingVertical: 10, paddingHorizontal: 12, fontSize: 16, marginBottom: 16 },
  formFieldRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  formSectionLabel: { fontSize: 16, fontWeight: 'bold' },
  checkboxWrapper: { marginLeft: 16 },
  priorityGroupWrapper: { flexDirection: 'row', flex: 1, marginLeft: 16, gap: 8, flexWrap: 'wrap' },
  levelOptionBtn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 4, borderWidth: 1, borderColor: '#ccc' },
  levelOptionText: { color: '#333' },
  levelOptionTextActive: { color: '#fff', fontWeight: 'bold' },
  dateTriggerBtn: { borderWidth: 1, borderColor: '#ccc', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 4 },
  dialogActionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8 },
  dialogDismissBtn: { paddingVertical: 10, paddingHorizontal: 16 },
  dialogDismissLabel: { color: '#666', fontSize: 16, fontWeight: 'bold' },
  dialogSubmitBtn: { backgroundColor: '#000', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 4 },
  dialogSubmitBtnDisabled: { backgroundColor: '#ccc' },
  dialogSubmitLabel: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});