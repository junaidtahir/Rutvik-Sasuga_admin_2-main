// import React, { lazy } from "react";
// import { Routing } from "./constants/routing";
// import {
//   BrowserRouter as Router,
//   Route,
//   Routes,
// } from "react-router-dom";
// import MainLayout from "../layout/MainLayout";

// const Login = lazy(() => import("../pages/auth/Login"));

// const routes = [
//   {
//     path: Routing.Initial,
//     component: Login,
//     isPrivateRoute: false,
//   }
// ];

// const AppRouting = () => {
//   return (
//     <Router>
//       <Routes>
//         {routes
//           .filter((route) => !route.isPrivateRoute)
//           .map((route, index) => {
//             return (
//               <Route
//                 key={index}
//                 path={route.path}
//                 element={<route.component />}
//               />
//             );
//           })}
//       </Routes>
//       <Routes>
//         {routes
//           .filter((route) => route.isPrivateRoute)
//           .map((route, index) => {
//             return (
//               <Route
//                 key={index}
//                 path={route.path}
//                 element={
//                   <MainLayout>
//                     <route.component />
//                   </MainLayout>
//                 }
//               />
//             );
//           })}
//       </Routes>
//     </Router>
//   );
// };

// export default AppRouting;
