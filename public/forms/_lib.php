<?php
// Fonctions communes des formulaires (inclus par submit.php, beta.php, apply.php).
// Accès direct interdit par forms/.htaccess.

declare(strict_types=1);

if (basename($_SERVER['SCRIPT_FILENAME'] ?? '') === '_lib.php') {
    http_response_code(404);
    exit;
}

/**
 * Configuration hors du dossier web : ~/mentivis-config.php (un niveau au-dessus
 * de public_html). Modèle : scripts/static-export/mentivis-config.example.php.
 */
function mv_config(): array
{
    static $config = null;
    if ($config !== null) return $config;
    $candidates = [
        getenv('MENTIVIS_CONFIG') ?: '',
        dirname(__DIR__, 2) . '/mentivis-config.php',
    ];
    foreach ($candidates as $file) {
        if ($file !== '' && is_file($file)) {
            $loaded = require $file;
            if (is_array($loaded)) return $config = $loaded;
        }
    }
    return $config = [];
}

function mv_json(int $status, array $body): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Robots-Tag: noindex');
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/** Méthode POST, origine autorisée, limite de débit. */
function mv_guard(int $maxPerMinute = 5): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        header('Allow: POST');
        mv_json(405, ['success' => false, 'error' => 'Method not allowed']);
    }

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin !== '') {
        $allowed = mv_config()['ALLOWED_ORIGINS'] ?? [];
        $host = $_SERVER['HTTP_HOST'] ?? '';
        $sameHost = $host !== '' && (parse_url($origin, PHP_URL_HOST) === explode(':', $host)[0]);
        if (!$sameHost && !in_array($origin, $allowed, true)) {
            mv_json(403, ['success' => false, 'error' => 'Origin not allowed']);
        }
    }

    $endpoint = basename($_SERVER['SCRIPT_NAME'] ?? 'form');
    if (!mv_rate_limit($endpoint . '|' . mv_client_ip(), $maxPerMinute, 60)) {
        mv_json(429, ['success' => false, 'error' => 'Too many requests. Try again later.']);
    }
}

function mv_client_ip(): string
{
    // Derrière Cloudflare, l'IP du visiteur est dans CF-Connecting-IP.
    $ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : 'unknown';
}

/** Fenêtre glissante simple, stockée dans le dossier temporaire du serveur. */
function mv_rate_limit(string $key, int $max, int $windowSeconds): bool
{
    $dir = rtrim(mv_config()['RATE_LIMIT_DIR'] ?? sys_get_temp_dir(), '/') . '/mentivis-forms';
    if (!is_dir($dir) && !@mkdir($dir, 0700, true)) return true; // ne jamais bloquer un envoi faute de stockage
    $file = $dir . '/' . hash('sha256', $key) . '.json';
    $now = time();
    $fh = @fopen($file, 'c+');
    if ($fh === false) return true;
    flock($fh, LOCK_EX);
    $hits = json_decode((string) stream_get_contents($fh), true);
    $hits = array_values(array_filter(is_array($hits) ? $hits : [], fn($t) => is_int($t) && $t > $now - $windowSeconds));
    $ok = count($hits) < $max;
    if ($ok) $hits[] = $now;
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, json_encode($hits));
    flock($fh, LOCK_UN);
    fclose($fh);
    return $ok;
}

/** Corps JSON (fetch) ou champs de formulaire classiques. */
function mv_input(): array
{
    $type = $_SERVER['CONTENT_TYPE'] ?? '';
    if (stripos($type, 'application/json') !== false) {
        $raw = file_get_contents('php://input', false, null, 0, 1024 * 1024);
        $data = json_decode((string) $raw, true);
        return is_array($data) ? $data : [];
    }
    return $_POST;
}

function mv_str(array $data, string $key, int $max = 2000): string
{
    $v = $data[$key] ?? '';
    if (is_bool($v)) $v = $v ? 'yes' : '';
    if (!is_scalar($v)) return '';
    $v = trim((string) $v);
    return mb_substr(str_replace("\0", '', $v), 0, $max);
}

function mv_valid_email(string $email): bool
{
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/** Appel HTTP vers HubSpot. Renvoie [statut, corps]. */
function mv_http(string $method, string $url, array $headers, $body): array
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 20,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
        CURLOPT_HTTPHEADER => $headers,
    ]);
    if ($body !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
    $response = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    if ($response === false) return [0, $error];
    return [$status, (string) $response];
}

function mv_hubspot_forms_base(): string
{
    return rtrim(mv_config()['HUBSPOT_FORMS_BASE_URL'] ?? 'https://api.hsforms.com', '/');
}

function mv_hubspot_api_base(): string
{
    return rtrim(mv_config()['HUBSPOT_API_BASE_URL'] ?? 'https://api.hubapi.com', '/');
}

/**
 * Soumission au formulaire HubSpot (API publique Forms v3, sans jeton).
 * $fields : [nom => valeur]. $context : pageUri, pageName, hutk.
 * Relance sans hutk si HubSpot le refuse (INVALID_HUTK), comme l'ancienne API Node.
 */
function mv_hubspot_submit(array $fields, array $context): array
{
    $cfg = mv_config();
    $portal = $cfg['HUBSPOT_PORTAL_ID'] ?? '';
    $form = $cfg['HUBSPOT_FORM_ID'] ?? '';
    if ($portal === '' || $form === '') return [false, 'hubspot_not_configured'];

    $payload = [
        'fields' => array_map(fn($k, $v) => ['name' => $k, 'value' => (string) $v], array_keys($fields), array_values($fields)),
        'context' => array_filter($context, fn($v) => $v !== null && $v !== ''),
    ];
    $url = mv_hubspot_forms_base() . '/submissions/v3/integration/submit/' . rawurlencode($portal) . '/' . rawurlencode($form);
    $headers = ['Content-Type: application/json'];

    [$status, $body] = mv_http('POST', $url, $headers, json_encode($payload));
    if (($status < 200 || $status >= 300) && isset($payload['context']['hutk']) && str_contains($body, 'INVALID_HUTK')) {
        unset($payload['context']['hutk']);
        [$status, $body] = mv_http('POST', $url, $headers, json_encode($payload));
    }
    if ($status < 200 || $status >= 300) {
        error_log('[forms] HubSpot submit error ' . $status . ': ' . substr($body, 0, 500));
        return [false, 'hubspot_error'];
    }
    return [true, ''];
}

/** URL de la page d'origine, limitée au site courant. */
function mv_page_uri(string $candidate, string $fallbackPath): string
{
    $host = $_SERVER['HTTP_HOST'] ?? 'mentivisos.com';
    $base = 'https://' . $host;
    if ($candidate !== '' && parse_url($candidate, PHP_URL_HOST) === explode(':', $host)[0]) return $candidate;
    return $base . $fallbackPath;
}
