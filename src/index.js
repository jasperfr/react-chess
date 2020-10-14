import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { white } from 'ansi-colors';

/*
  chess piece list
  0 - nothing
  1 - pawn (forward)
  2 - knight (1-2)
  3 - rook (horizontal)
  4 - bishop (diagonal)
  5 - queen (hori + dia)
  6 - king (1)
*/

class Tile extends React.Component {
  render() {
    return (
      <button
        className={"square" + this.props.selected + " " + (this.props.canmove ? 'movable' : '')}
        onClick={() => this.props.onClick()}
      >
        {this.props.chessPiece && <img src={'img/' + this.props.chessPiece + '_' + this.props.team + '.png'} alt="" />}
      </button>
    )
  }
}

class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tiles: [
        [['rook', 'b', false], ['knight', 'b', false], ['bishop', 'b', false], ['king', 'b', false], ['queen', 'b', false], ['bishop', 'b', false], ['knight', 'b', false], ['rook', 'b', false]],
        [['pawn', 'b', false], ['pawn', 'b', false],   ['pawn', 'b', false],   ['pawn', 'b', false], ['pawn', 'b', false],  ['pawn', 'b', false],   ['pawn', 'b', false],   ['pawn', 'b', false]],
        [[null, null, false],  [null, null, false],    [null, null, false],    [null, null, false],   [null, null, false],  [null, null, false],    [null, null, false],    [null, null, false]],
        [[null, null, false],  [null, null, false],    [null, null, false],    [null, null, false],   [null, null, false],  [null, null, false],    [null, null, false],    [null, null, false]],
        [[null, null, false],  [null, null, false],    [null, null, false],    [null, null, false],   [null, null, false],  [null, null, false],    [null, null, false],    [null, null, false]],
        [[null, null, false],  [null, null, false],    [null, null, false],    [null, null, false],   [null, null, false],  [null, null, false],    [null, null, false],    [null, null, false]],
        [['pawn', 'w', false], ['pawn', 'w', false],   ['pawn', 'w', false],   ['pawn', 'w', false],  ['pawn', 'w', false], ['pawn', 'w', false],   ['pawn', 'w', false],   ['pawn', 'w', false]],
        [['rook', 'w', false], ['knight', 'w', false], ['bishop', 'w', false], ['queen', 'w', false], ['king', 'w', false], ['bishop', 'w', false], ['knight', 'w', false], ['rook', 'w', false]],
      ],
      selectedTile: [],
      selectedPosition: [-1, -1],
      whiteIsCurrent: true,
    }
  }

  moveChessPiece(x, y) {
    const chessGrid = this.state.tiles.slice();
    const selectedTile = chessGrid[y][x];

    // Return if the current piece does not match the playing color or is empty (null)
    if(selectedTile[1] === (this.state.whiteIsCurrent ? 'b' : 'w') || selectedTile[0] === null) return;

    // Read the chess piece on the selected position.
    this.setState({selectedTile: selectedTile.slice(), selectedPosition: [x, y]});

    // Modify the third value of the tiles, CanMoveTo. CanMoveTo is a bool which determines if a piece can move.
    // remove everything first
    for(let dy = 0; dy < 8; dy++) {
      for(let dx = 0; dx < 8; dx++) {
        chessGrid[dy][dx][2] = false;
      }
    }
    
    
    switch(selectedTile[0]) {
      case 'pawn':
        // SPECIAL: piece can move 2 times if at start position
        if(selectedTile[1] === 'b') {
          if(y === 1) {
              chessGrid[y+2][x][2] = true;
            }
            chessGrid[y+1][x][2] = true;
        }
        else if(selectedTile[1] === 'w') {
          if(y === 6) {
              chessGrid[y-2][x][2] = true;
            }
          chessGrid[y-1][x][2] = true;
        }
      break;
      case 'knight':
      chessGrid[y-2][x-1][2] = true;
      chessGrid[y-2][x+1][2] = true;

    }

    console.log(chessGrid);

    this.state.tiles = chessGrid;
  }

  renderTile(x, y) {
    const tile = this.state.tiles[y][x];
    return <Tile
      selected={x === this.state.selectedPosition[0] && y === this.state.selectedPosition[1] ? ' selected' : ''}
      chessPiece={tile[0]}
      team={tile[1]}
      canmove={tile[2]}
      onClick={() => this.moveChessPiece(x, y)}
    />
  }

  render() {
    const rows = [0, 1, 2, 3, 4, 5, 6, 7];
    const columns = [0, 1, 2, 3, 4, 5, 6, 7];
    const listRows = rows.map((row) => 
      <div className="chess-row" key={row}>
        { columns.map((column) => <div key={column}>{this.renderTile(column, row)}</div> )}
      </div>
    );

    return (
      <div>
        <h1>{this.state.whiteIsCurrent ? 'White' : 'Black'} to move.</h1>
        <h3>(Selected piece: {this.state.selectedTile[0] || 'none'})</h3>
        {listRows}
      </div>
    )
  }
}

ReactDOM.render(
  <Grid />,
  document.getElementById('root')
)