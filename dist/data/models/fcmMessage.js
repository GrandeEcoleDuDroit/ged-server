export class FcmMessage {
    constructor(data, android) {
        this.data = data;
        this.android = android;
    }
}
class FcmData {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}
class FcmAndroid {
    constructor(notification, priority) {
        this.notification = notification;
        this.priority = priority;
    }
}
class FcmAndroidNotification {
    constructor(channelId, icon) {
        this.channelId = channelId;
        this.icon = icon;
    }
}
var AndroidMessagePriority;
(function (AndroidMessagePriority) {
    AndroidMessagePriority["High"] = "high";
})(AndroidMessagePriority || (AndroidMessagePriority = {}));
