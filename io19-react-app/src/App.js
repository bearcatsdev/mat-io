import React from 'react';
import logo from './logo.svg';
import './App.css';
import Button from 'react-bootstrap/Button';

const anjing = [
];

class MainApp extends React.Component {
    state = { number: 1 };

    onClick = () => {
        this.setState(
            { number: Math.floor(0 + Math.random() * (anjing.length - 0))})
    };
    render() {
        return (
            <div className="App">
                <div className="App-headline">
                    <div className="App-header">Ultimate Meme Generator</div>
                    <Button raised className="App-button" onClick={this.onClick}>Bangsat</Button>
                </div>
                <img class="anjing"
                     src={anjing[this.state.number]}
                />
            </div>
        );
    }
}


function App() {
    return MainApp;
}

export default App;
