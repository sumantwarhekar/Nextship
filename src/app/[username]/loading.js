export default function Loading() {
  return (
    <div className="container">
      <div className="loading-user-profile">
        <div className="loading-avatar"></div>
        <div className="loading-text">
          <div className="loading-line"></div>
          <div className="loading-line short"></div>
        </div>
      </div>
      <p>Loading user profile...</p>
    </div>
  );
}