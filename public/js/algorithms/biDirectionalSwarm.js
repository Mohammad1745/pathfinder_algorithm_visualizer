let biDirectionalSwarm = {
    search: async ({row, column, wall, startingPoint, endPoint}) => {
        let solvedNodesFromStart = []
        let unsolvedNodesFromStart = []
        let solvedNodesFromEnd = []
        let unsolvedNodesFromEnd = []
        let biasRatio = 2.25
        solvedNodesFromStart.push({
            position: startingPoint,
            startDistance: 0,
            biasedDistance: distance(startingPoint, endPoint)/biasRatio,
            prev: null,
            weight: 1
        })
        solvedNodesFromEnd.push({
            position: endPoint,
            startDistance: 0,
            biasedDistance: distance(startingPoint, endPoint)/biasRatio,
            prev: null,
            weight: 1
        })
        await activatePoint(startingPoint)
        await activatePoint(endPoint)

        while (true) {
            let lastNodeFromStart = solvedNodesFromStart[solvedNodesFromStart.length - 1]
            let lastNodeFromEnd = solvedNodesFromEnd[solvedNodesFromEnd.length - 1]
            let nextNodePositionsFromStart = [
                [lastNodeFromStart.position[0], lastNodeFromStart.position[1] + 1],
                [lastNodeFromStart.position[0], lastNodeFromStart.position[1] - 1],
                [lastNodeFromStart.position[0] + 1, lastNodeFromStart.position[1]],
                [lastNodeFromStart.position[0] - 1, lastNodeFromStart.position[1]],
            ]
            let nextNodePositionsFromEnd = [
                [lastNodeFromEnd.position[0], lastNodeFromEnd.position[1] - 1],
                [lastNodeFromEnd.position[0], lastNodeFromEnd.position[1] + 1],
                [lastNodeFromEnd.position[0] - 1, lastNodeFromEnd.position[1]],
                [lastNodeFromEnd.position[0] + 1, lastNodeFromEnd.position[1]],
            ]
            biDirectionalSwarm.updateNodesWithShortestDistance(solvedNodesFromStart, unsolvedNodesFromStart, row, column, lastNodeFromStart, nextNodePositionsFromStart, wall, biasRatio, endPoint)
            biDirectionalSwarm.updateNodesWithShortestDistance(solvedNodesFromEnd, unsolvedNodesFromEnd, row, column, lastNodeFromEnd, nextNodePositionsFromEnd, wall, biasRatio, startingPoint)
            unsolvedNodesFromStart.sort((a, b) => a.biasedDistance - b.biasedDistance)
            unsolvedNodesFromEnd.sort((a, b) => a.biasedDistance - b.biasedDistance)
            if (!unsolvedNodesFromStart.length || !unsolvedNodesFromEnd.length) return []
            let targetNodeFromStart = unsolvedNodesFromStart.shift()
            let targetNodeFromEnd = unsolvedNodesFromEnd.shift()
            let matchedSolvedNodeFromStart = solvedNodesFromStart.filter(node => node.position.equals(targetNodeFromStart.position)).length > 0
            let matchedSolvedNodeFromEnd = solvedNodesFromEnd.filter(node => node.position.equals(targetNodeFromEnd.position)).length > 0
            if (!matchedSolvedNodeFromStart) {
                solvedNodesFromStart.push(targetNodeFromStart)
                await activatePoint(targetNodeFromStart.position, SEARCH_TIME)
            }if (!matchedSolvedNodeFromEnd) {
                solvedNodesFromEnd.push(targetNodeFromEnd)
                await activatePoint(targetNodeFromEnd.position, SEARCH_TIME)
            }
            if (biDirectionalSwarm.duplicate(solvedNodesFromStart, solvedNodesFromEnd)) {
                return biDirectionalSwarm.extractShortestPath(solvedNodesFromStart, solvedNodesFromEnd, targetNodeFromStart, targetNodeFromEnd)
            }
        }
    },

    updateNodesWithShortestDistance : (solvedNodes, unsolvedNodes, row, column, lastNode, nextNodePositions, wall, biasRatio, endPoint) => {
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

    extractShortestPath: (solvedNodesFromStart, solvedNodesFromEnd, lastNodeFromStart, lastNodeFromEnd) => {
        let shortestPath = []
        while (lastNodeFromEnd) {
            shortestPath.unshift(lastNodeFromEnd.position)
            if (!lastNodeFromEnd.prev) break
            lastNodeFromEnd = solvedNodesFromEnd.filter(node => node.position.equals(lastNodeFromEnd.prev))[0]
        }
        shortestPath.reverse()
        while (lastNodeFromStart) {
            shortestPath.unshift(lastNodeFromStart.position)
            if (!lastNodeFromStart.prev) break
            lastNodeFromStart = solvedNodesFromStart.filter(node => node.position.equals(lastNodeFromStart.prev))[0]
        }
        return shortestPath
    },

    duplicate : (nodeList1, nodeList2) => {
        for (let value1 of nodeList1) {
            for(let value2 of nodeList2) {
                if (value1.position.equals(value2.position)){
                    return true
                }
            }
        }
        return null
    }
}