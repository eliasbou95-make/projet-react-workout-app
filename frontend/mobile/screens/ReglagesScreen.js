import { View, Text, Pressable, Switch, ScrollView, Modal } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { PREFS, lirePref, ecrirePref } from '../preferences';
import Feedback, { messageErreur } from '../components/Feedback';

// une carte de réglage : icône + titre + sous-titre + un contrôle à droite (children)
function Carte({ icone, couleur = '#44D62C', titre, sousTitre, children, onPress }) {
  const Conteneur = onPress ? Pressable : View;
  return (
    <Conteneur
      onPress={onPress}
      className="flex-row items-center rounded-2xl px-4 py-4 mb-3 border border-white/10"
      style={{ backgroundColor: '#18181B' }}
    >
      <View
        className="w-11 h-11 rounded-xl items-center justify-center mr-3"
        style={{ backgroundColor: `${couleur}1F`, borderWidth: 1, borderColor: `${couleur}66` }}
      >
        <MaterialCommunityIcons name={icone} size={22} color={couleur} />
      </View>
      <View className="flex-1">
        <Text className="text-foreground font-semibold text-base">{titre}</Text>
        {sousTitre && <Text className="text-muted text-xs mt-0.5">{sousTitre}</Text>}
      </View>
      {children}
    </Conteneur>
  );
}

export default function ReglagesScreen({ navigation }) {
  const queryClient = useQueryClient();

  // unité de poids (kg / lbs)
  const { data: unite } = useQuery({
    queryKey: ['weightUnit'],
    queryFn: () => lirePref(PREFS.weightUnit, 'kg'),
  });
  const mut_unite = useMutation({
    mutationFn: (u) => ecrirePref(PREFS.weightUnit, u),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['weightUnit'] }),
  });

  // garder l'écran allumé (activé par défaut)
  const { data: keepAwake } = useQuery({
    queryKey: ['keepAwake'],
    queryFn: async () => (await lirePref(PREFS.keepAwake, 'true')) === 'true',
  });
  const mut_keep = useMutation({
    mutationFn: (v) => ecrirePref(PREFS.keepAwake, v),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['keepAwake'] }),
  });

  // début de semaine ('1' = lundi par défaut | '0' = dimanche)
  const { data: weekStart } = useQuery({
    queryKey: ['weekStart'],
    queryFn: () => lirePref(PREFS.weekStart, '1'),
  });
  const mut_week = useMutation({
    mutationFn: (v) => ecrirePref(PREFS.weekStart, v),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['weekStart'] }),
  });

  // réinitialisation totale (irréversible)
  const [confirmReset, setConfirmReset] = useState(false);
  const [msgReset, setMsgReset] = useState(null);
  const mut_reset = useMutation({
    mutationFn: () => api.delete('account/reset'),
    onSuccess: () => {
      ['workouts', 'sessions', 'exerciseDefinitions', 'sections', 'cycle', 'profile', 'dayOverrides', 'progression']
        .forEach((k) => queryClient.invalidateQueries({ queryKey: [k] }));
      setConfirmReset(false);
    },
    onError: (err) => setMsgReset({ type: 'err', text: messageErreur(err, 'Échec de la réinitialisation.') }),
  });

  return (
    <LinearGradient colors={['#2b2b2b', '#1d1d1d', '#000000']} style={{ flex: 1, paddingTop: 48, paddingHorizontal: 16 }}>
      <Text className="text-foreground text-3xl font-bold text-center mb-1">Réglages</Text>
      <Text className="text-muted text-center mb-6">Personnalise ton expérience</Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>

        {/* Apparence */}
        <Text className="text-muted text-xs uppercase tracking-widest mb-2 ml-1">Apparence</Text>
        <Carte
          icone="palette"
          couleur="#a78bfa"
          titre="Thème"
          sousTitre="Personnaliser les couleurs"
          onPress={() => {}}
        >
          <View className="flex-row items-center gap-2">
            <View className="rounded-full px-2.5 py-1" style={{ backgroundColor: 'rgba(167,139,250,0.15)', borderWidth: 1, borderColor: 'rgba(167,139,250,0.5)' }}>
              <Text style={{ color: '#a78bfa', fontSize: 11, fontWeight: '600' }}>Bientôt</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#8E8E93" />
          </View>
        </Carte>

        {/* Affichage */}
        <Text className="text-muted text-xs uppercase tracking-widest mb-2 mt-4 ml-1">Affichage</Text>
        <Carte icone="calendar-week" couleur="#22d3ee" titre="Début de semaine" sousTitre="Premier jour du calendrier">
          <View className="flex-row rounded-full p-1" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
            {[{ v: '1', label: 'Lun' }, { v: '0', label: 'Dim' }].map((o) => {
              const actif = (weekStart ?? '1') === o.v;
              return (
                <Pressable
                  key={o.v}
                  onPress={() => mut_week.mutate(o.v)}
                  className="px-4 py-1.5 rounded-full"
                  style={actif ? { backgroundColor: 'rgba(34,211,238,0.18)', borderWidth: 1, borderColor: 'rgba(34,211,238,0.6)' } : null}
                >
                  <Text style={{ color: actif ? '#22d3ee' : '#8E8E93', fontWeight: '600' }}>{o.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </Carte>

        {/* Entraînement */}
        <Text className="text-muted text-xs uppercase tracking-widest mb-2 mt-4 ml-1">Entraînement</Text>

        <Carte icone="weight" titre="Unité de poids" sousTitre="Affichage des charges">
          <View className="flex-row rounded-full p-1" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
            {['kg', 'lbs'].map((u) => {
              const actif = unite === u;
              return (
                <Pressable
                  key={u}
                  onPress={() => mut_unite.mutate(u)}
                  className="px-4 py-1.5 rounded-full"
                  style={actif ? { backgroundColor: 'rgba(68,214,44,0.18)', borderWidth: 1, borderColor: 'rgba(68,214,44,0.6)' } : null}
                >
                  <Text style={{ color: actif ? '#44D62C' : '#8E8E93', fontWeight: '600' }}>{u}</Text>
                </Pressable>
              );
            })}
          </View>
        </Carte>

        <Carte icone="cellphone-lock" titre="Garder l'écran allumé" sousTitre="Empêche la mise en veille">
          <Switch
            value={!!keepAwake}
            onValueChange={(v) => mut_keep.mutate(v)}
            trackColor={{ false: 'rgba(255,255,255,0.15)', true: 'rgba(68,214,44,0.5)' }}
            thumbColor={keepAwake ? '#44D62C' : '#8E8E93'}
          />
        </Carte>

        {/* Compte */}
        <Text className="text-muted text-xs uppercase tracking-widest mb-2 mt-4 ml-1">Compte</Text>
        <Carte
          icone="account-cog"
          couleur="#a78bfa"
          titre="Gestion du compte"
          sousTitre="Mot de passe, email, suppression"
          onPress={() => navigation.navigate('GestionCompte')}
        >
          <MaterialCommunityIcons name="chevron-right" size={22} color="#8E8E93" />
        </Carte>

        {/* À propos */}
        <Text className="text-muted text-xs uppercase tracking-widest mb-2 mt-4 ml-1">À propos</Text>
        <Carte icone="information-outline" couleur="#22d3ee" titre="Version" sousTitre="Workout App">
          <Text className="text-muted font-semibold">1.0.0</Text>
        </Carte>

        {/* Données : zone danger */}
        <Text className="text-muted text-xs uppercase tracking-widest mb-2 mt-4 ml-1">Données</Text>
        <Pressable
          onPress={() => { setMsgReset(null); setConfirmReset(true); }}
          className="flex-row items-center justify-center gap-2 rounded-2xl py-4 mt-1"
          style={{ borderWidth: 1, borderColor: 'rgba(239,68,68,0.6)', backgroundColor: 'rgba(239,68,68,0.1)' }}
        >
          <MaterialCommunityIcons name="alert-octagon" size={20} color="#ef4444" />
          <Text style={{ color: '#ef4444', fontWeight: '700', fontSize: 15 }}>Réinitialiser l'application</Text>
        </Pressable>

      </ScrollView>

      {/* POPUP : confirmation de réinitialisation totale (irréversible) */}
      <Modal visible={confirmReset} transparent animationType="fade">
        <Pressable
          onPress={() => setConfirmReset(false)}
          className="flex-1 items-center justify-center px-8"
          style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation?.()}
            className="bg-card rounded-3xl px-7 py-8 items-center w-full"
            style={{ borderWidth: 1, borderColor: 'rgba(239,68,68,0.6)', boxShadow: '0px 0px 28px rgba(239,68,68,0.3)' }}
          >
            <View
              className="w-16 h-16 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: 'rgba(239,68,68,0.14)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.6)' }}
            >
              <MaterialCommunityIcons name="alert-octagon" size={34} color="#ef4444" />
            </View>
            <Text className="text-foreground text-2xl font-bold text-center mb-3">Action IRRÉVERSIBLE</Text>
            <Text className="text-muted text-center mb-1" style={{ lineHeight: 20 }}>
              Cette action est <Text style={{ color: '#ef4444', fontWeight: '700' }}>ABSOLUMENT irréversible</Text>.
            </Text>
            <Text className="text-muted text-center mb-7" style={{ lineHeight: 20 }}>
              Ça va supprimer <Text className="text-foreground font-semibold">tous tes workouts</Text>, <Text className="text-foreground font-semibold">tout l'historique</Text>, <Text className="text-foreground font-semibold">tous tes exercices</Text> et ton cycle.{'\n'}
              Comme si <Text style={{ color: '#ef4444', fontWeight: '700' }}>RIEN N'AVAIT JAMAIS EXISTÉ</Text>.
            </Text>

            <View className="w-full"><Feedback msg={msgReset} /></View>
            <Pressable onPress={() => { setMsgReset(null); mut_reset.mutate(); }} disabled={mut_reset.isPending} className="w-full mb-2">
              <View
                className="rounded-2xl py-4 items-center"
                style={{ backgroundColor: '#ef4444', opacity: mut_reset.isPending ? 0.6 : 1 }}
              >
                <Text className="font-bold text-base" style={{ color: '#0A0A0A' }}>
                  {mut_reset.isPending ? 'Suppression…' : 'Tout supprimer définitivement'}
                </Text>
              </View>
            </Pressable>
            <Pressable onPress={() => setConfirmReset(false)} className="py-2">
              <Text className="text-muted">Annuler</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
}
