# Formulaire de contact : installation sur le VPS

`contact-envoi.php` reçoit le formulaire (`/contact/envoi.php`) et envoie le message à Sophie par le SMTP de Brevo
(même compte que le forum mxforum.64k.be). Il est publié avec le site (rsync) : une mise à jour du script part avec le
déploiement. Les identifiants, eux, ne sont **jamais dans le dépôt** : ils sont dans `/etc/sophie/contact.ini`,
hors du dossier du site (rsync `--delete` n'y touche pas).

## Une seule fois, sur le VPS (`ssh ubuntu@etf.64k.be`) — fait le 2026-10-24

1. Réglages SMTP (modèle : `contact.ini.exemple`) :

   ```sh
   sudo mkdir -p /etc/sophie
   sudo nano /etc/sophie/contact.ini      # coller le modèle, remplacer LOGIN_SMTP_BREVO et CLE_SMTP_BREVO
   sudo chown root:www-data /etc/sophie/contact.ini && sudo chmod 640 /etc/sophie/contact.ini
   ```

2. Nginx : dans les blocs `server` de **sophielenaerts.be** et de **dev.sophielenaerts.be**
   (`/etc/nginx/sites-available/…`), ajouter :

   ```nginx
   location = /contact/envoi.php {
       include snippets/fastcgi-php.conf;
       fastcgi_pass unix:/run/php/php8.3-fpm.sock;    # le socket du PHP-FPM par défaut ; `ls /run/php/`
       fastcgi_param SCRIPT_FILENAME $document_root/contact/envoi.php;
   }
   location ~ \.php$ { return 404; }                  # aucun autre script PHP n'est exécuté
   ```

   puis `sudo nginx -t && sudo systemctl reload nginx`.

3. Test (depuis le VPS ou le Mac) :

   ```sh
   curl -i -H "Accept: application/json" \
     -d "nom=Test&email=toi@example.org&message=Essai" https://dev.sophielenaerts.be/contact/envoi.php
   ```

   Réponse attendue : `{"ok":true,…}` et un e-mail chez lenaerts.sophie@gmail.com (vérifier aussi les indésirables).
   En cas d'erreur : `sudo tail /var/log/nginx/error.log /var/log/php8.3-fpm.log`.

## Comportement

- Champ piège `site_web` (invisible) : rempli → faux succès, rien n'est envoyé.
- Limite : 5 messages par heure et par adresse IP.
- « Répondre » dans Gmail répond à la personne qui a écrit (en-tête `Reply-To`).
- Brevo : domaine `sophielenaerts.be` authentifié (TXT `brevo-code`, DKIM `brevo1`/`brevo2`, DMARC). Clé SMTP : Brevo →
  SMTP et API → Clés SMTP. Elle expire après 90 jours sans utilisation : la régénérer et mettre à jour le fichier.
