import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthContextPorvider } from "./components/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

//3.context 사용할 곳 상위 파일에서 감싸줌(App.js or index.js 상황에 맞게)
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextPorvider>
        <Navbar />
        <Outlet />
      </AuthContextPorvider>
    </QueryClientProvider>
  );
}

export default App;
