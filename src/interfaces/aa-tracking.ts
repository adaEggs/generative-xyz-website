export interface IAATrackingConfig {
  debugMode: boolean;
}

export interface ITrackEventPayload {
  eventName: string;
  userId: string;
  userPseudoId: string;
  eventParams: Array<{
    key: string;
    value: unknown;
  }>;
}

export interface ITrackPageViewPayload {
  [key: string]: unknown;
}
