import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';

const clientCollection = collection(db, "clients");

export const fetchClients = async () => {
  const querySnapshot = await getDocs(clientCollection);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addClient = async (name) => {
  const newClient = { name };
  const docRef = await addDoc(clientCollection, newClient);
  return { id: docRef.id, ...newClient };
};

export const updateClient = async (client) => {
  const clientRef = doc(db, "clients", client.id);
  await updateDoc(clientRef, { name: client.name });
};
