import type {FcmMessage, FcmMulticastMessage} from "@models/fcmMessage";
import type {Message, MulticastMessage} from "firebase-admin/messaging";

export const toFcmMessage = (object: any, token: string): FcmMessage => {
    return {
        data: {
            type: object.data.type,
            value: JSON.stringify(object.data.value)
        },
        android: {
            priority: object.android.priority,
            notification: {
                channelId: object.android.notification.channelId,
                icon: object.android.notification.icon
            }
        },
        apns: {
            headers: {
                apnsPushType: object.apns.headers.apnsPushType,
                apnsPriority: object.apns.headers.apnsPriority,
                apnsCollapseId: object.apns.headers.apnsCollapseId
            },
            payload: {
                aps: {
                    alert: {
                        title: object.apns.payload.aps.alert.title,
                        body: object.apns.payload.aps.alert.body
                    },
                    sound: object.apns.payload.aps.sound,
                    badge: object.apns.payload.aps.badge
                }
            }
        },
        token: token
    };
}

export const toFcmMulticastMessage = (object: any, tokens: string[]): FcmMulticastMessage => {
    return {
        data: {
            type: object.data.type,
            value: JSON.stringify(object.data.value)
        },
        android: {
            priority: object.android.priority,
            notification: {
                channelId: object.android.notification.channelId,
                icon: object.android.notification.icon
            }
        },
        apns: {
            headers: {
                apnsPushType: object.apns.headers.apnsPushType,
                apnsPriority: object.apns.headers.apnsPriority,
                apnsCollapseId: object.apns.headers.apnsCollapseId
            },
            payload: {
                aps: {
                    alert: {
                        title: object.apns.payload.aps.alert.title,
                        body: object.apns.payload.aps.alert.body
                    },
                    sound: object.apns.payload.aps.sound,
                    badge: object.apns.payload.aps.badge
                }
            }
        },
        tokens: tokens
    };
}

export const toMulticastMessage = (fcmMulticastMessage: FcmMulticastMessage): MulticastMessage => {
    return {
        data: {
            type: fcmMulticastMessage.data.type,
            value: JSON.stringify(fcmMulticastMessage.data.value)
        },
        android: {
            priority: fcmMulticastMessage.android.priority,
            notification: {
                channelId: fcmMulticastMessage.android.notification.channelId,
                icon: fcmMulticastMessage.android.notification.icon
            }
        },
        apns: {
            headers: {
                "apns-push-type": fcmMulticastMessage.apns.headers.apnsPushType,
                "apns-priority": fcmMulticastMessage.apns.headers.apnsPriority,
                "apns-collapse-id": fcmMulticastMessage.apns.headers.apnsCollapseId
            },
            payload: {
                aps: {
                    alert: {
                        title: fcmMulticastMessage.apns.payload.aps.alert.title,
                        body: fcmMulticastMessage.apns.payload.aps.alert.body
                    },
                    sound: fcmMulticastMessage.apns.payload.aps.sound,
                    badge: fcmMulticastMessage.apns.payload.aps.badge
                }
            }
        },
        tokens: fcmMulticastMessage.tokens
    };
}

export const toMessage = (fcmMessage: FcmMessage): Message => {
    return {
        data: {
            type: fcmMessage.data.type,
            value: fcmMessage.data.value
        },
        android: {
            priority: fcmMessage.android.priority,
            notification: {
                channelId: fcmMessage.android.notification.channelId,
                icon: fcmMessage.android.notification.icon
            }
        },
        apns: {
            headers: {
                "apns-push-type": fcmMessage.apns.headers.apnsPushType,
                "apns-priority": fcmMessage.apns.headers.apnsPriority,
                "apns-collapse-id": fcmMessage.apns.headers.apnsCollapseId
            },
            payload: {
                aps: {
                    alert: {
                        title: fcmMessage.apns.payload.aps.alert.title,
                        body: fcmMessage.apns.payload.aps.alert.body
                    },
                    sound: fcmMessage.apns.payload.aps.sound,
                    badge: fcmMessage.apns.payload.aps.badge
                }
            }
        },
        token: fcmMessage.token
    };
}