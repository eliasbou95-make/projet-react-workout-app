import { useRef, useState } from 'react';
import { View, Text, Pressable, Modal, TextInput, ScrollView, Platform, StatusBar  } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, runOnJS, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Calendar } from 'react-native-calendars';
import { useMutation ,useQuery, useQueryClient} from '@tanstack/react-query';
import api from '../api/client';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Feedback, { messageErreur } from '../components/Feedback';

const ICONES = [
  // muscu / force
  'dumbbell', 'weight-lifter', 'arm-flex', 'arm-flex-outline', 'weight', 'kettlebell', 'weight-kilogram',
  // cardio / déplacement
  'run', 'run-fast', 'walk', 'bike', 'swim', 'rowing', 'stairs-up', 'jump-rope',
  // souplesse / arts martiaux
  'yoga', 'meditation', 'karate', 'boxing-glove',
  // sports
  'soccer', 'basketball', 'tennis', 'volleyball', 'ski',
  // corps / divers
  'human-handsup', 'human-male', 'heart-pulse', 'fire',
];

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
  const [modalSection, setModalSection] = useState(false);   // modal de création d'une section
  const [nomSection, setNomSection] = useState("");
  const [sectionExo, setSectionExo] = useState(null);        // section choisie dans la modal exo (id ou null)
  const [sectionsRepliees, setSectionsRepliees] = useState({}); // { [id]: true } = classeur fermé
  const [seanceBloquee, setSeanceBloquee] = useState(null);   // séance qu'on tente de supprimer alors qu'elle est dans le cycle
  const [msgSeance, setMsgSeance] = useState(null);          // feedback de la modal "Nouvelle séance"
  const [msgExo, setMsgExo] = useState(null);                // feedback de la modal "Nouvel exercice"
  const [msgSection, setMsgSection] = useState(null);        // feedback de la modal "Nouvelle section"
  const [creationSeance, setCreationSeance] = useState(false); // création de séance en cours (anti double-clic)
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
    },
    onError: (err) => setMsgExo({ type: 'err', text: messageErreur(err, "Impossible de créer l'exercice.") })
  })

  const mutation_suppr_exo = useMutation({
    mutationFn: (id) => api.delete(`/exercise-definitions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exerciseDefinitions'] })
    }
  })

  // les classeurs (sections) de l'utilisateur
  const { data: sections } = useQuery({
    queryKey: ['sections'],
    queryFn: () => api.get('sections').then((res) => res.data),
  })

  const mutation_ajout_section = useMutation({
    mutationFn: (nouveau) => api.post('/sections', nouveau),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] })
    },
    onError: (err) => setMsgSection({ type: 'err', text: messageErreur(err, 'Impossible de créer la section.') })
  })

  const mutation_suppr_section = useMutation({
    mutationFn: (id) => api.delete(`/sections/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] })
      // les exos du classeur repassent "non classés" → on rafraîchit aussi le catalogue
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
    // Android : le doigt (absoluteY) est mesuré barre de statut comprise,
    // alors que measureInWindow part de sous la barre. On ramène le doigt
    // dans le même repère en retranchant la hauteur de la barre de statut.
    const sbH = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0;
    node.measureInWindow((zx, zy, zw, zh) => {
      const dedans = x >= zx && x <= zx + zw && (y - sbH) >= zy && (y - sbH) <= zy + zh;
      if (dedans) {
        mutation_cycle.mutate({
          position: cycle?.length ? cycle[cycle.length - 1].position + 1 : 0,
          workoutId,
        });
      }
    });
  }

  // suppression d'une séance : interdite si elle est programmée dans le cycle
  function demanderSuppressionSeance(id) {
    const programmee = cycle?.some((j) => j.workoutId === id);
    if (programmee) {
      setSeanceBloquee(data?.find((s) => s.id === id) ?? null);
    } else {
      mutation_suppresion.mutate(id);
    }
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
    setMsgSeance(null)
    // garde : on refuse une séance sans nom (sinon le backend renvoie une erreur)
    if (!nom.trim()) {
      return setMsgSeance({ type: 'err', text: 'Donne un nom à ta séance.' })
    }
    // garde : il faut aussi avoir choisi une icône
    if (!icone) {
      return setMsgSeance({ type: 'err', text: 'Choisis une icône pour ta séance.' })
    }
    setCreationSeance(true)
    try {
      const res = await mutation_ajout.mutateAsync({ name: nom.trim(), icon: icone })
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
    } catch (err) {
      setMsgSeance({ type: 'err', text: messageErreur(err, 'Impossible de créer la séance.') })
    } finally {
      setCreationSeance(false)
    }
  }

  // enregistre la fiche d'exercice et remet le formulaire à blanc ; renvoie false si le nom est vide
  function enregistrerExo() {
    setMsgExo(null)
    if (!nomExo.trim()) {
      setMsgExo({ type: 'err', text: "Donne un nom à l'exercice." })
      return false
    }
    if (!iconeExo) {
      setMsgExo({ type: 'err', text: "Choisis une icône pour l'exercice." })
      return false
    }
    mutation_ajout_exo.mutate({ name: nomExo.trim(), icon: iconeExo, sectionId: sectionExo })
    setNomExo('')
    setIconeExo(null)
    return true
  }

  // crée un classeur puis ferme la modal
  function creerSection() {
    setMsgSection(null)
    if (!nomSection.trim()) {
      return setMsgSection({ type: 'err', text: 'Donne un nom à la section.' })
    }
    mutation_ajout_section.mutate({ name: nomSection.trim() })
    setNomSection('')
    setModalSection(false)
  }

  // ouvre/ferme un classeur (id de section, ou '__none__' pour les non classés)
  // on préfixe la clé ('sel-...') pour que le sélecteur et le catalogue soient indépendants
  function basculerSection(id) {
    setSectionsRepliees((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // une ligne d'exercice dans le sélecteur (modale "Ajouter un exercice" d'une séance)
  function ligneExoSel(exo) {
    return (
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
    )
  }

  // une carte d'exercice du catalogue (réutilisée dans chaque classeur)
  function carteExo(exo) {
    return (
      <View key={exo.id} className="relative items-center w-24">
        <LinearGradient
          colors={['#26262A', '#161618']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="w-24 h-28 rounded-2xl items-center justify-center border border-white/10"
          style={{ boxShadow: '0px 5px 14px rgba(0,0,0,0.5)', overflow: 'hidden' }}
        >
          <MaterialCommunityIcons name={exo.icon ?? 'dumbbell'} size={34} color="#44D62C" />
          <Text className="text-foreground text-sm font-semibold mt-2 text-center px-1" numberOfLines={2}>
            {exo.name}
          </Text>
        </LinearGradient>
        <Pressable
          onPress={() => mutation_suppr_exo.mutate(exo.id)}
          hitSlop={10}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full items-center justify-center"
          style={{
            backgroundColor: 'rgba(18,18,20,0.92)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.14)',
          }}
        >
          <MaterialCommunityIcons name="close" size={11} color="#8E8E93" />
        </Pressable>
      </View>
    )
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

      {ongletActif === 'gestion' ? (
        <Pressable onPress={() => { setMsgSeance(null); setModalVisible(true); }} className="self-center mb-7">
          <LinearGradient
            colors={['#1E1E20', '#0D0D0E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            className="flex-row items-center gap-2 rounded-2xl py-3.5 px-8 border border-accent/60"
            style={{ boxShadow: '0px 5px 14px rgba(0,0,0,0.5), 0px 0px 5px rgba(68,214,44,0.4)', overflow: 'hidden' }}
          >
            <MaterialCommunityIcons name="plus" size={22} color="#44D62C" />
            <Text className="text-accent font-bold text-base">Nouvelle séance</Text>
          </LinearGradient>
        </Pressable>
      ) : (
        <View className="flex-row items-center justify-center gap-3 mb-7">
          {/* bouton principal : nouvel exercice */}
          <Pressable onPress={() => { setMsgExo(null); setSectionExo(null); setModalExo(true); }}>
            <LinearGradient
              colors={['#1E1E20', '#0D0D0E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              className="flex-row items-center gap-2 rounded-2xl py-3.5 px-8 border border-accent/60"
              style={{ boxShadow: '0px 5px 14px rgba(0,0,0,0.5), 0px 0px 5px rgba(68,214,44,0.4)', overflow: 'hidden' }}
            >
              <MaterialCommunityIcons name="plus" size={22} color="#44D62C" />
              <Text className="text-accent font-bold text-base">Nouvel exercice</Text>
            </LinearGradient>
          </Pressable>
          {/* petit bouton secondaire : nouvelle section */}
          <Pressable onPress={() => { setMsgSection(null); setModalSection(true); }}>
            <LinearGradient
              colors={['#1E1E20', '#0D0D0E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              className="flex-row items-center gap-1.5 rounded-2xl py-2.5 px-4 border border-white/15"
              style={{ boxShadow: '0px 5px 14px rgba(0,0,0,0.5)', overflow: 'hidden' }}
            >
              <MaterialCommunityIcons name="folder-plus" size={18} color="#8E8E93" />
              <Text className="text-muted font-semibold text-sm">Section</Text>
            </LinearGradient>
          </Pressable>
        </View>
      )}

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
                style={{ boxShadow: '0px 5px 14px rgba(0,0,0,0.5), 0px 0px 5px rgba(68,214,44,0.45)', overflow: 'hidden' }}
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
            <GrilleIcones valeur={icone} onChoisir={setIcone} />

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
            <Feedback msg={msgSeance} />
            <Pressable onPress={ajouterSeance} disabled={creationSeance} className="mb-3">
              <LinearGradient
                colors={['#1E1E20', '#0D0D0E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                className="rounded-xl py-4 items-center border border-accent/60"
                style={{ boxShadow: '0px 5px 14px rgba(0,0,0,0.5), 0px 0px 5px rgba(68,214,44,0.4)', opacity: creationSeance ? 0.6 : 1, overflow: 'hidden' }}
              >
                <Text className="text-accent font-bold text-base">{creationSeance ? 'Création…' : 'Créer la séance'}</Text>
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
                style={{ borderColor: `${(workoutOuvert?.couleur ?? '#44D62C')}99`, boxShadow: `0px 5px 14px rgba(0,0,0,0.5), 0px 0px 5px ${(workoutOuvert?.couleur ?? '#44D62C')}66`, overflow: 'hidden' }}
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
                style={{ boxShadow: '0px 5px 14px rgba(0,0,0,0.5), 0px 0px 5px rgba(68,214,44,0.45)', overflow: 'hidden' }}
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
            <GrilleIcones valeur={iconeExo} onChoisir={setIconeExo} />

            {/* Section (classeur de rangement) */}
            <Text className="text-muted text-xs uppercase tracking-widest mb-2">Section</Text>
            <View className="flex-row flex-wrap gap-2 mb-6">
              {/* aucune section */}
              <Pressable onPress={() => setSectionExo(null)}>
                <View
                  className={`rounded-full px-4 py-2 border ${sectionExo == null ? 'border-accent/70' : 'border-white/10'}`}
                  style={sectionExo == null ? { backgroundColor: 'rgba(68,214,44,0.13)' } : null}
                >
                  <Text className={sectionExo == null ? 'text-accent font-semibold' : 'text-muted'}>Aucune</Text>
                </View>
              </Pressable>
              {/* une pastille par classeur existant */}
              {sections?.map((s) => {
                const actif = sectionExo === s.id;
                return (
                  <Pressable key={s.id} onPress={() => setSectionExo(s.id)}>
                    <View
                      className={`rounded-full px-4 py-2 border ${actif ? 'border-accent/70' : 'border-white/10'}`}
                      style={actif ? { backgroundColor: 'rgba(68,214,44,0.13)' } : null}
                    >
                      <Text className={actif ? 'text-accent font-semibold' : 'text-muted'}>{s.name}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {/* Boutons : "Créer" (ferme) + "+" (crée et enchaîne un autre) */}
            <Feedback msg={msgExo} />
            <View className="flex-row gap-3 mb-2">
              <Pressable onPress={creerExo} className="flex-1">
                <LinearGradient
                  colors={['#1E1E20', '#0D0D0E']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  className="rounded-xl py-4 items-center border border-accent/60"
                  style={{ boxShadow: '0px 5px 14px rgba(0,0,0,0.5), 0px 0px 5px rgba(68,214,44,0.4)', overflow: 'hidden' }}
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
                  style={{ boxShadow: '0px 5px 14px rgba(0,0,0,0.5), 0px 0px 5px rgba(68,214,44,0.4)', overflow: 'hidden' }}
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

      {/* modale : suppression bloquée (séance encore dans le cycle) */}
      <Modal visible={!!seanceBloquee} transparent animationType="fade">
        <Pressable
          onPress={() => setSeanceBloquee(null)}
          className="flex-1 items-center justify-center px-8"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation?.()}
            className="bg-card rounded-3xl px-7 py-8 items-center w-full border border-white/10"
            style={{ boxShadow: '0px 8px 28px rgba(0,0,0,0.6)' }}
          >
            <View
              className="w-16 h-16 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: 'rgba(251,191,36,0.12)', borderWidth: 1, borderColor: 'rgba(251,191,36,0.6)' }}
            >
              <MaterialCommunityIcons name="calendar-alert" size={32} color="#FBBF24" />
            </View>
            <Text className="text-foreground text-xl font-bold text-center mb-2">Séance programmée</Text>
            <Text className="text-muted text-center mb-7">
              « {seanceBloquee?.name} » est utilisée dans ton cycle. Retire-la d'abord du cycle (colonne de droite) pour pouvoir la supprimer.
            </Text>
            <Pressable onPress={() => setSeanceBloquee(null)} className="w-full">
              <LinearGradient
                colors={['#1E1E20', '#0D0D0E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                className="rounded-2xl py-4 items-center border border-accent/60"
                style={{ boxShadow: '0px 5px 14px rgba(0,0,0,0.5), 0px 0px 5px rgba(68,214,44,0.4)', overflow: 'hidden' }}
              >
                <Text className="text-accent font-bold text-base">Compris</Text>
              </LinearGradient>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* modale : créer un nouveau classeur (section) */}
      <Modal visible={modalSection} transparent animationType="fade">
        <Pressable
          onPress={() => setModalSection(false)}
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
                style={{ boxShadow: '0px 5px 14px rgba(0,0,0,0.5), 0px 0px 5px rgba(68,214,44,0.45)', overflow: 'hidden' }}
              >
                <MaterialCommunityIcons name="folder-plus" size={30} color="#44D62C" />
              </LinearGradient>
              <Text className="text-foreground text-2xl font-bold">Nouvelle section</Text>
            </View>

            <Text className="text-muted text-xs uppercase tracking-widest mb-2">Nom</Text>
            <TextInput
              value={nomSection}
              onChangeText={setNomSection}
              placeholder="ex : Biceps, Dos, Pectoraux..."
              placeholderTextColor="#8E8E93"
              className="text-foreground bg-card rounded-xl px-4 py-3 mb-6 border border-white/5"
            />

            <Feedback msg={msgSection} />
            <Pressable onPress={creerSection}>
              <LinearGradient
                colors={['#1E1E20', '#0D0D0E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                className="rounded-xl py-4 items-center border border-accent/60"
                style={{ boxShadow: '0px 5px 14px rgba(0,0,0,0.5), 0px 0px 5px rgba(68,214,44,0.4)', overflow: 'hidden' }}
              >
                <Text className="text-accent font-bold text-base">Créer la section</Text>
              </LinearGradient>
            </Pressable>
            <Pressable onPress={() => setModalSection(false)} className="py-2 mt-2 items-center">
              <Text className="text-muted">Annuler</Text>
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
              {/* un classeur par section */}
              {sections?.map((s) => {
                const exosSection = exos?.filter((e) => e.sectionId === s.id) ?? [];
                if (exosSection.length === 0) return null;   // dans le sélecteur on cache les classeurs vides
                const ferme = sectionsRepliees['sel-' + s.id];
                return (
                  <View key={s.id} className="mb-2">
                    <Pressable
                      onPress={() => basculerSection('sel-' + s.id)}
                      className="flex-row items-center gap-2 py-2 px-1 mb-1"
                    >
                      <MaterialCommunityIcons name={ferme ? 'chevron-right' : 'chevron-down'} size={20} color="#44D62C" />
                      <MaterialCommunityIcons name="folder" size={18} color="#44D62C" />
                      <Text className="text-foreground font-semibold flex-1">{s.name}</Text>
                      <Text className="text-muted text-xs">{exosSection.length}</Text>
                    </Pressable>
                    {!ferme && exosSection.map((exo) => ligneExoSel(exo))}
                  </View>
                );
              })}

              {/* exos non classés */}
              {(() => {
                const nonClasses = exos?.filter((e) => !e.sectionId) ?? [];
                if (nonClasses.length === 0) return null;
                const ferme = sectionsRepliees['sel-none'];
                return (
                  <View className="mb-2">
                    <Pressable
                      onPress={() => basculerSection('sel-none')}
                      className="flex-row items-center gap-2 py-2 px-1 mb-1"
                    >
                      <MaterialCommunityIcons name={ferme ? 'chevron-right' : 'chevron-down'} size={20} color="#8E8E93" />
                      <MaterialCommunityIcons name="folder-outline" size={18} color="#8E8E93" />
                      <Text className="text-foreground font-semibold flex-1">Non classés</Text>
                      <Text className="text-muted text-xs">{nonClasses.length}</Text>
                    </Pressable>
                    {!ferme && nonClasses.map((exo) => ligneExoSel(exo))}
                  </View>
                );
              })()}

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

          <View className="flex-1 pr-1">
            <Text className="text-muted text-xs uppercase tracking-widest mb-1 ml-1">Mes séances</Text>
            <Text className="text-muted mb-3 ml-1" style={{ fontSize: 11 }}>Glisse-les vers un jour →</Text>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 6, paddingRight: 6, paddingBottom: 120 }}>
            <View className="flex-row flex-wrap gap-3">
              {data?.map((seance) => (
                <PastilleDraggable
                  key={seance.id}
                  seance={seance}
                  dragX={dragX}
                  dragY={dragY}
                  onDragStart={demarrerDrag}
                  onDrop={deposer}
                  supprimerJour={demanderSuppressionSeance}
                  ouvrirExercices={() => setWorkoutOuvert(seance)}
                />
              ))}

              {/* pastille "jour de repos" : virtuelle (id null), toujours présente.
                  Lâchée sur le cycle → deposer(..., null) → workoutId null = repos */}
              <PastilleDraggable
                seance={{ id: null, name: 'Repos', icon: 'sleep', couleur: '#22d3ee' }}
                dragX={dragX}
                dragY={dragY}
                onDragStart={demarrerDrag}
                onDrop={deposer}
              />
            </View>
            </ScrollView>
          </View>

          {/* le cycle : une case par jour, en colonne, + une case vide en bas pour ajouter */}
          <ScrollView
            style={{ width: 116, marginRight: -15 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120, paddingTop: 12, paddingRight: 10, alignItems: 'flex-end' }}
          >
            <Text className="text-muted text-xs uppercase tracking-widest mb-3 mr-1">Cycle</Text>
            {cycle?.map((jour) => {
              const seance = jour.workoutId ? data?.find((s) => s.id === jour.workoutId) : null;
              const couleur = seance ? (seance.couleur ?? '#44D62C') : '#22d3ee'; // cyan = repos
              return (
                <View key={jour.id} className="relative mb-2.5">
                  <View
                    className="w-16 h-16 rounded-2xl items-center justify-center border"
                    style={{ borderColor: `${couleur}99`, backgroundColor: 'rgba(255,255,255,0.03)' }}
                  >
                    {seance ? (
                      seance.icon ? (
                        <MaterialCommunityIcons name={seance.icon} size={28} color={couleur} />
                      ) : (
                        <View className="w-7 h-7 rounded-full" style={{ backgroundColor: couleur }} />
                      )
                    ) : (
                      <MaterialCommunityIcons name="sleep" size={24} color={couleur} />
                    )}
                  </View>
                  <Pressable
                    onPress={() => mutation_suppr_cycle.mutate(jour.id)}
                    hitSlop={10}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full items-center justify-center"
                    style={{ backgroundColor: 'rgba(18,18,20,0.92)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)' }}
                  >
                    <MaterialCommunityIcons name="close" size={11} color="#8E8E93" />
                  </Pressable>
                </View>
              );
            })}

            {/* Repos de fin ACTIF → case dorée finale, et PLUS de case d'ajout derrière.
                Sinon → case d'ajout (+), puis l'option de clore le cycle par un repos de fin. */}
            {profile?.cycleEndRest && cycle?.length > 0 ? (
              <View className="relative mb-2.5">
                <View
                  className="w-16 h-16 rounded-2xl items-center justify-center border"
                  style={{ borderColor: '#FBBF24', backgroundColor: 'rgba(251,191,36,0.1)', boxShadow: '0px 0px 8px rgba(251,191,36,0.35)' }}
                >
                  <MaterialCommunityIcons name="beach" size={26} color="#FBBF24" />
                </View>
                <Pressable
                  onPress={() => mutation_endrest_cycle.mutate(false)}
                  hitSlop={10}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full items-center justify-center"
                  style={{ backgroundColor: 'rgba(18,18,20,0.92)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)' }}
                >
                  <MaterialCommunityIcons name="close" size={11} color="#8E8E93" />
                </Pressable>
              </View>
            ) : (
              <>
                {/* la case vide = zone de drop pour ajouter un jour à la fin */}
                <CaseVide innerRef={caseVideRef} />

                {/* option : clore le cycle par un repos de fin (seulement si le cycle a des jours) */}
                {cycle?.length > 0 && (
                  <Pressable onPress={() => mutation_endrest_cycle.mutate(true)} className="items-center mt-1" style={{ width: 64, alignSelf: 'flex-end' }}>
                    <View
                      className="items-center justify-center w-16 h-16 rounded-2xl"
                      style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(251,191,36,0.5)' }}
                    >
                      <MaterialCommunityIcons name="beach" size={26} color="#FBBF24" />
                    </View>
                    <Text className="font-semibold text-center mt-1.5" style={{ color: '#FBBF24', fontSize: 9 }}>
                      Ajouter un repos de fin de cycle
                    </Text>
                  </Pressable>
                )}
              </>
            )}
          </ScrollView>
          </View>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 8, paddingHorizontal: 12, paddingBottom: 120 }}>
          <Text className="text-muted text-xs uppercase tracking-widest mb-4 text-center">Mes exercices</Text>

          {/* un classeur par section */}
          {sections?.map((s) => {
            const exosSection = exos?.filter((e) => e.sectionId === s.id) ?? [];
            const ferme = sectionsRepliees[s.id];
            return (
              <View key={s.id} className="mb-4">
                {/* en-tête du classeur : flèche + dossier + nom + nombre + croix */}
                <Pressable
                  onPress={() => basculerSection(s.id)}
                  className="flex-row items-center gap-2 py-3 px-3 rounded-2xl border border-white/10"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                >
                  <MaterialCommunityIcons name={ferme ? 'chevron-right' : 'chevron-down'} size={22} color="#44D62C" />
                  <MaterialCommunityIcons name="folder" size={20} color="#44D62C" />
                  <Text className="text-foreground font-semibold flex-1">{s.name}</Text>
                  <Text className="text-muted text-xs mr-1">{exosSection.length}</Text>
                  <Pressable
                    onPress={() => mutation_suppr_section.mutate(s.id)}
                    hitSlop={8}
                    className="w-6 h-6 rounded-full items-center justify-center"
                    style={{ backgroundColor: 'rgba(18,18,20,0.92)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)' }}
                  >
                    <MaterialCommunityIcons name="close" size={12} color="#8E8E93" />
                  </Pressable>
                </Pressable>

                {/* contenu du classeur : les exos (cachés quand replié) */}
                {!ferme && (
                  <View className="flex-row flex-wrap gap-4 mt-3 px-1">
                    {exosSection.map((exo) => carteExo(exo))}
                    {exosSection.length === 0 && (
                      <Text className="text-muted text-sm px-2 py-3">Classeur vide</Text>
                    )}
                  </View>
                )}
              </View>
            );
          })}

          {/* classeur des exos non classés (n'apparaît que s'il y en a) */}
          {(() => {
            const nonClasses = exos?.filter((e) => !e.sectionId) ?? [];
            if (nonClasses.length === 0) return null;
            const ferme = sectionsRepliees['__none__'];
            return (
              <View className="mb-4">
                <Pressable
                  onPress={() => basculerSection('__none__')}
                  className="flex-row items-center gap-2 py-3 px-3 rounded-2xl border border-white/10"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                >
                  <MaterialCommunityIcons name={ferme ? 'chevron-right' : 'chevron-down'} size={22} color="#8E8E93" />
                  <MaterialCommunityIcons name="folder-outline" size={20} color="#8E8E93" />
                  <Text className="text-foreground font-semibold flex-1">Non classés</Text>
                  <Text className="text-muted text-xs">{nonClasses.length}</Text>
                </Pressable>
                {!ferme && (
                  <View className="flex-row flex-wrap gap-4 mt-3 px-1">
                    {nonClasses.map((exo) => carteExo(exo))}
                  </View>
                )}
              </View>
            );
          })()}

          {/* message si aucun exercice ET aucune section */}
          {(!exos || exos.length === 0) && (!sections || sections.length === 0) && (
            <View className="items-center justify-center mt-20">
              <MaterialCommunityIcons name="arm-flex" size={48} color="#8E8E93" />
              <Text className="text-muted mt-3 text-center">Aucun exercice. Crée ton premier !</Text>
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
          style={{ borderColor: `${couleurClone}99`, boxShadow: `0px 5px 16px rgba(0,0,0,0.55), 0px 0px 9px ${couleurClone}88`, overflow: 'hidden' }}
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

// grille d'icônes scrollable : on n'en voit que ~2 rangées, le reste se fond dans l'ombre
function GrilleIcones({ valeur, onChoisir }) {
  return (
    <ScrollView
      style={{ maxHeight: 164, marginBottom: 20 }}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
      contentContainerStyle={{ paddingBottom: 6 }}
    >
      <View className="flex-row flex-wrap gap-3">
        {ICONES.map((nomIcone) => {
          const actif = valeur === nomIcone;
          return (
            <Pressable key={nomIcone} onPress={() => onChoisir(nomIcone)}>
              <LinearGradient
                colors={['#26262A', '#161618']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                className={`w-14 h-14 rounded-2xl items-center justify-center border ${actif ? 'border-accent/70' : 'border-white/10'}`}
                style={[{ overflow: 'hidden' }, actif ? { boxShadow: '0px 0px 5px rgba(68,214,44,0.45)' } : null]}
              >
                <MaterialCommunityIcons name={nomIcone} size={26} color={actif ? '#44D62C' : '#8E8E93'} />
              </LinearGradient>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
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
      <View className="items-center w-16">
        <View className="relative">
          <Pressable onPress={ouvrirExercices}>
            <LinearGradient
              colors={['#26262A', '#161618']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              className="w-12 h-12 rounded-2xl items-center justify-center border"
              style={{ borderColor: `${couleur}99`, boxShadow: `0px 5px 14px rgba(0,0,0,0.5), 0px 0px 5px ${couleur}66`, overflow: 'hidden' }}
            >
              {seance.icon ? (
                <MaterialCommunityIcons name={seance.icon} size={24} color={couleur} />
              ) : (
                <View className="w-6 h-6 rounded-full" style={{ backgroundColor: couleur }} />
              )}
            </LinearGradient>
          </Pressable>
          {seance.id != null && (
            <Pressable
              onPress={() => supprimerJour(seance.id)}
              hitSlop={8}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full items-center justify-center"
              style={{
                backgroundColor: 'rgba(18,18,20,0.92)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.14)',
              }}
            >
              <MaterialCommunityIcons name="close" size={11} color="#8E8E93" />
            </Pressable>
          )}
        </View>
        <Text className="text-muted mt-1.5 text-center" style={{ fontSize: 10 }} numberOfLines={1}>{seance.name}</Text>
      </View>
    </GestureDetector>
  );
}

// case vide en bas du cycle : zone de drop pour ajouter un nouveau jour.
// innerRef = ref donnée par le parent, qui mesure cette case au moment du lâcher
function CaseVide({ innerRef }) {
  return (
    <View
      ref={innerRef}
      className="items-center justify-center w-16 h-16 rounded-2xl mb-2.5"
      style={{
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: 'rgba(68,214,44,0.6)',
      }}
    >
      <MaterialCommunityIcons name="plus" size={24} color="#44D62C" />
    </View>
  );
}

