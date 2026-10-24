<?php
// Réception du formulaire de contact de sophielogo.be : envoie le message à Sophie par le SMTP de Brevo.
// Publié sur /contact/envoi.php (voir .eleventy.js). Les identifiants SMTP sont dans /etc/sophie/contact.ini,
// hors du site et hors du dépôt (modèle : serveur/contact.ini.exemple).
declare(strict_types=1);

const MAX_PAR_HEURE = 5;

function reponse(bool $ok, string $message, int $code = 200): never
{
    $json = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');
    if ($json) {
        http_response_code($ok ? 200 : $code);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_UNICODE);
    } elseif ($ok) {
        header('Location: /contact/merci/', true, 303);
    } else {
        http_response_code($code);
        header('Content-Type: text/html; charset=utf-8');
        $texte = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
        echo "<!doctype html><html lang=\"fr-BE\"><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width\">"
            . "<title>Message non envoyé</title><body style=\"font:18px/1.6 sans-serif;max-width:36rem;margin:3rem auto;padding:0 1rem\">"
            . "<h1>Message non envoyé</h1><p>$texte</p><p><a href=\"/contact/\">Retour au formulaire</a></p></body></html>";
    }
    exit;
}

function nettoyer(string $valeur): string
{
    // Retire les caractères de contrôle (dont les retours à la ligne : pas d'injection d'en-têtes)
    return trim((string) preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $valeur));
}

function entete_utf8(string $texte): string
{
    return '=?UTF-8?B?' . base64_encode($texte) . '?=';
}

function smtp_envoyer(array $c, string $de, string $a, string $donnees): void
{
    $flux = @stream_socket_client("tcp://{$c['smtp_host']}:{$c['smtp_port']}", $errno, $erreur, 10);
    if (!$flux) {
        throw new RuntimeException("connexion SMTP impossible : $erreur");
    }
    stream_set_timeout($flux, 15);
    $lire = function () use ($flux): string {
        $reponse = '';
        while (($ligne = fgets($flux, 1024)) !== false) {
            $reponse .= $ligne;
            if (strlen($ligne) < 4 || $ligne[3] === ' ') {
                break;
            }
        }
        return $reponse;
    };
    $dialoguer = function (string $commande, string $attendu) use ($flux, $lire): string {
        if ($commande !== '') {
            fwrite($flux, $commande . "\r\n");
        }
        $reponse = $lire();
        if (!str_starts_with($reponse, $attendu)) {
            throw new RuntimeException('SMTP : ' . trim($reponse));
        }
        return $reponse;
    };

    $dialoguer('', '220');
    $dialoguer('EHLO sophielogo.be', '250');
    if (($c['starttls'] ?? '1') !== '0') {
        $dialoguer('STARTTLS', '220');
        if (!stream_socket_enable_crypto($flux, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            throw new RuntimeException('SMTP : échec du chiffrement TLS');
        }
        $dialoguer('EHLO sophielogo.be', '250');
    }
    $dialoguer('AUTH LOGIN', '334');
    $dialoguer(base64_encode($c['smtp_user']), '334');
    $dialoguer(base64_encode($c['smtp_key']), '235');
    $dialoguer("MAIL FROM:<$de>", '250');
    $dialoguer("RCPT TO:<$a>", '25');
    $dialoguer('DATA', '354');
    fwrite($flux, $donnees . "\r\n.\r\n");
    $reponse = $lire();
    if (!str_starts_with($reponse, '250')) {
        throw new RuntimeException('SMTP : ' . trim($reponse));
    }
    fwrite($flux, "QUIT\r\n");
    fclose($flux);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    reponse(false, 'Ce formulaire s\'utilise depuis la page de contact.', 405);
}

// Champ piège : les robots le remplissent, pas les visiteurs. On fait semblant que tout s'est bien passé.
if (nettoyer((string) ($_POST['site_web'] ?? '')) !== '') {
    reponse(true, 'Merci, votre message est bien parti.');
}

$nom = nettoyer((string) ($_POST['nom'] ?? ''));
$email = nettoyer((string) ($_POST['email'] ?? ''));
$telephone = nettoyer((string) ($_POST['telephone'] ?? ''));
$message = trim(str_replace("\r\n", "\n", (string) ($_POST['message'] ?? '')));
$message = (string) preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $message);

if ($nom === '' || mb_strlen($nom) > 100) {
    reponse(false, 'Merci d\'indiquer votre nom.', 422);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254) {
    reponse(false, 'L\'adresse e-mail ne semble pas valide.', 422);
}
if (mb_strlen($telephone) > 40) {
    reponse(false, 'Le numéro de téléphone est trop long.', 422);
}
if ($message === '' || mb_strlen($message) > 5000) {
    reponse(false, 'Merci d\'écrire un message (5 000 caractères au maximum).', 422);
}

// Limite par adresse IP : MAX_PAR_HEURE messages par heure
$fichier = sys_get_temp_dir() . '/sophie-contact-' . md5($_SERVER['REMOTE_ADDR'] ?? '?') . '.json';
$envois = is_file($fichier) ? (json_decode((string) file_get_contents($fichier), true) ?: []) : [];
$envois = array_values(array_filter($envois, fn ($t) => $t > time() - 3600));
if (count($envois) >= MAX_PAR_HEURE) {
    reponse(false, 'Vous avez envoyé plusieurs messages à la suite. Réessayez dans une heure, ou appelez directement.', 429);
}

$config = @parse_ini_file(getenv('SOPHIE_CONTACT_CONFIG') ?: '/etc/sophie/contact.ini');
foreach (['smtp_host', 'smtp_port', 'smtp_user', 'smtp_key', 'from', 'to'] as $cle) {
    if (!$config || empty($config[$cle])) {
        error_log("contact : réglage manquant ($cle)");
        reponse(false, 'Le message n\'a pas pu être envoyé pour l\'instant. Merci d\'appeler ou d\'écrire directement.', 500);
    }
}

$corps = "Nouveau message depuis sophielogo.be\n\n"
    . "Nom : $nom\n"
    . "E-mail : $email\n"
    . ($telephone !== '' ? "Téléphone : $telephone\n" : '')
    . "\nMessage :\n$message\n";

$domaine = substr(strrchr($config['from'], '@') ?: '@sophielogo.be', 1);
$entetes = [
    'Date: ' . date('r'),
    'From: ' . entete_utf8($config['from_name'] ?? 'Site de Sophie Lenaerts') . " <{$config['from']}>",
    "To: <{$config['to']}>",
    'Reply-To: ' . entete_utf8($nom) . " <$email>",
    'Subject: ' . entete_utf8("Message de $nom (sophielogo.be)"),
    'Message-ID: <' . bin2hex(random_bytes(12)) . "@$domaine>",
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
];
$donnees = implode("\r\n", $entetes) . "\r\n\r\n" . chunk_split(base64_encode($corps), 76, "\r\n");

try {
    smtp_envoyer($config, $config['from'], $config['to'], $donnees);
} catch (Throwable $e) {
    error_log('contact : ' . $e->getMessage());
    reponse(false, 'Le message n\'a pas pu être envoyé pour l\'instant. Merci d\'appeler ou d\'écrire directement.', 502);
}

$envois[] = time();
@file_put_contents($fichier, json_encode($envois), LOCK_EX);
reponse(true, 'Merci, votre message est bien parti. Je vous répondrai dès que possible.');
