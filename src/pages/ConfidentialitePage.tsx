import { Layout } from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

export default function ConfidentialitePage() {
  const { openPreferences } = useCookieConsent();

  return (
    <Layout>
      <Helmet>
        <title>Politique de Confidentialité - CalmeClair</title>
        <meta name="description" content="Politique de confidentialité de CalmeClair. Découvrez comment nous collectons, utilisons et protégeons vos données personnelles." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="container-content py-12">
        <article className="prose prose-lg max-w-3xl mx-auto">
          <h1>Politique de Confidentialité</h1>
          <p className="text-muted-foreground">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>

          <p>
            La présente politique de confidentialité décrit comment <strong>CalmeClair</strong> 
            (ci-après "nous", "notre", "nos") collecte, utilise et protège les informations 
            que vous nous fournissez lorsque vous utilisez notre site web.
          </p>

          <section>
            <h2>1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement des données personnelles est :
            </p>
            <ul>
              <li><strong>CalmeClair</strong></li>
              <li>Email : contact@calmeclair.fr</li>
            </ul>
          </section>

          <section>
            <h2>2. Données collectées</h2>
            <h3>2.1 Données collectées automatiquement</h3>
            <p>Lors de votre visite sur notre site, nous pouvons collecter automatiquement :</p>
            <ul>
              <li>Adresse IP (anonymisée)</li>
              <li>Type de navigateur et version</li>
              <li>Système d'exploitation</li>
              <li>Pages visitées et durée de visite</li>
              <li>Source de trafic (moteur de recherche, lien direct, etc.)</li>
            </ul>

            <h3>2.2 Données fournies volontairement</h3>
            <p>Nous collectons les données que vous nous fournissez directement :</p>
            <ul>
              <li><strong>Newsletter :</strong> adresse email</li>
              <li><strong>Formulaire de contact :</strong> nom, email, message</li>
            </ul>
          </section>

          <section>
            <h2>3. Finalités du traitement</h2>
            <p>Vos données sont collectées pour les finalités suivantes :</p>
            <table>
              <thead>
                <tr>
                  <th>Finalité</th>
                  <th>Base légale</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Analyse d'audience et amélioration du site</td>
                  <td>Consentement (cookies analytics)</td>
                </tr>
                <tr>
                  <td>Affichage de publicités personnalisées</td>
                  <td>Consentement (cookies publicitaires)</td>
                </tr>
                <tr>
                  <td>Envoi de la newsletter</td>
                  <td>Consentement</td>
                </tr>
                <tr>
                  <td>Réponse aux demandes de contact</td>
                  <td>Intérêt légitime</td>
                </tr>
                <tr>
                  <td>Fonctionnement technique du site</td>
                  <td>Intérêt légitime</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2>4. Cookies</h2>
            <p>
              Notre site utilise des cookies pour améliorer votre expérience. Un cookie est un petit 
              fichier texte stocké sur votre appareil.
            </p>

            <h3>4.1 Types de cookies utilisés</h3>
            
            <h4>Cookies essentiels (toujours actifs)</h4>
            <p>
              Ces cookies sont nécessaires au fonctionnement du site. Ils permettent notamment 
              de mémoriser vos préférences de consentement.
            </p>
            <ul>
              <li><strong>calmeclair_cookie_consent</strong> - Stocke vos préférences cookies (durée : 13 mois)</li>
            </ul>

            <h4>Cookies analytiques (optionnels)</h4>
            <p>
              Ces cookies nous aident à comprendre comment les visiteurs interagissent avec notre site.
            </p>
            <ul>
              <li><strong>Google Analytics (_ga, _gid)</strong> - Analyse d'audience anonymisée</li>
            </ul>

            <h4>Cookies publicitaires (optionnels)</h4>
            <p>
              Ces cookies permettent d'afficher des publicités pertinentes.
            </p>
            <ul>
              <li><strong>Google AdSense</strong> - Publicités personnalisées</li>
            </ul>

            <h3>4.2 Gestion des cookies</h3>
            <p>
              Vous pouvez à tout moment modifier vos préférences de cookies en cliquant sur le bouton ci-dessous :
            </p>
            <p>
              <button 
                onClick={openPreferences}
                className="text-primary underline hover:no-underline cursor-pointer"
              >
                Gérer mes préférences cookies
              </button>
            </p>
            <p>
              Vous pouvez également configurer votre navigateur pour refuser tous les cookies ou 
              être alerté lorsqu'un cookie est envoyé. Notez que certaines fonctionnalités du site 
              peuvent ne plus fonctionner si vous désactivez les cookies.
            </p>
          </section>

          <section>
            <h2>5. Partage des données</h2>
            <p>
              Vos données personnelles ne sont jamais vendues à des tiers. Elles peuvent être 
              partagées avec :
            </p>
            <ul>
              <li><strong>Google Analytics</strong> - Pour l'analyse d'audience (si vous avez consenti)</li>
              <li><strong>Google AdSense</strong> - Pour la publicité (si vous avez consenti)</li>
              <li><strong>Notre service d'emailing</strong> - Pour l'envoi de la newsletter</li>
            </ul>
            <p>
              Ces prestataires sont soumis à des obligations de confidentialité et ne peuvent 
              utiliser vos données que pour les finalités définies.
            </p>
          </section>

          <section>
            <h2>6. Transferts hors UE</h2>
            <p>
              Certains de nos prestataires (Google) peuvent transférer vos données vers les États-Unis. 
              Ces transferts sont encadrés par des clauses contractuelles types approuvées par la 
              Commission européenne ou le EU-US Data Privacy Framework.
            </p>
          </section>

          <section>
            <h2>7. Durée de conservation</h2>
            <table>
              <thead>
                <tr>
                  <th>Données</th>
                  <th>Durée de conservation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Préférences cookies</td>
                  <td>13 mois</td>
                </tr>
                <tr>
                  <td>Données analytics</td>
                  <td>26 mois</td>
                </tr>
                <tr>
                  <td>Email newsletter</td>
                  <td>Jusqu'à désinscription + 3 ans</td>
                </tr>
                <tr>
                  <td>Messages de contact</td>
                  <td>3 ans après le dernier contact</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2>8. Vos droits</h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez 
              des droits suivants :
            </p>
            <ul>
              <li><strong>Droit d'accès :</strong> obtenir une copie de vos données personnelles</li>
              <li><strong>Droit de rectification :</strong> corriger des données inexactes</li>
              <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
              <li><strong>Droit à la limitation :</strong> limiter le traitement de vos données</li>
              <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
              <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
              <li><strong>Droit de retrait du consentement :</strong> retirer votre consentement à tout moment</li>
            </ul>
            <p>
              Pour exercer ces droits, contactez-nous à : <strong>contact@calmeclair.fr</strong>
            </p>
            <p>
              Vous disposez également du droit d'introduire une réclamation auprès de la CNIL 
              (Commission Nationale de l'Informatique et des Libertés) : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
            </p>
          </section>

          <section>
            <h2>9. Sécurité</h2>
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour 
              protéger vos données personnelles contre la destruction accidentelle ou illicite, 
              la perte, l'altération, la divulgation ou l'accès non autorisé.
            </p>
            <p>
              Notre site utilise le protocole HTTPS pour sécuriser les échanges de données.
            </p>
          </section>

          <section>
            <h2>10. Modifications</h2>
            <p>
              Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. 
              Les modifications prennent effet dès leur publication sur cette page. Nous vous encourageons 
              à consulter régulièrement cette page.
            </p>
          </section>

          <section>
            <h2>11. Contact</h2>
            <p>
              Pour toute question concernant cette politique de confidentialité ou vos données 
              personnelles, contactez-nous :
            </p>
            <ul>
              <li>Email : contact@calmeclair.fr</li>
              <li><Link to="/contact">Formulaire de contact</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </Layout>
  );
}
