import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

// null (ainda verificando) conta como online; a requisição com timeout cobre o resto.
export function useOnline() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const cancelar = NetInfo.addEventListener(e => {
      setOnline(!!e.isConnected && e.isInternetReachable !== false);
    });
    return cancelar;
  }, []);
  return online;
}
