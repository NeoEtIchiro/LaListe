import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase";
import { 
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, writeBatch 
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid"; // npm install uuid si ce n'est pas déjà fait

// Référence à la collection "payments" dans Firestore
const paymentCollection = collection(db, "payments");

// Fonction pour récupérer les paiements de l'utilisateur connecté
export const fetchPayments = async () => {
  const auth = getAuth();
  
  // Attendre que l'état d'authentification soit connu
  const user = await new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });

  if (!user) {
    throw new Error("Utilisateur non connecté");
  }
  
  console.log("Utilisateur connecté (fetchPayments) :", user.uid);

  // Requête pour récupérer les paiements liés à l'utilisateur
  const paymentQuery = query(
    paymentCollection,
    where("userId", "==", user.uid)
  );
  
  const querySnapshot = await getDocs(paymentQuery);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Fonction pour ajouter un nouveau paiement en ajoutant automatiquement le userId
export const addPayment = async (payment) => {
  const auth = getAuth();
  
  // Attendre que l'état d'authentification soit connu
  const user = await new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });

  if (!user) {
    throw new Error("Utilisateur non connecté");
  }
  
  console.log("Utilisateur connecté (addPayment) :", user.uid);

  // Ajoute le userId dans l'objet payment
  const newPayment = { ...payment, userId: user.uid };

  const docRef = await addDoc(paymentCollection, newPayment);
  return { id: docRef.id, ...newPayment };
};

// Fonction pour mettre à jour un paiement existant
export const updatePayment = async (payment) => {
  const paymentRef = doc(db, "payments", payment.id);
  const updatedPayment = { ...payment };
  await updateDoc(paymentRef, updatedPayment);
};

// Fonction pour supprimer un paiement
export const deletePayment = async (paymentId) => {
  const paymentRef = doc(db, "payments", paymentId);
  await deleteDoc(paymentRef);
};

// Fonction pour ajouter une série de paiements récurrents avec un identifiant commun (recurringId)
export const addRecurringPayments = async (payment, frequencyStep = 1) => {
  const recurringId = uuidv4();
  const paymentsToAdd = [];
  const startDate = new Date(payment.date);
  const endDate = new Date(payment.dateEnd);
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    paymentsToAdd.push({
      ...payment,
      date: currentDate.toISOString().substr(0, 10),
      recurringId,
    });
    currentDate.setMonth(currentDate.getMonth() + frequencyStep);
  }

  // Récupération du user et ajout du userId (similaire à ce que vous faites déjà)
  const auth = getAuth();
  const user = await new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });

  if (!user) {
    throw new Error("Utilisateur non connecté");
  }

  const paymentsWithUserId = paymentsToAdd.map(p => ({ ...p, userId: user.uid }));
  const promises = paymentsWithUserId.map(p => addDoc(paymentCollection, p));
  const docRefs = await Promise.all(promises);

  return docRefs.map((docRef, index) => ({ id: docRef.id, ...paymentsWithUserId[index] }));
};

// Fonction pour mettre à jour tous les paiements d'une série récurrente
export const updateRecurringPayments = async (recurringId, updatedFields) => {
  // Récupérer tous les paiements avec le même recurringId
  const q = query(paymentCollection, where("recurringId", "==", recurringId));
  const querySnapshot = await getDocs(q);

  const batch = writeBatch(db);
  querySnapshot.forEach(docSnapshot => {
    batch.update(docSnapshot.ref, updatedFields);
  });

  await batch.commit();
};

// Fonction pour supprimer tous les paiements d'une série récurrente
export const deleteRecurringPayments = async (recurringId) => {
  const q = query(paymentCollection, where("recurringId", "==", recurringId));
  const querySnapshot = await getDocs(q);
  const batch = writeBatch(db);
  querySnapshot.forEach(docSnapshot => {
    batch.delete(docSnapshot.ref);
  });
  await batch.commit();
};