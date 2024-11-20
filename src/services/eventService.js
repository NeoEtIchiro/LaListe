import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

// Référence à la collection "projects" dans Firestore
const eventsCollection = collection(db, "events");

// Fonction pour récupérer tous les projets
export const fetchEvents = async () => {
  const querySnapshot = await getDocs(eventsCollection);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Fonction pour ajouter un nouveau projet
export const addEvent = async (title, description, ressource, date_debut, date_fin) => {
  const newEvent = {
    title,
    description,
    ressource,
    date_debut,
    date_fin
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
                              ressource: event.ressource });
};

// Fonction pour supprimer un projet
export const deleteEvent = async (eventId) => {
  const eventRef = doc(db, "events", eventId);
  await deleteDoc(eventRef);
};
