import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, where } from "firebase/firestore";

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

  // Ici, on suppose que vous souhaitez trier par un champ "order"
  // Sinon, vous pouvez omettre orderBy ou utiliser un autre critère
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
