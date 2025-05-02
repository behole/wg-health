import { addItem, getItems, updateItem, deleteItem } from '../db';

const COLLECTION_NAME = 'books';

export const getBooks = async () => {
  return await getItems(COLLECTION_NAME);
};

export const addBook = async (book) => {
  return await addItem(COLLECTION_NAME, book);
};

export const updateBook = async (id, updates) => {
  return await updateItem(COLLECTION_NAME, id, updates);
};

export const deleteBook = async (id) => {
  return await deleteItem(COLLECTION_NAME, id);
};