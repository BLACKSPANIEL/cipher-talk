import 'package:flutter/material.dart';
import '../../../shared/widgets/glass_card.dart';
import '../../../core/constants/colors.dart';

class ChatListScreen extends StatelessWidget {
  const ChatListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Чаты'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search, color: AppColors.emerald),
            onPressed: () {},
          ),
        ],
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: 5,
        itemBuilder: (context, index) {
          final chats = [
            {'name': 'Алексей', 'message': 'Привет! Готов к вечеринке? 🎉', 'time': '19:42', 'online': true},
            {'name': 'Мария', 'message': 'Отлично, увидимся!', 'time': '18:30', 'online': true},
            {'name': 'Дмитрий', 'message': 'Код готов к ревью', 'time': '17:15', 'online': false},
            {'name': 'Елена', 'message': 'Спасибо за помощь!', 'time': 'Вчера', 'online': false},
            {'name': 'Сергей', 'message': 'Встреча завтра в 10', 'time': 'Вчера', 'online': true},
          ];

          final chat = chats[index];
          final isActive = index == 0;

          return GlassCard(
            isActive: isActive,
            margin: const EdgeInsets.only(bottom: 12),
            onTap: () {
              // Navigate to chat screen
            },
            child: Row(
              children: [
                // Avatar
                Stack(
                  children: [
                    Container(
                      width: 56,
                      height: 56,
                      decoration: BoxDecoration(
                        gradient: isActive ? AppColors.emeraldGradient : null,
                        color: isActive ? null : AppColors.backgroundCard,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: isActive ? AppColors.emerald : AppColors.borderSubtle,
                          width: 1,
                        ),
                      ),
                      child: Center(
                        child: Text(
                          chat['name']![0],
                          style: TextStyle(
                            color: isActive ? AppColors.background : AppColors.textSecondary,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                    if (chat['online'] == true)
                      Positioned(
                        right: 0,
                        bottom: 0,
                        child: Container(
                          width: 14,
                          height: 14,
                          decoration: BoxDecoration(
                            color: AppColors.emerald,
                            shape: BoxShape.circle,
                            border: Border.all(color: AppColors.background, width: 2),
                            boxShadow: [
                              BoxShadow(
                                color: AppColors.emerald.withOpacity(0.5),
                                blurRadius: 8,
                              ),
                            ],
                          ),
                        ),
                      ),
                  ],
                ),
                const SizedBox(width: 16),
                // Content
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            chat['name']!,
                            style: const TextStyle(
                              color: AppColors.textPrimary,
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            chat['time']!,
                            style: const TextStyle(
                              color: AppColors.textMuted,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        chat['message']!,
                        style: const TextStyle(
                          color: AppColors.textSecondary,
                          fontSize: 14,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
      floatingActionButton: Container(
        decoration: BoxDecoration(
          gradient: AppColors.emeraldGradient,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: AppColors.emerald.withOpacity(0.4),
              blurRadius: 20,
              spreadRadius: 2,
            ),
          ],
        ),
        child: FloatingActionButton(
          onPressed: () {},
          backgroundColor: Colors.transparent,
          elevation: 0,
          child: const Icon(Icons.add, color: AppColors.background),
        ),
      ),
    );
  }
}