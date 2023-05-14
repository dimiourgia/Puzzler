import { Dimensions, Image} from 'react-native';


export default function Wp(val) {

  const window_width = Dimensions.get('window').width;
  const size=window_width/8;

      return(
         <Image styles={{width:size, height:size, position:'absolute'}} source={require('./assets/images/pieces/wp.png')}/> 
      );
}