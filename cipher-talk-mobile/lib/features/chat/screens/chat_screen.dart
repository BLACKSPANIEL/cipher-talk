import 'package:flutter/material.dart';
import '../../../shared/widgets/glass_card.dart';
import '../../../core/constants/colors.dart';

class ChatScreen extends StatelessWidget {
  final String chatName;

  const ChatScreen({super.key, required this.chatName});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                gradient: AppColors.emeraldGradient,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Center(
                child: Text(
                  chatName[0],
                  style: const TextStyle(
                    color: AppColors.background,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  chatName,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const Text(
                  'Online',
                  style: TextStyle(
                    fontSize: 12,
                    color: AppColors.emerald,
                  ),
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.lock, color: AppColors.emerald, size: 20),
            onPressed: () {},
          ),
        ],
      ),
      body: Column(
        children: [
          // Messages
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: 10,
              itemBuilder: (context, index) {
                final isMe = index % 2 == 1;
                return Align(
                  alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    decoration: BoxDecoration(
                      gradient: isMe
                          ? AppColors.emeraldGradient
                          : LinearGradient(
                              colors: [AppColors.backgroundCard, AppColors.backgroundSecondary],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                      borderRadius: BorderRadius.circular(20).copyWith(
                        bottomRight: isMe ? Radius.zero : null,
                        bottomLeft: !isMe ? Radius.zero : null,
                      ),
                      border: Border.all(
                        color: isMe ? AppColors.emerald.withOpacity(0.3) : AppColors.borderSubtle,
                        width: 1,
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if (isMe)
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            children: const [
                              Icon(Icons.lock, size: 12, color: AppColors.emerald),
                              SizedBox(width: 4),
                              Text(
                                'E2EE',
                                style: TextStyle(
                                  fontSize: 10,
                                  color: AppColors.emerald,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        const SizedBox(height: 4),
                        Text(
                          isMe ? 'Да, конечно! Уже бегу 🚀' : 'Привет! Готов к вечеринке? 🎉',
                          style: TextStyle(
                            color: isMe ? AppColors.background : AppColors.textPrimary,
                            fontSize: 15,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '19:${43 - index}',
                          style: TextStyle(
                            color: isMe ? AppColors.background.withOpacity(0.7) : AppColors.textMuted,
                            fontSize: 11,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          // Input
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.backgroundSecondary,
              border: Border(
                top: BorderSide(color: AppColors.borderSubtle, width: 1),
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    decoration: BoxDecoration(
                      color: AppColors.backgroundCard,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppColors.borderSubtle),
                    ),
                    child: const TextField(
                      decoration: InputDecoration(
                        hintText: 'Напишите сообщение...',
                        hintStyle: TextStyle(color: AppColors.textMuted),
                        border: InputBorder.none,
                        isDense: true,
                        contentPadding: EdgeInsets.zero,
                      ),
                      style: TextStyle(color: AppColors.textPrimary),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Container(
                  decoration: BoxDecoration(
                    gradient: AppColors.emeraldGradient,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.emerald.withOpacity(0.3),
                        blurRadius: 12,
                      ),
                    ],
                  ),
                  child: IconButton(
                    onPressed: () {},
                    icon: const Icon(Icons.send, color: AppColors.background),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}