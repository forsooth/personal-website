$(document).ready(function() {

        $(".two-content-columns").hide();
        $(".two-content-columns:first").show();
        $("div.description").hide();
        $("div.description:first").show();

        $("ul.tabbed-content li").click(function() {

                $("ul.tabbed-content li").removeClass("active");
                $(this).addClass("active");
                $(".two-content-columns").hide();
                var activeTab = "" + $(this).attr("rel");
                $("#" + activeTab).fadeIn();

                // Change colors of gallery background
                if ($("ul.tabbed-content li").first().hasClass("active")) {
                        $("#" + activeTab).children().first().css("border-color", "#ffe6ca");
                } else {
                        $("#" + activeTab).children().first().css("border-color", "#ffd8ca");

                }

                $("#" + activeTab).children().first().children().first().children().first().children().first().prop('checked', true);

                $("div.description").hide();
                $("div.description." + activeTab).first().show();
        });

        $(".gallery-inner label").click(function() {

                $("div.description").hide();
                var buttonSelected = "" + $(this).attr("rel");
                $("." + buttonSelected).fadeIn();
        });
});