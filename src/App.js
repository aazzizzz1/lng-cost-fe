import RouteComponents from "./Routes/RouteComponents";
import axios from "axios";

// Enable sending HttpOnly cookies on all axios calls
axios.defaults.withCredentials = true;
// Use env-provided base URL in all environments
axios.defaults.baseURL = process.env.REACT_APP_API;

function App() {
  return (
    <RouteComponents/>
  );
}

export default App;
