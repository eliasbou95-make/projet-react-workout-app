import { View, Text, Pressable, TextInput, Modal, ScrollView } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api, { setAuthToken } from '../api/client';
import Feedback, { messageErreur } from '../components/Feedback';

const inputStyle = { borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' };

// une entrée du menu : icône + titre + sous-titre + chevron
function LigneMenu({ icone, couleur, titre, sousTitre, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center rounded-2xl px-4 py-4 mb-3 border"
      style={{ backgroundColor: '#18181B', borderColor: `${couleur}33` }}
    >
      <View className="w-11 h-11 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: `${couleur}1F`, borderWidth: 1, borderColor: `${couleur}66` }}>
        <MaterialCommunityIcons name={icone} size={22} color={couleur} />
      </View>
      <View className="flex-1">
        <Text className="text-foreground font-semibold text-base">{titre}</Text>
        <Text className="text-muted text-xs mt-0.5">{sousTitre}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={22} color="#8E8E93" />
    </Pressable>
  );
}

export default function GestionCompteScreen({ navigation }) {
  const queryClient = useQueryClient();
  const [vue, setVue] = useState('menu'); // 'menu' | 'password' | 'email' | 'delete'

  // --- mot de passe ---
  const [ancien, setAncien] = useState('');
  const [nouveau, setNouveau] = useState('');
  const [msgPwd, setMsgPwd] = useState(null);
  const mut_password = useMutation({
    mutationFn: ({ currentPassword, newPassword }) => api.patch('account/password', { currentPassword, newPassword }),
    onSuccess: () => { setMsgPwd({ type: 'ok', text: 'Mot de passe modifié ✅' }); setAncien(''); setNouveau(''); },
    onError: (err) => setMsgPwd({ type: 'err', text: messageErreur(err, 'Échec de la modification') }),
  });

  // --- email ---
  const [email, setEmail] = useState('');
  const [mdpEmail, setMdpEmail] = useState('');
  const [msgEmail, setMsgEmail] = useState(null);
  const mut_email = useMutation({
    mutationFn: ({ password, email }) => api.patch('account/email', { password, email }),
    onSuccess: () => {
      setMsgEmail({ type: 'ok', text: 'Adresse email modifiée ✅' });
      setEmail(''); setMdpEmail('');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (err) => setMsgEmail({ type: 'err', text: messageErreur(err, 'Échec de la modification') }),
  });

  // --- suppression du compte ---
  const [mdp1, setMdp1] = useState('');
  const [mdp2, setMdp2] = useState('');
  const [confirmSuppr, setConfirmSuppr] = useState(false);
  const [msgSuppr, setMsgSuppr] = useState(null);
  const mut_delete = useMutation({
    mutationFn: ({ password }) => api.delete('account/delete', { data: { password } }),
    onSuccess: async () => {
      setConfirmSuppr(false);
      await setAuthToken(null);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (err) => { setConfirmSuppr(false); setMsgSuppr({ type: 'err', text: messageErreur(err, 'Échec de la suppression') }); },
  });

  function demanderSuppression() {
    setMsgSuppr(null);
    if (!mdp1 || !mdp2) return setMsgSuppr({ type: 'err', text: 'Entre ton mot de passe deux fois.' });
    if (mdp1 !== mdp2) return setMsgSuppr({ type: 'err', text: 'Les deux mots de passe ne correspondent pas.' });
    setConfirmSuppr(true);
  }

  const titre = vue === 'password' ? 'Mot de passe'
    : vue === 'email' ? 'Adresse email'
    : vue === 'delete' ? 'Supprimer le compte'
    : 'Gestion du compte';

  return (
    <LinearGradient colors={['#2b2b2b', '#1d1d1d', '#000000']} style={{ flex: 1, paddingTop: 48, paddingHorizontal: 16 }}>
      {/* retour : vers le menu si on est dans une sous-page, sinon vers les Réglages */}
      <View className="flex-row items-center mb-6">
        <Pressable
          onPress={() => (vue === 'menu' ? navigation.goBack() : setVue('menu'))}
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
        >
          <MaterialCommunityIcons name="chevron-left" size={26} color="#FAFAFA" />
        </Pressable>
        <Text className="text-foreground text-2xl font-bold">{titre}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>

        {/* ===== MENU : 3 entrées ===== */}
        {vue === 'menu' && (
          <>
            <LigneMenu icone="lock-reset" couleur="#44D62C" titre="Modifier le mot de passe" sousTitre="Avec ton mot de passe actuel" onPress={() => { setMsgPwd(null); setVue('password'); }} />
            <LigneMenu icone="email-edit-outline" couleur="#22d3ee" titre="Modifier l'adresse email" sousTitre="Confirmation par mot de passe" onPress={() => { setMsgEmail(null); setVue('email'); }} />
            <LigneMenu icone="account-remove" couleur="#ef4444" titre="Supprimer le compte" sousTitre="Action définitive" onPress={() => { setMsgSuppr(null); setVue('delete'); }} />
          </>
        )}

        {/* ===== MOT DE PASSE ===== */}
        {vue === 'password' && (
          <View className="rounded-2xl px-4 py-4 border border-white/10" style={{ backgroundColor: '#18181B' }}>
            <Text className="text-muted text-sm mb-2">Mot de passe actuel</Text>
            <TextInput value={ancien} onChangeText={setAncien} secureTextEntry placeholder="••••••••" placeholderTextColor="#8E8E93" style={inputStyle} className="bg-card text-foreground rounded-xl px-4 py-3 mb-3" />
            <Text className="text-muted text-sm mb-2">Nouveau mot de passe</Text>
            <TextInput value={nouveau} onChangeText={setNouveau} secureTextEntry placeholder="8 caractères min." placeholderTextColor="#8E8E93" style={inputStyle} className="bg-card text-foreground rounded-xl px-4 py-3 mb-4" />
            <Feedback msg={msgPwd} />
            <Pressable onPress={() => { setMsgPwd(null); mut_password.mutate({ currentPassword: ancien, newPassword: nouveau }); }} disabled={mut_password.isPending || !ancien || !nouveau}>
              <LinearGradient colors={['#1E1E20', '#0D0D0E']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} className="rounded-xl py-3.5 items-center border border-accent/60" style={{ opacity: (mut_password.isPending || !ancien || !nouveau) ? 0.5 : 1 }}>
                <Text className="text-accent font-bold">{mut_password.isPending ? 'Modification…' : 'Modifier le mot de passe'}</Text>
              </LinearGradient>
            </Pressable>
          </View>
        )}

        {/* ===== EMAIL ===== */}
        {vue === 'email' && (
          <View className="rounded-2xl px-4 py-4 border border-white/10" style={{ backgroundColor: '#18181B' }}>
            <Text className="text-muted text-sm mb-2">Nouvelle adresse email</Text>
            <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="nouvel@email.com" placeholderTextColor="#8E8E93" style={inputStyle} className="bg-card text-foreground rounded-xl px-4 py-3 mb-3" />
            <Text className="text-muted text-sm mb-2">Mot de passe (confirmation)</Text>
            <TextInput value={mdpEmail} onChangeText={setMdpEmail} secureTextEntry placeholder="••••••••" placeholderTextColor="#8E8E93" style={inputStyle} className="bg-card text-foreground rounded-xl px-4 py-3 mb-4" />
            <Feedback msg={msgEmail} />
            <Pressable onPress={() => { setMsgEmail(null); mut_email.mutate({ password: mdpEmail, email }); }} disabled={mut_email.isPending || !email || !mdpEmail}>
              <LinearGradient colors={['#1E1E20', '#0D0D0E']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} className="rounded-xl py-3.5 items-center border border-accent/60" style={{ opacity: (mut_email.isPending || !email || !mdpEmail) ? 0.5 : 1 }}>
                <Text className="text-accent font-bold">{mut_email.isPending ? 'Modification…' : "Modifier l'email"}</Text>
              </LinearGradient>
            </Pressable>
          </View>
        )}

        {/* ===== SUPPRESSION ===== */}
        {vue === 'delete' && (
          <View className="rounded-2xl px-4 py-4 border" style={{ backgroundColor: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.4)' }}>
            <Text className="text-foreground font-semibold mb-1">Supprimer mon compte</Text>
            <Text className="text-muted text-xs mb-3">Entre ton mot de passe deux fois pour confirmer.</Text>
            <TextInput value={mdp1} onChangeText={setMdp1} secureTextEntry placeholder="Mot de passe" placeholderTextColor="#8E8E93" style={inputStyle} className="bg-card text-foreground rounded-xl px-4 py-3 mb-3" />
            <TextInput value={mdp2} onChangeText={setMdp2} secureTextEntry placeholder="Mot de passe (encore)" placeholderTextColor="#8E8E93" style={inputStyle} className="bg-card text-foreground rounded-xl px-4 py-3 mb-4" />
            <Feedback msg={msgSuppr} />
            <Pressable onPress={demanderSuppression} className="rounded-xl py-3.5 items-center" style={{ backgroundColor: 'rgba(239,68,68,0.15)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.6)' }}>
              <Text style={{ color: '#ef4444', fontWeight: '700' }}>Supprimer mon compte</Text>
            </Pressable>
          </View>
        )}

      </ScrollView>

      {/* POPUP : confirmation de suppression définitive */}
      <Modal visible={confirmSuppr} transparent animationType="fade">
        <Pressable onPress={() => setConfirmSuppr(false)} className="flex-1 items-center justify-center px-8" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <Pressable onPress={(e) => e.stopPropagation?.()} className="bg-card rounded-3xl px-7 py-8 items-center w-full" style={{ borderWidth: 1, borderColor: 'rgba(239,68,68,0.6)', boxShadow: '0px 0px 28px rgba(239,68,68,0.3)' }}>
            <View className="w-16 h-16 rounded-full items-center justify-center mb-4" style={{ backgroundColor: 'rgba(239,68,68,0.14)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.6)' }}>
              <MaterialCommunityIcons name="account-remove" size={34} color="#ef4444" />
            </View>
            <Text className="text-foreground text-2xl font-bold text-center mb-3">Supprimer le compte ?</Text>
            <Text className="text-muted text-center mb-7" style={{ lineHeight: 20 }}>
              La suppression du compte est <Text style={{ color: '#ef4444', fontWeight: '700' }}>ABSOLUMENT DÉFINITIVE ET NON RÉCUPÉRABLE</Text>.{'\n'}
              Ton compte et toutes tes données disparaîtront pour toujours.
            </Text>
            <Pressable onPress={() => mut_delete.mutate({ password: mdp1 })} disabled={mut_delete.isPending} className="w-full mb-2">
              <View className="rounded-2xl py-4 items-center" style={{ backgroundColor: '#ef4444', opacity: mut_delete.isPending ? 0.6 : 1 }}>
                <Text className="font-bold text-base" style={{ color: '#0A0A0A' }}>{mut_delete.isPending ? 'Suppression…' : 'Oui, supprimer définitivement'}</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => setConfirmSuppr(false)} className="py-2">
              <Text className="text-muted">Annuler</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
}
