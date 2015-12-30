$(function () 
{
    var reportOneH = $('.report:eq(0)').height(),
        reportTwoH = $('.report:eq(1)').height();

    $(".report").resizable(
    {
        autoHide: true,
        handles: 's',
        resize: function(e, ui) 
        {
            var nextReport = ui.element.next('.report');
            var nextReportHeight = nextReport.height();
            var diff = ui.element.height() - reportOneH;
console.log('height',ui.element.outerHeight(), nextReportHeight, ui.element.outerHeight() - reportOneH)

            var parent = ui.element.parent();
            var remainingSpace = parent.height() - ui.element.outerHeight(),
                divTwo = ui.element.next('.report');
                divTwo.height(reportTwoH - diff);

                //divTwoWidth = (remainingSpace - (divTwo.outerHeight() - divTwo.height()))/parent.height()*100+"%";
                //divTwo.height(divTwoWidth);
        },
        stop: function(e, ui) 
        {
            var parent = ui.element.parent();
            ui.element.css(
            {
                height: ui.element.height()/parent.height()*100+"%",
            });
        }
    });
});