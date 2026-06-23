import 'package:flutter/material.dart';
import '../core/constants/colors.dart';

class GlassCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final VoidCallback? onTap;
  final bool isActive;

  const GlassCard({
    super.key,
    required this.child,
    this.padding,
    this.margin,
    this.onTap,
    this.isActive = false,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        margin: margin ?? EdgeInsets.zero,
        padding: padding ?? const EdgeInsets.all(20),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: isActive
                ? [AppColors.emerald.withOpacity(0.1), AppColors.cyan.withOpacity(0.05)]
                : [Colors.white.withOpacity(0.04), Colors.transparent],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: isActive ? AppColors.emerald.withOpacity(0.3) : AppColors.glassBorder,
            width: 1,
          ),
          boxShadow: [
            if (isActive)
              BoxShadow(
                color: AppColors.emerald.withOpacity(0.15),
                blurRadius: 20,
                spreadRadius: 2,
              ),
          ],
        ),
        child: child,
      ),
    );
  }
}