<!DOCTYPE html>

<html lang="en">
<head>
<meta charset="utf-8">
<title>Blend Test</title>
<link rel="stylesheet" href="build/blend/css/default/default.css">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
	.testlog {
		width: 100%;
		font-size:12px;
	}

	.testlog .log-message {
		border-bottom: 1px solid #D8D8D8;
	}

	.testlog .type {
		min-width: 5%;
		width:5%;
		position: relative;
		top:0;
		left:0;
	}

	.testlog .message {
		color:#000;
		width: 95%;
		position: relative;
		top:0;
	}

	.testlog .type , .testlog .message , .testlog .totals span {
		line-height: 24px;
		display: inline-block;
		padding-left: 10px;
		padding-right: 10px;
	}

	.testlog .log-info .type {
		background: #2E64FE;
		color:#fff;
	}

	.testlog .log-info .message {
		background: #5858FA;
		color:#fff;
	}


	.testlog .log-error .type {
		background: red;
		color:#fff;
	}

	.testlog .log-warn .type {
		background: magenta;
		color:#fff;
	}

	.testlog .log-fail .message {
		background-color: red;
		color:#fff;
	}

	.testlog .log-pass .type {
		background-color: #fff;
		color:green;
		font-weight: bold;
	}

	.testlog .log-fail .type {
		background-color: #fff;
		color:red;
		font-weight: bold;
	}

	.testlog .log-pass .message {
		color:green;
	}

	.testlog .totals {
		width: 100%;
		font-weight: bold;
		line-height: 32px;
	}

	.testlog .totals  span {
		line-height: 32px;
	}

	.totals .pass {
		background-color: green;
	}

	.totals .fail {
		background-color: red;
	}

	.totals .pass {
		color:#fff;
	}

	.totals .total {
		color:#000;
		background-color: #FFFF66;
		width:20%;
	}

	.totals .fail , .totals .pass {
		width:40%;
		color:#fff;
	}



</style>
<script src="build/blend/js/blend.js"></script>
<script src="build/js/blend-testing.js"></script>
</head>
<body>
</body>
</html>