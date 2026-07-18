// Role hierarchy: Owner > Admin > Moderator > User
export type UserRole = 'owner' | 'admin' | 'moderator' | 'user';

export interface RoleConfig {
  level: number;
  label: string;
  color: string;
  permissions: string[];
  features: string[];
}

export const ROLES: Record<UserRole, RoleConfig> = {
  owner: {
    level: 4,
    label: 'Owner',
    color: 'text-emerald-400',
    permissions: [
      'manage_all_users',
      'manage_admins',
      'manage_moderators',
      'delete_any_message',
      'ban_users',
      'view_analytics',
      'manage_settings',
      'full_access',
    ],
    features: [
      'Unlimited messages',
      'All encryption types',
      'Priority support',
      'Beta features',
      'Custom themes',
      'Advanced admin panel',
    ],
  },
  admin: {
    level: 3,
    label: 'Admin',
    color: 'text-cyan-400',
    permissions: [
      'manage_moderators',
      'delete_messages',
      'ban_users',
      'view_analytics',
      'manage_rooms',
    ],
    features: [
      'Unlimited messages',
      'All encryption types',
      'Priority support',
      'Advanced features',
    ],
  },
  moderator: {
    level: 2,
    label: 'Moderator',
    color: 'text-violet-400',
    permissions: [
      'delete_messages',
      'warn_users',
      'manage_rooms',
    ],
    features: [
      '1000 messages/day',
      'E2EE encryption',
      'Group chats',
    ],
  },
  user: {
    level: 1,
    label: 'User',
    color: 'text-zinc-400',
    permissions: [
      'send_messages',
      'create_rooms',
    ],
    features: [
      '100 messages/day',
      'Basic encryption',
      '1-on-1 chats',
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