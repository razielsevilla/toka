import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Text, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTokaStore } from '../store/useTokaStore';

interface SnapToVerifyProps {
  taskId: string;
}

export const SnapToVerify: React.FC<SnapToVerifyProps> = ({ taskId }) => {
  const submitTask = useTokaStore((state) => state.submitTask);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTakePhoto = async () => {
    setError(null);

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      setError('Camera permission is required to take a proof photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (result.canceled) {
      return;
    }

    const uri = result.assets?.[0]?.uri;
    if (!uri) {
      setError('Unable to get image URI. Please try again.');
      return;
    }

    setIsSubmitting(true);
    try {
      setImageUri(uri);
      submitTask(taskId, uri);
    } catch {
      setError('There was a problem submitting your proof. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Take Proof Photo" onPress={handleTakePhoto} disabled={isSubmitting} />

      {isSubmitting && (
        <View style={styles.statusRow}>
          <ActivityIndicator size="small" />
          <Text style={styles.statusText}>Submitting...</Text>
        </View>
      )}

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
      )}

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  statusText: {
    fontSize: 14,
  },
  preview: {
    marginTop: 12,
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 8,
  },
  error: {
    marginTop: 8,
    color: 'red',
    fontSize: 13,
  },
});

