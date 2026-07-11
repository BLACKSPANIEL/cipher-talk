import 'package:hive/hive.dart';

part 'local_message.g.dart';

@HiveType(typeId: 0)
class LocalMessage extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String chatId;

  @HiveField(2)
  final String senderId;

  @HiveField(3)
  final String text;

  @HiveField(4)
  final DateTime timestamp;

  @HiveField(5)
  final bool isRead;

  @HiveField(6)
  final String encryptionStatus; // 'encrypted', 'decrypted', 'failed'

  LocalMessage({
    required this.id,
    required this.chatId,
    required this.senderId,
    required this.text,
    required this.timestamp,
    this.isRead = false,
    this.encryptionStatus = 'encrypted',
  });
}