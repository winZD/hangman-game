import "./App.css";
import { MantineProvider } from "@mantine/core";
import { Login } from "./components/Login";
import "@mantine/core/styles.css";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { Game } from "./components/Game";
import { Outlet } from "react-router-dom";
function App() {
  const logInData = useSelector((state: RootState) => state.logIn);

  return (
    <>
      <MantineProvider>
        <h1>Vite + React</h1>
        <div className="card">
          {logInData.step === 0 ? <Login /> : <Game />}
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
        <Outlet />
      </MantineProvider>
    </>
  );
}

export default App;
