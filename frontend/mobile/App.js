import "./global.css"
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AcceuilScreen from './screens/AcceuilScreen';
import SeancesScreen from './screens/SeancesScreen';
import HistoriqueScreen from './screens/HistoriqueScreen';
import CompteScreen from './screens/CompteScreen';
import ReglagesScreen from './screens/ReglagesScreen';
import WorkoutScreen from './screens/WorkoutScreen';
import DataScreen from "./screens/DataScreen";
import TimerScreen_Serie from "./screens/TimerScreen_Serie";
import TimerScreen_exercise from "./screens/TimerScreen_exercise";
import SummaryScreen from "./screens/SummaryScreen";
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { loadAuthToken } from './api/client';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

// icône Ionicons par onglet
const ICONES_ONGLETS = {
  Compte: 'person',
  'Séances': 'barbell',
  Historique: 'time',
  Accueil: 'home',
  'Réglages': 'settings',
};

// barre flottante personnalisée : pilule sombre détachée du bas,
// l'onglet actif s'ouvre en pastille verte lumineuse avec son label
function BarreFlottante({ state, navigation }) {
  return (
    <View
      pointerEvents="box-none"
      style={{ position: 'absolute', left: 0, right: 0, bottom: 24, alignItems: 'center' }}
    >
      <LinearGradient
        colors={['#1E1E20', '#0D0D0E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 8,
          paddingVertical: 8,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: 'rgba(68,214,44,0.35)',
          boxShadow: '0px 10px 26px rgba(0,0,0,0.6), 0px 0px 8px rgba(68,214,44,0.22)',
        }}
      >
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
          };
          return (
            <Pressable key={route.key} onPress={onPress} style={{ alignItems: 'center', justifyContent: 'center' }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  paddingVertical: 9,
                  paddingHorizontal: focused ? 16 : 14,
                  borderRadius: 999,
                  backgroundColor: focused ? 'rgba(68,214,44,0.14)' : 'transparent',
                  borderWidth: focused ? 1 : 0,
                  borderColor: focused ? 'rgba(68,214,44,0.6)' : 'transparent',
                  ...(focused && { boxShadow: '0px 0px 6px rgba(68,214,44,0.5)' }),
                }}
              >
                <Ionicons name={ICONES_ONGLETS[route.name]} size={22} color={focused ? '#44D62C' : '#8E8E93'} />
                {focused && (
                  <Text style={{ color: '#44D62C', fontWeight: '600', fontSize: 13 }}>{route.name}</Text>
                )}
              </View>
            </Pressable>
          );
        })}
      </LinearGradient>
    </View>
  );
}

// les 4 onglets du bas (ton appli habituelle)
function Onglets() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BarreFlottante {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Compte" component={CompteScreen} />
      <Tab.Screen name="Séances" component={SeancesScreen} />
      <Tab.Screen name="Historique" component={HistoriqueScreen} />
      <Tab.Screen name="Accueil" component={AcceuilScreen} />
      <Tab.Screen name="Réglages" component={ReglagesScreen} />
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
          <Stack.Screen name="Timer_exercise" component={TimerScreen_exercise} />
          <Stack.Screen name="Summary" component={SummaryScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
