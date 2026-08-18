export interface AccessibilityPreferences {
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderAnnouncements: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}