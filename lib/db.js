import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

// Generic function to get all items from a collection
export const getItems = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return items;
  } catch (error) {
    console.error("Error getting items:", error);
    throw error;
  }
};

// Get items from a collection with optional filtering
export const getFilteredItems = async (collectionName, filters = [], sortBy = null) => {
  try {
    let q = collection(db, collectionName);
    
    if (filters.length > 0) {
      filters.forEach(filter => {
        q = query(q, where(filter.field, filter.operator, filter.value));
      });
    }
    
    if (sortBy) {
      q = query(q, orderBy(sortBy.field, sortBy.direction || 'asc'));
    }
    
    const querySnapshot = await getDocs(q);
    
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return items;
  } catch (error) {
    console.error("Error getting filtered items:", error);
    throw error;
  }
};

// Add a new item to a collection
export const addItem = async (collectionName, item) => {
  try {
    // Check if Firestore is initialized
    if (!db) {
      throw new Error("Firestore is not initialized. Check your Firebase configuration.");
    }
    
    console.log(`Adding item to collection: ${collectionName}`);
    
    // Convert any non-serializable values
    const cleanItem = JSON.parse(JSON.stringify(item));
    
    // Add timestamp
    const itemWithTimestamp = {
      ...cleanItem,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    console.log('Item with timestamp:', itemWithTimestamp);
    
    // Get collection reference and add document
    const collRef = collection(db, collectionName);
    console.log('Collection reference obtained');
    
    const docRef = await addDoc(collRef, itemWithTimestamp);
    console.log(`Document added with ID: ${docRef.id}`);
    
    return {
      id: docRef.id,
      ...cleanItem
    };
  } catch (error) {
    console.error("Error adding item:", error);
    // Add more context to the error
    if (error.code === 'permission-denied') {
      console.error("This appears to be a permissions issue. Check your Firestore rules.");
    }
    throw error;
  }
};

// Update an existing item
export const updateItem = async (collectionName, id, updates) => {
  try {
    const docRef = doc(db, collectionName, id);
    
    // Add updated timestamp
    const updatesWithTimestamp = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(docRef, updatesWithTimestamp);
    return {
      id,
      ...updates
    };
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
};

// Delete an item
export const deleteItem = async (collectionName, id) => {
  try {
    console.log(`Deleting item from collection '${collectionName}' with ID: ${id}`);
    
    // Check if Firestore is initialized
    if (!db) {
      const error = new Error("Firestore is not initialized. Check your Firebase configuration.");
      console.error(error);
      throw error;
    }
    
    // Get a reference to the document
    const docRef = doc(db, collectionName, id);
    console.log(`Document reference created for ${collectionName}/${id}`);
    
    // Check if document exists before deleting
    try {
      console.log(`Attempting to delete document: ${collectionName}/${id}`);
      await deleteDoc(docRef);
      console.log(`Successfully deleted document: ${collectionName}/${id}`);
      return true;
    } catch (deleteError) {
      console.error(`Failed to delete document: ${collectionName}/${id}`, deleteError);
      throw deleteError;
    }
  } catch (error) {
    console.error(`Error in deleteItem for ${collectionName}/${id}:`, error);
    console.error("Error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    throw error;
  }
};