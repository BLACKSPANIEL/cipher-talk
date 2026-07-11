import 'package:hive/hive.dart';

part 'local_chat.g.dart';

@HiveType(typeId: 1)
class LocalChat extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String participantName;

  @HiveField(2)
  final String avatarEmoji;

  @HiveField(3)
  final String lastMessage;

  @HiveField(4)
  final int unreadCount;

  @HiveField(5)
  final DateTime lastMessageTime;

  @HiveField(6)
  final bool isOnline;

  LocalChat({
    required this.id,
    required this.participantName,
    this.avatarEmoji = '👤',
    required this.lastMessage,
    this.unreadCount = 0,
    required this.lastMessageTime,
    this.isOnline = false,
  });
}