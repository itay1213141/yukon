import RoomScene from '../RoomScene'


export default class Mine extends RoomScene {

    constructor() {
        super('Mine')

        this.roomTriggers = {
            'cave': () => this.triggerRoom(806, 1200, 650),
            'cart': () => this.triggerGame(905)
        }
    }

    _preload() {
        this.load.pack('mine-pack', 'assets/media/rooms/mine/mine-pack.json')
    }

    _create() {
        this.add.image(0, 0, 'mine_bg').setOrigin(0, 0)
        this.events.emit('scene-awake')
    }

}
