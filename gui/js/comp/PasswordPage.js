import React, { useState } from "react";
import PropTypes, { func } from "prop-types";
import { useHistory } from "react-router-dom";
import { postAPI } from "./ControlItem";
import styled from "styled-components";

const Conatiner = styled.div`
  overflow: none;
  background-color: rgb(44, 44, 44);
  font-family: "Roboto", sans-serif;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  color: white;
  padding: 0;
  margin: 0;
  font-size: 2rem;
  overflow: hidden;
`;

const Header = styled.div`
  background-color: rgb(31, 31, 31);
  width: 100%;
  height: 100px;
  gap: 20px;
  font-size: 3rem;
  text-align: center;
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Password = styled.div`
  margin-top: 110px;
  margin-bottom: 20px;
  margin-left: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 3.5rem;
  height: 100px;
  width: 50%;

  @media (max-width: 800px) {
    width: 90%;
  }
`;

const GridContainer = styled.div`
  overflow: hidden;
  width: 25vw;
  height: 25vw;
  text-align: center;
  display: grid;
  gap: 10px;
  grid-template-columns: auto auto auto;
  background-color: #263d88;
  border-radius: 1rem;
  padding: 10px;

  @media (max-width: 800px) {
    width: 80vw;
    height: 80vw;
  }
`;

const EnterBtn = styled.div`
  background: #3b5b97;
  border: 5px solid #263d88;
  border-radius: 6px;
  box-shadow: rgba(0, 0, 0, 0.1) 1px 2px 4px;
  box-sizing: border-box;
  color: #ffffff;
  cursor: pointer;
  display: inline-block;
  font-family: nunito, roboto, proxima-nova, "proxima nova", sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 16px;
  outline: 0;
  width: 25vw;
  height: 80px;
  margin-top: 10px;
  padding: 10px;
  text-align: center;
  text-rendering: geometricprecision;
  text-transform: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: middle;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 800px) {
    width: 80vw;
  }
  :active {
    background-color: #5382da;
  }
`;

const NumberBtn = styled.button`
  height: 100%;
  background-color: #3b5b97;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  font-weight: bold;
  text-align: center;
  transition: 200ms;
  width: 100%;
  box-sizing: border-box;
  border: 0;
  font-size: 2rem;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
`;

const Numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function PasswordPage(props) {
  const [auth, setAuth] = useState(0);
  setAuth(props.data.passwordAcceptance);

  const [password, setPassword] = useState("");
  let loginToggle = 0;

  function handleChange(e, num) {
    if (password.length !== 6) {
      // console.log(dashboardData[dashboardData.length - 1] [1]);
      setPassword(String(password) + String(num));
    }
  }

  function handleChangeRemove() {
    setPassword(String(Math.floor(password / 10)));
    if (password.length === 1) {
      setPassword("");
    }
  }

  const history = useHistory();

  // this will check with if auth on client
  function checkAuth(e, password) {
    // sends the current date
    // postAPI("date", Date.now(), "char", props.API);

    // checks if the password is aviable
    postAPI("passwordInput", password, "uint32_t", props.API);
    //reset the password
    setPassword("");
  }
  if (auth) {
    history.push("/lock");
  }

  console.log(props.data);
  console.log(password);

  return (
    <Conatiner>
      <Header>
        <b>Password</b>
      </Header>
      <Password>
        {password}
        {password.length > 0 ? (
          <p onClick={(e) => handleChangeRemove(e)}>{" <"}</p>
        ) : (
          ""
        )}
      </Password>
      <GridContainer>
        {Numbers.map((num, index) => (
          <NumberBtn key={index} onClick={(e) => handleChange(e, num)}>
            {num}
          </NumberBtn>
        ))}
      </GridContainer>
      <EnterBtn onClick={(e) => checkAuth(e, password)}>ENTER</EnterBtn>
    </Conatiner>
  );
}

PasswordPage.propTypes = {
  API: PropTypes.string,
  uuid: PropTypes.number,
  data: PropTypes.object,
};
