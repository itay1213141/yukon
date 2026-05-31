import BaseScene from '@scenes/base/BaseScene'


const basePath = 'assets/media/flash/'
const gamesPath = `${basePath}games/`
const roomsPath = `${basePath}rooms/`

const keys = [
    'getGamesPath',
    'getMyPlayer',
    'getMyPlayerHex',
    'getMyPlayerId',
    'getPlayerObjectById',
    'isItemOnMyPlayer',
    'isMyPlayerMember',
    'sendGameOver',
    'sendJoinLastRoom',
    'buyInventory'
]

export default class RuffleController extends BaseScene {

    constructor(key) {
        super(key)

        this.player = null
        this.container = null

        this.path = ''

        // Object accessed from Flash ExternalInterface
        window.ruffle = {
            getKeys: () => {
                return keys
            },

            getFrameColor: () => {
                return this.crumbs.frameColor
            },

            getPath: () => {
                return this.path
            },

            getGamesPath: () => {
                return gamesPath
            },

            getMyPlayer: () => {
                return this.clientObject
            },

            getMyPlayerHex: () => {
                return this.world.getColor(this.clientObject.color)
            },

            getMyPlayerId: () => {
                return this.client.id
            },

            getMyLastRoom: () => {
                return this.world.lastRoom
            },

            getPlayerObjectById: ([id]) => {
                if (id === this.client.id) {
                    return this.clientObject
                }
            },

            isItemOnMyPlayer: ([id]) => {
                return Object.values(this.clientObject).includes(id)
            },

            isMyPlayerMember: () => {
                return true
            },

            sendGameOver: (obj) => {
                this.network.send('game_over', { coins: obj.coins })
            },

            sendJoinLastRoom: () => {
                this.close()

                this.world.client.sendJoinLastRoom()
            },

            joinRoom: (roomId) => {
                this.close()

                if (roomId in this.crumbs.rooms) {
                    const room = this.crumbs.rooms[roomId]

                    this.world.client.sendJoinRoom(roomId, room.key, room.x, room.y)
                }
            },

            buyInventory: ([itemId]) => {
                this.interface.prompt.showItem(itemId)
            },

            onLoadComplete: () => {
                this.interface.hideLoading()
                this.interface.hideInterface()

                this.stopMusic()

                this.container.visible = true
            },

            startGameMusic: () => {
                const music = this.music

                if (!music) {
                    return
                }

                if (this.cache.audio.exists(music)) {
                    return this.playMusic(music)
                }

                this.load.audio(music, `assets/media/music/${music}.mp3`)
                this.load.start()

                this.load.once(`filecomplete-audio-${music}`, () => {
                    this.playMusic(music)
                })
            }
        }
    }

    get client() {
        return this.world.client
    }

    get clientObject() {
        return this.client.penguin.items.flat
    }

    create() {
        window.RufflePlayer = window.RufflePlayer || {}

        this.playerStyle = {
            width: '100%',
            height: '100%',
            pointerEvents: 'auto'
        }

        this.container = this.add.dom(760, 480)
        this.container.visible = false
    }

    update() {
        if (this.interface.prompt.isPromptVisible) {
            // Lower DOM container depth so that prompt is above Ruffle content
            this.sendToBack()
        } else {
            this.resetDepth()
        }
    }

    bootGame(path, music) {
        this.path = `${gamesPath}${path}`
        this.music = music || 0

        this.events.once('update', () => this.boot())
    }

    bootBackground(filename) {
        const ruffle = window.RufflePlayer.newest()
        const canvas = this.game.canvas

        this.bgPlayer = ruffle.createPlayer()
        Object.assign(this.bgPlayer.style, {
            width: '100%',
            height: '100%',
            display: 'block'
        })

        this.bgDiv = document.createElement('div')
        Object.assign(this.bgDiv.style, {
            position: 'absolute',
            pointerEvents: 'none',
            overflow: 'hidden',
            zIndex: '0'
        })
        this.bgDiv.appendChild(this.bgPlayer)

        const parent = canvas.parentNode
        parent.style.position = 'relative'
        parent.appendChild(this.bgDiv)

        // Match bgDiv to canvas rendered bounds, and keep in sync on resize
        const sync = () => {
            if (!this.bgDiv) return
            this.bgDiv.style.left   = `${canvas.offsetLeft}px`
            this.bgDiv.style.top    = `${canvas.offsetTop}px`
            this.bgDiv.style.width  = `${canvas.offsetWidth}px`
            this.bgDiv.style.height = `${canvas.offsetHeight}px`
        }
        sync()
        this.bgResizeHandler = sync
        window.addEventListener('resize', this.bgResizeHandler)

        // Explicitly stack: bgDiv(0) < canvas(1) < domContainer(2)
        canvas.style.position = 'relative'
        canvas.style.zIndex = '1'
        this.game.domContainer.style.zIndex = '2'

        this.bgPlayer.load({
            url: `${roomsPath}${filename}`,
            allowScriptAccess: true,
            menu: false,
            contextMenu: 'off',
            scale: 'noborder',
            autoplay: 'on',
            splashScreen: false,
            logLevel: localStorage.logging === 'true' ? 'info' : 'error'
        })

        // Forward pointer events from canvas to Ruffle so hover animations trigger.
        // Canvas still receives events first — Phaser movement is unaffected.
        const events = ['pointermove', 'pointerover', 'pointerout', 'pointerdown', 'pointerup']
        this.bgCanvasForward = (e) => {
            if (!this.bgPlayer) return
            try {
                this.bgPlayer.dispatchEvent(new PointerEvent(e.type, {
                    bubbles: false,
                    cancelable: false,
                    clientX: e.clientX,
                    clientY: e.clientY,
                    movementX: e.movementX,
                    movementY: e.movementY,
                    button: e.button,
                    buttons: e.buttons,
                    pointerId: e.pointerId,
                    pointerType: e.pointerType || 'mouse'
                }))
            } catch (_) {}
        }
        events.forEach(t => canvas.addEventListener(t, this.bgCanvasForward))
        this.bgForwardEvents = events
    }

    stopBackground() {
        if (this.bgResizeHandler) {
            window.removeEventListener('resize', this.bgResizeHandler)
            this.bgResizeHandler = null
        }

        if (this.bgCanvasForward && this.bgForwardEvents) {
            this.bgForwardEvents.forEach(t => this.game.canvas.removeEventListener(t, this.bgCanvasForward))
            this.bgCanvasForward = null
            this.bgForwardEvents = null
        }

        if (this.bgDiv) {
            this.bgDiv.remove()
            this.bgDiv = null
            this.bgPlayer = null
        }

        this.game.canvas.style.position = ''
        this.game.canvas.style.zIndex = ''
        this.game.domContainer.style.zIndex = ''
    }

    boot() {
        const ruffle = window.RufflePlayer.newest()

        this.player = ruffle.createPlayer()
        this.container.setElement(this.player, this.playerStyle)

        this.player.load({
            url: `${basePath}boot.swf`,
            allowScriptAccess: true,
            menu: false,
            contextMenu: 'off',
            scale: 'noborder',
            autoplay: 'on',
            splashScreen: false,

            logLevel: localStorage.logging === 'true'
                ? 'info'
                : 'error'
        })
    }

    stop() {
        this.events.off('update')

        this.path = null
        this.music = null

        this.removePlayer()
        this.resetDepth()
        this.stopMusic()

        this.scene.stop()
    }

    removePlayer() {
        this.player?.remove()
        this.player = null
    }

    resetDepth() {
        this.game.domContainer.style.zIndex = 'auto'
    }

    sendToBack() {
        this.game.domContainer.style.zIndex = -10
    }

}
