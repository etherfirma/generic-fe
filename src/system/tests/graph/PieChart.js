import * as d3 from "d3";
import { useEffect, useRef } from "react";

const Piechart = () => {
    const ref = useRef();

    useEffect (() => {
            const margin = { top: 30, right: 30, bottom: 70, left: 60 },
                width = 460 - margin.left - margin.right,
                height = 300 - margin.top - margin.bottom;

            // const height = Math.min(500, width / 2);
            const outerRadius = height / 2 - 10;
            const innerRadius = outerRadius * 0.75;
            const tau = 2 * Math.PI;
            const color = d3.scaleOrdinal(d3.schemeObservable10);

            const svg = d3.create("svg")
                .attr("viewBox", [-width/2, -height/2, width, height]);

            const arc = d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);

            const pie = d3.pie().sort(null).value((d) => d["apples"]);

            const data = d3.tsvParse(`apples	oranges
53245	200
28479	200
19697	200
24037	200
40245	200`, d3.autoType);

            const path = svg.datum(data).selectAll("path")
                .data(pie)
                .join("path")
                .attr("fill", (d, i) => color(i))
                .attr("d", arc)
                .each(function(d) { this._current = d; }); // store the initial angles


        // Return the svg node to be displayed.
        // return Object.assign(svg.node(), {change});
        return svg;
    }, []);



    return <svg width={460} height={300} id="piechart" ref={ref} />;
};

export default Piechart;