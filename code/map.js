// async function worldmap(){
//     let width = 1200;
//     let height = 800;

//     let svg = d3.select("svg")
//         .attr("width", width)
//         .attr("height", height);
    
//     // the projection is the way the map is projected on the screen
//     let projection = d3.geoMercator()
//         .scale([190])
//         .translate([width/2, height/1.3]);

//     // the path is the way the map is drawn on the screen
//     let path = d3.geoPath(projection);

//     // grouping of all the path of the countries
//     let g = svg.append('g');
//         // .attr("id", "mapLayer");
    
//     // load the data of the world map and draw it on the screen
//     d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
//         .then(data => {
//         // console.log(data);
//         // convert the TopoJson to GeoJson
//         let countries = topojson.feature(data, data.objects.countries);
//         g.selectAll('path')
//             .data(countries.features)
//             .enter()
//             .append('path')
//             .attr('class', 'country')
//             .attr('d', path)
//         });
//     }

// async function worldmap(){
//     let width = 1200;
//     let height = 800;

//     let svg = d3.select("svg")
//         .attr("width", width)
//         .attr("height", height);

//     // the projection is the way the map is projected on the screen
//     let projection = d3.geoMercator()
//         .scale([190])
//         .translate([width/2, height/1.3]);

//     // the path is the way the map is drawn on the screen
//     let path = d3.geoPath(projection);

//     // create a zoom behavior that scales and translates the map
//     let zoom = d3.zoom()
//     .scaleExtent([1, 8])
//     .translateExtent([[0, 0], [width, height]])
//     .on("zoom", () => {
//         g.attr("transform", d3.event.transform);
//     });

// // add the zoom behavior to the svg
// svg.call(zoom);

//     // grouping of all the path of the countries
//     let g = svg.append('g');

//     // load the data of the world map and draw it on the screen
//     const data = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
//     const countries = topojson.feature(data, data.objects.countries);

//     g.selectAll('path')
//         .data(countries.features)
//         .enter()
//         .append('path')
//         .attr('class', 'country')
//         .attr('d', path);

//     // add marks for 2022
//     let marks2022 = [];
//     for (let i = 0; i < 50; i++) {
//         let randomPoint = [Math.random() * width, Math.random() * height];
//         let isOnLand = countries.features.some(function(country) {
//             return d3.geoContains(country, projection.invert(randomPoint));
//         });
//         if (isOnLand) {
//             marks2022.push(randomPoint);
//         }
//     }
//     let g2022 = g.append("g").attr("class", "marks2022");
//     g2022.selectAll("circle")
//         .data(marks2022)
//         .enter()
//         .append("circle")
//         .attr("cx", d => d[0])
//         .attr("cy", d => d[1])
//         .attr("r", 5)
//         .style("fill", "red");

//     // add marks for 2023
//     let marks2023 = [];
//     for (let i = 0; i < 50; i++) {
//         let randomPoint = [Math.random() * width, Math.random() * height];
//         let isOnLand = countries.features.some(function(country) {
//             return d3.geoContains(country, projection.invert(randomPoint));
//         });
//         if (isOnLand) {
//             marks2023.push(randomPoint);
//         }
//     }
//     let g2023 = g.append("g").attr("class", "marks2023").style("display", "none");
//     g2023.selectAll("circle")
//         .data(marks2023)
//         .enter()
//         .append("circle")
//         .attr("cx", d => d[0])
//         .attr("cy", d => d[1])
//         .attr("r", 3)
//         .style("fill", "blue");

//     // update marks when the year is changed
//     d3.select("#year").on("change", function() {
//         let year = d3.select(this).property("value");
//         if (year === "2022") {
//             g2022.style("display", "block");
//             g2023.style("display", "none");
//         } else {
//             g2022.style("display", "none");
//             g2023.style("display", "block");
//                 }
//             });
// }
// worldmap();

async function worldmap(){
    let width = 1200;
    let height = 710;

    let svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height);

    // the projection is the way the map is projected on the screen
    let projection = d3.geoMercator()
        .scale([190])
        .translate([width/2, height/1.3]);

    // the path is the way the map is drawn on the screen
    let path = d3.geoPath(projection);

    // create a zoom behavior that scales and translates the map
    let zoom = d3.zoom()
    .scaleExtent([1, 8])
    .translateExtent([[0, 0], [width, height]])
    .on("zoom", () => {
        g.attr("transform", d3.event.transform);
    });

    // add the zoom behavior to the svg
    svg.call(zoom);

    // grouping of all the path of the countries
    let g = svg.append('g');

    // load the data of the world map and draw it on the screen
    const data = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
    const countries = topojson.feature(data, data.objects.countries);

    g.selectAll('path')
        .data(countries.features)
        .enter()
        .append('path')
        .attr('class', 'country')
        .attr('d', path)
        // .style("fill", "grey")
        // .style("stroke", "white")
        .append("title")
        .text(d => d.properties.name);

    // load the data of the US states and draw it on the screen
    // const states = await d3.json('https://d3js.org/us-10m.v2.json');
    // g.append('path')
    //     .datum(topojson.feature(states, states.objects.states))
    //     .attr('class', 'state')
    //     .attr('d', path)
    //     .style("fill", "orange")
    //     .style("stroke", "white")
    //     .style("stroke-width", "0.5px");

    // add marks for 2022
    let marks2022 = [];
    for (let i = 0; i < 22; i++) {
        let randomCountry = countries.features[Math.floor(Math.random() * countries.features.length)];
        marks2022.push(randomCountry);
    }
    // add marks for 2022
    // const marks2022 = [
    //     {name: 'USA', coordinates: [-95.712891, 37.09024]},
    //     {name: 'China', coordinates: [104.195397, 35.86166]},
    //     {name: 'Brazil', coordinates: [-51.92528, -14.235004]},
    //     {name: 'India', coordinates: [78.96288, 20.593684]},
    //     {name: 'Russia', coordinates: [105.318756, 61.52401]},
    //     {name: 'Australia', coordinates: [133.77513, -25.274398]},
    //     {name: 'France', coordinates: [2.213749, 46.227638]},
    //     {name: 'United Kingdom', coordinates: [-3.435973, 55.378051]},
    //     {name: 'Japan', coordinates: [138.252924, 36.204824]},
    //     {name: 'South Africa', coordinates: [24.991639, -28.816624]}
    // ];

    console.log(marks2022);
    let g2022 = g.append("g").attr("class", "marks2022");
    g2022.selectAll("path")
        .data(marks2022)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", "red")
        .style("stroke", "white");

    // add marks for 2023
    // let marks2023 = [];
    // for (let i = 0; i < 10; i++) {
    //     let randomCountry = countries.features[Math.floor(Math.random() * countries.features.length)];
    //     marks2023.push(randomCountry);
    // }
    // let g2023 = g.append("g").attr("class", "marks2023").style("display", "none");
    // g2023.selectAll("path")
    //     .data(marks2023)
    //     .enter()
    //     .append("path")
    //     .attr("d", path)
    //     .style("fill", "blue")
    //     .style("stroke", "white");

    // update marks when the year is changed
    d3.select("#year").on("change", function() {
        let year = d3.select(this).property("value");
        if (year === "2022") {
            g2022.style("display", "block");
            g2023.style("display", "none");
        } else {
            g2022.style("display", "none");
            g2023.style("display", "block");
        }
    });
}

worldmap();

