import 'dart:io';
import 'package:hive_flutter/hive_flutter.dart';
import '../models/local_message.dart';
import '../models/local_chat.dart';

class StorageService {
  static const String _messagesBoxName = 'messages';
  static const String _chatsBoxName = 'chats';

  Future<void> initialize() async {
    await Hive.initFlutter();
    
    // Register adapters
    if (!Hive.isAdapterRegistered(0)) {
      Hive.registerAdapter(LocalMessageAdapter());
    }
    if (!Hive.isAdapterRegistered(1)) {
      Hive.registerAdapter(LocalChatAdapter());
    }
    
    // Open boxes
    await Hive.openBox<LocalMessage>(_messagesBoxName);
    await Hive.openBox<LocalChat>(_chatsBoxName);
  }

  // Message operations
  Future<void> saveMessage(LocalMessage message) async {
    final box = Hive.box<LocalMessage>(_messagesBoxName);
    await box.put(message.id, message);
  }

  Future<List<LocalMessage>> getMessages(String chatId) async {
    final box = Hive.box<LocalMessage>(_messagesBoxName);
    return box.values.where((msg) => msg.chatId == chatId).toList();
  }

  Future<void> saveMessagesBatch(List<LocalMessage> messages) async {
    final box = Hive.box<LocalMessage>(_messagesBoxName);
    final Map<dynamic, LocalMessage> map = {
      for (var msg in messages) msg.id: msg
    };
    await box.putAll(map);
  }

  // Chat operations
  Future<void> saveChat(LocalChat chat) async {
    final box = Hive.box<LocalChat>(_chatsBoxName);
    await box.put(chat.id, chat);
  }

  Future<List<LocalChat>> getAllChats() async {
    final box = Hive.box<LocalChat>(_chatsBoxName);
    return box.values.toList();
  }

  Future<void> saveChatsBatch(List<LocalChat> chats) async {
    final box = Hive.box<LocalChat>(_chatsBoxName);
    final Map<dynamic, LocalChat> map = {
      for (var chat in chats) chat.id: chat
    };
    await box.putAll(map);
  }

  // Cache operations
  Future<void> clearAllCache() async {
    final messagesBox = Hive.box<LocalMessage>(_messagesBoxName);
    final chatsBox = Hive.box<LocalChat>(_chatsBoxName);
    
    await messagesBox.clear();
    await chatsBox.clear();
    
    // Clear temporary files
    try {
      final tempDir = Directory.systemTemp;
      if (tempDir.existsSync()) {
        // Clean app-specific temp files if needed
      }
    } catch (e) {
      // Ignore temp directory cleanup errors
    }
  }

  Future<int> getDatabaseSizeInBytes() async {
    int totalSize = 0;
    
    try {
      final messagesBox = Hive.box<LocalMessage>(_messagesBoxName);
      final chatsBox = Hive.box<LocalChat>(_chatsBoxName);
      
      // Get Hive database file size
      final hiveDir = Directory('${Directory.current.path}/.dart_tool/hive');
      if (await hiveDir.exists()) {
        await for (var entity in hiveDir.list(recursive: true, followLinks: false)) {
          if (entity is File) {
            totalSize += await entity.length();
          }
        }
      }
      
      // Add box sizes
      totalSize += messagesBox.length * 200; // Approximate size per message
      totalSize += chatsBox.length * 150; // Approximate size per chat
    } catch (e) {
      // Return estimated size if calculation fails
      totalSize = 0;
    }
    
    return totalSize;
  }

  Future<String> getDatabaseSizeFormatted() async {
    final bytes = await getDatabaseSizeInBytes();
    
    if (bytes < 1024) {
      return '$bytes B';
    } else if (bytes < 1024 * 1024) {
      return '${(bytes / 1024).toStringAsFixed(1)} KB';
    } else {
      return '${(bytes / (1024 * 1024)).toStringAsFixed(1)} MB';
    }
  }

  // Statistics
  Future<int> getTotalMessagesCount() async {
    final box = Hive.box<LocalMessage>(_messagesBoxName);
    return box.length;
  }

  Future<int> getTotalChatsCount() async {
    final box = Hive.box<LocalChat>(_chatsBoxName);
    return box.length;
  }

  Future<void> close() async {
    await Hive.close();
  }
}