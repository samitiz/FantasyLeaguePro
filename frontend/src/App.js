import './App.css';
import Navbar from "./components/Navbar";
import AppRoutes from "./routes.js";

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  return (
    <>
    <Navbar /> 
    <AppRoutes />
  </>
  );
}

export default App;
