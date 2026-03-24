import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsersRequest,
  deleteUserRequest,
  resetUserResponse,
} from "../Redux/Action";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Viewpage.css";

const ViewPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { loading, users, deleteUserResponse } = useSelector(
    (state) => state.user
  );

  const [filters, setFilters] = useState({
    serial: "",
    date: "",
    type: "",
    to: "",
    state: "",
  });

  useEffect(() => {
    dispatch(fetchUsersRequest());
  }, [dispatch]);

  useEffect(() => {
    if (deleteUserResponse) {
      toast.success("Record deleted successfully!");
      dispatch(fetchUsersRequest());
      dispatch(resetUserResponse());
    }
  }, [deleteUserResponse, dispatch]);

  // Helper function to format date as DD-MM-YYYY
  const formatDateToDisplay = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const exportToExcel = () => {
    if (filteredUsers.length === 0) {
      toast.error("No data available to export");
      return;
    }
    const exportData = filteredUsers.map(({ _id, __v, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PXE_Inventory");
    XLSX.writeFile(workbook, `PXE_Export_${new Date().toLocaleDateString()}.xlsx`);
  };

  const handleEdit = (user) => {
    navigate("/add", { state: { userToEdit: user } });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      dispatch(deleteUserRequest(id));
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const getTypeBadge = (type) => {
    const style = {
      padding: "4px 12px",
      borderRadius: "6px",
      fontSize: "0.75rem",
      fontWeight: "bold",
      color: "white",
      display: "inline-block",
      backgroundColor: type === "ISSUE" ? "#00bad1" : "#f1a500",
      textTransform: "capitalize" // Ensures badge text is also capitalized
    };
    return <span style={style}>{type?.toLowerCase()}</span>;
  };

  const getStateBadge = (state) => {
    const isServiceable = state === "SERVICEABLE";
    const style = {
      padding: "4px 12px",
      borderRadius: "6px",
      fontSize: "0.75rem",
      fontWeight: "bold",
      color: "white",
      display: "inline-block",
      backgroundColor: isServiceable ? "#28a745" : "#dc3545",
      textTransform: "capitalize"
    };
    return <span style={style}>{state?.toLowerCase()}</span>;
  };

  // ✅ SORTING LOGIC: Ascending order by PXE Serial Number
  const sortedUsers = [...users].sort((a, b) => {
    const serialA = a.pxeSerialNumber || "";
    const serialB = b.pxeSerialNumber || "";
    return serialA.localeCompare(serialB, undefined, { numeric: true, sensitivity: 'base' });
  });

  const filteredUsers = sortedUsers.filter((user) => {
    const matchSerial = user.pxeSerialNumber?.toLowerCase().includes(filters.serial.toLowerCase());
    const matchDate = filters.date ? user.date?.split("T")[0] === filters.date : true;
    const matchType = filters.type ? user.transactionType === filters.type : true;
    const matchTo = user.to?.toLowerCase().includes(filters.to.toLowerCase());
    const matchState = filters.state ? user.serviceState === filters.state : true;
    return matchSerial && matchDate && matchType && matchTo && matchState;
  });

  const handleImportExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary", cellDates: true });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawData = XLSX.utils.sheet_to_json(ws);

        const formattedData = rawData.map((item, index) => {
          let rawDate = item["Date & Time"] || item["Date"] || item["date"];
          if (!rawDate) throw new Error(`Row ${index + 1}: Date column is missing.`);

          const d = new Date(rawDate);
          if (isNaN(d.getTime())) throw new Error(`Row ${index + 1}: Invalid date format.`);

          const dateOnly = d.toISOString().split('T')[0];

          return {
            date: dateOnly,
            pxeSerialNumber: String(item["PXE Serial Number"] || item["pxeSerialNumber"] || ""),
            transactionType: String(item["Transaction Type"] || item["transactionType"] || ""),
            from: String(item["From"] || item["from"] || ""),
            to: String(item["To"] || item["to"] || ""),
            reason: String(item["Reason"] || item["reason"] || "Bulk Import"),
            serviceState: String(item["Service State"] || item["serviceState"] || "SERVICEABLE"),
            remarks: String(item["Remarks"] || item["remarks"] || ""),
          };
        });

        const response = await fetch('http://localhost:5000/crud-operations/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formattedData),
        });

        if (response.ok) {
          toast.success(`${formattedData.length} records imported!`);
          dispatch(fetchUsersRequest());
        } else {
          const errorText = await response.text();
          throw new Error(errorText || "Server rejected data.");
        }
      } catch (err) {
        toast.error(`Import Error: ${err.message}`);
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = null;
  };

  return (
    <div className="container-fluid px-4 py-5" style={{ background: "#f8f9fa", minHeight: "100vh" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark m-0">PXE Inventory List</h2>
        <div className="d-flex gap-2">
          <input type="file" ref={fileInputRef} hidden accept=".xlsx, .xls" onChange={handleImportExcel} />
          <button className="btn btn-warning shadow-sm fw-bold" onClick={() => fileInputRef.current.click()}>Import Excel</button>
          <button className="btn btn-primary px-4 shadow-sm fw-bold" onClick={() => navigate("/add")}>+ ADD NEW PXE</button>
          <button className="btn btn-success px-4 shadow-sm fw-bold" onClick={exportToExcel}>Export Excel</button>
        </div>
      </div>

      <div className="search-card mb-4 p-3 bg-white rounded shadow-sm">
        <div className="row g-3">
          <div className="col-md-3">
            <label className="filter-label">Serial Number</label>
            <input name="serial" className="form-control" placeholder="Search..." value={filters.serial} onChange={handleFilterChange} />
          </div>
          <div className="col-md-2">
            <label className="filter-label">Filter Date</label>
            <input type="date" name="date" className="form-control" value={filters.date} onChange={handleFilterChange} />
          </div>
          <div className="col-md-2">
            <label className="filter-label">Type</label>
            <select name="type" className="form-select" value={filters.type} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="ISSUE">ISSUE</option>
              <option value="RECEIPT">RECEIPT</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="filter-label">To</label>
            <input name="to" className="form-control" placeholder="Destination..." value={filters.to} onChange={handleFilterChange} />
          </div>
          <div className="col-md-2">
            <label className="filter-label">State</label>
            <select name="state" className="form-select" value={filters.state} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="SERVICEABLE">SERVICEABLE</option>
              <option value="UN-SERVICEABLE">UN-SERVICEABLE</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-container bg-white rounded shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 custom-table">
            <thead>
              <tr className="text-center">
                <th className="ps-4">S.No</th>
                <th>Date</th>
                <th>PXE Serial Number</th>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>State</th>
                <th>Remarks</th>
                <th className="pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="9" className="text-center py-4">Loading...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan="9" className="text-center py-4 text-muted">No records match.</td></tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user._id || index} className="text-center">
                    <td className="ps-4 fw-bold">{index + 1}</td>
                    <td>{formatDateToDisplay(user.date)}</td>
                    <td className="fw-semibold text-primary">{user.pxeSerialNumber}</td>
                    {/* Applied text-capitalize class below */}
                    <td className="text-capitalize">{getTypeBadge(user.transactionType)}</td>
                    <td className="text-capitalize">{user.from}</td>
                    <td className="text-capitalize">{user.to}</td>
                    <td className="text-capitalize">{getStateBadge(user.serviceState)}</td>
                    <td className="text-capitalize">{user.remarks}</td>
                    <td className="pe-4">
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(user)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(user._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewPage;