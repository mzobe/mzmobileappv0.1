import { Video } from "expo-av";
import React, { useRef, useState } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";

import { PanGestureHandler } from "react-native-gesture-handler";

const VideoPlayerView = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(false);
  const windowWidth = Dimensions.get("window").width;

  const handlePress = () => {
    setIsPlaying(!isPlaying);
    setIsControlsVisible(true);
  };

  const handleSeek = (dx) => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const seekTime = Math.max(
        0,
        currentTime + (dx / windowWidth) * videoRef.current.getDuration()
      );
      videoRef.current.seek(seekTime);
    }
  };
  return (
    <PanGestureHandler
      onGestureEvent={({ nativeEvent }) => handleSeek(nativeEvent.translationX)}
    >
      <View style={[styles.container]}>
        <Video
          ref={videoRef}
          source={{
            uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          }}
          style={styles.video}
          resizeMode="cover"
          paused={!isPlaying}
        />
        {isControlsVisible && (
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setIsPlaying(false)}
            >
              {/* Customize play/pause icon based on your preference */}
              {isPlaying ? <Icon name="pause" /> : <Icon name="play" />}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => handleSeek(-windowWidth * 0.1)}
            >
              <Icon name="rewind" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => handleSeek(windowWidth * 0.1)}
            >
              <Icon name="forward" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blue",
  },
  video: {
    flex: 1,
  },
  controlsContainer: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    bottom: 10,
    padding: 10,
  },
  controlButton: {
    padding: 10,
  },
});

// Replace with your preferred icon component
const Icon = ({ name }) => {
  // Implement your icon rendering logic here based on your chosen icon library
  return <View>{name}</View>;
};
export default VideoPlayerView;
