import React from 'react'
import { NavLink } from "react-router-dom"

const NoUsersExists = () => {
    return (
        <div
            style={{
                padding: "0 1rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}
        >
            <h3>No users found</h3>
            <button>
                <NavLink to={'/users/addUser'}>Create User</NavLink>
            </button>
        </div>
    )
}

export default NoUsersExists