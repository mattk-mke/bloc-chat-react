import React, { Component } from 'react';
import './App.css';
import RoomList from './components/RoomList';
import MessageList from './components/MessageList';
import * as firebase from 'firebase';
 // Initialize Firebase
var config = {
  apiKey: "AIzaSyCS9M1V74kCmCdjFK2sApu0CK3VZEyr6y8",
  authDomain: "bloc-chat-3.firebaseapp.com",
  databaseURL: "https://bloc-chat-3.firebaseio.com",
  projectId: "bloc-chat-3",
  storageBucket: "bloc-chat-3.appspot.com",
  messagingSenderId: "234068065238"
};
firebase.initializeApp(config);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentRoom:[]
    };
  }
  
  handleRoomClick(room, e) {
    this.setState({currentRoom: room});
    console.log(room.key);
  }
    
  render() {
    return (
      <div className="App">
        <RoomList firebase={firebase} handleRoomClick={(room, e) => this.handleRoomClick(room, e)} />
        <MessageList firebase={firebase} currentRoom={this.state.currentRoom} />
      </div>
    );
  }
}

export default App;
