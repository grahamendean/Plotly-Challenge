// function for plotting graphs
function createPlot(id) {
    // getting data from the sample.json
    d3.json("samples.json").then((data)=> {
        console.log(data)
        
        // var samples = data.samples.map(s=> s.id);
        // console.log(`Samples: ${samples}`);
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        console.log(`Samples: ${samples}`);
  
        var sample_values = samples.sample_values.slice(0, 10).reverse();
        console.log(`Sample_Values: ${sample_values}`);
  
        var OTU_top_10 = (samples.otu_ids.slice(0, 10));
        console.log(`Top 10: ${OTU_top_10}`);
        
        var OTU_ids = OTU_top_10.map(d => "OTU " + d)
        console.log(`OTU_ids: ${OTU_ids}`)
  
  
        // top 10 labels for the plot
        var labels_top_10 = samples.otu_labels.slice(0, 10);
  
        // create trace for bar plot
        var trace = {
            x: sample_values,
            y: OTU_ids,
            text: labels_top_10,
            type:"bar",
            orientation: "h",
        };
  
        var data = [trace];

        var layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                left: 150,
                right: 150,
                top: 100,
                bottom: 30
            }
        };
  
        Plotly.newPlot("bar", data, layout);
      
        // Create a bubble graph
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
        };
  
        var layout_bubble = {
            xaxis:{title: "OTU ID"},
            height: 1000,
            width: 1200
        };
  
        var data_bubble = [trace1];
  
        Plotly.newPlot("bubble", data_bubble, layout_bubble); 
      });
  }  
// create the function to get the necessary data
function findInfo(id) {
    d3.json("samples.json").then((data)=> {
        
        var metadata = data.metadata;
        console.log(metadata)

        // filter meta data info by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];
        var demographicInfo = d3.select("#sample-metadata");
        demographicInfo.html("");

        // grab demographic data for id and append the info
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0] + ": " + key[1] + "\n");
        });
    });
}

// change event function on the "optionChanged" from HTML
function optionChanged(id) {
    createPlot(id);
    findInfo(id);
    showGauge(id);
}

// create the function for the init for rendering
function init() {
    var dropdown = d3.select("#selDataset");
    d3.json("samples.json").then((data)=> {
        console.log(data)

        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // call the functions to display the data and the plot
        createPlot(data.names[0]);
        findInfo(data.names[0]);
        showGauge(data.names[0]);
    });
};

function showGauge(id) {
    d3.json('samples.json').then( data => {
        var frq = data.metadata.filter(obj => obj.id == id)[0].wfreq;

        var data = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: frq,
                title: { text: "Belly Button Washing Frequency" },
                type: "indicator",
                mode: "gauge+number",
                gauge: {axis: {range: [0,9]},
                bar: { color: "darkblue" },
                steps: [
                    { range: [0, 4], color: "cyan" },
                    { range: [4, 7], color: "royalblue"}
                  ]}
            }
        ];
        
        var layout = { width: 600, height: 500, margin: { t: 0, b: 0 }};
        Plotly.newPlot('gauge', data, layout);
    })
}

init();