import Piece from './Piece';



const blackPromotesTo = ['bn','bb','br','bq'];
const whitePromotesTo = ['wq','wr','wb','wn'];

export default function PromotedMenu(props){
    const promoted=props.promoted;
    const window_width=props.window_width;
    const flipped=props.flipped;

    return ((Math.floor(promoted/10)=== 1)? blackPromotesTo.map((piece, i)=>{
           console.log('Piece :', piece);
           console.log("Promoted: ", promoted);
          return(<Piece
            key={`${i}`}
            piece={piece}
            size={window_width/8}
            top={flipped? (100 + (i)*(window_width/8)) : (100 + (4+i)*(window_width/8))}
            left={flipped? ((8-promoted%10)*window_width/8) : (promoted%10 - 1)*window_width/8}
            background='#fff'
           />)  
        }) : 

        whitePromotesTo.map((piece,i)=>{
          console.log('Piece :', piece);
          console.log("Promoted: ", promoted);
          return(<Piece
            key={`${i}`}
            piece={piece}
            size={window_width/8}
            top={flipped? (100 + (4+i)*(window_width/8)) : (100 + (i)*(window_width/8))}
            left={flipped? ((8-promoted%10)*window_width/8) : (promoted%10 - 1)*window_width/8}
            background='#fff'
           /> )   
        }))
}