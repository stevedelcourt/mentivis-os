<?php
// Contact, demande de démo, déverrouillage de PDF, offre été : envoi au formulaire HubSpot.
// Reprend la logique de l'ancienne route Node app/api/demo/route.ts.
declare(strict_types=1);
require __DIR__ . '/_lib.php';

mv_guard(5);
$in = mv_input();

if (mv_str($in, 'honeypot') !== '') {
    mv_json(400, ['success' => false, 'error' => 'Spam detected']);
}

$firstname = mv_str($in, 'firstname', 100);
$lastname = mv_str($in, 'lastname', 100);
$email = mv_str($in, 'email', 254);
$organization = mv_str($in, 'organization', 200);
$role = mv_str($in, 'role', 200);
$objective = mv_str($in, 'objective', 5000);
$phone = mv_str($in, 'phone', 50);
$consent = mv_str($in, 'consent', 10);
$formContext = mv_str($in, 'formContext', 100);
$subject = mv_str($in, 'subject', 200);
$hutk = mv_str($in, 'hubspotutk', 100);

if ($firstname === '' || $lastname === '' || $email === '') {
    mv_json(400, ['success' => false, 'error' => 'Missing required fields']);
}
if (!mv_valid_email($email)) {
    mv_json(400, ['success' => false, 'error' => 'Invalid email']);
}

$isSummer = $formContext === 'summer26';
$message = $objective;
if ($isSummer) {
    $message = "Summer'26 - " . $organization . "\n\n" . $objective;
} elseif ($subject !== '') {
    $message = '[' . $subject . "]\n\n" . $objective;
} elseif ($formContext !== '' && $objective === '') {
    // Déverrouillage de PDF : le contexte indique le document demandé.
    $message = 'PDF : ' . $formContext;
}

[$ok] = mv_hubspot_submit(
    [
        'firstname' => $firstname,
        'lastname' => $lastname,
        'company' => $organization,
        'jobtitle' => $role,
        'message' => $message,
        'email' => $email,
        'phone' => $phone,
        'consent' => $consent,
    ],
    [
        'pageUri' => mv_page_uri(mv_str($in, 'pageUri', 500), '/fr/demo/'),
        'pageName' => $isSummer ? 'Offre Été 2026' : 'Demo/Contact Request',
        'hutk' => $hutk,
    ]
);

if (!$ok) {
    mv_json(502, ['success' => false, 'error' => 'Submission failed']);
}
mv_json(200, ['success' => true]);
