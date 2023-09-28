import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import NoUsersExists from "../componets/NoUsersExists";
import { Outlet, useNavigate } from "react-router-dom";
import SortButtons from "../componets/SortButtons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import $selectedRows from "../utils/selection/selection";
import Buttons from "../componets/Buttons";

const UsersOutlet = () => {
    const [users, setUsers] = useState(null);
    // console.log(users);
    const [departments, setDepartments] = useState([]);
    const [userscopy, setUserscopy] = useState(null);
    const [select, setSelect] = useState(false);
    // const [filterDepartment, setFilterDepartment]      = useState(null);
    const [moveSelect, setMoveSelect] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [search, setSearch] = useState("");
    const [searchCategory, setSearchCategory] = useState(["email"]);
    const [datePick, setDatePick] = useState();
    const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);
    const [sortAsc, setSortAsc] = useState(false);
    const [sortAscdate, setSortAscdate] = useState(true);
    const navigate = useNavigate();
    let datepickerRef = useRef();
    const searchInputRef = useRef();
    const departmentfillterRef = useRef();
    const tableRef = useRef();

    const category = useMemo(() => (userscopy?.length > 0 ? Object.keys(userscopy[0]) : []), [userscopy]);
    let keyPress = [];
    const searchHighlightColor = "rgb(207, 207, 56)";

    const keyCombos = useMemo(
        () => [
            {
                combo: [18, 67], // [alt, c]
                action: () => {
                    navigate("/users/addUser");
                },
            },
            {
                combo: [17, 191], // [ctrl, /]
                action: () => {
                    searchInputRef.current.blur();
                },
            },
            {
                combo: [18, 72], // [alt, h]
                action: ToggleHighlighter,
            },
        ],
        [navigate]
    );

    function fetchUsers() {
        fetch(`${process.env.REACT_APP_API_BASEURL}/users`, { credentials: "include" })
            .then((res) => res.json())
            .then((data) => {
                if (!Array.isArray(data)) return setUsers(false);
                setUsers([...data]);
                setUserscopy([...data]);
            })
            .catch((err) => console.log(err));
    }

    function fetchDepartments() {
        fetch(`${process.env.REACT_APP_API_BASEURL}/departments`, { credentials: "include" })
            .then((res) => res.json())
            .then((data) => setDepartments(data))
            .catch((err) => console.log(err));
    }

    // function fetchUserCourses

    function ToggleHighlighter() {
        if (!searchInputRef.current.value) return;
        document.documentElement.style.setProperty(
            "--highlight-color",
            document.documentElement.style.getPropertyValue("--highlight-color") === "transparent" ? searchHighlightColor : "transparent"
        );
    }

    function keyShortCuts(e) {
        // console.log(e.keyCode);
        if (e.keyCode == 113) {
            return ToggleHighlighter();
        } else if (e.keyCode == 27) {
            setMoveSelect(false);
            setSelectedRows([]);
        } else if (
            !(document.activeElement.matches("input") || document.activeElement.classList[0]?.includes("ql-editor")) &&
            e.keyCode === 191 &&
            keyPress.length < 2
        ) {
            searchInputRef.current.focus();
        }

        if (keyPress.length <= 1) return (keyPress.length = 0);

        for (let i = 0; i < keyCombos.length; i++) {
            const item = keyCombos[i];
            const ismatch = item.combo.every((code, index) => code == keyPress[index]);
            if (ismatch) {
                item.action();
                break;
            }
        }
        keyPress.length = 0;
    }
    function keyShortCutsListen(e) {
        if (e.repeat) return;
        keyPress.push(e.keyCode);
    }

    useLayoutEffect(() => {
        fetchUsers();
        fetchDepartments();
        document.addEventListener("keyup", keyShortCuts);
        document.addEventListener("keydown", keyShortCutsListen);
        return () => {
            document.removeEventListener("keyup", keyShortCuts);
            document.removeEventListener("keydown", keyShortCutsListen);
        };
    }, []);

    function deleteRows(e) {
        if (selectedRows?.length <= 0) return alert("Please select atleast 1 row for delete");

        fetch(`${process.env.REACT_APP_API_BASEURL}/deleteUsers`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(selectedRows),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setUsers(data);
                setUserscopy(data);
                setSelectedRows([]);
                setSearch("");
            })
            .catch((err) => console.log(err));
    }

    function editRow() {
        // console.log(selectedRows);
        // return
        if (selectedRows.length !== 1) return alert("You can edit one(1) user at a time.");

        const editUsers = users.filter((user) => {
            return user.email === selectedRows[0];
        });

        navigate("/users/addUser", {
            state: editUsers[0],
        });
    }

    let doubleClicked = 0;
    let timeoutid = null;
    let doubleClicksensitive = 250;
    // by double clicking active checkbox input of every row so that you select and perform edit or delete action
    function clickHandler(e) {
        if (moveSelect) return;
        doubleClicked++;
        if (select) {
            setSelect((prev) => false);
            setSelectedRows([]);
        }

        clearTimeout(timeoutid);

        timeoutid = setTimeout(() => {
            doubleClicked = 0;
        }, doubleClicksensitive);

        if (doubleClicked < 2) return;

        setSelect((prev) => true);
    }

    // update state of selectedRows , fn calls when checked/unchecked input
    function selectChangeHandler(e) {
        if (e.target.checked)
            setSelectedRows((prev) => {
                return [...prev, e.target.id];
            });
        else {
            setSelectedRows((prev) => {
                const value = prev.findIndex((item) => item === e.target.id);

                if (value === -1) return prev;

                prev.splice(value, 1);

                return [...prev];
            });
        }
    }

    function selectAll(e) {
        if (e.target.checked) {
            setSelectedRows((prev) => {
                return users.map((user) => user.email);
            });
        } else {
            setSelectedRows([]);
        }
    }

    let doubleClicked2 = 0;
    let timeoutid2 = null;
    function togglePassword(e) {
        e.stopPropagation();

        if (moveSelect) return setMoveSelect(false);
        doubleClicked2++;

        e.target.setAttribute("type", "password");

        clearTimeout(timeoutid2);

        timeoutid2 = setTimeout(() => {
            doubleClicked2 = 0;
        }, 500);

        if (doubleClicked2 < 2) return;

        e.target.setAttribute("type", "text");
    }

    function hightlightSearch() {
        document.documentElement.style.setProperty("--highlight-color", "transparent");
        if (!search) return;
        if (!users?.length) return;

        const rows = [...tableRef.current.childNodes[1].childNodes];
        document.documentElement.style.setProperty("--highlight-color", searchHighlightColor);

        users.forEach((user, i) => {
            let node = null;
            if (user.searchBy === "email") {
                node = rows[i].childNodes[0].querySelector("label");
                rows[i].childNodes[1].querySelector("span")?.removeAttribute("class");
            } else if (user.searchBy === "phone") {
                node = rows[i].childNodes[1];
                rows[i].childNodes[0].querySelector("label span")?.removeAttribute("class");
            }

            if (!node) return;

            const highlight = `<span class="highlight">${search}</span>`;
            const re = new RegExp(search, "gi");
            const nodehighlight = node.innerText.replace(re, highlight);

            node.innerHTML = nodehighlight;
        });
    }

    useLayoutEffect(hightlightSearch, [users]);
    // call highlightSearch after users state update so we call it in useLayoutEffect hook
    // that's call every times users changes

    // search Handler calls when user type on search input
    function searchHandler(e = null, labels, isSearchEffect = true) {
        const query = e !== null ? e?.target.value.toLowerCase() : search;
        labels = labels || searchCategory;
        if (isSearchEffect) {
            setSearch(query);
            departmentfillterRef.current.value = "";
            departmentfillterRef.current.setAttribute("selected", "");
        } else setSearch("");

        const searchUsers = userscopy?.filter((user) => {
            return labels.some((label) => {
                if (user[label].toString().toLowerCase().includes(query)) {
                    user.searchBy = label;
                    return true;
                }
                return false;
            });
        });

        if (query == "") setUsers([...userscopy]);
        else setUsers([...searchUsers]);
    }

    // when user toggle any searchBy tab , function call
    function setCategory(e) {
        let label = e.target.nextElementSibling.innerText;
        const isChecked = searchCategory.join("").includes(label);
        if (isChecked) {
            if (searchCategory.length <= 1) return;
            const newCategories = searchCategory.filter((item) => item != label);
            setSearchCategory([...newCategories]);
            searchHandler(null, newCategories);
            return;
        }

        setSearchCategory((prev) => [...prev, label]);
        searchHandler(null, [...searchCategory, label]);
    }

    function sortByEmail(e) {
        setUsers((prev) => {
            const sorted = prev.sort((a, b) => {
                if (sortAsc) [a, b] = [b, a];

                if (a.email < b.email) return 1;

                if (a.email > b.email) return -1;
                return 0;
            });
            return [...sorted];
        });
        e.stopPropagation();
    }

    function sortByDate(e) {
        setUsers((prev) => {
            const sorted = prev.sort((a, b) => {
                let timeA = new Date(a.ts);
                let timeB = new Date(b.ts);
                if (sortAscdate) [timeA, timeB] = [timeB, timeA];
                if (timeA < timeB) return 1;
                if (timeA > timeB) return -1;
                return 0;
            });
            return [...sorted];
        });
        e.stopPropagation();
    }

    // convert date in our desire format
    function date(str) {
        const $date = new Date(str);
        return $date.toDateString().slice(3);
    }

    // when user select date or month from calendar ,fn calls so that users filter by selected date or Month
    function datefilter(date) {
        setUsers((prev) => {
            const users = userscopy.filter((user) => {
                const userTime = new Date(user.ts);
                const selectdate = new Date(date);
                if (!showMonthYearPicker) return userTime.toDateString() == selectdate.toDateString();
                return `${userTime.getMonth()}${userTime.getFullYear()}` == `${selectdate.getMonth()}${selectdate.getFullYear()}`;
            });
            if (users.length === 0) users.push({ noUser: true });
            return [...users];
        });
    }

    if (users === null) return <h3 style={{ textAlign: "center" }}>Loading...</h3>;

    if (users === false)
        return (
            <h3 style={{ textAlign: "center" }}>
                Something Went Wrong... <br /> Try Again
            </h3>
        );

    return (
        <div>
            <div>
                <div className="search-wraper">
                    {/* <label htmlFor="search">Search</label> */}
                    <div style={{ flex: 1 }} className="relative">
                        <input
                            type="search"
                            name="search"
                            id="search"
                            onChange={searchHandler}
                            value={search}
                            placeholder={`Search ${searchCategory.join(" or ")}`}
                            ref={searchInputRef}
                            autoComplete="off"
                        />
                        <span className="key-shortcut-tab" style={{ display: search ? "none" : "inline-flex" }}>
                            /
                        </span>
                        <div className="labels">
                            {category.map((c) => {
                                if (!c.includes("phone") && !c.includes("email")) return;
                                return (
                                    <React.Fragment key={c}>
                                        <input
                                            type="checkbox"
                                            name="label"
                                            id={c}
                                            checked={searchCategory.join("").includes(c)}
                                            onChange={setCategory}
                                        />
                                        <label htmlFor={c}>{c}</label>
                                    </React.Fragment>
                                );
                            })}
                            <select
                                name="departments"
                                id="filter-departments"
                                onChange={(e) => {
                                    searchHandler(e, ["department"], false);
                                    e.target.setAttribute("selected", e.target.value);
                                }}
                                ref={departmentfillterRef}
                            >
                                <option value={""}>All Departments</option>
                                {departments.map((department) => {
                                    return (
                                        <option key={department.id} value={department.name}>
                                            {department.name} : {userscopy.filter((user) => user.department === department.name).length}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            {users.length > 0 ? (
                <>
                    <Buttons
                        select={select}
                        moveSelect={moveSelect}
                        deleteRows={deleteRows}
                        editRow={editRow}
                        tableBody={
                            users.map((item) => {
                                const {genderId, avatar, id, admin, ..._} = item
                                _.ts = date(_.ts);
                                _.gender = _.gender || ''
                                _.course = _.course || ''
                                return _;
                            })
                        }
                        selectedRows={selectedRows}
                    />
                    <div style={{ overflowX: "auto", padding: "1rem 0" }} className="table-responsive-container">
                        <table
                            ref={tableRef}
                            onClick={clickHandler}
                            onMouseMove={(e) => $selectedRows(e, setSelectedRows, setMoveSelect, select, selectedRows)}
                            onMouseDownCapture={(e) => $selectedRows(e, setSelectedRows, setMoveSelect, select, selectedRows)}
                            onMouseUp={$selectedRows}
                        >
                            <thead>
                                <tr>
                                    <th>
                                        <div className="td-select">
                                            {select && (
                                                <input
                                                    type="checkbox"
                                                    name="select"
                                                    id="select-all"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                    }}
                                                    onChange={selectAll}
                                                />
                                            )}
                                            <label htmlFor="select-all" onClick={(e) => select && e.stopPropagation()}>
                                                email
                                            </label>
                                            &nbsp;&nbsp;
                                            <SortButtons sortBy={sortByEmail} setSortAsc={setSortAsc} sortAsc={sortAsc}></SortButtons>
                                        </div>
                                    </th>
                                    <th>phone</th>
                                    <th>department</th>
                                    <th>gender</th>
                                    <th
                                        onClick={(e) => {
                                            if (selectedRows?.length <= 0) return;
                                            selectedRows.map((row) => {
                                                const pwd = document.querySelector('tr[data="' + row + '"]')?.querySelector(".secure-text input");
                                                const type = pwd?.getAttribute("type");
                                                pwd?.setAttribute("type", type == "text" ? "password" : "text");
                                            });
                                            e.stopPropagation();
                                        }}
                                    >
                                        password
                                    </th>
                                    <th>Courses</th>
                                    <th style={{ whiteSpace: "nowrap" }}>
                                        <span style={{ marginRight: ".35rem", display: "inline-block" }}>Date</span>
                                        <SortButtons sortBy={sortByDate} setSortAsc={setSortAscdate} sortAsc={sortAscdate}></SortButtons>
                                        <span
                                            style={{
                                                display: "inline-block",
                                                marginLeft: "1rem",
                                                cursor: "pointer",
                                            }}
                                            id={datePick ? "date-filter-applied" : ""}
                                            onClick={function (e) {
                                                // console.log(datepickerRef.current);
                                                if (e.target.className.includes("react-datepicker__current-month")) {
                                                    setShowMonthYearPicker(true);
                                                    return;
                                                }
                                                if (e.target.matches("button") && e.target.getAttribute("id") == "reset--date-filter")
                                                    datepickerRef.setOpen(false);
                                                e.stopPropagation();
                                            }}
                                        >
                                            <DatePicker
                                                selected={datePick || new Date()}
                                                showFullMonthYearPicker
                                                customInput={<span>📅</span>}
                                                onChange={(date, e) => {
                                                    setDatePick(date);
                                                    datefilter(date);
                                                }}
                                                open={datepickerRef.open}
                                                monthAriaLabelPrefix="Hello"
                                                showMonthYearPicker={showMonthYearPicker}
                                                ref={(el) => (datepickerRef = el)}
                                            >
                                                <div className="reset-date-filter">
                                                    <span>
                                                        <button
                                                            className="reset-btn"
                                                            id="reset--date-filter"
                                                            disabled={datePick == null ? true : false}
                                                            onClick={(e) => {
                                                                setUsers(userscopy);
                                                                setDatePick(null);
                                                            }}
                                                        >
                                                            Reset
                                                        </button>
                                                        <button
                                                            className="reset-btn"
                                                            id="toggle-date-filter"
                                                            onClick={(e) => {
                                                                setShowMonthYearPicker((prev) => !prev);
                                                            }}
                                                        >
                                                            {showMonthYearPicker ? "Date" : "Month"}
                                                        </button>
                                                    </span>
                                                </div>
                                            </DatePicker>
                                        </span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, i) => {
                                    if (user.noUser)
                                        return (
                                            <tr key="no--user-exists">
                                                <td colSpan={"100%"}>
                                                    No Users{" "}
                                                    <>
                                                        (
                                                        {showMonthYearPicker
                                                            ? new Date(datePick).toLocaleDateString("en-us", {
                                                                  month: "long",
                                                                  year: "numeric",
                                                              })
                                                            : date(datePick)}
                                                        )
                                                    </>
                                                </td>
                                            </tr>
                                        );
                                    return (
                                        <tr
                                            key={user.email}
                                            data={user.email}
                                            className={moveSelect && selectedRows.some((row) => row == user.email) ? "selected--rows" : ""}
                                            style={{
                                                border: moveSelect && selectedRows.some((row) => row == user.email) ? "2px solid green" : "inherit",
                                                background:
                                                    moveSelect && selectedRows.some((row) => row == user.email) ? "rgba(33, 33, 33, 0.2)" : "inherit",
                                            }}
                                        >
                                            <td>
                                                <div className="td-select">
                                                    {select ? (
                                                        <input
                                                            type="checkbox"
                                                            name="select"
                                                            id={user.email}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                            }}
                                                            checked={selectedRows.find((item) => item == user.email) || false}
                                                            onChange={selectChangeHandler}
                                                        />
                                                    ) : (
                                                        user.avatar && (
                                                            <img 
                                                                src={`${process.env.REACT_APP_BASEURL}/${user.avatar}`} 
                                                                alt="logo" 
                                                                width={"24px"} 
                                                                onClick={
                                                                    e => {
                                                                        e.stopPropagation()
                                                                        navigate('/users/profileImage', {state: user.avatar})
                                                                    }
                                                                }
                                                                loading="lazy"
                                                            />
                                                        )
                                                    )}
                                                    <label htmlFor={user.email} onClick={(e) => select && e.stopPropagation()}>
                                                        {user.email}
                                                    </label>
                                                </div>
                                            </td>
                                            <td>{user.phone}</td>
                                            <td>{user.department || "---"}</td>
                                            <td className="capital">{user.gender || <span className="null-placeholder">Select Gender</span>}</td>
                                            <td className="secure-text">
                                                <input
                                                    type="password"
                                                    name="user-pasword"
                                                    className="toogle-user-pasword"
                                                    id={"toogle-user-pasword" + i}
                                                    value={user.password}
                                                    onChange={() => {}}
                                                    onClick={togglePassword}
                                                    readOnly
                                                    style={{
                                                        background:
                                                            moveSelect && selectedRows.some((row) => row == user.email)
                                                                ? "rgba(33, 33, 33, 0.02)"
                                                                : "inherit",
                                                    }}
                                                />
                                            </td>
                                            <td className="courses-td">
                                                {user.course ? (
                                                    <div className="horizontal-scroll-wrapper rectangles">
                                                        {user.course?.split(",").map((cn, i) => (
                                                            <span key={i} className="tab-2">
                                                                {cn}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="null-placeholder">No Courses Select</span>
                                                )}
                                            </td>
                                            <td>{date(user.ts)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <NoUsersExists />
            )}

            <Outlet context={{ setUsers, setUserscopy, searchHandler, setSearch }} />
        </div>
    );
};

export default UsersOutlet;
