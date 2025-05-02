import { addItem, getItems, updateItem, deleteItem } from '../db';

const COLLECTION_NAME = 'tvShows';

export const getTvShows = async () => {
  return await getItems(COLLECTION_NAME);
};

export const addTvShow = async (show) => {
  return await addItem(COLLECTION_NAME, show);
};

export const updateTvShow = async (id, updates) => {
  return await updateItem(COLLECTION_NAME, id, updates);
};

export const deleteTvShow = async (id) => {
  return await deleteItem(COLLECTION_NAME, id);
};