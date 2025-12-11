import {useVideoPlayer, VideoView} from "expo-video";


export function LoadingIcon(){
    const player = useVideoPlayer(require("../assets/oval.mp4"), player=>{
        player.loop = true;
        player.play();
    });

    return(
        <VideoView
            player={player}
            nativeControls={false}
            style={{width: 30, height: 30}}
        />
    );
}