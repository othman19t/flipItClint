import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

import Card from "./components/card";
import "./App.css";

//REACT_APP_EVENT_BUZZ
const client = process.env.REACT_APP_CLIENT;
const envetBuzz = process.env.REACT_APP_EVENT_BUZZ;
const api = process.env.REACT_APP_API;
const scrapper = process.env.REACT_APP_SCRAPPER;
const socket = io(`${envetBuzz}/socket`);
function App() {
  let [notification, setNotification] = useState([]);
  let [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [newNotification, setNewNotification] = useState(false);
  const [newNotificationCount, setNewNotificationCount] = useState(0);

  const fetchMoreData = async () => {
    try {
      const userId = "65c42628634a0830211559f8";

      const response = await axios.get(
        `${api}/api/post/all/${userId}?page=${page}`
      );
      const newData = response.data.posts;

      setPosts((prevPosts) => [...prevPosts, ...response.data.posts]);

      if (newData.length === 0) {
        setHasMore(false);
      }

      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Function to get posts
  const getNewPosts = async (postIds) => {
    console.log("getNewPosts running");
    try {
      const response = await axios.get(
        `${api}/api/post/posts?ids=${postIds.join(",")}`
      );
      console.log("response.data getposts", response.data); // Handle the response data as needed
      //TODO: @basil12345 => diplay this data response.data.posts / DONE /
      setPosts((perv) => [...response?.data?.posts, ...perv]);

      setNewNotification(true);
      setNewNotificationCount(...response?.data?.lenght);
      return response.data;
    } catch (error) {
      console.error("There was an error fetching the posts:", error);
      // Handle the error appropriately
    }
  };

  const checkForNotifications = () => {
    console.log("checking for updates...");
    socket.emit(
      "getData",
      {
        myData: "This is data from the client",
        userId: "65c42628634a0830211559f8",
        message:
          "use this id to get unread notifications that contains ids to new posts send these ids to api to get the data and send it to clint to display",
      },
      function (response) {
        let postIds = [];
        response.map((ele) => {
          postIds.push(ele.postLocalId);
        });
        console.log("postIds: ", postIds);
        if (postIds.length > 0) {
          getNewPosts(postIds);
        }

        // Handle response from the server

        console.log("response", response);
      }
    );
  };

  useEffect(() => {
    fetchMoreData();
    const intervalId = setInterval(() => {
      console.log("running useEffect");
      checkForNotifications();
    }, 60000);

    return () => clearInterval(intervalId); // Clean up the interval on unmount
  }, []);

  useEffect(() => {}, [notification]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="app">
      <h1 className="posts-header">Posts {posts.length}</h1>

      {newNotification && (
        <button className="new-notification-btn" onClick={scrollToTop}>
          ^ new notification ({newNotificationCount})
        </button>
      )}

      <InfiniteScroll
        dataLength={posts.length} //This is important field to render the next data
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>You have seen it all</b>
          </p>
        }
      >
        <div className="posts">
          {posts.map((post, idx) => (
            <Card key={idx} post={post.postLocalId} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default App;
