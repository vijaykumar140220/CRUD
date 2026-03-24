import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  addUserRequest,
  editUserRequest,
  resetUserResponse,
} from "../Redux/Action";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AddPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, addUserResponse, editUserResponse, error } =
    useSelector((state) => state.user);

  const userToEdit = location.state?.userToEdit || null;

  const formik = useFormik({
    initialValues: {
      pxeSerialNumber: userToEdit?.pxeSerialNumber || "",
      date: userToEdit?.date || "",
      transactionType: userToEdit?.transactionType || "",
      from: userToEdit?.from || "",
      to: userToEdit?.to || "",
      reason: userToEdit?.reason || "",
      serviceState: userToEdit?.serviceState || "",
      remarks: userToEdit?.remarks || "",
    },

    validationSchema: Yup.object({
      pxeSerialNumber: Yup.string().required("Required"),
      date: Yup.string().required("Required"),
      transactionType: Yup.string().required("Required"),
      from: Yup.string().required("Required"),
      to: Yup.string().required("Required"),
      reason: Yup.string().required("Required"),
      serviceState: Yup.string().required("Required"),
      // remarks: Yup.string().required("Required"),
    }),

    enableReinitialize: true,

    onSubmit: (values) => {
      if (userToEdit) {
        dispatch(editUserRequest({ ...values, id: userToEdit._id }));
      } else {
        dispatch(addUserRequest(values));
      }
    },
  });

  useEffect(() => {
    if (addUserResponse) {
      toast.success("Successfully Added!");
      formik.resetForm(); // Clears all input fields
      dispatch(resetUserResponse());
    } else if (editUserResponse) {
      toast.success("Successfully Updated!");
      dispatch(resetUserResponse());
    }
  }, [addUserResponse, editUserResponse, dispatch]);

  return (
    <div className="main-wrapper py-5 min-vh-100">

      <div className="container">
        <div className="row justify-content-center">
          <div className="vijay">
            <div className="card custom-card shadow-lg border-0">
              
              {/* HEADER */}
              <div className="card-header bg-white border-bottom p-4 d-flex justify-content-between align-items-center">
                <h3 className="mb-0 fw-bold text-primary">
                  {userToEdit ? "✏️ Edit PXE Details" : "➕ Add PXE Details"}
                </h3>
                <button
                  className="btn btn-outline-secondary btn-sm px-4 rounded-pill"
                  onClick={() => navigate("/")}
                >
                  ⬅ View List
                </button>
              </div>

              {/* FORM */}
              <div className="card-body">
                <form onSubmit={formik.handleSubmit}>
                  
                  {/* ROW 1: SERIAL, DATE (ONLY), TRANSACTION TYPE */}
                  <div className="row g-3 mb-4">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">PXE Serial Number</label>
                      <input
                        type="text"
                        name="pxeSerialNumber"
                        className={`form-control ${formik.touched.pxeSerialNumber && formik.errors.pxeSerialNumber ? 'is-invalid' : ''}`}
                        placeholder="Enter Serial..."
                        onChange={formik.handleChange}
                        value={formik.values.pxeSerialNumber}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Date</label>
                      <input
                        type="date" // CHANGED: Now only Date selection
                        name="date"
                        className={`form-control ${formik.touched.date && formik.errors.date ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.date}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Transaction Type</label>
                      <select
                        name="transactionType"
                        className={`form-select ${formik.touched.transactionType && formik.errors.transactionType ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.transactionType}
                      >
                        <option value="">Select Type</option>
                        <option value="ISSUE">ISSUE</option>
                        <option value="RECEIPT">RECEIPT</option>
                        <option value="OTHERS">OTHERS</option>
                      </select>
                    </div>
                  </div>

                  {/* ROW 2: FROM AND TO */}
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">From</label>
                      <input
                        type="text"
                        name="from"
                        className={`form-control ${formik.touched.from && formik.errors.from ? 'is-invalid' : ''}`}
                        placeholder="Source Location"
                        onChange={formik.handleChange}
                        value={formik.values.from}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">To</label>
                      <input
                        type="text"
                        name="to"
                        className={`form-control ${formik.touched.to && formik.errors.to ? 'is-invalid' : ''}`}
                        placeholder="Destination Location"
                        onChange={formik.handleChange}
                        value={formik.values.to}
                      />
                    </div>
                  </div>

                  {/* ROW 3: REASON AND SERVICEABILITY */}
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Reason</label>
                      <input
                        type="text"
                        name="reason"
                        className={`form-control ${formik.touched.reason && formik.errors.reason ? 'is-invalid' : ''}`}
                        placeholder="Reason for transaction"
                        onChange={formik.handleChange}
                        value={formik.values.reason}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Serviceability State</label>
                      <select
                        name="serviceState"
                        className={`form-select ${formik.touched.serviceState && formik.errors.serviceState ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.serviceState}
                      >
                        <option value="">Select State</option>
                        <option value="SERVICEABLE">SERVICEABLE</option>
                        <option value="UN-SERVICEABLE">UN-SERVICEABLE</option>
                      </select>
                    </div>
                  </div>

                  {/* ROW 4: REMARKS */}
                  <div className="mb-5">
                    <label className="form-label fw-semibold">Remarks</label>
                    <textarea
                      name="remarks"
                      className={`form-control ${formik.touched.remarks && formik.errors.remarks ? 'is-invalid' : ''}`}
                      rows="2"
                      placeholder="Add any additional notes..."
                      onChange={formik.handleChange}
                      value={formik.values.remarks}
                    />
                  </div>

                  {/* BUTTONS */}
                  <div className="row g-3">
                    <div className="col-md-6">
                      <button type="submit" className="btn btn-primary w-100 py-3 rounded-3 btn-hover shadow-sm">
                        {loading ? (
                          <span className="spinner-border spinner-border-sm me-2"></span>
                        ) : null}
                        {userToEdit ? "Update Details" : "Save Details"}
                      </button>
                    </div>
                    <div className="col-md-6">
                      <button
                        type="button"
                        className="btn btn-light w-100 py-3 rounded-3 btn-hover border shadow-sm"
                        onClick={() => formik.resetForm()} // Clears all inputs manually
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                  {/* ERROR DISPLAY */}
                  {error && (
                    <div className="alert alert-danger mt-4 text-center border-0 shadow-sm">
                      {typeof error === "object" ? error.message : JSON.stringify(error)}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPage;