import { View, Text, Dimensions, Pressable } from 'react-native';
import {Calendar , CalendarList} from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';


const largeurEcran = Dimensions.get('window').width;
// sur le web la fenêtre est très large → on plafonne à 380px
const largeurCalendrier = Math.min(largeurEcran, 380);
const theme_calendrier = {
    // --- couleurs générales ---
    calendarBackground: 'transparent', // laisse passer le dégradé derrière
    monthTextColor: '#FFFFFF',         // titre du mois en blanc
    textSectionTitleColor: '#FFFFFF',  // initiales L M M J... en blanc
    arrowColor: '#FFFFFF',             // flèches en blanc
    todayTextColor: '#44D62C',         // aujourd'hui en vert
    textDisabledColor: '#aaaaaa',      // jours du mois voisin (gris sombre)
  }

// une case du calendrier, dessinée par nous
function CaseJour({ date, state, planning }) {
  const horsMois = state === 'disabled';
  const jsJour = new Date(date.year, date.month - 1, date.day).getDay();
  const jourSemaine = jsJour === 0 ? 7 : jsJour;
  const planif = planning?.find((p) => p.dayOfWeek === jourSemaine);
  console.log(date.dateString, 'planif =', planif);
  return (
    <Pressable
      style={({ pressed, hovered }) => {
        const actif = pressed || hovered;   
        return {
          width: 44,
          height: 56,
          padding: 4,
          margin: 2,
          borderRadius: 10,
          alignItems: 'flex-end',     
          justifyContent: 'flex-end', 
          borderWidth: actif ? 2 : 1,
          borderColor: actif ? '#44D62C' : (horsMois ? '#3A3A3A' : '#FFFFFF'),
        };
      }}
    >
      <Text style={{ fontSize: 10, color: horsMois ? '#3A3A3A' : '#FFFFFF' }}>
        {date.day}
      </Text>
    </Pressable>
  );
}

export default function AcceuilScreen() {
  const refCalendrier = useRef(null);
  const [mois, setMois] = useState(new Date());

  const { data: planning } = useQuery({
    queryKey: ['schedules'],
    queryFn: () => api.get('schedules').then((res) => res.data),
  });

  const { data: seances } = useQuery({
    queryKey: ['workouts'],
    queryFn: () => api.get('workouts').then((res) => res.data),
  });

  console.log('planning', planning);
  console.log('seances', seances);

  function changerMois(delta) {
    const nouveau = new Date(mois);
    nouveau.setMonth(nouveau.getMonth() + delta);
    setMois(nouveau);
    refCalendrier.current?.scrollToMonth(nouveau);
  }

  return (
    <LinearGradient
      colors={['#2b2b2b', '#1d1d1d', '#000000']}
      style={{ flex: 1, paddingTop: 48 }}
    >
      <Text className='text-accent text-2xl font-bold text-center mb-4'>Écran Accueil</Text>

      {/* les flèches */}
      <View className="flex-row justify-between items-center px-6 mb-2">
        <Pressable onPress={() => changerMois(-1)}>
          <Ionicons name="chevron-back" size={36} color="#FFFFFF" />
        </Pressable>
        <Pressable onPress={() => changerMois(1)}>
          <Ionicons name="chevron-forward" size={36} color="#FFFFFF" />
        </Pressable>
      </View>

      <View style={{ height: 460, width: largeurCalendrier, alignSelf: 'center' }}>
        <CalendarList
          ref={refCalendrier}
          horizontal
          pagingEnabled
          animateScroll
          hideExtraDays={false}
          calendarWidth={largeurCalendrier}
          theme={theme_calendrier}
          dayComponent={(props) => <CaseJour {...props} planning={planning} />}
        />
      </View>
    </LinearGradient>
  );
}
