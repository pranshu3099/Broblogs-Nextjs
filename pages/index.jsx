import { useCallback, useState, useEffect, useLayoutEffect } from "react";
import { useMemo } from "react";
import axios from "axios";
const Home = ({ posts }) => {
  const [likes, setLikes] = useState(0);
  const [userpost, setUserPost] = useState([]);

  // useEffect(() => {
  //   let data = JSON.parse(localStorage.getItem("postdata"));
  //   if (!data.length || userpost.length) {
  //     localStorage.setItem("postdata", JSON.stringify(userpost));
  //   }
  //   if (Object.keys(userpost).length) {
  //     navigate("/posts", { state: userpost });
  //   }
  // }, [userpost, navigate]);
  const handleBlog = (e, post_id) => {
    // axios
    //   .get(`http://localhost:3000/getsinglepost/${post_id}`, {
    //     headers,
    //     withCredentials: true,
    //   })
    //   .then((res) => {
    //     setUserPost(res?.data);
    //   })
    //   .catch((err) => {
    //     setUserPost(err?.response?.data);
    //   });
  };
  return (
    <>
      <div className="home-container">
        <header>
          <h1>Pranshu's Blog</h1>
        </header>
        <article className="article">
          <p>
            Hi there, I'm Shoubhit aka nexxel. I'm 18 y/o and going to
            university soon. I like shuffling cards and building things. I enjoy
            language design, web development and I live on the terminal.
          </p>
          <p>
            Right now I'm building a journal app, learning OCaml, writing blog
            posts and going to the gym regularly.
          </p>
        </article>

        <div className="projects-container">
          <header>
            <h1>Projects</h1>
          </header>
          <div className="projects-sub-container">
            <div>
              <a
                href="https://github.com/pranshu3099/parkade-frontend"
                target="_blank"
              >
                Parkade
              </a>
              <p>
                Automatic car parking monitoring system. Real-time number plate
                scanning. User registration and admin panel.
              </p>
            </div>
            <div>
              <a
                href="https://github.com/pranshu3099/Snake-Game"
                target="_blank"
              >
                Snake Game
              </a>
              <p>A Simple snake game made using javascript</p>
            </div>
            <div>
              <a href="#">wordle</a>
              <p>The best way to start a full-stack, typesafe Next.js app</p>
            </div>
            <div>
              <a href="#">wordle</a>
              <p>The best way to start a full-stack, typesafe Next.js app</p>
            </div>
            <div>
              <a href="#">wordle</a>
              <p>The best way to start a full-stack, typesafe Next.js app</p>
            </div>
          </div>
        </div>

        <div className="user-blogs-container">
          <header>
            <h1>Blogs</h1>
          </header>

          <>
            <div>
              {posts.length && (
                <BlogPosts data={posts} onHandleBlog={handleBlog} />
              )}
            </div>
          </>
        </div>
        <hr />
        <div className="myprofile-container">
          <p>Pranshu Srivastava</p>
          <div className="my-profile-icons">
            <a href="https://github.com/pranshu3099" target="_blank">
              <img src="/icons/github.png" alt="" />
            </a>
            <a href="https://www.linkedin.com/in/pranshu-cse/" target="_blank">
              <img src="/icons/linkedin.png" alt="" />
            </a>
            <a href="https://twitter.com/brocode08071934" target="_blank">
              <img src="/icons/twitter.png" alt="" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

const BlogPosts = ({ data, onHandleBlog }) => {
  const handleBlog = (e, post_id) => {
    onHandleBlog(e, post_id);
  };
  const posts_data = data[0]?.posts;
  return (
    <>
      {posts_data.map((post, index) => (
        <div key={index} className="user-blogs-sub-container">
          <p
            onClick={(e) => handleBlog(e, post.posts_id)}
            style={{ cursor: "pointer" }}
            key={post?.id}
          >
            {post.title}
          </p>
          <div className="date-name-container">
            <div>{post.created_at.substring(0, 9)}</div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const response = await axios.get("http://localhost:3000/getposts");
  const data = response.data;
  return {
    props: {
      posts: data,
    },
  };
}
