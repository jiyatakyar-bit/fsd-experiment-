import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";

// Entity Adapter
const postsAdapter = createEntityAdapter();

// Async Thunk
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async () => {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts?_limit=5"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }

    const data = await response.json();

    return data.map((post) => ({
      ...post,
      text: post.title,
      content: post.body,
      platform: "API",
      fileName: "No File Selected",
    }));
  }
);

// Normalized State
const initialState = postsAdapter.getInitialState({
  loading: false,
  error: null,
});

// Slice
const postsSlice = createSlice({
  name: "posts",

  initialState,

  reducers: {
    addPost: postsAdapter.addOne,
    deletePost: postsAdapter.removeOne,
    updatePost: postsAdapter.updateOne,
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        postsAdapter.setAll(state, action.payload);
      })

      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Actions
export const {
  addPost,
  deletePost,
  updatePost,
} = postsSlice.actions;

// Entity Selectors
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
  selectTotal: selectTotalPosts,
} = postsAdapter.getSelectors(
  (state) => state.posts
);

// Memoized Selector
export const selectShortPosts = createSelector(
  [selectAllPosts],
  (posts) =>
    posts.filter((post) => {
      const text =
        post.text ||
        post.title ||
        post.content ||
        "";

      return text.length < 100;
    })
);

export default postsSlice.reducer;