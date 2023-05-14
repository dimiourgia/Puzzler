import { Dimensions, StyleSheet, Text, View, Image, ImageBackground, TouchableWithoutFeedback, Animated } from 'react-native';
import Piece from './Piece';
import { useState, useRef } from 'react';
import {allPossibleMoves, isPossibleMove, isLegal, isInCheck, isMate, tn} from './helper';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export default function ChessBoard() {

  const window_width = Dimensions.get('window').width;
  const window_height = Dimensions.get('window').height;
  const size=window_width;
  const board_pos = 100;
  var flipped=false;

  const hintImageSource = require('./assets/images/others/circle.png');

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
  const [map, setMap] = useState(default_map);
// move-> (from, to, incheck, mate, captured, promoted)
 

  var moves = [];
  const pieces = [];
  const renderBoard = ()=>{
    map.map((row, i) =>
        row.map((piece, j) =>{
          piece && pieces.push(
            
              <Piece
              key={`${i}-${j}`}
              piece={piece}
              size={window_width/8}
              top={100 + (7-i)*(window_width/8)}
              left={j*window_width/8}
             />         
             )}))
  }

  //render the board
renderBoard();

const [lastMove, setLastMove] = useState({piece:null, from:[null, null], to:[null, null], incheck:false, mate:false, captured:false, promoted:false});
const [turn, setTurn] = useState('w');
const [lastTouch,setLastTouch] = useState(null);
const [hint, setHint] = useState([]);
const [activePiece, setActivePiece] = useState({piece:null, row:null, col:null});


const handleTouch = (e)=>{
 const x = e.nativeEvent.pageX;
 const y = e.nativeEvent.pageY;

 if(y>100 && y<= 100+window_width){

 }
 else {
  return;
 }


 let row, col;

//Identify the (row,col) clicked by the user
 row = Math.abs(Math.ceil(7 - ((y-100)/(size/8)))) +1;
 col = Math.floor(x/(size/8)) + 1;

 if(flipped){
  row = 9-row;
  col = 9-col;
 }

 //if(lastTouch !== null && activePiece.piece[0]!==turn) return;

if(lastTouch===null){
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
  console.log(isPossibleMove(activePiece.piece,activePiece.row,activePiece.col,tn(row,col),map,lastmove));
  console.log(isLegal(activePiece.piece,activePiece.row, activePiece.col,tn(row,col),map,lastMove));
  // check if the move is possible and Legal, if so make the move
 if(isPossibleMove(activePiece.piece,activePiece.row,activePiece.col,tn(row,col),map, lastmove) && isLegal(activePiece.piece,activePiece.row, activePiece.col,tn(row,col),map,lastmove)){
  console.log('touched-4 :', row, col)
   var updatedMap = map.map(row => row.slice());
  updatedMap[lastTouch[0]-1][lastTouch[1]-1] = "";
  updatedMap[row-1][col-1] = activePiece.piece;

  //check for enpasant movement
  var enpasant=false;
  if(activePiece.piece[1]==='p' && Math.abs(lastTouch[1]-col)===1 && map[row-1][col-1]===""){
    updatedMap[lastMove.to[0]-1][lastMove.to[1]-1]="";
    enpasant=true;
  }



  //console.log(updatedMap);
  
 
  setMap(updatedMap)
  console.log("IsMate: ", isMate('w', map, lastmove));
  console.log('turn :', turn);
  console.log(activePiece.row, activePiece.col,"   ", row, col)
  const captured = enpasant ? true : (map[row-1][col-1]!="" ? true: false);
  setLastMove({piece:activePiece.piece,from:[activePiece.row,activePiece.col],to:[row,col],incheck:false,mate:isMate(turn==='w'? 'b':'w', map, lastmove), captured: captured, promoted:false})
  setLastTouch(null)
  setActivePiece({piece:null, row:null, col:null})
  setHint(null)
  setTurn(turn==='w'? 'b' : 'w')
  console.log('turn changed :', turn);

 }

 else{
  console.log('turn :', turn);
  (map[row-1][col-1]!="" && turn===activePiece.piece[0]) ? setLastTouch([row,col]) : setLastTouch(null);
  (map[row-1][col-1]!="" && turn===activePiece.piece[0]) ? setActivePiece({piece: map[row-1][col-1],row: row,col: col}) : setActivePiece({piece:null, row:null, col:null});
  (map[row-1][col-1]!="" && turn===activePiece.piece[0]) ? setHint(allPossibleMoves(map[row-1][col-1],row,col,map,lastmove)) : setHint(null);
  console.log(activePiece);
}

//console.log('lastMove: ', lastMove);
}
//console.log(row,col);
}

    return (
      <TouchableWithoutFeedback onPress={(e)=>handleTouch(e)}>
      <View style={{width:window_width, position:'relative', height:window_height, alignContent:'center'}}>
          <ImageBackground style={{zIndex:-1, width:size, height:size, position:'absolute', top:board_pos}} source={require('./assets/images/others/board.jpg')}/>
       {pieces} 
       {activePiece.piece && <View style={{backgroundColor:'yellow', opacity:.3, zIndex:0, width:size/8, height:size/8, position:'absolute', left:(activePiece.col-1)*window_width/8, top:(100 + (8-activePiece.row)*(window_width/8))}} />}
       {hint && hint.map((sqr,i)=>{
        return (<Image key={i} source={hintImageSource} style={{width:size/8, height:size/8, zIndex:2, opacity:.4, position:'absolute', top:(100 + (8-Math.floor(sqr/10))*(window_width/8)), left:((sqr%10)-1)*size/8}} />)
       })}
      {
       lastMove.piece 
       && 
       <View style={{backgroundColor:'yellow', opacity:.3, zIndex:0, width:size/8, height:size/8, position:'absolute', left:(lastMove.from[1]-1)*window_width/8, top:(100 + (8-lastMove.from[0])*(window_width/8))}}/> 
      }       
      {
        lastMove.piece
        &&
       <View style={{backgroundColor:'yellow', opacity:.3, zIndex:0, width:size/8, height:size/8, position:'absolute', left:(lastMove.to[1]-1)*window_width/8, top:(100 + (8-lastMove.to[0])*(window_width/8))}}/>
      }
      </View>
      </TouchableWithoutFeedback>
    );
  }

 