// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  createUserWithEmailAndPassword,
  getAuth,
  reauthenticateWithCredential,
  sendEmailVerification,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  setDoc,
  deleteDoc,
  QuerySnapshot,
  updateDoc,
} from "firebase/firestore";
import {
  getStorage,
  refEqual,
  uploadBytes,
  getDownloadURL,
  getBytes,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { delay } from "framer-motion";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optionalc

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
//Autenticaciòn con firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export async function registerNewUser(email, password) {
  try {
    const uid = await createUserWithEmailAndPassword(auth, email, password);
    return uid;
  } catch (error) {
    console.error(error);
  }
}

export async function sendVerificationEmail(currentUser) {
  try {
    await sendEmailVerification(currentUser);
  } catch (error) {
    console.error(error);
  }
}

export async function registerDocNewUser(user, uid) {
  try {
    const collectionRef = collection(db, "users");
    const docRef = doc(collectionRef, uid);
    await setDoc(docRef, user);
  } catch (error) {
    console.error(error);
  }
}

export async function userExist(uid) {
  const docRef = doc(db, "users", uid);
  const res = await getDoc(docRef);
  console.log(res);
  return res.exists();
}

export async function existsUsername(mail) {
  const users = [];
  const docsRef = collection(db, "users");
  const q = query(docsRef, where("email", "==", mail));

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    users.push(doc.data());
  });

  if (users.length > 0) {
    return true;
  } else {
    return false;
  }
  //return users.length > 0 ? users[0].uid : null;
}

export async function getUserInfo(uid) {
  try {
    const docRef = doc(db, "users", uid);
    const document = await getDoc(docRef);
    return document.data();
  } catch (error) {
    console.error(error);
  }
}

export async function updateUser(user) {
  try {
    const collectionRef = collection(db, "users");
    const docRef = doc(collectionRef, user.uid);
    await setDoc(docRef, user);
    console.log("E we lo puse que pedo");
  } catch (error) {
    console.log(error);
  }
}

export async function updateUserField(userId, fieldName, fieldValue) {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      [fieldName]: fieldValue,
    });
    console.log("Campo actualizado correctamente");
  } catch (error) {
    console.error("Error al actualizar campo:", error);
  }
}

export async function setUserProfilePhoto(uid, file) {
  try {
    const imageRef = ref(storage, `im_ProfilePicture/${uid}`);
    const resUpload = await uploadBytes(imageRef, file);
    console.log(resUpload);
    return resUpload;
  } catch (error) {
    console.error(error);
  }
}

export async function getProfilePhotoUrl(profilepicture) {
  try {
    const imageRef = ref(storage, profilepicture);

    const url = await getDownloadURL(imageRef);
    return url;
  } catch (error) {
    console.error(error);
  }
}

export async function uploadProfilePhoto(file, uid) {
  try {
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = async function () {
        const imageData = fileReader.result;

        const res = await setUserProfilePhoto(uid, imageData);

        const url = await getProfilePhotoUrl(res.metadata.fullPath);

        await updateUserField(uid, "profilePicture", url);
      };
    } else {
      throw new Error("No se proporcionó un archivo válido.");
    }
  } catch (error) {
    throw new Error(error);
  }
}

export async function changeEmail(email, user) {
  try {
    await updateEmail(user, email);
    await sendVerificationEmail(user);
    await updateUserField(user.uid, "email", email);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export async function changePassword(password, user) {
  try {
    const res = await updatePassword(user, password);
    console.log(res);

    await updateUserField(user.uid, "password", password);
  } catch (error) {
    console.error(error);
  }
}

export async function fetchUsers() {
  const users = [];
  const docsRef = collection(db, "users");
  const querySnapshot = await getDocs(docsRef);

  querySnapshot.forEach((doc) => {
    users.push({
      uid: doc.id, // ID del documento (UID)
      data: doc.data(), // Datos del usuario
    });
  });

  return users;
}

export async function deleteUser(uid) {
  try {
    await deleteDoc(doc(db, "users", uid));
  } catch (error) {
    console.error(error);
  }
}

export async function createSubcollection(
  collectionName,
  docId,
  subcollectionName
) {
  try {
    const docRef = doc(db, collectionName, docId);
    const subcollectionRef = collection(docRef, subcollectionName);
    await addDoc(subcollectionRef, {});
  } catch (error) {
    console.error(error);
  }
}

export async function fetchSubcollection(
  collectionName,
  docId,
  subcollectionName
) {
  const subcollection = [];
  const docRef = doc(db, collectionName, docId);
  const subcollectionRef = collection(docRef, subcollectionName);
  const querySnapshot = await getDocs(subcollectionRef);

  querySnapshot.forEach((doc) => {
    subcollection.push({
      uid: doc.id, // ID del documento (UID)
      data: doc.data(), // Datos del documento
    });
  });

  return subcollection;
}

export async function addSubcollectionDocument(
  collectionName,
  docId,
  subcollectionName,
  document
) {
  try {
    console.log(collectionName, docId, subcollectionName, document);
    const docRef = doc(db, collectionName, docId);
    const subcollectionRef = collection(docRef, subcollectionName);
    await addDoc(subcollectionRef, document);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export async function deleteSubcollectionDocument(
  collectionName,
  docId,
  subcollectionName,
  subcollectionDocId
) {
  try {
    const docRef = doc(db, collectionName, docId);
    const subcollectionRef = collection(docRef, subcollectionName);
    await deleteDoc(doc(subcollectionRef, subcollectionDocId));
  } catch (error) {
    console.error(error);
  }
}

export async function updateSubcollectionDocument(
  collectionName,
  docId,
  subcollectionName,
  subcollectionDocId,
  document
) {
  try {
    const docRef = doc(db, collectionName, docId);
    const subcollectionRef = collection(docRef, subcollectionName);
    await updateDoc(doc(subcollectionRef, subcollectionDocId), document);
  } catch (error) {
    console.error(error);
  }
}

export async function fetchCollection(collectionName) {
  try {
    const documents = [];
    const docsRef = collection(db, collectionName);
    const querySnapshot = await getDocs(docsRef);

    querySnapshot.forEach((doc) => {
      documents.push({
        uid: doc.id, // ID del documento (UID)
        data: doc.data(), // Datos del documento
      });
    });

    return documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function fetchDocument(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    const document = await getDoc(docRef);
    return document.data();
  } catch (error) {
    console.error(error);
  }
}

export async function updateDocument(collectionName, docId, data) {
  try {
    const docRef = doc(db, collectionName, docId);
    const res = await setDoc(docRef, data);
    console.log(res);
    return res;
  } catch (error) {
    throw new Error(error);
  }
}

export async function addCollectionDocument(
  collectionName,
  nameDocument,
  document
) {
  4;
  try {
    if (nameDocument) {
      const docRef = doc(db, collectionName, nameDocument);
      await setDoc(docRef, document);
    } else {
      const collectionRef = collection(db, collectionName);
      await addDoc(collectionRef, document);
    }
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateCollectionDocument(
  collectionName,
  documentId,
  document
) {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, document);
  } catch (error) {
    console.error(error);
  }
}

export async function addFieldToDocument(collectionName, docId, field, value) {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      [field]: value,
    });
  } catch (error) {
    console.error(error);
  }
}

export async function addFieldNtoDocument(
  collectionName,
  docId,
  fieldPrefix,
  value
) {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnapshot = await getDoc(docRef);

    if (!docSnapshot.exists()) {
      throw new Error("El documento no existe");
    }

    const data = docSnapshot.data();
    const fieldKeys = Object.keys(data);

    // Verificar si el valor ya existe en algún campo
    const valueLowerCase = value.toString().toLowerCase();
    const valueExists = fieldKeys.some((key) => {
      return data[key].toString().toLowerCase() === valueLowerCase;
    });

    if (valueExists) {
      throw new Error("El valor ya existe en el documento.");
    }

    // Encontrar el último campo que sigue el patrón fieldPrefixN
    let maxNumber = 0;
    fieldKeys.forEach((key) => {
      const match = key.match(new RegExp(`^${fieldPrefix}(\\d+)$`));
      if (match) {
        const number = parseInt(match[1], 10);
        if (number > maxNumber) {
          maxNumber = number;
        }
      }
    });

    // Crear el nuevo campo con el siguiente número
    const newField = `${fieldPrefix}${maxNumber + 1}`;
    await updateDoc(docRef, {
      [newField]: value,
    });
  } catch (error) {
    throw new Error(error);
  }
}

export async function deleteCollectionDocument(collectionName, docId) {
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (error) {
    console.error(error);
  }
}

export async function addProduct(product) {
  try {
    const collectionRef = collection(db, "inventory");
    const res = await addDoc(collectionRef, product);
    return res.id;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export async function fetchProducts() {
  const products = [];
  const docsRef = collection(db, "inventory");
  const querySnapshot = await getDocs(docsRef);

  querySnapshot.forEach((doc) => {
    products.push({
      uid: doc.id, // ID del documento (UID)
      data: doc.data(), // Datos del producto
    });
  });

  return products;
}

export async function deleteProduct(uid) {
  try {
    await deleteDoc(doc(db, "inventory", uid));
  } catch (error) {
    console.error(error);
  }
}

export async function updateProductField(productId, fieldName, fieldValue) {
  try {
    const productRef = doc(db, "inventory", productId);
    await updateDoc(productRef, {
      [fieldName]: fieldValue,
    });
    console.log("Campo actualizado correctamente");
  } catch (error) {
    console.error("Error al actualizar campo:", error);
    throw new Error(error);
  }
}

export async function uploadMultipleFiles(reference, files, uid) {
  try {
    console.log(files);
    const images = {};

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageName = `image${i}`; // Nombre de la imagen único
      const imageRef = ref(storage, `${reference}/${uid}/${imageName}`);
      const res = await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      images[imageName] = url; // Guardar la URL de descarga en el objeto images
    }

    return images; // Devolver el objeto de imágenes
  } catch (error) {
    console.error(error);
  }
}

export async function updateCart(userUID, items) {
  try {
    const userRef = doc(db, "carts", userUID);
    const cart = await updateDoc(userRef, {
      cart: items,
    });
    return cart;
  } catch (error) {
    console.error(error);
  }
}

export async function getCart(userUID) {
  try {
    const userRef = doc(db, "carts", userUID);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data().cart || []; // Aseguramos que sea un array
    } else {
      await setDoc(userRef, { cart: [] });
      return [];
    }
  } catch (error) {
    console.error("Error getting cart:", error);
    return []; // Devolver un array vacío en caso de error
  }
}

//getOrders
export async function fetchOrders() {
  try {
    const orders = [];
    const docsRef = collection(db, "orders");
    const querySnapshot = await getDocs(docsRef);

    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id, // ID del documento (UID)
        ...doc.data(), // Datos del producto
      });
    });

    return orders;
  } catch (error) {
    console.log("Error fetching orders: + " + error);
    throw new Error("Error fetching orders: + " + error);
  }
}

export const addPlaylist = async (name, userId) => {
  try {
    const docRef = await addDoc(collection(db, "playlists"), {
      name: name,
      userId: userId,
      songs: [],
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const getPlaylists = async () => {
  const playlists = [];
  const querySnapshot = await getDocs(collection(db, "playlists"));
  querySnapshot.forEach((doc) => {
    playlists.push({ id: doc.id, ...doc.data() });
  });
  return playlists;
};

export const addSongToPlaylist = async (playlistId, song) => {
  try {
    const playlistRef = doc(db, "playlists", playlistId); // Obtener referencia al documento
    const playlistDoc = await getDoc(playlistRef); // Obtener el documento
    const playlistData = playlistDoc.data();

    if (!playlistData.songs) {
      playlistData.songs = []; // Asegurarse de que la propiedad songs existe
    }

    playlistData.songs.push(song); // Agregar la canción a la lista

    await updateDoc(playlistRef, { songs: playlistData.songs }); // Actualizar el documento
    console.log("Canción añadida a la playlist:", playlistRef.id);
  } catch (e) {
    console.error("Error añadiendo la canción:", e);
  }
};

export const uploadMP3File = async (file) => {
  try {
    // Quitar la extensión .mp3 del nombre de archivo
    const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");

    // Crear una referencia única para el archivo en Firebase Storage
    const storageRef = ref(storage, `mp3/${file.name}`);

    // Iniciar la carga del archivo
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Monitorear el progreso de la carga (opcional)
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Puedes manejar el progreso aquí si lo deseas
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Progreso de la carga: ${progress}%`);
      },
      (error) => {
        console.error("Error al subir el archivo: ", error);
        throw error;
      },
      async () => {
        // Si se completó la carga correctamente, obtener la URL de descarga
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log("Archivo MP3 subido correctamente: ", downloadURL);

        // Añadir documento en Firestore con información de la canción
        try {
          const docRef = await addDoc(collection(db, "songs"), {
            title: fileNameWithoutExtension,
            url: downloadURL,
            createdAt: new Date(),
          });
          console.log("Documento de canción añadido con ID: ", docRef.id);
        } catch (error) {
          console.error("Error al añadir documento de canción: ", error);
          throw error;
        }
      }
    );

    // Puedes devolver algo si lo necesitas, como el estado de la carga o un identificador del archivo
    return uploadTask;
  } catch (error) {
    console.error("Error al subir el archivo MP3: ", error);
    throw error;
  }
};

export const getSongs = async () => {
  try {
    const songs = [];
    const querySnapshot = await getDocs(collection(db, "songs"));

    querySnapshot.forEach((doc) => {
      songs.push({ id: doc.id, ...doc.data() });
    });

    return songs;
  } catch (error) {
    console.error("Error al obtener las canciones: ", error);
    throw error;
  }
};

export const deletePlaylist = async (playlistId) => {
  try {
    await deleteDoc(doc(db, "playlists", playlistId));
    console.log("Playlist eliminada correctamente:", playlistId);
  } catch (e) {
    console.error("Error al eliminar la playlist:", e);
  }
};

export const removeSongFromPlaylist = async (playlistId, songIndex) => {
  try {
    const playlistRef = doc(db, "playlists", playlistId);
    const playlistDoc = await getDoc(playlistRef);
    const playlistData = playlistDoc.data();

    if (!playlistData.songs) {
      playlistData.songs = [];
    }

    playlistData.songs.splice(songIndex, 1);

    await updateDoc(playlistRef, { songs: playlistData.songs });
    console.log("Canción eliminada de la playlist:", playlistRef.id);
  } catch (e) {
    console.error("Error al eliminar la canción:", e);
  }
};
