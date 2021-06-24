let row = 20
let column = 50
let startingPoint = [Math.round(row/2), Math.round(row/2)]
let endPoint = [Math.round(row/2), column-Math.round(row/2)]
let menus = {
    start: 1,
    end: 2,
    wall: 3
}
let menuSelected = 2
let mode = 0

document.addEventListener('DOMContentLoaded', () => {
    plotGraph()
    indicateStartingPoint()
    indicateEndPoint()

    if (mode===0) {
        document.querySelector('#visualize_btn').addEventListener('click', async event => {
            clearGraph()
            indicateStartingPoint()
            indicateEndPoint()
            let shortestPath = await dijkstraSearch({row, column, startingPoint, endPoint})
            await visualizeShortestPath(shortestPath)
            mode = 0
        })
    }
    let graphBody = document.querySelector('#graph_body')
    graphBody.addEventListener('mousedown', event => {
        clearEndPoint()
        endPoint = [
            Number(event.target.getAttribute('data-row')),
            Number(event.target.getAttribute('data-column'))
        ]
        indicateEndPoint()
    })
})

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
            node.classList.remove('node-active', 'node-path')
            node.innerHTML=""
        }
    }
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
    node.innerHTML = '>'
}
function indicateEndPoint() {
    let node = document
        .querySelector('#graph_body')
        .querySelector(`#node_row_${endPoint[0]}`)
        .querySelector(`#node_${endPoint[0]}_${endPoint[1]}`)
    node.innerHTML = 'X'
}
function clearEndPoint() {
    let node = document
        .querySelector('#graph_body')
        .querySelector(`#node_row_${endPoint[0]}`)
        .querySelector(`#node_${endPoint[0]}_${endPoint[1]}`)
    node.innerHTML = ''
}
async function visualizeShortestPath(shortestPath) {
    for(let point of shortestPath) {
        let node = document
            .querySelector('#graph_body')
            .querySelector(`#node_row_${point[0]}`)
            .querySelector(`#node_${point[0]}_${point[1]}`)
        node.classList.add('node-path')
        await sleepx(100)
    }
}
const sleepx = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}