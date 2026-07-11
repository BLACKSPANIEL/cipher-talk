import 'package:flutter_riverpod/flutter_riverpod.dart';

// Auth state
class AuthState {
  final bool isAuthenticated;
  final bool isLoading;
  final String? userId;

  AuthState({
    this.isAuthenticated = false,
    this.isLoading = true,
    this.userId,
  });

  AuthState copyWith({
    bool? isAuthenticated,
    bool? isLoading,
    String? userId,
  }) {
    return AuthState(
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      isLoading: isLoading ?? this.isLoading,
      userId: userId ?? this.userId,
    );
  }
}

// Auth notifier
class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier() : super(AuthState());

  Future<void> login(String email, String password) async {
    state = state.copyWith(isLoading: true);
    // Simulate API call
    await Future.delayed(const Duration(seconds: 1));
    state = state.copyWith(
      isAuthenticated: true,
      isLoading: false,
      userId: 'user_123',
    );
  }

  Future<void> register(String name, String email, String password) async {
    state = state.copyWith(isLoading: true);
    await Future.delayed(const Duration(seconds: 1));
    state = state.copyWith(
      isAuthenticated: true,
      isLoading: false,
      userId: 'user_123',
    );
  }

  void logout() {
    state = AuthState();
  }
}

// Auth provider
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier();
});