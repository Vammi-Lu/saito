class RegistrationForm {
  static rules = {
    login: {
      minLength: 3,
      pattern: /^[a-zA-Z0-9._-]+$/,
      messages: {
        required: 'Введите логин',
        length: 'Введите не менее 3 символов',
        pattern: 'Только латинские буквы, цифры, знаки _ - и .'
      }
    },

    email: {
      pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      messages: {
        required: 'Введите электронную почту',
        pattern: 'Почта должна быть валидной (почта@домен.домен)'
      }
    },

    password: {
      minLength: 8,
      pattern: /^(?=.*[A-Za-z])(?=.*\d).+$/,
      messages: {
        required: 'Введите пароль',
        length: 'Введите не менее 8 символов',
        pattern: 'Пароль должен содержать буквы и цифры'
      }
    }
  };
}


class UsersDB {
  constructor() {
    this.dbName = "app-db";
    this.storeName = "users";
    this.version = 3;
    this.db = null;
  }

  async init() {
    this.db = await this.#openDB();
  }

  #openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        console.log(`Обновление БД до версии ${this.version}...`);
        
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: "id" });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      
      request.onblocked = () => {
        // alert("Пожалуйста, закройте другие вкладки этого сайта для обновления приложения.");
      };
    });
  }

  #store(mode = "readonly") {
    if (!this.db.objectStoreNames.contains(this.storeName)) {
      throw new Error(`Хранилище "${this.storeName}" не найдено. Попробуйте очистить кэш/IndexedDB или повысить версию БД.`);
    }
    return this.db
      .transaction(this.storeName, mode)
      .objectStore(this.storeName);
  }
  
  async deleteDatabase() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.deleteDatabase(this.dbName);
      req.onsuccess = () => {
        console.log("База данных успешно удалена");
        resolve();
      };
      req.onerror = () => reject("Не удалось удалить БД");
    });
  }

  async isLoginExists(login) {
    const users = await this.getAll();
    return users.some((u) => u.login === login);
  }

  async isEmailExists(email) {
    const users = await this.getAll();
    return users.some((u) => u.email === email);
  }

  async add(user) {
    const jsonUser = user.toJSON();
    if (await this.isLoginExists(user.login)) {
      throw new Error("LOGIN_EXISTS");
    }

    if (await this.isEmailExists(user.email)) {
      throw new Error("EMAIL_EXISTS");
    }

    return new Promise((resolve, reject) => {
      const req = this.#store("readwrite").add(jsonUser);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async get(id) {
    return new Promise((resolve, reject) => {
      const req = this.#store().get(id);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => reject(req.error);
    });
  }

  async getAll() {
    return new Promise((resolve, reject) => {
      const req = this.#store().getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async remove(id) {
    return new Promise((resolve, reject) => {
      const req = this.#store("readwrite").delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async clear() {
    return new Promise((resolve, reject) => {
      const req = this.#store("readwrite").clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
}

class User {
  #passwordHash;

  constructor(data, { isAlreadyHashed = false } = {}) {
    this.id =
      data.id ?? Date.now().toString(36) + Math.random().toString(36).slice(2);

    this.createdAt = data.createdAt ?? new Date().toISOString();
    this.login = data.login;
    this.email = data.email;

    this.#passwordHash = isAlreadyHashed
      ? data.passwordHash
      : this.#passwordHashing(data.password);
  
    this.displayName = data.displayName;
  }

  #passwordHashing(password) {
    return btoa(password);
  }

  verifyPassword(password) {
    return this.#passwordHashing(password) === this.#passwordHash;
  }

  update(data) {
    if (data.login) this.login = data.login;
    if (data.email) this.email = data.email;
    if (data.password) {
      this.#passwordHash = this.#passwordHashing(data.password);
    }
  }

  toJSON() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      login: this.login,
      email: this.email,
      displayName: this.displayName,
      passwordHash: this.#passwordHash
    };
  }

  static fromDB(data) {
    if (!data) return null;
    return new User(data, { isAlreadyHashed: true });
  }
}

const usersDataBase = new UsersDB();
await usersDataBase.init().catch(err => {
  console.error('Критическая ошибка инициализации БД:', err);
});

const testUser = new User({
  login: "SindiMilashka",
  email: "sindi@milashka.ru",
  password: "dK3#!$%&M",
  displayName: "Синди Милашка",
});

try {
  await usersDataBase.add(testUser);
  console.log("Пользователь создан");
} catch (e) {
  if (e.message === "LOGIN_EXISTS") console.log("Логин уже занят");
  if (e.message === "EMAIL_EXISTS") console.log("Email уже используется");
}

console.log(await usersDataBase.getAll());

export { usersDataBase, User, RegistrationForm };