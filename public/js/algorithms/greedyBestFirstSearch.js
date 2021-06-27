let greedyBestFirst = {
    search: async ({row, column, weights, wall, startingPoint, endPoint}) => {
        let solvedNodes = []
        let unsolvedNodes = []
        solvedNodes.push({
            position: startingPoint,
            distance: 0,
            endDistance: distance(startingPoint, endPoint),
            prev: null,
            weight: WEIGHT_DEFAULT_VALUE
        })
        await activatePoint(startingPoint)

        while (true) {
            let lastNode = solvedNodes[solvedNodes.length-1]
            let nextNodePositions = [
                [lastNode.position[0], lastNode.position[1]+1],
                [lastNode.position[0], lastNode.position[1]-1],
                [lastNode.position[0]+1, lastNode.position[1]],
                [lastNode.position[0]-1, lastNode.position[1]],
            ]
            greedyBestFirst.updateUnsolvedNodesWithShortestDistance(solvedNodes, unsolvedNodes, row, column, lastNode, nextNodePositions, wall, weights)
            unsolvedNodes.sort((a, b) => a.endDistance-b.endDistance)
            if (!unsolvedNodes.length) return {}
            let targetNode = unsolvedNodes.shift()
            let matchedSolvedNode = solvedNodes.filter(node => node.position.equals(targetNode.position)).length>0
            if (!matchedSolvedNode) {
                solvedNodes.push(targetNode)
                await activatePoint(targetNode.position, Math.round(SEARCH_TIME/speed.speed))
            }
            if (targetNode.position.equals(endPoint)) {
                return greedyBestFirst.extractShortestPath(solvedNodes, targetNode)
            }
        }
    },

    updateUnsolvedNodesWithShortestDistance: (solvedNodes, unsolvedNodes, row, column, lastNode, nextNodePositions, wall, weights) => {
        nextNodePositions.map(nextNodePosition => {
            let isNodeValid = nextNodePosition[0]>=0 && nextNodePosition[0]<row && nextNodePosition[1]>=0 && nextNodePosition[1]<column
            let isWallBrick = wall.filter(brick => nextNodePosition.equals(brick)).length>0
            let isWeight = weights.filter(weight => nextNodePosition.equals(weight)).length > 0
            let isSolvedNode = solvedNodes.filter(node => node.position.equals(nextNodePosition)).length>0
            if (!isSolvedNode && isNodeValid && !isWallBrick) {
                let matchedUnsolvedNode = unsolvedNodes.filter(node => node.position.equals(nextNodePosition))
                let weight = isWeight ? WEIGHT_VALUE : WEIGHT_DEFAULT_VALUE
                if (matchedUnsolvedNode[0]) {
                    if (lastNode.distance+weight < matchedUnsolvedNode.distance) {
                        matchedUnsolvedNode.distance = lastNode.distance+weight
                        matchedUnsolvedNode.prev = lastNode.position
                    }
                } else {
                    unsolvedNodes.push({
                        position: nextNodePosition,
                        distance: lastNode.distance+weight,
                        endDistance: distance(nextNodePosition, endPoint)+weight,
                        prev: lastNode.position,
                        weight
                    })
                }
            }
        })
    },

    extractShortestPath: (solvedNodes, lastNode) => {
        let path = []
        let weight = 0
        while (lastNode) {
            weight += lastNode.weight
            path.unshift(lastNode.position)
            if (!lastNode.prev) break
            lastNode = solvedNodes.filter(node => node.position.equals(lastNode.prev))[0]
        }
        return {path, weight}
    }
}

