import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, NativeModules } from 'react-native';

// Trouve l'adresse du PC qui fait tourner le backend, quel que soit l'appareil.
// Métro sert le bundle JS depuis ce même PC : son URL contient donc déjà la bonne IP.
function resoudreHost() {
  // ex. "http://192.168.1.42:8081/index.bundle?..." (tel physique)
  //     ou "http://localhost:8081/..."              (émulateur)
  const scriptURL = NativeModules.SourceCode?.scriptURL || '';
  const match = scriptURL.match(/\/\/([^:/]+)/);
  let host = match ? match[1] : 'localhost';

  // Sur l'émulateur Android, "localhost" = l'émulateur lui-même, pas le PC.
  // L'alias spécial 10.0.2.2 pointe vers la machine hôte.
  if (Platform.OS === 'android' && (host === 'localhost' || host === '127.0.0.1')) {
    host = '10.0.2.2';
  }
  return host;
}

// plus de token codé en dur : on part déconnecté, le login le branchera
const api = axios.create({ baseURL: `http://${resoudreHost()}:3333/api/v1` });

// branche (ou retire) le token sur axios ET dans le coffre persistant
export async function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    await AsyncStorage.setItem('token', token);   // range dans le coffre
  } else {
    delete api.defaults.headers.common.Authorization;
    await AsyncStorage.removeItem('token');        // vide le coffre
  }
}

// lit le coffre au démarrage et rebranche le token sur axios s'il existe
export async function loadAuthToken() {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
  return token;
}

export default api;
