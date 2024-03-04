import { useState } from "react";
const HTMLRenderer = ({ htmlContent }) => {
  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};
const BlogPosts = ({
  posts,
  onhandleLikeChange,
  onhandleComment,
  result,
  responseData,
  likes,
  commentcount,
  userResponseData,
  userstatus,
  api_url,
}) => {
  const handleLike = (e, post_id, user_id, likes_count) => {
    onhandleLikeChange(e, post_id, user_id, likes_count);
  };
  const handleComment = (e) => {
    onhandleComment(e);
  };

  const REDIRECT_URL = `${api_url}/api/auth/github`;
  const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
  let path = `posts/${posts?.[0]?.posts?.posts_id}`;
  return (
    <>
      {posts.map((post, index) => (
        <div className="post-container" key={index}>
          <div className="date-name-container">
            <p>{post?.posts?.created_at.substring(0, 9)}</p>
          </div>

          {userstatus?.status === true ? (
            <div className="post-icons-container">
              <img
                src={
                  result?.length
                    ? result[index] === false
                      ? "/icons/like.png"
                      : "/icons/heart.png"
                    : "/icons/like.png"
                }
                alt=""
                className="post-icons"
                onClick={(e) =>
                  handleLike(
                    e,
                    post?.posts?.posts_id,
                    userstatus?.user?.id,
                    post?.posts?.likes_count
                  )
                }
                id="likes"
              />
              <p>{likes !== null ? likes : post?.posts?.likes_count}</p>
              <img
                src="/icons/comment.png"
                alt=""
                className="post-icons"
                onClick={(e) => handleComment(e)}
              />
              <p>{commentcount?.length}</p>
            </div>
          ) : (
            <a
              href={`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}?path=${path}&scope=user:email`}
            >
              Login via github to comment and like
            </a>
          )}

          <div className="post-title">
            <h1>{post?.posts?.title}</h1>
            <HTMLRenderer htmlContent={post?.posts?.parsed_content} />
          </div>
        </div>
      ))}
    </>
  );
};

export default BlogPosts;
