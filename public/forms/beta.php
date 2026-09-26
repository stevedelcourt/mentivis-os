<?php
// Questionnaire bêta : envoi au formulaire HubSpot, réponses regroupées dans « message ».
declare(strict_types=1);
require __DIR__ . '/_lib.php';

mv_guard(5);
$in = mv_input();

if (mv_str($in, 'honeypot') !== '') {
    mv_json(400, ['success' => false, 'error' => 'Spam detected']);
}

$fullName = mv_str($in, 'fullName', 200);
$email = mv_str($in, 'email', 254);
if ($fullName === '' || $email === '') {
    mv_json(400, ['success' => false, 'error' => 'Missing required fields']);
}
if (!mv_valid_email($email)) {
    mv_json(400, ['success' => false, 'error' => 'Invalid email']);
}

$parts = preg_split('/\s+/', $fullName, 2) ?: [$fullName];
$labels = [
    'currentTools' => 'Outils actuels',
    'challenges' => 'Difficultés',
    'heardAbout' => 'Connu via',
    'features' => 'Fonctionnalités',
    'priority' => 'Priorité',
    'expectedOutcomes' => 'Résultats attendus',
    'timeline' => 'Calendrier',
    'teamSize' => "Taille de l'équipe",
    'additionalInfo' => 'Informations complémentaires',
];
$lines = ['Questionnaire bêta MentivisOS'];
foreach ($labels as $key => $label) {
    $value = mv_str($in, $key, 3000);
    if ($value !== '') $lines[] = $label . ' : ' . $value;
}

[$ok] = mv_hubspot_submit(
    [
        'firstname' => $parts[0],
        'lastname' => $parts[1] ?? '',
        'email' => $email,
        'company' => mv_str($in, 'company', 200),
        'jobtitle' => mv_str($in, 'role', 200),
        'message' => implode("\n", $lines),
        'consent' => mv_str($in, 'consent', 10),
    ],
    [
        'pageUri' => mv_page_uri(mv_str($in, 'pageUri', 500), '/fr/beta-questionnaire/'),
        'pageName' => 'Beta Questionnaire',
        'hutk' => mv_str($in, 'hubspotutk', 100),
    ]
);

if (!$ok) {
    mv_json(502, ['success' => false, 'error' => 'Submission failed']);
}
mv_json(200, ['success' => true]);
