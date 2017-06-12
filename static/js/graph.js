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

   var categDim = ndx.dimension(function(d) {
       return d["IUCN"];
   });

  var categFilterDim = ndx.dimension(function(d) {
       return d["IUCN"];
   });

   function multivalue_filter(values) {
       return function(v) {
           return values.indexOf(v) !== -1;
       };
   }
   categFilterDim.filter(multivalue_filter(['CRITICAL', 'VULNERABLE', 'ENDANGERED', 'CRITICAL_IND', 'VULNERABLE_IND', 'ENDANGERED_IND']));


   var countryDim = ndx.dimension(function(d) {
       return d["Country"];
   });

   var indigDim = ndx.dimension(function(d) {
       return d["Indigenous"];
   });


   //Calculate metrics
   var numberOfThreatenedSpecies = speciesDim.group().reduceSum(function(d) {
       return d["Value"];
   });

   var numberOfCategories = categDim.group().reduceSum(function(d) {
       return d["Value"];
   });

   var numberOfSpeciesPerCountry = countryDim.group().reduceSum(function(d) {
        console.log(d['IUCN'])
        return d['Value'];
   });

   var numberOfIndigenousVsForeign = indigDim.group().reduceSum(function(d) {
       return d["Value"];
   });





   
 
   //Charts
   var speciesPieChart = dc.pieChart("#species-pie-chart");
   var categoriesPieChart = dc.pieChart("#categories-pie-chart");
   var indigPieChart = dc.pieChart("#indig-pie-chart");
   var countriesBarChart = dc.barChart("#country-bar-chart");
   
   
 

    speciesPieChart
        .height(350)
        .radius(100)
        .transitionDuration(1500)
        .dimension(speciesDim)
        .group(numberOfThreatenedSpecies)
        // .externalLabels(20)

    
    categoriesPieChart
        .height(350)
        .radius(100)
        .transitionDuration(1500)
        .dimension(categDim)
        .group(numberOfCategories)
        .externalLabels(20)
        
    
    indigPieChart
        .height(350)
        .radius(100)
        .innerRadius(40)
        .transitionDuration(1500)
        .dimension(indigDim)
        .group(numberOfIndigenousVsForeign)
        // .label(function(d) {
        //     return Math.round((d.value / total) * 100) + '%';
        // })

    
    countriesBarChart
       .width(1200)
       .height(400)
       .margins({top: 10, right: 50, bottom: 80, left: 50})
       .dimension(countryDim)
       .group(numberOfSpeciesPerCountry)
       .transitionDuration(500)
       .x(d3.scale.ordinal())
       .xUnits(dc.units.ordinal)
       .elasticY(true)
       .xAxisLabel("Country")
       .yAxis().ticks(4);
    

 
   dc.renderAll();
}