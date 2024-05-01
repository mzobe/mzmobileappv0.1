import * as ScreenOrientation from "expo-screen-orientation";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { ResizeMode } from "expo-av";
import { setStatusBarHidden } from "expo-status-bar";
import React, { useRef, useState } from "react";
import VideoPlayer from "expo-video-player";

const VideoPlayer2 = () => {
  const [inFullscreen, setInFullsreen] = useState(false);
  const [inFullscreen2, setInFullsreen2] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const refVideo = useRef(null);
  const refVideo2 = useRef(null);
  const refScrollView = useRef(null);
  return (
    <View>
      <Text style={styles.text}>
        Ref - clicking on Enter/Exit fullscreen changes playing
      </Text>
      <VideoPlayer
        videoProps={{
          shouldPlay: false,
          resizeMode: ResizeMode.CONTAIN,
          source: {
            uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          },
          ref: refVideo,
        }}
        fullscreen={{
          enterFullscreen: () => {
            setInFullsreen(!inFullscreen);
            refVideo.current.setStatusAsync({
              shouldPlay: true,
            });
          },
          exitFullscreen: () => {
            setInFullsreen(!inFullscreen);
            refVideo.current.setStatusAsync({
              shouldPlay: false,
            });
          },
          inFullscreen,
        }}
        style={{ height: 160 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    flex: 1,
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },
  text: {
    marginTop: 36,
    marginBottom: 12,
  },
});

export default VideoPlayer2;
