import { View } from "react-native";

export default function HighlightedSquare(props){
    const flipped=props.flipped;
    const board_size=props.board_size;
    const row = props.row;
    const col = props.col;


    return (<View style={{
        backgroundColor:'yellow', 
        opacity:.3, 
        zIndex:0, 
        width:board_size/8, 
        height:board_size/8, 
        position:'absolute', 
        left:(flipped? ((8-col)*board_size/8) : ((col-1)*board_size/8)), 
        top:(flipped? (100 + (row-1)*(board_size/8)) : (100 + (8-row)*(board_size/8)))}}
        />)
}