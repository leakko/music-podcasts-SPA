import { Link, Outlet } from "react-router-dom";

const DefaultLayout = () => { 
    return (
      <div>
        <nav style={{ display: "flex", gap: "8px" }}>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/404">404</Link>
        </nav>
        <main>
          <Outlet />
        </main>
      </div>
    );
}
  

export default DefaultLayout;