
function Navbar({ user, onLogout }) {
    const initials = user?.name
        ? user.name
            .trim()
            .split(/\s+/)
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        : "U";

    return (
        <nav className="navbar">
            <h2>✦ TaskFlow</h2>
            <span>Manage your daily tasks</span>

            <div className="navbar-right">
                <div className="navbar-user">
                    <div className="navbar-avatar">
                        {initials}
                    </div>

                    <div className="navbar-user-info">
                        <strong>{user?.name || "User"}</strong>
                        <small>Personal workspace</small>
                    </div>
                </div>

                <button
                    type="button"
                    className="logout-btn"
                    onClick={onLogout}
                >
                    ↪ Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
