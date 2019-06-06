import * as d3 from "d3";

const generateChart = (id) => {

    var data = []

    /*********************** Plot Below *********************/
    var margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    };
    let width = 380 - margin.left - margin.right,
        height = 120 - margin.top - margin.bottom;

    let color = "#FFFAFA" //d3.rgb([255,255,255]);

    var x = d3.scaleLinear()
        .range([0, width]),
        y = d3.scaleLinear()
            .range([height, 0]);
    var xScale = x
        .domain(d3.extent(data, function (d) {
            return d.x;
        })).nice();

    var yScale = y
        .domain(d3.extent(data, function (d) {
            return d.y;
        })).nice();

    var xAxis = d3.axisBottom(xScale).ticks(12).tickFormat(d => "t" + d),
        yAxis = d3.axisLeft(yScale).ticks(12 * height / width);

    var plotLine = d3.line()
        .x(function (d) {
            return xScale(d.x);
        })
        .y(function (d) {
            return yScale(d.y);
        });

    var svg = d3.select(`#${id}`).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    svg.append("g")
        .attr("class", "x axis ")
        .attr('id', "axis--x")
        .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
        .call(xAxis);


    var line = svg.append("g")
        .append("path")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .datum(data)
        .attr("d", plotLine)
        .style("fill", "none")
        .style("stroke-width", "2px")
        .style("stroke", color);

    svg.append("rect")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function () { focus.style("display", null); })
        .on("mouseout", function () { focus.style("display", "none"); })
        .on("mousemove", mousemove);



    /****************** Update Below **************************/
    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var bisectDate = d3.bisector(function (d) { return d.x; }).left;
    var focus = g.append("g")
        .attr("class", "focus")
        .style("display", "none");
    focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", height);


    focus.append("circle")
        .attr("r", 7.5);

    focus.append("text")
        .attr("x", 15)
        .attr("dy", ".31em");


    function mousemove() {
        if (x && x.invert && data.length) {
            try {
                var x0 = x.invert(d3.mouse(this)[0]),
                    i = bisectDate(data, x0, 1),
                    d0 = data[i - 1],
                    d1 = data[i],
                    d = x0 - d0.x > d1.x - x0 ? d1 : d0;
                // var d = data[0];
                focus.attr("transform", "translate(" + x(d.x) + "," + y(d.y) + ")");
                focus.select("text").text(function () { return d.y.toFixed(2); });
                focus.select("text").attr("fill", "white")
                focus.select(".x-hover-line").attr("y2", height - y(d.y));
                focus.select(".y-hover-line").attr("x2", width + width);
            } catch {
                console.log("exception on mouseover")
            }
        }
    }

    return function update(newData) {
        // console.log(newData);
        data = newData;
        xScale.domain(d3.extent(newData, function (d) {
            return d.x;
        })).nice();
        yScale.domain(d3.extent(newData, function (d) {
            return d.y;
        })).nice();

        var svg = d3.select(`#${id}`).transition();

        // Make the changes
        svg.select(".x.axis") // change the x axis
            .duration(200)
            .call(xAxis);
        svg.select(".y.axis") // change the y axis
            .duration(200)
            .call(yAxis);

        line.datum(newData)
            .transition().duration(200)
            .attr("d", plotLine)
            .style("fill", "none")
            .style("stroke-width", "2px")
            .style("stroke", color);



    }
}

export default generateChart;