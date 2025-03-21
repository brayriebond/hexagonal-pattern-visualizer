// Main visualization script
document.addEventListener('DOMContentLoaded', () => {
  // Initial setup
  const svg = d3.select('#visualization')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%');
    
  const margin = { top: 50, right: 50, bottom: 70, left: 80 };
  const width = svg.node().getBoundingClientRect().width - margin.left - margin.right;
  const height = svg.node().getBoundingClientRect().height - margin.top - margin.bottom;
  
  const chart = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
  // Scales
  const xScale = d3.scaleBand()
    .range([0, width])
    .padding(0.2);
    
  const yScale = d3.scaleLinear()
    .range([height, 0]);
  
  // Axes
  const xAxis = chart.append('g')
    .attr('transform', `translate(0, ${height})`)
    .attr('class', 'x-axis');
    
  const yAxis = chart.append('g')
    .attr('class', 'y-axis');
  
  // Add labels
  chart.append('text')
    .attr('x', width / 2)
    .attr('y', height + margin.bottom / 2)
    .attr('text-anchor', 'middle')
    .text('Category');
    
  chart.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', -margin.left / 2)
    .attr('text-anchor', 'middle')
    .text('Value');
  
  // Function to update the chart
  function updateChart(data) {
    // Update scales
    xScale.domain(data.map(d => d.name));
    yScale.domain([0, d3.max(data, d => d.value)]);
    
    // Update axes
    xAxis.call(d3.axisBottom(xScale));
    yAxis.call(d3.axisLeft(yScale));
    
    // Bind data
    const bars = chart.selectAll('.bar')
      .data(data);
    
    // Remove old bars
    bars.exit().remove();
    
    // Add new bars
    bars.enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.name))
      .attr('width', xScale.bandwidth())
      .attr('y', d => yScale(d.value))
      .attr('height', d => height - yScale(d.value))
      .append('title')
      .text(d => `${d.name}: ${d.value}`);
    
    // Update existing bars
    bars
      .attr('x', d => xScale(d.name))
      .attr('width', xScale.bandwidth())
      .attr('y', d => yScale(d.value))
      .attr('height', d => height - yScale(d.value))
      .select('title')
      .text(d => `${d.name}: ${d.value}`);
  }
  
  // Function to fetch data from the API
  async function fetchData() {
    try {
      const response = await fetch('/api/data');
      const data = await response.json();
      updateChart(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  // Initial data load
  fetchData();
  
  // Update button event listener
  document.getElementById('update-data').addEventListener('click', () => {
    // Generate random data for demonstration
    const randomData = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: String.fromCharCode(65 + i), // A, B, C, D, E
      value: Math.floor(Math.random() * 100) + 5
    }));
    
    updateChart(randomData);
  });
  
  // Resize handler
  window.addEventListener('resize', () => {
    const newWidth = svg.node().getBoundingClientRect().width - margin.left - margin.right;
    const newHeight = svg.node().getBoundingClientRect().height - margin.top - margin.bottom;
    
    xScale.range([0, newWidth]);
    yScale.range([newHeight, 0]);
    
    // Update chart elements
    fetchData();
  });
}); 