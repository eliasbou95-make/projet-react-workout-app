import { View, Text, Dimensions, Pressable, Modal } from 'react-native';
import {Calendar , CalendarList} from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { useNavigation } from '@react-navigation/native';


const largeurEcran = Dimensions.get('window').width;
const largeurCalendrier = Math.min(largeurEcran, 420);
const theme_calendrier = {
    calendarBackground: 'transparent',
    textSectionTitleColor: '#8E8E93',     
    textDayHeaderFontWeight: '600',
    todayTextColor: '#44D62C',
    textDisabledColor: '#3A3A3A',
  }

function jourDeCycle(date, cycle, cycleStartDate, cycleRepeat, cycleEndRest) {
  if (!cycle?.length || !cycleStartDate) return null;
  const [sy, sm, sd] = cycleStartDate.slice(0, 10).split('-').map(Number);
  const debut = Date.UTC(sy, sm - 1, sd);
  const jour = Date.UTC(date.year, date.month - 1, date.day);
  const diff = Math.round((jour - debut) / 86400000);
  if (diff < 0) return null;
  // longueur effective = tes jours + 1 repos de fin (sauf si désactivé). undefined = actif par défaut
  const longueur = cycle.length + (cycleEndRest !== false ? 1 : 0);
  // cycleRepeat = nombre de répétitions (null/absent = infini) → au-delà, plus de cycle
  if (cycleRepeat != null && diff >= cycleRepeat * longueur) return null;
  const index = ((diff % longueur) + longueur) % longueur;
  if (index >= cycle.length) return { workoutId: null };  // emplacement du repos de fin
  return cycle[index];
}

function CaseJour({ date, state, cycle, cycleStartDate, cycleRepeat, cycleEndRest, seances, sessions, aujourdStr, onOuvrir }) {
  const horsMois = state === 'disabled';
  const aujourdhui = state === 'today';
  const jc = jourDeCycle(date, cycle, cycleStartDate, cycleRepeat, cycleEndRest);
  const repos = !!jc && jc.workoutId == null;        
  const seance = jc && jc.workoutId ? seances?.find((s) => s.id === jc.workoutId) : null;
  const couleurWorkout = seance?.couleur ?? '#44D62C';
  const couleurCase = seance ? couleurWorkout : (repos ? '#22d3ee' : null);

  // la session de ce jour pour cette séance (si elle existe)
  const sessionJour = seance
    ? sessions?.find((s) => s.workoutId === seance.id && s.scheduledDate?.slice(0, 10) === date.dateString)
    : null;
  const reset = sessionJour?.status === 'reset';      // jour volontairement remis à zéro
  const fait = !!sessionJour?.completedAt;            // ✓ verte = séance finie
  const passe = date.dateString < aujourdStr;         // jour déjà passé
  // ✗ rouge = séance annulée à la main, OU jour passé avec un workout prévu mais pas fait
  // (un jour 'reset' n'affiche rien : ni croix automatique, ni check)
  const skip = !reset && (sessionJour?.status === 'skipped' || (!!seance && passe && !fait));

  return (
    <Pressable
      onPress={() => seance && onOuvrir(seance, date.dateString)}
      style={({ pressed, hovered }) => {
        const actif = pressed || hovered;
        return {
          width: 46,
          height: 64,
          margin: 6,
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: actif
            ? 'rgba(255,255,255,0.08)'
            : (couleurCase && !horsMois ? `${couleurCase}14` : 'transparent'),
          ...(couleurCase && !horsMois && {
            borderWidth: 1,
            borderColor: `${couleurCase}aa`,
            boxShadow: `0px 0px 3px ${couleurCase}55`,
          }),
          ...(aujourdhui && couleurCase && !horsMois && {
            borderColor: couleurCase,
            boxShadow: `0px 0px 9px ${couleurCase}, 0px 0px 3px ${couleurCase}`,
          }),
          ...(aujourdhui && !couleurCase && {
            borderWidth: 1,
            borderColor: '#44D62C',
          }),
          ...((fait || skip) && !horsMois && {
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.15)',
            boxShadow: 'none',
            backgroundColor: 'rgba(255,255,255,0.04)',
          }),
        };
      }}
    >
      {seance && !horsMois ? (
        <View style={{ alignItems: 'center', opacity: (fait || skip) ? 0.4 : 1 }}>
          {seance.icon ? (
            <MaterialCommunityIcons name={seance.icon} size={30} color={couleurWorkout} />
          ) : (
            <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: couleurWorkout }} />
          )}
          <Text style={{ fontSize: 12, fontWeight: '600', marginTop: 2, color: aujourdhui ? '#FFFFFF' : '#D4D4D4' }}>
            {date.day}
          </Text>
        </View>
      ) : repos && !horsMois ? (
        <View style={{ alignItems: 'center', opacity: fait ? 0.4 : 1 }}>
          <MaterialCommunityIcons name="sleep" size={26} color="#22d3ee" />
          <Text style={{ fontSize: 12, fontWeight: '600', marginTop: 2, color: aujourdhui ? '#FFFFFF' : '#D4D4D4' }}>
            {date.day}
          </Text>
        </View>
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

      {/* badge en haut à droite : vert si séance faite, rouge si skippée */}
      {(fait || skip) && !horsMois && (
        <View
          style={{
            position: 'absolute',
            top: 2,
            right: 2,
            borderRadius: 999,
            backgroundColor: '#0A0A0A',
            boxShadow: `0px 0px 4px ${fait ? 'rgba(68,214,44,0.6)' : 'rgba(239,68,68,0.6)'}`,
          }}
        >
          <MaterialCommunityIcons
            name={fait ? 'check-circle' : 'close-circle'}
            size={16}
            color={fait ? '#44D62C' : '#ef4444'}
          />
        </View>
      )}
    </Pressable>
  );
}

export default function AcceuilScreen() {
  const refCalendrier = useRef(null);
  const [mois, setMois] = useState(new Date());
  const [seanceOuverte , setSeanceOuverte] = useState(null  )
  const [dateOuverte, setDateOuverte] = useState(null);
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  function ouvrirSeance(seance, dateString) {
    setSeanceOuverte(seance);
    setDateOuverte(dateString);
  }

  const { data: cycle } = useQuery({
    queryKey: ['cycle'],
    queryFn: () => api.get('cycle').then((res) => res.data),
  });

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('account/profile').then((res) => res.data.data),
  });

  const { data: seances } = useQuery({
    queryKey: ['workouts'],
    queryFn: () => api.get('workouts').then((res) => res.data),
  });

  const { data: sessions } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => api.get('sessions').then((res) => res.data),
  });

  const mutation_session = useMutation({
    mutationFn: ({ workoutId, scheduledDate }) =>
      api.post(`/workouts/${workoutId}/sessions`, { scheduledDate }).then((res) => res.data),
    onSuccess: (session) => {
      navigation.navigate('Workout', { seance: seanceOuverte, sessionId: session.id, index: 0 });
      setSeanceOuverte(null);
      setDateOuverte(null);
    },
  });

  // ferme le modal + rafraîchit le calendrier (commun aux 3 actions rapides)
  function apresAction() {
    queryClient.invalidateQueries({ queryKey: ['sessions'] });
    setSeanceOuverte(null);
    setDateOuverte(null);
  }

  // skip : marque la séance comme annulée (croix rouge), même à l'avance
  const mutation_skip = useMutation({
    mutationFn: ({ workoutId, scheduledDate }) => api.post(`/workouts/${workoutId}/sessions/skip`, { scheduledDate }),
    onSuccess: apresAction,
  });

  // séance finie sans saisie : check vert + entrée dans l'historique (vide)
  const mutation_complete = useMutation({
    mutationFn: ({ workoutId, scheduledDate }) => api.post(`/workouts/${workoutId}/sessions/complete`, { scheduledDate }),
    onSuccess: apresAction,
  });

  // réinitialiser : supprime la session du jour → ni check, ni croix, ni historique
  const mutation_reset = useMutation({
    mutationFn: ({ workoutId, scheduledDate }) => api.post(`/workouts/${workoutId}/sessions/reset`, { scheduledDate }),
    onSuccess: apresAction,
  });

  console.log('cycle', cycle);
  console.log('seances', seances);

  const maintenant = new Date();
  const aujourdStr = `${maintenant.getFullYear()}-${String(maintenant.getMonth() + 1).padStart(2, '0')}-${String(maintenant.getDate()).padStart(2, '0')}`;

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
          key={`cal-${sessions?.length ?? 0}`}
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
          dayComponent={(props) => <CaseJour {...props} cycle={cycle} cycleStartDate={profile?.cycleStartDate} cycleRepeat={profile?.cycleRepeat} cycleEndRest={profile?.cycleEndRest} seances={seances} sessions={sessions} aujourdStr={aujourdStr} onOuvrir={ouvrirSeance} />}
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
              onPress={() => mutation_session.mutate({ workoutId: seanceOuverte.id, scheduledDate: dateOuverte })}
            >
              <MaterialCommunityIcons name="play" size={22} color="#0A0A0A" />
              <Text className="text-background font-bold text-base">Commencer l'entraînement</Text>
            </Pressable>

            {/* actions rapides : séance finie / skip / réinitialiser */}
            <View className="flex-row w-full gap-2 mt-3">
              <Pressable
                onPress={() => mutation_complete.mutate({ workoutId: seanceOuverte.id, scheduledDate: dateOuverte })}
                className="flex-1 rounded-xl py-3 items-center"
                style={{ borderWidth: 1, borderColor: 'rgba(68,214,44,0.5)', backgroundColor: 'rgba(68,214,44,0.08)' }}
              >
                <MaterialCommunityIcons name="check-bold" size={18} color="#44D62C" />
                <Text className="text-accent text-xs font-semibold mt-1">Séance finie</Text>
              </Pressable>

              <Pressable
                onPress={() => mutation_skip.mutate({ workoutId: seanceOuverte.id, scheduledDate: dateOuverte })}
                className="flex-1 rounded-xl py-3 items-center"
                style={{ borderWidth: 1, borderColor: 'rgba(239,68,68,0.5)', backgroundColor: 'rgba(239,68,68,0.08)' }}
              >
                <MaterialCommunityIcons name="close-circle-outline" size={18} color="#ef4444" />
                <Text className="text-xs font-semibold mt-1" style={{ color: '#ef4444' }}>Skip</Text>
              </Pressable>

              <Pressable
                onPress={() => mutation_reset.mutate({ workoutId: seanceOuverte.id, scheduledDate: dateOuverte })}
                className="flex-1 rounded-xl py-3 items-center"
                style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.04)' }}
              >
                <MaterialCommunityIcons name="restart" size={18} color="#8E8E93" />
                <Text className="text-muted text-xs font-semibold mt-1">Réinitialiser</Text>
              </Pressable>
            </View>

            <Pressable onPress={() => setSeanceOuverte(null)} className="mt-4 py-1">
              <Text className="text-muted">Annuler</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
}
