// Core types for Plan'd v2

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'family' | 'user';
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: NotificationSettings;
  accessibility: AccessibilitySettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  reminders: boolean;
}

export interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  reduceMotion: boolean;
  screenReader: boolean;
}

export interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  withPerson?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  highTemp: number;
  lowTemp: number;
  description: string;
  humidity: number;
  windSpeed: number;
  location: string;
  lastUpdated: Date;
}

export interface PriorityItem {
  id: string;
  text: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  duration?: number;
  description?: string;
  type: 'routine' | 'appointment' | 'reminder' | 'task';
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  daysOfWeek?: number[];
  endDate?: Date;
}

export interface MediaItem {
  id: string;
  title: string;
  type: 'book' | 'tv' | 'movie' | 'music';
  status: 'want-to-read' | 'reading' | 'completed' | 'watching' | 'want-to-watch';
  progress?: number;
  rating?: number;
  notes?: string;
  genres: string[];
  author?: string;
  director?: string;
  year?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicineItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  startDate: Date;
  endDate?: Date;
  instructions?: string;
  sideEffects?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FoodItem {
  id: string;
  name: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'drink';
  ingredients?: string[];
  calories?: number;
  notes?: string;
  isFavorite: boolean;
  lastEaten?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Component Props types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  'data-testid'?: string;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  padding?: 'none' | 'small' | 'medium' | 'large';
  variant?: 'default' | 'elevated' | 'outlined';
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// State types
export interface AppState {
  user: User | null;
  theme: 'light' | 'dark' | 'auto';
  isLoading: boolean;
  error: AppError | null;
  onboardingCompleted: boolean;
}