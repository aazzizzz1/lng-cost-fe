import RouteComponents from "./Routes/RouteComponents";
import axios from "axios";

// Enable sending HttpOnly cookies on all axios calls
axios.defaults.withCredentials = true;

function App() {
  return (
    <RouteComponents/>
  );
}

export default App;
