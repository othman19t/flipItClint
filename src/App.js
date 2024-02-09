import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
const socket = io('http://localhost:3001/socket');

function App() {
  let [notification, setNotification] = useState([]);
  // Function to get posts
  const getNewPosts = async (postIds) => {
    console.log('getNewPosts running');
    try {
      const response = await axios.get(
        `http://localhost:4000/api/post/posts?ids=${postIds.join(',')}`
      );
      console.log('response.data getposts', response.data); // Handle the response data as needed
      //TODO: @basil12345 => diplay this data response.data.posts
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
          postIds.push(ele._id);
        });
        console.log('postIds: ', postIds);

        getNewPosts(postIds);
        // Handle response from the server

        console.log('response', response);
      }
    );
  };
  useEffect(() => {
    checkForNotifications();
    const intervalId = setInterval(() => {
      console.log('running useEffect');
      checkForNotifications();
    }, 20000);

    return () => clearInterval(intervalId); // Clean up the interval on unmount
  }, []);

  useEffect(() => {}, [notification]);

  return <div>hello world</div>;
}

export default App;
