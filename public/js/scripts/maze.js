let pattern = {
    googleEarth: ({row, column, startingPoint, endPoint}) => {
        let plots = pattern.earthPlots({row, column, startingPoint, endPoint})
        let traffic = pattern.traffic({plots, row, column, startingPoint, endPoint})
        return plots.concat(traffic);
    },

    simpleStair: ({row, column, startingPoint, endPoint}) => {
        let maze = []
        let r = row-3
        let iterator = -1
        for (let c =7; c<column-2; c++) {
            if (!(startingPoint.equals([r,c]) || endPoint.equals([r,c]))) {
                maze.unshift([r, c])
            }
            if (r<3) iterator = +1
            else if (r>=row-3) iterator = -1
            r += iterator
        }
        maze.reverse()
        return maze;
    },

    straightLine: ({row, column, startingPoint, endPoint}) => {
        let shuffler = Math.round(Math.random()*4)
        if (shuffler===0) return pattern.verticalWall({row, column, startingPoint, endPoint})
        else if (shuffler===1) return pattern.horizontalWall({row, column, startingPoint, endPoint})
        else if (shuffler===2) return pattern.ascendingWall({row, column, startingPoint, endPoint})
        else return pattern.descendingWall({row, column, startingPoint, endPoint})
    },

    randomObstacle: ({row, column, startingPoint, endPoint}) => {
        let maze = []
        let shuffler = Math.floor(Math.random() * 3 + 2)
        for (let i=0; i<row*column/shuffler; i++) {
            let r = Math.floor(Math.random() * (row-1))
            let c = Math.floor(Math.random() * (column-1))
            let matched = maze.filter(point => point.equals([r, c])).length
            if (!(matched || startingPoint.equals([r,c]) || endPoint.equals([r,c]))) {
                maze.unshift([r, c])
            }
        }
        return maze
    },

    recursiveMaze: ({row, column, startingPoint, endPoint}) => {
        let border = pattern.generateBorder({row, column, startingPoint, endPoint})
        let maze =  pattern.generateMaze({row, column, startingPoint, endPoint})
        maze =  border.concat(maze)
        for(let i=0; i<maze.length; i++) {
            if (startingPoint.equals(maze[i]) || endPoint.equals(maze[i])) {
                maze.splice(i, 1)
            }
        }
        return maze
    },

    recursiveAntiMaze: ({row, column, startingPoint, endPoint}) => {
        let border = pattern.generateBorder({row, column, startingPoint, endPoint})
        let maze =  pattern.generateMaze({row, column, startingPoint, endPoint})
        maze = border.concat(maze)
        let antiMaze = pattern.generateAntiMaze({maze, row, column})
        for(let i=0; i<antiMaze.length; i++) {
            if (startingPoint.equals(antiMaze[i]) || endPoint.equals(antiMaze[i])) {
                antiMaze.splice(i, 1)
            }
        }
        return antiMaze
    },

    verticalWall: ({row, column, startingPoint, endPoint}) => {
        let maze = []
        for (let c=7; c<column; c+=7) {
            let off = Math.floor(Math.random()*(row-1))+1
            for (let r=0; r<row; r++) {
                if (!(r===off || startingPoint.equals([r,c]) || endPoint.equals([r,c]))) {
                    maze.unshift([r, c])
                }
            }
        }
        maze.reverse()
        return maze;
    },

    horizontalWall: ({row, column, startingPoint, endPoint}) => {
        let maze = []
        for (let r=7; r<row; r+=7) {
            let off = []
            for(let i=0; i<4; i++){
                off.unshift(Math.floor(Math.random()*(column-1))+1)
            }
            for (let c=0; c<column; c++) {
                if (!(off.filter(x=>x===c).length || startingPoint.equals([r,c]) || endPoint.equals([r,c]))) {
                    maze.unshift([r, c])
                }
            }
        }
        maze.reverse()
        return maze;
    },

    ascendingWall: ({row, column, startingPoint, endPoint}) => {
        let maze = []
        let r = row-5
        let off = Math.floor(Math.random()*(row-1))+1
        for (let c=0; c<column-1; c++) {
            if (!(r===off || startingPoint.equals([r,c]) || endPoint.equals([r,c]))) {
                maze.unshift([r, c])
            }
            r--
            if (r<0) {
                r = row - 1
                c -= 10
                off = Math.floor(Math.random()*(row-1))+1
            }
        }
        maze.reverse()
        return maze;
    },

    descendingWall: ({row, column, startingPoint, endPoint}) => {
        let maze = []
        let r = 5
        let off = Math.floor(Math.random()*(row-1))+1
        for (let c=0; c<column; c++) {
            if (!(r===off || startingPoint.equals([r,c]) || endPoint.equals([r,c]))) {
                maze.unshift([r, c])
            }
            r++
            if (r>=row) {
                r = 0
                c -= 10
                off = Math.floor(Math.random()*(row-1))+1
            }
        }
        maze.reverse()
        return maze;
    },

    earthPlots: ({row, column, startingPoint, endPoint}) => {
        let plots = []
        let increment = 5
        for (let startColumn=1; startColumn<column; startColumn++){
            increment = randomNumber(2,8)
            for (let c = startColumn; c < startColumn+increment && c < column; c++) {
                for (let startRow=0; startRow<column; startRow++){
                    for (let r=startRow; r<startRow+increment && r < row; r++){
                        if (!(startingPoint.equals([r, c]) || endPoint.equals([r, c]))) {
                            plots.push({coordinate: [r, c], type: 'wall'})
                        }
                    }
                    startRow += increment
                }
            }
            startColumn += increment
        }
        return plots
    },

    traffic: ({plots, row, column, startingPoint, endPoint}) => {
        let traffic = []
        let shuffler = Math.floor(Math.random() * 3 + 2)
        for (let i=0; i<row*column/shuffler; i++) {
            let r = Math.floor(Math.random() * (row-1))
            let c = Math.floor(Math.random() * (column-1))
            let matched = traffic.filter(point => point.coordinate.equals([r, c])).length
            if (!matched) matched = plots.filter(point => point.coordinate.equals([r,c])).length
            if (!(matched || startingPoint.equals([r,c]) || endPoint.equals([r,c]))) {
                traffic.push({coordinate: [r, c], type: "weight"})
            }
        }
        return traffic
    },

    generateBorder: ({row, column, startingPoint, endPoint}) => {
        let border = []
        for (let r=0; r<row; r++) {
            for (let c=0; c<column; c++) {
                if (!(startingPoint.equals([r, c]) || endPoint.equals([r, c])) && (r===0||r===row-1 || c===0||c===column-1)) {
                    border.unshift([r, c])
                }
            }
        }
        border.reverse()
        return border
    },

    generateAntiMaze: ({maze, row, column}) => {
        let antiMaze = []
        for (let r=0; r<row; r++) {
            for (let c=0; c<column; c++) {
                let matched = maze.filter(point => point.equals([r, c])).length
                if (!matched) {
                    antiMaze.unshift([r, c])
                }
            }
        }
        antiMaze.reverse()
        return antiMaze
    },

    generateMaze: ({row, column, startingPoint, endPoint}) => {
        let maze = [
            [4,1],[10,1],[14,1],[20,1],
            [2,2],[3,2],[4,2],[6,2],[7,2],[8,2],[10,2],[11,2],[12,2],[14,2],[15,2],[16,2],[18,2],[20,2],[22,2],[23,2],[24,2],
            [4,3],[8,3],[10,3],[14,3],[18,3],[20,3],
            [1,4],[2,4],[4,4],[5,4],[6,4],[8,4],[9,4],[10,4],[12,4],[13,4],[14,4],[15,4],[16,4],[17,4],[18,4],[20,4],[21,4],[22,4],[24,4],
            [4,5],[14,5],[20,5],
            [1,6],[2,6],[4,6],[5,6],[6,6],[8,6],[9,6],[10,6],[11,6],[12,6],[13,6],[14,6],[16,6],[18,6],[19,6],[20,6],[22,6],[23,6],[24,6],
            [14,7],[16,7],[20,7],
            [1,8],[2,8],[4,8],[6,8],[7,8],[8,8],[10,8],[11,8],[12,8],[14,8],[15,8],[16,8],[17,8],[18,8],[20,8],[22,8],[23,8],[24,8],
            [4,9],[8,9],[12,9],[14,9],[20,9],[24,9],
            [1,10],[2,10],[4,10],[5,10],[6,10],[7,10],[8,10],[9,10],[10,10],[11,10],[12,10],[13,10],[14,10],[16,10],[17,10],[18,10],[20,10],[21,10],[22,10],[23,10],[24,10],
            [14,11],[18,11],[20,11],
            [1,12],[2,12],[4,12],[6,12],[8,12],[9,12],[10,12],[12,12],[13,12],[14,12],[15,12],[16,12],[18,12],[19,12],[20,12],[21,12],[22,12],[24,12],
            [4,13],[6,13],[10,13],[20,13],[24,13],
            [1,14],[2,14],[3,14],[4,14],[5,14],[6,14],[7,14],[8,14],[9,14],[10,14],[12,14],[13,14],[14,14],[15,14],[16,14],[17,14],[18,14],[19,14],[20,14],[21,14],[22,14],[24,14],
            [2,15],[10,15],[16,15],[20,15],
            [2,16],[4,16],[5,16],[6,16],[7,16],[8,16],[9,16],[10,16],[12,16],[14,16],[15,16],[16,16],[18,16],[20,16],[22,16],[23,16],[24,16],
            [2,17],[10,17],[12,17],[18,17],[24,17],
            [2,18],[4,18],[5,18],[6,18],[7,18],[8,18],[9,18],[10,18],[12,18],[13,18],[14,18],[15,18],[16,18],[18,18],[20,18],[21,18],[22,18],[23,18],[24,17],
            [4,19],[10,19],[16,19],[18,19],[20,19],
            [2,20],[4,20],[6,20],[7,20],[8,20],[10,20],[11,20],[12,20],[13,20],[14,20],[15,20],[16,20],[18,20],[19,20],[20,20],[22,20],[23,20],[24,20],
            [2,21],[6,21],[10,21],[20,21],
            [2,22],[4,22],[6,22],[7,22],[8,22],[9,22],[10,22],[11,22],[12,22],[14,22],[16,22],[17,22],[18,22],[20,22],[21,22],[22,22],[23,22],[24,22],
            [2,23],[4,23],[10,23],[14,23],[16,23],[20,23],[24,23],
            [2,24],[3,24],[4,24],[5,24],[6,24],[7,24],[8,24],[10,24],[12,24],[13,24],[14,24],[15,24],[16,24],[17,24],[18,24],[20,24],[22,24],[23,24],[24,24],
            [2,25],[10,25],[14,25],[16,25],[20,25],
            [2,26],[3,26],[4,26],[5,26],[6,26],[8,26],[9,26],[10,26],[11,26],[12,26],[14,26],[16,26],[17,26],[18,26],[20,26],[22,26],[23,26],[24,26],
            [2,27],[4,27],[14,27],[20,27],[24,27],
            [2,28],[4,28],[6,28],[7,28],[8,28],[10,28],[11,28],[12,28],[13,28],[14,28],[15,28],[16,28],[18,28],[19,28],[20,28],[22,28],[23,28],[24,28],
            [2,29],[6,29],[10,29],[20,29],[22,29],
            [2,30],[3,30],[4,30],[5,30],[6,30],[7,30],[8,30],[9,30],[10,30],[11,30],[12,30],[13,30],[14,30],[15,30],[16,30],[17,30],[18,30],[19,30],[20,30],[22,30],[24,30],
            [2,31],[8,31],[12,31],[14,31],[18,31],[20,31],[24,31],
            [2,32],[4,32],[5,32],[6,32],[8,32],[10,32],[11,32],[12,32],[14,32],[15,32],[16,32],[18,32],[20,32],[22,32],[24,32],
            [2,33],[4,33],[12,33],[22,33],
            [2,34],[3,34],[4,34],[5,34],[6,34],[8,34],[10,34],[11,34],[12,34],[13,34],[14,34],[16,34],[17,34],[18,34],[19,34],[20,34],[21,34],[22,34],[23,34],[24,34],
            [8,35],[16,35],[20,35],
            [1,36],[2,36],[4,36],[5,36],[6,36],[7,36],[8,36],[10,36],[11,36],[12,36],[14,36],[15,36],[16,36],[17,36],[18,36],[20,36],[21,36],[22,36],[23,36],[24,36],
            [8,37],[12,37],[16,37],[20,37],[24,37],
            [1,38],[2,38],[3,38],[4,38],[6,38],[7,38],[8,38],[9,38],[10,38],[11,38],[12,38],[14,38],[15,38],[16,38],[17,38],[18,38],[20,38],[22,38],[24,38],
            [2,39],[6,39],[10,39],[12,39],[20,39],[22,39],
            [2,40],[4,40],[5,40],[6,40],[8,40],[9,40],[10,40],[12,40],[13,40],[14,40],[16,40],[17,40],[18,40],[19,40],[20,40],[22,40],[23,40],[24,40],
            [6,41],[12,41],[20,41],[22,41],
            [2,42],[3,42],[4,42],[6,42],[7,42],[8,42],[10,42],[11,42],[12,42],[14,42],[16,42],[17,42],[18,42],[20,42],[22,42],[23,42],[24,42],
            [2,43],[12,43],[14,43],[16,43],[20,43],[24,43],
            [1,44],[2,44],[3,44],[4,44],[5,44],[6,44],[8,44],[9,44],[10,44],[11,44],[12,44],[13,44],[14,44],[15,44],[16,44],[17,44],[18,44],[19,44],[20,44],[22,44],[23,44],[24,44],
            [2,45],[16,45],[20,45],
            [2,46],[3,46],[4,46],[6,46],[8,46],[9,46],[10,46],[12,46],[13,46],[14,46],[16,46],[17,46],[18,46],[20,46],[21,46],[22,46],[24,46],
            [6,47],[10,47],[12,47],[20,47],[24,47],
            [1,48],[2,48],[3,48],[4,48],[5,48],[6,48],[7,48],[8,48],[9,48],[10,48],[12,48],[13,48],[14,48],[15,48],[16,48],[17,48],[18,48],[20,48],[21,48],[22,48],[23,48],[24,48],
            [14,49],[16,49],
            [1,50],[2,50],[3,50],[4,50],[5,50],[6,50],[8,50],[9,50],[10,50],[11,50],[12,50],[13,50],[14,50],[16,50],[18,50],[19,50],[20,50],[21,50],[22,50],[24,50],
            [14,51],[16,51],[20,51],
            [2,52],[3,52],[4,52],[5,52],[6,52],[7,52],[8,52],[9,52],[10,52],[11,52],[12,52],[14,52],[16,52],[17,52],[18,52],[20,52],[21,52],[22,52],[23,52],[24,52],
            [4,53],[8,53],[12,53],[14,53],[16,53],[20,53],[24,53],
            [1,54],[2,54],[4,54],[5,54],[6,54],[8,54],[10,54],[11,54],[12,54],[14,54],[16,54],[17,54],[18,54],[20,54],[21,54],[22,54],[24,54],
            [4,55],[8,55],[12,55],[14,55],[16,55],[20,55],
            [2,56],[3,56],[4,56],[5,56],[6,56],[8,56],[10,56],[11,56],[12,56],[16,56],[17,56],[18,56],[20,56],[21,56],[22,56],[23,56],[24,56],
            [4,57],[12,57],[14,57],[16,57],[20,57],
            [2,58],[3,58],[4,58],[5,58],[6,58],[8,58],[9,58],[10,58],[11,58],[12,58],[14,58],[16,58],[18,58],[19,58],[20,58],[22,58],[23,58],[24,58],
            [4,59],[14,59],[16,59],[20,59],[24,59],
        ]
        let rowShuffler = Math.round(Math.random()*row)
        let columnShuffler = Math.round(Math.random()*column)
        for(let i=0; i<maze.length; i++) {
            maze[i][0] -= rowShuffler
            maze[i][1] -= columnShuffler
            if (maze[i][0]<=0) maze[i][0] += row-2
            if (maze[i][1]<=0) maze[i][1] += column-2
        }
        return maze
    }
}