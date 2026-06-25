import { View, Text, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

// mm:ss
const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export default function TimerToolScreen() {
  const [onglet, setOnglet] = useState('chrono');   // 'chrono' | 'minuteur'

  // liseré vert qui glisse sous l'onglet actif (même principe que l'écran Séances)
  const indicateur = useSharedValue(0);
  const styleIndicateur = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(indicateur.value * 192, { duration: 250 }) }],
  }));

  return (
    <LinearGradient colors={['#2b2b2b', '#1d1d1d', '#000000']} style={{ flex: 1, paddingTop: 48 }}>
      <Text className="text-foreground text-3xl font-bold text-center mb-1">Timer</Text>
      <Text className="text-muted text-center mb-5">Chronomètre & minuteur</Text>

      {/* sous-onglets */}
      <View className="items-center mb-6">
        <View className="flex-row gap-12">
          <Pressable onPress={() => { setOnglet('chrono'); indicateur.value = 0; }} className="w-36 items-center py-2">
            <Text className={`text-lg tracking-wide ${onglet === 'chrono' ? 'text-foreground font-semibold' : 'text-muted'}`}>Chronomètre</Text>
          </Pressable>
          <Pressable onPress={() => { setOnglet('minuteur'); indicateur.value = 1; }} className="w-36 items-center py-2">
            <Text className={`text-lg tracking-wide ${onglet === 'minuteur' ? 'text-foreground font-semibold' : 'text-muted'}`}>Minuteur</Text>
          </Pressable>
        </View>
        <View style={{ width: 336, height: 2 }}>
          <Animated.View
            style={[{ width: 144, height: 2, borderRadius: 2, backgroundColor: '#44D62C', boxShadow: '0px 0px 5px rgba(68,214,44,0.75)' }, styleIndicateur]}
          />
        </View>
      </View>

      {onglet === 'chrono' ? <Chronometre /> : <Minuteur />}
    </LinearGradient>
  );
}

// ---------- CHRONOMÈTRE : compte vers le haut ----------
function Chronometre() {
  const [secondes, setSecondes] = useState(0);
  const [actif, setActif] = useState(false);

  useEffect(() => {
    if (!actif) return;
    const id = setInterval(() => setSecondes((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [actif]);

  return (
    <View className="flex-1 items-center justify-center px-6 pb-24">
      <Cadran texte={fmt(secondes)} />
      <View className="flex-row gap-4">
        <Bouton onPress={() => setActif((a) => !a)} couleur="#44D62C" icone={actif ? 'pause' : 'play'} label={actif ? 'Pause' : 'Démarrer'} />
        <Bouton onPress={() => { setActif(false); setSecondes(0); }} couleur="#8E8E93" icone="restart" label="Reset" />
      </View>
    </View>
  );
}

// ---------- MINUTEUR : compte à rebours réglable ----------
function Minuteur() {
  const [total, setTotal] = useState(60);     // durée réglée (secondes)
  const [restant, setRestant] = useState(60); // temps restant
  const [actif, setActif] = useState(false);

  useEffect(() => {
    if (!actif) return;
    const id = setInterval(() => {
      setRestant((r) => {
        if (r <= 1) {
          clearInterval(id);
          setActif(false);
          // TODO (étape son) : jouer le "diiing" ici quand le minuteur atteint 0
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [actif]);

  // on ne règle la durée qu'à l'arrêt
  function ajuster(delta) {
    if (actif) return;
    const nouveau = Math.max(0, total + delta);
    setTotal(nouveau);
    setRestant(nouveau);
  }

  function demarrerPause() {
    if (restant === 0) return;
    setActif((a) => !a);
  }

  function reset() {
    setActif(false);
    setRestant(total);
  }

  const fini = restant === 0;

  return (
    <View className="flex-1 items-center justify-center px-6 pb-24">
      <Cadran texte={fmt(restant)} actif={fini} sousTexte={fini ? 'Terminé !' : null} />

      {/* réglage de la durée (seulement à l'arrêt) */}
      {!actif && (
        <View className="flex-row items-center gap-2 mb-8">
          <PetitBouton label="−1min" onPress={() => ajuster(-60)} />
          <PetitBouton label="−15s" onPress={() => ajuster(-15)} />
          <PetitBouton label="+15s" onPress={() => ajuster(15)} />
          <PetitBouton label="+1min" onPress={() => ajuster(60)} />
        </View>
      )}

      <View className="flex-row gap-4">
        <Bouton onPress={demarrerPause} couleur="#44D62C" icone={actif ? 'pause' : 'play'} label={actif ? 'Pause' : 'Démarrer'} />
        <Bouton onPress={reset} couleur="#8E8E93" icone="restart" label="Reset" />
      </View>
    </View>
  );
}

// cadran rond commun au chrono et au minuteur
function Cadran({ texte, actif, sousTexte }) {
  return (
    <View
      className="w-60 h-60 rounded-full items-center justify-center mb-10"
      style={{ borderWidth: 2, borderColor: actif ? '#44D62C' : 'rgba(68,214,44,0.35)', boxShadow: `0px 0px 28px rgba(68,214,44,${actif ? 0.5 : 0.22})` }}
    >
      <Text className="text-foreground font-bold" style={{ fontSize: 56 }}>{texte}</Text>
      {sousTexte && <Text className="text-accent font-semibold mt-1">{sousTexte}</Text>}
    </View>
  );
}

// gros bouton d'action (start/pause/reset)
function Bouton({ onPress, couleur, icone, label }) {
  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={['#26262A', '#161618']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="flex-row items-center gap-2 rounded-2xl py-3.5 px-7 border"
        style={{ borderColor: `${couleur}99`, boxShadow: `0px 5px 14px rgba(0,0,0,0.5), 0px 0px 5px ${couleur}66` }}
      >
        <MaterialCommunityIcons name={icone} size={20} color={couleur} />
        <Text className="font-bold text-base" style={{ color: couleur }}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

// petit bouton de réglage de durée
function PetitBouton({ label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      className="px-3 py-2 rounded-xl"
      style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}
    >
      <Text className="text-foreground font-semibold text-sm">{label}</Text>
    </Pressable>
  );
}
