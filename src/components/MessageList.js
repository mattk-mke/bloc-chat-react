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
    if (this.state.newMessage === '') {return -1}
    
    this.messagesRef.push({
      content: this.state.newMessage,
      roomId: this.props.currentRoom.key,
      sentAt: Date.now() / 1000,
      username: (this.props.currentUser === null) ? "Guest User" : this.props.currentUser.displayName
    });
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
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
      window.scrollTo(0, document.body.scrollHeight);
    });
    window.scrollTo(0, 99999);
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

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    return (
      <section className="current-room mdl-layout__content">
        {(this.props.currentRoom.length === 0) ? 
          <div>
            <i className="greeting-icon material-icons">message</i>
            <h2 className="greeting">Welcome to Bloc Chat! Pick a room to read your messages.</h2>
          </div>
          : null}
        <section className= "messages-list">
          {this.state.messages.filter(msg => msg.roomId === this.props.currentRoom.key).map((message, index) => {
            return (
              <div className="message" key={index}>
                <h2 className="message-username">{message.username}</h2>
                <p className="message-content">{message.content}</p>
                <p className="message-timestamp">Sent: {this.timeConvert(message.sentAt)}</p>
                <div className="message-actions">
                    <button className="delete-message-button mdl-button mdl-js-button mdl-button--icon mdl-button--colored" onClick={this.deleteMessage.bind(this, message)} title="Delete message">
                      <i class="material-icons">delete</i>
                    </button>
                    <button className="edit-message-button mdl-button mdl-js-button mdl-button--icon mdl-button--colored" onClick={this.handleEditToggle.bind(this, message)} title="Edit message">
                      <i class="material-icons">edit</i>
                    </button>
                    <form id={"edit-message-" + message.key} style={{display: "none"}} onSubmit={this.editMessage.bind(this, message)} >
                      <input className="edit-input mdl-textfield mdl-js-textfield" type="text" value={this.state.newMessageEdit} onChange={this.handleEditChange.bind(this)} placeholder="Enter new message contents..." />
                      <input className="edit-button mdl-button mdl-js-button mdl-button--accent" type="submit" value="Save" />
                    </form>
                </div>
              </div>
            )}
          )}
          <div style={{ float:"left", clear: "both" }}
              ref={(el) => { this.messagesEnd = el; }}>
          </div>
        </section>
        {(this.props.currentRoom.length === 0) ? null :
              <section className="sticky-message">
                <form className="send-message mdl-textfield mdl-js-textfield" onSubmit={this.sendMessage.bind(this)}>
                    <input id="message-input" type="text" value={this.state.newMessage} onChange={(e) => this.handleChange(e)} className="mdl-textfield__input" placeholder="Enter a new message..."/>
                    <span className="submit-container">
                      <input type="submit" id="send" value="Send" className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent" />
                    </span>
                </form>
              </section>
          }
      </section>
    );
  }
}

export default MessageList;