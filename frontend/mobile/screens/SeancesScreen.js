import { useRef, useState  } from 'react';
import { View, Text, Pressable, Modal, TextInput, ScrollView  } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, runOnJS, withTiming, ZoomIn, ZoomOut } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useMutation ,useQuery, useQueryClient} from '@tanstack/react-query';
import api from '../api/client';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const JOUR_VERS_NUMERO = {
  Lundi: 1,
  Mardi: 2,
  Mercredi: 3,
  Jeudi: 4,
  Vendredi: 5,
  Samedi: 6,
  Dimanche: 7,
};
const ICONES = ['dumbbell', 'arm-flex', 'run', 'weight-lifter', 'bike', 'yoga', 'human-handsup'];

export default function SeancesScreen() {
  const [ongletActif, setOngletActif] = useState('gestion');
  const [modalVisible,setModalVisible] = useState(false);
  const [nom , setNom] = useState("");
  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const zones = useRef({});
  const queryClient = useQueryClient();
  const [icone, setIcone] = useState(null);
  const [exercices, setExercices] = useState([]);
  const [workoutOuvert, setWorkoutOuvert] = useState(null);
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
  const mutation_schedules = useMutation({
    mutationFn: (nouveau) =>
      api.post('/schedules', nouveau),
    onSuccess:() => {
      queryClient.invalidateQueries({ queryKey: ['schedules']})
    }
  })
  const mutation_suppr_schedule = useMutation({
    mutationFn: (id) =>
      api.delete(`/schedules/${id}`),
    onSuccess:() => {
      queryClient.invalidateQueries({ queryKey: ['schedules']})
    }
  })

  const {data,isLoading} = useQuery({
    queryKey: ['workouts'],
    queryFn: () => api.get('workouts').then((res) => 
    res.data),
  })

  const { data: planning } = useQuery({
    queryKey: ['schedules'],
    queryFn: () => api.get('schedules').then((res) =>
    res.data),
  })

  const {data: exercisesDuWorkout} = useQuery({
    queryKey: ['exercises', workoutOuvert?.id],
    queryFn: () => api.get (`/workouts/${workoutOuvert.id}/exercises`).then((res)=> res.data),
    enabled: !!workoutOuvert,
  })
  

  function enregistrerZone(jour, rectangle) {
    zones.current[jour] = rectangle;
    console.log('Zone :', jour, rectangle);
  }

  function trouverJour(x, y) {
    for (const jour of Object.keys(zones.current)) {
      const rect = zones.current[jour];
      if (
        x >= rect.x &&
        x <= rect.x + rect.width &&
        y >= rect.y &&
        y <= rect.y + rect.height
      ) {
        return jour;
      }
    }
    return null;
  }

  function ajouterExercices() {
    setExercices([...exercices, {name: "", sets:""}])
  }

  function modifierExercice(index, champ, valeur) {
    const copie = [...exercices];
    copie[index] = {...copie[index], [champ] : valeur}
    setExercices(copie);
  }

  async function ajouterSeance() {

    const res = await mutation_ajout.mutateAsync({ name: nom, icon: icone })
    const workout = res.data

    for (const exo of exercices) {
      if (!exo.name.trim()) continue          
      await api.post(`/workouts/${workout.id}/exercises`, {
        name: exo.name,
        sets: exo.sets ? Number(exo.sets) : undefined,
      })
    }

    setNom('')
    setIcone(null)
    setExercices([])
    setModalVisible(false)
  }
  

  return (
    <LinearGradient
      colors={['#2b2b2b', '#1d1d1d', '#000000']}
      style={{ flex: 1, paddingTop: 48, paddingHorizontal: 16 }}
    >
      {/* Sous-onglets en haut */}
      <View className="items-center mb-6">
        <View className="flex-row gap-12">
          <Pressable
            onPress={() => { setOngletActif('gestion'); indicateur.value = 0; }}
            className="w-36 items-center py-2"
          >
            <Text className={`text-foreground text-xl ${ongletActif === 'gestion' ? 'font-bold' : ''}`}>
              Gestion
            </Text>
          </Pressable>
          <Pressable
            onPress={() => { setOngletActif('historique'); indicateur.value = 1; }}
            className="w-36 items-center py-2"
          >
            <Text className={`text-foreground text-xl ${ongletActif === 'historique' ? 'font-bold' : ''}`}>
              Historique
            </Text>
          </Pressable>
        </View>
        {/* ligne verte qui glisse sous l'onglet actif */}
        <View style={{ width: 336, height: 3 }}>
          <Animated.View
            style={[{ width: 144, height: 3, borderRadius: 3, backgroundColor: '#44D62C' }, styleIndicateur]}
          />
        </View>
      </View>

      <Pressable
        onPress={() => setModalVisible(true)}
        className="bg-accent rounded-full py-3 px-8 mb-6 self-center flex-row items-center gap-2"
      >
        <MaterialCommunityIcons name="plus" size={24} color="#0A0A0A" />
        <Text className="text-background font-bold text-lg">Nouvelle Séance</Text>
      </Pressable>

      {/* popup ajouter séance */}
      <Modal visible={modalVisible} animationType="slide">
        <LinearGradient colors={['#2b2b2b', '#1d1d1d', '#000000']} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 64 }}>
            <Text className="text-foreground text-2xl font-bold text-center mb-6">
              Nouvelle séance
            </Text>

            {/* Nom */}
            <Text className="text-muted mb-1">Nom</Text>
            <TextInput
              value={nom}
              onChangeText={setNom}
              placeholder="ex : Push, Legs..."
              placeholderTextColor="#8E8E93"
              className="text-foreground bg-card rounded-xl px-4 py-3 mb-5"
            />

            {/* Icône */}
            <Text className="text-muted mb-2">Icône</Text>
            <View className="flex-row flex-wrap gap-3 mb-5">
              {ICONES.map((nomIcone) => (
                <Pressable
                  key={nomIcone}
                  onPress={() => setIcone(nomIcone)}
                  className="w-14 h-14 rounded-xl items-center justify-center border-2"
                  style={{
                    borderColor: icone === nomIcone ? '#44D62C' : '#3A3A3A',
                    backgroundColor: icone === nomIcone ? 'rgba(68,214,44,0.12)' : 'transparent',
                  }}
                >
                  <MaterialCommunityIcons
                    name={nomIcone}
                    size={28}
                    color={icone === nomIcone ? '#44D62C' : '#FFFFFF'}
                  />
                </Pressable>
              ))}
            </View>

            {/* Exercices */}
            <Text className="text-muted mb-2">Exercices</Text>
            {exercices.map((exo, index) => (
              <View key={index} className="flex-row gap-2 mb-2">
                <TextInput
                  value={exo.name}
                  onChangeText={(texte) => modifierExercice(index, 'name', texte)}
                  placeholder="exercice"
                  placeholderTextColor="#8E8E93"
                  className="text-foreground bg-card rounded-xl px-3 py-2 flex-1"
                />
                <TextInput
                  value={exo.sets}
                  onChangeText={(texte) => modifierExercice(index, 'sets', texte)}
                  placeholder="séries"
                  placeholderTextColor="#8E8E93"
                  keyboardType="numeric"
                  className="text-foreground bg-card rounded-xl px-3 py-2 w-20"
                />
              </View>
            ))}
            <Pressable onPress={ajouterExercices} className="flex-row items-center gap-2 mt-1 mb-8">
              <MaterialCommunityIcons name="plus-circle-outline" size={20} color="#44D62C" />
              <Text className="text-accent">Ajouter un exercice</Text>
            </Pressable>

            {/* Boutons */}
            <Pressable onPress={ajouterSeance} className="bg-accent rounded-full py-3 items-center mb-3">
              <Text className="text-background font-bold text-lg">Créer la séance</Text>
            </Pressable>
            <Pressable onPress={() => setModalVisible(false)} className="py-2 items-center">
              <Text className="text-muted">Annuler</Text>
            </Pressable>
          </ScrollView>
        </LinearGradient>
      </Modal>

      {/* popup liste des exercices d'un workout */}
      <Modal visible={!!workoutOuvert} animationType="slide">
        <View className="flex-1 items-center justify-center bg-background">
          <Text className="text-foreground text-lg mb-3">
            Exercices de {workoutOuvert?.name}
          </Text>

          {exercisesDuWorkout?.map((exo) => (
            <View key={exo.id} className="flex-row gap-3 items-center mt-2">
              <Text className="text-foreground w-40">{exo.name}</Text>
              <Text className="text-foreground">{exo.sets} séries</Text>
            </View>
          ))}

          <Pressable onPress={() => setWorkoutOuvert(null)} className="mt-6">
            <Text className="text-foreground">Fermer</Text>
          </Pressable>
        </View>
      </Modal>


      {ongletActif === 'gestion' ? (
        <View className="flex-1 flex-row">

          
          <View className="flex-1 items-center">
            <View className="flex-row flex-wrap gap-3">
              {data?.map((seance) => (
                <PastilleDraggable
                  key={seance.id}
                  seance={seance}
                  trouverJour={trouverJour}
                  supprimerJour={(id) => mutation_suppresion.mutate(id)}
                  planifier={(jour, workoutId) =>
                    mutation_schedules.mutate({ dayOfWeek: JOUR_VERS_NUMERO[jour], workoutId })
                  }
                  ouvrirExercices={() => setWorkoutOuvert(seance)}
                />
              ))}
            </View>
          </View>

          {/*les jours de la semaine */}
          <ScrollView
            style={{ width: 150 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {jours.map((jour) => (
              <CaseJour
                key={jour}
                jour={jour}
                onMesure={enregistrerZone}
                planning={planning}
                seances={data}
                supprimerSchedule={(id) => mutation_suppr_schedule.mutate(id)}
              />

            ))}
          </ScrollView>
        </View>
      ) : (
        <Text className="text-foreground">Contenu Historique</Text>
      )}
    </LinearGradient>
  );
}

function PastilleDraggable({ seance, trouverJour , supprimerJour , planifier , ouvrirExercices }) {

  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  function deposer(x, y) {
    const jour = trouverJour(x, y);   
    if (jour) {
      planifier(jour, seance.id);     
    }
  }

  const pan = Gesture.Pan()
    .onChange((event) => {
      offsetX.value += event.changeX;
      offsetY.value += event.changeY;
    })
    .onEnd((event) => {
      runOnJS(deposer)(event.absoluteX, event.absoluteY);  
      offsetX.value = 0;   
      offsetY.value = 0;
    });


  const styleAnime = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value },
      { translateY: offsetY.value },
    ],
  }));

  return (

    
    <GestureDetector gesture={pan}>
      <Animated.View className="items-center" style={styleAnime}>
        <View className="relative">
          <Pressable
            onPress={ouvrirExercices}
            className="w-10 h-10 rounded-full items-center justify-center"
          >
            {seance.icon ? (
              <MaterialCommunityIcons name={seance.icon} size={36} color={seance.couleur ?? '#44D62C'} />
            ) : (
              <View className="w-10 h-10 rounded-full" style={{ backgroundColor: seance.couleur ?? '#44D62C' }} />
            )}
          </Pressable>
          <Pressable onPress={() => supprimerJour(seance.id)} className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 items-center justify-center">
            <Text className="text-white text-[10px] leading-none">×</Text>
          </Pressable>
        </View>
        <Text className="text-foreground">{seance.name}</Text>
      </Animated.View>
    </GestureDetector>
  );
}

function CaseJour({ jour, onMesure, planning, seances, supprimerSchedule }) {
  const ref = useRef(null);

  const planif = planning?.find((p) => p.dayOfWeek === JOUR_VERS_NUMERO[jour]);
  const seance = planif ? seances?.find((s) => s.id === planif.workoutId) : null;

  return (
    <View className="flex-row items-center justify-end gap-3 mb-3">
      <Text className="text-foreground text-sm">{jour}</Text>
      <View
        ref={ref}
        onLayout={() => {
          ref.current.measureInWindow((x, y, width, height) => {
            onMesure(jour, { x, y, width, height });
          });
        }}
        className="w-14 h-14 rounded-2xl items-center justify-center"
        style={{
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.12)',
          backgroundColor: 'rgba(255,255,255,0.04)',
        }}
      >
        {seance && planif && (
          <Animated.View
            entering={ZoomIn.springify().damping(12)}
            exiting={ZoomOut}
            className="relative w-12 h-12 items-center justify-center"
          >
            {seance.icon ? (
              <MaterialCommunityIcons name={seance.icon} size={38} color={seance.couleur ?? '#44D62C'} />
            ) : (
              <View className="w-10 h-10 rounded-full" style={{ backgroundColor: seance.couleur ?? '#44D62C' }} />
            )}
            <Pressable
              onPress={() => supprimerSchedule(planif.id)}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 items-center justify-center"
            >
              <Text className="text-white text-[10px] leading-none">×</Text>
            </Pressable>
          </Animated.View>
        )}
      </View>
    </View>
  );
}
