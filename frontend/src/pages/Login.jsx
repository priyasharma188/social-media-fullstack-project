import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      alert("Please fill in both email and password.");
      return;
    }

    navigate("/feed");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-5 mx-auto mt-5">

          <div className="card shadow p-4 rounded border  border-dark bg-light" style={{width: "350px"}}>
            <h2 className="text-center mb-4">Login</h2>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email: </label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <br/>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label">Password:</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <br/>

            {/* Button */}
            <button
              className="btn btn-primary w-100"
              onClick={handleLogin}
            >
              Login
            </button>

            {/* Link */}
            <p className="text-center mt-3">
              Do not have an account?{" "}
              <Link to="/signup">Register here</Link>
            </p>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;