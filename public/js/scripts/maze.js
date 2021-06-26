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

    xxx: ({row, column, startingPoint, endPoint}) => {
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
    }
}