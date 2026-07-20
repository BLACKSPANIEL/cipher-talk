// Role hierarchy: Owner > Super Admin > Admin > Moderator > Helper > User
export type UserRole = 'owner' | 'super_admin' | 'admin' | 'moderator' | 'helper' | 'user';

export interface RoleConfig {
  level: number;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
  permissions: string[];
  features: string[];
}

export const ROLES: Record<UserRole, RoleConfig> = {
  owner: {
    level: 5,
    label: 'Owner',
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30',
    glowColor: 'rgba(139, 92, 246, 0.5)',
    permissions: [
      'manage_all_users',
      'manage_admins',
      'manage_super_admins',
      'delete_any_message',
      'ban_users',
      'view_analytics',
      'manage_settings',
      'full_access',
      'transfer_ownership',
    ],
    features: [
      'Безлимитные сообщения',
      'Все виды шифрования',
      'Управление админами',
      'Полный доступ к аналитике',
      'Кастомные темы',
      'Приоритетная поддержка 24/7',
      'Beta-фичи',
    ],
  },
  super_admin: {
    level: 4,
    label: 'Super Admin',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    glowColor: 'rgba(239, 68, 68, 0.5)',
    permissions: [
      'manage_admins',
      'manage_moderators',
      'delete_any_message',
      'ban_users',
      'view_analytics',
      'manage_rooms',
      'manage_settings',
    ],
    features: [
      'Безлимитные сообщения',
      'Все виды шифрования',
      'Управление админами',
      'Расширенная аналитика',
      'Приоритетная поддержка',
    ],
  },
  admin: {
    level: 3,
    label: 'Admin',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    glowColor: 'rgba(16, 245, 181, 0.5)',
    permissions: [
      'manage_moderators',
      'delete_messages',
      'ban_users',
      'view_analytics',
      'manage_rooms',
    ],
    features: [
      'Безлимитные сообщения',
      'Все виды шифрования',
      'Групповые чаты',
      'Приоритетная поддержка',
    ],
  },
  moderator: {
    level: 2,
    label: 'Moderator',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    glowColor: 'rgba(234, 179, 8, 0.5)',
    permissions: [
      'delete_messages',
      'warn_users',
      'manage_rooms',
      'view_reports',
    ],
    features: [
      '1000 сообщений/день',
      'E2EE шифрование',
      'Групповые чаты',
      'Управление репортами',
    ],
  },
  helper: {
    level: 1,
    label: 'Helper',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    glowColor: 'rgba(96, 165, 250, 0.5)',
    permissions: [
      'view_reports',
      'help_users',
      'send_messages',
    ],
    features: [
      '500 сообщений/день',
      'E2EE шифрование',
      'Помощь пользователям',
      'Просмотр репортов',
    ],
  },
  user: {
    level: 0,
    label: 'User',
    color: 'text-zinc-400',
    bgColor: 'bg-zinc-500/10',
    borderColor: 'border-zinc-500/30',
    glowColor: 'rgba(161, 161, 170, 0.3)',
    permissions: [
      'send_messages',
      'create_rooms',
    ],
    features: [
      '100 сообщений/день',
      'Базовое шифрование',
      '1-on-1 чаты',
      'Web + Desktop',
    ],
  },
};

// Premium tiers
export type PremiumTier = 'free' | 'pro' | 'elite';

export interface TierConfig {
  level: number;
  label: string;
  color: string;
  price: string;
  features: string[];
  limits: {
    messages: number;
    rooms: number;
    fileSize: string;
  };
}

export const TIERS: Record<PremiumTier, TierConfig> = {
  free: {
    level: 1,
    label: 'Free',
    color: 'text-zinc-400',
    price: '0 ₽',
    features: [
      '100 сообщений/день',
      'Базовое шифрование',
      '1-on-1 чаты',
      'Web + Desktop',
    ],
    limits: {
      messages: 100,
      rooms: 10,
      fileSize: '2 MB',
    },
  },
  pro: {
    level: 2,
    label: 'Pro',
    color: 'text-emerald-400',
    price: '299 ₽/мес',
    features: [
      '1000 сообщений/день',
      'E2EE шифрование',
      'Групповые чаты',
      'Файлы до 10 MB',
      'Приоритетная поддержка',
    ],
    limits: {
      messages: 1000,
      rooms: 50,
      fileSize: '10 MB',
    },
  },
  elite: {
    level: 3,
    label: 'Elite',
    color: 'text-cyan-400',
    price: '599 ₽/мес',
    features: [
      'Безлимитные сообщения',
      'Все виды шифрования',
      'Неограниченные чаты',
      'Файлы до 50 MB',
      'VIP поддержка',
      'Эксклюзивные темы',
      'Ранний доступ к фичам',
    ],
    limits: {
      messages: -1, // unlimited
      rooms: -1,
      fileSize: '50 MB',
    },
  },
};

// Helper functions
export function canManageUser(currentRole: UserRole, targetRole: UserRole): boolean {
  return ROLES[currentRole].level > ROLES[targetRole].level;
}

export function hasPermission(role: UserRole, permission: string): boolean {
  return ROLES[role].permissions.includes(permission);
}

export function getTierFeatures(tier: PremiumTier): string[] {
  return TIERS[tier].features;
}

export function getTierLimits(tier: PremiumTier) {
  return TIERS[tier].limits;
}

export function getRoleBadge(role: UserRole) {
  return ROLES[role];
}