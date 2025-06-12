import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";


export default function MainPage() {
  const { user, logout } = useContext(UserContext);
  const [chatRooms, setChatRooms] = useState([
    { id: 1, name: "Tech Talk", tags: ["tech", "coding"] },
    { id: 2, name: "Gaming Zone", tags: ["games", "fun"] },
    { id: 3, name: "Study Lounge", tags: ["study", "quiet"] },
  ]);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomTags, setNewRoomTags] = useState("");

  const [searchText, setSearchText] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const navigate = useNavigate();

  // Create new room handler
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

  // Get unique tags from all rooms
  const allTags = Array.from(
    new Set(chatRooms.flatMap((room) => room.tags))
  ).sort();

  // Toggle tag selection
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Filter chat rooms based on search text and selected tags
  const filteredRooms = chatRooms.filter((room) => {
    const matchesText = room.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => room.tags.includes(tag));
    return matchesText && matchesTags;
  });

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1>Chat Rooms</h1>
        <div>
         {user ? (
        <>
            Hello, {user.name}{" "}
           <button onClick={logout} style={styles.logoutButton}>
               Logout
           </button>
         </>
        ) : 
        ("Not logged in")}
        </div>

      </header>

      <div style={styles.content}>
        {/* Left panel */}
        <section style={styles.leftPanel}>
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={styles.searchInput}
          />

          {/* Tag filters */}
          <div style={styles.tagFilter}>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                style={{
                  ...styles.tagButton,
                  backgroundColor: selectedTags.includes(tag) ? "#007bff" : "#e0e0e0",
                  color: selectedTags.includes(tag) ? "white" : "black",
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          <h2>Available Chat Rooms</h2>

          {/* Create new room form */}
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

        {/* Right sidebar */}
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
        </aside>
      </div>
    </div>
  );
}

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
    backgroundColor: "#282c34",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
    backgroundColor: "#007bff",
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
    backgroundColor: "#007bff",
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
