import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import Card from './components/card';
import './App.css';

//REACT_APP_EVENT_BUZZ
const client = process.env.REACT_APP_CLIENT;
const envetBuzz = process.env.REACT_APP_EVENT_BUZZ;
const api = process.env.REACT_APP_API;
const scrapper = process.env.REACT_APP_SCRAPPER;
const socket = io(`${envetBuzz}/socket`);
function App() {
  let [notification, setNotification] = useState([]);
  let [posts, setPosts] = useState([]);
  const getInitialPostings = async (userId) => {
    console.log('getNewPosts running');
    try {
      const response = await axios.get(`${api}/api/post/all/${userId}`);
      console.log('initial posts', response.data.length); // Handle the response data as needed
      setPosts(response.data.posts);
    } catch (error) {
      console.error('There was an error fetching the posts:', error);
      // Handle the error appropriately
    }
  };
  // Function to get posts
  const getNewPosts = async (postIds) => {
    console.log('getNewPosts running');
    try {
      const response = await axios.get(
        `${api}/api/post/posts?ids=${postIds.join(',')}`
      );
      console.log('response.data getposts', response.data); // Handle the response data as needed
      //TODO: @basil12345 => diplay this data response.data.posts / DONE /
      setPosts((perv) => [...response?.data?.posts, ...perv]);
      return response.data;
    } catch (error) {
      console.error('There was an error fetching the posts:', error);
      // Handle the error appropriately
    }
  };

  const checkForNotifications = () => {
    console.log('checking for updates...');
    socket.emit(
      'getData',
      {
        myData: 'This is data from the client',
        userId: '65c42628634a0830211559f8',
        message:
          'use this id to get unread notifications that contains ids to new posts send these ids to api to get the data and send it to clint to display',
      },
      function (response) {
        let postIds = [];
        response.map((ele) => {
          postIds.push(ele.postLocalId);
        });
        console.log('postIds: ', postIds);
        if (postIds.length > 0) {
          getNewPosts(postIds);
        }

        // Handle response from the server

        console.log('response', response);
      }
    );
  };
  useEffect(() => {
    getInitialPostings('65c42628634a0830211559f8');
    const intervalId = setInterval(() => {
      console.log('running useEffect');
      checkForNotifications();
    }, 60000);

    return () => clearInterval(intervalId); // Clean up the interval on unmount
  }, []);

  useEffect(() => {}, [notification]);

  return (
    <div className='app'>
      <h1 className='posts-header'>Posts {posts.length}</h1>

      <div className='posts'>
        {posts.map((post) => (
          <Card key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default App;
