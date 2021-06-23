let row = 30
let column = 70


document.addEventListener('DOMContentLoaded', () => {
    plotGraph()
})

function plotGraph() {
    let nodeSize = 20;
    let graphBody = document.querySelector('#graph_body')
    for (let i=0; i<row; i++) {
        graphBody.insertAdjacentHTML('beforeend', `<div class="node-row row m-0" id="node_row_${i}" data-row="${i}"></div>`)
        let nodeRow = graphBody.querySelector(`#node_row_${i}`)
        nodeSize = Math.floor((nodeRow.clientWidth-1)/column)
        for (let j=0; j<column; j++){
            nodeRow.insertAdjacentHTML('beforeend', `<div class="node" id="node_${i}_${j}" data-row="${i}" data-column="${j}"></div>`)
            let node = nodeRow.querySelector(`#node_${i}_${j}`)
            node.style.width = nodeSize+"px"
            node.style.height = nodeSize+"px"
        }
    }
}