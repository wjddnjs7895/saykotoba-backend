export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  APPLE = 'apple',
}

export enum SubscriptionStatus {
  NONE = 'none',
  TRIAL = 'trial',
  ACTIVE = 'active',
  GRACE_PERIOD = 'grace',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export enum StoreType {
  GOOGLE_PLAY = 'google_play',
  APP_STORE = 'app_store',
}
