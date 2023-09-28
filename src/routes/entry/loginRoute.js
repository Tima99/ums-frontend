import { Routes, Route } from "react-router-dom"
import LoginPage from "../../pages/LoginPage";

const loginRoute = [
    <Route path="/login" element={<LoginPage />} key="login"></Route>
]

export default loginRoute 