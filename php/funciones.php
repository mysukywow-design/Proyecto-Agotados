<?php

include("phpmailer/class.phpmailer.php");
include("phpmailer/class.smtp.php");


/******************* utilidades comunes **************************/
function jOk($extra = [])  { return json_encode(["estado"=>"exito"] + $extra); }
function jErr($msg)       { return json_encode(["estado"=>"error","mensaje"=>$msg]); }

function llenarSelect($d) {
    include "conexion.php";

    if($d === "asesor") {
        $sql = "SELECT user AS codigo, concat(user,' - ',nombre) AS descrip
            FROM env_log 
            WHERE perfil = ?
            ORDER BY nombre ASC";
    } else {
        $sql = "SELECT id AS codigo, descripcion AS descrip  FROM sol_desp WHERE name_combo = ?";
    }

    $st = mysqli_prepare($conexion, $sql);
    if (!$st) { $e = mysqli_error($conexion); mysqli_close($conexion); return jErr("prepare: $e"); }

    mysqli_stmt_bind_param($st, "s", $d);
    if (!mysqli_stmt_execute($st)) { $e = mysqli_stmt_error($st); mysqli_stmt_close($st); mysqli_close($conexion); return jErr("execute: $e"); }

    $res   = mysqli_stmt_get_result($st);
    $datos = [];
    while ($r = mysqli_fetch_assoc($res)) $datos[] = $r;

    mysqli_stmt_close($st); 
    mysqli_close($conexion);

    return jOk(["datos" => $datos ?: null]);
}
/************************** Inicio **************************/

function inicio($login) {
    include 'conexion.php';

    $sql  = "SELECT * FROM env_log WHERE user = ?";
    $st   = mysqli_prepare($conexion, $sql);
    if (!$st) {
        $e = mysqli_error($conexion);
        mysqli_close($conexion);
        return json_encode(["estado" => "error", "mensaje" => "prepare: $e"]);
    }

    mysqli_stmt_bind_param($st, "s", $login['usuario']);
    if (!mysqli_stmt_execute($st)) {
        $e = mysqli_stmt_error($st);
        mysqli_stmt_close($st);
        mysqli_close($conexion);
        return json_encode(["estado" => "error", "mensaje" => "execute: $e"]);
    }

    $row = mysqli_fetch_assoc(mysqli_stmt_get_result($st));
    mysqli_stmt_close($st);

    if (!$row) {
        mysqli_close($conexion);
        return json_encode(["estado" => "error", "mensaje" => "Usuario no encontrado"]);
    }

    $passInp = $login['password'];
    $passDB  = $row['pass'];
    $esPlano = ($passInp === $passDB);

    if (!$esPlano && !password_verify($passInp, $passDB)) {
        mysqli_close($conexion);
        return json_encode(["estado" => "error", "mensaje" => "Contraseña incorrecta"]);
    }

    if ($esPlano) {
        mysqli_close($conexion);
        return json_encode([
            "estado"  => "cambiar",
            "cc"      => $row['cc'],
            "perfil"  => $row['perfil'],
            "mensaje" => "Debes actualizar tu contraseña"
        ]);
    }

    $_SESSION['login_user'] = $row['user'];
    $usuario = $row['cc'] . ' - ' . $row['nombre'];

    $destinos = [
        'asesor'     => './agotados.html',
        'admin'     => './gestion.html'
    ];
    $perfil   = $row['perfil'];
    $redirect = $destinos[$perfil] ?? './index.html';

    mysqli_close($conexion);

    return jOk([
        "mensaje"  => "si",
        "usuario" => $usuario,
        "perfil"  => $perfil,
        "dirigir" => $redirect
    ]);
}

function cambiarPassword($cc, $pwdNueva) {
    include 'conexion.php';

    $hash = password_hash($pwdNueva, PASSWORD_BCRYPT);

    $sql = "UPDATE env_log SET pass = ? WHERE cc = ?";
    $st  = mysqli_prepare($conexion, $sql);
    if (!$st) { $e = mysqli_error($conexion); mysqli_close($conexion);
        return json_encode(["estado"=>"error","mensaje"=>"prepare: $e"]); }

    mysqli_stmt_bind_param($st, "ss", $hash, $cc);
    if (!mysqli_stmt_execute($st)) {
        $e = mysqli_stmt_error($st); mysqli_stmt_close($st); mysqli_close($conexion);
        return json_encode(["estado"=>"error","mensaje"=>"execute: $e"]);
    }

    mysqli_stmt_close($st);
    mysqli_close($conexion);

    return jOk();
}

/************************** Agotados **************************/

function item($d) {
    include 'conexion.php';

    $sql = "
    SELECT 
        ITEMS.ID_ITEM AS codigo, 
        ITEMS.ID_REFERENCIA AS referencia, 
        SUBSTRING(ITEMS.DESCRIPCION,1,25) AS descripcion, 
        SUBSTRING(ITEMS.DESCRIPCION,26,15) AS modelo,
        ITEMS.ID_CRICLA3 AS mar,
        CONCAT(ITEMS.ID_ITEM, ' - ',ITEMS.ID_REFERENCIA, ' - ', ITEMS.DESCRIPCION, ' - ',ITEMS.ID_CRICLA3) AS descrip
    FROM 
        ITEMS
    WHERE ITEMS.ID_ITEM LIKE ? OR ITEMS.ID_REFERENCIA LIKE ? 
    OR SUBSTRING(ITEMS.DESCRIPCION,1,25) LIKE ? 
    OR SUBSTRING(ITEMS.DESCRIPCION,26,15) LIKE ?
    OR CONCAT(ITEMS.ID_ITEM, ' - ',ITEMS.ID_REFERENCIA, ' - ', ITEMS.DESCRIPCION, ' - ',ITEMS.ID_CRICLA3) LIKE ?";

    $dato = "%" . $d . "%";

    $st = mysqli_prepare($conexion1, $sql);
    if (!$st) { $e = mysqli_error($conexion1); mysqli_close($conexion1); return jErr("prepare: $e"); }

    mysqli_stmt_bind_param($st, "sssss", $dato, $dato, $dato, $dato, $dato);
    if (!mysqli_stmt_execute($st)) {
        $e = mysqli_stmt_error($st); mysqli_stmt_close($st); mysqli_close($conexion1); return jErr("execute: $e");
    }

    $res   = mysqli_stmt_get_result($st);
    $datos = [];
    while ($r = mysqli_fetch_assoc($res)) $datos[] = $r;

    mysqli_stmt_close($st); 
    mysqli_close($conexion1);

    return jOk(["datos" => $datos ?: null]);
}

function usuario($d) {
    include 'conexion.php';

    $sql = "SELECT user FROM env_log WHERE perfil = 'asesor' AND cc = ?";

    $st = mysqli_prepare($conexion, $sql);
    if (!$st) { $e = mysqli_error($conexion); mysqli_close($conexion); return jErr("prepare: $e"); }

    mysqli_stmt_bind_param($st, "s", $d);
    if (!mysqli_stmt_execute($st)) {
        $e = mysqli_stmt_error($st); mysqli_stmt_close($st); mysqli_close($conexion); return jErr("execute: $e");
    }

    $res   = mysqli_stmt_get_result($st);
    $row = mysqli_fetch_assoc($res);

    mysqli_stmt_close($st); 
    mysqli_close($conexion);

    if($row){
        return $row["user"];
    }
}

function subir($d) {
    include 'conexion.php';

    $cedula = trim(explode(' - ', $d["usuario"], 2)[0]);
    $ext = usuario($cedula);
    $fecha    = date('Y-m-d');

    $sql = "INSERT INTO sol_agotado
            (id,ext,fecha,item,referencia,descripcion,modelo,marca,motivo,obs,tipo,fecha_ges_ini,fecha_ges_fin,obs_ges,gestion,estado,dia_sin_ges,dia_gestion,dia_total) 
            VALUES (null,?,?,?,?,?,?,?,?,?,?,null,null,null,null,'Solicitud',null,null,null)";

    $st = mysqli_prepare($conexion, $sql);
    if (!$st) { $e = mysqli_error($conexion); mysqli_close($conexion); return jErr("prepare: $e"); }

    mysqli_stmt_bind_param($st, "ssssssssss",
    $ext, $fecha, $d['item'], $d['referencia'], $d['descripcion'],
    $d['modelo'], $d['marca'], $d['motivo'], $d['obs'], $d['tipo']);

    if (!mysqli_stmt_execute($st)) {
        $e = mysqli_stmt_error($st); mysqli_stmt_close($st); mysqli_close($conexion); return jErr("execute: $e");
    }
    
    mysqli_stmt_close($st); mysqli_close($conexion);
    return jOk();
}

/************************** Gestion **************************/

function traer($fecha, $asesor, $motivo, $tipo, $estado, array $gestion = []) {
    include "conexion.php";

    $whereClauses = [];
    $params       = [];
    $types        = "";

    if ($fecha !== "") {
        $whereClauses[] = "sol_agotado.fecha = ?";
        $params[]       = $fecha;
        $types         .= "s";
    }

    if ($asesor !== "") {
        $whereClauses[] = "sol_agotado.ext = ?";
        $params[]       = $asesor;
        $types         .= "s";
    }

    if ($motivo !== "") {
        $whereClauses[] = "sol_agotado.motivo = ?";
        $params[]       = $motivo;
        $types         .= "s";
    }

    if ($tipo !== "") {
        $whereClauses[] = "sol_agotado.tipo = ?";
        $params[]       = $tipo;
        $types         .= "s";
    }

    if (count($gestion) > 0) {
        // Creamos un placeholder “?, ?, ?”
        $placeholders = implode(',', array_fill(0, count($gestion), '?'));
        $whereClauses[] = "sol_agotado.gestion IN ($placeholders)";
        // añadimos cada valor al array de params
        foreach ($gestion as $g) {
            $params[] = $g;
            $types   .= "s";
        }
    }

    if ($estado !== "") {
        $whereClauses[] = "sol_agotado.estado = ?";
        $params[]       = $estado;
        $types         .= "s";
    } else {
        $whereClauses[] = "sol_agotado.estado = ?";
        $params[]       = "Solicitud";
        $types         .= "s";
    }

    /*$whereSQL = "";
    if (count($whereClauses) > 0) {
        $whereSQL = "WHERE " . implode(" AND ", $whereClauses);
    }*/

    $whereSQL = count($whereClauses) 
        ? "WHERE " . implode(" AND ", $whereClauses) 
        : "";

    $sql = "SELECT id, ext,
            CONCAT(item,' - ',referencia,' - ',descripcion,' - ',modelo,' - ',marca) AS item,
            motivo, obs,tipo,estado,
            fecha_ges_ini AS fecha_ini, fecha_ges_fin AS fecha_fin, obs_ges, gestion,
            dia_sin_ges, dia_gestion,dia_total
            FROM sol_agotado
            $whereSQL
            ORDER BY id ASC";

    $st = mysqli_prepare($conexion, $sql);
    if (!$st) { $e = mysqli_error($conexion); mysqli_close($conexion); return jErr("prepare1: $e"); }

    mysqli_stmt_bind_param($st, $types, ...$params);
    if (!mysqli_stmt_execute($st)) { $e = mysqli_stmt_error($st); mysqli_stmt_close($st); mysqli_close($conexion); return jErr("execute: $e"); }

    $res   = mysqli_stmt_get_result($st);
    $datos  = [];
    while ($r = mysqli_fetch_assoc($res)) $datos[] = $r;

    mysqli_stmt_close($st);
    mysqli_close($conexion);

    return jOk(["datos"  => $datos,
    "hash" => md5(serialize($datos))]);
}

function contarAgotadosPendientes() {
    include 'conexion.php';

    $fecha = date('Y-m-d');
    $sql   = "SELECT COUNT(*) FROM sol_agotado WHERE estado='solicitud' AND fecha=?";
    $st    = mysqli_prepare($conexion, $sql);

    if (!$st) { $e = mysqli_error($conexion); mysqli_close($conexion); return jErr("prepare: $e"); }

    mysqli_stmt_bind_param($st, "s", $fecha);
    if (!mysqli_stmt_execute($st)) {
        $e = mysqli_stmt_error($st); mysqli_stmt_close($st); mysqli_close($conexion); return jErr("execute: $e");
    }

    mysqli_stmt_bind_result($st, $total); mysqli_stmt_fetch($st);
    mysqli_stmt_close($st); mysqli_close($conexion);

    return jOk(["cuantos" => (int)$total]);
}

function verificarAgotado($id) {
    include 'conexion.php';

    $sql = "SELECT fecha, fecha_ges_ini, dia_sin_ges FROM sol_agotado WHERE id = ?";

    $st = mysqli_prepare($conexion, $sql);
    if (!$st) { $e = mysqli_error($conexion); mysqli_close($conexion); return jErr("prepare: $e"); }

    mysqli_stmt_bind_param($st, "s", $id);
    if (!mysqli_stmt_execute($st)) {
        $e = mysqli_stmt_error($st); mysqli_stmt_close($st); mysqli_close($conexion); return jErr("execute: $e");
    }

    $res   = mysqli_stmt_get_result($st);
    $row = mysqli_fetch_assoc($res);

    mysqli_stmt_close($st); 
    mysqli_close($conexion);

    if($row){
        return $row;
    }
}

function gestionarAgotados($d) {
    include 'conexion.php';

    $datos = verificarAgotado($d['id']);
    $fecha = date('Y-m-d');

    $set = [];
    $prm = [];
    $types = "";
    
    if($datos['fecha_ges_ini'] === "" || is_null($datos['fecha_ges_ini'])){
        $set[] = "fecha_ges_ini = ?";
        $prm[] = $fecha;
        $types .= "s";

        $set[] = "dia_sin_ges = ?";
        $fecha1 = new DateTime($datos['fecha']);
        $fecha2 = new DateTime($fecha);
        $diferencia = $fecha1->diff($fecha2);
        $dias = $diferencia->days;
        $prm[] = $dias;
        $types .= "i";

        $set[] = "dia_gestion = ?";
        $prm[] = "1";
        $types .= "i";
    }

    if($d['estado'] === "Finalizado"){
        $set[] = "fecha_ges_fin = ?";
        $prm[] = $fecha;
        $types .= "s";

        if($datos['fecha_ges_ini'] === "" || is_null($datos['fecha_ges_ini'])){
            $set[] = "fecha_ges_ini = ?";
            $prm[] = $fecha;
            $types .= "s";

            $set[] = "dia_sin_ges = ?";
            $fecha1 = new DateTime($datos['fecha']);
            $fecha2 = new DateTime($fecha);
            $diferencia = $fecha1->diff($fecha2);
            $dias = $diferencia->days;
            $prm[] = $dias;
            $types .= "i";

            $set[] = "dia_gestion = ?";
            $prm[] = "1";
            $types .= "i";

            $set[] = "dia_total = ?";
            $prm[] = "1";
            $types .= "i";
        } else {
            $set[] = "dia_gestion = ?";
            $fecha1 = new DateTime($datos['fecha_ges_ini']);
            $fecha2 = new DateTime($fecha);
            $diferencia = $fecha1->diff($fecha2);
            $dias = $diferencia->days;
            if($dias === 0){
                $dias = 1;
            } else {
                $dias = $dias;
            }
            $prm[] = $dias;
            $types .= "i";
    
            $set[] = "dia_total = ?";
            $total = $datos['dia_sin_ges'] + $dias;
            $prm[] = $total;
            $types .= "i";
        }    
    }

    if($d['estado'] !== "0"){
        $set[] = "estado = ?";
        $prm[] = $d['estado'];
        $types .= "s";
    }

    if($d['gestion'] !== "0"){
        $set[] = "gestion = ?";
        $prm[] = $d['gestion'];
        $types .= "s";
    }

    if($d['obs'] !== ""){
        $set[] = "obs_ges = ?";
        $prm[] = $d['obs'];
        $types .= "s";
    }

    $types .= "s";
    $prm[]  = $d['id'];

    $sql = "UPDATE sol_agotado SET ".implode(',',$set)." WHERE id = ? ";

    $st = mysqli_prepare($conexion, $sql);
    if (!$st) { $e = mysqli_error($conexion); mysqli_close($conexion); return jErr("prepare: $e"); }

    mysqli_stmt_bind_param($st, $types, ...$prm);

    if (!mysqli_stmt_execute($st)) {
        $e = mysqli_stmt_error($st);
        mysqli_stmt_close($st); mysqli_close($conexion);
        return jErr("editarEmpleado: $e");
    }

    mysqli_stmt_close($st);
    mysqli_close($conexion);
    return jOk();
}

function enviar_correo($cuerpo,$nom1,$asunto) {
    //Crear una instancia de PHPMailer
    $mail = new PHPMailer();
    //Definir que vamos a usar SMTP
    $mail->IsSMTP();
    //Esto es para activar el modo depuración. En entorno de pruebas lo mejor es 2, en producción siempre 0
    // 0 = off (producción)
    // 1 = client messages
    // 2 = client and server messages
    $mail->SMTPDebug  = 0;
    //Ahora definimos gmail como servidor que aloja nuestro SMTP
    $mail->Host       = 'smtp.gmail.com';
    //El puerto será el 587 ya que usamos encriptación TLS
    $mail->Port       = 465;
    //Definmos la seguridad como TLS
    $mail->SMTPSecure = 'ssl';
    //Tenemos que usar gmail autenticados, así que esto a TRUE
    $mail->SMTPAuth   = true;
    //Definimos la cuenta que vamos a usar. Dirección completa de la misma
    $mail->Username   = "notificacion.obyco@gmail.com";
    //Introducimos nuestra contraseña de gmail
    $mail->Password   = "llwvkwzrolsciryf";
    //Definimos el remitente (dirección y, opcionalmente, nombre)
    $mail->SetFrom('notificacion.obyco@gmail.com', 'Subida de Agotado');
    //Esta línea es por si queréis enviar copia a alguien (dirección y, opcionalmente, nombre)
    //$mail->AddReplyTo('replyto@correoquesea.com','El de la réplica');
    //Y, ahora sí, definimos el destinatario (dirección y, opcionalmente, nombre)
    $mail->AddAddress('ptovtas@obyco.com', 'Coordinador PDV');
    //$mail->AddAddress('diradmin@obyco.com', 'Director Administrativo');
    //Definimos el tema del email
    $mail->Subject = "$nom1 + $asunto";
    //Para enviar un correo formateado en HTML lo cargamos con la siguiente función. Si no, puedes meterle directamente una cadena de texto.
    $mail->MsgHTML("$cuerpo");
    //$mail->MsgHTML(file_get_contents('correomaquetado.html'), dirname(ruta_al_archivo));
    //Y por si nos bloquean el contenido HTML (algunos correos lo hacen por seguridad) una versión alternativa en texto plano (también será válida para lectores de pantalla)
    //$mail->AltBody = 'This is a plain-text message body';
    //Enviamos el correo
    if(!$mail->Send()) {
        echo "Error info67: " . $mail->ErrorInfo;
    }
}
?>