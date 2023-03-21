const { createContext, useContext } = require("react");

const Context = createContext();

const ContextProvider = ({ children }) => {
  const value = {
    state: {},
    setState: {},
    methods: {},
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const getContext = () => useContext(Context);

export default ContextProvider;
