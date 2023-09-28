import React, { useLayoutEffect, useState } from "react";
import { RiCloseCircleFill } from "react-icons/ri";
import { GrFormClose } from "react-icons/gr";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import useSubmitForm from "../hooks/useSubmitForm";

const AddUserOutlet = () => {
  const { state } = useLocation();
  const [userData, setUserData] = useState(
    state
      ? { ...state }
      : { email: "", phone: "", password: "", department: "", gender: null }
  );
  const [departments, setDepartments] = useState([]);
  const [genders, setGenders] = useState([]);
  // const [select, setSelect] = useState([]);

  const navigate = useNavigate();
  const { setUsers, setUserscopy, searchHandler, setSearch } =
    useOutletContext();
  const [submitHandler, err, setErr] = useSubmitForm({
    apiRoute: `${process.env.REACT_APP_API_BASEURL}/addUser`,
    $data: userData,
    validity,
    setDataTo: [setUsers, setUserscopy],
    cb: () => setSearch(""),
  });
  const [editSubmitHandler, editErr, editSetErr] = useSubmitForm({
    apiRoute: `${process.env.REACT_APP_API_BASEURL}/editUser`,
    $data: userData,
    validity,
    setDataTo: [setUsers, setUserscopy],
    cb: () => setSearch(""),
  });

  // const domRef = useClickOutsideDom((dom) => {
  //   dom.querySelector("#toggle-ml-drop-menu").checked = false;
  // });

  function closeAddUser(e) {
    if (e.keyCode == 27) Back();
  }

  useLayoutEffect(() => {
    document.addEventListener("keyup", closeAddUser);

    (async () => {
      const departFetch = fetch(`${process.env.REACT_APP_API_BASEURL}/departments`, {
        credentials: "include",
      });
      const genderFetch = fetch(`${process.env.REACT_APP_API_BASEURL}/genders`);
      const res = await Promise.all([departFetch, genderFetch]);
      res.forEach(async (_, i) => {
        const data = await _.json();
        i === 0 ? setDepartments(data) : setGenders(data);
      });
    })();

    return () => document.removeEventListener("keyup", closeAddUser);
  }, []);

  function Back() {
    navigate(-1);
  }

  function changeHandler(e) {
    setUserData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }

  function validity() {
    if (userData.phone.toString().length !== 10)
      throw Error("Phone must be 10 digits");
  }

  return (
    <div className="abs top-0 full-display bg-shadow flex center">
      <div className="card">
        <div className="head flex between pd-h-1">
          <div className="title">Create User</div>
          <RiCloseCircleFill className="icon" onClick={Back} />
        </div>

        <form
          className="card flex-col"
          onSubmit={state ? editSubmitHandler : submitHandler}
        >
          <div className={(err[0] || editErr[0]) == "$" ? "sucess" : "error"}>
            &nbsp;{err || editErr}&nbsp;
            <span
              className="close-error"
              onClick={() => {
                setErr("");
                editSetErr("");
              }}
            >
              {(state && editErr) || err ? (
                <GrFormClose color="red" />
              ) : (
                <>&nbsp;</>
              )}
            </span>
          </div>
          <div className="input-group first-input-group">
            <label htmlFor="add-email">Email</label>
            <input
              type="email"
              name="email"
              id="add-email"
              required
              value={userData.email}
              onChange={changeHandler}
              readOnly={state ? true : false}
              placeholder="Provide your email"
            />
          </div>
          <div className="input-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="number"
              name="phone"
              id="phone"
              value={userData.phone}
              onChange={changeHandler}
              placeholder="Must be 10 digits"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="departments">Departments</label>
            <select
              name="department"
              required
              value={userData.department}
              onChange={changeHandler}
            >
              <option value="">Select</option>
              {departments.length > 0 &&
                departments.map((department) => {
                  return (
                    <option value={department.value} key={department.id}>
                      {department.name}
                    </option>
                  );
                })}
            </select>
          </div>

          {/* <div className="flex-container input-group course-contain">
            <li className="flex-item1">Courses</li>
            <li className="flex-item2">
              <MultipleSelect
                ref={domRef}
                title={"Select courses you like one"}
                data={[
                  { name: "HTML", id: 1 },
                  { name: "CSS", id: 2 },
                  { name: "Javascript", id: 3 },
                  { name: "React", id: 4 },
                  { name: "React", id: 5 },
                  { name: "React", id: 6 },
                  { name: "React", id: 7 },
                  { name: "React", id: 8 },
                  { name: "React", id: 9 },
                  { name: "React", id: 10 },
                ]}
                select={select}
                setSelect={setSelect}
              />
            </li>
          </div> */}

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              required
              value={userData.password}
              onChange={changeHandler}
              placeholder="Password should alphanumeric of length 6 and no spaces"
            />
          </div>
          {/* <hr width="100%" /> */}

          <ul className="gender-container">
            <li>Gender</li>
            <ol>
              {genders?.map((_) => {
                return (
                  <li key={_.id}>
                    <input
                      type="radio"
                      name="gender"
                      id={"select-gender-" + _.id}
                      onChange={changeHandler}
                      value={_.id}
                      defaultChecked={userData?.genderId === _.id}
                    />
                    <label htmlFor={"select-gender-" + _.id}>{_.gender}</label>
                  </li>
                );
              })}
            </ol>
          </ul>

          <button>{state ? "Edit" : "Create"}</button>
        </form>
      </div>
    </div>
  );
};

export default AddUserOutlet;
