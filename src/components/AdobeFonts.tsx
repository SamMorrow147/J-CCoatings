"use client";

import { useEffect } from 'react';

export default function AdobeFonts() {
  useEffect(() => {
    // Create and inject the first Adobe Fonts CSS link (Halcom, Proxima Nova)
    const link1 = document.createElement('link');
    link1.rel = 'stylesheet';
    link1.href = 'https://use.typekit.net/qhq4tmi.css';
    document.head.appendChild(link1);

    // Create and inject the second Adobe Fonts CSS link (Scandia Stencil)
    const link2 = document.createElement('link');
    link2.rel = 'stylesheet';
    link2.href = 'https://use.typekit.net/fju6rnv.css';
    document.head.appendChild(link2);

    // Adobe Fonts loading script for first kit
    const script1 = document.createElement('script');
    script1.innerHTML = `
      (function(d) {
        var config = {
          kitId: 'qhq4tmi',
          scriptTimeout: 3000,
          async: true
        },
        h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\\bwf-loading\\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
      })(document);
    `;
    document.head.appendChild(script1);

    // Adobe Fonts loading script for second kit
    const script2 = document.createElement('script');
    script2.innerHTML = `
      (function(d) {
        var config = {
          kitId: 'fju6rnv',
          scriptTimeout: 3000,
          async: true
        },
        h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\\bwf-loading\\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
      })(document);
    `;
    document.head.appendChild(script2);

    return () => {
      // Cleanup
      if (link1.parentNode) link1.parentNode.removeChild(link1);
      if (link2.parentNode) link2.parentNode.removeChild(link2);
      if (script1.parentNode) script1.parentNode.removeChild(script1);
      if (script2.parentNode) script2.parentNode.removeChild(script2);
    };
  }, []);

  return null;
}

