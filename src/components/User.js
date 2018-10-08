import React, {Component} from 'react';


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
      <div className="user-auth">
        <button id="sign-in" onClick={this.handleClickSignIn.bind(this)}>Sign In</button>
        <button id="sign-out" onClick={this.handleClickSignOut.bind(this)}>Sign Out</button>
        <div>Current user: {(this.props.currentUser === null) ? "Guest" : this.props.currentUser.displayName}</div>
      </div>
    );
  }
}

export default User;