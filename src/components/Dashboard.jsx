import { FaUserCircle } from "react-icons/fa"; // user icon
import { Link } from "react-router-dom";       // for navigation

export default function Dashboard() {
  return (
    <div className="container mt-4">
      {/* Header: title centered, icon on right */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        {/* Invisible spacer to balance layout */}
        <div style={{ width: "40px" }}></div>

        {/* Centered page title */}
        <h2 className="text-center flex-grow-1 m-0">Dashboard</h2>

        {/* Settings icon on the right */}
        <Link to="/settings" className="text-dark">
          <FaUserCircle size={40} />
        </Link>
      </div>

        {/* Main content area */}
      
    </div>
  );
}
