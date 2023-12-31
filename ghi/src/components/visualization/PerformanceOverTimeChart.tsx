import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Submission } from '../../types';

interface PerformanceOverTimeChartProps {
  submissions: Submission[];
}

const PerformanceOverTimeChart: React.FC<PerformanceOverTimeChartProps> = ({
  submissions,
}) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (submissions && d3Container.current) {
      const svg = d3.select(d3Container.current);

      // Set dimensions
      // const margin = { top: 20, right: 30, bottom: 40, left: 50 };
      const margin = { top: 20, right: 30, bottom: 40, left: 110 };

      const width = 600 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      // Clear SVG before redrawing
      svg.selectAll('*').remove();

      const g = svg
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Set scales
      const x = d3.scaleTime().range([0, width]);
      const y0 = d3.scaleLinear().range([height, 0]); // Proficiency level
      const y1 = d3.scaleLinear().range([height, 0]); // Duration

      // Define axes
      // const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat('%Y-%m-%d'));
      const xAxis = d3
        .axisBottom(x)
        .tickFormat((d) => {
          const monthFormat = d3.timeFormat('%b');
          const monthWithYearFormat = d3.timeFormat("%b '%y");
          return new Date(d).getMonth() === 0 || new Date(d).getMonth() === 11
            ? monthWithYearFormat(d)
            : monthFormat(d);
        })
        .ticks(d3.timeMonth);

      const readableProficiencyLevelMapping = {
        0: 'no understanding',
        1: 'conceptual understanding',
        2: 'no pass',
        3: 'guided pass',
        4: 'unsteady pass',
        5: 'smooth pass',
        6: 'smooth optimal pass',
      };

      // const yAxisLeft = d3.axisLeft(y0);
      // const yAxisLeft = d3.axisLeft(y0).tickFormat(d3.format('d'));
      const yAxisLeft = d3
        .axisLeft(y0)
        .tickFormat((d) => readableProficiencyLevelMapping[d] || '');

      const yAxisRight = d3.axisRight(y1);

      const proficiencyLevelMapping = {
        NO_UNDERSTANDING: 0,
        CONCEPTUAL_UNDERSTANDING: 1,
        NO_PASS: 2,
        GUIDED_PASS: 3,
        UNSTEADY_PASS: 4,
        SMOOTH_PASS: 5,
        SMOOTH_OPTIMAL_PASS: 6,
      } as {
        [key: string]: number;
      };

      // Data preparation
      let subs = submissions.map((d: any) => {
        let data = JSON.parse(JSON.stringify(d));
        data.date = new Date(d.submittedAt); // Ensure date is in Date format
        data.week = d3.timeWeek(data.date); // Get week (for grouping

        data.proficiencyLevel =
          proficiencyLevelMapping[d.proficiencyLevel] || 0;

        data.duration = d.duration || 0; // Convert to numeric if needed
        console.log('proficiencyLevel', d.proficiencyLevel);
        return data;
      });

      // Set domains
      x.domain(d3.extent(subs, (d: any) => d.week));
      y0.domain([0, d3.max(subs, (d: any) => d.proficiencyLevel)]);
      y1.domain([0, d3.max(subs, (d: any) => d.duration)]);

      // Add this after the existing scale definitions

      // const radiusScale = d3
      //   .scaleSqrt()
      //   .domain([0, d3.max(subs, (d) => d.duration)])
      //   .range([2, 20]);

      const radiusScale = d3
        .scalePow()
        .exponent(1) // change this to adjust the contrast scale
        .domain([0, d3.max(subs, (d) => d.duration)])
        .range([2, 20]);

      // Proficiency level line
      const proficiencyLine = d3
        .line<Submission>()
        .x((d: any) => x(d.week))
        .y((d: any) => y0(d.proficiencyLevel));
      const durationLine = d3
        .line<Submission>()
        .x((d: any) => x(d.week))
        .y((d: any) => y1(d.duration));

      // Draw scatter plot
      const circles = g
        .selectAll('circle')
        .data(subs)
        .enter()
        .append('circle')
        .attr('cx', (d) => x(d.week))
        .attr('cy', (d) => y0(d.proficiencyLevel))
        .attr('r', (d) => radiusScale(d.duration))
        .attr('fill', 'orange');

      // Function for continuous transition
      function repeatTransition() {
        circles
          .transition()
          .duration(3000)
          .attr('fill', 'darkorange')
          .transition()
          .duration(3000)
          .attr('fill', 'orange')
          .on('end', repeatTransition);
      }

      // Start the continuous transition
      repeatTransition();

      // Draw axes
      // g.append('g').attr('transform', `translate(0,${height})`).call(xAxis);
      g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-65)');

      // g.append('g').call(yAxisLeft);
      g.append('g')
        .call(yAxisLeft)
        .selectAll('text')
        .style('text-anchor', 'end')
        .style('font-size', '10px') // Adjust the font size as needed
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-35)'); // Optional rotation

      // g.append('g')
      //   .attr('transform', `translate(${width}, 0)`)
      //   .call(yAxisRight);
    }
  }, [submissions]);

  return <svg width={600} height={450} ref={d3Container} />;
};

export default PerformanceOverTimeChart;
