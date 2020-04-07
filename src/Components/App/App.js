import React from 'react';
//import logo from './logo.svg';
import './App.css';
import {SearchBar} from "../SearchBar/SearchBar";
import {SearchResults} from "../SearchResults/SearchResults";
import {PlayList} from "../PlayList/PlayList";
import Spotify from "../../util/Spotify";

class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      searchResults: [],
      playlistName : "someone",
      playlistTracks : []
    } 
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  addTrack (track){ // track{}
    // 1. use id to check if the current song is in the playlist
    // 2. if not add the track to the end of the playlist
    if (this.state.playlistTracks.find(element => element.id === track.id )){
      return;
    }
    else {
      this.state.playlistTracks.push(track);
      this.setState( { 
        playlistTracks : this.state.playlistTracks
      });
    }
  }
  // addTrack (track){ 
    // another method use for loop : 
    // let found = false;
    // for (let i = 0; i < this.state.playlistTracks.length; i++){
    //   let playlistTrack = this.state.playlistTracks[i];
    //   if (playlistTrack.id === track.id){
    //     found = true;
    //   }
    // }
    // if (!found) {
    //   this.state.playlistTracks.push(track);
    //   this.setState({playlistTracks : this.props.playlistTracks})
    // }

    // use Array.find()
  // }

  removeTrack (track){
    console.log('remove track called');
    // 1. check if the track exists on the list 
    // 2. if it exists remove it from the array
    // 3. set the array to the state
    if (this.state.playlistTracks.find(ele => ele.id === track.id)){

      // 2. if it exists -> remove it from the array
      let filtered = this.state.playlistTracks.filter(function(el) { return el.id != track.id; }); 

      this.setState({
        playlistTracks : filtered
      });

    }
  }

  updatePlaylistName(name){
    this.setState({
      playlistName : name
    })
  }

  savePlaylist(){
    const trackUris = this.state.playlistTracks;
    Spotify.savePlayList(this.state.playlistName, trackUris).then(()=> {
      this.setState({
        playlistName: "New Playlist",
        playlistTracks: []
      })
    })
  }

  search(term){
    Spotify.search(term).then(searchResults => {
      this.setState({searchResults : searchResults})
    })
  }

  render(){
    return(
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1> 
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} 
                           onAdd={this.addTrack} onRemove={this.removeTrack}/>
            <PlayList playlistName={this.state.playlistName} 
                      playlistTracks={this.state.playlistTracks}
                      onRemove={this.removeTrack}
                      onChange={this.updatePlaylistName} 
                      onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
