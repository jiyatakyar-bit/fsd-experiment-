import { useState } from "react";
import "./PostComposer.css";

function PostComposer() {
  const [post, setPost] = useState("");
  const [platform, setPlatform] = useState("twitter");
  const [file, setFile] = useState(null);
  const [publishedPosts, setPublishedPosts] = useState([]);

  const limits = {
    twitter: 280,
    facebook: 5000,
    instagram: 2200,
    linkedin: 3000,
  };

  const remaining = limits[platform] - post.length;
  const exceeded = remaining < 0;

  const handlePublish = () => {
  if (exceeded) {
    alert("Post exceeds the character limit!");
    return;
  }

  if (post.trim() === "") {
    alert("Please write a post.");
    return;
  }

  const newPost = {
    text: post,
    platform: platform,
    fileName: file ? file.name : "No File Selected",
  };

  setPublishedPosts([...publishedPosts, newPost]);

  setPost("");
  setFile(null);

  alert("Post Published Successfully!");
};

  return (
    <div className="container">
      <h1>Dynamic Post Composer</h1>

      <textarea
        placeholder="What's on your mind?"
        value={post}
        onChange={(e) => setPost(e.target.value)}
      />

      <h3>Select Platform</h3>

      <div className="platforms">
        <label>
          <input
            type="radio"
            value="twitter"
            checked={platform === "twitter"}
            onChange={(e) => setPlatform(e.target.value)}
          />
          Twitter/X
        </label>

        <label>
          <input
            type="radio"
            value="facebook"
            checked={platform === "facebook"}
            onChange={(e) => setPlatform(e.target.value)}
          />
          Facebook
        </label>

        <label>
          <input
            type="radio"
            value="instagram"
            checked={platform === "instagram"}
            onChange={(e) => setPlatform(e.target.value)}
          />
          Instagram
        </label>

        <label>
          <input
            type="radio"
            value="linkedin"
            checked={platform === "linkedin"}
            onChange={(e) => setPlatform(e.target.value)}
          />
          LinkedIn
        </label>
      </div>

      <div className="counter">
        <span className={exceeded ? "red" : "green"}>
          {post.length}/{limits[platform]}
        </span>
      </div>

      {exceeded ? (
        <p className="error">
          Character limit exceeded by {Math.abs(remaining)} characters.
        </p>
      ) : (
        <p className="success">
          {remaining} characters remaining.
        </p>
      )}

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      {file && (
        <p className="filename">
          Selected File: {file.name}
        </p>
      )}

      <button onClick={handlePublish}>
        Publish
      </button>
      <hr />

<h2>Published Posts</h2>

{publishedPosts.length === 0 ? (
  <p>No posts published yet.</p>
) : (
  publishedPosts.map((item, index) => (
    <div className="publishedPost" key={index}>
      <h4>{item.platform.toUpperCase()}</h4>

      <p>{item.text}</p>

      <p>
        <strong>File:</strong> {item.fileName}
      </p>

      <hr />
    </div>
  ))
)}
    </div>
  );
}

export default PostComposer;