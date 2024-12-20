import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';

// Référence à la collection "projects" dans Firestore
const eventsCollection = collection(db, "events");

// Fonction pour récupérer tous les projets
export const fetchEvents = async () => {
  const querySnapshot = await getDocs(eventsCollection);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Fonction pour ajouter un nouveau projet
export const addEvent = async (title, description, ressource, date_debut, date_fin, tache) => {
  const newEvent = {
    title,
    description,
    ressource,
    date_debut,
    date_fin,
    tache
  };
  const docRef = await addDoc(eventsCollection, newEvent);
  return { id: docRef.id, ...newEvent };
};

// Fonction pour mettre à jour un projet existant
export const updateEvent = async (event) => {
  console.log(event.id);
  if (!event.id) {
    throw new Error("Invalid event ID. Cannot update event without a valid ID.");
  }

  const eventRef = doc(db, "events", event.id);
  await updateDoc(eventRef, { title:event.title, 
                              description: event.description, 
                              date_debut: event.date_debut,
                              date_fin: event.date_fin,
                              ressource: event.ressource,
                              tache: event.tache });
};

export const deleteEvent = async (event) => {
  try {
    // Référence à la collection "events"
    const eventsCollection = collection(db, "events");

    // Construire une requête pour trouver les événements correspondant
    const q = query(
      eventsCollection,
      where("date_debut", "==", event.date_debut),
      where("date_fin", "==", event.date_fin),
      where("ressource", "==", event.ressource),
      where("tache", "==", event.tache),
      where("title", "==", event.title),
      where("description", "==", event.description)
    );

    // Exécuter la requête
    const querySnapshot = await getDocs(q);

    // Supprimer chaque document correspondant
    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    //console.log(`${deletePromises.length} événement(s) supprimé(s).`);
  } catch (error) {
    console.error("Erreur lors de la suppression des événements :", error);
  }
};
