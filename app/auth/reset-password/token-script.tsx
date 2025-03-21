"use client";

import { useEffect } from "react";

interface TokenScriptProps {
  storeKey?: string;
}

export default function TokenScript({ storeKey = "reset_token" }: TokenScriptProps) {
  useEffect(() => {
    console.log("\n==== TokenScript Component Mounted ====");
    console.log(`Time: ${new Date().toISOString()}`);
    console.log(`Current URL: ${window.location.href}`);

    const extractTokenFromHash = () => {
      const hash = window.location.hash;
      if (!hash) return null;

      console.log(`Hash fragment detected: ${hash}`);
      
      // Extract token using regex
      const tokenMatch = hash.match(/[?&]token=([^&]+)/);
      if (tokenMatch && tokenMatch[1]) {
        const token = decodeURIComponent(tokenMatch[1]);
        console.log(`Token extracted from hash: ${token.substring(0, 10)}...`);
        return token;
      }
      
      return null;
    };

    const extractTokenFromSearch = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get("token");
      
      if (token) {
        console.log(`Token found in URL search params: ${token.substring(0, 10)}...`);
        return token;
      }
      
      return null;
    };

    const extractTokenFromCallbackUrl = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const callbackUrl = searchParams.get("callbackUrl");
      
      if (!callbackUrl) return null;
      
      try {
        console.log(`Found callbackUrl: ${callbackUrl}`);
        const callbackUrlObj = new URL(callbackUrl);
        const token = callbackUrlObj.searchParams.get("token");
        
        if (token) {
          console.log(`Token found in callbackUrl: ${token.substring(0, 10)}...`);
          return token;
        }
        
        // Try to extract token as a text pattern
        const tokenMatch = callbackUrl.match(/[?&]token=([^&]+)/);
        if (tokenMatch && tokenMatch[1]) {
          const token = decodeURIComponent(tokenMatch[1]);
          console.log(`Token extracted from callbackUrl text: ${token.substring(0, 10)}...`);
          return token;
        }
      } catch (error) {
        console.error("Error parsing callbackUrl:", error);
      }
      
      return null;
    };

    // Function to store tokens in both localStorage and sessionStorage
    const storeToken = (token: string) => {
      try {
        sessionStorage.setItem(storeKey, token);
        localStorage.setItem(storeKey, token);
        console.log(`Token saved to sessionStorage and localStorage with key: ${storeKey}`);
        
        // Create a meta tag for the token as an additional backup
        let metaTag = document.querySelector(`meta[name="reset-token"]`);
        if (!metaTag) {
          metaTag = document.createElement('meta');
          metaTag.setAttribute('name', 'reset-token');
          document.head.appendChild(metaTag);
        }
        metaTag.setAttribute('content', token);
        console.log('Token saved to meta tag');
        
        return true;
      } catch (error) {
        console.error("Error storing token:", error);
        return false;
      }
    };

    // Try all methods to extract token
    const token = 
      extractTokenFromHash() || 
      extractTokenFromSearch() || 
      extractTokenFromCallbackUrl() || 
      sessionStorage.getItem(storeKey) || 
      localStorage.getItem(storeKey);

    if (token) {
      console.log("Token found! Storing for later use...");
      const stored = storeToken(token);
      
      // If URL has a hash, remove it to prevent accidental token exposures in logs
      if (window.location.hash && stored) {
        console.log("Cleaning URL by removing hash...");
        // Replace URL without the hash but maintain the path and search params
        window.history.replaceState(
          null, 
          '', 
          `${window.location.pathname}${window.location.search}`
        );
      }
      
      // Additionally, if the token is in URL search params, you might want to clean that too
      if (extractTokenFromSearch() && stored) {
        const cleanParams = new URLSearchParams(window.location.search);
        cleanParams.delete('token');
        const newSearch = cleanParams.toString() ? `?${cleanParams.toString()}` : '';
        
        console.log("Cleaning URL by removing token from search params...");
        window.history.replaceState(
          null, 
          '', 
          `${window.location.pathname}${newSearch}${window.location.hash}`
        );
      }
      
      // Try sending token to debug API for verification
      console.log("Sending token to debug API for verification...");
      fetch('/api/auth/debug-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })
      .then(response => response.json())
      .then(data => {
        console.log("Debug API response:", data);
      })
      .catch(error => {
        console.error("Error calling debug API:", error);
      });
      
    } else {
      console.warn("No token found by any method!");
    }
  }, [storeKey]);

  // This component doesn't render anything visible
  return null;
}
