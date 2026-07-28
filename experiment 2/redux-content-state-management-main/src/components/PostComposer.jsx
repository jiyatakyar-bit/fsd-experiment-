import {
  useState,
  useMemo,
  useCallback,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  addPost,
  deletePost,
  fetchPosts,
  selectAllPosts,
  selectTotalPosts,
  selectShortPosts,
} from "../redux/postsSlice";

import "./PostComposer.css";

function PostComposer() {
  const dispatch = useDispatch();

  // Redux Selectors
  const publishedPosts =
    useSelector(selectAllPosts);

  const totalPosts =
    useSelector(selectTotalPosts);

  const shortPosts =
    useSelector(selectShortPosts);

  const loading = useSelector(
    (state) => state.posts.loading
  );

  const error = useSelector(
    (state) => state.posts.error
  );

  // Local State
  const [post, setPost] = useState("");
  const [platform, setPlatform] =
    useState("twitter");

  const [file, setFile] = useState(null);

  // Platform Limits
  const limits = {
    twitter: 280,
    facebook: 5000,
    instagram: 2200,
    linkedin: 3000,
  };

  const remaining =
    limits[platform] - post.length;

  const exceeded = remaining < 0;

  // useMemo
  const postLength = useMemo(() => {
    return post.length;
  }, [post]);

  // Publish
  const handlePublish = useCallback(() => {
    if (exceeded) {
      alert(
        "Post exceeds the character limit!"
      );
      return;
    }

    if (post.trim() === "") {
      alert("Please write a post.");
      return;
    }

    const newPost = {
      id: Date.now(),
      text: post,
      content: post,
      platform: platform,
      fileName: file
        ? file.name
        : "No File Selected",
    };

    dispatch(addPost(newPost));

    setPost("");
    setFile(null);

    alert("Post Published Successfully!");
  }, [
    post,
    platform,
    file,
    exceeded,
    dispatch,
  ]);

  // Delete
  const handleDelete = useCallback(
    (id) => {
      dispatch(deletePost(id));
    },
    [dispatch]
  );

  // Fetch API Posts
  const handleFetchPosts = () => {
    dispatch(fetchPosts());
  };

  return (
    <div className="container">

      <h1>Dynamic Post Composer</h1>

      <textarea
        placeholder="What's on your mind?"
        value={post}
        onChange={(e) =>
          setPost(e.target.value)
        }
      />

      <h3>Select Platform</h3>

      <div className="platforms">

        <label>
          <input
            type="radio"
            value="twitter"
            checked={
              platform === "twitter"
            }
            onChange={(e) =>
              setPlatform(e.target.value)
            }
          />
          Twitter/X
        </label>

        <label>
          <input
            type="radio"
            value="facebook"
            checked={
              platform === "facebook"
            }
            onChange={(e) =>
              setPlatform(e.target.value)
            }
          />
          Facebook
        </label>

        <label>
          <input
            type="radio"
            value="instagram"
            checked={
              platform === "instagram"
            }
            onChange={(e) =>
              setPlatform(e.target.value)
            }
          />
          Instagram
        </label>

        <label>
          <input
            type="radio"
            value="linkedin"
            checked={
              platform === "linkedin"
            }
            onChange={(e) =>
              setPlatform(e.target.value)
            }
          />
          LinkedIn
        </label>

      </div>

      <div className="counter">

        <span
          className={
            exceeded ? "red" : "green"
          }
        >
          {postLength}/{limits[platform]}
        </span>

      </div>

      {exceeded ? (

        <p className="error">
          Character limit exceeded by{" "}
          {Math.abs(remaining)} characters.
        </p>

      ) : (

        <p className="success">
          {remaining} characters remaining.
        </p>

      )}

      <input
        type="file"
        onChange={(e) =>
          setFile(e.target.files[0])
        }
      />

      {file && (
        <p>
          Selected File: {file.name}
        </p>
      )}

      <br />
      <br />

      <button onClick={handlePublish}>
        Publish
      </button>

      {" "}

      <button onClick={handleFetchPosts}>
        Fetch Posts
      </button>

      <hr />

      {loading && (
        <p>Loading posts...</p>
      )}

      {error && (
        <p className="error">
          Error: {error}
        </p>
      )}

      <h3>
        Total Posts: {totalPosts}
      </h3>

      <p>
        Short Posts: {shortPosts.length}
      </p>

      <h2>Published Posts</h2>

      {publishedPosts.length === 0 ? (

        <p>No posts published yet.</p>

      ) : (

        publishedPosts.map((item) => (

          <div
            className="publishedPost"
            key={item.id}
          >

            <h4>
              {item.platform
                ? item.platform.toUpperCase()
                : "POST"}
            </h4>

            <p>
              {item.text ||
                item.title ||
                item.content}
            </p>

            {item.content &&
              item.content !==
                item.text && (
                <p>{item.content}</p>
              )}

            <p>
              <strong>File:</strong>{" "}
              {item.fileName ||
                "No File Selected"}
            </p>

            <button
              onClick={() =>
                handleDelete(item.id)
              }
            >
              Delete
            </button>

            <hr />

          </div>

        ))

      )}

    </div>
  );
}

export default PostComposer;