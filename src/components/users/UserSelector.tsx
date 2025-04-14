"use client";
import React from "react";

interface UserSelectorProps {
  users: string[];
  currentUser: string;
  setCurrentUser: (user: string) => void;
}

const UserSelector: React.FC<UserSelectorProps> = ({ users, currentUser, setCurrentUser }) => {
  return (
    <div className="mb-6 flex items-center gap-4">
      <label className="text-pink-700 font-medium text-sm">Logged in as:</label>
      <select
        value={currentUser}
        onChange={(e) => setCurrentUser(e.target.value)}
        className="px-4 py-2 border-2 border-pink-300 rounded-full bg-pink-50 text-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-300"
      >
        {users.map((user) => (
          <option key={user} value={user}>
            {user}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UserSelector;

