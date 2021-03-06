function initTheme() {
    theme = window.localStorage.getItem('data-theme');
    if(theme) {
        document.body.setAttribute('data-theme', theme);
    } else {
        window.localStorage.setItem('data-theme', 'dark');
        document.body.setAttribute('data-theme', 'dark');
    }

    let toggle = document.getElementById("themeToggle");
    if (toggle) {
        if (theme === 'dark') {
            document.getElementById("themeToggle").checked = true;
        } else {
            document.getElementById("themeToggle").checked = false;
        }
    } 
}

initTheme();

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function userDropdown() {
    document.getElementById("user_dropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    var element = document.getElementById('user_dropdown');
    if (element && !event.target.matches('#nav_img') && (event.target !== element && !element.contains(event.target))) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

function toggleTheme() {
    theme = window.localStorage.getItem('data-theme');
    if(theme) {
        if (theme === 'light') {
            document.body.setAttribute('data-theme', 'dark');
            window.localStorage.setItem('data-theme', 'dark');
        } else if (theme === 'dark') {
            document.body.setAttribute('data-theme', 'light');
            window.localStorage.setItem('data-theme', 'light');
        } else {
            console.log("Unknown theme");
        }
    }
}

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function toggleClick(val) {
    if (val) {
        document.getElementById("times-icon").style.display="none";
        document.getElementById("bar-icon").style.display="block";
        document.getElementById("nav-listing").classList.remove("active");
    } else {
        document.getElementById("times-icon").style.display="block";
        document.getElementById("bar-icon").style.display="none";
        document.getElementById("nav-listing").classList.add("active");
    }
    var d = new Date();
    var fullDate = monthNames[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
    var date1 = document.getElementById("todays-date");
    var date2 = document.getElementById("todays-date2");

    if (date1)
        date1.textContent = fullDate;

    if (date2)
        date2.textContent = fullDate;
}

// ----- Modals --------------------------------------------------------------------------------
// var username = document.getElementById('username').textContent;    

// Add Module
$('span#open-modal').on('click', function(e){
    var url = "/addmodule";
    $.get(url, function(data) {
        $('#addModuleModal .modal-content').html(data);
        $('#addModuleModal').modal();
        validateModule(url, data);
    });
});

// Edit Module
$('i#open-modal2').on('click', function(e){
    var module_id = $(this).data('id');
    var url = "/editmodule/" + module_id;
    $.get(url, function(data) {
        $('#addModuleModal .modal-content').html(data);
        $('#addModuleModal').modal();
        validateModule(url, data);
    });
});

// ----- Validators --------------------------------------------------------------
function validateModule(url, data) {
    $('#submit').click(function(event) {
        event.preventDefault();
        var f = $("#addModuleForm");
        var formData = f.serialize();
  
        $.post(url, data=formData, function(data, statusCode) {
            if (data.status == 'ok') {
                $('#addModuleModal').modal('hide');
                location.reload();
            }
            else {
              $('#addModuleModal .modal-content').html(data);
              validateModule(url, data)
            }
        });
    });
};