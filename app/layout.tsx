import { Metadata } from 'next';
import { ReactNode, Suspense } from 'react';
import clsx from 'clsx';
import { headers } from 'next/headers';

import { Providers } from '@/app/providers';
import { fontSans } from '@/lib/config/fonts';
import { NavbarProvider } from '@/lib/components/NavBarContext';
import { ErrorBoundary } from '@/lib/components/ErrorBoundary';

import '@/styles/globals.scss';
import { ReactQueryProvider } from './QueryProvider';

import { ToastProvider } from '@/lib/components/Toast/ToastContext';
import {
  DEFAULT_TENANT_ID,
  HOSTNAME_TENANT_MAP,
  TENANT_REGISTRY,
} from '@/tenants/tenantConfig';

export async function generateMetadata(): Promise<Metadata> {
  const host = headers().get('host')?.split(':')[0] ?? '';
  const tenantId =
    HOSTNAME_TENANT_MAP[host] && TENANT_REGISTRY[HOSTNAME_TENANT_MAP[host]]
      ? HOSTNAME_TENANT_MAP[host]
      : DEFAULT_TENANT_ID;
  const tenant = TENANT_REGISTRY[tenantId];

  return {
    title: tenant.name,
    description: `${tenant.name} Dashboard`,
    icons: {
      icon: tenant.favicon,
    },
  };
}

// Inline script that runs before first paint to set CSS vars from hostname.
// Prevents flash of wrong tenant colors on production domains.
const tenantBootstrap = `
(function(){
  var map={
    'merchant.indypay.in':'indypay','app.indypay.in':'indypay','dashboard.indypay.in':'indypay',
    'merchant.closexpay.com':'closexpay','app.closexpay.com':'closexpay',
    'merchant.iservu.com':'iservu','app.iservu.com':'iservu',
    'merchant.branchx.com':'branchx','app.branchx.com':'branchx',
    'merchant.rupeeflow.co':'rupeeflow','app.rupeeflow.co':'rupeeflow'
  };
  var themes={
    rupeeflow:{primary:'#00875A',secondary:'#006B4F',accent:'#2AB871',background:'#F4F8F6',surface:'#FFFFFF',text:'#3D5C4A',textMuted:'#6B8A78',border:'#D0E8DA',cta:'linear-gradient(to right,#006B4F,#00875A)'},
    indypay:{primary:'#08B6AE',secondary:'#055CF5',accent:'#3D9EFF',background:'#F5FCFB',surface:'#FFFFFF',text:'#000000',textMuted:'#525252',border:'#C5EEEB',cta:'linear-gradient(to right,#055CF5,#08B6AE)'},
    closexpay:{primary:'#E53935',secondary:'#C62828',accent:'#FF6659',background:'#FFF5F5',surface:'#FFFFFF',text:'#4A1515',textMuted:'#8C4040',border:'#FFCDD2',cta:'linear-gradient(to right,#C62828,#E53935)'},
    iservu:{primary:'#0D9488',secondary:'#0F766E',accent:'#2DD4BF',background:'#F0FDFA',surface:'#FFFFFF',text:'#134E4A',textMuted:'#4A7C76',border:'#99F6E4',cta:'linear-gradient(to right,#0F766E,#0D9488)'},
    branchx:{primary:'#6D28D9',secondary:'#5B21B6',accent:'#A78BFA',background:'#F5F3FF',surface:'#FFFFFF',text:'#2E1065',textMuted:'#6B5FA0',border:'#DDD6FE',cta:'linear-gradient(to right,#5B21B6,#6D28D9)'}
  };
  var branding={
    rupeeflow:{title:'RupeeFlow',favicon:'/RupeeFlowIcon.svg'},
    indypay:{title:'Indypay',favicon:'/logos/indypay-favicon.svg'},
    closexpay:{title:'CloseXPay',favicon:'/logos/closexpay-favicon.svg'},
    iservu:{title:'iServu',favicon:'/logos/iservu-favicon.svg'},
    branchx:{title:'BranchX',favicon:'/logos/branchx-favicon.svg'}
  };
  var host=window.location.hostname;
  var byHost=map[host];
  var isLocal=host==='localhost'||host==='127.0.0.1';
  var qp=(new URLSearchParams(window.location.search)).get('tenant');
  var byQuery=isLocal&&qp&&themes[qp]?qp:null;
  var saved=isLocal?localStorage.getItem('rf_tenant_id'):null;
  var byStorage=isLocal&&saved&&themes[saved]?saved:null;
  var id=byHost||byQuery||byStorage||'rupeeflow';
  if(isLocal&&byQuery){try{localStorage.setItem('rf_tenant_id',byQuery);}catch(e){}}
  var t=id&&themes[id];
  if(t){
    var r=document.documentElement;
    r.style.setProperty('--primary',t.primary);
    r.style.setProperty('--secondary',t.secondary);
    r.style.setProperty('--accent',t.accent);
    r.style.setProperty('--background',t.background);
    r.style.setProperty('--surface',t.surface);
    r.style.setProperty('--text',t.text);
    r.style.setProperty('--text-muted',t.textMuted);
    r.style.setProperty('--border',t.border);
    r.style.setProperty('--cta-gradient',t.cta);
  }
  var b=branding[id]||branding.rupeeflow;
  if(b){
    document.title=b.title;
    var link=document.querySelector("link[rel='icon']")||document.createElement('link');
    link.setAttribute('rel','icon');
    link.setAttribute('href',b.favicon);
    document.head.appendChild(link);
  }
})();
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        {/* Runs synchronously before first paint — eliminates flash of wrong tenant theme */}
        <script dangerouslySetInnerHTML={{ __html: tenantBootstrap }} />
      </head>
      <body
        className={clsx(
          'min-h-screen antialiased relative ',
          fontSans.variable,
          fontSans.className,
        )}
      >
        <ErrorBoundary>
          <ReactQueryProvider>
            <ToastProvider>
              <Providers
              // themeProps={{ attribute: 'class', defaultTheme: 'white' }}
              >
                <Suspense fallback={<div className="min-h-screen bg-surface-dark-deep animate-pulse" />}>
                  <NavbarProvider>{children}</NavbarProvider>
                </Suspense>
              </Providers>
            </ToastProvider>
          </ReactQueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
