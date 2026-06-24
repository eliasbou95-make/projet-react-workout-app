import { useRef, useState } from 'react';
import { View, Text, Pressable, Modal, TextInput, ScrollView  } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, runOnJS, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Calendar } from 'react-native-calendars';
import { useMutation ,useQuery, useQueryClient} from '@tanstack/react-query';
import api from '../api/client';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ICONES = ['dumbbell', 'arm-flex', 'run', 'weight-lifter', 'bike', 'yoga', 'human-handsup'];

export default function SeancesScreen() {
  const [ongletActif, setOngletActif] = useState('gestion');
  const [modalVisible,setModalVisible] = useState(false);
  const [nom , setNom] = useState("");
  const caseVideRef = useRef(null);                          // la case "+" du cycle, mesurée au moment du drop
  const dragX = useSharedValue(0);                           // position absolue du doigt pendant le drag
  const dragY = useSharedValue(0);
  const [seanceDraggee, setSeanceDraggee] = useState(null);  // séance en cours de drag → pour afficher le clone
  const queryClient = useQueryClient();
  const [icone, setIcone] = useState(null);
  const [exercices, setExercices] = useState([]);
  const [workoutOuvert, setWorkoutOuvert] = useState(null);
  const [modalExo, setModalExo] = useState(false);   // modal de création d'exercice
  const [nomExo, setNomExo] = useState("");
  const [iconeExo, setIconeExo] = useState(null);
  const champNomRef = useRef(null);                          // pour redonner le focus au champ nom en chaînant
  const [selecteurExo, setSelecteurExo] = useState(false);   // modal pour piger un exo du catalogue
  const [dateCycleOuvert, setDateCycleOuvert] = useState(false);   // modal calendrier (date de début du cycle)
  const [repeatOuvert, setRepeatOuvert] = useState(false);   // modal nombre de répétitions du cycle
  // position de la ligne qui glisse sous les onglets (0 = Gestion, 1 = Historique)
  const indicateur = useSharedValue(0);
  const styleIndicateur = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(indicateur.value * 192, { duration: 250 }) }],
  }));
  const mutation_ajout = useMutation({
    mutationFn: (nouveau) =>
  api.post('/workouts',nouveau),
    onSuccess:() => {
      queryClient.invalidateQueries({queryKey: ["workouts"]})
    }
  })
  const mutation_suppresion = useMutation({
    mutationFn: (supprimé) =>
      api.delete(`/workouts/${supprimé}`),
    onSuccess:() => {
      queryClient.invalidateQueries({queryKey: ['workouts']})
    }

  })
  const mutation_cycle = useMutation({
    mutationFn: (nouveau) =>
      api.post('/cycle', nouveau),
    onSuccess:() => {
      queryClient.invalidateQueries({ queryKey: ['cycle'] })
    }
  })
  const mutation_suppr_cycle = useMutation({
    mutationFn: (id) =>
      api.delete(`/cycle/${id}`),
    onSuccess:() => {
      queryClient.invalidateQueries({ queryKey: ['cycle'] })
    }
  })
  const {data,isLoading} = useQuery({
    queryKey: ['workouts'],
    queryFn: () => api.get('workouts').then((res) => 
    res.data),
  })

  const {data: exercisesDuWorkout} = useQuery({
    queryKey: ['exercises', workoutOuvert?.id],
    queryFn: () => api.get (`/workouts/${workoutOuvert.id}/exercises`).then((res)=> res.data),
    enabled: !!workoutOuvert,
  })

  const {data:cycle} = useQuery({
    queryKey : ['cycle'],
    queryFn: () => api.get('cycle').then((res)=> res.data)
  })

  const {data: exos } = useQuery({
    queryKey: ['exerciseDefinitions'],
    queryFn: () => api.get('exercise-definitions').then((res) => res.data),

  })

  const mutation_ajout_exo = useMutation({
    mutationFn: (nouveau) => api.post('/exercise-definitions', nouveau),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['exerciseDefinitions']})
    }
  })

  const mutation_suppr_exo = useMutation({
    mutationFn: (id) => api.delete(`/exercise-definitions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exerciseDefinitions'] })
    }
  })

  // profil : on en a besoin pour lire la date de début actuelle du cycle
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('account/profile').then((res) => res.data.data),
  })

  // changer la date de début du cycle
  const mutation_date_cycle = useMutation({
    mutationFn: (dateISO) => api.patch('/cycle/start-date', { cycleStartDate: dateISO }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })

  // changer le nombre de répétitions du cycle (n = nombre, null = infini)
  const mutation_repeat_cycle = useMutation({
    mutationFn: (n) => api.patch('/cycle/repeat', { cycleRepeat: n }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })

  // activer/désactiver le repos de fin de cycle (true / false)
  const mutation_endrest_cycle = useMutation({
    mutationFn: (actif) => api.patch('/cycle/end-rest', { cycleEndRest: actif }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })

  // début du drag : on mémorise quelle séance est saisie (pour afficher le clone)
  function demarrerDrag(seance) {
    setSeanceDraggee(seance);
  }

  // fin du drag : on mesure la case "+" MAINTENANT (donc juste même après un scroll)
  // et si le doigt est dedans → on ajoute au cycle
  function deposer(x, y, workoutId) {
    setSeanceDraggee(null);
    const node = caseVideRef.current;
    if (!node) return;
    node.measureInWindow((zx, zy, zw, zh) => {
      const dedans = x >= zx && x <= zx + zw && y >= zy && y <= zy + zh;
      if (dedans) {
        mutation_cycle.mutate({
          position: cycle?.length ? cycle[cycle.length - 1].position + 1 : 0,
          workoutId,
        });
      }
    });
  }

  function modifierExercice(index, champ, valeur) {
    const copie = [...exercices];
    copie[index] = {...copie[index], [champ] : valeur}
    setExercices(copie);
  }

  // ajoute à la séance un exercice choisi dans le catalogue (on garde son id de fiche)
  function choisirExo(exo) {
    setExercices([...exercices, { definitionId: exo.id, name: exo.name, icon: exo.icon, sets: '' }]);
    setSelecteurExo(false);
  }

  // retire de la séance l'exercice à la position index
  function retirerExercice(index) {
    setExercices(exercices.filter((_, i) => i !== index));
  }

  async function ajouterSeance() {

    const res = await mutation_ajout.mutateAsync({ name: nom, icon: icone })
    const workout = res.data

    for (const exo of exercices) {
      if (!exo.name.trim()) continue
      await api.post(`/workouts/${workout.id}/exercises`, {
        name: exo.name,
        sets: exo.sets ? Number(exo.sets) : undefined,
        definitionId: exo.definitionId,
      })
    }

    setNom('')
    setIcone(null)
    setExercices([])
    setModalVisible(false)
  }

  // enregistre la fiche d'exercice et remet le formulaire à blanc ; renvoie false si le nom est vide
  function enregistrerExo() {
    if (!nomExo.trim()) return false
    mutation_ajout_exo.mutate({ name: nomExo, icon: iconeExo })
    setNomExo('')
    setIconeExo(null)
    return true
  }

  // créer puis fermer le modal
  function creerExo() {
    if (enregistrerExo()) setModalExo(false)
  }

  // créer puis enchaîner : on garde le modal ouvert et on redonne le focus au champ nom
  function creerExoEtSuite() {
    if (enregistrerExo()) champNomRef.current?.focus()
  }

  // le clone suit le doigt (coordonnées absolues de l'écran), décalé de 32 pour être centré
  const styleClone = useAnimatedStyle(() => ({
    transform: [{ translateX: dragX.value - 32 }, { translateY: dragY.value - 32 }],
  }));
  const couleurClone = seanceDraggee?.couleur ?? '#44D62C';

  // date de début du cycle : 'YYYY-MM-DD' pour le calendrier, + version lisible pour l'affichage
  const debutISO = profile?.cycleStartDate?.slice(0, 10) ?? null;
  const debutLisible = debutISO
    ? new Date(debutISO).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'non définie';
  // répétitions : un nombre → "× 3", null/absent → "∞" (infini)
  const repeatLisible = profile?.cycleRepeat ? `× ${profile.cycleRepeat}` : '∞';

  return (
   <View style={{ flex: 1 }}>
    <LinearGradient
      colors={['#2b2b2b', '#1d1d1d', '#000000']}
      style={{ flex: 1, paddingTop: 48, paddingHorizontal: 16 }}
    >
      {/* En-tête */}
      <Text className="text-foreground text-3xl font-bold text-center mb-1">Séances</Text>
      <Text className="text-muted text-center mb-5">Gère tes séances et ton cycle</Text>

      {/* Sous-onglets en haut */}
      <View className="items-center mb-6">
        <View className="flex-row gap-12">
          <Pressable
            onPress={() => { setOngletActif('gestion'); indicateur.value = 0; }}
            className="w-36 items-center py-2"
          >
            <Text className={`text-lg tracking-wide ${ongletActif === 'gestion' ? 'text-foreground font-semibold' : 'text-muted'}`}>
              Gestion
            </Text>
          </Pressable>
          <Pressable
            onPress={() => { setOngletActif('exercices'); indicateur.value = 1; }}
            className="w-36 items-center py-2"
          >
            <Text className={`text-lg tracking-wide ${ongletActif === 'exercices' ? 'text-foreground font-semibold' : 'text-muted'}`}>
              Exercices
            </Text>
          </Pressable>
        </View>
        {/* fin liseré vert qui glisse sous l'onglet actif */}
        <View style={{ width: 336, height: 2 }}>
          <Animated.View
            style={[{ width: 144, height: 2, borderRadius: 2, backgroundColor: '#44D62C', boxShadow: '0px 0px 5px rgba(68,214,44,0.75)' }, styleIndicateur]}
          />
        </View>
      </View>

      <Pressable
        onPress={() => (ongletActif === 'gestion' ? setModalVisible(true) : setModalExo(true))}
        className="self-center mb-7"
      >
        <LinearGradient
          colors={['#1E1E20', '#0D0D0E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="flex-row items-center gap-2 rounded-full py-3.5 px-8 border border-accent/60"
          style={{ boxShadow: '0px 5px 14px rgba(0,0,0,0.5), 0px 0px 5px rgba(68,214,44,0.4)' }}
        >
          <MaterialCommunityIcons name="plus" size={22} color="#44D62C" />
          <Text className="text-accent font-bold text-base">
            {ongletActif === 'gestion' ? 'Nouvelle séance' : 'Nouvel exercice'}
          </Text>
        </LinearGradient>
      </Pressable>

      {/* popup ajouter séance */}
      <Modal visible={modalVisible} animationType="slide">
        <LinearGradient colors={['#2b2b2b', '#1d1d1d', '#000000']} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 64 }}>
            <View className="items-center mb-6">
              <LinearGradient
                colors={['#26262A', '#161618']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                className="w-16 h-16 rounded-2xl items-center justify-center mb-3 border border-accent/70"
                style={{ boxShadow: '0px 5px 14px rgba(0,0,0,0.5), 0px 0px 5px rgba(68,214,44,0.45)' }}
              >
                <MaterialCommunityIcons name="dumbbell" size={30} color="#44D62C" />
              </LinearGradient>
              <Text className="text-foreground text-2xl font-bold">Nouvelle séance</Text>
            </View>

            {/* Nom */}
            <Text className="text-muted text-xs uppercase tracking-widest mb-2">Nom</Text>
            <TextInput
              value={nom}
              onChangeText={setNom}
              placeholder="ex : Push, Legs..."
              placeholderTextColor="#8E8E93"
              className="text-foreground bg-card rounded-xl px-4 py-3 mb-5 border border-white/5"
            />

            {/* Icône */}
            <Text className="text-muted text-xs uppercase tracking-widest mb-2">Icône</Text>
            <View className="flex-row flex-wrap gap-3 mb-5">
              {ICONES.map((nomIcone) => {
                const actif = icone === nomIcone;
                return (
                  <Pressable key={nomIcone} onPress={() => setIcone(nomIcone)}>
                    <LinearGradient
                      colors={['#26262A', '#161618']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      className={`w-14 h-14 rounded-2xl items-center justify-center border ${actif ? 'border-accent/70' : 'border-white/10'}`}
                      style={actif ? { boxShadow: '0px 0px 5px rgba(68,214,44,0.45)' } : null}
                    >
                      <MaterialCommunityIcons
                        name={nomIcone}
                        size={26}
                        color={actif ? '#44D62C' : '#8E8E93'}
                      />
                    </LinearGradient>
                  </Pressable>
                );
              })}
            </View>

            {/* Exercices */}
            <Text className="text-muted text-xs uppercase tracking-widest mb-2">Exercices</Text>
            {exercices.map((exo, index) => (
              <View key={index} className="flex-row items-center gap-2 mb-2">
                {/* nom de l'exo choisi dans le catalogue (non éditable) */}
                <View className="flex-row items-center flex-1 bg-card rounded-xl px-3 py-2 border border-white/5">
                  <MaterialCommunityIcons name={exo.icon ?? 'dumbbell'} size={20} color="#44D62C" />
                  <Text className="text-foreground ml-2 flex-1" numberOfLines={1}>{exo.name}</Text>
                </View>
                <TextInput
                  value={exo.sets}
                  onChangeText={(texte) => modifierExercice(index, 'sets', texte)}
                  placeholder="séries"
                  placeholderTextColor="#8E8E93"
                  keyboardType="numeric"
                  className="text-foreground bg-card rounded-xl px-3 py-2 w-20 border border-white/5"
                />
                {/* retirer cet exo de la séance */}
                <Pressable onPress={() => retirerExercice(index)} className="w-8 h-8 items-center justify-center">
                  <MaterialCommunityIcons name="close" size={18} color="#ef4444" />
                </Pressable>
              </View>
            ))}
            <Pressable onPress={() => setSelecteurExo(true)} className="flex-row items-center gap-2 mt-1 mb-8 self-start">
              <MaterialCommunityIcons name="plus-circle-outline" size={20} color="#44D62C" />
              <Text className="text-accent">Ajouter un exercice</Text>
            </Pressable>

            {/* Boutons */}
            <Pressable onPress={ajouterSeance} className="mb-3">
              <LinearGradient
                colors={['#1E1E20', '#0D0D0E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                className="rounded-xl py-4 items-center border border-accent/60"
                style={{ boxShadow: '0px 5px 14px rgba(0,0,0,0.5), 0px 0px 5px rgba(68,214,44,0.4)' }}
              >
                <Text className="text-accent font-bold text-base">Créer la séance</Text>
              </LinearGradient>
            </Pressable>
            <Pressable onPress={() => setModalVisible(false)} className="py-2 items-center">
              <Text className="text-muted">Annuler</Text>
            </Pressable>
          </ScrollView>
        </LinearGradient>
      </Modal>

      {/* popup liste des exercices d'un workout */}
      <Modal visible={!!workoutOuvert} transparent animationType="fade">
        <Pressable
          onPress={() => setWorkoutOuvert(null)}
          className="flex-1 items-center justify-center px-8"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation?.()}
            className="bg-card rounded-3xl px-7 py-8 w-full border border-white/10"
            style={{ boxShadow: '0px 8px 28px rgba(0,0,0,0.6)' }}
          >
            <View className="items-center mb-5">
              <LinearGradient
                colors={['#26262A', '#161618']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                className="w-16 h-16 rounded-2xl items-center justify-center mb-3 border"
                style={{ borderColor: `${(workoutOuvert?.couleur ?? '#44D62C')}99`, boxShadow: `0px 5px 14px rgba(0,0,0,0.5), 0px 0px 5px ${(workoutOuvert?.couleur ?? '#44D62C')}66` }}
              >
                {workoutOuvert?.icon && (
                  <MaterialCommunityIcons name={workoutOuvert.icon} size={30} color={workoutOuvert?.couleur ?? '#44D62C'} />
                )}
              </LinearGradient>
              <Text className="text-muted text-xs uppercase tracking-widest mb-1">Exercices</Text>
              <Text className="text-foreground text-xl font-bold">{workoutOuvert?.name}</Text>
            </View>

            {exercisesDuWorkout?.map((exo) => (
              <View key={exo.id} className="flex-row justify-between items-center py-2 border-b border-white/5">
                <Text className="text-foreground">{exo.name}</Text>
                <Text className="text-muted text-sm">{exo.sets} séries</Text>
              </View>
            ))}

            <Pressable onPress={() => setWorkoutOuvert(null)} className="mt-6 py-1 items-center">
              <Text className="text-muted">Fermer</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* popup créer un exercice (fiche homologuée) */}
      <Modal visible={modalExo} transparent animationType="fade">
        <Pressable
          onPress={() => setModalExo(false)}
          className="flex-1 items-center justify-center px-8"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation?.()}
            className="bg-card rounded-3xl px-7 py-8 w-full border border-white/10"
            style={{ boxShadow: '0px 8px 28px rgba(0,0,0,0.6)' }}
          >
            <View className="items-center mb-5">
              <LinearGradient
                colors={['#26262A', '#161618']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                className="w-16 h-16 rounded-2xl items-center justify-center mb-3 border border-accent/70"
                style={{ boxShadow: '0px 5px 14px rgba(0,0,0,0.5), 0px 0px 5px rgba(68,214,44,0.45)' }}
              >
                <MaterialCommunityIcons name={iconeExo ?? 'arm-flex'} size={30} color="#44D62C" />
              </LinearGradient>
              <Text className="text-foreground text-2xl font-bold">Nouvel exercice</Text>
            </View>

            {/* Nom */}
            <Text className="text-muted text-xs uppercase tracking-widest mb-2">Nom</Text>
            <TextInput
              ref={champNomRef}
              value={nomExo}
              onChangeText={setNomExo}
              placeholder="ex : Squat, Développé couché..."
              placeholderTextColor="#8E8E93"
              className="text-foreground bg-card rounded-xl px-4 py-3 mb-5 border border-white/5"
            />

            {/* Icône */}
            <Text className="text-muted text-xs uppercase tracking-widest mb-2">Icône</Text>
            <View className="flex-row flex-wrap gap-3 mb-6">
              {ICONES.map((nomIcone) => {
                const actif = iconeExo === nomIcone;
                return (
                  <Pressable key={nomIcone} onPress={() => setIconeExo(nomIcone)}>
                    <LinearGradient
                      colors={['#26262A', '#161618']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      className={`w-14 h-14 rounded-2xl items-center justify-center border ${actif ? 'border-accent/70' : 'border-white/10'}`}
                      style={actif ? { boxShadow: '0px 0px 5px rgba(68,214,44,0.45)' } : null}
                    >
                      <MaterialCommunityIcons name={nomIcone} size={26} color={actif ? '#44D62C' : '#8E8E93'} />
                    </LinearGradient>
                  </Pressable>
                );
              })}
            </View>

            {/* Boutons : "Créer" (ferme) + "+" (crée et enchaîne un autre) */}
            <View className="flex-row gap-3 mb-2">
              <Pressable onPress={creerExo} className="flex-1">
                <LinearGradient
                  colors={['#1E1E20', '#0D0D0E']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  className="rounded-xl py-4 items-center border border-accent/60"
                  style={{ boxShadow: '0px 5px 14px rgba(0,0,0,0.5), 0px 0px 5px rgba(68,214,44,0.4)' }}
                >
                  <Text className="text-accent font-bold text-base">Créer l'exercice</Text>
                </LinearGradient>
              </Pressable>
              <Pressable onPress={creerExoEtSuite}>
                <LinearGradient
                  colors={['#1E1E20', '#0D0D0E']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  className="rounded-xl py-4 px-5 items-center justify-center border border-accent/60"
                  style={{ boxShadow: '0px 5px 14px rgba(0,0,0,0.5), 0px 0px 5px rgba(68,214,44,0.4)' }}
                >
                  <MaterialCommunityIcons name="plus" size={24} color="#44D62C" />
                </LinearGradient>
              </Pressable>
            </View>
            <Text className="text-muted text-xs text-center mb-3">« + » : crée et enchaîne un autre exercice</Text>
            <Pressable onPress={() => setModalExo(false)} className="py-1 items-center">
              <Text className="text-muted">Terminé</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* sélecteur : choisir un exercice du catalogue pour l'ajouter à la séance */}
      <Modal visible={selecteurExo} transparent animationType="fade">
        <Pressable
          onPress={() => setSelecteurExo(false)}
          className="flex-1 items-center justify-center px-8"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation?.()}
            className="bg-card rounded-3xl px-6 py-7 w-full border border-white/10"
            style={{ boxShadow: '0px 8px 28px rgba(0,0,0,0.6)', maxHeight: '80%' }}
          >
            <Text className="text-foreground text-xl font-bold text-center mb-1">Choisir un exercice</Text>
            <Text className="text-muted text-center text-sm mb-5">Dans ton catalogue d'exercices</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {exos?.map((exo) => (
                <Pressable
                  key={exo.id}
                  onPress={() => choisirExo(exo)}
                  className="flex-row items-center py-3 px-3 mb-2 rounded-xl border border-white/5"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                >
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: 'rgba(68,214,44,0.13)', borderWidth: 1, borderColor: 'rgba(68,214,44,0.5)' }}
                  >
                    <MaterialCommunityIcons name={exo.icon ?? 'dumbbell'} size={22} color="#44D62C" />
                  </View>
                  <Text className="text-foreground flex-1 font-semibold">{exo.name}</Text>
                  <MaterialCommunityIcons name="plus" size={22} color="#44D62C" />
                </Pressable>
              ))}

              {/* catalogue vide */}
              {(!exos || exos.length === 0) && (
                <View className="items-center justify-center py-8">
                  <MaterialCommunityIcons name="arm-flex" size={40} color="#8E8E93" />
                  <Text className="text-muted mt-3 text-center">Aucun exercice dans ton catalogue.{'\n'}Crée-en dans l'onglet Exercices.</Text>
                </View>
              )}
            </ScrollView>

            <Pressable onPress={() => setSelecteurExo(false)} className="mt-4 py-1 items-center">
              <Text className="text-muted">Fermer</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* modal calendrier : choisir la date de début du cycle */}
      <Modal visible={dateCycleOuvert} transparent animationType="fade">
        <Pressable
          onPress={() => setDateCycleOuvert(false)}
          className="flex-1 items-center justify-center px-8"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation?.()}
            className="bg-card rounded-3xl p-5 w-full border border-white/10"
            style={{ boxShadow: '0px 8px 28px rgba(0,0,0,0.6)' }}
          >
            <Text className="text-foreground text-xl font-bold text-center mb-1">Début du cycle</Text>
            <Text className="text-muted text-center text-sm mb-4">Choisis le jour où ton cycle commence</Text>

            <Calendar
              onDayPress={(day) => {
                mutation_date_cycle.mutate(day.dateString);   // 'YYYY-MM-DD'
                setDateCycleOuvert(false);
              }}
              markedDates={debutISO ? { [debutISO]: { selected: true, selectedColor: '#44D62C' } } : {}}
              firstDay={1}
              theme={{
                calendarBackground: 'transparent',
                monthTextColor: '#FAFAFA',
                dayTextColor: '#FAFAFA',
                textSectionTitleColor: '#8E8E93',
                todayTextColor: '#44D62C',
                arrowColor: '#44D62C',
                textDisabledColor: '#3A3A3A',
                selectedDayBackgroundColor: '#44D62C',
                selectedDayTextColor: '#0A0A0A',
              }}
            />

            <Pressable onPress={() => setDateCycleOuvert(false)} className="mt-3 py-1 items-center">
              <Text className="text-muted">Annuler</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* modal : nombre de répétitions du cycle */}
      <Modal visible={repeatOuvert} transparent animationType="fade">
        <Pressable
          onPress={() => setRepeatOuvert(false)}
          className="flex-1 items-center justify-center px-8"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation?.()}
            className="bg-card rounded-3xl px-6 py-7 w-full border border-white/10"
            style={{ boxShadow: '0px 8px 28px rgba(0,0,0,0.6)' }}
          >
            <Text className="text-foreground text-xl font-bold text-center mb-1">Répétitions du cycle</Text>
            <Text className="text-muted text-center text-sm mb-5">Combien de fois répéter le cycle ?</Text>

            <View className="flex-row flex-wrap justify-center gap-3 mb-2">
              {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((n) => {
                const actif = profile?.cycleRepeat === n;
                return (
                  <Pressable key={n} onPress={() => { mutation_repeat_cycle.mutate(n); setRepeatOuvert(false); }}>
                    <View
                      className="w-14 h-14 rounded-2xl items-center justify-center border"
                      style={{ borderColor: actif ? '#44D62C' : 'rgba(255,255,255,0.12)', backgroundColor: actif ? 'rgba(68,214,44,0.13)' : 'rgba(255,255,255,0.04)' }}
                    >
                      <Text className="font-bold text-base" style={{ color: actif ? '#44D62C' : '#FAFAFA' }}>{n}×</Text>
                    </View>
                  </Pressable>
                );
              })}

              {/* option infini (null) */}
              <Pressable onPress={() => { mutation_repeat_cycle.mutate(null); setRepeatOuvert(false); }}>
                <View
                  className="w-14 h-14 rounded-2xl items-center justify-center border"
                  style={{ borderColor: profile?.cycleRepeat == null ? '#44D62C' : 'rgba(255,255,255,0.12)', backgroundColor: profile?.cycleRepeat == null ? 'rgba(68,214,44,0.13)' : 'rgba(255,255,255,0.04)' }}
                >
                  <MaterialCommunityIcons name="infinity" size={24} color={profile?.cycleRepeat == null ? '#44D62C' : '#FAFAFA'} />
                </View>
              </Pressable>
            </View>

            <Pressable onPress={() => setRepeatOuvert(false)} className="mt-3 py-1 items-center">
              <Text className="text-muted">Annuler</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>


      {ongletActif === 'gestion' ? (
        <View className="flex-1">

          {/* barre du haut : début du cycle + répétitions */}
          <View className="flex-row items-center justify-center gap-2 mb-4">
            <Pressable
              onPress={() => setDateCycleOuvert(true)}
              className="flex-row items-center gap-2 px-4 py-2 rounded-full"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}
            >
              <MaterialCommunityIcons name="calendar-start" size={18} color="#44D62C" />
              <Text className="text-muted">Début :</Text>
              <Text className="text-foreground font-semibold">{debutLisible}</Text>
              <MaterialCommunityIcons name="chevron-down" size={18} color="#8E8E93" />
            </Pressable>

            <Pressable
              onPress={() => setRepeatOuvert(true)}
              className="flex-row items-center gap-1.5 px-4 py-2 rounded-full"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}
            >
              <MaterialCommunityIcons name="repeat" size={18} color="#44D62C" />
              <Text className="text-foreground font-semibold">{repeatLisible}</Text>
              <MaterialCommunityIcons name="chevron-down" size={18} color="#8E8E93" />
            </Pressable>
          </View>

          <View className="flex-1 flex-row">

          <View className="flex-1">
            <Text className="text-muted text-xs uppercase tracking-widest mb-4 text-center">Mes séances</Text>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center', paddingTop: 8, paddingHorizontal: 8, paddingBottom: 120 }}>
            <View className="flex-row flex-wrap justify-start gap-4" style={{ maxWidth: 272 }}>
              {data?.map((seance) => (
                <PastilleDraggable
                  key={seance.id}
                  seance={seance}
                  dragX={dragX}
                  dragY={dragY}
                  onDragStart={demarrerDrag}
                  onDrop={deposer}
                  supprimerJour={(id) => mutation_suppresion.mutate(id)}
                  ouvrirExercices={() => setWorkoutOuvert(seance)}
                />
              ))}

              {/* pastille "jour de repos" : virtuelle (id null), toujours présente.
                  Lâchée sur le cycle → deposer(..., null) → workoutId null = repos */}
              <PastilleDraggable
                seance={{ id: null, name: 'jour_de_repos', icon: 'sleep', couleur: '#22d3ee' }}
                dragX={dragX}
                dragY={dragY}
                onDragStart={demarrerDrag}
                onDrop={deposer}
              />
            </View>
            </ScrollView>
          </View>

          {/* le cycle : une case par jour, + une case vide en bas pour ajouter */}
          <ScrollView
            style={{ width: 160 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120, paddingTop: 6, paddingRight: 10, alignItems: 'flex-end' }}
          >
            <Text className="text-muted text-xs uppercase tracking-widest mb-4 mr-1">Mon cycle</Text>
            {cycle?.map((jour) => {
              const seance = jour.workoutId ? data?.find((s) => s.id === jour.workoutId) : null;
              const couleur = seance ? (seance.couleur ?? '#44D62C') : '#22d3ee'; // cyan = repos
              return (
                <View key={jour.id} className="flex-row items-center justify-end gap-3 mb-3">
                  <Text className="text-muted text-xs">#{jour.position + 1}</Text>
                  <View className="relative">
                    <LinearGradient
                      colors={['#26262A', '#161618']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      className="w-14 h-14 rounded-2xl items-center justify-center border"
                      style={{ borderColor: `${couleur}99`, boxShadow: `0px 5px 14px rgba(0,0,0,0.5), 0px 0px 5px ${couleur}66` }}
                    >
                      {seance ? (
                        seance.icon ? (
                          <MaterialCommunityIcons name={seance.icon} size={30} color={couleur} />
                        ) : (
                          <View className="w-8 h-8 rounded-full" style={{ backgroundColor: couleur }} />
                        )
                      ) : (
                        <MaterialCommunityIcons name="sleep" size={26} color={couleur} />
                      )}
                    </LinearGradient>
                    <Pressable
                      onPress={() => mutation_suppr_cycle.mutate(jour.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full items-center justify-center"
                      style={{
                        backgroundColor: '#1A1012',
                        borderWidth: 1,
                        borderColor: 'rgba(239,68,68,0.7)',
                        boxShadow: '0px 0px 6px rgba(239,68,68,0.5)',
                      }}
                    >
                      <MaterialCommunityIcons name="close" size={13} color="#ef4444" />
                    </Pressable>
                  </View>
                </View>
              );
            })}

            {/* repos de fin de cycle : tuile active, au-dessus du + vert, supprimable.
                visible seulement s'il y a au moins un jour dans le cycle ET qu'il est activé */}
            {cycle?.length > 0 && profile?.cycleEndRest && (
              <View className="flex-row items-center justify-end gap-3 mb-3">
                <Text className="text-muted text-xs">repos de fin de cycle</Text>
                <View className="relative">
                  <LinearGradient
                    colors={['#26262A', '#161618']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    className="w-14 h-14 rounded-2xl items-center justify-center border"
                    style={{ borderColor: '#22d3ee99', boxShadow: '0px 5px 14px rgba(0,0,0,0.5), 0px 0px 5px #22d3ee66' }}
                  >
                    <MaterialCommunityIcons name="sleep" size={26} color="#22d3ee" />
                  </LinearGradient>
                  <Pressable
                    onPress={() => mutation_endrest_cycle.mutate(false)}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full items-center justify-center"
                    style={{
                      backgroundColor: '#1A1012',
                      borderWidth: 1,
                      borderColor: 'rgba(239,68,68,0.7)',
                      boxShadow: '0px 0px 6px rgba(239,68,68,0.5)',
                    }}
                  >
                    <MaterialCommunityIcons name="close" size={13} color="#ef4444" />
                  </Pressable>
                </View>
              </View>
            )}

            {/* la case vide = zone de drop pour ajouter un jour à la fin.
                key = longueur du cycle → la case se remonte à chaque ajout/suppression
                et se re-mesure (sinon sa position enregistrée reste périmée) */}
            <CaseVide innerRef={caseVideRef} />

            {/* fantôme bleu : réactiver le repos de fin, placé SOUS le + vert */}
            {cycle?.length > 0 && !profile?.cycleEndRest && (
              <Pressable
                onPress={() => mutation_endrest_cycle.mutate(true)}
                className="flex-row items-center justify-end gap-3 mt-3"
                style={{ width: 150 }}
              >
                <Text className="text-muted text-xs text-right" style={{ flex: 1 }}>clique pour crée un repos de fin de cycle</Text>
                <View
                  className="w-14 h-14 rounded-2xl items-center justify-center"
                  style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(34,211,238,0.5)' }}
                >
                  <MaterialCommunityIcons name="plus" size={20} color="#22d3ee" />
                </View>
              </Pressable>
            )}
          </ScrollView>
          </View>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center', paddingTop: 8, paddingHorizontal: 8, paddingBottom: 120 }}>
          <Text className="text-muted text-xs uppercase tracking-widest mb-4 text-center">Mes exercices</Text>

          <View className="flex-row flex-wrap justify-center gap-4">
            {exos?.map((exo) => (
              <View key={exo.id} className="relative items-center w-24">
                <LinearGradient
                  colors={['#26262A', '#161618']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  className="w-24 h-28 rounded-2xl items-center justify-center border border-white/10"
                  style={{ boxShadow: '0px 5px 14px rgba(0,0,0,0.5)' }}
                >
                  <MaterialCommunityIcons name={exo.icon ?? 'dumbbell'} size={34} color="#44D62C" />
                  <Text className="text-foreground text-sm font-semibold mt-2 text-center px-1" numberOfLines={2}>
                    {exo.name}
                  </Text>
                </LinearGradient>
                <Pressable
                  onPress={() => mutation_suppr_exo.mutate(exo.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: '#1A1012',
                    borderWidth: 1,
                    borderColor: 'rgba(239,68,68,0.7)',
                    boxShadow: '0px 0px 6px rgba(239,68,68,0.5)',
                  }}
                >
                  <MaterialCommunityIcons name="close" size={13} color="#ef4444" />
                </Pressable>
              </View>
            ))}
          </View>

          {/* message si aucun exercice */}
          {(!exos || exos.length === 0) && (
            <View className="items-center justify-center mt-20">
              <MaterialCommunityIcons name="arm-flex" size={48} color="#8E8E93" />
              <Text className="text-muted mt-3">Aucun exercice. Crée ton premier !</Text>
            </View>
          )}
        </ScrollView>
      )}
    </LinearGradient>

    {/* clone flottant pendant le drag : par-dessus TOUT l'écran (jamais coupé par un ScrollView) */}
    {seanceDraggee && (
      <Animated.View
        pointerEvents="none"
        style={[{ position: 'absolute', top: 0, left: 0, zIndex: 100 }, styleClone]}
      >
        <LinearGradient
          colors={['#26262A', '#161618']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="w-16 h-16 rounded-2xl items-center justify-center border"
          style={{ borderColor: `${couleurClone}99`, boxShadow: `0px 5px 16px rgba(0,0,0,0.55), 0px 0px 9px ${couleurClone}88` }}
        >
          {seanceDraggee.icon ? (
            <MaterialCommunityIcons name={seanceDraggee.icon} size={30} color={couleurClone} />
          ) : (
            <View className="w-8 h-8 rounded-full" style={{ backgroundColor: couleurClone }} />
          )}
        </LinearGradient>
      </Animated.View>
    )}
   </View>
  );
}

function PastilleDraggable({ seance, dragX, dragY, onDragStart, onDrop, supprimerJour, ouvrirExercices }) {

  const couleur = seance.couleur ?? '#44D62C';

  // le geste pilote la position du clone (dragX/dragY) et signale le début/fin du drag.
  // l'original NE bouge PAS (il reste dans le ScrollView) : c'est le clone flottant qui suit le doigt.
  const pan = Gesture.Pan()
    .onStart((event) => {
      dragX.value = event.absoluteX;
      dragY.value = event.absoluteY;
      runOnJS(onDragStart)(seance);
    })
    .onChange((event) => {
      dragX.value = event.absoluteX;
      dragY.value = event.absoluteY;
    })
    .onEnd((event) => {
      runOnJS(onDrop)(event.absoluteX, event.absoluteY, seance.id);
    });

  return (
    <GestureDetector gesture={pan}>
      <View className="items-center w-20">
        <View className="relative">
          <Pressable onPress={ouvrirExercices}>
            <LinearGradient
              colors={['#26262A', '#161618']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              className="w-16 h-16 rounded-2xl items-center justify-center border"
              style={{ borderColor: `${couleur}99`, boxShadow: `0px 5px 14px rgba(0,0,0,0.5), 0px 0px 5px ${couleur}66` }}
            >
              {seance.icon ? (
                <MaterialCommunityIcons name={seance.icon} size={30} color={couleur} />
              ) : (
                <View className="w-8 h-8 rounded-full" style={{ backgroundColor: couleur }} />
              )}
            </LinearGradient>
          </Pressable>
          {seance.id != null && (
            <Pressable
              onPress={() => supprimerJour(seance.id)}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full items-center justify-center"
              style={{
                backgroundColor: '#1A1012',
                borderWidth: 1,
                borderColor: 'rgba(239,68,68,0.7)',
                boxShadow: '0px 0px 6px rgba(239,68,68,0.5)',
              }}
            >
              <MaterialCommunityIcons name="close" size={13} color="#ef4444" />
            </Pressable>
          )}
        </View>
        <Text className="text-muted text-xs mt-2 text-center" numberOfLines={1}>{seance.name}</Text>
      </View>
    </GestureDetector>
  );
}

// case vide en bas du cycle : zone de drop pour ajouter un nouveau jour.
// innerRef = ref donnée par le parent, qui mesure cette case au moment du lâcher
function CaseVide({ innerRef }) {
  return (
    <View className="flex-row items-center justify-end gap-3 mb-3">
      <Text className="text-muted text-xs">+</Text>
      <View
        ref={innerRef}
        className="w-14 h-14 rounded-2xl items-center justify-center"
        style={{
          borderWidth: 1,
          borderStyle: 'dashed',
          borderColor: 'rgba(68,214,44,0.7)',
          boxShadow: '0px 0px 5px rgba(68,214,44,0.4)',
        }}
      >
        <MaterialCommunityIcons name="plus" size={24} color="#44D62C" />
      </View>
    </View>
  );
}

