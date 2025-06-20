import { View, Text, StyleSheet, Pressable, Alert } from "react-native"
import { AudioModule, RecordingPresets, useAudioPlayer, useAudioRecorder } from 'expo-audio'
import React, { useState, useEffect } from "react"


export default function Home() {
    const [audio, setAudio] = useState<string | null>(null);
    const player = useAudioPlayer(audio);

    useEffect(() => {
        (async () => {
          try {
            if (!AudioModule?.requestRecordingPermissionsAsync) {
              console.log('AudioModule is not available. Are you running in Expo Go?');
              return;
            }
            const status = await AudioModule.requestRecordingPermissionsAsync();
            if (!status.granted) {
              console.log('Permission to access microphone was denied');
            }
          } catch (e) {
            console.log(e as string);
          }
        })();
      }, []);

    const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
    const [isRecording, setIsRecording] = useState(false);

    const startRecording = async () => {
        await audioRecorder.prepareToRecordAsync();
        audioRecorder.record();
        setIsRecording(true);
    }

    const stopRecording = async () => {
        await audioRecorder.stop();
        setAudio(audioRecorder.uri);
        setIsRecording(false);
      };

    const playRecording = async () => {
        player.seekTo(0);
        player.play();
    }

    return (
        <View style={styles.container}>
            {isRecording ? (
                <Pressable style={styles.icon} onPress={stopRecording}>
                    <Text>Stop</Text>
                </Pressable>
            ) : (
                <Pressable style={styles.icon} onPress={startRecording}>
                    <Text style={styles.text}>Record</Text>
                </Pressable>
            )}
            <Pressable style={styles.playButton} onPress={playRecording}>
                <Text style={styles.text}>Play</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon:{
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    playButton:{
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text:{
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    }
})