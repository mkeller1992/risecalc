import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';


/* Url: localhost:4200/charts */

@Component({
  selector: 'app-charts',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

    title = 'Line Plot(s)';

    data: any;

    svg: any;
    margin = {top: 20, right: 80, bottom: 30, left: 50};
    g: any;
    width: number;
    height: number;
    x;
    y;
    z;
	line;
	

	DATASOURCE = [
		{
			'id': 'FunctionType X',
			'values': [
				{'xValue': 1, 'yValue': 60.0},
				{'xValue': 2, 'yValue': 50.0},
				{'xValue': 3, 'yValue': 40.3},
				{'xValue': 4, 'yValue': 30.7},
				{'xValue': 5, 'yValue': 20.2},
				{'xValue': 6, 'yValue': 10.8},
				{'xValue': 7, 'yValue': 0},
				{'xValue': 8, 'yValue': -10},
				{'xValue': 9, 'yValue': -20},
				{'xValue': 10, 'yValue': -30},
				{'xValue': 11, 'yValue': -40},
				{'xValue': 12, 'yValue': -50},
				{'xValue': 13, 'yValue': -60},
				{'xValue': 14, 'yValue': -70}
			]
		},
		{
			'id': 'FunctionType y',
			'values': [
					{'xValue': 1, 'yValue': 63.4},
					{'xValue': 2, 'yValue': 68.0},
					{'xValue': 3, 'yValue': 53.3},
					{'xValue': 4, 'yValue': -45.7},
					{'xValue': 5, 'yValue': -44.2},
					{'xValue': 6, 'yValue': -38.8},
					{'xValue': 7, 'yValue': -57.9},
					{'xValue': 8, 'yValue': -71.8},
					{'xValue': 9, 'yValue': 39.3},
					{'xValue': 10, 'yValue': 71.2},
					{'xValue': 11, 'yValue': 68.7},
					{'xValue': 12, 'yValue': 41.8},
					{'xValue': 13, 'yValue': 63.0},
					{'xValue': 14, 'yValue': 56.9}
			]
		}
	];

	private _numberOfVerticalGridlines: number = this.DATASOURCE[0].values.length;
	private _numberOfHorizontalGridlines: number = 20;


    constructor() {}

    ngOnInit() {

        this.data = this.DATASOURCE.map((v) => v.values.map((v) => v.xValue ))[0];
        //.reduce((a, b) => a.concat(b), []);

        this.initChart();
        this.drawAxis();
        this.drawPath();
    }

    private initChart(): void {
        this.svg = d3.select('svg');

        this.width = this.svg.attr('width') - this.margin.left - this.margin.right;
        this.height = this.svg.attr('height') - this.margin.top - this.margin.bottom;

        this.g = this.svg.append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

        this.x = d3Scale.scaleLinear().range([0, this.width]);
        this.y = d3Scale.scaleLinear().range([this.height, 0]);
        this.z = d3Scale.scaleOrdinal(d3ScaleChromatic.schemeCategory10);

        this.line = d3Shape.line()
            .curve(d3Shape.curveBasis)
            .x( (d: any) => this.x(d.xValue) )
            .y( (d: any) => this.y(d.yValue) );

        this.x.domain(d3Array.extent(this.data, (d: any) => d ));

        this.y.domain([
            d3Array.min(this.DATASOURCE, function(c) { return d3Array.min(c.values, function(d) { return d.yValue; }); }),
            d3Array.max(this.DATASOURCE, function(c) { return d3Array.max(c.values, function(d) { return d.yValue; }); })
        ]);

		this.z.domain(this.DATASOURCE.map(function(c) { return c.id; }));


		// Adds a horizontal line at x == 0

		this.svg.append("line")
			.attr("x1", 50)
			.attr("y1",this.y(-6))//so that the line passes through the y 0
			.attr("x2",this.width + 50)
			.attr("y2",this.y(-6))//so that the line passes through the y 0
			.style("stroke", "black");
    }

    private drawAxis(): void {

        this.g.append('g')
            .attr('class', 'axis axis--x')
			.attr('transform', 'translate(0,' + this.height + ')')
			// Horizontal gridlines are added by '.ticks(10).tickSize(-this.height)'
            .call(d3Axis.axisBottom(this.x).ticks(this._numberOfVerticalGridlines).tickSize(-this.height));


        this.g.append('g')
			.attr('class', 'axis axis--y')
			// Vertical gridlines are added by '.ticks(10).tickSize(-this.width)'
            .call(d3Axis.axisLeft(this.y).ticks(this._numberOfHorizontalGridlines).tickSize(-this.width))
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '0.71em')
            .attr('fill', '#000')
            .text('Masseinheit');
    }

    private drawPath(): void {
        let functionType = this.g.selectAll('.city')
            .data(this.DATASOURCE)
            .enter().append('g')
            .attr('class', 'city');

        functionType.append('path')
            .attr('class', 'line')
            .attr('d', (d) => this.line(d.values) )
            .style('stroke', (d) => this.z(d.id) );

        functionType.append('text')
            .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
            .attr('transform', (d) => 'translate(' + this.x(d.value.xValue) + ',' + this.y(d.value.yValue) + ')' )
            .attr('x', 3)
            .attr('dy', '0.35em')
            .style('font', '10px sans-serif')
            .text(function(d) { return d.id; });
    }

}
