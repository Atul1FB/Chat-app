import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { ChatContext } from "../../Context/ChatContext";
import { AuthContext } from "../../Context/AuthContext";

// --- Sub-components ---

const OnlineDot = () => (
  <span className="block w-2 h-2 rounded-full bg-pink-500 shrink-0" />
);

const UserProfile = ({ profilePic, fullName, bio }) => (
  <div className="pt-4 flex flex-col items-center gap-2 text-sm font-light">
    <img
      src={profilePic || assets.avatar_icon}
      alt={`${fullName}'s profile`}
      className="w-20 aspect-square object-cover rounded-full"
    />
    <h1 className="text-xl flex items-center font-medium gap-2">
      <OnlineDot />
      {fullName}
    </h1>
    <p className="text-center px-4">{bio}</p>
  </div>
);

const MediaGrid = ({ urls }) => {
  if (!urls?.length) return <p className="text-neutral-400">No media yet.</p>;

  return (
    <div className="max-h-[200px] overflow-y-auto grid grid-cols-2 gap-3 opacity-90">
      {urls.map((url, index) => (
        <img
          key={index}
          src={url}
          alt={`Shared media ${index + 1}`}
          onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
          className="w-full h-24 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
        />
      ))}
    </div>
  );
};

const LogoutButton = ({ onLogout }) => (
  <button
    onClick={onLogout}
    className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white text-sm font-light py-2 px-20 rounded-full cursor-pointer hover:opacity-90 transition-opacity whitespace-nowrap"
  >
    Logout
  </button>
);

// --- Main Component ---

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout } = useContext(AuthContext);

  const [msgImages, setMsgImages] = useState([]);

  useEffect(() => {
    setMsgImages(messages.filter((msg) => msg.image).map((msg) => msg.image));
  }, [messages]);

  // Guard: don't render if no user is selected
  if (!selectedUser) return null;

  const { profilePic, fullName, bio } = selectedUser;

  return (
    <div className="bg-[#8185B2]/10 text-white relative overflow-y-auto max-md:hidden h-full pb-24">
      <UserProfile profilePic={profilePic} fullName={fullName} bio={bio} />

      <hr className="border-[#ffffff50] my-4" />

      <div className="px-5 text-xs">
        <p className="mb-2">Media</p>
        <MediaGrid urls={msgImages} />
      </div>

      <LogoutButton onLogout={logout} />
    </div>
  );
};

export default RightSidebar;