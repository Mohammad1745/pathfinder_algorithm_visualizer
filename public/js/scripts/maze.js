let pattern = {
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
    }
}