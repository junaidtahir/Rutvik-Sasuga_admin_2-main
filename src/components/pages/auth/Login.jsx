import React, { useState } from "react";
import { auth, db } from "../../../Firebase";
import {query,get ,doc,getDoc, collection} from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Routing } from "../../shared/constants/routing";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const heandelUserData = (e) => {
    setErrormessage("");
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };
  const [errormessage, setErrormessage] = useState("");

  
    
    


  const login =  (e) => {
    if (userData.email !== "" && userData.password !== "") {
      signInWithEmailAndPassword(auth, userData.email, userData.password).then(async(useCredential) => {
        
          console.log(useCredential);
          // code to check whether logged in user exist in the admin collection
          const docRef = doc(db, "admin", useCredential.user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            localStorage.setItem("usermail", useCredential.user.email);
            localStorage.setItem("accessToken", useCredential.user.accessToken);
            navigate("/dashboard");
          } else {
            // docSnap.data() will be undefined in this case
            alert("This is not a valid admin account.");
            localStorage.removeItem("accessToken");
            navigate(Routing.Login);
          }


          
        })
        .catch((error) => {
          console.log(error);
          setErrormessage("invalid-login-credentials");
        });
    } else {
      setErrormessage("Fill your Login details");
    }
  };

  return (
    <>
      <div className="h-[calc(100vh-62px)] ml-auto flex items-center justify-center">
        <div className="w-full">
          <h1 className="font-bold text-2xl leading-9 text-center mb-10">
            {t('Login.Login')}
          </h1>
          <div className="md:max-w-[654px] mx-auto w-full border border-bordercolor pb-5 rounded-lg p-10">
            <div className="flex flex-col gap-[24px]">
              <div className="flex items-center gap-x-7 flex-wrap">
                <label
                  htmlFor="Username"
                  className="font-bold text-base leading-9 text-center"
                >
                  {t('Login.Username')}
                </label>
                <input
                  type="text"
                  className="md:w-[428px] w-full pl-4 border border-bordercolor py-3 rounded-lg placeholder:text-Typography placeholder:text-sm text-sm text-Typography focus:outline-none "
                  placeholder="Eg miaranger@gmail.com"
                  id="Username"
                  name="email"
                  value={userData.email}
                  onChange={heandelUserData}
                />
              </div>
              <div className="flex items-center gap-x-7 flex-wrap">
                <label
                  htmlFor="Password"
                  className="font-bold text-base leading-9 text-center "
                >
                 {t('Login.Password')}
                </label>
                <input
                  type="password"
                  className="md:w-[428px] w-full pl-4 border border-bordercolor py-3 rounded-lg placeholder:text-Typography placeholder:text-sm text-sm text-Typography focus:outline-none"
                  placeholder="Enter your password"
                  id="Password"
                  name="password"
                  value={userData.password}
                  onChange={heandelUserData}
                />
              </div>
              <button
                className="md:max-w-[435px] h-[50px] text-center text-[#fff] bg-[#353A3F] rounded-md md:ml-[100px] ml-0"
                onClick={login}
              >
                {t('Login.Login')}
              </button>
              {errormessage && (
                <p className="w-full text-center text-red">{errormessage}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
