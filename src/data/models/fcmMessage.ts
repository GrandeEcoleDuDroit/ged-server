export interface FcmMessage {
    data: FcmData;
    android: AndroidConfig;
    apns: ApnsConfig;
    token: string;
}

export interface FcmMulticastMessage {
    data: FcmData;
    android: AndroidConfig;
    apns: ApnsConfig;
    tokens: string[];
}

export interface FcmNotification {
    title: string;
    body: string;
}

export interface FcmData {
    type: string;
    value: string;
}

export interface AndroidConfig {
    priority: 'high' | 'normal' | undefined;
    notification: AndroidNotification;
}

export interface AndroidNotification {
    channelId: string;
    icon: string;
}

export interface ApnsConfig {
    headers: ApnsHeaders;
    payload: ApnsPayload;
}

export interface ApnsHeaders {
    apnsPushType: string;
    apnsPriority: string;
    apnsCollapseId: string;
}

export interface ApnsPayload {
    aps: Aps
}

export interface Aps {
    alert: Alert;
    sound: string;
    badge: number;
}

export interface Alert {
    title: string;
    body: string;
}