import { useState } from 'react';
import { Button } from 'react-bootstrap';

const Comments = ({ comments, addComment, blogId }) => {
  const [comment, setComment] = useState('');
  const [visible, setVisible] = useState(false);

  const handleAddComment = (event) => {
    event.preventDefault();
    addComment(blogId, comment);
    setComment('');
    setVisible(false);
  };

  const handleCommentFormVisible = (event) => {
    event.preventDefault();
    setVisible(true);
  };

  return (
    <div style={{ marginTop: 10 }}>
      <h4>Comments</h4>
      {!visible && (
        <Button onClick={handleCommentFormVisible}>Add a comment</Button>
      )}
      {visible && (
        <form onSubmit={handleAddComment}>
          <input
            placeholder="write your comment here"
            value={comment}
            type="text"
            onChange={({ target }) => setComment(target.value)}
          ></input>
          <Button type="submit" style={{ marginLeft: 5 }}>
            Save
          </Button>
        </form>
      )}
      <div style={{ marginTop: 10 }}>
        {comments.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </div>
    </div>
  );
};

export default Comments;
