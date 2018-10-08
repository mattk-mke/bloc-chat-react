import React, {Component} from 'react';

class RoomList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
      rname: ''
    };
  
    this.roomsRef = this.props.firebase.database().ref('rooms');
  }

  createRoom(e) {
    e.preventDefault();
    this.roomsRef.push({
      name: this.state.rname
    })
  }

  handleRnameChange(e) {
    this.setState({rname: e.target.value});
  }

  componentDidMount() {
    this.roomsRef.on('child_added', snapshot => {
      const room = snapshot.val();
      room.key = snapshot.key;
      this.setState({ rooms: this.state.rooms.concat(room) });
    });
  }

  render() {
    return (
      <section className="rooms">
        <h1>Bloc Jams</h1>
        <form className="new-room" action="" onSubmit={this.createRoom.bind(this)}>
          <div className="room-input">
            <label htmlFor="rname">Enter a room name:</label>
            <input type="text" value={this.state.rname} id="rname" required onChange={this.handleRnameChange.bind(this)} />
          </div>
          <div className="room-input">
            <input type="submit" value="Create" />
          </div>

        </form>
        <ul className="rooms-list">
          {this.state.rooms.map( (room, index) => {
            return (
              <li className="room-data" key={index + 1}>{room.name}</li>
            )}
          )}
        </ul>
      </section>
    );
  }
}

export default RoomList;