import React from "react";
import Post from "./Post";

const Reply = (props) => {
    return(
            <div >
                {
                    props.posts.map((post) => (
                            <React.Fragment>
                                {   
                                    post.replyingTo === props.parentUsername &&
                                    <div className="replies">
                                        <Post post={post} key={post.id} addPost={props.addPost} posts={props.posts} setPosts={props.setPosts} />
                                        <Reply posts={props.posts} setPosts={props.setPosts} addPost={props.addPost} parentUsername={post.id}/>
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