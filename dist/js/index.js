

module.exports.aStar = aStar;

var FibonacciHeap = require('js/fibonacci-heap');

function aStar(adjacencyList, aerialDistances, start, goal){
	let n = adjacencyList.length;
	let closedSet = new Array(n).fill(false);
	let heap = new FibonacciHeap();
	let openSet = new Array(n).fill(null);

	let cameFrom = new Array(n).fill(null);
	let gScore = new Array(n).fill(Infinity);
	gScore[start] = 0;
	const hScore = aerialDistances[goal];
	let fScore = new Array(n).fill(Infinity);
	fScore[start] = gScore[start] + hScore[start]

	openSet[start] = heap.insert(fScore[start], start);

	while(! heap.isEmpty()){
		current = heap.extractMinimum().value;
		if(current == goal)
			return reconstructPath(cameFrom, current);

		openSet[current] = null;
		closedSet[current] = true;

		//for(let {neighbor, distance} in adjacencyList[current]){
		for(var i=0;i<adjacencyList[current].length;i++){
			var neighbor=adjacencyList[current][i].nodeId;
			var distance=adjacencyList[current][i].distance;
			if(closedSet[neighbor])
				continue;// Ignore the neighbor which is already evaluated.
			
			if(openSet[neighbor]==null)// Discover a new node
				openSet[neighbor] = heap.insert(fScore[neighbor], neighbor);

			tentative_gScore = gScore[current] + distance;
			if(tentative_gScore >= gScore[neighbor])
				continue;// This is not a better path.

			// This path is the best until now. Record it!
			cameFrom[neighbor] = current;
			gScore[neighbor] = tentative_gScore;
			fScore[neighbor] = gScore[neighbor] + hScore[neighbor];
			heap.decreaseKey(openSet[neighbor],fScore[neighbor]);
		}
	}
	return null;
}

function reconstructPath(cameFrom, current){
	if(cameFrom[current]==null)
		return [current];
	else
		return reconstructPath(cameFrom, cameFrom[current]).concat([current]).toJSON();
}

//https://en.wikipedia.org/wiki/A*_search_algorithm
