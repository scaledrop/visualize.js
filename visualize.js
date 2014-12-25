var container = {
			defaults: {
				num: 3, 
				events: "click",
				block: "div",
				Class: "list-block alive",
				blockClass: ".alive",
				removedBlock: "dead",
				handler: "#frame-wrap",
				matrix_rows: 4,
				matrix_cols: 4,
				rows_box: 3, // default number of rows
				cols_box: 4, // default number of columns
				topStrip: ".toolbar",
				matrix: ".matrix",
				matrixSelect: ".matrix-select",
				hRow: function() {
					return $(def.matrixSelect).find("tr");
				},
				hCol: function(){
					return $(def.hRow().find("td"))
				}
			},
			preConfig: function () {
				isAppended = 0;
				var rows = def.rows_box,
				cols = def.cols_box,
				totalCount = rows*cols;

				if(totalCount){
					return true;
				}
				else{
					return false;
				}
			},			
			
			setMatrix: function(m, ms){

				var rows = $(m).children().length !== 0 ? parseInt($(m).find("tr").length, 10) : def.matrix_rows, 
				cols = $(m).children().length !== 0 ? Math.max( parseInt( $(m).find("tr:first-child td").length), parseInt( $(m).find("tr:last-child td").length)) : def.matrix_cols;
				if((!$(m).children().length) || ($(m).children("tr:first-child").length !== $(m).children("tr:last-child").length)){
					for(var i=0; i<rows;i++){
						$(m).append("<tr></tr>");
					}
					for(var j=0;j<cols;j++){
						$(m).find("tr").append("<td></td>");
					}
				}
				container.selectMatrix(m, ms);
				
			},
			selectMatrix: function(m, ms){
				var mp = $(m).parent();
				$(ms).html($(m).html());

				$(mp).bind("click", function(){
					$(m).hide();
					$(ms).show();
				});
				$(mp).bind("mouseleave", function(){
					$(ms).hide();
					$(m).show();
				});

				var h_row = $(ms).find("tr") ? $(ms).find("tr") : def.hRow(), h_col = $(ms).find("tr td") ? $(ms).find("tr td") : $(def.matrixSelect).find(hCol);

				function selectMatrix() {     
		            var c_num = parseInt( $(this).index() ) + 1;
		            var r_num = parseInt( $(this).parent().index() )+1;    
		            for(var i=0;i<r_num;i++){
		            	for(var j=0;j<c_num;j++){
		            		$(h_row).eq(i).find("td").eq(j).addClass("hovered-cell");
		            	}
		            }		            
		        }
		        function deSelectMatrix(){
		        	var c_num = parseInt( $(this).index() ) + 1, r_num = parseInt( $(this).parent().index() )+1;    

		            for(var i=0;i<r_num;i++){
		            	for(var j=0;j<c_num;j++){
		            		if($(h_row).eq(i).find("td").eq(j).hasClass("hovered-cell"))
		            			$(h_row).eq(i).find("td").eq(j).removeClass("hovered-cell");
		            	}
		            }
		        }
		        	

		        function triggerMatrix() {
		        	var c_num = parseInt( $(this).index() ) + 1, r_num = parseInt( $(this).parent().index() )+1;    
		            container.process(r_num, c_num, h_row);
		            def.rows_box = r_num;
		            def.cols_box = c_num;
		        }

				 $(h_col).bind("mouseover", selectMatrix);
				 $(h_col).bind("mouseout", deSelectMatrix);
				 $(h_col).bind("click", triggerMatrix);
			},
			process: function(rn, cn, hrow){

							var  handler = handler ? handler : def.handler, // default handler
							 blocks = def.block,
							 Class = def.Class,
							 block = def.blockClass,
							 removed = def.removedBlock;


			      			var displayedElems = $(handler).find(block).length;
			            	if(displayedElems > 0){
			            		$(block).addClass(removed);
			            			if( rn*cn <= displayedElems){
										for(var j=0;j<rn*cn;j++){
											$(block).eq(j).removeClass(removed);
											container.setBg($(block).eq(j));
										}
			            			}
			            			else{
			            				$(block).removeClass(removed);
			            				var newFrameIndex = $(block).length;
			            				var leftElems = rn*cn - $(block).length;
				            			container.createBlock(leftElems, blocks, handler, Class);
			            			}
			            	}
			            	else{
			            		container.createBlock(rn*cn, blocks, handler, Class);
			            	}
			            	var selectedElems = rn*cn;
							container.setDimensions(handler, rn, cn);				
				},
				setDimensions: function(handler, rn, cn){
					var topStripHeight = def.topStrip ? $(def.topStrip).outerHeight(true) : 0;
					var frames = $(handler).children(".list-block"),
					fullWidth = 100, fullHeight = $(window).height()-topStripHeight;
					for(var n=1; n<=cn;n++){
						frames.css({"width": fullWidth/n+"%"});
					}
					for(var m=1; m<=rn;m++){
						frames.css({"height": (fullHeight/m)+"px"});
					}
				},
				createBlock: function(limit, el, handler, Class) {
					for(var i=0; i<limit; i++){
						var child = document.createElement(el);
						$(child).addClass(Class);
						$(handler).append(child);
						container.setBg(child);
					}
				},
				setBg: function (el) {
					var i,
					background = "rgb("+parseInt(255/Math.ceil(Math.random()*10))+","+parseInt(255/Math.ceil(Math.random()*10))+","+parseInt(255/Math.ceil(Math.random()*10))+")";
					$(el).css("background", background);
					console.log(background);
				}
		}

	var def = container.defaults;
	$(function() {
		container.setMatrix(def.matrix, def.matrixSelect);
		container.process(def.rows_box, def.cols_box, def.hRow());
	});
	$(window).bind("resize", function () {
		container.setDimensions(def.handler, def.rows_box, def.cols_box);
	})
