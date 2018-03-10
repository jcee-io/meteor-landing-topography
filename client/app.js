const width = 984.2;
const height = 790;


const svg = d3.select('svg')
  .attr('width', width)
  .attr('height', height);

const projection = d3.geoMercator()
  .center([0,62])
  .scale(160)
  .rotate([0, 0]);


const path = d3.geoPath()
  .projection(projection);


const g = svg.append('g');

d3.json('https://unpkg.com/world-atlas@1/world/110m.json', (err, topology) => {

  d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json', (err, mapData) => {
    console.log(mapData);
  });

	g.selectAll('path')
	  .data(topojson.object(topology, topology.objects.countries).geometries)
	  .enter()
	  .append('path')
	  .attr('d', path)
    .attr('fill', 'grey');
});

const zoom = d3.zoom()
  .scaleExtent([1,8])
  .on('zoom', () => {
    g.attr('transform', d3.event.transform);
  });

svg.call(zoom);