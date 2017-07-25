import React, { Component } from 'react';
import './App.css';

const elections = [
    {
        "_id": "5955cb358d8840b9049ab152",
        "votechain": "5955cb358d8840b9049ab153",
        "__v": 0,
        "voters": []
    },
    {
        "_id": "595a94e8dbd111fe1e8b4acb",
        "votechain": "595a94e8dbd111fe1e8b4acc",
        "name": "USGeneralElection",
        "__v": 0,
        "voters": []
    },
    {
        "_id": "5955c9588d8840b9049ab14f",
        "votechain": "5955c9588d8840b9049ab150",
        "name": "USGeneralElection",
        "__v": 0,
        "voters": [
            "5955c91b8d8840b9049ab14d",
            "5955c91b8d8840b9049ab14d"
        ]
    },
    {
        "_id": "595a9b3d566318551fcecdf7",
        "votechain": "595a9b3d566318551fcecdf8",
        "name": "BRGeneralElection",
        "__v": 0,
        "voters": []
    }
];

function isSearched(searchTerm) {
  return function(item) {
    return !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      elections,
      searchTerm: '',
      socketsList: [],
    };
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }
  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }
  onDismiss(_id) {
    function isNotId(item) {
      return item._id !== _id;
    }
    const updatedElections = this.state.elections.filter(isNotId);
    this.setState({ elections: updatedElections });
  }

  render() {
    return (
      <div className="App">
      <form>
        <input type="text" onChange={this.onSearchChange}/>
      </form>
       {this.state.elections.filter(isSearched(this.searchTerm)).map(item => 
            <div>
            <span>{election.name}</span>
            <span>{election.voters}</span>
            </div>
        )}
        {this.state.elections.map(election =>
            <div key={election._id}>
            <span>{election.name}</span>
            <span>{election.voters}</span>
            <span>
              <button onClick={() => this.onDismiss(election._id)} type="button">
              Dismiss
              </button>
            </span>
            <span> <br/></span>
            </div>
        )} 
        {this.state.socketsList.map(socket => 
          <div key={socket.objectID}></div>
        )}
    )
  }
}

export default App;
