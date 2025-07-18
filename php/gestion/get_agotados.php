<?php
session_start();
include("../conexion.php");
include("../funciones.php");

$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    echo json_encode(["estado" => "error", "mensaje" => "Datos no recibidosX"]);
    exit;
}

$fecha     = isset($data["fecha"])     ? $data["fecha"]     : "";
$asesor    = isset($data["asesor"])    ? $data["asesor"]    : "";
$motivo      = isset($data["motivo"])      ? $data["motivo"]      : "";
$tipo = isset($data["tipo"]) ? $data["tipo"] : "";
$estado = isset($data["estado"]) ? $data["estado"] : "";
//$gestion = isset($data["gestion"]) ? $data["gestion"] : "";
$gestion = isset($data["gestion"]) && is_array($data["gestion"]) ? $data["gestion"] : [];


echo traer($fecha, $asesor, $motivo, $tipo, $estado, $gestion);

?>