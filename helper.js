const PATH_TIME = 50
const SEARCH_TIME = 10
const CLEAR_GRAPH_MESSAGE = "Clear Graph First"

Array.prototype.equals = function(arr2) {
    return (
        this.length === arr2.length &&
        this.every((value, index) => value === arr2[index])
    )
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}