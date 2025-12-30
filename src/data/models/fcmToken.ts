export default class FcmToken {
    readonly userId: string;
    readonly value: string;

    constructor(userId: string, value: string) {
        this.userId = userId;
        this.value = value;
    }

    toJson() {
        return {
            fcmToken: this.value
        };
    }

    static fileName() {
        return 'fcmToken.json';
    }
}