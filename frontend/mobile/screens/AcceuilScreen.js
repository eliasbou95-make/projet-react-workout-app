import { View, Text, Dimensions, Pressable, Modal } from 'react-native';
import {Calendar , CalendarList} from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../api/client';
import { useNavigation } from '@react-navigation/native';


const largeurEcran = Dimensions.get('window').width;
// sur le web la fenêtre est très large → on plafonne à 380px
const largeurCalendrier = Math.min(largeurEcran, 420);
const theme_calendrier = {
    calendarBackground: 'transparent',
    textSectionTitleColor: '#8E8E93',     // libellés des jours (Lun, Mar…) en gris discret
    textDayHeaderFontWeight: '600',
    todayTextColor: '#44D62C',
    textDisabledColor: '#3A3A3A',
  }

function CaseJour({ date, state, planning, seances, onOuvrir }) {
  const horsMois = state === 'disabled';
  const aujourdhui = state === 'today';
  const jsJour = new Date(date.year, date.month - 1, date.day).getDay();
  const jourSemaine = jsJour === 0 ? 7 : jsJour;
  const planif = planning?.find((p) => p.dayOfWeek === jourSemaine);
  const seance = planif ? seances?.find((s) => s.id === planif.workoutId) : null;
  const couleurWorkout = seance?.couleur ?? '#44D62C';

  return (
    <Pressable
      onPress={() => seance && onOuvrir(seance)}
      style={({ pressed, hovered }) => {
        const actif = pressed || hovered;
        return {
          width: 46,
          height: 64,
          margin: 6,
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
          // léger fond coloré sur les jours avec workout ; highlight au survol
          backgroundColor: actif
            ? 'rgba(255,255,255,0.08)'
            : (seance && !horsMois ? `${couleurWorkout}1A` : 'transparent'),
          // aujourd'hui : anneau coloré
          ...(aujourdhui && {
            borderWidth: 2,
            borderColor: seance ? couleurWorkout : '#44D62C',
          }),
          // aujourd'hui + workout : grossit + halo
          ...(aujourdhui && seance && {
            transform: [{ scale: 1.1 }],
            boxShadow: `0px 0px 10px ${couleurWorkout}`,
          }),
        };
      }}
    >
      {seance && !horsMois ? (
        <>
          {seance.icon ? (
            <MaterialCommunityIcons name={seance.icon} size={30} color={couleurWorkout} />
          ) : (
            <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: couleurWorkout }} />
          )}
          <Text style={{ fontSize: 12, fontWeight: '600', marginTop: 2, color: aujourdhui ? '#FFFFFF' : '#D4D4D4' }}>
            {date.day}
          </Text>
        </>
      ) : (
        <Text
          style={{
            fontSize: 16,
            fontWeight: aujourdhui ? 'bold' : '500',
            color: horsMois ? '#3A3A3A' : (aujourdhui ? '#44D62C' : '#FFFFFF'),
          }}
        >
          {date.day}
        </Text>
      )}
    </Pressable>
  );
}

export default function AcceuilScreen() {
  const refCalendrier = useRef(null);
  const [mois, setMois] = useState(new Date());
  const [seanceOuverte , setSeanceOuverte] = useState(null  )
  const navigation = useNavigation();

  const { data: planning } = useQuery({
    queryKey: ['schedules'],
    queryFn: () => api.get('schedules').then((res) => res.data),
  });

  const { data: seances } = useQuery({
    queryKey: ['workouts'],
    queryFn: () => api.get('workouts').then((res) => res.data),
  });

  // crée la session UNE fois, puis lance WorkoutScreen avec son id
  const mutation_session = useMutation({
    mutationFn: (workoutId) => api.post(`/workouts/${workoutId}/sessions`).then((res) => res.data),
    onSuccess: (session) => {
      navigation.navigate('Workout', { seance: seanceOuverte, sessionId: session.id, index: 0 });
      setSeanceOuverte(null);
    },
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

      
      <Text className="text-foreground text-3xl font-bold text-center mb-1">Accueil</Text>
      <Text className="text-muted text-center mb-4">Ton planning d'entraînement</Text>

      {/* navigation : flèches + mois courant */}
      <View
        className="flex-row justify-between items-center mb-3"
        style={{ width: largeurCalendrier, alignSelf: 'center', paddingHorizontal: 12 }}
      >
        <Pressable
          onPress={() => changerMois(-1)}
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
        >
          <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
        </Pressable>
        <Text className="text-foreground text-lg font-semibold" style={{ textTransform: 'capitalize' }}>
          {mois.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </Text>
        <Pressable
          onPress={() => changerMois(1)}
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
        >
          <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
        </Pressable>
      </View>

      <View style={{ height: 640, width: largeurCalendrier, alignSelf: 'center' }}>
        <CalendarList
          ref={refCalendrier}
          horizontal
          pagingEnabled
          animateScroll
          hideExtraDays={false}
          hideArrows
          renderHeader={() => null}
          calendarWidth={largeurCalendrier}
          theme={theme_calendrier}
          onVisibleMonthsChange={(months) => {
            if (months?.[0]) setMois(new Date(months[0].dateString));
          }}
          dayComponent={(props) => <CaseJour {...props} planning={planning} seances={seances} onOuvrir={setSeanceOuverte} />}
        />
      </View>

      <Modal visible={!!seanceOuverte} transparent animationType="fade">
        <Pressable
          onPress={() => setSeanceOuverte(null)}
          className="flex-1 items-center justify-center px-8"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
        >
          {/* on stoppe la propagation : cliquer la carte ne ferme pas le Modal */}
          <Pressable
            onPress={(e) => e.stopPropagation?.()}
            className="bg-card rounded-3xl px-7 py-8 items-center w-full"
            style={{
              borderWidth: 1,
              borderColor: seanceOuverte?.couleur ?? '#44D62C',
              boxShadow: `0px 0px 28px ${seanceOuverte?.couleur ?? '#44D62C'}55`,
            }}
          >
            {/* icône dans un cercle teinté à la couleur du workout */}
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-4"
              style={{
                backgroundColor: `${seanceOuverte?.couleur ?? '#44D62C'}22`,
                borderWidth: 1,
                borderColor: `${seanceOuverte?.couleur ?? '#44D62C'}88`,
              }}
            >
              {seanceOuverte?.icon && (
                <MaterialCommunityIcons
                  name={seanceOuverte.icon}
                  size={44}
                  color={seanceOuverte?.couleur ?? '#44D62C'}
                />
              )}
            </View>

            <Text className="text-muted text-xs uppercase tracking-widest mb-1">Séance du jour</Text>
            <Text className="text-foreground text-2xl font-bold text-center mb-1">{seanceOuverte?.name}</Text>
            <Text className="text-muted text-center mb-7">Prêt à démarrer cette séance ?</Text>

            <Pressable
              className="bg-accent rounded-2xl py-4 w-full flex-row items-center justify-center gap-2"
              onPress={() => mutation_session.mutate(seanceOuverte.id)}
            >
              <MaterialCommunityIcons name="play" size={22} color="#0A0A0A" />
              <Text className="text-background font-bold text-base">Commencer l'entraînement</Text>
            </Pressable>

            <Pressable onPress={() => setSeanceOuverte(null)} className="mt-4 py-1">
              <Text className="text-muted">Annuler</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
}
