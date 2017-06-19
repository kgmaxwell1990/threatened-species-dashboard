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
       return parseStatus(d["IUCN"]);
   });

  var categFilterDim = ndx.dimension(function(d) {
       return parseStatus(d["IUCN"]);
   });

   function parseStatus(d) {
      
       if(d=="VULNERABLE_IND") {
          d = "Vulnerable Indigenous";
       }
        else if(d=="ENDANGERED_IND") {
          d = "Endangered Indigenous";
        }
        else if(d=="CRITICAL_IND") {
          d = "Critical Indigenous";
       }
        else if(d=="VULNERABLE") {
          d = "Vulnerable";
       }
        else if(d=="ENDANGERED") {
          d = "Endangered";
       }
        else if(d=="CRITICAL") {
          d = "Critical";
       }
       
       return d;
   }

   function multivalue_filter(values) {
       return function(v) {
           return values.indexOf(v) !== -1;
       };
   }
   categFilterDim.filter(multivalue_filter(['Critical', 'Vulnerable', 'Endangered', 'Critical Indigenous', 'Vulnerable Indigenous', 'Endangered Indigenous']));


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

   categFilterDim.filter(multivalue_filter(['Critical', 'Vulnerable', 'Endangered', 'Critical Indigenous', 'Vulnerable Indigenous', 'Endangered Indigenous']));


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
   var countriesRowChart = dc.rowChart("#country-row-chart");
   
   
 

    speciesPieChart
        .height(150)
        .radius(document.getElementById('species-pie-chart').clientHeight * 0.3)
        .width(document.getElementById('species-pie-chart').clientWidth)
        .transitionDuration(1500)
        .dimension(speciesDim)
        .renderLabel(false)
        .group(numberOfThreatenedSpecies)
        .legend(dc.legend().x(0).y(0).gap(5));

    
    categoriesPieChart
        .height(150)
        .radius(document.getElementById('categories-pie-chart').clientHeight * 0.3)
        .width(document.getElementById('categories-pie-chart').clientWidth)
        .transitionDuration(1500)
        .dimension(categFilterDim)
        // .renderLabel(false)
        .group(numberOfCategories)
        .externalLabels(20)
        .legend(dc.legend().x(0).y(0).gap(5));
        
    
    indigPieChart
       .height(150)
        .radius(document.getElementById('categories-pie-chart').clientHeight * 0.3)
        .width(document.getElementById('categories-pie-chart').clientWidth)
        // .innerRadius(20)
        .transitionDuration(1500)
        .dimension(indigDim)
        .group(numberOfIndigenousVsForeign)
        .renderLabel(false)
        // .label(function(d) {
        //     return Math.round((d.value / total) * 100) + '%';
        // })
        .legend(dc.legend().x(0).y(0).gap(5));

    
    countriesRowChart
       .width(400)
       .height(1200)
    //    .margins({top: 10, right: 50, bottom: 80, left: 50})
       .dimension(countryDim)
       .group(numberOfSpeciesPerCountry)
       .transitionDuration(500)
       .xAxis().ticks(4);

    //    .x(d3.scale.ordinal())
    //    .xUnits(dc.units.ordinal)
    //    .elasticY(true)
    //    .xAxisLabel("Country")
    //    .yAxis().ticks(4);
    

 
   dc.renderAll();
}