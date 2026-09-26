<?php
// Candidature (multipart) : CV en PDF téléversé dans HubSpot Files (privé),
// soumission du formulaire HubSpot, puis lien du CV enregistré sur le contact.
// Aucun CV n'est conservé sur le serveur. Reprend app/api/job-applications/route.ts.
declare(strict_types=1);
require __DIR__ . '/_lib.php';

const MAX_CV_BYTES = 6 * 1024 * 1024;

mv_guard(3);
$in = $_POST;

// Corps plus gros que post_max_size : PHP vide $_POST et $_FILES.
if ($in === [] && (int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) {
    mv_json(413, ['success' => false, 'error' => 'File too large. Max 6MB']);
}

if (mv_str($in, 'honeypot') !== '') {
    mv_json(400, ['success' => false, 'error' => 'Spam detected']);
}

$jobReference = mv_str($in, 'jobReference', 50);
$jobTitle = mv_str($in, 'jobTitle', 200);
$firstName = mv_str($in, 'firstName', 100);
$lastName = mv_str($in, 'lastName', 100);
$email = mv_str($in, 'email', 254);
$phone = mv_str($in, 'phone', 50);
$linkedin = mv_str($in, 'linkedin', 300);
$message = mv_str($in, 'message', 5000);

if ($jobReference === '' || $jobTitle === '' || $firstName === '' || $lastName === '' || $email === '' || $message === '') {
    mv_json(400, ['success' => false, 'error' => 'Missing required fields']);
}
if (!mv_valid_email($email)) {
    mv_json(400, ['success' => false, 'error' => 'Invalid email']);
}

$cfg = mv_config();
$token = $cfg['HUBSPOT_ACCESS_TOKEN'] ?? '';
$cvUrl = '';

// CV facultatif : PDF uniquement, 6 Mo maximum, vérifié par sa signature.
if (isset($_FILES['cv']) && ($_FILES['cv']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
    $file = $_FILES['cv'];
    if (in_array($file['error'], [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true)) {
        mv_json(413, ['success' => false, 'error' => 'File too large. Max 6MB']);
    }
    if ($file['error'] !== UPLOAD_ERR_OK) {
        mv_json(400, ['success' => false, 'error' => 'Upload failed']);
    }
    if ($file['size'] > MAX_CV_BYTES) {
        mv_json(400, ['success' => false, 'error' => 'File too large. Max 6MB']);
    }
    $head = (string) file_get_contents($file['tmp_name'], false, null, 0, 5);
    if ($head !== '%PDF-') {
        mv_json(400, ['success' => false, 'error' => 'Only PDF files are allowed']);
    }

    if ($token !== '') {
        $slug = fn(string $s) => strtolower(trim((string) preg_replace('/[^A-Za-z0-9]+/', '-', iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $s) ?: $s), '-'));
        $fileName = $slug($lastName) . '-' . $slug($firstName) . '-cv-' . date('Ymd-His') . '.pdf';
        $body = [
            'file' => new CURLFile($file['tmp_name'], 'application/pdf', $fileName),
            'options' => json_encode(['access' => 'PRIVATE', 'overwrite' => false]),
            'folderPath' => '/cvs',
            'fileName' => $fileName,
        ];
        [$status, $resp] = mv_http('POST', mv_hubspot_api_base() . '/files/v3/files', ['Authorization: Bearer ' . $token], $body);
        if ($status >= 200 && $status < 300) {
            $data = json_decode($resp, true);
            $cvUrl = is_array($data) ? (string) ($data['url'] ?? '') : '';
        } else {
            error_log('[forms] HubSpot Files error ' . $status . ': ' . substr($resp, 0, 500));
        }
    }
    @unlink($file['tmp_name']);
}

[$ok] = mv_hubspot_submit(
    [
        'firstname' => $firstName,
        'lastname' => $lastName,
        'email' => $email,
        'phone' => $phone,
        'message' => $message,
        'jobtitle' => $jobTitle . ' (' . $jobReference . ')',
        'company' => $linkedin,
        'lien_cv' => $cvUrl,
    ],
    [
        'pageUri' => mv_page_uri(mv_str($in, 'pageUri', 500), '/fr/carrieres/'),
        'pageName' => 'Job Application',
    ]
);

// Garantit le lien du CV sur la fiche contact (la propriété peut être ignorée par le formulaire).
if ($ok && $cvUrl !== '' && $token !== '') {
    $auth = ['Authorization: Bearer ' . $token, 'Content-Type: application/json'];
    $api = mv_hubspot_api_base() . '/crm/v3/objects/contacts/';
    [$status, $resp] = mv_http('GET', $api . rawurlencode($email) . '?idProperty=email&properties=lien_cv', $auth, null);
    $contact = $status === 200 ? json_decode($resp, true) : null;
    if (is_array($contact) && !empty($contact['id'])) {
        mv_http('PATCH', $api . rawurlencode((string) $contact['id']), $auth, json_encode(['properties' => ['lien_cv' => $cvUrl]]));
    }
}

if (!$ok) {
    mv_json(502, ['success' => false, 'error' => 'Submission failed']);
}
mv_json(200, ['success' => true]);
