import { View, Text, Pressable, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';

const inputStyle = { borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' };

export default function DataScreen2({ route, navigation }) {
    const { sessionId, exerciceId, seance, index } = route.params;   // reçus depuis WorkoutScreen
    const couleur = seance?.couleur ?? '#44D62C';

    const [reps, setReps] = useState('');
    const [poids, setPoids] = useState('');

    const { data: lastPerf } = useQuery({
        queryKey: ['lastPerf', exerciceId],
        queryFn: () => api.get(`/exercises/${exerciceId}/last-performance`).then((res) => res.data),
        enabled: !!exerciceId,
    });

    // on passe reps+poids au timer, qui enregistrera avec le vrai temps de repos
    function lancerRepos() {
        navigation.navigate('Timer_exercise', {
            seance,
            sessionId,
            exerciceId,
            index,
            reps: Number(reps),
            weight: Number(poids),
        });
    }

    return (
        <LinearGradient colors={['#2b2b2b', '#1d1d1d', '#000000']} style={{ flex: 1 }}>
            <View className="flex-1 px-6 pt-14">
                {/* retour */}
                <Pressable onPress={() => navigation.goBack()} className="w-10 h-10 rounded-full items-center justify-center mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                    <MaterialCommunityIcons name="chevron-left" size={26} color="#FAFAFA" />
                </Pressable>

                <Text className="text-foreground text-3xl font-bold mb-1">Dernière série</Text>
                <Text className="text-muted mb-6">…avant de passer au prochain exercice</Text>

                {/* dernière performance */}
                <View className="rounded-2xl p-4 mb-8 flex-row items-center" style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
                    <MaterialCommunityIcons name="history" size={26} color={couleur} />
                    <View className="ml-3">
                        {lastPerf ? (
                            <>
                                <Text className="text-muted text-xs">Dernière performance</Text>
                                <Text className="text-foreground font-semibold text-base">{lastPerf.reps} reps × {lastPerf.weight} kg · repos {lastPerf.restTime}s</Text>
                            </>
                        ) : (
                            <Text className="text-muted">Première fois sur cet exo 💪</Text>
                        )}
                    </View>
                </View>

                {/* champs */}
                <Text className="text-muted text-sm mb-2">Répétitions</Text>
                <TextInput value={reps} onChangeText={setReps} placeholder='ex. 8' placeholderTextColor='#8E8E93' keyboardType='numeric' style={inputStyle} className='bg-card text-foreground rounded-xl px-4 py-3 mb-4' />

                <Text className="text-muted text-sm mb-2">Poids (kg)</Text>
                <TextInput value={poids} onChangeText={setPoids} placeholder='ex. 50' placeholderTextColor='#8E8E93' keyboardType='numeric' style={inputStyle} className='bg-card text-foreground rounded-xl px-4 py-3 mb-8' />

                <Pressable className="rounded-2xl py-4 flex-row items-center justify-center" style={{ backgroundColor: couleur }} onPress={lancerRepos}>
                    <MaterialCommunityIcons name="arrow-right-circle-outline" size={22} color="#0A0A0A" />
                    <Text className="text-background font-bold text-base ml-2">Valider & exercice suivant</Text>
                </Pressable>
            </View>
        </LinearGradient>
    );
}
