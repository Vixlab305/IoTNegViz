function forcegraph() {
    var svg = d3.select("#forcegraph").select("svg"),
        width = 1000,
        height = 1000;
    svg.attrs({width: width, height: height});
    var graph = {nodes: [], links: []};
    datalinkcalculate();
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    var thickscale = d3.scaleLinear().domain(d3.extent(graph.links,d=>d.value)).range([1,10]);
    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) {
            return d.id;
        }).distance(500).strength(0.1))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line")
            .style("stroke-width", function (d) {
                return thickscale(d.value);
            })
            .style("stroke","black")
            .style("stroke-opacity",0.2);

        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(graph.nodes)
            .enter().append("g")

        var circles = node.append("circle")
            .attr("r", 5)
            .attr("fill", function (d) {
                return color(d.group);
            })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        var lables = node.append("text")
            .text(function (d) {
                return d.id;
            })
            .attr('x', 6)
            .attr('y', 3);

        node.append("title")
            .text(function (d) {
                return d.id;
            });

        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.links);

        function ticked() {
            link
                .attr("x1", function (d) {
                    return d.source.x;
                })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });

            node
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                })
        }

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    function datalinkcalculate() {
            var numcut = 50;
        var listfeq = d3.nest()
            .key(function (d) {
                return d.term;
            })
            .rollup(function (words) {
                return words.length;
            })
            .entries(termscollection_org);
        listfeq.sort((a,b)=>b.value-a.value);
        var currentcut = listfeq.slice(0,numcut);

        var nested_pair = d3.nest()
            .key(function (d) {
                return d.title;
            })
            .rollup(function (words) {
                return {targets: data.find(f => f.title === words[0].title).keywords.map(f => f.term)}
            })
            .entries(termscollection_org.filter(d=>currentcut.find(t=>t.key===d.term)!==undefined));

        nested_pair.forEach(d=>{
            var items = d.value.targets;
            for (var i = 0;i<(items.length-1);i++){
                for (var j = i+1;j<items.length;j++){
                    if ((currentcut.find(t=> t.key==items[i] )!==undefined)&&(currentcut.find(t=>t.key==items[j])!==undefined)) {
                        var link = {"source": items[i], "target": items[j], "value": 1};
                        var slink = graph.links.find(l => ((l.source === link.source && l.target === link.target) || (l.source === link.target && l.target === link.source)));
                        if (slink !== undefined)
                            graph.links[graph.links.indexOf(slink)].value++;
                        else
                            graph.links.push(link);
                    }
                }
            }
        });
        // graph.nodes = currentcut.map(d => {
        //     return {id: d, group: 1}
        // });
        graph.links.forEach(d=>{
            if (graph.nodes.length ==0){
                graph.nodes.push({id: d.source,group:1});
                graph.nodes.push({id: d.target,group:1});
            }else {

                var item1 = graph.nodes.find(t => t.id == d.source);
                var item2 = graph.nodes.find(t => t.id == d.target);
                if (item1 == undefined)
                    graph.nodes.push({id: d.source, group: 1});
                if (item2 == undefined)
                    graph.nodes.push({id: d.target, group: 1});
            }
        });


    }
}