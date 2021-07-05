let biDirectionalSwarm = {
    search: async ({row, column, wall, weights, startingPoint, endPoint}) => {
        let solvedNodesFromStart = []
        let unsolvedNodesFromStart = []
        let solvedNodesFromEnd = []
        let unsolvedNodesFromEnd = []
        let animation = []
        let heuristics = 0.45
        solvedNodesFromStart.push({
            position: startingPoint,
            startDistance: 0,
            heuristicDistance: distance(startingPoint, endPoint)/heuristics,
            prev: null,
            weight: WEIGHT_DEFAULT_VALUE
        })
        solvedNodesFromEnd.push({
            position: endPoint,
            startDistance: 0,
            heuristicDistance: distance(startingPoint, endPoint)/heuristics,
            prev: null,
            weight: WEIGHT_DEFAULT_VALUE
        })
        animation.unshift(startingPoint)
        animation.unshift(endPoint)

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
            biDirectionalSwarm.updateUnsolvedNodesWithShortestDistance(solvedNodesFromStart, unsolvedNodesFromStart, row, column, lastNodeFromStart, nextNodePositionsFromStart, wall, weights, heuristics, endPoint)
            biDirectionalSwarm.updateUnsolvedNodesWithShortestDistance(solvedNodesFromEnd, unsolvedNodesFromEnd, row, column, lastNodeFromEnd, nextNodePositionsFromEnd, wall, weights, heuristics, startingPoint)
            unsolvedNodesFromStart.sort((a, b) => a.heuristicDistance - b.heuristicDistance)
            unsolvedNodesFromEnd.sort((a, b) => a.heuristicDistance - b.heuristicDistance)
            if (!unsolvedNodesFromStart.length || !unsolvedNodesFromEnd.length) {
                animation.reverse()
                return {animation}
            }
            let targetNodeFromStart = unsolvedNodesFromStart.shift()
            let targetNodeFromEnd = unsolvedNodesFromEnd.shift()
            let matchedSolvedNodeFromStart = solvedNodesFromStart.filter(node => node.position.equals(targetNodeFromStart.position)).length > 0
            let matchedSolvedNodeFromEnd = solvedNodesFromEnd.filter(node => node.position.equals(targetNodeFromEnd.position)).length > 0
            if (!matchedSolvedNodeFromStart) {
                solvedNodesFromStart.push(targetNodeFromStart)
                animation.unshift(targetNodeFromStart.position)
            }if (!matchedSolvedNodeFromEnd) {
                solvedNodesFromEnd.push(targetNodeFromEnd)
                animation.unshift(targetNodeFromEnd.position)
            }
            let duplicateNodes = biDirectionalSwarm.duplicateNodes(solvedNodesFromStart, solvedNodesFromEnd)
            if (duplicateNodes) {
                animation.reverse()
                let {path, weight} = biDirectionalSwarm.extractShortestPath(solvedNodesFromStart, solvedNodesFromEnd, duplicateNodes)
                return {path, weight, animation}
            }
        }
    },

    updateUnsolvedNodesWithShortestDistance : (solvedNodes, unsolvedNodes, row, column, lastNode, nextNodePositions, wall, weights, heuristics, endPoint) => {
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
                        matchedUnsolvedNode.prev = lastNode
                    }
                } else {
                    unsolvedNodes.push({
                        position: nextNodePosition,
                        startDistance: lastNode.startDistance + weight,
                        heuristicDistance: (lastNode.startDistance + weight) + distance(nextNodePosition, endPoint)*heuristics,
                        prev: lastNode,
                        weight
                    })
                }
            }
        })
    },

    extractShortestPath: (solvedNodesFromStart, solvedNodesFromEnd, duplicateNodes) => {
        let path = []
        let weight = 0
        let lastNode = duplicateNodes[1]
        while (lastNode) {
            weight += lastNode.weight
            path.unshift(lastNode.position)
            if (!lastNode.prev) break
            lastNode = lastNode.prev
        }
        path.pop()
        weight -= lastNode.weight
        path.reverse()
        lastNode = duplicateNodes[0]
        while (lastNode) {
            weight += lastNode.weight
            path.unshift(lastNode.position)
            if (!lastNode.prev) break
            lastNode = lastNode.prev
        }
        return {path, weight}
    },

    duplicateNodes : (nodeList1, nodeList2) => {
        for (let node1 of nodeList1) {
            for(let node2 of nodeList2) {
                if (node1.position.equals(node2.position)){
                    return [node1, node2]
                }
            }
        }
        return null
    }
}