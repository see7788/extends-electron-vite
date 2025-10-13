import {appinit} from "lib-vanilla/electronBase/main"
import Init from "lib-vanilla/src/anyWebrtc/peerjs/electronMain"
appinit().then(() => new Init()).then(() => console.log("APP INIT success")).catch(error => console.error('APP INIT', error))