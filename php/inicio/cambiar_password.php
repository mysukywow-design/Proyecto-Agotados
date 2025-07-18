<?php

session_start();
include("../conexion.php");
include("../funciones.php");

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["estado" => "error", "mensaje" => "Datos no recibidos"]);
    exit();
}

if (!$data || empty($data['cc']) || empty($data['password'])) {
    echo json_encode([
        "estado"  => "error",
        "mensaje" => "Datos incompletos"
    ]);
    exit;
}

$cc = isset($data["cc"]) ? $data["cc"] : null;
$pass = isset($data["password"]) ? $data["password"] : null;

echo cambiarPassword($cc,$pass);

?>