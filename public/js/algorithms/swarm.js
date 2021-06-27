let swarm = {
    search: async ({row, column, weights, wall, startingPoint, endPoint}) => {
        let solvedNodes = []
        let unsolvedNodes = []
        let biasRatio = 2.25
        solvedNodes.push({
            position: startingPoint,
            startDistance: 0,
            biasedDistance: distance(startingPoint, endPoint)/biasRatio,
            prev: null
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
            swarm.updateUnsolvedNodesWithShortestDistance(solvedNodes, unsolvedNodes, row, column, lastNode, nextNodePositions, wall, weights, biasRatio)
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

    updateUnsolvedNodesWithShortestDistance : (solvedNodes, unsolvedNodes, row, column, lastNode, nextNodePositions, wall, weights, biasRatio) => {
        nextNodePositions.map(nextNodePosition => {
            let isNodeValid = nextNodePosition[0] >= 0 && nextNodePosition[0] < row && nextNodePosition[1] >= 0 && nextNodePosition[1] < column
            let isWallBrick = wall.filter(brick => nextNodePosition.equals(brick)).length > 0
            let isWeight = weights.filter(weight => nextNodePosition.equals(weight)).length > 0
            let isSolvedNode = solvedNodes.filter(node => node.position.equals(nextNodePosition)).length > 0
            if (!isSolvedNode && isNodeValid && !isWallBrick) {
                let matchedUnsolvedNode = unsolvedNodes.filter(node => node.position.equals(nextNodePosition))
                let weight = isWeight ? WEIGHT_VALUE : WEIGHT_DEFAULT_VALUE
                if (matchedUnsolvedNode[0]) {
                    if (lastNode.startDistance + weight < matchedUnsolvedNode.startDistance) {
                        matchedUnsolvedNode.startDistance = lastNode.startDistance + weight
                        matchedUnsolvedNode.prev = lastNode.position
                    }
                } else {
                    unsolvedNodes.push({
                        position: nextNodePosition,
                        startDistance: lastNode.startDistance + weight,
                        biasedDistance: (lastNode.startDistance + weight) + distance(nextNodePosition, endPoint)/biasRatio,
                        prev: lastNode.position
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