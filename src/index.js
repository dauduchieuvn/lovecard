const express = require('express')
const path = require('path')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server, { maxHttpBufferSize: 1e30 })

const fs = require('fs')

const PORT = process.env.PORT || 8000
server.listen(PORT, () => { console.log(`Server listening at port: ${PORT}`) })

app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/admin/:password', (req, res) => {
    if(req.params.password === 'vs') {
        res.render('admin')
    } else {
        res.render('index')
    }
})

app.get('/w/:id', (req, ress) => {
    if(userFileManager.checkId(req.params.id)) {
        const resFile = path.join(__dirname, 'files', 'res.txt')
        const resString = fs.readFileSync(resFile).toString() || `{}`
        const res = JSON.parse(resString)
        ress.render('wait', {data: {...res[req.params.id], id: req.params.id}})
    } else {
        ress.redirect('/')
        // ress.render('index')
    }
})

app.get('/:id', (req, res) => {
    if(userFileManager.checkId(req.params.id)) {
        const dataString = fs.readFileSync(userFileManager.getPath(req.params.id)).toString() || `[]`
        const data = JSON.parse(dataString)
        res.render('view', {data: {...data, id: req.params.id}})
    } else {
        res.redirect('/')
        // res.render('index')
    }
})

app.get('/', (req, res) => {
    res.render('index')
})

const userFileManager = {
    root: path.join(__dirname, 'files', 'user-files'),
    existFile: path.join(__dirname, 'files', 'exist.txt'),
    getPath(fielName) {
        return path.join(this.root, `${fielName}.txt`)
    },
    checkExist(id) {
        if(!id) return true
        const existString = fs.readFileSync(this.existFile).toString() || `[["exist", false]]`
        const exist = JSON.parse(existString)
        return exist.some(item => item[0] === id)
    },
    saveFile(data) {
        const id = data['web-id']
        // save file
        fs.appendFileSync(this.getPath(id), JSON.stringify(data))
        // add exist
        let exist = fs.readFileSync(this.existFile).toString() || `[["exist", false]]`
        exist = JSON.parse(exist)
        exist.push([id, false])
        fs.writeFileSync(this.existFile, JSON.stringify(exist))
    },
    checkId(id) {
        if(!id) return false
        const dataString = fs.readFileSync(this.existFile).toString() || `[["exist", false]]`
        const data = JSON.parse(dataString)
        return data.some(d => d[0] === id && d[1])
    }
}

io.on('connection', socket => {
    socket.on('admin-data', data => {
        if(userFileManager.checkExist(data['web-id'])) {
            socket.emit('exist-id')
        } else {
            userFileManager.saveFile(data)
            socket.emit('file-saved')
            adminChangeData()
        }
    })

    function adminChangeData() {
        let data = fs.readFileSync(userFileManager.existFile).toString() || `[]`
        data = JSON.parse(data)
        if(data.length) data.splice(0, 1)
        io.sockets.emit('admin-manager', data)
    }

    socket.on('admin', () => {
        adminChangeData()
    })
    socket.on('admin-active', id => {
        let data = fs.readFileSync(userFileManager.existFile) || `[]`
        data = JSON.parse(data)
        for(let i = 0; i < data.length; i++) {
            if(data[i][0] === id) {
                data[i][1] = !data[i][1]
                break
            }
        }
        fs.writeFileSync(userFileManager.existFile, JSON.stringify(data))
        adminChangeData()
    })
    socket.on('admin-delete', id => {
        let data = fs.readFileSync(userFileManager.existFile) || `[]`
        data = JSON.parse(data)
        for(let i = 0; i < data.length; i++) {
            if(data[i][0] === id) {
                data.splice(i, 1)
                fs.unlinkSync(userFileManager.getPath(id))
                break
            }
        }
        fs.writeFileSync(userFileManager.existFile, JSON.stringify(data))
        adminChangeData()
    })
    ///////
    socket.on('client-send', ({id, data}) => {
        const resFile = path.join(__dirname, 'files', 'res.txt')
        const resString = fs.readFileSync(resFile).toString() || `{}`
        const res = JSON.parse(resString)
        if(!res[id]) {
            res[id] = {}
        }
        res[id].content = data.content
        res[id].signature = data.signature
        fs.writeFileSync(resFile, JSON.stringify(res))
        io.sockets.emit(`client-res-${id}`, res[id])
    })
})
