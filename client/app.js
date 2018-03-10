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
    const features = mapData.features.filter(d => !!d.geometry && !!d.properties.mass);

    features.forEach(d => d.properties.mass = Number(d.properties.mass));

    features.sort((a, b) => b.properties.mass - a.properties.mass);

    const mExtent = d3.extent(features, d => d.properties.mass);

    const mScale = d3.scaleLinear()
      .domain(mExtent)
      .range([1, 40, 50]);
    const cScale = d3.scaleLinear()
      .domain(mExtent)
      .range(['blue', 'red']);

      renderCircles(features);
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



function renderCircles(data) {
  g.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', d => projection(d.geometry.coordinates)[0])
    .attr('cy', d => projection(d.geometry.coordinates)[1])
    .attr('r', scaleMeteor)
    .attr('fill', scaleColor)
    .attr('stroke', 'white')
    .attr('position', 'relative')
    .attr('opacity', scaleOpacity); 
}

function scaleMeteor(d) {
  const mass = d.properties.mass;

  if (mass < 40000) {
    return 2;
  } else if (mass < 500000) {
    return 4;
  } else if (mass < 1500000) {
    return 8;
  }

  return 12;
}

function scaleColor(d) {
  const mass = d.properties.mass;

  if (mass < 40000) {
    return 'blue';
  } else if (mass < 500000) {
    return 'green';
  } else if (mass < 1500000) {
    return 'orangered';
  }

  return 'red';
}

function scaleOpacity(d) {
  const mass = d.properties.mass;

  if (mass < 40000) {
    return 0.9;
  } else if (mass < 500000) {
    return 0.8;
  } else if (mass < 1500000) {
    return 0.6;
  }

  return 0.5;
}
