const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
let sampleNames;
let samplesMetadata;
let samplesSamples;

// d3.json(url).then(function(data) {
//     let sampleNames = data.names;
//     let samplesMetadata = data.metadata;
//     let samplesSamples = data.samples;
//     // console.log(samplesSamples);
// });

/* {
    "names": ["A", "B", "C"],
    "metadata": [{
        "id": 949,
        "ethnicity": "Caucasian",
        "gender": "F",
        "age": 51.0,
        "location": "Durham/NC",
        "bbtype": "I",
        "wfreq": 3.0}],
    "samples": [
        {
        "id": "949",
        "otu_ids": [2419, 944, 1795],
        "sample_values": [8, 4, 3],
        "otu_labels": [
            "Bacteria;Firmicutes;Clostridia;Clostridiales;IncertaeSedisXI;Anaerococcus",
            "Bacteria;Actinobacteria;Actinobacteria;Actinomycetales;Corynebacteriaceae;Corynebacterium",
            "Bacteria;Firmicutes;Bacilli;Bacillales;Staphylococcaceae;Staphylococcus"
        ]
        },
        {
        "id": "943",
        "otu_ids": [ 1795],
        "sample_values": [2],
        "otu_labels": [
            "Bacteria;Firmicutes;Bacilli;Bacillales;Staphylococcaceae;Staphylococcus"
        ]
        }
    ]
}; */

/*
JSON has 3 items
 names
     Array of strings with "id" of every person
 metadata
     all the individuals (each has a unique "id")
     "id": int
     "ethnicity": string
     "gender": string
     "age": int
     "location": str
     "bbtype": str
     "wfreq": float
 samples
     data for each individual
             - All 3 are arrays that should have the same length
     "otu_ids": Array of OTU id ints
     "sample_values": Array of OTU values (count of OTU???)
     "otu_labels": Array of OTU string labels
*/


function init() {
    d3.json(url).then(function(data) {
        sampleNames = data.names;
        samplesMetadata = data.metadata;
        samplesSamples = data.samples;

        // set values into dropDown
        let dropDown = d3.select("#selDataset");
        for (i =0; i < sampleNames.length; i++) {
            dropDown.append("option").text(sampleNames[i]).attr("value", sampleNames[i])
        }

        // initialSetup(949);  // three values, use for testing
        initialSetup(940);  // many values (first in `names`)
    });
}


init();

function initialSetup(individual) {

    // values are already sorted by `sample_values` in original json
    let individualData = samplesSamples.filter(sample => (sample.id == individual.toString()))[0];
    let individualMetadata = samplesMetadata.filter(meta => (meta.id == individual));
    console.log(individualData);

    // Individual Metadata
    setMetadata(individual);

    // Charts
    let singleSampleIds = individualData.otu_ids;
    let singleSampleValues = individualData.sample_values;
    let singleSampleLabels = individualData.otu_labels;

    let barTrace = [{
        x: singleSampleValues.slice(0, 10).reverse(),
        y: singleSampleIds.slice(0, 10).map(ids => `OTU ${ids}`).reverse(),
        text: singleSampleLabels.slice(0, 10).reverse(),
        name: "Taxa",
        type: "bar",
        orientation: "h",
    }];
    let barLayout = {
        title: "Bar Chart",
    };
    Plotly.newPlot("bar", barTrace, barLayout)

    let bubbleTrace = [{
        x: singleSampleIds,
        y: singleSampleValues,
        mode: 'markers',
        marker: {
            size: singleSampleValues,
            color: singleSampleIds,
            colorscale: "Bluered",
        },
    }];
    let bubbleLayout = {
        title: "Bubble Chart",
    };
    Plotly.newPlot("bubble", bubbleTrace, bubbleLayout);

    console.log("wfreq:", individualMetadata[0].wfreq);

    let gaugeTrace = [{
        value: individualMetadata[0].wfreq,
        type: "indicator",
        mode: "gauge+number",
        gauge: {
            axis: {range: [null, 10]},
            bar: {color: "#eedd00"}, // replace  or add needle
            bgcolor: "white",
            borderwidth: 1,
            bordercolor: "black",
            steps: [
                { range: [0, 2], color: "lightgray" },
                { range: [2, 10], color: "gray" },
                ],
        },
    }];
    let gaugeLayout = {
        title: "Belly Button Washing Frequency",
    };
    Plotly.plot("gauge", gaugeTrace, gaugeLayout);

};


function setMetadata(individual) {
    let individualMetadata = samplesMetadata.filter(meta => (meta.id == individual))[0];
    let metadataDiv = d3.select("#sample-metadata");

    metadataDiv.selectAll("p").remove();  // remove existing <p> elements to prepare for new ones
    metadataDiv.selectAll("p")
               .data(Object.entries(individualMetadata))  // returns an array of [key, value] pairs
               .enter()
               .append("p")
               .text(d => `${d[0]}: ${d[1]}`);
};


function optionChanged(value) {
    console.log("Value changed to:", value);

    setMetadata(value);
};

// d3.selectAll("#selDataset").on("change", setData);

// Bar Chart
// id = #bar

// Bubble Chart
// id = #bubble

// Sample MetaData
// id = #sample-metadata

// BONUS: Gauge Chart
// id = #gauge

/* Dark Charts
plot_bgcolor:"black",
paper_bgcolor:"#111",
font: {color: "white"},
yaxis: {tickcolor: "white",
        gridcolor: "#CCC",
        zerolinecolor: "yellow"},
xaxis: {tickcolor: "white",
        gridcolor: "#CCC",
        zerolinecolor: "blue"},
*/