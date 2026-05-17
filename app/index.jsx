import { images } from "@/constants";
import {
  resetCustomer,
  scanQrAsync,
  selectScanStatus,
  selectWifi,
} from "@/services/customerSlice";
import {
  fetchAllRestaurantsAsync,
  selectListStatus,
  selectRestaurantError,
  selectRestaurants,
} from "@/services/restaurantSlice";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Linking,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

// ── Constants ─────────────────────────────────────────────────
const TABLES_PER_RESTAURANT = 8;
const BUTTON_COLORS = [
  "bg-primary",
  "bg-red-600",
  "bg-teal-600",
  "bg-blue-600",
  "bg-indigo-600",
  "bg-pink-600",
  "bg-yellow-600",
];

// ── WiFi Modal ────────────────────────────────────────────────
const WifiModal = ({ visible, wifi, restaurantName, onConnect, onSkip }) => (
  <Modal
    transparent
    animationType="slide"
    visible={visible}
    statusBarTranslucent
  >
    <View
      style={{
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.55)",
      }}
    >
      <View className="bg-white rounded-t-3xl px-6 pt-5 pb-10">
        <View className="w-10 h-1 bg-neutral-200 rounded-full self-center mb-6" />
        <View className="w-16 h-16 bg-blue-50 rounded-2xl items-center justify-center self-center mb-4">
          <Text style={{ fontSize: 32 }}>📶</Text>
        </View>
        <Text className="text-xl font-quicksand-bold text-neutral-800 text-center mb-1">
          Free WiFi Available
        </Text>
        <Text className="text-neutral-500 text-center font-quicksand-medium mb-6">
          {restaurantName} offers free WiFi for guests
        </Text>

        <View className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 gap-3">
          <View className="flex-row justify-between items-center">
            <Text className="text-blue-600 font-quicksand-medium text-sm">
              Network
            </Text>
            <Text className="text-blue-900 font-quicksand-bold">
              {wifi?.ssid ?? "—"}
            </Text>
          </View>
          {wifi?.password ? (
            <View className="flex-row justify-between items-center">
              <Text className="text-blue-600 font-quicksand-medium text-sm">
                Password
              </Text>
              <Text className="text-blue-900 font-quicksand-bold tracking-widest">
                {wifi.password}
              </Text>
            </View>
          ) : (
            <View className="flex-row justify-between items-center">
              <Text className="text-blue-600 font-quicksand-medium text-sm">
                Security
              </Text>
              <Text className="text-blue-900 font-quicksand-bold">
                Open Network
              </Text>
            </View>
          )}
          <View className="flex-row justify-between items-center">
            <Text className="text-blue-600 font-quicksand-medium text-sm">
              Type
            </Text>
            <Text className="text-blue-900 font-quicksand-bold">
              {wifi?.type ?? "WPA"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onConnect}
          className="bg-blue-600 py-4 rounded-2xl mb-3"
        >
          <Text className="text-white text-center font-quicksand-bold text-base">
            Connect to WiFi
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSkip} className="py-3">
          <Text className="text-neutral-400 text-center font-quicksand-medium">
            Skip, go to menu →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

// ── Scan line animation ───────────────────────────────────────
const ScanLine = () => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);
  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });
  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        position: "absolute",
        left: 8,
        right: 8,
        height: 2,
        backgroundColor: "#ff4c1b",
        opacity: 0.9,
      }}
    />
  );
};

// ── Scanner Modal ─────────────────────────────────────────────
/**
 * The camera reads the raw string printed in the QR code.
 * Our QR codes contain the base64url-encoded `qrPayload` string.
 * The backend's `scanQrAsync` / `scanQr` API call expects:
 *   POST /customer/scan  { qrPayload: "<base64url string>" }
 * So we pass `data` (the raw camera scan result) directly as `qrPayload`.
 */
const ScannerModal = ({ visible, onClose, onScanned }) => {
  const [CameraView, setCameraView] = useState(null);
  const [permission, setPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState("");

  // Lazy-load expo-camera only when modal opens
  useEffect(() => {
    if (!visible) return;
    setScanned(false);
    setError("");
    import("expo-camera")
      .then((mod) => {
        setCameraView(() => mod.CameraView);
        mod.Camera.requestCameraPermissionsAsync().then((res) => {
          setPermission(res.status === "granted");
        });
      })
      .catch(() => {
        setError("Camera not available. Please install expo-camera.");
      });
  }, [visible]);

  /**
   * Called by CameraView when it detects a barcode.
   * `data` is the raw string encoded in the QR — which IS the qrPayload
   * (base64url JSON produced by encodeQrPayload on the backend).
   * We pass it straight to onScanned so the parent can call scanQrAsync(data).
   */
  const handleBarCodeScanned = ({ data }) => {
    if (scanned) return;
    setScanned(true);
    // Small delay so the "✓ detected" UI flashes before modal closes
    setTimeout(() => onScanned(data), 600);
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        {/* Header */}
        <SafeAreaView>
          <View className="flex-row items-center justify-between px-4 py-3 bg-black">
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 bg-white/15 rounded-full items-center justify-center"
            >
              <Image
                source={images.arrowBack}
                className="w-5 h-5"
                tintColor="white"
              />
            </TouchableOpacity>
            <Text className="text-white font-quicksand-bold text-lg">
              Scan Table QR Code
            </Text>
            <View className="w-10" />
          </View>
        </SafeAreaView>

        {/* Camera / state panels */}
        {error ? (
          <View className="flex-1 items-center justify-center px-8">
            <Text className="text-red-400 text-center font-quicksand-medium mb-6">
              {error}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="bg-primary px-8 py-3 rounded-2xl"
            >
              <Text className="text-white font-quicksand-semibold">
                Go Back
              </Text>
            </TouchableOpacity>
          </View>
        ) : permission === false ? (
          <View className="flex-1 items-center justify-center px-8">
            <Image
              source={images.qrcode}
              className="w-16 h-16 mb-4"
              tintColor="#ff4c1b"
            />
            <Text className="text-white text-xl font-quicksand-bold text-center mb-3">
              Camera Permission Required
            </Text>
            <Text className="text-neutral-400 text-center font-quicksand-medium mb-6 leading-6">
              Please allow camera access in your device settings to scan QR
              codes.
            </Text>
            <TouchableOpacity
              onPress={() => Linking.openSettings()}
              className="bg-primary px-8 py-3 rounded-2xl mb-3"
            >
              <Text className="text-white font-quicksand-semibold">
                Open Settings
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onClose}
              className="bg-white/10 px-8 py-3 rounded-2xl"
            >
              <Text className="text-white font-quicksand-semibold">
                Go Back
              </Text>
            </TouchableOpacity>
          </View>
        ) : !CameraView || permission === null ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#ff4c1b" size="large" />
            <Text className="text-neutral-400 font-quicksand-medium mt-4">
              Starting camera…
            </Text>
          </View>
        ) : (
          <CameraView
            style={{ flex: 1 }}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Dark overlay panels */}
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "28%",
                  backgroundColor: "rgba(0,0,0,0.65)",
                }}
              />
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "32%",
                  backgroundColor: "rgba(0,0,0,0.65)",
                }}
              />
              <View
                style={{
                  position: "absolute",
                  top: "28%",
                  bottom: "32%",
                  left: 0,
                  width: "10%",
                  backgroundColor: "rgba(0,0,0,0.65)",
                }}
              />
              <View
                style={{
                  position: "absolute",
                  top: "28%",
                  bottom: "32%",
                  right: 0,
                  width: "10%",
                  backgroundColor: "rgba(0,0,0,0.65)",
                }}
              />

              {/* Viewfinder */}
              <View style={{ width: 256, height: 256, position: "relative" }}>
                {/* Corner brackets */}
                {[
                  { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
                  { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
                  {
                    bottom: 0,
                    left: 0,
                    borderBottomWidth: 3,
                    borderLeftWidth: 3,
                  },
                  {
                    bottom: 0,
                    right: 0,
                    borderBottomWidth: 3,
                    borderRightWidth: 3,
                  },
                ].map((style, i) => (
                  <View
                    key={i}
                    style={{
                      position: "absolute",
                      width: 28,
                      height: 28,
                      borderColor: "#ff4c1b",
                      borderRadius: 6,
                      ...style,
                    }}
                  />
                ))}

                {/* Animated scan line (only while waiting) */}
                {!scanned && <ScanLine />}

                {/* Success overlay */}
                {scanned && (
                  <View
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: "rgba(34,197,94,0.25)",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ fontSize: 52 }}>✓</Text>
                  </View>
                )}
              </View>

              {/* Hint text */}
              <View
                style={{
                  marginTop: 24,
                  paddingHorizontal: 40,
                  alignItems: "center",
                }}
              >
                {scanned ? (
                  <Text className="text-green-400 font-quicksand-bold text-center">
                    QR detected — loading menu…
                  </Text>
                ) : (
                  <Text
                    className="text-white/70 font-quicksand-medium text-center"
                    style={{ lineHeight: 22 }}
                  >
                    Point your camera at the QR code{"\n"}on your table
                  </Text>
                )}
              </View>
            </View>
          </CameraView>
        )}
      </View>
    </Modal>
  );
};

// ── Main screen ───────────────────────────────────────────────
export default function Index() {
  const dispatch = useDispatch();
  const restaurants = useSelector(selectRestaurants);
  const listStatus = useSelector(selectListStatus);
  const listError = useSelector(selectRestaurantError);
  const scanStatus = useSelector(selectScanStatus);
  const wifi = useSelector(selectWifi);

  const [scannerOpen, setScannerOpen] = useState(false);
  const [wifiModal, setWifiModal] = useState(false);
  const [pendingNav, setPendingNav] = useState(null);
  const [restaurantName, setRestaurantName] = useState("");
  const [scanLoading, setScanLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAllRestaurantsAsync());
  }, [dispatch]);

  // ── Demo table navigation ─────────────────────────────────
  const getRestaurantForTable = (tableNumber) => {
    if (!restaurants.length) return null;
    const idx = Math.min(
      Math.floor((tableNumber - 1) / TABLES_PER_RESTAURANT),
      restaurants.length - 1,
    );
    return restaurants[idx];
  };

  const handleDemoTable = (tableNumber) => {
    const restaurant = getRestaurantForTable(tableNumber);
    if (!restaurant) return;
    router.push({
      pathname: "/customer/(tabs)/home",
      params: {
        table: tableNumber,
        restaurantId: restaurant._id ?? restaurant.id,
      },
    });
  };

  const demoTables = restaurants.map((r, idx) => ({
    label: `${r.name}  —  Table ${idx * TABLES_PER_RESTAURANT + 1}`,
    tableNumber: idx * TABLES_PER_RESTAURANT + 1,
    restaurantId: r._id ?? r.id,
  }));

  // ── Real QR scan handler ──────────────────────────────────
  /**
   * `data` = the raw string the camera read from the QR code.
   * Our QR codes are generated with encodeQrPayload() which produces
   * a base64url string. We send it directly as `qrPayload` to the backend.
   *
   * The backend's scanQr endpoint calls decodeQrPayload(raw) internally,
   * verifies the token, and returns { wifi, restaurant, session }.
   */
  const handleScanned = async (data) => {
    setScanLoading(true);
    dispatch(resetCustomer());

    // `data` IS the qrPayload — send it straight to the API
    const result = await dispatch(scanQrAsync(data));
    setScanLoading(false);

    if (scanQrAsync.fulfilled.match(result)) {
      const payload = result.payload;
      const restaurantId =
        payload?.restaurant?._id?.toString() ??
        payload?.restaurant?.id?.toString();
      const tableNumber = payload?.session?.tableNumber;
      const name = payload?.restaurant?.name ?? "The Restaurant";

      setPendingNav({ restaurantId, tableNumber });
      setRestaurantName(name);
      setScannerOpen(false);

      // If WiFi credentials exist, show the WiFi modal first
      if (payload?.wifi?.ssid) {
        setWifiModal(true);
      } else {
        goToMenu(restaurantId, tableNumber);
      }
    } else {
      setScannerOpen(false);
      // Small delay so modal close animation finishes before alert
      setTimeout(() => {
        Alert.alert(
          "Invalid QR Code",
          result.payload ??
            "This QR code could not be recognised. Please try scanning again.",
          [{ text: "OK" }],
        );
      }, 400);
    }
  };

  const goToMenu = (restaurantId, tableNumber) => {
    setWifiModal(false);
    router.replace({
      pathname: "/customer/(tabs)/home",
      params: {
        restaurantId: restaurantId ?? pendingNav?.restaurantId,
        table: tableNumber ?? pendingNav?.tableNumber,
      },
    });
  };

  /**
   * WiFi connection strategy:
   * 1. Try the WIFI: URI scheme — Android/iOS native handling auto-connects
   *    when the password is correct.
   * 2. If that fails (unsupported on some devices), open WiFi settings
   *    so the user can connect manually.
   * Then navigate to the menu regardless.
   */
  const handleConnectWifi = async () => {
    if (wifi?.connectionString) {
      try {
        const supported = await Linking.canOpenURL(wifi.connectionString);
        if (supported) {
          await Linking.openURL(wifi.connectionString);
        } else {
          // Fallback: open WiFi settings page
          if (Platform.OS === "ios") {
            await Linking.openURL("App-Prefs:WIFI");
          } else {
            await Linking.openSettings();
          }
        }
      } catch (_) {
        // Even if Linking fails, proceed to menu
      }
    }
    // Navigate to menu after a short delay to let the OS WiFi dialog appear
    setTimeout(() => goToMenu(), 500);
  };

  const isLoading = listStatus === "idle" || listStatus === "loading";
  const isFailed = listStatus === "failed";

  return (
    <SafeAreaView className="flex-1 bg-[#FFF4EC]">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        className="px-5"
      >
        {/* ── Header ── */}
        <View className="flex-row justify-between items-center mt-4">
          <View>
            <Text className="text-primary text-xl font-quicksand-bold">
              Eato
            </Text>
            <Text className="text-gray-500 text-sm font-quicksand-semibold">
              Scan to order
            </Text>
          </View>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => router.push("/resturant")}
              className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
            >
              <Image
                source={images.restaurant}
                className="size-5"
                resizeMode="contain"
                tintColor="#ff4c1b"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/chef")}
              className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
            >
              <Image
                source={images.chef}
                className="size-5"
                resizeMode="contain"
                tintColor="#ff4c1b"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── QR Scanner Section ── */}
        <View className="mt-10 items-center">
          {/* Viewfinder graphic */}
          <View className="items-center justify-center mb-6">
            <View className="w-52 h-52 relative items-center justify-center">
              <View className="absolute top-0 left-0 w-9 h-9 border-l-4 border-t-4 border-primary rounded-tl-2xl" />
              <View className="absolute top-0 right-0 w-9 h-9 border-r-4 border-t-4 border-primary rounded-tr-2xl" />
              <View className="absolute bottom-0 left-0 w-9 h-9 border-l-4 border-b-4 border-primary rounded-bl-2xl" />
              <View className="absolute bottom-0 right-0 w-9 h-9 border-r-4 border-b-4 border-primary rounded-br-2xl" />

              <View className="w-28 h-28 bg-white rounded-2xl items-center justify-center shadow-md">
                {scanLoading ? (
                  <ActivityIndicator color="#ff4c1b" size="large" />
                ) : (
                  <Image
                    source={images.qrcode}
                    className="w-20 h-20"
                    resizeMode="contain"
                    tintColor="#ff4c1b"
                  />
                )}
              </View>
            </View>
          </View>

          <Text className="text-xl font-quicksand-bold text-neutral-800">
            Scan Table QR Code
          </Text>
          <Text
            className="text-gray-500 text-center mt-2 font-quicksand-medium"
            style={{ lineHeight: 22 }}
          >
            Point your camera at the QR code{"\n"}on your table to start
            ordering
          </Text>

          {/* Scan button */}
          <TouchableOpacity
            onPress={() => setScannerOpen(true)}
            disabled={scanLoading}
            className="mt-6 bg-primary w-full py-4 rounded-2xl flex-row items-center justify-center gap-3"
            style={{
              shadowColor: "#ff4c1b",
              shadowOpacity: 0.35,
              shadowRadius: 10,
              elevation: 6,
            }}
          >
            {scanLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Image
                  source={images.qrcode}
                  className="w-5 h-5"
                  tintColor="white"
                />
                <Text className="text-white font-quicksand-bold text-base">
                  Open QR Scanner
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* ── Demo / fallback buttons ── */}
        <View className="w-full mt-8 pb-8">
          <View className="flex-row items-center gap-3 mb-4">
            <View className="flex-1 h-px bg-neutral-200" />
            <Text className="text-neutral-400 text-xs font-quicksand-medium">
              DEMO MODE
            </Text>
            <View className="flex-1 h-px bg-neutral-200" />
          </View>

          <Text className="text-neutral-400 text-xs text-center mb-4 font-quicksand-medium">
            Tap a restaurant below to simulate scanning its QR code
          </Text>

          {isLoading && (
            <View className="items-center py-6">
              <ActivityIndicator size="large" color="#ff4c1b" />
              <Text className="text-gray-400 text-sm mt-3 font-quicksand-medium">
                Loading restaurants…
              </Text>
            </View>
          )}

          {isFailed && (
            <View className="items-center py-4">
              <Text className="text-red-500 text-sm text-center mb-3 font-quicksand-medium">
                {listError ?? "Could not reach the server."}
              </Text>
              <TouchableOpacity
                onPress={() => dispatch(fetchAllRestaurantsAsync())}
                className="bg-primary px-8 py-3 rounded-2xl"
              >
                <Text className="text-white font-quicksand-bold">Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {listStatus === "succeeded" &&
            demoTables.map((btn, idx) => (
              <TouchableOpacity
                key={String(btn.restaurantId)}
                onPress={() => handleDemoTable(btn.tableNumber)}
                className={`${
                  BUTTON_COLORS[idx % BUTTON_COLORS.length]
                } w-full py-4 rounded-2xl mt-3`}
              >
                <Text className="text-white text-center font-quicksand-bold">
                  {btn.label}
                </Text>
              </TouchableOpacity>
            ))}

          {!isLoading && (
            <TouchableOpacity
              onPress={() => router.push("/owner")}
              className="bg-purple-600 w-full py-4 rounded-2xl mt-3"
            >
              <Text className="text-white text-center font-quicksand-bold">
                Owner Login
              </Text>
            </TouchableOpacity>
          )}

          <Text className="text-gray-400 text-xs text-center mt-5">
            Real QR scanning requires expo-camera to be installed
          </Text>
        </View>
      </ScrollView>

      {/* ── Scanner Modal ── */}
      <ScannerModal
        visible={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScanned={handleScanned}
      />

      {/* ── WiFi Modal ── */}
      <WifiModal
        visible={wifiModal}
        wifi={wifi}
        restaurantName={restaurantName}
        onConnect={handleConnectWifi}
        onSkip={() => goToMenu()}
      />
    </SafeAreaView>
  );
}
