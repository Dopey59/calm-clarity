import { Layout } from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export default function DMCAPage() {
  return (
    <Layout>
      <Helmet>
        <title>DMCA - Politique de droits d'auteur - CalmeClair</title>
        <meta name="description" content="Procédure DMCA de CalmeClair. Comment signaler une violation de droits d'auteur sur notre site." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="container-content py-12">
        <article className="prose prose-lg max-w-3xl mx-auto">
          <h1>Politique DMCA et Droits d'Auteur</h1>
          <p className="text-muted-foreground">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>

          <section>
            <h2>1. Engagement de CalmeClair</h2>
            <p>
              CalmeClair respecte les droits de propriété intellectuelle d'autrui et attend de ses 
              utilisateurs qu'ils fassent de même. Conformément au Digital Millennium Copyright Act 
              (DMCA) et aux lois françaises et européennes sur le droit d'auteur, nous répondrons 
              rapidement aux notifications de violation présumée du droit d'auteur.
            </p>
          </section>

          <section>
            <h2>2. Procédure de notification</h2>
            <p>
              Si vous pensez qu'un contenu publié sur notre site viole vos droits d'auteur, 
              veuillez nous envoyer une notification écrite contenant les informations suivantes :
            </p>

            <div className="bg-muted/50 p-6 rounded-lg my-6 not-prose">
              <h3 className="font-semibold text-lg mb-4">Éléments requis pour une notification DMCA</h3>
              <ol className="list-decimal list-inside space-y-3 text-sm">
                <li>
                  <strong>Identification de l'œuvre protégée</strong> - Une description de l'œuvre 
                  protégée par le droit d'auteur dont vous affirmez qu'elle a été violée.
                </li>
                <li>
                  <strong>Localisation du contenu</strong> - L'URL ou autre identification spécifique 
                  du matériel que vous prétendez être en infraction sur notre site.
                </li>
                <li>
                  <strong>Vos coordonnées</strong> - Votre nom, adresse postale, numéro de téléphone 
                  et adresse email.
                </li>
                <li>
                  <strong>Déclaration de bonne foi</strong> - Une déclaration selon laquelle vous 
                  croyez de bonne foi que l'utilisation contestée n'est pas autorisée par le 
                  titulaire du droit d'auteur, son agent ou la loi.
                </li>
                <li>
                  <strong>Déclaration d'exactitude</strong> - Une déclaration, faite sous peine de 
                  parjure, que les informations contenues dans votre notification sont exactes et 
                  que vous êtes le titulaire du droit d'auteur ou êtes autorisé à agir au nom du 
                  titulaire.
                </li>
                <li>
                  <strong>Signature</strong> - Votre signature physique ou électronique.
                </li>
              </ol>
            </div>
          </section>

          <section>
            <h2>3. Envoi de la notification</h2>
            <p>
              Envoyez votre notification DMCA à notre agent désigné :
            </p>
            <div className="bg-card border border-border p-6 rounded-lg my-6 not-prose">
              <p className="font-semibold mb-2">Agent DMCA - CalmeClair</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>Email : <a href="mailto:dmca@calmeclair.com" className="text-primary hover:underline">dmca@calmeclair.com</a></li>
                <li>Objet : "Notification DMCA"</li>
              </ul>
            </div>

            <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg my-6 not-prose">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-destructive">Avertissement</p>
                <p className="text-muted-foreground mt-1">
                  En vertu de la loi, toute fausse déclaration intentionnelle dans une notification 
                  DMCA peut entraîner des sanctions civiles, y compris des dommages-intérêts et des 
                  frais d'avocat.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2>4. Contre-notification</h2>
            <p>
              Si vous pensez que votre contenu a été retiré par erreur ou suite à une mauvaise 
              identification, vous pouvez soumettre une contre-notification contenant :
            </p>
            <ul>
              <li>Votre signature physique ou électronique</li>
              <li>Identification du contenu retiré et son emplacement avant le retrait</li>
              <li>Une déclaration sous peine de parjure que vous croyez de bonne foi que le contenu 
                  a été retiré par erreur</li>
              <li>Votre nom, adresse et numéro de téléphone</li>
              <li>Une déclaration selon laquelle vous consentez à la juridiction du tribunal 
                  compétent de votre lieu de résidence</li>
            </ul>
          </section>

          <section>
            <h2>5. Procédure de traitement</h2>
            <p>
              Après réception d'une notification DMCA valide :
            </p>
            <ol>
              <li>Nous retirerons ou désactiverons l'accès au contenu présumé en infraction dans 
                  les plus brefs délais</li>
              <li>Nous notifierons l'utilisateur concerné (si applicable) du retrait</li>
              <li>Si une contre-notification valide est reçue, nous pourrons restaurer le contenu 
                  après un délai de 10 à 14 jours ouvrables, sauf si le plaignant nous informe 
                  qu'il a engagé une action en justice</li>
            </ol>
          </section>

          <section>
            <h2>6. Politique de récidive</h2>
            <p>
              CalmeClair se réserve le droit de supprimer tout contenu et de résilier l'accès des 
              utilisateurs qui violent de manière répétée les droits d'auteur de tiers.
            </p>
          </section>

          <section>
            <h2>7. Droit applicable</h2>
            <p>
              Cette politique DMCA est régie par les lois françaises et européennes sur le droit 
              d'auteur, notamment :
            </p>
            <ul>
              <li>Le Code de la Propriété Intellectuelle français</li>
              <li>La Directive européenne 2019/790 sur le droit d'auteur</li>
              <li>Le Digital Millennium Copyright Act (DMCA) pour les demandes internationales</li>
            </ul>
          </section>

          <section>
            <h2>8. Contact</h2>
            <p>
              Pour toute question concernant cette politique ou les droits d'auteur :
            </p>
            <ul>
              <li>Email DMCA : <a href="mailto:dmca@calmeclair.com">dmca@calmeclair.com</a></li>
              <li>Contact général : <Link to="/contact">Formulaire de contact</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </Layout>
  );
}
