<?php
// Static-host API proxy (Universe / PreProd). Generated into out/proxy.php
// by scripts/export-api-snapshot.py with site constants injected - this
// template MUST NOT contain secrets (it lives in git).
//
// .htaccess rewrites /api/* here (?url= preserved). Endpoints:
//   GET  /api/blog/posts[?lang=&category=]  -> snapshot JSON (+tolerant filter)
//   GET  /api/blog/posts/{slug}[?lang=]      -> snapshot find
//   GET  /api/jobs/{slug}[?lang=]           -> snapshot find (404 shape like Node)
//   POST|PUT /api/demo (JSON)               -> HubSpot relay (same payload as Node)
//   POST /api/job-applications (multipart)  -> save CV, mail it, HubSpot relay
//
// Test mode (CLI only): PROXY_TEST=1 php proxy.php  (runs self-checks, no network).

define('HUBSPOT_PORTAL_ID', '%%HUBSPOT_PORTAL_ID%%');
define('HUBSPOT_FORM_ID', '%%HUBSPOT_FORM_ID%%');
define('RECIPIENT_EMAIL', '%%RECIPIENT_EMAIL%%');
define('MAX_CV_SIZE', 5 * 1024 * 1024);
define('SNAP_DIR', __DIR__ . '/api/_snapshot');

// ---------------------------------------------------------------- helpers

function json_out($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
}

function client_ip() {
    $f = isset($_SERVER['HTTP_X_FORWARDED_FOR']) ? $_SERVER['HTTP_X_FORWARDED_FOR'] : '';
    if ($f !== '') {
        $parts = explode(',', $f);
        return trim($parts[0]);
    }
    return isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'unknown';
}

// Best-effort per-IP throttle (file-based). Fails open if temp unwritable.
function check_throttle($key, $max, $window_s) {
    $file = rtrim(sys_get_temp_dir(), '/') . '/mxproxy_' . $key . '_' . md5(client_ip());
    $now = time();
    $hits = array();
    if (is_readable($file)) {
        $raw = @file_get_contents($file);
        $hits = $raw ? array_filter(array_map('intval', explode(',', $raw))) : array();
        $hits = array_values(array_filter($hits, function ($t) use ($now, $window_s) {
            return ($now - $t) < $window_s;
        }));
    }
    if (count($hits) >= $max) return false;
    $hits[] = $now;
    @file_put_contents($file, implode(',', $hits));
    return true;
}

function read_snapshot($name) {
    $f = SNAP_DIR . '/' . basename($name) . '.json';
    if (!is_readable($f)) return null;
    $d = json_decode(@file_get_contents($f), true);
    return is_array($d) ? $d : null;
}

// Tolerant category match (mirrors BlogIndex): lowercase, trim, de-pluralize.
function norm_cat($s) {
    $s = strtolower(trim((string)$s));
    return preg_replace('/s$/', '', $s);
}

function hubspot_submit($payload) {
    if (HUBSPOT_PORTAL_ID === '' || HUBSPOT_FORM_ID === '') {
        return array('ok' => false, 'skipped' => true);
    }
    if (getenv('PROXY_TEST') === '1') {
        return array('ok' => true, 'test' => true, 'payload' => $payload);
    }
    $ch = curl_init('https://api.hsforms.com/submissions/v3/integration/submit/'
        . HUBSPOT_PORTAL_ID . '/' . HUBSPOT_FORM_ID);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    $body = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($code >= 200 && $code < 300) {
        return array('ok' => true, 'data' => json_decode($body, true));
    }
    return array('ok' => false, 'status' => $code, 'text' => (string)$body);
}

function enc_subject($s) {
    return '=?UTF-8?B?' . base64_encode($s) . '?=';
}

// Plain-text email, optional PDF attachment. Returns bool.
function send_mail_with_cv($to, $subject, $lines, $cv_path, $cv_name) {
    if (getenv('PROXY_TEST') === '1') {
        return true;
    }
    $boundary = 'mx' . md5(uniqid((string)mt_rand(), true));
    $headers = "From: MentivisOS <no-reply@" . $_SERVER['HTTP_HOST'] . ">\r\n"
        . "MIME-Version: 1.0\r\n"
        . 'Content-Type: multipart/mixed; boundary="' . $boundary . "\"\r\n";
    $text = implode("\n", $lines);
    $body = "--" . $boundary . "\r\n"
        . "Content-Type: text/plain; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: 8bit\r\n\r\n" . $text . "\r\n";
    if ($cv_path && is_readable($cv_path)) {
        $body .= "--" . $boundary . "\r\n"
            . "Content-Type: application/pdf; name=\"" . $cv_name . "\"\r\n"
            . "Content-Transfer-Encoding: base64\r\n"
            . 'Content-Disposition: attachment; filename="' . $cv_name . "\"\r\n\r\n"
            . chunk_split(base64_encode(file_get_contents($cv_path))) . "\r\n";
    }
    $body .= "--" . $boundary . "--";
    return @mail($to, enc_subject($subject), $body, $headers);
}

function sanitize_filename($name) {
    $t = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $name);
    if ($t === false) $t = $name;
    $t = preg_replace('/[^a-zA-Z0-9]/', '-', $t);
    $t = preg_replace('/-+/', '-', (string)$t);
    $t = trim((string)$t, '-');
    $out = strtolower($t);
    return $out === '' ? 'cv' : $out;
}

function public_base() {
    $host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'localhost';
    $host = explode(',', $host);
    $host = trim($host[0]);
    return 'https://' . $host;
}

// ---------------------------------------------------------------- handlers

function handle_blog_posts($query) {
    $lang = (isset($query['lang']) && $query['lang'] === 'en') ? 'en' : 'fr';
    $posts = read_snapshot('posts.' . $lang);
    if ($posts === null) return json_out(array('error' => 'Snapshot unavailable'), 500);
    $cat = isset($query['category']) ? $query['category'] : 'all';
    if ($cat && $cat !== 'all') {
        $want = norm_cat($cat);
        $posts = array_values(array_filter($posts, function ($p) use ($want) {
            $cats = isset($p['category']) ? explode(',', (string)$p['category']) : array();
            foreach ($cats as $c) {
                if (norm_cat($c) === $want) return true;
            }
            return false;
        }));
    }
    return json_out(array('posts' => $posts));
}

function handle_blog_post_slug($slug, $query) {
    $lang = (isset($query['lang']) && $query['lang'] === 'en') ? 'en' : 'fr';
    $posts = read_snapshot('posts.' . $lang);
    if ($posts === null) return json_out(array('error' => 'Snapshot unavailable'), 500);
    foreach ($posts as $p) {
        if (isset($p['slug']) && $p['slug'] === $slug) {
            return json_out(array('post' => $p));
        }
    }
    return json_out(array('error' => 'Post not found'), 404);
}

function handle_job_slug($slug, $query) {
    $lang = (isset($query['lang']) && $query['lang'] === 'en') ? 'en' : 'fr';
    $jobs = read_snapshot('jobs.' . $lang);
    if ($jobs === null) return json_out(array('error' => 'Snapshot unavailable'), 500);
    foreach ($jobs as $j) {
        if (isset($j['slug']) && $j['slug'] === $slug && !empty($j['published'])) {
            return json_out(array('job' => $j));
        }
    }
    return json_out(array('error' => 'Job not found'), 404);
}

function handle_demo($input) {
    if (!check_throttle('demo', 5, 60)) {
        return json_out(array('success' => false, 'error' => 'Too many requests'), 429);
    }
    $g = function ($k) use ($input) {
        return isset($input[$k]) ? (string)$input[$k] : '';
    };
    if ($g('honeypot') !== '') {
        return json_out(array('success' => false, 'error' => 'Spam detected'), 400);
    }
    if ($g('firstname') === '' || $g('lastname') === '' || $g('email') === '') {
        return json_out(array('success' => false, 'error' => 'Missing required fields'), 400);
    }
    $is_summer = ($g('formContext') === 'summer26');
    $ref = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : public_base() . '/';
    $payload = array(
        'fields' => array(
            array('name' => 'firstname', 'value' => $g('firstname')),
            array('name' => 'lastname', 'value' => $g('lastname')),
            array('name' => 'company', 'value' => $g('organization')),
            array('name' => 'jobtitle', 'value' => $g('role')),
            array('name' => 'message', 'value' => $is_summer
                ? "Summer'26 - " . $g('organization') . "\n\n" . $g('objective')
                : $g('objective')),
            array('name' => 'email', 'value' => $g('email')),
            array('name' => 'phone', 'value' => $g('phone')),
            array('name' => 'consent', 'value' => $g('consent')),
        ),
        'context' => array(
            'pageUri' => $ref,
            'pageName' => $is_summer ? 'Offre Été 2026' : 'Demo/Contact Request',
        ),
    );
    if ($g('hubspotutk') !== '') {
        $payload['context']['hutk'] = $g('hubspotutk');
    }
    $res = hubspot_submit($payload);
    if (!$res['ok'] && $g('hubspotutk') !== '' && isset($res['text'])
        && strpos($res['text'], 'INVALID_HUTK') !== false) {
        unset($payload['context']['hutk']);
        $res = hubspot_submit($payload);
    }
    if (getenv('PROXY_TEST') === '1') {
        return json_out(array('success' => true, 'test_payload' => $payload));
    }
    if (!$res['ok'] && empty($res['skipped'])) {
        return json_out(array('success' => false, 'error' => 'HubSpot submission failed',
            'status' => isset($res['status']) ? $res['status'] : 0,
            'details' => isset($res['text']) ? $res['text'] : ''), 502);
    }
    return json_out(array('success' => true, 'fallback' => !empty($res['skipped'])));
}

function handle_job_application() {
    if (!check_throttle('jobs', 3, 60)) {
        return json_out(array('success' => false, 'error' => 'Too many requests'), 429);
    }
    $g = function ($k) {
        return isset($_POST[$k]) ? (string)$_POST[$k] : '';
    };
    if ($g('honeypot') !== '') {
        return json_out(array('success' => false, 'error' => 'Spam detected'), 400);
    }
    foreach (array('jobReference', 'jobTitle', 'firstName', 'lastName', 'email', 'message') as $f) {
        if ($g($f) === '') {
            return json_out(array('success' => false, 'error' => 'Missing required fields'), 400);
        }
    }
    $cv_url = '';
    $cv_path = null;
    $cv_name = '';
    if (isset($_FILES['cv']) && is_array($_FILES['cv']) && (int)$_FILES['cv']['error'] === UPLOAD_ERR_OK) {
        if (class_exists('finfo')) {
            $finfo = new finfo(FILEINFO_MIME_TYPE);
            $mime = $finfo->file($_FILES['cv']['tmp_name']);
        } else {
            $mime = isset($_FILES['cv']['type']) ? $_FILES['cv']['type'] : '';
        }
        if ($mime !== 'application/pdf') {
            return json_out(array('success' => false, 'error' => 'Only PDF files are allowed'), 400);
        }
        if ((int)$_FILES['cv']['size'] > MAX_CV_SIZE) {
            return json_out(array('success' => false, 'error' => 'File too large. Max 5MB'), 400);
        }
        $cv_name = sanitize_filename(pathinfo($g('lastName'), PATHINFO_FILENAME) . '')
            . '-' . sanitize_filename($g('firstName')) . '-cv.pdf';
        $cv_name = preg_replace('/-+/', '-', $cv_name);
        $dir = __DIR__ . '/cvs';
        if (!is_dir($dir)) @mkdir($dir, 0755, true);
        $cv_path = $dir . '/' . basename($cv_name);
        if (!@move_uploaded_file($_FILES['cv']['tmp_name'], $cv_path)) {
            return json_out(array('success' => false, 'error' => 'Upload failed'), 500);
        }
        $cv_url = public_base() . '/cvs/' . rawurlencode(basename($cv_name));
    }

    // Email with CV attached (pièce jointe).
    $lines = array(
        'Nouvelle candidature : ' . $g('jobTitle') . ' (' . $g('jobReference') . ')',
        'Nom: ' . $g('firstName') . ' ' . $g('lastName'),
        'Email: ' . $g('email'),
        'Téléphone: ' . ($g('phone') !== '' ? $g('phone') : '-'),
        'LinkedIn: ' . ($g('linkedin') !== '' ? $g('linkedin') : '-'),
        'Message: ' . $g('message'),
        'CV: ' . ($cv_url !== '' ? $cv_url : '-'),
    );
    send_mail_with_cv(RECIPIENT_EMAIL,
        'Candidature ' . $g('jobTitle') . ' (' . $g('jobReference') . ') - ' . $g('firstName') . ' ' . $g('lastName'),
        $lines, $cv_path, $cv_name !== '' ? $cv_name : 'cv.pdf');
    if (getenv('PROXY_TEST') !== '1' && RECIPIENT_EMAIL === 'CHANGE-ME@example.com') {
        error_log('[proxy] RECIPIENT_EMAIL not configured - candidature email skipped in effect');
    }

    // HubSpot relay (same fields as the Node route).
    $res = hubspot_submit(array(
        'fields' => array(
            array('name' => 'firstname', 'value' => $g('firstName')),
            array('name' => 'lastname', 'value' => $g('lastName')),
            array('name' => 'email', 'value' => $g('email')),
            array('name' => 'phone', 'value' => $g('phone')),
            array('name' => 'message', 'value' => $g('message')),
            array('name' => 'jobtitle', 'value' => $g('jobTitle') . ' (' . $g('jobReference') . ')'),
            array('name' => 'company', 'value' => $g('linkedin')),
            array('name' => 'lien_cv', 'value' => $cv_url),
        ),
        'context' => array(
            'pageUri' => public_base() . '/carrieres',
            'pageName' => 'Job Application',
        ),
    ));
    if (getenv('PROXY_TEST') === '1') {
        return json_out(array('success' => true, 'test_cv_url' => $cv_url));
    }
    return json_out(array('success' => true,
        'hubspot' => !empty($res['ok']), 'cvUrl' => $cv_url));
}

// ---------------------------------------------------------------- routing

function route() {
    $method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : 'GET';
    $raw = isset($_GET['url']) ? (string)$_GET['url'] : trim((string)parse_url(isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '/', PHP_URL_PATH), '/');
    // Strip query leftovers some servers append.
    $raw = explode('?', $raw);
    $raw = $raw[0];
    $query = $_GET;
    unset($query['url']);

    if (strpos($raw, 'api/blog/posts/') === 0) {
        $slug = urldecode(substr($raw, strlen('api/blog/posts/')));
        if ($method !== 'GET') return json_out(array('error' => 'Method not allowed'), 405);
        if ($slug === '') return handle_blog_posts($query);
        return handle_blog_post_slug($slug, $query);
    }
    if ($raw === 'api/blog/posts') {
        if ($method !== 'GET') return json_out(array('error' => 'Method not allowed'), 405);
        return handle_blog_posts($query);
    }
    if (strpos($raw, 'api/jobs/') === 0) {
        $slug = urldecode(substr($raw, strlen('api/jobs/')));
        if ($method !== 'GET' || $slug === '') {
            return json_out(array('error' => $slug === '' ? 'Not found' : 'Method not allowed'), $slug === '' ? 404 : 405);
        }
        return handle_job_slug($slug, $query);
    }
    if ($raw === 'api/demo' || $raw === 'api/demo/') {
        if ($method !== 'PUT' && $method !== 'POST') {
            return json_out(array('error' => 'Method not allowed'), 405);
        }
        $ct = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';
        if (stripos($ct, 'application/json') !== false) {
            $input = json_decode(file_get_contents('php://input'), true);
            if (!is_array($input)) {
                return json_out(array('success' => false, 'error' => 'Invalid request'), 400);
            }
        } else {
            $input = $_POST;
        }
        return handle_demo($input);
    }
    if ($raw === 'api/job-applications' || $raw === 'api/job-applications/') {
        if ($method !== 'POST') {
            return json_out(array('error' => 'Method not allowed'), 405);
        }
        return handle_job_application();
    }
    return json_out(array('error' => 'Not found'), 404);
}

// CLI self-check entry (no network): PROXY_TEST=1 php proxy.php
if (php_sapi_name() === 'cli') {
    if (getenv('PROXY_TEST') === '1') {
        $fails = 0;
        $check = function ($label, $cond) use (&$fails) {
            echo ($cond ? 'ok' : 'FAIL') . ' - ' . $label . "\n";
            if (!$cond) $fails++;
        };
        $check('norm_cat plural', norm_cat('Partenariats') === 'partenariat');
        $check('norm_cat trim', norm_cat(' IA ') === 'ia');
        $check('sanitize', sanitize_filename("Duponté Paris!") === 'duponte-paris');
        $check('snapshot dir constant', is_string(SNAP_DIR));
        exit($fails > 0 ? 1 : 0);
    }
    fwrite(STDERR, "proxy.php is an HTTP endpoint (set PROXY_TEST=1 for self-check)\n");
    exit(2);
}

route();
