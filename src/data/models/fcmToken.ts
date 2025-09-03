type FcmTokenJson = Record<string, string>;

export class FcmToken {
  readonly userId: string;
  readonly value: string;

  constructor(userId: string, value: string) {
    this.userId = userId;
    this.value = value;
  }

  toJson(): FcmTokenJson {
    return {
      fcmToken: this.value
    };
  }

  static fileName(): string {
    return "fcmToken.json";
  }
}