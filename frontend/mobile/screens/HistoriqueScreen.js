import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Pressable, Modal, ScrollView } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {LineChart} from 'react-native-gifted-charts' ;
import { PREFS, lirePref, kgVers, fmtPoids } from '../preferences';

export default function HistoriqueScreen() {
  const [sessionDetail, setSessionDetail] = useState(null); 
  const [exoId, setExoId] = useState(null);                 
  const [menuExo, setMenuExo] = useState(false);            
  const [periode, setPeriode] = useState('mois');
  const [confirmSuppr, setConfirmSuppr] = useState(null);   // null | {type:'one', session} | {type:'all'}
  const queryClient = useQueryClient();

  // unité de poids choisie (kg par défaut)
  const { data: unite } = useQuery({
    queryKey: ['weightUnit'],
    queryFn: () => lirePref(PREFS.weightUnit, 'kg'),
  });

  // supprimer UNE séance de l'historique
  const mutation_suppr_session = useMutation({
    mutationFn: (id) => api.delete(`/sessions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['progression'] });
    },
  });

  // vider tout l'historique
  const mutation_clear = useMutation({
    mutationFn: () => api.delete('/sessions'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['progression'] });
    },
  });

  const { data: workouts } = useQuery({
    queryKey: ['workouts'],
    queryFn: () => api.get('workouts').then((res) => res.data),
  });

  const { data: sessions, refetch: refetchSessions } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => api.get('sessions').then((res) => res.data),
  });

  useFocusEffect(
    useCallback(() => { refetchSessions(); }, [refetchSessions])
  );

  const { data: exos } = useQuery({
    queryKey: ['exerciseDefinitions'],
    queryFn: () => api.get('exercise-definitions').then((res) => res.data),
  });

  const selId = exoId ?? exos?.[0]?.id;
  const exoCourant = exos?.find((e) => e.id === selId);   // l'exo affiché dans le menu

  const { data: progression } = useQuery({
    queryKey: ['progression', selId],
    queryFn: () => api.get(`exercise-definitions/${selId}/performances`).then((res) => res.data),
    enabled: !!selId,
  });

  const fenetreJours = periode === 'semaine' ? 7 : periode === 'mois' ? 31 : 365;
  const depuis = Date.now() - fenetreJours * 86400000;
  const dataGraphe = (progression ?? [])
    .filter((p) => new Date(p.createdAt).getTime() >= depuis)
    .map((p) => {
      const d = new Date(p.createdAt);
      // sur l'année on affiche le mois (janv., févr.…), sinon jour/mois (jj/mm)
      const label = periode === 'annee'
        ? d.toLocaleDateString('fr-FR', { month: 'short' })
        : d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
      return { value: kgVers(unite, p.weight), label };
    });

  // l'historique n'affiche QUE les séances finies (pas les skip)
  const sessionsFinies = (sessions ?? []).filter((s) => s.completedAt);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#2b2b2b', '#1d1d1d', '#000000']}
        style={{ flex: 1, paddingTop: 48 }}
      >
        {/* En-tête */}
        <Text className="text-foreground text-3xl font-bold text-center mb-1">Historique</Text>
        <Text className="text-muted text-center mb-5">Tes séances terminées</Text>

        {/* graphique de progression d'un exercice */}
        <View className="px-4 mb-2">
          <Text className="text-muted text-xs uppercase tracking-widest mb-2 text-center">Progression ({unite ?? 'kg'})</Text>

          {/* menu déroulant : choisir l'exercice */}
          <Pressable
            onPress={() => setMenuExo(true)}
            className="flex-row items-center justify-center gap-2 self-center mb-3 px-4 py-2 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}
          >
            <MaterialCommunityIcons name={exoCourant?.icon ?? 'dumbbell'} size={18} color="#44D62C" />
            <Text className="text-foreground font-semibold">{exoCourant?.name ?? 'Aucun exercice'}</Text>
            <MaterialCommunityIcons name="chevron-down" size={18} color="#8E8E93" />
          </Pressable>

          {/* bouton segmenté : période affichée sur l'axe X */}
          <View
            className="flex-row self-center mb-3 rounded-full"
            style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}
          >
            {[['semaine', 'Semaine'], ['mois', 'Mois'], ['annee', 'Année']].map(([val, label]) => {
              const actif = periode === val;
              return (
                <Pressable
                  key={val}
                  onPress={() => setPeriode(val)}
                  className="px-5 py-1.5"
                  style={{ backgroundColor: actif ? 'rgba(68,214,44,0.15)' : 'transparent' }}
                >
                  <Text className="text-sm font-semibold" style={{ color: actif ? '#44D62C' : '#8E8E93' }}>{label}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* le graphe, ou un message s'il n'y a pas (encore) de perf */}
          {dataGraphe.length > 0 ? (
            <GraphiqueProgression data={dataGraphe} unite={unite} />
          ) : (
            <View className="items-center justify-center py-10">
              <MaterialCommunityIcons name="chart-line" size={40} color="#8E8E93" />
              <Text className="text-muted mt-2 text-center">Pas encore de perf pour cet exercice.</Text>
            </View>
          )}
        </View>

        <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 120 }}>
          {/* bouton pour tout vider (seulement s'il y a des séances) */}
          {sessionsFinies.length > 0 && (
            <Pressable
              onPress={() => setConfirmSuppr({ type: 'all' })}
              className="flex-row items-center justify-center gap-2 self-end mb-3 px-4 py-2 rounded-full"
              style={{ borderWidth: 1, borderColor: 'rgba(239,68,68,0.5)', backgroundColor: 'rgba(239,68,68,0.08)' }}
            >
              <MaterialCommunityIcons name="trash-can-outline" size={16} color="#ef4444" />
              <Text className="text-red-500 font-semibold text-sm">Vider l'historique</Text>
            </Pressable>
          )}

          {/* une card par séance terminée, du jour visé le plus récent au plus ancien */}
          {[...sessionsFinies]
            .sort((a, b) => (b.scheduledDate ?? b.completedAt).localeCompare(a.scheduledDate ?? a.completedAt))
            .map((s) => {
              const seance = workouts?.find((w) => w.id === s.workoutId);
              const couleur = seance?.couleur ?? '#44D62C';
              const quand = s.scheduledDate ?? s.completedAt;
              const date = new Date(quand).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
              return (
                <Pressable
                  key={s.id}
                  onPress={() => setSessionDetail(s)}
                  className="flex-row items-center rounded-2xl p-4 mb-3"
                  style={{ backgroundColor: '#18181B', borderWidth: 1, borderColor: `${couleur}55` }}
                >
                  {/* logo de la séance dans un rond teinté à sa couleur */}
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center mr-4"
                    style={{ backgroundColor: `${couleur}22`, borderWidth: 1, borderColor: `${couleur}88` }}
                  >
                    <MaterialCommunityIcons name={seance?.icon ?? 'dumbbell'} size={26} color={couleur} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-foreground font-bold text-base">{seance?.name ?? 'Séance supprimée'}</Text>
                    <Text className="text-muted mt-1" style={{ textTransform: 'capitalize' }}>{date}</Text>
                  </View>
                  <Pressable
                    onPress={() => setConfirmSuppr({ type: 'one', session: s })}
                    hitSlop={8}
                    className="w-9 h-9 rounded-full items-center justify-center"
                    style={{ backgroundColor: 'rgba(239,68,68,0.12)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.5)' }}
                  >
                    <MaterialCommunityIcons name="close" size={18} color="#ef4444" />
                  </Pressable>
                </Pressable>
              );
            })}

          {/* message si aucune séance terminée */}
          {sessionsFinies.length === 0 && (
            <View className="items-center justify-center mt-20">
              <MaterialCommunityIcons name="history" size={48} color="#8E8E93" />
              <Text className="text-muted mt-3">Aucune séance terminée</Text>
            </View>
          )}
        </ScrollView>
      </LinearGradient>

      {/* détail d'une séance terminée (séries par exercice) */}
      {sessionDetail && (
        <DetailSession
          session={sessionDetail}
          seance={workouts?.find((w) => w.id === sessionDetail.workoutId)}
          unite={unite}
          onClose={() => setSessionDetail(null)}
        />
      )}

      {/* confirmation de suppression (DÉFINITIVE) */}
      <Modal visible={!!confirmSuppr} transparent animationType="fade">
        <Pressable onPress={() => setConfirmSuppr(null)} className="flex-1 items-center justify-center px-8" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <Pressable
            onPress={(e) => e.stopPropagation?.()}
            className="bg-card rounded-3xl px-7 py-8 items-center w-full"
            style={{ borderWidth: 1, borderColor: 'rgba(239,68,68,0.4)', boxShadow: '0px 0px 28px rgba(239,68,68,0.25)' }}
          >
            <MaterialCommunityIcons name="alert-circle-outline" size={44} color="#ef4444" />
            <Text className="text-foreground text-xl font-bold text-center mt-3 mb-2">
              {confirmSuppr?.type === 'all' ? "Vider tout l'historique ?" : 'Supprimer cette séance ?'}
            </Text>
            <Text className="text-muted text-center mb-1">
              {confirmSuppr?.type === 'all'
                ? 'Toutes tes séances terminées et leurs performances seront effacées.'
                : 'Cette séance et ses performances seront effacées.'}
            </Text>
            <Text className="text-red-500 font-bold text-center mb-7">Cette suppression est DÉFINITIVE.</Text>

            <Pressable
              className="w-full mb-3"
              onPress={() => {
                if (confirmSuppr?.type === 'all') mutation_clear.mutate();
                else mutation_suppr_session.mutate(confirmSuppr.session.id);
                setConfirmSuppr(null);
              }}
            >
              <LinearGradient
                colors={['#1E1E20', '#0D0D0E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                className="rounded-2xl py-4 w-full flex-row items-center justify-center border"
                style={{ borderColor: '#ef444499', boxShadow: '0px 5px 14px rgba(0,0,0,0.5), 0px 0px 5px rgba(239,68,68,0.5)' }}
              >
                <MaterialCommunityIcons name="trash-can-outline" size={20} color="#ef4444" />
                <Text className="font-bold text-base ml-2" style={{ color: '#ef4444' }}>
                  {confirmSuppr?.type === 'all' ? 'Tout supprimer' : 'Supprimer'}
                </Text>
              </LinearGradient>
            </Pressable>
            <Pressable onPress={() => setConfirmSuppr(null)} className="py-1">
              <Text className="text-muted">Annuler</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* menu : choisir l'exercice affiché dans le graphe */}
      <Modal visible={menuExo} transparent animationType="fade">
        <Pressable onPress={() => setMenuExo(false)} className="flex-1 items-center justify-center px-8" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <Pressable
            onPress={(e) => e.stopPropagation?.()}
            className="bg-card rounded-3xl px-6 py-7 w-full border border-white/10"
            style={{ boxShadow: '0px 8px 28px rgba(0,0,0,0.6)', maxHeight: '80%' }}
          >
            <Text className="text-foreground text-xl font-bold text-center mb-5">Choisir un exercice</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {exos?.map((exo) => {
                const actif = exo.id === selId;
                return (
                  <Pressable
                    key={exo.id}
                    onPress={() => { setExoId(exo.id); setMenuExo(false); }}
                    className="flex-row items-center py-3 px-3 mb-2 rounded-xl border"
                    style={{ borderColor: actif ? '#44D62C' : 'rgba(255,255,255,0.06)', backgroundColor: actif ? 'rgba(68,214,44,0.1)' : 'rgba(255,255,255,0.04)' }}
                  >
                    <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: 'rgba(68,214,44,0.13)', borderWidth: 1, borderColor: 'rgba(68,214,44,0.5)' }}>
                      <MaterialCommunityIcons name={exo.icon ?? 'dumbbell'} size={22} color="#44D62C" />
                    </View>
                    <Text className="text-foreground flex-1 font-semibold">{exo.name}</Text>
                    {actif && <MaterialCommunityIcons name="check" size={20} color="#44D62C" />}
                  </Pressable>
                );
              })}

              {(!exos || exos.length === 0) && (
                <Text className="text-muted text-center py-6">Aucun exercice dans ton catalogue.</Text>
              )}
            </ScrollView>
            <Pressable onPress={() => setMenuExo(false)} className="mt-3 py-1 items-center">
              <Text className="text-muted">Fermer</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

// fenêtre de détail d'une séance terminée : pour chaque exercice, ses séries
function DetailSession({ session, seance, unite, onClose }) {
  const couleur = seance?.couleur ?? '#44D62C';

  // les exercices de la séance (pour avoir leurs noms)
  const { data: exercices } = useQuery({
    queryKey: ['exercises', seance?.id],
    queryFn: () => api.get(`/workouts/${seance.id}/exercises`).then((res) => res.data),
    enabled: !!seance,
  });

  // les performances enregistrées pendant cette session = les séries faites
  const { data: perfs } = useQuery({
    queryKey: ['perfs', session?.id],
    queryFn: () => api.get(`/sessions/${session.id}/performances`).then((res) => res.data),
    enabled: !!session,
  });

  // secondes -> mm:ss
  const fmt = (s) => `${String(Math.floor((s ?? 0) / 60)).padStart(2, '0')}:${String((s ?? 0) % 60).padStart(2, '0')}`;
  const quand = session?.scheduledDate ?? session?.completedAt;
  const date = new Date(quand).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <Pressable onPress={onClose} className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
        {/* on stoppe la propagation : cliquer la feuille ne ferme pas le modal */}
        <Pressable
          onPress={(e) => e.stopPropagation?.()}
          className="bg-card rounded-t-3xl px-6 pt-6 pb-10"
          style={{ maxHeight: '80%', borderTopWidth: 1, borderColor: `${couleur}55` }}
        >
          {/* en-tête : logo + nom + date + bouton fermer */}
          <View className="flex-row items-center mb-5">
            <View
              className="w-12 h-12 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: `${couleur}22`, borderWidth: 1, borderColor: `${couleur}88` }}
            >
              <MaterialCommunityIcons name={seance?.icon ?? 'dumbbell'} size={26} color={couleur} />
            </View>
            <View className="flex-1">
              <Text className="text-foreground text-xl font-bold">{seance?.name ?? 'Séance supprimée'}</Text>
              <Text className="text-muted" style={{ textTransform: 'capitalize' }}>{date}</Text>
            </View>
            <Pressable onPress={onClose} className="w-9 h-9 rounded-full items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
              <MaterialCommunityIcons name="close" size={20} color="#FAFAFA" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {exercices?.map((exo) => {
              const series = perfs?.filter((p) => p.exerciseId === exo.id) ?? [];
              if (series.length === 0) return null; // on n'affiche que les exos travaillés
              return (
                <View key={exo.id} className="rounded-2xl p-4 mb-3" style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
                  <View className="flex-row items-center mb-2">
                    <MaterialCommunityIcons name={seance?.icon ?? 'dumbbell'} size={18} color={couleur} />
                    <Text className="text-foreground font-bold ml-2">{exo.name}</Text>
                  </View>
                  {series.map((p, i) => (
                    <Text key={p.id} className="text-muted mb-1">
                      <Text style={{ color: couleur, fontWeight: '700' }}>Série {i + 1}</Text>  —  {p.reps} reps × {fmtPoids(unite, p.weight)} · repos {fmt(p.restTime)}
                    </Text>
                  ))}
                </View>
              );
            })}

            {/* aucune série enregistrée */}
            {perfs && perfs.length === 0 && (
              <Text className="text-muted text-center mt-4 mb-2">Aucune série enregistrée pour cette séance.</Text>
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// graphique de progression : on donne juste les points, la lib gère axes/scaling
function GraphiqueProgression({ data, unite }) {
  return (
    <LineChart
      data={data}
      color="#44D62C"            // couleur de la courbe
      thickness={3}              // épaisseur du trait
      dataPointsColor="#44D62C"  // couleur des points
      curved                     // courbe lissée (enlève-le pour des segments droits)
      hideRules={false}
      rulesColor="rgba(255,255,255,0.08)"   // lignes horizontales de fond
      yAxisColor="rgba(255,255,255,0.2)"
      xAxisColor="rgba(255,255,255,0.2)"
      yAxisTextStyle={{ color: '#8E8E93', fontSize: 10 }}
      xAxisLabelTextStyle={{ color: '#8E8E93', fontSize: 10 }}
      yAxisLabelSuffix={` ${unite ?? 'kg'}`}
      noOfSections={4}           // nombre de graduations verticales
    />
  );
}
