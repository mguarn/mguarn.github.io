var width = 1400
var height = 600

var svg = d3.select("#viz_area")
  .append("svg")
  .attr("viewBox", [0, 0, width, height])
  .style("background-color", "white");

var margin = {
  top: 50,
  right: 200,
  bottom: 50,
  left: 300,
};

var cmap = ["#e1c919", "#87868c", "#9c5221", "#29829b", "#29829b",
  "#29829b", "#29829b", "#29829b", "#29829b", "#29829b",
  "#29829b", "#29829b", "#29829b", "#29829b", "#29829b",
  "#29829b", "#29829b", "#a42c22", "#a42c22", "#a42c22"
]

var scY = d3.scaleLinear()
  .domain([11, 100])
  .range([height - margin.top, margin.bottom])

var scX = d3.scaleLinear()                            //<2>
  .domain([0, 26])
  .range([margin.left, width - margin.right])

function fteams(data) {
  let output = [];
  for (let i = 0; i < data.length; i++) {
    output[i] = data[i].HomeTeam;
  }
  return output.filter((v, i, a) => a.indexOf(v) === i).sort();
}

function fteamData(data, teams) {
  let output = []
  for (let i = 0; i <= teams.length; i++) {
    let teamName = teams[i]
    output[teamName] = data.filter(function (d) {
      return d.HomeTeam == teamName;
    });
  }
  return output
}

function fseasons(data) {

  let output = [];
  for (let i = 0; i < data.length; i++) {
    output[i] = data[i].season;
    ;
  }
  return output.filter((v, i, a) => a.indexOf(v) === i);
}

function drawCircles(svg, data) {
  svg.append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("id", d => d.HomeTeam.replace(/ /g, '').replace(/'/g, ''))
    .attr("r", 8)
    .attr("cx", d => scX(d["season_id"]))
    .attr("cy", d => scY(d["points"]))
    .attr("fill", d => cmap[d.position - 1])
    .attr("fill-opacity", 0.8);
}

function yAxis(svg, data) {
  svg.append("g")
    .attr("transform", `translate(275,0)`)

    .call(d3.axisLeft(scY))
    .call(g => g.select(".domain").remove())
    .style("font-size", "11px")
    .append("text").text("Metric")

}


function xAxis(svg, data) {
  svg.append("g")
    .attr("transform", `translate(0,25)`)
    .call(d3.axisTop(scX).ticks(data.length).tickFormat(function (d, i) { return data[i] }))
    .call(g => g.select(".domain").remove())

    .attr("fill", "currentColor")
    .attr("text-anchor", "end")
    .style("font-size", "10px")

}

function drawLine(svg, data) {
  svg
    .select("#gline")
    .append("path")
    .attr("id", "line")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 5)
    .attr("d", makeLine(data)).lower()
}

makeLine = (d3
  .line()
  .curve(d3.curveStep)
  .x(d => scX(d["season_id"]))
  .y(d => scY(d["points"])));

function deleteLine(svg) {
  svg.select("#line").remove()
}

function circleHover(svg, teamData) {

  svg.selectAll('circle').on('mouseover', function (d) {
    drawLine(svg, teamData[d.HomeTeam])
    d3.selectAll("#" + `${d.HomeTeam.replace(/ /g, '').replace(/'/g, '')}`)
      .raise()
      .attr("r", 12)
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("fill-opacity", 1.0).raise();
    d3.selectAll("#rect" + `${d.HomeTeam.replace(/ /g, '').replace(/'/g, '')}`)
      .attr('fill-opacity', 0.5)
    d3.selectAll("#" + `${d.HomeTeam.replace(/ /g, '').replace(/'/g, '')}` + "key")
      .attr("fill", "black")

  })
    .on('mouseout', function (d) {
      d3.selectAll("#" + `${d.HomeTeam.replace(/ /g, '').replace(/'/g, '')}`)
        .attr("r", 8)
        .attr("stroke-width", 0)
        .attr("fill-opacity", 0.8);
      deleteLine(svg)
      d3.selectAll("#rect" + `${d.HomeTeam.replace(/ /g, '').replace(/'/g, '')}`)
        .attr('fill-opacity', 0)
      d3.selectAll("#" + `${d.HomeTeam.replace(/ /g, '').replace(/'/g, '')}` + "key")
        .attr("fill", "#8a8a8a")
    });
}

function interactiveKey(svg, teamData) {
  svg.select("#legend").selectAll('text')
    .on('mouseover', function (d) {
      drawLine(svg, teamData[d])
      d3.selectAll("#" + `${d.replace(/ /g, '').replace(/'/g, '')}`).lower()
        .attr("r", 12)
        .attr("stroke", "black")
        .attr("stroke-width", 2).attr("fill-opacity", 1.0).raise();
      d3.select(this).attr("fill", "black");
      d3.selectAll("#rect" + `${d.replace(/ /g, '').replace(/'/g, '')}`)
        .attr('fill-opacity', 0.5)
    })
    .on('mouseout', function (d) {
      deleteLine(svg)
      d3.selectAll("#" + `${d.replace(/ /g, '').replace(/'/g, '')}`)
        .attr("r", 8)
        .attr("stroke-width", 0)
        .attr("fill-opacity", 0.8);
      d3.select(this).attr("fill", "#8a8a8a");
      d3.selectAll("#rect" + `${d.replace(/ /g, '').replace(/'/g, '')}`)
        .attr('fill-opacity', 0)
    });

}

function makeXGrid(svg, seasons) {
  svg
    .append("g")
    .attr("stroke", "currentColor")
    .attr("stroke-opacity", 0.1)

    .selectAll("line")
    .data(scX.ticks(seasons.length))

    .enter().append("line")
    .attr("x1", d => 0.5 + scX(d))
    .attr("x2", d => 0.5 + scX(d))
    .attr("y1", margin.top - 25)
    .attr("y2", height - margin.bottom + 25)
};

function makeYGrid(svg, seasons) {
  svg
    .append("g")
    .attr("stroke", "currentColor")
    .attr("stroke-opacity", 0.8)
    .selectAll("line")
    .data(scY.ticks())
    .enter().append("line")
    .attr("y1", d => 0.5 + scY(d))
    .attr("y2", d => 0.5 + scY(d))
    .attr("x1", margin.left - 25)
    .attr("x2", width - margin.right + 25)
};

function addLegend(svg, teams, halfTeams) {
  const g = svg
    .append("g")
    .attr("id", "legend")

  g
    .selectAll("rect")
    .data(teams)
    .enter()
    .append("rect")
    .attr("id", d => 'rect' + d.replace(/ /g, '').replace(/'/g, ''))
    .attr("x", function (d, i) { if (i < halfTeams) { return 0 } else { return 120 }; })
    .attr("y", function (d, i) { if (i < halfTeams) { return scYKey(i) - 20 } else { return scYKey(i - halfTeams) - 20 }; })
    .attr("height", 30)
    .attr("width", 120)
    .attr("fill", "#29829b")
    .attr("fill-opacity", 0)
    .attr("rx", 2)

  g
    .selectAll("text")
    .data(teams)
    .enter()
    .append("text")

    .attr("x", function (d, i) { if (i < halfTeams) { return 60 } else { return 180 }; })
    .attr("y", function (d, i) { if (i < halfTeams) { return scYKey(i) } else { return scYKey(i - halfTeams) }; })
    .attr("id", d => d.replace(/ /g, '').replace(/'/g, '') + "key")
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .attr("fill", "#8a8a8a")
    .text(function (d, i) { return d; });



  g
    .append("text")

    .attr("x", 115)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .attr("fill", "black")
    .text("Teams");


}

d3.csv("/../data/pl_points.csv", function (data) {
  var teams = fteams(data)
  var halfTeams = Math.ceil(teams.length / 2)
  var seasons = fseasons(data)
  var teamData = fteamData(data, teams)

  scYKey = d3.scaleLinear()
    .domain([0, halfTeams - 1])
    .range([margin.bottom, height - margin.top])

  addLegend(svg, teams, halfTeams);
  xAxis(svg, seasons);
  yAxis(svg, seasons);
  makeXGrid(svg, seasons)
  makeYGrid(svg, seasons)
  svg.append("g").attr("id", "gline") // Ensures line is always behind circles
  drawCircles(svg, data);
  circleHover(svg, teamData)
  interactiveKey(svg, teamData)
  svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 255)
    .attr("x", -525)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Points");
});
