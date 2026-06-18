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

  const mutation_perf = useMutation({
    mutationFn: () => api.post(`/sessions/${sessionId}/performances`, {
      exerciseId: exerciceId,
      reps,
      weight,
      restTime: secondes,
    }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfs', sessionId] });
      navigation.navigate('Workout', { seance, sessionId, index });
    },
  });

  return (
    <LinearGradient colors={['#2b2b2b', '#1d1d1d', '#000000']} style={{ flex: 1 }}>
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-32 h-32 rounded-full items-center justify-center mb-8" style={{ backgroundColor: `${couleur}22`, borderWidth: 1, borderColor: `${couleur}88`, boxShadow: `0px 0px 24px ${couleur}55` }}>
          <MaterialCommunityIcons name="timer-sand" size={64} color={couleur} />
        </View>

        <Text className="text-muted uppercase tracking-widest text-xs mb-2">Temps de repos</Text>
        <Text className="text-foreground text-6xl font-bold mb-12">{minutes}:{sec}</Text>

        <Pressable
          className="rounded-2xl py-4 px-12 flex-row items-center justify-center"
          style={{ backgroundColor: couleur }}
          onPress={() => mutation_perf.mutate()}
        >
          <MaterialCommunityIcons name="check" size={22} color="#0A0A0A" />
          <Text className="text-background font-bold text-base ml-2">Continuer</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}
