import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, query, orderBy } from 'firebase/firestore';

const clientCollection = collection(db, "clients");

export const fetchClients = async () => {
  const clientQuery = query(clientCollection, orderBy("order"));
  const querySnapshot = await getDocs(clientQuery);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addClient = async (name) => {
  const clients = await fetchClients();
  const newOrder = clients.length > 0 ? clients[clients.length - 1].order + 1 : 0;
  const newClient = { name, order:newOrder };

  const docRef = await addDoc(clientCollection, newClient);
  return { id: docRef.id, ...newClient };
};

export const updateClient = async (client) => {
  const clientRef = doc(db, "clients", client.id);
  await updateDoc(clientRef, { name: client.name });
};

export const deleteClient = async (clientId) => {
  const clientRef = doc(db, "clients", clientId);
  await deleteDoc(clientRef);
};