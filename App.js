import {StyleSheet} from 'react-native';
import React from 'react';
import Navigation from './src/screens/Navigation';
import {AuthProvider} from './src/contexts/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
