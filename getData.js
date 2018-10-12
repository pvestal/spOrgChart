//Run this function first after SharePoint functions all load
_spBodyOnLoadFunctionNames.push("loadChart");

//This gets the SP list
function getOrg() {
    $.ajax({
        //Use the $expand to extract lookup values instead of just IDs
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('OrgChart1')/Items/?$select=Title,OrgCode,Title/Id,FirstLevelSupervisor/Title,FirstLevelSupervisor/Id&$expand=FirstLevelSupervisor/Id,FirstLevelSupervisor/Title",
        type: "GET",
        dataType: "json",
        headers: {
            "Accept": "application/json; odata=verbose",
        }, //end headers
        success: function (data) {
            var items = data.d.results;
            drawChart(items);
        }, //end success
        error: function (error, status, statusText, value) {
            alert(JSON.stringify(error, status, statusText, value));
        } //end error
    }); //end ajax
} //end getOrg function


function loadChart() {

    // Load the Visualization API and the corechart package.
    google.charts.load('current', {
        'packages': ['orgchart']
    });

    // Set a callback to run when the Google Visualization API is loaded.
    // Gets the SP data via REST query
    google.charts.setOnLoadCallback(getOrg);
}


// Callback that creates and populates a data table,
// instantiates the chart, passes in the data and
// draws it.
function drawChart(items) {
    console.log("drawChart called");
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Employee');
    data.addColumn('string', 'Supervisor');
    data.addColumn('string', 'Org Code');

    //Gets the internal field names and nested lookups
    //https://developers.google.com/chart/interactive/docs/gallery/orgchart
    // For each orgchart box, provide the name, supervisor, and tooltip to show.
    for (var i = 0; i < items.length; i++) {
        data.addRow([items[i]['Title'], items[i]['FirstLevelSupervisor']['Title'], items[i]['OrgCode']]);
    }

    var chart = new google.visualization.OrgChart(document.getElementById('orgChart_div'));
    // Draw the chart, setting the allowHtml option to true for the tooltips.
    chart.draw(data, {
        allowHtml: true
    });

}