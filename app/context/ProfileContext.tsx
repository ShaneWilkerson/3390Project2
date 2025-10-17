// app/context/ProfileContext.tsx
import React, { createContext, ReactNode, useState } from "react";

type Profile = { username: string } | null;

type ProfileContextType = {
  profile: Profile;
  setProfile: (p: Profile) => void;
};

export const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  setProfile: () => {},
});

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile>(null);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
