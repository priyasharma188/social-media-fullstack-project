 import { Link } from 'react-router-dom';
 import { useState } from 'react';

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSignup = () => {
    console.log(email, password, username);
    setEmail("");
    setPassword("");
    setUsername("");
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-5 mx-auto mt-5">

          <div className="card shadow p-4 rounded border border-dark" style={{width: "350px"}}>

            <h2 className="text-center mb-4">Signup</h2>

            {/* Username */}
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Button */}
            <button
              className="btn btn-primary w-100"
              onClick={handleSignup}
            >
              Signup
            </button>

            {/* Link */}
            <p className="text-center mt-3">
              Already have an account?{" "}
              <Link to="/">Login here</Link>
            </p>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Signup;