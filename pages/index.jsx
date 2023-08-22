import Link from "next/link";
import axios from "axios";

const Home = ({ posts }) => {
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
            <div>{posts.length && <BlogPosts data={posts} />}</div>
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

const BlogPosts = ({ data }) => {
  const posts_data = data[0]?.posts;
  return (
    <>
      {posts_data.map((post, index) => (
        <div key={index} className="user-blogs-sub-container">
          <Link
            href={`posts/${post.posts_id}`}
            style={{ textDecoration: "none", color: "black" }}
          >
            <p style={{ cursor: "pointer" }} key={post?.id}>
              {post.title}
            </p>
          </Link>
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
  const url = process.env.NEXT_PUBLIC_API_URL;
  const response = await axios.get(`${url}/getposts`);
  const data = response.data;
  return {
    props: {
      posts: data,
    },
  };
}
