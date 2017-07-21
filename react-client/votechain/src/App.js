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

class App extends Component {
  render() {
    return (
      <div className="App">
        {elections.map(election =>  {
          return (
            <div key={election.objectID}>
            <span>{election.name}</span>
            <span>{election.voters}</span>
            <span> <br/></span>
            </div>
            );
        })} 
      </div>
    );
  }
}

export default App;
