import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../../hooks/useLocalStorage";
import { Buttons } from "../MainHome/MainHome.style";
import AccountForm from "./AccountForm";
import { UserContext } from "../../global/user/UserContext";

import { addAllChoice, removeAllChoice } from "../../global/choice/actions";
import { ChoiceContext } from "../../global/choice/context";
import {
  ButtonsContainerAccount,
  ContactButton,
  ContactContainer,
  ContactText,
  ErrorP,
} from "./Account.style";
import useFetchUsers from "../../hooks/useFetchUsers";

const Account = () => {
  const navigate = useNavigate();
  const [clicked, setClicked] = useState(false);
  let id = "";

  const { user, setUser, fetchUser } = useContext(UserContext); // destructurare UserContext

  const { users, error, loading, setError } = useFetchUsers(
    id,
    clicked,
    setClicked
  );

  const [isVisible1, setIsVisible1] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const buttonRef1 = useRef(null);
  const buttonRef2 = useRef(null);

  // const [users, setUsers] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState([]);
  const [isFound, setIsFound] = useState([]);
  const [errorInput, setErrorInput] = useState({
    Email: undefined,
  });
  const [isValid, setIsValid] = useState(true);

  const { stateGlobalChoice, dispatchChoice } = useContext(ChoiceContext);

  const { localData, handleLocalData, resetLocalData } =
    useLocalStorage("user");

  console.log("localData", localData, stateGlobalChoice);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(`http://localhost:3001/users`);
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       const userData = await response.json();
  //       console.log("userData", userData);
  //       setUsers(userData);
  //       setLoading(false);
  //     } catch (error) {
  //       setError("Error 808");
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  console.log("users", users, "loading", loading, "error", error);

  const handleGetAccount = () => {
    setIsVisible1(!isVisible1);
    setIsVisible2(false);
    setError(false);
    setIsFound(true);
    !isVisible1 ? buttonRef1.current.focus() : buttonRef1.current.blur();
  };

  const handleNewAccount = () => {
    setIsVisible2(!isVisible2);
    setIsVisible1(false);
    setError(false);
    setIsFound(false);
    !isVisible2 ? buttonRef2.current.focus() : buttonRef2.current.blur();
  };

  const [inputObj, setInputObj] = useState({
    Email: "",
  });

  const handleChange = (e, name) => {
    setClicked(true);
    setError(false);
    const value = e.target.value;
    setInputObj({ ...inputObj, [name]: value });
    handleError(value, name);

    const foundUser = users.find((element) => element.Email === value);

    if (users && users.length > 0) {
      setIsFound(foundUser !== undefined);
    } else {
      setIsFound(false);
    }
  };

  const handleSubmit = async () => {
    console.log(inputObj);
    const add = await fetch(`http://localhost:3001/users`, {
      method: "POST",
      body: JSON.stringify(inputObj),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await add.json();
    console.log("S-a adaugat un user cu acest id pe server", response[0].id);

    return response[0].id;
  };

  const addNewId = async () => {
    dispatchChoice(removeAllChoice());
    // resetLocalData();
    const idul = await handleSubmit();
    handleLocalData("user", JSON.stringify(idul));
    console.log("S-a adagat un user cu acest id in local storage", idul);
    setUser({ Email: inputObj.Email, idul });
    navigate(`/users/${idul}`);
  };

  const getUserData = () => {
    setClicked(true);
    const userData = users?.find((element) => element.Email === inputObj.Email);
    console.log("users", users);
    console.log("inputObj", inputObj);
    console.log("userData", userData);

    handleLocalData("user", JSON.stringify(userData.id));
    setUser(userData);
    // dispatchChoice(removeAllChoice());
    // userData.choices
    //   ? dispatchChoice(addAllChoice(userData.choices))
    //   : setError("No selected travel choices yet!");

    if (userData.choices) {
      dispatchChoice(addAllChoice(userData.choices));
    } else {
      setError("No selected travel choices yet!");
    }
  };

  const logoutUser = () => {
    setIsVisible1(false);
    resetLocalData();
    setUser(null);
    dispatchChoice(removeAllChoice());
  };

  const handleError = (value, name) => {
    const isEmailValid = (email) => {
      const formulaEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      return formulaEmail.test(email);
    };

    if (!isEmailValid(value)) {
      setErrorInput({
        ...errorInput,
        [name]: "Invalid email format.",
      });
      setIsValid(false);
    } else if (value === "Email") {
      setErrorInput({ ...errorInput, [name]: "Error" });
    } else {
      setErrorInput({ ...errorInput, [name]: undefined });
      setIsValid(true);
    }
  };

  return (
    <>
      <ButtonsContainerAccount loc="ButtonsContainerAccount">
        <Buttons
          loc="Buttons"
          ref={buttonRef1}
          onClick={() => handleGetAccount()}
        >
          Login
        </Buttons>
        <Buttons
          loc="Buttons"
          ref={buttonRef2}
          onClick={() => handleNewAccount()}
        >
          Create new account
        </Buttons>
        <Buttons loc="Buttons" onClick={() => logoutUser()}>
          Logout
        </Buttons>
      </ButtonsContainerAccount>
      {isVisible1 && (
        <ContactContainer>
          <ContactText>Enter e-mail to login</ContactText>
          {Object.keys(inputObj).map((el, index) => (
            <AccountForm
              key={index}
              name={el}
              type={el}
              value={inputObj[el]}
              handleChange={handleChange}
              error={errorInput[el]}
            />
          ))}
          {isValid && isFound && (
            <ContactButton
              onClick={() => {
                getUserData();
              }}
            >
              Login
            </ContactButton>
          )}
          {isValid && isFound && error && (
            <>
              <ErrorP>{error}</ErrorP>
              <ContactButton to={`/home`}>Take me view offers!</ContactButton>
            </>
          )}
          {!isValid && <ErrorP>Not valid</ErrorP>}
          {!isFound && isVisible1 && <ErrorP>No such user found</ErrorP>}
        </ContactContainer>
      )}
      {isVisible2 && (
        <ContactContainer>
          <ContactText>Enter e-mail to create account</ContactText>
          {Object.keys(inputObj).map((el, index) => (
            <AccountForm
              key={index}
              name={el}
              type={el}
              value={inputObj[el]}
              handleChange={handleChange}
              error={errorInput[el]}
            />
          ))}
          {isValid && !isFound && (
            <ContactButton
              onClick={() => {
                addNewId();
              }}
            >
              Create account
            </ContactButton>
          )}
          {!isValid && <ErrorP>Not valid</ErrorP>}
          {isFound && isVisible2 && <ErrorP>Email already exists</ErrorP>}
        </ContactContainer>
      )}
    </>
  );
};

export default Account;
