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
        let lastNode = solvedNodes[solvedNodes.length-1]
        let nextNodePositions = [
            [lastNode.position[0], lastNode.position[1]+1],
            [lastNode.position[0], lastNode.position[1]-1],
            [lastNode.position[0]+1, lastNode.position[1]],
            [lastNode.position[0]-1, lastNode.position[1]],
        ]
        updateNodesWithShortestDistance(row, column, nextNodePositions, lastNode)
        unsolvedNodes.sort((a, b) => a.distance-b.distance)
        let targetNode = unsolvedNodes.shift()
        let matchedSolvedNode = solvedNodes.filter(node => node.position.equals(targetNode.position)).length>0
        if (!matchedSolvedNode) {
            solvedNodes.push(targetNode)
            activatePoint(targetNode.position, targetNode.distance)
        }
        if (targetNode.position.equals(endPoint)) {
            return extractShortestPath(targetNode)
        }
    }
}

function updateNodesWithShortestDistance (row, column, nextNodePositions, lastNode) {
    nextNodePositions.map(nextNodePosition => {
        let isNodeValid = nextNodePosition[0]>=0 && nextNodePosition[0]<row && nextNodePosition[1]>=0 && nextNodePosition[1]<column
        let isSolvedNode = solvedNodes.filter(node => node.position.equals(nextNodePosition)).length>0
        if (!isSolvedNode && isNodeValid) {
            let matchedUnsolvedNode = unsolvedNodes.filter(node => node.position.equals(nextNodePosition))
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
}

function extractShortestPath (lastNode) {
    let shortestPath = []
    while (lastNode) {
        shortestPath.unshift(lastNode.position)
        if (!lastNode.prev) break
        lastNode = solvedNodes.filter(node => node.position.equals(lastNode.prev))[0]
    }
    return shortestPath
}

Array.prototype.equals = function(arr2) {
    return (
        this.length === arr2.length &&
        this.every((value, index) => value === arr2[index])
    );
};