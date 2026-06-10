import { useState } from 'react';
import { View, Text, Pressable, Modal, TextInput } from 'react-native';

export default function SeancesScreen() {
  const [ongletActif, setOngletActif] = useState('gestion');
  const [seances, setSeances] = useState([
  { id: 1, nom: 'Push', couleur: '#0f8000' },   
  { id: 2, nom: 'Pull', couleur: '#F59E0B' },   
  { id: 3, nom: 'Legs', couleur: '#22C55E' },   
]);
  const [modalVisible,setModalVisible] = useState(false);
  const [nom , setNom] = useState("");
  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  function ajouterSeance() {
    setSeances([...seances, {id: Date.now(), nom: nom, couleur:'#003cff'}])
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
              {seances.map((seance) => (
                <View key={seance.id} className="items-center">
                  <View
                    className="w-10 h-10 rounded-full"
                    style={{ backgroundColor: seance.couleur }}
                  />
                  <Text className="text-foreground">{seance.nom}</Text>
                </View>
              ))}
            </View>
          </View>

          {/*les jours de la semaine */}
          <View className="items-center">
            {jours.map((jour) => (
              <View key={jour} className="items-center mb-3">
                <View className="border border-muted rounded w-16 h-16" />
                <Text className="text-foreground text-xs"> {jour} </Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <Text className="text-foreground">Contenu Historique</Text>
      )}
    </View>
  );
}
