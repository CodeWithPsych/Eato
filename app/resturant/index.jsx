import CustomAlert from "@/components/CustomAlert";
import { images } from "@/constants";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function RestaurantSignup() {
  const [ownerData, setOwnerData] = useState({
    name: "", email: "", phone: "", password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword,    setShowPassword]    = useState(false);
  const [alertVisible,    setAlertVisible]    = useState(false);
  const [alertMessage,    setAlertMessage]    = useState("");
  const [goNext,          setGoNext]          = useState(false);

  const update = (field) => (text) => setOwnerData((prev) => ({ ...prev, [field]: text }));

  const handleSendOTP = () => {
    const { name, email, phone, password } = ownerData;
    if (!name || !email || !phone || !password || !confirmPassword) {
      setAlertMessage("Please fill all fields");
      setAlertVisible(true);
      return;
    }
    if (password !== confirmPassword) {
      setAlertMessage("Passwords do not match");
      setAlertVisible(true);
      return;
    }
    setAlertMessage("OTP sent to " + email);
    setGoNext(true);
    setAlertVisible(true);
  };

  const handleAlertClose = () => {
    setAlertVisible(false);
    if (goNext) {
      setGoNext(false);
      router.push({
        pathname: "/resturant/otp",
        params: {
          ownerName:  ownerData.name,
          ownerEmail: ownerData.email,
          ownerPhone: ownerData.phone,
        },
      });
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          className="flex-1 bg-orange-50 p-6 pt-14"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className="bg-white rounded-3xl shadow-xl p-8">
            {/* Icon */}
            <View className="w-20 h-20 bg-orange-100 rounded-full items-center justify-center self-center mb-4">
              <Image source={images.restaurant} className="size-9" />
            </View>

            <Text className="text-center text-neutral-800 text-lg font-quicksand-semibold mb-1">
              Restaurant Owner Signup
            </Text>
            <Text className="text-center text-neutral-500 text-sm mb-6">
              Create your account to set up your restaurant
            </Text>

            {/* Fields */}
            {[
              { label: "Full Name *",      field: "name",     icon: images.user,     keyboardType: "default",       placeholder: "John Doe" },
              { label: "Official Email *", field: "email",    icon: images.envelope,  keyboardType: "email-address", placeholder: "owner@restaurant.com" },
              { label: "Phone Number *",   field: "phone",    icon: images.phone,     keyboardType: "number-pad",    placeholder: "9876543210" },
            ].map(({ label, field, icon, keyboardType, placeholder }) => (
              <View key={field} className="mb-4">
                <Text className="text-neutral-700 mb-1 font-quicksand-medium">{label}</Text>
                <View className="relative">
                  <Image
                    source={icon}
                    style={{ position: "absolute", left: 16, top: "50%", marginTop: -10, zIndex: 1, width: 20, height: 20 }}
                    tintColor="#9CA3AF"
                  />
                  <TextInput
                    value={ownerData[field]}
                    onChangeText={update(field)}
                    placeholder={placeholder}
                    keyboardType={keyboardType}
                    maxLength={field === "phone" ? 11 : undefined}
                    className="pl-12 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl"
                  />
                </View>
              </View>
            ))}

            {/* Password */}
            {["password", "confirmPassword"].map((field) => (
              <View key={field} className="mb-4">
                <Text className="text-neutral-700 mb-1 font-quicksand-medium">
                  {field === "password" ? "Password *" : "Confirm Password *"}
                </Text>
                <View className="relative">
                  <Image
                    source={images.lock}
                    style={{ position: "absolute", left: 16, top: "50%", marginTop: -10, zIndex: 1, width: 20, height: 20 }}
                    tintColor="#9CA3AF"
                  />
                  <TextInput
                    value={field === "password" ? ownerData.password : confirmPassword}
                    onChangeText={field === "password" ? update("password") : setConfirmPassword}
                    placeholder={field === "password" ? "Create a strong password" : "Re-enter password"}
                    secureTextEntry={!showPassword}
                    className="pl-12 pr-12 py-3 bg-neutral-50 border border-neutral-200 rounded-xl"
                  />
                  {field === "password" && (
                    <TouchableOpacity
                      className="absolute right-4 top-3.5"
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Image
                        source={showPassword ? images.hide : images.visible}
                        className="size-5"
                        tintColor="#9CA3AF"
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}

            {/* Submit */}
            <TouchableOpacity
              onPress={handleSendOTP}
              className="bg-orange-600 py-3 rounded-xl mb-3 flex-row justify-center items-center gap-2"
            >
              <Text className="text-white font-quicksand-semibold">Send OTP</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()} className="py-3">
              <Text className="text-center text-neutral-500 font-quicksand-medium">
                Back to Home
              </Text>
            </TouchableOpacity>
          </View>

          <CustomAlert
            visible={alertVisible}
            message={alertMessage}
            onClose={handleAlertClose}
            buttonColor="#ea580c"
          />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}