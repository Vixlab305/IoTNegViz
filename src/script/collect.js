var data = [];
var s = []
$(document).ready(function () {
    // d3.queue()
    //     .defer(d3.json,"src/data/dataout.json")
    //     .await(ready);

    d3.queue()
        .defer(d3.json,"src/data/dataout.json")
        .await((error, so)=>{
            s =so.filter(e => e.source=="reuters");
            console.log(s.length);

            // const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
            // var source = "reuters";
            // (async function loop() {
            //     for (let i = 0; i < 1; i++) {
            //         var id = s[i];
            //         let url = "https://sope.prod.reuters.tv/program/rcom/v1/scroll?edition=us&pageid="+id;
            //         fetch(url,{
            //             method: 'get',
            //             headers: {
            //                 "permissions": [
            //                     "http://www.google.com/",
            //                     "https://www.google.com/"
            //                 ]
            //             }
            //         }).then(function(webresponse) {
            //             if(webresponse.ok) {
            //                 webresponse.json().then(function (response) {
            //                     var res = response.stories;
            //                     console.log(res);
            //                     res.forEach(r=> {
            //                         var item = {
            //                             id : r.id,
            //                             source: source,
            //                             title: r.headline,
            //                             description: "",
            //                             time: r.updated,
            //                             url: "https://www.reuters.com"+r.path,
            //                             urlToImage: r.image,
            //                             channel: r.channel.name,
            //                         }
            //                         data.push(item);
            //                         time = r.dateMillis;
            //                     })
            //
            //                 })
            //             }
            //         });
            //
            //         await delay(Math.random() * 10000+5000);
            //     }
            //     // var a = document.createElement("a");
            //     // var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
            //     // a.href = dataStr;
            //     // a.download = 'data.json';
            //     // a.click();
            //     console.log(JSON.stringify(data));
            // })();
        });

    // d3.queue()
    //     .defer(d3.json,"src/data/dataout.json")
    //     .await((error, d)=> {
    //         data = d.map(e=> {e.source = "cnbc"; return e;});
    //
    //     });


});