import { Link } from "react-router-dom";

export default function Sidebar() {

  return (
    <div
      className="bg-dark text-white p-3"
      style={{
        width: "250px",
        minHeight: "100vh"
      }}
    >
      {/* <h4>Tracker Admin</h4> */}
      {/* <a href="/dashboard" className="text-heading">Tracker Admin</a>
       */}



<h2>
    <Link to="/dashboard" className="text-heading text-decoration-none">
        Tracker Admin
    </Link>
</h2>
      

      <hr />

      <ul className="nav flex-column">

        {/* <li className="nav-item">
          <Link
            className="nav-link text-white"
            to="/dashboard">
            Dashboard
          </Link>
        </li> */}

        <li className="nav-item">
          <Link
            className="nav-link text-white"
            to="/users">
            Users
          </Link>
        </li>

       {/*  <li className="nav-item">
          <Link
            className="nav-link text-white"
            to="/devices">
            Devices
          </Link>
        </li>

        <li className="nav-item">
          <Link
            className="nav-link text-white"
            to="/processes">
            Processes
          </Link>
        </li>

        <li className="nav-item">
          <Link
            className="nav-link text-white"
            to="/windows">
            Windows
          </Link>
        </li>

        <li className="nav-item">
          <Link
            className="nav-link text-white"
            to="/idle">
            Idle Activities
          </Link>
        </li> */}

      </ul>
    </div>
  );
}