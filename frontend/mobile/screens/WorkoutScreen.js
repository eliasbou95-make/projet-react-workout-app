import { View, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../api/client';

export default function WorkoutScreen({ route, navigation }) {
  const { seance } = route.params;   // la séance reçue depuis l'Accueil

  // on charge les exercices de CE workout
  const { data: exercices, isLoading } = useQuery({
    queryKey: ['exercises', seance.id],
    queryFn: () => api.get(`/workouts/${seance.id}/exercises`).then((res) => res.data),
  });

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <MaterialCommunityIcons name={seance.icon ?? 'dumbbell'} size={80} color="#44D62C" />
      <Text className="text-foreground text-2xl font-bold mt-4">{seance.name}</Text>
      <Text className="text-muted mt-2">
        {isLoading ? 'Chargement...' : `${exercices?.length ?? 0} exercice(s)`}
      </Text>
    </View>
  );
}
