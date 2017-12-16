/**
 * Created by Rodrigo on 08-12-2017.
 */
'use strict';
angular.module('newApp')
    .controller('astarCtrl', ['$scope', '$route', '$http', function ($scope, $route, $http) {
        var nodoOrigen;
        var nodoDestino;
        var listaAdyacencia = [];
        //llama tube-map
        var el = document.getElementById('tube-map');
        var json = $http.get('json/objetosMetroMilanver5.json');

        json.then(function (response) {
            var estaciones = response.data.stationMetroMilan;
            $scope.listaEstaciones = [];
            angular.forEach(estaciones, function (stationMetroMilan) {
                $scope.listaEstaciones.push({
                    nombre: stationMetroMilan.stationName,
                    nodo: stationMetroMilan.nodeId
                });
                listaAdyacencia.push(stationMetroMilan.adjacency);
            });

            $scope.calcularRuta = function () {
                console.time("test");
                var origen = nodoOrigen;
                var destino = nodoDestino;
                var listaAdy = listaAdyacencia;
                var aerialDist = response.data.aerialDistance;
                var listaEstaciones = $scope.listaEstaciones;
                var infoEstaciones = [];
                $scope.listaNombres = [];
                var resultado = aStar(listaAdy, aerialDist, origen, destino);
                for (var i = 0; i < resultado.length; i++) {
                    for (var j = 0; j < listaEstaciones.length; j++) {
                        if (resultado[i] == listaEstaciones[j].nodo) {
                            $scope.listaNombres.push(listaEstaciones[j].nombre);
                        }
                    }
                }
                var nombreEstacion = $scope.listaNombres;
                $scope.viaje = calcularTiempo(resultado, estaciones);

                for (var i = 0; i < nombreEstacion.length; i++) {
                    for (var j = 0; j < estaciones.length; j++) {
                        if (nombreEstacion[i] == estaciones[j].stationName) {
                            infoEstaciones.push({
                                nombre: estaciones[j].stationName,
                                linea: estaciones[j].lines
                            });
                        }
                    }
                }
                listaNombre(infoEstaciones);
            }
        });

        //Dibuja Mapa
        var svg = d3.select(el)
            .append('svg')
            .style('width', '600')
            .style('height', '600');;

        var width = 720;
        var height = 600;

        const map = d3.tubeMap()
            .width(width)
            .height(height)
            .margin({
                top: height / 80,
                right: width / 7,
                bottom: height / 10,
                left: width / 10,
            });

        //llama json con datos de las estaciones
        d3.json("./json/pubs.json", function (error, data) {
            svg.datum(data).call(map);
        });

        getNodoOrigen();
        getNodoDestino();
        
        function getNodoOrigen() {
            $scope.$watch('selectedEstacionOrigen', function (newValue, oldValue) {
                if (newValue == oldValue) {
                    return null;
                } else {
                    nodoOrigen = newValue.nodo;
                }
            });
        }

        function getNodoDestino() {
            $scope.$watch('selectedEstacionDestino', function (newValue, oldValue) {
                if (newValue == oldValue) {
                    return null;
                } else {
                    nodoDestino = newValue.nodo;
                }
            });
        }

        function calcularTiempo(resultado, datos) {
            var distancia = 0;
            var velocidad = 45;
            for (var i = 0; i < resultado.length; i++) {
                for (var j = 0; j < datos.length; j++) {
                    if (resultado[i] == datos[j].nodeId) {
                        var adyacencia = datos[j].adjacency;
                        for (var k = 0; k < adyacencia.length; k++) {
                            if (resultado[i + 1] == adyacencia[k].nodeId) {
                                distancia += adyacencia[k].distance;
                            }
                        }
                    }
                }
            }
            return ((distancia / velocidad) + ((resultado.length - 2) * 60) / 3600) * 60;
        }

        function listaNombre(lista) {
            var t;
            var ul = document.createElement('ul');
            ul.setAttribute('id', 'class');
            ul.style.listStyle = "none";
            ul.style.position = "relative";
            ul.style.left = "50%";
            document.getElementById('mapa').appendChild(ul);

            for (var i = 0; i < lista.length; i++) {
                var nombre = lista[i].nombre;
                var linea = lista[i].linea;
                if (i != 0) {
                    var anterior = lista[i - 1].linea;
                }
                if (linea.length > 1 && lista[i + 1] != undefined) {
                    let siguiente = lista[i + 1].nombre;
                    if ((siguiente == "Caiazzo" || siguiente == "Milano Centrale" || siguiente == "Gioia" || siguiente == "Lanza" || siguiente == "Sant'Ambrogio" || siguiente == "Piola") && siguiente != null) {
                        var li = document.createElement('li');
                        li.setAttribute('class', 'item');
                        li.style.borderLeft = "7px solid green";
                        li.style.lineHeight = "40px";
                        ul.appendChild(li);
                        t = document.createTextNode(nombre);
                        li.innerHTML = li.innerHTML + nombre;
                    } else {
                        if (siguiente == "Pasteur" || siguiente == "Lima" || siguiente == "San Babila" || siguiente == "Cordusio" || siguiente == "Cairoli" || siguiente == "Conciliazione") {
                            var li = document.createElement('li');
                            li.setAttribute('class', 'item');
                            li.style.borderLeft = "7px solid red";
                            li.style.lineHeight = "40px";
                            ul.appendChild(li);
                            t = document.createTextNode(nombre);
                            li.innerHTML = li.innerHTML + nombre;
                        } else {
                            if (siguiente == "Sondrio" || siguiente == "Repubblica" || siguiente == "Montenapoleone" || siguiente == "Missori") {
                                var li = document.createElement('li');
                                li.setAttribute('class', 'item');
                                li.style.borderLeft = "7px solid yellow";
                                li.style.lineHeight = "40px";
                                ul.appendChild(li);
                                t = document.createTextNode(nombre);
                                li.innerHTML = li.innerHTML + nombre;
                            }
                        }
                    }
                } else {
                    if (nombre == "Cadorna" && anterior[0] == 1) {
                        var li = document.createElement('li');
                        li.setAttribute('class', 'item');
                        li.style.borderLeft = "7px solid green";
                        li.style.lineHeight = "40px";
                        ul.appendChild(li);
                        t = document.createTextNode(nombre);
                        li.innerHTML = li.innerHTML + nombre;
                    } else {
                        if (linea[0] == 0) {
                            var li = document.createElement('li');
                            li.setAttribute('class', 'item');
                            li.style.borderLeft = "7px solid red";
                            li.style.lineHeight = "40px";
                            ul.appendChild(li);
                            t = document.createTextNode(nombre);
                            li.innerHTML = li.innerHTML + nombre;
                        } else {
                            if (linea[0] == 1) {
                                var li = document.createElement('li');
                                li.setAttribute('class', 'item');
                                li.style.borderLeft = "7px solid green";
                                li.style.lineHeight = "40px";
                                ul.appendChild(li);
                                t = document.createTextNode(nombre);
                                li.innerHTML = li.innerHTML + nombre;
                            } else {
                                if (linea[0] == 2) {
                                    var li = document.createElement('li');
                                    li.setAttribute('class', 'item');
                                    li.style.borderLeft = "7px solid yellow";
                                    li.style.lineHeight = "40px";
                                    ul.appendChild(li);
                                    t = document.createTextNode(nombre);
                                    li.innerHTML = li.innerHTML + nombre;
                                }
                            }
                        }
                    }
                }
            }
            console.timeEnd("test");
            $(document).ready(function () {
                $(".modal").on("hidden.bs.modal", function () {
                    ul.remove(li);
                });
            });
        }

        //Fibonacci
        var FibonacciHeap = function (customCompare) {
            this.minNode = undefined;
            this.nodeCount = 0;
            if (customCompare) {
                this.compare = customCompare;
            }
        };

        /*** Limpia los datos existentes en el monticulo, creando un monticulo vacío*/
        FibonacciHeap.prototype.clear = function () {
            this.minNode = undefined;
            this.nodeCount = 0;
        };

        /** * Decrementa una clave de un nodo, newKey es la clave que se asignará al nodo*/
        FibonacciHeap.prototype.decreaseKey = function (node, newKey) {
            if (typeof node === 'undefined') {
                throw new Error('No puede disminuir la clave de un nodo que no existe');
            }
            if (this.compare({key: newKey}, {key: node.key}) > 0) {
                throw new Error('Nueva clave es más grande que la anterior');
            }

            node.key = newKey;
            var parent = node.parent;
            if (parent && this.compare(node, parent) < 0) {
                cut(node, parent, this.minNode, this.compare);
                cascadingCut(parent, this.minNode, this.compare);
            }
            if (this.compare(node, this.minNode) < 0) {
                this.minNode = node;
            }
        };

        /*** Borra un nodo.*/
        FibonacciHeap.prototype.delete = function (node) {
            var parent = node.parent;
            if (parent) {
                cut(node, parent, this.minNode, this.compare);
                cascadingCut(parent, this.minNode, this.compare);
            }
            this.minNode = node;

            this.extractMinimum();
        };

        /**
         * Extracts and returns the minimum node from the heap.
         *
         * @return {Node} node The heap's minimum node or undefined if the heap is
         * empty.
         */
        FibonacciHeap.prototype.extractMinimum = function () {
            var extractedMin = this.minNode;
            if (extractedMin) {
                // Set parent to undefined for the minimum's children
                if (extractedMin.child) {
                    var child = extractedMin.child;
                    do {
                        child.parent = undefined;
                        child = child.next;
                    } while (child !== extractedMin.child);
                }

                var nextInRootList;
                if (extractedMin.next !== extractedMin) {
                    nextInRootList = extractedMin.next;
                }
                // Remove min from root list
                removeNodeFromList(extractedMin);
                this.nodeCount--;

                // Merge the children of the minimum node with the root list
                this.minNode = mergeLists(nextInRootList, extractedMin.child, this.compare);
                if (this.minNode) {
                    this.minNode = consolidate(this.minNode, this.compare);
                }
            }
            return extractedMin;
        };

        /**
         * Returns the minimum node from the heap.
         *
         * @return {Node} node The heap's minimum node or undefined if the heap is
         * empty.
         */
        FibonacciHeap.prototype.findMinimum = function () {
            return this.minNode;
        };

        /**
         * Inserts a new key-value pair into the heap.
         *
         * @param {Object} key The key to insert.
         * @param {Object} value The value to insert.
         * @return {Node} node The inserted node.
         */
        FibonacciHeap.prototype.insert = function (key, value) {
            var node = new Node(key, value);
            this.minNode = mergeLists(this.minNode, node, this.compare);
            this.nodeCount++;
            return node;
        };

        /**
         * @return {boolean} Whether the heap is empty.
         */
        FibonacciHeap.prototype.isEmpty = function () {
            return this.minNode === undefined;
        };

        /**
         * @return {number} The size of the heap.
         */
        FibonacciHeap.prototype.size = function () {
            if (this.isEmpty()) {
                return 0;
            }
            return getNodeListSize(this.minNode);
        };

        /**
         * Joins another heap to this heap.
         *
         * @param {FibonacciHeap} other The other heap.
         */
        FibonacciHeap.prototype.union = function (other) {
            this.minNode = mergeLists(this.minNode, other.minNode, this.compare);
            this.nodeCount += other.nodeCount;
        };

        /**
         * Compares two nodes with each other.
         *
         * @private
         * @param {Object} a The first key to compare.
         * @param {Object} b The second key to compare.
         * @return {number} -1, 0 or 1 if a < b, a == b or a > b respectively.
         */
        FibonacciHeap.prototype.compare = function (a, b) {
            if (a.key > b.key) {
                return 1;
            }
            if (a.key < b.key) {
                return -1;
            }
            return 0;
        };

        /**
         * Creates an Iterator used to simplify the consolidate() method. It works by
         * making a shallow copy of the nodes in the root list and iterating over the
         * shallow copy instead of the source as the source will be modified.
         *
         * @private
         * @param {Node} start A node from the root list.
         */
        var NodeListIterator = function (start) {
            this.index = -1;
            this.items = [];
            var current = start;
            do {
                this.items.push(current);
                current = current.next;
            } while (start !== current);
        };

        /**
         * @return {boolean} Whether there is a next node in the iterator.
         */
        NodeListIterator.prototype.hasNext = function () {
            return this.index < this.items.length - 1;
        };

        /**
         * @return {Node} The next node.
         */
        NodeListIterator.prototype.next = function () {
            return this.items[++this.index];
        };

        /**
         * Cut the link between a node and its parent, moving the node to the root list.
         *
         * @private
         * @param {Node} node The node being cut.
         * @param {Node} parent The parent of the node being cut.
         * @param {Node} minNode The minimum node in the root list.
         * @param {function} compare The node comparison function to use.
         * @return {Node} The heap's new minimum node.
         */
        function cut(node, parent, minNode, compare) {
            node.parent = undefined;
            parent.degree--;
            if (node.next === node) {
                parent.child = undefined;
            } else {
                parent.child = node.next;
            }
            removeNodeFromList(node);
            minNode = mergeLists(minNode, node, compare);
            node.isMarked = false;
            return minNode;
        }

        /**
         * Perform a cascading cut on a node; mark the node if it is not marked,
         * otherwise cut the node and perform a cascading cut on its parent.
         *
         * @private
         * @param {Node} node The node being considered to be cut.
         * @param {Node} minNode The minimum node in the root list.
         * @param {function} compare The node comparison function to use.
         * @return {Node} The heap's new minimum node.
         */
        function cascadingCut(node, minNode, compare) {
            var parent = node.parent;
            if (parent) {
                if (node.isMarked) {
                    minNode = cut(node, parent, minNode, compare);
                    minNode = cascadingCut(parent, minNode, compare);
                } else {
                    node.isMarked = true;
                }
            }
            return minNode;
        }

        /**
         * Merge all trees of the same order together until there are no two trees of
         * the same order.
         *
         * @private
         * @param {Node} minNode The current minimum node.
         * @param {function} compare The node comparison function to use.
         * @return {Node} The new minimum node.
         */
        function consolidate(minNode, compare) {
            var aux = [];
            var it = new NodeListIterator(minNode);
            while (it.hasNext()) {
                var current = it.next();

                // If there exists another node with the same degree, merge them
                while (aux[current.degree]) {
                    if (compare(current, aux[current.degree]) > 0) {
                        var temp = current;
                        current = aux[current.degree];
                        aux[current.degree] = temp;
                    }
                    linkHeaps(aux[current.degree], current, compare);
                    aux[current.degree] = undefined;
                    current.degree++;
                }

                aux[current.degree] = current;
            }

            minNode = undefined;
            for (var i = 0; i < aux.length; i++) {
                if (aux[i]) {
                    // Remove siblings before merging
                    aux[i].next = aux[i];
                    aux[i].prev = aux[i];
                    minNode = mergeLists(minNode, aux[i], compare);
                }
            }
            return minNode;
        }

        /**
         * Removes a node from a node list.
         *
         * @private
         * @param {Node} node The node to remove.
         */
        function removeNodeFromList(node) {
            var prev = node.prev;
            var next = node.next;
            prev.next = next;
            next.prev = prev;
            node.next = node;
            node.prev = node;
        }

        /**
         * Links two heaps of the same order together.
         *
         * @private
         * @param {Node} max The heap with the larger root.
         * @param {Node} min The heap with the smaller root.
         * @param {function} compare The node comparison function to use.
         */
        function linkHeaps(max, min, compare) {
            removeNodeFromList(max);
            min.child = mergeLists(max, min.child, compare);
            max.parent = min;
            max.isMarked = false;
        }

        /**
         * Merge two lists of nodes together.
         *
         * @private
         * @param {Node} a The first list to merge.
         * @param {Node} b The second list to merge.
         * @param {function} compare The node comparison function to use.
         * @return {Node} The new minimum node from the two lists.
         */
        function mergeLists(a, b, compare) {
            if (!a && !b) {
                return undefined;
            }
            if (!a) {
                return b;
            }
            if (!b) {
                return a;
            }

            var temp = a.next;
            a.next = b.next;
            a.next.prev = a;
            b.next = temp;
            b.next.prev = b;

            return compare(a, b) < 0 ? a : b;
        }

        /**
         * Gets the size of a node list.
         *
         * @private
         * @param {Node} node A node within the node list.
         * @return {number} The size of the node list.
         */
        function getNodeListSize(node) {
            var count = 0;
            var current = node;

            do {
                count++;
                if (current.child) {
                    count += getNodeListSize(current.child);
                }
                current = current.next;
            } while (current !== node);

            return count;
        }

        /**
         * Creates a FibonacciHeap node.
         *
         * @constructor
         * @private
         */
        function Node(key, value) {
            this.key = key;
            this.value = value;
            this.prev = this;
            this.next = this;
            this.degree = 0;

            this.parent = undefined;
            this.child = undefined;
            this.isMarked = undefined;
        }


        //aStar
        function aStar(adjacencyList, aerialDistances, start, goal) {

            let n = adjacencyList.length;
            let closedSet = new Array(n).fill(false);
            let heap = new FibonacciHeap();
            let openSet = new Array(n).fill(null);

            let cameFrom = new Array(n).fill(null);
            let gScore = new Array(n).fill(Infinity);
            gScore[start] = 0;
            const hScore = aerialDistances[goal];
            let fScore = new Array(n).fill(Infinity);
            fScore[start] = gScore[start] + hScore[start];

            openSet[start] = heap.insert(fScore[start], start);

            while (!heap.isEmpty()) {
                var current = heap.extractMinimum().value;
                if (current == goal)
                    return reconstructPath(cameFrom, current);

                openSet[current] = null;
                closedSet[current] = true;

                //for(let {neighbor, distance} in adjacencyList[current]){
                for (var i = 0; i < adjacencyList[current].length; i++) {
                    var neighbor = adjacencyList[current][i].nodeId;
                    var distance = adjacencyList[current][i].distance;
                    if (closedSet[neighbor])
                        continue;// Ignore the neighbor which is already evaluated.

                    if (openSet[neighbor] == null)// Discover a new node
                        openSet[neighbor] = heap.insert(fScore[neighbor], neighbor);

                    var tentative_gScore = gScore[current] + distance;
                    if (tentative_gScore >= gScore[neighbor])
                        continue;// This is not a better path.

                    // This path is the best until now. Record it!
                    cameFrom[neighbor] = current;
                    gScore[neighbor] = tentative_gScore;
                    fScore[neighbor] = gScore[neighbor] + hScore[neighbor];
                    heap.decreaseKey(openSet[neighbor], fScore[neighbor]);
                }
            }
            return null;
        }

        function reconstructPath(cameFrom, current) {
            if (cameFrom[current] == null)
                return [current];
            else
                return reconstructPath(cameFrom, cameFrom[current]).concat([current]);
        }

        //aStar(adjacencyList,aerialDistances);


    }]);

