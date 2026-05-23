import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RootNavigationLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tarefas',
          tabBarIcon: ({ color: iconColor, size: iconSize }) => (
            <Ionicons name="checkbox-outline" color={iconColor} size={iconSize} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Configurações',
          tabBarIcon: ({ color: iconColor, size: iconSize }) => (
            <Ionicons name="settings-outline" color={iconColor} size={iconSize} />
          ),
        }}
      />
      <Tabs.Screen
        name="task/[id]"
        options={{ href: null }}
      />
    </Tabs>
  );
}