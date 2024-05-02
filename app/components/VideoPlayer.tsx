import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Video } from "expo-av";
import { Feather } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";

import VideoControls from "./VideoControls";

export default function VideoPlayer(props) {
  const { height, width, videoUri, outOfBoundItems, item } = props;
  const [isPotrait, setIsPotrait] = useState(true);

  const playbackInstance = useRef(null);

  const [isControlsVisible, setIsControlsVisible] = useState(false);

  function setOrientation() {
    if (Dimensions.get("window").height > Dimensions.get("window").width) {
      //Device is in portrait mode, rotate to landscape mode.
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      setIsPotrait(false);
    } else {
      //Device is in landscape mode, rotate to portrait mode.
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      setIsPotrait(true);
    }
  }

  const handlePress = () => {
    setIsControlsVisible(!isControlsVisible); // Toggle visibility
  };

  const [playbackInstanceInfo, setPlaybackInstanceInfo] = useState({
    position: 0,
    duration: 0,
    state: "Buffering",
  });

  //screen orientation

  useEffect(() => {
    return () => {
      if (playbackInstance.current) {
        playbackInstance?.current.setStatusAsync({
          shouldPlay: false,
        });
      }
    };
  }, [isPotrait]);

  useEffect(() => {
    playbackInstance.current.pauseAsync();
  }, [outOfBoundItems]);

  const togglePlay = async () => {
    const shouldPlay = playbackInstanceInfo.state !== "Playing";

    if (playbackInstance.current !== null) {
      await playbackInstance.current.setStatusAsync({
        shouldPlay,
        ...(playbackInstanceInfo.state === "Ended" && { positionMillis: 0 }),
      });
      setPlaybackInstanceInfo({
        ...playbackInstanceInfo,
        state: playbackInstanceInfo.state === "Playing" ? "Paused" : "Playing",
      });
    }
  };

  const updatePlaybackCallback = (status) => {
    console.log(status, "status");
    if (status.isLoaded) {
      setPlaybackInstanceInfo({
        ...playbackInstanceInfo,
        position: status.positionMillis,
        duration: status.durationMillis || 0,
        state: status.didJustFinish
          ? "Ended"
          : status.isBuffering
          ? "Buffering"
          : status.shouldPlay
          ? "Playing"
          : "Paused",
      });
    } else {
      if (status.isLoaded === false && status.error) {
        const errorMsg = `Encountered a fatal error during playback: ${status.error}`;
        console.log(errorMsg, "error");
        // setErrorMessage(errorMsg)
      }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: isPotrait ? "" : "center",
      }}
    >
      <Text style={{ color: "red" }}>
        Potrait = {isPotrait ? "true" : "false"}
      </Text>
      {/* <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 10,
          marginBottom: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            style={{ height: 30, width: 30, borderRadius: 30 }}
            source={{ uri: item.profile }}
          />
          <Text
            style={{
              marginLeft: 10,
              color: "#fff",
              fontSize: 15,
              fontWeight: "bold",
            }}
          >
            {item.name}
          </Text>
        </View>
        <View>
          <Feather name="more-vertical" color="#fff" size={18} />
        </View>
      </View> */}
      <TouchableOpacity onPress={handlePress}>
        <Video
          ref={playbackInstance}
          style={styles.video(width, height)}
          source={{ uri: videoUri }}
          onFullscreenUpdate={setOrientation}
          resizeMode="cover"
          // isLooping
          onPlaybackStatusUpdate={updatePlaybackCallback}
        />
      </TouchableOpacity>
      <View
        style={{
          position: isPotrait ? "relative" : "absolute",
          bottom: 10,
          alignSelf: isPotrait ? "flex-start" : "center",
        }}
      >
        {isControlsVisible && (
          <VideoControls
            state={playbackInstanceInfo.state}
            playbackInstance={playbackInstance.current}
            playbackInstanceInfo={playbackInstanceInfo}
            setPlaybackInstanceInfo={setPlaybackInstanceInfo}
            togglePlay={togglePlay}
            isPotrait={setOrientation}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  video: (width, height) => ({
    alignSelf: "center",
    width: width,
    height: height,
  }),
  container: {
    flex: 1,
    justifyContent: "center",
  },
  controlsContainer: {
    position: "relative",
    bottom: 10,
    alignSelf: "center",
  },
});
