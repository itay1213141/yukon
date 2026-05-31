import RoomScene from '../RoomScene'


export default class Mine extends RoomScene {

    constructor() {
        super('Mine')

        this.roomTriggers = {
            'cave': () => this.triggerRoom(806, 1200, 650),
            'cart': () => this.triggerGame(905)
        }

        this.music = '29'
    }

    _preload() {
        this.load.pack('mine-pack', 'assets/media/rooms/mine/mine-pack.json')
    }

    _create() {
        this.ruffle.bootBackground('mine.swf')
        this.events.emit('scene-awake')
    }

    onDestroy() {
        super.onDestroy()
        this.ruffle.stopBackground()
    }

}
