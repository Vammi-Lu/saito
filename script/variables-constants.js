import { readJSON } from "./utils/json.js";

const pathSegments = window.location.pathname.split('/').filter(Boolean);
const repoRoot = window.location.hostname.includes("github.io") ? `/${pathSegments[0]}` : "";

const BASE_PATH = window.location.origin + repoRoot + "/";
const CURRENT_PATH = "/" + pathSegments.slice(repoRoot ? 1 : 0).join("/");
const RELATIVE_PATH = pathSegments.slice(repoRoot ? 1 : 0).join("/");

const META_DATA_PATH = `${BASE_PATH}data/meta.json`;
const NAVIGATION_DATA_PATH = `${BASE_PATH}data/navigation.json`;
const CONTENT_DATA_PATH = `${BASE_PATH}data/content.json`;

const [
	META_DATA,
	NAVIGATION_DATA,
	CONTENT_DATA] = await Promise.all([
	readJSON(META_DATA_PATH),
	readJSON(NAVIGATION_DATA_PATH),
	readJSON(CONTENT_DATA_PATH)
]);


export {
	BASE_PATH,
	CURRENT_PATH,
	RELATIVE_PATH,
	META_DATA,	
	NAVIGATION_DATA,
	CONTENT_DATA
};