import { db } from '../firebase';
import { collection, getDocs, getDoc, addDoc, updateDoc, doc, deleteDoc, query, orderBy } from 'firebase/firestore';

const clientCollection = collection(db, "clients");

export const fetchClients = async () => {
  const clientQuery = query(clientCollection, orderBy("order"));
  const querySnapshot = await getDocs(clientQuery);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getClientById = async (id) => {
  const clientRef = doc(db, "clients", id);
  const clientDoc = await getDoc(clientRef);
  if (clientDoc.exists()) {
    return { id: clientDoc.id, ...clientDoc.data() };
  } else {
    throw new Error("Client not found");
  }
};

export const addClient = async (client) => {
  const newOrder = clients.length > 0 ? clients[clients.length - 1].order + 1 : 0;
  const newClient = { ...client, order:newOrder };

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