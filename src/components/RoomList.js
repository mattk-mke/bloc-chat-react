import React, {Component} from 'react';

class RoomList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
      rname: '',
      rnewname: ''
    };
  
    this.roomsRef = this.props.firebase.database().ref('rooms');
  }

  createRoom(e) {
    e.preventDefault();
    this.roomsRef.push({
      name: this.state.rname
    })
  }

  deleteRoom(room, e) {
    this.roomsRef.child(room.key).remove();
  }

  renameRoom(room, e) {
    e.preventDefault();
    this.roomsRef.child(room.key).update({name: this.state.rnewname})
  }

  handleRnameChange(e) {
    this.setState({rname: e.target.value});
  }

  handleRnewnameChange(e) {
    this.setState({rnewname: e.target.value});
  }

  handleRenameToggle(room) {
    let inputBox = document.getElementById("rename-room-" + room.key);
    if (inputBox.style.display === "none") {
      inputBox.style.display = "block";
    } else {
      inputBox.style.display = "none";
    }
  }
  

  componentDidMount() {
    this.roomsRef.on('child_added', snapshot => {
      const room = snapshot.val();
      room.key = snapshot.key;
      this.setState({ rooms: this.state.rooms.concat(room), rname: '' });
    });
    this.roomsRef.on('child_removed', snapshot => {
      const room = snapshot.val();
      room.key = snapshot.key;
      this.setState({ rooms: this.state.rooms.filter((rm) => rm.key !== room.key)});
      this.props.handleRoomReset();
    });
    this.roomsRef.on('child_changed', snapshot => {
      const room = snapshot.val();
      room.key = snapshot.key;
      var roomSlice = this.state.rooms.slice();
      const index = roomSlice.map(e => e.key).indexOf(room.key);
      roomSlice[index] = room;
      this.setState({rooms: roomSlice, rnewname: ''});
      this.handleRenameToggle(room);
    });

  }

  render() {
    return (
      <section className="rooms">
        <h1>Bloc Chat</h1>
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
          {this.state.rooms.map( room => {
            return (
              <div className="room-row" key={room.key}>
                <li className="room-data"  onClick={this.props.handleRoomClick.bind(this, room)}>{room.name}</li>
                <div className="room-actions">
                  <button className="delete-room icon ion-md-trash" onClick={this.deleteRoom.bind(this, room)} />
                  <button className="rename-room-button icon ion-md-create" onClick={this.handleRenameToggle.bind(this, room)} />
                  <form id={"rename-room-" + room.key} style={{display: "none"}} onSubmit={this.renameRoom.bind(this, room)} >
                    <input className="rename-input" type="text" value={this.state.rnewname} onChange={this.handleRnewnameChange.bind(this)} placeholder="Enter a new room name..." />
                    <input className="rename-button" type="submit" value="Rename" />
                  </form>
                </div>
              </div>
            )}
          )}
        </ul>
      </section>
    );
  }
}

export default RoomList;