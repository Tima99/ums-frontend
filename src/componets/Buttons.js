import React from "react";
import { NavLink } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { downloadExcel} from 'react-export-table-to-excel';

const Buttons = ({ select, moveSelect, deleteRows, editRow, tableBody, selectedRows }) => {

  function handleExcelDownload(){
    const nameofExcelFile = prompt("Name of file", "users")
    if(nameofExcelFile === null || nameofExcelFile.trim().length <= 0 || tableBody.length <= 0) return
    downloadExcel({
      fileName: nameofExcelFile,
      sheet: "Users",
      tablePayload: {
        header: ["Email", "Phone", "Password", "Date", "Gender", "Department", "Courses"],
        body: tableBody
      }
    })
  }

  return (
    <>
      {select || moveSelect ? (
        <div className="edit-delete">
          <button
            className="delete"
            onClick={deleteRows}
            style={{ marginTop: 0 }}
          >
            Delete &nbsp; <AiOutlineDelete className="iconn" />
          </button>
          <button className="edit" onClick={editRow} style={{ marginTop: 0 }}>
            Edit &nbsp; <FiEdit className="iconn" />
          </button>
          <NavLink to={'/users/sendEmail'} state={selectedRows}>
            <button className="outline-btn">Send Email</button>
          </NavLink>
        </div>
      ) : (
        <div style={{ width: "100%", textAlign: "right" }}>
          <NavLink to={"/users/addUser"}>
            <button style={{ marginTop: 0 }}>Create User</button>
          </NavLink>

          <button onClick={handleExcelDownload} className="outline-btn">Download Excel</button>
        </div>
      )}
    </>
  );
};

export default Buttons;
