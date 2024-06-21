import { useContext } from "react";
import { ItineraryContext } from "../../global/itinerary/context";
import CityCard from "../CityCard/CityCard";
import {
  ButtonInfo,
  InfoSection,
  InfoUser,
  ButtonAccomodation,
} from "../Explore/Explore.style";
import LandmarkCard from "../LandmarkCard/LandmarkCard";
import { SectionItineraryData } from "./Itinerary.style";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../../hooks/useLocalStorage";

function Itinerary() {
  const navigate = useNavigate();
  const { stateGlobalItinerary } = useContext(ItineraryContext);

  const itineraryValueArray = stateGlobalItinerary.itineraryValue;
  console.log("itineraryValueArray", itineraryValueArray);

  const itineraryLandmarkValueArray =
    stateGlobalItinerary.itineraryLandmarkValue;
  console.log("itineraryLandmarkValueArray", itineraryLandmarkValueArray);

  const { localData } = useLocalStorage("user");
  console.log("localData", localData);

  let city = "";

  let country = "";

  let accommodationArray = [];

  for (let key of itineraryLandmarkValueArray) {
    console.log("key", key);
    city = key["city"];
    country = key["country"];
    accommodationArray.push({ country, city });
    console.log("accommodationArray", accommodationArray);
  }
  for (let key of itineraryValueArray) {
    console.log("key", key);

    city = key["city"];
    country = key["country"];

    accommodationArray.push({ country, city });
    console.log("accommodationArray", accommodationArray);
  }

  console.log("city", city, "country", country);

  const goAccomm = () => {
    console.log("GO ACCOMM");
    console.log("Navigating to: ", `/accommodation/${localData}`);
    console.log("State: ", { accommodationArray });
    navigate(`/accommodation/${localData}`, {
      state: [accommodationArray],
    });
  };

  return (
    <>
      <SectionItineraryData loc="SectionItineraryData">
        {itineraryValueArray.length === 0 &&
        itineraryLandmarkValueArray.length === 0 ? (
          <InfoSection loc="InfoSection">
            <InfoUser loc="InfoUser">
              You didn't choose any itinerary yet! Go to "I Want To Explore
              Offers" and select a destination that you like to know more about!
            </InfoUser>
            <ButtonInfo loc="ButtonInfo" to={`/home`}>
              Take me back to Home screen!
            </ButtonInfo>
          </InfoSection>
        ) : null}
        {stateGlobalItinerary &&
          itineraryValueArray?.map((element, index) => (
            <CityCard key={index} index={index} {...element} />
          ))}
        {stateGlobalItinerary &&
          itineraryLandmarkValueArray?.map((element, index) => (
            <LandmarkCard key={index} index={index} {...element} />
          ))}
        {stateGlobalItinerary && (
          <ButtonAccomodation
            loc="ButtonAccomodation"
            onClick={() => goAccomm()}
          >
            I want to book accommodation!
          </ButtonAccomodation>
        )}
      </SectionItineraryData>
    </>
  );
}
export default Itinerary;
