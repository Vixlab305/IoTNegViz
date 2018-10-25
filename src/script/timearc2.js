var blackw =["iot","risk"];
// var outputFormat = d3.timeFormat('%Y-%m-%d %H:%M:%S');
var outputFormat = d3.timeFormat('%Y-%m-%dT%H:%M:%SZ');
var parseTime = (d => Date.parse(d));
var categoriesgroup ={  "PRODUCT":["PRODUCT","EVENT"],
    "PERSON":["PERSON"],
    "NATION":["GPE"], // ORG merge GPE
    "ORG":["ORG"],
    "NUMBER": ["MONEY","PERCENT"]};
$(document).ready(function () {
    // d3.queue()
    //     .defer(d3.json,"src/data/dataout.json")
    //     .await(ready);

    d3.queue()
        .defer(d3.json,"src/data/dataIoT.json")
        .await((error, data)=>{
            console.log(data.length);
            var out = "source\ttime\tperson\tlocation\torganization\tmiscellaneous";
            data.forEach(d=>{
                var time;

                time = outputFormat(parseInt(d.time));

                out+="\n"+d.source+"\t";
                out+= time + "\t";
                var per =[];
                var loc =[];
                var org =[];
                var mis = [];
                var pers="";
                var locs="";
                var orgs="";
                var miss="";
                d.keywords.forEach(k=>{
                    switch (k.category) {
                        case 'Accident':
                            if (per.find(kk=>kk==k.term) === undefined && blackw.find(kk=>kk==k.term) === undefined) {
                                per.push(k.term.replace(/\"/g,""));
                                pers+=k.term.replace(/\"/g,"")+"|";
                            }
                            break;
                        case 'Risk':
                            if (loc.find(kk=>kk==k.term) === undefined && blackw.find(kk=>kk==k.term) === undefined) {
                                loc.push(k.term.replace(/\"/g,""));
                                locs+=k.term.replace(/\"/g,"")+"|";
                            }
                            break;

                    }
                });
                pers =pers.length!=0?pers.substring(0,pers.length-1):"";
                locs =locs.length!=0?locs.substring(0,locs.length-1):"";
                orgs =orgs.length!=0?orgs.substring(0,orgs.length-1):"";
                miss =miss.length!=0?miss.substring(0,miss.length-1):"";
                out+= pers + "\t";
                out+= locs + "\t";
                out+= orgs + "\t";
                out+= miss + "\t";
            });
            console.log(out);
        });

    // d3.queue()
    //     .defer(d3.json,"src/data/dataout.json")
    //     .await((error, d)=> {
    //         data = d.map(e=> {e.source = "cnbc"; return e;});
    //
    //     });


});