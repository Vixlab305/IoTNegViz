var data;
$(document).ready(function () {
    // d3.queue()
    //     .defer(d3.json,"src/data/dataout.json")
    //     .await(ready);

    d3.queue()
        .defer(d3.text,"src/data/test.csv")
        .await((error, text)=>{
            var data = d3.csvParseRows(text);
            data = data.map(d=> d.map(e=>e.toLowerCase()));
            var keys =[];
        });

    // d3.queue()
    //     .defer(d3.json,"src/data/dataout.json")
    //     .await((error, d)=> {
    //         data = d.map(e=> {e.source = "cnbc"; return e;});
    //
    //     });


});