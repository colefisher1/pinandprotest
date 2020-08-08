import React, {useState, useEffect} from "react";
import PostAddition from "./PostAddition";
import Post from "./Post";
import Reply from "./Reply";

const Discussion = () => {
    const [showPostForm, setShowPostForm] = useState(false);
    const [posts, setPosts] = useState([]);

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
        .then((data) => setPosts([...data]));
    }, []);

    console.log('teeeest', posts);


    //passing user post content
    function addPost(post, replyingTo) {
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
            usernameToken: usernameToken,
            post,
            replyingTo
          })
        })
          .then((res) => res.json())
          .then((data) => {
            previousPosts.push({
              _id: data.commentID,
              user: data.user,
              username: data.username,
              replyingToID: null,
              replyingTo: null,
              content: post,
              likes: 0,
              dislikes: 0,
              date: data.date
            });

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
                                !post.replyingTo &&
                                <React.Fragment>
                                        <Post post={post} key={post.id} addPost={addPost} posts={posts} setPosts={setPosts} />
                                        <Reply posts={posts} setPosts={setPosts} addPost={addPost} parentUsername={post.id}/>
                                </React.Fragment>
                            )
                        )
                    )
                }
            </div>
            <div>
                {showPostForm && <PostAddition addPost={addPost} showPostForm={showPostForm} setShowPostForm={setShowPostForm}/>}
            </div>
            <div className="Footer">
                <button className="thread-button" onClick= {() => setShowPostForm(!showPostForm)}>
                    Start new thread
                </button>
            </div>
        </div>
    )
}

export default Discussion;