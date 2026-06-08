import { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Feed.css";
import axios from "axios";

const API = "http://localhost:5000/api";

// A simple unique visitor ID stored in sessionStorage so likes are per-session
const USER_ID = (() => {
  let id = sessionStorage.getItem("sf_uid");
  if (!id) {
    id = Math.random().toString(36).slice(2);
    sessionStorage.setItem("sf_uid", id);
  }
  return id;
})();

const AVATARS = [
  "linear-gradient(135deg,#1D4ED8,#3B82F6)",
  "linear-gradient(135deg,#0369A1,#0EA5E9)",
  "linear-gradient(135deg,#1E40AF,#60A5FA)",
  "linear-gradient(135deg,#075985,#38BDF8)",
];

const NAV_ITEMS = [
  { icon: "🏠", label: "Home" },
  { icon: "📋", label: "Tasks" },
  { icon: "🌐", label: "Social", active: true },
  { icon: "🏆", label: "Leaders" },
  { icon: "💬", label: "Chat" },
];

const FILTERS = ["All Post", "For You", "Most Liked", "Most Commented"];

function getInitials(name = "") {
  return name.slice(0, 2).toUpperCase() || "US";
}

function formatDate(dateStr) {
  if (!dateStr) return "Just now";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Feed() {
  // ── Composer state ──
  const [postText, setPostText] = useState("");
  const [postLink, setPostLink] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [validationMsg, setValidationMsg] = useState("");
  const [posting, setPosting] = useState(false);
  const fileInputRef = useRef(null);

  // ── Feed state ──
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Post");
  const [activeTab, setActiveTab] = useState("All Posts");
  
  // ── Comment state ──
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  // ── API calls ──────────────────────────────────────────
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/posts`);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    const hasImage = !!postImage;
    const hasLink = postLink.trim().length > 0;
    
    if (!postText.trim()) {
      setValidationMsg("⚠️ Post text cannot be empty.");
      return;
    }
    if (!hasImage && !hasLink) {
      setValidationMsg("⚠️ Add at least one — an Image or a Link — before posting.");
      return;
    }
    
    setValidationMsg("");
    setPosting(true);
    
    try {
      const fd = new FormData();
      fd.append("username", "Priya");
      fd.append("userId", USER_ID);
      fd.append("content", postText.trim());
      if (postLink.trim()) fd.append("link", postLink.trim());
      if (postImage) fd.append("image", postImage);

      await axios.post(`${API}/posts/create`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      // Reset Composer
      setPostText("");
      setPostLink("");
      setPostImage(null);
      setImagePreview(null);
      setShowLinkInput(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      fetchPosts();
    } catch (err) {
      console.error(err);
      setValidationMsg("❌ Failed to post. Please try again.");
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      // Pass the USER_ID so backend knows who liked it
      await axios.post(`${API}/posts/${postId}/like`, { userId: USER_ID });
      fetchPosts();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId)); // optimistic UI update
    try {
      await axios.delete(`${API}/posts/${postId}`);
    } catch {
      fetchPosts(); // Revert on fail
    }
  };

  const handleComment = async (postId) => {
    if (!commentText.trim()) return;

    try {
      await axios.post(`${API}/posts/${postId}/comment`, {
        text: commentText,
        userId: USER_ID,
        username: "Priya"
      });

      setCommentText("");
      setActiveCommentPost(null);
      fetchPosts();
    } catch (error) {
      console.log(error);
    }
  };

  // ── Image handlers ──
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPostImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    setValidationMsg("");
  };

  const removeImage = () => {
    setPostImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleLink = () => {
    setShowLinkInput((p) => !p);
    if (showLinkInput) setPostLink("");
    setValidationMsg("");
  };

  // ── Derived ──
  const filteredPosts = posts.filter(
    (p) =>
      p.content?.toLowerCase().includes(searchText.toLowerCase()) ||
      p.username?.toLowerCase().includes(searchText.toLowerCase())
  );

  // FIXED: Array length addition instead of raw object addition
  const totalLikes = posts.reduce((s, p) => s + (p.likes?.length || 0), 0);

  // ══════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════
  return (
    <>
      {/* ══ TOPBAR ══ */}
      <header className="sf-topbar h-100%">
        <div className="sf-topbar-brand">
          <div className="tb-logo">🌐</div>
          <h1>
            Social<span>Feed</span>
          </h1>
        </div>
        <div className="sf-topbar-right">
          <div className="sf-pill sf-pill-coin">🪙 210</div>
          <div className="sf-pill sf-pill-rupee">₹ 0.00</div>
          <div className="sf-notif">
            🔔<span className="sf-notif-dot" />
          </div>
          <div className="sf-avatar">PR</div>
        </div>
      </header>

      {/* ══ PAGE SHELL ══ */}
      <div className="sf-page">
        {/* ── LEFT SIDEBAR ── */}
        <aside className="sf-sidebar">
          <div className="sf-sidebar-brand">
            <div className="s-logo">🌐</div>
            <h2>
              Social<span>Feed</span>
            </h2>
          </div>
          <nav className="sf-sidebar-nav">
            {NAV_ITEMS.map(({ icon, label, active }) => (
              <button
                key={label}
                className={`sf-snav-item ${active ? "active" : ""}`}
              >
                <span className="sni">{icon}</span>
                {label}
              </button>
            ))}
          </nav>
          <div className="sf-sidebar-stats">
            <h6>📊 Your Stats</h6>
            <div className="sf-ss-row">
              <span className="sf-ss-label">📝 Posts</span>
              <span className="sf-ss-val">{posts.length}</span>
            </div>
            <div className="sf-ss-row">
              <span className="sf-ss-label">❤️ Likes</span>
              <span className="sf-ss-val">{totalLikes}</span>
            </div>
            <div className="sf-ss-row">
              <span className="sf-ss-label">👤 User</span>
              <span className="sf-ss-val" style={{ fontSize: 13 }}>
                Priya
              </span>
            </div>
          </div>
        </aside>

        {/* ── MAIN FEED ── */}
        <main className="sf-feed-col">
          {/* Search */}
          <div className="sf-search-wrap">
            <div className="sf-search-inner">
              <span className="sf-search-ico">🔍</span>
              <input
                placeholder="Search posts or users..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              {searchText && (
                <button
                  className="sf-search-clear"
                  onClick={() => setSearchText("")}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Stats strip — mobile only */}
          <div className="sf-stats-mobile">
            <div className="sf-stat-card">
              <div className="sf-stat-icon blue">📝</div>
              <div>
                <div className="sf-stat-label">Total Posts</div>
                <div className="sf-stat-value">{posts.length}</div>
              </div>
            </div>
            <div className="sf-stat-card">
              <div className="sf-stat-icon indigo">❤️</div>
              <div>
                <div className="sf-stat-label">Total Likes</div>
                <div className="sf-stat-value">{totalLikes}</div>
              </div>
            </div>
          </div>

          {/* ── COMPOSER ── */}
          <div className="sf-composer">
            <div className="sf-composer-tabs">
              {["All Posts", "Promotions"].map((tab) => (
                <button
                  key={tab}
                  className={`sf-composer-tab ${
                    activeTab === tab ? "active" : ""
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="sf-composer-body">
              <div className="sf-composer-user">
                <div className="sf-composer-avatar">PR</div>
                <div>
                  <div className="sf-composer-name">Priya</div>
                  <div className="sf-composer-sub">
                    Share something with your network
                  </div>
                </div>
              </div>

              <textarea
                className="sf-textarea"
                rows={3}
                placeholder="What's on your mind?"
                value={postText}
                onChange={(e) => {
                  setPostText(e.target.value);
                  setValidationMsg("");
                }}
              />

              <div className="sf-required-note">
                <span className="sf-req-badge">Required</span>
                Add at least one: <strong>Image</strong> or <strong>Link</strong>
              </div>

              {validationMsg && (
                <div className="sf-validation-alert">
                  <span>{validationMsg}</span>
                  <button
                    className="sf-val-close"
                    onClick={() => setValidationMsg("")}
                  >
                    ✕
                  </button>
                </div>
              )}

              {imagePreview && (
                <div className="sf-img-preview-wrap">
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="sf-img-preview"
                  />
                  <button className="sf-img-remove" onClick={removeImage}>
                    ✕ Remove
                  </button>
                </div>
              )}

              {showLinkInput && (
                <div className="sf-link-input-wrap">
                  <span className="sf-link-icon">🔗</span>
                  <input
                    type="url"
                    className="sf-link-input"
                    placeholder="https://example.com"
                    value={postLink}
                    onChange={(e) => {
                      setPostLink(e.target.value);
                      setValidationMsg("");
                    }}
                  />
                  {postLink && (
                    <button
                      className="sf-link-clear btn btn-outline-primary"
                      onClick={() => setPostLink("")}
                    >
                      ✕
                    </button>
                  )}
                </div>
              )}

              <div className="sf-composer-footer">
                <div className="sf-composer-footer-left">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                  <button
                    className={`sf-attach-btn ${postImage ? "active" : ""}`}
                    onClick={() => fileInputRef.current.click()}
                  >
                    📷 {postImage ? "Image ✓" : "Add Image"}
                  </button>
                  <button
                    className={`sf-attach-btn ${
                      showLinkInput && postLink
                        ? "active"
                        : showLinkInput
                        ? "open"
                        : ""
                    }`}
                    onClick={toggleLink}
                  >
                    🔗{" "}
                    {showLinkInput
                      ? postLink
                        ? "Link ✓"
                        : "Hide Link"
                      : "Add Link"}
                  </button>
                  <span className="sf-char-badge">
                    {postText.length} chars
                  </span>
                </div>
                <div className="sf-footer-right">
                  <button className="sf-promote-btn">📢 Promote</button>
                  <button
                    className="sf-post-btn"
                    onClick={handlePost}
                    disabled={posting}
                  >
                    {posting ? "⏳ Posting..." : "✈️ Post"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Filter bar */}
          <div className="sf-filter-bar">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`sf-filter-btn ${activeFilter === f ? "active" : ""}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="sf-section-label">
            <span>Recent Posts</span>
            <small>
              {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""}
            </small>
          </div>

          {loading && (
            <div className="sf-loading">
              <div className="sf-spinner" />
              <span>Loading posts…</span>
            </div>
          )}

          {!loading && filteredPosts.length === 0 && (
            <div className="sf-empty">
              <div className="sf-empty-icon">📭</div>
              <p>No Posts Found</p>
              <small>Try a different search or be the first to post!</small>
            </div>
          )}

          {/* ── POST CARDS ── */}
          {filteredPosts.map((post, i) => {
            // FIXED: Standardized array check for likes
            const liked = post.likes?.includes(USER_ID);
            
            return (
              <div key={post._id} className="sf-post-card">
                <div className="sf-post-top-stripe" />
                <div className="sf-post-body">
                  <div className="sf-post-meta">
                    <div className="sf-post-user">
                      <div
                        className="sf-post-avatar"
                        style={{ background: AVATARS[i % AVATARS.length] }}
                      >
                        {getInitials(post.username)}
                      </div>
                      <div>
                        <div className="sf-post-name">{post.username}</div>
                        <div className="sf-post-handle">
                          @{post.username?.toLowerCase()}
                        </div>
                      </div>
                    </div>
                    <div className="sf-post-time">
                      {formatDate(post.createdAt)}
                    </div>
                  </div>

                  <div className="sf-earn-chip">⭐ Post &amp; Earn Points</div>

                  <div className="sf-post-text">{post.content}</div>

                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt="post"
                      className="sf-post-img"
                    />
                  )}

                  {post.link && (
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sf-post-link"
                    >
                      🔗 {post.link}
                    </a>
                  )}

                  <div className="sf-post-divider" />

                  <div className="sf-post-actions">
                    <button
                      className={`sf-action-btn like ${liked ? "liked" : ""}`}
                      onClick={() => handleLike(post._id)}
                    >
                      {liked ? "❤️" : "🤍"} <span>{post.likes?.length || 0}</span>
                    </button>
                    <button 
                      className="sf-action-btn comment"
                      onClick={() => setActiveCommentPost(activeCommentPost === post._id ? null : post._id)}
                    >
                      💬 <span>{post.comments?.length || 0}</span>
                    </button>
                    <button
                      className="sf-action-btn delete"
                      onClick={() => handleDelete(post._id)}
                    >
                      🗑 Delete
                    </button>
                  </div>

                  {/* FIXED: Comment input nested inside post to capture ID properly */}
                  {activeCommentPost === post._id && (
                    <div className="sf-comment-card mt-3">
                      <div className="sf-comment-header">
                        <div className="sf-comment-icon">💬</div>
                        <div>
                          <div className="sf-comment-title">Add a Comment</div>
                          <div className="sf-comment-sub">
                            Share your thoughts publicly
                          </div>
                        </div>
                      </div>
                      <input
                        type="text"
                        className="sf-comment-input"
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                      <button
                        className="sf-comment-submit"
                        onClick={() => handleComment(post._id)}
                      >
                        ✅ Add Comment
                      </button>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </main>

        {/* ── RIGHT PANEL ── */}
        <aside className="sf-right-panel">
          <div className="sf-rp-card">
            <h6>📊 Overview</h6>
            <div className="sf-rp-stat">
              <div className="sf-rp-stat-icon bl">📝</div>
              <div>
                <div className="sf-rp-stat-lbl">Total Posts</div>
                <div className="sf-rp-stat-val">{posts.length}</div>
              </div>
            </div>
            <div className="sf-rp-stat">
              <div className="sf-rp-stat-icon ind">❤️</div>
              <div>
                <div className="sf-rp-stat-lbl">Total Likes</div>
                <div className="sf-rp-stat-val">{totalLikes}</div>
              </div>
            </div>
          </div>

          <div className="sf-rp-card">
            <h6>🔥 Trending Tags</h6>
            {["#Earn", "#Tasks", "#Rewards", "#SocialFeed", "#Points"].map(
              (tag) => (
                <span key={tag} className="sf-tag">
                  {tag}
                </span>
              )
            )}
          </div>

          <div className="sf-rp-card">
            <h6>💡 Pro Tips</h6>
            <p className="sf-tip-text">
              Post daily to earn up to <strong>1,000 points/day</strong>.
              <br />
              <br />
              Share valid links to boost your <strong>weekly rewards</strong> up
              to 10,000 points! 🚀
            </p>
          </div>

          <div className="sf-rp-card">
            <h6>📌 Post Requirements</h6>
            <div className="sf-req-list">
              <div className="sf-req-item">
                <span className="sf-req-dot green" />
                Write your post text
              </div>
              <div className="sf-req-item">
                <span className="sf-req-dot orange" />
                Add an <strong>Image</strong> (required*)
              </div>
              <div className="sf-req-item">
                <span className="sf-req-dot orange" />
                OR add a <strong>Link</strong> (required*)
              </div>
            </div>
            <p className="sf-tip-text" style={{ marginTop: 10 }}>
              *At least one of image or link is mandatory.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}