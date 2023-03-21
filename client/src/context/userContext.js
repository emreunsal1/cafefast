const { createContext, useContext } = require("react");

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const value = {
    state: {},
    setState: {},
    methods: {},
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const getUserContext = () => useContext(UserContext);

export default UserContextProvider;
