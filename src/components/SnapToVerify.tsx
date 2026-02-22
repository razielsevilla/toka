import React, { useState } from 'react';
import { View, Image, StyleSheet, Text, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTokaStore } from '../store/useTokaStore';
import { useTheme } from '../theme/useTheme';

interface SnapToVerifyProps { taskId: string; }

export default function SnapToVerify({ taskId }: SnapToVerifyProps) {
  const { Colors, Typography } = useTheme();
  const submitTask = useTokaStore((state) => state.submitTask);
  const clearNotifications = useTokaStore((state) => state.clearNotifications);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission Denied', 'Camera permission is required.'); return; }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.5 });
    if (result.canceled) return;
    const uri = result.assets?.[0]?.uri;
    if (!uri) return;
    setIsSubmitting(true);
    try {
      setImageUri(uri); submitTask(taskId, uri);
      clearNotifications('rejection');
      Alert.alert('Sent for Review!', 'Mom or Dad will check it soon.');
    } catch (e) {
      Alert.alert('Submission Error', 'There was a problem submitting your proof.');
    } finally { setIsSubmitting(false); }
  };

  return (
    <View style={{ marginTop: 10 }}>
      <TouchableOpacity style={[styles.cameraBtn, { backgroundColor: Colors.primary }, isSubmitting && { backgroundColor: Colors.textDim }]} onPress={handleTakePhoto} disabled={isSubmitting}>
        {isSubmitting ? <ActivityIndicator color={Colors.white} /> :
          <Text style={[styles.btnText, { color: Colors.white, fontFamily: Typography.subheading }]}>Take Proof Photo 📸</Text>}
      </TouchableOpacity>
      {imageUri && (
        <View style={{ marginTop: 15 }}>
          <Text style={[styles.previewLabel, { color: Colors.textDim, fontFamily: Typography.bodyBold }]}>Current Proof:</Text>
          <Image source={{ uri: imageUri }} style={[styles.preview, { borderColor: Colors.surfaceLight }]} resizeMode="cover" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cameraBtn: { padding: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', elevation: 2 },
  btnText: { fontSize: 14 },
  previewLabel: { fontSize: 12, marginBottom: 5 },
  preview: { width: '100%', aspectRatio: 4 / 3, borderRadius: 12, borderWidth: 1 },
});