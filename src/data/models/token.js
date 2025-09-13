class FcmToken {
  #userId;
  #value;

  constructor(userId, value) {
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
    return {
      fcmToken: this.value
    };
  }

  static fileName() {
    return "fcmToken.json";
  }
}

module.exports = FcmToken;
