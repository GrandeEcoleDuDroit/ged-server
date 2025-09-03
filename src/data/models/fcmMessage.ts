export class FcmMessage {
    readonly data: FcmData;
    readonly android: FcmAndroid;

    constructor(data: FcmData, android: FcmAndroid) {
        this.data = data
        this.android = android
    }
}

class FcmData {
    readonly type: string;
    readonly value: string;

    constructor(type: string, value: string) {
        this.type = type;
        this.value = value;
    }
}

class FcmAndroid {
    readonly notification: FcmAndroidNotification;
    readonly priority: AndroidMessagePriority;

    constructor(
        notification: FcmAndroidNotification,
        priority: AndroidMessagePriority
    ) {
        this.notification = notification;
        this.priority = priority;
    }
}

class FcmAndroidNotification {
    readonly channelId: string;
    readonly icon: string;

    constructor(channelId: string, icon: string) {
        this.channelId = channelId;
        this.icon = icon;
    }
}

enum AndroidMessagePriority {
    High = "high"
}