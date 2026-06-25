import { View, Text, Pressable, TextInput, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api, { setAuthToken } from '../api/client';
import { useState } from 'react';

// style commun des champs de saisie (carte sombre + liseré discret)
const inputStyle = { borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' };

export default function LoginScreen() {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [mdp, setMdp] = useState('');
  const [popup, setPoppup] = useState(false);
  const [emailInscription, setEmailInscription] = useState('');
  const [mdpInscription, setMdpInscription] = useState('');
  const [mdpConfirm, setMdpConfirm] = useState('');

  const mutation_login = useMutation({
    mutationFn: (credentials) => api.post('auth/login', credentials),
    onSuccess: (res) => {
      const token = res.data.data.token;
      setAuthToken(token);
      // on rafraîchit le profil → App voit qu'on est connecté et affiche l'app
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const mutation_signup = useMutation({
    mutationFn: (infos) => api.post('auth/signup', infos),
    onSuccess: (res) => {
      const token = res.data.data.token;
      setAuthToken(token);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setPoppup(false);
    },
  });

  function creation_compte() {
    if (mdpInscription != mdpConfirm) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    mutation_signup.mutate({
      fullName: null,
      email: emailInscription,
      password: mdpInscription,
      passwordConfirmation: mdpConfirm,
    });
  }

  return (
    <LinearGradient colors={['#2b2b2b', '#1d1d1d', '#000000']} style={{ flex: 1 }}>
      <View className="flex-1 items-center justify-center px-6">
        <View
          className="w-20 h-20 rounded-full items-center justify-center mb-6"
          style={{ backgroundColor: 'rgba(68,214,44,0.12)', borderWidth: 1, borderColor: 'rgba(68,214,44,0.5)' }}
        >
          <MaterialCommunityIcons name="dumbbell" size={40} color="#44D62C" />
        </View>
        <Text className="text-foreground text-3xl font-bold mb-1">Bienvenue</Text>
        <Text className="text-muted mb-8">Connecte-toi pour continuer</Text>

        <View className="w-80">
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="email"
            placeholderTextColor="#8E8E93"
            autoCapitalize="none"
            style={inputStyle}
            className="bg-card text-foreground rounded-xl px-4 py-3 mb-3"
          />
          <TextInput
            value={mdp}
            onChangeText={setMdp}
            placeholder="mot de passe"
            placeholderTextColor="#8E8E93"
            secureTextEntry
            style={inputStyle}
            className="bg-card text-foreground rounded-xl px-4 py-3 mb-2"
          />
          <Pressable
            className="bg-accent rounded-full py-4 mt-2 items-center"
            onPress={() => mutation_login.mutate({ email, password: mdp })}
          >
            <Text className="text-background font-bold text-base">Se connecter</Text>
          </Pressable>
        </View>

        <Pressable onPress={() => setPoppup(true)} className="mt-6">
          <Text className="text-muted">
            Pas encore de compte ? <Text className="text-accent font-semibold">Inscris-toi</Text>
          </Text>
        </Pressable>

        <Modal visible={popup} animationType="slide">
          <LinearGradient colors={['#2b2b2b', '#1d1d1d', '#000000']} style={{ flex: 1 }}>
            <View className="flex-1 items-center justify-center px-6">
              <View
                className="w-20 h-20 rounded-full items-center justify-center mb-6"
                style={{ backgroundColor: 'rgba(68,214,44,0.12)', borderWidth: 1, borderColor: 'rgba(68,214,44,0.5)' }}
              >
                <MaterialCommunityIcons name="account-plus" size={40} color="#44D62C" />
              </View>
              <Text className="text-foreground text-3xl font-bold mb-8">Inscription</Text>

              <View className="w-80">
                <TextInput
                  value={emailInscription}
                  onChangeText={setEmailInscription}
                  placeholder="email"
                  placeholderTextColor="#8E8E93"
                  autoCapitalize="none"
                  style={inputStyle}
                  className="bg-card text-foreground rounded-xl px-4 py-3 mb-3"
                />
                <TextInput
                  value={mdpInscription}
                  onChangeText={setMdpInscription}
                  placeholder="mot de passe"
                  placeholderTextColor="#8E8E93"
                  secureTextEntry
                  style={inputStyle}
                  className="bg-card text-foreground rounded-xl px-4 py-3 mb-3"
                />
                <TextInput
                  value={mdpConfirm}
                  onChangeText={setMdpConfirm}
                  placeholder="confirmer le mot de passe"
                  placeholderTextColor="#8E8E93"
                  secureTextEntry
                  style={inputStyle}
                  className="bg-card text-foreground rounded-xl px-4 py-3 mb-2"
                />
                <Pressable className="bg-accent rounded-full py-4 mt-2 items-center" onPress={creation_compte}>
                  <Text className="text-background font-bold text-base">Créer le compte</Text>
                </Pressable>
              </View>

              <Pressable onPress={() => setPoppup(false)} className="mt-6">
                <Text className="text-muted">Annuler</Text>
              </Pressable>
            </View>
          </LinearGradient>
        </Modal>
      </View>
    </LinearGradient>
  );
}
