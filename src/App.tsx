import "./App.css";
import { MantineProvider } from "@mantine/core";

import "@mantine/core/styles.css";

import { Outlet } from "react-router-dom";
function App() {
  return (
    <>
      <MantineProvider>
        <Outlet />
      </MantineProvider>
    </>
  );
}

export default App;
