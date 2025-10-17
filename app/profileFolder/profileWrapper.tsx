// This code allows the "Profile" tab to switch between the login and profile screens
import React from "react";
import Login from "./login";
import ProfileScreen from "./profile";

import { useContext } from "react";
import { ProfileContext } from "../context/ProfileContext";

export default function ProfileWrapper() {
  const { profile, setProfile } = useContext(ProfileContext);

  return profile ? (
    <ProfileScreen profile={profile} onLogout={() => setProfile(null)} />
  ) : (
    <Login onLoginSuccess={setProfile} />
  );
}