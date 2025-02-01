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
export const addEvent = async (event) => {
  const docRef = await addDoc(eventsCollection, event);
  return { id: docRef.id, ...event };
};

// Fonction pour mettre à jour un projet existant
export const updateEvent = async (event) => {
  if (!event.id) {
    throw new Error("Invalid event ID. Cannot update event without a valid ID.");
  }

  const eventRef = doc(db, "events", event.id);
  await updateDoc(eventRef, { ...event });
};

export const deleteEvent = async (eventId) => {
  try {
    // Référence au document de l'événement
    const eventDoc = doc(db, "events", eventId);

    // Supprimer le document
    await deleteDoc(eventDoc);

    console.log(`Événement avec l'ID ${eventId} supprimé.`);
  } catch (error) {
    console.error("Erreur lors de la suppression de l'événement :", error);
  }
};
