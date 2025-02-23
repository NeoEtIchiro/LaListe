import { db } from '../firebase';
import { collection, getDoc, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const ressourceCollection = collection(db, "ressources");
const eventsCollection = collection(db, "events");

// Fonction pour obtenir l'utilisateur courant
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

// Récupérer les ressources de l'utilisateur dans l'ordre en utilisant le champ `order`
export const fetchRessources = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Utilisateur non connecté");
  }
  const ressourceQuery = query(
    ressourceCollection,
    where("userId", "==", user.uid),
    orderBy("order")
  );
  const querySnapshot = await getDocs(ressourceQuery);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Ajouter une ressource avec un champ `order` et le userId
export const addRessource = async (ressource) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Utilisateur non connecté");
  }
  const ressources = await fetchRessources();
  const newOrder = ressources.length > 0 ? ressources[ressources.length - 1].order + 1 : 0;
  
  const newRessource = { ...ressource, order: newOrder, userId: user.uid };
  const docRef = await addDoc(ressourceCollection, newRessource);
  return { id: docRef.id, ...newRessource };
};

// Mettre à jour une ressource (par exemple, changer le nom ou l'ordre)
export const updateRessource = async (ressource) => {
  const ressourceRef = doc(db, "ressources", ressource.id);
  await updateDoc(ressourceRef, { ...ressource });
};

// Supprimer une ressource, mettre à jour l'ordre des autres et supprimer les événements associés
export const deleteRessource = async (ressourceId) => {
  const ressourceRef = doc(db, "ressources", ressourceId);

  // Supprimer la ressource
  await deleteDoc(ressourceRef);

  // Mettre à jour l'ordre des autres ressources
  const ressources = await fetchRessources();
  let newOrder = 0;
  for (const ressource of ressources) {
    if (ressource.order !== newOrder) {
      const ressourceDocRef = doc(db, "ressources", ressource.id);
      await updateDoc(ressourceDocRef, { order: newOrder });
    }
    newOrder++;
  }
};

export const getRessource = async (ressourceId) => {
  if (!ressourceId) return null;
  const ressourceRef = doc(db, "ressources", ressourceId);
  const ressourceSnapshot = await getDoc(ressourceRef);
  if (!ressourceSnapshot.exists()) {
    return null;
  }
  return { id: ressourceSnapshot.id, ...ressourceSnapshot.data() };
};
