let row = 20
let column = 50
let startingPoint = [Math.round(row/2), Math.round(row/2)]
let endPoint = [Math.round(row/2), column-Math.round(row/2)]
let wall = []
let menus = {
    start: 1,
    end: 2,
    wall: 3
}
let menuSelected = menus.wall
let modes = {
    initial: 1,
    searching: 2,
    done:3
}
let mode = modes.initial
let algorithms = {
    dijkstra: 1,
    // aStar: 2
}
let algorithm = algorithms.dijkstra

document.addEventListener('DOMContentLoaded', () => {
    showAlgorithmList()
    plotGraph()
    indicateStartingPoint()
    indicateEndPoint()
    handleUserEvent()
})

function handleUserEvent () {
    document.querySelector('#visualize_btn').addEventListener('click', async event => {
        if (mode===modes.initial) {
            mode =  modes.searching
            let shortestPath = []
            if (algorithm===algorithms.dijkstra) {
                 shortestPath = await dijkstraSearch({row, column, wall,startingPoint, endPoint})
            }
            await visualizeShortestPath(shortestPath)
            mode = modes.done
        }
    })
    document.querySelector('#clear_btn').addEventListener('click', async event => {
        if (mode===modes.done){
            clearGraph()
            indicateStartingPoint()
            indicateEndPoint()
            wall = []
            mode = modes.initial
        }
    })
    document.querySelector('#starting_point_btn').addEventListener('click', async event => {
        if (mode===modes.initial) menuSelected = menus.start
    })
    document.querySelector('#end_point_btn').addEventListener('click', async event => {
        if (mode===modes.initial) menuSelected = menus.end
    })
    document.querySelector('#wall_btn').addEventListener('click', async event => {
        if (mode===modes.initial) menuSelected = menus.wall
    })
    let graphBody = document.querySelector('#graph_body')
    graphBody.addEventListener('click', event => {
        if (mode===modes.initial && menuSelected===menus.start){
            clearStartingPoint()
            startingPoint = [
                Number(event.target.getAttribute('data-row')),
                Number(event.target.getAttribute('data-column'))
            ]
            clearWall(startingPoint)
            indicateStartingPoint()
        }
        else if (mode===modes.initial && menuSelected===menus.end){
            clearEndPoint()
            endPoint = [
                Number(event.target.getAttribute('data-row')),
                Number(event.target.getAttribute('data-column'))
            ]
            clearWall(endPoint)
            indicateEndPoint()
        }
        else if (mode===modes.initial && menuSelected===menus.wall){
            plotWall(event)
        }
    })
    graphBody = document.querySelector('#graph_body')
    graphBody.addEventListener('dragenter', event => {
        plotWall(event)
    })
}

function showAlgorithmList() {
    let list = document.querySelector('#algorithm_list')
    list.insertAdjacentHTML('beforeend', `<a class="dropdown-item cursor-pointer" id="algorithm_${algorithms.dijkstra}">Dijkstra's Algorithm</a>`)
}

function plotGraph() {
    let graphBody = document.querySelector('#graph_body')
    let nodeSize = Math.floor(graphBody.offsetWidth/column-1)
    for (let i=0; i<row; i++) {
        graphBody.insertAdjacentHTML('beforeend', `<div class="node-row row m-0" id="node_row_${i}" data-row="${i}"></div>`)
        let nodeRow = graphBody.querySelector(`#node_row_${i}`)
        for (let j=0; j<column; j++) {
            nodeRow.insertAdjacentHTML('beforeend', `<div class="node" id="node_${i}_${j}" data-row="${i}" data-column="${j}"></div>`)
            let node = nodeRow.querySelector(`#node_${i}_${j}`)
            node.style.width = nodeSize+"px"
            node.style.height = nodeSize+"px"
        }
    }
}

function clearGraph() {
    let graphBody = document.querySelector('#graph_body')
    for (let i=0; i<row; i++) {
        let nodeRow = graphBody.querySelector(`#node_row_${i}`)
        for (let j=0; j<column; j++) {
            let node = nodeRow.querySelector(`#node_${i}_${j}`)
            node.classList.remove('node-active', 'node-path', 'node-wall')
            node.innerHTML=""
        }
    }
}

function plotWall (event) {
    let point = [
        Number(event.target.getAttribute('data-row')),
        Number(event.target.getAttribute('data-column'))
    ]
    let inWall = clearWall(point)
    if (!inWall) {
        wall.push({x:point[0], y:point[1]})
        indicateWallBrick(point)
        console.log('not in wall')
    }
    console.log(wall, 'wall')
}

function clearWall (point) {
    for (let brick of wall) {
        if (point.equals([brick.x, brick.y])){
            let index = wall.indexOf(brick)
            wall.splice(index, 1)
            clearWallBrick(point)
            return true
        }
    }
    return false
}

function activatePoint(point, distance=0) {
    let node = document
        .querySelector('#graph_body')
        .querySelector(`#node_row_${point[0]}`)
        .querySelector(`#node_${point[0]}_${point[1]}`)
    node.classList.add('node-active')
    // node.innerHTML = distance+''
}

function indicateStartingPoint() {
    let node = document
        .querySelector('#graph_body')
        .querySelector(`#node_row_${startingPoint[0]}`)
        .querySelector(`#node_${startingPoint[0]}_${startingPoint[1]}`)
    node.innerHTML = 'S'
}

function clearStartingPoint() {
    let node = document
        .querySelector('#graph_body')
        .querySelector(`#node_row_${startingPoint[0]}`)
        .querySelector(`#node_${startingPoint[0]}_${startingPoint[1]}`)
    node.innerHTML = ''
}

function indicateEndPoint() {
    let node = document
        .querySelector('#graph_body')
        .querySelector(`#node_row_${endPoint[0]}`)
        .querySelector(`#node_${endPoint[0]}_${endPoint[1]}`)
    node.innerHTML = 'E'
}

function clearEndPoint() {
    let node = document
        .querySelector('#graph_body')
        .querySelector(`#node_row_${endPoint[0]}`)
        .querySelector(`#node_${endPoint[0]}_${endPoint[1]}`)
    node.innerHTML = ''
}

function indicateWallBrick(point) {
    let node = document
        .querySelector('#graph_body')
        .querySelector(`#node_row_${point[0]}`)
        .querySelector(`#node_${point[0]}_${point[1]}`)
    node.classList.add('node-wall')
}

function clearWallBrick(point) {
    let node = document
        .querySelector('#graph_body')
        .querySelector(`#node_row_${point[0]}`)
        .querySelector(`#node_${point[0]}_${point[1]}`)
    node.classList.remove('node-wall')
}

async function visualizeShortestPath(shortestPath) {
    for(let point of shortestPath) {
        let node = document
            .querySelector('#graph_body')
            .querySelector(`#node_row_${point[0]}`)
            .querySelector(`#node_${point[0]}_${point[1]}`)
        node.classList.add('node-path')
        await sleep(PATH_TIME)
    }
}