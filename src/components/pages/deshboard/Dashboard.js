import React, { useState, useEffect } from "react";
import { db, auth, requestForToken } from "../../../Firebase";
import {
  query,
  collection,
  getDocs,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";

import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [usersData, setusersData] = useState({});
  const [countryData, setcountryData] = useState({});
  useEffect(() => {
    getdata();
  }, []);

  const getdata = async () => {
    const querySnapshot = await getDocs(collection(db, "fcm_tokens"));
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    setPosts(data);
  };
 
  useEffect(() => {
    requestForToken();
    const q = query(collection(db, "users/"));

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const fetchedUsers = [];
      let totalUsers = 0;
      let totalPremiumUsers = 0;
      let totalMaleUsers = 0;
      let totalFemaleUsers = 0;
      let totalTransgenderUsers = 0;
      let totalActiveUsers = 0;
      const countryCounts = {};
      QuerySnapshot.forEach((doc) => {
        let user = doc.data();
        fetchedUsers.push({ ...doc.data(), id: doc.id, checked: false });
        totalUsers++;
        if (user.isDisable.isDisable !== false) totalActiveUsers++; // Count active users
        if (user.subscription.isPurchased == true) {
          totalPremiumUsers++;
        } // Count active users
        if (user.gender === "Male") {
          totalMaleUsers++; // Count active male users
        } else if (user.gender === "Female") {
          totalFemaleUsers++; // Count active female users
        } else if (user.gender === "Transgender") {
          totalTransgenderUsers++;
        }

        const country = user.country;
        if (countryCounts[country]) {
          countryCounts[country]++;
        } else {
          countryCounts[country] = 1;
        }
      });
      for (const country in countryCounts) {
        console.log(`Country: ${country}, Count: ${countryCounts[country]}`);
      }
      setcountryData(countryCounts);
      setusersData({
        totalUsers,
        totalMaleUsers,
        totalFemaleUsers,
        totalTransgenderUsers,
        totalActiveUsers,
        totalPremiumUsers,
      });
      // setSelectedPeople(fetchedUsers)
    });
    return () => unsubscribe;
  }, []);
  return (
    <div className="px-[32px] pt-[40px]">
      <div className="flex items-center gap-y-3 gap-x-3 flex-wrap">
        <div className="p-[24px] border border-bordercolor rounded-xl md:w-[22%] min-w-[250px] sm:w-full w-full">
          {/* <button onClick={() => {i18n.changeLanguage('fr')}}>Change language</button> */}
          <p className="text-sm font-normal text-lightblue">
            {t("Dashboard.NumberOfPremiumUsers")}
          </p>
          <h2 className="mt-2 text-[#000] font-bold text-2xl">
            {usersData.totalPremiumUsers}
          </h2>
        </div>
        {/* <div className="p-[24px] border border-bordercolor rounded-xl md:w-[22%] min-w-[250px] sm:w-full w-full">
          <p className="text-sm font-normal text-lightblue">
            {t('Dashboard.NumberOfActiveUsers')}
          </p>
          <h2 className="mt-2 text-[#000] font-bold text-2xl">
            {usersData.totalActiveUsers}
          </h2>
        </div> */}
        {/* <div className="p-[24px] border border-bordercolor rounded-xl md:w-[22%] min-w-[250px] sm:w-full w-full">
          <p className="text-sm font-normal text-lightblue">
            {t('Dashboard.NumberOfActiveUsers')}
          </p>
          <h2 className="mt-2 text-[#000] font-bold text-2xl">
            {usersData.totalActiveUsers}
          </h2>
        </div> */}
        <div className="p-[24px] border border-bordercolor rounded-xl md:w-[22%] min-w-[250px] sm:w-full w-full">
          <p className="text-sm font-normal text-lightblue">
            {t("Dashboard.NumberOfRegisteredUsers")}
          </p>

          <h2 className="mt-2 text-[#000] font-bold text-2xl">
            {usersData.totalUsers}
          </h2>
        </div>
      </div>
      <div className="flex items-center gap-6 mt-6 xl:flex-nowrap  flex-wrap justify-between">
        {/* {formattedTime}
        <button onClick={() => setIsRunning(true)}>Start</button>
        <button
          onClick={() => {
            setIsRunning(false);
            setSeconds(0);
          }}
        >
          Stop
        </button> */}
        <div className="border border-bordercolor p-6 rounded-xl flex flex-col w-full md:w-40% gap-6 min-h-[280px]">
          <h2 className="text-[#000] text-[20px] font-bold">
            {t("Dashboard.SummaryOfUsersState")}
          </h2>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-4 w-full">
              {Object.entries(countryData).map(([key, value]) => (
                <div className="flex items-center gap-3 ">
                  <p className="text-lightblue text-base font-semibold min-w-[84px]">
                    {key}
                  </p>
                  <div className="h-[16px] max-w-[338px] bg-[#3576F4] w-full rounded"></div>
                  <h2 className="text-[#000] font-bold text-2xl flex-1 text-end">
                    {value}
                  </h2>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border border-bordercolor p-6 rounded-xl flex flex-col w-full md:w-40% gap-6 min-h-[280px]">
          <h2 className="text-[#000] text-[20px] font-bold">
            {t("Dashboard.SummaryOfGender")}
          </h2>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center gap-3 ">
              <p className="text-lightblue text-base font-semibold min-w-[84px]">
                Female
              </p>
              <div
                className={`h-[16px] max-w-[338px] bg-[#FAC137] rounded w-${usersData.totalFemaleUsers}/${usersData.totalUsers}`}
              ></div>
              <h2 className="text-[#000] font-bold text-2xl flex-1 text-end">
                {usersData.totalFemaleUsers}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-lightblue text-base font-semibold min-w-[84px]">
                Male
              </p>
              <div
                className={`h-[16px] max-w-[338px] bg-[#FAC137] bg-opacity-60 rounded w-${usersData.totalMaleUsers}/${usersData.totalUsers}`}
              ></div>
              <h2 className="text-[#000] font-bold text-2xl flex-1 text-end">
                {usersData.totalMaleUsers}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-lightblue text-base font-semibold min-w-[84px]">
                Transgender
              </p>
              <div
                className={`h-[16px] max-w-[338px] bg-[#FAC137] bg-opacity-60  rounded w-${usersData.totalTransgenderUsers}/${usersData.totalUsers}`}
              ></div>
              <h2 className="text-[#000] font-bold text-2xl flex-1 text-end">
                {usersData.totalTransgenderUsers}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
