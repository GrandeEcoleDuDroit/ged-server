/**
 * Abstract Class Token.
 *
 * @class Token
 */
class Token {
  /**
   * Creates an instance of Token.
   *
   * @param {string} userId
   * @param {string} value
   */
  constructor(userId, value) {
    if (new.target === Token) {
      throw new TypeError("Cannot construct Token instances directly");
    }
    this.userId = userId;
    this.value = value;
  }

  /**
   * Get the userId.
   *
   * @returns {string}
   */
  get userId() {
    return this.userId;
  }

  /**
   * Get the token.
   *
   * @returns {string}
   */
  get token() {
    return this.token;
  }

  /**
   * Get Json value.
   */
  toJSON() {
    throw new Error("Must implement toJSON method");
  }

  /**
   * Get the file name.
   *
   * @returns {string}
   */
  static getFileName() {
    throw new Error("Must implement getFilename method");
  }
}

class FCMToken extends Token {
  constructor(userId, value) {
    super(userId, value);
  }

  toJSON() {
    return {
      fcmToken: this.value
    };
  }

  static getFileName() {
    return "fcmToken.json";
  }
}

module.exports = FCMToken;
