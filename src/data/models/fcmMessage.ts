export type FcmMessage = {
    data: FcmData;
    android: AndroidConfig;
    apns: ApnsConfig;
    token: string;
}

export type FcmNotification = {
    title: string;
    body: string;
}

export type FcmData = {
    type: string;
    value: string;
}

export type AndroidConfig = {
    priority: "high" | "normal" | undefined;
    notification: AndroidNotification;
}

export type AndroidNotification = {
    channelId: string;
    icon: string;
}

export type ApnsConfig = {
    headers: ApnsHeaders;
    payload: ApnsPayload;
}

export type ApnsHeaders = {
    apnsPriority: string;
    apnsCollapseId: string;
}

export type ApnsPayload = {
    aps: Aps
}

export type Aps = {
    alert: Alert;
    sound: string;
    badge: number;
}

export type Alert = {
    title: string;
    body: string;
}