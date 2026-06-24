import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { setAuthToken } from '../api/client';

export default function CompteScreen() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('account/profile').then((res) => res.data.data),
    retry: false,
  });

  const mutation_logout = useMutation({
    mutationFn: () => api.post('account/logout'),
    onSuccess: () => {
      setAuthToken(null);                          // débranche axios + vide le coffre
      queryClient.setQueryData(['profile'], null); // profil vide → App revient sur l'écran de connexion
    },
  });

  return (
    <LinearGradient colors={['#2b2b2b', '#1d1d1d', '#000000']} style={{ flex: 1 }}>
      <View className="flex-1 items-center justify-center px-6">
        {isLoading ? (
          <>
            <ActivityIndicator size="large" color="#44D62C" />
            <Text className="text-muted mt-4">Chargement...</Text>
          </>
        ) : (
          <>
            <View
              className="w-24 h-24 rounded-full items-center justify-center mb-6"
              style={{ backgroundColor: 'rgba(68,214,44,0.12)', borderWidth: 1, borderColor: 'rgba(68,214,44,0.5)' }}
            >
              <MaterialCommunityIcons name="account" size={52} color="#44D62C" />
            </View>
            <Text className="text-foreground text-2xl font-bold">{data?.fullName ?? 'Mon compte'}</Text>
            <Text className="text-muted mt-1 mb-8">{data?.email}</Text>
            <Pressable
              className="flex-row items-center gap-2 rounded-full py-3 px-10"
              style={{ borderWidth: 1, borderColor: '#ef4444' }}
              onPress={() => mutation_logout.mutate()}
            >
              <MaterialCommunityIcons name="logout" size={20} color="#ef4444" />
              <Text className="text-red-500 font-bold">Déconnexion</Text>
            </Pressable>
          </>
        )}
      </View>
    </LinearGradient>
  );
}
