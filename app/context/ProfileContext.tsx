// This file allows dynamic text for the home and profile views

import React, { createContext, ReactNode, useState } from "react";

// Logged in = username or null if logged out
type Profile = { username: string } | null;

// Shape of the context value that will be shared
type ProfileContextType = {
  profile: Profile;                   // Current user profile
  setProfile: (profile: Profile) => void; // Function to update profile
};

// Default context value used if a component is not wrapped in provider
export const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  setProfile: () => {}, // Empty placeholder function
});

// Provider gives children access to profile state
type ProfileProviderProps = {
  children: ReactNode;
};

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
  // Local state to store the currently logged in profile
  const [profile, setProfile] = useState<Profile>(null);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
