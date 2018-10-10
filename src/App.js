import React, { Component } from 'react';
import './App.css';
import RoomList from './components/RoomList';
import MessageList from './components/MessageList';
import User from './components/User';
import bloclogo from './assets/bloc-logo.jpg';
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
      currentRoom:[],
      currentUser: null
    };
  }
  
  handleRoomReset() {
    this.setState({currentRoom: [] });
  }

  handleRoomClick(room, e) {
    this.setState({currentRoom: room});
  }
  
  setUser(user) {
    this.setState({currentUser: user})
  }
  
  render() {
    return (
      <div className="App mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
        <header className="mdl-layout__header">
          <h1 className="room-title mdl-layout-title">{this.state.currentRoom.name}</h1>
        </header>

        <div className="rooms mdl-layout__drawer" >
          <header className="drawer-header">
            <img src={bloclogo} id="bloc-logo" alt="Bloc logo"/>
            <h1 className="bloc-chat drawer-header">Chat</h1>
            <User firebase={firebase} setUser={user => this.setUser(user)} currentUser={this.state.currentUser} />
          </header>
          <RoomList firebase={firebase} handleRoomClick={(room, e) => this.handleRoomClick(room, e)} handleRoomReset={this.handleRoomReset.bind(this)} />
        </div>
        <nav className="rooms-nav mdl-navigation"></nav>
        
        <MessageList firebase={firebase} currentRoom={this.state.currentRoom} currentUser={this.state.currentUser} />
      </div>
    );
  }
}

export default App;
