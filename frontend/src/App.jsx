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
import CityView from "./pages/Categories/CityCard/CityView";
import StatePage from "./pages/Categories/Statecard/StatePage";
import ThemePage from "./pages/Categories/ThemeCard/ThemePage";
import PackagePage from "./pages/Categories/PackageCard/PackagePage";
import Top_destinations from "./pages/Destinations/Top_destinations";

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
          <Route path="/city-view" element={<CityView />}/>
          <Route path="/state/:stateName" element={<StatePage/>} />
          <Route path="/themes/:themename" element={<ThemePage />} />
          <Route path="/package/:packageId" element={<PackagePage/>} />
          <Route path="/top-destinations" element={<Top_destinations/>} />
        </Route>
      </Routes>
    </Router>
   </UserProvider>
  );
}
