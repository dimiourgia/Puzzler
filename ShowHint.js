import { Image } from "react-native"

const hintImageSource = require('./assets/images/others/circle.png')

export default function ShowHint(props){
    const hint = props.hint
    const board_size = props.board_size
    const flipped = props.flipped

    return(
        hint.map((sqr,i)=> 
            <Image 
                key={i} 
                source={hintImageSource} 
                style={{
                    width:board_size/8, 
                    height:board_size/8, 
                    zIndex:2, 
                    opacity:.4, 
                    position:'absolute', 
                    top:(flipped? (100 + (Math.floor(sqr/10)-1)*(board_size/8)) : (100 + (8-Math.floor(sqr/10))*(board_size/8))), 
                    left:(flipped? ((8-(sqr%10))*board_size/8) : (((sqr%10)-1)*board_size/8))}} />
        )
    )
}
