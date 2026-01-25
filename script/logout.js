function logout() {
  localStorage.removeItem('currentUserId');
  console.log('Пользователь вышел из системы');
  window.location.href = '/';
}

logout();
