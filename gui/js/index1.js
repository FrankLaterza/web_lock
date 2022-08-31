import React, {useState} from "react";
import ReactDOM from "react-dom";
// import { TbBackspace } from "react-icons/tb";
import { Main, Password, MainGrid, EnterBtn, NumButton } from "./comp/UiComponents";

const Numbers = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];

function Root(){

    const [password, setPassword] = useState(
        "",

    );

    function handleChange(num){
        if (password.length !== 6){
            setPassword(String(password) + String(num));
        }
    }

    function handleChangeRemove(){

        setPassword(String(Math.floor(password / 10)));

        if (password.length === 1 ){
            setPassword("");
        } 
    }

    return (
        
        <Main>
            <h1>
                Web Lock
            </h1>
            <Password>
                {password}
                {(password.length > 0 ) ? <div onClick={e => handleChangeRemove(e)}>{"<"}</div> : ""}
            </Password>

            <MainGrid>
                {Numbers.map((num, index) =>
                    <NumButton key={index} onClick={(e) => handleChange(num, e)}>
                        {num}
                    </NumButton>)
                }
            </MainGrid>
        
            <EnterBtn>
                Enter
            </EnterBtn>

        </Main>


    );

}


ReactDOM.render(<Root />, document.getElementById("root"));