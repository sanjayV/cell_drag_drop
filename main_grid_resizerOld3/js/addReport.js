$(document).ready(function() {
                    var splitterElement = $("#widget1"),
                        getPane = function (index) {
                            index = Number(index);

                            var panes = splitterElement.children(".k-pane");

                            if(!isNaN(index) && index < panes.length) {
                                return panes[index];
                            }
                        },
                        setSize = function (e) {
                            if (e.type != "keypress" || kendo.keys.ENTER == e.keyCode) {
                                var pane = getPane($("#index").val());
                                alert(pane);
                                if (!pane) return;

                                splitter.size(pane, $("#size").val());
                            }
                        },
                        setMinSize = function (e) {
                            if (e.type != "keypress" || kendo.keys.ENTER == e.keyCode) {
                                var pane = getPane($("#index").val());

                                if (!pane) return;

                                splitter.min(pane, $("#min").val());
                            }
                        },
                        setMaxSize = function (e) {
                            if (e.type != "keypress" || kendo.keys.ENTER == e.keyCode) {
                                var pane = getPane($("#index").val());

                                if (!pane) return;

                                splitter.max(pane, $("#max").val());
                            }
                        },
                        appendPane = function (e) {
                            var splitter = $("#widget1").kendoSplitter({
                                orientation: "vertical"
                            }).data("kendoSplitter");
                            splitter.append().html("<div id='splitter'>Test</div>");
                            
                        },
                        removePane = function (e) {
                            splitter.remove(splitter.element.children(".k-pane").eq($("#index").val()));
                        },
                        insertBefore = function (e) {
                            splitter.insertBefore({}, splitter.element.children(".k-pane").eq($("#index").val())).html("inserted before");
                        },
                        insertAfter = function (e) {
                            splitter.insertAfter({}, splitter.element.children(".k-pane").eq($("#index").val())).html("inserted after");
                        };

                    $("#toggle").click( function (e) {
                        var pane = getPane($("#index").val());
                        if (!pane) return;

                        splitter.toggle(pane, $(pane).width() <= 0);
                    });

                    $("#setSize").click(setSize);
                    $("#size").keypress(setSize);

                    $("#setMinSize").click(setMinSize);
                    $("#min").keypress(setMinSize);

                    $("#setMaxSize").click(setMaxSize);
                    $("#max").keypress(setMaxSize);

                    $("#appendPane").click(appendPane);
                    $("#removePane").click(removePane);

                    
                });