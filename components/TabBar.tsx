import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutChangeEvent } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface TabBarProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  const tabWidths = React.useRef<number[]>([]);
  const tabPositions = React.useRef<number[]>([]);
  const translateX = useSharedValue(0);
  const pillWidth = useSharedValue(0);

  const activeIndex = tabs.indexOf(activeTab);

  const animatedPillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    width: pillWidth.value,
  }));

  const onTabLayout = useCallback((index: number) => (event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    tabWidths.current[index] = width;
    tabPositions.current[index] = x;
    if (index === activeIndex) {
      translateX.value = x;
      pillWidth.value = width;
    }
  }, [activeIndex]);

  const handlePress = (tab: string, index: number) => {
    translateX.value = withTiming(tabPositions.current[index] || 0, { duration: 250 });
    pillWidth.value = withTiming(tabWidths.current[index] || 0, { duration: 250 });
    onTabChange(tab);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.pill, animatedPillStyle]} />
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={tab}
          onLayout={onTabLayout(index)}
          onPress={() => handlePress(tab, index)}
          style={styles.tab}
          testID={`tab-${tab}`}
        >
          <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F1F3F4',
    borderRadius: 25,
    padding: 4,
    marginHorizontal: 16,
    marginVertical: 8,
    position: 'relative',
  },
  pill: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    backgroundColor: '#E8F0FE',
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: '#0073CF',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#0073CF',
    fontWeight: '600',
  },
});
