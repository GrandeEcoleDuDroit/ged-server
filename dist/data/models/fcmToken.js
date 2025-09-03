export class FcmToken {
    constructor(userId, value) {
        this.userId = userId;
        this.value = value;
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
