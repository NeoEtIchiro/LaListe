import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

// Référence à la collection "tasks" dans Firestore
const taskCollection = collection(db, "tasks");

// Fonction pour récupérer tous les projets
export const fetchTasks = async () => {
  const taskQuery = query(taskCollection, orderBy("order"));
  const querySnapshot = await getDocs(taskQuery);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Fonction pour ajouter un nouveau projet
export const addTask = async (task) => {
  const tasks = await fetchTasks();
  const newOrder = tasks.length > 0 ? tasks[tasks.length - 1].order + 1 : 0;

  const newTask = {
    ...task,
    order: newOrder
  };
  const docRef = await addDoc(taskCollection, newTask);
  return { id: docRef.id, ...newTask };
};

// Fonction pour mettre à jour un projet existant
export const updateTask = async (task) => {
  const taskRef = doc(db, "tasks", task.id);
  await updateDoc(taskRef, { name:task.name });
};

// Fonction pour supprimer un projet
export const deleteTask = async (taskId) => {
  const taskRef = doc(db, "tasks", taskId);
  await deleteDoc(taskRef);
};
