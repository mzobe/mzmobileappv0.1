import { Dimensions, Text, View } from "react-native";
import VideoPlayer2 from "./components/VideoPlayer2";
import VideoPlayerView from "./components/VideoPlayerView";
import VideoPlayer from "./components/VideoPlayer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const { height, width } = Dimensions.get("window");

const item = {
  name: "batman_wayne",
  description: "Iam vengeance",
  profile:
    "https://i.pinimg.com/originals/d9/7a/ba/d97abaa3ecc0d3aeb48fe80bd0538557.jpg",
  video:
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
};

export default function Page() {
  return (
    <VideoPlayer
      height={height} // give a different value for height 2/5/2023
      width={width}
      videoUri={item.video}
      item={item}
    />
  );
}
