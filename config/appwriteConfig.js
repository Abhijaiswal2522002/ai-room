// config/appwrite.js

import { Client, Storage, ID, Databases, Account } from 'appwrite';

// Initialize the Appwrite client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT) // Example: 'https://fra.cloud.appwrite.io/v1'
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT); // Your project ID

// Export services
const storage = new Storage(client);
const databases = new Databases(client);
const account = new Account(client);

// Helper: Upload file to a specific bucket
const uploadFile = async (file) => {
  try {
    const result = await storage.createFile(
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID, // Your bucket ID
      ID.unique(),
      file
    );
    return result;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

// Helper: Get preview URL for a file
const getFilePreview = (fileId) => {
  return storage.getFilePreview(process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID, fileId);
};

// Helper: Delete file
const deleteFile = async (fileId) => {
  try {
    return await storage.deleteFile(process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID, fileId);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

export {
  client,
  storage,
  databases,
  account,
  uploadFile,
  getFilePreview,
  deleteFile,
  ID,
};
