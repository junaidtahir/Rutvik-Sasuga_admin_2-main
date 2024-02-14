import React, { useEffect, useState } from "react";
import Select from "react-select";
import ReactPaginate from "react-paginate";
// Icons
import { RiDeleteBin6Line } from "react-icons/ri";
import { Arrowleft } from "../../../assets/icons";

// firebase
import { db, requestForToken, auth } from "../../../Firebase";
import { useTranslation } from "react-i18next";
import { useAuthState } from "react-firebase-hooks/auth";
import { RxCross2 } from "react-icons/rx";
import {
  query,
  collection,
  getDocs,
  doc,
  firestore,
  orderBy,
  onSnapshot,
  limit,
  deleteDoc,
} from "firebase/firestore";
import moment from "moment";
import SendNotificationPopup from "./sendNotificationPopup";
import DeleteNotificationPopup from "./deleteNotificationPopup";
// import firebase from "firebase/app";
const PushNotification = () => {
  const { t } = useTranslation();
  // select
  const Type = [
    // { value: "All", label: "All" },
    { value: "PushNotification", label: "PushNotification" },
    { value: "EmailNotification", label: "EmailNotification" },
  ];
  const Male = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Transgender", label: "Transgender" },
  ];
  const Suspended = [
    { value: "Suspended", label: "Suspended" },
    { value: "Verified", label: "Verified" },
  ];
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUser, setselectedUser] = useState("");

  const [type, setType] = useState([]);
  const [maleopt, setMaleopt] = useState([]);
  const [notificationList, setNotificationList] = useState([]);
  const [notificationType, setNotificationType] = useState([]);
  const [suspended, setSuspended] = useState([]);
  const [user] = useAuthState(auth);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  useEffect(() => {
    const querySnapshot = query(
      collection(db, "notifications"),
      orderBy("created_at", "desc")
    );

    const unsubscribe = onSnapshot(querySnapshot, (QuerySnapshot) => {
      const data = [];
      QuerySnapshot.forEach((doc) => {
        const notification = doc.data();
        notification.id = doc.id;
        data.push(notification);
      });
      setSelectAll(false);
      let filteredUsers =
        notificationType.length > 0
          ? data.filter((notification) =>
              notificationType.some((filter) =>
                matchesFilter(notification, filter)
              )
            )
          : data;

      setNotificationList(filteredUsers);
    });
    return () => unsubscribe;
  }, [notificationType]);

  function matchesFilter(notification, filter) {
    return (
      (filter.value === "PushNotification" &&
        notification.type === "pushNotification") ||
      (filter.value === "EmailNotification" &&
        notification.type === "emailNotification")
    );
  }
  const deleteNotification = async () => {
    try {
      const docRef = doc(db, "notifications", selectedUser);
      await deleteDoc(docRef).then(()=> setOpenDelete(false));
      // getNotificationListdata()
    } catch (error) {}
  };
  const deleteSelectedNotifications = async () => {
    try {
      for (const notificationId of selectedNotifications) {
        const docRef = doc(db, "notifications", notificationId);
        await deleteDoc(docRef);
      }
      // getNotificationListdata(); // Refresh the notification list
      setSelectedNotifications([]); // Clear selected notifications
      // setSelectAll(!selectAll);
    } catch (error) {
      // Handle error
    }
  };

  const toggleNotificationSelection = (notificationId) => {
    if (isSelected(notificationId)) {
      setSelectedNotifications((prevSelected) =>
        prevSelected.filter((id) => id !== notificationId)
      );
    } else {
      setSelectedNotifications((prevSelected) => [
        ...prevSelected,
        notificationId,
      ]);
    }
  };
  const isSelected = (notificationId) => {
    return selectedNotifications.includes(notificationId);
  };
  const handleCheckAllClick = () => {
    if (selectAll) {
      setSelectedNotifications([]); // Uncheck all
    } else {
      // Check all notifications
      const allNotificationIds = notificationList.map((item) => item.id);
      setSelectedNotifications(allNotificationIds);
    }
    setSelectAll(!selectAll); // Toggle the state
  };
  const clearFilters = () => {
    setNotificationType([]);
  };
  function Items({ currentItems }) {
    return (
      <>
        <table
          className="min-w-full table-fixed rounded-tl-[10px] border-2 border-[#E3E8F2] overflow-hidden mt-6"
          style={{ borderCollapse: "inherit" }}
        >
          <thead>
            <tr className="divide-x divide-[#E3E8F2]">
              <th
                scope="col"
                className="relative py-3 px-4 text-left text-sm text-[#52678E] font-medium bg-[#F4F4F6]"
              >
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleCheckAllClick}
                  className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
              </th>
              <th
                scope="col"
                className="py-3 px-4 text-left text-sm text-[#52678E] font-medium bg-[#F4F4F6]"
              >
                {t("Notification.Number")}
              </th>
              <th
                scope="col"
                className="py-3 px-4 text-left text-sm text-[#52678E] font-medium bg-[#F4F4F6]"
              >
                {t("Notification.NotificationMessagelete")}
              </th>
              <th
                scope="col"
                className="py-3 px-4 text-left text-sm text-[#52678E] font-medium bg-[#F4F4F6]"
              >
                {t("Notification.NotificationType")}
              </th>
              <th
                scope="col"
                className="py-3 px-4 text-left text-sm text-[#52678E] font-medium bg-[#F4F4F6]"
              >
                {t("Notification.CreateTime")}
              </th>
              <th
                scope="col"
                className="py-3 px-4 text-left text-sm text-[#52678E] font-medium bg-[#F4F4F6]"
              >
                {t("Notification.Action")}
              </th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {currentItems &&
              currentItems.map((item, index) => {
                const formattedDate = moment(item?.created_at?.toDate()).format(
                  "MMM Do YYYY, h:mm:ss a"
                );
                return (
                  <tr
                    key={item.id}
                    className={`bg-gray-50 divide-y divide-x divide-[#E3E8F2] `}
                  >
                    <td className="py-6 px-4 border-t border-bordercolor">
                      <input
                        onChange={() => toggleNotificationSelection(item.id)}
                        checked={isSelected(item.id)}
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </td>
                    <td className="text-[#000000] py-6 px-4 font-medium">
                      {index + 1}
                    </td>
                    <td className="text-[#000000] py-6 px-4 font-medium">
                      {item.message}
                    </td>
                    <td className="text-[#000000] py-6 px-4 font-medium">
                      {item.type}
                    </td>
                    <td className="text-[#000000] py-6 px-4 font-medium">
                      {formattedDate}
                    </td>
                    <td className="text-[#000000] py-6 px-4 flex items-center gap-4">
                      <span className="h-[32px] w-[32px] bg-[#F4C4AF] rounded-full flex items-center justify-center">
                        <RiDeleteBin6Line
                          onClick={() =>{
                            setOpenDelete(true)
                            setselectedUser(item.id)}
                          }
                          className="text-[#CE463F]"
                        />
                      </span>
                    </td>
                  </tr>
                );
              })}
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
      setCurrentItems(notificationList.slice(itemOffset, endOffset));

      // console.log(`Showing ${Math.ceil(notificationList.length / itemsPerPage)} of ${notificationList.length}`);
      setPageCount(Math.ceil(notificationList.length / itemsPerPage));
    }, [itemOffset, itemsPerPage]);

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
      const newOffset =
        (event.selected * itemsPerPage) % notificationList.length;
      console.log(
        `User requested page number ${event.selected}, which is offset ${newOffset}`
      );
      setItemOffset(newOffset);
    };

    return (
      <>
        <Items currentItems={currentItems} />
        <div className="bottom-cont">
          {currentItems && (
            <p className="tablePageStatus">
              {t("UserManagement.Showing")} {currentItems.length} of{" "}
              {notificationList.length}
            </p>
          )}
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
        <div className="flex items-center justify-between flex-wrap gap-4">
          <button
            className="bg-[#677DA4] text-white px-4 py-2.5 rounded-md"
            onClick={() => {
              setOpen(true);
            }}
          >
            {t("Notification.NewNotification")}
          </button>
          <div className="flex items-center gap-4 divide-x-2 divide-[#E3E8F2]">
            {notificationType.length > 0 ? (
              <div className="flex items-center">
                <h2 className="font-semibold text-xl text-[#000] leading-[28px]">
                  {notificationList.length} {t("UserManagement.Results")}
                </h2>
                <h3 className="font-medium text-medium  text-[#000] relative pl-4">
                  {t("UserManagement.ClearFilters")}{" "}
                  <div className="absolute top-1/2 -translate-y-1/2 -right-6 w-[18px] h-[18px] rounded-full bg-[#F4F4F6] flex items-center justify-center">
                    <RxCross2
                      onClick={clearFilters}
                      className="text-sm text-[#52678E] font-medium cursor-pointer"
                    />
                  </div>
                </h3>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div className="flex items-center flex-wrap filtter relative left-[-1px] gap-4">
            <h2 className="font-bold text-[18px] leading-[24px] text-[#000] mr-4">
              {t("Notification.Type")}:
            </h2>
            <Select
              value={notificationType}
              onChange={setNotificationType}
              options={Type}
              placeholder={"All"}
              isMulti
              className="min-w-[180px] rounded-l-lg rounded-r-[0px] font-normal text-[14px] leading-[22px] notificationType mr-4"
            />

            <div className="relative mr-12 flex items-center">
              <h2 className="font-bold text-[18px] leading-[24px] text-[#000] mr-4">
                {t("Notification.Search")}:
              </h2>
              <Select
                // defaultValue={selectedOption}
                value={suspended}
                onChange={setSuspended}
                options={Suspended}
                isMulti
                placeholder={t("Notification.UserEmailOrUsername")}
                className="min-w-[180px] min-h-[46px] lastinput font-normal text-[14px] leading-[22px] suspended"
              />
              <div className="flex items-center flex-wrap absolute top-1/2 -translate-y-1/2 -right-[3.03rem]">
                <button className="min-h-[46px] px-4 py-2 box-border bg-gray rounded-r-lg text-white">
                  <Arrowleft />
                </button>
              </div>
            </div>
            <button
              onClick={() => deleteSelectedNotifications()}
              className={`min-h-[46px] px-5 py-2 box-border rounded-md text-white ${
                selectedNotifications.length > 0 ? "bg-[#677DA4]" : "bg-gray"
              }`}
            >
              {t("Notification.Delete")}
            </button>
          </div>
        </div>

        <div
          className="w-full overflow-x-auto"
          style={{
            borderBottom: "2px solid #D5DDEC",
            borderRadius: "0 0 10px 10px",
          }}
        >
          <PaginatedItems itemsPerPage={4} />
        </div>
        <SendNotificationPopup open={open} setOpen={setOpen} />
        <DeleteNotificationPopup
          openDelete={openDelete}
          selectedUser={selectedUser}
          deleteNotification={deleteNotification}
          setOpenDelete={setOpenDelete}
        />
      </div>
    </>
  );
};

export default PushNotification;
