import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// plus de token codé en dur : on part déconnecté, le login le branchera
const api = axios.create({ baseURL: 'http://localhost:3333/api/v1' });

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
