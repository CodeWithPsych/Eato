/**
 * QrCodesSection.jsx
 *
 * Drop this component into app/owner/(tabs)/profile.jsx
 * Usage:  <QrCodesSection restaurantId={restaurantId} />
 *
 * It fetches the setup progress (which includes the tables array with qrPayload),
 * renders a QR code for each table, and lets the owner:
 *   • view all QR codes in a scrollable grid
 *   • share / "download" a single QR via the native share sheet
 *   • regenerate a table's QR token (calls the backend endpoint)
 *
 * Dependencies already in the project:
 *   - react-native-qr-svg  ← install:  npx expo install react-native-svg
 *                                       npm install react-native-qr-svg
 *   OR use the pure-JS fallback (QRCode component below) via:
 *       npm install react-native-qrcode-svg
 *
 * This file uses:  react-native-qrcode-svg  (pure RN, no native module needed)
 *   npm install react-native-qrcode-svg react-native-svg
 */

import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { api } from "@/services/api";
import { images } from "@/constants";

// ── API helpers ───────────────────────────────────────────────

async function fetchSetupProgress() {
  const res = await api.get("/owner/setup/progress");
  return res.data?.data ?? null;
}

async function regenerateQr(tableNumber) {
  const res = await api.patch(
    `/owner/setup/tables/${tableNumber}/regenerate-qr`
  );
  return res.data?.data ?? null;
}

// ── Single QR Card ────────────────────────────────────────────

const QrCard = ({ table, restaurantName, onRegenerate }) => {
  const svgRef = useRef(null);
  const [regenerating, setRegenerating] = useState(false);

  // Share the raw qrPayload string so another device can scan it
  const handleShare = async () => {
    try {
      await Share.share({
        message: `${restaurantName} — Table ${table.tableNumber}\n\nQR Payload (scan with Eato app):\n${table.qrPayload}`,
        title: `Table ${table.tableNumber} QR`,
      });
    } catch (e) {
      Alert.alert("Share failed", e.message);
    }
  };

  const handleRegenerate = async () => {
    Alert.alert(
      "Regenerate QR",
      `This will invalidate the current QR code for Table ${table.tableNumber}. Customers who already scanned it will need to rescan. Continue?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Regenerate",
          style: "destructive",
          onPress: async () => {
            setRegenerating(true);
            try {
              const updated = await regenerateQr(table.tableNumber);
              onRegenerate(table.tableNumber, updated);
            } catch (err) {
              Alert.alert(
                "Error",
                err?.response?.data?.message ?? "Failed to regenerate QR"
              );
            } finally {
              setRegenerating(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <View>
          <Text
            style={{
              fontFamily: "Quicksand-Bold",
              fontSize: 16,
              color: "#111827",
            }}
          >
            Table {table.tableNumber}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              marginTop: 2,
            }}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: table.isActive ? "#22c55e" : "#9ca3af",
              }}
            />
            <Text
              style={{
                fontFamily: "Quicksand-Medium",
                fontSize: 12,
                color: "#6B7280",
              }}
            >
              {table.isActive ? "Active" : "Inactive"}
            </Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            onPress={handleShare}
            style={{
              backgroundColor: "#EEF2FF",
              borderRadius: 8,
              padding: 8,
            }}
          >
            <Image
              source={images.download}
              style={{ width: 16, height: 16, tintColor: "#4F46E5" }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleRegenerate}
            disabled={regenerating}
            style={{
              backgroundColor: "#FEF3C7",
              borderRadius: 8,
              padding: 8,
            }}
          >
            {regenerating ? (
              <ActivityIndicator size="small" color="#D97706" />
            ) : (
              <Image
                source={images.pencil}
                style={{ width: 16, height: 16, tintColor: "#D97706" }}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* QR Code — uses the qrPayload string directly as the QR value */}
      <View style={{ alignItems: "center", paddingVertical: 8 }}>
        {table.qrPayload ? (
          <View
            style={{
              padding: 12,
              backgroundColor: "#fff",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#F3F4F6",
            }}
          >
            <QRCode
              value={table.qrPayload}
              size={160}
              color="#111827"
              backgroundColor="#ffffff"
              getRef={(ref) => (svgRef.current = ref)}
              logo={undefined}
              logoSize={0}
              quietZone={4}
            />
          </View>
        ) : (
          <View
            style={{
              width: 160,
              height: 160,
              backgroundColor: "#F3F4F6",
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={images.qrcode}
              style={{ width: 80, height: 80, tintColor: "#9CA3AF" }}
            />
            <Text
              style={{
                fontFamily: "Quicksand-Medium",
                fontSize: 11,
                color: "#9CA3AF",
                marginTop: 6,
              }}
            >
              No payload
            </Text>
          </View>
        )}
      </View>

      {/* Payload preview (truncated) */}
      {table.qrPayload ? (
        <Text
          style={{
            fontFamily: "Quicksand-Medium",
            fontSize: 10,
            color: "#9CA3AF",
            textAlign: "center",
            marginTop: 6,
          }}
          numberOfLines={1}
        >
          {table.qrPayload.slice(0, 32)}…
        </Text>
      ) : null}
    </View>
  );
};

// ── Main Section Component ────────────────────────────────────

export default function QrCodesSection() {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState([]);
  const [restaurantName, setRestaurantName] = useState("Restaurant");
  const [error, setError] = useState("");

  const openModal = useCallback(async () => {
    setModalVisible(true);
    setLoading(true);
    setError("");
    try {
      const data = await fetchSetupProgress();
      setTables(data?.tables ?? []);
      setRestaurantName(data?.name ?? "Restaurant");
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to load QR codes");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRegenerate = (tableNumber, updated) => {
    if (!updated) return;
    setTables((prev) =>
      prev.map((t) =>
        t.tableNumber === tableNumber
          ? { ...t, qrPayload: updated.qrPayload, qrToken: updated.qrToken }
          : t
      )
    );
  };

  return (
    <>
      {/* Trigger button — place this wherever you want in profile.jsx */}
      <TouchableOpacity
        onPress={openModal}
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: "#E5E7EB",
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <View
          style={{
            width: 44,
            height: 44,
            backgroundColor: "#EEF2FF",
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={images.qrcode}
            style={{ width: 24, height: 24, tintColor: "#4F46E5" }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: "Quicksand-SemiBold",
              fontSize: 15,
              color: "#111827",
            }}
          >
            Table QR Codes
          </Text>
          <Text
            style={{
              fontFamily: "Quicksand-Medium",
              fontSize: 12,
              color: "#6B7280",
              marginTop: 2,
            }}
          >
            View, share & regenerate QR codes
          </Text>
        </View>
        <Image
          source={images.arrowRight}
          style={{ width: 16, height: 16, tintColor: "#9CA3AF" }}
        />
      </TouchableOpacity>

      {/* Full-screen modal with all QR codes */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
          {/* Header */}
          <View
            style={{
              backgroundColor: "#4F46E5",
              paddingTop: 56,
              paddingBottom: 20,
              paddingHorizontal: 20,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                width: 36,
                height: 36,
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={images.arrowBack}
                style={{ width: 20, height: 20, tintColor: "#fff" }}
              />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: "Quicksand-Bold",
                  fontSize: 18,
                  color: "#fff",
                }}
              >
                Table QR Codes
              </Text>
              <Text
                style={{
                  fontFamily: "Quicksand-Medium",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.75)",
                  marginTop: 2,
                }}
              >
                {restaurantName} · {tables.length} table
                {tables.length !== 1 ? "s" : ""}
              </Text>
            </View>
          </View>

          {/* Info banner */}
          <View
            style={{
              backgroundColor: "#EEF2FF",
              borderBottomWidth: 1,
              borderBottomColor: "#C7D2FE",
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                fontFamily: "Quicksand-Medium",
                fontSize: 12,
                color: "#4338CA",
                lineHeight: 18,
              }}
            >
              📱 Each QR encodes your restaurant ID, table number, and WiFi
              credentials. Tap the{" "}
              <Text style={{ fontFamily: "Quicksand-Bold" }}>share icon</Text>{" "}
              to send a QR to your printer or team.
            </Text>
          </View>

          {/* Content */}
          {loading ? (
            <View
              style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            >
              <ActivityIndicator size="large" color="#4F46E5" />
              <Text
                style={{
                  fontFamily: "Quicksand-Medium",
                  fontSize: 14,
                  color: "#6B7280",
                  marginTop: 12,
                }}
              >
                Loading QR codes…
              </Text>
            </View>
          ) : error ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 32,
              }}
            >
              <Text
                style={{
                  fontFamily: "Quicksand-Medium",
                  fontSize: 14,
                  color: "#EF4444",
                  textAlign: "center",
                  marginBottom: 16,
                }}
              >
                {error}
              </Text>
              <TouchableOpacity
                onPress={openModal}
                style={{
                  backgroundColor: "#4F46E5",
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Quicksand-SemiBold",
                    color: "#fff",
                    fontSize: 14,
                  }}
                >
                  Retry
                </Text>
              </TouchableOpacity>
            </View>
          ) : tables.length === 0 ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={images.qrcode}
                style={{ width: 80, height: 80, tintColor: "#D1D5DB" }}
              />
              <Text
                style={{
                  fontFamily: "Quicksand-SemiBold",
                  fontSize: 16,
                  color: "#9CA3AF",
                  marginTop: 12,
                }}
              >
                No tables set up yet
              </Text>
              <Text
                style={{
                  fontFamily: "Quicksand-Medium",
                  fontSize: 13,
                  color: "#D1D5DB",
                  marginTop: 4,
                }}
              >
                Complete Step 4 of restaurant setup
              </Text>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={{
                padding: 20,
                paddingBottom: 60,
              }}
              showsVerticalScrollIndicator={false}
            >
              {tables.map((table) => (
                <QrCard
                  key={table.tableNumber}
                  table={table}
                  restaurantName={restaurantName}
                  onRegenerate={handleRegenerate}
                />
              ))}
            </ScrollView>
          )}
        </View>
      </Modal>
    </>
  );
}