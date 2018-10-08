import React, {Component} from 'react';

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
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
    const time = month + '/' + day + '/' + year + ' @ ' + hours + ':' + minutes.substr(-2);
    return time;
  }

  componentDidMount() {
    this.messagesRef.on('child_added', snapshot => {
      const message = snapshot.val();
      message.key = snapshot.key;
      this.setState({ messages: this.state.messages.concat(message) });
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
            </div>
          ) || <div className="empty">There are no messages in this room</div>}
        )}
      </section>
    );
  }
}

export default MessageList;