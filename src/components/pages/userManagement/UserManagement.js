import React, { useState, useEffect } from "react";
import ReactPaginate from 'react-paginate';
import { RxCross2 } from "react-icons/rx";
import {Arrowleft, Blockicon, Chaticon, Checkicon} from "../../../assets/icons";
import SendMessagePopup from "./SendMessagePopup";
import Select from "react-select";
import { db, auth } from "../../../Firebase";
import {query, collection,getDocs, orderBy, onSnapshot, limit} from "firebase/firestore";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useTranslation } from 'react-i18next';
import userProfile from "../../../assets/images/user-profile.png"
const UserManagement = () => {
  const { t } = useTranslation();

  const Premium = [
    { value: "Premium", label: "Premium" },
    { value: "Standard", label: "Standard" },
  ];
  const Male = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Transgender", label: "Transgender" },
  ];
  const Suspended = [
    { value: "Suspended", label: "Disable" },
    { value: "Verified", label: "Active" },
  ];

  const [open, setOpen] = useState(false);
  const [verify, setVerify] = useState(false);
  const [susupend, setSusupend] = useState(false);
  const [deleteUser, setDeleteUser] = useState(false);
  const [msgShow, setMsgShow] = useState(false);
  const [Premiumopt, setPremiumopt] = useState([]);
  const [maleopt, setMaleopt] = useState([]);
  const [suspended, setSuspended] = useState([]);
  const [actionUserId, setactionUserId] = useState('');
  const [selectedUser, setselectedUser] = useState('');
  const [checked, setChecked] = useState(0);
  const [selectedPeople, setSelectedPeople] = useState([]);

  useEffect(() => {
    
    const q = query(collection(db, "users/"));
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {

      const fetchedUsers = [];
      let counter = 1;

      QuerySnapshot.forEach((doc) => {
        fetchedUsers.push({
          ...doc.data(),
          id: doc.id,
          S_N: counter,
          checked: false
        });
        counter++;
      });
      
      let filteredUsers = suspended.length > 0 ? 
        fetchedUsers.filter(
          (user) => suspended.some((filter) => matchesFilter(user, filter))
        ) : 
        fetchedUsers;

      filteredUsers = maleopt.length > 0 ? 
        filteredUsers.filter(
          (user) => maleopt.some((filter) => matchesFilter(user, filter))
        ) : 
        filteredUsers;

        filteredUsers = Premiumopt.length > 0 ? 
        filteredUsers.filter(
          (user) => Premiumopt.some((filter) => matchesFilter2(user, filter))
        ) : 
        filteredUsers;

      console.log(filteredUsers)
      setSelectedPeople(filteredUsers)
    });
    return () => unsubscribe;
  }, [maleopt,suspended,Premiumopt]);

  function matchesFilter(user, filter) {
    return (
      user.gender === filter.value ||
      (filter.value === "Suspended" && user.isSuspended) ||
      (filter.value === "Verified" && user.isVerify)
    )
  }
  function matchesFilter2(user, filter) {
    console.log("filterfilter",user);
    console.log("filterfilter",filter);
    return (
      user.subscription.subscription_type === filter.value 
    )
  }

  function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString.toDate());
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  const clearFilters = () => {
    setPremiumopt([]);
    setMaleopt([]);
    setSuspended([]);
  };

  function Items({ currentItems }) {
    return (
      <>
      <table className="min-w-full table-fixed rounded-tl-[10px] border-2 border-[#E3E8F2] overflow-hidden mt-6" style={{ borderCollapse: "inherit" }} >
            <thead>
              <tr className="divide-x divide-[#E3E8F2]">
                <th scope="col" className="relative py-3 px-4 text-left text-sm text-[#52678E] font-medium bg-[#F4F4F6]">
                  <input type="checkbox" 
                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    value={checked}
                    checked={checked === 1 ? true : false}
                    onChange={(e) => {
                      selectedPeople.forEach((elements, index) => {
                        selectedPeople[index].checked =
                          e.target.checked === true ? 1 : 0;
                      });
                      setChecked(e.target.checked === true ? 1 : 0);
                    }}
                  />
                </th>
                <th scope="col" className="py-3 px-4 text-left text-sm text-[#52678E] font-medium bg-[#F4F4F6]">{t('UserManagement.SerialNumber')}</th>
                <th scope="col" className="py-3 px-4 text-left text-sm text-[#52678E] font-medium bg-[#F4F4F6]">{t('UserManagement.Avatar')}</th>
                <th scope="col" className="py-3 px-4 text-left text-sm text-[#52678E] font-medium bg-[#F4F4F6]">{t('UserManagement.Phone')}</th>
                <th scope="col" className="py-3 px-4 text-left text-sm text-[#52678E] font-medium bg-[#F4F4F6]">{t('UserManagement.Email')}</th>
                <th scope="col" className="py-3 px-4 text-left text-sm text-[#52678E] font-medium bg-[#F4F4F6]">{t('UserManagement.UserName')}</th>
                <th scope="col" className="py-3 px-4 text-left text-sm text-[#52678E] font-medium bg-[#F4F4F6]">{t('UserManagement.Gender')}</th>
                <th scope="col" className="py-3 px-4 text-left text-sm text-[#52678E] font-medium bg-[#F4F4F6]">{t('UserManagement.Age')}</th>
                <th scope="col" className="py-3 px-4 text-left text-sm text-[#52678E] font-medium bg-[#F4F4F6]">{t('UserManagement.Location')}</th>
                <th scope="col" className="py-3 px-4 text-left text-sm text-[#52678E] font-medium bg-[#F4F4F6]">{t('UserManagement.SubscriptionType')}</th>
                <th scope="col" className="py-3 px-4 text-left text-sm text-[#52678E] font-medium bg-[#F4F4F6]">{t('UserManagement.Action')}</th>
              </tr>
            </thead>
          
      <tbody className="bg-white">
      {currentItems && currentItems.map((item, index) => (
          <tr key={item.id} 
            className={`${
              selectedPeople.includes(item) ? "bg-gray-50" : undefined
            } divide-y divide-x divide-[#E3E8F2] `}
          >
            <td className="py-6 px-4 border-t border-bordercolor">
              <input
                value={item.checked}
                checked={item.checked === 1 ? true : false}
                onChange={(e) => {
                  setChecked(0);
                  setSelectedPeople(
                    selectedPeople.map((item, index1) =>
                      index1 === index
                        ? {
                            ...item,
                            checked: e.target.checked === true ? 1 : 0,
                          }
                        : item
                    )
                  );
                }}
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
            </td>
            <td className="text-[#000000] py-6 px-4 font-medium">{index+1}</td>
            <td className="text-[#000000] py-6 px-4 font-medium">{item.photoUrl !=="" ? <img style={{maxWidth: "45px"}} src={item.photoUrl}/> : <img style={{maxWidth: "45px"}} src={userProfile}/>} </td>
            <td className="text-[#000000] py-6 px-4 font-medium">{item.phone}</td>
            <td className="text-[#000000] py-6 px-4 font-medium">{item.email}</td>
            <td className="text-[#000000] py-6 px-4 font-medium">{item.name}</td>
            <td className="text-[#000000] py-6 px-4 font-medium">{item.gender}</td>
            <td className="text-[#000000] py-6 px-4 font-medium">{getAge(item.dob)}</td>
            <td className="text-[#000000] py-6 px-4 font-medium">{item.country}</td>
            <td className="text-[#000000] py-6 px-4 font-medium">{item.subscription.subscription_type}</td>
            <td className="text-[#000000] py-6 px-4 flex items-center gap-4">
              <span
                className="block h-[32px] w-[32px] bg-[#2288FF26] rounded-full"
                onClick={() => {
                  setOpen(true);
                  setMsgShow(true);
                  setactionUserId(item.id);
                  setselectedUser(item);
                }}
              >
                <Chaticon />
              </span>
              <span
                className="h-[32px] w-[32px] bg-[#16B188] bg-opacity-30 rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => {
                  setOpen(true);
                  setDeleteUser(true);
                  setactionUserId(item.id);
                  setselectedUser(item);
                }}
              >
                {/* <Checkicon /> */}
                <RiDeleteBin6Line  
                // onClick={() => deleteNotification(item.id)} 
                className="text-[#CE463F]" />
              </span>
              {item.isSuspended ? <span
                className="h-[32px] w-[32px] bg-[#16B188] bg-opacity-30 rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => {
                  setOpen(true);
                  setVerify(true);
                  setactionUserId(item.id);
                  setselectedUser(item);
                }}
              >
                <Checkicon />
              </span>
                :
                <span
                className="flex items-center justify-center h-[32px] w-[32px] bg-[#B18616] bg-opacity-30 rounded-full cursor-pointer"
                onClick={() => {
                  setOpen(true);
                  setSusupend(true);
                  setactionUserId(item.id);
                  setselectedUser(item);
                }}
              >
                <Blockicon />
                </span>
                }
            </td>
          </tr>
      ))}
      </tbody>
      </table>
      
      </>
    );
  }
  function PaginatedItems({ itemsPerPage }) {
    // We start with an empty list of items.
    const [currentItems, setCurrentItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);
  
    useEffect(() => {
      // Fetch items from another resources.
      const endOffset = itemOffset + itemsPerPage;
      setCurrentItems(selectedPeople.slice(itemOffset, endOffset));
      
      // console.log(`Showing ${Math.ceil(selectedPeople.length / itemsPerPage)} of ${selectedPeople.length}`);
      setPageCount(Math.ceil(selectedPeople.length / itemsPerPage));
    }, [itemOffset, itemsPerPage]);
  
    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
      const newOffset = event.selected * itemsPerPage % selectedPeople.length;
      console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
      setItemOffset(newOffset);
    };
  
    return (
      <>
        <Items currentItems={currentItems} />
        <div className="bottom-cont">
        {currentItems && <p className="tablePageStatus">{t('UserManagement.Showing')} {currentItems.length} of {selectedPeople.length}</p>}
        <ReactPaginate
          nextLabel="&#8594;"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel="&#8592;"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          renderOnZeroPageCount={null}
        />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mt-10 px-[32px]">
        <div className="flex items-center justify-between flex-wrap">
        <div className="flex items-center gap-4 divide-x-2 divide-[#E3E8F2]">
        {maleopt.length > 0 || suspended.length > 0 ? <div className="flex items-center">
            <h2 className="font-semibold text-xl text-[#000] leading-[28px]">
              {selectedPeople.length} {t('UserManagement.Results')}
            </h2>
            <h3 className="font-medium text-medium  text-[#000] relative pl-4">
            {t('UserManagement.ClearFilters')}{" "}
              <div className="absolute top-1/2 -translate-y-1/2 -right-6 w-[18px] h-[18px] rounded-full bg-[#F4F4F6] flex items-center justify-center">
                <RxCross2
                  onClick={clearFilters}
                  className="text-sm text-[#52678E] font-medium cursor-pointer"
                />
              </div>
            </h3>
          </div>
          :
          <div></div>
        }
        </div>
          
          <div className="flex items-center flex-wrap filtter">
            <h2 className="font-medium text-[16px] leading-[24px] text-[#000] mr-4">
            {t('UserManagement.FilterBy')}
            </h2>
            <Select
              // defaultValue={selectedOption}
              value={Premiumopt}
              onChange={setPremiumopt}
              options={Premium}
              isMulti
              className="min-w-[180px] rounded-l-lg rounded-r-[0px] font-normal text-[14px] leading-[22px]"
            />
            <Select
              // defaultValue={selectedOption}
              value={maleopt}
              onChange={setMaleopt}
              options={Male}
              isMulti
              className="min-w-[180px] font-normal text-[14px] leading-[22px] maleopt"
            />
            <div className="relative mr-10">
              <Select
                // defaultValue={selectedOption}
                value={suspended}
                onChange={setSuspended}
                options={Suspended}
                isMulti
                className="min-w-[180px] min-h-[46px] lastinput font-normal text-[14px] leading-[22px] suspended"
              />
              <div className="flex items-center flex-wrap absolute top-1/2 -translate-y-1/2 -right-[3.03rem]">
                <button className="min-h-[46px] px-4 py-2 box-border bg-gray rounded-r-lg text-white">
                  <Arrowleft />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full overflow-x-auto" style={{borderBottom: "2px solid #D5DDEC", borderRadius: "0 0 10px 10px"}}>
            <PaginatedItems itemsPerPage={4}/>
        </div>

        <SendMessagePopup
          open={open}
          setOpen={setOpen}
          verify={verify}
          setVerify={setVerify}
          susupend={susupend}
          setSusupend={setSusupend}
          deleteUser={deleteUser}
          setDeleteUser={setDeleteUser}
          msgShow={msgShow}
          setMsgShow={setMsgShow}
          actionUserId={actionUserId}
          setactionUserId={setactionUserId}
          selectedUser={selectedUser}
          setselectedUser={setselectedUser}
        />
      </div>
    </>
  );
};

export default UserManagement;