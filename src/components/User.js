import React, {Component} from 'react';
import avatar from './../assets/guest-avatar.png';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
    
    this.usersRef = this.props.firebase.database().ref('users');
  }

  handleClickSignIn() {
    const provider = new this.props.firebase.auth.GoogleAuthProvider();
    this.props.firebase.auth().signInWithPopup( provider );
  }

  handleClickSignOut() {
    this.props.firebase.auth().signOut();
    this.usersRef.child(this.props.currentUser.uid).set({
      username: this.props.currentUser.displayName,
      online: false,
      photoURL: this.props.currentUser.photoURL
    });
  }

  componentDidMount() {
    this.props.firebase.auth().onAuthStateChanged( user => {
      this.props.setUser(user);
      if (this.props.currentUser) {
        this.usersRef.child(this.props.currentUser.uid).set({
          username: this.props.currentUser.displayName,
          online: true,
          photoURL: this.props.currentUser.photoURL
        })}
      });

    

    window.addEventListener('beforeunload', (e) => {
      e.preventDefault();
      this.usersRef.child(this.props.currentUser ? this.props.currentUser.uid : "guest").set({
        online: false,
        username: this.props.currentUser ? this.props.currentUser.displayName : "guest user",
        photoURL: this.props.currentUser ? this.props.currentUser.photoURL : './../assets/guest-avatar.png'
      });
    })
  }

  render() {
    
    return (
      <div className="user-auth drawer-header">
        {
          !this.props.currentUser ? 
          <div>
            <img id="avatar" src={avatar} alt="Avatar"/>
            <button id="sign-in" onClick={this.handleClickSignIn.bind(this)} className="mdl-button mdl-js-button mdl-button--primary">Sign In</button>
            <div className="current-user">Guest User</div>
          </div> :
          <div>
            <img id="avatar" src={this.props.currentUser.photoURL} alt="Avatar"/>
            <button id="sign-out" onClick={this.handleClickSignOut.bind(this)} className="mdl-button mdl-js-button mdl-button--primary">Sign Out</button>
            <div className="current-user">{this.props.currentUser.displayName}</div>
          </div>
        }
      </div>
    );
  }
}

export default User;