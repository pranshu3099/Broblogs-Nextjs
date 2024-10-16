import Link from "next/link";
import axios from "axios";
import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Head from "next/head";
const Home = ({ posts }) => {
  const [item, setItem] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setItem(localStorage.getItem("Bearer"));
    }
  }, []);
  return (
    <>
      <div className="home-container">
        <Head>
          <meta
            key="description"
            name="description"
            content="This is where I share my projects and thoughts. Dive into my portfolio, get a glimpse of what I've been working on, and find inspiration in my blog posts."
          />
          <meta
            key="title"
            property="og:title"
            content="Pranshu's Portfolio and Blog: Discover My Projects and Insights"
          />
          <meta
            key="description"
            property="og:description"
            content="This is where I share my projects and thoughts. Dive into my portfolio, get a glimpse of what I've been working on, and find inspiration in my blog posts"
          />
          <link rel="icon" href="/icon.svg" />
        </Head>
        <header>
          <h1 style={{ fontSize: "26px" }}>Pranshu&apos;s Blog</h1>
        </header>
        <article className="article">
          <p>
            Hi there, I&apos;m Pranshu aka Brocode. I&apos;m 24 y/o and i work
            as a Software Engineer. I like to rap and love writing songs. I
            mostly work with web related projects.
          </p>
          <p>
            I recently started writing articles on my blog about things I learn,
            learning Next js, writing blog posts.
          </p>
        </article>
        <div className="user-blogs-container">
          <header>
            <h1 style={{ fontSize: "21px", margin: "0px", padding: "0px" }}>
              Blogs
            </h1>
          </header>

          <>
            <div>{posts.length && <BlogPosts data={posts} item={item} />}</div>
          </>
        </div>
        <div className="projects-container">
          <header>
            <h1 style={{ fontSize: "21px" }}>Projects</h1>
          </header>
          <div className="projects-sub-container">
            <div>
              <a href="https://bro-streams.vercel.app/" target="_blank">
                Bro Streams
              </a>
              <p>
                Developed &quot;Bro Streams,&quot; a Twitch-like platform using
                Next.js 14 with Clerk authentication. Real-time streaming via
                LiveKit, Tailwind CSS for styling, and interactive user features
                like following, blocking, and guest access.
              </p>
            </div>

            <div>
              <a href="https://chat.pranshu.dev/" target="_blank">
                Doge chat
              </a>
              <p>
                Built a fun, real-time chat application featuring a
                &quot;Doge&quot; dog using React.js, Node.js, and OpenAI, with
                secure OTP-based authentication and WebSocket for live chat,
                deployed on AWS.
              </p>
            </div>
            <div>
              <a
                href="https://pranshu3099.github.io/movies-hub/index.html"
                target="_blank"
              >
                Movies Hub
              </a>
              <p>Search for movies and tv series </p>
            </div>
          </div>
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

const BlogPosts = ({ data, item }) => {
  const posts_data = data[0]?.posts;
  return (
    <>
      {posts_data.map((post, index) => (
        <div key={index} className="user-blogs-sub-container">
          <div style={{ display: "flex", gap: "1rem", alignItems: "end" }}>
            <Link
              href={`posts/${post.posts_id}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <p style={{ cursor: "pointer" }} key={post?.id}>
                {post.title}
              </p>
            </Link>
            {item && (
              <div>
                <a href="" target="_blank">
                  <img src="/icons/edit.png" alt="" style={{ width: "20px" }} />
                </a>
              </div>
            )}
          </div>

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
