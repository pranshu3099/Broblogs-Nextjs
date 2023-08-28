import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import axios from "axios";
import EditorComponent from "@/components/Editor";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  useDisclosure,
  Input,
} from "@chakra-ui/react";
const CreateBlog = ({ categories }) => {
  const [selectedFile, setSelectedFile] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [url, setUrl] = useState([]);
  const router = useRouter();
  const api_url = process.env.NEXT_PUBLIC_API_URL;
  const [selectedCategory, setSelectedCategory] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [bearer, setBearer] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBearer(localStorage.getItem("Bearer"));
    }
  }, [router.asPath]);

  const headers = useMemo(
    () => ({
      Authorization: `${bearer}`,
      "Content-Type": "application/json",
    }),
    [bearer]
  );
  const blogReducer = (state, { type, payload }) => {
    switch (type) {
      case "pending":
        return state;
      case "title":
        return { ...state, ...payload };
      case "content":
        return { ...state, ...payload };
      case "resolved":
        return state;
      default:
        throw new Error("error");
    }
  };

  const [blog, dispatch] = useReducer(blogReducer, {
    title: "",
    blogContent: "",
  });

  const [submit, setSubmit] = useState(false);
  const today = new Date();
  const monthOptions = { month: "long" };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (blog.title === "" && blog.blogContent === "") {
      alert("please write your blog");
    }
    let randomNum = Math.floor(Math.random() * 9000) + 1000;
    let admin_data = JSON.parse(localStorage.getItem("admin"));
    let data = {
      title: blog?.title,
      content: blog?.blogContent,
      user_id: Number(admin_data?.id),
      category_id: Number(selectedCategory),
      posts_id: Number(randomNum),
    };
    axios
      .post(`${api_url}/createposts`, data, { headers })
      .then((response) => {
        if (response.status === 200) {
          router.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };
  const handleRemovelist = (url, list_img) => {
    console.log(list_img);
    let newfilearr = imagePreview.filter((img) => {
      if (img !== url) return true;
      return false;
    });
    setImagePreview(newfilearr);
    let newimagearr = selectedFile.filter((img) => {
      if (img !== list_img) return true;
      return false;
    });
    setSelectedFile(newimagearr);
  };

  const handleContentChange = (state, action) => {
    blogReducer(state, action);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile([...selectedFile, file]);
    let reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview([...imagePreview, reader.result]);
    };

    if (file) reader.readAsDataURL(file);
  };

  const copyTextToClipboard = (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      // Use Clipboard API if available
      navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  };

  const handleGeturl = (e) => {
    let textToCopy = e.target.previousElementSibling.textContent;
    copyTextToClipboard(textToCopy);

    e.target.style.display = "none";
    e.target.nextElementSibling.style.display = "block";
    setTimeout(() => {
      e.target.style.display = "block";
      e.target.nextElementSibling.style.display = "none";
    }, 1000);
  };

  const uploadImages = () => {
    const formData = new FormData();
    selectedFile.forEach((image) => {
      formData.append("images", image);
    });
    try {
      const response = axios
        .post(`${api_url}/api/uploadimage`, formData)
        .then((res) => {
          setUrl(res.data.url);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="blog-main-container">
      {
        <>
          <div className="blog-container">
            {categories && (
              <SelectCategories
                category={categories}
                onChange={handleCategoryChange}
              />
            )}
            <div className="input-container">
              <label className="title">
                <Input
                  width={"60rem"}
                  variant="flushed"
                  type="text"
                  value={blog?.title}
                  className="input"
                  placeholder="Title"
                  onChange={(e) =>
                    dispatch({
                      type: "title",
                      payload: { title: e.target.value },
                    })
                  }
                />
              </label>
            </div>
            <form method="post" enctype="multipart/form-data">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  id="files"
                  onChange={handleFileInputChange}
                  name="images"
                  multiple
                />
              </div>
            </form>
            <div>
              {
                <ImageUrllist
                  list={selectedFile}
                  removelist={handleRemovelist}
                  imgurl={handleGeturl}
                  preview={imagePreview}
                  copyurl={url}
                />
              }
            </div>
            <div>
              <button onClick={uploadImages}>upload images</button>
            </div>
            <div>
              <div className="blog-sub-container">
                <div>
                  <EditorComponent
                    blog={blog}
                    dispatch={dispatch}
                    handleChange={handleContentChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <Button
            type="submit"
            onClick={onOpen}
            className="publish"
            colorScheme="gray"
          >
            Publish
          </Button>
          {!submit && (
            <Modal
              closeOnOverlayClick={false}
              isOpen={isOpen}
              onClose={onClose}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Your blog</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  <Text fontSize="30px">{blog?.title}</Text>
                  <p>
                    {today.toLocaleDateString("en-US", monthOptions) +
                      " " +
                      today.getDate() +
                      "," +
                      " " +
                      today.getFullYear()}
                  </p>
                  <Text fontSize="15px">{blog?.blogContent}</Text>
                </ModalBody>

                <ModalFooter>
                  <>
                    <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                      Submit
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                  </>
                </ModalFooter>
              </ModalContent>
            </Modal>
          )}
        </>
      }
    </div>
  );
};

const ImageUrllist = ({ list, removelist, preview, imgurl, copyurl }) => {
  const handleRemoveurl = (img, list_img) => {
    removelist(img, list_img);
  };
  const handleurl = (e) => {
    imgurl(e);
  };

  return (
    <ul className="imgparent">
      {preview.map((img, index) => {
        return (
          <>
            <li key={index} value={index} className="imglist">
              <img src={img} alt="img" />
            </li>
            <span
              onClick={(e) => {
                handleRemoveurl(img, list[index]);
              }}
              style={{
                cursor: "pointer",
                fontSize: "20px",
              }}
            >
              x
            </span>
            <p style={{ display: "none" }} value={index}>
              {copyurl[index]?.path}
            </p>
            {copyurl.length ? (
              <img
                src="/icons/url.png"
                alt=""
                style={{
                  cursor: "pointer",
                  width: "17px",
                  margin: "6px",
                }}
                id="imgurl"
                onClick={(e) => {
                  handleurl(e);
                }}
              />
            ) : (
              ""
            )}
            <p id="copied" style={{ display: "none" }}>
              copied..
            </p>
          </>
        );
      })}
    </ul>
  );
};

const SelectCategories = ({ category, onChange }) => {
  const handleChange = useCallback(
    (e) => {
      onChange(e.target.value);
    },
    [onChange]
  );
  const category_data = category.categories;
  return (
    <>
      <select onChange={handleChange}>
        <option value="">Select a category</option>
        {category_data.map((cat) => {
          return (
            <option key={cat.slug} value={cat.slug}>
              {cat.category_name}
            </option>
          );
        })}
      </select>
    </>
  );
};

export default CreateBlog;

export async function getStaticProps() {
  const url = process.env.NEXT_PUBLIC_API_URL;
  const response = await axios.get(`${url}/getcategories`);
  const data = response.data;
  return {
    props: {
      categories: data,
    },
  };
}
