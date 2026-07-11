import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/routes/app_router.dart';
import '../../../shared/providers/storage_provider.dart';

class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final databaseSizeAsync = ref.watch(databaseSizeProvider);
    final storageState = ref.watch(storageNotifierProvider);

    return Scaffold(
      backgroundColor: AppTheme.darkBackground,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 100,
            floating: false,
            pinned: true,
            backgroundColor: Colors.transparent,
            flexibleSpace: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    AppTheme.darkSurface.withValues(alpha: 0.9),
                    AppTheme.darkSurface.withValues(alpha: 0.7),
                    Colors.transparent,
                  ],
                ),
              ),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                child: Padding(
                  padding: const EdgeInsets.only(top: 16, left: 20, right: 20, bottom: 8),
                  child: Row(
                    children: [
                      IconButton(
                        icon: const Icon(LucideIcons.arrowLeft, color: Colors.white),
                        onPressed: () => Navigator.pushReplacementNamed(context, AppRouter.chatList),
                      ),
                      const SizedBox(width: 8),
                      Text('Settings', style: theme.textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.w700, color: Colors.white)),
                    ],
                  ),
                ),
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(colors: [
                        AppTheme.darkSurface,
                        AppTheme.darkSurface.withValues(alpha: 0.8),
                      ], begin: Alignment.topLeft, end: Alignment.bottomRight),
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: Colors.white.withValues(alpha: 0.05), width: 1),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 72, height: 72,
                          decoration: const BoxDecoration(
                            shape: BoxShape.circle,
                            gradient: LinearGradient(colors: [AppTheme.neonEmerald, AppTheme.neonCyan]),
                          ),
                          child: const Icon(LucideIcons.user, size: 36, color: Color(0xFF05070d)),
                        ),
                        const SizedBox(width: 20),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Alex Johnson', style: theme.textTheme.titleLarge?.copyWith(
                                fontWeight: FontWeight.w700, color: Colors.white)),
                              const SizedBox(height: 4),
                              Row(children: [
                                Container(width: 8, height: 8,
                                  decoration: const BoxDecoration(shape: BoxShape.circle, color: AppTheme.neonEmerald)),
                                const SizedBox(width: 6),
                                const Text('Online', style: TextStyle(color: AppTheme.neonEmerald, fontSize: 13)),
                              ]),
                            ],
                          ),
                        ),
                        IconButton(
                          icon: const Icon(LucideIcons.edit3, color: AppTheme.neonEmerald),
                          onPressed: () {},
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  _buildSectionHeader(theme, 'Account'),
                  const SizedBox(height: 8),
                  _buildSettingsTile(context,
                    icon: LucideIcons.user, title: 'Profile',
                    subtitle: 'Name, photo, status', onTap: () {}),
                  _buildSettingsTile(context,
                    icon: LucideIcons.bell, title: 'Notifications',
                    subtitle: 'Message sounds, vibration', onTap: () {}),
                  _buildSettingsTile(context,
                    icon: LucideIcons.shield, title: 'Privacy & Security',
                    subtitle: 'E2EE, fingerprint lock', onTap: () {}),
                  const SizedBox(height: 24),
                  _buildSectionHeader(theme, 'Storage'),
                  const SizedBox(height: 8),
                  _buildSettingsTile(context,
                    icon: LucideIcons.database, title: 'Database Size',
                    subtitle: databaseSizeAsync.when(
                      data: (size) => 'Current: $size',
                      loading: () => 'Calculating...',
                      error: (_, __) => 'Unknown',
                    ), onTap: () {}),
                  _buildSettingsTile(context,
                    icon: LucideIcons.messageSquare, title: 'Messages',
                    subtitle: 'Total messages stored', onTap: () {}),
                  const SizedBox(height: 24),
                  _buildSectionHeader(theme, 'Appearance'),
                  const SizedBox(height: 8),
                  _buildSettingsTile(context,
                    icon: LucideIcons.palette, title: 'Theme',
                    subtitle: 'Dark theme (default)', onTap: () {}),
                  _buildSettingsTile(context,
                    icon: LucideIcons.globe, title: 'Language',
                    subtitle: 'English / Русский', onTap: () {}),
                  const SizedBox(height: 24),
                  _buildSectionHeader(theme, 'About'),
                  const SizedBox(height: 8),
                  _buildSettingsTile(context,
                    icon: LucideIcons.info, title: 'App Version',
                    subtitle: 'Cipher Talk v0.1.0', onTap: () {}),
                  _buildSettingsTile(context,
                    icon: LucideIcons.github, title: 'Open Source',
                    subtitle: 'MIT License', onTap: () {}),
                  const SizedBox(height: 24),
                  Container(
                    width: double.infinity,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(colors: [
                        AppTheme.neonEmerald.withValues(alpha: 0.1),
                        AppTheme.neonCyan.withValues(alpha: 0.05),
                      ]),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppTheme.neonEmerald.withValues(alpha: 0.3)),
                    ),
                    child: TextButton.icon(
                      onPressed: storageState.isClearing ? null : () {
                        ref.read(storageNotifierProvider.notifier).clearAllCache();
                      },
                      icon: const Icon(LucideIcons.trash2, color: AppTheme.neonEmerald),
                      label: Text(storageState.isClearing ? 'Clearing...' : 'Clear Cache',
                        style: const TextStyle(color: AppTheme.neonEmerald)),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Container(
                    width: double.infinity,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(colors: [
                        Colors.red.withValues(alpha: 0.2),
                        Colors.red.withValues(alpha: 0.1),
                      ]),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.red.withValues(alpha: 0.3)),
                    ),
                    child: TextButton.icon(
                      onPressed: () => Navigator.pushReplacementNamed(context, AppRouter.login),
                      icon: const Icon(LucideIcons.logOut, color: Colors.red),
                      label: const Text('Log Out', style: TextStyle(color: Colors.red)),
                    ),
                  ),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        ],
      ),
  Widget _buildSectionHeader(ThemeData theme, String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: 4),
      child: Text(title, style: theme.textTheme.titleSmall?.copyWith(
        color: AppTheme.neonEmerald.withValues(alpha: 0.8),
        fontWeight: FontWeight.w600, letterSpacing: 0.5)),
    );
  }

  Widget _buildSettingsTile(BuildContext context, {
    required IconData icon, required String title,
    required String subtitle, required VoidCallback onTap,
  }) {
    final theme = Theme.of(context);
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        gradient: LinearGradient(colors: [
          AppTheme.darkSurface,
          AppTheme.darkSurface.withValues(alpha: 0.8),
        ], begin: Alignment.topLeft, end: Alignment.bottomRight),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05), width: 1),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        leading: Container(
          width: 40, height: 40,
          decoration: BoxDecoration(
            gradient: LinearGradient(colors: [
              AppTheme.neonEmerald.withValues(alpha: 0.2),
              AppTheme.neonCyan.withValues(alpha: 0.15),
            ]),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: AppTheme.neonEmerald, size: 20),
        ),
        title: Text(title, style: theme.textTheme.titleMedium?.copyWith(
          fontWeight: FontWeight.w600, color: Colors.white)),
        subtitle: Text(subtitle, style: theme.textTheme.bodyMedium?.copyWith(
          color: Colors.white60, fontSize: 13)),
        trailing: Icon(LucideIcons.chevronRight,
          color: Colors.white.withValues(alpha: 0.3), size: 20),
        onTap: onTap,
      ),
    );
  }
}
