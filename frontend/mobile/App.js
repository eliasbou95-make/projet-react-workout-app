import "./global.css"
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AcceuilScreen from './screens/AcceuilScreen';
import SeancesScreen from './screens/SeancesScreen';
import CompteScreen from './screens/CompteScreen';
import ReglagesScreen from './screens/ReglagesScreen';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { View, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';

const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

const LARGEUR = Dimensions.get('window').width;

// fond "verre vert" de la barre du bas : flou + voile vert translucide
function FondTabBar() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <BlurView tint="dark" intensity={40} style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(68,214,44,0.10)' }]} />
    </View>
  );
}

// fond du header : flou + une vague verte brillante (dégradé) en bas
function FondHeader() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <BlurView tint="dark" intensity={30} style={StyleSheet.absoluteFill} />
      <Svg width={LARGEUR} height={120} style={StyleSheet.absoluteFill}>
        <Defs>
          <SvgGradient id="vague" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#44D62C" stopOpacity="0.55" />
            <Stop offset="1" stopColor="#44D62C" stopOpacity="0.12" />
          </SvgGradient>
        </Defs>
        <Path
          d={`M0,0 H${LARGEUR} V72 C${LARGEUR * 0.66},112 ${LARGEUR * 0.33},36 0,72 Z`}
          fill="url(#vague)"
        />
      </Svg>
    </View>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <GestureHandlerRootView style={{ flex:1 }}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#44D62C',
            tabBarInactiveTintColor: '#8E8E93',
            tabBarStyle: {
              position: 'absolute',                      // flotte au-dessus du contenu (pour voir le flou)
              backgroundColor: 'transparent',
              borderTopColor: 'rgba(68,214,44,0.35)',     // liseré vert
              elevation: 0,
            },
            tabBarBackground: () => <FondTabBar />,
            headerTransparent: true,                       // le header flotte → la vague peut déborder
            headerBackground: () => <FondHeader />,
            headerTintColor: '#FAFAFA',
          }}
        >
          <Tab.Screen name="Compte" component={CompteScreen}  options={{tabBarIcon: ({color, size}) => (
            <Ionicons name="person" color={color} size={size}/>
          )}} />
          <Tab.Screen name="Séances" component={SeancesScreen}  options={{tabBarIcon: ({color, size}) => (
            <Ionicons name="barbell" color={color} size={size}/>
          )}}/>
          <Tab.Screen name="Accueil" component={AcceuilScreen} options={{tabBarIcon: ({color, size}) => (
            <Ionicons name="home" color={color} size={size}/>
          )}} />
          <Tab.Screen name="Réglages" component={ReglagesScreen} options={{tabBarIcon: ({color, size}) => (
            <Ionicons name="settings" color={color} size={size}/>
          )}} />
        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
