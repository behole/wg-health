import { addItem, getItems, updateItem, deleteItem } from '../db';

const COLLECTION_NAME = 'medicines';

export const getMedicines = async () => {
  return await getItems(COLLECTION_NAME);
};

export const addMedicine = async (medicine) => {
  return await addItem(COLLECTION_NAME, medicine);
};

export const updateMedicine = async (id, updates) => {
  return await updateItem(COLLECTION_NAME, id, updates);
};

export const deleteMedicine = async (id) => {
  return await deleteItem(COLLECTION_NAME, id);
};