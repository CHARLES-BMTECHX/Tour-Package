import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home/Home";
import Sign_up from "./pages/Sign_up";
import Sign_in from "./pages/Sign_in";
import Forgot_password from "./pages/Forgot_password";
import Reset_password from "./pages/Reset_password";
import WriteReview from "./pages/Reviews/WriteReview";
import Review from "./pages/Reviews/Review";
import { UserProvider } from "./hooks/UserContext";

export default function App() {
  return (
   <UserProvider>
     <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/"  element={<Home />} />
          <Route path="/write-review" element={<WriteReview />} />
          <Route path="/reset-password" element={<Reset_password />} />
          <Route path="/forgot_password" element={<Forgot_password />}/>
          <Route path="/sign_up" element={<Sign_up />}/>
          <Route path="/sign_in" element={<Sign_in />}/>
          <Route path="/read-review" element={<Review />}/>
          <Route path="/write-review" element={<WriteReview />}/>
        </Route>
      </Routes>
    </Router>
   </UserProvider>
  );
}
