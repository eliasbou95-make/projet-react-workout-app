import "./global.css"
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AcceuilScreen from './screens/AcceuilScreen';
import SeancesScreen from './screens/SeancesScreen';
import CompteScreen from './screens/CompteScreen';
import ReglagesScreen from './screens/ReglagesScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#44D62C',   
          tabBarInactiveTintColor: '#8E8E93',  
          tabBarStyle: { backgroundColor: '#0A0A0A' },   
          headerStyle: { backgroundColor: '#0A0A0A' },   
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
  );
}
