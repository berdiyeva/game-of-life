import React from 'react';
import ReactDOM from 'react-dom';
import { ButtonToolbar } from 'react-bootstrap';
import "./index.css";


// Main component that contains all others 
// The state were set here so it automatically update/propogate through the rest of the program
class App extends React.Component {
	constructor() {
		super();
		this.speed = 100;
		this.rows = 30;
		this.cols = 40;

		this.state = {
      generation: 0,
      // create 30 by 40 grid, 2d array, and set every element to false/dead
			gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false))
		}
	}

  // Method to select the cells
  // Never update the state directly, make a copy!
	selectBox = (row, col) => {
		let gridCopy = arrayClone(this.state.gridFull);
		gridCopy[row][col] = !gridCopy[row][col];
		this.setState({
			gridFull: gridCopy
		});
	}

  // Method to initialize with random alive cells
	seed = () => {
		let gridCopy = arrayClone(this.state.gridFull);
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
        // Create a random num from 0 to 4 and if it equals 1 set the cell true/alive
				if (Math.floor(Math.random() * 4) === 1) {
					gridCopy[i][j] = true;
				}
			}
		}
		this.setState({
			gridFull: gridCopy
		});
	}

	playButton = () => {
		clearInterval(this.intervalId);
		this.intervalId = setInterval(this.play, this.speed);
	}

	pauseButton = () => {
		clearInterval(this.intervalId);
	}

	slow = () => {
		this.speed = 1000;
		this.playButton();
	}

	fast = () => {
		this.speed = 100;
		this.playButton();
	}

	clear = () => {
		var grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
		this.setState({
			gridFull: grid,
			generation: 0
		});
	}

	play = () => {
		let g = this.state.gridFull;
		let g2 = arrayClone(this.state.gridFull);

    // go through every element in the grid
		for (let i = 0; i < this.rows; i++) {
		  for (let j = 0; j < this.cols; j++) {
        // count the neighbours (each cell has eight potential neighbours)
        // if there is a neighbour increase the count
		    let count = 0;
		    if (i > 0) if (g[i - 1][j]) count++;
		    if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
		    if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
		    if (j < this.cols - 1) if (g[i][j + 1]) count++;
		    if (j > 0) if (g[i][j - 1]) count++;
		    if (i < this.rows - 1) if (g[i + 1][j]) count++;
		    if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
        if (i < this.rows - 1 && j < this.cols - 1) if (g[i + 1][j + 1]) count++;
        // decide if the cell dies or stays alive
        // if the cell is alive and the neighbours are less than two or more than three the cell dies
        if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
        // if the cell is dead and there are three alive neighbours the cell becomes alive
		    if (!g[i][j] && count === 3) g2[i][j] = true;
		  }
		}
		this.setState({
		  gridFull: g2,
		  generation: this.state.generation + 1
		});

	}

  // start the game when the page loads and initialize with random alive cells
	componentDidMount() {
		this.seed();
		// this.playButton();
	}

	render() {
		return (
			<div>
				<h1>The Game of Life</h1>
				<Buttons
        // send props to use in component
					playButton={this.playButton}
					pauseButton={this.pauseButton}
					slow={this.slow}
					fast={this.fast}
					clear={this.clear}
					seed={this.seed}
				/>
				<Grid
					gridFull={this.state.gridFull}
					rows={this.rows}
					cols={this.cols}
					selectBox={this.selectBox}
				/>
				<h2>Generations: {this.state.generation}</h2>
			</div>
		);
	}
}

// To make a clone of arr inside arr, stingify it and parse it, as it is nested arr need to do a deep clone
// If it wasnt a nested arr could use a slice method
function arrayClone(arr) {
	return JSON.parse(JSON.stringify(arr));
}


// Box Component that represents each cell
class Box extends React.Component {
  // own selct func, calling func from the props and pass sth
	selectBox = () => {
		this.props.selectBox(this.props.row, this.props.col);
	}

	render() {
		return (
			<div
				className={this.props.boxClass}
				id={this.props.id}
				onClick={this.selectBox}
			/>
		);
	}
}

// Grid component to display set of cells
class Grid extends React.Component {
	render() {
		const width = (this.props.cols * 14);
		var rowsArr = [];
    // the map method also can be used here; loop through every cell/box
		var boxClass = "";
		for (var i = 0; i < this.props.rows; i++) {
			for (var j = 0; j < this.props.cols; j++) {
        // set a cell id 
				let boxId = i + "_" + j;
        // check if the cell is full or not, change the color of the box/cell accordingly
				boxClass = this.props.gridFull[i][j] ? "box on" : "box off";
				rowsArr.push(
					<Box
						boxClass={boxClass}
						key={boxId}
						boxId={boxId}
						row={i}
						col={j}
						selectBox={this.props.selectBox}
					/>
				);
			}
		}

		return (
			<div className="grid" style={{width: width}}>
				{rowsArr}
			</div>
		);
	}
}

// Buttons Component that represents the button list
class Buttons extends React.Component {
	render() {
		return (
			<div className="center">
				<ButtonToolbar>
					<button className="btn btn-default" onClick={this.props.playButton}>
						Play
					</button>
					<button className="btn btn-default" onClick={this.props.pauseButton}>
					  Pause
					</button>
					<button className="btn btn-default" onClick={this.props.clear}>
					  Clear
					</button>
					<button className="btn btn-default" onClick={this.props.slow}>
					  Slow
					</button>
					<button className="btn btn-default" onClick={this.props.fast}>
					  Fast
					</button>
					<button className="btn btn-default" onClick={this.props.seed}>
					  Seed
					</button>
				</ButtonToolbar>
			</div>
			)
	}
}

export default App;
