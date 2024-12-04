import type { HeadersFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { Frame } from "@shopify/polaris";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { authenticate } from "../shopify.server";

export const links = () => [
  { rel: "stylesheet", href: polarisStyles },
  { rel: "stylesheet", href: "/styles/app.css" },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return json({ apiKey: process.env.SHOPIFY_API_KEY || "" });
};

export default function App() {
  const { apiKey } = useLoaderData<typeof loader>();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <Frame>
        <div className="app-container">
          {/* Top Navigation */}
          <nav className="top-nav">
            <div className="nav-left">
              <img src="/Logo presia.png" alt="Presia" className="logo" />
              <span>by kordesc</span>
            </div>
            <div className="nav-center">
              <Link to="/app/glasses">Glasses</Link>
              <Link to="/app/contact-lenses">Contact Lenses</Link>
              <Link to="/app/settings">Settings</Link>
              <Link to="/app/plan">Plan</Link>
              <Link to="/app/resources">Resources</Link>
            </div>
            <div className="nav-right">
              <div className="store-name">Mohammad A.<br />Store Name</div>
            </div>
          </nav>

          <div className="main-content">
            {/* Left Sidebar */}
            <aside className="left-sidebar">
              <div className="master-switch">
                <div>Master Switch</div>
                <div className="switch-status">Status: Active</div>
              </div>
              <nav className="sidebar-nav">
                <Link to="/app/account">Account</Link>
                <Link to="/app/faq">FAQ</Link>
                <Link to="/app/contact">Contact</Link>
              </nav>
              <div className="sidebar-footer">
                <img src="/logo kordesc.png" alt="Kordesc" className="kordesc-logo" />
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="content">
              <Outlet />
            </main>

            {/* Right Sidebar */}
            <aside className="right-sidebar">
              <div className="quick-help">
                <h2>Quick Help</h2>
                <p>How to only collect prescriptions without custom options</p>
              </div>
            </aside>
          </div>
        </div>
      </Frame>
    </AppProvider>
  );
}

export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
