import React, { useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Text } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  visible: boolean;
  onClose: () => void;
}

export function SearchBar({ value, onChangeText, visible, onClose }: SearchBarProps) {
  const inputRef = useRef<TextInput>(null);
  const height = useSharedValue(0);

  useEffect(() => {
    height.value = withTiming(visible ? 50 : 0, { duration: 200 });
    if (visible) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    opacity: height.value / 50,
    overflow: 'hidden' as const,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TextInput
        ref={inputRef}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search by name..."
        placeholderTextColor="#999"
        testID="search-input"
      />
      <TouchableOpacity onPress={() => { onChangeText(''); onClose(); }} testID="search-close">
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: 44,
  },
  closeText: {
    fontSize: 18,
    color: '#999',
    padding: 4,
  },
});
