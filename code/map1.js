async function worldmap(){
    let width = 1200;
    let height = 800;

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
        .attr('d', path);

    let tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "1px solid black")
        .style("padding", "10px")
        .style("font-size", "12px");

    // add marks for 2022
    let marks2022 = [];
    for (let i = 0; i < 50; i++) {
        let randomPoint = [Math.random() * width, Math.random() * height];
        let isOnLand = countries.features.some(function(country) {
            return d3.geoContains(country, projection.invert(randomPoint));
        });
        if (isOnLand) {
            marks2022.push({
                coordinates: randomPoint,
                name: `Mark ${i+1} in 2022`,
                otherInfo: "Some other info"
            });
        }
    }
    let g2022 = g.append("g").attr("class", "marks2022");
    g2022.selectAll("circle")
        .data(marks2022)
        .enter()
        .append("circle")
        .attr("cx", d => d.coordinates[0])
        .attr("cy", d => d.coordinates[1])
        .attr("r", 3)
        .style("fill", "red")
        .on("mouseover", d => {
            console.log("x: " + d3.event.pageX + ", y: " + d3.event.pageY);
            tooltip.style("display", "block")
                .html(`<div>Name: ${d.name}</div><div>Coordinates: ${d.coordinates[0]}, ${d.coordinates[1]}</div><div>Other info: ${d.otherInfo}</div>`)
                .style("left", d3.event.pageX + 10 + "px")
                .style("top", d3.event.pageY + 10 + "px");
        })
        .on("mouseout", () => {
            tooltip.style("display", "none");
        });
        // .append("title")
        // .text(d => `Name: ${d.name} \nCoordinates: ${d.coordinates[0]}, ${d.coordinates[1]} \nOther info: ${d.otherInfo}`);

    // add marks for 2023


    // .style("fill", "red")
        // .append("title")
        // .attr("class", "tooltip")
        // .text(d => `Name: ${d.name} \nCoordinates: ${d.coordinates[0]}, ${d.coordinates[1]} \nOther info: <strong>${d.otherInfo}</strong>`);


// add marks for 2023
    let marks2023 = [];
    for (let i = 0; i < 50; i++) {
        let randomPoint = [Math.random() * width, Math.random() * height];
        let isOnLand = countries.features.some(function(country) {
            return d3.geoContains(country, projection.invert(randomPoint));
        });
        if (isOnLand) {
            marks2023.push({
                coordinates: randomPoint,
                name: `Mark ${i+1} in 2023`
            });
        }
    }
    let g2023 = g.append("g").attr("class", "marks2023").style("display", "none");
    g2023.selectAll("circle")
        .data(marks2023)
        .enter()
        .append("circle")
        .attr("cx", d => d.coordinates[0])
        .attr("cy", d => d.coordinates[1])
        .attr("r", 3)
        .style("fill", "blue")
        .append("title")
        .text(d => `Name: ${d.name} \nCoordinates: ${d.coordinates[0]}, ${d.coordinates[1]} \nOther info: <strong>${d.otherInfo}</strong>`);



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
