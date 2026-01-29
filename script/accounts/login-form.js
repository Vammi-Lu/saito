import { User, usersDataBase, RegistrationForm } from "./login.js";
import { BASE_PATH } from "../variables-constants.js";

async function proceedLoginForm(formElement, isRegistration = false) {
  const form = formElement;
  
  const usernameInput = form.querySelector('#login-username');
  const passwordInput = form.querySelector('#login-password');
  const emailInput = form.querySelector('#login-email');
  const displayNameInput = form.querySelector('#login-displayname');
  const submitButton = form.querySelector('#login-button');

  const formError = form.querySelector('.form-error');

  function showFormError(message) {
    if (!formError) return;
    formError.textContent = message;
    formError.hidden = false;
  }

  function clearFormError() {
    if (!formError) return;
    formError.hidden = true;
    formError.textContent = '';
  }

  function showError(input, message) {
    let errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
      errorElement.textContent = message;
    } else {
      errorElement = document.createElement('span');
      errorElement.className = 'error-message';
      errorElement.textContent = message;
      input.after(errorElement);
    }

    input.classList.add('error');
  }

  function clearError(input) {
    input.classList.remove('error');
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
      errorElement.remove();
    }
  }

  function validateInputs() {
    let isValid = true;

    const fields = [
      { input: usernameInput, rules: RegistrationForm.rules.login },
      { input: passwordInput, rules: RegistrationForm.rules.password },
      isRegistration && { input: emailInput, rules: RegistrationForm.rules.email },
      isRegistration && {
        input: displayNameInput,
        rules: {
          messages: { required: 'Введите отображаемое имя' }
        }
      }
    ].filter(Boolean);

    fields.forEach(({ input, rules }) => {
      const value = input.value.trim();

      if (!value) {
        showError(input, rules.messages.required);
        isValid = false;
        return;
      }

      if (rules.minLength && value.length < rules.minLength) {
        showError(input, rules.messages.length);
        isValid = false;
        return;
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        showError(input, rules.messages.pattern);
        isValid = false;
        return;
      }

      clearError(input);
    });

    return isValid;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    clearFormError();

    [usernameInput, passwordInput, emailInput, displayNameInput]
      .filter(Boolean)
      .forEach(clearError);

    if (isRegistration && !validateInputs()) {
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

        const allUsers = await usersDataBase.getAll();
        const registeredUser = allUsers.find(u => u.login === newUser.login);

        if (registeredUser) {
          localStorage.setItem('currentUserId', registeredUser.id);
        }

				form.reset();

				document.body.style.display = "none";
				window.location.replace(BASE_PATH + '#profile');
				window.location.reload();

      } else {
        const login = usernameInput.value.trim();
        const password = passwordInput.value;

        const allUsers = await usersDataBase.getAll();
        const user = allUsers.find(u => u.login === login);

        if (!user || !User.fromDB(user).verifyPassword(password)) {
          showFormError('Неверное имя пользователя или пароль');
          return;
        }

        localStorage.setItem('currentUserId', user.id);
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
      input.addEventListener('input', () => {
        clearError(input);
        clearFormError();
      });
    });
}

export { proceedLoginForm };
