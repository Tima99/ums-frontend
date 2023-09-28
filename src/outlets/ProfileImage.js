import React from "react";
import { RiCloseCircleFill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import useBackShortCut from "../hooks/useBackShortCut";

const ProfileImage = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    useBackShortCut();

    function Back() {
        navigate(-1);
    }

    return (
        <div
            className="abs top-0 full-display bg-shadow flex center"
            style={{
                backdropFilter: "blur(2px)",
                background: "rgba(0, 0, 0, 0.75)",
            }}
        >
            <div
                className="card flex-col"
                style={{
                    background: "transparent",
                    flexDirection: "column-reverse",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <div className="head flex between pd-h-1">
                    <div className="title"></div>
                    <RiCloseCircleFill
                        className="icon"
                        onClick={Back}
                        style={{ fontSize: "2rem", color: "#b95c5c", opacity: ".9", marginTop: ".75rem" }}
                    />
                </div>
                <img
                    src={`${process.env.REACT_APP_BASEURL}/${state}`}
                    alt=""
                    style={{
                        width: "65vmin",
                        filter: "drop-shadow(2px 4px 6px #111)",
                    }}
                />
            </div>
        </div>
    );
};

export default ProfileImage;
