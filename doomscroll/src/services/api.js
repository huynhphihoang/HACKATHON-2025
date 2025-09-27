// Minimal API service for data fetching only
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

// Get all levels with their types (replaces hardcoded categories)
export const getLevels = async () => {
  try {
    const response = await fetch(`${STRAPI_URL}/level`);
    if (!response.ok) throw new Error(`Failed to fetch levels: ${response.status}`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching levels:', error);
    throw error;
  }
};

// Get collections for specific level/type (replaces hardcoded collection fetch)
export const getCollections = async (levelName, typeName) => {
  try {
    const response = await fetch(`${STRAPI_URL}/level/${encodeURIComponent(levelName)}/${encodeURIComponent(typeName)}/collection`);
    if (!response.ok) throw new Error(`Failed to fetch collections: ${response.status}`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching collections:', error);
    throw error;
  }
};

// Fallback to legacy endpoint
export const getAllCollections = async () => {
  try {
    const response = await fetch(`${STRAPI_URL}/collection`);
    if (!response.ok) throw new Error(`Failed to fetch collections: ${response.status}`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching all collections:', error);
    throw error;
  }
};
