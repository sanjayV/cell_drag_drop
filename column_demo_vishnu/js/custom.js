$(document).ready(function() {
    var widgetHeight = "100";
    var widgetWidthN;
    var columnCnt = 0;
    var existColumnCount = 1;
    var reportCount = 0;
    var maxReportInColumn = 3;
    var maxColumnCount = 4;
    var widgetReportData = {};
    var splitter, i;
    var reportCountFlag = false;
    var columnHeight;
    /* Add New Column */
    function addColumn(columnCnt) {
        $(".innerWrapper").append('<div id="column' + columnCnt + '" data-col="'+columnCnt+'" class="columnStyle"></div>');

        /*var columnWidth = parseInt($('#wrapper').innerWidth(), 10) - 40 - 15 * columnCnt;
        columnWidthN = (columnWidth / (columnCnt));
        $(".columnStyle").css("width", columnWidthN + 'px');*/
        var colCount = $('#wrapper').find('.columnStyle').length;
        setColWidth(colCount);
        addDrop();
    }

    function addReport(colIndex, reportIndex) {
        if (Object.keys(widgetReportData[colIndex]).length === 1) {
            $("#column" + colIndex).html("<div class='reportDiv' data-rcol='"+colIndex+"' data-report='"+reportIndex+"' id='report" + reportIndex + "'>Report " + reportIndex + " div</div>");
        } else {
            $("#column" + colIndex).append("<div class='reportDiv' data-rcol='"+colIndex+"' data-report='"+reportIndex+"' id='report" + reportIndex + "'>Report " + reportIndex + " div</div>");
            setColumnHeight(colIndex);
        }

        addDrag();
        addResize(colIndex, reportIndex);
    }

    function setColWidth(colCount) {
        if (colCount === undefined) {
            colCount = $('#wrapper').find('.columnStyle').length;
        }
        var columnWidth = parseInt($('#wrapper').innerWidth(), 10) - 40 - (15 * colCount);
        columnWidthN = (columnWidth / (colCount));
        $(".columnStyle").css("width", columnWidthN + 'px');
    }

    function setColumnHeight(columnIndex) {
        var columnHeight = $("#column" + columnIndex).height();

        var reportInColumn;
        if(widgetReportData[columnIndex] !== undefined){
            reportInColumn = Object.keys(widgetReportData[columnIndex]).length;
            if (reportInColumn <= maxReportInColumn) {
                $("#column" + columnIndex + " .reportDiv").css("height", (columnHeight / reportInColumn) - 10);
                $("#column" + columnIndex + " .reportDiv").css("margin", "10px 0 0 0");
            }
        }
        var reportHeight = $("#column" + columnIndex + " .reportDiv").height();
        var reportWidth = $("#column" + columnIndex + " .reportDiv").width();

        $("#column" + columnIndex).find('.reportDiv').each(function() {
            var reportHeight = $(this).height(),
                reportWidth = $(this).width(),
                reportId = $(this).attr('data-report');
            if( widgetReportData[columnIndex][reportId] !== undefined ){
                widgetReportData[columnIndex][reportId].h = reportHeight;
                widgetReportData[columnIndex][reportId].w = reportWidth;
            }
        });

        /*for (var i = 0; i < Object.keys(widgetReportData[columnIndex]).length; i++) {
            widgetReportData[columnIndex][i].reportDimension = {
                "h": reportHeight,
                "w": reportWidth
            };
        }*/

    }

    function removeReport(colIndex, index) {
        if (!Object.keys(widgetReportData[colIndex]).length) {
            $("#column" + colIndex).remove();
            setColWidth();
        } else {
            $("#report" + index).remove();
        }
    }

    function addDrag() {
        $('.reportDiv').draggable( {
            cursor: 'move',
            containment: 'document',
            helper: myHelper
        });
    }

    function addDrop() {
        $('.columnStyle').droppable( {
            drop: handleDropEvent
        });
    }

    function addResize(colCount, reportCount) {
        console.log('herer');
        $(".reportDiv").resizable({
            autoHide: true,
            handles: 's',
            resize: function(e, ui) {

                var nextReport = ui.element.next('.reportDiv'),
                    nextReportId = nextReport.attr('data-report');
                if (widgetReportData[colCount][reportCount].h !== undefined
                    && widgetReportData[colCount][nextReportId].h !== undefined) {
                    var reportOneH = widgetReportData[colCount][reportCount].h;
                    var nextReportH =  widgetReportData[colCount][nextReportId].h;
                    var diff = ui.element.height() - reportOneH;

                    nextReport.height(nextReportH - diff);
                }

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
    }

    function handleDropEvent( e, ui ) {
        //console.log(e, ui)
        var draggable = ui.draggable;
        var toCol = parseInt($(e.target).attr('data-col'), 10),
            dropCol = parseInt($(draggable).attr('data-rcol'), 10),
            dropReport = parseInt($(draggable).attr('data-report'), 10);

        if (widgetReportData[toCol] && widgetReportData[dropCol] && (toCol !== dropCol)) {
            if (Object.keys(widgetReportData[toCol]).length < maxReportInColumn) {
                widgetReportData[toCol][dropReport] = {};

                //$(e.target).append(draggable);
                addReport(toCol, dropReport);

                delete widgetReportData[dropCol][dropReport];
                removeReport(dropCol, dropReport);

                if (Object.keys(widgetReportData[dropCol]).length === 0) {
                    delete widgetReportData[dropCol];
                }

                setColumnHeight($(e.target).attr('data-col'));
                setColumnHeight(dropCol);
            } else {
                console.log(widgetReportData);
                alert('drag limit crox!!');
            }
        } else {
            alert('I am in error');
        }
        console.log(widgetReportData);
        //console.log(e.target, ui.offset.top)
        //alert( 'The square with ID "' + draggable.text() + '" was dropped onto me!' );
    }

    function myHelper( e ) {
        var height = $(e.target).height();
        var width = $(e.target).width();
        var clone = $(e.target).clone();
        return clone.height(height).width(width).css('background','#ccc');
        //return '<div id="draggableHelper" style="height:'+height+';width:'+width+';">I am a helper - drag me!</div>';
    }

    $('#addReport').click(function() {
        var reportObj = {};
        if (Object.keys(widgetReportData).length < maxColumnCount) {
            columnCnt = columnCnt + 1;
            reportCount += 1;
            if (widgetReportData[columnCnt] === undefined) {
                widgetReportData[columnCnt] = {};
            }

            widgetReportData[columnCnt][reportCount] = {};

            addColumn(columnCnt);
            addReport(columnCnt, reportCount);
        } else {
            if (reportCount <= maxReportInColumn * maxColumnCount) {
                reportCount += 1;

                if (widgetReportData[existColumnCount] === undefined) {
                    widgetReportData[existColumnCount] = {};
                }

                if (Object.keys(widgetReportData[existColumnCount]).length < maxReportInColumn) {
                    widgetReportData[existColumnCount][reportCount] = {};
                } else {
                    existColumnCount++;
                    if (existColumnCount > maxColumnCount) {
                        alert('max column!!');
                        return false;
                    }

                    if (widgetReportData[existColumnCount] === undefined) {
                        widgetReportData[existColumnCount] = {};
                    }

                    widgetReportData[existColumnCount][reportCount] = {};
                }

                //if (reportCount <= maxReportInColumn * maxColumnCount) {
                addReport(existColumnCount, reportCount);
                //}
            } else {
                alert('max Report!!');
            }
        }
console.log("widgetReportData", JSON.stringify(widgetReportData));
        
    });

    /* $('.innerWrapper').on('click', '.widgetcancel', function(events) {
         $(this).parents('div').eq(1).remove();
         columnCnt--;
         var widgetWidth = parseInt($('#wrapper').innerWidth(), 10) - 40 - 10 * columnCnt;
         widgetWidthN = (widgetWidth / (columnCnt));
         $(".columnStyle").css("width", widgetWidthN + 'px');
         var splitterD = $("#widget1").data("kendoSplitter");
         splitterD.wrapper.width($("#widget1").width() - 10 * columnCnt);
         kendo.resize($(splitterD.wrapper[0]));
     });*/

});
