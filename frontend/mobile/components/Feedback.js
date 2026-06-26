import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// transforme une erreur (axios) en message lisible pour l'utilisateur.
// - pas de réponse du serveur  -> souci de réseau
// - réponse avec un message     -> on affiche le message du backend
// - sinon                       -> message par défaut fourni par l'écran
export function messageErreur(err, defaut = 'Une erreur est survenue.') {
  if (!err?.response) return 'Pas de connexion au serveur. Vérifie ta connexion.';
  return (
    err?.response?.data?.message ??
    err?.response?.data?.errors?.[0]?.message ??
    defaut
  );
}

// petite ligne de feedback : succès (vert) ou erreur (rouge).
// usage : const [msg, setMsg] = useState(null);  puis  <Feedback msg={msg} />
// avec msg de la forme { type: 'ok' | 'err', text: '...' }
export default function Feedback({ msg }) {
  if (!msg) return null;
  const couleur = msg.type === 'ok' ? '#44D62C' : '#ef4444';
  return (
    <View className="flex-row items-center gap-2 mb-3">
      <MaterialCommunityIcons
        name={msg.type === 'ok' ? 'check-circle' : 'alert-circle'}
        size={16}
        color={couleur}
      />
      <Text style={{ color: couleur, fontSize: 13, flex: 1 }}>{msg.text}</Text>
    </View>
  );
}
