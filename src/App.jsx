

// // import {
// //     BrowserRouter,
// //     Routes,
// //     Route,
// //     Navigate
// // } from "react-router-dom";

// // import Dashboard from "./pages/Dashboard";
// // import Login from "./pages/Login";
// // import Users from "./pages/Users";
// // import Devices from "./pages/Devices";
// // import Processes from "./pages/Processes";
// // import Windows from "./pages/Windows";
// // import IdleActivities from "./pages/IdleActivities";
// // import Sessions from "./pages/Sessions";

// // import PrivateRoute from "./components/PrivateRoute";
// // import { ToastContainer } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";

// // function App() {
// //     return (
// //         <BrowserRouter>
// //             <ToastContainer
// //                 position="top-right"
// //                 autoClose={3000}
// //                 hideProgressBar={false}
// //                 newestOnTop
// //                 closeOnClick
// //                 rtl={false}
// //                 pauseOnFocusLoss
// //                 draggable
// //                 pauseOnHover
// //                 theme="light"
// //             />

// //             <Routes>
// //                 <Route path="/login" element={<Login />} />

// //                 <Route
// //                     path="/"
// //                     element={
// //                         <PrivateRoute>
// //                             <Dashboard />
// //                         </PrivateRoute>
// //                     }
// //                 />

// //                 <Route
// //                     path="/dashboard"
// //                     element={
// //                         <PrivateRoute>
// //                             <Dashboard />
// //                         </PrivateRoute>
// //                     }
// //                 />

// //                 <Route
// //                     path="/users"
// //                     element={
// //                         <PrivateRoute>
// //                             <Users />
// //                         </PrivateRoute>
// //                     }
// //                 />

// //                 {/* Devices - All devices */}
// //                 <Route
// //                     path="/devices"
// //                     element={
// //                         <PrivateRoute>
// //                             <Devices />
// //                         </PrivateRoute>
// //                     }
// //                 />

// //                 {/* Devices - User specific */}
// //                 <Route
// //                     path="/devices/:userId"
// //                     element={
// //                         <PrivateRoute>
// //                             <Devices />
// //                         </PrivateRoute>
// //                     }
// //                 />

// //                 <Route
// //                     path="/processes/:deviceId"
// //                     element={
// //                         <PrivateRoute>
// //                             <Processes />
// //                         </PrivateRoute>
// //                     }
// //                 />

// //                 <Route
// //                     path="/windows/:deviceId"
// //                     element={
// //                         <PrivateRoute>
// //                             <Windows />
// //                         </PrivateRoute>
// //                     }
// //                 />

// //                 <Route
// //                     path="/idle/:deviceId"
// //                     element={
// //                         <PrivateRoute>
// //                             <IdleActivities />
// //                         </PrivateRoute>
// //                     }
// //                 />

// //                 <Route
// //                     path="/sessions/:deviceId"
// //                     element={
// //                         <PrivateRoute>
// //                             <Sessions />
// //                         </PrivateRoute>
// //                     }
// //                 />

// //                 <Route
// //                     path="*"
// //                     element={
// //                         <PrivateRoute>
// //                             <Navigate to="/dashboard" replace />
// //                         </PrivateRoute>
// //                     }
// //                 />
// //             </Routes>
// //         </BrowserRouter>
// //     );
// // }

// // export default App;














// import {
//     BrowserRouter,
//     Routes,
//     Route,
//     Navigate
// } from "react-router-dom";

// import Dashboard from "./pages/Dashboard";
// import Login from "./pages/Login";
// import Users from "./pages/Users";
// import Devices from "./pages/Devices";
// import Processes from "./pages/Processes";
// import Windows from "./pages/Windows";
// import IdleActivities from "./pages/IdleActivities";
// import Sessions from "./pages/Sessions";

// import PrivateRoute from "./components/PrivateRoute";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function App() {
//     return (
//         <BrowserRouter>
//             <ToastContainer
//                 position="top-right"
//                 autoClose={3000}
//                 hideProgressBar={false}
//                 newestOnTop
//                 closeOnClick
//                 rtl={false}
//                 pauseOnFocusLoss
//                 draggable
//                 pauseOnHover
//                 theme="light"
//             />

//             <Routes>
//                 <Route path="/login" element={<Login />} />

//                 <Route
//                     path="/"
//                     element={
//                         <PrivateRoute>
//                             <Dashboard />
//                         </PrivateRoute>
//                     }
//                 />

//                 <Route
//                     path="/dashboard"
//                     element={
//                         <PrivateRoute>
//                             <Dashboard />
//                         </PrivateRoute>
//                     }
//                 />

//                 <Route
//                     path="/users"
//                     element={
//                         <PrivateRoute>
//                             <Users />
//                         </PrivateRoute>
//                     }
//                 />

//                 <Route
//                     path="/devices"
//                     element={
//                         <PrivateRoute>
//                             <Navigate to="/users" replace />
//                         </PrivateRoute>
//                     }
//                 />

//                 <Route
//                     path="/devices/:userId"
//                     element={
//                         <PrivateRoute>
//                             <Devices />
//                         </PrivateRoute>
//                     }
//                 />

//                 <Route
//                     path="/processes"
//                     element={
//                         <PrivateRoute>
//                             <Navigate to="/dashboard" replace />
//                         </PrivateRoute>
//                     }
//                 />

//                 <Route
//                     path="/processes/:deviceId"
//                     element={
//                         <PrivateRoute>
//                             <Processes />
//                         </PrivateRoute>
//                     }
//                 />

//                 <Route
//                     path="/windows"
//                     element={
//                         <PrivateRoute>
//                             <Navigate to="/dashboard" replace />
//                         </PrivateRoute>
//                     }
//                 />

//                 <Route
//                     path="/windows/:deviceId"
//                     element={
//                         <PrivateRoute>
//                             <Windows />
//                         </PrivateRoute>
//                     }
//                 />

//                 <Route
//                     path="/idle"
//                     element={
//                         <PrivateRoute>
//                             <Navigate to="/dashboard" replace />
//                         </PrivateRoute>
//                     }
//                 />

//                 <Route
//                     path="/idle/:deviceId"
//                     element={
//                         <PrivateRoute>
//                             <IdleActivities />
//                         </PrivateRoute>
//                     }
//                 />

//                 <Route
//                     path="/sessions"
//                     element={
//                         <PrivateRoute>
//                             <Navigate to="/dashboard" replace />
//                         </PrivateRoute>
//                     }
//                 />

//                 <Route
//                     path="/sessions/:deviceId"
//                     element={
//                         <PrivateRoute>
//                             <Sessions />
//                         </PrivateRoute>
//                     }
//                 />

//                 <Route
//                     path="*"
//                     element={
//                         <PrivateRoute>
//                             <Navigate to="/dashboard" replace />
//                         </PrivateRoute>
//                     }
//                 />
//             </Routes>
//         </BrowserRouter>
//     );
// }

// export default App;













import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Users from "./pages/Users";
import Devices from "./pages/Devices";
import Processes from "./pages/Processes";
import Windows from "./pages/Windows";
import IdleActivities from "./pages/IdleActivities";
import Sessions from "./pages/Sessions";

import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <BrowserRouter>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <Routes>
                <Route path="/login" element={<Login />} />

                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/users"
                    element={
                        <PrivateRoute>
                            <Users />
                        </PrivateRoute>
                    }
                />

                {/* Devices - All devices */}
                <Route
                    path="/devices"
                    element={
                        <PrivateRoute>
                            <Devices />
                        </PrivateRoute>
                    }
                />

                {/* Devices - User specific */}
                <Route
                    path="/devices/:userId"
                    element={
                        <PrivateRoute>
                            <Devices />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/processes"
                    element={
                        <PrivateRoute>
                            <Navigate to="/dashboard" replace />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/processes/:deviceId"
                    element={
                        <PrivateRoute>
                            <Processes />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/windows"
                    element={
                        <PrivateRoute>
                            <Navigate to="/dashboard" replace />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/windows/:deviceId"
                    element={
                        <PrivateRoute>
                            <Windows />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/idle"
                    element={
                        <PrivateRoute>
                            <Navigate to="/dashboard" replace />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/idle/:deviceId"
                    element={
                        <PrivateRoute>
                            <IdleActivities />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/sessions"
                    element={
                        <PrivateRoute>
                            <Navigate to="/dashboard" replace />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/sessions/:deviceId"
                    element={
                        <PrivateRoute>
                            <Sessions />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="*"
                    element={
                        <PrivateRoute>
                            <Navigate to="/dashboard" replace />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;