import React, {useState} from "react";
import PostAddition from "./PostAddition";
import Post from "./Post";
import Reply from "./Reply";

const Discussion = () => {
    const [showPostForm, setShowPostForm] = useState(false);
    const [posts, setPosts] = useState([]);

    //passing user post content
    function addPost(post, username, parentCommentId, isThread, nameOfThread) {
        //console.log("this post Content from POdt addition: " + post);

        //push post to posts array
        const previousPosts = posts;
        
        const newPost = {
            id: previousPosts.length + 1, 
            isThread: isThread,
            thread: {
                name: nameOfThread,
                  //eventually pass in pin, not sure how that would work, ask for pin link when creating thread maybe
            },
            postContent: post, 
            userName: username, 
            replyingTo: parentCommentId, 
            replies: []
        }
        //dont really want to push a post this way, change code to deal with database
        previousPosts.push(newPost);

        previousPosts.forEach((post) => {
            if(post.id === parentCommentId)
                post.replies.push(newPost);
        })

        setPosts([...previousPosts]);

        console.log("array of comments: ", previousPosts);
    } 

    return(
        <div>
            <div className="post-component">
                {
                    posts.map((post) => (
                            (
                                !post.replyingTo &&
                                <React.Fragment>
                                        <Post post={post} key={post.id} addPost={addPost} posts={posts} setPosts={setPosts} />
                                        <Reply posts={posts} setPosts={setPosts} addPost={addPost} parentUsernameId={post.id} replies={post.replies}/>
                                </React.Fragment>
                            )
                        )
                    )
                }
            </div>
            <div>
                {showPostForm && <PostAddition addPost={addPost} showPostForm={showPostForm} setShowPostForm={setShowPostForm}/>}
            </div>
            <div class="spacer">.....</div>
            <div className="Footer">
                <button className="thread-button" onClick= {() => setShowPostForm(!showPostForm)}>
                    Start new thread
                </button>
            </div>
        </div>
    )
}

export default Discussion;