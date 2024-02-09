import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001/socket');

function App() {
  const [privateMessage, setPrivateMessage] = useState('');
  const [groupMessage, setGroupMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [con, setCon] = useState(true);

  const handleConnect = () => {
    socket.connect();
    setCon(true);
  };

  const handleDisconnect = () => {
    socket.disconnect();
    setCon(false);
  };
  // useEffect(() => {
  // socket.on('connect', () => {
  //   console.log('connect');
  // });

  socket.emit('clientEvent', {
    myData: 'This is data from the client',
    userId: '1',
    message:
      'use this id to get unread notifications that contains ids to new posts send these ids to api to get the data and send it to clint to display',
  });
  // Listen for a response from the server
  socket.on('serverResponse', (data) => {
    console.log(data);
  });

  // socket.on('disconnect', () => {
  //   console.log('disconnect');
  // });

  // Listen for private messages
  socket.on('privateMessage', (message) => {
    setReceivedMessages((prevMessages) => [...prevMessages, message]);
  });

  // Listen for group messages
  socket.on('groupMessage', (message) => {
    setReceivedMessages((prevMessages) => [...prevMessages, message]);
  });
  // }, []);

  const handlePrivateMessage = () => {
    // Send private message to recipient
    const recipient = ''; // Replace with recipient's socket ID
    const message = privateMessage;
    socket.emit('privateMessage', { recipient, message });
    setPrivateMessage('');
  };

  const handleGroupMessage = () => {
    // Send group message
    const message = groupMessage;
    socket.emit('groupMessage', message);
    setGroupMessage('');
  };

  return (
    <div>
      {con ? (
        <button style={{ background: 'green' }} onClick={handleDisconnect}>
          Disconnect
        </button>
      ) : (
        <button style={{ background: 'red' }} onClick={handleConnect}>
          Connect
        </button>
      )}

      <h1>Chat Application</h1>
      <h2>Private Messages</h2>
      <input
        type='text'
        value={privateMessage}
        onChange={(e) => setPrivateMessage(e.target.value)}
      />
      <button onClick={handlePrivateMessage}>Send Private Message</button>

      <h2>Group Messages</h2>
      <input
        type='text'
        value={groupMessage}
        onChange={(e) => setGroupMessage(e.target.value)}
      />
      <button onClick={handleGroupMessage}>Send Group Message</button>

      <h2>Received Messages</h2>
      <ul>
        {receivedMessages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
