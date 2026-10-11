import { ErrorBoundary } from '@/components/error-boundary';
import { Providers } from '@/components/providers';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Route, Switch, Router as WouterRouter } from 'wouter';

function App() {
  return (
    <ErrorBoundary>
      <Providers>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <SiteHeader />
          <Switch>
            <Route path="/">
              <main className="page-wrap">
                <p>Joyest Enterprise</p>
              </main>
            </Route>
            <Route>
              <main className="page-wrap">
                <div className="error-state">
                  <h1>Page not found</h1>
                  <a className="button button-outline" href="/">Return home</a>
                </div>
              </main>
            </Route>
          </Switch>
          <SiteFooter />
        </WouterRouter>
      </Providers>
    </ErrorBoundary>
  );
}

export default App;
