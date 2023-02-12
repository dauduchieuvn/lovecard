const socket = io()
socket.on('exist-id', () => {
    alert('exist-id')
})
socket.on('file-saved', () => {
    alert('file-saved')
})

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
    })
}

document.querySelector('#ok').addEventListener('click', () => {
    const inputs = document.querySelectorAll('input')
    const data = {}
    inputs.forEach((input, index) => {
        if (3 <= index && index <= 17) {

        } else {
            data[input.id] = input.value
        }
    })
    const p = new Promise(resolve => resolve());
    const processFile = (index) => {
        return p.then(() => {
            if (inputs[index].files[0]) {
                return getBase64(inputs[index].files[0]).then(d => {
                    data[inputs[index].id] = d;
                });
            } else {
                data[inputs[index].id] = ''
            }
        });
    };
    const promises = [];
    for (let i = 3; i <= 17; i++) {
        promises.push(processFile(i));
    }
    function processGoogleDriveURL(url) {
        if(url.indexOf('https') > -1) {
            url = url.substring(url.indexOf('/d/')+3, url.lastIndexOf('/'))
        }
        return `https://drive.google.com/uc?export=download&id=` + url
    }
    Promise.all(promises)
        .then(() => {
            for(let i = 1; i <= 14; i++) {
                if(!data[`img${i}`]) {
                    data[`img${i}`] = processGoogleDriveURL(data[`img${i}-1`])
                }
            }
            if(!data['music']) {
                data['music'] = processGoogleDriveURL(data['music-1'])
            }

            console.log('complete', roughSizeOfObject(data))
            alert('complete' + roughSizeOfObject(data))
            socket.emit('admin-data', data)
        });
})

function roughSizeOfObject( object ) {

    var objectList = [];
    var stack = [ object ];
    var bytes = 0;

    while ( stack.length ) {
        var value = stack.pop();

        if ( typeof value === 'boolean' ) {
            bytes += 4;
        }
        else if ( typeof value === 'string' ) {
            bytes += value.length * 2;
        }
        else if ( typeof value === 'number' ) {
            bytes += 8;
        }
        else if
        (
            typeof value === 'object'
            && objectList.indexOf( value ) === -1
        )
        {
            objectList.push( value );

            for( var i in value ) {
                stack.push( value[ i ] );
            }
        }
    }
    return bytes;
}

socket.emit('admin')
function active(id) {
    socket.emit('admin-active', id)
}
function dlt(id) {
    if(confirm(`Delete ${id}?`)) socket.emit('admin-delete', id)
}
socket.on('admin-manager', data => {
    document.querySelector('.manager').innerHTML = data.map(d => {
        return `
            <li>
                <ul>
                    <li>${d[0]}</li>
                    <li>Time</li>
                    <li class="button green">Detail</li>
                    <li onclick="dlt('${d[0]}')" class="button red">Delete</li>
                    <li><input oninput="active('${d[0]}')" type="checkbox" class="active" ${d[1]?'checked':''}>Active</li>
                </ul>
            </li>
        `
    })
})
