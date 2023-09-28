import React, { useLayoutEffect, useReducer, useState } from "react";

const reducer = (state, action) => {
    switch (action.type) {
        case "UPLOAD":
            return { ...state, file: action.file, show: true };
        case "RESET":
            return { ...state, file: state.default, show: false };
        case 'DEFAULT':
            return { ...state, default: action.filename, show: false}
        default:
            return state;
    }
};

const InputImage = ({ image=null }) => {
    const DefaultImage = 'avatar.png'

    const [avatar, dispatch] = useReducer(reducer, { file: null, default: image ? image : DefaultImage, show: false  });
    const [logo, setLogo] = useState(image ? image : DefaultImage );

    useLayoutEffect(() => {
        let reader = new FileReader();
        reader.onloadend = function () {
            const base64 = reader.result;
            setLogo(base64);
        };
        if (avatar.file === avatar.default && !(avatar.file instanceof Blob)) {
            setLogo((prev) => avatar.default);
        } else if (avatar.file instanceof Blob) {
            reader.readAsDataURL(avatar.file);
        }

        //  read the binary data and encode it as base64 data url.
    }, [avatar]);

    function Save(e){
        e.preventDefault()
        const form = new FormData()

        form.append('avatar', avatar.file)

        fetch(`${process.env.REACT_APP_API_BASEURL}/upload/avatar`, {
            method: 'POST',
            body: form,
            credentials: 'include',
        })
        .then(res => res.json())
        .then(({filename}) => dispatch({type: 'DEFAULT', filename}))
    }

    return (
        <form onReset={(e) => {
            dispatch({type: 'RESET'})
        }}>
            <input
                type="file"
                name="avatar"
                onChange={(e) => {
                    dispatch({ type: "UPLOAD", file: e.target.files[0] });
                }}
                id="user-avatar"
                className="dis-none"
                accept="image/*"
            />
            <div className="flex-col center">
                <label htmlFor="user-avatar">
                    <img
                        src={logo?.includes('data')? logo : `${process.env.REACT_APP_BASEURL}/${logo}`}
                        alt="logo"
                        width={"60vmin"}
                        className="pointer"
                        style={{
                            filter: "opacity(.8)",
                        }}
                    />
                </label>
                {avatar.show && (
                    <div
                        className="flex"
                        style={{
                            width: "100%",
                            justifyContent: "flex-end",
                        }}
                    >
                        <label htmlFor="reset-btn"
                            style={{
                                fontWeight: 'normal'
                            }}
                            className='label-as-btn outline-btn'
                        >
                                Reset
                        </label>
                        <button onClick={Save}>Save</button>
                    </div>
                )}
            </div>
            <input type="reset" value="Reset" id="reset-btn" className="dis-none"/>
        </form>
    );
};

export default InputImage;
