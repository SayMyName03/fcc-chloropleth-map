let countyURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
let educationURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"


let countyData
let educationData

let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

let drawMap = () => {
    canvas.selectAll('path')
        .data(countyData)
        .enter()
        .append('path')
        .attr('d', d3.geoPath())
        .attr('class', 'county')
        .attr('fill', (countyDataItem) => {
            let id = countyDataItem['id'];
            let county = educationData.find((item) => item['fips'] === id);
            if (!county) {
                return 'gray'; // Default color if no data found
            }
            let percentage = county['bachelorsOrHigher'];
            return percentage <= 15 ? 'tomato' :
                   percentage <= 30 ? 'orange' :
                   percentage <= 45 ? 'lightgreen' : 'limegreen';
        })
        .attr('data-fips', (countyDataItem) => countyDataItem['id'])
        .attr('data-education', (countyDataItem) => {
            let county = educationData.find((item) => item['fips'] === countyDataItem['id']);
            return county ? county['bachelorsOrHigher'] : 0;
        })
        .on('mouseover', (event, countyDataItem) => {
            let county = educationData.find((item) => item['fips'] === countyDataItem['id']);
            tooltip.style('visibility', 'visible')
                   .text(`${county['fips']} - ${county['area_name']}, ${county['state']} : ${county['bachelorsOrHigher']}%`);
            tooltip.attr('data-education', county['bachelorsOrHigher'])
        })
        .on('mousemove', (event) => {
            tooltip.style('top', (event.pageY + 10) + 'px')
                   .style('left', (event.pageX + 10) + 'px');
        })
        .on('mouseout', () => {
            tooltip.style('visibility', 'hidden');
        });
};





d3.json(countyURL).then(
    (data, error) => {
        if(error){
            console.log(log)
        }else{
            countyData = topojson.feature(data, data.objects.counties).features
            console.log(countyData)

            d3.json(educationURL).then(
                (data,error) =>{
                    if(error){
                        console.log(log)
                    }else{
                        educationData = data
                        console.log(educationData)
                        drawMap()
                    }
                }
            )
        }
    }
)