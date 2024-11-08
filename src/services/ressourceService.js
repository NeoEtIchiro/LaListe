import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';

const ressourceCollection = collection(db, "ressources");

export const fetchRessources = async () => {
  const querySnapshot = await getDocs(ressourceCollection);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addRessource = async (name) => {
  const newRessource = { name };
  const docRef = await addDoc(ressourceCollection, newRessource);
  return { id: docRef.id, ...newRessource };
};

export const updateRessource = async (ressource) => {
  const ressourceRef = doc(db, "ressources", ressource.id);
  await updateDoc(ressourceRef, { name: ressource.name });
};
