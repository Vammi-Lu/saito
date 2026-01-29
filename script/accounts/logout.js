import { BASE_PATH } from "../variables-constants.js";

function logout() {
  localStorage.removeItem('currentUserId');
	console.log('Пользователь вышел из системы');
	document.body.style.display = "none";
  window.location.href = BASE_PATH + '/';
}

export { logout };