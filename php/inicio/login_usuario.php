<?php

header('Content-Type: application/json; charset=UTF-8');
error_reporting(0);
ini_set('display_errors', 0);

session_start();
include("../conexion.php");
include("../funciones.php");

// Leer los datos desde el cuerpo de la solicitud JSON
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["estado" => "error", "mensaje" => "Datos no recibidos"]);
    exit();
}

$login = isset($data["login"]) ? $data["login"] : null;

error_log($login["usuario"]);

echo inicio($login);

?>
