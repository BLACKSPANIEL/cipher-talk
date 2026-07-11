// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'local_chat.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class LocalChatAdapter extends TypeAdapter<LocalChat> {
  @override
  final int typeId = 1;

  @override
  LocalChat read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return LocalChat(
      id: fields[0] as String,
      participantName: fields[1] as String,
      avatarEmoji: fields[2] as String,
      lastMessage: fields[3] as String,
      unreadCount: fields[4] as int,
      lastMessageTime: fields[5] as DateTime,
      isOnline: fields[6] as bool,
    );
  }

  @override
  void write(BinaryWriter writer, LocalChat obj) {
    writer
      ..writeByte(7)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.participantName)
      ..writeByte(2)
      ..write(obj.avatarEmoji)
      ..writeByte(3)
      ..write(obj.lastMessage)
      ..writeByte(4)
      ..write(obj.unreadCount)
      ..writeByte(5)
      ..write(obj.lastMessageTime)
      ..writeByte(6)
      ..write(obj.isOnline);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is LocalChatAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
