import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Outlet, Link, useOutletContext } from "react-router-dom";
import { RiCloseCircleFill } from "react-icons/ri";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useSubmitForm from "../hooks/useSubmitForm";

const Signature = () => {
    const navigate = useNavigate();
    const [signature, setSignature] = useState("");
    const [title, setSignatureTitle] = useState("");
    const { setSignatures, signatures } = useOutletContext();

    const [submitHandler, err, setErr] = useSubmitForm({
        apiRoute: `${process.env.REACT_APP_API_BASEURL}/signature`,
        $data: { signature, title },
        loadingText: "Saving...",
        btnText: "Submit",
        validity: () => {
            if (document.querySelector("#signature-form").checkValidity() && signature.length > 0) {
                if (signatures.some(({ title: signTitle }) => signTitle.toLowerCase() === title.toLowerCase()))
                    throw new Error("Provide unique title of signature!");
                return true;
            }
            throw new Error("All fields are required!");
        },
        cb: (data) => {
            setSignatures((prev) => [{ signature: "", title: "No Signature" }, ...data]);
        },
    });

    return (
        <div
            className="abs top-0 left-0 full-display flex center"
            id="signature-main-container"
            style={{ zIndex: 999999999, translate: "1rem -1rem" }}
        >
            <div className="card shadow" style={{ translate: "0 -1rem" }}>
                <div className="head flex between pd-h-1">
                    <div className="title">Signature</div>
                    <RiCloseCircleFill className="icon" onClick={(e) => navigate(-1)} />
                </div>

                <form action="" className="flex-col card" id="signature-form">
                    <div className={err[0] == "$" ? "sucess" : "error"}>
                        &nbsp;{err}&nbsp;
                        <span
                            className="close-error"
                            onClick={() => {
                                setErr("");
                            }}
                        ></span>
                    </div>
                    <div style={{ width: "auto", paddingBottom: ".5rem" }} className="flex center">
                        <input
                            required
                            type="text"
                            name="title"
                            id="signature-title"
                            value={title}
                            onChange={(e) => setSignatureTitle(e.target.value)}
                            placeholder={"Signature Title"}
                            autoFocus
                        />
                    </div>

                    <div className="flex center gap-1" style={{ width: "auto" }}>
                        <ReactQuill
                            theme="snow"
                            name="text"
                            value={signature}
                            onChange={setSignature}
                            style={{
                                maxWidth: "600px",
                                width: "100%",
                            }}
                            formats={[
                                "size",
                                "bold",
                                "italic",
                                "underline",
                                "list",
                                "bullet",
                                "align",
                                "color",
                                "background",
                                "image",
                                "link"
                            ]}
                            modules={{
                                toolbar: [
                                    [{ size: ["small", false, "large", "huge"] }],
                                    ["bold", "italic", "underline"],
                                    [{ list: "ordered" }, { list: "bullet" }],
                                    [{ align: [] }],
                                    [{ color: [] }, { background: [] }],
                                    ["image", "link"]
                                ],
                            }}
                        />
                    </div>

                    <div className="flex center">
                        <button onClick={submitHandler}>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signature;
