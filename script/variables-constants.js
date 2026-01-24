import { readJSON } from "./utils/json.js";

const META_DATA_PATH = "/data/meta.json";
const NAVIGATION_DATA_PATH = "/data/navigation.json";
const CONTENT_DATA_PATH = "/data/content.json";

const [
	META_DATA,
	NAVIGATION_DATA,
	CONTENT_DATA] = await Promise.all([
	readJSON(META_DATA_PATH),
	readJSON(NAVIGATION_DATA_PATH),
	readJSON(CONTENT_DATA_PATH)
]);

const CURRENT_PATH = window.location.pathname.replace(/\.[^/.]+$/, "") || "/";

export {
	CURRENT_PATH,
	META_DATA,
	NAVIGATION_DATA,
	CONTENT_DATA
};