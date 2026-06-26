import { View, Text, Pressable, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { PREFS, lirePref, versKg, fmtPoids } from '../preferences';
import Feedback from '../components/Feedback';

const inputStyle = { borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' };

export default function DataScreen({ route, navigation }) {
    const { sessionId, exerciceId, seance, index } = route.params;   // reçus depuis WorkoutScreen
    const couleur = seance?.couleur ?? '#44D62C';

    const [reps, setReps] = useState('');
    const [poids, setPoids] = useState('');
    const [msg, setMsg] = useState(null);

    // unité de poids choisie (kg par défaut)
    const { data: unite } = useQuery({
        queryKey: ['weightUnit'],
        queryFn: () => lirePref(PREFS.weightUnit, 'kg'),
    });

    // dernière performance faite sur cet exo (toutes séances confondues)
    const { data: lastPerf } = useQuery({
        queryKey: ['lastPerf', exerciceId],
        queryFn: () => api.get(`/exercises/${exerciceId}/last-performance`).then((res) => res.data),
        enabled: !!exerciceId,
    });

    // on N'enregistre PAS ici : on passe reps+poids au timer, qui enregistrera
    // avec le vrai temps de repos au moment où l'utilisateur clique « Continuer »
    function lancerRepos() {
        setMsg(null);
        const nbReps = Number(reps);
        const nbPoids = Number(poids);
        // on refuse les valeurs vides ou non numériques (sinon on enregistre du NaN en base)
        if (!reps || !Number.isFinite(nbReps) || nbReps <= 0) {
            return setMsg({ type: 'err', text: 'Entre un nombre de répétitions valide.' });
        }
        if (poids === '' || !Number.isFinite(nbPoids) || nbPoids < 0) {
            return setMsg({ type: 'err', text: 'Entre un poids valide (0 autorisé pour le poids du corps).' });
        }
        navigation.navigate('Timer_serie', {
            seance,
            sessionId,
            exerciceId,
            index,
            reps: nbReps,
            weight: versKg(unite, poids),   // saisi dans l'unité choisie → stocké en kg
        });
    }

    return (
        <LinearGradient colors={['#2b2b2b', '#1d1d1d', '#000000']} style={{ flex: 1 }}>
            <View className="flex-1 px-6 pt-14">
                {/* retour */}
                <Pressable onPress={() => navigation.goBack()} className="w-10 h-10 rounded-full items-center justify-center mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                    <MaterialCommunityIcons name="chevron-left" size={26} color="#FAFAFA" />
                </Pressable>

                <Text className="text-foreground text-3xl font-bold mb-1">Nouvelle série</Text>
                <Text className="text-muted mb-6">Renseigne ta performance</Text>

                {/* dernière performance */}
                <View className="rounded-2xl p-4 mb-8 flex-row items-center" style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
                    <MaterialCommunityIcons name="history" size={26} color={couleur} />
                    <View className="ml-3">
                        {lastPerf ? (
                            <>
                                <Text className="text-muted text-xs">Dernière performance</Text>
                                <Text className="text-foreground font-semibold text-base">{lastPerf.reps} reps × {fmtPoids(unite, lastPerf.weight)} · repos {lastPerf.restTime}s</Text>
                            </>
                        ) : (
                            <Text className="text-muted">Première fois sur cet exo 💪</Text>
                        )}
                    </View>
                </View>

                {/* champs */}
                <Text className="text-muted text-sm mb-2">Répétitions</Text>
                <TextInput value={reps} onChangeText={setReps} placeholder='ex. 8' placeholderTextColor='#8E8E93' keyboardType='numeric' style={inputStyle} className='bg-card text-foreground rounded-xl px-4 py-3 mb-4' />

                <Text className="text-muted text-sm mb-2">Poids ({unite ?? 'kg'})</Text>
                <TextInput value={poids} onChangeText={setPoids} placeholder='ex. 50' placeholderTextColor='#8E8E93' keyboardType='numeric' style={inputStyle} className='bg-card text-foreground rounded-xl px-4 py-3 mb-4' />

                <Feedback msg={msg} />

                <Pressable onPress={lancerRepos}>
                    <LinearGradient
                        colors={['#1E1E20', '#0D0D0E']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        className="rounded-2xl py-4 flex-row items-center justify-center border"
                        style={{ borderColor: `${couleur}99`, boxShadow: `0px 5px 14px rgba(0,0,0,0.5), 0px 0px 5px ${couleur}66` }}
                    >
                        <MaterialCommunityIcons name="timer-outline" size={22} color={couleur} />
                        <Text className="font-bold text-base ml-2" style={{ color: couleur }}>Valider & temps de repos</Text>
                    </LinearGradient>
                </Pressable>
            </View>
        </LinearGradient>
    );
}
