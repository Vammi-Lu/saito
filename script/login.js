class RegistrationForm {
  static validationPatterns = {
    login: /^[a-zA-Z0-9._-]{3,}$/,
    email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
  };

  static validateMessages = {
    login: "Логин должен быть не менее 3 символов",
    email: "Почта должна быть валидной (почта@домен.домен)",
    password: "Пароль должен быть не менее 8 символов",
  };

  static validateField(field, pattern) {
    return pattern.test(field.value);
  }
}

class UsersDB {
  constructor() {
    this.dbName = "app-db";
    this.storeName = "users";
    this.db = null;
  }

  async init() {
    this.db = await this.#openDB();
  }

  #openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;

        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, {
            keyPath: "id",
          });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  #store(mode = "readonly") {
    return this.db
      .transaction(this.storeName, mode)
      .objectStore(this.storeName);
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
    if (await this.isLoginExists(user.login)) {
      throw new Error("LOGIN_EXISTS");
    }

    if (await this.isEmailExists(user.email)) {
      throw new Error("EMAIL_EXISTS");
    }

    return new Promise((resolve, reject) => {
      const req = this.#store("readwrite").add(user);
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
      passwordHash: this.#passwordHash,
    };
  }

  static fromDB(data) {
    if (!data) return null;
    return new User(data, { isAlreadyHashed: true });
  }
}


const usersDataBase = new UsersDB();
await usersDataBase.init();

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