import { ErrorBoundary } from '@/components/error-boundary';
import { Providers } from '@/components/providers';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Sparkles } from 'lucide-react';
import { Route, Switch, Router as WouterRouter } from 'wouter';

const collections = [
  {
    number: '01',
    title: 'Nourish the everyday',
    label: 'NUTRITIONAL FOODS',
    copy: 'Thoughtful food for the small, steady rituals that make a day feel cared for.',
    tone: 'food',
    href: '#our-way',
  },
  {
    number: '02',
    title: 'Care, close to home',
    label: 'NATURAL HAIR CARE',
    copy: 'A gentler place in the routine for tending to your hair, your own way.',
    tone: 'hair',
    href: '#our-way',
  },
  {
    number: '03',
    title: 'Let the pot tell a story',
    label: 'AROMATIC SPICES',
    copy: 'Familiar aromas and a little inspiration for the meals gathered around.',
    tone: 'spice',
    href: '#our-way',
  },
];

function App() {
  return (
    <ErrorBoundary>
      <Providers>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <SiteHeader />
          <Switch>
            <Route path="/">
              <main className="home page-enter" data-testid="page-home">
                <section className="home-hero" aria-labelledby="hero-title">
                  <div className="hero-texture" aria-hidden="true" />
                  <div className="home-hero-copy">
                    <p className="eyebrow">A little goodness for the everyday</p>
                    <h1 id="hero-title" data-testid="text-home-headline">Life has its own <em>rhythm.</em><br />Make room for joy.</h1>
                    <p className="hero-intro">From the first thing you make in the morning to the last pot on the fire, Joyest brings thoughtful food, hair care and spices into the everyday.</p>
                    <a className="button button-dark" href="#the-joyest-way" data-testid="link-hero-story">Find your everyday rhythm <span aria-hidden="true">↓</span></a>
                    <span className="hero-caption">JOYEST ENTERPRISE <i>·</i> MADE FOR EVERYDAY LIFE IN GHANA</span>
                  </div>
                  <div className="home-hero-image">
                    <img src="/joyest-ingredient-still-life.jpg" alt="A sunlit still life of ginger, grains, spices and a woven tray" data-testid="image-home-ingredients" />
                    <div className="image-note"><Sparkles className="note-flower" aria-hidden="true" /><span>Rooted in the<br />rhythm of home.</span></div>
                    <span className="image-index">A GOOD DAY, IN THE MAKING&nbsp; / &nbsp;01</span>
                  </div>
                  <a className="hero-side-link" href="#our-way" data-testid="link-hero-approach">A brand for the little things that add up</a>
                </section>

                <section className="welcome-strip" aria-label="A welcome from Joyest">
                  <span className="eyebrow">Akwaaba — welcome</span>
                  <p>Some things just belong in the rhythm of a day.</p>
                  <Sparkles className="welcome-mark" aria-hidden="true" />
                </section>

                <section className="everyday section-pad" id="everyday">
                  <div className="section-heading">
                    <div><span className="eyebrow">Good things, for real life</span><h2 data-testid="text-everyday-heading">Made for the way<br />a day actually goes.</h2></div>
                    <p>Breakfast before the rush. A wash-day moment. The aroma that lets everyone know supper is close. Joyest is here for the familiar, meaningful parts of living.</p>
                  </div>
                  <div className="category-grid home-category-grid">
                    {collections.map((item) => (
                      <a className={`category-tile home-category ${item.tone}`} href={item.href} key={item.number} data-testid={`link-category-${item.number}`}>
                        <span className="category-number">{item.number}</span>
                        <div className="category-content">
                          <span>{item.label}</span>
                          <h3>{item.title}</h3>
                          <p>{item.copy}</p>
                          <b>Get to know our approach <span aria-hidden="true">↗</span></b>
                        </div>
                        <span className="category-orbit" aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </section>

                <section className="home-story" id="the-joyest-way">
                  <div className="story-photo"><img src="/joyest-ingredient-still-life.jpg" alt="Ginger, grains and whole spices gathered on a woven mat" loading="lazy" data-testid="image-joyest-story" /><span className="photo-caption">A few good things, close at hand.</span></div>
                  <div className="story-copy" id="our-way">
                    <span className="eyebrow">The Joyest way</span>
                    <h2 data-testid="text-story-heading">Everyday care<br />should feel <em>like yours.</em></h2>
                    <p>We believe the things we reach for every day deserve a little thought. What we cook with. How we care for our hair. The ingredients we keep close.</p>
                    <p>Joyest brings these everyday essentials together with a simple idea: make room for good things, and let them find their place in your routine.</p>
                    <a className="text-link" href="#our-promise" data-testid="link-story-promise">A note on what matters to us <span aria-hidden="true">↓</span></a>
                  </div>
                </section>

                <section className="home-ritual section-pad" id="rituals">
                  <div className="ritual-heading">
                    <span className="eyebrow">A day, in little moments</span>
                    <h2 data-testid="text-ritual-heading">Not a grand gesture.<br /><em>A good daily one.</em></h2>
                  </div>
                  <div className="ritual-list">
                    <article><span className="ritual-time">01 / EARLY LIGHT</span><h3>Start with what sustains.</h3><p>A nourishing bite and a breath before the day asks for your attention.</p></article>
                    <article><span className="ritual-time">02 / YOUR OWN TIME</span><h3>Make care a familiar thing.</h3><p>A moment with your hair, unhurried and on your terms.</p></article>
                    <article><span className="ritual-time">03 / WHEN THE POT IS ON</span><h3>Let the kitchen come alive.</h3><p>A pinch, a stir, a scent that makes the room feel a little more like home.</p></article>
                  </div>
                  <span className="ritual-scribble" aria-hidden="true">the good, ordinary things</span>
                </section>

                <section className="home-note" id="our-promise">
                  <div className="note-inner">
                    <span className="eyebrow">What we believe</span>
                    <blockquote data-testid="text-brand-belief">“Joy isn’t always a big occasion.<br />Sometimes it’s <em>the way a day feels.</em>”</blockquote>
                    <p>That’s why we make space for everyday essentials—approached with care, and made to belong in real life.</p>
                    <a className="button button-outline" href="#everyday" data-testid="link-promise-everyday">Explore what we’re about <span aria-hidden="true">↑</span></a>
                  </div>
                  <span className="note-side" aria-hidden="true">JOYEST · EVERYDAY, WITH CARE</span>
                </section>

                <section className="home-last">
                  <div className="last-mark" aria-hidden="true">j.</div>
                  <div><span className="eyebrow">There’s joy in the everyday</span><h2 data-testid="text-home-closing">Here’s to the good<br />things you do <em>often.</em></h2></div>
                  <a className="button button-dark" href="#everyday" data-testid="link-closing-everyday">Take a closer look <span aria-hidden="true">↗</span></a>
                </section>
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
