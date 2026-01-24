// data.js
import { readJSON } from "./utils/json.js";

const META_DATA_PATH = "/data/meta.json";

const [META_DATA] = await Promise.all([
	readJSON(META_DATA_PATH),
]);


export { META_DATA };