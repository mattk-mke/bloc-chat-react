import React, {Component} from 'react';
import dialogPolyfill from 'dialog-polyfill';

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
    var dialog = document.querySelector('dialog');
    var showDialogButton = document.querySelector('#create-room');
    if (! dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
    showDialogButton.addEventListener('click', function() {
      dialog.showModal();
    });
    dialog.querySelector('.close').addEventListener('click', function() {
      dialog.close();
    });
    dialog.querySelector('.create').addEventListener('click', function() {
      dialog.close();
    });

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
      <section className="rooms" >
        <nav className="rooms-list mdl-navigation">
          {this.state.rooms.map( room => {
            return (
              <div className="room-row" key={room.key}>
                
                {/* <button id={"demo-menu-lower-left" + room.key} className="mdl-button mdl-js-button mdl-button--icon">
                  <i className="material-icons">more_vert</i>
                </button>

                <ul className="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect" htmlFor={"demo-menu-lower-left" + room.key}>
                  <li className="mdl-menu__item">Some Action</li>
                  <li className="mdl-menu__item mdl-menu__item--full-bleed-divider">Another Action</li>
                  <li disabled className="mdl-menu__item">Disabled Action</li>
                  <li className="mdl-menu__item">Yet Another Action</li>
                </ul>

                ^^^ Sample test
                ------ Possible Material menu implementation ---------

                <button id={"room-actions-" + room.key} className="room-actions mdl-button mdl-js-button mdl-button--icon">
                  <i className="material-icons">more_vert</i>
                </button> 
                <ul className="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect" htmlFor={"#room-actions-" + room.key}>
                  <li className="mdl-menu__item">Delete Room</li>
                  <li className="mdl-menu__item mdl-menu__item--full-bleed-divider">Rename Room</li>
                </ul>*/}
                <div className="room-name mdl-navigation__link"  onClick={this.props.handleRoomClick.bind(this, room)}>{room.name}</div>
                  <div className="room-actions">
                    <button className="delete-room-button mdl-button mdl-js-button mdl-button--icon mdl-button--colored" onClick={this.deleteRoom.bind(this, room)} title="Delete room">
                      <i class="material-icons">delete</i>
                    </button>
                    <button className="rename-room-button mdl-button mdl-js-button mdl-button--icon mdl-button--colored" onClick={this.handleRenameToggle.bind(this, room)} title="Rename room">
                      <i class="material-icons">edit</i>
                    </button>
                    </div>
                  <form id={"rename-room-" + room.key} style={{display: "none"}} onSubmit={this.renameRoom.bind(this, room)} >
                    <input className="rename-input mdl-textfield mdl-js-textfield" type="text" value={this.state.rnewname} onChange={this.handleRnewnameChange.bind(this)} placeholder="Enter a new room name..."  />
                    <input className="rename-button mdl-button mdl-js-button mdl-button--accent" type="submit" value="Rename" />
                  </form>
                
              </div>
            )}
          )}
        </nav>
        <div className="create-container">
          <button id="create-room" type="button" className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent">Create Room</button>
        </div>
        <dialog className="mdl-dialog">
          <h4 className="dialog-title mdl-dialog__title">Create new chat room</h4>
          <form className="new-room" action="" onSubmit={this.createRoom.bind(this)}>
          <div className="room-input mdl-textfield mdl-js-textfield">
            <input type="text" value={this.state.rname} id="rname" required onChange={this.handleRnameChange.bind(this)} placeholder="Enter a room name..." className="mdl-textfield mdl-js-textfield" />
          </div>
          <div className="room-input">
            <button className="cancel mdl-button close">Cancel</button>
            <input type="submit" className="create mdl-button mdl-js-button mdl-button--raised mdl-button--accent" value="Create" />
          </div>
          </form>
        </dialog>
        
      </section>
    )
  }
}

export default RoomList;