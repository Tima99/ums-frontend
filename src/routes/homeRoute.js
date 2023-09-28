import { Routes, Route } from "react-router-dom"
import UsersOutlet from "../outlets/UsersOutlet";
import AddUserOutlet from "../outlets/AddUserOutlet";
import AdminProfile from "../outlets/AdminProfile";
import HomePage from "../pages/HomePage";
import SendEmail from "../outlets/SendEmail";
import Signature from "../outlets/Signature";
import ProfileImage from "../outlets/ProfileImage";

export default [
    <Route path="/" element={<HomePage />} key={"HomeRoute"}>
        {/* <Route index element={<Nav />}></Route> */}
        <Route index element={<AdminProfile />}></Route>
        <Route path="/users" element={<UsersOutlet />}>
            <Route path="/users/addUser" element={<AddUserOutlet />}></Route>
            <Route path="/users/sendEmail" element={<SendEmail />}>
                <Route path="/users/sendEmail/signature" element={<Signature />} />
            </Route>
            <Route path="/users/profileImage" element={<ProfileImage />}>

            </Route>
        </Route>
    </Route>
]