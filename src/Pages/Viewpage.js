import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsersRequest, deleteUserRequest, resetUserResponse } from '../Redux/Action';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Viewpage.css';

const ViewPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, users, deleteUserResponse } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUsersRequest());
  }, [dispatch]);

  const Edit = (user) => {
    navigate('/add', { state: { userToEdit: user } });
  };

  const Delete = (id) => {
    dispatch(deleteUserRequest(id));
  };

  useEffect(() => {
    if (deleteUserResponse) {
      toast.success('Successfully Deleted!');
      dispatch(fetchUsersRequest());
      dispatch(resetUserResponse());
    }
  }, [deleteUserResponse, dispatch]);

  return (
    <div className="containers mt-5">
      <h2 className="text-center mb-4">User List</h2>
      <button
        className="btn btn-primary mb-4"
        onClick={() => navigate('/add')}
      >
        ADD NEW
      </button>
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-danger">Error: {error}</p>}
      {!loading && users.length === 0 && <p className="text-center">No users found.</p>}
      {users.length > 0 && (
        <div className="table-responsive">
          <table className="table table-hover table-bordered">
            <thead className="table-dark">
              <tr>
                <th scope="col">S.No</th>
                <th scope="col">Name</th>
                <th scope="col">Age</th>
                <th scope="col">City</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{user.name}</td>
                  <td>{user.age}</td>
                  <td>{user.city}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() => Edit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => Delete(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewPage;
