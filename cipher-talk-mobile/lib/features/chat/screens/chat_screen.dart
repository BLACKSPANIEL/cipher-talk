import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/routes/app_router.dart';
import '../../../shared/providers/chat_provider.dart';

class ChatScreen extends ConsumerStatefulWidget {
  final String chatId;
  const ChatScreen({super.key, required this.chatId});

  @override
  ConsumerState<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends ConsumerState<ChatScreen> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(messagesProvider(widget.chatId).notifier).loadMessages(widget.chatId);
    });
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _sendMessage() {
    if (_messageController.text.trim().isEmpty) return;
    ref.read(messagesProvider(widget.chatId).notifier).sendMessage(_messageController.text);
    _messageController.clear();
    _scrollToBottom();
  }

  void _scrollToBottom() {
    Future.delayed(const Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final messagesState = ref.watch(messagesProvider(widget.chatId));

    return Scaffold(
      backgroundColor: AppTheme.darkBackground,
      appBar: AppBar(
        backgroundColor: AppTheme.darkSurface,
        leading: IconButton(
          icon: const Icon(LucideIcons.arrowLeft, color: Colors.white),
          onPressed: () => Navigator.pushReplacementNamed(context, AppRouter.chatList),
        ),
        title: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  colors: [AppTheme.neonEmerald, AppTheme.neonCyan],
                ),
              ),
              child: const Icon(
                LucideIcons.user,
                size: 20,
                color: Color(0xFF05070d),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'User ${widget.chatId.split('_').last}',
                    style: theme.textTheme.titleSmall?.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  if (messagesState.isTyping)
                    Text(
                      'typing...',
                      style: TextStyle(
                        color: AppTheme.neonEmerald.withValues(alpha: 0.8),
                        fontSize: 12,
                      ),
                    )
                  else
                    Text(
                      'Online',
                      style: TextStyle(
                        color: AppTheme.neonEmerald.withValues(alpha: 0.7),
                        fontSize: 12,
                      ),
                    ),
                ],
              ),
            ),
            const Icon(
              LucideIcons.shield,
              color: AppTheme.neonEmerald,
              size: 20,
            ),
          ],
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: messagesState.isLoading
                ? const Center(
                    child: CircularProgressIndicator(color: AppTheme.neonEmerald),
                  )
                : ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.all(16),
                    itemCount: messagesState.messages.length,
                    itemBuilder: (context, index) {
                      final message = messagesState.messages[index];
                      return _buildMessageBubble(message, theme);
                    },
                  ),
          ),
          // E2EE indicator
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            color: AppTheme.darkSurface.withValues(alpha: 0.5),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(LucideIcons.lock, size: 12, color: AppTheme.neonEmerald),
                const SizedBox(width: 6),
                Text(
                  'End-to-End Encrypted',
                  style: TextStyle(
                    color: AppTheme.neonEmerald.withValues(alpha: 0.7),
                    fontSize: 11,
                    letterSpacing: 0.3,
                  ),
                ),
              ],
            ),
          ),
          _buildInputArea(),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(Message message, ThemeData theme) {
    final isMe = message.isMe;
    final status = message.status;

    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: isMe ? MainAxisAlignment.end : MainAxisAlignment.start,
        children: [
          if (!isMe) ...[
            Container(
              width: 32,
              height: 32,
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  colors: [AppTheme.neonEmerald, AppTheme.neonCyan],
                ),
              ),
              child: const Icon(LucideIcons.user, size: 16, color: Color(0xFF05070d)),
            ),
            const SizedBox(width: 8),
          ],
          Flexible(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: isMe
                      ? [AppTheme.neonEmerald.withValues(alpha: 0.15), AppTheme.neonCyan.withValues(alpha: 0.1)]
                      : [AppTheme.darkSurface, AppTheme.darkSurface.withValues(alpha: 0.8)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.only(
                  topLeft: const Radius.circular(20),
                  topRight: const Radius.circular(20),
                  bottomLeft: isMe ? const Radius.circular(20) : const Radius.circular(4),
                  bottomRight: isMe ? const Radius.circular(4) : const Radius.circular(20),
                ),
                border: Border.all(
                  color: isMe
                      ? AppTheme.neonEmerald.withValues(alpha: 0.3)
                      : Colors.white.withValues(alpha: 0.05),
                  width: 1,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    message.text,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 15,
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        message.time,
                        style: TextStyle(
                          color: Colors.white.withValues(alpha: 0.5),
                          fontSize: 11,
                        ),
                      ),
                      if (isMe) ...[
                        const SizedBox(width: 4),
                        Icon(
                          status == 'read'
                              ? LucideIcons.checkCheck
                              : LucideIcons.check,
                          size: 14,
                          color: status == 'read' ? AppTheme.neonEmerald : Colors.white60,
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),
          ),
          if (isMe) const SizedBox(width: 8),
        ],
      ),
    );
  }

  Widget _buildInputArea() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        border: Border(
          top: BorderSide(color: Colors.white.withValues(alpha: 0.05), width: 1),
        ),
      ),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(LucideIcons.paperclip, color: AppTheme.neonEmerald),
            onPressed: () {},
          ),
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                color: AppTheme.darkBackground,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
              ),
              child: TextField(
                controller: _messageController,
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(
                  hintText: 'Type a message...',
                  hintStyle: TextStyle(color: Colors.white38),
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                ),
                onChanged: (value) {
                  ref.read(messagesProvider(widget.chatId).notifier).setTyping(value.isNotEmpty);
                },
                onSubmitted: (_) => _sendMessage(),
              ),
            ),
          ),
          const SizedBox(width: 8),
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [AppTheme.neonEmerald, AppTheme.neonCyan],
              ),
              shape: BoxShape.circle,
            ),
            child: IconButton(
              icon: const Icon(
                LucideIcons.send,
                color: Color(0xFF05070d),
                size: 20,
              ),
              onPressed: _sendMessage,
            ),
          ),
        ],
      ),
    );
  }
}
