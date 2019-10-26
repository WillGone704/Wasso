import React, { useState, useEffect } from "react";
import io from "socket.io-client";

import Messages from '../components/Messages/Messages';
import InfoBar from '../components/InfoBar/boxNoti';
import Input from '../components/Input/Input';
import RoomsPanel from '../components/RoomsPanel/roomsPanel';
import UsersPanel from '../components/UsersPanel/usersPanel';


import './Chat.css';

let socket;

export default ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'http://localhost:8080';

  useEffect(() => {
    //Catch the name and room that user put on Login form
    const { name, room } = location.state;

    //Connecting to the server
    socket = io(ENDPOINT);
    

    setRoom(room);
    setName(name)

    socket.emit('join', { name, room }, (error) => {
      if(error) {
        alert(error);
      }
      socket.on('getUsers', ({users})=> setUsers([...users, name]))
    });
  }, [ENDPOINT, location.state]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages([...messages, message ]);
    });

    socket.on('roomData', ({ users }) => {
      setUsers(users);
    })

    return () => {
      socket.emit('disconnect');

      socket.off();
    }
  }, [messages])

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  return (
    <div className="outerContainer">
      <div className="container">
        <section  className="boxNoti">
          <InfoBar room={room}/>
        </section>

        <section className = "messages">
          <Messages messages={messages} name={name} />
        </section>

        <section className = "usersPanel">
          <UsersPanel users = {users}/>
        </section>

        <section className = "input">
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
        </section>
      </div>
    </div>
  );
}

