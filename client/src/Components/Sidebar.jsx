import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { ChatContext } from "../../Context/ChatContext";
import assets from "../assets/assets";

// --- Sub-components ---

const UserStatus = ({ isOnline }) =>
  isOnline ? (
    <span className="text-pink-400 animate-pulse text-xs">Online</span>
  ) : (
    <span className="text-neutral-400 text-xs">Offline</span>
  );

const UnseenBadge = ({ count }) => {
  if (!count || count <= 0) return null;
  return (
    <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
      {count}
    </p>
  );
};

const UserListItem = ({ user, isSelected, isOnline, unseenCount, onClick }) => (
  <div
    onClick={onClick}
    className={`relative flex items-center gap-2 p-2 pl-4 rounded-full cursor-pointer transition-all duration-200 hover:bg-[#2f2850] max-sm:text-sm ${
      isSelected ? "bg-[#282142] shadow-inner" : ""
    }`}
  >
    <img
      src={user.profilePic || assets.avatar_icon}
      alt={`${user.fullName}'s profile`}
      className="w-[35px] aspect-square rounded-full"
    />
    <div>
      <p>{user.fullName}</p>
      <UserStatus isOnline={isOnline} />
    </div>
    <UnseenBadge count={unseenCount} />
  </div>
);

const SearchBar = ({ value, onChange }) => (
  <div className="rounded-full flex items-center gap-2 py-3 px-4 mt-5 bg-[#282142]">
    <img src={assets.search_icon} alt="search" className="w-4" />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      type="text"
      className="bg-transparent outline-none text-white text-sm placeholder-[#c8c8c8] flex-1"
      placeholder="Search User..."
    />
  </div>
);

const ProfileMenu = ({ onEditProfile, onLogout }) => (
  <div className="relative py-2 group">
    <img
      src={assets.menu_icon}
      alt="Menu"
      className="max-h-5 cursor-pointer opacity-80 hover:opacity-100 transition"
    />
    <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-lg bg-[#282142] border border-gray-600 text-white hidden group-hover:block">
      <p
        onClick={onEditProfile}
        className="cursor-pointer hover:text-violet-400 transition text-sm"
      >
        Edit Profile
      </p>
      <hr className="my-2 border-t border-gray-500" />
      <p
        onClick={onLogout}
        className="cursor-pointer hover:text-violet-400 transition text-sm"
      >
        Logout
      </p>
    </div>
  </div>
);

// --- Main Component ---

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessage } =
    useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  const filteredUsers = searchQuery
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setUnseenMessage((prev) => ({ ...prev, [user._id]: 0 }));
  };

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll shadow-2xl transition-all duration-300 text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="App logo" className="max-w-40" />
          <ProfileMenu
            onEditProfile={() => navigate("/profile")}
            onLogout={logout}
          />
        </div>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="flex flex-col">
        {filteredUsers.map((user) => (
          <UserListItem
            key={user._id}
            user={user}
            isSelected={selectedUser?._id === user._id}
            isOnline={onlineUsers.includes(user._id)}
            unseenCount={unseenMessages[user._id]}
            onClick={() => handleSelectUser(user)}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;