// StyleGuide — THROWAWAY sanity-check view for T1.0 (docs/TASKS.md).
// Renders every design token and every state of the shared ui/ components so
// the palette can be eyeballed before real pages exist. Delete this file (and
// its import in App.jsx) when the real shell + routing land in T1.1.

import { useState } from 'react';
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import Input from './components/ui/Input';

const COLOR_TOKENS = [
  ['--color-bg', 'app background'],
  ['--color-surface', 'cards, sheets'],
  ['--color-primary', 'primary buttons, active nav, links'],
  ['--color-primary-hover', 'primary hover'],
  ['--color-accent', 'map markers, highlights'],
  ['--color-text', 'body text'],
  ['--color-text-muted', 'secondary text'],
  ['--color-border', 'borders, dividers'],
  ['--color-success', 'accepted / success'],
  ['--color-danger', 'declined / error'],
];

const TYPE_SCALE = [
  ['--font-size-2xl', 'Page title'],
  ['--font-size-xl', 'Section heading'],
  ['--font-size-lg', 'Card title'],
  ['--font-size-base', 'Body text'],
  ['--font-size-sm', 'Secondary text'],
  ['--font-size-xs', 'Meta / timestamps'],
];

const SPACING = ['--space-1', '--space-2', '--space-3', '--space-4', '--space-5', '--space-6', '--space-7'];

function Section({ title, children }) {
  return (
    <section style={{ display: 'grid', gap: 'var(--space-4)' }}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Row({ children }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'center' }}>
      {children}
    </div>
  );
}

export default function StyleGuide() {
  const [text, setText] = useState('');

  return (
    <main
      style={{
        maxWidth: '880px',
        margin: '0 auto',
        padding: 'var(--space-6) var(--space-4) var(--space-7)',
        display: 'grid',
        gap: 'var(--space-7)',
      }}
    >
      <header style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <h1>Campus Connect — style guide</h1>
        <p className="text-muted text-sm">
          Throwaway T1.0 check. Tokens: <code>src/styles/tokens.css</code> · Components:{' '}
          <code>src/components/ui/</code>
        </p>
      </header>

      <Section title="Colors">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 'var(--space-3)',
          }}
        >
          {COLOR_TOKENS.map(([token, use]) => (
            <Card key={token} padding="sm">
              <div
                style={{
                  height: '56px',
                  borderRadius: 'var(--radius-sm)',
                  background: `var(${token})`,
                  border: '1px solid var(--color-border)',
                  marginBottom: 'var(--space-2)',
                }}
              />
              <div className="text-sm" style={{ fontFamily: 'monospace' }}>
                {token}
              </div>
              <div className="text-muted text-xs">{use}</div>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Typography">
        <Card>
          <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
            {TYPE_SCALE.map(([token, sample]) => (
              <div
                key={token}
                style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-4)' }}
              >
                <span style={{ fontSize: `var(${token})` }}>{sample}</span>
                <span className="text-muted text-xs" style={{ fontFamily: 'monospace' }}>
                  {token}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      <Section title="Spacing scale">
        <Card>
          <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
            {SPACING.map((token) => (
              <div key={token} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div
                  style={{
                    width: `var(${token})`,
                    height: '16px',
                    background: 'var(--color-primary)',
                    borderRadius: '2px',
                  }}
                />
                <span className="text-muted text-xs" style={{ fontFamily: 'monospace' }}>
                  {token}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      <Section title="Buttons">
        <Card>
          <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
            <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
              <span className="text-muted text-xs">Variants</span>
              <Row>
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </Row>
            </div>

            <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
              <span className="text-muted text-xs">Sizes</span>
              <Row>
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </Row>
            </div>

            <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
              <span className="text-muted text-xs">Disabled (e.g. ride with 0 seats left)</span>
              <Row>
                <Button disabled>Request seat</Button>
                <Button variant="secondary" disabled>
                  Secondary
                </Button>
              </Row>
            </div>

            <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
              <span className="text-muted text-xs">Full width (forms)</span>
              <Button block size="lg">
                Log in
              </Button>
            </div>
          </div>
        </Card>
      </Section>

      <Section title="Cards">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-4)',
          }}
        >
          <Card>
            <h3>Static card</h3>
            <p className="text-muted text-sm">Default surface, medium padding.</p>
          </Card>
          <Card interactive onClick={() => {}}>
            <h3>Interactive card</h3>
            <p className="text-muted text-sm">Hover / focus me — used for feed and ride cards.</p>
          </Card>
          <Card padding="sm">
            <h3>Small padding</h3>
            <p className="text-muted text-sm">For dense lists.</p>
          </Card>
        </div>
      </Section>

      <Section title="Inputs">
        <Card>
          <div style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: '420px' }}>
            <Input label="Email" type="email" placeholder="you@university.edu" />
            <Input
              label="Department"
              placeholder="Computer Science"
              hint="Shown on your profile and post tags."
            />
            <Input
              label="Password"
              type="password"
              defaultValue="wrongpassword"
              error="Password must be at least 8 characters."
            />
            <Input
              label="Notes"
              multiline
              placeholder="Anything passengers should know…"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Input label="Email (locked in MVP)" defaultValue="you@university.edu" disabled />
          </div>
        </Card>
      </Section>

      <Section title="Status colors in context">
        <Row>
          <span
            style={{
              padding: 'var(--space-1) var(--space-3)',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--color-success-soft)',
              color: 'var(--color-success)',
              fontSize: 'var(--font-size-xs)',
            }}
          >
            accepted
          </span>
          <span
            style={{
              padding: 'var(--space-1) var(--space-3)',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--color-primary-soft)',
              color: 'var(--color-primary)',
              fontSize: 'var(--font-size-xs)',
            }}
          >
            pending
          </span>
          <span
            style={{
              padding: 'var(--space-1) var(--space-3)',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--color-danger-soft)',
              color: 'var(--color-danger)',
              fontSize: 'var(--font-size-xs)',
            }}
          >
            declined
          </span>
          <span
            style={{
              padding: 'var(--space-1) var(--space-3)',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--color-accent-soft)',
              color: 'var(--color-accent)',
              fontSize: 'var(--font-size-xs)',
            }}
          >
            accent / map marker
          </span>
        </Row>
      </Section>
    </main>
  );
}
