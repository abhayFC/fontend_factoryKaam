import * as React from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  Text,
} from "react-native";
import images from "@/constants/images";

const PAGE_WIDTH = Dimensions.get("window").width;
const ITEM_HEIGHT = PAGE_WIDTH;

const IMAGE_SOURCES = [
  images.FK1,
  images.FK2,
  images.FK3,
  images.FK4,
  images.FK5,
  images.FK6,
  images.FK7,
  images.FK8,
  images.FK9,
  images.FK10,
];

interface SBItemProps {
  imageSource: any;
  opacity: Animated.Value;
}

function SBItem({ imageSource, opacity }: SBItemProps) {
  return (
    <Animated.View style={[styles.itemContainer, { opacity }]}>
      <Image
        source={imageSource}
        style={styles.specialImage}
        resizeMode="cover"
      />
    </Animated.View>
  );
}

function CarouselComponent() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [nextIndex, setNextIndex] = React.useState(1);
  const fadeAnim1 = React.useRef(new Animated.Value(1)).current;
  const fadeAnim2 = React.useRef(new Animated.Value(0)).current;

  const crossFade = () => {
    Animated.parallel([
      Animated.timing(fadeAnim1, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim2, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentIndex(nextIndex);
      setNextIndex((nextIndex + 1) % IMAGE_SOURCES.length);
      fadeAnim1.setValue(1);
      fadeAnim2.setValue(0);
    });
  };

  React.useEffect(() => {
    const interval = setInterval(crossFade, 5000);
    return () => clearInterval(interval);
  }, [nextIndex]);

  return (
    <View style={styles.carouselContainer}>
      <SBItem imageSource={IMAGE_SOURCES[currentIndex]} opacity={fadeAnim1} />
      <SBItem imageSource={IMAGE_SOURCES[nextIndex]} opacity={fadeAnim2} />
      <View style={styles.overlayContainer}>
        <Text style={styles.title}>factorykaam</Text>
        <Image source={images.logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.tagline}>Nirman se Networking tak</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    width: PAGE_WIDTH,
    height: ITEM_HEIGHT,
    overflow: "hidden",
  },
  itemContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
  },
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  logo: {
    width: 160,
    height: 140,
    marginVertical: 20,
  },
  title: {
    fontSize: 40,
    color: "#FFFFA0", // Lighter shade of yellow
    fontWeight: "bold",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  tagline: {
    fontSize: 24,
    color: "#FFFFA0", // Lighter shade of yellow
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  specialImage: {
    width: "100%",
    height: "100%",
  },
});

export default CarouselComponent;
