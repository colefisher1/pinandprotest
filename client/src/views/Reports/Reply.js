import React from "react";
import Post from "./Post";

const Reply = (props) => {
    return(
            <div>
                {
                    props.replies.map((post) => (
                            <React.Fragment>
                                {   
                                    <div className="replies">
                                        <Post post={post} key={post.id} addPost={props.addPost} posts={props.posts} setPosts={props.setPosts} />
                                        <Reply posts={props.posts} setPosts={props.setPosts} addPost={props.addPost} parentUsernameId={post.id} replies={post.replies}/>
                                    </div>
                                }
                            </React.Fragment>
                        )
                    )
                }
            </div>
    )
}

export default Reply;