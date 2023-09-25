import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Textarea } from "@chakra-ui/react";
import { useRouter } from "next/router";
const Posts = ({ post }) => {
  const [likes, setLikes] = useState(null);
  const [result, setResult] = useState([]);
  const [sendComment, setSendComment] = useState(false);
  const [Yourcomment, setYourComment] = useState("");
  const [yourCommentList, setYourCommentList] = useState([]);
  const [authStatus, setAuthStatus] = useState({ status: false, user: null });
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    setYourCommentList(post?.[0]?.posts?.comments);
    let likearr = localStorage.getItem("posts")
      ? JSON.parse(localStorage.getItem("posts"))
      : [];
    const posts = likearr[0];

    let islikedArray = [];

    if (posts !== undefined) {
      console.log(posts.hasOwnProperty(post?.[0]?.posts?.posts_id));
      console.log(
        posts[post?.[0]?.posts?.posts_id].includes(authStatus?.user?.id)
      );
      console.log(posts);
      console.log(post);
      console.log(posts[post?.[0]?.posts?.posts_id]);
      if (posts.hasOwnProperty(post?.[0]?.posts?.posts_id)) {
        if (posts[post?.[0]?.posts?.posts_id].includes(authStatus?.user?.id)) {
          console.log(authStatus?.user?.id);
          islikedArray.push(true);
        } else {
          islikedArray.push(false);
        }
      }
    }

    setResult(islikedArray);
  }, []);

  useEffect(() => {
    fetch(`${url}/tokenvalid`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("response", res);
        if (res[0]?.message === "unauthorized") {
          setAuthStatus({ ...authStatus, status: false, user: null });
        } else {
          setAuthStatus({ ...authStatus, status: true, user: res?.[0]?.user });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function setLikedToLocalStorage(user_id, post_id) {
    let likearr = localStorage.getItem("posts")
      ? JSON.parse(localStorage.getItem("posts"))
      : [];
    if (likearr.length) {
      let updatedArr = likearr.map((posts) => {
        if (posts.hasOwnProperty(post_id)) {
          let arr = posts[post_id];
          arr.push(user_id);
          return {
            ...posts,
            [post_id]: arr,
          };
        } else {
          posts = { ...posts, [post_id]: [user_id] };
        }
        return posts;
      });
      likearr = updatedArr;
    } else {
      let newPost = {
        [post_id]: [user_id],
      };
      likearr.push(newPost);
    }
    localStorage.setItem("posts", JSON.stringify(likearr));
  }

  function removeLikedFromLocalStorage(user_id, post_id) {
    let likearr = localStorage.getItem("posts")
      ? JSON.parse(localStorage.getItem("posts"))
      : [];

    if (!likearr.length) return false;
    let updatedArr = likearr.map((posts) => {
      if (posts.hasOwnProperty(post_id)) {
        let arr = posts[post_id];
        let newArr = arr.filter((id) => id !== user_id);
        return {
          ...posts,
          [post_id]: newArr,
        };
      }
      return posts;
    });
    localStorage.setItem("posts", JSON.stringify(updatedArr));
  }

  const handleLike = (e, post_id, user_id, likes_count) => {
    if (e.target.attributes.src.textContent === "/icons/heart.png") {
      e.target.attributes.src.textContent = "/icons/like.png";
      removeLikedFromLocalStorage(user_id, post_id);

      fetch(`${url}/removeLikes/${post_id}/users/${user_id}`, {
        method: "POST",
        credentials: "include",
      })
        .then((r) => r.json())
        .then((res) => {
          setLikes(res?.likes);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      e.target.attributes.src.textContent = "/icons/heart.png";
      setLikedToLocalStorage(user_id, post_id);
      fetch(`${url}/addlikes/${post_id}/users/${user_id}`, {
        method: "POST",
        credentials: "include",
      })
        .then((r) => r.json())
        .then((res) => {
          setLikes(res?.likes);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  function checkForSpaces() {
    let trimmedText = Yourcomment;
    let pattern = /^\s*$/;
    return pattern.test(trimmedText);
  }

  const handleSendComment = (e, post_id, user) => {
    if (Yourcomment === "" || checkForSpaces()) {
      alert("comment is required");
    } else {
      let comment = {
        user_id: authStatus?.user?.id,
        posts_id: post?.[0]?.posts?.posts_id,
        comment: Yourcomment,
      };
      setYourComment("");
      console.log(comment);
      fetch(`${url}/comment/`, {
        body: JSON.stringify(comment),
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((r) => r.json())

        .then((res) => console.log(res))
        .catch((err) => console.log(err));
      comment["name"] = authStatus?.user?.name;
      setYourCommentList([...yourCommentList, comment]);
    }
  };

  const handleComment = (e, post_id) => {
    if (sendComment) {
      setSendComment(false);
      document.getElementById("comment-list").style.left = "-100%";
      document.getElementById("comment-list").style.width = "20%";
    } else {
      setSendComment(true);
      document.getElementById("comment-list").style.left = "0";
      document.getElementById("comment-list").style.width = "100%";
    }
  };

  if (router.isFallback) {
    return <h1>Loading....</h1>;
  }
  return (
    <>
      <article>
        <div className="post-main-container">
          {post ? (
            <BlogPosts
              posts={post}
              result={result}
              likes={likes}
              onhandleLikeChange={handleLike}
              onhandleComment={handleComment}
              commentcount={yourCommentList}
              userstatus={authStatus}
              api_url={url}
            />
          ) : null}
        </div>
        <div className="comment-list-container">
          <ul id="comment-list">
            <div className="comment-container">
              <Textarea
                placeholder="Comment"
                className="comment"
                value={Yourcomment}
                onChange={(e) => {
                  setYourComment(e.target.value);
                }}
              />
              <div className="comment-btn-container">
                <Button
                  colorScheme="blue"
                  onClick={handleSendComment}
                  className="comment-btn"
                >
                  comment
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={handleComment}
                  className="comment-btn"
                >
                  cancel
                </Button>
              </div>
            </div>
            <div className="main-comment-list">
              {post.length ? (
                <CommentList usercomments={yourCommentList} />
              ) : null}
            </div>
          </ul>
        </div>
      </article>
    </>
  );
};

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

export default Posts;

export async function getStaticPaths() {
  try {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const response = await axios.get(`${url}/getposts`, {});
    const data = response.data;
    const posts = data[0]?.posts;
    const paths = posts?.map((post) => {
      return {
        params: {
          postId: String(post?.posts_id),
        },
      };
    });

    return {
      paths,
      fallback: true,
    };
  } catch (err) {
    console.log(err);
  }
}

export async function getStaticProps(context) {
  let { params } = context;
  const url = process.env.NEXT_PUBLIC_API_URL;
  let data;
  const response = await fetch(`${url}/getsinglepost/${params.postId}`);
  data = await response.json();
  return {
    props: {
      post: data,
    },
  };
}
