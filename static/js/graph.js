queue()
   .defer(d3.json, "/endangeredSpecies/species")
   .await(makeGraphs);

 
function makeGraphs(error, projectsJson) {
 
var endangeredSpecies = projectsJson;

   //Create a Crossfilter instance
   var ndx = crossfilter(endangeredSpecies);


//-----------------------------------------------------------------------------------------------------------

   // Number Display for total Species
   // Dim
   var totalSpeciesDim = ndx.dimension(function (d) {
       return d["IUCN"];
   });
   // Measure
   var all = ndx.groupAll();
   var totalSpecies = ndx.groupAll().reduceSum(function (d) {
       return d["Value"];
   });

//-----------------------------------------------------------------------------------------------------------


   // Number Display for total threatened species
   // Dim


   // Measure


//-----------------------------------------------------------------------------------------------------------

   // Drop down box for selecting country 
   // Dim
   var countryDim = ndx.dimension(function(d) {
       return d["Country"];
   });
   // Measure
   var countryGroup = countryDim.group()


//-----------------------------------------------------------------------------------------------------------

   // Pie - Number of Threatened Animals grouped by species
   // Dim
   var speciesDim = ndx.dimension(function(d) {
       return d["Species"]
   });
   // Measure
   var numberOfThreatenedSpecies = speciesDim.group().reduceSum(function(d) {
       return d["Value"];
   });

//-----------------------------------------------------------------------------------------------------------

   // Pie - Categories
   // Dim
   var categDim = ndx.dimension(function(d) {
       return parseStatus(d["IUCN"]);
   });

   function parseStatus(d) {
      
       if(d=="VULNERABLE_IND") {
          d = "Vulnerable";
       }
        else if(d=="ENDANGERED_IND") {
          d = "Endangered";
        }
        else if(d=="CRITICAL_IND") {
          d = "Critical";
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

//    function multivalue_filter(values) {
//        return function(v) {
//            return values.indexOf(v) !== -1;
//        };
//    }

   // Measure
   var numberOfCategories = categDim.group().reduceSum(function(d) {
       return d["Value"];
   });


//-----------------------------------------------------------------------------------------------------------
   function parseIndig(d) {
      
       if(d=="VULNERABLE_IND") {
          d = "Indigenous";
       }
        else if(d=="ENDANGERED_IND") {
          d = "Indigenous";
        }
        else if(d=="CRITICAL_IND") {
          d = "Indigenous";
       }
        else if(d=="VULNERABLE") {
          d = "Alien";
       }
        else if(d=="ENDANGERED") {
          d = "Alien";
       }
        else if(d=="CRITICAL") {
          d = "Alien";
       }
       
       return d;
   }

   // Pie - Indig vs Alien
   // Dim
   var indigDim = ndx.dimension(function(d) {
       return parseIndig(d["IUCN"]);
   });

   // Measure
   var numberOfIndigenousVsForeign = indigDim.group().reduceSum(function(d) {
       return d["Value"];
   });

//-----------------------------------------------------------------------------------------------------------

   // Bar Chart - Countries
   // Dim 
   // countryDim from above
   // Measure
   var numberOfSpeciesPerCountry = countryDim.group().reduceSum(function(d) {
        return d['Value'];
   });

//-----------------------------------------------------------------------------------------------------------

   
 
   //Charts
   var speciesPieChart = dc.pieChart("#species-pie-chart");
   var categoriesPieChart = dc.pieChart("#categories-pie-chart");
   var indigPieChart = dc.pieChart("#indig-pie-chart");
//    var countriesRowChart = dc.rowChart("#country-row-chart");
   var countriesBarChart = dc.barChart("#country-bar-chart");
   var numberSpeciesND = dc.numberDisplay("#number-species-nd");
   var numberThreatenedND = dc.numberDisplay("#number-threatened-nd");
   
   
   selectField = dc.selectMenu('#menu-select')
       .dimension(countryDim)
       .group(countryGroup); 


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
        .dimension(categDim)
        .renderLabel(true)
        .group(numberOfCategories)
        // .externalLabels(5)
        // .legend(dc.legend().x(0).y(0).gap(5));
        
    
    indigPieChart
        .height(150)
        .radius(document.getElementById('indig-pie-chart').clientHeight * 0.3)
        .width(document.getElementById('indig-pie-chart').clientWidth)
        // .innerRadius(20)
        .transitionDuration(1500)
        .dimension(indigDim)
        .group(numberOfIndigenousVsForeign)
        .renderLabel(true)
        // .label(function(d) {
        //     return Math.round((d.value / total) * 100) + '%';
        // })
        // .legend(dc.legend().x(0).y(0).gap(5));

    
    // countriesRowChart
    //    .width(400)
    //    .height(1200)
    //    .margins({top: 10, right: 50, bottom: 80, left: 50})
    //    .dimension(countryDim)
    //    .group(numberOfSpeciesPerCountry)
    //    .transitionDuration(500)
    //    .xAxis().ticks(4);
    //    .x(d3.scale.ordinal())
    //    .xUnits(dc.units.ordinal)
    //    .elasticY(true)
    //    .xAxisLabel("Country")
    //    .yAxis().ticks(4);


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
    
    d3.select("div#country-bar-chart")
        .append("div")
        .classed("svg-container", true) //container class to make it responsive
        .append("svg")
        //responsive SVG needs these 2 attributes and no width and height attr
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 600 400")
        //class to make it responsive
        .classed("svg-content-responsive", true); 

    
   numberSpeciesND
       .formatNumber(d3.format("d"))
       .valueAccessor(function (d) {
           return d;
       })
       .group(all);

   numberThreatenedND
       .formatNumber(d3.format(".3s"))
       .valueAccessor(function (d) {
           return d;
       })
       .group(totalSpecies);

 
   dc.renderAll();



}