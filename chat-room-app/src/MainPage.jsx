import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function MainPage() {
  const { user, logout } = useContext(UserContext);

  // Preloaded fantasy/sci-fi themed chat rooms for Rolesphere
  const [chatRooms, setChatRooms] = useState([
    { id: 1, name: "The Last Troll", tags: ["fantasy", "troll", "survival"] },
    { id: 2, name: "Slow-Burn Romance in the Postapocalypse", tags: ["romance", "post-apocalyptic", "drama"] },
    { id: 3, name: "A Tale of Two Rat Brothers", tags: ["surreal", "historical", "rats", "steampunk"] },
    { id: 4, name: "Starbound Courtship Rituals", tags: ["sci-fi", "romance", "aliens"] },
    { id: 5, name: "Beneath the Oracle's Teeth", tags: ["myth", "mystery", "ancient"] },
    { id: 6, name: "Clockwork Hearts and Velvet Rebellions", tags: ["steampunk", "rebellion", "romance"] },
    { id: 7, name: "When Shadows Dream of Snow", tags: ["gothic", "dreamlike", "fantasy"] },
    { id: 8, name: "Post-Crisis Paranormal Boarding School", tags: ["school", "magic", "drama"] },
    { id: 9, name: "The Kingdom of Glass and Honey", tags: ["fantasy", "court intrigue", "sweet"] },
    { id: 10, name: "Cyberjunk Confessional", tags: ["cyberpunk", "dystopia", "introspective"] },
    { id: 11, name: "Ruins of the Whispering Age", tags: ["post-apocalyptic", "mystery", "exploration"] },
    { id: 12, name: "Echoes of the Fallen Moon", tags: ["epic", "fantasy", "tragedy"] },
    { id: 13, name: "Ex-Lovers at the Edge of Time", tags: ["sci-fi", "drama", "romance"] },
    { id: 14, name: "Plague Circus Chronicles", tags: ["dark fantasy", "plague", "carnival"] },
    { id: 15, name: "Covenant of Thorns and Laughter", tags: ["witches", "dark comedy", "magic"] }
  ]);

  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomTags, setNewRoomTags] = useState("");

  const [searchText, setSearchText] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const navigate = useNavigate();

  // Handle room creation
  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    const newRoom = {
      id: chatRooms.length + 1,
      name: newRoomName.trim(),
      tags: newRoomTags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    setChatRooms([...chatRooms, newRoom]);
    setNewRoomName("");
    setNewRoomTags("");
  };

  // Extract all unique tags
  const allTags = Array.from(
    new Set(chatRooms.flatMap((room) => room.tags))
  ).sort();

  // Tag selection toggle
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Filter chat rooms by search and tag
  const filteredRooms = chatRooms.filter((room) => {
    const matchesText = room.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => room.tags.includes(tag));
    return matchesText && matchesTags;
  });

  return (
    <div style={styles.page}>
      {/* Header with Rolesphere branding */}
      <header style={styles.header}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: "bold" }}>Rolesphere</h1>
          <span style={{ fontSize: 14, color: "#ccc" }}>RP Chat Rooms</span>
        </div>
        <div>
          {user ? (
            <>
              Hello, {user.name}{" "}
              <button onClick={logout} style={styles.logoutButton}>
                Logout
              </button>
            </>
          ) : (
            "Not logged in"
          )}
        </div>
      </header>

      <div style={styles.content}>
        {/* Chat room list + filters */}
        <section style={styles.leftPanel}>
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={styles.searchInput}
          />

          {/* Tags */}
          <div style={styles.tagFilter}>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                style={{
                  ...styles.tagButton,
                  backgroundColor: selectedTags.includes(tag) ? "#6a4fb3" : "#e0e0e0",
                  color: selectedTags.includes(tag) ? "white" : "black",
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          <h2>Available Chat Rooms</h2>

          {/* Room creation form */}
          <form onSubmit={handleCreateRoom} style={{ marginBottom: 20 }}>
            <input
              type="text"
              placeholder="New room name"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={newRoomTags}
              onChange={(e) => setNewRoomTags(e.target.value)}
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              Create Room
            </button>
          </form>

          {/* Display rooms */}
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              style={{ ...styles.chatRoom, cursor: "pointer" }}
              onClick={() => navigate(`/room/${room.id}`)}
            >
              <strong>{room.name}</strong>
              <div style={styles.tags}>
                {room.tags.map((tag) => (
                  <span key={tag} style={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {filteredRooms.length === 0 && <p>No chat rooms found.</p>}
        </section>

        {/* Sidebar list of all rooms */}
        <aside style={styles.sidebar}>
          <h3>All Chat Rooms</h3>
          <ul style={styles.sidebarList}>
            {chatRooms.map((room) => (
              <li
                key={room.id}
                style={{ ...styles.sidebarItem, cursor: "pointer" }}
                onClick={() => navigate(`/room/${room.id}`)}
              >
                {room.name}
              </li>
            ))}
          </ul>
          {/* Rolesphere footer branding */}
          <div style={{ marginTop: 40, fontSize: 12, color: "#888" }}>
            Powered by <strong>Rolesphere</strong>
          </div>
        </aside>
      </div>
    </div>
  );
}

// Rolesphere-inspired styles
const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    flexShrink: 0,
    padding: "10px 20px",
    backgroundColor: "#2e1f4d", // Deep purple for branding
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoutButton: {
    marginLeft: 10,
    padding: "6px 12px",
    backgroundColor: "#ff4d4d",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  content: {
    flex: 1,
    display: "flex",
    overflow: "hidden",
  },
  leftPanel: {
    flex: 3,
    padding: 20,
    overflowY: "auto",
    borderRight: "1px solid #ccc",
  },
  chatRoom: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
  },
  tags: {
    marginTop: 5,
  },
  tag: {
    display: "inline-block",
    marginRight: 8,
    padding: "2px 8px",
    backgroundColor: "#6a4fb3", // Rolesphere Purple
    color: "white",
    borderRadius: 12,
    fontSize: 12,
  },
  sidebar: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fafafa",
    overflowY: "auto",
    borderLeft: "1px solid #ccc",
  },
  sidebarList: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  sidebarItem: {
    padding: 8,
    borderBottom: "1px solid #ddd",
  },
  input: {
    display: "block",
    width: "100%",
    marginBottom: 10,
    padding: 8,
    fontSize: 14,
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  button: {
    padding: "8px 16px",
    fontSize: 14,
    borderRadius: 4,
    border: "none",
    backgroundColor: "#6a4fb3",
    color: "white",
    cursor: "pointer",
  },
  searchInput: {
    width: "100%",
    padding: 8,
    fontSize: 16,
    marginBottom: 10,
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  tagFilter: {
    marginBottom: 15,
  },
  tagButton: {
    marginRight: 8,
    marginBottom: 8,
    padding: "5px 12px",
    border: "none",
    borderRadius: 20,
    cursor: "pointer",
    fontSize: 14,
  },
};
