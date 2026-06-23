import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'features/chat/screens/chat_list_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ProviderScope(child: CipherTalkApp()));
}

class CipherTalkApp extends StatelessWidget {
  const CipherTalkApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Cipher Talk',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark(),
      home: const ChatListScreen(),
    );
  }
}