import React, {useState, useEffect} from "react";
import PostAddition from "./PostAddition";
import Post from "./Post";
import Reply from "./Reply";

const Discussion = () => {
    const [showPostForm, setShowPostForm] = useState(false);
    const [posts, setPosts] = useState([]);
    localStorage.removeItem("map_location");

    const domain = `${window.location.origin === "http://localhost:3000" ? "http://localhost:5000" : window.location.origin}`;

    const usernameToken = localStorage.getItem('token');

    //fetching all comments from the database
    useEffect(() => {
      fetch(`${domain}/api/reports`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        }
      })
        .then((res) => res.json())
        .then((data) => {
          data.forEach((comment) => {
            comment.replies.forEach((reply, index) => {
              data.forEach((child) => {
                if(child._id === reply)
                  comment.replies[index] = child;
              })
            });
          })
          setPosts([...data]);
        });
    }, []);

    console.log('comments',posts);

    //passing user post content
    function addPost(post, replyingToID) {
        //console.log("this post Content from POdt addition: " + post);

        //push post to posts array
        const previousPosts = posts;
       
        //saves post to db and gets username
        fetch(`${domain}/api/reports`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            usernameToken,
            post,
            replyingToID
          })
        })
          .then((res) => res.json())
          .then((data) => {
            previousPosts.push({
              _id: data.commentID,
              user: data.user,
              username: data.username,
              replyingToID: data.replyingToID,
              replyingTo: data.replyingTo,
              content: post,
              replies: [],
              likes: 0,
              dislikes: 0,
              date: data.date
            });

            if(previousPosts[previousPosts.length - 1].replyingToID !== null) {
              previousPosts.forEach((myPost) => {
                if(myPost._id == previousPosts[previousPosts.length - 1].replyingToID) {
                  myPost.replies.push(previousPosts[previousPosts.length - 1]);
                }
              })
            }

            console.log('is njullll', previousPosts[previousPosts.length - 1].replyingToID === null)

            setPosts([...previousPosts]);
          })
          
          // user: {
          //   type: mongoose.Schema.Types.ObjectId,
          //   ref: 'account',
          //   required: true
          // },
          // username: {
          //   type: String,
          //   required: true
          // },
          // replyingToID: {
          //   type: mongoose.Schema.Types.ObjectId,
          //   ref: 'account',
          //   required: true
          // },
          // replyingTo: String,
          // content: {
          //   type: String,
          //   required: true
          // },
          // likes: {
          //   type: Number,
          //   required: true,
          //   default: 0
          // },
          // dislikes: {
          //   type: Number,
          //   required: true,
          //   default: 0
          // },
          // date: {
          //   type: Date,
          //   default: Date.now,
          //   required: true
          // }
        
        console.log('mePosts', posts);

    }

    return(
        <div>
            <div className="post-component">
                {
                    posts.map((post) => (
                            (
                                !post.replyingToID &&
                                <React.Fragment>
                                        <Post post={post} key={post._id} addPost={addPost} posts={posts} setPosts={setPosts} />
                                        <Reply posts={posts} setPosts={setPosts} addPost={addPost} parentUsernameId={post._id} replies={post.replies}/>
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