// Set up the margin, width, and height of the chart
const margin = { top: 20, right: 20, bottom: 50, left: 50 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create the SVG element
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Input data from the csv file and store in the variable data.
d3.csv("q2.csv")
    .then(function(data) {   // Handle the resolved Promise
        const formattedData = data.map(function (d) {
            return {x: +d.year, y: +d.points};
        });
        console.log(formattedData);

        // // Set up the scales
        // const xScale = d3.scaleLinear()
        //     .domain(d3.extent(formattedData, d => d.x))
        //     .range([0, width]);
        //
        // const yScale = d3.scaleLinear()
        //     .domain(d3.extent(formattedData, d => d.y))
        //     .range([height, 0]);

        // Set up the x and y scales
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(formattedData, d => d.x)])
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([-10, d3.max(formattedData, d => d.y)])
            .range([height, 0]);

        // Create the x and y axes
        const xAxis = d3.axisBottom(xScale)
            .ticks(formattedData.length) // set number of ticks to be proportional to the data
            .tickFormat(d => d); // customize the tick format if needed

        const yAxis = d3.axisLeft(yScale)
            .ticks(formattedData.length) // set number of ticks to be proportional to the data
            .tickFormat(d => d); // customize the tick format if needed

        // Appending the axes to the SVG
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis);

        svg.append("g")
            .call(yAxis);

        // Adding x label
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 10)
            .text("Years of experience in F1");

        // Adding y label
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "middle")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 20)
            .attr("transform", "rotate(-90)")
            .text("Average Points Earned");

        // Create the scatter plot
        svg.selectAll(".dot")
            .data(formattedData)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", d => xScale(d.x))
            .attr("cy", d => yScale(d.y))
            .style("fill", "red")
            .transition() // apply transition
            .duration(1000) // set duration in ms
            .attr("r", 5); // set final radius
            

        
            

        // Create the trend line
        // const regression = ss.linearRegression(formattedData.map(d => [d.x, d.y]));
        // const trendline = ss.linearRegressionLine(regression);
        // const trendlineData = [
        //     { x: d3.min(formattedData, d => d.x), y: trendline(d3.min(formattedData, d => d.x)) },
        //     { x: d3.max(formattedData, d => d.x), y: trendline(d3.max(formattedData, d => d.x)) }
        // ];

        // const regression = ss.linearRegression(formattedData.map(d => [d.x, d.y]));
        // const trendline = ss.linearRegressionLine(regression);
        // const trendlineData = [
        //     { x: d3.min(formattedData, d => d.x), y: Math.max(trendline(d3.min(formattedData, d => d.x)), 0) },
        //     { x: d3.max(formattedData, d => d.x), y: Math.max(trendline(d3.max(formattedData, d => d.x)), 0) }
        // ];

        // Create the trend line
        let trendlineAdded = false;
        const toggleTrendlineButton = document.getElementById('toggle-trendline-button');
        toggleTrendlineButton.addEventListener('click', () => {
            if (trendlineAdded){
                svg.select(".trendline").remove();
                trendlineAdded = false;
            } else {
                const regression = ss.linearRegression(formattedData.map(d => [d.x, d.y]));
                const trendline = ss.linearRegressionLine(regression);
                const x1 = d3.min(formattedData, d => d.x);
                const y1 = trendline(x1);
                const x2 = d3.max(formattedData, d => d.x);
                const y2 = trendline(x2);
                const trendlineData = [
                    { x: x1, y: y1 },
                    { x: x2, y: y2 }
                ];

                svg.append("path")
                    .datum(trendlineData)
                    .attr("class", "trendline")
                    .attr("d", d3.line()
                        .x(d => xScale(d.x))
                        .y(d => yScale(d.y))
                    )
                    .attr("stroke", "blue")
                    .style("stroke", "black");
                trendlineAdded = true;
            }
            chart.update();
        });

        // // Create the x-axis
        // const xAxis = d3.axisBottom(xScale);
        // svg.append("g")
        //     .attr("transform", `translate(0,${height})`)
        //     .call(xAxis);
        //
        // // Create the y-axis
        // const yAxis = d3.axisLeft(yScale);
        // svg.append("g")
        //     .call(yAxis);

    })




