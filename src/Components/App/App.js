import React from 'react';
//import logo from './logo.svg';
import './App.css';
import {SearchBar} from "../SearchBar/SearchBar";
import {SearchResults} from "../SearchResults/SearchResults";
import {PlayList} from "../PlayList/PlayList";

class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      searchResults: [
        {name:'searchResult1', artist:'a', album:'a', id:1},
        {name:'searchResult2', artist:'b', album:'b', id:2},
        {name:'searchResult3', artist:'c', album:'c', id:3},
        {name:'searchResult4', artist:'d', album:'d', id:4},
      ],
      playlistName : "someone",
      playlistTracks : [
        {name:'playlistTrack1', artist:'a', album:'a', id:1},
        {name:'playlistTrack2', artist:'b', album:'b', id:2},

      ]
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
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


  removeTrack (track){
    if (this.state.playlistTracks.filter(ele => ele.id === track.id)){
      this.setState({
        playlistTracks : this.state.playlistTracks
      })
    }
  }
  render(){
    return(
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} 
                           onAdd={this.addTrack} onRemove={this.removeTrack}/>
            <PlayList playlistName={this.state.playlistName} 
                      playlistTracks={this.state.playlistTracks}
                      onRemove={this.removeTrack}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
