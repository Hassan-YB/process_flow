
import Dashboard from "./views/Dashboard.js";
import UserProfile from "./views/UserProfile.js";
import TableList from "./views/TableList.js";
import Typography from "./views/Typography.js";
import Icons from "./views/Icons.js";
import Maps from "./views/Maps.js";
import Notifications from "./views/Notifications.js";
import Upgrade from "./views/Upgrade.js";
import Signup from "./views/Signup.js";
import Signin from "./views/Signin.js";
import VerifyOTP from "./views/VerifyOtp.js";
import ChangePassword from "./views/ChangePassword.js";
import ResetPassword from "./views/ResetPassword.js";
import ResendOtp from "./views/ResendOtp.js";
import Profile from "./views/Profile.js";
import UpdateProfile from "./views/UpdateProfile.js";

const dashboardRoutes = [
  {
    path: "/profile",
    name: "Profile",
    icon: "nc-icon nc-alien-33",
    component: Profile,
    layout: "/admin"
  },
  {
    path: "/edit-profile",
    name: "Edit Profile",
    component: UpdateProfile,
    layout: "/admin",
  },
  {
    path: "/signup",
    name: "Sign Up",
    icon: "nc-icon nc-alien-33",
    component: Signup,
    layout: "/admin"
  },
  {
    path: "/signin",
    name: "Sign In",
    icon: "nc-icon nc-alien-33",
    component: Signin,
    layout: "/admin"
  },
  {
    path: "/verify",
    name: "Verify OTP",
    icon: "nc-icon nc-alien-33",
    component: VerifyOTP,
    layout: "/admin"
  },
  {
    path: "/resend-otp",
    name: "Resend OTP",
    icon: "nc-icon nc-alien-33",
    component: ResendOtp,
    layout: "/admin"
  },
  {
    path: "/change-password",
    name: "Change Password",
    icon: "nc-icon nc-alien-33",
    component: ChangePassword,
    layout: "/admin"
  },
  {
    path: "/reset-password",
    name: "Reset Password",
    icon: "nc-icon nc-alien-33",
    component: ResetPassword,
    layout: "/admin"
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/user",
    name: "User Profile",
    icon: "nc-icon nc-circle-09",
    component: UserProfile,
    layout: "/admin"
  },
  {
    path: "/table",
    name: "Table List",
    icon: "nc-icon nc-notes",
    component: TableList,
    layout: "/admin"
  },
  {
    path: "/typography",
    name: "Typography",
    icon: "nc-icon nc-paper-2",
    component: Typography,
    layout: "/admin"
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "nc-icon nc-atom",
    component: Icons,
    layout: "/admin"
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "nc-icon nc-pin-3",
    component: Maps,
    layout: "/admin"
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: "nc-icon nc-bell-55",
    component: Notifications,
    layout: "/admin"
  }
];

export default dashboardRoutes;
