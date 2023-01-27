import React, { useState, useEffect, useMemo } from 'react';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { collection, query, where } from 'firebase/firestore';

export default function useTenant() {
  const [tenant, setTenant] = useState(null);

  const firestore = useFirestore();

  const tenantId = useMemo(() => {
    // check for url param
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    if (params && params?.get('tenantId')) {
      return params.get('tenantId');
    }

    // check for subdomain
    const host = window?.location?.host;
    if (host.includes('youchoose.space')) {
      const splittedHost = host.split('.');
      if (splittedHost.length === 3) {
        return splittedHost[0];
      }
    }

    // fallback to default tenant
    return 'iss';
  }, []);

  const tenantsCol = collection(firestore, 'tenants');
  const tenantsQuery = query(tenantsCol, where('subdomain', '==', tenantId));
  const { status: tenantStatus, data: tenants } = useFirestoreCollectionData(
    tenantsQuery,
    {
      idField: 'id',
    },
  );

  useEffect(() => setTenant(tenants?.[0] || {}), [setTenant, tenants]);

  return [tenant, tenantStatus];
}
