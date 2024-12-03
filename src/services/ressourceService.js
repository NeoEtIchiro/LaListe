import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, where } from 'firebase/firestore';

const ressourceCollection = collection(db, "ressources");
const eventsCollection = collection(db, "events");

// Récupérer les ressources dans l'ordre en utilisant le champ `order`
export const fetchRessources = async () => {
  const ressourceQuery = query(ressourceCollection, orderBy("order"));
  const querySnapshot = await getDocs(ressourceQuery);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Ajouter une ressource avec un champ `order`
export const addRessource = async (ressource) => {
  const ressources = await fetchRessources();
  const newOrder = ressources.length > 0 ? ressources[ressources.length - 1].order + 1 : 0;

  const newRessource = { name: ressource.name, email: ressource.email, phone: ressource.telephone, order: newOrder };
  const docRef = await addDoc(ressourceCollection, newRessource);
  return { id: docRef.id, ...newRessource };
};

// Mettre à jour une ressource (par exemple, changer le nom ou l'ordre)
export const updateRessource = async (ressource) => {
  const ressourceRef = doc(db, "ressources", ressource.id);
  await updateDoc(ressourceRef, { name: ressource.name, order: ressource.order });
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

  // Supprimer les événements associés à cette ressource
  const eventsQuery = query(eventsCollection, where("ressource", "==", ressourceId));
  const eventsSnapshot = await getDocs(eventsQuery);
  for (const eventDoc of eventsSnapshot.docs) {
    await deleteDoc(doc(db, "events", eventDoc.id));
  }
};

export const getRessource = async (ressourceId) => {
  const ressourceRef = doc(db, "ressources", ressourceId); // Référence au document Firestore
  const ressourceSnapshot = await getDoc(ressourceRef); // Récupère le document
  
  if (!ressourceSnapshot.exists()) {
    throw new Error(`Ressource avec ID ${ressourceId} non trouvée.`);
  }
  
  return { id: ressourceSnapshot.id, ...ressourceSnapshot.data() }; // Retourne la ressource avec son ID
};
