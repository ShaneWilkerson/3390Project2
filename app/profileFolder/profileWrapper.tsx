// This code allows the "Profile" tab to switch between the login and profile screens
import React, { useState } from "react";
import Login from "./login";
import ProfileScreen from "./profile";

export default function ProfileWrapper() {
  const [loggedInProfile, setLoggedInProfile] = useState<any>(null);

  return loggedInProfile ? (
    <ProfileScreen profile={loggedInProfile} onLogout={() => setLoggedInProfile(null)} />
  ) : (
    <Login onLoginSuccess={setLoggedInProfile} />
  );
}