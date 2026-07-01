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
import LoginScreen from "./screens/LoginScreen";
import GestionCompteScreen from "./screens/GestionCompteScreen";
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import api, { loadAuthToken } from './api/client';
import * as KeepAwake from 'expo-keep-awake';
import { PREFS, lirePref } from './preferences';

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
  // position/largeur mesurées de chaque onglet → la capsule glisse vers l'onglet actif
  const [layouts, setLayouts] = useState({}); // { [index]: { x, width } }
  const tx = useSharedValue(0);
  const w = useSharedValue(0);

  const active = layouts[state.index];

  useEffect(() => {
    if (!active) return;
    if (w.value === 0) {
      // première mesure : on place la capsule sans animation
      tx.value = active.x;
      w.value = active.width;
    } else {
      tx.value = withTiming(active.x, { duration: 260 });
      w.value = withTiming(active.width, { duration: 260 });
    }
  }, [state.index, active?.x, active?.width]);

  const styleCapsule = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }],
    width: w.value,
  }));

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
          overflow: 'hidden',
          paddingHorizontal: 8,
          paddingVertical: 8,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: 'rgba(68,214,44,0.35)',
          boxShadow: '0px 10px 26px rgba(0,0,0,0.6), 0px 0px 8px rgba(68,214,44,0.22)',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
          {/* capsule verte qui glisse vers l'onglet actif */}
          <Animated.View
            pointerEvents="none"
            style={[
              {
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                borderRadius: 999,
                backgroundColor: 'rgba(68,214,44,0.14)',
                borderWidth: 1,
                borderColor: 'rgba(68,214,44,0.6)',
                boxShadow: '0px 0px 6px rgba(68,214,44,0.5)',
              },
              styleCapsule,
            ]}
          />
          {state.routes.map((route, index) => {
            const focused = state.index === index;
            const onPress = () => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
            };
            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                onLayout={(e) => {
                  const { x, width } = e.nativeEvent.layout;
                  setLayouts((prev) => {
                    const a = prev[index];
                    if (a && a.x === x && a.width === width) return prev;
                    return { ...prev, [index]: { x, width } };
                  });
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  paddingVertical: 9,
                  paddingHorizontal: focused ? 16 : 14,
                }}
              >
                <Ionicons name={ICONES_ONGLETS[route.name]} size={22} color={focused ? '#44D62C' : '#8E8E93'} />
                {focused && (
                  <Text style={{ color: '#44D62C', fontWeight: '600', fontSize: 13 }}>{route.name}</Text>
                )}
              </Pressable>
            );
          })}
        </View>
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

// décide quels écrans existent selon que l'utilisateur est connecté ou non
function Navigation() {
  // si le profil se charge → connecté ; si la requête échoue (401) → déconnecté
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('account/profile').then((res) => res.data.data),
    retry: false,
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-muted">Chargement...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {profile ? (
          // CONNECTÉ : toute l'application est accessible
          <>
            <Stack.Screen name="Onglets" component={Onglets} />
            <Stack.Screen name="Workout" component={WorkoutScreen} />
            <Stack.Screen name="Data" component={DataScreen} />
            <Stack.Screen name="Timer_serie" component={TimerScreen_Serie} />
            <Stack.Screen name="Timer_exercise" component={TimerScreen_exercise} />
            <Stack.Screen name="Summary" component={SummaryScreen} />
            <Stack.Screen name="GestionCompte" component={GestionCompteScreen} />
          </>
        ) : (
          // DÉCONNECTÉ : uniquement l'écran de connexion
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// garde l'écran allumé selon la préférence (activé par défaut)
function GestionKeepAwake() {
  const { data: actif } = useQuery({
    queryKey: ['keepAwake'],
    queryFn: async () => (await lirePref(PREFS.keepAwake, 'true')) === 'true',
  });
  useEffect(() => {
    if (actif === undefined) return;
    if (actif) KeepAwake.activateKeepAwakeAsync('app');
    else KeepAwake.deactivateKeepAwake('app');
  }, [actif]);
  return null;
}

export default function App() {
  const [pret, setPret] = useState(false); // a-t-on fini de lire le coffre ?

  // au démarrage : on relit le token du coffre et on le rebranche, UNE fois
  useEffect(() => {
    loadAuthToken().then(() => setPret(true));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GestionKeepAwake />
        {/* tant que le coffre n'est pas lu, on attend (sinon la requête profil part sans token) */}
        {pret ? (
          <Navigation />
        ) : (
          <View className="flex-1 items-center justify-center bg-background">
            <Text className="text-muted">Chargement...</Text>
          </View>
        )}
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
