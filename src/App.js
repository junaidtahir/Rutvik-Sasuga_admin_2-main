import "./App.css";
import { Suspense, lazy } from "react";
import Spinner from "./components/layout/spinner/spinner";
import { Routing } from "./components/shared/constants/routing";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import { ToastContainer } from "react-toastify";
import Notification from "./Notification";

const Login = lazy(() => import("./components/pages/auth/Login"));
const Dashboard = lazy(() => import("./components/pages/deshboard/Dashboard"));
const Reply = lazy(() => import("./components/pages/replay/Replay"));
const AdminSetting = lazy(() =>
  import("./components/pages/adminSetting/AdminSetting")
);
const Usermanagement = lazy(() =>
  import("./components/pages/userManagement/UserManagement")
);
const pushNotification = lazy(() =>
  import("./components/pages/pushNotification/pushNotification")
);
const ChangeLanguage = lazy(() =>
  import("./components/pages/changeLanguage/changeLanguage")
);

const routes = [
  {
    path: Routing.Initial,
    component: Login,
    isPrivateRoute: true,
  },
  {
    path: Routing.Login,
    component: Login,
    isPrivateRoute: true,
  },
  {
    path: Routing.Dashboard,
    component: Dashboard,
    isPrivateRoute: true,
  },
  {
    path: Routing.Reply,
    component: Reply,
    isPrivateRoute: true,
  },
  {
    path: Routing.Usermanagement,
    component: Usermanagement,
    isPrivateRoute: true,
  },
  {
    path: Routing.AdminSetting,
    component: AdminSetting,
    isPrivateRoute: true,
  },
  {
    path: Routing.pushNotification,
    component: pushNotification,
    isPrivateRoute: true,
  },
  {
    path: Routing.notification,
    component: Notification,
    isPrivateRoute: true, 
  },
  {
    path: Routing.changeLanguage,
    component: ChangeLanguage,
    isPrivateRoute: true, 
  },
];


function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Router>
        <Routes>
          {routes
            .filter((route) => !route.isPrivateRoute)
            .map((route, index) => {
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={<route.component />}
                />
              );
            })}
        </Routes>
        <Routes>
          {routes.filter((route) => route.isPrivateRoute).map((route, index) => {
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <MainLayout>
                      <route.component />
                    </MainLayout>
                  }
                />
              );
            })}
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={5000} />
    </Suspense>
  );
}

export default App;
