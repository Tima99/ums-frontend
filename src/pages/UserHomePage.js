import React, { useLayoutEffect, useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Nav from "../componets/Nav";
import MultipleSelect from "../componets/MultipleSelect";
import useClickOutsideDom from "../hooks/useClickOutsideDom";
import useSubmitForm from "../hooks/useSubmitForm";
import InputImage from "../componets/InputImage";

const UserHomePage = () => {
    const { state } = useLocation();
    const [user, setUser] = useState(state && null);
    const [selectCourses, setSelectCourses] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const allCourses = useRef();
    const domRef = useClickOutsideDom((dom) => {
        dom && (dom.querySelector("#toggle-ml-drop-menu").checked = false);
    });

    const [submitHandler, err, setErr] = useSubmitForm({
        apiRoute: `${process.env.REACT_APP_API_BASEURL}/addCourses`,
        $data: { courses: selectCourses.map(({ id }) => id) },
        validity,
        cb: MyCourses,
    });

    function validity() {
        if (selectCourses.length <= 0) throw new Error("Please select one or more courses");
    }

    async function authUser() {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_BASEURL}/authUser`, {
                credentials: "include",
            });
            if (res.status !== 200) throw Error("Not authentic user");

            setUser(await res.json());
        } catch (error) {
            setUser(false);
        }
    }

    function fetchCourses() {
        fetch(`${process.env.REACT_APP_API_BASEURL}/courses`)
            .then((res) => res.json())
            .then((courses) => {
                allCourses.current = courses;
                setAvailableCourses(courses);
                MyCourses();
            });
    }

    function resetCourseState(courses) {
        const notAddCourses = allCourses.current?.filter((course) => {
            return courses.every(({ id }) => id !== course.id);
        });
        if(!Array.isArray(notAddCourses)) return
        setAvailableCourses([...notAddCourses]);
        setSelectCourses((prev) => []);
        setMyCourses(courses);
    }

    function MyCourses() {
        fetch(`${process.env.REACT_APP_API_BASEURL}/myCourses`, { credentials: "include" })
            .then((res) => res.json())
            .then((courses) => {
                resetCourseState(courses);
            }).catch(err => {
                console.log(err)
            })
    }

    useLayoutEffect(() => {
        authUser();
        fetchCourses();
    }, []);

    function removeCourse(id) {
        fetch(`${process.env.REACT_APP_API_BASEURL}/myCourse/${id}`, {
            method: "delete",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((courses) => {
                resetCourseState(courses);
            });
    }

    let delay = 350;
    let doubleClick = 0;
    let timeoutId = null;
    function clickHandler(e) {
        doubleClick++;

        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            doubleClick = 0;
        }, delay);
        if (doubleClick < 2) return;

        const isDuration = e.target.getAttribute("data-duration");
        const courseId = isDuration === null ? e.target.getAttribute("data-course-id") : e.target.parentElement.getAttribute("data-course-id");
        removeCourse(courseId);
    }

    if (user === null) return <h2>Loading...</h2>;
    if (user === false) return <Navigate to="/login" state={{ userlogin: true }} replace={true} />;

    return (
        <div>
            <Nav admin={false} />
            <h2 style={{ width: "100%", textAlign: "center" }}>My Profile</h2>
            <div className="avatar-logo">
                <InputImage image={user?.avatar}></InputImage>
            </div>
            <div style={{ overflowX: "auto", padding: "1rem 0" }}>
                <table className="profile-table">
                    <tbody>
                        <tr>
                            <th>Email</th>
                            <td>{user.email}</td>
                        </tr>
                        <tr>
                            <th>Phone</th>
                            <td>{user.phone}</td>
                        </tr>
                        <tr>
                            <th>Password</th>
                            <td>{user.password}</td>
                        </tr>
                        <tr>
                            <th>department</th>
                            <td>{user.department}</td>
                        </tr>
                        <tr>
                            <th>Admin</th>
                            <td>{user.admin}</td>
                        </tr>
                        <tr>
                            <th>Your Courses</th>
                            <td>
                                {myCourses.length <= 0 ? (
                                    <span>No Courses</span>
                                ) : (
                                    myCourses.map(({ id, name }, i) => {
                                        let duration = allCourses.current?.find(({ id: _ }) => _ === id)?.duration;
                                        duration = duration && Number(duration) + 1;

                                        return (
                                            <span
                                                key={id + i.toString()}
                                                data-course-id={id}
                                                className="tab"
                                                style={{
                                                    textTransform: "capitalize",
                                                    margin: ".2rem",
                                                    fontSize: ".9rem",
                                                    display: "inline-block",
                                                }}
                                                onClick={clickHandler}
                                            >
                                                {name}
                                                <span style={{ fontSize: ".8rem", textTransform: "none" }} data-duration={duration}>
                                                    {duration && ` : ${duration} months`}
                                                </span>
                                            </span>
                                        );
                                    })
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {availableCourses.length > 0 && (
                <form
                    className="flex-container input-group relative"
                    style={{
                        paddingTop: ".5rem",
                        maxWidth: "1080px",
                        margin: "auto",
                    }}
                >
                    <div className={err[0] == "$" ? "sucess" : "error"}>
                        &nbsp;{err}&nbsp;
                        {!err && <>&nbsp;</>}
                    </div>
                    <li className="flex-item1" style={{ fontWeight: "bold" }}>
                        Courses
                    </li>
                    <li className="flex-item2">
                        <MultipleSelect
                            ref={domRef}
                            title={"Select courses you like one"}
                            data={availableCourses}
                            select={selectCourses}
                            setSelect={setSelectCourses}
                        >
                            <button
                                style={{
                                    position: "absolute",
                                    top: "100%",
                                    zIndex: -1,
                                }}
                                onClick={submitHandler}
                                type="submit"
                            >
                                Add Courses
                            </button>
                        </MultipleSelect>
                    </li>
                </form>
            )}
        </div>
    );
};

export default UserHomePage;
