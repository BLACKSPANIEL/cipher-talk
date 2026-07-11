import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/theme/app_theme.dart';
import 'core/routes/app_router.dart';
import 'shared/services/storage_service.dart';
import 'shared/providers/storage_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Hive storage
  final storageService = StorageService();
  await storageService.initialize();
  
  runApp(ProviderScope(
    overrides: [
      storageServiceProvider.overrideWithValue(storageService),
    ],
    child: const CipherTalkApp(),
  ));
}

class CipherTalkApp extends ConsumerWidget {
  const CipherTalkApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = ref.watch(appThemeProvider);

    return MaterialApp(
      title: 'Cipher Talk',
      debugShowCheckedModeBanner: false,
      theme: theme.lightTheme,
      darkTheme: theme.darkTheme,
      themeMode: ThemeMode.dark,
      initialRoute: AppRouter.splash,
      onGenerateRoute: AppRouter.generateRoute,
    );
  }
}