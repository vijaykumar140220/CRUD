import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { addUserRequest, editUserRequest, resetUserResponse } from '../Redux/Action'; 
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import './Addpage.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const AddPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, addUserResponse, editUserResponse, error } = useSelector((state) => state.user);

  const userToEdit = location.state?.userToEdit || null;

  const formik = useFormik({
    initialValues: {
      name: userToEdit ? userToEdit.name : '',
      age: userToEdit ? userToEdit.age : '',
      city: userToEdit ? userToEdit.city : '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      age: Yup.number().required('Age is required').positive().integer(),
      city: Yup.string().required('City is required'),
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
      formik.resetForm();
      toast.success('Successfully Added!');
      navigate('/');
      dispatch(resetUserResponse());
    } else if (editUserResponse) {
      toast.success('Successfully Edited!');
      navigate('/');
      dispatch(resetUserResponse());
    } else if (error) {
      console.log('Error occurred:', error);
    }
  }, [addUserResponse, editUserResponse, error, navigate]);

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <h2 className="heading text-center mb-4">{userToEdit ? 'Edit User' : 'Add User'}</h2>
        <form onSubmit={formik.handleSubmit} className="form">
          <div className="form-group mb-3">
            <label className="label">Name</label>
            <input
              type="text"
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className="form-control"
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="text-danger mt-2">{formik.errors.name}</div>
            ) : null}
          </div>
          <div className="form-group mb-3">
            <label className="label">Age</label>
            <input
              type="number"
              name="age"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.age}
              className="form-control"
            />
            {formik.touched.age && formik.errors.age ? (
              <div className="text-danger mt-2">{formik.errors.age}</div>
            ) : null}
          </div>
          <div className="form-group mb-3">
            <label className="label">City</label>
            <input
              type="text"
              name="city"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.city}
              className="form-control"
            />
            {formik.touched.city && formik.errors.city ? (
              <div className="text-danger mt-2">{formik.errors.city}</div>
            ) : null}
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary w-100">
            {loading ? 'Saving...' : userToEdit ? 'Update User' : 'Add User'}
          </button>
        </form>
        {error && (
          <p className="text-danger text-center mt-3">Error: {typeof error === 'object' && error.message ? error.message : JSON.stringify(error)}</p>
        )}
      </div>
    </div>
  );
};

export default AddPage;
