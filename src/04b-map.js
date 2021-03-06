import * as d3 from 'd3'
import * as topojson from 'topojson'

let margin = { top: 0, left: 0, right: 0, bottom: 0 }

let height = 500 - margin.top - margin.bottom

let width = 900 - margin.left - margin.right

let svg = d3
  .select('#chart-4b')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let projection = d3.geoAlbersUsa()

let path = d3.geoPath().projection(projection)

let opacityScale = d3.scaleLinear().range([0.025, 1])

d3.json(require('./data/counties_with_election_data.topojson'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(json) {
  // console.log(json)

  let counties = topojson.feature(json, json.objects.us_counties)

  let clintonVoter = counties.features.map(d => +d.properties.clinton)
  let trumpVoter = counties.features.map(d => +d.properties.trump)
  let voter = (d3.sum(clintonVoter) + d3.sum(trumpVoter)) / 500

  opacityScale.domain([0, voter])

  // let pop = counties.features.map(
  //   d => +d.properties.clinton + +d.properties.trump
  // )

  // opacityScale.domain(d3.extent(pop))

  svg
    .selectAll('.country')
    .data(counties.features)
    .enter()
    .append('path')
    .attr('class', 'country')
    .attr('d', path)
    .attr('stroke', 'white')
    .attr('fill', d => {
      if (d.properties.clinton > d.properties.trump) {
        return 'blue'
      } else {
        return 'red'
      }
    })
    .style('opacity', d => {
      if (d.properties.clinton > d.properties.trump) {
        return opacityScale(d.properties.clinton)
      } else {
        return opacityScale(d.properties.trump)
      }
    })
}
