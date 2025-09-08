import React from 'react';
import '../css/Register.css';

const Register = () => {
  return (
    <div className="register-container">
      <h2>Register</h2>
      <form>
        <div className="form-group">
          <label>Name</label>
          <input type="text" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
