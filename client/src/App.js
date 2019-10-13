import React from 'react';
import './App.scss';

import { ToastContainer, toast } from 'react-toastify';
import Loader from 'react-loader-spinner';
import Error from './components/Error';

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import 'react-toastify/dist/ReactToastify.css';

class App extends React.Component {
  state = {
    apiData: null,
    titleValue: '',
    descriptionValue: '',
    formState: 'post',
    selectedPostId: '',
    sortChronologically: false,
    isLoading: true,
    appError: false
  };

  formRef = React.createRef();
  updateRef = React.createRef();

  componentDidMount() {
    this.fetchApiData();
  }

  fetchApiData() {
    fetch('http://localhost:9000/posts')
      .then(res => res.json())
      .then(res => this.setState({ apiData: res, isLoading: false }))
      .catch(err => {
        this.setState({ appError: true });
        toast('There was an error fetching the posts');
      });
  }

  deletePost(id) {
    fetch(`http://localhost:9000/posts/${id}`, {
      method: 'DELETE'
    })
      .then(() => this.fetchApiData())
      .then(() => console.log('deletedPost'))
      .catch(err => {
        this.setState({ appError: true });
        toast('There was an error', err);
      });
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
      .catch(err => {
        this.setState({ appError: true });
        toast('There was an error', err);
      });
  }

  formatDate(date) {
    const formattedDate = new Date(date);
    return formattedDate.toDateString();
  }

  handleFormReset = () => {
    this.setState({
      formState: 'post',
      titleValue: '',
      descriptionValue: '',
      selectedPostId: null
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
    this.formRef.current.scrollIntoView({ behavior: 'smooth' });
    const selectedPost = this.state.apiData.find(el => el['_id'] === id);
    console.log(selectedPost);
    this.updateRef.current.focus();
    //update the state of the form

    this.setState({
      formState: 'update',
      titleValue: selectedPost.title,
      descriptionValue: selectedPost.description,
      selectedPostId: selectedPost['_id']
    });
  };

  formValidation = () => {
    if (!this.state.titleValue || !this.state.descriptionValue) {
      toast('Please add a title and a description', { autoClose: 2000 });
      return false;
    } else {
      return true;
    }
  };
  handleFormSubmit = e => {
    e.preventDefault();
    // console.log(this.state);
    if (this.formValidation()) {
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
          .then(() => {
            this.setState({
              titleValue: '',
              descriptionValue: ''
            });
            this.fetchApiData();
            toast('Post added', { autoClose: 2000 });
            console.log('form was submitted');
          })
          .catch(err => toast(err, { autoClose: 2000 }));
      } else if (this.state.formState === 'update') {
        this.updatePost();
        toast('Post updated', { autoClose: 2000 });
        console.log('form was submitted');
      }
    }
  };

  handleDescriptionChange = e => {
    // console.log(e.target.value);
    this.setState({ descriptionValue: e.target.value });
  };

  handleSortByDate = () => {
    const sorted = this.state.apiData.slice().sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });
    if (!this.state.sortChronologically) {
      this.setState({ apiData: sorted, sortChronologically: true });
    } else {
      this.setState({ apiData: sorted.reverse(), sortChronologically: false });
    }
  };
  render() {
    console.log(this.state);

    if (this.state.appError) {
      return (
        <div className="app-container">
          <ToastContainer className="toast-notification" />
          <Error />
        </div>
      );
    }
    if (this.state.isLoading) {
      return (
        <div className="app-container">
          <ToastContainer className="toast-notification" />

          <Loader
            className="loader"
            type="Rings"
            color="purple"
            height={150}
            width={150}
          />
        </div>
      );
    }
    return (
      <div className="app-container">
        <ToastContainer className="toast-notification" />
        <h2 ref={this.formRef}>Blog Posts</h2>
        <p>{this.state.selectedPostId ? 'Update the post' : 'Add a post'}</p>
        <div className="form-container">
          <form onSubmit={e => this.handleFormSubmit(e)}>
            <input
              ref={this.updateRef}
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
              placeholder="Your blog post goes here"
              name="description"></textarea>
            <br />
            <button className="add-btn" type="submit">
              Add Post
            </button>
          </form>
          {this.state.selectedPostId ? (
            <button className="cancel-btn" onClick={this.handleFormReset}>
              Cancel Update
            </button>
          ) : null}
        </div>
        <button onClick={this.handleSortByDate} className="sort-btn">
          See
          {this.state.sortChronologically ? (
            <span className="sort-param"> OLDEST</span>
          ) : (
            <span className="sort-param"> LATEST</span>
          )}
        </button>
        <div className="posts-container">
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
                  x
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
        </div>
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
