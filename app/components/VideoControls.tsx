import React from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import Slider from "@react-native-community/slider";

const dimensions = Dimensions.get("window");

const VideoControls = (props) => {
  const {
    state,
    togglePlay,
    playbackInstanceInfo,
    setPlaybackInstanceInfo,
    playbackInstance,
    isPotrait,
  } = props;

  function renderIcon() {
    if (state === "Buffering") {
      return <ActivityIndicator size={20} color="white" />;
    } else if (state === "Playing") {
      return <FontAwesome name="pause" size={18} color="#fff" />;
    } else if (state === "Paused") {
      return <FontAwesome name="play" size={20} color="#fff" />;
    } else if (state === "Ended") {
      return <MaterialIcons name="replay" size={20} color="#fff" />;
    }
  }

  return (
    <View style={styles.container}>
      <View tint="dark" intensity={42} style={styles.innerContainer}>
        <Pressable
          style={styles.iconWrapper}
          onPress={state === "Buffering" ? null : togglePlay}
        >
          {renderIcon()}
        </Pressable>
        <Slider
          style={styles.slider}
          thumbTintColor={"#fff"}
          //   thumbStyle={{
          //     height: 17,
          //     width: 17,
          //     borderRadius: 100,
          //   }}
          minimumTrackTintColor={"red"}
          maximumTrackTintColor="#8E9092"
          value={
            playbackInstanceInfo.duration
              ? playbackInstanceInfo.position / playbackInstanceInfo.duration
              : 0
          }
          onSlidingStart={() => {
            if (playbackInstanceInfo.state === "Playing") {
              togglePlay();
              setPlaybackInstanceInfo({
                ...playbackInstanceInfo,
                state: "Paused",
              });
            }
          }}
          onSlidingComplete={async (e) => {
            const position = e * playbackInstanceInfo.duration;
            if (playbackInstance) {
              await playbackInstance.setStatusAsync({
                positionMillis: position,
                shouldPlay: true,
              });
            }
            setPlaybackInstanceInfo({
              ...playbackInstanceInfo,
              position,
            });
          }}
        />
        <Pressable
          style={styles.iconWrapper}
          onPress={() => {
            // if (isPotrait) {
            console.log("change orientation");
            isPotrait();
            // }
          }}
        >
          <MaterialIcons name="fullscreen" size={20} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingRight: 20,
    width: "100%",
  },
  iconWrapper: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  slider: {
    flex: 1,
    marginHorizontal: 20,
  },
});

export default VideoControls;
