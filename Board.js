import { View } from "react-native"
import Piece from './Piece'



export default function Board(props){
    const board_size = props.board_size
    const flipped = props.flipped
    const map = props.map
    const map_c = map.map(row=>row.slice())
    const topOffset = props.topOffset
    const board = []

        map.map((row, i) =>{
            row.map((piece, j) =>{
              piece && board.push(
                  <Piece
                  key={`${i}-${j}`}
                  piece={piece}
                  size={board_size/8}
                  top = {flipped ? (topOffset + (i)*(board_size/8)) : (topOffset + (7-i)*(board_size/8))}
                  left= {flipped ? (7-j)*board_size/8 : j*board_size/8}
                 />         
                 )})});
    
                 var flag=false;
                 map_c.map((row,i)=>{
                  flag=!flag;
                  row.map((sqr,j)=>{
                    board.push(
                    <View
                    key={`${i}--${j}`}
                    style={{
                      width:board_size/8,
                      height:board_size/8,
                      top:topOffset + (7-i)*(board_size/8),
                      position:'absolute',
                      zIndex:.2,
                      left:j*board_size/8,
                      backgroundColor: flag ? '#30627980' : '#d1c1c180' 
                    }}
                    >
                
                    </View>)
                    flag=!flag;
                  })
                })

    return(board);
}