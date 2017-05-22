$(document).ready(function() {
	/*	
	获取第二个option的值
	$('#test option:eq(1)').val();

	打印类型	打印价格	打印类型	打印价格
	黑白单面A4	0.10元/张	黑白双面A4	0.15元/张
	彩色单面A4	0.80元/张	彩色双面A4	1.50元/张
	黑白单面A3	0.30元/张	黑白双面A3	0.50元/张
	彩色单面A3	1.0元/张	彩色双面A3	2.0元/张
	　获取被选中按钮的值 ：var val_payPlatform = $('#wrap input[name="payMethod"]:checked ').val();
	* 
	* */
	var paintnum = $(".fileNum option:selected").val();
	var layermoney = $("#layer input:checked").val();
	var papermoney = $(".paper input:checked").val();
	var colormoney = $(".color input:checked").val();
	var pricemon=paintnum+layermoney+papermoney+colormoney;
	$("#price").append(pricemon);
	console.log(paintnum+"+"+layermoney+"+"+papermoney+"+"+colormoney)
	

});