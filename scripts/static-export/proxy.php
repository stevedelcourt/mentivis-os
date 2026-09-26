<?php
// Relais des appels /api/* du site statique vers le serveur Node (formulaires,
// blog, offres d'emploi, tarifs). Généré par scripts/build-static-export.mjs.
// API_ORIGIN est remplacé au build (variable d'environnement API_ORIGIN).
const API_ORIGIN = '__API_ORIGIN__';
const MAX_BODY = 12 * 1024 * 1024; // 12 Mo (CV en PDF)

$path = $_GET['__path'] ?? '';
if (!preg_match('#^api/[A-Za-z0-9/_\-.]*$#', $path) || strpos($path, '..') !== false) {
  http_response_code(400);
  header('Content-Type: text/plain; charset=utf-8');
  exit('Bad request');
}

// Paramètres de requête d'origine, sans le paramètre interne.
$query = $_GET;
unset($query['__path']);
$target = rtrim(API_ORIGIN, '/') . '/' . $path;
if (substr($target, -1) !== '/') $target .= '/';
if ($query) $target .= '?' . http_build_query($query);

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$allowed = ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
if (!in_array($method, $allowed, true)) {
  http_response_code(405);
  exit;
}

// En-têtes transmis : type de contenu, langue, authentification, origine.
$forward = ['content-type', 'accept', 'accept-language', 'authorization', 'cookie', 'origin', 'referer', 'user-agent'];
$headers = [];
foreach (getallheaders() as $name => $value) {
  if (in_array(strtolower($name), $forward, true)) $headers[] = "$name: $value";
}
$clientIp = $_SERVER['REMOTE_ADDR'] ?? '';
$headers[] = 'X-Forwarded-For: ' . $clientIp;
$headers[] = 'X-Forwarded-Host: ' . ($_SERVER['HTTP_HOST'] ?? '');
$headers[] = 'X-Forwarded-Proto: https';

$ch = curl_init($target);
curl_setopt_array($ch, [
  CURLOPT_CUSTOMREQUEST => $method,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HEADER => true,
  CURLOPT_FOLLOWLOCATION => false,
  CURLOPT_CONNECTTIMEOUT => 5,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_SSL_VERIFYPEER => true,
  CURLOPT_SSL_VERIFYHOST => 2,
  CURLOPT_HTTPHEADER => $headers,
]);
if (in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
  $body = file_get_contents('php://input', false, null, 0, MAX_BODY + 1);
  if ($body !== false && strlen($body) > MAX_BODY) {
    http_response_code(413);
    exit('Payload too large');
  }
  curl_setopt($ch, CURLOPT_POSTFIELDS, $body === false ? '' : $body);
}

$response = curl_exec($ch);
if ($response === false) {
  curl_close($ch);
  http_response_code(502);
  header('Content-Type: application/json; charset=utf-8');
  exit('{"error":"upstream_unavailable"}');
}
$status = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
curl_close($ch);

// Réponse : statut, en-têtes utiles, corps.
http_response_code($status);
$passBack = ['content-type', 'content-disposition', 'cache-control', 'set-cookie', 'location', 'retry-after'];
foreach (explode("\r\n", substr($response, 0, $headerSize)) as $line) {
  $pos = strpos($line, ':');
  if ($pos === false) continue;
  $name = strtolower(trim(substr($line, 0, $pos)));
  if (in_array($name, $passBack, true)) header($line, false);
}
header('X-Robots-Tag: noindex');
echo substr($response, $headerSize);
