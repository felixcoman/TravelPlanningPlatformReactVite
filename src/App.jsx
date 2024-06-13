import { useReducer } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { ChoiceContext } from "./Store/context";
import { choiceReducer, initialStateChoice } from "./Store/reducer";
import About from "./components/About/About";
import Account from "./components/Account/Account";
import Contact from "./components/Contact/Contact";
import Explore from "./components/Explore/Explore";
import Feedback from "./components/Feedback/Feedback";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";
import CitiesRegions from "./components/MainHome/CitiesRegions/CitiesRegions";
import MyChoices from "./components/MyChoices/MyChoices";
import MyTravelCity from "./components/MyTravelCity/MyTravelCity";
import MyTravelRegion from "./components/MyTravelRegion/MyTravelRegion";
import NavBar from "./components/Navbar/Navbar";
import Users from "./components/Users/Users";
import { ItineraryContext } from "./global/itinerary/context";
import {
  initialStateItinerary,
  itineraryReducer,
} from "./global/itinerary/reducer";

function App() {
  const [stateGlobalItinerary, dispatchItinerary] = useReducer(
    itineraryReducer,
    initialStateItinerary
  );
  const [stateGlobalChoice, dispatchChoice] = useReducer(
    choiceReducer,
    initialStateChoice
  );
  const itineraryContextValue = {
    stateGlobalItinerary,
    dispatchItinerary,
  };
  const choiceContextValue = {
    stateGlobalChoice,
    dispatchChoice,
  };

  return (
    <ChoiceContext.Provider value={choiceContextValue}>
      <ItineraryContext.Provider value={itineraryContextValue}>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route
            path="/city-region/:country/:id"
            element={<CitiesRegions />}
          ></Route>
          <Route path="/contact" element={<Contact />}></Route>
          <Route
            path="/my-travel1/:country/:city/:id"
            element={<MyTravelCity />}
          ></Route>
          <Route
            path="/my-travel2/:country/:region/:id"
            element={<MyTravelRegion />}
          ></Route>
          <Route path="/explore/:country/:city" element={<Explore />}></Route>
          <Route path="/users/:id" element={<Users />} />
          <Route path="/feedback/:id" element={<Feedback />} />
          <Route path="/itinerary" element={<Itinerary />}></Route>
          <Route path="/my-choices/:id" element={<MyChoices />}></Route>
          <Route path="/account" element={<Account />}></Route>
        </Routes>
        <Footer />
      </ItineraryContext.Provider>
    </ChoiceContext.Provider>
  );
}

export default App;
