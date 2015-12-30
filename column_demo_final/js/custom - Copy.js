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
        $(".innerWrapper").append('<div id="column' + columnCnt + '" data-col="'+columnCnt+'" class="columnStyle">' + columnCnt + '</div>');

        /*var columnWidth = parseInt($('#wrapper').innerWidth(), 10) - 40 - 15 * columnCnt;
        columnWidthN = (columnWidth / (columnCnt));
        $(".columnStyle").css("width", columnWidthN + 'px');*/

        setColWidth(columnCnt)

        addDrop();
    }

    function addReport(colIndex, reportIndex) {
        console.log("widgetReportData", widgetReportData);
        if (widgetReportData[colIndex].length === 1) {
            $("#column" + colIndex).html("<div class='reportDiv' data-rcol='"+colIndex+"' data-report='"+reportIndex+"' id='report" + reportIndex + "'>Report " + reportIndex + " div</div>");
        } else {
            $("#column" + colIndex).append("<div class='reportDiv' data-rcol='"+colIndex+"' data-report='"+reportIndex+"' id='report" + reportIndex + "'>Report " + reportIndex + " div</div>");
            setColumnHeight(colIndex);
        }

        addDrag();
    }

    function setColWidth(colCount) {
        if (colCount === undefined) {
            colCount = $('#wrapper').find('.columnStyle').length;
        }
        var columnWidth = parseInt($('#wrapper').innerWidth(), 10) - 40 - 15 * colCount;
        columnWidthN = (columnWidth / (colCount)); 
        $(".columnStyle").css("width", columnWidthN + 'px');
    }

    function setColumnHeight(columnIndex) {
        var columnHeight = $("#column" + columnIndex).height();
        var reportInColumn = widgetReportData[columnIndex].length;
        //console.log("widgetReportData[columnIndex]", widgetReportData[columnIndex]);
        //console.log("widgetReportData[columnIndex]", widgetReportData[columnIndex].length);
        if (reportInColumn <= maxReportInColumn) {
            $("#column" + columnIndex + " .reportDiv").css("height", (columnHeight / reportInColumn) - 10);
            $("#column" + columnIndex + " .reportDiv").css("margin", "10px 0 0 0");
        }
        var reportHeight = $("#column" + columnIndex + " .reportDiv").height();
        var reportWidth = $("#column" + columnIndex + " .reportDiv").width();
        for (var i = 0; i < widgetReportData[columnIndex].length; i++) {
            widgetReportData[columnIndex][i].reportDimension = {
                "h": reportHeight,
                "w": reportWidth
            };
        }

    }

    function removeReport(colIndex, index) {
        console.log(widgetReportData[colIndex].length)
        if (!widgetReportData[colIndex].length) {
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
        var reportIndex = getIndex(colCount, reportCount);
                console.log(reportIndex, colCount, reportCount)
        $(".reportDiv").resizable({
            autoHide: true,
            handles: 's',
            resize: function(e, ui) {
                var reportIndex = getIndex(colCount, reportCount);
                console.log(reportIndex)

                var reportOneH = widgetReportData[colCount][reportIndex].reportDimension.h;

                var nextReport = ui.element.next('.reportDiv');
                var nextReportHeight = nextReport.height();
                var diff = ui.element.height() - reportOneH;
    console.log('height',ui.element.outerHeight(), nextReportHeight, ui.element.outerHeight() - reportOneH)

                var parent = ui.element.parent();
                nextReport.height(reportTwoH - diff);

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

    function getIndex(colIndex, reportCount) {
        var removeArrayKeyIndex;
        var index = $.grep(widgetReportData[colIndex], function(n, i) {
            //console.log("n",n,"i",i);
            if(n.reportId === reportCount) {
                removeArrayKeyIndex = i;
            }
            return (n.reportId === reportCount);
        }, false);
        console.log('removeArrayKeyIndex',removeArrayKeyIndex)
    }

    function handleDropEvent( e, ui ) {
        //console.log(e, ui)
        var draggable = ui.draggable;
        var toCol = parseInt($(e.target).attr('data-col'), 10),
            dropCol = parseInt($(draggable).attr('data-rcol'), 10),
            dropReport = parseInt($(draggable).attr('data-report'), 10);

        if (widgetReportData[toCol] && widgetReportData[dropCol]) {
            if (widgetReportData[toCol].length < maxReportInColumn) {
                widgetReportData[toCol].push({
                    "reportId": dropReport
                });

                //$(e.target).append(draggable);
                addReport(toCol, dropReport);

                var removeArrayKeyIndex;
                var removeIndex = $.grep(widgetReportData[dropCol], function(n, i) {
                    //console.log("n",n,"i",i);
                    if(n.reportId === dropReport) {
                        removeArrayKeyIndex = i;
                    }
                    return (n.reportId === dropReport);
                }, false);

                if (removeIndex !== undefined || removeIndex !== "") {
                    widgetReportData[dropCol].splice(removeArrayKeyIndex , 1 );
                    removeReport(dropCol, removeIndex[0].reportId);

                    if (widgetReportData[dropCol].length === 0) {
                        delete widgetReportData[dropCol];
                    }
                }

                setColumnHeight($(e.target).attr('data-col'));
            } else {
                console.log(widgetReportData)
                alert('drag limit crox!!');
            }
        } else {
            alert('I am in error');
        }
        console.log(widgetReportData)
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
                widgetReportData[columnCnt] = [];
            }
            reportObj = {
                "reportId": reportCount
            };
            widgetReportData[columnCnt].push(reportObj);

            addColumn(columnCnt);
            addReport(columnCnt, reportCount);
        } else {
            if (existColumnCount <= maxColumnCount) {
                reportCount += 1;

                if (widgetReportData[existColumnCount] === undefined) {
                    widgetReportData[existColumnCount] = [];
                    reportObj = {};
                }

                if (widgetReportData[existColumnCount].length < maxReportInColumn) {
                    reportObj = {
                        "reportId": reportCount
                    };
                    widgetReportData[existColumnCount].push(reportObj);
                } else {
                    existColumnCount++;
                    if (existColumnCount > maxColumnCount) {
                        alert('max column!!');
                        return false;
                    }

                    if (widgetReportData[existColumnCount] === undefined) {
                        widgetReportData[existColumnCount] = [];
                        reportObj = {};
                    }
                    reportObj = {
                        "reportId": reportCount
                    };
                    widgetReportData[existColumnCount].push(reportObj);
                }
                if (reportCount <= maxReportInColumn * maxColumnCount) {
                    addReport(existColumnCount, reportCount);
                }
            } else {
                alert('max column!!');
            }
        }

        addResize(columnCnt, reportCount);
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
