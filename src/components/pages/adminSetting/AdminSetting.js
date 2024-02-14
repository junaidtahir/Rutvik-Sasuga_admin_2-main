import React from "react";
import { auth } from "../../../Firebase";
import { useState } from "react";
import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';
import ic_hide from "../../../assets/images/ic_hide.png"
import ic_view from "../../../assets/images/ic_view.png"

const AdminSetting = () => {
  const { t } = useTranslation();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const email = window.localStorage.getItem("usermail");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [previosPasswordVisible, setPreviosPasswordVisible] = useState(false);
  const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
 

  const handleChangePassword = async () => {
    if (newPassword === "" && oldPassword === "" && repeatPassword === "") {
      setErrorMessage("Please fill all fiald");
      return;
    }

    if (newPassword !== repeatPassword) {
      toast.error("New password and repeat password do not match.");
      setErrorMessage("New password and repeat password do not match.");
      return;
    }

    const credential = EmailAuthProvider.credential(email, oldPassword);
    await reauthenticateWithCredential(auth.currentUser, credential)
      .then(async (response) => {
        console.log(response, "-=-=-=-=-=-=>");
        setErrorMessage("");
        await updatePassword(auth.currentUser, newPassword)
          .then((response) => {
            toast.success("Password has been change");
            setOldPassword("");
            setNewPassword("");
            setRepeatPassword("");
          })
          .catch((error) => {
            setErrorMessage("enter your currect details");
          });
      })
      .catch((error) => {
        setErrorMessage("old pass is encurrect");
      });
  };

  const togglePasswordVisibility = () => {
    setNewPasswordVisible(!newPasswordVisible);
  };
  const setPasswordVisiblityOnclick = () => {
    setRepeatPasswordVisible(!repeatPasswordVisible);
  };
  const togglePreviousPasswordVisibility = () => {
    setPreviosPasswordVisible(!previosPasswordVisible);
  };

  return (
    <>
      <div className="h-[calc(100vh-62px)] ml-auto flex mt-10 justify-center">
        <div className="w-full">
          <h1 className="font-bold text-2xl leading-9 text-center mb-10">
          {t('AdminSetting.ChangeAdminPassword')}
          </h1>
          <div className="md:max-w-[654px] mx-auto w-full border border-bordercolor pb-5 rounded-lg p-10">
            <div className="flex flex-col gap-[24px]">
            <div className="flex flex-col gap-5">
  <div style={{justifyContent:"space-between"}} className="flex items-center">
              {/* <div className="flex items-center gap-x-5 flex-wrap"> */}
                <label
                  htmlFor="PreviousPassword"
                  className="font-bold text-base leading-9 text-center w-[150px]"
                >
                  {t('AdminSetting.PreviousPassword')}
                </label>
                <div  className="border py-3 border-bordercolor rounded-lg" style={{display:"flex", alignItems:"center"}}>
                <input
                 type={previosPasswordVisible ? "text" : "password"}
                 style={{marginRight:10,marginLeft:10}}
                 className="md:w-[300px] w-full  placeholder:text-Typography placeholder:text-sm text-sm text-Typography focus:outline-none "
                  placeholder="Enter password"
                  id="PreviousPassword"
                  name="PreviousPassword"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                  <img  onClick={()=>togglePreviousPasswordVisibility()} src={previosPasswordVisible  ? ic_view : ic_hide} style={{objectFit:"cover", marginRight:10,cursor:"pointer", height:18,width:18}}/>
              </div>
              </div>
              </div>
              <div className="flex flex-col gap-5">
  <div style={{justifyContent:"space-between"}} className="flex items-center">
                <label
                  htmlFor="NewPassword"
                  className="font-bold text-base leading-9 text-center w-[150px]"
                >
                  {t('AdminSetting.NewPassword')}
                </label>
                <div  className="border py-3 border-bordercolor rounded-lg" style={{display:"flex", alignItems:"center"}}>
                <input
                  type={newPasswordVisible ? "text" : "password"}
                  style={{marginRight:10,marginLeft:10}}
                  className="md:w-[300px] w-full  placeholder:text-Typography placeholder:text-sm text-sm text-Typography focus:outline-none "
                  placeholder="Enter password"
                  id="NewPassword"
                  name="NewPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <img  onClick={()=>togglePasswordVisibility()} src={newPasswordVisible  ? ic_view : ic_hide} style={{objectFit:"cover", marginRight:10,cursor:"pointer", height:18,width:18}}/>
                </div>
              </div>
              </div>
              <div style={{}} className="flex flex-col gap-5">
  <div style={{justifyContent:"space-between"}} className="flex items-center">
              {/* <div className="flex items-center gap-x-5 flex-wrap"> */}
                <label
                  htmlFor="RepeatPassword"
                  className="font-bold text-base leading-9 text-center w-[150px]"
                >
                 {t('AdminSetting.RepeatPassword')}
                </label>
                <div  className="border py-3 border-bordercolor rounded-lg" style={{display:"flex", alignItems:"center"}}>
                <input
                   type={repeatPasswordVisible ? "text" : "password"}
                  style={{marginRight:10,marginLeft:10}}
                  className="md:w-[300px] w-full  placeholder:text-Typography placeholder:text-sm text-sm text-Typography focus:outline-none "
                  placeholder="Enter password"
                  id="RepeatPassword"
                  name="RepeatPassword"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
                <img  onClick={()=>setPasswordVisiblityOnclick()} src={repeatPasswordVisible  ? ic_view : ic_hide} style={{objectFit:"cover", marginRight:10,cursor:"pointer", height:18,width:18}}/>

                </div>
              </div>
              </div>
              {errorMessage && (
                <p className="text-red text-left">{errorMessage}</p>
              )}
              <button
                onClick={handleChangePassword}
                className="md:max-w-[300px] h-[50px] text-center text-[#fff] bg-[#353A3F] rounded-md lg:ml-[170px] ml-0"
              >
                {t('AdminSetting.ChangePassword')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSetting;
