import { View, Text, Pressable, TextInput, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/client';

// affiche un nombre de secondes au format MM:SS (utilisé par le chrono ET le minuteur)
function format(n) {
  const m = String(Math.floor(n / 60)).padStart(2, '0');
  const s = String(n % 60).padStart(2, '0');
  return `${m}:${s}`;
}

// libellé court pour une case de durée (57 -> "57s", 90 -> "1:30", 120 -> "2min")
function labelDuree(v) {
  if (v < 60) return `${v}s`;
  const m = Math.floor(v / 60);
  const s = v % 60;
  return s === 0 ? `${m}min` : `${m}:${String(s).padStart(2, '0')}`;
}

// durées de base toujours proposées (en secondes)
const PRESETS_BASE = [30, 60, 90, 120];

// clé du coffre où l'on range les durées personnalisées de l'utilisateur
const STORAGE_PRESETS = 'timer_presets';
// clé du coffre pour la dernière durée choisie (réglée au prochain démarrage)
const STORAGE_LAST = 'timer_last';

export default function TimerScreen({ route, navigation }) {
  const { seance, sessionId, exerciceId, index, reps, weight } = route.params ?? {};
  const couleur = seance?.couleur ?? '#44D62C';
  const queryClient = useQueryClient();

  // onglet actif : 'chrono' (compte qui monte) ou 'timer' (minuteur qui descend)
  const [mode, setMode] = useState('chrono');

  // --- état du chronomètre ---
  const [secondes, setSecondes] = useState(0);

  // --- état du minuteur ---
  const [duree, setDuree] = useState(60);     // durée choisie
  const [restant, setRestant] = useState(60); // temps restant
  const [actif, setActif] = useState(false);  // le minuteur tourne-t-il ?

  // durées personnalisées créées par l'utilisateur (chargées du coffre)
  const [customPresets, setCustomPresets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // popup de saisie
  const [saisieMin, setSaisieMin] = useState('');          // minutes tapées dans la popup
  const [saisieSec, setSaisieSec] = useState('');          // secondes tapées dans la popup

  // au montage : on relit les durées perso + la dernière durée utilisée
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_PRESETS).then((raw) => {
      if (raw) setCustomPresets(JSON.parse(raw));
    });
    // règle le minuteur sur la dernière durée choisie (sinon 1 min par défaut)
    AsyncStorage.getItem(STORAGE_LAST).then((raw) => {
      const v = parseInt(raw, 10);
      if (v > 0) {
        setDuree(v);
        setRestant(v);
      }
    });
  }, []);

  // chrono : avance d'une seconde, uniquement quand on est sur l'onglet chrono
  useEffect(() => {
    if (mode !== 'chrono') return;
    const id = setInterval(() => {
      setSecondes((s) => s + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [mode]);

  // minuteur : décompte d'une seconde tant qu'il est actif et qu'il reste du temps
  useEffect(() => {
    if (!actif) return;
    if (restant <= 0) {
      setActif(false);
      // TODO : c'est ici qu'on jouera le DIIING (expo-audio) plus tard
      return;
    }
    const id = setInterval(() => {
      setRestant((r) => r - 1);
    }, 1000);
    return () => clearInterval(id);
  }, [actif, restant]);

  // choisit une durée et remet le minuteur à zéro (à l'arrêt), et la mémorise
  function choisirDuree(value) {
    setDuree(value);
    setRestant(value);
    setActif(false);
    if (value > 0) AsyncStorage.setItem(STORAGE_LAST, String(value));
  }

  // ajuste la durée de +/- delta secondes (jamais en dessous de 0)
  function ajuster(delta) {
    const v = Math.max(0, restant + delta);
    setDuree(v);
    setRestant(v);
    setActif(false);
    if (v > 0) AsyncStorage.setItem(STORAGE_LAST, String(v));
  }

  // valide la popup : crée une nouvelle case, l'enregistre dans le coffre, et la sélectionne
  function ajouterPreset() {
    // minutes et secondes -> total en secondes (champ vide = 0)
    const v = (parseInt(saisieMin, 10) || 0) * 60 + (parseInt(saisieSec, 10) || 0);
    if (v <= 0) return;
    // on évite les doublons avec les cases déjà présentes
    if (!PRESETS_BASE.includes(v) && !customPresets.includes(v)) {
      const liste = [...customPresets, v];
      setCustomPresets(liste);
      AsyncStorage.setItem(STORAGE_PRESETS, JSON.stringify(liste));
    }
    choisirDuree(v);
    setSaisieMin('');
    setSaisieSec('');
    setModalVisible(false);
  }

  // supprime une durée perso (appui long sur la case)
  function supprimerPreset(v) {
    const liste = customPresets.filter((x) => x !== v);
    setCustomPresets(liste);
    AsyncStorage.setItem(STORAGE_PRESETS, JSON.stringify(liste));
  }

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

        {/* sélecteur d'onglets : Chronomètre / Minuteur */}
        <View className="flex-row rounded-2xl p-1 mb-12" style={{ backgroundColor: '#18181B', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
          {[
            { key: 'chrono', label: 'Chronomètre', icon: 'timer-outline' },
            { key: 'timer', label: 'Minuteur', icon: 'timer-sand' },
          ].map((onglet) => {
            const isActif = mode === onglet.key;
            return (
              <Pressable
                key={onglet.key}
                onPress={() => setMode(onglet.key)}
                className="flex-row items-center rounded-xl py-2 px-5"
                style={isActif ? { backgroundColor: `${couleur}22`, borderWidth: 1, borderColor: `${couleur}88` } : { borderWidth: 1, borderColor: 'transparent' }}
              >
                <MaterialCommunityIcons name={onglet.icon} size={18} color={isActif ? couleur : '#8E8E93'} />
                <Text className="font-bold text-sm ml-2" style={{ color: isActif ? couleur : '#8E8E93' }}>{onglet.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {mode === 'chrono' ? (
          /* ===== ONGLET CHRONOMÈTRE (comportement d'origine) ===== */
          <>
            <View className="w-32 h-32 rounded-full items-center justify-center mb-8" style={{ backgroundColor: `${couleur}22`, borderWidth: 1, borderColor: `${couleur}88`, boxShadow: `0px 0px 24px ${couleur}55` }}>
              <MaterialCommunityIcons name="timer-outline" size={64} color={couleur} />
            </View>

            <Text className="text-muted uppercase tracking-widest text-xs mb-2">Repos avant le prochain exercice</Text>
            <Text className="text-foreground text-6xl font-bold mb-12">{format(secondes)}</Text>

            <Pressable onPress={continuer}>
              <LinearGradient
                colors={['#1E1E20', '#0D0D0E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                className="rounded-2xl py-4 px-12 flex-row items-center justify-center border"
                style={{ overflow: 'hidden', borderColor: `${couleur}99`, boxShadow: `0px 5px 14px rgba(0,0,0,0.5), 0px 0px 5px ${couleur}66` }}
              >
                <MaterialCommunityIcons name="arrow-right" size={22} color={couleur} />
                <Text className="font-bold text-base ml-2" style={{ color: couleur }}>Prochain exercice</Text>
              </LinearGradient>
            </Pressable>
          </>
        ) : (
          /* ===== ONGLET MINUTEUR (décompte) ===== */
          <>
            <View className="w-32 h-32 rounded-full items-center justify-center mb-8" style={{ backgroundColor: `${couleur}22`, borderWidth: 1, borderColor: `${couleur}88`, boxShadow: `0px 0px 24px ${couleur}55` }}>
              <MaterialCommunityIcons name="timer-sand" size={64} color={couleur} />
            </View>

            <Text className="text-muted uppercase tracking-widest text-xs mb-2">Minuteur</Text>

            {/* − 15s   chiffre   + 15s */}
            <View className="flex-row items-center mb-8">
              <Pressable onPress={() => ajuster(-15)} className="items-center justify-center rounded-2xl w-16 h-16" style={{ backgroundColor: '#18181B', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
                <MaterialCommunityIcons name="minus" size={22} color="#8E8E93" />
                <Text className="text-muted text-xs mt-0.5">15s</Text>
              </Pressable>

              <Text className="text-foreground text-6xl font-bold mx-6">{format(restant)}</Text>

              <Pressable onPress={() => ajuster(15)} className="items-center justify-center rounded-2xl w-16 h-16" style={{ backgroundColor: `${couleur}22`, borderWidth: 1, borderColor: `${couleur}88` }}>
                <MaterialCommunityIcons name="plus" size={22} color={couleur} />
                <Text className="text-xs mt-0.5" style={{ color: couleur }}>15s</Text>
              </Pressable>
            </View>

            {/* présélections + case « + » pour en créer une nouvelle */}
            <View className="flex-row flex-wrap justify-center mb-10" style={{ maxWidth: 320 }}>
              {[...PRESETS_BASE, ...customPresets].map((v) => {
                const isChoisi = duree === v;
                const isCustom = customPresets.includes(v);
                return (
                  <Pressable
                    key={v}
                    onPress={() => choisirDuree(v)}
                    onLongPress={() => isCustom && supprimerPreset(v)}
                    className="rounded-xl py-2 px-4 m-1"
                    style={isChoisi ? { backgroundColor: `${couleur}22`, borderWidth: 1, borderColor: `${couleur}88` } : { backgroundColor: '#18181B', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}
                  >
                    <Text className="font-bold text-sm" style={{ color: isChoisi ? couleur : '#8E8E93' }}>{labelDuree(v)}</Text>
                  </Pressable>
                );
              })}

              {/* case « + » : ouvre la popup de saisie */}
              <Pressable
                onPress={() => setModalVisible(true)}
                className="rounded-xl py-2 px-4 m-1 items-center justify-center"
                style={{ backgroundColor: '#18181B', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', borderStyle: 'dashed' }}
              >
                <MaterialCommunityIcons name="plus" size={18} color="#8E8E93" />
              </Pressable>
            </View>

            {/* commandes : Démarrer/Pause tant qu'il reste du temps, sinon Prochain exercice + Reset */}
            <View className="flex-row items-center">
              {restant > 0 ? (
                <Pressable onPress={() => setActif((a) => !a)}>
                  <LinearGradient
                    colors={['#1E1E20', '#0D0D0E']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    className="rounded-2xl py-4 px-10 flex-row items-center justify-center border"
                    style={{ overflow: 'hidden', borderColor: `${couleur}99`, boxShadow: `0px 5px 14px rgba(0,0,0,0.5), 0px 0px 5px ${couleur}66` }}
                  >
                    <MaterialCommunityIcons name={actif ? 'pause' : 'play'} size={22} color={couleur} />
                    <Text className="font-bold text-base ml-2" style={{ color: couleur }}>{actif ? 'Pause' : 'Démarrer'}</Text>
                  </LinearGradient>
                </Pressable>
              ) : (
                <Pressable onPress={continuer}>
                  <LinearGradient
                    colors={['#1E1E20', '#0D0D0E']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    className="rounded-2xl py-4 px-10 flex-row items-center justify-center border"
                    style={{ overflow: 'hidden', borderColor: `${couleur}99`, boxShadow: `0px 5px 14px rgba(0,0,0,0.5), 0px 0px 5px ${couleur}66` }}
                  >
                    <MaterialCommunityIcons name="arrow-right" size={22} color={couleur} />
                    <Text className="font-bold text-base ml-2" style={{ color: couleur }}>Prochain exercice</Text>
                  </LinearGradient>
                </Pressable>
              )}

              <Pressable onPress={() => choisirDuree(duree)} className="ml-4 w-14 h-14 rounded-2xl items-center justify-center" style={{ backgroundColor: '#18181B', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
                <MaterialCommunityIcons name="restart" size={24} color="#8E8E93" />
              </Pressable>
            </View>
          </>
        )}
      </View>

      {/* popup de saisie d'une durée personnalisée */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <Pressable onPress={() => setModalVisible(false)} className="flex-1 items-center justify-center px-8" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <Pressable onPress={(e) => e.stopPropagation()} className="w-full rounded-3xl p-6" style={{ backgroundColor: '#18181B', borderWidth: 1, borderColor: `${couleur}55` }}>
            <Text className="text-foreground font-bold text-lg mb-1">Nouvelle durée</Text>
            <Text className="text-muted text-sm mb-5">Minutes et secondes (ex : 3 min 17)</Text>

            <View className="flex-row items-center justify-center mb-5">
              <View className="items-center">
                <TextInput
                  value={saisieMin}
                  onChangeText={setSaisieMin}
                  keyboardType="number-pad"
                  placeholder="3"
                  placeholderTextColor="#5A5A5E"
                  autoFocus
                  maxLength={2}
                  className="text-foreground text-3xl font-bold rounded-2xl px-4 py-3 text-center"
                  style={{ backgroundColor: '#0D0D0E', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', width: 90 }}
                />
                <Text className="text-muted text-xs mt-1">min</Text>
              </View>

              <Text className="text-foreground text-3xl font-bold mx-3 mb-5">:</Text>

              <View className="items-center">
                <TextInput
                  value={saisieSec}
                  onChangeText={setSaisieSec}
                  keyboardType="number-pad"
                  placeholder="17"
                  placeholderTextColor="#5A5A5E"
                  maxLength={2}
                  className="text-foreground text-3xl font-bold rounded-2xl px-4 py-3 text-center"
                  style={{ backgroundColor: '#0D0D0E', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', width: 90 }}
                />
                <Text className="text-muted text-xs mt-1">sec</Text>
              </View>
            </View>

            <View className="flex-row justify-end">
              <Pressable onPress={() => setModalVisible(false)} className="rounded-xl py-3 px-5 mr-2">
                <Text className="text-muted font-bold">Annuler</Text>
              </Pressable>
              <Pressable onPress={ajouterPreset} className="rounded-xl py-3 px-6" style={{ backgroundColor: `${couleur}22`, borderWidth: 1, borderColor: `${couleur}88` }}>
                <Text className="font-bold" style={{ color: couleur }}>Créer</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
}
