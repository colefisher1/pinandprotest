import React, {useState} from 'react';
import Form from "react-bootstrap/Form";

const EditDelete = (props) =>{

    const [changeContent, setChangeContent] = useState("");
    //used to display edit form when user clicks edit button
    const [editClick, setEditClick] = useState(false);

    const usernameToken = localStorage.getItem('token');
    const domain = `${window.location.origin === "http://localhost:3000" ? "http://localhost:5000" : window.location.origin}`;

    //what happens when user hits save button after editing
    function submitChanges(event) {
        event.preventDefault();
        
        props.posts.map(post => {
            if(post.id === props.postId){
                post.postContent = changeContent;
                const tempoPosts = props.posts;
                props.setPosts([...tempoPosts]);
                setEditClick(!editClick);
            }
        })
        
        setChangeContent("");
    }

    // const deletePost = (passedPost) => {
        
    //     passedPost.replies.forEach((reply) => deletePost(reply));

    //     passedPost.replies = [];

    //     props.posts.map(post => {
    //         if(post.id === passedPost.id) {
    //             const tempoPosts = props.posts;
    //             tempoPosts.splice(props.posts.indexOf(post), 1);
    //             props.setPosts([...tempoPosts]);
    //         }
    //     })
    // };

    //if delete button is clicked
    const onDeleteClick = (event) => {
        event.preventDefault();

        console.log('hello');

        fetch(`${domain}/api/reports`, {
            method: "DELETE",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              usernameToken,
              deleteID: props.postId
            })
          })
            .then((res) => {
                console.log(res);

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
                      props.setPosts([...data]);
                    });
            });
            
        

        // props.posts.map(post => {
        //     if(post.id === props.postId){
        //         props.posts.forEach(parent => {
        //             if (parent.id === post.replyingTo) {
        //                 parent.replies.forEach((reply, i) => {
        //                     if(reply.id === post.id)
        //                         parent.replies.splice(i, 1);
        //                 })
        //             }
        //         })
        //         deletePost(props.posts[props.posts.indexOf(post)]);
        //     }
        // })
    }

    //what happens when edit button is clicked
    const editing = props.posts.map(post => {
            if(post.id === props.postId){
                return (
                    <div>
                        {/*Edit form*/}
                        <Form>
                            <textarea  
                                value={changeContent} 
                                onChange={(e) => setChangeContent(e.target.value)} 
                                className="form-control"
                                placeholder={post.postContent}
                            > 
                            </textarea>

                            <button type="button" className="save-button" onClick={submitChanges}>
                                Save
                            </button>
                        </Form>
                    </div>
                )
            }
        })

    return(
        <React.Fragment>
            <div className="edit-button">
                <span  onClick={() => {
                    setEditClick(!editClick);
                    setChangeContent(props.postContent);
                    }} >
                        <i class="far fa-edit" style={{marginRight: "5px"}}></i>
                        Edit
                </span>
            </div>
            <div className="delete-button">
                <i class="far fa-trash-alt" style={{marginRight: "5px"}}></i>
                <span onClick={onDeleteClick}>Delete</span>
            </div>
            <div>
                {editClick && editing}
            </div>
        </React.Fragment>
    )
}

export default EditDelete;