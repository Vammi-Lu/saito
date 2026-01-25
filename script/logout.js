function logout() {
  sessionStorage.removeItem('currentUserId');
	sessionStorage.clear();
	console.log('Пользователь вышел из системы');
}

logout();

window.location.href = '/';