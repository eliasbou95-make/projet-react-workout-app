import "./global.css"
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AcceuilScreen from './screens/AcceuilScreen';
import SeancesScreen from './screens/SeancesScreen';
import CompteScreen from './screens/CompteScreen';
import ReglagesScreen from './screens/ReglagesScreen';
import WorkoutScreen from './screens/WorkoutScreen';
import DataScreen from "./screens/DataScreen";
import DataScreen2 from "./screens/DataScreen2";
import TimerScreen_Serie from "./screens/TimerScreen_Serie";
import TimerScreen_exercise from "./screens/TimerScreen_exercise";
import SummaryScreen from "./screens/SummaryScreen";
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { loadAuthToken } from './api/client';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

// les 4 onglets du bas (ton appli habituelle)
function Onglets() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#44D62C',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: { backgroundColor: '#0A0A0A', borderTopColor: '#44D62C' },
        headerStyle: { backgroundColor: '#0A0A0A' },
        headerTintColor: '#FAFAFA',
      }}
    >
      <Tab.Screen name="Compte" component={CompteScreen} options={{tabBarIcon: ({color, size}) => (
        <Ionicons name="person" color={color} size={size}/>
      )}} />
      <Tab.Screen name="Séances" component={SeancesScreen} options={{tabBarIcon: ({color, size}) => (
        <Ionicons name="barbell" color={color} size={size}/>
      )}}/>
      <Tab.Screen name="Accueil" component={AcceuilScreen} options={{tabBarIcon: ({color, size}) => (
        <Ionicons name="home" color={color} size={size}/>
      )}} />
      <Tab.Screen name="Réglages" component={ReglagesScreen} options={{tabBarIcon: ({color, size}) => (
        <Ionicons name="settings" color={color} size={size}/>
      )}} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [pret, setPret] = useState(false); // a-t-on fini de lire le coffre ?

  // au démarrage : on relit le token du coffre et on le rebranche, UNE fois
  useEffect(() => {
    loadAuthToken().then(() => setPret(true));
  }, []);

  // tant que le coffre n'est pas lu, on n'affiche pas l'app (sinon requêtes sans token)
  if (!pret) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-muted">Chargement...</Text>
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Onglets" component={Onglets} />
          <Stack.Screen name="Workout" component={WorkoutScreen} />
          <Stack.Screen name="Data" component={DataScreen} />
          <Stack.Screen name="Timer_serie" component={TimerScreen_Serie} />
          <Stack.Screen name="Data2" component={DataScreen2} />
          <Stack.Screen name="Timer_exercise" component={TimerScreen_exercise} />
          <Stack.Screen name="Summary" component={SummaryScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
