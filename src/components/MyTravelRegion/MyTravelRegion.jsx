import { useContext, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import { useParams } from "react-router-dom";
import { addChoice } from "../../Store/actions";
import { ChoiceContext } from "../../Store/context";
import useFetchData from "../../hooks/useFetchData";
import useFetchUsers from "../../hooks/useFetchUsers";
import {
  DataContainer,
  Text,
} from "../MainHome/CitiesRegions/CitiesRegions.style";
import {
  ButtonChoice,
  ButtonPlanTravel,
  FiltersContainerTravel,
  FiltersTravel,
  ImgContainerTravel,
  MainContainerTravel,
  PageContainerTravel,
  SelectTravel,
  TextContainerTravel,
} from "../MyTravelCity/MyTravel.style";
import MyTravelRecommend from "../MyTravelRecommend/MyTravelRecommend";

function MyTravelRegion() {
  const { country, region, id } = useParams();
  const [clicked, setClicked] = useState(true);
  const [period, setPeriod] = useState("");
  const [buget, setBuget] = useState("");
  const [show, setShow] = useState(false);

  const url = country
    ? `http://localhost:3001/${country}/?region=${region}`
    : null;

  const { data, error, loading } = useFetchData(url, clicked, setClicked);
  const compactData = data ? data[0] : null;

  const optionPeriod = ["three days", "five days", "seven days"];
  const optionBuget = ["Low buget", "Medium buget", "High buget"];

  const onOptionChangePeriod = (e) => {
    setPeriod(e.target.value);
    setClicked(true);
  };

  const onOptionChangeBuget = (e) => {
    setBuget(e.target.value);
    setClicked(true);
  };

  const handleClick = () => {
    setPeriod(period);
    setBuget(buget);
    setShow(!show);
  };

  const { users: user } = useFetchUsers("/" + id);
  console.log("user", user);

  const { stateGlobalChoice, dispatchChoice } = useContext(ChoiceContext);
  console.log("stateGlobalChoice.choiceValue", stateGlobalChoice.choiceValue);

  const handleUpdateChoice = (updateDataChoice) => {
    console.log("stateGlobalChoice.choiceValue", stateGlobalChoice.choiceValue);
    console.log("stateGlobalChoice", stateGlobalChoice);
    console.log("updateDataChoice", updateDataChoice);
    fetch(`http://localhost:3001/users/${id}`)
      .then((response) => response.json())
      .then((userData) => {
        // Check if the user has a 'choices' array, if not, initialize it
        const updatedChoices = userData.choices
          ? [...userData.choices, updateDataChoice]
          : [updateDataChoice];
        // Update the user data with the new choice
        const updatedUserData = { ...userData, choices: updatedChoices };

        fetch(`http://localhost:3001/users/${id}`, {
          method: "PUT",
          body: JSON.stringify(updatedUserData),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((json) => console.log(json));
      })
      .catch((error) => console.error("Error fetching user data:", error));
  };

  const handleAdd = (country, region, buget, period, data) => {
    const updateDataChoice = { country, region, buget, period, data };

    dispatchChoice(addChoice(updateDataChoice));
    console.log("updateDataChoice", updateDataChoice);
    handleUpdateChoice(updateDataChoice);
  };

  return (
    <>
      <PageContainerTravel>
        {loading && (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}
        {error && <div>Error: {error.message}</div>}
        {data && (
          <>
            <MainContainerTravel>
              <Text>Region: {compactData.region}</Text>
              <DataContainer>
                <ImgContainerTravel src={compactData.image} />
                <TextContainerTravel>
                  {compactData.description}
                </TextContainerTravel>
              </DataContainer>
            </MainContainerTravel>

            <FiltersContainerTravel>
              <FiltersTravel>
                <SelectTravel onChange={onOptionChangePeriod}>
                  <option>Choose a period:</option>
                  {optionPeriod.map((option, index) => {
                    return <option key={index}>{option}</option>;
                  })}
                </SelectTravel>

                <SelectTravel onChange={onOptionChangeBuget}>
                  <option>Choose a buget:</option>
                  {optionBuget.map((option, index) => {
                    return <option key={index}>{option}</option>;
                  })}
                </SelectTravel>
              </FiltersTravel>

              <FiltersTravel>
                <ButtonPlanTravel onClick={handleClick}>
                  {show ? "Return" : "Search"}
                </ButtonPlanTravel>
              </FiltersTravel>

              {show ? (
                <MyTravelRecommend
                  bugetTravel={buget}
                  periodTravel={period}
                  data={data}
                />
              ) : null}
            </FiltersContainerTravel>
          </>
        )}

        {show ? (
          <ButtonChoice
            to={`/my-choices/${id}`}
            onClick={() => handleAdd(country, region, buget, period, data)}
          >
            Save my Choice
          </ButtonChoice>
        ) : null}
      </PageContainerTravel>
    </>
  );
}

export default MyTravelRegion;
