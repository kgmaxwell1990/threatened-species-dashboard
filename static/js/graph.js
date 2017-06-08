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

   //Calculate metrics
   var numberOfThreatenedSpecies = speciesDim.group().reduceSum(function(d) {
       return d["Value"];
   });

   var numberOfCategories = categDim.group().reduceSum(function(d) {
       return d["Value"];
   });

//       var updatedCategory = categDim.filter(function(d) {
//        if ('IUCN'=='VULNERABLE'||'IUCN'=='ENDANGERED'||'IUCN'=='CRITICAL')
//        {return d["IUCN"];}
//    });

   
 
   //Charts
   var speciesPieChart = dc.pieChart("#species-pie-chart");
   var categoriesPieChart = dc.pieChart("#categories-pie-chart");
 

    speciesPieChart
        .height(500)
        .radius(150)
        .transitionDuration(1500)
        .dimension(speciesDim)
        .group(numberOfThreatenedSpecies)
    
    categoriesPieChart
        .height(500)
        .radius(150)
        .transitionDuration(1500)
        .dimension(categDim)
        .group(numberOfCategories)
    

 
   dc.renderAll();
}