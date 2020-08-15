import React, { useState, useEffect } from "react";
import Post from "./Post.js";
import ImageUpload from "./imageUpload.js";
import "./App.css";
import { db, auth } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button } from "@material-ui/core";
import InstagramEmbed from 'react-instagram-embed';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const [post, setpost] = useState([]);
  const [open, setopen] = useState(false);
  const [opensignIn, setopensignIn] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const SignInClick = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setopensignIn(false);
  };

  const SignUpClick = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setopen(false);
  };

  useEffect(() => {
    db.collection("post")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setpost(snapshot.docs.map((doc) => ({ post: doc.data(), id: doc.id })));
      });
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // alert(JSON.stringify(authUser))
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, username]);

  return (
    <div className="app">
      {user ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry Login To Upload</h3>
      )}
      <div className="app_header">
        <img
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          className="app_header_Image"
          alt=""
        />
        {user ? (
          <Button type="button" onClick={() => auth.signOut()}>
            LOGOUT
          </Button>
        ) : (
          <div>
            <Button type="button" onClick={() => setopensignIn(true)}>
              SIGN IN
            </Button>
            <Button type="button" onClick={() => setopen(true)}>
              SIGN UP
            </Button>
          </div>
        )}
      </div>

      <Modal open={open} onClose={() => setopen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                className="app_header_Image"
                alt=""
              />
            </center>
            <input
              className="input_box"
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="text"
              className="input_box"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="input_box"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={SignUpClick}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      <Modal open={opensignIn} onClose={() => setopensignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                className="app_header_Image"
                alt=""
              />
            </center>

            <input
              type="text"
              className="input_box"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="input_box"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={SignInClick}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>
      <div className="app_post">
        <div className='app_postleft'>
          {post.map(({ id, post }) => (
            <Post
              postId={id}
              key={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
        <div>
          <InstagramEmbed
            url="https://instagr.am/p/Zw9o4/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      {/* <Post username="prashant" caption="What a lovely Day"  imageUrl="https://homepages.cae.wisc.edu/~ece533/images/arctichare.png"/>
      <Post username="John" caption="I am saaarrry"  imageUrl="https://homepages.cae.wisc.edu/~ece533/images/fruits.png"/>
      <Post username="Ally" caption="Areee dada"  imageUrl="https://homepages.cae.wisc.edu/~ece533/images/tulips.png"/> */}
    </div>
  );
}

export default App;
