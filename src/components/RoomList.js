import React, {Component} from 'react';

class RoomList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: []
    };
  
    this.roomsRef = this.props.firebase.database().ref('rooms');
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