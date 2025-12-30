"use client"

import { useEffect, useRef } from "react"
import { Languages } from "lucide-react"

declare global {
  interface Window {
    google: any
    googleTranslateElementInit: () => void
  }
}

export function GoogleTranslate() {
  const googleTranslateRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let script: HTMLScriptElement | null = null

    const addGoogleTranslateScript = () => {
      if (!document.querySelector('script[src*="translate.google.com"]')) {
        script = document.createElement("script")
        script.type = "text/javascript"
        script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        script.async = true
        document.body.appendChild(script)
      }
    }

    const initGoogleTranslate = () => {
      if (window.google && window.google.translate && googleTranslateRef.current) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,hi,te,kn,ml,gu,ta,bn,mr,pa,ur,es,fr,de,it,pt,ru,ja,ko,zh,ar",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          googleTranslateRef.current
        )
      }
    }

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      setTimeout(initGoogleTranslate, 100)
    }

    // Add script if not already present
    addGoogleTranslateScript()

    // Cleanup
    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <Languages className="h-4 w-4 text-muted-foreground" />
        <div 
          ref={googleTranslateRef}
          className="google-translate-container"
        />
      </div>
      <style jsx>{`
        .goog-te-banner-frame.skiptranslate {
          display: none !important;
        }
        body {
          top: 0px !important;
        }
        .goog-te-gadget {
          font-family: inherit !important;
          font-size: inherit !important;
          color: inherit !important;
        }
        .goog-te-gadget .goog-te-combo {
          margin: 0 !important;
          padding: 4px 8px !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 6px !important;
          background: hsl(var(--background)) !important;
          color: hsl(var(--foreground)) !important;
          font-size: 14px !important;
          cursor: pointer !important;
        }
        .goog-te-gadget .goog-te-combo:focus {
          outline: 2px solid hsl(var(--ring)) !important;
          outline-offset: 2px !important;
        }
        .goog-te-gadget-simple {
          background: transparent !important;
          border: none !important;
        }
        .goog-te-gadget-simple .goog-te-menu-value span {
          color: hsl(var(--foreground)) !important;
        }
        .goog-te-gadget-simple .goog-te-menu-value:hover {
          text-decoration: none !important;
        }
        
        /* Hide the "Powered by Google" attribution */
        .goog-te-gadget .goog-te-gadget-simple .goog-te-menu-value span:first-child {
          display: none;
        }
        .goog-te-gadget-simple .goog-te-menu-value span:nth-child(3) {
          display: none;
        }
        
        /* Custom styling for the dropdown */
        .google-translate-container {
          display: flex;
          align-items: center;
        }
        
        /* Hide Google Translate top bar */
        .goog-te-banner-frame {
          display: none !important;
        }
        
        /* Prevent page jump when translating */
        body > .skiptranslate {
          display: none !important;
        }
      `}</style>
    </div>
  )
}
