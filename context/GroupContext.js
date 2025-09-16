import React, { createContext, useContext, useState } from 'react';

const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
  const [groupData, setGroupData] = useState({
    groupId: null,
    groupName: '',
    groupType: '',
  });

  return (
    <GroupContext.Provider value={{ groupData, setGroupData }}>
      {children}
    </GroupContext.Provider>
  );
};

export const useGroup = () => useContext(GroupContext);
