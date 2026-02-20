import React, { useState } from 'react';
import { View, Image, StyleSheet, Text, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTokaStore } from '../store/useTokaStore';

interface SnapToVerifyProps {
  taskId: string;
}

export default function SnapToVerify({ taskId }: SnapToVerifyProps) {
  const submitTask = useTokaStore((state) => state.submitTask);
  const clearNotifications = useTokaStore((state) => state.clearNotifications);
  
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTakePhoto = async () => {
    // 1. Request Permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permission is required to take a proof photo.');
      return;
    }

    // 2. Launch Camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5, // Reduced for prototype performance
    });

    if (result.canceled) return;

    const uri = result.assets?.[0]?.uri;
    if (!uri) return;

    // 3. Submit to Store
    setIsSubmitting(true);
    try {
      setImageUri(uri);
      submitTask(taskId, uri);
      clearNotifications('rejection'); // Auto-clear rejection alerts when re-submitting
      Alert.alert("Sent for Review!", "Mom or Dad will check it soon.");
    } catch (e) {
      Alert.alert("Submission Error", "There was a problem submitting your proof.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.cameraBtn, isSubmitting && styles.disabledBtn]} 
        onPress={handleTakePhoto} 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.btnText}>Take Proof Photo 📸</Text>
        )}
      </TouchableOpacity>

      {imageUri && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewLabel}>Current Proof:</Text>
          <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 10 },
  cameraBtn: {
    backgroundColor: '#6C5CE7',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  disabledBtn: { backgroundColor: '#B2BEC3' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  previewContainer: { marginTop: 15 },
  previewLabel: { fontSize: 12, color: '#B2BEC3', fontWeight: 'bold', marginBottom: 5 },
  preview: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEE',
  },
});