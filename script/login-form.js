import { User, usersDataBase, RegistrationForm } from "./login.js";

async function proceedLoginForm(formElement, isRegistration = false) {
  const form = formElement;
  
  const usernameInput = form.querySelector('#login-username');
  const passwordInput = form.querySelector('#login-password');
  const emailInput = form.querySelector('#login-email');
  const displayNameInput = form.querySelector('#login-displayname');
  const submitButton = form.querySelector('#login-button');

  function showError(input, message) {
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    input.classList.add('error');
    
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = 'red';
    errorElement.style.fontSize = '12px';
    errorElement.style.marginTop = '4px';
    errorElement.style.display = 'block';
    
    input.parentElement.insertBefore(errorElement, input.nextSibling);
  }

  function clearError(input) {
    input.classList.remove('error');
    const errorElement = input.parentElement.querySelector('.error-message');
    if (errorElement) errorElement.remove();
  }

function validateInputs() {
  let isValid = true;

  if (!usernameInput.value.trim()) {
    showError(usernameInput, 'Введите логин');
    isValid = false;
  } else if (isRegistration && !RegistrationForm.validationPatterns.login.test(usernameInput.value)) {
    showError(usernameInput, RegistrationForm.validateMessages.login);
    isValid = false;
  } else {
    clearError(usernameInput);
  }

  if (!passwordInput.value) {
    showError(passwordInput, 'Введите пароль');
    isValid = false;
  } else if (isRegistration && !RegistrationForm.validationPatterns.password.test(passwordInput.value)) {
    showError(passwordInput, RegistrationForm.validateMessages.password);
    isValid = false;
  } else {
    clearError(passwordInput);
  }

  if (isRegistration) {
    if (!emailInput.value.trim()) {
      showError(emailInput, 'Введите электронную почту');
      isValid = false;
    } else if (!RegistrationForm.validationPatterns.email.test(emailInput.value)) {
      showError(emailInput, RegistrationForm.validateMessages.email);
      isValid = false;
    } else {
      clearError(emailInput);
    }

    if (!displayNameInput.value.trim()) {
      showError(displayNameInput, 'Введите отображаемое имя');
      isValid = false;
    } else {
      clearError(displayNameInput);
    }
  }

  return isValid;
}

  async function handleSubmit(e) {
    e.preventDefault();

    [usernameInput, passwordInput, emailInput, displayNameInput]
      .filter(Boolean)
      .forEach(clearError);
			
			if (!validateInputs()) {
				return;
			}

    submitButton.disabled = true;
    const originalText = submitButton.textContent;
		submitButton.textContent = 'Обработка...';

    try {
			if (isRegistration) {
        const newUser = new User({
          login: usernameInput.value.trim(),
          email: emailInput.value.trim(),
          password: passwordInput.value,
          displayName: displayNameInput.value.trim(),
        });

        await usersDataBase.add(newUser);
        
        // Автоматический логин после регистрации
        const allUsers = await usersDataBase.getAll();
        const registeredUser = allUsers.find(u => u.login === newUser.login);
        
        if (registeredUser) {
          sessionStorage.setItem('currentUserId', registeredUser.id);
        }
        
        form.reset();
        
        window.location.href = '/profile';
        
      } else {
        const allUsers = await usersDataBase.getAll();
        const user = allUsers.find(u => u.login === usernameInput.value.trim());

        if (!user) {
          showError(usernameInput, 'Пользователь не найден');
          return;
        }

        const userInstance = User.fromDB(user);
        
        if (!userInstance.verifyPassword(passwordInput.value)) {
          showError(passwordInput, 'Неверный пароль');
          return;
        }
        
        sessionStorage.setItem('currentUserId', user.id);
        
        window.location.href = '/';
      }

    } catch (error) {
      if (error.message === 'LOGIN_EXISTS') {
        showError(usernameInput, 'Этот логин уже занят');
      } else if (error.message === 'EMAIL_EXISTS') {
        showError(emailInput, 'Эта почта уже используется');
      } else {
        alert('Произошла ошибка: ' + error.message);
        console.error(error);
      }
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  }

  form.addEventListener('submit', handleSubmit);

  [usernameInput, passwordInput, emailInput, displayNameInput]
    .filter(Boolean)
    .forEach(input => {
      input.addEventListener('input', () => clearError(input));
    });
}


export { proceedLoginForm };