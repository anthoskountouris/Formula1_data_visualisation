
async function worldmap() {
    // setting the width and height of the svg file
    let width = 1200;
    let height = 800;

    let svg = d3.select("svg").attr("width", width).attr("height", height);

    // the projection is the way the map is projected on the screen
    let projection = d3
        .geoMercator()
        .scale([190])
        .translate([width / 2, height / 1.3]);

    // the path is the way the map is drawn on the screen
    let path = d3.geoPath(projection);

    // create a zoom behavior that scales and translates the map
    let zoom = d3
        .zoom()
        .scaleExtent([1, 8])
        .translateExtent([
            [0, 0],
            [width, height]
        ])
        .on("zoom", () => {
            g.attr("transform", d3.event.transform);
        });

    // add the zoom behavior to the svg
    svg.call(zoom);

    // grouping of all the path of the countries
    let g = svg.append("g");

    // loading the data of the world map and draw it on the screen
    // inspired by the youtube video of https://www.youtube.com/watch?v=aNbgrqRuoiE
    const data = await d3.json(
        "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
    );

    // adding a legend
    let legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (width - 120) + ",20)");

// creating a circle in the legend
    legend.append("circle")
        .attr("cx", 10)
        .attr("cy", 10)
        .attr("r", 5)
        .style("fill", "#ba181b");

// creating a text label for the circle in the legend
    legend.append("text")
        .attr("x", 20)
        .attr("y", 10)
        .attr("dy", "0.35em")
        .text("Race Track");

    // using the topojson library to extract the countries object from the JSON file containing world map data
    const countries = topojson.feature(data, data.objects.countries);

    // creating the paths
    g.selectAll("path")
        .data(countries.features)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("d", path);

    // inserting the json file which consists the data we need
    d3.json("circuits.json").then(function(yearData) {
        // initializing the starting year anf the final year
        const startYear = 1950;
        const finalYear = 2023;

        // inserting the years in the dropdown menu
        const select = d3.select(".dropdown-menu");

        for (let year = startYear; year <= finalYear; year++) {
            select
                .append("li")
                .text(year)
                .attr("class", "dropdown-item")
                .attr("value", year); // set the value attribute to the year
        }

        // Creating a h2 element to display the year selected
        let yearOnDisplay = d3.select("body").select("h2").text("Season " + finalYear).style('color', '#ba181b');

        // function for updating the year in the h2 element
        function updateYearOnDisplay(year) {
            yearOnDisplay.text("Season " + year);
        }

        // creating the tooltip element
        let tooltip = d3
            .select("body")
            .append("div")
            .attr("class", "tooltip")
            .attr("id", "q3")
            .style("opacity", 0);

        // Function for the tooltip
        function assignEventListeners(selection, tooltip, projection) {
            selection.on("mouseover", function (d) {
                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip
                    .html(
                        "Circuit: " +
                        d.Circuit +
                        "<br/>" +
                        "City: " +
                        d.City +
                        "<br/>" +
                        "Country: " +
                        d.Country
                    )
                    .style("left", d3.event.pageX + 10 + "px")
                    .style("top", d3.event.pageY - 28 + "px")
                    .style("display", "block");
            })
                .on("mouseout", function () {
                    tooltip.style("display", "none");
                });
        }

        //  the g element contains the circles representing the circuit locations on the map
        let gMarks = g.append("g").attr("class", "marks");

        // adding the circles on th element
        gMarks
            .selectAll("circle")
            .data(yearData[finalYear])
            .enter()
            .append("circle")
            .attr("class", "mark")
            // adding the coordinates
            .attr("cx", function (d) {
                var coords = projection([d.Coordinates[1], d.Coordinates[0]]);
                return coords[0];
            })
            .attr("cy", function (d) {
                var coords = projection([d.Coordinates[1], d.Coordinates[0]]);
                return coords[1];
            })
            //size of th circles
            .attr("r", 4)
            .style("fill", "#ba181b");

        // assigning event listeners to the circles, tooltip will show up
        assignEventListeners(gMarks.selectAll("circle"), tooltip, projection);

        // // mouseover functionality for the tooltip
            // .on("mouseover", function (d) {
            //     // add mouseover event listener
            //     tooltip.transition().duration(200).style("opacity", 0.9);
            //     tooltip
            //         .html(
            //             "Circuit: " +
            //             d.Circuit +
            //             "<br/>" +
            //             "City: " +
            //             d.City +
            //             "<br/>" +
            //             "Country: " +
            //             d.Country
            //         )
            //         .style("left", d3.event.pageX + 10 + "px")
            //         .style("top", d3.event.pageY - 28 + "px")
            //         .style("display", "block");
            // })
            // .on("mouseout", function () {
            //     // add mouseout event listener
            //     tooltip.style("display", "none"); // hide the tooltip
            // });

        // slecting the dropdown again, to be more understandable
        const dropdown = d3.select(".dropdown-menu");

        // updating marks when the year is changed
        dropdown.selectAll("li").on("click", function () {
            let year = d3.select(this).attr("value");
            updateYearOnDisplay(year);
            let marksData = yearData[year];

            // updating the data of the circles with the "mark" class
            let marks = g.selectAll(".mark") // select only circles with "mark" class
                .data(marksData);

            // removing circles that are not needed
            marks.exit().remove();

            // adding new circles and update existing ones
            marks.enter().append("circle")
                .attr("class", "mark")
                .attr("r", 4)
                .style("fill", "#ba181b")
                .merge(marks)
                .transition()
                .duration(500)
                .attr("cx", function (d) {
                    var coords = projection([d.Coordinates[1], d.Coordinates[0]]);
                    return coords[0];
                })
                .attr("cy", function (d) {
                    var coords = projection([d.Coordinates[1], d.Coordinates[0]]);
                    return coords[1];
                });

            // Assigning event listeners to the updated circles
            assignEventListeners(g.selectAll(".mark"), tooltip, projection);

                // .on("mouseover", function (d) {
                //     tooltip.transition()
                //         .duration(200)
                //         .style("opacity", .9);
                //     tooltip.html(
                //         "Circuit: " +
                //         d.Circuit +
                //         "<br/>" +
                //         "City: " +
                //         d.City +
                //         "<br/>" +
                //         "Country: " +
                //         d.Country
                //     )
                //         .style("left", (d3.event.pageX + 10) + "px")
                //         .style("top", (d3.event.pageY - 28) + "px")
                //         .style("display", "block");
                // })
                // .on("mouseout", function () {
                //     tooltip.style("display", "none");
                // });

            highlightSelectedYear(year);
        });

    });
}
worldmap();

async function createBarChart() {
    // setting the margin and dimensions of the chart
    const margin = { top: 30, right: 30, bottom: 70, left: 60 },
        width = 1300 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // Selecting the svg element
    const svg = d3.select("#barChart")
        // setting the dimensions
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Loading the data of the counts from the csv file
    const data = await d3.csv("year_counts.csv");
    // console.log(data);
    // Creating x-axis scale using the "Year" column in the data
    const x = d3.scaleBand()
        .domain(data.map(d => d.Year))
        .range([0, width])
        .padding(0.2);
    // Appendig the x-axis to the chart
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0) rotate(-45)")
        .style("text-anchor", "end")
        .style("font-weight", "bold");

    // Appending the x-axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .style("font-family", "Helvetica Neue")
        .text("Year");

    // Creating the scale using the "Circuits" column in the data
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.Circuit)])
        .range([height, 0]);

    // Creating the y-axis axis
    const yAxis = d3.axisLeft(y).ticks(d3.max(data, d => +d.Circuit));
    // Appending the y-axis to the chart
    svg.append("g")
        .call(yAxis)
        .selectAll("text")
        .style("font-weight", "bold");

    // Appending the y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .style("font-family", "Helvetica Neue")
        .text("Circuit Count");

    // Creating a bar for each data point and appending it to the chart
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.Year))
        .attr("y", d => y(d.Circuit))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.Circuit))
        .attr("fill", "#ba181b");

    // Creating a text element for each bar to show the count
    svg.selectAll(".bar-text")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "bar-text")
        .attr("x", d => x(d.Year) + x.bandwidth() / 2)
        .attr("y", d => y(d.Circuit) - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "13px")
        .style("text-decoration", "bold")
        .style("fill", "black")
        .style("visibility", "hidden")
        .text(d => d.Circuit);


    // Appending title to the chart
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 4)
        .attr("text-anchor", "middle")
        .style("font-size", "25px")
        .style("text-decoration", "bold")
        .style("font-family", "Helvetica Neue")
        .text("Distribution of circuits across the years");
}
// updating the color and opacity of the bars based on the selected year
function highlightSelectedYear(year) {
    const bars = d3.select("#barChart").selectAll("rect");
    bars.transition()
        .duration(500)
        // Setting the color of all bars to #ba181b
        .style("fill", "#ba181b")
        // Setting the opacity of the selected year's bar to 1, and all others to 0.5
        .style("opacity", (d) => (d.Year === year ? 1 : 0.5));

    // Updating the visibility of the text elements based on the selected year
    const barTexts = d3.select("#barChart").selectAll(".bar-text");
    barTexts.transition()
        .duration(500)
        .style("visibility", (d) => (d.Year === year ? "visible" : "hidden"));

}

createBarChart();







