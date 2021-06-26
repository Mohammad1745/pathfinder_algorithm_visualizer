let row = 25
let column = 60
let startingPoint = [Math.round(row/2-1), Math.round(row/2-1)]
let endPoint = [Math.round(row/2-1), column-Math.round(row/2+1)]
let wall = []
let menus = {start: 1, end: 2, wall: 3}
let modes = {initial: 1, searching: 2, done:3}
let algorithms = {
    dijkstra: {key: 1, name: "Dijkstra's", description: `The father of pathfinding algorithms. It guarantees the shortest path. The algorithm doesn't have any idea about the location of end point. So, it searches every direction equally. That's why, it's the slowest of all.`},
    aStar: {key:2, name: "A* Search", description: `Arguably the best pathfinding algorithm. It uses heuristics to guarantee the shortest path much faster than Dijkstra's Algorithm. The algorithm takes into account of the distance from end node . So, it searches the direction of the end node more than that of others.`},
    greedyBestFirstSearch: {key:3, name: "Greedy Best First Search", description: `A faster, more heuristic-heavy version of A*. It does not guarantee the shortest path. The algorithm takes into account of the distance from end node and searches the direction of the end node first then the other directions.`},
    swarm: {key:4, name: "Swarm", description: `A mixture of Dijkstra's Algorithm and A*. It does not guarantee the shortest path. The algorithm takes into account of the distance from end node and searches the direction of the end node more than that of others.`},
    convergentSwarm: {key:5, name: "Convergent Swarm", description: `The faster, more heuristic-heavy version of Swarm. It does not guarantee the shortest path. The algorithm searches the direction of the end node heavily than that of others.`},
    biDirectionalSwarm: {key:6, name: "Bi-Directional Swarm", description: `Swarm from both sides. It does not guarantee the shortest path`},
}
let speeds = {
    slow: {key:1, name:'Slow', speed: 1},
    average: {key:2, name:'Average', speed: 2},
    fast: {key:3, name:'Fast', speed: 10},
}
let mazes = {
    // Recursive Division: {key: 1, name: "Vertical Skew Maze"},
    // verticalSkew: {key: 2, name: "Vertical Skew Maze"},
    // horizontalSkew: {key: 3, name: "Horizontal Skew Maze"},
    horizontalWall: {key: 4, name: "Horizontal Wall"},
    verticalWall: {key: 5, name: "Vertical Wall"},
    simpleStair: {key: 6, name: "Simple Stair Pattern"},
    none: {key: 7, name: "None"},
}
let menuSelected = menus.wall
let mode = modes.initial
let algorithm = algorithms.dijkstra
let speed = speeds.average

const MAZE_TIME = 50
const PATH_TIME = 50
const SEARCH_TIME = 20
const CLEAR_GRAPH_MESSAGE = "Clear Graph First"

document.addEventListener('DOMContentLoaded', () => {
    showAlgorithmList()
    showMazeList()
    showSpeedList()
    updateVisualizerButton()
    plotGraph()
    indicateStartingPoint()
    indicateEndPoint()
    handleUserEvent()
})

function handleUserEvent () {
    algorithmInputHandler()
    mazeInputHandler()
    speedInputHandler()
    visualizerButtonHandler()
    clearButtonHandler()
    menuHandler()
    algorithmInfoHandler()
}

function showAlgorithmList() {
    let algorithmList = document.querySelector('#algorithm_list')
    Object.keys(algorithms).map(index => {
        algorithmList.insertAdjacentHTML('beforeend', `<a class="dropdown-item cursor-pointer" id="algorithm_${algorithms[index].key}">${algorithms[index].name}</a>`)
    })
}
function showMazeList() {
    let mazeList = document.querySelector('#maze_list')
    Object.keys(mazes).map(index => {
        mazeList.insertAdjacentHTML('beforeend', `<a class="dropdown-item cursor-pointer" id="maze_${mazes[index].key}">${mazes[index].name}</a>`)
    })
}
function showSpeedList() {
    let speedList = document.querySelector('#speed_list')
    let selectSpeedButton = document.querySelector('#select_speed_btn')
    speedList.innerHTML = ''
    selectSpeedButton.innerHTML = `Speed: ${speed.name}`
    Object.keys(speeds).map(index => {
        speedList.insertAdjacentHTML('beforeend', `<a class="dropdown-item cursor-pointer" id="speed_${speeds[index].key}">${speeds[index].name}</a>`)
    })
}

function algorithmInputHandler() {
    let dijkstraAlgorithm = document.querySelector('#algorithm_list').querySelector(`#algorithm_${algorithms.dijkstra.key}`)
    let aStarSearch = document.querySelector('#algorithm_list').querySelector(`#algorithm_${algorithms.aStar.key}`)
    let greedyBestFirstSearch = document.querySelector('#algorithm_list').querySelector(`#algorithm_${algorithms.greedyBestFirstSearch.key}`)
    let swarm = document.querySelector('#algorithm_list').querySelector(`#algorithm_${algorithms.swarm.key}`)
    let convergentSwarm = document.querySelector('#algorithm_list').querySelector(`#algorithm_${algorithms.convergentSwarm.key}`)
    let biDirectionalSwarm = document.querySelector('#algorithm_list').querySelector(`#algorithm_${algorithms.biDirectionalSwarm.key}`)
    dijkstraAlgorithm.addEventListener('click', () => {
        algorithm = algorithms.dijkstra
        updateVisualizerButton()
    })
    aStarSearch.addEventListener('click', () => {
        algorithm = algorithms.aStar
        updateVisualizerButton()
    })
    greedyBestFirstSearch.addEventListener('click', () => {
        algorithm = algorithms.greedyBestFirstSearch
        updateVisualizerButton()
    })
    swarm.addEventListener('click', () => {
        algorithm = algorithms.swarm
        updateVisualizerButton()
    })
    convergentSwarm.addEventListener('click', () => {
        algorithm = algorithms.convergentSwarm
        updateVisualizerButton()
    })
    biDirectionalSwarm.addEventListener('click', () => {
        algorithm = algorithms.biDirectionalSwarm
        updateVisualizerButton()
    })
}

function mazeInputHandler() {
    let none = document.querySelector('#maze_list').querySelector(`#maze_${mazes.none.key}`)
    none.addEventListener('click', async () => {
        if (mode===modes.initial) {
            wall = []
            await plotMaze()
        }
    })
    let verticalWallButton = document.querySelector('#maze_list').querySelector(`#maze_${mazes.verticalWall.key}`)
    verticalWallButton.addEventListener('click', async () => {
        if (mode===modes.initial) {
            wall = pattern.verticalWall({row, column, startingPoint, endPoint})
            await plotMaze()
        }
    })
    let horizontalWallButton = document.querySelector('#maze_list').querySelector(`#maze_${mazes.horizontalWall.key}`)
    horizontalWallButton.addEventListener('click', async () => {
        if (mode===modes.initial) {
            wall = pattern.horizontalWall({row, column, startingPoint, endPoint})
            await plotMaze()
        }
    })
    let simpleStairButton = document.querySelector('#maze_list').querySelector(`#maze_${mazes.simpleStair.key}`)
    simpleStairButton.addEventListener('click', async () => {
        if (mode===modes.initial) {
            wall = pattern.simpleStair({row, column, startingPoint, endPoint})
            await plotMaze()
        }
    })
}
function speedInputHandler() {
    let slowButton = document.querySelector('#speed_list').querySelector(`#speed_${speeds.slow.key}`)
    let selectSpeedButton = document.querySelector('#select_speed_btn')
    slowButton.addEventListener('click', async () => {
        speed = speeds.slow
        selectSpeedButton.innerHTML = `Speed: ${speed.name}`
    })
    let averageButton = document.querySelector('#speed_list').querySelector(`#speed_${speeds.average.key}`)
    averageButton.addEventListener('click', async () => {
        speed = speeds.average
        selectSpeedButton.innerHTML = `Speed: ${speed.name}`
    })
    let fastButton = document.querySelector('#speed_list').querySelector(`#speed_${speeds.fast.key}`)
    fastButton.addEventListener('click', async () => {
        speed = speeds.fast
        selectSpeedButton.innerHTML = `Speed: ${speed.name}`
    })
}

function visualizerButtonHandler () {
    let visualizerButton = document.querySelector('#visualize_btn')
    let statusMessage = document.querySelector('#status_message')
    visualizerButton.addEventListener('click', async event => {
        if (mode === modes.done) {
            clearGraph()
            indicateStartingPoint()
            indicateEndPoint()
        }
        mode = modes.searching
        statusMessage.innerHTML = ''
        statusMessage.insertAdjacentHTML('beforeend', `Searching <i class="fas fa-spinner"></i>`)
        let shortestPath = []
        if (algorithm.key===algorithms.dijkstra.key) {
            shortestPath = await dijkstra.search({row, column, wall,startingPoint, endPoint})
        }
        else if (algorithm.key===algorithms.aStar.key) {
            shortestPath = await aStar.search({row, column, wall,startingPoint, endPoint})
        }
        else if (algorithm.key===algorithms.greedyBestFirstSearch.key) {
            shortestPath = await greedyBestFirst.search({row, column, wall,startingPoint, endPoint})
        }
        else if (algorithm.key===algorithms.swarm.key) {
            shortestPath = await swarm.search({row, column, wall,startingPoint, endPoint})
        }
        else if (algorithm.key===algorithms.convergentSwarm.key) {
            shortestPath = await convergentSwarm.search({row, column, wall,startingPoint, endPoint})
        }
        else if (algorithm.key===algorithms.biDirectionalSwarm.key) {
            shortestPath = await biDirectionalSwarm.search({row, column, wall,startingPoint, endPoint})
        }
        statusMessage.innerHTML = shortestPath.length>0 ? `Shortest Distance: ${shortestPath.length-1}` : `No Path Available`
        await visualizeShortestPath(shortestPath)
        mode = modes.done
    })
}

function clearButtonHandler () {
    let clearButton = document.querySelector('#clear_btn')
    clearButton.addEventListener('click', async event => {
        if (mode===modes.initial||mode===modes.done){
            let statusMessage = document.querySelector('#status_message')
            statusMessage.innerHTML = ''
            clearGraph(true)
            indicateStartingPoint()
            indicateEndPoint()
            wall = []
            mode = modes.initial
        }
    })
}

function menuHandler() {
    document.querySelector('#starting_point_btn').addEventListener('click', async event => {
        if (mode===modes.initial) menuSelected = menus.start
        else if (mode === modes.done) alert(CLEAR_GRAPH_MESSAGE)
    })
    document.querySelector('#end_point_btn').addEventListener('click', async event => {
        if (mode===modes.initial) menuSelected = menus.end
        else if (mode === modes.done) alert(CLEAR_GRAPH_MESSAGE)
    })
    document.querySelector('#wall_btn').addEventListener('click', async event => {
        if (mode===modes.initial) menuSelected = menus.wall
        else if (mode === modes.done) alert(CLEAR_GRAPH_MESSAGE)
    })
    let graphBody = document.querySelector('#graph_body')
    graphBody.addEventListener('mousedown', event => {
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
        if (mode===modes.initial && menuSelected===menus.wall){
            plotWall(event)
        }
    })
}

function algorithmInfoHandler() {
    let algorithmInfoButton = document.querySelector('#graph_header').querySelector('.algorithm-info-btn')
    algorithmInfoButton.addEventListener('click', event => {
        let algorithmInfo = document.querySelector('#algorithm_info')
        let algorithmInfoHeader = document.querySelector('#algorithm_info_header')
        let algorithmInfoBody = document.querySelector('#algorithm_info_body')
        algorithmInfoHeader.innerHTML = algorithm.name+" Algorithm"
        algorithmInfoBody.innerHTML = algorithm.description
        algorithmInfo.style.display = "flex"
    })
    let algorithmInfoCancelButton = document.querySelector('#algorithm_info_cancel_btn')
    algorithmInfoCancelButton.addEventListener('click', event => {
        let algorithmInfo = document.querySelector('#algorithm_info')
        algorithmInfo.style.display = "none"
    })
}

function updateVisualizerButton() {
    let visualizerButton = document.querySelector('#visualize_btn')
    visualizerButton.innerHTML = `Visualize ${algorithm.name}`
    let algorithmMessage = document.querySelector('#algorithm_message')
    algorithmMessage.innerHTML = `${algorithm.name} Algorithm`
    let statusMessage = document.querySelector('#status_message')
    statusMessage.innerHTML = ``
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

function clearGraph(clearWall=false) {
    let graphBody = document.querySelector('#graph_body')
    let nodeSize = Math.floor(graphBody.offsetWidth/column-1)
    for (let i=0; i<row; i++) {
        let nodeRow = graphBody.querySelector(`#node_row_${i}`)
        for (let j=0; j<column; j++) {
            let node = nodeRow.querySelector(`#node_${i}_${j}`)
            if (clearWall) node.classList.remove('node-wall')
            node.classList.remove('node-active', 'node-path')
            node.innerHTML=""
            node.style.width = nodeSize+"px"
            node.style.height = nodeSize+"px"
        }
    }
}

function plotWall (event) {
    let point = [
        Number(event.target.getAttribute('data-row')),
        Number(event.target.getAttribute('data-column'))
    ]
    if (!(point.equals(startingPoint)||point.equals(endPoint))){
        let inWall = clearWall(point)
        if (!inWall) {
            wall.unshift(point)
            indicateWallBrick(point)
        }
    }
}

function clearWall (point) {
    let isBrick = false
    wall.map((brick, index) => {
        if (point.equals(brick)){
            wall.splice(index, 1)
            clearWallBrick(point)
            isBrick = true
        }
    })
    return isBrick
}

async function plotMaze () {
    clearGraph(true)
    indicateStartingPoint()
    indicateEndPoint()
    for(let point of wall) {
        let node = document
            .querySelector('#graph_body')
            .querySelector(`#node_row_${point[0]}`)
            .querySelector(`#node_${point[0]}_${point[1]}`)
        // node.classList.add('node-initiate-wall')
        await sleep(Math.round(MAZE_TIME/speed.speed))
        // node.classList.remove('node-initiate-wall')
        node.classList.add('node-wall')
    }
}

async function activatePoint(point, delay=0) {
    let node = document
        .querySelector('#graph_body')
        .querySelector(`#node_row_${point[0]}`)
        .querySelector(`#node_${point[0]}_${point[1]}`)
    node.classList.add('node-initiate-activation')
    await sleep(delay)
    node.classList.remove('node-initiate-activation')
    node.classList.add('node-active')
}

function indicateStartingPoint() {
    let node = document
        .querySelector('#graph_body')
        .querySelector(`#node_row_${startingPoint[0]}`)
        .querySelector(`#node_${startingPoint[0]}_${startingPoint[1]}`)
    node.insertAdjacentHTML('beforeend', '<i class="fa fa-chevron-right" aria-hidden="true"></i>')
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
    node.insertAdjacentHTML('beforeend', '<i class="fa fa-bullseye" aria-hidden="true"></i>')
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
        node.classList.add('node-initiate-path')
        await sleep(Math.round(PATH_TIME/speed.speed))
        node.classList.remove('node-initiate-path')
        node.classList.add('node-path')
    }
}