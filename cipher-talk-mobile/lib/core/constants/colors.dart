import 'package:flutter/material.dart';

class AppColors {
  // Background
  static const Color background = Color(0xFF05070d);
  static const Color backgroundSecondary = Color(0xFF0a0f17);
  static const Color backgroundCard = Color(0xFF0e141c);

  // Neon Accents
  static const Color emerald = Color(0xFF10f5b5);
  static const Color emeraldDark = Color(0xFF059669);
  static const Color cyan = Color(0xFF22d3ee);
  static const Color violet = Color(0xFF8b5cf6);

  // Text
  static const Color textPrimary = Color(0xFFffffff);
  static const Color textSecondary = Color(0xFFa1a1aa);
  static const Color textMuted = Color(0xFF71717a);

  // Borders
  static const Color borderSubtle = Color(0xFF27272a);
  static const Color borderDefault = Color(0xFF3f3f46);
  static const Color borderEmerald = Color(0xFF10f5b5);

  // Glass
  static const Color glassBackground = Color(0x0affffff);
  static const Color glassBorder = Color(0x14ffffff);

  // Status
  static const Color success = Color(0xFF10b981);
  static const Color warning = Color(0xFFf59e0b);
  static const Color error = Color(0xFFef4444);
  static const Color info = Color(0xFF3b82f6);

  // Gradients
  static const Gradient emeraldGradient = LinearGradient(
    colors: [Color(0xFF10f5b5), Color(0xFF22d3ee)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const Gradient violetGradient = LinearGradient(
    colors: [Color(0xFF8b5cf6), Color(0xFFec4899)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const Gradient darkGradient = LinearGradient(
    colors: [Color(0xFF0a0f17), Color(0xFF05070d)],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );
}