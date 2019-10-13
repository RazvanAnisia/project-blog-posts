import React from 'react';
import './App.scss';

class App extends React.Component {
  state = {
    apiData: null,
    titleValue: '',
    descriptionValue: '',
    formState: 'post',
    selectedPostId: ''
  };

  componentDidMount() {
    this.fetchApiData();
  }

  fetchApiData() {
    fetch('http://localhost:9000/posts')
      .then(res => res.json())
      .then(res => this.setState({ apiData: res }))
      .catch(err => alert(err));
  }

  deletePost(id) {
    fetch(`http://localhost:9000/posts/${id}`, {
      method: 'DELETE'
    })
      .then(() => this.fetchApiData())
      .then(() => console.log('deletedPost'))
      .catch(err => alert(err));
  }

  updatePost() {
    fetch(`http://localhost:9000/posts/${this.state.selectedPostId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: this.state.titleValue,
        description: this.state.descriptionValue
      })
    })
      .then(() => this.fetchApiData())
      .catch(err => alert(err));
  }

  formatDate(date) {
    const formattedDate = new Date(date);
    return formattedDate.toDateString();
  }

  handleFormReset = () => {
    this.setState({
      formState: 'post',
      titleValue: '',
      descriptionValue: ''
    });
  };

  handleTitleChange = e => {
    //  console.log(e.target.value);
    this.setState({ titleValue: e.target.value });
  };

  handleDeleteClick = id => {
    this.deletePost(id);
  };

  handlePostSelect = id => {
    console.log(id);
    const selectedPost = this.state.apiData.find(el => el['_id'] === id);
    console.log(selectedPost);
    //update the state of the form

    this.setState({
      formState: 'update',
      titleValue: selectedPost.title,
      descriptionValue: selectedPost.description,
      selectedPostId: selectedPost['_id']
    });
  };

  handleFormSubmit = e => {
    e.preventDefault();
    // console.log(this.state);
    if (this.state.formState === 'post') {
      fetch('http://localhost:9000/posts', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: this.state.titleValue,
          description: this.state.descriptionValue
        })
      })
        .then(() => this.fetchApiData())
        .catch(err => alert(err));
    } else if (this.state.formState === 'update') {
      this.updatePost();
    }

    console.log('form was submitted');
  };

  handleDescriptionChange = e => {
    // console.log(e.target.value);
    this.setState({ descriptionValue: e.target.value });
  };

  render() {
    console.log(this.state);
    return (
      <div className="app-container">
        <h2>Blog Posts</h2>
        {this.state.apiData &&
          this.state.apiData.map(el => (
            <div className="post-card" key={el['_id']}>
              <h3>{el.title}</h3>
              <p>{el.description}</p>
              <p className="date-details">
                Originally posted on: {this.formatDate(el.date)}
              </p>
              <span
                className="delete-btn"
                onClick={() => this.handleDeleteClick(el['_id'])}>
                X
              </span>
              <a className="read-more-btn" href={'#'}>
                Read More
              </a>
              <button
                className="btn"
                onClick={() => this.handlePostSelect(el['_id'])}>
                Update post
              </button>
            </div>
          ))}
        <p>Add a post:</p>
        <form onSubmit={e => this.handleFormSubmit(e)}>
          <input
            value={this.state.titleValue}
            onChange={e => this.handleTitleChange(e)}
            placeholder="Title"
            type="text"
            name="tile"
          />
          <br />
          <textarea
            value={this.state.descriptionValue}
            onChange={e => this.handleDescriptionChange(e)}
            placeholder="Description"
            name="description"></textarea>
          <br />
          <button type="submit">Add Post</button>
        </form>
        <button onClick={this.handleFormReset}>Cancel Update</button>
      </div>
    );
  }
}

export default App;

//Add validation for form
//Create :
/*
- Layout component
- Form component
- Add React toastify for posting or upadting confirmation, errors
- Post Card component
- Post title
- Post description
- Delete button
- Button componennt
- Separate update methods
- Put website and api on heroku
- Add routing using the id
- Add file uploading capabilities: 
 * https://medium.com/@alvenw/how-to-store-images-to-mongodb-with-node-js-fb3905c37e6d
 * https://programmingwithmosh.com/javascript/react-file-upload-proper-server-side-nodejs-easy/

 */
