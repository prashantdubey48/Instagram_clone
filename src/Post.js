import React, { useState, useEffect } from "react";
import "./Post.css";
import { Avatar } from "@material-ui/core";
import { db } from "./firebase";
import firebase from "firebase";

function Post({username, caption,user, imageUrl,postId}) {
  const [comments,setComments] = useState([])
  const [comment,setComment] = useState("")

 const postComment=(event)=>{
   event.preventDefault()
   db.collection('post').doc(postId).collection("comments").add({
     text:comment,
     username:"abcd",
     timestamp: firebase.firestore.FieldValue.serverTimestamp(),

    }) 
    setComment('')

 }
  useEffect(()=>{
    let unsubscribe;
   if(postId){
     unsubscribe = db
     .collection('post')
     .doc(postId)
     .collection('comments')
     .orderBy('timestamp','desc')
     .onSnapshot((snapshot)=>{setComments(snapshot.docs.map((doc)=>doc.data()))})


   }
   return ()=>{
     unsubscribe()
   }

  },[postId]);
  return (
    <div className="post">
      <div className="post_header">
        <Avatar className="avatar"  src="/static/images/avatar/1.jpg" alt={username} />
        <h3>{username}</h3>
      </div>
      <img
        className="post_image"
        src={imageUrl}
      />
      <h4 className="post_text">
        <strong>{username}</strong> {caption}
      </h4>
      <div className='postComments'>
        {comments.map((comment)=>
        <p><strong>{comment.username}</strong> {comment.text}</p>
        )}


      </div>
    {user &&  <form>
        <input
        className="post_input"
        type="text"
        placeholder="Enter a Comment...."
        value={comment}
        onChange={(event)=>{setComment(event.target.value)}}
        />
        <button
        className='post_button'
        disabled={!comment}
        type='submit'
        onClick={postComment}
        >Post</button>
      </form>
}
    </div>
  );
}

export default Post;
