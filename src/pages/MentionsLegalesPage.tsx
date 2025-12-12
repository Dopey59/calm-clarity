import { Layout } from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';

export default function MentionsLegalesPage() {
  return (
    <Layout>
      <Helmet>
        <title>Mentions Légales - CalmeClair</title>
        <meta name="description" content="Mentions légales du site CalmeClair. Informations sur l'éditeur, l'hébergeur et les conditions d'utilisation." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="container-content py-12">
        <article className="prose prose-lg max-w-3xl mx-auto">
          <h1>Mentions Légales</h1>
          <p className="text-muted-foreground">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>

          <section>
            <h2>1. Éditeur du site</h2>
            <p>
              Le site <strong>CalmeClair</strong> (ci-après "le Site") est édité par :
            </p>
            <ul>
              <li><strong>Nom / Raison sociale :</strong> CalmeClair</li>
              <li><strong>Forme juridique :</strong> EI</li>
              <li><strong>Adresse du siège social :</strong> Lille</li>
              <li><strong>Email :</strong> contact@calmeclair.com</li>
              <li><strong>Numéro SIRET :</strong> 902 603 273</li>
              {/* <li><strong>Numéro de TVA intracommunautaire :</strong> [À compléter]</li> */}
            </ul>
          </section>

          <section>
            <h2>2. Directeur de la publication</h2>
            <p>
              Le directeur de la publication est <strong>CalmeClair</strong>.
            </p>
          </section>

          <section>
            <h2>3. Hébergement</h2>
            <p>Le Site est hébergé par : </p>
            <ul>
              <li><strong>Nom de l'hébergeur :</strong> Vercel</li>
              {/* <li><strong>Adresse :</strong> [À compléter]</li>
              <li><strong>Téléphone :</strong> [À compléter]</li> */}
            </ul>
          </section>

          <section>
            <h2>4. Propriété intellectuelle</h2>
            <p>
              L'ensemble du contenu du Site (textes, images, graphismes, logo, icônes, sons, logiciels, etc.) 
              est la propriété exclusive de CalmeClair ou de ses partenaires et est protégé par les lois 
              françaises et internationales relatives à la propriété intellectuelle.
            </p>
            <p>
              Toute reproduction, représentation, modification, publication, adaptation de tout ou partie 
              des éléments du Site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf 
              autorisation écrite préalable de CalmeClair.
            </p>
            <p>
              Toute exploitation non autorisée du Site ou de l'un quelconque des éléments qu'il contient 
              sera considérée comme constitutive d'une contrefaçon et poursuivie conformément aux 
              dispositions des articles L.335-2 et suivants du Code de Propriété Intellectuelle.
            </p>
          </section>

          <section>
            <h2>5. Crédits</h2>
            <h3>Images et illustrations</h3>
            <p>
              Les images utilisées sur ce site proviennent de :
            </p>
            <ul>
              <li>Banques d'images libres de droits (Unsplash, Pexels, IA)</li>
              <li>Créations originales de CalmeClair</li>
              <li>Illustrations sous licence appropriée</li>
            </ul>
            <h3>Icônes</h3>
            <p>
              Les icônes utilisées proviennent de la bibliothèque Lucide Icons sous licence MIT.
            </p>
          </section>

          <section>
            <h2>6. Limitation de responsabilité</h2>
            <p>
              Les informations contenues sur ce Site sont aussi précises que possible et le Site est 
              périodiquement mis à jour, mais peut toutefois contenir des inexactitudes, des omissions 
              ou des lacunes.
            </p>
            <p>
              <strong>Avertissement important :</strong> Les contenus publiés sur CalmeClair sont fournis 
              à titre informatif uniquement et ne constituent en aucun cas un avis médical, un diagnostic 
              ou un traitement. Ils ne remplacent pas une consultation avec un professionnel de santé qualifié.
            </p>
            <p>
              Si vous souffrez de troubles anxieux, de stress chronique ou de tout autre problème de santé 
              mentale, nous vous encourageons vivement à consulter un médecin, psychologue ou psychiatre.
            </p>
            <p>
              CalmeClair ne saurait être tenu responsable de tout dommage, direct ou indirect, résultant 
              de l'accès au Site ou de l'utilisation des informations qu'il contient.
            </p>
          </section>

          <section>
            <h2>7. Liens hypertextes</h2>
            <p>
              Le Site peut contenir des liens hypertextes vers d'autres sites. CalmeClair n'exerce aucun 
              contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou aux 
              éventuels dommages résultant de leur utilisation.
            </p>
          </section>

          <section>
            <h2>8. Droit applicable</h2>
            <p>
              Les présentes mentions légales sont régies par le droit français. En cas de litige, 
              les tribunaux français seront seuls compétents.
            </p>
          </section>

          <section>
            <h2>9. Contact</h2>
            <p>
              Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter :
            </p>
            <ul>
              <li>Par email : contact@calmeclair.com</li>
              <li>Via notre <a href="/contact">formulaire de contact</a></li>
            </ul>
          </section>
        </article>
      </div>
    </Layout>
  );
}
