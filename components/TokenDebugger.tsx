'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

interface TokenDebuggerProps {
  visible?: boolean;
}

interface TokenInfo {
  location: string;
  token: string;
  truncated: string;
}

export function TokenDebugger({ visible = true }: TokenDebuggerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [debugExpanded, setDebugExpanded] = useState(false);
  const [debugApiResponse, setDebugApiResponse] = useState<any>(null);

  useEffect(() => {
    const findTokens = () => {
      const foundTokens: TokenInfo[] = [];
      
      // Check URL params
      const urlToken = searchParams?.get('token');
      if (urlToken) {
        foundTokens.push({ 
          location: 'URL Query Parameter', 
          token: urlToken,
          truncated: truncateToken(urlToken)
        });
      }
      
      // Check URL hash
      const hash = window.location.hash;
      if (hash && hash.includes('token=')) {
        const hashToken = new URLSearchParams(hash.substring(1)).get('token');
        if (hashToken) {
          foundTokens.push({ 
            location: 'URL Hash Fragment', 
            token: hashToken,
            truncated: truncateToken(hashToken)
          });
        }
      }
      
      // Check localStorage
      const localToken = localStorage.getItem('reset_token');
      if (localToken) {
        foundTokens.push({ 
          location: 'Local Storage', 
          token: localToken,
          truncated: truncateToken(localToken)
        });
      }
      
      // Check sessionStorage
      const sessionToken = sessionStorage.getItem('reset_token');
      if (sessionToken) {
        foundTokens.push({ 
          location: 'Session Storage', 
          token: sessionToken,
          truncated: truncateToken(sessionToken)
        });
      }
      
      setTokens(foundTokens);
      setLoading(false);
    };
    
    findTokens();
    
    // Set up interval to periodically check for tokens
    const intervalId = setInterval(findTokens, 1000);
    
    return () => clearInterval(intervalId);
  }, [searchParams]);
  
  const truncateToken = (token: string) => {
    if (token.length <= 20) return token;
    return `${token.substring(0, 10)}...${token.substring(token.length - 10)}`;
  };
  
  const debugToken = async (token: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/auth/debug-token?token=${encodeURIComponent(token)}`);
      const data = await response.json();
      setDebugApiResponse(data);
      setDebugExpanded(true);
    } catch (error) {
      setDebugApiResponse({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  // If not visible and we have no tokens, don't render anything
  if (!visible && tokens.length === 0) return null;
  
  // If visible is false but we have tokens, render in collapsed state
  const isCollapsed = !visible && tokens.length > 0;
  
  return (
    <div 
      className="fixed bottom-0 right-0 z-50 p-4 m-4 bg-black bg-opacity-90 text-white rounded-lg shadow-lg max-w-md overflow-auto max-h-[80vh]"
      style={{ 
        transition: 'all 0.3s ease',
        transform: isCollapsed ? 'translateY(calc(100% - 40px))' : 'translateY(0)'
      }}
    >
      <div 
        className="font-mono text-sm cursor-pointer flex justify-between items-center"
        onClick={() => setDebugExpanded(!debugExpanded)}
      >
        <h3 className="font-bold">
          🔑 Token Debugger {tokens.length > 0 ? `(${tokens.length})` : ''}
        </h3>
        <button 
          className="px-2 py-1 bg-blue-700 rounded hover:bg-blue-600 text-xs ml-2"
          onClick={(e) => {
            e.stopPropagation();
            setDebugExpanded(!debugExpanded);
          }}
        >
          {debugExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {debugExpanded && (
        <div className="mt-3 font-mono text-xs">
          <div className="flex justify-between mb-2">
            <div className="text-gray-300">Path: {pathname}</div>
            <button
              className="px-2 py-1 bg-green-700 rounded hover:bg-green-600 text-xs"
              onClick={() => {
                localStorage.removeItem('reset_token');
                sessionStorage.removeItem('reset_token');
                setTokens(tokens.filter(t => 
                  t.location !== 'Local Storage' && t.location !== 'Session Storage'
                ));
              }}
            >
              Clear Storage
            </button>
          </div>
          
          {loading && <div className="text-yellow-400">Loading...</div>}
          
          {tokens.length === 0 && !loading ? (
            <div className="text-yellow-400 py-1">No tokens found</div>
          ) : (
            <div className="space-y-2">
              {tokens.map((tokenInfo, index) => (
                <div key={index} className="p-2 bg-gray-800 rounded">
                  <div className="flex justify-between">
                    <span className="text-green-400">{tokenInfo.location}:</span>
                    <button
                      className="px-2 py-0.5 bg-blue-700 rounded hover:bg-blue-600 text-xs"
                      onClick={() => debugToken(tokenInfo.token)}
                    >
                      Debug
                    </button>
                  </div>
                  <div className="text-gray-400 break-all py-1">{tokenInfo.truncated}</div>
                  <div className="flex mt-1 space-x-2">
                    <button
                      className="px-2 py-0.5 bg-purple-700 rounded hover:bg-purple-600 text-xs"
                      onClick={() => {
                        navigator.clipboard.writeText(tokenInfo.token);
                      }}
                    >
                      Copy
                    </button>
                    <button
                      className="px-2 py-0.5 bg-green-700 rounded hover:bg-green-600 text-xs"
                      onClick={() => {
                        router.push(`${pathname}?token=${encodeURIComponent(tokenInfo.token)}`);
                      }}
                    >
                      Set as URL Param
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {debugApiResponse && (
            <div className="mt-4 p-2 bg-gray-800 rounded">
              <div className="text-green-400 font-bold">Debug API Response:</div>
              <pre className="text-gray-300 overflow-auto max-h-60 text-xs mt-1">
                {JSON.stringify(debugApiResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TokenDebugger;
