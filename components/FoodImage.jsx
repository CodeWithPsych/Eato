/**
 * FoodImage — universal image/emoji/letter placeholder component
 *
 * Priority:
 *  1. Cloudinary URL (image prop)  → shows skeleton letter while loading
 *  2. Emoji (emoji prop)           → renders centred emoji
 *  3. Fallback                     → first letter of name on coloured background
 */

import { useState } from "react";
import { Image, Text, View } from "react-native";

// Deterministic colour from name string
const PALETTE = [
  ["#FFF3E0", "#E65100"], // deep orange
  ["#E8F5E9", "#2E7D32"], // green
  ["#E3F2FD", "#1565C0"], // blue
  ["#FCE4EC", "#880E4F"], // pink
  ["#F3E5F5", "#6A1B9A"], // purple
  ["#FFF8E1", "#F57F17"], // amber
  ["#E0F7FA", "#006064"], // teal
  ["#EFEBE9", "#4E342E"], // brown
];

function getColor(name = "") {
  const idx =
    name
      .split("")
      .reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % PALETTE.length;
  return PALETTE[idx];
}

export default function FoodImage({
  image,     // Cloudinary URL string
  emoji,     // e.g. "🍕"
  name = "", // used for letter + colour
  style,     // outer container style
  className, // outer container className (NativeWind)
  imgClassName = "w-full h-full",
  textClassName,
}) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const hasImage = image && typeof image === "string" && image.startsWith("http");
  const hasEmoji = emoji && typeof emoji === "string" && emoji.trim().length > 0;
  const letter = name.trim().charAt(0).toUpperCase() || "?";
  const [bg, fg] = getColor(name);

  // ── Case 1: Cloudinary URL ────────────────────────────────
  if (hasImage && !errored) {
    return (
      <View style={style} className={className}>
        {/* Letter skeleton shown while image loads */}
        {!loaded && (
          <View
            style={{ backgroundColor: bg, position: "absolute", inset: 0 }}
            className="items-center justify-center"
          >
            <Text
              style={{ color: fg, fontSize: 28, fontWeight: "700" }}
              className={textClassName}
            >
              {letter}
            </Text>
          </View>
        )}
        <Image
          source={{ uri: image }}
          className={imgClassName}
          resizeMode="cover"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
        />
      </View>
    );
  }

  // ── Case 2: Emoji ─────────────────────────────────────────
  if (hasEmoji) {
    return (
      <View
        style={[{ backgroundColor: bg }, style]}
        className={`items-center justify-center ${className ?? ""}`}
      >
        <Text style={{ fontSize: 30 }}>{emoji}</Text>
      </View>
    );
  }

  // ── Case 3: Letter placeholder ───────────────────────────
  return (
    <View
      style={[{ backgroundColor: bg }, style]}
      className={`items-center justify-center ${className ?? ""}`}
    >
      <Text
        style={{ color: fg, fontSize: 28, fontWeight: "700" }}
        className={textClassName}
      >
        {letter}
      </Text>
    </View>
  );
}
