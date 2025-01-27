import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

// Référence à la collection "payments" dans Firestore
const paymentCollection = collection(db, "payments");

// Fonction pour récupérer tous les projets
export const fetchPayments = async () => {
  const paymentQuery = query(paymentCollection);
  const querySnapshot = await getDocs(paymentQuery);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Fonction pour ajouter un nouveau projet
export const addPayment = async () => {
  const payments = await fetchPayments();

  const newPayment = {
    name: "Nouveau paiement",
    date: null,
    amount: 0,
    frequency: "unique",
    projectId: ""
  };
  const docRef = await addDoc(paymentCollection, newPayment);
  return { id: docRef.id, ...newPayment };
};

// Fonction pour mettre à jour un paiment existant
export const updatePayment = async (payment) => {
  const paymentRef = doc(db, "payments", payment.id);
  const updatedPayment = {
    ...payment
  };
  await updateDoc(paymentRef, updatedPayment);
};

// Fonction pour supprimer un projet
export const deletePayment = async (paymentId) => {
  const paymentRef = doc(db, "payments", paymentId);
  await deleteDoc(paymentRef);
};
