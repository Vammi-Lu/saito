import { readJSON } from "./utils/json.js";

const META_DATA_PATH = "/data/meta.json";
const NAVIGATION_DATA_PATH = "/data/navigation.json";

const [META_DATA, NAVIGATION_DATA] = await Promise.all([
	readJSON(META_DATA_PATH),
	readJSON(NAVIGATION_DATA_PATH)
]);


export { META_DATA, NAVIGATION_DATA };