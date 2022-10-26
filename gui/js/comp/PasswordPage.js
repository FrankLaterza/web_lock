import React, { useState } from "react";
import PropTypes, { func } from "prop-types";
import { useHistory } from "react-router-dom";
import { postAPI } from "./ControlItem";
import styled from "styled-components";

const spooky = "data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M82.42 180h-1.415L0 98.995v-2.827L6.167 90 0 83.833V81.004L81.005 0h2.827L90 6.167 96.167 0H98.996L180 81.005v2.827L173.833 90 180 96.167V98.996L98.995 180h-2.827L90 173.833 83.833 180H82.42zm0-1.414L1.413 97.58 8.994 90l-7.58-7.58L82.42 1.413 90 8.994l7.58-7.58 81.006 81.005-7.58 7.58 7.58 7.58-81.005 81.006-7.58-7.58-7.58 7.58zM175.196 0h-25.832c1.033 2.924 2.616 5.59 4.625 7.868C152.145 9.682 151 12.208 151 15c0 5.523 4.477 10 10 10 1.657 0 3 1.343 3 3v4h16V0h-4.803c.51.883.803 1.907.803 3 0 3.314-2.686 6-6 6s-6-2.686-6-6c0-1.093.292-2.117.803-3h10.394-13.685C161.18.938 161 1.948 161 3v4c-4.418 0-8 3.582-8 8s3.582 8 8 8c2.76 0 5 2.24 5 5v2h4v-4h2v4h4v-4h2v4h2V0h-4.803zm-15.783 0c-.27.954-.414 1.96-.414 3v2.2c-1.25.254-2.414.74-3.447 1.412-1.716-1.93-3.098-4.164-4.054-6.612h7.914zM180 17h-3l2.143-10H180v10zm-30.635 163c-.884-2.502-1.365-5.195-1.365-8 0-13.255 10.748-24 23.99-24H180v32h-30.635zm12.147 0c.5-1.416 1.345-2.67 2.434-3.66l-1.345-1.48c-1.498 1.364-2.62 3.136-3.186 5.14H151.5c-.97-2.48-1.5-5.177-1.5-8 0-12.15 9.84-22 22-22h8v30h-18.488zm13.685 0c-1.037-1.793-2.976-3-5.197-3-2.22 0-4.16 1.207-5.197 3h10.394zM0 148h8.01C21.26 148 32 158.742 32 172c0 2.805-.48 5.498-1.366 8H0v-32zm0 2h8c12.15 0 22 9.847 22 22 0 2.822-.53 5.52-1.5 8h-7.914c-.567-2.004-1.688-3.776-3.187-5.14l-1.346 1.48c1.09.99 1.933 2.244 2.434 3.66H0v-30zm15.197 30c-1.037-1.793-2.976-3-5.197-3-2.22 0-4.16 1.207-5.197 3h10.394zM0 32h16v-4c0-1.657 1.343-3 3-3 5.523 0 10-4.477 10-10 0-2.794-1.145-5.32-2.992-7.134C28.018 5.586 29.6 2.924 30.634 0H0v32zm0-2h2v-4h2v4h4v-4h2v4h4v-2c0-2.76 2.24-5 5-5 4.418 0 8-3.582 8-8s-3.582-8-8-8V3c0-1.052-.18-2.062-.512-3H0v30zM28.5 0c-.954 2.448-2.335 4.683-4.05 6.613-1.035-.672-2.2-1.16-3.45-1.413V3c0-1.04-.144-2.046-.414-3H28.5zM0 17h3L.857 7H0v10zM15.197 0c.51.883.803 1.907.803 3 0 3.314-2.686 6-6 6S4 6.314 4 3c0-1.093.292-2.117.803-3h10.394zM109 115c-1.657 0-3 1.343-3 3v4H74v-4c0-1.657-1.343-3-3-3-5.523 0-10-4.477-10-10 0-2.793 1.145-5.318 2.99-7.132C60.262 93.638 58 88.084 58 82c0-13.255 10.748-24 23.99-24h16.02C111.26 58 122 68.742 122 82c0 6.082-2.263 11.636-5.992 15.866C117.855 99.68 119 102.206 119 105c0 5.523-4.477 10-10 10zm0-2c-2.76 0-5 2.24-5 5v2h-4v-4h-2v4h-4v-4h-2v4h-4v-4h-2v4h-4v-4h-2v4h-4v-2c0-2.76-2.24-5-5-5-4.418 0-8-3.582-8-8s3.582-8 8-8v-4c0-2.64 1.136-5.013 2.946-6.66L72.6 84.86C70.39 86.874 69 89.775 69 93v2.2c-1.25.254-2.414.74-3.447 1.412C62.098 92.727 60 87.61 60 82c0-12.15 9.84-22 22-22h16c12.15 0 22 9.847 22 22 0 5.61-2.097 10.728-5.55 14.613-1.035-.672-2.2-1.16-3.45-1.413V93c0-3.226-1.39-6.127-3.6-8.14l-1.346 1.48C107.864 87.987 109 90.36 109 93v4c4.418 0 8 3.582 8 8s-3.582 8-8 8zM90.857 97L93 107h-6l2.143-10h1.714zM80 99c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm20 0c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6z' fill='%23000000' fill-opacity='0.42' fill-rule='evenodd'/%3E%3C/svg%3E"

const Conatiner = styled.div`
  overflow: none;
  background-color: #d66e0d;
  font-family: "Roboto", sans-serif;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  color: white;
  padding: 2rem;
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
  margin-top: 20px;
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
    width: 80%;
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
    background-color: #000000;
    border-radius: 1rem;
    padding: 10px;

  @media (max-width: 800px) {
    width: 80vw;
    height: 80vw;
  }
`;

const EnterBtn = styled.div`
  background: #2c2f35;
  border: 5px solid #000000;
  border-radius: 6px;
  box-shadow: rgba(0, 0, 0, 0.1) 1px 2px 4px;
  box-sizing: border-box;
  color: #FFFFFF;
  cursor: pointer;
  display: inline-block;
  font-family: nunito,roboto,proxima-nova,"proxima nova",sans-serif;
  font-size: 1.5rem ;
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
    background-color: #838996;
  }
`;

const NumberBtn = styled.button`
  height: 100%;
  background-color: #2c2f35;
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
    <Conatiner style={{backgroundImage: `url("${spooky}")`}}>
      <Header>
        <b>Password</b>
      </Header>
      <Password>
        {password}
        {password.length > 0 ? (
          <p onClick={(e) => handleChangeRemove(e)}>{" 🎃"}</p>
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
