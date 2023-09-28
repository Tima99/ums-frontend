import "./App.css"
import React from 'react'

import { Routes, Route } from "react-router-dom"

import UserHomePage from "./pages/UserHomePage";
import loginRoute from "./routes/entry/loginRoute";
import homeRoute from "./routes/homeRoute";

function App() {
	return (
		<Routes>
			{homeRoute}
			{loginRoute}
			<Route path='/userHome' element={<UserHomePage />}></Route>
		</Routes>
	)
}

export default App;
