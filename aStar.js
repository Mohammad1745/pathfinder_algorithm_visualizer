async function aStarSearch({row, column, wall, startingPoint, endPoint}) {
    solvedNodes = []
    unsolvedNodes = []
    solvedNodes.push({
        position: startingPoint,
        distance: 0,
        queuedDistance: distance(startingPoint, endPoint),
        prev: null,
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
        updateNodesWithShortestDistance(row, column, nextNodePositions, lastNode, wall)
        unsolvedNodes.sort((a, b) => a.queuedDistance-b.queuedDistance)
        if (!unsolvedNodes.length) return []
        let targetNode = unsolvedNodes.shift()
        let matchedSolvedNode = solvedNodes.filter(node => node.position.equals(targetNode.position)).length>0
        if (!matchedSolvedNode) {
            solvedNodes.push(targetNode)
            activatePoint(targetNode.position, targetNode.distance)
            await sleep(SEARCH_TIME)
        }
        if (targetNode.position.equals(endPoint)) {
            return extractShortestPath(targetNode)
        }
    }
}

function updateNodesWithShortestDistance (row, column, nextNodePositions, lastNode, wall) {
    nextNodePositions.map(nextNodePosition => {
        let isNodeValid = nextNodePosition[0]>=0 && nextNodePosition[0]<row && nextNodePosition[1]>=0 && nextNodePosition[1]<column
        let isWallBrick = wall.filter(brick => nextNodePosition.equals(brick)).length>0
        let isSolvedNode = solvedNodes.filter(node => node.position.equals(nextNodePosition)).length>0
        if (!isSolvedNode && isNodeValid && !isWallBrick) {
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
                    queuedDistance: lastNode.distance+1+distance(nextNodePosition, endPoint),
                    prev: lastNode.position,
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
