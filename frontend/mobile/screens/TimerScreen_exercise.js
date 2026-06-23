import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';

export default function TimerScreen({ route, navigation }) {
  const { seance, sessionId, exerciceId, index, reps, weight } = route.params ?? {};
  const couleur = seance?.couleur ?? '#44D62C';
  const [secondes, setSecondes] = useState(0);
  const queryClient = useQueryClient();

  useEffect(() => {
    const id = setInterval(() => {
      setSecondes((s) => s + 1);
    }, 1000);

    return () => clearInterval(id);
  }, []);

  const minutes = String(Math.floor(secondes / 60)).padStart(2, '0');
  const sec = String(secondes % 60).padStart(2, '0');

  // enregistre la série avec le VRAI temps de repos (le chrono) puis passe à l'exo suivant
  const mutation_perf = useMutation({
    mutationFn: () => api.post(`/sessions/${sessionId}/performances`, {
      exerciseId: exerciceId,
      reps,
      weight,
      restTime: secondes,
    }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfs', sessionId] });
      navigation.navigate('Workout', { seance, sessionId, index: (index ?? 0) + 1 });
    },
  });

  // si une série a été saisie (paramètre reps présent) → on l'enregistre ;
  // sinon (venu de « Prochain exercice ») → on passe juste à l'exo suivant
  function continuer() {
    if (reps != null) {
      mutation_perf.mutate();
    } else {
      navigation.navigate('Workout', { seance, sessionId, index: (index ?? 0) + 1 });
    }
  }

  return (
    <LinearGradient colors={['#2b2b2b', '#1d1d1d', '#000000']} style={{ flex: 1 }}>
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-32 h-32 rounded-full items-center justify-center mb-8" style={{ backgroundColor: `${couleur}22`, borderWidth: 1, borderColor: `${couleur}88`, boxShadow: `0px 0px 24px ${couleur}55` }}>
          <MaterialCommunityIcons name="timer-sand" size={64} color={couleur} />
        </View>

        <Text className="text-muted uppercase tracking-widest text-xs mb-2">Repos avant le prochain exercice</Text>
        <Text className="text-foreground text-6xl font-bold mb-12">{minutes}:{sec}</Text>

        <Pressable onPress={continuer}>
          <LinearGradient
            colors={['#1E1E20', '#0D0D0E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            className="rounded-2xl py-4 px-12 flex-row items-center justify-center border"
            style={{ borderColor: `${couleur}99`, boxShadow: `0px 5px 14px rgba(0,0,0,0.5), 0px 0px 5px ${couleur}66` }}
          >
            <MaterialCommunityIcons name="arrow-right" size={22} color={couleur} />
            <Text className="font-bold text-base ml-2" style={{ color: couleur }}>Prochain exercice</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </LinearGradient>
  );
}
