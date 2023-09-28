import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { RiCloseCircleFill } from "react-icons/ri";
import { GrFormClose } from "react-icons/gr";
import { useLocation, useNavigate, Outlet, Link } from "react-router-dom";
import useSubmitForm from "../hooks/useSubmitForm";
import useBackShortCut from "../hooks/useBackShortCut";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import FullscreenIcon from "../componets/FullscreenIcon";

const SendEmail = () => {
    const { state: selectedEmails } = useLocation();

    const [userData, setUserData] = useState({
        subject: "",
        to: selectedEmails,
    });
    const [signatures, setSignatures] = useState([]);
    const [text, setText] = useState("");
    const [selectedSignature, setSelectedSignature] = useState(0);
    const navigate = useNavigate();
    const editorRef = useRef();
    const [submitHandler, err, setErr] = useSubmitForm({
        apiRoute: `${process.env.REACT_APP_API_BASEURL}/sendEmail`,
        $data: { ...userData, text },
        loadingText: "Please Wait! Sending...",
        btnText: "Send Email",
        validity: () => {
            if (userData.subject.length <= 0) {
                document.getElementById("email-subject").focus();
                throw new Error("Subject of email is required");
            }
            if (editorRef.current.editor.container.innerText.replace(/<(.|\n)*?>/g, "").trim().length <= 0) {
                editorRef.current.editor.focus();
                throw new Error("Body of email cannot be empty");
            }
        },
    });

    // console.log(text)

    useBackShortCut();

    function Back() {
        navigate(-1);
    }

    useLayoutEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASEURL}/signature`, { credentials: "include" })
            .then((res) => res.json())
            .then((sig) => {
                setSignatures((prev) => [{ signature: "", title: "No Signature" }, ...sig]);
                setText("");
            });
    }, []);

    useEffect(() => {
        const form = document.querySelector("form");
        const toogleClass = () => {
            form.classList.toggle("fullscreen");
        };
        form.addEventListener("fullscreenchange", toogleClass);

        return () => {
            form.removeEventListener("fullscreenchange", toogleClass);
        };
    }, []);

    function inputChangeHandler(e) {
        setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    return (
        <div className="abs top-0 full-display bg-shadow flex center" id="email-main-container">
            <div className="card">
                <div className="head flex between pd-h-1">
                    <div className="title">Send Email</div>
                    <RiCloseCircleFill className="icon" onClick={Back} />
                </div>

                <form className="card flex-col" id="email-send-form">
                    <div className={err[0] == "$" ? "sucess" : "error"}>
                        &nbsp;{err}&nbsp;
                        <span
                            className="close-error"
                            onClick={() => {
                                setErr("");
                            }}
                        ></span>
                    </div>

                    <div>
                        <label htmlFor="email-to-send">
                            Send Email<span style={{ fontSize: ".75rem" }}>(s)</span> to
                        </label>
                        <div className="input-container">
                            {selectedEmails?.map((email) => (
                                <span className="tab" key={email}>
                                    {email}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email-subject">Subject</label>
                        <input
                            type="text"
                            name="subject"
                            id="email-subject"
                            required
                            placeholder="Subject"
                            value={userData.subject}
                            onChange={inputChangeHandler}
                        />
                    </div>

                    <div className="email-body">
                        <div id="first-col-label-contain" className="flex-col" style={{ flex: "0.25", gap: ".5rem" }}>
                            <label htmlFor="email-body" style={{ flex: 0, gap: ".5rem" }} className="relative flex">
                                Body
                                <div
                                    style={{ cursor: "pointer", bottom: 0 }}
                                    id="go-to-fullscreen"
                                    onClick={async (e) => {
                                        const form = document.querySelector("form");
                                        if (document.fullscreenElement) {
                                            return document.exitFullscreen();
                                        }
                                        await form.requestFullscreen();
                                    }}
                                >
                                    <FullscreenIcon></FullscreenIcon>
                                </div>
                            </label>
                            <select
                                name="signatures"
                                id="email-signatures"
                                onChange={(e) => {
                                    if (e.target.selectedIndex === signatures.length) return navigate("/users/sendEmail/signature");
                                    setText((prev) => {
                                        return e.target.selectedIndex === signatures.length ? "" : signatures[e.target.selectedIndex]?.signature;
                                    });
                                    setSelectedSignature((prev) => e.target.selectedIndex);
                                }}
                                value={selectedSignature === signatures.length ? "" : selectedSignature}
                            >
                                {signatures?.map((sign, i) => {
                                    return (
                                        <option value={i} data-value={sign.signature} key={sign.title}>
                                            {" "}
                                            {sign.title || `Signature ${i}`}
                                        </option>
                                    );
                                })}
                                <option value="">New Signature</option>
                            </select>
                        </div>
                        <ReactQuill
                            theme="snow"
                            name="text"
                            value={text}
                            // html={text}
                            onChange={setText}
                            ref={editorRef}
                            formats={["size", "bold", "italic", "underline", "list", "bullet", "align", "color", "background", 'image', 'link' ]}
                            modules={{
                                toolbar: [
                                  [{ size: ["small", false, "large", "huge"] }],
                                  ["bold", "italic", "underline"],
                                  [{ list: "ordered" }, { list: "bullet" }],
                                  [{ align: [] }],
                                  [{ color: [] }, { background: [] }],
                                  ['image', "link"],
                                  // ['attachment']
                                ],
                            }}
                        />
                    </div>
                    <button onClick={submitHandler}>Send Email</button>
                </form>
            </div>

            <Outlet context={{ setSignatures, signatures }}></Outlet>
        </div>
    );
};

export default SendEmail;
