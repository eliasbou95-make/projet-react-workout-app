import AsyncStorage from '@react-native-async-storage/async-storage';

// clés des préférences locales (stockées dans le coffre AsyncStorage)
export const PREFS = {
  weightUnit: 'pref_weightUnit', // 'kg' | 'lbs'
  keepAwake: 'pref_keepAwake',   // 'true' | 'false'
  weekStart: 'pref_weekStart',   // '1' = lundi | '0' = dimanche
};

// lit une préférence ; renvoie `defaut` si elle n'existe pas encore
export async function lirePref(cle, defaut) {
  const v = await AsyncStorage.getItem(cle);
  return v == null ? defaut : v;
}

// écrit une préférence (toujours en chaîne)
export async function ecrirePref(cle, valeur) {
  await AsyncStorage.setItem(cle, String(valeur));
}

// ---- conversion de poids ----
// On stocke TOUJOURS en kg (canonique). On convertit seulement à l'affichage/saisie.
export const FACTEUR_LBS = 2.20462;

// kg (stocké) → valeur affichée dans l'unité choisie (nombre)
export function kgVers(unite, kg) {
  const n = Number(kg);
  if (!isFinite(n)) return 0;
  return unite === 'lbs' ? n * FACTEUR_LBS : n;
}

// valeur saisie dans l'unité choisie → kg à stocker (nombre)
export function versKg(unite, valeur) {
  const n = Number(valeur);
  if (!isFinite(n)) return 0;
  return unite === 'lbs' ? n / FACTEUR_LBS : n;
}

// chaîne d'affichage propre, avec l'unité : "120 kg" / "264.6 lbs"
export function fmtPoids(unite, kg) {
  const v = Math.round(kgVers(unite, kg) * 10) / 10;
  const texte = v % 1 === 0 ? String(v) : v.toFixed(1);
  return `${texte} ${unite ?? 'kg'}`;
}
