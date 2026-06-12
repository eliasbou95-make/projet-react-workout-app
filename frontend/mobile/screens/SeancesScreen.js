import { useRef, useState  } from 'react';
import { View, Text, Pressable, Modal, TextInput  } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useMutation ,useQuery, useQueryClient} from '@tanstack/react-query';
import api from '../api/client';


export default function SeancesScreen() {
  const [ongletActif, setOngletActif] = useState('gestion');
  const [modalVisible,setModalVisible] = useState(false);
  const [nom , setNom] = useState("");
  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const zones = useRef({});
  const queryClient = useQueryClient();
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

  const {data,isLoading} = useQuery({
    queryKey: ['workouts'],
    queryFn: () => api.get('workouts').then((res) => 
    res.data),

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
        return rect;
      }
    }
    return null;
  }

  function ajouterSeance() {
    mutation_ajout.mutate({name:nom})
    setNom('')
    setModalVisible(false);
  }
  

  return (
    <View className="flex-1 bg-background pt-12 px-4">
      {/* Sous-onglets en haut */}
      <View className="flex-row justify-center gap-8 mb-4">
        <Pressable onPress={() => setOngletActif('gestion')}>
          <Text className="text-foreground">Gestion</Text>
        </Pressable>
        <Pressable onPress={() => setOngletActif('historique')}>
          <Text className="text-foreground">Historique</Text>
        </Pressable>
      </View>

      <Pressable onPress={() => setModalVisible(true)} className="mb-4">
        <Text className='text-foreground'>Nouvelle Séance</Text>
      </Pressable>

      {/* popup ajouter séance */}
      <Modal visible={modalVisible} animationType="slide">
        <View className="flex-1 items-center justify-center bg-background">
          <Text className='text-foreground'>Ajouter Séance</Text>
          <TextInput
            value={nom}
            onChangeText={setNom}
            placeholder="nom de la séance"
            placeholderTextColor="#8E8E93"
            className="text-foreground border border-muted rounded px-3 py-2 w-64"
          />
          <Text className='text-foreground'>{nom}</Text>
          <Pressable onPress={ajouterSeance}>
            <Text className='text-foreground'>Crée</Text>
          </Pressable>
          <Pressable onPress={() => setModalVisible(false)}>
            <Text className='text-foreground'>Fermer</Text>
          </Pressable>
        </View>
      </Modal>
     

      {ongletActif === 'gestion' ? (
        <View className="flex-1 flex-row">
          <View className="flex-1 items-center">
            <View className="flex-row flex-wrap gap-3">
              {data?.map((seance) => (
                <PastilleDraggable key={seance.id} seance={seance} trouverJour={trouverJour} supprimerJour={(id) => mutation_suppresion.mutate(id)} />
              ))}
            </View>
          </View>

          {/*les jours de la semaine */}
          <View className="items-center">
            {jours.map((jour) => (
              <CaseJour key={jour} jour={jour} onMesure={enregistrerZone} className="items-center mb-3">
              </CaseJour>
            ))}
          </View>
        </View>
      ) : (
        <Text className="text-foreground">Contenu Historique</Text>
      )}
    </View>
  );
}

function PastilleDraggable({ seance, trouverJour , supprimerJour }) {

  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  const pan = Gesture.Pan().onChange((event) => {
    offsetX.value += event.changeX;
    offsetY.value += event.changeY;
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
          <View
            className="w-10 h-10 rounded-full"
            style={{ backgroundColor: seance.couleur ?? '#44D62C' }}
          />
          <Pressable onPress={() => supprimerJour(seance.id)} className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 items-center justify-center">
            <Text className="text-white text-[10px] leading-none">×</Text>
          </Pressable>
        </View>
        <Text className="text-foreground">{seance.name}</Text>
      </Animated.View>
    </GestureDetector>
  );
}

function CaseJour({ jour, onMesure }) {
  const ref = useRef(null);
  return (
    <View className="items-center mb-3">
      <View
        ref={ref}
        onLayout={() => {
          ref.current.measureInWindow((x, y, width, height) => {
            onMesure(jour, { x, y, width, height });
          });
        }}
        className="border border-muted rounded w-16 h-16"
      />
      <Text className="text-foreground text-xs"> {jour} </Text>
    </View>
  );
}
