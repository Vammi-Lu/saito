function logout() {
  localStorage.removeItem('currentUserId');
	console.log('Пользователь вышел из системы');
	document.body.style.display = "none";
  window.location.href = "";
}

export { logout };