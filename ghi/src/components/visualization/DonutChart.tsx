import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Submission } from '../../types';

interface DonutChartProps {
  submissions: Submission[];
}

const DonutChart: React.FC<DonutChartProps> = ({ submissions }) => {
  const d3Container = useRef(null);
  const [subResult, setSubResult] = React.useState({}) as any;

  useEffect(() => {
    if (!submissions || !d3Container.current || submissions?.length == 0)
      return;
    const dt = [
      { name: 'no_understanding', value: 0 },

      { name: 'conceptual_understanding', value: 0 },

      { name: 'no_pass', value: 0 },

      { name: 'guided_pass', value: 0 },

      { name: 'unsteady_pass', value: 0 },

      { name: 'smooth_pass', value: 0 },

      { name: 'smooth_optimal_pass', value: 0 },
    ];

    submissions.forEach((submission) => {
      let proficiencyLevel = submission.proficiencyLevel.toLowerCase();
      let index = dt.findIndex((d) => d.name === proficiencyLevel);
      dt[index].value += 1;
    });

    const data = dt.map((d) => {
      if (d.value === 0) return { name: '', value: 0 };
      return {
        name: d.name.replaceAll('_', ' ')?.toUpperCase(),
        value: d.value,
      };
    });

    setSubResult({
      passRate: (
        ((data[3].value + data[4].value + data[5].value + data[6].value) /
          (data[0].value +
            data[1].value +
            data[2].value +
            data[3].value +
            data[4].value +
            data[5].value +
            data[6].value)) *
        100
      )
        .toFixed(0)
        .toString()
        .concat('%'),
      totalSubmissions: submissions.length,
      passedCount:
        data[3].value + data[4].value + data[5].value + data[6].value,
    });

    const width = 600;
    const height = Math.min(width, 500);
    const radius = Math.min(width, height) / 2;

    const arc = d3
      .arc()
      .innerRadius(radius * 0.37)
      .outerRadius(radius - 1);

    const pie = d3
      .pie()
      .padAngle(1 / radius)
      .sort(null)
      .value((d: any) => d.value);

    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.name))
      .range(
        d3.quantize(d3.interpolateHcl('#F4E152', '#D1685F'), data.length)
        // .reverse()
      );

    const svg = d3.select(d3Container.current);

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [-width / 2, -height / 2, width, height])
      .attr('style', 'max-width: 100%; height: auto;');

    svg
      .append('g')
      .selectAll()
      .data(pie(data))
      .join('path')
      .attr('d', arc)
      .style('stroke', '#212529')
      .style('stroke-width', 10)
      .attr('fill', (d: any) => color(d.data.name))
      .attr('d', arc)
      .append('title')
      .text((d: any) => `${d.data.name}: ${d.data.value.toLocaleString()}`);

    svg
      .append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 12)
      .attr('text-anchor', 'middle')
      .selectAll()
      .data(pie(data))
      .join('text')
      .attr('transform', (d: any) => `translate(${arc.centroid(d)})`)
      .call((text: any) =>
        text
          .append('tspan')
          .attr('y', '-0.4em')
          .attr('font-family', 'Molde')
          .attr('font-size', '1rem')
          .attr('fill', 'white')
          .attr('fill-opacity', 1)
          .text((d: any) => d.data.name)
      )
      .call((text: any) =>
        text
          .filter((d: any) => d.endAngle - d.startAngle > 0.25)
          .append('tspan')
          .attr('x', 0)
          .attr('y', '1em')
          .attr('font-family', 'Molde')
          .attr('font-size', '1rem')
          .attr('fill', 'white')
          .attr('fill-opacity', 1)
          .text((d: any) => d.data.value.toLocaleString('en-US'))
      );
  }, [submissions]);

  return (
    <div style={{ position: 'relative' }}>
      <div
        className="hsl-transition-colors d-flex flex-column justify-content-center align-items-center"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          userSelect: 'none',
        }}
      >
        <div className="d-flex align-items-end gap-1">
          <p style={{ fontSize: '3.5rem', lineHeight: 0.9 }}>
            {subResult.passRate}
          </p>
          <p style={{ fontSize: '1.5rem', lineHeight: 0.9 }}>passed</p>
        </div>
        <p style={{ fontSize: '1.5rem', lineHeight: 0.9 }}>
          {subResult.passedCount} / {subResult.totalSubmissions} submissions
        </p>
      </div>
      <svg width={600} height={600} ref={d3Container} />
    </div>
  );
};

export default DonutChart;
