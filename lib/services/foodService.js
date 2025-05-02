import { addItem, getItems, updateItem, deleteItem } from '../db';

const COLLECTION_NAME = 'foods';

export const getFoods = async () => {
  return await getItems(COLLECTION_NAME);
};

export const addFood = async (food) => {
  return await addItem(COLLECTION_NAME, food);
};

export const updateFood = async (id, updates) => {
  return await updateItem(COLLECTION_NAME, id, updates);
};

export const deleteFood = async (id) => {
  return await deleteItem(COLLECTION_NAME, id);
};