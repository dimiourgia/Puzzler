import { Dimensions, StyleSheet, Text, View, Image, ImageBackground, TouchableWithoutFeedback, Animated } from 'react-native';
import { useState, useRef } from 'react';
import {allPossibleMoves, isPossibleMove, isLegal, isInCheck, isMate, tn, fenToMap} from './helper';
import PromotedMenu from './PromotedMenu';
import HighlightedSquare from './HighlightedSquare';
import ShowHint from './ShowHint';
import Board from './Board';

//required assets
const boardImageSource = require('./assets/images/others/board.jpg');

var move_number = 0;
//mimic of a puzzle from api
var puzzle = {fen:'2R1K3/2Q5/8/8/8/8/pp6/1k5r', turn:'w', moves:[
  {
  white: {from:23, to: 73, promoted:''}, 
  black: {from:82, to: 81, promoted:''}
  },
  {
    white: {from: 73, to: 83, promoted:''}, 
    black:{from: 88, to: 83, promoted:''}
  },
  {
    white: {from: 13, to: 83, promoted:''}, 
    black:{from: null, to: null, promoted:''}
  },
]
}

//set the board in accordance with current puzzles fen
console.log(fenToMap(puzzle.fen));
var moves = [];

export default function ChessBoard() {

  const window_width = Dimensions.get('window').width;
  const window_height = Dimensions.get('window').height;
  const size=window_width;
  const topOffset = 100; 
  const flipped = false;


 const default_map=    [
    ["wr","wn","wb","wq","wk","wb","wn","wr"],
    ["wp","wp","wp","wp","wp","wp","wp",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["bp","bp","bp","bp","bp","bp","bp",""],
    ["br","bn","bb","bq","bk","bb","bn","br"]        
];
  const [map, setMap] = useState(fenToMap(puzzle.fen));

 // setMap(fenToMap(puzzle.fen));
// move-> (from, to, incheck, mate, captured, promoted)
 
const [lastMove, setLastMove] = useState({piece:null, from:[null, null], to:[null, null], incheck:false, mate:false, captured:false, promoted:false, map:map});
const [turn, setTurn] = useState('w');
const [lastTouch,setLastTouch] = useState(null);
const [hint, setHint] = useState([]);
const [activePiece, setActivePiece] = useState({piece:null, row:null, col:null});
const [mate, setMate] = useState({side:'', isMate:false});
const [promoted, setPromoted] = useState(null);


const castleInfo ={canWhiteCastle_short:true, canWhiteCastle_long:true, canBlackCastle_long:true, canBlackCastle_long:true, hasWkMoved:false, hasBkMoved:false, whiteRookKmoved:false, whiteRookQmoved:false, blackRookKmoved:false, blackRookQmoved:false}

const handleTouch = (e)=>{
 const x = e.nativeEvent.pageX;
 const y = e.nativeEvent.pageY;

 if(y<101 && y> 100+window_width) return;
 let row, col;

//Identify the (row,col) clicked by the user
 row = Math.abs(Math.ceil(7 - ((y-100)/(size/8)))) +1;
 col = Math.floor(x/(size/8)) + 1;

 //modify (row,col) if board is flipped i.e black is playing
 if(flipped){
  row = 9-row;
  col = 9-col;
 }

 
if(promoted===null && lastTouch===null){
  console.log('touched-1 :', row, col)
  console.log('turn :', turn);
  if(map[row-1][col-1]!=""){
    console.log('touched-2 :', row, col)
    setLastTouch([row,col]);
    let lastmove = JSON.parse(JSON.stringify(lastMove));
    setHint(allPossibleMoves(map[row-1][col-1],row,col,map,lastmove));
    setActivePiece({piece: map[row-1][col-1],row: row,col: col});
    
  }
}

// a piece is trying to make a move
else{
//  console.log({activePiece,lastTouch, row, col, map});
console.log('touched-3 :', row, col, activePiece)
  let lastmove = JSON.parse(JSON.stringify(lastMove));
  //console.log(isPossibleMove(activePiece.piece,activePiece.row,activePiece.col,tn(row,col),map,lastmove));
  //console.log(isLegal(activePiece.piece,activePiece.row, activePiece.col,tn(row,col),map,lastMove, moves));
  // check if the move is possible and Legal, if so make the move
 if(promoted!=null || (isPossibleMove(activePiece.piece,activePiece.row,activePiece.col,tn(row,col),map, lastmove) && isLegal(activePiece.piece,activePiece.row, activePiece.col,tn(row,col),map,lastmove, moves))){
  console.log('touched-4 :', row, col)
  console.log(activePiece);

  if(promoted===null){
  var updatedMap = map.map(row => row.slice());
  updatedMap[lastTouch[0]-1][lastTouch[1]-1] = "";
  updatedMap[row-1][col-1] = activePiece.piece;

  //check for enpasant movement
  var enpasant=false;
  if(activePiece.piece[1]==='p' && Math.abs(lastTouch[1]-col)===1 && map[row-1][col-1]===""){
    updatedMap[lastMove.to[0]-1][lastMove.to[1]-1]="";
    enpasant=true;
  }

  //check for castling
  if(activePiece.piece[1]==='k' && Math.abs(lastTouch[1]-col)>1){
    if(col===3){
      updatedMap[row-1][0] = "";
      updatedMap[row-1][3] = activePiece.piece[0]+'r';
    }
    else{
      updatedMap[row-1][7] = "";
      updatedMap[row-1][5] = activePiece.piece[0]+'r';
    }
  }

  //check for pawn promote
  if(activePiece.piece[1]==='p' && (row===1 || row===8)){
    setPromoted(tn(row,col));
    setMap(updatedMap)
    setHint(null);
    return;
  }



  //console.log(updatedMap);
  
 
  setMap(updatedMap)
  //console.log("IsMate: ", isMate('w', map, lastmove));
  console.log('turn :', turn);
  console.log(activePiece.row, activePiece.col,"   ", row, col)
  const captured = enpasant ? true : (map[row-1][col-1]!="" ? true: false);
  setLastMove({piece:activePiece.piece,from:[activePiece.row,activePiece.col],to:[row,col],incheck:false,mate:'', captured: captured, promoted:false, map:updatedMap.map(row=>row.slice())})
  //update moves array with the latest move
  moves.push(JSON.parse(JSON.stringify(lastMove)));
  //update castleInfo

 // console.log("moves--", moves.length, " ", moves);
 // console.log("------------------");
  setLastTouch(null)
  setActivePiece({piece:null, row:null, col:null})
  setHint(null)
  setTurn(turn==='w'? 'b' : 'w')
  if(isInCheck(turn,map,lastMove) && isMate(turn,map,lastMove)){
    setMate({side:turn, isMate:true});
  }
  console.log('turn changed :', turn);

  console.log("log-puzzle", puzzle.moves[move_number].black);
  //time for other player to move
  //_______________________________________
  function playMove(){
  const props = puzzle.moves[move_number].black
  const from_row = Math.floor(props.from/10)
  const from_col = props.from%10
  const to_row = Math.floor(props.to/10)
  const to_col = (props.to%10)
  const promoted = props.promoted
  const map = updatedMap.map(row=>row.slice())
  const piece = map[from_row-1][from_col-1];
  const captured = (map[to_row-1][to_col-1] === "")? false : true

  let updtMap = map.map(row=>row.slice());

    updtMap[to_row-1][to_col-1] = promoted? promoted : piece
    updtMap[from_row-1][from_col-1] = ""
    setMap(updtMap)
    setLastMove({piece:piece, from:[from_row, from_col], to:[to_row, to_col], incheck:false, mate:false, captured:captured, promoted:promoted, map:updtMap.map(row=>row.slice())})
    moves.push(JSON.parse(JSON.stringify(lastMove)))
    move_number++
  }
  setTimeout(playMove,1000)
  //________________________________________
}

else{
  let piece="";
  const promotedToRow = Math.floor(promoted/10);
  const promotedToCol = promoted%10;
  if(promotedToCol === col){
    if(promotedToRow===8){
      if(row === 8) piece = 'wq';
      else if(row === 7) piece = 'wr';
      else if(row === 6) piece = 'wb';
      else if(row === 5) piece = 'wn';
    }
    else{
      if(row === 1) piece = 'bq';
      else if(row === 2) piece = 'br';
      else if(row === 3) piece = 'bb';
      else if(row === 4) piece = 'bn';
    }
  }

  if(piece!=""){
  var updatedMap = map.map(row=>row.slice());
  updatedMap[promotedToRow-1][promotedToCol-1] = piece;
  setMap(updatedMap);
  setLastMove({piece:activePiece.piece,from:[activePiece.row,activePiece.col],to:[promotedToRow,promotedToCol],incheck:false,mate:'', captured: false, promoted:piece, map:updatedMap.map(row=>row.slice())})
  setActivePiece({piece:null, row:null, col:null})
  setHint(null);
  setLastTouch(null);
  setPromoted(null);

  //time for other player to move
  //_______________________________________
  function playMove(){
    const props = puzzle.moves[move_number].black
    const from_row = Math.floor(props.from/10)
    const from_col = props.from%10
    const to_row = Math.floor(props.to/10)
    const to_col = (props.to%10)
    const promoted = props.promoted
    const map = updatedMap.map(row=>row.slice())
    const piece = map[from_row-1][from_col-1];
    const captured = (map[to_row-1][to_col-1] === "")? false : true
  
    let updtMap = map.map(row=>row.slice());
  
      updtMap[to_row-1][to_col-1] = promoted? promoted : piece
      updtMap[from_row-1][from_col-1] = ""
      setMap(updtMap)
      setLastMove({piece:piece, from:[from_row, from_col], to:[to_row, to_col], incheck:false, mate:false, captured:captured, promoted:promoted, map:updtMap.map(row=>row.slice())})
      moves.push(JSON.parse(JSON.stringify(lastMove)))
      move_number++
    }
    setTimeout(playMove,1000)
    //________________________________________
  
  }

}

 }

 else{
  console.log('turn :', turn);
  (map[row-1][col-1]!="" && turn===activePiece.piece[0]) ? setLastTouch([row,col]) : setLastTouch(null);
  (map[row-1][col-1]!="" && turn===activePiece.piece[0]) ? setActivePiece({piece: map[row-1][col-1],row: row,col: col}) : setActivePiece( {piece:null, row:null, col:null});
  (map[row-1][col-1]!="" && turn===activePiece.piece[0]) ? setHint(allPossibleMoves(map[row-1][col-1],row,col,map,lastmove)) : setHint(null);
  console.log(activePiece);
}

//console.log('lastMove: ', lastMove);
}

function makeMove(props){
  console.log('come here buddy')
  const from_row = Math.floor(props.from/10)
  const from_col = props.from%10
  const to_row = Math.floor(props.to/10)
  const to_col = (props.to%10)
  const promoted = props.promoted
  const map = moves[moves.length-1].map
  console.log('here',map);
  const piece = map[from_row-1][from_col-1];
  const captured = (map[to_row-1][to_col-1] === "")? false : true

  let updatedMap = map.map(row=>row.slice());

    updatedMap[to_row-1][to_col-1] = promoted? promoted : piece
    updatedMap[from_row-1][from_col-1] = ""

    setLastMove({piece:piece, from:[from_row, from_col], to:[to_row, to_col], incheck:false, mate:false, captured:captured, promoted:promoted})
    moves.push(JSON.parse(JSON.stringify(lastMove)))
    return updatedMap
}

function timedMove(){
  setMap(makeMove(puzzle.moves[move_number].black))
  move_number++;
}

}

    return (
      <TouchableWithoutFeedback onPress={(e)=>handleTouch(e)}>
        <View style={{width:window_width, position:'relative', height:window_height, alignContent:'center'}}>
          <ImageBackground style={{zIndex:-1, width:size, height:size, position:'absolute', top:topOffset}} source={boardImageSource}/>
          <Board flipped={flipped} board_size={window_width} topOffset={topOffset} map={map}  />
          {activePiece.piece && <HighlightedSquare flipped={flipped} board_size={window_width} row={activePiece.row} col={activePiece.col} />}
          {hint && <ShowHint hint={hint} flipped={flipped} board_size={window_width} />}
          {lastMove.piece && <HighlightedSquare flipped={flipped} board_size={window_width} row={lastMove.from[0]} col={lastMove.from[1]} />}       
          {lastMove.piece && <HighlightedSquare flipped={flipped} board_size={window_width} row={lastMove.to[0]} col={lastMove.to[1]} />}
          {promoted!=null && <PromotedMenu flipped={flipped} promoted={promoted} board_size={window_width} />}
      </View>
      </TouchableWithoutFeedback>
    );
  }

 