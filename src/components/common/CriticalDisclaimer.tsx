import { AlertTriangle } from 'lucide-react';

export function CriticalDisclaimer() {
  return (
    <div className="bg-red-50 border-l-4 border-red-600 p-6 mb-8">
      <div className="flex gap-4">
        <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
        <div>
          <h3 className="text-base font-bold text-red-900 mb-2">
            ⚠️ Avertissement médical
          </h3>
          <p className="text-sm text-red-800 mb-2">
            Les informations présentées sur cette page sont fournies à titre informatif
            et éducatif uniquement. Elles ne constituent en aucun cas un avis médical,
            un diagnostic ou une recommandation thérapeutique.

            Les contenus relatifs à la santé mentale sont basés sur les connaissances
            scientifiques disponibles au moment de leur rédaction, mais ne peuvent
            remplacer une consultation auprès d’un professionnel de santé qualifié
            (médecin, psychiatre, psychologue).
          </p>
          <p className="text-sm text-red-800 font-bold">
            ⛔ Ne prenez AUCUNE décision médicale basée sur cet article. Consultez toujours
            un professionnel de santé pour toute question ou problème concernant votre
            santé mentale ou physique.
          </p>
          <p className="text-xs text-red-700 mt-2">
            En urgence: <strong>3114</strong> (prévention suicide) ou <strong>15</strong> (SAMU)
          </p>
        </div>
      </div>
    </div>
  );
}