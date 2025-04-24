class Token {
  #userId;
  #value;

  constructor(userId, value) {
    if (new.target === Token) {
      throw new TypeError("Cannot construct Token instances directly");
    }
    this.#userId = userId;
    this.#value = value;
  }

  get userId() {
    return this.#userId;
  }

  get value() {
    return this.#value;
  }

  toJson() {
    throw new Error("Must implement toJSON method");
  }

  static fileName() {
    throw new Error("Must implement getFilename method");
  }
}

class FCMToken extends Token {
  constructor(userId, value) {
    super(userId, value);
  }

  toJson() {
    return {
      fcmToken: this.value
    };
  }

  static fileName() {
    return "fcmToken.json";
  }
}

module.exports = FCMToken;
