const CommentList = ({ usercomments }) => {
  return (
    <>
      {usercomments.map((comment, index) => {
        return (
          <li key={index}>
            <p className="name">
              {comment?.name ? comment.name : comment?.user?.name}
            </p>
            <p className="main-comment">{comment?.comment}</p>
          </li>
        );
      })}
    </>
  );
};
export default CommentList;
