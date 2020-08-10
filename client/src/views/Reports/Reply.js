import React from "react";
import Post from "./Post";

const Reply = (props) => {
    let renderedReplies;
    if(props.replies) {
        renderedReplies = props.replies.map((post) => {
            return (
                <React.Fragment>
                {   
                    <div className="replies">
                        <Post fetchedUsername={props.fetchedUsername} post={post} key={post._id} addPost={props.addPost} posts={props.posts} setPosts={props.setPosts} />
                        <Reply posts={props.posts} setPosts={props.setPosts} addPost={props.addPost} parentUsernameId={post._id} replies={post.replies}/>
                    </div>
                }
                </React.Fragment>
            )
            
        });
    }

    return(
            <div>
                {renderedReplies}
            </div>
    )
}

export default Reply;