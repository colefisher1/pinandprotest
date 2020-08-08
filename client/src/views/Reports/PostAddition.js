import React, {useState} from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

const PostAddition = (props) => {
  
    //state that will be changing based on the user input
    const [userPost, setUserPost] = useState("");
   
    //posts a comment
    function submitPost(event) {
        event.preventDefault();
        
        props.addPost(userPost, null);

        //call method that sets the content of a post to the value of the user input
        props.setShowPostForm(false);
        //clear userPost
        setUserPost("");
    }

    return (
        <div>
            <Card className="post-editor">
                <Card.Body>
                    {/* Title your thread */}
                    <Form>
                        <textarea  
                            value={userPost} 
                            onChange={(e) => setUserPost(e.target.value)} 
                            placeholder="Write a comment"
                            className="form-control"
                        >
                        </textarea>
                        {userPost.trim() && <button type="button" onClick={submitPost} className="post-button">
                             Post <i class="far fa-paper-plane" style={{marginLeft: "5px"}}></i>
                        </button>}
                        {!userPost.trim() && <button style={{cursor:"not-allowed"}} type="button" className="disabledpost-button" disabled>
                            Post <i class="far fa-paper-plane" style={{marginLeft: "5px"}}></i>
                        </button>}
                    </Form>
                </Card.Body>
            </Card>
        </div>
    )
}

export default PostAddition;