import React, {useState} from "react";
import TimeAgo from "react-time-ago";
import EditDelete from "./EditDelete";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

const Post = (props) => {
    const usernameToken = localStorage.getItem('token'); 
    //const [userName, setUserName] = useState("");
    const [showPostForm, setShowPostForm] = useState(false);
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [likeClick, setLikeClick] = useState(false);
    const [dislikeClick, setDislikeClick] = useState(false);
    const [userReply, setUserReply ] = useState("");

    let replyingTo = props.post.id;

    const domain = `${window.location.origin === "http://localhost:3000" ? "http://localhost:5000" : window.location.origin}`;

    function submitPost(event) {
        event.preventDefault();

        fetch(`${domain}/api/reports`, {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({usernameToken: usernameToken}),
          })
            .then((res) => res.json())
            .then((data) => data.username)
            .then( (username) => {
                    props.addPost(userReply, username, replyingTo, false);
                }
            );
        //call method that sets the postContent of a post to the value of the user input
        //clear userPost
        //setUserName("");
        setUserReply("");
        setShowPostForm(!showPostForm);
    }

    //if like button is clicked
    const onLikeClicked = () => {
        if(!likeClick) {
            setLikeClick(true);
            setLikes(likes + 1);

            if(dislikeClick) {
                setDislikeClick(false);
                setDislikes(dislikes - 1);
            }
        }
        else {
            setLikeClick(false);
            setLikes(likes - 1);
        }
    }

    //if dislike button is clicked
    const onDislikeClicked = () => {
        if(!dislikeClick) {
            setDislikeClick(true);
            setDislikes(dislikes + 1);

            if(likeClick) {
                setLikeClick(false);
                setLikes(likes - 1);
            }
        }
        else {
            setDislikeClick(false);
            setDislikes(dislikes - 1);
        }
    }

    //gets the current date
    var d = Date(Date.now());
    let a = d.toString();
    
    return (
        <div>
            <Card className="comment-container">
                {/* <Card.Header> */}
                <div className="namedate-container">
                    <div className="user-name">
                        <i class="far fa-user" style={{marginRight: "5px"}}></i>
                        {props.post.userName}
                    </div>
                    {/*Component to render how much time ago a comment was posted*/}
                    <div className="post-date">
                        <i class="far fa-clock" style={{marginRight: "5px"}}></i>
                        <TimeAgo date={a} />
                    </div>
                </div>
                {/* </Card.Header> */}
                <Card.Body>
                     {/*Renders post content*/}
                    {props.post.isThread && <b>{props.post.postContent}</b>}
                    {!props.post.isThread && props.post.postContent}
                </Card.Body>
                <div className="buttons">
                
                    <div className="reply-button">
                        <span  onClick={() => setShowPostForm(!showPostForm)} >
                            <i class="far fa-comment-dots" style={{marginRight: "5px"}}></i>
                            Reply
                        </span> 
                    </div>
                    <div className="like-button">
                        <span onClick={onLikeClicked} style={{color: likeClick && 'black'}}>
                        <i class="far fa-thumbs-up" style={{marginRight: "5px"}}></i>
                            Like  {likes !== 0 && likes}
                        </span>
                    </div>
                    <div className="dislike-button">
                        <span onClick={onDislikeClicked} style={{color: dislikeClick && 'black'}}>
                            <i class="far fa-thumbs-down" style={{marginRight: "5px"}}></i>
                            Dislike {dislikes !== 0 && dislikes}
                        </span>
                    </div>
                
                    {/*this functionality (editing and deleting posts) should only be available to the comments created by the current user */}
                    <EditDelete posts={props.posts} postContent={props.post.postContent} postId={props.post.id} setPosts={props.setPosts} addPost={props.addPost}/>
                </div>
            </Card>
            <br></br>
            <div>
                 {/*Reply form*/}
                {showPostForm && 
                    <div>
                    <Card className="post-editor">
                        <Card.Body>
                            <Form>
                                <textarea  
                                    value={userReply} 
                                    onChange={(e) => setUserReply(e.target.value)} 
                                    className="form-control"
                                    placeholder={"Replying to @"+props.post.userName}
                                >
                                </textarea>
                                {userReply.trim() && <span style={{marginTop: "5px"}} className="reply-button1" onClick={submitPost} >
                                    Reply
                                    <i class="fas fa-check" style={{marginLeft: "5px"}}></i>
                                </span>} 
                                {!userReply.trim() && <span className="reply-button1" style={{cursor:"not-allowed"}} disabled>
                                    Reply
                                </span>}
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
                }
            </div>
        </div>
    )
}

export default Post;