import { View, Text, Pressable, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import api from '../api/client';
import { PREFS, lirePref, fmtPoids } from '../preferences';

export default function WorkoutScreen({ route, navigation }) {
  const { seance, sessionId, index = 0 } = route.params ?? {};
  const couleur = seance?.couleur ?? '#44D62C';
  const [quitter, setQuitter] = useState(false);

  // unité de poids choisie (kg par défaut)
  const { data: unite } = useQuery({
    queryKey: ['weightUnit'],
    queryFn: () => lirePref(PREFS.weightUnit, 'kg'),
  });

  const { data: exercices, isLoading } = useQuery({
    queryKey: ['exercises', seance?.id],
    queryFn: () => api.get(`/workouts/${seance.id}/exercises`).then((res) => res.data),
    enabled: !!seance,
  });

  // performances déjà enregistrées dans la session en cours
  const { data: perfs } = useQuery({
    queryKey: ['perfs', sessionId],
    queryFn: () => api.get(`/sessions/${sessionId}/performances`).then((res) => res.data),
    enabled: !!sessionId,
  });

  const exoCourant = exercices?.[index];
  const nbSeries = perfs?.filter((p) => p.exerciseId === exoCourant?.id).length ?? 0;
  const total = exercices?.length ?? 0;
  const estDernier = total > 0 && index >= total - 1;   // sommes-nous sur le dernier exo ?

  // dernière performance faite sur l'exo courant (toutes séances confondues)
  const { data: lastPerf } = useQuery({
    queryKey: ['lastPerf', exoCourant?.id],
    queryFn: () => api.get(`/exercises/${exoCourant.id}/last-performance`).then((res) => res.data),
    enabled: !!exoCourant?.id,
  });

  // garde-fou : si on arrive ici sans séance, on n'affiche pas un écran blanc
  if (!seance) {
    return (
      <LinearGradient colors={['#2b2b2b', '#1d1d1d', '#000000']} style={{ flex: 1 }}>
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted">Séance introuvable</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#2b2b2b', '#1d1d1d', '#000000']} style={{ flex: 1 }}>
      <View className="flex-1 px-6 pt-14 pb-10 items-center">
        {/* retour */}
        <Pressable onPress={() => setQuitter(true)} className="absolute left-5 top-12 w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
          <MaterialCommunityIcons name="chevron-left" size={26} color="#FAFAFA" />
        </Pressable>

        {/* en-tête */}
        <Text className="text-muted uppercase tracking-widest text-xs mb-1" style={{ textTransform: 'uppercase' }}>{seance.name}</Text>
        <Text className="text-muted text-sm mb-8">{isLoading ? 'Chargement…' : `Exercice ${index + 1} / ${total}`}</Text>

        {/* icône dans un cercle teinté */}
        <View className="w-28 h-28 rounded-full items-center justify-center mb-6" style={{ backgroundColor: `${couleur}22`, borderWidth: 1, borderColor: `${couleur}88`, boxShadow: `0px 0px 24px ${couleur}55` }}>
          <MaterialCommunityIcons name={seance.icon ?? 'dumbbell'} size={64} color={couleur} />
        </View>

        {/* nom de l'exo courant */}
        <Text className="text-foreground text-3xl font-bold text-center">{exoCourant?.name ?? 'Séance terminée 🎉'}</Text>

        {/* nombre de séries en gros */}
        <View className="items-center mt-5">
          <Text className="font-bold" style={{ color: couleur, fontSize: 64, lineHeight: 68 }}>{nbSeries}</Text>
          <Text className="text-muted -mt-1">série(s) faite(s)</Text>
        </View>

        {/* dernière performance sur cet exo */}
        <View className="flex-row items-center mt-4 px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
          <MaterialCommunityIcons name="history" size={16} color={couleur} />
          <Text className="text-muted ml-2">
            {lastPerf ? `Dernière : ${lastPerf.reps} reps × ${fmtPoids(unite, lastPerf.weight)} · repos ${lastPerf.restTime}s` : 'Première fois sur cet exo 💪'}
          </Text>
        </View>

        <View className="flex-1" />

        {/* boutons */}
        <Pressable
          className="w-full mb-3"
          onPress={() => navigation.navigate('Data', { seance, sessionId, exerciceId: exoCourant?.id, index })}
        >
          <LinearGradient
            colors={['#1E1E20', '#0D0D0E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            className="rounded-2xl py-4 w-full flex-row items-center justify-center border"
            style={{ borderColor: `${couleur}99`, boxShadow: `0px 5px 14px rgba(0,0,0,0.5), 0px 0px 5px ${couleur}66` }}
          >
            <MaterialCommunityIcons name="plus" size={22} color={couleur} />
            <Text className="font-bold text-base ml-2" style={{ color: couleur }}>Nouvelle série</Text>
          </LinearGradient>
        </Pressable>

        {estDernier ? (
          <Pressable className="w-full" onPress={() => navigation.navigate('Summary', { seance, sessionId })}>
            <LinearGradient
              colors={['#1E1E20', '#0D0D0E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              className="rounded-2xl py-4 w-full flex-row items-center justify-center border border-white/15"
              style={{ boxShadow: '0px 5px 14px rgba(0,0,0,0.5)' }}
            >
              <MaterialCommunityIcons name="flag-checkered" size={20} color="#FAFAFA" />
              <Text className="text-foreground font-bold text-base ml-2">Terminer la séance</Text>
            </LinearGradient>
          </Pressable>
        ) : (
          <Pressable className="w-full" onPress={() => navigation.navigate('Timer_exercise', { seance, sessionId, index })}>
            <LinearGradient
              colors={['#1E1E20', '#0D0D0E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              className="rounded-2xl py-4 w-full flex-row items-center justify-center border border-white/15"
              style={{ boxShadow: '0px 5px 14px rgba(0,0,0,0.5)' }}
            >
              <MaterialCommunityIcons name="arrow-right" size={20} color="#FAFAFA" />
              <Text className="text-foreground font-bold text-base ml-2">Prochain exercice</Text>
            </LinearGradient>
          </Pressable>
        )}

        {/* modal de confirmation pour quitter la séance */}
        <Modal visible={quitter} transparent animationType="fade">
          <Pressable onPress={() => setQuitter(false)} className="flex-1 items-center justify-center px-8" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
            <Pressable onPress={(e) => e.stopPropagation?.()} className="bg-card rounded-3xl px-7 py-8 items-center w-full" style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
              <MaterialCommunityIcons name="alert-circle-outline" size={44} color="#ef4444" />
              <Text className="text-foreground text-xl font-bold text-center mt-3 mb-2">Quitter la séance ?</Text>
              <Text className="text-muted text-center mb-7">Es-tu sûr de vouloir quitter la séance en cours ?</Text>

              <Pressable className="w-full mb-3"
                onPress={() => { setQuitter(false); navigation.navigate('Onglets', { screen: 'Accueil' }); }}>
                <LinearGradient
                  colors={['#1E1E20', '#0D0D0E']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  className="rounded-2xl py-4 w-full flex-row items-center justify-center border"
                  style={{ borderColor: '#ef444499', boxShadow: '0px 5px 14px rgba(0,0,0,0.5), 0px 0px 5px rgba(239,68,68,0.5)' }}
                >
                  <MaterialCommunityIcons name="logout" size={20} color="#ef4444" />
                  <Text className="font-bold text-base ml-2" style={{ color: '#ef4444' }}>Oui, quitter</Text>
                </LinearGradient>
              </Pressable>

              <Pressable onPress={() => setQuitter(false)} className="py-1">
                <Text className="text-muted">Annuler</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </LinearGradient>
  );
}
