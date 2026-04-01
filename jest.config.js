module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@testing-library|uuid)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testPathIgnorePatterns: ['__tests__/e2e'],
  moduleNameMapper: {
    '^uuid$': require.resolve('uuid'),
  },
  globals: {
    __DEV__: true,
  },
};
