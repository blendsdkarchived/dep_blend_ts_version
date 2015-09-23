<?php
    if(!empty($_GET['v'])) {
        $version='/?v='.time();
    } else {
        $version='';
    }
?>

<!DOCTYPE html>

<html lang="en">
<head>
<meta charset="utf-8">
<title>Blend Test</title>
<META HTTP-EQUIV="CACHE-CONTROL" CONTENT="NO-CACHE">
<link rel="stylesheet" href="css/default/default.css<?php echo $version?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>

    .bg-gray {
        background-color:#EDEDED;
    }

    .bg-gray2 {
        background-color:#EAEAEA;
    }


    .bg-blue {
        background-color:blue !important;
        color:#fff !important;
    }

    .log {
        font-size:14px;
    }

    .log span {
        display:inline-block;
        text-align:center;
    }

    .log .row {
        width:100%;
        min-height:28px;
        line-height:28px;
        border-bottom:1px solid black;
        padding-left:10px;
    }

    .row .pct10 {
        width:10%;
    }

    .row .pct40 {
        width:40%
    }

    .row .pct33 {
        width:33.3%;
    }

    .log .allpass {
        background-color:#006633;
    }

    .log .somefailed {
        background-color:#003399;
    }

    .log .totals {
        color:#fff;
        height:32px;
        line-height:32px;
    }

    .log .fail {
        background-color:#A80000;
        color:#fff;
    }

    .log .warn {
        background-color:magenta;
        color:#fff;
    }



</style>
<script src="js/blend.js<?php echo $version?>"></script>
<script src="js/blend-tests.js<?php echo $version?>"></script>
</head>
<body>
</body>
</html>