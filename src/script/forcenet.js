function forcegraph(selector,searchbox) {
    var svg2main = d3.select(selector).select('svg');
    var margin = { top: -5, right: -5, bottom: -5, left: -5 },
        width = $(selector).width() - margin.left - margin.right,
        height = $(selector).height() - margin.top - margin.bottom;

    svg2main.attrs({width: width, height: height});
    var svg2 = svg2main.append('g')
        .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.right + ")");
    var guide = svg2.append("g").attr("transform","translate(10,20)");
    guide.append("svg:text")
        .append("svg:tspan").style("font-weight","bold").text("Dynamic Network:").attr("fill","black")
        .append("svg:tspan").style("font-weight","normal").text(" Drag - Drop - Zoom for more detail.").attr("fill","black");
    var rect = svg2.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all");
    var force2 = d3.forceSimulation()
        .force("charge", d3.forceManyBody().strength(-180 ))
        .force("gravity", d3.forceManyBody(0.15))
        .alpha(1)
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("link", d3.forceLink().id(function(d) { return d.key }).distance(80));
    computeNodes();
    var linkScale = d3.scaleLinear()
            .range([0.1, 3])
            .domain([Math.round(mainconfig.minlink)-0.4, Math.max(d3.max(links2,d=>d.count),10)]);
    var drag = d3.drag()
        .subject(function (d) { return d; })
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);

    var zoom = d3.zoom()
        .scaleExtent([0, 10])
        .on("zoom", zoomed);

    svg2.call(zoom);


/// The second force directed layout ***********

    var container = svg2.append("g");

    force2.nodes(nodes2);
    force2.force("link").links(links2);


    var link2 = container.selectAll(".link2")
        .data(links2)
        .enter().append("line")
        .attr("class", "link2")
        .style("stroke", "#777")
        .style("stroke-width", function (d) {
            return 0.1 + linkScale(d.count);
        });

    var node2 = container.selectAll(".nodeText2")
        .data(nodes2)
        .enter().append("g");

    node2.append("text")
        .attr("class", ".nodeText2")
        .text(function (d) {
            return d.key
        })
        .attr("dy", ".35em")
        .style("fill", function (d) {
            return color(categories.indexOf(d.group));
        })
        .style("text-anchor", "middle")
        .style("text-shadow", "1px 1px 0 rgba(55, 55, 55, 0.6")
        .style("font-weight", function (d) {
            return d.isSearchTerm ? "bold" : "";
        })
        .attr("dy", ".21em")
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .on('contextmenu', function(d){
            d3.event.preventDefault();
            $(searchbox).val(d.key);
            M.Sidenav.getInstance($(selector)).close();
            setTimeout(function () {
                // do calculations
                // update graph
                // clear spinner
                searchWord();
            }, 0);
        });
    node2.call(drag);

    force2.on("tick", function () {
        link2.attr("x1", function (d) {
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


        node2
            .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    zoom.scaleTo(svg2, 0.5);

    function zoomed() {
        const currentTransform = d3.event.transform;
        container.attr("transform", currentTransform);
        //slider.property("value", currentTransform.k);
    }

    function dragstarted(d) {
        d3.select(this).classed("dragging", true);
        if (!d3.event.active) force2.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
        // d3.select(this).attr('transform', d => {
        //     d.x = d3.event.x;
        //     d.y = d3.event.y;
        //     return 'translate('+ d.x+','+d.y+')'});
    }

    function dragended(d) {
        d3.select(this).classed("dragging", false);
        if (!d3.event.active) force2.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}
function computeNodes() {
    var termArray = termscollection_org;
    var nested_data = d3.nest()
        .key(function (d) {
            return d.term;
        })
        .key(function (d) {
            return d.title;
        })
        .rollup(function (words) {
            return words[0];
        })
        .entries(termscollection_org);
    nested_data.sort((a,b)=> b.values.length - a.values.length);
    var numNode = Math.min(60, nested_data.length);
    var numNode2 = Math.min(numNode*2, nested_data.length);
    nested_data = nested_data.slice(0,numNode2);
    nested_data = nested_data.filter(d=>d.values.length>mainconfig.minfreq);
    console.log("nested_data.length = "+nested_data.length);
    
    var collection = [];
    nested_data.forEach(d=> d.values.forEach(t=>collection.push({title: t.key, term:{key: d.key, frequency: d.values.length}})));
    nodes2 = [];
    nested_data.forEach(d=> { nodes2.push({key: d.key, frequency: d.values.length,group: d.values[0].value.category})});
    console.log("nodes2.length = "+nodes2.length);
    nested_data = d3.nest()
        .key(function (d) {
            return d.title;
        })
        .entries(collection);
    var linkmap={};
    nested_data.forEach(d=>{
        var term = d.values;
        for (var i =0; i< term.length-1; i++){
            for (var j =i+1; j< term.length; j++){
                var temp =  linkmap[term[i].term.key+"___"+term[j].term.key]||linkmap[term[j].term.key+"___"+term[i].term.key];
                if (temp==undefined){
                    linkmap[term[i].term.key+"___"+term[j].term.key] = {source: term[i].term.key,target: term[j].term.key, count: 1};;
                }
                else
                    temp.count++;
            }    
        }
    });
    
    links2 = Object.keys(linkmap).map(d=> linkmap[d]);
    links2.sort((a,b)=>b.count-a.count);
    links2 = links2.filter(d=> d.count>mainconfig.minlink);
    nodes2 = nodes2.filter(d=>links2.find(e=>d.key == e.source || d.key == e.target));
    console.log("link2.length = "+links2.length);
    console.log("nodes2.length = "+nodes2.length);
    
}