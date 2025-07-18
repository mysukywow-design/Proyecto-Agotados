<?php
session_start();
include("../conexion.php");
include("../funciones.php");

echo contarAgotadosPendientes();

?>