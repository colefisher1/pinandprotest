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
                        <Post isAdmin={props.isAdmin} fetchedUsername={props.fetchedUsername} post={post} key={post._id} addPost={props.addPost} posts={props.posts} setPosts={props.setPosts} />
                        <Reply isAdmin={props.isAdmin} fetchedUsername={props.fetchedUsername} posts={props.posts} setPosts={props.setPosts} addPost={props.addPost} parentUsernameId={post._id} replies={post.replies}/>
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