import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/routes/app_router.dart';
import '../../../shared/providers/chat_provider.dart';

class ChatListScreen extends ConsumerWidget {
  const ChatListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final chatState = ref.watch(chatProvider);

    return Scaffold(
      backgroundColor: AppTheme.darkBackground,
      body: CustomScrollView(
        slivers: [
          // Glassmorphism AppBar
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
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Row(
                        children: [
                          Icon(
                            LucideIcons.messageSquare,
                            color: AppTheme.neonEmerald,
                            size: 28,
                          ),
                          SizedBox(width: 12),
                          Text(
                            'Cipher Talk',
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.w700,
                              color: Colors.white,
                              letterSpacing: 0.5,
                            ),
                          ),
                        ],
                      ),
                      IconButton(
                        icon: const Icon(
                          LucideIcons.settings,
                          color: AppTheme.neonEmerald,
                          size: 24,
                        ),
                        onPressed: () {
                          Navigator.pushReplacementNamed(context, AppRouter.settings);
                        },
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          // Chat list
          SliverToBoxAdapter(
            child: chatState.isLoading
                ? const Center(
                    child: Padding(
                      padding: EdgeInsets.all(32),
                      child: CircularProgressIndicator(
                        color: AppTheme.neonEmerald,
                      ),
                    ),
                  )
                : ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    itemCount: chatState.chats.length,
                    itemBuilder: (context, index) {
                      final chat = chatState.chats[index];
                      return _buildChatCard(context, theme, chat);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildChatCard(BuildContext context, ThemeData theme, Chat chat) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: GestureDetector(
        onTap: () {
          Navigator.pushNamed(context, AppRouter.chatScreen, arguments: {'chatId': chat.id});
        },
        child: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                AppTheme.darkSurface,
                AppTheme.darkSurface.withValues(alpha: 0.8),
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: Colors.white.withValues(alpha: 0.05),
              width: 1,
            ),
          ),
          child: ListTile(
            contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            leading: Stack(
              children: [
                Container(
                  width: 56,
                  height: 56,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: LinearGradient(
                      colors: [AppTheme.neonEmerald, AppTheme.neonCyan],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                  ),
                  child: const Icon(
                    LucideIcons.user,
                    size: 28,
                    color: AppTheme.darkBackground,
                  ),
                ),
                if (chat.isOnline)
                  Positioned(
                    bottom: 2,
                    right: 2,
                    child: Container(
                      width: 14,
                      height: 14,
                      decoration: BoxDecoration(
                        color: AppTheme.neonEmerald,
                        shape: BoxShape.circle,
                        border: Border.all(color: AppTheme.darkSurface, width: 2),
                      ),
                    ),
                  ),
              ],
            ),
            title: Text(
              chat.name,
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w600,
                color: Colors.white,
              ),
            ),
            subtitle: Text(
              chat.lastMessage,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: Colors.white60,
                fontSize: 13,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            trailing: Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  chat.time,
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: AppTheme.neonEmerald.withValues(alpha: 0.7),
                    fontSize: 12,
                  ),
                ),
                const SizedBox(height: 4),
                if (chat.unreadCount > 0)
                  Container(
                    width: 20,
                    height: 20,
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppTheme.neonEmerald,
                    ),
                    child: Center(
                      child: Text(
                        '${chat.unreadCount}',
                        style: const TextStyle(
                          color: AppTheme.darkBackground,
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
