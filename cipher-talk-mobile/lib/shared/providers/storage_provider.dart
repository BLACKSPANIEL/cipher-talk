import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/storage_service.dart';

// Storage service provider
final storageServiceProvider = Provider<StorageService>((ref) {
  return StorageService();
});

// Database size provider
final databaseSizeProvider = FutureProvider<String>((ref) async {
  final storageService = ref.watch(storageServiceProvider);
  return await storageService.getDatabaseSizeFormatted();
});

// Messages count provider
final messagesCountProvider = FutureProvider<int>((ref) async {
  final storageService = ref.watch(storageServiceProvider);
  return await storageService.getTotalMessagesCount();
});

// Chats count provider
final chatsCountProvider = FutureProvider<int>((ref) async {
  final storageService = ref.watch(storageServiceProvider);
  return await storageService.getTotalChatsCount();
});

// Storage state for cache operations
class StorageState {
  final bool isClearing;
  final String? lastClearedAt;

  StorageState({
    this.isClearing = false,
    this.lastClearedAt,
  });

  StorageState copyWith({
    bool? isClearing,
    String? lastClearedAt,
  }) {
    return StorageState(
      isClearing: isClearing ?? this.isClearing,
      lastClearedAt: lastClearedAt ?? this.lastClearedAt,
    );
  }
}

class StorageNotifier extends StateNotifier<StorageState> {
  final StorageService _storageService;

  StorageNotifier(this._storageService) : super(StorageState());

  Future<void> clearAllCache() async {
    state = state.copyWith(isClearing: true);
    try {
      await _storageService.clearAllCache();
      final now = DateTime.now();
      state = state.copyWith(
        isClearing: false,
        lastClearedAt: '${now.day}.${now.month}.${now.year} ${now.hour}:${now.minute}',
      );
    } catch (e) {
      state = state.copyWith(isClearing: false);
      rethrow;
    }
  }
}

final storageNotifierProvider = StateNotifierProvider<StorageNotifier, StorageState>((ref) {
  final storageService = ref.watch(storageServiceProvider);
  return StorageNotifier(storageService);
});