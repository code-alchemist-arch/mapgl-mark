import React, { useState, useEffect } from 'react';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { collection, query } from 'firebase/firestore';
import getBrowserLanguage from '@/utils/i18n.js';

export default function useTranslations() {
  const [parsedTranslations, setParsedTranslations] = useState(null);

  const firestore = useFirestore();

  const translationsCol = collection(firestore, 'translations');
  const translationsQuery = query(translationsCol);
  const { status: translationsStatus, data: translations } =
    useFirestoreCollectionData(translationsQuery, {
      idField: 'id',
    });

  useEffect(() => {
    const lang = getBrowserLanguage();
    const scopedTranslations = translations?.reduce(
      (resObj, translationItr) => {
        resObj[translationItr.key] =
          translationItr?.text?.[lang] || translationItr?.text?.de;
        return resObj;
      },
      {},
    );
    setParsedTranslations(scopedTranslations);
  }, [setParsedTranslations, translations]);

  return [parsedTranslations, translationsStatus];
}
