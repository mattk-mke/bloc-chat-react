import React, {Component} from 'react';

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      newMessage: '',
      newMessageEdit: ''
    };

    this.messagesRef = this.props.firebase.database().ref('messages');
  }

  timeConvert(unix) {
    const date = new Date(unix * 1000);
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const time = month + '/' + day + '/' + year + ' @ ' + hours + ':' + minutes.substr(-2) + ' UTC';
    return time;
  }

  sendMessage(e) {
    e.preventDefault();
    this.messagesRef.push({
      content: this.state.newMessage,
      roomId: this.props.currentRoom.key,
      sentAt: Date.now() / 1000,
      username: this.props.currentUser.displayName
    });
  }

  handleChange(e) {
    this.setState({newMessage: e.target.value});
  }


  deleteMessage(message, e) {
    this.messagesRef.child(message.key).remove();
  }

  editMessage(message, e) {
    e.preventDefault();
    this.messagesRef.child(message.key).update({content: this.state.newMessageEdit})
  }

  handleEditChange(e) {
    this.setState({newMessageEdit: e.target.value});
  }

  handleEditToggle(message) {
    let inputBox = document.getElementById("edit-message-" + message.key);
    if (inputBox.style.display === "none") {
      inputBox.style.display = "block";
    } else {
      inputBox.style.display = "none";
    }
  }

  componentDidMount() {
    this.messagesRef.on('child_added', snapshot => {
      const message = snapshot.val();
      message.key = snapshot.key;
      this.setState({ messages: this.state.messages.concat(message), newMessage: '' });
    });
    this.messagesRef.on('child_removed', snapshot => {
      const message = snapshot.val();
      message.key = snapshot.key;
      this.setState({ messages: this.state.messages.filter((msg) => msg.key !== message.key)});
    });
    this.messagesRef.on('child_changed', snapshot => {
      const message = snapshot.val();
      message.key = snapshot.key;
      var messageSlice = this.state.messages.slice();
      const index = messageSlice.map(e => e.key).indexOf(message.key);
      messageSlice[index] = message;
      this.setState({messages: messageSlice, newMessageEdit: ''});
      this.handleEditToggle(message);
    });
  }

  render() {
    return (
      <section className="current-room">
        <h1 className="room-header">{this.props.currentRoom.name}</h1>
        {this.state.messages.filter(msg => msg.roomId === this.props.currentRoom.key).map((message, index) => {
          return (
            <div className="message" key={index}>
              <h2 className="message-username">{message.username}</h2>
              <p className="message-content">{message.content}</p>
              <p className="message-timestamp">Sent: {this.timeConvert(message.sentAt)}</p>
              <div className="room-actions">
                  <button className="delete-message icon ion-md-trash" onClick={this.deleteMessage.bind(this, message)} title="Delete message" />
                  <button className="edit-message-button icon ion-md-create" onClick={this.handleEditToggle.bind(this, message)} title="Edit message" />
                  <form id={"edit-message-" + message.key} style={{display: "none"}} onSubmit={this.editMessage.bind(this, message)} >
                    <input className="edit-input" type="text" value={this.state.newMessageEdit} onChange={this.handleEditChange.bind(this)} placeholder="Enter new message contents..." />
                    <input className="edit-button" type="submit" value="Save" />
                  </form>
              </div>
            </div>
          )}
        )}
        {(this.props.currentRoom.length === 0) ? null :
          <form className="send-message" onSubmit={this.sendMessage.bind(this)}>
              <input id="message-input" type="text" value={this.state.newMessage} onChange={(e) => this.handleChange(e)} placeholder="Enter a new message..." />
              <input type="submit" id="send" value="Send" />
          </form>
        }
        
      </section>
    );
  }
}

export default MessageList;