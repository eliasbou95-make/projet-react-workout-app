import { View, Text, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';

export default function SummaryScreen({ route, navigation }) {
  const { seance, sessionId } = route.params ?? {};
  const couleur = seance?.couleur ?? '#44D62C';
  const queryClient = useQueryClient();

  // tous les exercices de la séance (pour avoir leurs noms)
  const { data: exercices } = useQuery({
    queryKey: ['exercises', seance?.id],
    queryFn: () => api.get(`/workouts/${seance.id}/exercises`).then((res) => res.data),
    enabled: !!seance,
  });

  // toutes les performances de la session
  const { data: perfs } = useQuery({
    queryKey: ['perfs', sessionId],
    queryFn: () => api.get(`/sessions/${sessionId}/performances`).then((res) => res.data),
    enabled: !!sessionId,
  });

  // marque la séance comme terminée (completedAt) puis retour à l'accueil
  const mutation_finir = useMutation({
    mutationFn: () => api.patch(`/sessions/${sessionId}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      navigation.navigate('Onglets', { screen: 'Accueil' });
    },
  });

  // formate des secondes en mm:ss
  const fmt = (s) => `${String(Math.floor((s ?? 0) / 60)).padStart(2, '0')}:${String((s ?? 0) % 60).padStart(2, '0')}`;

  return (
    <LinearGradient colors={['#2b2b2b', '#1d1d1d', '#000000']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 56, paddingBottom: 40 }}>
        <View className="items-center mb-8">
          <View className="w-20 h-20 rounded-full items-center justify-center mb-4" style={{ backgroundColor: `${couleur}22`, borderWidth: 1, borderColor: `${couleur}88`, boxShadow: `0px 0px 24px ${couleur}55` }}>
            <MaterialCommunityIcons name="trophy" size={44} color={couleur} />
          </View>
          <Text className="text-foreground text-3xl font-bold">Séance terminée 🎉</Text>
          <Text className="text-muted mt-1">{seance?.name}</Text>
        </View>

        {exercices?.map((exo) => {
          const series = perfs?.filter((p) => p.exerciseId === exo.id) ?? [];
          if (series.length === 0) return null;   // on n'affiche que les exos travaillés
          return (
            <View key={exo.id} className="rounded-2xl p-4 mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
              <View className="flex-row items-center mb-3">
                <MaterialCommunityIcons name={seance?.icon ?? 'dumbbell'} size={20} color={couleur} />
                <Text className="text-foreground font-bold text-lg ml-2">{exo.name}</Text>
              </View>
              {series.map((s, i) => (
                <Text key={s.id} className="text-muted mb-1">
                  <Text style={{ color: couleur, fontWeight: '700' }}>Série {i + 1}</Text>  —  {s.reps} reps × {s.weight} kg · repos {fmt(s.restTime)}
                </Text>
              ))}
            </View>
          );
        })}

        <Pressable className="rounded-2xl py-4 mt-4 flex-row items-center justify-center" style={{ backgroundColor: couleur }} onPress={() => mutation_finir.mutate()}>
          <MaterialCommunityIcons name="flag-checkered" size={22} color="#0A0A0A" />
          <Text className="text-background font-bold text-base ml-2">Finir la séance</Text>
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
}
