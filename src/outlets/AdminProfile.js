import React, { useLayoutEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import useSubmitForm from "../hooks/useSubmitForm";

const AdminProfile = () => {
  const { isUserAuth: admin } = useOutletContext();
  const [isEdit, setIsEdit] = useState(false);
  const [edit, setEdit] = useState({ ...admin, newEmail: admin.email });
  const [submitHandler, err, setErr] = useSubmitForm({
    apiRoute: `${process.env.REACT_APP_API_BASEURL}/editAdmin`,
    $data: edit,
    navigateRoute: "/login",
  });
  const [show, setShow] = useState(false);

  useLayoutEffect(() => {
    if (!err) return;
    alert(err);
    setTimeout(setErr, 100, "");
  }, [err]);

  function changeHandler(e) {
    setEdit((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  // console.log(edit);

  return (
    <div>
      <div className="flex center">
        <h2>My Profile</h2>
        <span
          style={{ padding: "6px 0 0 1rem" }}
          onClick={(e) => {
            setIsEdit((prev) => !prev);
            setEdit({ ...admin, newEmail: admin.email });
          }}
        >
          <FiEdit className="icon" color="#333" />
        </span>
      </div>
      <table className="profile-table">
        <tbody>
          <tr>
            <th>Email</th>
            <td>
              <input
                type="email"
                name="newEmail"
                id="admin-email"
                value={edit.newEmail}
                onChange={changeHandler}
                className={isEdit ? "edit-text" : "as-text"}
                readOnly={!isEdit}
              />
            </td>
          </tr>
          <tr>
            <th>Password</th>
            <td className="relative" style={{}}>
              <input
                type={show ? "text" : "password"}
                name="password"
                id="admin-password"
                value={edit.password}
                onChange={changeHandler}
                className={isEdit ? "edit-text" : "as-text"}
                readOnly={!isEdit}
              />
              <div
                className="show-toggle"
                style={{
                  position: "absolute",
                  right: "2rem",
                  top: 0,
                  translate: "0 50%",
                }}
              >
                <input
                  type="checkbox"
                  name="showPassword"
                  id="showPassword"
                  onChange={(e) => setShow(e.target.checked)}
                  style={{ translate: "0 .1rem" }}
                />
                <label htmlFor="showPassword" style={{ fontSize: ".9rem" }}>
                  Show
                </label>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="flex" style={{ justifyContent: "flex-end" }}>
        {isEdit && <button onClick={submitHandler}>Submit</button>}
      </div>
    </div>
  );
};

export default AdminProfile;
