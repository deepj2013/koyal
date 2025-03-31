import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/store/store";
import "@fontsource/gloria-hallelujah"; 
import AppRoutes from "./routes/Routes";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
          <AppRoutes />
      </PersistGate>
    </Provider>
  );
};

export default App;
