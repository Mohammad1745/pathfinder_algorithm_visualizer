let solvedNodes = []
let unsolvedNodes = []

function dijkstraSearch({row, column, startingPoint, endPoint}) {
    solvedNodes = []
    unsolvedNodes = []
    solvedNodes.push({
        position: startingPoint,
        distance: 0,
        prev: null,
        solved: true,
        weight: 1
    })
    activatePoint(startingPoint)

    while (true) {
    // for (let i=0; i<665; i++) {
        let lastNode = solvedNodes[solvedNodes.length-1]
        let nextNodePositions = [
            [lastNode.position[0], lastNode.position[1]+1],
            [lastNode.position[0], lastNode.position[1]-1],
            [lastNode.position[0]+1, lastNode.position[1]],
            [lastNode.position[0]-1, lastNode.position[1]],
        ]
        nextNodePositions.map(nextNodePosition => {
            let isNodeValid = nextNodePosition[0]>=0 && nextNodePosition[0]<row && nextNodePosition[1]>=0 && nextNodePosition[1]<column
            let isSolvedNode = solvedNodes.filter(node => node.position[0] === nextNodePosition[0] && node.position[1] === nextNodePosition[1]).length>0
            if (!isSolvedNode && isNodeValid) {
                let matchedUnsolvedNode = unsolvedNodes.filter(node => node.position[0] === nextNodePosition[0] && node.position[1] === nextNodePosition[1])
                if (matchedUnsolvedNode[0]) {
                    if (lastNode.distance+1 < matchedUnsolvedNode.distance) {
                        matchedUnsolvedNode.distance = lastNode.distance+1
                        matchedUnsolvedNode.prev = lastNode.position
                    }
                } else {
                    unsolvedNodes.push({
                        position: nextNodePosition,
                        distance: lastNode.distance+1,
                        prev: lastNode.position,
                        solved: false,
                        weight: 1
                    })
                }
            }
        })
        unsolvedNodes.sort((a, b) => a.distance-b.distance)
        let targetNode = unsolvedNodes.shift()
        let matchedNode = solvedNodes.filter(node => node.position[0] === targetNode.position[0] && node.position[1] === targetNode.position[1]).length>0
        if (!matchedNode) {
            solvedNodes.push(targetNode)
            activatePoint(targetNode.position, targetNode.distance)
        }
        if (targetNode.position[0]===endPoint[0]&&targetNode.position[1]===endPoint[1]) {
            return extractShortestPath(solvedNodes, targetNode)
        }
    }
}

function extractShortestPath (solvedNodes, lastNode) {
    let shortestPath = []
    while (lastNode) {
        shortestPath.unshift(lastNode.position)
        if (!lastNode.prev) break
        lastNode = solvedNodes.filter(node => node.position[0]===lastNode.prev[0] && node.position[1]===lastNode.prev[1])[0]
    }
    return shortestPath
}