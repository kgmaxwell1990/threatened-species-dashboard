queue()
   .defer(d3.json, "/endangeredSpecies/species")
   .await(makeGraphs);
 
function makeGraphs(error, projectsJson) {
 
var endangeredSpecies = projectsJson;

   //Create a Crossfilter instance
   var ndx = crossfilter(endangeredSpecies);

 
   //Define Dimensions
   var speciesDim = ndx.dimension(function(d) {
       return d["Species"]
   });

   //Calculate metrics
   var numberOfThreatenedSpecies = speciesDim.group().reduceSum(function(d) {
       return d["Value"];
   });
 
   //Charts
   var speciesPieChart = dc.pieChart("#species-pie-chart");

 
    speciesPieChart
        .height(500)
        .radius(150)
        .transitionDuration(1500)
        .dimension(speciesDim)
        .group(numberOfThreatenedSpecies)
    

 
   dc.renderAll();
}