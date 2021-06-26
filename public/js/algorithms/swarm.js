let swarm = {
    search: async ({row, column, wall, startingPoint, endPoint}) => {
        let solvedNodes = []
        let unsolvedNodes = []
        let biasRatio = 2.25
        solvedNodes.push({
            position: startingPoint,
            startDistance: 0,
            biasedDistance: distance(startingPoint, endPoint)/biasRatio,
            prev: null,
            weight: 1
        })
        await activatePoint(startingPoint)

        while (true) {
            let lastNode = solvedNodes[solvedNodes.length - 1]
            let nextNodePositions = [
                [lastNode.position[0], lastNode.position[1] + 1],
                [lastNode.position[0], lastNode.position[1] - 1],
                [lastNode.position[0] + 1, lastNode.position[1]],
                [lastNode.position[0] - 1, lastNode.position[1]],
            ]
            swarm.updateNodesWithShortestDistance(solvedNodes, unsolvedNodes, row, column, lastNode, nextNodePositions, wall, biasRatio)
            unsolvedNodes.sort((a, b) => a.biasedDistance - b.biasedDistance)
            if (!unsolvedNodes.length) return []
            let targetNode = unsolvedNodes.shift()
            let matchedSolvedNode = solvedNodes.filter(node => node.position.equals(targetNode.position)).length > 0
            if (!matchedSolvedNode) {
                solvedNodes.push(targetNode)
                await activatePoint(targetNode.position, Math.round(SEARCH_TIME/speed.speed))
            }
            if (targetNode.position.equals(endPoint)) {
                return swarm.extractShortestPath(solvedNodes, targetNode)
            }
        }
    },

    updateNodesWithShortestDistance : (solvedNodes, unsolvedNodes, row, column, lastNode, nextNodePositions, wall, biasRatio) => {
        nextNodePositions.map(nextNodePosition => {
            let isNodeValid = nextNodePosition[0] >= 0 && nextNodePosition[0] < row && nextNodePosition[1] >= 0 && nextNodePosition[1] < column
            let isWallBrick = wall.filter(brick => nextNodePosition.equals(brick)).length > 0
            let isSolvedNode = solvedNodes.filter(node => node.position.equals(nextNodePosition)).length > 0
            if (!isSolvedNode && isNodeValid && !isWallBrick) {
                let matchedUnsolvedNode = unsolvedNodes.filter(node => node.position.equals(nextNodePosition))
                if (matchedUnsolvedNode[0]) {
                    if (lastNode.startDistance + 1 < matchedUnsolvedNode.startDistance) {
                        matchedUnsolvedNode.startDistance = lastNode.startDistance + 1
                        matchedUnsolvedNode.prev = lastNode.position
                    }
                } else {
                    unsolvedNodes.push({
                        position: nextNodePosition,
                        startDistance: lastNode.startDistance + 1,
                        biasedDistance: (lastNode.startDistance + 1) + distance(nextNodePosition, endPoint)/biasRatio,
                        prev: lastNode.position,
                        weight: 1
                    })
                }
            }
        })
    },

    extractShortestPath: (solvedNodes, lastNode) => {
        let shortestPath = []
        while (lastNode) {
            shortestPath.unshift(lastNode.position)
            if (!lastNode.prev) break
            lastNode = solvedNodes.filter(node => node.position.equals(lastNode.prev))[0]
        }
        return shortestPath
    }
}