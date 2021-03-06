// golftrackerUser.js
var cssColor = getComputedStyle(document.body).getPropertyValue('--color');

// WIP for re-rendering chart on theme change
// document.body.addEventListener("change", function() {
//     cssColor = getComputedStyle(document.body).getPropertyValue('--color');
//     render_course_chart();
// });

var isFiltered = false;
var deleteFilter = document.getElementById("removeFilter");

var data = document.getElementById('payload').textContent;    
if (data) {
    if (deleteFilter)
        deleteFilter.style.display = "none";
    
    var obj = JSON.parse(data);

    if (obj != undefined && obj.length > 0) {
        render_course_chart(obj);
        setRoundListCounter();
    }
}

var data2 = document.getElementById('payload2').textContent;    
if (data2) {
    var obj2 = JSON.parse(data2);

    if (obj2 != undefined) {
        setParAvg(null);
        setStats(null);
    }
}

function selectFilter(val) {
    var selectedValue = "";
    if (val != undefined) {
        selectedValue = val;
        document.getElementById("courseSelector").value = val;
    } else {
        selectedValue = document.getElementById("courseSelector").value;
    }
    var rows = document.querySelector("#golfTable tbody").rows;
    var deleteFilter = document.getElementById("removeFilter");
    
    // If it is NOT "Show All" then the deleteFilter button will show
    if (selectedValue != "") {
        deleteFilter.style.display = "";
    } else { // otherwise hidden
        deleteFilter.style.display = "none";
    }

    let displayedRowCnt = 0;
    for (var i = 0; i < rows.length; i++) {
        var firstCol = rows[i].cells[1].textContent
        if (firstCol.indexOf(selectedValue) > -1) {
            rows[i].style.display = "";
            isFiltered = false;
            displayedRowCnt++;
        } else {
            rows[i].style.display = "none";
            isFiltered = true;
        }      
    }

    // After filter if selectedValue is NOT "Show All" then deleteFilter will show
    if (selectedValue != "") { 
        deleteFilter.style.display = "";
    } else { // otherwise hidden
        deleteFilter.style.display = "none";
    }
    setRoundListCounter(selectedValue, displayedRowCnt);
    setParAvg(selectedValue);
    setStats(selectedValue);
};

function removeCourseFilter() {
    var x = document.getElementById("courseSelector").value;
    document.getElementById("courseSelector").value = "";
    document.getElementById("courseSelector").onchange();
};

function setRoundListCounter(course, val) {
    var rowCount = 0;
    var courseName = "All Courses";
    if (val != undefined && course != null ) {
        rowCount = val;
        if (course != "")
            courseName = course;
    } else {
        rowCount = $('#golfTable tr').length - 1;
    }
    var header = courseName + " (" + rowCount + ")";
    document.getElementById("golf-table-header").textContent = header;
};

function setParAvg(course) {
    var avgObj = null;
    if (course == null || course == "") {
        avgObj = obj2["par_counts"]["Total"];
    } else {
        let course_key = course.replace(" ", "_")
        avgObj = obj2["par_counts"][course_key]
    }
    
    document.getElementById("golf-avg-3").textContent = (avgObj["par_3_avg"] > 0) ? avgObj["par_3_avg"] : "-";
    document.getElementById("golf-avg-4").textContent = (avgObj["par_4_avg"] > 0) ? avgObj["par_4_avg"] : "-";
    document.getElementById("golf-avg-5").textContent = (avgObj["par_5_avg"] > 0) ? avgObj["par_5_avg"] : "-";
};

function setStats(course) {
    var statObj = null;
    if (course == null || course == "") {
        statObj = obj2["stats"]["Total"];
    } else {
        let course_key = course.replace(" ", "_")
        statObj = obj2["stats"][course_key]['Total']
    }
    
    document.getElementById("eagle").textContent = statObj["eagle"];
    document.getElementById("birdie").textContent = statObj["birdie"];
    document.getElementById("par").textContent = statObj["par"];
    document.getElementById("bogey").textContent = statObj["bogey"];
    document.getElementById("double_bogey").textContent = statObj["double_bogey"];
    document.getElementById("triple_bogey").textContent = statObj["triple_bogey"];
    document.getElementById("over").textContent = statObj["over"];
};

// Filter on <th> click
$('th').click(function(){
    if (isNaN(this.textContent)) {
        var table = $(this).parents('table').eq(0);
        var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()));
        this.asc = !this.asc;
        if (!this.asc){rows = rows.reverse()};
        for (var i = 0; i < rows.length; i++){table.append(rows[i])};
    }
})

function comparer(index) {
    return function(a, b) {
        var valA = getCellValue(a, index), valB = getCellValue(b, index);
        var valATrim = valA.split(" "), valBTrim = valB.split(" ");
        return $.isNumeric(valATrim[0]) && $.isNumeric(valBTrim[0]) ? valATrim[0] - valBTrim[0] : valATrim[0].toString().localeCompare(valBTrim[0]);
    }
}

function getCellValue(row, index){ return $(row).children('td').eq(index).text() }


//document.querySelector('#myInput').addEventListener('keyup', filterTable, false);


// ----- Charts --------------------------------------------------------------------------------
// Courses Played (Pie)
function render_course_chart(obj) {
    let fontColor = cssColor;
    var canvas = document.getElementById('myChart');
    var ctx = canvas.getContext('2d');

    let courses = [];
    let times_played = [];
    for(let i=0; i<obj.length;i++) {
        courses.push(obj[i][0]);
        times_played.push(obj[i][1]);
    }

    var color1 = "rgba(170, 179, 243, 1)"   // Purple
    var color2 = "rgba(152, 222, 243, 1)"   // Blue
    var color3 = "rgba(194, 243, 159, 1)"   // Green
    var color4 = "rgba(253, 244, 171, 1)"   // Yellow
    var color5 = "rgba(248, 194, 206, 1)"   // Red
    var color6 = "rgba(219, 181, 247, 1)"   // Violet

    var color1b = "rgba(170, 179, 243, 1)"
    var color2b = "rgba(152, 222, 243, 1)"
    var color3b = "rgba(194, 243, 159, 1)"
    var color4b = "rgba(253, 249, 237, 1)"
    var color5b = "rgba(248, 194, 206, 1)"
    var color6b = "rgba(219, 181, 247, 1)"

    var color_arr = color_generator(courses.length)

    var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: courses,
            datasets: [{
                label: 'Courses Played',
                data: times_played,
                backgroundColor: color_arr,
                
                borderWidth: 1
            }]
        },
        options: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    fontColor: fontColor
                }
            },
            // scales: {
            //     yAxes: [{
            //         ticks: {
            //             beginAtZero: true
            //         }
            //     }]
            // },
            responsive: true
        }
    });   

    canvas.onclick = function(evt) {
        var activePoints = myChart.getElementsAtEvent(evt);
        if (activePoints[0]) {
          var chartData = activePoints[0]['_chart'].config.data;
          var idx = activePoints[0]['_index'];
    
          var label = chartData.labels[idx];
          if (document.getElementById("courseSelector").value == label) {
            removeCourseFilter();
          } else {
            selectFilter(label);
          }
        }
    };
}

function color_generator(course_cnt) {
    var color_arr = [];

    var r = 128;
    var g = 100;
    var b = 164;
    for (var i=0; i<course_cnt; i++) {
        if (i != 0) {
            r += Math.floor(Math.random() * 11);
            b += Math.floor(Math.random() * 11) - 5;
        }
        // var color1 = Math.floor(Math.random() * 85) + 115; 
        // var color2 = Math.floor(Math.random() * 150);
        // var color3 = Math.floor(Math.random() * 100) + 130;
        var color_str = "rgba(" + r + ", " + g + ", " + b + ", 1)"
        color_arr.push(color_str);
    }

    

    return color_arr;
}

// ----- Modals --------------------------------------------------------------------------------
var username = document.getElementById('username').textContent;    

// Add Round
$('span#open-modal').on('click', function(e){
    var url = "/golftracker/" + username + "/addround";
    $.get(url, function(data) {
        $('#addRoundModal .modal-content').html(data);
        $('#addRoundModal').modal();
        validateRound(url, data);
    });
});

// Add Course
$('span#open-modal2').on('click', function(e){
    var url = "/golftracker/" + username + "/addcourse";
    $.get(url, function(data) {
        $('#addCourseModal .modal-content').html(data);
        $('#addCourseModal').modal();
        validateCourse(url, data);
    });
});

// Edit Round
$('i#open-modal3').on('click', function(e){
    var round_id = $(this).data('id');
    var url = "/golftracker/" + username + "/editround/" + round_id;
    $.get(url, function(data) {
        $('#addRoundModal .modal-content').html(data);
        $('#addRoundModal').modal();
        validateRound(url, data);
    });
});

// ----- Validators --------------------------------------------------------------
function validateRound(url, data) {
  $('#submit').click(function(event) {
      event.preventDefault();
      var f = $("#addRoundForm");
      var formData = f.serialize();

      $.post(url, data=formData, function(data, statusCode) {
          if (data.status == 'ok') {
              $('#addRoundModal').modal('hide');
              location.reload();
          }
          else {
            $('#addRoundModal .modal-content').html(data);
            validateRound(url, data)
          }
      });
  });
};

function validateCourse(url, data) {
  $('#submit').click(function(event) {
      event.preventDefault();
      var f = $("#addCourseForm");
      var formData = f.serialize();

      $.post(url, data=formData, function(data, statusCode) {
          if (data.status == 'ok') {
              $('#addCourseModal').modal('hide');
              location.reload();
          }
          else {
            $('#addCourseModal .modal-content').html(data);
            validateCourse(url, data)
          }
      });
  });
};
