<?php
session_start();
include("../conexion.php");
include("../funciones.php");

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(["estado" => "error", "mensaje" => "Datos no recibidosY"]);
    exit();
}

$dato = isset($data["dato"]) ? $data["dato"] : null;

echo llenarSelect($dato);

?>