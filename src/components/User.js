import React, {Component} from 'react';
import avatar from './../assets/guest-avatar.png';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }

  }

  handleClickSignIn() {
    const provider = new this.props.firebase.auth.GoogleAuthProvider();
    this.props.firebase.auth().signInWithPopup( provider );
  }

  handleClickSignOut() {
    this.props.firebase.auth().signOut();
  }

  componentDidMount() {
    this.props.firebase.auth().onAuthStateChanged( user => {
      this.props.setUser(user);
    });
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