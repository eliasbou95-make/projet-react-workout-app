import { View, Text, Pressable, TextInput, Modal } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { setAuthToken } from '../api/client';
import { useState } from 'react';

export default function CompteScreen() {
  const [email, setEmail] = useState('');
  const [mdp, setMdp] = useState('');
  const queryClient = useQueryClient();
  const [popup, setPoppup] = useState(false)
  const [emailInscription, setEmailInscription] = useState('');
  const [mdpInscription, setMdpInscription] = useState('');
  const [mdpConfirm, setMdpConfirm] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('account/profile').then((res) => res.data.data),
  });

  const mutation_logout = useMutation({
    mutationFn: () => api.post('account/logout'),
    onSuccess: () => {
      setAuthToken(null);                                       // débranche axios + videra le coffre
      queryClient.invalidateQueries({ queryKey: ['profile'] }); // → profil vide → formulaire de login
    },
  });

  const mutation_login = useMutation({
    mutationFn: (credentials) => api.post('auth/login', credentials),
    onSuccess: (res) => {
      const token = res.data.data.token;                        
      setAuthToken(token);                                      
      queryClient.invalidateQueries({ queryKey: ['profile'] }); 
    },
  });

  const mutation_signup = useMutation({
    mutationFn: (infos) => api.post('auth/signup', infos),
    onSuccess: (res) => {
      const token = res.data.data.token;
      setAuthToken(token);
      queryClient.invalidateQueries({ queryKey: ['profile'] }); 
      setPoppup(false)
    }
  })

  function creation_compte() {
    if (mdpInscription != mdpConfirm) {
      alert ('Les mots de passe ne correspondent pas');
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
    <View className="flex-1 items-center justify-center bg-background px-6">
      {isLoading ? (
        <Text className="text-muted">Chargement...</Text>
      ) : data ? (
        <>
          <Text className="text-foreground text-2xl font-bold">{data.fullName}</Text>
          <Text className="text-muted mt-1">{data.email}</Text>
          <Pressable
            className="bg-accent rounded-full py-3 px-8 mt-6"
            onPress={() => mutation_logout.mutate()}
          >
            <Text className="text-background font-bold">Déconnexion</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text className="text-foreground text-2xl font-bold mb-4">Connexion</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="email"
            placeholderTextColor="#8E8E93"
            autoCapitalize="none"
            className="text-foreground border border-muted rounded px-3 py-2 w-64 mt-3"
          />
          <TextInput
            value={mdp}
            onChangeText={setMdp}
            placeholder="mot de passe"
            placeholderTextColor="#8E8E93"
            secureTextEntry
            className="text-foreground border border-muted rounded px-3 py-2 w-64 mt-3"
          />
          <Pressable
            className="bg-accent rounded-full py-3 px-8 mt-6"
            onPress={() => mutation_login.mutate({ email, password: mdp })}
          >
            <Text className="text-background font-bold">Se connecter</Text>
          </Pressable>

          <Pressable onPress={() => setPoppup(true)}>
            <Text className="text-muted underline mt-4">Vous n'avez pas de compte ?</Text>
          </Pressable>

          <Modal visible={popup} animationType="slide">
            <View className="flex-1 items-center justify-center bg-background px-6">
              <Text className="text-foreground text-2xl font-bold mb-4">Inscription</Text>
              <TextInput
                value={emailInscription}
                onChangeText={setEmailInscription}
                placeholder="email"
                placeholderTextColor="#8E8E93"
                autoCapitalize="none"
                className="text-foreground border border-muted rounded px-3 py-2 w-64 mt-3"
              />
              <TextInput
                value={mdpInscription}
                onChangeText={setMdpInscription}
                placeholder="mot de passe"
                placeholderTextColor="#8E8E93"
                secureTextEntry
                className="text-foreground border border-muted rounded px-3 py-2 w-64 mt-3"
              />
              <TextInput
                value={mdpConfirm}
                onChangeText={setMdpConfirm}
                placeholder="confirmer le mot de passe"
                placeholderTextColor="#8E8E93"
                secureTextEntry
                className="text-foreground border border-muted rounded px-3 py-2 w-64 mt-3"
              />
              <Pressable className="bg-accent rounded-full py-3 px-8 mt-6" onPress={creation_compte}>
                <Text className="text-background font-bold">Créer le compte</Text>
              </Pressable>
              <Pressable onPress={() => setPoppup(false)} className="mt-4">
                <Text className="text-muted">Fermer</Text>
              </Pressable>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
}
