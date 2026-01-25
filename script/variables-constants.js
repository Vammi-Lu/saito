import { readJSON } from "./utils/json.js";
import { usersDataBase } from "./login.js";

const pathSegments = window.location.pathname.split('/').filter(Boolean);
const repoRoot = window.location.hostname.includes("github.io") ? `/${pathSegments[0]}` : "";

const BASE_PATH = window.location.origin + repoRoot;
const CURRENT_PATH = "/" + pathSegments.slice(repoRoot ? 1 : 0).join("/");

const META_DATA_PATH = `${BASE_PATH}/data/meta.json`;
const NAVIGATION_DATA_PATH = `${BASE_PATH}/data/navigation.json`;
const CONTENT_DATA_PATH = `${BASE_PATH}/data/content.json`;

async function getCurrentUser() {
	const currentUserId = sessionStorage.getItem('currentUserId');
	console.log(currentUserId);
  
  if (!currentUserId) {
    return null;
  }

  try {
    await usersDataBase.init();
    const userData = await usersDataBase.get(currentUserId);
    
    if (!userData) {
      sessionStorage.removeItem('currentUserId');
      return null;
    }

    return {
      id: userData.id,
      login: userData.login,
      email: userData.email,
      displayName: userData.displayName,
      createdAt: userData.createdAt
    };
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
    return null;
  }
}

const [
	META_DATA,
	NAVIGATION_DATA,
	CONTENT_DATA,
	CURRENT_USER
] = await Promise.all([
	readJSON(META_DATA_PATH),
	readJSON(NAVIGATION_DATA_PATH),
	readJSON(CONTENT_DATA_PATH),
	getCurrentUser()
]);

const LOGGED_IN = CURRENT_USER !== null;

export {
	BASE_PATH,
	CURRENT_PATH,
	META_DATA,	
	NAVIGATION_DATA,
	CONTENT_DATA,
	LOGGED_IN,
	CURRENT_USER
};