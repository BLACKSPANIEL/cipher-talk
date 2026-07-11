import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';

class Chat {
  final String id;
  final String name;
  final String lastMessage;
  final String time;
  final int unreadCount;
  final bool isOnline;

  Chat({
    required this.id,
    required this.name,
    required this.lastMessage,
    required this.time,
    this.unreadCount = 0,
    this.isOnline = false,
  });
}

class ChatState {
  final List<Chat> chats;
  final bool isLoading;

  ChatState({
    this.chats = const [],
    this.isLoading = false,
  });

  ChatState copyWith({
    List<Chat>? chats,
    bool? isLoading,
  }) {
    return ChatState(
      chats: chats ?? this.chats,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

class ChatNotifier extends StateNotifier<ChatState> {
  ChatNotifier() : super(ChatState()) {
    _loadChats();
  }

  Future<void> _loadChats() async {
    state = state.copyWith(isLoading: true);
    // Simulate loading chats
    await Future.delayed(const Duration(milliseconds: 500));
    state = state.copyWith(
      chats: List.generate(
        10,
        (index) => Chat(
          id: 'chat_$index',
          name: 'User ${index + 1}',
          lastMessage: 'Hey! How are you doing? This is a preview...',
          time: '${12 + index}:${30 + index * 3}',
          unreadCount: index % 3,
          isOnline: index % 2 == 0,
        ),
      ),
      isLoading: false,
    );
  }

  void markAsRead(String chatId) {
    state = state.copyWith(
      chats: state.chats.map((chat) {
        if (chat.id == chatId) {
          return Chat(
            id: chat.id,
            name: chat.name,
            lastMessage: chat.lastMessage,
            time: chat.time,
            unreadCount: 0,
            isOnline: chat.isOnline,
          );
        }
        return chat;
      }).toList(),
    );
  }
}

final chatProvider = StateNotifierProvider<ChatNotifier, ChatState>((ref) {
  return ChatNotifier();
});

// Messages provider
class Message {
  final String id;
  final String text;
  final bool isMe;
  final String time;
  final String status; // 'sent', 'delivered', 'read'

  Message({
    required this.id,
    required this.text,
    required this.isMe,
    required this.time,
    this.status = 'sent',
  });
}

class MessagesState {
  final List<Message> messages;
  final bool isLoading;
  final bool isTyping;

  MessagesState({
    this.messages = const [],
    this.isLoading = false,
    this.isTyping = false,
  });

  MessagesState copyWith({
    List<Message>? messages,
    bool? isLoading,
    bool? isTyping,
  }) {
    return MessagesState(
      messages: messages ?? this.messages,
      isLoading: isLoading ?? this.isLoading,
      isTyping: isTyping ?? this.isTyping,
    );
  }
}

class MessagesNotifier extends StateNotifier<MessagesState> {
  MessagesNotifier() : super(MessagesState());

  Future<void> loadMessages(String chatId) async {
    state = state.copyWith(isLoading: true);
    // Simulate loading messages
    await Future.delayed(const Duration(milliseconds: 300));
    state = state.copyWith(
      messages: [
        Message(
          id: const Uuid().v4(),
          text: 'Hey! How are you?',
          isMe: false,
          time: '10:30',
          status: 'read',
        ),
        Message(
          id: const Uuid().v4(),
          text: 'I\'m good, thanks! Working on the new Cipher Talk app.',
          isMe: true,
          time: '10:31',
          status: 'read',
        ),
        Message(
          id: const Uuid().v4(),
          text: 'That sounds awesome! Can\'t wait to see it.',
          isMe: false,
          time: '10:32',
          status: 'read',
        ),
        Message(
          id: const Uuid().v4(),
          text: 'The design is going to be premium with glassmorphism and neon accents.',
          isMe: true,
          time: '10:33',
          status: 'delivered',
        ),
      ],
      isLoading: false,
    );
  }

  void sendMessage(String text) {
    if (text.trim().isEmpty) return;
    final newMessage = Message(
      id: const Uuid().v4(),
      text: text,
      isMe: true,
      time: DateTime.now().toString().substring(11, 16),
      status: 'sent',
    );
    state = state.copyWith(
      messages: [...state.messages, newMessage],
    );
  }

  void setTyping(bool isTyping) {
    state = state.copyWith(isTyping: isTyping);
  }
}

final messagesProvider = StateNotifierProvider.family<MessagesNotifier, MessagesState, String>((ref, chatId) {
  return MessagesNotifier();
});