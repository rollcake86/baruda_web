/*Scroll to top when arrow up clicked BEGIN*/
$(window).scroll(function() {
    var height = $(window).scrollTop();
    if (height > 100) {
        $('#back2Top').fadeIn();
    } else {
        $('#back2Top').fadeOut();
    }
});
$(document).ready(function() {
    $("#back2Top").click(function(event) {
        event.preventDefault();
        $("html, body").animate({ scrollTop: 0 }, "slow");
        return false;
    });

    var x = document.getElementById("about2");
    x.style.display = "none";
    var mailbox1 = document.getElementById("mailbox1");
    mailbox1.style.display = "none";
});
 /*Scroll to top when arrow up clicked END*/
$(window).scroll(function() {		//jQuery to collapse menu on scroll
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});
$(function() {						//Page scrolling feature with kQuery Easing plugin
    $(document).on('click', 'a.page-scroll', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

function calc(key) {


    if(key === 'bottom'){
        var x = document.getElementById("square2").selectedIndex;
        var y = document.getElementById("room2").selectedIndex;

        var size = document.getElementsByName("id2").length;
        for (var i = 0; i < size; i++) {
            if (document.getElementsByName("id2")[i].checked == true) {
                var opt1 = document.getElementsByName("id2")[i].value;
            }
        }

        var size = document.getElementsByName("over2").length;
        for (var i = 0; i < size; i++) {
            if (document.getElementsByName("over2")[i].checked == true) {
                var opt2 = document.getElementsByName("over2")[i].value;
            }
        }

        var size = document.getElementsByName("env2").length;
        for (var i = 0; i < size; i++) {
            if (document.getElementsByName("env2")[i].checked == true) {
                var opt3 = document.getElementsByName("env2")[i].value;
            }
        }

        document.getElementById("result2").innerText = '결과 값 : ' + (x + 12) + ' ; ' + y + ' ; ' + opt1 + ' ; ' + opt2 + ' ; ' + opt3;
        var y = document.getElementById("about2");
        y.style.display = "block";

        var mailbox = document.getElementById("mailbox2");
        mailbox.style.display = "block";
    }else{
        var x = document.getElementById("square1").selectedIndex;
        var y = document.getElementById("room1").selectedIndex;

        var size = document.getElementsByName("id1").length;
        for (var i = 0; i < size; i++) {
            if (document.getElementsByName("id1")[i].checked == true) {
                var opt1 = document.getElementsByName("id1")[i].value;
            }
        }

        var size = document.getElementsByName("over1").length;
        for (var i = 0; i < size; i++) {
            if (document.getElementsByName("over1")[i].checked == true) {
                var opt2 = document.getElementsByName("over1")[i].value;
            }
        }

        var size = document.getElementsByName("env1").length;
        for (var i = 0; i < size; i++) {
            if (document.getElementsByName("env1")[i].checked == true) {
                var opt3 = document.getElementsByName("env1")[i].value;
            }
        }

        document.getElementById("result1").innerText = '결과 값 : ' + (x + 12) + ' ; ' + y + ' ; ' + opt1 + ' ; ' + opt2 + ' ; ' + opt3;
        var y = document.getElementById("about1");
        y.style.display = "block";

        var mailbox = document.getElementById("mailbox1");
        mailbox.style.display = "block";
    }
}

function visible_bottom() {
    var x = document.getElementById("about2");
    x.style.display = "none";
    var y = document.getElementById("about1");
    y.style.display = "block";
    var mailbox2 = document.getElementById("mailbox2");
    mailbox2.style.display = "none";
    var mailbox = document.getElementById("mailbox1");
    mailbox.style.display = "none";
    // document.querySelector('#about1').scrollIntoView({
    //     behavior: 'smooth'
    // });

}

function visible_space() {
    var x = document.getElementById("about1");
    x.style.display = "none";
    var y = document.getElementById("about2");
    y.style.display = "block";
    var mailbox2 = document.getElementById("mailbox2");
    mailbox2.style.display = "none";
    var mailbox = document.getElementById("mailbox1");
    mailbox.style.display = "none";

    // document.querySelector('#about2').scrollIntoView({
    //     behavior: 'smooth'
    // });
}

