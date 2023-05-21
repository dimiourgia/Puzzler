import {Image} from 'react-native';


export default function ChessBoard(props) {

  const size=props.size;
  let imageSource;
  switch (props.piece) {
    case 'wk':
      imageSource = require('./assets/images/pieces/wk.png');
      break;
    case 'wq':
      imageSource = require('./assets/images/pieces/wq.png');
      break;
    case 'wr':
      imageSource = require('./assets/images/pieces/wr.png');
      break;
    case 'wb':
      imageSource = require('./assets/images/pieces/wb.png');
      break;
    case 'wn':
      imageSource = require('./assets/images/pieces/wn.png');
      break;
    case 'wp':
      imageSource = require('./assets/images/pieces/wp.png');
      break;
    case 'bk':
      imageSource = require('./assets/images/pieces/bk.png');
      break;
    case 'bq':
      imageSource = require('./assets/images/pieces/bq.png');
      break;
    case 'br':
      imageSource = require('./assets/images/pieces/br.png');
      break;
    case 'bb':
      imageSource = require('./assets/images/pieces/bb.png');
      break;
    case 'bn':
      imageSource = require('./assets/images/pieces/bn.png');
      break;
    case 'bp':
      imageSource = require('./assets/images/pieces/bp.png');
      break;
    default:
      imageSource = null;
  }

      return(
      <Image style={{width:size, 
        backgroundColor:props.background,
        zIndex:1,
        height:size, 
        position:'absolute', 
        left:props.left, 
        top:props.top,
      }} source={imageSource}/>
      );
}