import React, { useState, useEffect } from "react";

export interface UserInstance {
  id: number;
  username: string;
  email: string;
  password: string;
  avatar: string | null;
  age: number | null;
  firstName: string | null;
  lastName: string | null;
  country: string | null;
  region: string | null;
  language: string | null;
  onlineStatus: boolean;
  biography: string | null;
  socialLinks: string[] | null;
  role: string;
  registrationDate: Date;
  lastLoginDate: Date | null;
  notifications: boolean;
}

interface ProfileComponentProps {
  user: UserInstance;
  onUpdate: (updatedUser: UserInstance) => void;
}

const ProfileComponent: React.FC<ProfileComponentProps> = ({ user, onUpdate }) => {
  const [currentTab, setCurrentTab] = useState<"editing" | "preview">("editing");
  const [formData, setFormData] = useState({
    username: user.username || "",
    email: user.email || "",
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    age: user.age?.toString() || "",
    country: user.country || "",
    region: user.region || "",
    language: user.language || "",
    biography: user.biography || "",
    socialLinks: user.socialLinks ? user.socialLinks.join(", ") : "",
    notifications: user.notifications,
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      username: user.username || "",
      email: user.email || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      age: user.age?.toString() || "",
      country: user.country || "",
      region: user.region || "",
      language: user.language || "",
      biography: user.biography || "",
      socialLinks: user.socialLinks ? user.socialLinks.join(", ") : "",
      notifications: user.notifications,
    });
    fetchAvatarUrl(user.avatar);
  }, [user]);

  const fetchAvatarUrl = (avatarFilename: string | null) => {
    console.log(avatarFilename)
    if (avatarFilename) {
      const token = localStorage.getItem("token");
      fetch(`http://localhost:3003/user/avatar/${avatarFilename}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.blob())
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          setAvatarUrl(url);
        })
        .catch((error) => console.error("Error fetching avatar:", error));
    }
  };

  const handleUpdateProfile = () => {
    const updatedUser = {
      ...user,
      ...formData,
      age: formData.age ? Number(formData.age) : null,
      socialLinks: formData.socialLinks ? formData.socialLinks.split(",").map(link => link.trim()) : null,
    };

    fetch(`http://localhost:3003/user/${user.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    })
      .then((response) => response.json())
      .then((data) => {
        onUpdate(data.user);
        if (avatar) {
          uploadAvatar(user.id, avatar);
        }
      })
      .catch((error) => console.error("Error updating profile:", error));
  };

  const uploadAvatar = (userId: number, avatarFile: File) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, please log in first.");
      return;
    }

    const avatarFormData = new FormData();
    avatarFormData.append("file", avatarFile);

    fetch(`http://localhost:3003/user/avatar/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: avatarFormData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Avatar updated:", data);
      })
      .catch((error) => console.error("Error uploading avatar:", error));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [id]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  return (
    <div>
      <h3>My Profile</h3>
      <div className="tabs">
        <button onClick={() => setCurrentTab("editing")} className={currentTab === "editing" ? "active" : ""}>
          Editing
        </button>
        <button onClick={() => setCurrentTab("preview")} className={currentTab === "preview" ? "active" : ""}>
          Preview
        </button>
      </div>

      {currentTab === "editing" ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleUpdateProfile();
          }}
        >
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
          <br />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <br />
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
          />
          <br />
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
          />
          <br />
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            value={formData.age}
            onChange={handleInputChange}
          />
          <br />
          <label htmlFor="country">Country:</label>
          <input
            type="text"
            id="country"
            value={formData.country}
            onChange={handleInputChange}
          />
          <br />
          <label htmlFor="region">Region:</label>
          <input
            type="text"
            id="region"
            value={formData.region}
            onChange={handleInputChange}
          />
          <br />
          <label htmlFor="language">Language:</label>
          <input
            type="text"
            id="language"
            value={formData.language}
            onChange={handleInputChange}
          />
          <br />
          <label htmlFor="biography">Biography:</label>
          <textarea
            id="biography"
            value={formData.biography}
            onChange={handleInputChange}
          />
          <br />
          <label htmlFor="socialLinks">Social Links:</label>
          <input
            type="text"
            id="socialLinks"
            value={formData.socialLinks}
            onChange={handleInputChange}
          />
          <br />
          <label htmlFor="notifications">Notifications:</label>
          <input
            type="checkbox"
            id="notifications"
            checked={formData.notifications}
            onChange={handleInputChange}
          />
          <br />
          {avatarUrl && <img src={avatarUrl} alt="Avatar" width="100" />}
          <label htmlFor="avatar">Avatar:</label>
          <input
            type="file"
            id="avatar"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files ? e.target.files[0] : null)}
          />
          <br />
          <button type="submit">Update Profile</button>
        </form>
      ) : (
        <div className="profile-preview">
          <h4>Profile Preview</h4>
          <p><strong>Username:</strong> {formData.username}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>First Name:</strong> {formData.firstName}</p>
          <p><strong>Last Name:</strong> {formData.lastName}</p>
          <p><strong>Age:</strong> {formData.age}</p>
          <p><strong>Country:</strong> {formData.country}</p>
          <p><strong>Region:</strong> {formData.region}</p>
          <p><strong>Language:</strong> {formData.language}</p>
          <p><strong>Biography:</strong> {formData.biography}</p>
          <p><strong>Social Links:</strong> {formData.socialLinks}</p>
          <p><strong>Notifications:</strong> {formData.notifications ? "Enabled" : "Disabled"}</p>
          {avatarUrl && <img src={avatarUrl} alt="Avatar" width="100" />}
        </div>
      )}
    </div>
  );
};

export default ProfileComponent;
