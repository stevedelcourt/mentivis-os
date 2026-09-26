<?php
// Configuration des formulaires PHP (public_html/forms/).
// À copier en ~/mentivis-config.php sur le serveur, UN NIVEAU AU-DESSUS de public_html,
// jamais dans public_html ni dans le dépôt. Les valeurs sont celles de .env.deploy.
return [
    // Formulaire HubSpot utilisé pour démo, contact, PDF, bêta et candidatures.
    'HUBSPOT_PORTAL_ID' => '',
    'HUBSPOT_FORM_ID' => '',
    // Jeton d'application privée HubSpot (portées : files, crm.objects.contacts.read/write).
    // Sert au dépôt des CV et à la mise à jour de la propriété lien_cv.
    'HUBSPOT_ACCESS_TOKEN' => '',
    // Origines autorisées en plus de l'hôte courant (ex. préproduction).
    'ALLOWED_ORIGINS' => ['https://mentivisos.com', 'https://www.mentivisos.com'],
];
