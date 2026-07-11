import 'package:flutter/material.dart';

/// Cipher Talk premium dark theme colors
class AppColors {
  AppColors._();

  // Core colors
  static const Color darkBackground = Color(0xFF0A0A0A);
  static const Color darkSurface = Color(0xFF1A1A1A);
  static const Color darkCard = Color(0xFF222222);

  // Neon accents
  static const Color neonEmerald = Color(0xFF10f5b5);
  static const Color neonCyan = Color(0xFF22d3ee);
  static const Color neonViolet = Color(0xFF8B5CF6);

  // Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [neonEmerald, neonCyan],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  // Status colors
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = Color(0xFFEF4444);

  // Text
  static const Color textPrimary = Color(0xFFFFFFFF);
  static const Color textSecondary = Color(0xFF9CA3AF);
  static const Color textHint = Color(0xFF6B7280);

  // Glassmorphism
  static Color glassBackground = Colors.white.withValues(alpha: 0.05);
  static Color glassBorder = Colors.white.withValues(alpha: 0.1);
}
