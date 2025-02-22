import { db } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, getDoc, addDoc, updateDoc, doc, deleteDoc, query, orderBy, where } from 'firebase/firestore';

const clientCollection = collection(db, "clients");

// Vérifie que l'utilisateur est connecté et retourne son objet auth
const getCurrentUser = async () => {
  const auth = getAuth();
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
};

export const fetchClients = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Utilisateur non connecté");
  }
  // Ici, vous pouvez filtrer les clients par user.uid si nécessaire, 
  // par exemple en ajoutant where("userId", "==", user.uid)
  const clientQuery = query(
    clientCollection, 
    where("userId", "==", user.uid),
    orderBy("order")
  );
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
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Utilisateur non connecté");
  }
  // Vous pouvez également ajouter le userId dans le document si besoin
  const clients = await fetchClients();
  const newOrder = clients.length > 0 ? clients[clients.length - 1].order + 1 : 0;
  const newClient = { ...client, order: newOrder, userId: user.uid };

  const docRef = await addDoc(clientCollection, newClient);
  return { id: docRef.id, ...newClient };
};

export const updateClient = async (client) => {
  console.log(client);
  const clientRef = doc(db, "clients", client.id);
  await updateDoc(clientRef, { ...client });
};

export const deleteClient = async (clientId) => {
  if (!clientId) {
    return;
  }

  const clientRef = doc(db, "clients", clientId);
  await deleteDoc(clientRef);
};