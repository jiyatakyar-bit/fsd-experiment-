import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState([]);
  
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  
  const maxCharacters = 280;
  const navigate = useNavigate();

  const userRole = localStorage.getItem('userRole') || 'Viewer';

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('myPosts')) || [];
    setPosts(savedPosts);
  }, []);

  const handlePost = () => {
    if (postContent.trim() === '') return;
    
    const newPost = {
      id: Date.now(),
      text: postContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('myPosts', JSON.stringify(updatedPosts));
    setPostContent(''); 
  };

  const handleDelete = (id) => {
    const updatedPosts = posts.filter(post => post.id !== id);
    setPosts(updatedPosts);
    localStorage.setItem('myPosts', JSON.stringify(updatedPosts));
  };

  const startEditing = (post) => {
    setEditingId(post.id);
    setEditContent(post.text);
  };

  const saveEdit = (id) => {
    if (editContent.trim() === '') return;

    const updatedPosts = posts.map(post => {
      if (post.id === id) {
        return { ...post, text: editContent, timestamp: post.timestamp + ' (Edited)' };
      }
      return post;
    });

    setPosts(updatedPosts);
    localStorage.setItem('myPosts', JSON.stringify(updatedPosts));
    setEditingId(null);
    setEditContent('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        {/* Composer Card */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e4e6eb', paddingBottom: '15px', marginBottom: '15px' }}>
            <div>
              <h2 style={{ margin: '0 0 5px 0', color: '#1c1e21' }}>Create Post</h2>
              <span style={{ fontSize: '0.85rem', backgroundColor: '#e4e6eb', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                Role: {userRole}
              </span>
            </div>
            <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              Log Out
            </button>
          </div>

          <textarea 
            placeholder={userRole === 'Viewer' ? "Viewers can only read posts." : "What's on your mind?"}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            maxLength={maxCharacters}
            disabled={userRole === 'Viewer'} 
            style={{ 
              width: '100%', minHeight: '100px', padding: '15px', border: 'none', 
              borderRadius: '8px', backgroundColor: '#f0f2f5', fontSize: '1.1rem', 
              resize: 'none', boxSizing: 'border-box', outline: 'none',
              cursor: userRole === 'Viewer' ? 'not-allowed' : 'text'
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
            <span style={{ fontSize: '0.9rem', color: postContent.length === maxCharacters ? 'red' : '#65676b' }}>
              {postContent.length} / {maxCharacters}
            </span>
            <button 
              onClick={handlePost} 
              disabled={postContent.length === 0 || userRole === 'Viewer'} 
              style={{ 
                padding: '10px 24px', 
                backgroundColor: (postContent.length === 0 || userRole === 'Viewer') ? '#a3c2fa' : '#0866ff', 
                color: 'white', border: 'none', borderRadius: '6px', 
                cursor: (postContent.length === 0 || userRole === 'Viewer') ? 'not-allowed' : 'pointer', 
                fontSize: '1rem', fontWeight: 'bold' 
              }}>
              Post
            </button>
          </div>
        </div>

        {/* Feed Section */}
        <div>
          <h3 style={{ color: '#1c1e21', marginBottom: '15px' }}>Your Feed</h3>
          {posts.length === 0 ? (
            <p style={{ color: '#65676b', textAlign: 'center' }}>No posts yet.</p>
          ) : (
            posts.map(post => (
              <div key={post.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '15px' }}>
                
                {editingId === post.id ? (
                  <div>
                    <textarea 
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      style={{ width: '100%', minHeight: '80px', padding: '10px', borderRadius: '6px', border: '1px solid #ced4da', marginBottom: '10px', fontFamily: 'inherit' }}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => saveEdit(post.id)} style={{ padding: '6px 12px', backgroundColor: '#198754', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                      <button onClick={cancelEdit} style={{ padding: '6px 12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#050505', whiteSpace: 'pre-wrap' }}>{post.text}</p>
                      <span style={{ fontSize: '0.8rem', color: '#65676b' }}>Posted at {post.timestamp}</span>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {/* Editor Edit Button */}
                      {userRole === 'Editor' && (
                        <button onClick={() => startEditing(post)} style={{ padding: '6px 12px', backgroundColor: '#e7f3ff', color: '#0866ff', border: '1px solid #cce5ff', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                          Edit
                        </button>
                      )}
                      
                      {/* Admin AND Editor Delete Button */}
                      {(userRole === 'Admin' || userRole === 'Editor') && (
                        <button onClick={() => handleDelete(post.id)} style={{ padding: '6px 12px', backgroundColor: '#ffe5e5', color: '#dc3545', border: '1px solid #ffcccc', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                )}
                
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default CreatePost;