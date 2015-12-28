$(document).ready(function() {
    var widgetHeight = "100";
    var widgetWidthN;
    var columnCnt = 0;
    var existColumnCount = 1;
    var reportCount = 0;
    var maxReportInColumn = 3;
    var maxColumnCount = 4;
    var isDrop = false;

    var widgetReportData = {};
    var splitter, i;
    var reportCountFlag = false;

    /* Add New Column */
    function addColumn(columnCnt) {
        $(".innerWrapper").append('<div id="column' + columnCnt + '" class="columnStyle">' + columnCnt + '</div>');
        setColWidth(columnCnt)       
    }

    function setColWidth(colCount, isReportWidth) {
        var columnWidth = parseInt($('#wrapper').innerWidth(), 10) - 40 - 15 * colCount;
        columnWidthN = (columnWidth / (colCount)); 
        $(".columnStyle").css("width", columnWidthN + 'px');        
        if (isReportWidth) {
            setReportWidth();
        }
        $(window).resize();
    }

    function setReportWidth() {
        $('.columnStyle').each(function(index) {
            if ($(this).find('.reportDiv').length === 1) {
               // $(this).find('.reportDiv').width($(this).width());
            } else {
                var splitterD = $(this).data("kendoSplitter");
                splitterD.wrapper.width($(this).width());
                kendo.resize($(splitterD.wrapper[0]));
            }
        });

        console.log(widgetReportData)
    }

    function droptargetOnDrop(e) {
        console.log('====>in droptargetOnDrop',e);
        //setColWidth(Object.keys(widgetReportData).length, true);
    }

    function droptargetOnDragEnter(e) {
        console.log('in droptargetOnDragEnter',e);
    }

    function droptargetOnDragLeave(e) {
        console.log('in droptargetOnDragLeave',e);
    }

    function draggableOnDragEnd(e) {
        console.log(e.toElement, e.initialTarget)
        //if ($(e.toElement).attr('data-col') !== $(e.initialTarget).attr('data-col')) {
            var toCol = parseInt($(e.toElement).attr('data-col'), 10),
                dropCol = parseInt($(e.initialTarget).attr('data-col'), 10),
                dropReport = parseInt($(e.initialTarget).attr('data-report'), 10);

            if (widgetReportData[toCol] && widgetReportData[dropCol]) {
                if (widgetReportData[toCol].length < maxReportInColumn) {
                    widgetReportData[toCol].push(dropReport);
                    addReport(toCol, dropReport);
                

                    if (widgetReportData[dropCol].indexOf(dropReport) > -1) {
                        var removeIndex = widgetReportData[dropCol].indexOf(dropReport);
                        removeReport(dropCol, removeIndex);
                        widgetReportData[dropCol].splice( $.inArray(dropReport,widgetReportData[dropCol]) ,1 );

                        if (widgetReportData[dropCol].length === 0) {
                            delete widgetReportData[dropCol];
                        }
                    }

                    draggedReport(dropReport);

                    setColWidth(Object.keys(widgetReportData).length, true);
                } else {
                    console.log(widgetReportData)
                    alert('drag limit crox!!');
                }
            }
       // }
    }

    function draggableOnDragStart(e){
        //alert("drag start");
    }

    function draggedReport(reportIndex){
        var draggable = $("#report"+reportIndex).kendoDraggable({
            hint: function(element) {
                return $("#report"+reportIndex).clone();
            },
            dragstart: draggableOnDragStart,
            dragend: draggableOnDragEnd
        });

        $(".columnStyle").kendoDropTarget({
            dragenter: droptargetOnDragEnter,
            dragleave: droptargetOnDragLeave,
            drop: droptargetOnDrop
        });
    }

    function addReport(colIndex, reportIndex) {

        if(widgetReportData[colIndex].length === 1) {
            $("#column" + colIndex).html("<div class='reportDiv' data-col='"+colIndex+"' data-report='"+reportIndex+"' id='report"+reportIndex+"'>Report "+reportIndex+" div</div>");
                draggedReport(reportIndex);
        } else {
            splitter = $("#column" + colIndex).kendoSplitter({
                orientation: "vertical"
            }).data("kendoSplitter");
            splitter.append().html("<div class='reportDiv' data-col='"+colIndex+"' data-report='"+reportIndex+"' id='report"+reportIndex+"'>Report "+reportIndex+" div</div>");
             draggedReport(reportIndex);
        }
    }

    function removeReport(colIndex, index) {
        if (widgetReportData[colIndex].length === 1) {
            $("#column" + colIndex).remove();
        } else {
            var splitter = $("#column" + colIndex).data("kendoSplitter");
            splitter.remove(splitter.element.children(".k-pane").eq(index));
        }
    }

    $('#addReport').click(function() {
        if (Object.keys(widgetReportData).length < maxColumnCount) {
            columnCnt = columnCnt + 1;
            reportCount += 1;

            if (widgetReportData[columnCnt] === undefined) {
                widgetReportData[columnCnt] = [];
            }

            widgetReportData[columnCnt].push(reportCount);

            addColumn(columnCnt);
            addReport(columnCnt, reportCount);
        } else {
            if (existColumnCount <= maxColumnCount) {
                reportCount += 1;

                if (widgetReportData[existColumnCount] === undefined) {
                    widgetReportData[existColumnCount] = [];
                }

                if (widgetReportData[existColumnCount].length < maxReportInColumn) {
                    widgetReportData[existColumnCount].push(reportCount);
                } else {
                    existColumnCount++;
                    if (existColumnCount > maxColumnCount) {
                        alert('max column!!');
                        return false;
                    }

                    if (widgetReportData[existColumnCount] === undefined) {
                        widgetReportData[existColumnCount] = [];
                    }

                    widgetReportData[existColumnCount].push(reportCount);
                }

                

                if (reportCount <= maxReportInColumn*maxColumnCount) {
                    addReport(existColumnCount, reportCount);
                }
            } else {
                alert('max column!!');
            }
        }

        //setReportWidth()

        console.log(widgetReportData);
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
