import "./global.css"
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AcceuilScreen from './screens/AcceuilScreen';
import SeancesScreen from './screens/SeancesScreen';
import CompteScreen from './screens/CompteScreen';
import ReglagesScreen from './screens/ReglagesScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Accueil" component={AcceuilScreen} />
        <Tab.Screen name="Séances" component={SeancesScreen} />
        <Tab.Screen name="Compte" component={CompteScreen} />
        <Tab.Screen name="Réglages" component={ReglagesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
