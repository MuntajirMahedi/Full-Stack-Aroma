import React, { useEffect, useState } from "react";
import api from "../api";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/api/user/me");
        setProfile(res.data);
      } catch (err) {
        setError(err.response?.data?.msg || err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading)
    return <div className="container"><p>Loading profile...</p></div>;
  if (error)
    return (
      <div className="container">
        <p style={{ color: "red" }}>Error: {error}</p>
      </div>
    );

  return (
    <section className="profile-page">
      <div className="container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  profile.name || "User"
                )}&background=4f46e5&color=fff&size=128`}
                alt="User Avatar"
              />
            </div>
            <div>
              <h2>{profile.name}</h2>
              <p className="muted">{profile.email}</p>
            </div>
          </div>

          <div className="profile-details">
            <h3>Account Details</h3>
            <table className="profile-table">
              <tbody>
                <tr>
                  <td><strong>Full Name</strong></td>
                  <td>{profile.name}</td>
                </tr>
                <tr>
                  <td><strong>Email Address</strong></td>
                  <td>{profile.email}</td>
                </tr>
                {profile.role && (
                  <tr>
                    <td><strong>Role</strong></td>
                    <td>{profile.role}</td>
                  </tr>
                )}
                {profile.createdAt && (
                  <tr>
                    <td><strong>Joined On</strong></td>
                    <td>{new Date(profile.createdAt).toLocaleDateString()}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* <div className="profile-actions">
            <button className="btn-primary">Edit Profile</button>
            <button className="btn-ghost">Change Password</button>
          </div> */}
        </div>
      </div>
    </section>
  );
}
